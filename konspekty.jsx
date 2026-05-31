// ════════════════════════════════════════════════════════
// КОНСПЕКТЫ ЗАНЯТИЙ — библиотека для учителя
// Краткая «распаковка» на экране (о занятии · центральная идея ·
// цели К1–К5 · ход занятия) + ссылка на печатный конспект (PDF).
// ════════════════════════════════════════════════════════
(function () {
  const { useState: kS } = React;

  // PDF-конспекты лежат в konspekty/pdf/<slug>.pdf (оригинальные файлы, без изменений)
  const pdfUrl = (slug) => (window.__resources && window.__resources['konspektPdf_' + slug]) || ('konspekty/pdf/' + slug + '.pdf');

  // ── Готовые конспекты ──────────────────────────────────
  const KONSPEKTY = [
    {
      slug: 'shop', ready: true,
      title: 'Волшебный магазин',
      sub: 'Нарративное занятие · три возрастные версии задач',
      type: 'narrative', typeLabel: 'Нарративное', crosscutting: true,
      classes: [1, 2, 3, 4], duration: '40 мин', group: 'малая группа 6–8',
      modules: ['M2', 'M3', 'M4'], components: ['K1', 'K2', 'K3', 'K4', 'K5'],
      accent: '#9a4a6a', soft: '#f6eaf0',
      idea: 'Сквозной сюжет: дети подменяют двух драконов в волшебном магазине, пока те улетели по делам. Пять задач-эпизодов, каждая в трёх возрастных версиях. Сюжет снимает оценочный контекст — ребёнок не «решает задачу», а «выручает друга».',
      about: 'Нарративное занятие с тремя возрастными версиями (1 / 2 / 3–4 классы), которые сменяют друг друга на этапах сюжета. Подходит для смешанной малой группы: младшие начинают со своей версии и могут присоединиться к разбору более сложной.',
      equipment: 'Распечатанные иллюстрации; листы в клеточку; цветные карандаши (тёмный и светлый для шоколадки); фишки или счётные палочки.',
      goals: [
        { k: 'K3', t: 'пространственное представление — задачи о двери и волшебных палочках' },
        { k: 'K1', t: 'логические условия и арифметика — заказ яблок, четыре гнома' },
        { k: 'K2', t: 'перебор и стратегия — принцип Дирихле, шоколадка' },
        { k: 'K4', t: 'доказать, что нашли все варианты / что достигнут максимум' },
        { k: 'K5', t: 'нарратив «мы заменяем драконов» включает ответственность за результат' },
      ],
      flow: [
        { n: 1, t: 'Дверь без ключа', d: 'точки и прямые: пройти по 3 прямым через 4 камешка', c: ['K3', 'K4'] },
        { n: 2, t: 'Заказ яблок', d: 'умножение у младших · принцип Дирихле у старших', c: ['K1', 'K2'] },
        { n: 3, t: 'Четыре гнома', d: 'логические условия + арифметика, запись условий по пунктам', c: ['K1'] },
        { n: 4, t: 'Волшебная шоколадка', d: 'максимум независимого множества на решётке', c: ['K2', 'K3', 'K4'] },
        { n: 5, t: 'Волшебные палочки', d: 'конфигурации точек и прямых (звезда Давида)', c: ['K3'] },
      ],
    },
    {
      slug: 'bridges', ready: true,
      title: 'Семь мостов Кёнигсберга',
      sub: 'Урок-исследование · обход графа без отрыва карандаша',
      type: 'problem', typeLabel: 'Проблемное',
      classes: [3, 4], duration: '40 мин', group: 'класс',
      modules: ['M3', 'M5'], components: ['K1', 'K3', 'K4', 'K5'],
      accent: '#2a6f8a', soft: '#eaf2f6',
      idea: 'Граф можно обойти, пройдя по каждому ребру ровно один раз и вернувшись в начало (эйлеров цикл), только если у всех вершин чётные степени. Ровно две нечётные вершины — путь есть, но без возврата. Больше двух — обойти нельзя. Правило Эйлера (1736) — рождение теории графов.',
      about: 'Проблемный урок с элементами исследования. Дети не получают готовое правило — они открывают его сами, решая серию пробных графов, а в конце применяют к самой задаче о Кёнигсберге. Проходят путём, которым шёл Эйлер.',
      equipment: 'Доска и маркеры; карточки с 4 графами; карта мостов Кёнигсберга и схема графа; листы в клеточку и разноцветные карандаши.',
      goals: [
        { k: 'K1', t: 'связь свойства вершин (чётность степени) и свойства всего графа' },
        { k: 'K3', t: 'перевод реальной карты мостов в граф и обратно' },
        { k: 'K4', t: 'поиск закономерности на нескольких примерах с разным ответом' },
        { k: 'K5', t: 'узнавание одного правила в разных задачах и формулировках' },
      ],
      flow: [
        { n: 1, t: 'Легенда о семи мостах', d: 'настоящий вопрос: можно ли обойти все мосты по разу?', c: [] },
        { n: 2, t: 'Четыре пробных графа', d: 'конверт-домик, K₄, две петли, куб — где обход есть, где нет', c: ['K3', 'K4'] },
        { n: 3, t: 'Открытие правила Эйлера', d: 'таблица: число нечётных вершин → можно ли обойти', c: ['K1', 'K5'] },
        { n: 4, t: 'Возвращение в Кёнигсберг', d: 'все 4 вершины нечётные → обойти невозможно', c: ['K1', 'K3'] },
      ],
    },
    {
      slug: 'win', ready: true,
      title: 'Как выигрывать всегда',
      sub: 'Урок-исследование · симметричная стратегия и выигрышная позиция',
      type: 'research', typeLabel: 'Исследовательское',
      classes: [4], duration: '40 мин', group: 'класс',
      modules: ['M5'], components: ['K1', 'K2', 'K3', 'K4', 'K5'],
      accent: '#8a5a18', soft: '#f6efe2',
      idea: 'В играх с полной информацией для двоих исход при правильной игре определён заранее. Урок проходит через три механизма: инвариант чётности, симметричная стратегия, создание симметрии первым ходом — и анализ выигрышных и проигрышных позиций.',
      about: 'Проблемный урок с элементами исследования. Каждую задачу сначала играют (в парах или против учителя), и только потом обсуждают, что именно происходило. К концу дети владеют не одним приёмом, а тремя — и понимают, какой к какой задаче.',
      equipment: 'Доска и маркеры; карточки задач; шахматные доски и фигуры (слоны, ладьи); бумажные ромашки на 12 и 11 лепестков; иллюстрации позиций.',
      goals: [
        { k: 'K1', t: 'построение и проверка стратегии, обоснование «почему всегда работает»' },
        { k: 'K2', t: 'поиск ответа на «как нужно ходить, чтобы выиграть»' },
        { k: 'K3', t: 'распознавание симметрии в позиции и в действиях' },
        { k: 'K4', t: 'переход от «давайте сыграем» к «как объяснить, почему так»' },
        { k: 'K5', t: 'узнавание одной идеи (симметрии) в разных сюжетах' },
      ],
      flow: [
        { n: 1, t: 'Шоколадка', d: 'инвариант чётности: исход не зависит от ходов', c: ['K1'] },
        { n: 2, t: 'Слоны на доске', d: 'симметричная (зеркальная) стратегия', c: ['K2', 'K3'] },
        { n: 3, t: 'Ромашка из 12 лепестков', d: 'та же идея симметрии в чистом виде', c: ['K3'] },
        { n: 4, t: 'Ромашка из 11 лепестков', d: 'создать симметрию первым ходом', c: ['K1', 'K2'] },
        { n: 5, t: 'Хромая ладья', d: 'выигрышные и проигрышные позиции', c: ['K1', 'K4'] },
      ],
    },
    {
      slug: 'invariants', ready: true,
      title: 'Что не меняется',
      sub: 'Проблемный урок · поиск инварианта',
      type: 'problem', typeLabel: 'Проблемное',
      classes: [4], duration: '40 мин', group: 'класс',
      modules: ['M5'], components: ['K1', 'K4', 'K5'],
      accent: '#5a6b2f', soft: '#eef1e2',
      idea: 'Чтобы доказать, что переход из одного состояния в другое невозможен, перебор не нужен — достаточно найти величину, которая не меняется ни при какой операции (инвариант). Если у начального и конечного состояний она разная — переход невозможен; если одинаковая — результат предсказуем. Урок показывает три вида инвариантов: чётность количества, остаток от деления и сумму.',
      about: 'Проблемный урок в технологии Матюшкина–Махмутова. Приём не даётся как готовый рецепт — дети встречают его в конкретном затруднении (лампочки, которые не получается погасить) и сами выходят к идее «а что здесь не меняется?». К третьей задаче они уже задают этот вопрос себе сами — в этом главный успех урока.',
      equipment: 'Доска и маркеры (или магнитные значки «лампочка горит/не горит»); листы и карандаши у каждого ребёнка; длинная числовая полоса с делениями для задачи про кузнечика.',
      goals: [
        { k: 'K1', t: 'построение строгого рассуждения через инвариант, доказательство от противного' },
        { k: 'K4', t: 'поиск величины, которая не меняется при допустимых операциях' },
        { k: 'K5', t: 'выделение приёма «инвариант» как универсального инструмента' },
      ],
      flow: [
        { n: 1, t: 'Три лампочки', d: 'инвариант чётности количества: погасить все нельзя', c: ['K4', 'K1'] },
        { n: 2, t: 'Введение термина «инвариант»', d: 'что это и как им доказывать', c: ['K5'] },
        { n: 3, t: 'Кузнечик на прямой', d: 'инвариант — остаток от деления на 3', c: ['K1', 'K4'] },
        { n: 4, t: 'Числа на доске', d: 'инвариант суммы: результат всегда 15', c: ['K4'] },
        { n: 5, t: 'Схема работы с инвариантом', d: 'рефлексия: «а что не меняется?»', c: ['K5'] },
      ],
    },
    {
      slug: 'hippo', ready: true,
      title: 'Рассеянный Бегемот',
      sub: 'Нарративное занятие · три возрастные версии задач',
      type: 'narrative', typeLabel: 'Нарративное', crosscutting: true,
      classes: [1, 2, 3, 4], duration: '40–45 мин', group: 'малая группа 6–8',
      modules: ['M2', 'M3', 'M4'], components: ['K1', 'K2', 'K3', 'K4', 'K5'],
      accent: '#3f6f6a', soft: '#e6f0ee',
      idea: 'Сквозной сюжет: рассеянный Бегемот идёт на день рождения к Змее и по дороге попадает в шесть ситуаций — группа помогает ему решить каждую. Логика, арифметика, геометрия и комбинаторика нанизаны на одну историю; Бегемот специально показан рассеянным, чтобы роль ребёнка-помощника была естественной.',
      about: 'Нарративное занятие (по Брунеру) с тремя возрастными версиями задач (1 / 2 / 3–4 классы), которые сменяют друг друга на этапах сюжета. Формат малой группы 6–8 человек; подходит и для смешанной группы, и для параллельных классов с минимальной адаптацией.',
      equipment: 'Распечатанные иллюстрации; лист для каждого ребёнка; цветные карандаши; кубики или счётные палочки для моделирования задачи о цепочке.',
      goals: [
        { k: 'K1', t: 'логические условия и арифметика — номер квартиры, этаж, сломанный лифт' },
        { k: 'K2', t: 'комбинаторика на максимум/минимум — столы, принцип крайнего' },
        { k: 'K3', t: 'пространственное доказательство через разрезание — торт' },
        { k: 'K4', t: 'обоснование ответов во всех задачах' },
        { k: 'K5', t: 'обращение к группе за помощью как заданный нарративом приём' },
      ],
      flow: [
        { n: 1, t: 'Номер квартиры', d: 'число с условиями · ребус у старших', c: ['K1'] },
        { n: 2, t: 'Этаж', d: 'логико-арифметическая модель «квартир на этаже»', c: ['K1'] },
        { n: 3, t: 'Сломанный лифт', d: 'алгоритм на процесс, разные числа', c: ['K1', 'K5'] },
        { n: 4, t: 'Торт', d: 'доказательство поровну через разрезание', c: ['K3', 'K4'] },
        { n: 5, t: 'Столы', d: 'комбинаторика на максимум: отдельно или в ряд', c: ['K2'] },
        { n: 6, t: 'Цепочка гусеницы', d: 'принцип крайнего: как собрать за минимум', c: ['K2'] },
      ],
    },
  ];

  const TOTAL = 20;
  const READY_COUNT = KONSPEKTY.length;
  // заглушки «скоро» до полного комплекта в 20 конспектов
  const PLANNED = Array.from({ length: TOTAL - READY_COUNT }, (_, i) => ({ ready: false, idx: i + READY_COUNT + 1 }));
  const ALL = KONSPEKTY.concat(PLANNED);

  const compOf = (id) => window.MMM_DATA.COMPONENTS.find(c => c.id === id);
  const moduleOf = (id) => window.MMM_DATA.MODULES.find(m => m.id === id);

  // ── Чип компонента К1–К5 ──
  function CompChip({ id, small }) {
    const c = compOf(id); if (!c) return null;
    return (
      <span className="mmm-tag" style={{ borderColor: c.color, color: c.color, fontSize: small ? 10 : 11, padding: small ? '2px 7px' : '3px 9px' }} title={c.full}>{c.id}</span>
    );
  }

  // ── Карточка конспекта в библиотеке ──
  function KonspektCard({ k, onOpen }) {
    if (!k.ready) {
      return (
        <div className="mmm-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 8, opacity: .55, borderStyle: 'dashed' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-mute)' }}>№{k.idx} / {TOTAL}</span>
            <span className="mmm-tag" style={{ fontSize: 10 }}>скоро</span>
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 15, color: 'var(--ink-mute)' }}>Конспект готовится</div>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-mute)' }}>Появится в ближайшем обновлении.</p>
        </div>
      );
    }
    return (
      <button className="mmm-card" onClick={onOpen} style={{ cursor: 'pointer', font: 'inherit', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10, padding: 18, borderTop: `3px solid ${k.accent}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <span className="mmm-tag" style={{ background: k.soft, borderColor: k.accent, color: k.accent, fontSize: 11 }}>{k.typeLabel}</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-mute)' }}>{k.classes.length > 2 ? `${k.classes[0]}–${k.classes[k.classes.length - 1]} кл` : k.classes.map(c => c).join(', ') + ' кл'} · {k.duration}</span>
        </div>
        <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: 19, fontWeight: 700, lineHeight: 1.15 }}>{k.title}</h3>
        <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ink-soft)', fontStyle: 'italic', lineHeight: 1.4 }}>{k.sub}</p>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 6 }}>
          {k.components.map(cid => <CompChip key={cid} id={cid} small />)}
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {k.modules.map(mid => <span key={mid} className="mmm-tag mustard" style={{ fontSize: 10 }}>{mid}</span>)}
          {k.crosscutting && <span className="mmm-tag" style={{ fontSize: 10, fontStyle: 'italic' }}>сквозной</span>}
        </div>
      </button>
    );
  }

  // ── Разворот конспекта (краткая распаковка) ──
  function KonspektDetail({ k, onClose }) {
    const printUrl = pdfUrl(k.slug);
    const [busy, setBusy] = kS(null); // 'dl' | 'print' | null

    // Скачивание через blob: относительный URL в песочнице предпросмотра
    // не резолвится при клике по <a download>, поэтому сначала тянем файл в память.
    async function getBlobUrl() {
      if (/^(blob:|data:)/.test(printUrl)) return printUrl;
      const r = await fetch(printUrl);
      if (!r.ok) throw new Error('http ' + r.status);
      const b = await r.blob();
      return URL.createObjectURL(new Blob([b], { type: 'application/pdf' }));
    }
    async function doDownload() {
      if (busy) return; setBusy('dl');
      try {
        const url = await getBlobUrl();
        const a = document.createElement('a');
        a.href = url; a.download = `${k.slug}-konspekt.pdf`;
        document.body.appendChild(a); a.click(); a.remove();
        if (url !== printUrl) setTimeout(() => URL.revokeObjectURL(url), 30000);
      } catch (e) {
        window.open(printUrl, '_blank', 'noopener');
      } finally { setBusy(null); }
    }
    async function doPrint() {
      if (busy) return; setBusy('print');
      try {
        const url = await getBlobUrl();
        const w = window.open(url, '_blank', 'noopener');
        if (!w) { // всплывающее окно заблокировано — хотя бы скачаем
          const a = document.createElement('a');
          a.href = url; a.download = `${k.slug}-konspekt.pdf`;
          document.body.appendChild(a); a.click(); a.remove();
        }
        if (url !== printUrl) setTimeout(() => URL.revokeObjectURL(url), 60000);
      } catch (e) {
        window.open(printUrl, '_blank', 'noopener');
      } finally { setBusy(null); }
    }
    return (
      <React.Fragment>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(40,30,20,.45)', zIndex: 100, display: 'grid', placeItems: 'center', padding: 20 }} onClick={onClose}>
        <div className="mmm-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 760, width: '100%', maxHeight: '92vh', overflow: 'auto', padding: 0, position: 'relative' }}>
          {/* Шапка */}
          <div style={{ background: k.soft, padding: '26px 30px 22px', borderBottom: `3px solid ${k.accent}`, position: 'sticky', top: 0, zIndex: 2 }}>
            <button onClick={onClose} className="mmm-chip" style={{ position: 'absolute', top: 16, right: 16, background: '#fff' }}>✕</button>
            <p className="mmm-eyebrow" style={{ color: k.accent, margin: 0 }}>Конспект занятия</p>
            <h2 className="mmm-h1" style={{ fontSize: 28, margin: '4px 0 6px', maxWidth: '90%' }}>{k.title}</h2>
            <p style={{ margin: 0, fontSize: 14.5, color: 'var(--ink-soft)', fontStyle: 'italic' }}>{k.sub}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
              <span className="mmm-tag" style={{ background: '#fff', borderColor: k.accent, color: k.accent }}>{k.typeLabel}</span>
              <span className="mmm-tag" style={{ background: '#fff' }}>{k.classes.length > 2 ? `${k.classes[0]}–${k.classes[k.classes.length - 1]} классы` : k.classes.join(', ') + ' класс'}</span>
              <span className="mmm-tag" style={{ background: '#fff' }}>{k.duration}</span>
              {k.modules.map(mid => { const m = moduleOf(mid); return <span key={mid} className="mmm-tag mustard" title={m ? m.title : ''}>{mid} · {m ? m.title : ''}</span>; })}
              {k.crosscutting && <span className="mmm-tag" style={{ fontStyle: 'italic' }}>сквозной</span>}
            </div>
          </div>

          <div style={{ padding: '24px 30px 30px', display: 'flex', flexDirection: 'column', gap: 22 }}>
            {/* О занятии */}
            <section>
              <p className="mmm-eyebrow">О занятии</p>
              <p className="mmm-body" style={{ margin: '4px 0 10px' }}>{k.about}</p>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'var(--ink-soft)', background: 'var(--paper-2, #f4f0e6)', padding: '10px 14px', borderRadius: 8 }}>
                <span style={{ flex: '0 0 auto', fontWeight: 700, color: 'var(--ink-mute)', fontSize: 12 }}>Оборудование</span>
                <span>{k.equipment}</span>
              </div>
            </section>

            {/* Центральная идея */}
            <section>
              <p className="mmm-eyebrow">Центральная математическая идея</p>
              <p className="mmm-body" style={{ margin: '4px 0 0', fontSize: 15, lineHeight: 1.6 }}>{k.idea}</p>
            </section>

            {/* Цели по компонентам */}
            <section>
              <p className="mmm-eyebrow">Что развивает · компоненты мышления</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 6 }}>
                {k.goals.map(g => {
                  const c = compOf(g.k);
                  return (
                    <div key={g.k} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                      <span className="mmm-tag" style={{ flex: '0 0 auto', borderColor: c.color, color: c.color, minWidth: 30, justifyContent: 'center' }}>{g.k}</span>
                      <span style={{ fontSize: 13.5, lineHeight: 1.45 }}><b style={{ color: c.color }}>{c.short}.</b> {g.t}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Ход занятия */}
            <section>
              <p className="mmm-eyebrow">Ход занятия</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 8 }}>
                {k.flow.map((s, i) => (
                  <div key={s.n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '10px 0', borderTop: i ? '1px solid var(--line)' : 'none' }}>
                    <span style={{ flex: '0 0 auto', width: 26, height: 26, borderRadius: '50%', background: k.soft, color: k.accent, display: 'grid', placeItems: 'center', fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700 }}>{s.n}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 14.5 }}>{s.t}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 1 }}>{s.d}</div>
                    </div>
                    <div style={{ flex: '0 0 auto', display: 'flex', gap: 3 }}>
                      {s.c.map(cid => <CompChip key={cid} id={cid} small />)}
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: 'var(--ink-mute)', margin: '10px 0 0', fontStyle: 'italic' }}>Полный ход с задачами, разборами и иллюстрациями — в печатном конспекте.</p>
            </section>

            {/* Действие */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: 18 }}>
              <button className="mmm-btn terra" onClick={doDownload} disabled={!!busy} style={{ border: 'none', cursor: busy ? 'default' : 'pointer', font: 'inherit', opacity: busy === 'dl' ? .7 : 1 }}>{busy === 'dl' ? 'Готовлю файл…' : 'Скачать конспект (PDF) ↓'}</button>
              <button className="mmm-btn ghost" onClick={doPrint} disabled={!!busy} style={{ cursor: busy ? 'default' : 'pointer', font: 'inherit' }}>{busy === 'print' ? 'Открываю…' : 'Открыть для печати ↗'}</button>
              <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>оригинальный PDF · с задачами, разборами и иллюстрациями</span>
            </div>
          </div>
        </div>
      </div>

      </React.Fragment>
    );
  }

  // ── Страница «Конспекты» ──
  function KonspektyPage() {
    const { MODULES, COMPONENTS } = window.MMM_DATA;
    const [mod, setMod] = kS(null);
    const [cls, setCls] = kS(null);
    const [type, setType] = kS(null);
    const [comp, setComp] = kS(null);
    const [open, setOpen] = kS(null);

    const ready = KONSPEKTY.filter(k => {
      if (mod && !k.modules.includes(mod)) return false;
      if (cls && !k.classes.includes(cls)) return false;
      if (type && k.type !== type) return false;
      if (comp && !k.components.includes(comp)) return false;
      return true;
    });
    const showPlanned = !mod && !cls && !type && !comp;
    const reset = () => { setMod(null); setCls(null); setType(null); setComp(null); };

    return (
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--pad-lg)' }}>
        <header>
          <p className="mmm-eyebrow">Учителю · готовые занятия</p>
          <h1 className="mmm-h1">Конспекты занятий</h1>
          <p className="mmm-lead" style={{ maxWidth: '64ch' }}>Полные конспекты уроков: о занятии, центральная идея, цели по К1–К5 и ход занятия. Каждый можно открыть как PDF для печати. Готово {READY_COUNT} из {TOTAL}.</p>
        </header>

        <div style={{ display: 'flex', gap: 'var(--pad-lg)' }}>
          <aside style={{ flex: '0 0 210px', display: 'flex', flexDirection: 'column', gap: 'var(--pad)', position: 'sticky', top: 0, alignSelf: 'flex-start' }}>
            <div>
              <h3 className="mmm-h3">Тип занятия</h3>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                <button className={`mmm-chip ${type === 'narrative' ? 'active' : ''}`} onClick={() => setType(type === 'narrative' ? null : 'narrative')}>Нарративное</button>
                <button className={`mmm-chip ${type === 'problem' ? 'active' : ''}`} onClick={() => setType(type === 'problem' ? null : 'problem')}>Проблемное</button>
                <button className={`mmm-chip ${type === 'research' ? 'active' : ''}`} onClick={() => setType(type === 'research' ? null : 'research')}>Исследовательское</button>
              </div>
            </div>
            <div>
              <h3 className="mmm-h3">Класс</h3>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {[1, 2, 3, 4].map(g => <button key={g} className={`mmm-chip ${cls === g ? 'active' : ''}`} onClick={() => setCls(cls === g ? null : g)}>{g} кл</button>)}
              </div>
            </div>
            <div>
              <h3 className="mmm-h3">Модуль</h3>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {MODULES.map(m => <button key={m.id} className={`mmm-chip ${mod === m.id ? 'active' : ''}`} onClick={() => setMod(mod === m.id ? null : m.id)} title={m.title}>{m.id}</button>)}
              </div>
            </div>
            <div>
              <h3 className="mmm-h3">Компонент мышления</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {COMPONENTS.map(c => <button key={c.id} className={`mmm-chip ${comp === c.id ? 'active' : ''}`} onClick={() => setComp(comp === c.id ? null : c.id)} style={{ borderColor: comp === c.id ? 'var(--ink)' : c.color, color: comp === c.id ? 'var(--paper)' : c.color, textAlign: 'left', justifyContent: 'flex-start' }} title={c.desc}>{c.id} · {c.short}</button>)}
              </div>
            </div>
            <button className="mmm-btn ghost" onClick={reset} style={{ width: '100%' }}>Сбросить</button>
          </aside>

          <main style={{ flex: '1 1 auto', minWidth: 0 }}>
            <div className="mmm-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
              {ready.map(k => <KonspektCard key={k.slug} k={k} onOpen={() => setOpen(k)} />)}
              {showPlanned && PLANNED.map(k => <KonspektCard key={'p' + k.idx} k={k} />)}
            </div>
            {ready.length === 0 && (
              <div className="mmm-card" style={{ textAlign: 'center', padding: 30, color: 'var(--ink-mute)' }}>
                Под эти фильтры пока нет готовых конспектов. <button className="mmm-chip" onClick={reset}>Сбросить</button>
              </div>
            )}
          </main>
        </div>

        {open && <KonspektDetail k={open} onClose={() => setOpen(null)} />}
      </div>
    );
  }

  // Конспекты по модулю — для встраивания на странице модуля
  function konspektsForModule(moduleId) {
    return KONSPEKTY.filter(k => k.modules.includes(moduleId));
  }

  window.MMM_KONSPEKTY = { KONSPEKTY, KonspektyPage, KonspektDetail, KonspektCard, konspektsForModule, READY_COUNT, TOTAL };
})();
