// Олимпиада «Квадрига» — пошаговая задача-сценарий «Телеграмма Менделееву»
// Анимации простыми SVG + CSS keyframes. Каждый этап открывается после
// правильного ответа; при неправильном — показывается подсказка.

const { useState: kS, useMemo: kM, useEffect: kE, useRef: kR } = React;

// ──────────── Стили анимаций ────────────
const KVADRIGA_CSS = `
@keyframes kv-spark { 0%,100%{opacity:.3} 50%{opacity:1} }
@keyframes kv-flicker { 0%,100%{opacity:.85} 50%{opacity:.5} }
@keyframes kv-train { 0%{transform:translateX(-50%)} 100%{transform:translateX(120%)} }
@keyframes kv-paper { 0%{transform:translateY(-6%)} 100%{transform:translateY(0)} }
@keyframes kv-wheel { from{transform:rotate(0)} to{transform:rotate(360deg)} }
@keyframes kv-steam { 0%{opacity:.9; transform:translate(0,0) scale(1)} 100%{opacity:0; transform:translate(-20px,-30px) scale(1.6)} }
@keyframes kv-watch-hand { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }
@keyframes kv-wave { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
@keyframes kv-ship { 0%{transform:translateX(0)} 100%{transform:translateX(70%)} }
@keyframes kv-catcher { 0%{transform:translateX(-30%)} 100%{transform:translateX(75%)} }
@keyframes kv-fadein { from{opacity:0; transform:translateY(8px)} to{opacity:1; transform:none} }
@keyframes kv-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
@keyframes kv-eiffel { 0%{transform:translateY(20px); opacity:0} 100%{transform:none; opacity:1} }

.kv-scene { position:relative; min-height:240px; background:linear-gradient(180deg, #cfe6f2 0%, #cfe6f2 70%, #d8c8a0 70%, #d8c8a0 100%); border:1.5px solid var(--line); border-radius:8px; overflow:hidden; }
.kv-scene-night { background:linear-gradient(180deg, #2c3e63 0%, #4a5a80 65%, #5a4a3a 65%, #4a3a2a 100%); }
.kv-scene-sea { background:linear-gradient(180deg, #b8d8e8 0%, #b8d8e8 55%, #5a8aa8 55%, #2a5a7a 100%); }
.kv-scene-room { background:linear-gradient(180deg, #f4dca8 0%, #e0b878 80%, #8a5a3a 100%); }

.kv-card { transition: opacity .3s, transform .3s; }
.kv-card.locked { opacity:.4; pointer-events:none; filter: grayscale(60%); }
.kv-card.unlocked { animation: kv-fadein .5s ease-out; }

.kv-hint { animation: kv-fadein .3s ease-out; }
.kv-correct { color:#2a7a4a; animation: kv-fadein .3s ease-out; }
.kv-input { font-family: var(--mono); font-size: 14px; padding: 9px 12px; border-radius: 6px; border: 1.5px solid var(--paper-3); background: #fff; outline: none; }
.kv-input:focus { border-color: var(--terra); }
.kv-input.wrong { border-color:#b04a4a; background:#fde8e0; }
.kv-input.correct { border-color:#5a7a4f; background:#e8efe0; }

.kv-train { animation: kv-train 22s linear infinite; }
.kv-wheel { animation: kv-wheel 1.5s linear infinite; transform-origin: center; transform-box: fill-box; }
.kv-steam { animation: kv-steam 2s ease-out infinite; }
.kv-watch-min { animation: kv-watch-hand 40s linear infinite; transform-origin: 50% 100%; transform-box: fill-box; }
.kv-watch-sec { animation: kv-watch-hand 8s linear infinite; transform-origin: 50% 100%; transform-box: fill-box; }
.kv-wave { animation: kv-wave 2s ease-in-out infinite; }
.kv-ship-anim { animation: kv-ship 6s linear infinite; }
.kv-catcher-anim { animation: kv-catcher 4.5s linear infinite; }
.kv-paper { animation: kv-paper 1.6s ease-in-out infinite alternate; }
.kv-spark { animation: kv-spark 0.7s ease-in-out infinite; }
.kv-pulse { animation: kv-pulse 1.6s ease-in-out infinite; }
.kv-eiffel { animation: kv-eiffel .8s ease-out; }
`;

function useKvadrigaStyles() {
  kE(() => {
    if (document.getElementById('kvadriga-styles')) return;
    const s = document.createElement('style');
    s.id = 'kvadriga-styles';
    s.textContent = KVADRIGA_CSS;
    document.head.appendChild(s);
  }, []);
}

// ──────────── СЦЕНЫ (SVG-анимации) ────────────

// 1. Кабинет учёного: телеграф печатает две ленты
// ──────────── Менделеев — узнаваемая фигура (повторно используем во всех сценах) ────────────
function Mendeleev() {
  return (
    <g>
      {/* шея */}
      <rect x="-6" y="20" width="12" height="10" fill="#e8b896" stroke="#2a1810" strokeWidth="1.5"/>
      {/* волосы — основа сзади */}
      <path d="M -20 -25 Q -28 0 -26 25 L -18 35 L 18 35 L 26 25 Q 28 0 20 -25 Z" fill="#5a4838" stroke="#2a1810" strokeWidth="1.5"/>
      {/* лицо */}
      <ellipse cx="0" cy="0" rx="17" ry="22" fill="#e8b896" stroke="#2a1810" strokeWidth="1.5"/>
      {/* шевелюра сверху */}
      <path d="M -18 -10 Q -22 -28 0 -32 Q 22 -28 18 -10 Q 14 -22 0 -22 Q -14 -22 -18 -10 Z" fill="#5a4838" stroke="#2a1810" strokeWidth="1.5"/>
      <path d="M -10 -22 Q -2 -28 5 -22" stroke="#2a1810" strokeWidth=".8" fill="none"/>
      {/* брови */}
      <path d="M -12 -6 Q -8 -8 -3 -6" stroke="#2a1810" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 3 -6 Q 8 -8 12 -6" stroke="#2a1810" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* глаза */}
      <circle cx="-6" cy="-1" r="1.6" fill="#2a1810"/>
      <circle cx="6" cy="-1" r="1.6" fill="#2a1810"/>
      {/* нос */}
      <path d="M 0 -2 Q -2 4 0 7 Q 2 6 1 7" stroke="#2a1810" strokeWidth="1" fill="none" strokeLinecap="round"/>
      {/* усы */}
      <path d="M -10 11 Q -5 9 0 11 Q 5 9 10 11 Q 8 14 0 13 Q -8 14 -10 11 Z" fill="#5a4838" stroke="#2a1810" strokeWidth="1"/>
      {/* борода */}
      <path d="M -16 12 Q -22 30 -18 48 Q -10 58 0 60 Q 10 58 18 48 Q 22 30 16 12 Q 12 22 0 22 Q -12 22 -16 12 Z" fill="#5a4838" stroke="#2a1810" strokeWidth="1.5"/>
      <path d="M -10 28 L -8 50" stroke="#3a2818" strokeWidth=".8" fill="none"/>
      <path d="M -2 30 L 0 55" stroke="#3a2818" strokeWidth=".8" fill="none"/>
      <path d="M 6 28 L 8 50" stroke="#3a2818" strokeWidth=".8" fill="none"/>
      {/* сюртук */}
      <path d="M -22 56 L -30 110 L 30 110 L 22 56 Z" fill="#3a2a28" stroke="#2a1810" strokeWidth="2"/>
      {/* воротник */}
      <path d="M -10 58 Q 0 64 10 58 L 8 70 L -8 70 Z" fill="#fdf6e0" stroke="#2a1810" strokeWidth="1"/>
    </g>
  );
}

function SceneTelegraph() {
  return (
    <div className="kv-scene kv-scene-room" aria-label="Менделеев получает телеграмму" style={{ height: 260 }}>
      <svg viewBox="0 0 400 220" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        {/* окно сзади */}
        <rect x="10" y="20" width="120" height="80" fill="#a8c8d8" stroke="#5a3a1a" strokeWidth="3"/>
        <line x1="70" y1="20" x2="70" y2="100" stroke="#5a3a1a" strokeWidth="2"/>
        <line x1="10" y1="60" x2="130" y2="60" stroke="#5a3a1a" strokeWidth="2"/>
        {/* картина с таблицей Менделеева — лёгкий намёк */}
        <rect x="270" y="15" width="100" height="70" fill="#fdf6e0" stroke="#5a3a1a" strokeWidth="3"/>
        <g transform="translate(280 25)" stroke="#5a4a30" strokeWidth=".6" fill="none">
          {Array.from({ length: 5 }).map((_, r) =>
            Array.from({ length: 8 }).map((_, c) => (
              <rect key={`${r}-${c}`} x={c * 10} y={r * 10} width="9.5" height="9.5"/>
            ))
          )}
        </g>

        {/* стол */}
        <rect x="0" y="160" width="400" height="60" fill="#7a4a2a"/>
        <rect x="0" y="158" width="400" height="6" fill="#5a3a1a"/>

        {/* Книги */}
        <rect x="20" y="124" width="14" height="34" fill="#c84a2e" stroke="#2a1810" strokeWidth="1.5"/>
        <rect x="36" y="118" width="14" height="40" fill="#2f7a35" stroke="#2a1810" strokeWidth="1.5"/>
        <rect x="52" y="128" width="14" height="30" fill="#357abc" stroke="#2a1810" strokeWidth="1.5"/>
        <rect x="68" y="120" width="14" height="38" fill="#7a3a8a" stroke="#2a1810" strokeWidth="1.5"/>

        {/* ТЕЛЕГРАФНЫЙ АППАРАТ (Морзе-регистр) */}
        <g transform="translate(150 80)">
          {/* деревянное основание */}
          <rect x="-5" y="55" width="120" height="28" fill="#5a3a1a" stroke="#2a1010" strokeWidth="2"/>
          <rect x="-5" y="55" width="120" height="6" fill="#3a2010"/>
          {/* латунные стойки */}
          <rect x="8" y="20" width="6" height="40" fill="#c89a3a" stroke="#5a3a10" strokeWidth="1"/>
          <rect x="100" y="20" width="6" height="40" fill="#c89a3a" stroke="#5a3a10" strokeWidth="1"/>
          {/* катушка-барабан с лентой сверху */}
          <ellipse cx="40" cy="22" rx="22" ry="9" fill="#c89a3a" stroke="#5a3a10" strokeWidth="1.5"/>
          <ellipse cx="40" cy="22" rx="22" ry="9" fill="#fdf6e0" stroke="#5a3a10" strokeWidth="1.5" opacity=".4"/>
          <ellipse cx="40" cy="18" rx="22" ry="9" fill="#c89a3a" stroke="#5a3a10" strokeWidth="1.5"/>
          <circle cx="40" cy="18" r="4" fill="#3a2010"/>
          {/* латунный «прижим»/стилус */}
          <rect x="60" y="32" width="14" height="6" fill="#3a2010" stroke="#1a0808" strokeWidth="1"/>
          <rect x="58" y="38" width="18" height="3" fill="#c89a3a" stroke="#5a3a10" strokeWidth="1"/>
          <line x1="67" y1="41" x2="67" y2="55" stroke="#5a3a10" strokeWidth="1.5"/>
          {/* искра/электричество — мигает */}
          <g className="kv-spark">
            <circle cx="67" cy="42" r="2" fill="#fff5a0"/>
            <circle cx="67" cy="42" r="5" fill="#fff5a0" opacity=".4"/>
          </g>

          {/* выходящая бумажная лента (длинная, с пропусками) */}
          <g className="kv-paper">
            <rect x="0" y="60" width="110" height="14" fill="#fdf6e0" stroke="#8a7a5a" strokeWidth="1"/>
            <text x="55" y="70" fill="#5a4a30" fontSize="7" fontFamily="monospace" textAnchor="middle" letterSpacing="0.5">
              _Е_ДЕЛЕЕВУ _Ч_ _О_УМЕНТЫ _ _Е_ЛИНЕ
            </text>
          </g>
          {/* свисающий хвост ленты */}
          <path d="M 0 74 Q -10 90 -6 110 L 8 110 Q 4 90 14 74 Z" fill="#fdf6e0" stroke="#8a7a5a" strokeWidth="1"/>

          {/* МОРЗЕ-КЛЮЧ слева на отдельной деревянной подставке */}
          <g transform="translate(-50 50)">
            <rect x="-2" y="6" width="36" height="10" fill="#5a3a1a" stroke="#2a1010" strokeWidth="1.5"/>
            <circle cx="6" cy="6" r="2.5" fill="#c89a3a" stroke="#5a3a10" strokeWidth="1"/>
            <circle cx="26" cy="6" r="2.5" fill="#c89a3a" stroke="#5a3a10" strokeWidth="1"/>
            <rect x="5" y="2" width="22" height="3" fill="#c89a3a" stroke="#5a3a10" strokeWidth="1"/>
            <circle cx="28" cy="3.5" r="3" fill="#3a2010" stroke="#1a0808"/>
          </g>
        </g>

        {/* МЕНДЕЛЕЕВ — узнаваемый: высокий лоб с зачёсанной назад шевелюрой,
            длинные волосы до плеч, густая длинная борода, читает телеграмму */}
        <g transform="translate(335 105)">
          {/* шея */}
          <rect x="-6" y="20" width="12" height="10" fill="#e8b896" stroke="#2a1810" strokeWidth="1.5"/>
          {/* волосы — основа сзади (доходят ниже подбородка) */}
          <path d="M -20 -25 Q -28 0 -26 25 L -18 35 L 18 35 L 26 25 Q 28 0 20 -25 Z" fill="#5a4838" stroke="#2a1810" strokeWidth="1.5"/>
          {/* лицо */}
          <ellipse cx="0" cy="0" rx="17" ry="22" fill="#e8b896" stroke="#2a1810" strokeWidth="1.5"/>
          {/* высокий лоб + волна волос на макушке */}
          <path d="M -18 -10 Q -22 -28 0 -32 Q 22 -28 18 -10 Q 14 -22 0 -22 Q -14 -22 -18 -10 Z" fill="#5a4838" stroke="#2a1810" strokeWidth="1.5"/>
          <path d="M -10 -22 Q -2 -28 5 -22" stroke="#2a1810" strokeWidth=".8" fill="none"/>
          {/* брови */}
          <path d="M -12 -6 Q -8 -8 -3 -6" stroke="#2a1810" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M 3 -6 Q 8 -8 12 -6" stroke="#2a1810" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          {/* глаза */}
          <circle cx="-6" cy="-1" r="1.6" fill="#2a1810"/>
          <circle cx="6" cy="-1" r="1.6" fill="#2a1810"/>
          {/* нос */}
          <path d="M 0 -2 Q -2 4 0 7 Q 2 6 1 7" stroke="#2a1810" strokeWidth="1" fill="none" strokeLinecap="round"/>
          {/* усы — пышные, свисающие на бороду */}
          <path d="M -10 11 Q -5 9 0 11 Q 5 9 10 11 Q 8 14 0 13 Q -8 14 -10 11 Z" fill="#5a4838" stroke="#2a1810" strokeWidth="1"/>
          {/* борода — большая, лохматая, до груди */}
          <path d="M -16 12 Q -22 30 -18 48 Q -10 58 0 60 Q 10 58 18 48 Q 22 30 16 12 Q 12 22 0 22 Q -12 22 -16 12 Z" fill="#5a4838" stroke="#2a1810" strokeWidth="1.5"/>
          {/* «лохматость» бороды — вертикальные пряди */}
          <path d="M -10 28 L -8 50" stroke="#3a2818" strokeWidth=".8" fill="none"/>
          <path d="M -2 30 L 0 55" stroke="#3a2818" strokeWidth=".8" fill="none"/>
          <path d="M 6 28 L 8 50" stroke="#3a2818" strokeWidth=".8" fill="none"/>
          {/* сюртук */}
          <path d="M -22 56 L -30 110 L 30 110 L 22 56 Z" fill="#3a2a28" stroke="#2a1810" strokeWidth="2"/>
          {/* воротник-стойка / шейный платок */}
          <path d="M -10 58 Q 0 64 10 58 L 8 70 L -8 70 Z" fill="#fdf6e0" stroke="#2a1810" strokeWidth="1"/>
          {/* рука, держащая телеграмму */}
          <g transform="translate(-18 78)">
            <rect x="0" y="0" width="30" height="20" fill="#fdf6e0" stroke="#8a7a5a" strokeWidth="1" transform="rotate(-8)"/>
            <text x="15" y="12" fill="#5a4a30" fontSize="5" fontFamily="monospace" textAnchor="middle" transform="rotate(-8)">_Е_ДЕЛЕЕВУ</text>
            {/* кисть */}
            <ellipse cx="-2" cy="6" rx="4" ry="3" fill="#e8b896" stroke="#2a1810" strokeWidth="1.2"/>
          </g>
        </g>
      </svg>
    </div>
  );
}

// 2. Расшифровка телеграммы — две настоящие телеграфные ленты
function SceneStrips() {
  return (
    <div className="kv-scene kv-scene-room" style={{ background:'linear-gradient(180deg,#f0e8d4 0%,#d8c8a0 100%)', height:'auto', padding:'14px 10px' }}>
      <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
        <img src="kvadriga-strip1.jpg" alt="Телеграфная лента I — пропали 1-я и 3-я буквы каждого слова" style={{ width:'100%', display:'block', borderRadius: 4 }}/>
        <img src="kvadriga-strip2.jpg" alt="Телеграфная лента II — пропали 2-я и 6-я буквы каждого слова" style={{ width:'100%', display:'block', borderRadius: 4 }}/>
      </div>
    </div>
  );
}

// 3. Поезд СПб → Берлин — со стилизованным силуэтом Санкт-Петербурга
function SceneTrain({ direction = 'right' }) {
  return (
    <div className="kv-scene" aria-label="Поезд Санкт-Петербург — Берлин">
      <svg viewBox="0 0 400 200" width="100%" height="100%" preserveAspectRatio="none">
        {/* небо: солнце */}
        <circle cx="60" cy="45" r="22" fill="#f7c84a"/>

        {/* силуэт Санкт-Петербурга (узнаваемая панорама) */}
        <g fill="#3a4a5e" stroke="#2a3040" strokeWidth="1">
          {/* Петропавловский собор: основание + шпиль */}
          <g transform="translate(40 80)">
            <rect x="-12" y="40" width="24" height="20" />
            <rect x="-7" y="20" width="14" height="20" />
            <polygon points="-7,20 0,12 7,20" />
            <rect x="-1.5" y="-22" width="3" height="34" fill="#c89a3a" stroke="#8a6a20"/>
            <polygon points="-3,-22 0,-32 3,-22" fill="#c89a3a" stroke="#8a6a20"/>
            <polygon points="-1.5,-32 0,-38 1.5,-32" fill="#c89a3a" stroke="#8a6a20"/>
            {/* крестик */}
            <line x1="0" y1="-40" x2="0" y2="-44" stroke="#8a6a20"/>
            <line x1="-2" y1="-42" x2="2" y2="-42" stroke="#8a6a20"/>
          </g>

          {/* Эрмитаж — длинное здание с колоннадой */}
          <g transform="translate(105 95)">
            <rect x="-30" y="15" width="60" height="30"/>
            <rect x="-32" y="10" width="64" height="6"/>
            {/* колонны */}
            {[-22,-13,-4,5,14,23].map((x,i)=>(
              <rect key={i} x={x} y="18" width="3" height="22" fill="#5a6a7e"/>
            ))}
            {/* центральный фронтон */}
            <polygon points="-12,10 0,2 12,10" />
          </g>

          {/* Исаакиевский собор — большой золотой купол */}
          <g transform="translate(180 90)">
            <rect x="-22" y="30" width="44" height="20"/>
            <rect x="-16" y="14" width="32" height="16"/>
            {/* колонны портика */}
            {[-12,-6,0,6,12].map((x,i)=>(
              <rect key={i} x={x-0.8} y="16" width="2" height="14" fill="#5a6a7e"/>
            ))}
            {/* барабан */}
            <rect x="-10" y="0" width="20" height="14"/>
            {/* купол */}
            <ellipse cx="0" cy="0" rx="13" ry="10" fill="#c89a3a" stroke="#8a6a20"/>
            <rect x="-1" y="-12" width="2" height="6" fill="#c89a3a" stroke="#8a6a20"/>
            <line x1="0" y1="-14" x2="0" y2="-18" stroke="#8a6a20"/>
            <line x1="-2" y1="-16" x2="2" y2="-16" stroke="#8a6a20"/>
          </g>

          {/* Адмиралтейство — шпиль с корабликом */}
          <g transform="translate(255 80)">
            <rect x="-18" y="40" width="36" height="20"/>
            <rect x="-10" y="22" width="20" height="18"/>
            <polygon points="-10,22 0,16 10,22" />
            {/* тонкий шпиль */}
            <rect x="-1" y="-22" width="2" height="38" fill="#c89a3a" stroke="#8a6a20"/>
            {/* кораблик */}
            <g transform="translate(0 -24)" fill="#c89a3a" stroke="#8a6a20">
              <path d="M -5 0 L 5 0 L 4 3 L -4 3 Z"/>
              <line x1="0" y1="0" x2="0" y2="-6"/>
              <polygon points="0,-6 5,-3 0,-2"/>
            </g>
          </g>

          {/* Ростральные колонны — две колонны со скульптурами */}
          <g transform="translate(330 100)">
            {[-12, 12].map((x,i)=>(
              <g key={i} transform={`translate(${x} 0)`}>
                <rect x="-5" y="30" width="10" height="10"/>
                <rect x="-2.5" y="0" width="5" height="30" fill="#5a4a3a" stroke="#3a2a1a"/>
                {/* "ростры" */}
                <rect x="-4" y="6" width="2" height="3" fill="#3a2a1a"/>
                <rect x="2" y="6" width="2" height="3" fill="#3a2a1a"/>
                <rect x="-4" y="14" width="2" height="3" fill="#3a2a1a"/>
                <rect x="2" y="14" width="2" height="3" fill="#3a2a1a"/>
                {/* верх — чаша/огонь */}
                <path d="M -3 0 L 0 -6 L 3 0 Z" fill="#c84a2e" stroke="#5a1808"/>
              </g>
            ))}
          </g>
        </g>

        {/* линия горизонта */}
        <line x1="0" y1="140" x2="400" y2="140" stroke="#a89a7e" strokeWidth="1.5"/>

        {/* щебёночная насыпь */}
        <rect x="0" y="142" width="400" height="22" fill="#9a8a72"/>
        {/* рельсы — две сплошные линии вдоль всей длины */}
        <rect x="0" y="145" width="400" height="3" fill="#3a2a1a"/>
        <rect x="0" y="158" width="400" height="3" fill="#3a2a1a"/>
        {/* шпалы — равномерно вдоль всей длины */}
        {Array.from({ length: 20 }).map((_, i) => (
          <rect key={i} x={i * 20} y="148" width="14" height="10" fill="#6a4a2a"/>
        ))}

        {/* поезд (анимируется) */}
        <g className="kv-train">
          {/* Вагоны — едут позади локомотива (слева) */}
          {[10, 50, 90, 130].map((x, i) => (
            <g key={i}>
              <rect x={x} y="108" width="34" height="32" fill={i % 2 ? '#7a5a4a' : '#5a3a2a'} stroke="#2a1810" strokeWidth="1.5"/>
              <rect x={x - 1} y="104" width="36" height="6" fill="#3a2a1a" stroke="#2a1810" strokeWidth="1.5"/>
              <rect x={x + 4} y="114" width="6" height="10" fill="#f7c84a" stroke="#2a1810" strokeWidth=".7"/>
              <rect x={x + 14} y="114" width="6" height="10" fill="#f7c84a" stroke="#2a1810" strokeWidth=".7"/>
              <rect x={x + 24} y="114" width="6" height="10" fill="#f7c84a" stroke="#2a1810" strokeWidth=".7"/>
              <circle className="kv-wheel" cx={x + 8} cy="143" r="5" fill="#2a1810" stroke="#5a3a1a" strokeWidth="1"/>
              <circle className="kv-wheel" cx={x + 26} cy="143" r="5" fill="#2a1810" stroke="#5a3a1a" strokeWidth="1"/>
              <line x1={x + 34} y1="135" x2={x + 41} y2="135" stroke="#2a1810" strokeWidth="2"/>
            </g>
          ))}

          {/* Локомотив (движется вправо: лицо/смокбокс справа) */}
          {/* Кабина машиниста — позади (слева) */}
          <rect x="170" y="90" width="36" height="50" fill="#5a3a2a" stroke="#2a1810" strokeWidth="2"/>
          <rect x="167" y="86" width="42" height="6" fill="#3a2a1a" stroke="#2a1810" strokeWidth="1.5"/>
          <rect x="178" y="98" width="20" height="14" fill="#f7c84a" stroke="#2a1810" strokeWidth="1"/>
          {/* Котёл паровоза */}
          <rect x="206" y="102" width="58" height="38" fill="#c84a2e" stroke="#2a1810" strokeWidth="2"/>
          <rect x="206" y="100" width="58" height="6" fill="#9a3a18" stroke="#2a1810" strokeWidth="1"/>
          {/* металлические полосы */}
          <line x1="206" y1="115" x2="264" y2="115" stroke="#9a3a18" strokeWidth="1"/>
          <line x1="206" y1="128" x2="264" y2="128" stroke="#9a3a18" strokeWidth="1"/>
          {/* Купол пара */}
          <rect x="232" y="92" width="14" height="10" fill="#9a3a18" stroke="#2a1810" strokeWidth="1.5"/>
          <ellipse cx="239" cy="92" rx="7" ry="4" fill="#9a3a18" stroke="#2a1810" strokeWidth="1.5"/>
          {/* Труба — спереди на котле */}
          <rect x="214" y="72" width="12" height="30" fill="#2a1810" stroke="#1a1008" strokeWidth="1"/>
          <rect x="211" y="68" width="18" height="6" fill="#2a1810" stroke="#1a1008" strokeWidth="1"/>
          {/* Пар из трубы */}
          <g className="kv-steam">
            <circle cx="220" cy="62" r="7" fill="#fff" opacity=".9"/>
            <circle cx="228" cy="56" r="5" fill="#fff" opacity=".75"/>
            <circle cx="232" cy="50" r="4" fill="#fff" opacity=".6"/>
          </g>
          {/* Смокбокс — круглое «лицо» спереди */}
          <circle cx="270" cy="121" r="19" fill="#3a2a1a" stroke="#1a1008" strokeWidth="2"/>
          <circle cx="270" cy="121" r="6" fill="#c89a3a" stroke="#1a1008" strokeWidth="1"/>
          <circle cx="270" cy="121" r="2" fill="#5a3a1a"/>
          {/* Фонарь спереди */}
          <circle cx="270" cy="103" r="4" fill="#f7c84a" stroke="#2a1810" strokeWidth="1"/>
          {/* Скотоотбойник */}
          <polygon points="270,140 292,140 287,151 268,151" fill="#5a4a3a" stroke="#2a1810" strokeWidth="1.5"/>
          <line x1="271" y1="140" x2="288" y2="149" stroke="#3a2a1a" strokeWidth="1"/>
          <line x1="276" y1="140" x2="289" y2="149" stroke="#3a2a1a" strokeWidth="1"/>
          <line x1="282" y1="140" x2="290" y2="149" stroke="#3a2a1a" strokeWidth="1"/>
          {/* Колёса локомотива */}
          <circle className="kv-wheel" cx="182" cy="145" r="6" fill="#2a1810" stroke="#5a3a1a" strokeWidth="1"/>
          <circle className="kv-wheel" cx="220" cy="146" r="10" fill="#2a1810" stroke="#5a3a1a" strokeWidth="1.5"/>
          <circle className="kv-wheel" cx="250" cy="146" r="10" fill="#2a1810" stroke="#5a3a1a" strokeWidth="1.5"/>
          {/* Шатун между колёсами */}
          <line x1="220" y1="146" x2="250" y2="146" stroke="#5a3a1a" strokeWidth="2.5"/>
          <circle cx="220" cy="146" r="2" fill="#c89a3a"/>
          <circle cx="250" cy="146" r="2" fill="#c89a3a"/>
        </g>
      </svg>
    </div>
  );
}

// 4. Вокзал в Берлине, карманные часы крупно
function SceneStation() {
  return (
    <div className="kv-scene" aria-label="Вокзал в Берлине" style={{ minHeight: 280 }}>
      <svg viewBox="0 0 400 240" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        {/* здание вокзала (слева, уступило место часам) */}
        <rect x="0" y="80" width="260" height="120" fill="#a87a5a" stroke="#5a3a2a" strokeWidth="2"/>
        <polygon points="0,80 130,40 260,80" fill="#7a4a2a" stroke="#3a2010" strokeWidth="2"/>
        <text x="130" y="68" fill="#fdf6e0" fontSize="12" fontFamily="serif" fontWeight="700" textAnchor="middle">BERLIN</text>
        {/* окна */}
        {[18,60,102,144,186,228].map((x,i)=>(
          <rect key={i} x={x} y="110" width="20" height="32" fill="#f7c84a" stroke="#5a3a2a" strokeWidth="1.5"/>
        ))}
        {/* перрон */}
        <rect x="0" y="200" width="400" height="40" fill="#7a7060" stroke="#5a4a3a" strokeWidth="1"/>
        <line x1="0" y1="210" x2="400" y2="210" stroke="#5a4a3a" strokeWidth=".7" opacity=".5"/>

        {/* Менделеев — узнаваемый, такой же как на других заставках */}
        <g transform="translate(70 134) scale(0.55)">
          <Mendeleev/>
        </g>
        {/* чемодан рядом с Менделеевым */}
        <g transform="translate(108 184)">
          <rect x="-1" y="-14" width="22" height="14" fill="#7a4a2a" stroke="#2a1810" strokeWidth="1.5"/>
          <rect x="8" y="-18" width="4" height="4" fill="#3a2010" stroke="#1a0808" strokeWidth=".8"/>
          <line x1="-1" y1="-7" x2="21" y2="-7" stroke="#3a2010" strokeWidth=".6"/>
        </g>

        {/* Карманные часы — справа, целиком в кадре */}
        <g transform="translate(330 124)" className="kv-pulse">
          {/* колечко-петля */}
          <circle cy="-72" r="7" fill="none" stroke="#5a3a1a" strokeWidth="2.5"/>
          <rect x="-2.5" y="-67" width="5" height="9" fill="#c89a3a" stroke="#5a3a1a" strokeWidth="1"/>
          {/* корпус */}
          <circle r="58" fill="#f7c84a" stroke="#5a3a1a" strokeWidth="3"/>
          <circle r="50" fill="#fdf6e0" stroke="#5a3a1a" strokeWidth="1.5"/>
          {/* деления */}
          {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => {
            const a = i*30 * Math.PI/180;
            const x1 = Math.sin(a)*44, y1 = -Math.cos(a)*44;
            const x2 = Math.sin(a)*50, y2 = -Math.cos(a)*50;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2a1810" strokeWidth="1.7"/>;
          })}
          {/* минутные засечки */}
          {Array.from({length:60}).map((_,i) => {
            if (i%5===0) return null;
            const a = i*6 * Math.PI/180;
            const x1 = Math.sin(a)*47, y1 = -Math.cos(a)*47;
            const x2 = Math.sin(a)*50, y2 = -Math.cos(a)*50;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5a3a1a" strokeWidth=".6"/>;
          })}
          {/* римские цифры */}
          <text y="-30" fontSize="12" fontFamily="serif" textAnchor="middle" fill="#2a1810" fontWeight="700">XII</text>
          <text x="34" y="5" fontSize="12" fontFamily="serif" textAnchor="middle" fill="#2a1810" fontWeight="700">III</text>
          <text y="40" fontSize="12" fontFamily="serif" textAnchor="middle" fill="#2a1810" fontWeight="700">VI</text>
          <text x="-34" y="5" fontSize="12" fontFamily="serif" textAnchor="middle" fill="#2a1810" fontWeight="700">IX</text>
          {/* мелкие цифры между основными */}
          {[
            ['I', 17, -25], ['II', 30, -13],
            ['IV', 30, 22], ['V', 17, 35],
            ['VII', -17, 35], ['VIII', -30, 22],
            ['X', -30, -13], ['XI', -17, -25],
          ].map(([n,x,y],i)=>(
            <text key={i} x={x} y={y} fontSize="7" fontFamily="serif" textAnchor="middle" fill="#5a3a1a">{n}</text>
          ))}
          {/* стрелки */}
          <rect className="kv-watch-min" x="-1.8" y="-36" width="3.6" height="36" fill="#2a1810" rx="1"/>
          <rect className="kv-watch-sec" x="-0.8" y="-44" width="1.6" height="44" fill="#c84a2e"/>
          <circle r="3.5" fill="#2a1810"/>
          <circle r="1.2" fill="#c84a2e"/>
        </g>
      </svg>
    </div>
  );
}

// 5. Поезд Берлин → Гамбург + пристань
function ScenePort() {
  return (
    <div className="kv-scene" style={{ background: 'linear-gradient(180deg, #fbd0a0 0%, #f48aa0 55%, #5a8aa8 55%, #2a5a7a 100%)' }} aria-label="Порт в Гамбурге">
      <svg viewBox="0 0 400 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        {/* солнце на закате */}
        <circle cx="320" cy="80" r="22" fill="#f7c84a" opacity=".95"/>
        <circle cx="320" cy="80" r="36" fill="#f7c84a" opacity=".25"/>

        {/* облако на горизонте */}
        <ellipse cx="100" cy="60" rx="36" ry="9" fill="#fff" opacity=".7"/>
        <ellipse cx="220" cy="50" rx="28" ry="7" fill="#fff" opacity=".6"/>

        {/* причал — деревянный, длинный */}
        <rect x="0" y="108" width="170" height="22" fill="#7a5a3a" stroke="#3a2010" strokeWidth="1.5"/>
        <rect x="0" y="105" width="170" height="5" fill="#5a3a1a"/>
        {/* доски */}
        {[20,50,80,110,140].map((x,i)=>(
          <line key={i} x1={x} y1="108" x2={x} y2="130" stroke="#5a3a1a" strokeWidth=".7"/>
        ))}
        {/* сваи под причалом */}
        {[20,55,90,125,160].map((x,i)=>(
          <rect key={i} x={x-2} y="130" width="4" height="40" fill="#3a2010"/>
        ))}

        {/* Пароход у причала — стоит, лёгкое покачивание */}
        <g transform="translate(260 115)">
          <g className="kv-wave">
            {/* корпус */}
            <rect x="-46" y="0" width="92" height="22" fill="#3a3030" stroke="#1a1008" strokeWidth="1.5"/>
            <polygon points="-46,0 -60,22 -46,22" fill="#3a3030" stroke="#1a1008" strokeWidth="1.5"/>
            <polygon points="46,0 60,22 46,22" fill="#3a3030" stroke="#1a1008" strokeWidth="1.5"/>
            {/* ватерлиния */}
            <line x1="-46" y1="14" x2="46" y2="14" stroke="#c84a2e" strokeWidth="1.5"/>
            {/* надстройка */}
            <rect x="-30" y="-22" width="60" height="24" fill="#fdf6e0" stroke="#5a3a1a" strokeWidth="1.5"/>
            <rect x="-32" y="-26" width="64" height="6" fill="#3a2010"/>
            {/* иллюминаторы */}
            {[-24,-14,-4,6,16,26].map((x,i)=>(
              <circle key={i} cx={x} cy="-12" r="2.4" fill="#7a8aaa" stroke="#2a1810" strokeWidth=".7"/>
            ))}
            {/* труба паровая */}
            <rect x="-3" y="-48" width="12" height="24" fill="#c84a2e" stroke="#5a1808" strokeWidth="1.5"/>
            <rect x="-5" y="-52" width="16" height="4" fill="#5a1808"/>
            <g className="kv-steam"><circle cx="3" cy="-56" r="5" fill="#fff" opacity=".85"/></g>
            {/* мачта и флаг */}
            <line x1="40" y1="-46" x2="40" y2="-22" stroke="#2a1810" strokeWidth="1.5"/>
            <polygon points="40,-46 56,-42 40,-38" fill="#c84a2e" stroke="#2a1810" strokeWidth=".6"/>
          </g>
        </g>

        {/* Менделеев на причале */}
        <g transform="translate(80 85) scale(0.45)">
          <Mendeleev/>
        </g>

        {/* трап с причала к пароходу */}
        <line x1="170" y1="118" x2="216" y2="118" stroke="#5a3a1a" strokeWidth="2.5"/>
      </svg>
    </div>
  );
}

// 6. Пароход и катер
function SceneChase() {
  return (
    <div className="kv-scene" style={{ background: 'linear-gradient(180deg, #a8c8e0 0%, #a8c8e0 55%, #3a6a88 55%, #2a4a68 100%)' }} aria-label="Катер догоняет пароход">
      <svg viewBox="0 0 400 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        {/* облака */}
        <ellipse cx="80" cy="40" rx="30" ry="10" fill="#fff" opacity=".8"/>
        <ellipse cx="280" cy="55" rx="40" ry="12" fill="#fff" opacity=".8"/>
        {/* волны (статичные линии моря) */}
        <g className="kv-wave">
          <path d="M 0 120 Q 100 115 200 120 Q 300 125 400 120" stroke="#5a8aa8" strokeWidth="2" fill="none"/>
          <path d="M 0 140 Q 100 135 200 140 Q 300 145 400 140" stroke="#5a8aa8" strokeWidth="2" fill="none"/>
          <path d="M 0 160 Q 100 155 200 160 Q 300 165 400 160" stroke="#5a8aa8" strokeWidth="2" fill="none"/>
        </g>
        {/* Пароход — медленный */}
        <g className="kv-ship-anim">
          <g transform="translate(40 105)">
            <rect x="-30" y="0" width="60" height="16" fill="#3a3030" stroke="#1a1008" strokeWidth="1.5"/>
            <polygon points="-30,0 -42,16 -30,16" fill="#3a3030" stroke="#1a1008" strokeWidth="1.5"/>
            <polygon points="30,0 42,16 30,16" fill="#3a3030" stroke="#1a1008" strokeWidth="1.5"/>
            <rect x="-18" y="-16" width="36" height="18" fill="#fdf6e0" stroke="#5a3a1a" strokeWidth="1.5"/>
            <rect x="-2" y="-35" width="8" height="20" fill="#c84a2e" stroke="#5a1808" strokeWidth="1.5"/>
            <g className="kv-steam"><circle cx="2" cy="-42" r="4" fill="#fff" opacity=".8"/></g>
          </g>
        </g>
        {/* Катер — быстрее, догоняет */}
        <g className="kv-catcher-anim">
          <g transform="translate(20 130)">
            <polygon points="-22,0 22,0 30,10 -28,10" fill="#c89a3a" stroke="#5a3a1a" strokeWidth="1.5"/>
            <rect x="-8" y="-12" width="16" height="12" fill="#fdf6e0" stroke="#5a3a1a" strokeWidth="1.5"/>
            <rect x="-1" y="-22" width="4" height="12" fill="#c84a2e" stroke="#5a1808" strokeWidth="1"/>
            <g className="kv-steam"><circle cx="1" cy="-26" r="3" fill="#fff" opacity=".8"/></g>
            {/* брызги */}
            <path d="M -28 10 q -6 -4 -10 0 q -2 -5 -8 -2" stroke="#fff" strokeWidth="1.5" fill="none"/>
          </g>
        </g>
      </svg>
    </div>
  );
}

// 7. Прибытие в Париж — Эйфелева башня (анахронизм, но узнаваемо)
function SceneParis() {
  return (
    <div className="kv-scene" style={{ background:'linear-gradient(180deg,#f4a8a8 0%,#fbd0a0 60%,#7a8a3a 100%)' }} aria-label="Прибытие в Париж">
      <svg viewBox="0 0 400 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <circle cx="320" cy="50" r="22" fill="#f7c84a" opacity=".9"/>
        {/* силуэты домов */}
        {[20,60,100,150,260,300,340].map((x,i)=>(
          <rect key={i} x={x} y={120 - (i%3)*10} width="35" height="80" fill="#5a3a3a" stroke="#2a1010" strokeWidth="1.5"/>
        ))}
        {[20,60,100,150,260,300,340].map((x,i)=>(
          <polygon key={'r'+i} points={`${x},${120 - (i%3)*10} ${x+17.5},${110 - (i%3)*10} ${x+35},${120 - (i%3)*10}`} fill="#7a4030" stroke="#2a1010" strokeWidth="1.5"/>
        ))}
        {/* Эйфелева башня — стилизованная, появляется */}
        <g transform="translate(200 30)" className="kv-eiffel">
          <path d="M -22 140 L -6 30 L 6 30 L 22 140 Z" fill="#5a3a2a" stroke="#2a1810" strokeWidth="1.5"/>
          <rect x="-30" y="60" width="60" height="6" fill="#5a3a2a" stroke="#2a1810" strokeWidth="1"/>
          <rect x="-28" y="90" width="56" height="6" fill="#5a3a2a" stroke="#2a1810" strokeWidth="1"/>
          <rect x="-24" y="120" width="48" height="6" fill="#5a3a2a" stroke="#2a1810" strokeWidth="1"/>
          <polygon points="-6,30 0,5 6,30" fill="#5a3a2a" stroke="#2a1810" strokeWidth="1.5"/>
        </g>
        {/* надпись */}
        <text x="200" y="190" fontSize="13" fontFamily="serif" fontWeight="700" textAnchor="middle" fill="#fdf6e0" style={{paintOrder:'stroke'}} stroke="#2a1810" strokeWidth="3">PARIS · 1867</text>
      </svg>
    </div>
  );
}

// ──────────── ЭТАПЫ задачи ────────────

const STAGES = [
  {
    id: 1,
    title: 'Этап 1. Расшифровка телеграммы',
    scene: 'strips',
    intro: 'Перед тобой две телеграфные ленты одной и той же телеграммы. В ленте I в каждом слове пропали 1-я и 3-я буквы. В ленте II — 2-я и 6-я. Сопоставь обе ленты, восстанови телеграмму и выпиши маршрут — города в порядке следования через запятую. Условные обозначения: ТЧК — точка, ЗПТ — запятая.',
    placeholder: 'Города через запятую…',
    check: (ans) => {
      const norm = ans.toLowerCase().replace(/[ёе]/g, 'е').replace(/-/g, '').replace(/\s+/g, ' ').trim();
      // Обязательные 4 города из телеграммы — в правильном порядке.
      const cities = ['берлин', 'гамбург', 'гавр', 'париж'];
      const idxs = cities.map(c => norm.indexOf(c));
      if (idxs.some(i => i < 0)) return false;
      return idxs.every((v, i) => i === 0 || v > idxs[i - 1]);
    },
    hints: [
      'Сопоставь буквы: в ленте I нет букв на позициях 1 и 3 каждого слова, в ленте II — на позициях 2 и 6. В сумме это все буквы слова.',
      'Первое слово: лента I — «_Е_ДЕЛЕЕВУ», лента II — «М_НДЕ_ЕЕВУ». Вместе → МЕНДЕЛЕЕВУ. А«_Ч_» и «_П_» — это ТЧК и ЗПТ (точка и запятая).',
      'Полный текст: «МЕНДЕЛЕЕВУ ТЧК ДОКУМЕНТЫ В БЕРЛИНЕ ТЧК ДАЛЕЕ ГАМБУРГ ЗПТ ПАРОХОД В ГАВР ЗПТ ЗАТЕМ ПАРИЖ ТЧК». Маршрут: Санкт-Петербург (отправление) → Берлин → Гамбург → Гавр → Париж.',
    ],
    successMsg: 'Восстановлено: «МЕНДЕЛЕЕВУ. ДОКУМЕНТЫ В БЕРЛИНЕ. ДАЛЕЕ ГАМБУРГ, ПАРОХОД В ГАВР, ЗАТЕМ ПАРИЖ.» — в путь!',
  },
  {
    id: 2,
    title: 'Этап 2. Скорость поезда',
    scene: 'train',
    intro: 'Поезд из Санкт-Петербурга идёт в Берлин с постоянной скоростью без остановок. Расстояние — 1600 км. Отправление 08:00 (по СПб), прибытие 22:00 следующего дня (по Берлину). Обратный поезд отходит из Берлина в 20:00 (Берлин), приходит в СПб 14:00 «через день» (СПб). Чему равна скорость поезда, км/ч?',
    placeholder: 'км/ч',
    check: (ans) => {
      const n = parseFloat(ans.replace(',', '.'));
      return Math.abs(n - 40) < 0.5;
    },
    hints: [
      'Обозначь разницу местного времени между Санкт-Петербургом и Берлином через Δ часов (СПб впереди Берлина). Вырази время в пути обоих поездов через Δ.',
      'Туда: 38 + Δ часов. Обратно («через день» — спустя двое суток): 42 − Δ часов. Поезд один и тот же — времена в пути равны.',
      '38 + Δ = 42 − Δ → Δ = 2 ч. Время в пути = 40 часов. Скорость = 1600 / 40 = 40 км/ч.',
    ],
    successMsg: 'Скорость найдена: 40 км/ч.',
  },
  {
    id: 3,
    title: 'Этап 3. Часы Менделеева',
    scene: 'station',
    intro: 'Часы Менделеева спешат на 8 минут, но он уверен, что они отстают на 12 минут. Документы передадут на вокзале в Берлине в момент, когда в Санкт-Петербурге будет 12:00. Менделеев приходит на вокзал, когда по его расчётам наступает нужное время. Во сколько на самом деле он окажется на вокзале (по местному времени Берлина)?',
    placeholder: 'ЧЧ:ММ (по местному времени Берлина)',
    check: (ans) => {
      const s = ans.replace(/[^0-9:.,]/g, '').replace('.', ':').replace(',', ':');
      const m = s.match(/^0?(\d{1,2}):(\d{2})$/);
      if (!m) return false;
      return parseInt(m[1]) === 9 && parseInt(m[2]) === 40;
    },
    hints: [
      'В СПб 12:00 ⇒ в Берлине это 10:00 (СПб впереди на 2 часа). Нужно прийти к 10:00 по местному Берлину.',
      'Менделеев думает: «часы отстают на 12 минут» — значит он будет ждать, пока на циферблате не покажется 10:00 − 12 минут = 9:48.',
      'А реально его часы спешат на 8 минут: когда на них 9:48, на самом деле 9:48 − 8 = 9:40 по Берлину. Он придёт на вокзал в 9:40.',
    ],
    successMsg: 'Точно: 9:40 по Берлину — он на 20 минут раньше документов.',
  },
  {
    id: 4,
    title: 'Этап 4. Успел ли на пароход?',
    scene: 'port',
    intro: 'Документы переданы в 10:00 (Берлин), и в этот же момент уходит поезд Берлин → Гамбург (240 км, 40 км/ч). Пароход в Гавр отправляется в 22:00 по местному времени Гамбурга. Берлин и Гамбург — в одном часовом поясе. Успел Менделеев или опоздал? (ответ «да» или «нет»)',
    placeholder: 'да / нет',
    check: (ans) => /^\s*д[ао]?/i.test(ans.trim()),
    hints: [
      'Сколько часов идёт поезд из Берлина в Гамбург? Раздели 240 на 40.',
      '240 / 40 = 6 часов. Поезд отходит в 10:00 — прибывает в Гамбург в 16:00.',
      'Пароход уходит в 22:00, у Менделеева остаётся 6 часов запаса — он успеет.',
    ],
    successMsg: 'Успел: запас 6 часов до отправления парохода.',
  },
  {
    id: 5,
    title: 'Этап 5. Катер догоняет пароход',
    scene: 'chase',
    intro: 'Пароход идёт со скоростью 20 км/ч. Когда он отошёл на 240 км от Гамбурга, выясняется, что часть чертежей осталась в порту. Вслед отправляют катер, скорость которого в 4 раза больше скорости парохода. На каком расстоянии от порта (в км) катер догонит пароход?',
    placeholder: 'расстояние в км',
    check: (ans) => {
      const n = parseFloat(ans.replace(',', '.'));
      return Math.abs(n - 320) < 0.5;
    },
    hints: [
      'Скорость катера = 4 × 20 = 80 км/ч. Скорость сближения = 80 − 20 = 60 км/ч.',
      'Расстояние догона: 240 / 60 = 4 часа. За это время пароход прошёл ещё 4 × 20 = 80 км.',
      '240 + 80 = 320 км от порта. На этом расстоянии катер и догонит пароход.',
    ],
    successMsg: '320 км — и катер у борта парохода.',
  },
];

// ──────────── Компонент этапа ────────────

function Scene({ kind }) {
  switch (kind) {
    case 'strips': return <SceneStrips/>;
    case 'train': return <SceneTrain/>;
    case 'station': return <SceneStation/>;
    case 'port': return <ScenePort/>;
    case 'chase': return <SceneChase/>;
    case 'paris': return <SceneParis/>;
    default: return <SceneTelegraph/>;
  }
}

function StageCard({ stage, unlocked, solved, onSolve }) {
  const [val, setVal] = kS('');
  const [hint, setHint] = kS(0); // 0 = no hint yet, 1..3 = show n hints
  const [wrong, setWrong] = kS(false);
  const ref = kR(null);

  kE(() => {
    if (unlocked && !solved && ref.current) {
      const t = setTimeout(() => ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
      return () => clearTimeout(t);
    }
  }, [unlocked, solved]);

  const submit = () => {
    if (!val.trim()) return;
    if (stage.check(val)) {
      setWrong(false);
      onSolve();
    } else {
      setWrong(true);
      setHint(h => Math.min(h + 1, stage.hints.length));
    }
  };

  return (
    <div ref={ref} className={`mmm-card kv-card ${unlocked ? 'unlocked' : 'locked'}`} style={{
      padding: 22, display: 'flex', flexDirection: 'column', gap: 14,
      borderLeft: solved ? '4px solid #5a7a4f' : `4px solid ${unlocked ? 'var(--terra)' : 'var(--paper-3)'}`,
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <div>
          <p className="mmm-eyebrow" style={{ margin: 0 }}>Этап {stage.id} из {STAGES.length}</p>
          <h3 className="mmm-h3" style={{ margin: '4px 0 0' }}>{stage.title.replace(/^Этап \d+\.\s*/, '')}</h3>
        </div>
        {solved && <span className="mmm-tag" style={{ background:'#5a7a4f', color:'#fff', borderColor:'#3a5a3a' }}>✓ решено</span>}
        {!unlocked && <span className="mmm-tag" style={{ color:'var(--ink-mute)' }}>🔒 заблокировано</span>}
      </div>

      {unlocked && (
        <>
          <Scene kind={stage.scene}/>

          <p className="mmm-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55 }}>{stage.intro}</p>

          <div style={{ display:'flex', gap: 8, flexWrap:'wrap', alignItems:'center' }}>
            {stage.multiline ? (
              <textarea className={`kv-input ${solved ? 'correct' : wrong ? 'wrong' : ''}`} value={val} onChange={e=>{ setVal(e.target.value); setWrong(false); }} placeholder={stage.placeholder} rows={3} style={{ flex:'1 1 100%', minWidth:280, resize:'vertical' }} disabled={solved}/>
            ) : (
              <input className={`kv-input ${solved ? 'correct' : wrong ? 'wrong' : ''}`} type="text" value={val} onChange={e=>{ setVal(e.target.value); setWrong(false); }} placeholder={stage.placeholder} style={{ flex:'1 1 240px', minWidth:200 }} disabled={solved} onKeyDown={e=>{ if(e.key==='Enter') submit(); }}/>
            )}
            {!solved && <button className="mmm-btn terra" onClick={submit}>Проверить →</button>}
            {!solved && hint > 0 && hint < stage.hints.length && (
              <button className="mmm-btn ghost" onClick={()=>setHint(h => Math.min(h + 1, stage.hints.length))}>Ещё подсказка</button>
            )}
          </div>

          {solved && <p className="kv-correct" style={{ margin: 0, fontSize: 14 }}>✓ {stage.successMsg}</p>}

          {!solved && hint > 0 && (
            <div className="kv-hint" style={{ padding: 12, background: 'var(--paper-2)', border: '1px dashed var(--line)', borderRadius: 6 }}>
              <p className="mmm-eyebrow" style={{ margin: 0 }}>Подсказка {hint} из {stage.hints.length}</p>
              <ol style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 13.5, lineHeight: 1.5 }}>
                {stage.hints.slice(0, hint).map((h, i) => <li key={i} style={{ marginBottom: 4 }}>{h}</li>)}
              </ol>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ──────────── Главный компонент ────────────

// ──────────── Главный компонент ────────────

// Страница «Менделеев» (квест 2025-26) — вытащена отдельно, чтобы можно было
// вернуть пользователя на индекс сезонов.
function MendeleevPage({ role, onBack }) {
  useKvadrigaStyles();
  const [screen, setScreen] = kS('intro'); // 'intro' | 'stages'
  const [solvedCount, setSolvedCount] = kS(0);
  const [resetKey, setResetKey] = kS(0);

  const handleSolve = (i) => setSolvedCount(c => Math.max(c, i + 1));

  return (
    <div style={{ maxWidth: 900, margin:'0 auto', display:'flex', flexDirection:'column', gap: 'var(--pad-lg)' }}>
      {/* Шапка */}
      <header className="mmm-fade-up" style={{ background:'linear-gradient(135deg, #f4dca8 0%, #e0b878 100%)', padding: '24px 200px 24px 26px', borderRadius: 12, border:'1.5px solid var(--line)', position:'relative', overflow:'hidden', minHeight: 180 }}>
        <img src="kvadriga-logo.png" alt="Логотип олимпиады «Квадрига»" style={{ position:'absolute', right: 18, top: 18, width: 132, height: 132, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 10px rgba(60,40,20,.15)' }}/>
        <div style={{ display:'flex', alignItems:'center', gap: 6, marginBottom: 6 }}>
          <button className="mmm-btn ghost" onClick={onBack} style={{ fontSize: 12, padding:'4px 10px' }}>← К сезонам</button>
          <span style={{ fontFamily:'var(--mono)', fontSize: 12, color:'#7a4a20' }}>2025 / 2026</span>
        </div>
        <p className="mmm-eyebrow" style={{ color:'#7a4a20' }}>Олимпиада «Квадрига» · финал</p>
        <h1 className="mmm-h1" style={{ fontSize: 32, margin:'4px 0 8px', color:'#3a2010' }}>Телеграмма Менделееву</h1>
        <p className="mmm-lead" style={{ margin: 0, fontSize: 15, color:'#3a2010', maxWidth:'60ch' }}>
          1867 год. Менделеев готовится к Всемирной выставке в Париже. Реши все пять этапов истории — каждый следующий открывается после правильного ответа.
        </p>
      </header>

      {screen === 'intro' ? (
        <IntroScreen role={role} onStart={()=>setScreen('stages')}/>
      ) : (
        <StagesScreen
          role={role}
          solvedCount={solvedCount}
          handleSolve={handleSolve}
          resetKey={resetKey}
          onReset={()=>{ setSolvedCount(0); setResetKey(k=>k+1); setScreen('intro'); }}
        />
      )}
    </div>
  );
}

// ──────────── СТРАНИЦА-ИНДЕКС «КВАДРИГА» ────────────
// Карточки-сезоны. Кликаешь — открывается задача.
function SeasonCard({ season, onOpen }) {
  return (
    <button onClick={onOpen}
      className="mmm-fade-up"
      style={{
        position:'relative', textAlign:'left', cursor:'pointer',
        background: season.bg,
        border: `2px solid ${season.border}`, borderRadius: 16,
        padding: '24px 26px', minHeight: 240,
        display:'flex', flexDirection:'column', justifyContent:'space-between',
        overflow:'hidden', transition:'transform .25s, box-shadow .25s',
        boxShadow:'0 1px 4px rgba(60,40,20,.05)',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 22px rgba(60,40,20,.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 4px rgba(60,40,20,.05)'; }}
    >
      {/* фоновая иллюстрация-обложка */}
      <div style={{ position:'absolute', right: -10, top: -10, width: 220, height: 220, opacity: .35, pointerEvents:'none' }}>
        {season.cover}
      </div>

      <div style={{ position:'relative' }}>
        <p className="mmm-eyebrow" style={{ margin: 0, color: season.eyebrow }}>{season.year}</p>
        <h2 className="mmm-h2" style={{ margin:'6px 0 6px', fontSize: 26, color: season.title }}>{season.name}</h2>
        <p className="mmm-body" style={{ margin: 0, fontSize: 14, color: season.lead, maxWidth:'30ch', lineHeight: 1.5 }}>{season.lead_text}</p>
      </div>

      <div style={{ position:'relative', display:'flex', alignItems:'center', gap: 8, marginTop: 16 }}>
        {season.tags.map(t => (
          <span key={t} style={{ fontFamily:'var(--mono)', fontSize: 11, padding:'4px 10px', borderRadius: 999, background:'rgba(255,255,255,.6)', color: season.eyebrow, border:`1px solid ${season.border}` }}>{t}</span>
        ))}
        <span style={{ marginLeft:'auto', fontFamily:'var(--serif)', fontSize: 14, fontWeight: 600, color: season.eyebrow }}>Открыть →</span>
      </div>
    </button>
  );
}

function KvadrigaPage({ role }) {
  useKvadrigaStyles();
  const [openSeason, setOpenSeason] = kS(null); // null | 'mendeleev' | 'indonesia'

  if (openSeason === 'mendeleev') {
    return <MendeleevPage role={role} onBack={()=>setOpenSeason(null)}/>;
  }
  if (openSeason === 'indonesia') {
    const IndonesiaPage = window.MMM_INDONESIA?.IndonesiaPage;
    if (IndonesiaPage) return <IndonesiaPage role={role} onBack={()=>setOpenSeason(null)}/>;
  }

  // ─── Индекс ───
  const seasons = [
    {
      id: 'indonesia',
      year: '2024 / 2025',
      name: 'Острова пряностей',
      lead_text: 'Три задачи на карте Индонезийского архипелага: проложить морские маршруты по упрямым течениям и подсчитать день встречи двух каракк.',
      tags: ['3 части', 'карта', 'плавание'],
      bg: 'linear-gradient(135deg, #cfe6f2 0%, #a8c4d8 100%)',
      border: '#5a8aa8',
      eyebrow: '#2a4a60',
      title: '#1a3a55',
      lead: '#1a3a55',
      cover: (
        <svg viewBox="0 0 220 220" style={{ width:'100%', height:'100%' }}>
          {/* стилизованная карта островов и парусник */}
          <path d="M 30 90 Q 50 70 80 80 Q 100 90 90 110 Q 70 120 50 115 Q 30 110 30 90 Z" fill="#e8d6a8" stroke="#5a3a1a" strokeWidth="2"/>
          <path d="M 110 70 Q 130 60 160 70 Q 175 80 165 100 Q 145 110 125 105 Q 105 95 110 70 Z" fill="#e8d6a8" stroke="#5a3a1a" strokeWidth="2"/>
          <path d="M 100 140 Q 130 130 170 140 Q 180 150 165 158 Q 130 165 105 158 Q 90 150 100 140 Z" fill="#e8d6a8" stroke="#5a3a1a" strokeWidth="2"/>
          {/* парусник */}
          <g transform="translate(155 105)">
            <path d="M -10 6 L 10 6 L 8 12 L -8 12 Z" fill="#3a2010" stroke="#1a0808" strokeWidth="1.5"/>
            <line x1="0" y1="6" x2="0" y2="-14" stroke="#3a2010" strokeWidth="1.5"/>
            <path d="M 0 -14 L 10 -2 L 0 -2 Z" fill="#fff" stroke="#3a2010" strokeWidth="1"/>
            <path d="M 0 -2 L -10 4 L 0 4 Z" fill="#fff" stroke="#3a2010" strokeWidth="1"/>
          </g>
          {/* стрелки-течения */}
          <path d="M 75 100 Q 95 90 115 95" stroke="#2a5a7a" strokeWidth="2" strokeDasharray="4 4" fill="none" markerEnd="url(#seasonArr)"/>
          <path d="M 150 110 Q 140 130 130 140" stroke="#2a5a7a" strokeWidth="2" strokeDasharray="4 4" fill="none" markerEnd="url(#seasonArr)"/>
          <defs>
            <marker id="seasonArr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 Z" fill="#2a5a7a"/>
            </marker>
          </defs>
        </svg>
      ),
    },
    {
      id: 'mendeleev',
      year: '2025 / 2026',
      name: 'Телеграмма Менделееву',
      lead_text: 'Пять этапов: расшифровать сбившуюся телеграмму, успеть на поезд, пароход и в Париж к открытию Всемирной выставки.',
      tags: ['квест', '5 этапов', '~20 мин'],
      bg: 'linear-gradient(135deg, #f4dca8 0%, #e0b878 100%)',
      border: '#b8884a',
      eyebrow: '#7a4a20',
      title: '#3a2010',
      lead: '#3a2010',
      cover: (
        <svg viewBox="0 0 220 220" style={{ width:'100%', height:'100%' }}>
          {/* Телеграфный аппарат Морзе с выходящей бумажной лентой */}
          {/* деревянное основание */}
          <rect x="40" y="120" width="140" height="32" rx="3" fill="#5a3a1a" stroke="#3a2010" strokeWidth="2"/>
          <rect x="40" y="120" width="140" height="6" fill="#3a2010"/>
          {/* латунные стойки */}
          <rect x="60" y="78" width="7" height="46" fill="#c89a3a" stroke="#5a3a10" strokeWidth="1.2"/>
          <rect x="153" y="78" width="7" height="46" fill="#c89a3a" stroke="#5a3a10" strokeWidth="1.2"/>
          {/* катушка-барабан сверху */}
          <ellipse cx="100" cy="82" rx="30" ry="11" fill="#c89a3a" stroke="#5a3a10" strokeWidth="1.5"/>
          <ellipse cx="100" cy="76" rx="30" ry="11" fill="#d9b04c" stroke="#5a3a10" strokeWidth="1.5"/>
          <circle cx="100" cy="76" r="5" fill="#3a2010"/>
          {/* стилус-прижим */}
          <rect x="120" y="94" width="18" height="7" fill="#3a2010" stroke="#1a0808" strokeWidth="1"/>
          <rect x="118" y="101" width="22" height="3" fill="#c89a3a" stroke="#5a3a10" strokeWidth="1"/>
          <line x1="129" y1="104" x2="129" y2="120" stroke="#5a3a10" strokeWidth="1.5"/>
          {/* искра */}
          <circle cx="129" cy="103" r="3" fill="#fff5a0" opacity=".9"/>
          <circle cx="129" cy="103" r="6" fill="#fff5a0" opacity=".35"/>
          {/* выходящая бумажная лента — точки-тире */}
          <path d="M 60 125 L 60 155 Q 60 170 50 178 L 28 195 Q 22 200 26 205 L 80 205" fill="#fdf6e0" stroke="#8a7a5a" strokeWidth="1.5"/>
          <g fill="#3a2010">
            <rect x="33" y="190" width="4" height="2"/>
            <rect x="40" y="190" width="9" height="2"/>
            <rect x="52" y="190" width="4" height="2"/>
            <rect x="60" y="190" width="4" height="2"/>
            <rect x="68" y="190" width="9" height="2"/>
          </g>
        </svg>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin:'0 auto', display:'flex', flexDirection:'column', gap: 'var(--pad-lg)' }}>
      {/* Шапка раздела */}
      <header className="mmm-fade-up" style={{ background:'linear-gradient(135deg, #f4dca8 0%, #e0b878 100%)', padding: '28px 30px', borderRadius: 12, border:'1.5px solid var(--line)', position:'relative', overflow:'hidden' }}>
        <img src="kvadriga-logo.png" alt="Логотип олимпиады «Квадрига»" style={{ position:'absolute', right: 22, top: 22, width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 10px rgba(60,40,20,.15)' }}/>
        <p className="mmm-eyebrow" style={{ color:'#7a4a20', margin: 0 }}>Олимпиада · авторские задачи</p>
        <h1 className="mmm-h1" style={{ fontSize: 32, margin:'4px 0 8px', color:'#3a2010', paddingRight: 140 }}>«Квадрига»</h1>
        <p className="mmm-lead" style={{ margin: 0, fontSize: 15.5, color:'#3a2010', maxWidth:'62ch' }}>
          Уже три года мы сочиняем задачи для финала интегрированной олимпиады «Квадрига» — каждая в своём жанре, со своим миром и героями.
        </p>
        <p className="mmm-body" style={{ margin: '10px 0 0', fontSize: 13.5, color:'#5a3a20', maxWidth:'62ch' }}>
          Выбери сезон ниже — откроется одна из задач финала в интерактивном виде.
        </p>
      </header>

      {/* Карточки сезонов */}
      <div className="mmm-grid" style={{ gridTemplateColumns:'1fr 1fr', gap: 20 }}>
        {seasons.map(s => (
          <SeasonCard key={s.id} season={s} onOpen={()=>setOpenSeason(s.id)}/>
        ))}
      </div>
    </div>
  );
}

// ──────────── Вводный экран ────────────

function IntroScreen({ role, onStart }) {
  return (
    <div className="kv-card unlocked" style={{ display:'flex', flexDirection:'column', gap: 16 }}>
      <div className="mmm-card" style={{ padding: 22, display:'flex', flexDirection:'column', gap: 16, borderLeft:'4px solid var(--terra)' }}>
        <p className="mmm-eyebrow" style={{ margin: 0 }}>Завязка истории · 1867 год</p>
        <h2 className="mmm-h2" style={{ margin: '2px 0 0' }}>Телеграмма Менделееву</h2>

        <SceneTelegraph/>

        <div style={{ fontSize: 15, lineHeight: 1.65, color:'var(--ink)' }}>
          <p style={{ margin: '0 0 10px' }}>
            <b>1867 год.</b> Дмитрий Иванович Менделеев готовится к поездке в Париж, на Всемирную выставку.
          </p>
          <p style={{ margin: '0 0 10px' }}>
            Перед самым отъездом ему передают срочную телеграмму — но телеграфный аппарат барахлит. Из-за сбоя в передаче пришли <b>две копии</b> одного и того же сообщения, и в каждой пропала часть букв:
          </p>
          <ul style={{ margin: '0 0 10px', paddingLeft: 22 }}>
            <li>в <b>ленте I</b> в каждом слове пропали <b>1-я и 3-я</b> буквы;</li>
            <li>в <b>ленте II</b> — <b>2-я и 6-я</b>;</li>
            <li>если сопоставить обе ленты, текст можно восстановить полностью.</li>
          </ul>
          <p style={{ margin: '0 0 10px' }}>
            Менделееву предстоит расшифровать телеграмму, собрать документы и пересечь пол-Европы, чтобы успеть на открытие выставки. Помоги ему — пройди вместе с ним <b>пять этапов</b>, и доберись до Парижа.
          </p>
          <p style={{ margin: 0, fontSize: 13, color:'var(--ink-mute)' }}>
            На каждом этапе нужно ответить на математический вопрос. Правильный ответ — открывается следующий этап. Если ошибся — появляются подсказки.
          </p>
        </div>

        <div style={{ display:'flex', gap: 10, alignItems:'center', flexWrap:'wrap' }}>
          <button className="mmm-btn terra" onClick={onStart} style={{ fontSize: 15, padding:'10px 20px' }}>Открыть телеграммы →</button>
          <span style={{ fontFamily:'var(--mono)', fontSize: 12, color:'var(--ink-mute)' }}>5 этапов · ~20 минут</span>
        </div>
      </div>

      {role === 'teacher' && (
        <div className="mmm-card" style={{ padding: 18, background:'var(--paper-2)', borderLeft:'3px solid var(--olive)' }}>
          <p className="mmm-eyebrow" style={{ margin: 0 }}>Учителю</p>
          <p className="mmm-body" style={{ margin: '6px 0 10px', fontSize: 13.5, lineHeight: 1.5 }}>
            Задача построена по принципу <i>«сюжет → математический вопрос»</i>: каждая глава истории даёт один параметр модели, который нужно вычислить. Это нарративный подход — он помогает погрузить ребёнка в исторический и математический контекст. Подсказки выдаются ступенчато — от наводящего вопроса до полного решения.
          </p>
          <div style={{ display:'flex', gap: 8, flexWrap:'wrap' }}>
            <a className="mmm-btn ghost" href="kvadriga-etap1-telegramma.pdf" target="_blank" rel="noopener" style={{ fontSize: 13, padding:'8px 14px', textDecoration:'none' }}>⤓ Этап 1. Телеграмма (PDF)</a>
            <a className="mmm-btn ghost" href="kvadriga-etap2-zadacha.pdf" target="_blank" rel="noopener" style={{ fontSize: 13, padding:'8px 14px', textDecoration:'none' }}>⤓ Этап 2. Условие задачи (PDF)</a>
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────── Экран с этапами ────────────

function StagesScreen({ role, solvedCount, handleSolve, resetKey, onReset }) {
  return (
    <>
      {/* Прогресс */}
      <div className="mmm-card" style={{ padding: 16, display:'flex', alignItems:'center', gap: 12 }}>
        <span style={{ fontFamily:'var(--serif)', fontSize: 14, fontWeight: 600 }}>Прогресс</span>
        <div style={{ flex: 1, height: 8, background:'var(--paper-3)', borderRadius: 4, overflow:'hidden' }}>
          <div style={{ width: `${(solvedCount / STAGES.length) * 100}%`, height: '100%', background:'linear-gradient(90deg, var(--terra), var(--olive))', transition:'width .5s' }}/>
        </div>
        <span style={{ fontFamily:'var(--mono)', fontSize: 13, color:'var(--ink-mute)' }}>{solvedCount}/{STAGES.length}</span>
        <button className="mmm-btn ghost" onClick={onReset} style={{ fontSize: 12, padding:'5px 10px' }}>↻ К началу</button>
      </div>

      {/* Этапы */}
      {STAGES.map((stage, i) => (
        <StageCard
          key={`${resetKey}-${stage.id}`}
          stage={stage}
          unlocked={role === 'teacher' || i <= solvedCount}
          solved={i < solvedCount}
          onSolve={()=>handleSolve(i)}
        />
      ))}

      {/* Финал */}
      {solvedCount === STAGES.length && (
        <div className="mmm-card kv-card unlocked" style={{ padding: 22, background:'linear-gradient(135deg,#e8efe0 0%,#cfdcc0 100%)', borderLeft:'4px solid #5a7a4f', textAlign:'center' }}>
          <h2 className="mmm-h2" style={{ color:'#2a4a20', marginTop:0 }}>{role === 'student' ? 'Ура! Менделеев в Париже!' : 'Финал. Менделеев в Париже.'}</h2>
          <p className="mmm-body" style={{ margin: 0 }}>{role === 'student' ? 'Все пять этапов пройдены!' : 'Все пять этапов пройдены. Эту задачу мы составили для финала олимпиады «Квадрига». В нарративном формате каждый шаг сюжета — это отдельный математический вопрос, и решение одного открывает следующий.'}</p>
        </div>
      )}

      {role === 'teacher' && (
        <div className="mmm-card" style={{ padding: 18, background:'var(--paper-2)', borderLeft:'3px solid var(--olive)' }}>
          <p className="mmm-eyebrow" style={{ margin: 0 }}>Учителю</p>
          <p className="mmm-body" style={{ margin: '6px 0 10px', fontSize: 13.5, lineHeight: 1.5 }}>
            Задача построена по принципу <i>«сюжет → математический вопрос»</i>: каждая глава истории даёт один параметр модели, который нужно вычислить. Это нарративный подход — он помогает погрузить ребёнка в исторический и математический контекст. Подсказки выдаются ступенчато: от наводящего вопроса до полного решения.
          </p>
          <div style={{ display:'flex', gap: 8, flexWrap:'wrap' }}>
            <a className="mmm-btn ghost" href="kvadriga-etap1-telegramma.pdf" target="_blank" rel="noopener" style={{ fontSize: 13, padding:'8px 14px', textDecoration:'none' }}>⤓ Этап 1. Телеграмма (PDF)</a>
            <a className="mmm-btn ghost" href="kvadriga-etap2-zadacha.pdf" target="_blank" rel="noopener" style={{ fontSize: 13, padding:'8px 14px', textDecoration:'none' }}>⤓ Этап 2. Условие задачи (PDF)</a>
          </div>
        </div>
      )}
    </>
  );
}

window.MMM_KVADRIGA = { KvadrigaPage };
