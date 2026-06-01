// Диагностика — три инструмента входной диагностики курса
// ДТМ (тест 3 блока × 2 задания), КПН (карта наблюдения), ОПМ (опросник мотивации)

const { useState: dS, useMemo: dM, useEffect: dE } = React;

// ════════════════════════════════════════════════════════════════════
// ПЕЧАТЬ — стили для A4 (применяются только когда открыт инструмент)
// ════════════════════════════════════════════════════════════════════

const PRINT_CSS = `
@media print {
  @page { size: A4 portrait; margin: 12mm 14mm; }
  @page diag-landscape { size: A4 landscape; margin: 10mm 12mm; }
  .diag-landscape { page: diag-landscape; }
  .diag-landscape table { min-width: 0 !important; width: 100% !important; font-size: 9pt !important; }
  .diag-landscape th, .diag-landscape td { padding: 3pt 4pt !important; }
  html, body { background: #fff !important; }
  body { font-size: 10.5pt; }
  /* Скрываем интерфейсные элементы */
  .mmm-topbar, .mmm-role-toggle, .mmm-tweaks-toggle,
  [data-no-print], .mmm-nav, .mmm-brand { display: none !important; }
  /* Карточки — плоские, без теней */
  .mmm-card {
    background: #fff !important;
    box-shadow: none !important;
    border: 1px solid #ccc !important;
    border-radius: 4px !important;
    padding: 10px 14px !important;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  /* Сокращаем размеры текстов */
  .mmm-h1 { font-size: 18pt !important; margin: 0 0 4pt !important; }
  .mmm-h2 { font-size: 14pt !important; margin: 0 0 4pt !important; }
  .mmm-h3 { font-size: 12pt !important; margin: 0 0 3pt !important; }
  .mmm-eyebrow { font-size: 8pt !important; }
  .mmm-lead, .mmm-body { font-size: 10pt !important; line-height: 1.35 !important; }
  /* Поля ввода — белые с тонкой рамкой */
  .diag-print input, .diag-print textarea {
    background: #fff !important;
    border: 1px solid #aaa !important;
    border-radius: 2px !important;
    font-size: 10pt !important;
    color: #000 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .diag-print textarea { min-height: 60pt; resize: none !important; }
  /* Таблицы */
  .diag-print table { font-size: 9.5pt !important; page-break-inside: auto; }
  .diag-print th, .diag-print td { padding: 3pt 5pt !important; }
  /* Кнопки оценивания печатаются как маленькие кружки */
  .diag-print button[aria-label],
  .diag-print .score-btn {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  /* Цвета сохраняем */
  .diag-print * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  /* Блоки ДТМ — каждый на своей странице */
  .diag-block { page-break-inside: avoid; break-inside: avoid; }
  .diag-pagebreak { page-break-before: always; break-before: page; }
  /* Скрываем хлебные крошки, переключатели формы, кнопку печати */
  .diag-toolbar { display: none !important; }
  /* Скрываем "Заполнено N из 10" и динамические подсказки */
  .diag-no-print { display: none !important; }
}
`;

function usePrintStyles() {
  dE(() => {
    if (document.getElementById('diag-print-styles')) return;
    const s = document.createElement('style');
    s.id = 'diag-print-styles';
    s.textContent = PRINT_CSS;
    document.head.appendChild(s);
    return () => { /* keep around, harmless */ };
  }, []);
}

// ════════════════════════════════════════════════════════════════════
// ДАННЫЕ
// ════════════════════════════════════════════════════════════════════

const DTM_BLOCKS = {
  '1-2': [
    {
      n: 1, comp: 'K1', title: 'Блок 1', sub: 'логико-аналитический',
      a: {
        text: 'В корзине яблоки и груши. Яблок на 3 больше, чем груш. Всего 11 фруктов. Сколько яблок?',
        prompt: 'Ответ и решение',
      },
      b: {
        text: 'Докажи, что других пар (груши, яблоки) с такими условиями нет.',
        prompt: 'Объяснение',
        compB: 'K4',
      },
      key: {
        a: '7 яблок и 4 груши. Полное обоснование: «4+7=11 и 7−4=3; других пар нет, так как при 5+8=13, при 3+6=9 — не подходит».',
        b: 'Перебор остальных пар (груши, яблоки) и объяснение, почему ни одна не удовлетворяет обоим условиям.',
      },
    },
    {
      n: 2, comp: 'K2', title: 'Блок 2', sub: 'комбинаторно-стратегический',
      a: {
        text: 'У Лёвы 3 цвета карандашей: красный, синий, зелёный. Сколькими способами он может выбрать 2 разных карандаша?',
        prompt: 'Ответ и решение',
      },
      b: {
        text: 'Докажи, что ты нашёл все пары.',
        prompt: 'Объяснение',
        compB: 'K4',
      },
      key: {
        a: '3 способа. Полное обоснование: «КС, КЗ, СЗ — все возможные пары; (С, К) и (К, С) считаются одинаковыми».',
        b: 'Доказательство, что ни одна другая пара цветов не подходит, формулируется явно.',
      },
    },
    {
      n: 3, comp: 'K3', title: 'Блок 3', sub: 'пространственно-образный',
      a: {
        text: 'На рисунке прямоугольник 3×4 клетки. Его разрезали по одной прямой линии (по линиям сетки) на два прямоугольника. Найди все возможные способы разрезания.',
        prompt: 'Ответ (количество способов и описание)',
        grid: { w: 4, h: 3 },
      },
      b: {
        text: 'Объясни, почему нельзя разрезать прямоугольник по диагонали и получить из частей два прямоугольника.',
        prompt: 'Объяснение',
        compB: 'K4',
      },
      key: {
        a: '5 способов: 2 горизонтальных линии (между 1-й и 2-й, между 2-й и 3-й строками) + 3 вертикальных линии (между столбцами). Если ученик нашёл 5 — полные 3 балла.',
        b: 'Прямая, идущая по диагонали, даёт два треугольника, а не два прямоугольника.',
      },
    },
  ],
  '3-4': [
    {
      n: 1, comp: 'K1', title: 'Блок 1', sub: 'логико-аналитический',
      a: {
        text: 'В классе 25 учеников. Каждый ученик играет в шахматы, или в шашки, или в обе игры. В шахматы играют 16 учеников, в шашки — 14. Сколько учеников играют в обе игры?',
        prompt: 'Ответ и решение',
      },
      b: {
        text: 'Что произойдёт с задачей, если предположить, что в обе игры не играет никто? Объясни.',
        prompt: 'Объяснение',
        compB: 'K4',
      },
      key: {
        a: '5 учеников играют в обе игры. Принцип включений-исключений: 16 + 14 − 25 = 5; объяснение, почему вычитается общее число учеников.',
        b: 'Если никто не играет в обе — то 16 + 14 = 30 учеников, что противоречит 25; значит, в обе играют 5.',
      },
    },
    {
      n: 2, comp: 'K2', title: 'Блок 2', sub: 'комбинаторно-стратегический',
      a: {
        text: 'Игра «Последний»: на столе 15 монет. Двое игроков по очереди берут со стола 1 или 2 монеты. Проигрывает тот, кто возьмёт последнюю монету. Найди выигрышную стратегию первого игрока — опиши, как ему играть, чтобы всегда побеждать.',
        prompt: 'Стратегия первого игрока',
      },
      b: {
        text: 'Докажи, что эта стратегия работает при любых ходах второго игрока.',
        prompt: 'Доказательство',
        compB: 'K4',
      },
      key: {
        a: 'Первый берёт 2 монеты (остаётся 13). Далее на каждом ходе добирает свой ход и ход соперника до 3 монет в сумме. К ходу второго на столе кратные 3 числа +1: 13, 10, 7, 4, 1 — на 1 монете партия заканчивается проигрышем второго.',
        b: 'При любом ходе второго (1 или 2) первый добирает сумму до 3 и оставляет кратное 3 +1.',
      },
    },
    {
      n: 3, comp: 'K3', title: 'Блок 3', sub: 'пространственно-образный',
      a: {
        text: 'Дан квадрат 4×4 клетки. Можно ли покрыть его доминошками 1×2 без перекрытий и без выходов за границу? Если да, покажи один из способов.',
        prompt: 'Ответ',
        grid: { w: 4, h: 4 },
      },
      b: {
        text: 'А можно ли покрыть таким же способом квадрат 3×3 клетки? Докажи свой ответ.',
        prompt: 'Доказательство',
        compB: 'K4',
      },
      key: {
        a: 'Да, можно: 16 клеток / 2 = 8 доминошек. Один из способов — 4 пары горизонтальных доминошек в каждой строке.',
        b: 'Нельзя: 9 / 2 = 4,5 — нецелое число. Альтернатива — раскраска в шахматном порядке: 5 клеток одного цвета, 4 — другого; каждая доминошка покрывает по одной клетке каждого цвета, требуется поровну.',
      },
    },
  ],
};

const KPN_PARAMS = [
  { id: 'П1', name: 'Скорость вхождения в задачу',
    s1: 'Долго сидит без действий или сразу сдаётся',
    s2: 'Начинает после подсказки педагога или соседа',
    s3: 'Самостоятельно читает условие и сразу начинает действовать',
    comp: ['K1','K5'] },
  { id: 'П2', name: 'Наличие стратегии',
    s1: 'Действует хаотично, перебор не систематизирован',
    s2: 'Есть элемент системы, но не до конца',
    s3: 'Строит таблицу, дерево или явно обозначает план перебора',
    comp: ['K2'] },
  { id: 'П3', name: 'Реакция на ошибку',
    s1: 'Отчаивается или игнорирует ошибку',
    s2: 'Замечает ошибку после указания, исправляет без объяснения',
    s3: 'Сам замечает ошибку, называет причину и исправляет',
    comp: ['K5'] },
  { id: 'П4', name: 'Характер вопросов к педагогу',
    s1: 'Не обращается или требует готового ответа',
    s2: 'Задаёт вопрос: «Скажи ответ»',
    s3: 'Задаёт уточняющий вопрос к условию или к своей гипотезе',
    comp: ['K5'] },
  { id: 'П5', name: 'Качество аргументации',
    s1: 'Называет ответ без объяснения',
    s2: 'Объясняет частично, через один пример',
    s3: 'Объясняет полностью, ссылается на логику или правило',
    comp: ['K4'] },
  { id: 'П6', name: 'Активность в обсуждении',
    s1: 'Молчит или лишь соглашается',
    s2: 'Высказывается по запросу педагога',
    s3: 'Инициативно возражает, задаёт вопросы группе',
    comp: ['K4','K5'] },
];

const OPM_ITEMS = [
  { id: 1,  scale: 'ВМ', text: 'Мне нравится решать трудные задачи, даже если я долго не могу их решить.' },
  { id: 2,  scale: 'ВМ', text: 'Когда у меня не получается решить задачу, я хочу попробовать ещё раз.' },
  { id: 3,  scale: 'ВМ', text: 'Я думаю про задачу даже после урока, по дороге домой или дома.' },
  { id: 4,  scale: 'ВМ', text: 'Мне интересно решать задачу, даже если за неё не ставят оценку.' },
  { id: 5,  scale: 'ВМ', text: 'Когда я наконец понимаю задачу, мне становится радостно.' },
  { id: 6,  scale: 'ПИ', text: 'Мне интересно узнавать, почему числа ведут себя так, а не иначе.' },
  { id: 7,  scale: 'ПИ', text: 'Когда мы придумываем задачи сами, мне это нравится больше, чем решать готовые.' },
  { id: 8,  scale: 'ПИ', text: 'Я люблю смотреть, как разные задачи связаны друг с другом.' },
  { id: 9,  scale: 'ПИ', text: 'Мне нравится, когда в задаче есть подвох или хитрость.' },
  { id: 10, scale: 'ПИ', text: 'Когда у задачи есть несколько способов решения, я хочу узнать их все.' },
];

// ════════════════════════════════════════════════════════════════════
// ОБЩИЕ КОМПОНЕНТЫ
// ════════════════════════════════════════════════════════════════════

function DCrumb({ onHome, label, className }) {
  return (
    <button onClick={onHome} className={`mmm-btn ghost ${className||''}`} style={{ alignSelf:'flex-start', fontSize: 12, padding: '6px 12px' }}>
      ← К диагностикам
    </button>
  );
}

function CompChip({ id }) {
  const c = window.MMM_DATA.COMPONENTS.find(x => x.id === id);
  if (!c) return null;
  return <span className="mmm-tag" style={{ borderColor: c.color, color: c.color, fontWeight: 600 }}>{c.id}</span>;
}

function ScoreInput({ value, onChange, max }) {
  return (
    <div style={{ display:'inline-flex', gap: 4 }}>
      {[...Array(max+1)].map((_, i) => (
        <button key={i} onClick={()=>onChange(i)} style={{
          width: 28, height: 28, borderRadius: 14, cursor:'pointer',
          border: value === i ? '2px solid var(--terra)' : '1px solid var(--paper-3)',
          background: value === i ? 'var(--terra)' : '#fcf8ee',
          color: value === i ? '#fff' : 'var(--ink)',
          fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600,
        }}>{i}</button>
      ))}
    </div>
  );
}

// Сетка для клетчатой части бланка
function GridArea({ w, h }) {
  const cell = 28;
  return (
    <svg width={w*cell} height={h*cell} style={{ display:'block', margin: '12px 0', background:'#fff', border:'1px solid var(--ink-soft)' }}>
      {[...Array(w+1)].map((_, i) => (
        <line key={'v'+i} x1={i*cell} y1={0} x2={i*cell} y2={h*cell} stroke="#c0b8a8" strokeWidth="1"/>
      ))}
      {[...Array(h+1)].map((_, i) => (
        <line key={'h'+i} x1={0} y1={i*cell} x2={w*cell} y2={i*cell} stroke="#c0b8a8" strokeWidth="1"/>
      ))}
      <rect x="0.5" y="0.5" width={w*cell-1} height={h*cell-1} fill="none" stroke="#2a2520" strokeWidth="2"/>
    </svg>
  );
}

// ════════════════════════════════════════════════════════════════════
// ДТМ
// ════════════════════════════════════════════════════════════════════

function DTM({ onHome, role }) {
  const [grade, setGrade] = dS(null); // '1-2' | '3-4'
  const [meta, setMeta] = dS({ name:'', klass:'', date:'' });
  const [answers, setAnswers] = dS({}); // { '1a': text, '1b': text, ... }
  const [scores, setScores] = dS({});   // { '1a': 0-3, '1b': 0-2, '1a_mark':'1-у' }
  const [showKey, setShowKey] = dS(false);

  if (!grade) {
    return (
      <div className="diag-print" style={{ maxWidth: 720, margin:'0 auto', display:'flex', flexDirection:'column', gap: 16 }}>
        <DCrumb onHome={onHome} className="diag-toolbar"/>
        <div className="mmm-card" style={{ padding: 28 }}>
          <p className="mmm-eyebrow">ДТМ · Диагностический тест математического мышления</p>
          <h1 className="mmm-h2" style={{ marginTop: 6 }}>Выберите бланк</h1>
          <p className="mmm-body" style={{ marginTop: 8 }}>
            Тест состоит из трёх блоков. В каждом блоке два задания — А (поиск ответа, 0–3 балла) и Б (обоснование, 0–2 балла). Максимум — 15 баллов. Уровни: <b>0–5</b> начальный, <b>6–10</b> базовый, <b>11–15</b> продвинутый. Время — 30–40 минут.
          </p>
          <div className="mmm-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 18 }}>
            <button className="mmm-card" onClick={()=>setGrade('1-2')} style={{ cursor:'pointer', font:'inherit', textAlign:'left', padding: 20, borderLeft:'4px solid var(--terra)' }}>
              <p className="mmm-eyebrow" style={{ margin:0 }}>Вариант А</p>
              <h3 style={{ margin:'4px 0 6px', fontFamily:'var(--serif)', fontSize: 22 }}>1–2 классы</h3>
              <p className="mmm-body" style={{ margin:0, fontSize: 13 }}>Фрукты в корзине · 3 цвета карандашей · разрезание 3×4</p>
            </button>
            <button className="mmm-card" onClick={()=>setGrade('3-4')} style={{ cursor:'pointer', font:'inherit', textAlign:'left', padding: 20, borderLeft:'4px solid var(--olive)' }}>
              <p className="mmm-eyebrow" style={{ margin:0 }}>Вариант Б</p>
              <h3 style={{ margin:'4px 0 6px', fontFamily:'var(--serif)', fontSize: 22 }}>3–4 классы</h3>
              <p className="mmm-body" style={{ margin:0, fontSize: 13 }}>Шахматы и шашки · игра «Последний» · доминошки 4×4 и 3×3</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const blocks = DTM_BLOCKS[grade];
  const setAns = (k, v) => setAnswers(a => ({ ...a, [k]: v }));
  const setScr = (k, v) => setScores(s => ({ ...s, [k]: v }));

  const totalA = blocks.reduce((s, b) => s + (scores[`${b.n}a`] || 0), 0);
  const totalB = blocks.reduce((s, b) => s + (scores[`${b.n}b`] || 0), 0);
  const total = totalA + totalB;
  const level = total <= 5 ? 'начальный' : total <= 10 ? 'базовый' : 'продвинутый';
  const levelColor = total <= 5 ? '#b04a4a' : total <= 10 ? '#c4724a' : '#5a7a4f';

  // Баллы по компонентам: А идёт в свой компонент (К1/К2/К3), Б идёт в К4
  const compScores = blocks.reduce((acc, b) => {
    acc[b.comp] = (acc[b.comp] || 0) + (scores[`${b.n}a`] || 0);
    acc.K4 = (acc.K4 || 0) + (scores[`${b.n}b`] || 0);
    return acc;
  }, {});

  return (
    <div className="diag-print" style={{ maxWidth: 820, margin:'0 auto', display:'flex', flexDirection:'column', gap: 18 }}>
      <div className="diag-toolbar" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap: 8 }}>
        <DCrumb onHome={onHome} className="diag-toolbar"/>
        <div style={{ display:'flex', gap: 8 }}>
          <button className="mmm-btn ghost" onClick={()=>window.print()} style={{ fontSize: 12, padding:'6px 12px' }}>🖨 Печать бланка</button>
          <button className="mmm-btn ghost" onClick={()=>setGrade(null)} style={{ fontSize: 12, padding:'6px 12px' }}>↺ Сменить вариант</button>
        </div>
      </div>

      {/* Шапка бланка */}
      <div className="mmm-card" style={{ padding: 22 }}>
        <p className="mmm-eyebrow">ДТМ · Бланк для {grade} классов</p>
        <h1 className="mmm-h2" style={{ marginTop: 6 }}>Диагностический тест математического мышления</h1>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap: 12, marginTop: 14, fontSize: 13 }}>
          <label>Имя, фамилия ученика<input value={meta.name} onChange={e=>setMeta(m=>({...m,name:e.target.value}))} style={inputStyle}/></label>
          <label>Класс<input value={meta.klass} onChange={e=>setMeta(m=>({...m,klass:e.target.value}))} style={inputStyle}/></label>
          <label>Дата<input value={meta.date} onChange={e=>setMeta(m=>({...m,date:e.target.value}))} style={inputStyle}/></label>
        </div>
      </div>

      {/* Блоки */}
      {blocks.map(block => (
        <div key={block.n} className="mmm-card diag-block" style={{ padding: 22, display:'flex', flexDirection:'column', gap: 14 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap: 12, paddingBottom: 4, borderBottom: '1px solid var(--paper-3)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="mmm-eyebrow" style={{ margin:0, fontSize: 10 }}>{block.title}</p>
              <h2 className="mmm-h3" style={{ margin:'6px 0 2px' }}>Задание {block.n}</h2>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ink-mute)', fontStyle: 'italic' }}>{block.sub}</p>
            </div>
            <div style={{ display:'flex', gap: 4, flexShrink: 0 }}><CompChip id={block.comp}/><CompChip id="K4"/></div>
          </div>

          {/* А */}
          <div style={{ borderLeft:`3px solid ${compColor(block.comp)}`, paddingLeft: 14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 6 }}>
              <h3 style={{ margin:0, fontFamily:'var(--serif)', fontSize: 15, fontWeight: 600 }}>Задание {block.n}А · <span style={{ color:'var(--ink-mute)', fontWeight: 400 }}>поиск ответа, 0–3 балла</span></h3>
              <CompChip id={block.comp}/>
            </div>
            <p className="mmm-body" style={{ margin: '0 0 10px' }}>{block.a.text}</p>
            {block.a.grid && <GridArea w={block.a.grid.w} h={block.a.grid.h}/>}
            <label style={{ fontSize: 12, color:'var(--ink-mute)', display:'block', marginBottom: 4 }}>{block.a.prompt}</label>
            <textarea value={answers[`${block.n}a`]||''} onChange={e=>setAns(`${block.n}a`, e.target.value)} rows={3} style={textareaStyle} placeholder="Ученик пишет решение здесь…"/>
            {role === 'teacher' && (
              <div style={scoreRowStyle}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>Балл А:</span>
                <ScoreInput value={scores[`${block.n}a`]} onChange={v=>setScr(`${block.n}a`, v)} max={3}/>
                {scores[`${block.n}a`] === 1 && (
                  <span style={{ marginLeft: 12, display:'inline-flex', gap: 4, alignItems:'center' }}>
                    <span style={{ fontSize: 11, color:'var(--ink-mute)' }}>пометка:</span>
                    {['1-у','1-ч'].map(m => (
                      <button key={m} onClick={()=>setScr(`${block.n}a_mark`, scores[`${block.n}a_mark`] === m ? null : m)} style={{
                        ...pillBtnStyle,
                        background: scores[`${block.n}a_mark`] === m ? 'var(--olive)' : '#fcf8ee',
                        color: scores[`${block.n}a_mark`] === m ? '#fff' : 'var(--ink)',
                      }}>{m}</button>
                    ))}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Б */}
          <div style={{ borderLeft:`3px solid ${compColor('K4')}`, paddingLeft: 14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 6 }}>
              <h3 style={{ margin:0, fontFamily:'var(--serif)', fontSize: 15, fontWeight: 600 }}>Задание {block.n}Б · <span style={{ color:'var(--ink-mute)', fontWeight: 400 }}>обоснование, 0–2 балла</span></h3>
              <CompChip id="K4"/>
            </div>
            <p className="mmm-body" style={{ margin: '0 0 10px' }}>{block.b.text}</p>
            <label style={{ fontSize: 12, color:'var(--ink-mute)', display:'block', marginBottom: 4 }}>{block.b.prompt}</label>
            <textarea value={answers[`${block.n}b`]||''} onChange={e=>setAns(`${block.n}b`, e.target.value)} rows={3} style={textareaStyle} placeholder="Объяснение здесь…"/>
            {role === 'teacher' && (
              <div style={scoreRowStyle}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>Балл Б:</span>
                <ScoreInput value={scores[`${block.n}b`]} onChange={v=>setScr(`${block.n}b`, v)} max={2}/>
              </div>
            )}
          </div>

          {role === 'teacher' && showKey && (
            <div style={{ background:'var(--paper-2)', borderRadius: 6, padding: 12, fontSize: 13, lineHeight: 1.45 }}>
              <p style={{ margin: '0 0 6px' }}><b>Ключ к {block.n}А:</b> {block.key.a}</p>
              <p style={{ margin: 0 }}><b>Ключ к {block.n}Б:</b> {block.key.b}</p>
            </div>
          )}
        </div>
      ))}

      {/* Сводный бланк */}
      {role === 'teacher' && (
        <div className="mmm-card" style={{ padding: 22 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 14 }}>
            <h3 className="mmm-h3" style={{ margin: 0 }}>Сводный бланк подсчёта баллов</h3>
            <button className="mmm-btn ghost" onClick={()=>setShowKey(v=>!v)} style={{ fontSize: 12, padding:'6px 12px' }}>
              {showKey ? '🔒 Скрыть ключ' : '🔑 Показать ключ'}
            </button>
          </div>

          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Блок</th>
                <th style={thStyle}>А (0–3)</th>
                <th style={thStyle}>Пометка</th>
                <th style={thStyle}>Б (0–2)</th>
                <th style={thStyle}>Итого</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map(b => {
                const a = scores[`${b.n}a`] || 0;
                const bb = scores[`${b.n}b`] || 0;
                const mark = scores[`${b.n}a_mark`];
                return (
                  <tr key={b.n}>
                    <td style={tdStyle}>Блок {b.n} <span style={{ color:'var(--ink-mute)', fontSize: 12 }}>({b.comp} + К4)</span></td>
                    <td style={tdNumStyle}>{a}</td>
                    <td style={tdStyle}>{mark || '—'}</td>
                    <td style={tdNumStyle}>{bb}</td>
                    <td style={{ ...tdNumStyle, fontWeight: 600 }}>{a + bb}</td>
                  </tr>
                );
              })}
              <tr style={{ background: 'var(--paper-2)' }}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>Σ по А (К1+К2+К3)</td>
                <td style={{ ...tdNumStyle, fontWeight: 600 }} colSpan={2}>{totalA}/9</td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>Σ по Б (К4)</td>
                <td style={{ ...tdNumStyle, fontWeight: 600 }}>{totalB}/6</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: 18, display:'grid', gridTemplateColumns:'1fr 1fr', gap: 18 }}>
            <div>
              <p className="mmm-eyebrow">Итог ДТМ</p>
              <div style={{ fontFamily:'var(--serif)', fontSize: 56, fontWeight: 700, color: levelColor, lineHeight: 1 }}>{total}<span style={{ color:'var(--ink-mute)', fontSize: 26, fontWeight: 400 }}>/15</span></div>
              <p style={{ margin: '6px 0 0', fontSize: 14 }}>уровень — <b style={{ color: levelColor }}>{level}</b></p>
              <p style={{ margin: '4px 0 0', fontSize: 11, color:'var(--ink-mute)' }}>0–5 начальный · 6–10 базовый · 11–15 продвинутый</p>
            </div>
            <div>
              <p className="mmm-eyebrow">По компонентам</p>
              {['K1','K2','K3','K4'].map(cid => {
                const c = window.MMM_DATA.COMPONENTS.find(x => x.id === cid);
                const max = cid === 'K4' ? 6 : 3;
                const v = compScores[cid] || 0;
                return (
                  <div key={cid} style={{ marginTop: 8 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize: 12, marginBottom: 3 }}>
                      <span style={{ color: c.color, fontWeight: 600 }}>{c.id} · {c.short}</span>
                      <span style={{ fontFamily:'var(--mono)' }}>{v}/{max}</span>
                    </div>
                    <div style={{ height: 6, background:'var(--paper-3)', borderRadius: 3, overflow:'hidden' }}>
                      <div style={{ width: `${(v/max)*100}%`, height:'100%', background: c.color, transition:'width .3s' }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {role === 'teacher' && <ScalesKey/>}
    </div>
  );
}

function ScalesKey() {
  const [open, setOpen] = dS(false);
  return (
    <div className="mmm-card" style={{ padding: 22 }}>
      <button onClick={()=>setOpen(o=>!o)} style={{
        width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
        background:'transparent', border:0, padding:0, cursor:'pointer', font:'inherit', textAlign:'left',
      }}>
        <h3 className="mmm-h3" style={{ margin:0 }}>Шкалы оценивания {open ? '▴' : '▾'}</h3>
        <span style={{ fontSize: 12, color:'var(--ink-mute)' }}>{open ? 'свернуть' : 'развернуть'}</span>
      </button>
      {open && (
        <div style={{ marginTop: 14, fontSize: 13, lineHeight: 1.5 }}>
          <h4 style={{ margin:'4px 0 6px', fontFamily:'var(--serif)', fontSize: 14 }}>Шкала А (поиск ответа, 0–3 балла)</h4>
          <table style={tableStyle}>
            <thead><tr><th style={thStyle}>Балл</th><th style={thStyle}>Критерий</th><th style={thStyle}>Типичный ответ</th></tr></thead>
            <tbody>
              <tr><td style={tdNumStyle}>0</td><td style={tdStyle}>Не приступил или ответ не связан с условием</td><td style={tdStyle}>«Не знаю», случайное число</td></tr>
              <tr><td style={tdNumStyle}>1</td><td style={tdStyle}>Верный ответ без пояснений</td><td style={tdStyle}>«Ответ 7» — без рассуждений</td></tr>
              <tr><td style={tdNumStyle}>2</td><td style={tdStyle}>Верный ответ с частичным рассуждением: опирается на конкретный пример, не обобщает</td><td style={tdStyle}>«Я попробовал 7 — подходит. И 6 — не подходит»</td></tr>
              <tr><td style={tdNumStyle}>3</td><td style={tdStyle}>Верный ответ с полным рассуждением: раскрывает логику, обобщает, проверяет другие варианты</td><td style={tdStyle}>«Ответ 7, потому что… и других вариантов нет, так как…»</td></tr>
            </tbody>
          </table>
          <p style={{ marginTop: 12, fontSize: 12, color:'var(--ink-mute)' }}>
            <b>Пометка к баллу 1.</b> При выставлении 1 балла за А учитель спрашивает «Как ты это нашёл?» и фиксирует:
            <b> 1-у</b> — угадывание (ребёнок не объясняет, как пришёл к ответу);
            <b> 1-ч</b> — частичное понимание (объясняет хотя бы один шаг). На сумму не влияет, нужна для качественного анализа и сопоставления с КПН-П5.
          </p>

          <h4 style={{ margin:'18px 0 6px', fontFamily:'var(--serif)', fontSize: 14 }}>Шкала Б (обоснование, 0–2 балла)</h4>
          <table style={tableStyle}>
            <thead><tr><th style={thStyle}>Балл</th><th style={thStyle}>Критерий</th></tr></thead>
            <tbody>
              <tr><td style={tdNumStyle}>0</td><td style={tdStyle}>Не отвечает или повторяет ответ А без объяснения</td></tr>
              <tr><td style={tdNumStyle}>1</td><td style={tdStyle}>Частичное обоснование: один аргумент, не доказывает невозможность других вариантов</td></tr>
              <tr><td style={tdNumStyle}>2</td><td style={tdStyle}>Полное обоснование: объясняет, почему ответ единственный, или явно перебирает и отвергает альтернативы</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// КПН
// ════════════════════════════════════════════════════════════════════

function KPN({ onHome }) {
  const [meta, setMeta] = dS({ klass:'', teacher:'', date:'' });
  const [rows, setRows] = dS(() => Array.from({ length: 12 }, () => ({ name:'', P1:0, P2:0, P3:0, P4:0, P5:0, P6:0 })));
  const [paramOpen, setParamOpen] = dS(null);

  const setRow = (i, key, val) => setRows(r => r.map((row, idx) => idx === i ? { ...row, [key]: val } : row));
  const addRow = () => setRows(r => [...r, { name:'', P1:0, P2:0, P3:0, P4:0, P5:0, P6:0 }]);

  const sumRow = (row) => row.P1 + row.P2 + row.P3 + row.P4 + row.P5 + row.P6;
  const level = (s) => s === 0 ? '—' : s <= 9 ? 'начальный' : s <= 13 ? 'базовый' : 'устойчивый';
  const levelColor = (s) => s === 0 ? 'var(--ink-mute)' : s <= 9 ? '#b04a4a' : s <= 13 ? '#c4724a' : '#5a7a4f';

  // средние по параметрам
  const filled = rows.filter(r => r.name.trim());
  const avg = (key) => filled.length ? (filled.reduce((s, r) => s + r[key], 0) / filled.length).toFixed(1) : '—';

  const cycleScore = (cur) => cur === 0 ? 1 : cur === 1 ? 2 : cur === 2 ? 3 : 0;

  return (
    <div className="diag-print diag-landscape" style={{ maxWidth: 1080, margin:'0 auto', display:'flex', flexDirection:'column', gap: 18 }}>
      <div className="diag-toolbar" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <DCrumb onHome={onHome} className="diag-toolbar"/>
        <button className="mmm-btn ghost" onClick={()=>window.print()} style={{ fontSize: 12, padding:'6px 12px' }}>🖨 Печать</button>
      </div>

      <div className="mmm-card" style={{ padding: 22 }}>
        <p className="mmm-eyebrow">КПН · Карта педагогического наблюдения</p>
        <h1 className="mmm-h2" style={{ marginTop: 6 }}>Шесть параметров мыслительной активности</h1>
        <p className="mmm-body" style={{ marginTop: 8 }}>
          Заполняется педагогом на каждом 2–4-м занятии. Шкала: <b>1</b> — не проявляется; <b>2</b> — иногда или при поддержке; <b>3</b> — устойчиво самостоятельно. Кликните по ячейке, чтобы циклически выбрать балл.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 12, marginTop: 14, fontSize: 13 }}>
          <label>Класс<input value={meta.klass} onChange={e=>setMeta(m=>({...m,klass:e.target.value}))} style={inputStyle}/></label>
          <label>Педагог<input value={meta.teacher} onChange={e=>setMeta(m=>({...m,teacher:e.target.value}))} style={inputStyle}/></label>
          <label>Дата / № занятия<input value={meta.date} onChange={e=>setMeta(m=>({...m,date:e.target.value}))} style={inputStyle}/></label>
        </div>
      </div>

      {/* Параметры и дескрипторы */}
      <div className="mmm-card" style={{ padding: 22 }}>
        <h3 className="mmm-h3" style={{ marginTop: 0 }}>Параметры и дескрипторы</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap: 10, marginTop: 12 }}>
          {KPN_PARAMS.map(p => (
            <button key={p.id} onClick={()=>setParamOpen(o => o === p.id ? null : p.id)} className="mmm-card" style={{
              cursor:'pointer', font:'inherit', textAlign:'left', padding: 14,
              background: paramOpen === p.id ? 'var(--paper-2)' : '#fcf8ee',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily:'var(--mono)', fontSize: 12, color:'var(--ink-mute)' }}>{p.id}</span>
                <div style={{ display:'flex', gap: 3 }}>{p.comp.map(c => <CompChip key={c} id={c}/>)}</div>
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{p.name}</div>
              {paramOpen === p.id && (
                <div style={{ fontSize: 12, lineHeight: 1.45, color:'var(--ink-soft)' }}>
                  <div><b>1:</b> {p.s1}</div>
                  <div style={{ marginTop: 3 }}><b>2:</b> {p.s2}</div>
                  <div style={{ marginTop: 3 }}><b>3:</b> {p.s3}</div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Бланк */}
      <div className="mmm-card" style={{ padding: 22, overflowX:'auto' }}>
        <h3 className="mmm-h3" style={{ marginTop: 0 }}>Бланк для группы</h3>
        <table style={{ ...tableStyle, minWidth: 760 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: 28 }}>№</th>
              <th style={{ ...thStyle, textAlign:'left' }}>Фамилия, имя ученика</th>
              {KPN_PARAMS.map(p => <th key={p.id} style={{ ...thStyle, width: 56 }} title={p.name}>{p.id}</th>)}
              <th style={{ ...thStyle, width: 100 }}>Σ</th>
              <th style={{ ...thStyle, width: 110 }}>Уровень</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const s = sumRow(row);
              return (
                <tr key={i}>
                  <td style={{ ...tdNumStyle, color:'var(--ink-mute)' }}>{i+1}</td>
                  <td style={tdStyle}>
                    <input value={row.name} onChange={e=>setRow(i, 'name', e.target.value)} style={{ ...inputStyle, marginTop: 0, padding: '4px 6px' }} placeholder="Фамилия Имя"/>
                  </td>
                  {KPN_PARAMS.map(p => (
                    <td key={p.id} style={tdNumStyle}>
                      <button onClick={()=>setRow(i, p.id, cycleScore(row[p.id]))} style={{
                        width: 32, height: 32, borderRadius: 16, cursor:'pointer',
                        border: row[p.id] ? '2px solid var(--terra)' : '1px dashed var(--paper-3)',
                        background: row[p.id] ? cellBg(row[p.id]) : '#fff',
                        color: row[p.id] ? '#fff' : 'var(--ink-mute)',
                        fontFamily:'var(--mono)', fontSize: 13, fontWeight: 600,
                      }}>{row[p.id] || '·'}</button>
                    </td>
                  ))}
                  <td style={{ ...tdNumStyle, fontWeight: 600 }}>{s || '—'}</td>
                  <td style={{ ...tdStyle, textAlign:'center', color: levelColor(s), fontSize: 12, fontWeight: 600 }}>{level(s)}</td>
                </tr>
              );
            })}
            {/* Средние */}
            <tr style={{ background:'var(--paper-2)' }}>
              <td style={tdNumStyle}>—</td>
              <td style={{ ...tdStyle, fontWeight: 600, fontSize: 12 }}>Среднее по группе</td>
              {KPN_PARAMS.map(p => <td key={p.id} style={{ ...tdNumStyle, fontWeight: 600, fontFamily:'var(--mono)' }}>{avg(p.id)}</td>)}
              <td style={tdNumStyle}>—</td>
              <td style={tdStyle}>—</td>
            </tr>
          </tbody>
        </table>

        <button className="mmm-btn ghost" onClick={addRow} style={{ marginTop: 12, fontSize: 12, padding:'6px 12px' }}>＋ Добавить строку</button>

        <p style={{ marginTop: 16, fontSize: 12, color:'var(--ink-soft)', lineHeight: 1.5 }}>
          <b>Интерпретация Σ (6–18).</b> 6–9 — начальный уровень мыслительной активности; 10–13 — базовый; 14–18 — устойчивая мыслительная активность. Анализируется индивидуальный балл каждого ученика и средний балл группы по каждому параметру. Для каждого ученика рекомендуется построение паутинной диаграммы по шести осям П1–П6.
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ОПМ
// ════════════════════════════════════════════════════════════════════

function OPM({ onHome, role }) {
  const [mode, setMode] = dS(null); // '1-2' | '3-4'
  const [meta, setMeta] = dS({ name:'', klass:'', date:'' });
  const [ans, setAns] = dS({}); // { 1: 'yes'|'sometimes'|'no' }

  if (!mode) {
    return (
      <div className="diag-print" style={{ maxWidth: 720, margin:'0 auto', display:'flex', flexDirection:'column', gap: 16 }}>
        <DCrumb onHome={onHome} className="diag-toolbar"/>
        <div className="mmm-card" style={{ padding: 28 }}>
          <p className="mmm-eyebrow">ОПМ · Опросник познавательной мотивации</p>
          <h1 className="mmm-h2" style={{ marginTop: 6 }}>Выберите формат</h1>
          <p className="mmm-body" style={{ marginTop: 8 }}>
            10 пунктов на две субшкалы по 5: <b>ВМ</b> — внутренняя мотивация, <b>ПИ</b> — познавательный интерес.
            Шкала: «да» — 3, «иногда» — 2, «нет» — 1 балл. Каждая субшкала: 5–15. Суммарно: 10–30.
          </p>
          <p style={{ marginTop: 10, fontSize: 12, color:'var(--ink-mute)', lineHeight: 1.5 }}>
            Опирается на двухфакторную модель внутренней мотивации и познавательного интереса (Гордеева, 2021). Формулировки адаптированы под возраст 7–10 лет и содержательную специфику курса нестандартных задач.
          </p>
          <div className="mmm-grid" style={{ gridTemplateColumns:'1fr 1fr', gap: 12, marginTop: 18 }}>
            <button className="mmm-card" onClick={()=>setMode('1-2')} style={{ cursor:'pointer', font:'inherit', textAlign:'left', padding: 20, borderLeft:'4px solid var(--terra)' }}>
              <p className="mmm-eyebrow" style={{ margin:0 }}>Устная форма</p>
              <h3 style={{ margin:'4px 0 6px', fontFamily:'var(--serif)', fontSize: 22 }}>1–2 классы</h3>
              <p className="mmm-body" style={{ margin:0, fontSize: 13 }}>Педагог зачитывает; ребёнок поднимает цветную карточку 🟢🟡🔴</p>
            </button>
            <button className="mmm-card" onClick={()=>setMode('3-4')} style={{ cursor:'pointer', font:'inherit', textAlign:'left', padding: 20, borderLeft:'4px solid var(--olive)' }}>
              <p className="mmm-eyebrow" style={{ margin:0 }}>Письменная форма</p>
              <h3 style={{ margin:'4px 0 6px', fontFamily:'var(--serif)', fontSize: 22 }}>3–4 классы</h3>
              <p className="mmm-body" style={{ margin:0, fontSize: 13 }}>Ребёнок отмечает галочкой Да / Иногда / Нет</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const opts = [
    { v:'yes', score: 3, label1:'🟢 зелёная', label2:'Да',     color:'#5a7a4f' },
    { v:'mid', score: 2, label1:'🟡 жёлтая',  label2:'Иногда', color:'#c4724a' },
    { v:'no',  score: 1, label1:'🔴 красная', label2:'Нет',    color:'#b04a4a' },
  ];

  const setA = (id, v) => setAns(a => ({ ...a, [id]: v }));

  const answered = OPM_ITEMS.filter(i => ans[i.id]).length;
  const score = (scale) => OPM_ITEMS.filter(i => i.scale === scale).reduce((s, i) => {
    const o = opts.find(x => x.v === ans[i.id]);
    return s + (o ? o.score : 0);
  }, 0);
  const vm = score('ВМ');
  const pi = score('ПИ');
  const tot = vm + pi;

  const levelSub = (s) => s === 0 ? '—' : s <= 7 ? 'низкий' : s <= 10 ? 'средний' : 'высокий';
  const levelTot = (s) => s === 0 ? '—' : s <= 15 ? 'низкий' : s <= 21 ? 'средний' : 'высокий';
  const colorSub = (s) => s === 0 ? 'var(--ink-mute)' : s <= 7 ? '#b04a4a' : s <= 10 ? '#c4724a' : '#5a7a4f';

  return (
    <div className="diag-print" style={{ maxWidth: 820, margin:'0 auto', display:'flex', flexDirection:'column', gap: 18 }}>
      <div className="diag-toolbar" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap: 8 }}>
        <DCrumb onHome={onHome} className="diag-toolbar"/>
        <div style={{ display:'flex', gap: 8 }}>
          <button className="mmm-btn ghost" onClick={()=>window.print()} style={{ fontSize: 12, padding:'6px 12px' }}>🖨 Печать</button>
          <button className="mmm-btn ghost" onClick={()=>setMode(null)} style={{ fontSize: 12, padding:'6px 12px' }}>↺ Сменить формат</button>
        </div>
      </div>

      <div className="mmm-card" style={{ padding: 22 }}>
        <p className="mmm-eyebrow">ОПМ · {mode === '1-2' ? 'Устная форма для 1–2 классов' : 'Письменная форма для 3–4 классов'}</p>
        <h1 className="mmm-h2" style={{ marginTop: 6 }}>Опросник познавательной мотивации</h1>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap: 12, marginTop: 14, fontSize: 13 }}>
          <label>Имя, фамилия ученика<input value={meta.name} onChange={e=>setMeta(m=>({...m,name:e.target.value}))} style={inputStyle}/></label>
          <label>Класс<input value={meta.klass} onChange={e=>setMeta(m=>({...m,klass:e.target.value}))} style={inputStyle}/></label>
          <label>Дата<input value={meta.date} onChange={e=>setMeta(m=>({...m,date:e.target.value}))} style={inputStyle}/></label>
        </div>
        <div style={{ marginTop: 14, padding: 12, background:'var(--paper-2)', borderRadius: 6, fontSize: 12.5, lineHeight: 1.5 }}>
          {mode === '1-2' ? (
            <>
              <b>Инструкция педагогу.</b> Прочитайте каждое утверждение медленно. Покажите три карточки: 🟢 «да», 🟡 «иногда», 🔴 «нет». Попросите поднять одну. Не торопите. При необходимости поясните своими словами, не меняя смысла.
              <br/><br/>
              <b>Ребёнку:</b> «Сейчас я буду читать тебе фразы про математику и задачи. После каждой подними одну карточку. Зелёную — если это про тебя. Жёлтую — иногда так, иногда нет. Красную — это совсем не про тебя. Здесь нет правильных или неправильных ответов».
            </>
          ) : (
            <>
              <b>Инструкция ученику.</b> Прочитай каждое утверждение и поставь галочку в один из трёх столбцов: «Да» — это про меня; «Иногда» — иногда бывает, иногда нет; «Нет» — это совсем не про меня. Здесь нет правильных или неправильных ответов. Отметь каждое утверждение.
            </>
          )}
        </div>
      </div>

      {/* Утверждения */}
      <div className="mmm-card" style={{ padding: 22 }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: 32 }}>№</th>
              <th style={{ ...thStyle, width: 48 }}>Шкала</th>
              <th style={{ ...thStyle, textAlign:'left' }}>Утверждение</th>
              {opts.map(o => (
                <th key={o.v} style={{ ...thStyle, width: mode === '1-2' ? 110 : 70, color: o.color }}>
                  {mode === '1-2' ? o.label1 : o.label2}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {OPM_ITEMS.map(item => (
              <tr key={item.id}>
                <td style={tdNumStyle}>{item.id}</td>
                <td style={{ ...tdStyle, textAlign:'center' }}>
                  <span className="mmm-tag" style={{ borderColor: item.scale === 'ВМ' ? 'var(--terra)' : 'var(--olive)', color: item.scale === 'ВМ' ? 'var(--terra)' : 'var(--olive)', fontSize: 11 }}>{item.scale}</span>
                </td>
                <td style={{ ...tdStyle, fontSize: 14 }}>{item.text}</td>
                {opts.map(o => (
                  <td key={o.v} style={tdNumStyle}>
                    <button onClick={()=>setA(item.id, o.v)} aria-label={o.label2} style={{
                      width: 36, height: 36, borderRadius: 18, cursor:'pointer',
                      border: ans[item.id] === o.v ? `2px solid ${o.color}` : '1px solid var(--paper-3)',
                      background: ans[item.id] === o.v ? o.color : '#fcf8ee',
                      color: ans[item.id] === o.v ? '#fff' : 'var(--ink-mute)',
                      fontFamily:'var(--mono)', fontSize: 16, fontWeight: 700,
                    }}>{ans[item.id] === o.v ? '✓' : ''}</button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="diag-no-print" style={{ marginTop: 12, fontSize: 12, color:'var(--ink-mute)' }}>Заполнено {answered} из 10.</p>
      </div>

      {/* Результат */}
      {(role === 'teacher' || answered === 10) && (
        <div className="mmm-card" style={{ padding: 22 }}>
          <h3 className="mmm-h3" style={{ marginTop: 0 }}>Бланк подсчёта</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...thStyle, textAlign:'left' }}>Субшкала</th>
                <th style={thStyle}>Сумма (5–15)</th>
                <th style={{ ...thStyle, textAlign:'left' }}>Уровень</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}><b>ВМ</b> — Внутренняя мотивация (1–5)</td>
                <td style={{ ...tdNumStyle, fontFamily:'var(--mono)', fontWeight: 600 }}>{vm || '—'}</td>
                <td style={{ ...tdStyle, color: colorSub(vm), fontWeight: 600 }}>{levelSub(vm)} <span style={{ color:'var(--ink-mute)', fontWeight: 400, fontSize: 12 }}>(11–15 высокая · 8–10 средняя · 5–7 низкая)</span></td>
              </tr>
              <tr>
                <td style={tdStyle}><b>ПИ</b> — Познавательный интерес (6–10)</td>
                <td style={{ ...tdNumStyle, fontFamily:'var(--mono)', fontWeight: 600 }}>{pi || '—'}</td>
                <td style={{ ...tdStyle, color: colorSub(pi), fontWeight: 600 }}>{levelSub(pi)} <span style={{ color:'var(--ink-mute)', fontWeight: 400, fontSize: 12 }}>(11–15 высокий · 8–10 средний · 5–7 низкий)</span></td>
              </tr>
              <tr style={{ background:'var(--paper-2)' }}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>Σ ОПМ (10–30)</td>
                <td style={{ ...tdNumStyle, fontFamily:'var(--mono)', fontWeight: 700 }}>{tot || '—'}</td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{levelTot(tot)} <span style={{ color:'var(--ink-mute)', fontWeight: 400, fontSize: 12 }}>(22–30 высокий · 16–21 средний · 10–15 низкий)</span></td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: 12, fontSize: 12, color:'var(--ink-soft)', lineHeight: 1.5 }}>
            <b>Использование результатов.</b> Балл ОПМ интерпретируется в связке с ДТМ. Расхождение диагностически информативно:
            <b> высокий ОПМ при низком ДТМ</b> — интерес без сложившихся умений (постепенно наращивать сложность);
            <b> высокий ДТМ при низком ОПМ</b> — освоенные приёмы без внутренней мотивации (искать содержательный интерес ребёнка).
          </p>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ГЛАВНАЯ СТРАНИЦА ДИАГНОСТИКИ
// ════════════════════════════════════════════════════════════════════

function DiagnosticPage({ role }) {
  usePrintStyles();
  const [tool, setTool] = dS(null); // 'dtm' | 'kpn' | 'opm'

  if (tool === 'dtm') return <DTM onHome={()=>setTool(null)} role={role}/>;
  if (tool === 'kpn') return <KPN onHome={()=>setTool(null)} role={role}/>;
  if (tool === 'opm') return <OPM onHome={()=>setTool(null)} role={role}/>;

  const cards = [
    {
      id:'dtm', t:'ДТМ', sub: 'Задачный тест',
      name:'Диагностический тест математического мышления',
      desc:'Три блока по два задания (А — поиск ответа, Б — обоснование). Максимум 15 баллов. Уровни: начальный / базовый / продвинутый.',
      meta:['К1 · К2 · К3 · К4', '6 заданий · 30–40 мин', 'Заполняет ученик'],
      filler: 'У ученика',
      color: 'var(--terra)',
    },
    {
      id:'kpn', t:'КПН', sub: 'Карта наблюдения',
      name:'Карта педагогического наблюдения',
      desc:'Шесть параметров мыслительной активности по шкале 1–3. Сумма 6–18. Заполняется педагогом на каждом 2–4-м занятии.',
      meta:['К1 · К2 · К4 · К5', '6 параметров · П1–П6', 'Заполняет педагог'],
      filler: 'У педагога',
      color: 'var(--olive)',
    },
    {
      id:'opm', t:'ОПМ', sub: 'Опросник',
      name:'Опросник познавательной мотивации',
      desc:'Десять утверждений на две субшкалы — внутренняя мотивация (ВМ) и познавательный интерес (ПИ). Шкала «да / иногда / нет».',
      meta:['Мотивация · интерес', '10 пунктов · 2 субшкалы', 'Устно (1–2) или письменно (3–4)'],
      filler: 'У ученика',
      color: '#7a5a3f',
    },
  ];

  return (
    <div style={{ maxWidth: 1080, margin:'0 auto', display:'flex', flexDirection:'column', gap: 'var(--pad-lg)' }}>
      <header>
        <p className="mmm-eyebrow">Диагностика стартового уровня</p>
        <h1 className="mmm-h1">Три инструмента входной диагностики</h1>
        <p className="mmm-lead">Проводятся в сентябре. Покрывают пять компонентов мышления (К1–К5): К1–К4 — через ДТМ и КПН; К5 — через КПН и финальное эссе.</p>
      </header>

      <div className="mmm-grid" style={{ gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {cards.map(c => (
          <button key={c.id} className="mmm-card" onClick={()=>setTool(c.id)} style={{
            cursor:'pointer', font:'inherit', textAlign:'left',
            display:'flex', flexDirection:'column', gap: 10, padding: 22,
            borderTop: `4px solid ${c.color}`,
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
              <div>
                <div style={{ fontFamily:'var(--serif)', fontSize: 36, fontWeight: 700, color: c.color, lineHeight: 1 }}>{c.t}</div>
                <p className="mmm-eyebrow" style={{ margin:'4px 0 0' }}>{c.sub}</p>
              </div>
              <span className="mmm-tag" style={{ background: c.color, color:'#fff', borderColor: c.color }}>{c.filler}</span>
            </div>
            <h3 style={{ margin: '4px 0 0', fontFamily:'var(--serif)', fontSize: 17, fontWeight: 600, lineHeight: 1.25 }}>{c.name}</h3>
            <p className="mmm-body" style={{ margin: 0, fontSize: 13 }}>{c.desc}</p>
            <ul style={{ margin: '4px 0 0', padding: 0, listStyle: 'none', display:'flex', flexDirection:'column', gap: 3, fontSize: 12, color:'var(--ink-soft)', fontFamily:'var(--mono)' }}>
              {c.meta.map((m, i) => <li key={i}>· {m}</li>)}
            </ul>
            <span className="mmm-btn terra" style={{ marginTop: 'auto', alignSelf:'flex-start', fontSize: 13 }}>Открыть →</span>
          </button>
        ))}
      </div>

      <div className="mmm-card" style={{ padding: 20, background: 'var(--paper-2)', borderLeft: '3px solid var(--olive)' }}>
        <p className="mmm-eyebrow" style={{ margin: 0 }}>Замечание</p>
        <p className="mmm-body" style={{ margin: '6px 0 0', fontSize: 13.5 }}>
          К5 (рефлексивный) имеет процессуальную природу и не диагностируется одноразовым тестом — он отслеживается через КПН и финальное эссе курса. ДТМ и ОПМ интерпретируются в связке: их расхождение (например, высокий интерес при низких умениях или наоборот) даёт ценные педагогические подсказки.
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// СТИЛИ
// ════════════════════════════════════════════════════════════════════

const inputStyle = {
  display:'block', width:'100%', marginTop: 4, padding: '6px 8px',
  background:'#fff', border:'1px solid var(--paper-3)', borderRadius: 4,
  font:'inherit', fontSize: 13,
};
const textareaStyle = {
  display:'block', width:'100%', padding: '8px 10px',
  background:'#fff', border:'1px solid var(--paper-3)', borderRadius: 4,
  font:'inherit', fontSize: 13.5, lineHeight: 1.45, resize:'vertical',
};
const scoreRowStyle = {
  marginTop: 10, padding: '8px 10px',
  background:'var(--paper-2)', borderRadius: 4,
  display:'flex', alignItems:'center', gap: 8, flexWrap:'wrap',
};
const pillBtnStyle = {
  padding: '3px 8px', borderRadius: 10, border: '1px solid var(--paper-3)',
  cursor:'pointer', font:'inherit', fontSize: 11, fontFamily:'var(--mono)',
};
const tableStyle = { width:'100%', borderCollapse:'collapse', fontSize: 13 };
const thStyle = { padding:'6px 8px', textAlign:'center', borderBottom:'2px solid var(--ink-soft)', fontFamily:'var(--mono)', fontSize: 11, fontWeight: 600, color:'var(--ink-soft)', textTransform:'uppercase', letterSpacing: '.04em' };
const tdStyle = { padding:'6px 8px', borderBottom:'1px solid var(--paper-3)', verticalAlign:'middle' };
const tdNumStyle = { ...tdStyle, textAlign:'center', fontFamily:'var(--mono)' };

function compColor(id) {
  const c = window.MMM_DATA && window.MMM_DATA.COMPONENTS.find(x => x.id === id);
  return c ? c.color : 'var(--terra)';
}

function cellBg(v) {
  if (v === 1) return '#b04a4a';
  if (v === 2) return '#c4724a';
  if (v === 3) return '#5a7a4f';
  return 'var(--paper-3)';
}

// Export
window.MMM_DIAG = { DiagnosticPage };
