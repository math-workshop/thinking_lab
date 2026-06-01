// Олимпиада «Квадрига» 2024-2025 — задача «Острова пряностей» (Индонезия)
// Три части: эйлеров обход / гамильтонов цикл / расчёт встречи кораблей
// Интерактивная карта 10 островов с кликабельными стрелками-течениями.

const { useState: iS, useEffect: iE, useMemo: iM } = React;

// ──────────────────── ОСТРОВА ────────────────────
// Каждый остров — стилизованный SVG-силуэт + точка-«гавань» для соединений.
// viewBox: 1000 × 580 (16:9-ish)
const ISLANDS = [
  { id: 'sum', name: 'Суматра',        short: 'Сум',  hub: [65, 245], rx: 40, ry: 85,
    // длинный овальный остров, сдвинут к левому краю карты
    path: 'M 60 160 C 95 160 105 200 105 245 C 105 295 95 325 65 330 C 35 325 25 290 25 245 C 25 200 35 160 60 160 Z' },
  { id: 'kal', name: 'Калимантан',     short: 'Кал',  hub: [325, 215], rx: 88, ry: 88,
    path: 'M 250 140 Q 310 128 370 140 Q 410 160 408 215 Q 410 275 365 305 Q 320 320 275 305 Q 235 285 230 235 Q 240 165 250 140 Z' },
  { id: 'sul', name: 'Сулавеси',       short: 'Сул',  hub: [530, 260], rx: 70, ry: 95,
    path: 'M 495 145 L 525 145 L 530 200 L 575 180 L 595 195 L 560 220 L 575 265 L 610 285 L 600 305 L 560 300 L 540 340 L 510 335 L 515 285 L 480 300 L 470 285 L 505 260 L 490 205 L 495 145 Z' },
  { id: 'jav', name: 'Ява',            short: 'Ява',  hub: [390, 405], rx: 125, ry: 24,
    path: 'M 285 388 Q 355 376 425 384 Q 500 390 535 405 Q 528 425 478 425 Q 405 430 335 422 Q 290 418 285 405 Z' },
  { id: 'hal', name: 'Хальмахера',     short: 'Хал',  hub: [720, 130], rx: 38, ry: 65,
    path: 'M 700 70 L 720 70 L 725 120 L 755 105 L 765 120 L 740 140 L 750 180 L 735 195 L 720 170 L 705 200 L 690 190 L 705 150 L 695 120 L 700 70 Z' },
  { id: 'ser', name: 'Серам',          short: 'Сер',  hub: [725, 240], rx: 65, ry: 20,
    path: 'M 670 225 Q 725 215 780 225 Q 805 232 800 250 Q 770 260 725 257 Q 690 255 670 248 Z' },
  { id: 'ng',  name: 'Новая Гвинея',   short: 'Гв',   hub: [910, 295], rx: 82, ry: 82,
    path: 'M 835 215 Q 880 200 950 218 Q 985 238 980 290 Q 985 340 948 368 Q 905 382 855 368 Q 822 352 818 305 Q 818 250 835 215 Z' },
  { id: 'sba', name: 'Сумба',          short: 'Сба',  hub: [505, 495], rx: 44, ry: 16,
    path: 'M 465 480 Q 505 472 545 482 Q 558 492 540 502 Q 500 510 470 502 Q 455 495 465 480 Z' },
  { id: 'flr', name: 'Флорес',         short: 'Фл',   hub: [645, 485], rx: 58, ry: 16,
    path: 'M 590 470 Q 645 462 695 472 Q 712 480 695 492 Q 645 500 595 492 Q 580 485 590 470 Z' },
  { id: 'tim', name: 'Тимор',          short: 'Тим',  hub: [825, 505], rx: 60, ry: 17,
    path: 'M 770 488 Q 825 478 885 492 Q 902 502 875 512 Q 825 520 775 510 Q 762 502 770 488 Z' },
];
const ISLAND_BY_ID = Object.fromEntries(ISLANDS.map(i => [i.id, i]));

// Списки направлений (рёбра графа)
const EDGES_PART_I = [
  ['ng','kal'], ['kal','sum'], ['sum','ng'], ['ng','sul'], ['sul','kal'],
  ['jav','tim'], ['ng','jav'], ['tim','hal'], ['hal','ser'], ['ser','sba'],
  ['sba','flr'], ['flr','kal'], ['jav','ng'], ['sba','ng'], ['ser','ng'],
];
const EDGES_PART_II = [
  ['tim','ng'], ['sum','jav'], ['jav','kal'], ['hal','flr'], ['kal','sul'],
  ['sul','hal'], ['ng','sum'], ['flr','ser'], ['sba','tim'], ['ser','sba'],
  ['jav','sba'], ['kal','flr'], ['sum','sul'], ['sba','flr'], ['kal','ng'],
];

// Эллиптический «радиус» острова в направлении угла (радианы).
// Считает расстояние от центра эллипса (rx, ry) до его границы в направлении angle.
function ellipseR(rx, ry, angleRad) {
  const c = Math.cos(angleRad), s = Math.sin(angleRad);
  return 1 / Math.sqrt((c / rx) ** 2 + (s / ry) ** 2);
}

// ──────────────────── СТИЛИ ────────────────────
const INDO_CSS = `
@keyframes indo-fadein { from{opacity:0; transform:translateY(8px)} to{opacity:1; transform:none} }
@keyframes indo-dash   { to { stroke-dashoffset: -24; } }
@keyframes indo-pulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.18)} }
@keyframes indo-glow   { 0%,100%{opacity:.55} 50%{opacity:1} }
@keyframes indo-ship   { 0%{offset-distance:0%} 100%{offset-distance:100%} }
.indo-fade { animation: indo-fadein .4s ease-out; }
.indo-edge { transition: stroke .25s, stroke-width .25s, opacity .25s; cursor: pointer; }
.indo-edge:hover { filter: brightness(0.85); }
.indo-edge-dash { stroke-dasharray: 8 6; animation: indo-dash 0.9s linear infinite; }
.indo-edge-allowed-bg { animation: indo-glow 1.4s ease-in-out infinite; }
.indo-island { transition: fill .25s, filter .2s; cursor: pointer; }
.indo-island.hot { filter: drop-shadow(0 0 6px #f7c84a); }
.indo-pulse { animation: indo-pulse 1.4s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
.indo-tab { padding: 10px 16px; border-radius: 8px 8px 0 0; border:1.5px solid var(--line); border-bottom: none; background: var(--paper-2); color: var(--ink-mute); font-family: var(--serif); font-size: 15px; font-weight: 600; cursor: pointer; transition: background .2s, color .2s; }
.indo-tab.active { background: var(--paper); color: var(--ink); border-bottom: 2px solid var(--paper); position: relative; top: 1px; }
.indo-tab:hover:not(.active) { background: #ece4d2; color: var(--ink); }
.indo-tabbar { display:flex; gap: 4px; border-bottom: 1.5px solid var(--line); padding: 0 0 0 8px; }
.indo-tab-body { background: var(--paper); border:1.5px solid var(--line); border-top: none; border-radius: 0 8px 8px 8px; padding: 22px; }
.indo-stat { padding: 6px 12px; border-radius: 999px; background: var(--paper-2); border:1px solid var(--line); font-family: var(--mono); font-size: 12px; color: var(--ink-soft); }
.indo-stat.ok { background: #d8e8c8; color: #345520; border-color: #8aa860; }
.indo-stat.bad { background: #f4d8c8; color: #7a3a18; border-color: #c89a8a; }
`;

function useIndoStyles() {
  iE(() => {
    if (document.getElementById('indo-styles')) return;
    const s = document.createElement('style');
    s.id = 'indo-styles';
    s.textContent = INDO_CSS;
    document.head.appendChild(s);
  }, []);
}

// ──────────────────── ГЕОМЕТРИЯ СТРЕЛОК ────────────────────
// Строит изогнутую направленную стрелку «островА → островБ».
// curveOffset выгибает дугу, чтобы пары противоположных стрелок не накладывались.
function arcPath(p0, p1, curveOffset = 30) {
  const [x0, y0] = p0;
  const [x1, y1] = p1;
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;
  // нормаль к (p1-p0)
  const dx = x1 - x0, dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  const cx = mx + nx * curveOffset;
  const cy = my + ny * curveOffset;
  return { d: `M ${x0} ${y0} Q ${cx} ${cy} ${x1} ${y1}`, ctrl: [cx, cy] };
}

// Точка на квадратичной кривой Безье для t∈[0..1]
function bezPt(p0, ctrl, p1, t) {
  const it = 1 - t;
  return [
    it * it * p0[0] + 2 * it * t * ctrl[0] + t * t * p1[0],
    it * it * p0[1] + 2 * it * t * ctrl[1] + t * t * p1[1],
  ];
}

// Укорачиваем «начало» и «конец» отрезка на величины startCut/endCut от концов,
// чтобы стрелка не упиралась в центр острова, а ныряла прямо в его край.
function trimArc(p0, p1, curveOffset, startCut, endCut) {
  const { ctrl } = arcPath(p0, p1, curveOffset);
  // ищем t для каждого реза приблизительным методом — двигаемся вдоль кривой
  const totalLen = approxBezLen(p0, ctrl, p1, 24);
  const tStart = lengthToT(p0, ctrl, p1, startCut, totalLen);
  const tEnd   = 1 - lengthToT(p1, ctrl, p0, endCut, totalLen);
  const a = bezPt(p0, ctrl, p1, tStart);
  const b = bezPt(p0, ctrl, p1, tEnd);
  // тангенс в точке b — для стрелки
  const eps = 0.02;
  const bNext = bezPt(p0, ctrl, p1, Math.min(1, tEnd + eps));
  const tangent = [bNext[0] - b[0], bNext[1] - b[1]];
  return { a, b, ctrl, tangent };
}
function approxBezLen(p0, c, p1, steps) {
  let l = 0, prev = p0;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const p = bezPt(p0, c, p1, t);
    l += Math.hypot(p[0] - prev[0], p[1] - prev[1]);
    prev = p;
  }
  return l;
}
function lengthToT(p0, c, p1, targetLen, totalLen) {
  if (targetLen <= 0) return 0;
  if (targetLen >= totalLen) return 1;
  // равномерная выборка
  const steps = 40;
  let l = 0, prev = p0;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const p = bezPt(p0, c, p1, t);
    l += Math.hypot(p[0] - prev[0], p[1] - prev[1]);
    if (l >= targetLen) return t;
    prev = p;
  }
  return 1;
}

// Раскладываем рёбра по парам (a-b) → curveOffset с чередующимся знаком,
// чтобы стрелки одного направления и обратные не сливались.
function assignCurves(edges) {
  const pairCounter = new Map();
  return edges.map(([from, to]) => {
    const key = [from, to].sort().join('-');
    const sameDirKey = `${from}->${to}`;
    const idx = (pairCounter.get(key) || 0);
    pairCounter.set(key, idx + 1);
    // направление обхода: стрелки `from->to` выгибаются «вверх», `to->from` «вниз»
    const dir = (from < to) ? 1 : -1;
    const base = 36;
    const offset = dir * (base + idx * 22);
    return { from, to, offset };
  });
}

// ──────────────────── КАРТА ────────────────────
function IslandMap({ edges, traversed, currentNode, onEdgeClick, onIslandClick, allowedEdgeIdxs, visitedNodes, mode }) {
  // mode: 'euler' | 'hamilton'
  // traversed: Set<number> — индексы пройденных рёбер
  // allowedEdgeIdxs: Set<number> — индексы рёбер, доступных сейчас (из текущей вершины)
  // visitedNodes: Set<string> — посещённые острова (для Гамильтона)

  const curved = iM(() => assignCurves(edges), [edges]);

  return (
    <div style={{ position:'relative', background:'linear-gradient(180deg,#cfe6f2 0%,#bcdce8 70%,#c8d8c4 100%)', border:'1.5px solid var(--line)', borderRadius: 10, overflow:'hidden' }}>
      <svg viewBox="0 0 1000 580" width="100%" style={{ display:'block', maxHeight: 560 }}>
        <defs>
          {/* «бумажная» текстура неба/моря */}
          <pattern id="indoSea" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="transparent"/>
            <circle cx="3" cy="3" r="0.5" fill="#7aa0b0" opacity=".25"/>
          </pattern>
          <marker id="indoArrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
            <path d="M 0 0 L 12 6 L 0 12 Z" fill="#143a55"/>
          </marker>
          <marker id="indoArrowVisited" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
            <path d="M 0 0 L 12 6 L 0 12 Z" fill="#2a6a3a"/>
          </marker>
          <marker id="indoArrowAllowed" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="13" markerHeight="13" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
            <path d="M 0 0 L 12 6 L 0 12 Z" fill="#c25a18"/>
          </marker>
        </defs>

        {/* мерцающая текстура океана */}
        <rect width="1000" height="580" fill="url(#indoSea)"/>

        {/* островa — подложка-тень */}
        {ISLANDS.map(isl => (
          <path key={isl.id + '_shadow'} d={isl.path} fill="#7a6a4a" opacity=".18" transform="translate(3 5)"/>
        ))}

        {/* острова — только тела (без подписей), чтобы стрелки рисовались поверх */}
        {ISLANDS.map(isl => {
          const isCurrent = currentNode === isl.id;
          const isVisitedNode = mode === 'hamilton' && visitedNodes?.has(isl.id);
          const fill = isCurrent ? '#f7c84a' : (isVisitedNode ? '#a8d8a0' : '#e8d6a8');
          return (
            <path key={isl.id + '_body'} d={isl.path} fill={fill} stroke="#5a3a1a" strokeWidth="2"
                  className={`indo-island ${isCurrent ? 'hot' : ''}`}
                  onClick={() => onIslandClick && onIslandClick(isl.id)}/>
          );
        })}

        {/* стрелки-течения — поверх островов */}
        {curved.map((e, i) => {
          const fromIsl = ISLAND_BY_ID[e.from];
          const toIsl = ISLAND_BY_ID[e.to];
          // угол от источника к назначению и обратный угол
          const dx = toIsl.hub[0] - fromIsl.hub[0];
          const dy = toIsl.hub[1] - fromIsl.hub[1];
          const angleOut = Math.atan2(dy, dx);
          const angleIn  = Math.atan2(-dy, -dx);
          // эллиптический радиус к границе острова + маленький отступ
          const startCut = ellipseR(fromIsl.rx, fromIsl.ry, angleOut) + 4;
          const endCut   = ellipseR(toIsl.rx,   toIsl.ry,   angleIn)  + 6;
          const trimmed = trimArc(fromIsl.hub, toIsl.hub, e.offset, startCut, endCut);
          const d = `M ${trimmed.a[0]} ${trimmed.a[1]} Q ${trimmed.ctrl[0]} ${trimmed.ctrl[1]} ${trimmed.b[0]} ${trimmed.b[1]}`;
          const isVisited = traversed?.has(i);
          const isAllowed = allowedEdgeIdxs?.has(i);
          let stroke = '#143a55';
          let strokeWidth = 3.5;
          let dasharray = '8 6';
          let opacity = 1;
          let marker = 'url(#indoArrow)';
          let cls = 'indo-edge';
          if (isVisited) {
            stroke = '#2a6a3a';
            strokeWidth = 4.2;
            dasharray = 'none';
            marker = 'url(#indoArrowVisited)';
            cls = 'indo-edge';
          } else if (isAllowed) {
            stroke = '#c25a18';
            strokeWidth = 4.5;
            dasharray = '8 6';
            marker = 'url(#indoArrowAllowed)';
            cls = 'indo-edge indo-edge-dash';
          } else if (currentNode && !isAllowed) {
            opacity = 0.32;
          }
          return (
            <g key={i}>
              {/* жёлтый glow под доступной стрелкой — приглашение к клику */}
              {isAllowed && (
                <path d={d} stroke="#fde080" strokeWidth={strokeWidth + 8} fill="none"
                      strokeLinecap="round" className="indo-edge-allowed-bg"/>
              )}
              <path d={d} stroke="#ffffff" strokeOpacity={opacity * 0.85}
                    strokeWidth={strokeWidth + 3} fill="none" strokeLinecap="round"/>
              <path d={d} stroke={stroke} strokeWidth={strokeWidth} fill="none"
                    strokeDasharray={dasharray} markerEnd={marker} opacity={opacity}
                    strokeLinecap="round"
                    className={cls}
                    onClick={()=> onEdgeClick && onEdgeClick(i)}/>
              <path d={d} stroke="rgba(0,0,0,0)" strokeWidth="20" fill="none"
                    style={{ cursor: isAllowed ? 'pointer' : (onEdgeClick && !currentNode ? 'pointer' : 'default') }}
                    onClick={()=> onEdgeClick && onEdgeClick(i)}/>
            </g>
          );
        })}

        {/* подписи островов и «гавани» — поверх стрелок */}
        {ISLANDS.map(isl => {
          const isCurrent = currentNode === isl.id;
          return (
            <g key={isl.id + '_label'} style={{ pointerEvents:'none' }}>
              {/* белая подложка под текст для читаемости */}
              <text x={isl.hub[0]} y={isl.hub[1] - 2}
                    textAnchor="middle" fontFamily="var(--serif)" fontSize="14" fontWeight="700"
                    fill="#fff8e8" stroke="#fff8e8" strokeWidth="4" strokeLinejoin="round">
                {isl.name}
              </text>
              <text x={isl.hub[0]} y={isl.hub[1] - 2}
                    textAnchor="middle" fontFamily="var(--serif)" fontSize="14" fontWeight="700"
                    fill="#3a2010">
                {isl.name}
              </text>
              {/* «гавань» — точка */}
              <circle cx={isl.hub[0]} cy={isl.hub[1] + 12} r="5"
                      fill={isCurrent ? '#c84a2e' : '#7a4a2a'} stroke="#3a2010" strokeWidth="1.5"
                      className={isCurrent ? 'indo-pulse' : ''}/>
            </g>
          );
        })}

        {/* корабль в текущей точке */}
        {currentNode && (
          <g transform={`translate(${ISLAND_BY_ID[currentNode].hub[0] + 14} ${ISLAND_BY_ID[currentNode].hub[1] - 24})`} className="indo-pulse">
            <text fontSize="22" textAnchor="middle">⛵</text>
          </g>
        )}
      </svg>
    </div>
  );
}

// ──────────────────── ИГРА «ПЛАВАНИЕ» ────────────────────
// goal: 'euler' — пройти все рёбра ровно по одному разу и вернуться
//        'hamilton' — посетить все острова ровно по одному (плюс возврат)
function SailingGame({ edges, goal, summaryText }) {
  // start: первый остров первого ребра по умолчанию
  const [startNode, setStartNode] = iS(null);
  const [current, setCurrent] = iS(null);
  const [path, setPath] = iS([]);                     // массив индексов пройденных рёбер
  const [visitedNodes, setVisitedNodes] = iS(new Set());

  iE(() => {
    if (!startNode) {
      // подсветим все острова, но не начнём автоматически — пусть выбирает
    }
  }, [startNode]);

  const allowedEdgeIdxs = iM(() => {
    if (!current) return new Set();
    const used = new Set(path);
    const allowed = new Set();
    edges.forEach((e, i) => {
      if (e[0] !== current) return;
      if (used.has(i)) return;
      // для Гамильтона нельзя заходить на уже посещённый остров (кроме завершающего возврата)
      if (goal === 'hamilton') {
        const visited = visitedNodes;
        const allButLast = visited.size === ISLANDS.length;
        if (visited.has(e[1]) && !(allButLast && e[1] === startNode)) return;
      }
      allowed.add(i);
    });
    return allowed;
  }, [edges, path, current, goal, visitedNodes, startNode]);

  const won = iM(() => {
    if (!startNode) return false;
    if (goal === 'euler') {
      return path.length === edges.length && current === startNode;
    }
    if (goal === 'hamilton') {
      return visitedNodes.size === ISLANDS.length && current === startNode;
    }
    return false;
  }, [path, current, startNode, goal, edges.length, visitedNodes]);

  const stuck = iM(() => {
    if (!current || won) return false;
    return allowedEdgeIdxs.size === 0;
  }, [current, allowedEdgeIdxs, won]);

  const handleIslandClick = (id) => {
    if (current) return; // уже идём — старт нельзя менять
    setStartNode(id);
    setCurrent(id);
    setVisitedNodes(new Set([id]));
  };

  const handleEdgeClick = (i) => {
    if (!allowedEdgeIdxs.has(i)) return;
    const e = edges[i];
    setPath(p => [...p, i]);
    setCurrent(e[1]);
    setVisitedNodes(v => new Set([...v, e[1]]));
  };

  const reset = () => {
    setStartNode(null);
    setCurrent(null);
    setPath([]);
    setVisitedNodes(new Set());
  };

  const traversedSet = new Set(path);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
      <IslandMap
        edges={edges}
        traversed={traversedSet}
        currentNode={current}
        allowedEdgeIdxs={allowedEdgeIdxs}
        visitedNodes={visitedNodes}
        mode={goal}
        onEdgeClick={handleEdgeClick}
        onIslandClick={!current ? handleIslandClick : undefined}
      />

      {/* строка статуса / инструкция */}
      <div style={{ display:'flex', alignItems:'center', gap: 10, flexWrap:'wrap' }}>
        {!current && (
          <span className="indo-stat" style={{ fontSize: 13 }}>⚓ <b>Кликни любой остров</b> — корабль начнёт оттуда</span>
        )}
        {current && !won && !stuck && (
          <span className="indo-stat" style={{ background:'#fde2c8', borderColor:'#d68a4a', color:'#7a3a18', fontSize: 13 }}>
            → Теперь <b>кликни по оранжевой стрелке</b>, чтобы плыть
          </span>
        )}
        {current && goal === 'euler' && (
          <>
            <span className="indo-stat">Пройдено течений: {path.length} / {edges.length}</span>
            <span className="indo-stat">Сейчас на: <b>{ISLAND_BY_ID[current].name}</b></span>
            <span className="indo-stat">Старт: {ISLAND_BY_ID[startNode].name}</span>
          </>
        )}
        {current && goal === 'hamilton' && (
          <>
            <span className="indo-stat">Посещено островов: {visitedNodes.size} / {ISLANDS.length}</span>
            <span className="indo-stat">Сейчас на: <b>{ISLAND_BY_ID[current].name}</b></span>
            <span className="indo-stat">Старт: {ISLAND_BY_ID[startNode].name}</span>
          </>
        )}
        {won && <span className="indo-stat ok">✓ Получилось — кольцо замкнулось!</span>}
        {stuck && !won && <span className="indo-stat bad">⛔ Дальше идти некуда. Сбрось и попробуй другой старт.</span>}
        {current && <button className="mmm-btn ghost" style={{ fontSize: 13, padding:'6px 12px' }} onClick={reset}>↻ Сброс</button>}
      </div>

      {(won || stuck) && summaryText && (
        <div className="mmm-card indo-fade" style={{ padding: 14, background:'var(--paper-2)', borderLeft:`3px solid ${won ? '#5a7a4f' : '#c25a3a'}` }}>
          <p className="mmm-eyebrow" style={{ margin: 0 }}>{won ? 'Маршрут найден' : 'Тупик'}</p>
          <p className="mmm-body" style={{ margin: '6px 0 0', fontSize: 13.5, lineHeight: 1.55 }}>{summaryText(won)}</p>
        </div>
      )}
    </div>
  );
}

// ──────────────────── ЧАСТЬ III — встреча у Явы ────────────────────
function MeetingCalculator({ role }) {
  const isTeacher = role === 'teacher';
  // данные кораблей — фиксированные параметры
  const trinidad = {
    name: 'Тринидад',
    from: 'Тимор',
    earliest: 5,
    legs: [
      { dist: 84,  modifier: +2, label: 'попутное течение' },
      { dist: 100, modifier:  0, label: 'спокойные воды' },
      { dist: 96,  modifier: -1, label: 'встречный ветер' },
    ],
  };
  const victoria = {
    name: 'Виктория',
    from: 'Суматра',
    earliest: 1,
    legs: [
      { dist: 90, modifier: +1, label: 'лёгкий попутный ветер' },
      { dist: 50, modifier:  0, label: 'спокойная вода' },
      { dist: 80, modifier: -1, label: 'небольшое встречное течение' },
      { dist: 60, modifier:  0, label: 'спокойные воды' },
    ],
  };
  const BASE_SPEED = 5;
  const TARGET = 60;

  const calcLegs = (ship) => ship.legs.map(l => {
    const speed = BASE_SPEED + l.modifier;
    const days = l.dist / speed;
    return { ...l, speed, days };
  });

  const trinLegs = calcLegs(trinidad);
  const vicLegs  = calcLegs(victoria);
  const trinTotal = trinLegs.reduce((s, l) => s + l.days, 0);
  const vicTotal  = vicLegs.reduce((s, l) => s + l.days, 0);

  // tweakable старт
  const [trinStart, setTrinStart] = iS(trinidad.earliest);
  const [vicStart, setVicStart]   = iS(1);

  const trinArr = trinStart + trinTotal;
  const vicArr  = vicStart + vicTotal;

  const TableShip = ({ ship, legs, total, start, setStart }) => (
    <div className="mmm-card" style={{ padding: 16, display:'flex', flexDirection:'column', gap: 10 }}>
      <div style={{ display:'flex', alignItems:'baseline', gap: 10, flexWrap:'wrap' }}>
        <h4 style={{ margin: 0, fontFamily:'var(--serif)', fontSize: 17 }}>«{ship.name}»</h4>
        <span style={{ fontFamily:'var(--mono)', fontSize: 12, color:'var(--ink-mute)' }}>из порта {ship.from}, не раньше дня {ship.earliest}</span>
      </div>
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom:'1px solid var(--line)' }}>
            <th style={{ textAlign:'left', padding:'4px 6px', color:'var(--ink-mute)', fontWeight:600 }}>отрезок</th>
            <th style={{ textAlign:'right', padding:'4px 6px', color:'var(--ink-mute)', fontWeight:600 }}>лиг</th>
            <th style={{ textAlign:'right', padding:'4px 6px', color:'var(--ink-mute)', fontWeight:600 }}>лиг/день</th>
            <th style={{ textAlign:'right', padding:'4px 6px', color:'var(--ink-mute)', fontWeight:600 }}>дней</th>
          </tr>
        </thead>
        <tbody>
          {legs.map((l, i) => (
            <tr key={i} style={{ borderBottom:'1px dashed var(--paper-3)' }}>
              <td style={{ padding:'5px 6px' }}>{i+1}. {l.label} <span style={{ color:'var(--ink-mute)' }}>({l.modifier > 0 ? '+' : ''}{l.modifier})</span></td>
              <td style={{ padding:'5px 6px', textAlign:'right', fontFamily:'var(--mono)' }}>{l.dist}</td>
              <td style={{ padding:'5px 6px', textAlign:'right', fontFamily:'var(--mono)' }}>{l.speed}</td>
              <td style={{ padding:'5px 6px', textAlign:'right', fontFamily:'var(--mono)', fontWeight:600 }}>{l.days}</td>
            </tr>
          ))}
          <tr>
            <td style={{ padding:'8px 6px 0', fontWeight:600 }}>Итого в пути</td>
            <td colSpan="2"/>
            <td style={{ padding:'8px 6px 0', textAlign:'right', fontFamily:'var(--mono)', fontWeight:700, color:'var(--terra-deep)' }}>{total} дн</td>
          </tr>
        </tbody>
      </table>
      <div style={{ display:'flex', alignItems:'center', gap: 10, padding: '4px 0' }}>
        <label style={{ fontSize: 13 }}>Выходит из порта в день:</label>
        <input type="number" min={ship.earliest} max={30} value={start}
               onChange={e => setStart(Math.max(ship.earliest, Math.min(30, parseInt(e.target.value)||ship.earliest)))}
               style={{ width: 70, padding:'4px 8px', border:'1.5px solid var(--line)', borderRadius: 6, fontFamily:'var(--mono)', fontSize: 14 }}/>
      </div>
      <div style={{ display:'flex', gap: 8, alignItems:'center', padding: '2px 0' }}>
        <span style={{ fontFamily:'var(--mono)', fontSize: 13, color:'var(--ink-soft)' }}>прибудет:</span>
        <span style={{ fontFamily:'var(--mono)', fontSize: 15, fontWeight:700, color: (start + total === TARGET) ? '#345520' : '#7a3a18' }}>
          день {start + total}
        </span>
        {(start + total) === TARGET ? (
          <span className="indo-stat ok">✓ ровно к 60-му</span>
        ) : (start + total) < TARGET ? (
          <span className="indo-stat bad">слишком рано на {TARGET - (start + total)} дн</span>
        ) : (
          <span className="indo-stat bad">опоздание на {(start + total) - TARGET} дн</span>
        )}
      </div>
    </div>
  );

  const bothMatchDay = (trinArr === vicArr);
  const both60 = trinArr === TARGET && vicArr === TARGET;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 14 }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14 }}>
        <TableShip ship={trinidad} legs={trinLegs} total={trinTotal} start={trinStart} setStart={setTrinStart}/>
        <TableShip ship={victoria} legs={vicLegs} total={vicTotal} start={vicStart} setStart={setVicStart}/>
      </div>

      {/* Совпадение дней прибытия — зелёный баннер «корабли вместе» */}
      {trinArr === vicArr && (
        <div className="mmm-card indo-fade" style={{ padding: '12px 14px', background:'#d8e8c8', borderLeft:'4px solid #5a7a4f', display:'flex', alignItems:'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>⛵⛵</span>
          <div>
            <p className="mmm-eyebrow" style={{ margin: 0, color:'#345520' }}>Корабли встретились</p>
            <p className="mmm-body" style={{ margin: '2px 0 0', fontSize: 14, color:'#345520' }}>
              Обе каракки приходят к Яве на <b>{trinArr}-й день</b>{trinArr === TARGET ? ' — ровно к назначенному 60-му!' : (trinArr < TARGET ? ` (на ${TARGET - trinArr} дн раньше срока)` : ` (на ${trinArr - TARGET} дн позже срока)`)}.
            </p>
          </div>
        </div>
      )}

      {/* Поле для ответа ученика */}
      {!isTeacher && <StudentAnswerCheck trinTotal={trinTotal} vicTotal={vicTotal}/>}
      {isTeacher && (
      <div className="mmm-card" style={{ padding: 14, background:'var(--paper-2)' }}>
        <p className="mmm-eyebrow" style={{ margin: 0 }}>Итог встречи · для учителя</p>
        <p className="mmm-body" style={{ margin: '6px 0 0', fontSize: 14, lineHeight: 1.55 }}>
          <b>«Тринидад»</b> идёт {trinTotal} дн и не может выйти раньше 5-го дня → самое раннее прибытие — день <b>{5 + trinTotal}</b>.<br/>
          <b>«Виктория»</b> идёт {vicTotal} дн → может прибыть в любой день начиная с дня <b>{1 + vicTotal}</b>.<br/>
          К 60-му дню «Тринидад» не успевает: 5 + 56 = 61 ≠ 60. Значит точно к 60-му встретиться нельзя.<br/>
          <b>Ближайший общий день встречи — {Math.max(5 + trinTotal, 1 + vicTotal)}-й.</b> «Тринидад» уходит {5}-го (раньше нельзя), «Виктория» — {Math.max(5 + trinTotal, 1 + vicTotal) - vicTotal}-го.
        </p>
      </div>
      )}
    </div>
  );
}

// ──────────────────── ПРОВЕРКА ОТВЕТА УЧЕНИКА (Да/Нет для Частей I и II) ────────────────────
function PartAnswerCheck({ question, correctAnswer, okMsg, wrongMsg }) {
  const [picked, setPicked] = iS(null);
  const [shown, setShown] = iS(null); // null | 'ok' | 'wrong'

  const submit = () => {
    if (!picked) return;
    setShown(picked === correctAnswer ? 'ok' : 'wrong');
  };

  const Btn = ({ value, label }) => (
    <button
      onClick={() => { setPicked(value); setShown(null); }}
      style={{
        padding:'8px 18px', borderRadius: 6,
        border: picked === value ? '2px solid var(--terra)' : '1.5px solid var(--line)',
        background: picked === value ? 'var(--terra-soft)' : 'var(--paper)',
        color: 'var(--ink)', fontFamily:'var(--serif)', fontSize: 15, fontWeight: 600,
        cursor:'pointer', transition:'all .2s',
      }}>
      {label}
    </button>
  );

  return (
    <div className="mmm-card" style={{ padding: 16, background:'var(--paper-2)', borderLeft:'4px solid var(--terra)', display:'flex', flexDirection:'column', gap: 10 }}>
      <p className="mmm-eyebrow" style={{ margin: 0 }}>Главный вопрос</p>
      <p className="mmm-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55 }}>{question}</p>
      <div style={{ display:'flex', gap: 8, alignItems:'center', flexWrap:'wrap' }}>
        <Btn value="yes" label="Да"/>
        <Btn value="no" label="Нет"/>
        <button className="mmm-btn terra" onClick={submit} style={{ fontSize: 14, padding:'8px 16px', opacity: picked ? 1 : .5 }} disabled={!picked}>Проверить →</button>
        {shown === 'ok' && (
          <span className="indo-stat ok" style={{ fontSize: 13 }}>✓ Верно</span>
        )}
        {shown === 'wrong' && (
          <span className="indo-stat bad" style={{ fontSize: 13 }}>Подумай ещё</span>
        )}
      </div>
      {shown === 'ok' && (
        <div className="indo-fade" style={{ padding: 10, background:'#d8e8c8', borderRadius: 6, border:'1px solid #8aa860' }}>
          <p className="mmm-body" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color:'#2a4a20' }}>{okMsg}</p>
        </div>
      )}
      {shown === 'wrong' && (
        <div className="indo-fade" style={{ padding: 10, background:'#f4d8c8', borderRadius: 6, border:'1px solid #c89a8a' }}>
          <p className="mmm-body" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color:'#7a3a18' }}>{wrongMsg}</p>
        </div>
      )}
    </div>
  );
}

// ──────────────────── ПРОВЕРКА ОТВЕТА УЧЕНИКА (Часть III) ────────────────────
function StudentAnswerCheck({ trinTotal, vicTotal }) {
  const [ans, setAns] = iS('');
  const [shown, setShown] = iS(null); // null | 'ok' | 'wrong'
  const correct = Math.max(5 + trinTotal, 1 + vicTotal); // 61

  const submit = () => {
    const n = parseInt(ans.trim(), 10);
    if (!n) { setShown('wrong'); return; }
    setShown(n === correct ? 'ok' : 'wrong');
  };

  return (
    <div className="mmm-card" style={{ padding: 16, background:'var(--paper-2)', borderLeft:'4px solid var(--terra)', display:'flex', flexDirection:'column', gap: 10 }}>
      <p className="mmm-eyebrow" style={{ margin: 0 }}>Главный вопрос</p>
      <p className="mmm-body" style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>
        К 60-му дню встретиться, кажется, не получается. <b>Какой ближайший общий день встречи у Тринидада и Виктории?</b>
      </p>
      <div style={{ display:'flex', gap: 8, alignItems:'center', flexWrap:'wrap' }}>
        <input
          type="text"
          inputMode="numeric"
          value={ans}
          onChange={e => { setAns(e.target.value); setShown(null); }}
          onKeyDown={e => { if (e.key === 'Enter') submit(); }}
          placeholder="введи день"
          style={{ width: 130, padding:'8px 12px', border:'1.5px solid var(--line)', borderRadius: 6, fontFamily:'var(--mono)', fontSize: 14, background:'var(--paper)' }}
        />
        <button className="mmm-btn terra" onClick={submit} style={{ fontSize: 14, padding:'8px 16px' }}>Проверить →</button>
        {shown === 'ok' && (
          <span className="indo-stat ok" style={{ fontSize: 13 }}>✓ Точно: {correct}-й день — ближайший возможный</span>
        )}
        {shown === 'wrong' && (
          <span className="indo-stat bad" style={{ fontSize: 13 }}>Пока не то. Посмотри: «Тринидад» не может выйти раньше 5-го дня — а сколько ему нужно дней в пути?</span>
        )}
      </div>
    </div>
  );
}

// ──────────────────── ВКЛАДКИ ────────────────────
function IndonesiaTabs({ active, setActive }) {
  const tabs = [
    { id: 1, label: 'I · Пропавший маршрут' },
    { id: 2, label: 'II · Тайные течения' },
    { id: 3, label: 'III · Встреча у Явы' },
  ];
  return (
    <div className="indo-tabbar">
      {tabs.map(t => (
        <button key={t.id} className={`indo-tab ${active === t.id ? 'active' : ''}`} onClick={() => setActive(t.id)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ──────────────────── ГЛАВНАЯ СТРАНИЦА ИНДОНЕЗИИ ────────────────────
function IndonesiaPage({ role, onBack }) {
  useIndoStyles();
  const [tab, setTab] = iS(1);

  return (
    <div style={{ maxWidth: 1100, margin:'0 auto', display:'flex', flexDirection:'column', gap: 'var(--pad-lg)' }}>
      {/* Шапка */}
      <header className="mmm-fade-up" style={{ background:'linear-gradient(135deg, #cfe6f2 0%, #a8c4d8 100%)', padding: '24px 26px', borderRadius: 12, border:'1.5px solid var(--line)', position:'relative', overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 6, marginBottom: 6 }}>
          <button className="mmm-btn ghost" onClick={onBack} style={{ fontSize: 12, padding:'4px 10px' }}>← К сезонам</button>
          <span style={{ fontFamily:'var(--mono)', fontSize: 12, color:'#2a4a60' }}>2024 / 2025</span>
        </div>
        <p className="mmm-eyebrow" style={{ color:'#2a4a60', margin:'0' }}>Олимпиада «Квадрига» · финал</p>
        <h1 className="mmm-h1" style={{ fontSize: 32, margin:'4px 0 8px', color:'#1a3a55' }}>Острова пряностей</h1>
        <p className="mmm-lead" style={{ margin: 0, fontSize: 15, color:'#1a3a55', maxWidth:'70ch' }}>
          XVI век. Эпоха Великих географических открытий. В водах Индонезийского архипелага бушуют односторонние течения — корабли могут идти только по строго определённым курсам. Дошли до нас два разрозненных манускрипта с разными «сетями течений».
        </p>
      </header>

      <IndonesiaTabs active={tab} setActive={setTab}/>

      <div className="indo-tab-body indo-fade" key={tab}>
        {tab === 1 && <PartI role={role}/>}
        {tab === 2 && <PartII role={role}/>}
        {tab === 3 && <PartIII role={role}/>}
      </div>

      {role === 'teacher' && (
        <div className="mmm-card" style={{ padding: 18, background:'var(--paper-2)', borderLeft:'3px solid var(--olive)' }}>
          <p className="mmm-eyebrow" style={{ margin: 0 }}>Учителю</p>
          <p className="mmm-body" style={{ margin: '6px 0 10px', fontSize: 13.5, lineHeight: 1.55 }}>
            Задача знакомит детей с двумя классическими типами графовых задач (Эйлеров и Гамильтонов обход) через нарратив об эпохе Великих открытий. В Части III используются простые расчёты «скорость · время = расстояние» с модификаторами от течений и согласование стартовых дней.
          </p>
          <div style={{ display:'flex', gap: 8, flexWrap:'wrap' }}>
            <a className="mmm-btn ghost" href={window.__resources?.kvIndoPdf || "kvadriga-indonesia-task.pdf"} target="_blank" rel="noopener" style={{ fontSize: 13, padding:'8px 14px', textDecoration:'none' }}>⤓ Полный текст задачи (PDF)</a>
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────── ПАНЕЛИ ЧАСТЕЙ ────────────────────
function PartI({ role }) {
  const isTeacher = role === 'teacher';
  return (
    <div className="indo-fade" style={{ display:'flex', flexDirection:'column', gap: 16 }}>
      <div>
        <p className="mmm-eyebrow" style={{ margin: 0 }}>Часть I</p>
        <h3 className="mmm-h3" style={{ margin: '4px 0 8px' }}>«Пропавший маршрут Магеллана»</h3>
        {isTeacher ? (
          <>
            <p className="mmm-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6 }}>
              В старой рукописи указано <b>15 односторонних течений</b>. Легенда утверждает, что никто не сумел пройти каждое из них ровно один раз и вернуться в исходный порт.
            </p>
            <p className="mmm-body" style={{ margin: '8px 0 0', fontSize: 14.5, lineHeight: 1.6 }}>
              <b>Задача-эйлеров цикл в ориентированном графе.</b> Цикл существует ⇔ в каждой вершине число входящих рёбер равно числу исходящих («полустепени» входа и выхода равны), и все вершины с рёбрами сильно связаны. Используйте интерактивную карту, чтобы дать детям прочувствовать тупик «руками».
            </p>
          </>
        ) : (
          <>
            <p className="mmm-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6 }}>
              В старой рукописи указано <b>15 морских течений</b>. Каждое можно пройти только в одну сторону. Легенда говорит: никто не сумел проплыть по всем ним ровно один раз и вернуться домой.
            </p>
            <p className="mmm-body" style={{ margin: '8px 0 0', fontSize: 14.5, lineHeight: 1.6 }}>
              Кликни любой остров — твой корабль начнёт оттуда. Потом нажми на стрелку-течение, чтобы переплыть по ней. Сможешь ли пройти все 15 течений и вернуться в начальный остров?
            </p>
          </>
        )}
      </div>
      <SailingGame
        edges={EDGES_PART_I}
        goal="euler"
        summaryText={(won) => won
          ? (isTeacher
              ? 'Удивительно — но проверь по формальному критерию: в направленном графе эйлеров цикл существует только если у каждой вершины число входящих рёбер равно числу выходящих.'
              : 'Странно — кажется, у тебя получилось! Перепроверь: точно все 15 течений пройдены ровно по одному разу и корабль вернулся в начальный остров?')
          : (isTeacher
              ? 'Закономерный тупик. Калимантан имеет 3 входящих и 1 исходящее течение (−2), Новая Гвинея 4 и 3 (−1), Ява 1 и 2 (+1), Серам 1 и 2 (+1), Сумба 1 и 2 (+1). Когда баланс входящих и исходящих рёбер нарушен больше чем в двух вершинах — эйлерова цикла нет. Хорошая точка для обсуждения в классе: «зачем нужен баланс входящих и исходящих».'
              : 'Дальше идти некуда. Попробуй сбросить и начать с другого острова. И подумай: вообще ли такое плавание возможно?')}
      />
      {!isTeacher && (
        <PartAnswerCheck
          question="Можно ли пройти по всем 15 течениям ровно по одному разу и вернуться в начальный порт?"
          correctAnswer="no"
          okMsg="Да, так и есть! Сеть течений несбалансирована — у некоторых островов «входящих» течений больше, чем «исходящих», и кольцо никак не замыкается."
          wrongMsg="Попробуй ещё раз на карте выше: посчитай в Калимантане — сколько туда входит стрелок и сколько из него выходит?"
        />
      )}
    </div>
  );
}

function PartII({ role }) {
  const isTeacher = role === 'teacher';
  return (
    <div className="indo-fade" style={{ display:'flex', flexDirection:'column', gap: 16 }}>
      <div>
        <p className="mmm-eyebrow" style={{ margin: 0 }}>Часть II</p>
        <h3 className="mmm-h3" style={{ margin: '4px 0 8px' }}>«Тайные течения Ост-Индии»</h3>
        {isTeacher ? (
          <>
            <p className="mmm-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6 }}>
              Со сменой муссонов появлялась иная сеть из 15 течений. По легенде кто-то нашёл маршрут, посетивший все 10 островов ровно по одному разу и замкнувшийся.
            </p>
            <p className="mmm-body" style={{ margin: '8px 0 0', fontSize: 14.5, lineHeight: 1.6 }}>
              <b>Задача-гамильтонов цикл.</b> NP-полная в общем случае, но в этой сети цикл существует: Суматра → Ява → Калимантан → Сулавеси → Хальмахера → Флорес → Серам → Сумба → Тимор → Новая Гвинея → Суматра. Дети могут найти его перебором — карта подскажет доступные ходы.
            </p>
          </>
        ) : (
          <>
            <p className="mmm-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6 }}>
              Со сменой ветров появилась <b>новая сеть течений</b>. Португальцы шептались: один лоцман нашёл маршрут, который позволяет побывать на каждом из 10 островов <b>ровно по одному разу</b> и вернуться домой.
            </p>
            <p className="mmm-body" style={{ margin: '8px 0 0', fontSize: 14.5, lineHeight: 1.6 }}>
              Можно ли так? Кликай острова и стрелки. На один и тот же остров заходить дважды нельзя — только в самом конце вернуться туда, откуда стартовал. Попробуй начать с Суматры.
            </p>
          </>
        )}
      </div>
      <SailingGame
        edges={EDGES_PART_II}
        goal="hamilton"
        summaryText={(won) => won
          ? 'Маршрут существует! Один из вариантов: Суматра → Ява → Калимантан → Сулавеси → Хальмахера → Флорес → Серам → Сумба → Тимор → Новая Гвинея → Суматра. Все 10 островов посещены ровно по одному разу и плавание замкнулось.'
          : (isTeacher
              ? 'Здесь гамильтонов цикл существует. Начало с Суматры → Ява разворачивает поиск удачно. Дайте детям попробовать ещё.'
              : 'Попробуй сбросить и начать с другого острова.')}
      />
      {!isTeacher && (
        <PartAnswerCheck
          question="Можно ли побывать на всех 10 островах ровно по одному разу и вернуться в начальный?"
          correctAnswer="yes"
          okMsg="Да, маршрут существует. Найди его на карте выше — за все 10 островов нужно пройти ровно по одному разу."
          wrongMsg="Попробуй ещё: начни с Суматры, первый ход — на Яву. Может, маршрут всё-таки существует?"
        />
      )}
    </div>
  );
}

function PartIII({ role }) {
  const isTeacher = role === 'teacher';
  return (
    <div className="indo-fade" style={{ display:'flex', flexDirection:'column', gap: 16 }}>
      <div>
        <p className="mmm-eyebrow" style={{ margin: 0 }}>Часть III</p>
        <h3 className="mmm-h3" style={{ margin: '4px 0 8px' }}>«Встреча у Явы»</h3>
        {isTeacher ? (
          <p className="mmm-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6 }}>
            Классическая задача на согласование времени и скорости с модификаторами течения/ветра. Базовая скорость 5 лиг/день, попутное течение даёт +1…+2, встречное −1. Корабли стартуют из разных портов с разными ограничениями. Цель — найти день, в который встреча у Явы возможна. Меняйте день выхода в полях ниже.
          </p>
        ) : (
          <p className="mmm-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6 }}>
            Две каракки — <b>«Тринидад»</b> (из Тимора) и <b>«Виктория»</b> (из Суматры) — договорились встретиться у Явы к утру 60-го дня. Базовая скорость у обеих — 5 лиг в день. Где течение помогает — идут быстрее, где мешает — медленнее. У «Тринидада» паруса чинят, и он не может выйти раньше 5-го дня. «Виктория» может стартовать в любой день начиная с первого. Меняй день отправления — успеют ли они оба к 60-му? А если нет — какой ближайший день им подойдёт?
          </p>
        )}
      </div>
      <MeetingCalculator role={role}/>
    </div>
  );
}

window.MMM_INDONESIA = { IndonesiaPage };
