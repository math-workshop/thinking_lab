// Олимпиада «Квадрига» 2023-2024 — задача «Амбар Олимпии»
// Геометрия + логистика в древнегреческих единицах (пус, пехий, талант).
// Два режима через role: ученик решает сам + раскрывает разбор; учитель
// видит методические комментарии и полный ход решения.
(function () {
  const { useState: aS } = React;

  // ── Единицы и блоки ──────────────────────────────────
  const PUS_CM = 30;            // 1 пус = 30 см
  const PEHIY_CM = 45;          // 1 пехий = 45 см  →  1 пехий = 1.5 пуса

  const BLOCKS = [
    { id: 'big',  label: 'Большой', mass: '4 таланта',        dims: 'куб 2 × 2 × 2 пуса',          vol: '8 куб. пусов',    fill: '#c98a5e', stroke: '#8a5230', tier: 'Нижний ярус' },
    { id: 'med',  label: 'Средний', mass: '1 талант',          dims: '1 × 1 × 2 пуса',              vol: '2 куб. пуса',     fill: '#9aa86a', stroke: '#5a6a32', tier: 'Средний ярус' },
    { id: 'small',label: 'Малый',   mass: '½ таланта',         dims: '1 × 1 пус × ½ пехия',         vol: '¾ куб. пуса',     fill: '#8fa0bc', stroke: '#54648a', tier: 'Верхний ярус' },
  ];

  // Геометрия амбара (из планов слоёв): кольцо стен, общий контур для всех ярусов.
  const PLAN = { outer: 10, inner: 6, wall: 2 };          // пусы
  const RING = PLAN.outer * PLAN.outer - PLAN.inner * PLAN.inner; // 64 кв. пуса
  const COUNTS = [
    { ...BLOCKS[0], tier: 'Нижний',  block: 'большие 4 т', per: 16, layers: 2, mass: 4 },
    { ...BLOCKS[1], tier: 'Средний', block: 'средние 1 т', per: 32, layers: 3, mass: 1 },
    { ...BLOCKS[2], tier: 'Верхний', block: 'малые ½ т',   per: 64, layers: 4, mass: 0.5 },
  ];
  const TOTAL_MASS = COUNTS.reduce((s, c) => s + c.per * c.layers * c.mass, 0); // 352 т
  const WALL_H = 4 + 3 + 3;  // высота стен, пусы

  // Извлечь первое число из ответа (для автопроверки)
  const numOf = (s) => { const m = String(s).replace(',', '.').match(/-?\d+(\.\d+)?/); return m ? parseFloat(m[0]) : NaN; };

  // ── Карточка справки: единицы + блоки ────────────────
  function ReferenceCard() {
    return (
      <div className="mmm-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <p className="mmm-eyebrow" style={{ margin: 0 }}>Древнегреческие меры</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            <span className="mmm-tag" style={{ fontFamily: 'var(--mono)' }}>1 пус = 30 см</span>
            <span className="mmm-tag" style={{ fontFamily: 'var(--mono)' }}>1 пехий = 45 см</span>
            <span className="mmm-tag terra" style={{ fontFamily: 'var(--mono)' }}>⇒ 1 пехий = 1,5 пуса</span>
            <span className="mmm-tag" style={{ fontFamily: 'var(--mono)' }}>повозка = 5 талантов · повозок 10</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          {BLOCKS.map(b => (
            <div key={b.id} style={{ border: `1px solid ${b.stroke}`, borderRadius: 8, padding: '10px 12px', background: '#fff', display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ flex: '0 0 auto', width: 26, height: 26, borderRadius: 4, background: b.fill, border: `1.5px solid ${b.stroke}` }}/>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: 14 }}>{b.label} камень · {b.mass}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{b.dims}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--mono)' }}>объём {b.vol}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Визуализация рядов постройки (фронтальная схема стены) ──
  // Схема ярусов: 2 ряда больших + 3 ряда средних + 4 ряда малых.
  function AmbarRows() {
    const PUS = 17;                  // px на 1 пус
    const wallPus = 12;              // ширина показанного фрагмента стены, пусов
    const W = wallPus * PUS;         // ширина стены
    const x0 = 96, baseY = 300;      // левый край и низ стены

    // высоты блоков по ярусам (в пусах) — для фронтальной схемы
    const hBig = 2, hMed = 1, hSmall = 0.75;
    const tiers = [
      { id: 'small', rows: 4, bw: 1,  bh: hSmall, ...BLOCKS[2] },
      { id: 'med',   rows: 3, bw: 2,  bh: hMed,   ...BLOCKS[1] },
      { id: 'big',   rows: 2, bw: 2,  bh: hBig,   ...BLOCKS[0] },
    ];

    // строим снизу вверх
    let y = baseY;
    const bands = [];
    [tiers[2], tiers[1], tiers[0]].forEach(t => {
      const rowH = t.bh * PUS;
      const cols = Math.round(wallPus / t.bw);
      const tierTop = y - t.rows * rowH;
      const blocks = [];
      for (let r = 0; r < t.rows; r++) {
        const ry = y - (r + 1) * rowH;
        // лёгкий сдвиг кладки через ряд
        const off = (r % 2) * (t.bw * PUS) / 2;
        for (let c = -1; c <= cols; c++) {
          const bx = x0 + off + c * t.bw * PUS;
          if (bx + t.bw * PUS <= x0 || bx >= x0 + W) continue;
          const left = Math.max(bx, x0);
          const right = Math.min(bx + t.bw * PUS, x0 + W);
          blocks.push(<rect key={`${t.id}-${r}-${c}`} x={left} y={ry} width={right - left} height={rowH} fill={t.fill} stroke={t.stroke} strokeWidth="1" />);
        }
      }
      bands.push({ t, top: tierTop, bottom: y, blocks, rowH });
      y = tierTop;
    });
    const topY = y;
    const totalH = baseY - topY;

    return (
      <div className="kv-scene" style={{ background: 'linear-gradient(180deg,#dfeaf2 0%,#dfeaf2 62%,#cdbd99 62%,#c2b08c 100%)', padding: 0, minHeight: 340 }}>
        <svg viewBox="-66 0 526 340" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-label="Схема ярусов амбара">
          {/* солнце Олимпии */}
          <circle cx="406" cy="46" r="20" fill="#f3c64a" opacity=".9" />

          {/* блоки стены */}
          {bands.map(b => <g key={b.t.id}>{b.blocks}</g>)}

          {/* проёмы: дверь и окно — поверх кладки, как вырезы */}
          {/* дверь 4×2 пехия = 6×3 пуса */}
          <rect x={x0 + W - 6 * PUS - 6} y={baseY - 3 * PUS} width={6 * PUS} height={3 * PUS} fill="#3a2c1a" opacity=".82" />
          <text x={x0 + W - 3 * PUS - 6} y={baseY - 3 * PUS / 2} fill="#fff" fontSize="8" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">дверь 4×2 пехия</text>
          {/* окно 3×3 пуса */}
          <rect x={x0 + 1.4 * PUS} y={baseY - totalH + hSmall * PUS * 4 + 0.6 * PUS} width={3 * PUS} height={3 * PUS} fill="#7a8aaa" opacity=".85" stroke="#3a2c1a" />
          <text x={x0 + 1.4 * PUS + 1.5 * PUS} y={baseY - totalH + hSmall * PUS * 4 + 0.6 * PUS + 1.5 * PUS} fill="#fff" fontSize="7" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">окно 3×3</text>

          {/* контур стены */}
          <rect x={x0} y={topY} width={W} height={totalH} fill="none" stroke="#3a2c1a" strokeWidth="2" />

          {/* фигурки-скобки ярусов слева */}
          {bands.map(b => {
            const midY = (b.top + b.bottom) / 2;
            return (
              <g key={'lab-' + b.t.id}>
                <line x1={x0 - 10} y1={b.top + 1} x2={x0 - 10} y2={b.bottom - 1} stroke={b.t.stroke} strokeWidth="2" />
                <line x1={x0 - 13} y1={b.top + 1} x2={x0 - 7} y2={b.top + 1} stroke={b.t.stroke} strokeWidth="2" />
                <line x1={x0 - 13} y1={b.bottom - 1} x2={x0 - 7} y2={b.bottom - 1} stroke={b.t.stroke} strokeWidth="2" />
                <text x={x0 - 16} y={midY - 4} fill={b.t.stroke} fontSize="9.5" fontFamily="var(--serif), serif" fontWeight="700" textAnchor="end">{b.t.tier}</text>
                <text x={x0 - 16} y={midY + 8} fill={b.t.stroke} fontSize="8.5" fontFamily="monospace" textAnchor="end">{b.t.rows} {b.t.rows < 5 ? (b.t.rows === 1 ? 'слой' : 'слоя') : 'слоёв'} · {b.t.mass}</text>
              </g>
            );
          })}

          {/* подпись «схема ярусов» */}
          <text x={x0 + W} y={baseY + 26} fill="#5a4a2a" fontSize="9" fontFamily="monospace" textAnchor="end">фронтальная схема ярусов · кладка стены без крыши</text>
        </svg>
      </div>
    );
  }

  // ── Карточка одного вопроса (с автопроверкой) ─────────
  function QuestionCard({ n, total, title, body, unit, check, answer, solution, teacher, role }) {
    const [val, setVal] = aS('');
    const [state, setState] = aS(null);   // 'ok' | 'wrong' | null
    const [reveal, setReveal] = aS(false);

    const submit = () => {
      if (!val.trim()) return;
      if (check(val)) { setState('ok'); setReveal(true); }
      else setState('wrong');
    };

    return (
      <div className="mmm-card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14, borderLeft: state === 'ok' ? '4px solid #5a7a4f' : '4px solid var(--terra)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <div>
            <p className="mmm-eyebrow" style={{ margin: 0 }}>Вопрос {n} из {total}</p>
            <h3 className="mmm-h3" style={{ margin: '4px 0 0' }}>{title}</h3>
          </div>
          {state === 'ok' && <span className="mmm-tag" style={{ background: '#5a7a4f', color: '#fff', borderColor: '#3a5a3a' }}>✓ верно</span>}
        </div>
        <p className="mmm-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55 }}>{body}</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <input className={`kv-input ${state === 'ok' ? 'correct' : state === 'wrong' ? 'wrong' : ''}`} type="text" value={val}
            onChange={e => { setVal(e.target.value); setState(null); }}
            onKeyDown={e => { if (e.key === 'Enter') submit(); }}
            placeholder={unit || 'Твой ответ…'} style={{ flex: '1 1 220px', minWidth: 180 }} disabled={state === 'ok'} />
          {state !== 'ok' && <button className="mmm-btn terra" onClick={submit}>Проверить →</button>}
          <button className="mmm-btn ghost" onClick={() => setReveal(r => !r)}>{reveal ? 'Скрыть решение' : 'Показать решение'}</button>
        </div>

        {state === 'ok' && <p className="kv-correct" style={{ margin: 0, fontSize: 14 }}>✓ {answer}</p>}
        {state === 'wrong' && <p style={{ margin: 0, fontSize: 13.5, color: '#b04a4a' }}>Пока не сходится — пересчитай или открой решение.</p>}

        {reveal && (
          <div className="kv-hint" style={{ padding: 14, background: 'var(--paper-2)', border: '1px dashed var(--line)', borderRadius: 6 }}>
            <p className="mmm-eyebrow" style={{ margin: 0 }}>Ход решения</p>
            <div style={{ margin: '6px 0 0', fontSize: 13.5, lineHeight: 1.55 }}>{solution}</div>
          </div>
        )}

        {role === 'teacher' && (
          <div style={{ padding: 14, background: '#eef1e2', border: '1px solid #c8d2a8', borderRadius: 6 }}>
            <p className="mmm-eyebrow" style={{ margin: 0, color: 'var(--olive)' }}>Методический комментарий</p>
            <div style={{ margin: '6px 0 0', fontSize: 13.5, lineHeight: 1.55 }}>{teacher}</div>
          </div>
        )}
      </div>
    );
  }

  // ── Страница задачи ───────────────────────────────────
  function AmbarPage({ role, onBack }) {
    const [dl, setDl] = aS(false);
    const pdf = (window.__resources && window.__resources.kvAmbarPdf) || 'kvadriga-ambar-task.pdf';
    const downloadPdf = async () => {
      if (dl) return; setDl(true);
      try {
        let url = pdf;
        if (!/^(blob:|data:)/.test(pdf)) {
          const r = await fetch(pdf); const b = await r.blob();
          url = URL.createObjectURL(new Blob([b], { type: 'application/pdf' }));
        }
        const a = document.createElement('a');
        a.href = url; a.download = 'ambar-olimpii-uslovie.pdf';
        document.body.appendChild(a); a.click(); a.remove();
        if (url !== pdf) setTimeout(() => URL.revokeObjectURL(url), 30000);
      } catch (e) { window.open(pdf, '_blank', 'noopener'); }
      finally { setDl(false); }
    };
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--pad-lg)' }}>
        {/* Шапка */}
        <header className="mmm-fade-up" style={{ background: 'linear-gradient(135deg, #ece3cf 0%, #d6c5a0 100%)', padding: '24px 200px 24px 26px', borderRadius: 12, border: '1.5px solid var(--line)', position: 'relative', overflow: 'hidden', minHeight: 180 }}>
          <img src="kvadriga-logo.png" alt="Логотип олимпиады «Квадрига»" style={{ position: 'absolute', right: 18, top: 18, width: 132, height: 132, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 10px rgba(60,40,20,.15)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <button className="mmm-btn ghost" onClick={onBack} style={{ fontSize: 12, padding: '4px 10px' }}>← К сезонам</button>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#7a5a28' }}>2023 / 2024</span>
          </div>
          <p className="mmm-eyebrow" style={{ color: '#7a5a28' }}>Олимпиада «Квадрига» · финал</p>
          <h1 className="mmm-h1" style={{ fontSize: 32, margin: '4px 0 8px', color: '#3a2c14' }}>Амбар Олимпии</h1>
          <p className="mmm-lead" style={{ margin: 0, fontSize: 15, color: '#3a2c14', maxWidth: '60ch' }}>
            Геометрия и логистика в древнегреческих единицах: рассчитать перевозку каменных блоков, внутренний объём и площадь стен амбара для даров Олимпиады.
          </p>
        </header>

        {/* Завязка истории */}
        <div className="mmm-card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 12, borderLeft: '4px solid var(--terra)' }}>
          <p className="mmm-eyebrow" style={{ margin: 0 }}>Завязка истории · Олимпия</p>
          <p className="mmm-body" style={{ margin: 0, fontSize: 15, lineHeight: 1.65 }}>
            Многие участники Олимпиады привозят с собой памятные дары, которые нужно где-то хранить до возложения в храмах. Для этих даров на территории Олимпии решено сложить каменный <b>амбар</b> — прямоугольный параллелепипед без крыши (крышу покроют шкурами животных).
          </p>
          <p className="mmm-body" style={{ margin: 0, fontSize: 15, lineHeight: 1.65 }}>
            Амбар складывают из каменных блоков тремя ярусами: нижний — из самых тяжёлых блоков по <b>4 таланта</b>, средний — по <b>1 таланту</b>, а под основание крыши — лёгкие блоки по <b>½ таланта</b>. Помоги строителям всё рассчитать.
          </p>
        </div>

        {/* Визуализация рядов */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p className="mmm-eyebrow" style={{ margin: 0 }}>Как сложен амбар · ряды кладки</p>
          <AmbarRows />
          <p style={{ fontSize: 12, color: 'var(--ink-mute)', margin: 0, fontStyle: 'italic' }}>
            Три яруса снизу вверх: 2 слоя больших блоков (4 т, по 16 в слое), 3 слоя средних (1 т, по 32), 4 слоя малых (½ т, по 64). Каждый слой — кольцо стен 10×10 пусов с пустой серединой 6×6.
          </p>
        </div>

        {/* Раскладка слоя (вид сверху) + размеры */}
        <div className="mmm-card" style={{ padding: 20, display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '0 0 auto' }}>
            <svg viewBox="0 0 224 224" width="200" height="200" aria-label="План слоя — вид сверху">
              {Array.from({ length: 10 }).flatMap((_, r) => Array.from({ length: 10 }).map((_, c) => {
                const inner = r >= 2 && r < 8 && c >= 2 && c < 8;
                return <rect key={r + '-' + c} x={12 + c * 20} y={12 + r * 20} width={20} height={20} fill={inner ? '#fbf7ef' : '#e0cba0'} stroke="#b89a64" strokeWidth="1" />;
              }))}
              <rect x={12} y={12} width={200} height={200} fill="none" stroke="#3a2c1a" strokeWidth="2" />
              <text x={112} y={120} fill="#9a8050" fontSize="11" fontFamily="monospace" textAnchor="middle">6 × 6</text>
              <text x={112} y={8} fill="#5a4a2a" fontSize="10" fontFamily="monospace" textAnchor="middle">10 пусов</text>
            </svg>
          </div>
          <div style={{ flex: '1 1 260px', minWidth: 240 }}>
            <p className="mmm-eyebrow" style={{ margin: 0 }}>Раскладка слоя (вид сверху) · размеры</p>
            <p className="mmm-body" style={{ margin: '6px 0 10px', fontSize: 13 }}>Стены кольцом: внешняя сторона <b>10 пусов</b>, толщина стены <b>2 пуса</b>, внутри пусто <b>6 × 6</b>. Площадь кольца — 64 кв. пуса, поэтому в слое помещается ровно столько блоков, сколько их оснований укладывается в эти 64 кв. пуса.</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead><tr style={{ color: 'var(--ink-mute)', textAlign: 'left' }}><th style={{ padding: '2px 6px' }}>Ярус</th><th style={{ padding: '2px 6px' }}>В слое</th><th style={{ padding: '2px 6px' }}>Слоёв</th><th style={{ padding: '2px 6px' }}>Блоков</th><th style={{ padding: '2px 6px' }}>Масса</th></tr></thead>
              <tbody>
                {COUNTS.map(c => (
                  <tr key={c.tier} style={{ borderTop: '1px solid var(--line-soft)' }}>
                    <td style={{ padding: '3px 6px', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 2, background: c.fill, border: `1px solid ${c.stroke}` }} />{c.tier}</td>
                    <td style={{ padding: '3px 6px', fontFamily: 'var(--mono)' }}>{c.per}</td>
                    <td style={{ padding: '3px 6px', fontFamily: 'var(--mono)' }}>{c.layers}</td>
                    <td style={{ padding: '3px 6px', fontFamily: 'var(--mono)' }}>{c.per * c.layers}</td>
                    <td style={{ padding: '3px 6px', fontFamily: 'var(--mono)' }}>{c.per * c.layers * c.mass} т</td>
                  </tr>
                ))}
                <tr style={{ borderTop: '2px solid var(--line)', fontWeight: 700 }}>
                  <td style={{ padding: '3px 6px' }} colSpan={3}>Итого</td>
                  <td style={{ padding: '3px 6px', fontFamily: 'var(--mono)' }}>{COUNTS.reduce((s, c) => s + c.per * c.layers, 0)}</td>
                  <td style={{ padding: '3px 6px', fontFamily: 'var(--mono)' }}>{TOTAL_MASS} т</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Справка */}
        <ReferenceCard />

        {/* Вопросы */}
        <QuestionCard
          n={1} total={3} role={role}
          unit="число поездок"
          check={(v) => { const x = numOf(v); return x === 71; }}
          answer="71 поездка: девять повозок съездят по 7 раз, десятая — 8 раз."
          title="Перевозка материала"
          body="Найдите минимальное количество поездок, которые сделают все повозки, и укажите, как именно нужно загружать повозки. Одна повозка перевозит 5 талантов за раз, повозок — 10."
          solution={(
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span>1. Считаем блоки и массу по ярусам: нижний 16 × 2 = 32 блока × 4 т = <b>128 т</b>; средний 32 × 3 = 96 × 1 т = <b>96 т</b>; верхний 64 × 4 = 256 × ½ т = <b>128 т</b>.</span>
              <span>2. Суммарная масса = 128 + 96 + 128 = <b>352 таланта</b>.</span>
              <span>3. Повозка берёт 5 талантов. 352 ÷ 5 = 70,4 → округляем вверх: нужно <b>71 поездка</b>. При 10 повозках это значит: девять повозок делают по 7 рейсов, десятая — 8.</span>
              <span>4. Как грузить без потерь: 32 повозки — «большой + средний» (4 + 1 = 5 т). Остальное добиваем ровно до 5: например, 4 камня по 1 т + два по ½ т = 5 т. Так каждая повозка (кроме последней с остатком) идёт полной.</span>
            </div>
          )}
          teacher={(
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span>Развивает <b>К2</b> (комбинаторно-стратегический): не «сколько всего», а «как упаковать без потерь» — разложить 5 на слагаемые из {`{4, 1, ½}`}, чтобы повозки не шли недогруженными.</span>
              <span>Частые ошибки: (1) забывают округлить 70,4 вверх; (2) дают только число поездок, но не схему загрузки — а в условии прямо просят «как именно загружать».</span>
              <span>Полезно подчеркнуть симметрию: нижний и верхний ярусы весят поровну (по 128 т) — хорошая проверка для самоконтроля.</span>
            </div>
          )}
        />

        <QuestionCard
          n={2} total={3} role={role}
          unit="кубических пусов"
          check={(v) => numOf(v) === 360}
          answer="360 кубических пусов."
          title="Внутренний объём амбара"
          body="Найдите внутренний объём амбара (выразите в кубических пусах или кубических пехиях)."
          solution={(
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span>1. Внутренний объём = площадь внутреннего основания × высоту амбара.</span>
              <span>2. Внутреннее основание — квадрат <b>6 × 6 пусов</b> (внешняя сторона 10 минус по 2 пуса стены с каждой стороны).</span>
              <span>3. Высота стен по ярусам: нижний 2 слоя × 2 пуса = <b>4 пуса</b>; средний 3 слоя × 1 пус = <b>3 пуса</b>; верхний 4 слоя × ½ пехия = 2 пехия = <b>3 пуса</b>. Всего 4 + 3 + 3 = <b>10 пусов</b>.</span>
              <span>4. Объём = 6 × 6 × 10 = <b>360 кубических пусов</b>.</span>
            </div>
          )}
          teacher={(
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span>Развивает <b>К3</b> (пространственный): надо отделить <i>внутренний</i> объём от внешнего габарита — учесть толщину стен со всех четырёх сторон.</span>
              <span>Частые ошибки: (1) берут внешние 10 × 10 вместо внутренних 6 × 6; (2) путают пус и пехий — полезно сразу зафиксировать 1 пехий = 1,5 пуса и считать высоту верхнего яруса как 2 пехия = ровно 3 пуса.</span>
            </div>
          )}
        />

        <QuestionCard
          n={3} total={3} role={role}
          unit="квадратных пусов"
          check={(v) => numOf(v) === 364}
          answer="364 квадратных пуса."
          title="Площадь внешних стен"
          body="Найдите площадь внешней (боковой) поверхности стен амбара. Учтите, что прорублены дверь 4 × 2 пехия и два окна 3 × 3 пуса. Выразите в квадратных пусах или квадратных пехиях."
          solution={(
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span>1. Сторона амбара — 10 пусов, высота — 10 пусов. Четыре стены без проёмов: 4 × 10 × 10 = <b>400 кв. пусов</b>.</span>
              <span>2. Дверь 4 × 2 пехия = 6 × 3 пуса = <b>18 кв. пусов</b> (1 пехий = 1,5 пуса).</span>
              <span>3. Два окна 3 × 3 пуса = 2 × 9 = <b>18 кв. пусов</b>.</span>
              <span>4. Площадь стен = 400 − 18 − 18 = <b>364 квадратных пуса</b>.</span>
            </div>
          )}
          teacher={(
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span>Развивает <b>К1</b> и <b>К3</b>: аккуратный учёт «вычесть проёмы» и перевод площадей. Крыши нет — считаем именно боковую поверхность, верх не учитываем.</span>
              <span>Частая ошибка — переводить площадь линейным коэффициентом 1,5 вместо 1,5² = 2,25. Здесь дверь удобнее сразу перевести в пусы (6 × 3), чтобы не путаться.</span>
            </div>
          )}
        />

        {/* Подвал — оригинал и комментарий */}
        {role === 'teacher' ? (
          <div className="mmm-card" style={{ padding: 18, background: 'var(--paper-2)', borderLeft: '3px solid var(--olive)' }}>
            <p className="mmm-eyebrow" style={{ margin: 0 }}>Учителю</p>
            <p className="mmm-body" style={{ margin: '6px 0 10px', fontSize: 13.5, lineHeight: 1.5 }}>
              Задача объединяет три навыка: стратегическую упаковку (логистика повозок), пространственное мышление (внутренний объём через толщину стен) и работу с единицами измерения (перевод пус↔пехий в длинах, площадях и объёмах). Ответы: <b>1)</b> 71 поездка; <b>2)</b> 360 куб. пусов; <b>3)</b> 364 кв. пуса.
            </p>
            <button className="mmm-btn ghost" onClick={downloadPdf} disabled={dl} style={{ fontSize: 13, padding: '8px 14px', cursor: dl ? 'default' : 'pointer', font: 'inherit' }}>{dl ? 'Готовлю файл…' : '⤓ Условие задачи · планы слоёв (PDF)'}</button>
          </div>
        ) : (
          <div className="mmm-card" style={{ padding: 18, background: 'linear-gradient(135deg,#ece3cf 0%,#dccba6 100%)', textAlign: 'center' }}>
            <p className="mmm-body" style={{ margin: 0, fontSize: 14 }}>Реши все три вопроса и нажми «Проверить». Не получается — открой «Показать решение» и разбери ход по шагам.</p>
          </div>
        )}
      </div>
    );
  }

  window.MMM_AMBAR = { AmbarPage };
})();
