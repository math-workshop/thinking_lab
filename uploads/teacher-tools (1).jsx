// ════════════════════════════════════════════════════════════════
// МЕТОДКАБИНЕТ — сквозные инструменты учителя
// Четыре инвариантных элемента курса (§4.10 ВКР):
//   1. Сигнальная карточка самооценки (Прил. М)
//   2. Банк открытых вопросов (Прил. Н)
//   3. Карточки-маяки для педагога (Прил. П)
//   4. Модуль «Своя задача» (§4.10.4)
// Стиль и классы — как на остальном сайте (mmm-*, var(--…)).
// Подключение: см. инструкцию рядом с файлом.
// ════════════════════════════════════════════════════════════════
(function () {
  const { useState: tS } = React;

  // ── Данные: сигнальная карточка ───────────────────────────────
  const SIGNALS = [
    { color: '#5a7a4f', name: 'Зелёный', child: 'Понял и могу объяснить другому',
      action: 'Может выступить «объясняющим» для группы; предложить задачу повышенной сложности.' },
    { color: '#c89a3a', name: 'Жёлтый', child: 'Понял, но не уверен',
      action: 'Закрепить на сходной задаче; вернуться к теме на следующем занятии.' },
    { color: '#c0492f', name: 'Красный', child: 'Не понял',
      action: 'Индивидуальная поддержка; разбор в малой группе; пересмотр темпа.' },
  ];
  const SIGNAL_EFFECTS = [
    'Общий сдвиг от красных к зелёным за год — субъективный рост уверенности.',
    'Стойкий жёлтый сигнал у отдельного ребёнка — маркер тревожности или перфекционизма.',
    'Расхождение сигнала и баллов ДТМ (красный при высоком балле) — проблема самооценки.',
  ];

  // ── Данные: банк открытых вопросов ────────────────────────────
  const BANK_PURPOSE = [
    'Снимает тревожность «незнания ответа»: незнание легитимируется как нормальное состояние исследователя.',
    'Формирует умение формулировать вопрос, а не только давать ответ (рефлексивный компонент К5).',
    'Обеспечивает преемственность: открытый вопрос одного занятия становится отправной точкой следующего.',
  ];
  const BANK_EXAMPLES = [
    'А бывают ли числа, которые делятся вообще на всё?',
    'Можно ли нарисовать такую фигуру, чтобы её нельзя было разрезать на две одинаковые?',
    'Почему у некоторых задач несколько правильных ответов, а у некоторых только один?',
    'Если поменять правила игры — кто будет выигрывать тогда?',
    'Существует ли самое большое число? А самое маленькое?',
  ];

  // ── Данные: карточки-маяки по классам ─────────────────────────
  const BEACONS = [
    { grade: '1 класс', accent: '#c4724a', questions: [
      'Что происходит в нашей истории?',
      'Где затруднение у героя?',
      'Что мы уже знаем? Чего не знаем?',
      'Как ты придумал это? Покажи мне.',
      'Чья идея помогла больше — и почему?',
    ] },
    { grade: '2 класс', accent: '#c89a3a', questions: [
      'Что нужно герою — и как ты это понял?',
      'Почему так получается?',
      'Это всегда работает или только в этой задаче?',
      'Придумай пример, где это не работает.',
    ] },
    { grade: '3 класс', accent: '#5a7a4f', questions: [
      'Сформулируй свою гипотезу одним предложением.',
      'Приведи пример, где это работает.',
      'Теперь — пример, где не работает.',
      'Как вы можете это доказать, не ссылаясь на меня?',
    ] },
    { grade: '4 класс', accent: '#4a6a8a', questions: [
      'Сформулируй свою гипотезу точно — одним предложением.',
      'Мне недостаточно примера — нужно доказательство.',
      'Твой оппонент нашёл контрпример. Что теперь с твоей гипотезой?',
      'Ты изменил своё мнение? Что тебя убедило?',
    ] },
  ];
  const BEACON_PRINCIPLE = 'Мне интересно не что ты думаешь, а почему ты так думаешь.';

  // ── Общий портал печати (A4) ──────────────────────────────────
  function PrintArea({ title, hint, onClose, children }) {
    React.useEffect(() => {
      const t = setTimeout(() => window.print(), 350);
      return () => clearTimeout(t);
    }, []);
    React.useEffect(() => {
      const h = (e) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', h);
      return () => window.removeEventListener('keydown', h);
    }, []);
    return ReactDOM.createPortal(
      <div className="mtk-print-portal">
        <style>{`
          .mtk-print-portal { position: fixed; inset: 0; z-index: 400; background: var(--paper); overflow: auto; font-family: var(--sans); color: var(--ink); }
          .mtk-print-bar { position: sticky; top: 0; z-index: 2; display: flex; gap: 10px; align-items: center; padding: 12px 20px; background: var(--paper-2); border-bottom: 1.5px solid var(--line); }
          .mtk-print-bar .grow { flex: 1 1 auto; }
          .mtk-print-sheet { max-width: 820px; margin: 0 auto; padding: 32px 44px 80px; }
          .mtk-print-sheet h1 { font-family: var(--serif); font-size: 26px; margin: 0 0 4px; }
          @media print {
            @page { size: A4 portrait; margin: 14mm; }
            html, body { background: #fff !important; height: auto !important; overflow: visible !important; }
            #root { display: none !important; }
            .mtk-print-portal { position: static !important; inset: auto !important; overflow: visible !important; height: auto !important; background: #fff !important; }
            .mtk-print-bar { display: none !important; }
            .mtk-print-sheet { max-width: none; margin: 0; padding: 0; }
            .mtk-cut { border: 1.5px dashed #999 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .mtk-print-portal * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          }
        `}</style>
        <div className="mtk-print-bar">
          <strong style={{ fontFamily: 'var(--serif)', fontSize: 15 }}>Печать · {title}</strong>
          <span className="grow" />
          <button className="mmm-btn terra" onClick={() => window.print()}>⎙ Сохранить в PDF</button>
          <button className="mmm-btn ghost" onClick={onClose}>Закрыть</button>
        </div>
        <div className="mtk-print-sheet diag-print">
          <p className="mmm-eyebrow" style={{ margin: 0 }}>Мастерская математического мышления</p>
          <h1>{title}</h1>
          {hint && <p className="mmm-body" style={{ margin: '0 0 18px', color: 'var(--ink-mute)' }}>{hint}</p>}
          {children}
        </div>
      </div>,
      document.body
    );
  }

  // Печатный лист сигнальных карточек (под нарезку, ~7×5 см)
  function SignalPrintSheet() {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[0, 1, 2].flatMap(() => SIGNALS).map((s, i) => (
          <div key={i} className="mtk-cut" style={{
            border: `1.5px dashed ${s.color}`, borderRadius: 10, padding: '22px 12px',
            textAlign: 'center', minHeight: 132, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 10, background: '#fff',
          }}>
            <span style={{ width: 38, height: 38, borderRadius: '50%', background: s.color, display: 'block' }} />
            <span style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: 15 }}>{s.name}</span>
            <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{s.child}</span>
          </div>
        ))}
      </div>
    );
  }

  // Печатный бланк банка вопросов
  function BankPrintSheet() {
    const cell = { border: '1px solid #aaa', padding: '8px 10px', fontSize: 12 };
    return (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...cell, width: 36 }}>№</th>
            <th style={{ ...cell, textAlign: 'left' }}>Вопрос (записывает ребёнок или педагог)</th>
            <th style={{ ...cell, width: 110 }}>Кто задал</th>
            <th style={{ ...cell, width: 150 }}>Статус<br /><span style={{ fontWeight: 400, fontSize: 10 }}>открыт / в работе / закрыт</span></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 12 }, (_, i) => (
            <tr key={i}><td style={{ ...cell, textAlign: 'center' }}>{i + 1}</td><td style={{ ...cell, height: 30 }} /><td style={cell} /><td style={cell} /></tr>
          ))}
        </tbody>
      </table>
    );
  }

  // Печатный набор карточек-маяков
  function BeaconPrintSheet() {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {BEACONS.map((b) => (
          <div key={b.grade} className="mtk-cut" style={{ border: `1.5px dashed ${b.accent}`, borderRadius: 10, padding: 16, background: '#fff' }}>
            <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, color: b.accent, marginBottom: 8 }}>{b.grade}</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, lineHeight: 1.5 }}>
              {b.questions.map((q, i) => <li key={i} style={{ marginBottom: 3 }}>{q}</li>)}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  // ── Главная страница раздела ──────────────────────────────────
  function TeacherToolsPage() {
    const [print, setPrint] = tS(null); // 'signal' | 'bank' | 'beacon'
    const [grade, setGrade] = tS(0);
    const SectionTitle = ({ n, eyebrow, title }) => (
      <header style={{ marginBottom: 14 }}>
        <p className="mmm-eyebrow">{eyebrow}</p>
        <h2 className="mmm-h2" style={{ fontSize: 23, margin: 0 }}>
          <span style={{ color: 'var(--terra)', fontFamily: 'var(--serif)' }}>{n} · </span>{title}
        </h2>
      </header>
    );

    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--pad-lg)' }}>
        <header>
          <p className="mmm-eyebrow">Методкабинет · инструменты учителя</p>
          <h1 className="mmm-h1">Сквозные инструменты курса</h1>
          <p className="mmm-lead">
            При всём различии методических решений по классам курс удерживает четыре инвариантных элемента,
            обеспечивающих его единство. Их используют на каждом занятии во всех параллелях.
          </p>
        </header>

        {/* 1 · Сигнальная карточка */}
        <section className="mmm-card" style={{ padding: 26 }}>
          <SectionTitle n="1" eyebrow="Самооценка и обратная связь" title="Сигнальная карточка" />
          <p className="mmm-body" style={{ maxWidth: '64ch' }}>
            На завершающем этапе каждого занятия ребёнок выбирает один из трёх цветов, оценивая своё понимание.
            Педагог фиксирует распределение по группе и опирается на него, планируя следующее занятие.
            Инструмент формирует навык самооценки и даёт оперативную обратную связь без письменного контроля.
          </p>
          <div className="mmm-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginTop: 16 }}>
            {SIGNALS.map((s) => (
              <div key={s.name} className="mmm-card" style={{ borderLeft: `4px solid ${s.color}`, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: s.color, flex: '0 0 auto' }} />
                  <b style={{ fontFamily: 'var(--serif)', fontSize: 16 }}>{s.name}</b>
                </div>
                <p style={{ margin: '0 0 8px', fontSize: 13.5, fontStyle: 'italic', color: 'var(--ink)' }}>«{s.child}»</p>
                <p className="mmm-body" style={{ margin: 0, fontSize: 12.5, color: 'var(--ink-soft)' }}>{s.action}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: 14, background: 'var(--paper-2)', borderRadius: 8 }}>
            <p className="mmm-eyebrow" style={{ margin: '0 0 6px' }}>Что показывает анализ за год</p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.55, color: 'var(--ink-soft)' }}>
              {SIGNAL_EFFECTS.map((e, i) => <li key={i} style={{ marginBottom: 4 }}>{e}</li>)}
            </ul>
          </div>
          <div style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="mmm-btn terra" onClick={() => setPrint('signal')}>⎙ Распечатать карточки</button>
            <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>плотная бумага, три цветных поля ~7×5 см под нарезку</span>
          </div>
        </section>

        {/* 2 · Банк открытых вопросов */}
        <section className="mmm-card" style={{ padding: 26 }}>
          <SectionTitle n="2" eyebrow="Незавершённость как норма" title="Банк открытых вопросов" />
          <p className="mmm-body" style={{ maxWidth: '64ch' }}>
            Лист или доска в каждой группе, куда дети записывают вопросы, на которые пока нет ответа.
            Открытый вопрос — не пробел, а ценность; он может стать темой следующего занятия или войти
            в модуль «Своя задача».
          </p>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {BANK_PURPOSE.map((p, i) => (
              <div key={i} className="mmm-card" style={{ padding: 14, fontSize: 13 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--olive)', marginBottom: 4 }}>задача {i + 1}</div>
                <p className="mmm-body" style={{ margin: 0, fontSize: 12.5 }}>{p}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: 16, background: 'var(--paper-2)', borderRadius: 8 }}>
            <p className="mmm-eyebrow" style={{ margin: '0 0 8px' }}>Примеры вопросов из апробации</p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink)' }}>
              {BANK_EXAMPLES.map((q, i) => <li key={i} style={{ marginBottom: 4 }}>{q}</li>)}
            </ul>
          </div>
          <div style={{ marginTop: 14 }}>
            <button className="mmm-btn terra" onClick={() => setPrint('bank')}>⎙ Распечатать бланк</button>
          </div>
        </section>

        {/* 3 · Карточки-маяки */}
        <section className="mmm-card" style={{ padding: 26 }}>
          <SectionTitle n="3" eyebrow="Предсказуемый язык занятий" title="Карточки-маяки для педагога" />
          <p className="mmm-body" style={{ maxWidth: '64ch' }}>
            Наборы вопросов-ориентиров для каждой параллели. Они напоминают педагогу не давать ответ вместо
            ребёнка и создают предсказуемый язык занятий: дети привыкают к этим вопросам и со временем задают
            их себе сами. Набор усложняется от класса к классу по оси «нарратив → проблемность».
          </p>
          <div style={{ display: 'flex', gap: 6, margin: '16px 0 14px', flexWrap: 'wrap' }}>
            {BEACONS.map((b, i) => (
              <button key={b.grade} className={`mmm-chip ${grade === i ? 'active' : ''}`} onClick={() => setGrade(i)}
                style={grade === i ? { borderColor: b.accent, color: b.accent } : {}}>{b.grade}</button>
            ))}
          </div>
          <div className="mmm-card" style={{ borderLeft: `4px solid ${BEACONS[grade].accent}`, padding: 18 }}>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14.5, lineHeight: 1.7, color: 'var(--ink)' }}>
              {BEACONS[grade].questions.map((q, i) => <li key={i} style={{ marginBottom: 4 }}>{q}</li>)}
            </ul>
          </div>
          <div style={{ marginTop: 16, padding: '16px 18px', borderRadius: 10, background: 'linear-gradient(135deg, #fdfaee 0%, #ece4cc 100%)', border: '1px solid var(--line)' }}>
            <p className="mmm-eyebrow" style={{ margin: '0 0 4px' }}>Сквозной принцип всех наборов</p>
            <p style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>«{BEACON_PRINCIPLE}»</p>
          </div>
          <div style={{ marginTop: 14 }}>
            <button className="mmm-btn terra" onClick={() => setPrint('beacon')}>⎙ Распечатать все наборы</button>
          </div>
        </section>

        {/* 4 · Модуль «Своя задача» */}
        <section className="mmm-card" style={{ padding: 26 }}>
          <SectionTitle n="4" eyebrow="Постановка проблемы" title="Модуль «Своя задача»" />
          <p className="mmm-body" style={{ maxWidth: '64ch' }}>
            В конце каждого полугодия последние 2–3 занятия дети сочиняют собственную нестандартную задачу
            и предлагают её другой группе. Это развивает метапредметное умение — постановку проблемы, —
            которое в традиционном обучении почти не формируется. Лучшие задачи включаются в банк курса
            на следующий год.
          </p>
          <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="mmm-tag olive">развивает К5 · рефлексивный</span>
            <span className="mmm-tag mustard">2–3 занятия в конце полугодия</span>
            <span className="mmm-tag">лучшие задачи → банк курса</span>
          </div>
        </section>

        {print === 'signal' && (
          <PrintArea title="Сигнальная карточка самооценки" hint="Распечатайте, наклейте на плотную бумагу и разрежьте по пунктиру. На каждого ученика — комплект из трёх карточек." onClose={() => setPrint(null)}>
            <SignalPrintSheet />
          </PrintArea>
        )}
        {print === 'bank' && (
          <PrintArea title="Банк открытых вопросов" hint="Лист для группы. Заполняется в течение всего курса; статус каждого вопроса обновляется по мере работы." onClose={() => setPrint(null)}>
            <BankPrintSheet />
          </PrintArea>
        )}
        {print === 'beacon' && (
          <PrintArea title="Карточки-маяки для педагога" hint="Четыре набора по классам. Разрежьте по пунктиру и держите под рукой на занятии." onClose={() => setPrint(null)}>
            <BeaconPrintSheet />
            <p style={{ marginTop: 18, fontFamily: 'var(--serif)', fontSize: 16, fontStyle: 'italic', textAlign: 'center' }}>«{BEACON_PRINCIPLE}»</p>
          </PrintArea>
        )}
      </div>
    );
  }

  window.MMM_TEACHER_TOOLS = { TeacherToolsPage };
})();
