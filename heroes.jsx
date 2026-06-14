// SVG-герои: Квад (квадрат-педант) и Риви (точка-весельчак)
// Версия 4 — по присланному арт-направлению:
//  • Квад: строгий, в очках, костюм-двойка с галстуком, руки скрещены, брови «домиком»
//  • Риви: жизнерадостный жёлто-оранжевый шарик, широкая улыбка, руки приветственно вверх

const HP = {
  ink:        '#1f2a3a',  // тёмно-синие контуры (как на рефе)
  inkSoft:    '#3a4a5e',
  cream:      '#ffffff',
  white:      '#ffffff',

  // Квад — графит / шиферно-синий
  kvad:       '#5a6a80',  // основной серо-синий
  kvadDeep:   '#3f4d63',  // тени, штаны
  kvadShoe:   '#1f2a3a',  // ботинки
  kvadTie:    '#1f3a72',  // тёмно-синий галстук
  kvadShirt:  '#ffffff',

  // Риви — солнечный апельсин
  rivi:       '#f7b733',  // основной оранжево-жёлтый
  riviDeep:   '#e58a2a',  // обводка / тени / обувь
  riviShoe:   '#ef7e1a',
  riviBlush:  '#f5a99a',  // нежно-коралловые щёки
  riviTongue: '#e34b4b',

  // Лёгкий блик
  hilite:     'rgba(255,255,255,0.55)',
};

// ════════════════════════════════════════════════════════
// КВАД — строгий квадрат-педант в очках и костюме
// ════════════════════════════════════════════════════════
function HeroQuad({ size = 100, expression = 'happy', pose = 'wave' }) {
  // expression: 'happy' (полу-улыбка) | 'think' (хмурится сильнее)
  // pose: 'wave' (руки скрещены — фирменная поза) | 'point' (показывает указательным)
  const sw = 2.6;
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 100 125" style={{ display: 'block' }} aria-label="Квад">
      <defs>
        <linearGradient id="kvadShine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18"/>
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0"/>
        </linearGradient>
      </defs>

      {/* тень */}
      <ellipse cx="50" cy="120" rx="28" ry="2.6" fill="rgba(20,30,50,0.22)"/>

      {/* ────── Ноги (штаны + ботинки) ────── */}
      <g>
        <rect x="34"  y="86" width="9"  height="26" rx="2" fill={HP.kvadDeep} stroke={HP.ink} strokeWidth={sw}/>
        <rect x="57"  y="86" width="9"  height="26" rx="2" fill={HP.kvadDeep} stroke={HP.ink} strokeWidth={sw}/>
        {/* ботинки */}
        <ellipse cx="38.5" cy="115" rx="9"   ry="4.5" fill={HP.kvadShoe} stroke={HP.ink} strokeWidth={sw}/>
        <ellipse cx="61.5" cy="115" rx="9"   ry="4.5" fill={HP.kvadShoe} stroke={HP.ink} strokeWidth={sw}/>
        <ellipse cx="36"   cy="113.6" rx="2.5" ry="0.8" fill="#ffffff" opacity="0.35"/>
        <ellipse cx="59"   cy="113.6" rx="2.5" ry="0.8" fill="#ffffff" opacity="0.35"/>
      </g>

      {/* ────── Тело — квадрат-костюм ────── */}
      <g>
        <rect x="14" y="14" width="72" height="74" rx="6" fill={HP.kvad} stroke={HP.ink} strokeWidth={sw}/>
        <rect x="14" y="14" width="72" height="74" rx="6" fill="url(#kvadShine)"/>

        {/* воротничок-«V» + галстук */}
        <path d="M 38 14 L 50 30 L 62 14 Z" fill={HP.kvadShirt} stroke={HP.ink} strokeWidth="2"/>
        <path d="M 47 24 L 53 24 L 55 32 L 50 38 L 45 32 Z" fill={HP.kvadTie} stroke={HP.ink} strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M 47 24 L 53 24 L 51.5 28 L 48.5 28 Z" fill={HP.kvadTie} stroke={HP.ink} strokeWidth="1.2"/>

        {/* ──── Лицо ──── */}
        {/* брови — строго «домиком», сходятся к переносице */}
        <path d="M 22 36 Q 31 26 39 35" stroke={HP.ink} strokeWidth="3.6" fill="none" strokeLinecap="round"/>
        <path d="M 78 36 Q 69 26 61 35" stroke={HP.ink} strokeWidth="3.6" fill="none" strokeLinecap="round"/>

        {/* очки — чёрная толстая оправа, прямоугольно-скруглённая */}
        <g>
          {/* левая линза */}
          <rect x="20" y="36" width="22" height="16" rx="4" fill={HP.cream} stroke={HP.ink} strokeWidth="2.8"/>
          {/* правая линза */}
          <rect x="58" y="36" width="22" height="16" rx="4" fill={HP.cream} stroke={HP.ink} strokeWidth="2.8"/>
          {/* перемычка */}
          <path d="M 42 43 L 58 43" stroke={HP.ink} strokeWidth="2.8" strokeLinecap="round"/>
          {/* блики на линзах */}
          <rect x="22" y="38" width="6" height="3" rx="1.5" fill={HP.hilite}/>
          <rect x="60" y="38" width="6" height="3" rx="1.5" fill={HP.hilite}/>
          {/* зрачки */}
          <circle cx="33" cy="45" r="2.6" fill={HP.ink}/>
          <circle cx="67" cy="45" r="2.6" fill={HP.ink}/>
        </g>

        {/* нос — еле заметный штрих */}
        <path d="M 49 54 Q 50 58 51 54" stroke={HP.ink} strokeWidth="1.4" fill="none" strokeLinecap="round"/>

        {/* рот — слегка нахмуренный */}
        {expression === 'happy' && (
          <path d="M 42 65 Q 50 62 58 65" stroke={HP.ink} strokeWidth="2.6" fill="none" strokeLinecap="round"/>
        )}
        {expression === 'think' && (
          <path d="M 42 66 Q 50 60 58 66" stroke={HP.ink} strokeWidth="2.6" fill="none" strokeLinecap="round"/>
        )}
      </g>

      {/* ────── Руки ────── */}
      {pose === 'wave' && (
        // фирменная поза: руки чётко скрещены в нижней части корпуса, под лицом
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* ── задняя рука (рукав): от левого края к правой стороне ── */}
          <line x1="17" y1="70" x2="56" y2="80" stroke={HP.ink}  strokeWidth="10"/>
          <line x1="17" y1="70" x2="56" y2="80" stroke={HP.kvad} strokeWidth="6.4"/>
          {/* кисть задней руки — лежит на переднем рукаве */}
          <circle cx="59" cy="80.5" r="5" fill={HP.kvadShirt} stroke={HP.ink} strokeWidth="2.4"/>

          {/* ── передняя рука (рукав): от правого края к левой стороне, поверх ── */}
          <line x1="83" y1="70" x2="44" y2="80" stroke={HP.ink}     strokeWidth="10"/>
          <line x1="83" y1="70" x2="44" y2="80" stroke={HP.kvadDeep} strokeWidth="6.4"/>
          {/* кисть передней руки */}
          <circle cx="41" cy="80.5" r="5" fill={HP.kvadShirt} stroke={HP.ink} strokeWidth="2.4"/>
        </g>
      )}

      {pose === 'point' && (
        // правая рука указывает в сторону
        <g>
          {/* левая (на теле справа) — опущена вдоль корпуса */}
          <path d="M 18 60 Q 14 74 16 84" stroke={HP.ink} strokeWidth={sw} fill="none" strokeLinecap="round"/>
          <circle cx="16" cy="85" r="4" fill={HP.kvad} stroke={HP.ink} strokeWidth="2"/>
          {/* правая — поднята, указательный палец */}
          <path d="M 82 58 Q 92 56 96 50" stroke={HP.ink} strokeWidth={sw} fill="none" strokeLinecap="round"/>
          <g transform="translate(96 50)">
            <circle r="4.2" fill={HP.kvad} stroke={HP.ink} strokeWidth="2"/>
            <path d="M 2 -1 L 7 -3" stroke={HP.ink} strokeWidth="2" strokeLinecap="round"/>
          </g>
        </g>
      )}
    </svg>
  );
}

// ════════════════════════════════════════════════════════
// РИВИ — весёлая жёлто-оранжевая точка
// ════════════════════════════════════════════════════════
function HeroRivi({ size = 100, expression = 'happy', pose = 'wave' }) {
  const sw = 2.6;
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 100 125" style={{ display: 'block' }} aria-label="Риви">
      <defs>
        <radialGradient id="riviShine" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55"/>
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* тень */}
      <ellipse cx="50" cy="120" rx="28" ry="2.6" fill="rgba(60,40,20,0.22)"/>

      {/* ────── Ноги ────── */}
      <g>
        <rect x="36" y="84" width="8" height="26" rx="3" fill={HP.rivi} stroke={HP.riviDeep} strokeWidth={sw}/>
        <rect x="56" y="84" width="8" height="26" rx="3" fill={HP.rivi} stroke={HP.riviDeep} strokeWidth={sw}/>
        {/* ботинки-кеды */}
        <path d="M 30 110 Q 30 116 38 116 L 46 116 Q 48 116 48 113 L 48 109 Q 44 108 40 109 Q 34 109 30 110 Z"
              fill={HP.riviShoe} stroke={HP.riviDeep} strokeWidth={sw} strokeLinejoin="round"/>
        <path d="M 52 109 Q 52 116 60 116 L 68 116 Q 70 116 70 113 L 70 110 Q 66 108 62 109 Q 56 109 52 109 Z"
              fill={HP.riviShoe} stroke={HP.riviDeep} strokeWidth={sw} strokeLinejoin="round"/>
        {/* белая полоска на кеде */}
        <path d="M 32 114 Q 40 113 47 113" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M 54 114 Q 62 113 69 113" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </g>

      {/* ────── Тело — солнечный шарик ────── */}
      <g>
        <circle cx="50" cy="50" r="38" fill={HP.rivi} stroke={HP.riviDeep} strokeWidth={sw}/>
        <circle cx="50" cy="50" r="38" fill="url(#riviShine)"/>

        {/* брови — высокие, округлые, доброжелательные */}
        <path d="M 28 36 Q 33 30 40 34" stroke={HP.ink} strokeWidth="3.2" fill="none" strokeLinecap="round"/>
        <path d="M 72 36 Q 67 30 60 34" stroke={HP.ink} strokeWidth="3.2" fill="none" strokeLinecap="round"/>

        {/* глаза — большие блестящие */}
        <g>
          <circle cx="36" cy="46" r="6.5" fill={HP.cream} stroke={HP.ink} strokeWidth="1.8"/>
          <circle cx="64" cy="46" r="6.5" fill={HP.cream} stroke={HP.ink} strokeWidth="1.8"/>
          <circle cx="37" cy="47" r="3.6" fill={HP.ink}/>
          <circle cx="65" cy="47" r="3.6" fill={HP.ink}/>
          <circle cx="38.5" cy="45.5" r="1.4" fill="#ffffff"/>
          <circle cx="66.5" cy="45.5" r="1.4" fill="#ffffff"/>
        </g>

        {/* щёчки */}
        <ellipse cx="28" cy="58" rx="5" ry="3"   fill={HP.riviBlush} opacity="0.95"/>
        <ellipse cx="72" cy="58" rx="5" ry="3"   fill={HP.riviBlush} opacity="0.95"/>

        {/* широкая улыбка с зубами и язычком */}
        {expression === 'happy' && (
          <g>
            <path d="M 36 60 Q 50 78 64 60 Q 60 72 50 72 Q 40 72 36 60 Z"
                  fill={HP.ink} stroke={HP.ink} strokeWidth="2" strokeLinejoin="round"/>
            {/* зубы — белая полоска вверху */}
            <path d="M 39 62 Q 50 67 61 62 L 60 65 Q 50 68 40 65 Z"
                  fill="#ffffff"/>
            <line x1="46" y1="63.4" x2="46" y2="66.4" stroke={HP.ink} strokeWidth="0.7"/>
            <line x1="54" y1="63.4" x2="54" y2="66.4" stroke={HP.ink} strokeWidth="0.7"/>
            {/* язычок */}
            <ellipse cx="50" cy="71" rx="5" ry="2.6" fill={HP.riviTongue}/>
          </g>
        )}
        {expression === 'think' && (
          <path d="M 40 66 Q 50 60 60 66" stroke={HP.ink} strokeWidth="2.6" fill="none" strokeLinecap="round"/>
        )}
      </g>

      {/* ────── Руки приветственно подняты ────── */}
      {pose === 'wave' && (
        <g>
          {/* левая рука вверх */}
          <path d="M 22 50 Q 8 38 6 22" stroke={HP.riviDeep} strokeWidth={sw} fill="none" strokeLinecap="round"/>
          <g transform="translate(6 18)">
            {/* ладонь */}
            <circle r="6" fill={HP.rivi} stroke={HP.riviDeep} strokeWidth="2"/>
            {/* пальчики */}
            <path d="M -4 -2 L -7 -7" stroke={HP.riviDeep} strokeWidth="2" strokeLinecap="round"/>
            <path d="M -1 -4 L -2 -10" stroke={HP.riviDeep} strokeWidth="2" strokeLinecap="round"/>
            <path d="M  2 -4 L  3 -10" stroke={HP.riviDeep} strokeWidth="2" strokeLinecap="round"/>
            <path d="M  5 -2 L  8 -7"  stroke={HP.riviDeep} strokeWidth="2" strokeLinecap="round"/>
          </g>
          {/* правая рука вверх */}
          <path d="M 78 50 Q 92 38 94 22" stroke={HP.riviDeep} strokeWidth={sw} fill="none" strokeLinecap="round"/>
          <g transform="translate(94 18)">
            <circle r="6" fill={HP.rivi} stroke={HP.riviDeep} strokeWidth="2"/>
            <path d="M -5 -2 L -8 -7" stroke={HP.riviDeep} strokeWidth="2" strokeLinecap="round"/>
            <path d="M -2 -4 L -3 -10" stroke={HP.riviDeep} strokeWidth="2" strokeLinecap="round"/>
            <path d="M  1 -4 L  2 -10" stroke={HP.riviDeep} strokeWidth="2" strokeLinecap="round"/>
            <path d="M  4 -2 L  7 -7"  stroke={HP.riviDeep} strokeWidth="2" strokeLinecap="round"/>
          </g>
        </g>
      )}

      {pose === 'point' && (
        <g>
          {/* левая опущена/слегка в сторону */}
          <path d="M 22 56 Q 10 64 8 76" stroke={HP.riviDeep} strokeWidth={sw} fill="none" strokeLinecap="round"/>
          <circle cx="8" cy="77" r="4.5" fill={HP.rivi} stroke={HP.riviDeep} strokeWidth="2"/>
          {/* правая — машет/показывает */}
          <path d="M 78 46 Q 92 36 94 22" stroke={HP.riviDeep} strokeWidth={sw} fill="none" strokeLinecap="round"/>
          <g transform="translate(94 20)">
            <circle r="5.5" fill={HP.rivi} stroke={HP.riviDeep} strokeWidth="2"/>
            <path d="M -3 -2 L -5 -7" stroke={HP.riviDeep} strokeWidth="2" strokeLinecap="round"/>
            <path d="M  0 -3 L  0 -8" stroke={HP.riviDeep} strokeWidth="2" strokeLinecap="round"/>
            <path d="M  3 -2 L  5 -7" stroke={HP.riviDeep} strokeWidth="2" strokeLinecap="round"/>
          </g>
        </g>
      )}
    </svg>
  );
}

// ────────────────────────────────────────────────────────
// Декоративные SVG-дудлы (без изменений)
// ────────────────────────────────────────────────────────
function MathDoodle({ kind = 'plus', size = 24, color = '#f06a4c' }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (kind) {
    case 'plus': return <svg {...props}><path d="M 6 12 L 18 12 M 12 6 L 12 18"/></svg>;
    case 'minus': return <svg {...props}><path d="M 6 12 L 18 12"/></svg>;
    case 'times': return <svg {...props}><path d="M 7 7 L 17 17 M 17 7 L 7 17"/></svg>;
    case 'div': return <svg {...props}><path d="M 6 12 L 18 12"/><circle cx="12" cy="7" r="1.5" fill={color}/><circle cx="12" cy="17" r="1.5" fill={color}/></svg>;
    case 'eq': return <svg {...props}><path d="M 6 9 L 18 9 M 6 15 L 18 15"/></svg>;
    case 'q': return <svg {...props}><path d="M 9 9 Q 9 5 12 5 Q 15 5 15 8 Q 15 11 12 12 L 12 14"/><circle cx="12" cy="18" r="0.5" fill={color}/></svg>;
    case 'star': return <svg {...props}><path d="M 12 4 L 14 10 L 20 10 L 15 14 L 17 20 L 12 16 L 7 20 L 9 14 L 4 10 L 10 10 Z"/></svg>;
    case 'spark': return <svg {...props}><path d="M 12 4 L 12 8 M 12 16 L 12 20 M 4 12 L 8 12 M 16 12 L 20 12 M 6 6 L 9 9 M 15 15 L 18 18 M 6 18 L 9 15 M 15 9 L 18 6"/></svg>;
    case 'leaf': return <svg {...props} fill={color} stroke="none"><path d="M 4 20 Q 4 8 20 4 Q 16 20 4 20 Z" opacity="0.85"/><path d="M 6 18 L 16 8" stroke="#fff8e8" strokeWidth="1" fill="none"/></svg>;
    case 'flower': return <svg {...props} fill={color} stroke="none"><circle cx="12" cy="5" r="3"/><circle cx="19" cy="12" r="3"/><circle cx="12" cy="19" r="3"/><circle cx="5" cy="12" r="3"/><circle cx="12" cy="12" r="2.5" fill="#fff8e8"/></svg>;
    default: return null;
  }
}

window.MMM_HEROES = { HeroQuad, HeroRivi, MathDoodle };
