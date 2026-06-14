// Главное приложение — единый сайт «Мастерская математического мышления»
// Структура: Главная · Программа (модули М0–М7) · База задач · Уроки · Диагностика · Инструменты · Игры · Об авторах

const { useState: uS, useEffect: uE, useMemo: uM, useRef: uR } = React;

// ───── ШАПКА ─────
function NavItem({ s, section, setSection }) {
  const [open, setOpen] = uS(false);
  const ref = uR(null);
  uE(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  if (!s.children) {
    return <button className={section===s.id?'active':''} onClick={()=>setSection(s.id)}>{s.label}</button>;
  }
  const activeChild = s.children.some(c => c.id === section);
  return (
    <span ref={ref} style={{ position:'relative', display:'inline-flex' }}>
      <button className={activeChild?'active':''} onClick={()=>setOpen(o=>!o)}>{s.label} ▾</button>
      {open && (
        <div style={{ position:'absolute', top:'100%', left:0, zIndex:60, marginTop:6, minWidth:200,
          background:'var(--paper)', border:'1px solid var(--line)', borderRadius:10,
          boxShadow:'0 10px 28px rgba(0,0,0,.14)', padding:6, display:'flex', flexDirection:'column', gap:2 }}>
          {s.children.map(c => (
            <button key={c.id} onClick={()=>{ setSection(c.id); setOpen(false); }}
              style={{ font:'inherit', textAlign:'left', padding:'8px 12px', borderRadius:6, border:'none',
                cursor:'pointer', whiteSpace:'nowrap', fontSize:14, color:'var(--ink)',
                background: section===c.id ? 'var(--paper-2)' : 'transparent' }}>{c.label}</button>
          ))}
        </div>
      )}
    </span>
  );
}

function TopBar({ section, setSection, role, setRole, sections }) {
  return (
    <div className="mmm-topbar">
      <button className="mmm-brand" onClick={()=>{ setSection('home'); }} style={{background:'transparent', border:0, cursor:'pointer', padding:0, font:'inherit', color:'inherit', textAlign:'left'}}>
        <div className="mmm-brand-mark">М</div>
        <div>
          <div className="mmm-brand-name">Мастерская математического мышления</div>
          <div className="mmm-brand-sub">Курс для 1–4 классов · Кинтас &amp; Корешкова</div>
        </div>
      </button>
      <nav className="mmm-nav">
        {sections.map(s => (
          <NavItem key={s.id || s.label} s={s} section={section} setSection={setSection}/>
        ))}
      </nav>
      {role && (
        <div className="mmm-role-toggle" title="Переключить роль">
          <button className={role==='teacher'?'active':''} onClick={()=>{ setRole('teacher'); setSection('home'); }}>Учитель</button>
          <button className={role==='student'?'active':''} onClick={()=>{ setRole('student'); setSection('home'); }}>Ученик</button>
        </div>
      )}
      {!role && (
        <span style={{ fontSize: 12, color: 'var(--ink-mute)', fontFamily:'var(--mono)' }}>выбери, кто ты →</span>
      )}
    </div>
  );
}

// ───── ГЛАВНАЯ: ВЫБОР РОЛИ ─────
function LandingChooser({ setRole }) {
  const { HeroQuad, HeroRivi, MathDoodle } = window.MMM_HEROES;
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ textAlign:'center', marginBottom: 24 }}>
        <p className="mmm-eyebrow">Мастерская математического мышления</p>
        <h1 className="mmm-h1" style={{ fontSize: 36, marginTop: 6 }}>Добро пожаловать!</h1>
        <p className="mmm-lead" style={{ margin: '6px auto 0' }}>Выберите роль — мы покажем материалы, подобранные именно для Вас.</p>
      </div>

      <div className="mmm-landing">
        {/* СТУДЕНТ */}
        <button className="mmm-landing-side student" onClick={()=>setRole('student')}>
          {/* Фоновые дудлы */}
          <div style={{ position:'absolute', top: 16, right: 22, opacity:.35 }} className="mmm-spin-slow">
            <MathDoodle kind="star" size={36} color="#8a3a18"/>
          </div>
          <div style={{ position:'absolute', bottom: 90, right: 36, opacity:.3 }} className="mmm-float">
            <MathDoodle kind="plus" size={26} color="#8a3a18"/>
          </div>
          <div className="mmm-float" style={{ animationDelay:'1s', position:'absolute', top: 110, left: 24, opacity:.25 }}>
            <MathDoodle kind="q" size={22} color="#8a3a18"/>
          </div>

          <p className="mmm-landing-eyebrow">для тебя</p>
          <h2 className="mmm-landing-title">Я ученик</h2>
          <p className="mmm-landing-sub">Нестандартные задачи, логические игры и наглядные материалы для занятий. Вместе с героями курса — Квадом и Риви.</p>

          <div style={{ display:'flex', gap: 6, alignItems:'flex-end', margin: '6px 0' }}>
            <div className="mmm-bobble"><HeroQuad size={120} pose="wave"/></div>
            <div className="mmm-bobble" style={{ animationDelay:'.6s' }}><HeroRivi size={120} pose="wave"/></div>
          </div>

          <ul className="mmm-landing-bullets">
            <li>задачи-головоломки</li>
            <li>игры на логику</li>
            <li>кубики, монетки, числовая прямая</li>
            <li>друзья — Квад и Риви</li>
          </ul>

          <span className="mmm-landing-cta">Начать →</span>
        </button>

        {/* УЧИТЕЛЬ */}
        <button className="mmm-landing-side teacher" onClick={()=>setRole('teacher')}>
          <div style={{ position:'absolute', top: 22, right: 28, opacity:.25 }}>
            <MathDoodle kind="eq" size={32} color="#2a3a18"/>
          </div>
          <div style={{ position:'absolute', bottom: 100, right: 60, opacity:.2 }}>
            <MathDoodle kind="div" size={26} color="#2a3a18"/>
          </div>

          <p className="mmm-landing-eyebrow">для вас</p>
          <h2 className="mmm-landing-title">Я учитель</h2>
          <p className="mmm-landing-sub">Программа курса по развитию математического мышления младших школьников.</p>

          {/* Иконка-композиция: тетрадь + перо */}
          <div style={{ height: 140, display:'flex', alignItems:'center', gap: 14, padding: '6px 0' }}>
            <svg width="120" height="140" viewBox="0 0 120 140">
              {/* Тетрадь */}
              <rect x="14" y="16" width="80" height="108" rx="6" fill="#fdfaee" stroke="#2a2520" strokeWidth="2.5"/>
              <line x1="14" y1="34" x2="94" y2="34" stroke="#b04a4a" strokeWidth="1"/>
              {[44,58,72,86,100,114].map(y => <line key={y} x1="22" y1={y} x2="86" y2={y} stroke="#8a9a6a" strokeWidth="0.7"/>)}
              <line x1="28" y1="16" x2="28" y2="124" stroke="#b04a4a" strokeWidth="0.8" opacity=".6"/>
              {/* Колечки */}
              <circle cx="14" cy="32" r="3" fill="#2a2520"/>
              <circle cx="14" cy="70" r="3" fill="#2a2520"/>
              <circle cx="14" cy="108" r="3" fill="#2a2520"/>
              {/* Перо */}
              <g transform="translate(78 76) rotate(28)">
                <path d="M 0 0 L 36 -8 L 32 4 Z" fill="#c4724a" stroke="#2a2520" strokeWidth="1.5"/>
                <line x1="0" y1="0" x2="32" y2="-2" stroke="#2a2520" strokeWidth="1"/>
              </g>
              {/* Звёздочка-акцент */}
              <g transform="translate(102 30)" className="mmm-spin-slow" style={{ transformOrigin:'102px 30px' }}>
                <MathDoodle kind="star" size={20} color="#5a7a4f"/>
              </g>
            </svg>
          </div>

          <ul className="mmm-landing-bullets">
            <li>конспекты занятий</li>
            <li>теоретические материалы и методика</li>
            <li>база нестандартных задач с фильтрами</li>
            <li>диагностика ДТМ, КПН, ОПМ</li>
          </ul>

          <span className="mmm-landing-cta">Войти →</span>
        </button>
      </div>

      <p style={{ textAlign:'center', fontSize: 12, color:'var(--ink-mute)', marginTop: 16, fontFamily:'var(--mono)' }}>
        роль можно переключить в любой момент в правом верхнем углу
      </p>
    </div>
  );
}

// ───── ГЛАВНАЯ УЧЕНИКА ─────
function StudentHome({ setSection }) {
  const { HeroQuad, HeroRivi, MathDoodle } = window.MMM_HEROES;

  const bigCards = [
    {
      id: 'tasks', label: 'Задачи',
      sub: 'Хитрые задачи на смекалку. С подсказками, если застрял.',
      bg: 'linear-gradient(155deg, #fde2c8 0%, #f5b884 100%)',
      border: '#d99560', dot: '#8a3a18',
      icon: <MathDoodle kind="q" size={48} color="#8a3a18"/>,
    },
    {
      id: 'games', label: 'Игры',
      sub: 'Судоку, ним и магический квадрат. Голова работает в фоне.',
      bg: 'linear-gradient(155deg, #f5e6b8 0%, #e8c870 100%)',
      border: '#c89a3a', dot: '#6a5018',
      icon: <MathDoodle kind="star" size={48} color="#6a5018"/>,
    },
    {
      id: 'tools', label: 'Инструменты',
      sub: 'Кубики, монетка, числовая прямая. Что-нибудь покрутить.',
      bg: 'linear-gradient(155deg, #d8e0e8 0%, #a8b8c8 100%)',
      border: '#7a90a8', dot: '#2a4060',
      icon: <MathDoodle kind="plus" size={48} color="#2a4060"/>,
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection:'column', gap:'var(--pad-lg)' }}>
      {/* Hero */}
      <header className="mmm-student-hero mmm-fade-up">
        <div className="mmm-bobble"><HeroQuad size={140} pose="wave"/></div>
        <div style={{ minWidth: 0 }}>
          <p className="mmm-eyebrow" style={{ color:'#8a4a20' }}>Привет!</p>
          <h1 className="mmm-student-title">Что будем решать сегодня?</h1>
          <p className="mmm-lead" style={{ color:'#5a3a20', marginTop: 10, fontSize: 15.5 }}>
            Тут живут хитрые задачи. Если застрянешь — попроси подсказку. Ошибаться можно сколько угодно: это часть пути.
          </p>
        </div>
        <div className="mmm-bobble" style={{ animationDelay:'.6s' }}><HeroRivi size={140} pose="wave"/></div>

        {/* Декоративные дудлы */}
        <div style={{ position:'absolute', top: 14, right: 18, opacity:.4 }} className="mmm-spin-slow">
          <MathDoodle kind="spark" size={26} color="#8a3a18"/>
        </div>
        <div style={{ position:'absolute', bottom: 14, left: 32, opacity:.3 }} className="mmm-float">
          <MathDoodle kind="star" size={22} color="#8a3a18"/>
        </div>
      </header>

      {/* 3 большие карточки */}
      <div className="mmm-grid mmm-fade-up" style={{ gridTemplateColumns:'repeat(3, 1fr)', animationDelay:'.1s' }}>
        {bigCards.map(c => (
          <button key={c.id} className="mmm-student-big-card" onClick={()=>setSection(c.id)}
            style={{ background: c.bg, borderColor: c.border }}>
            <div className="corner">{c.icon}</div>
            <div style={{ width: 54, height: 54, borderRadius: 14, background: 'rgba(255,255,255,.55)', display:'grid', placeItems:'center', border: `1.5px solid ${c.border}` }}>
              {c.icon}
            </div>
            <div className="label">{c.label}</div>
            <div className="sub">{c.sub}</div>
            <div style={{ marginTop:'auto', display:'inline-flex', alignItems:'center', gap: 6, fontWeight: 600, fontSize: 13, color: c.dot }}>
              Открыть <span style={{ fontSize: 16 }}>→</span>
            </div>
          </button>
        ))}
      </div>

      {/* Познакомься с друзьями */}
      <section className="mmm-fade-up" style={{ animationDelay:'.2s' }}>
        <p className="mmm-eyebrow">Твои друзья</p>
        <h2 className="mmm-h2" style={{ fontSize: 22, marginBottom: 14 }}>Они помогут на каждом шагу</h2>
        <div className="mmm-grid" style={{ gridTemplateColumns:'1fr 1fr' }}>
          <div className="mmm-card" style={{ padding: '22px 20px', display:'flex', gap: 16, alignItems:'center', background:'#e6ebf2', borderColor:'#a8b4c4' }}>
            <div className="mmm-bobble"><HeroQuad size={110} pose="point"/></div>
            <div>
              <h3 style={{ margin:'0 0 4px', fontFamily:'var(--serif)', fontSize: 22, fontWeight:700, color:'#2a3a5a' }}>Квад</h3>
              <p style={{ margin: '0 0 6px', fontSize: 13, color:'var(--ink-soft)', fontStyle:'italic' }}>Строгий, любит порядок и считать всё подряд.</p>
              <p style={{ margin: 0, fontSize: 13, color:'var(--ink)' }}>Если задачу можно разложить по полочкам — Квад уже это сделал. Дружит с цифрами.</p>
            </div>
          </div>
          <div className="mmm-card" style={{ padding: '22px 20px', display:'flex', gap: 16, alignItems:'center', background:'#fdefd0', borderColor:'#e8b870' }}>
            <div className="mmm-bobble" style={{ animationDelay:'.5s' }}><HeroRivi size={110} pose="point"/></div>
            <div>
              <h3 style={{ margin:'0 0 4px', fontFamily:'var(--serif)', fontSize: 22, fontWeight:700, color:'#8a5818' }}>Риви</h3>
              <p style={{ margin: '0 0 6px', fontSize: 13, color:'var(--ink-soft)', fontStyle:'italic' }}>Весёлая, обожает головоломки и неожиданные ходы.</p>
              <p style={{ margin: 0, fontSize: 13, color:'var(--ink)' }}>Никогда не верит первой мысли. Всегда спрашивает: «А почему?». С ней не соскучишься.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Бесконечная подсказка */}
      <div className="mmm-card mmm-fade-up" style={{
        padding: '18px 22px', display:'flex', alignItems:'center', gap: 16,
        background: 'linear-gradient(135deg, #fdf2dc 0%, #f8e2b8 100%)',
        borderColor:'#d8b070', animationDelay:'.3s',
      }}>
        <div className="mmm-pulse" style={{ width: 44, height: 44, borderRadius:'50%', background:'#c89a3a', display:'grid', placeItems:'center', color:'#fdfaee', fontFamily:'var(--serif)', fontSize: 24, fontWeight: 700 }}>?</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily:'var(--serif)', fontSize: 17, fontWeight: 600, color:'var(--ink)' }}>Не получается?</div>
          <div style={{ fontSize: 13.5, color:'var(--ink-soft)' }}>Так и должно быть — это значит, что задача настоящая. Возьми подсказку или попробуй другой способ.</div>
        </div>
      </div>
    </div>
  );
}

// ───── ГЛАВНАЯ УЧИТЕЛЯ ─────
function TeacherHome({ setSection, hero = 'discover3' }) {
  const { COMPONENTS, MODULES, TASKS } = window.MMM_DATA;
  const { MathDoodle } = window.MMM_HEROES;
  const HEADLINES = {
    discover:   { eyebrow: 'Математическое мышление · 1–4 классы', title: 'Каждая задача — маленькое открытие.' },
    discover2:  { eyebrow: 'Математическое мышление · 1–4 классы', title: 'Математика, где есть что открыть.' },
    discover3:  { eyebrow: 'Математическое мышление · 1–4 классы', title: 'Большие открытия начинаются с маленьких задач!' },
    adventure:  { eyebrow: 'Математическое мышление · 1–4 классы', title: 'Математика как приключение мысли.' },
    adventure2: { eyebrow: 'Математическое мышление · 1–4 классы', title: 'Каждый урок — приключение мысли.' },
    adventure3: { eyebrow: 'Математическое мышление · 1–4 классы', title: 'Математика, в которую хочется идти.' },
    original:   { eyebrow: 'Учителю · программа курса', title: 'Учим думать и считать — не списывать готовое.' },
  };
  const H = HEADLINES[hero] || HEADLINES.discover3;
  const [startKonspekt, setStartKonspekt] = uS(null);
  const introK = (window.MMM_KONSPEKTY ? window.MMM_KONSPEKTY.KONSPEKTY.find(k => k.slug === 'quadrivium1') : null);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--pad-lg)' }}>
      {/* Hero */}
      <header className="mmm-card" style={{ padding: '34px 32px', background:'linear-gradient(135deg, #fdfaee 0%, #ece4cc 100%)', position:'relative', overflow:'hidden' }}>
        <div style={{ maxWidth: 720 }}>
          <p className="mmm-eyebrow">{H.eyebrow}</p>
          <h1 className="mmm-h1" style={{ fontSize: 38, lineHeight: 1.08 }}>{H.title}</h1>
          <p className="mmm-lead" style={{ marginTop: 12, fontSize: 15.5 }}>
            Программа из 8 модулей для 1–4 классов на основе нестандартных задач. Развиваем 5 компонентов мышления — логический, комбинаторный, пространственный, аргументационный и рефлексивный. С готовыми конспектами, теорией, диагностикой и фильтруемой базой задач.
          </p>
          <div style={{ display:'flex', gap: 8, marginTop: 18, flexWrap:'wrap' }}>
            <button className="mmm-btn terra" onClick={()=>setSection('modules')}>Программа курса →</button>
            <button className="mmm-btn ghost" onClick={()=>setSection('tasks')}>База задач</button>
            <button className="mmm-btn ghost" onClick={()=>setSection('diagnostic')}>Диагностика</button>
          </div>
        </div>
        <div style={{ position:'absolute', top: 12, right: 16, opacity:.25 }}>
          <MathDoodle kind="eq" size={32} color="#5a7a4f"/>
        </div>
        <div style={{ position:'absolute', bottom: 16, right: 90, opacity:.2 }}>
          <MathDoodle kind="div" size={24} color="#c4724a"/>
        </div>
      </header>

      {/* С чего начать — вводный урок курса */}
      {introK && (
        <button onClick={()=>setStartKonspekt(introK)} className="mmm-card" style={{
          cursor:'pointer', font:'inherit', textAlign:'left', padding: 0, overflow:'hidden',
          display:'flex', alignItems:'stretch', gap: 0, borderLeft:`4px solid ${introK.accent}`,
        }}>
          <div style={{ flex:'0 0 auto', width: 92, background: introK.soft, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap: 2 }}>
            <span style={{ fontFamily:'var(--serif)', fontSize: 32, fontWeight: 700, color: introK.accent, lineHeight: 1 }}>01</span>
            <span style={{ fontFamily:'var(--mono)', fontSize: 10, color: introK.accent, letterSpacing:'.04em' }}>урок&nbsp;1</span>
          </div>
          <div style={{ flex:'1 1 auto', minWidth: 0, padding:'18px 22px', display:'flex', flexDirection:'column', gap: 5 }}>
            <p className="mmm-eyebrow" style={{ color: introK.accent, margin: 0 }}>С чего начать · самый первый урок курса</p>
            <h3 style={{ margin: 0, fontFamily:'var(--serif)', fontSize: 21, fontWeight: 700, lineHeight: 1.15 }}>{introK.title}</h3>
            <p className="mmm-body" style={{ margin: 0, fontSize: 13, color:'var(--ink-soft)' }}>Вводное занятие во всех параллелях: знакомство с героями Квадом и Риви и со всеми типами задач курса. С него начинается путешествие по Квадривиуму.</p>
          </div>
          <div style={{ flex:'0 0 auto', alignSelf:'center', paddingRight: 22, fontSize: 13, fontWeight: 600, color: introK.accent, whiteSpace:'nowrap' }}>Открыть урок →</div>
        </button>
      )}

      {/* Главные рабочие тайлы */}
      <section>
        <p className="mmm-eyebrow">Главное</p>
        <div className="mmm-grid" style={{ gridTemplateColumns:'repeat(3, 1fr)' }}>
          {[
            { id:'konspekts', t:'Конспекты занятий', s:`Готовые конспекты уроков: о занятии, центральная идея, цели К1–К5 и ход. ${window.MMM_KONSPEKTY ? window.MMM_KONSPEKTY.READY_COUNT : 3} из 20 готовы.`, tag:'terra' },
            { id:'guide', t:'Как устроен курс', s:'Оргмодель, расписание, схема занятия на 80 мин и роль педагога по классам.', tag:'mustard' },
            { id:'teachkit', t:'Методкабинет', s:'Сквозные инструменты учителя: сигнальная карточка, банк открытых вопросов, карточки-маяки.', tag:'olive' },
            { id:'modules', t:'Теоретические материалы', s:'Методика, 5 компонентов мышления (К1–К5), континуум подачи задач.', tag:'olive' },
            { id:'tasks', t:'База задач', s:`${TASKS.length} нестандартных задач с фильтрами по К1–К5, модулям, классам, источникам.`, tag:'indigo' },
            { id:'kvadriga', t:'«Квадрига»', s:'Авторские задачи финала интегрированной олимпиады: каждый сезон — свой мир и герои, где сюжет ведёт к математическому вопросу.', tag:'terra' },
          ].map((t, i) => (
            <button key={i} className="mmm-card" onClick={()=>setSection(t.id)}
              style={{ cursor:'pointer', font:'inherit', textAlign:'left', display:'flex', flexDirection:'column', gap: 10, padding: '20px 18px', minHeight: 150 }}>
              <span className={`mmm-tag ${t.tag}`} style={{ alignSelf:'flex-start' }}>{t.t}</span>
              <p className="mmm-body" style={{ margin: 0, fontSize: 13.5, flex: 1 }}>{t.s}</p>
              <span style={{ fontSize: 12.5, fontWeight: 600, color:'var(--terra)' }}>Открыть →</span>
            </button>
          ))}
        </div>
      </section>

      {/* 5 компонентов */}
      <section>
        <p className="mmm-eyebrow">Что развиваем</p>
        <h2 className="mmm-h2" style={{ fontSize: 22, marginBottom: 14 }}>5 компонентов математического мышления</h2>
        <div className="mmm-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {COMPONENTS.map(c => (
            <div key={c.id} className="mmm-card" style={{ borderLeft: `4px solid ${c.color}`, padding: 14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 6, gap: 8 }}>
                <h3 style={{ margin:0, fontFamily:'var(--serif)', fontSize: 16, fontWeight:600, color: c.color }}>{c.id}</h3>
                <span style={{ fontSize: 11, color: 'var(--ink-mute)', textTransform:'uppercase', letterSpacing: '.06em' }}>{c.short}</span>
              </div>
              <p className="mmm-body" style={{ margin: 0, fontSize: 12.5 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Континуум */}
      <section>
        <p className="mmm-eyebrow">Методологическая основа</p>
        <h2 className="mmm-h2" style={{ fontSize: 22, marginBottom: 14 }}>Континуум подачи задач</h2>
        <p className="mmm-body" style={{ marginBottom: 16, maxWidth: '60ch' }}>
          Методический континуум: от нарративной подачи в 1 классе (задача спрятана за историей и героями) к полностью проблемной в 4 классе — строгой «взрослой» формулировке нестандартной задачи.
        </p>
        <div className="mmm-card" style={{ padding: '20px 24px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 14, color:'var(--ink-mute)' }}>
            <span>📖 Нарративный</span>
            <span>🔀 Смешанный</span>
            <span>🎯 Проблемный</span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background:'linear-gradient(90deg, #c4724a 0%, #c89a3a 50%, #4a6a8a 100%)', margin:'12px 0 6px' }}/>
          <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'var(--mono)', fontSize: 11, color:'var(--ink-mute)', marginBottom: 12 }}>
            <span>1 класс</span><span>2 класс</span><span>3 класс</span><span>4 класс</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 12, fontSize: 12.5, color:'var(--ink-soft)' }}>
            <div>Полноценная история с героями. Мотивирует и младших, и слабых учеников.</div>
            <div>Лёгкий сюжет, но математика на первом плане.</div>
            <div>Чистая задача без декораций. Готовит ребёнка к олимпиадному виду.</div>
          </div>
        </div>
      </section>

      {/* Программа: 8 модулей + дуга нарративности по классам */}
      <section>
        <p className="mmm-eyebrow">Программа курса</p>
        <h2 className="mmm-h2" style={{ fontSize: 22, marginBottom: 6 }}>8 модулей · 34 учебные недели</h2>
        <p className="mmm-body" style={{ marginBottom: 16, maxWidth: '62ch' }}>
          Восемь сквозных модулей проходят через все четыре параллели. Объём — 34 учебные недели в год: 102 занятия в 1–3 классах (по 3 в неделю) и 136 в 4 классе (по 4 в неделю).
        </p>
        <div className="mmm-card" style={{ padding: 20 }}>
          <div style={{ display:'grid', gridTemplateColumns:`repeat(${MODULES.length}, 1fr)`, gap: 6 }}>
            {MODULES.map(m => (
              <button key={m.id} onClick={()=>setSection('modules')} className="mmm-card" style={{
                background:'transparent', cursor:'pointer', border:'1px solid var(--line)', padding: 10,
                display:'flex', flexDirection:'column', gap: 6, textAlign:'left', font:'inherit',
                minHeight: 104,
              }}>
                <div style={{ fontFamily:'var(--mono)', fontSize: 11, color:'var(--ink-mute)' }}>{m.id}</div>
                <div style={{ fontFamily:'var(--serif)', fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>{m.title}</div>
                <div style={{ fontSize: 11, color:'var(--ink-mute)', marginTop:'auto' }}>{m.subtitle}</div>
              </button>
            ))}
          </div>
        </div>

        <p className="mmm-body" style={{ margin: '18px 0 12px', maxWidth: '62ch' }}>
          Дуга нарративности снижается от класса к классу: в 1 классе задача почти всегда спрятана в истории, к 4 классу остаётся «голая» проблемная формулировка.
        </p>
        <div className="mmm-card" style={{ padding: 20 }}>
          {(() => {
            const arc = [
              { grade: '1 класс', nar: 90 },
              { grade: '2 класс', nar: 65 },
              { grade: '3 класс', nar: 40 },
              { grade: '4 класс', nar: 15 },
            ];
            const W = 800, H = 120, padX = 20, padY = 16;
            const x = (i) => padX + (i/(arc.length-1)) * (W - 2*padX);
            const y = (v) => padY + (1 - v/100) * (H - 2*padY);
            return (
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize: 12, color:'var(--ink-mute)', marginBottom: 6 }}>
                  <span>📖 больше истории и героев</span>
                  <span>🎯 строгая формулировка</span>
                </div>
                <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display:'block' }}>
                  <defs>
                    <linearGradient id="mmm-arc-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c4724a" stopOpacity="0.22"/>
                      <stop offset="100%" stopColor="#c4724a" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d={`M ${x(0)} ${y(arc[0].nar)} ${arc.map((d,i)=>`L ${x(i)} ${y(d.nar)}`).join(' ')} L ${x(arc.length-1)} ${H-padY} L ${x(0)} ${H-padY} Z`} fill="url(#mmm-arc-fill)"/>
                  <path d={`M ${x(0)} ${y(arc[0].nar)} ${arc.map((d,i)=>`L ${x(i)} ${y(d.nar)}`).join(' ')}`} fill="none" stroke="#c4724a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  {arc.map((d,i) => (
                    <g key={d.grade}>
                      <circle cx={x(i)} cy={y(d.nar)} r="5" fill="#fff" stroke="#c4724a" strokeWidth="2.5"/>
                      <text x={x(i)} y={y(d.nar) - 12} textAnchor="middle" fontSize="15" fill="var(--ink)" style={{ fontWeight: 600 }}>{d.nar}%</text>
                    </g>
                  ))}
                </svg>
                <div style={{ display:'grid', gridTemplateColumns:`repeat(${arc.length}, 1fr)`, marginTop: 4 }}>
                  {arc.map(d => (
                    <div key={d.grade} style={{ textAlign:'center', fontFamily:'var(--mono)', fontSize: 12, color:'var(--ink-soft)' }}>{d.grade}</div>
                  ))}
                </div>
                <p style={{ fontSize: 11.5, color:'var(--ink-mute)', margin: '10px 0 0', textAlign:'center' }}>Доля задач с нарративной (сюжетной) подачей</p>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Доп. инструменты учителя */}
      <section className="mmm-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {[
          { id:'diagnostic', t:'Диагностика', s:'ДТМ онлайн (автоподсчёт по К1–К5), КПН, ОПМ, эссе и портфолио — с печатью бланков.' },
          { id:'tools', t:'Инструменты на проектор', s:'Кубики, монета, числовая прямая, сосуды, таймер, случайный выбор.' },
          { id:'games', t:'Игры для класса', s:'Судоку 4×4, ним, магический квадрат — для работы в парах и на перемене.' },
        ].map(t => (
          <button key={t.id} className="mmm-card" onClick={()=>setSection(t.id)}
            style={{ cursor:'pointer', font:'inherit', textAlign:'left', display:'flex', flexDirection:'column', gap: 8 }}>
            <h3 style={{ margin: 0, fontFamily:'var(--serif)', fontSize: 16, fontWeight: 600 }}>{t.t}</h3>
            <p className="mmm-body" style={{ margin: 0, fontSize: 13 }}>{t.s}</p>
            <span style={{ fontSize: 12, fontWeight: 600, color:'var(--terra)', marginTop: 'auto' }}>Открыть →</span>
          </button>
        ))}
      </section>

      {/* Подвал-авторы */}
      <footer className="mmm-card" style={{ padding: 18, display:'flex', alignItems:'center', gap: 14, background: 'var(--paper-2)' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin:'0 0 4px', fontFamily:'var(--serif)', fontSize: 15, fontWeight: 600 }}>Кинтас А.А. · Корешкова Л.С.</h3>
          <p className="mmm-body" style={{ margin: 0, fontSize: 12.5 }}>ПсковГУ · НИУ ВШЭ · школа «Квадривиум». Программа собрана в 2026 году в соавторстве.</p>
        </div>
        <button className="mmm-btn ghost" onClick={()=>setSection('about')}>Об авторах →</button>
      </footer>
      {startKonspekt && <window.MMM_KONSPEKTY.KonspektDetail k={startKonspekt} onClose={()=>setStartKonspekt(null)}/>}
    </div>
  );
}

// ───── ГЛАВНАЯ — диспетчер ─────
function HomePage({ setSection, role, setRole, hero }) {
  if (!role) return <LandingChooser setRole={setRole}/>;
  if (role === 'student') return <StudentHome setSection={setSection}/>;
  return <TeacherHome setSection={setSection} hero={hero}/>;
}

// ───── МОДУЛИ ─────
function ModulesPage({ role, setSection }) {
  const { MODULES, COMPONENTS, TASKS } = window.MMM_DATA;
  const [open, setOpen] = uS(null);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--pad-lg)' }}>
      <header>
        <p className="mmm-eyebrow">Программа курса</p>
        <h1 className="mmm-h1">8 модулей · 34 учебные недели</h1>
        <p className="mmm-lead">Каждый модуль развивает 1–3 компонента математического мышления. Можно проходить последовательно или выборочно.</p>
      </header>
      <div className="mmm-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {MODULES.map(m => (
          <button key={m.id} className="mmm-card" onClick={()=>setOpen(m)} style={{
            cursor:'pointer', font:'inherit', textAlign:'left', display:'flex', flexDirection:'column', gap: 10,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 700, color: 'var(--terra)' }}>{m.id}</span>
              <span className="mmm-tag mustard">{m.lessons} уроков</span>
            </div>
            <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 600 }}>{m.title}</h3>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-mute)', fontStyle: 'italic' }}>{m.subtitle}</p>
            <p className="mmm-body" style={{ margin: 0, fontSize: 13 }}>{m.desc}</p>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 8 }}>
              {m.components.map(cid => {
                const c = COMPONENTS.find(x => x.id === cid);
                return <span key={cid} className="mmm-tag" style={{ borderColor: c.color, color: c.color, fontSize: 10 }}>{c.id}</span>;
              })}
            </div>
          </button>
        ))}
      </div>
      {open && <ModuleDetail module={open} onClose={()=>setOpen(null)} setSection={setSection} role={role}/>}
    </div>
  );
}

function ModuleDetail({ module: m, onClose, setSection, role }) {
  const { COMPONENTS, TASKS } = window.MMM_DATA;
  const moduleTasks = TASKS.filter(t => t.module === m.id);
  const [openTask, setOpenTask] = uS(null);
  const [openKonspekt, setOpenKonspekt] = uS(null);
  const moduleKonspekts = (window.MMM_KONSPEKTY ? window.MMM_KONSPEKTY.konspektsForModule(m.id) : []);
  const [exportData, setExportData] = uS(null);
  const [selection, setSelection] = uS(() => {
    try { return JSON.parse(localStorage.getItem('mmm_selection') || '[]'); } catch (e) { return []; }
  });
  uE(() => { try { localStorage.setItem('mmm_selection', JSON.stringify(selection)); } catch (e) {} }, [selection]);
  const toggleSel = (id) => setSelection(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(40,30,20,.45)', zIndex: 100, display: 'grid', placeItems: 'center', padding: 20 }} onClick={onClose}>
      <div className="mmm-card" onClick={e=>e.stopPropagation()} style={{ maxWidth: 760, width: '100%', maxHeight: '90vh', overflow: 'auto', padding: 28, position: 'relative' }}>
        <button onClick={onClose} className="mmm-chip" style={{ position: 'absolute', top: 16, right: 16 }}>✕</button>
        <p className="mmm-eyebrow">Модуль {m.id}</p>
        <h2 className="mmm-h1" style={{ fontSize: 26 }}>{m.title}</h2>
        <p style={{ margin: '0 0 14px', fontSize: 15, color: 'var(--ink-mute)', fontStyle: 'italic' }}>{m.subtitle}</p>
        <p className="mmm-lead">{m.desc}</p>

        <div style={{ marginTop: 20, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {m.components.map(cid => {
            const c = COMPONENTS.find(x => x.id === cid);
            return (
              <div key={cid} className="mmm-tag" style={{ borderColor: c.color, color: c.color, padding: '5px 11px', fontSize: 12 }}>
                <b>{c.id}</b> · {c.short}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 22 }}>
          <h3 className="mmm-h3">Состав модуля</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span className="mmm-tag">Занятий по программе: {m.lessons}</span>
            <span className="mmm-tag">Готовых конспектов: {moduleKonspekts.length}</span>
            <span className="mmm-tag">Задач в банке: {moduleTasks.length}</span>
            <span className="mmm-tag">Доля нарратива: {Math.round(m.narrative * 100)}%</span>
          </div>
        </div>

        {moduleKonspekts.length > 0 && (
          <div style={{ marginTop: 22 }}>
            <h3 className="mmm-h3">Конспекты этого модуля ({moduleKonspekts.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {moduleKonspekts.map(k => (
                <button key={k.slug} onClick={()=>setOpenKonspekt(k)} className="mmm-card" style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left', font: 'inherit', width: '100%', borderLeft: `3px solid ${k.accent}` }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 14.5 }}>{k.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>{k.typeLabel} · {k.classes.length > 2 ? `${k.classes[0]}–${k.classes[k.classes.length-1]} кл` : k.classes.join(', ') + ' кл'} · {k.duration}</div>
                  </div>
                  <span style={{ flex: '0 0 auto', color: k.accent, fontSize: 18 }}>→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {moduleTasks.length > 0 && (
          <div style={{ marginTop: 22 }}>
            <h3 className="mmm-h3">Задачи модуля ({moduleTasks.length})</h3>
            <p style={{ fontSize: 12, color: 'var(--ink-mute)', margin: '0 0 8px' }}>Нажмите на задачу, чтобы открыть условие, подсказки и решение.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {moduleTasks.map(t => {
                const c = COMPONENTS.find(x => x.id === t.component);
                return (
                  <button key={t.id} onClick={()=>setOpenTask(t)} className="mmm-card" style={{ padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left', font: 'inherit', width: '100%' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 14 }}>{t.title}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 3, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{t.text}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 4, fontFamily: 'var(--mono)' }}>{c ? c.id + ' · ' : ''}{t.grade} класс · ★{t.difficulty} · {t.time} мин</div>
                    </div>
                    <span style={{ flex: '0 0 auto', color: 'var(--terra)', fontSize: 18 }}>→</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {openTask && <TaskDetail task={openTask} onClose={()=>setOpenTask(null)} role={role} inSel={selection.includes(openTask.id)} onToggleSel={toggleSel} onExportOne={(t,ap)=>setExportData({ tasks:[t], summary: t.title, autoPrint: ap })}/>}
      {exportData && <ExportView tasks={exportData.tasks} filterSummary={exportData.summary} autoPrint={exportData.autoPrint} role={role} onClose={()=>setExportData(null)}/>}
      {openKonspekt && <window.MMM_KONSPEKTY.KonspektDetail k={openKonspekt} onClose={()=>setOpenKonspekt(null)}/>}
    </div>
  );
}

// ───── ДИАГНОСТИКА ─────
// Реализация вынесена в diagnostics.jsx (window.MMM_DIAG.DiagnosticPage)
function DiagnosticPage({ role }) {
  return <window.MMM_DIAG.DiagnosticPage role={role}/>;
}

// ───── БАЗА ЗАДАЧ ─────
function TaskDifficulty({ d }) {
  return (
    <span className="mmm-difficulty" title={`Сложность ${d}/5`}>
      {[1,2,3,4,5].map(i => <span key={i} className={i<=d?'on':''}/>)}
    </span>
  );
}

function TaskCard({ task, onClick, compact }) {
  const { COMPONENTS, TYPES, MODES, SOURCES } = window.MMM_DATA;
  const comp = COMPONENTS.find(c => c.id === task.component);
  const mode = MODES.find(m => m.id === task.mode);
  const src = SOURCES.find(s => s.id === task.source);
  return (
    <button className="mmm-card" onClick={onClick} style={{
      cursor: 'pointer', font: 'inherit', textAlign: 'left',
      display: 'flex', flexDirection: 'column', gap: 8,
      transition: 'transform .1s, box-shadow .12s', borderLeft: `3px solid ${comp.color}`,
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
        <span className="mmm-tag" style={{ borderColor: comp.color, color: comp.color, fontWeight: 600 }} title={comp.full}>{comp.id} · {comp.short}</span>
        <TaskDifficulty d={task.difficulty}/>
      </div>
      <h4 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{task.title}</h4>
      {!compact && <p className="mmm-body" style={{ margin: 0, fontSize: 13, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{task.text}</p>}
      <div style={{ display:'flex', gap: 5, flexWrap:'wrap', marginTop: 'auto', alignItems:'center' }}>
        <span className="mmm-tag" title={src.name} style={{ fontFamily: 'var(--mono)', fontSize: 10.5, background: src.color+'15', borderColor: src.color+'66', color: src.color, fontWeight: 600, letterSpacing: 0.3 }}>{task.code}</span>
        <span className="mmm-tag">{task.grade} кл</span>
        <span className="mmm-tag" title={mode.name}>{mode.icon}</span>
        <span className="mmm-tag">{task.time} мин</span>
      </div>
    </button>
  );
}

function TaskDetail({ task, onClose, role, inSel, onToggleSel, onExportOne }) {
  const { COMPONENTS, SOURCES, MODES, TASKS } = window.MMM_DATA;
  const comp = COMPONENTS.find(c => c.id === task.component);
  const src = SOURCES.find(s => s.id === task.source);
  const mode = MODES.find(m => m.id === task.mode);
  const [showAns, setShowAns] = uS(false);
  const [showSol, setShowSol] = uS(false);
  const [hintIdx, setHintIdx] = uS(0);
  const similar = (task.similar || []).map(id => TASKS.find(t => t.id === id)).filter(Boolean);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(40,30,20,.45)', zIndex: 100, display: 'grid', placeItems: 'center', padding: 20 }} onClick={onClose}>
      <div className="mmm-card" onClick={e=>e.stopPropagation()} style={{ maxWidth: 720, width: '100%', maxHeight: '90vh', overflow: 'auto', padding: 28, position: 'relative' }}>
        <button onClick={onClose} className="mmm-chip" style={{ position: 'absolute', top: 16, right: 16 }}>✕</button>
        <div style={{ display:'flex', gap:8, marginBottom: 12, flexWrap:'wrap' }}>
          <span className="mmm-tag" style={{ borderColor: comp.color, color: comp.color, fontWeight: 600 }} title={comp.desc}>{comp.id} · {comp.full}</span>
          <span className="mmm-tag">{task.grade} класс</span>
          <span className="mmm-tag" title={src.name} style={{ fontFamily: 'var(--mono)', fontSize: 11, background: src.color+'18', borderColor: src.color+'66', color: src.color, fontWeight: 600 }}>📚 {task.code}</span>
          <span className="mmm-tag" title={mode.name}>{mode.icon} {mode.name}</span>
          <span className="mmm-tag">{task.time} мин</span>
          <TaskDifficulty d={task.difficulty}/>
        </div>
        <h2 className="mmm-h1" style={{ fontSize: 24 }}>{task.title}</h2>
        <p className="mmm-lead" style={{ fontSize: 15.5, color: 'var(--ink)' }}>{task.text}</p>

        {task.hints && task.hints.length > 0 && (
          <div style={{ marginTop: 18, padding: 12, background:'var(--paper-2)', borderRadius:8, border:'1px dashed var(--line)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 6, alignItems:'center' }}>
              <h3 className="mmm-h3" style={{ margin: 0 }}>Подсказки</h3>
              <span style={{ fontSize: 11, color:'var(--ink-mute)' }}>{hintIdx}/{task.hints.length}</span>
            </div>
            <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.55, color:'var(--ink-soft)' }}>
              {task.hints.slice(0, hintIdx).map((h,i) => <li key={i} style={{marginBottom:4}}>{h}</li>)}
            </ol>
            {hintIdx < task.hints.length && (
              <button className="mmm-chip" style={{ marginTop: 8 }} onClick={()=>setHintIdx(i=>i+1)}>Показать подсказку</button>
            )}
          </div>
        )}

        <div style={{ marginTop: 18, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="mmm-btn ghost" onClick={()=>setShowAns(s=>!s)}>{showAns ? '▾ Скрыть ответ' : '▸ Показать ответ'}</button>
          <button className="mmm-btn ghost" onClick={()=>setShowSol(s=>!s)}>{showSol ? '▾ Скрыть решение' : '▸ Показать решение'}</button>
        </div>
        {showAns && <div style={{ marginTop: 12, padding: 12, background:'#e8efe0', borderRadius: 8, border: '1px solid var(--olive-soft)' }}>
          <h3 className="mmm-h3" style={{ margin: '0 0 4px', color: 'var(--olive)' }}>Ответ</h3>
          <p className="mmm-body" style={{ margin: 0, color:'var(--ink)' }}>{task.answer}</p>
        </div>}
        {showSol && <div style={{ marginTop: 12, padding: 12, background:'#fdfaee', borderRadius: 8, border: '1px solid var(--line)' }}>
          <h3 className="mmm-h3" style={{ margin: '0 0 4px' }}>Решение</h3>
          <p className="mmm-body" style={{ margin: 0, color:'var(--ink)' }}>{task.solution}</p>
        </div>}

        {role === 'teacher' && task.teacher && (
          <div style={{ marginTop: 18, padding: 14, background: '#f5e8d8', borderRadius: 8, border: '1px solid var(--terra-soft)' }}>
            <h3 className="mmm-h3" style={{ margin: '0 0 6px', color: 'var(--terra)' }}>📐 Учителю</h3>
            <p className="mmm-body" style={{ margin: 0, color: 'var(--ink)' }}>{task.teacher}</p>
          </div>
        )}

        {similar.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <h3 className="mmm-h3">Похожие задачи</h3>
            <div className="mmm-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))' }}>
              {similar.map(s => <TaskCard key={s.id} task={s} compact onClick={()=>{}}/>)}
            </div>
          </div>
        )}

        <hr className="mmm-divider"/>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="mmm-btn ghost" onClick={()=>onExportOne && onExportOne(task, false)} title="Открыть как документ для сохранения в PDF">⤓ PDF</button>
          <button className="mmm-btn ghost" onClick={()=>onExportOne && onExportOne(task, true)} title="Открыть и сразу отправить на печать">⎙ Распечатать</button>
          <button className={`mmm-btn ${inSel ? 'terra' : 'ghost'}`} onClick={()=>onToggleSel && onToggleSel(task.id)} title={inSel ? 'Убрать из подборки' : 'Добавить в подборку для печати нескольких задач'}>{inSel ? '★ В подборке' : '☆ В подборку'}</button>
        </div>
      </div>
    </div>
  );
}

// ───── ЭКСПОРТ ПОДБОРКИ ЗАДАЧ В PDF ─────
function ExportView({ tasks, filterSummary, role, onClose, autoPrint, onClear }) {
  const { COMPONENTS, SOURCES, MODES } = window.MMM_DATA;
  const [opt, setOpt] = uS({
    answer: role === 'teacher',
    solution: role === 'teacher',
    hints: true,
    teacher: false,
  });
  const toggle = (k) => setOpt(o => ({ ...o, [k]: !o[k] }));

  uE(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  uE(() => {
    if (autoPrint && tasks.length > 0) {
      const t = setTimeout(() => window.print(), 450);
      return () => clearTimeout(t);
    }
  }, []);

  const today = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  const stars = (d) => '★'.repeat(d) + '☆'.repeat(5 - d);

  const toggles = [
    { k: 'answer',   label: 'Ответы' },
    { k: 'solution', label: 'Решения' },
    { k: 'hints',    label: 'Подсказки' },
    { k: 'teacher',  label: 'Заметки учителю' },
  ];

  const content = (
    <div className="mmm-export-portal">
      <style>{`
        .mmm-export-portal {
          position: fixed; inset: 0; z-index: 300;
          background: var(--paper); overflow: auto;
          font-family: var(--sans); color: var(--ink);
          -webkit-font-smoothing: antialiased;
        }
        .mmm-export-sheet { max-width: 820px; margin: 0 auto; padding: 40px 48px 80px; }
        .mmm-export-toolbar {
          position: sticky; top: 0; z-index: 2;
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
          padding: 12px 20px; background: var(--paper-2);
          border-bottom: 1.5px solid var(--line);
        }
        .mmm-export-toolbar .grow { flex: 1 1 auto; }
        .mmm-export-doc-head { border-bottom: 2px solid var(--ink); padding-bottom: 16px; margin-bottom: 8px; }
        .mmm-export-task {
          break-inside: avoid; page-break-inside: avoid;
          padding: 18px 0; border-bottom: 1px solid var(--line-soft);
        }
        .mmm-export-task:last-child { border-bottom: 0; }
        .mmm-export-meta {
          display: flex; flex-wrap: wrap; gap: 6px 12px; align-items: center;
          font-family: var(--mono); font-size: 11px; color: var(--ink-mute);
          margin: 4px 0 10px;
        }
        .mmm-export-meta .sep { opacity: .4; }
        .mmm-export-block {
          margin-top: 10px; padding: 10px 14px; border-radius: 8px;
          font-size: 13.5px; line-height: 1.55;
        }
        .mmm-export-block .lbl {
          font-family: var(--sans); font-weight: 700; font-size: 11px;
          text-transform: uppercase; letter-spacing: .06em; display: block; margin-bottom: 4px;
        }
        @media print {
          @page { margin: 16mm 14mm; }
          html, body { background: #fff !important; height: auto !important; overflow: visible !important; }
          #root { display: none !important; }
          .mmm-export-portal {
            position: static !important; inset: auto !important;
            overflow: visible !important; height: auto !important; background: #fff !important;
          }
          .mmm-export-toolbar { display: none !important; }
          .mmm-export-sheet { max-width: none; margin: 0; padding: 0; }
          .mmm-export-block { border: 1px solid #ccc !important; }
        }
      `}</style>

      <div className="mmm-export-toolbar">
        <strong style={{ fontFamily: 'var(--serif)', fontSize: 15 }}>Экспорт · {tasks.length} задач</strong>
        <span style={{ fontSize: 12.5, color: 'var(--ink-mute)' }}>включить в документ:</span>
        {toggles.map(t => (
          <button key={t.k} className={`mmm-chip ${opt[t.k] ? 'active' : ''}`} onClick={()=>toggle(t.k)}>
            {opt[t.k] ? '✓ ' : ''}{t.label}
          </button>
        ))}
        <span className="grow"/>
        <button className="mmm-btn terra" onClick={()=>window.print()}>⎙ Сохранить в PDF</button>
        {onClear && <button className="mmm-btn ghost" onClick={()=>{ if (confirm('Очистить подборку?')) onClear(); }} title="Убрать все задачи из подборки">✕ Очистить</button>}
        <button className="mmm-btn ghost" onClick={onClose}>Закрыть</button>
      </div>

      <div className="mmm-export-sheet">
        <header className="mmm-export-doc-head">
          <p className="mmm-eyebrow" style={{ margin: 0 }}>Мастерская математического мышления</p>
          <h1 className="mmm-h1" style={{ fontSize: 30, margin: '6px 0 8px' }}>Подборка задач</h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontSize: 12.5, color: 'var(--ink-mute)' }}>
            <span>{filterSummary || 'Все задачи'} · {tasks.length} шт.</span>
            <span style={{ fontFamily: 'var(--mono)' }}>{today}</span>
          </div>
        </header>

        {tasks.map((task, i) => {
          const comp = COMPONENTS.find(c => c.id === task.component);
          const src = SOURCES.find(s => s.id === task.source);
          const mode = MODES.find(m => m.id === task.mode);
          return (
            <article key={task.id} className="mmm-export-task">
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 19, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                <span style={{ color: 'var(--terra)' }}>{i + 1}.</span> {task.title}
              </h2>
              <div className="mmm-export-meta">
                <span style={{ color: comp.color, fontWeight: 600 }}>{comp.id} · {comp.short}</span>
                <span className="sep">·</span><span>{task.grade} класс</span>
                <span className="sep">·</span><span title="сложность">{stars(task.difficulty)}</span>
                <span className="sep">·</span><span>{task.time} мин</span>
                {mode && <><span className="sep">·</span><span>{mode.icon} {mode.name}</span></>}
                {src && <><span className="sep">·</span><span>{task.code}</span></>}
              </div>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink)' }}>{task.text}</p>

              {opt.hints && task.hints && task.hints.length > 0 && (
                <div className="mmm-export-block" style={{ background: 'var(--paper-2)', border: '1px dashed var(--line)' }}>
                  <span className="lbl" style={{ color: 'var(--ink-mute)' }}>Подсказки</span>
                  <ol style={{ margin: 0, paddingLeft: 18, color: 'var(--ink-soft)' }}>
                    {task.hints.map((h, k) => <li key={k} style={{ marginBottom: 2 }}>{h}</li>)}
                  </ol>
                </div>
              )}
              {opt.answer && task.answer && (
                <div className="mmm-export-block" style={{ background: '#e8efe0', border: '1px solid var(--olive-soft)' }}>
                  <span className="lbl" style={{ color: 'var(--olive)' }}>Ответ</span>
                  <span style={{ color: 'var(--ink)' }}>{task.answer}</span>
                </div>
              )}
              {opt.solution && task.solution && (
                <div className="mmm-export-block" style={{ background: '#fdfaee', border: '1px solid var(--line)' }}>
                  <span className="lbl">Решение</span>
                  <span style={{ color: 'var(--ink)' }}>{task.solution}</span>
                </div>
              )}
              {opt.teacher && task.teacher && (
                <div className="mmm-export-block" style={{ background: '#f5e8d8', border: '1px solid var(--terra-soft)' }}>
                  <span className="lbl" style={{ color: 'var(--terra)' }}>Учителю</span>
                  <span style={{ color: 'var(--ink)' }}>{task.teacher}</span>
                </div>
              )}
            </article>
          );
        })}

        {tasks.length === 0 && (
          <p style={{ color: 'var(--ink-mute)', padding: '40px 0', textAlign: 'center' }}>
            В выборке нет задач. Закройте экспорт и измените фильтры.
          </p>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}

function TasksPage({ role }) {
  const { TASKS, COMPONENTS, SOURCES, MODES, GRADES, DIFFICULTIES, TIMES, FORMATS } = window.MMM_DATA;
  const [grade, setGrade] = uS(null);
  const [diff, setDiff] = uS(null);
  const [comp, setComp] = uS(null);
  const [src, setSrc] = uS(null);
  const [mode, setMode] = uS(null);
  const [q, setQ] = uS('');
  const [open, setOpen] = uS(null);
  const [exportData, setExportData] = uS(null); // { tasks, summary, autoPrint }
  const [selection, setSelection] = uS(() => {
    try { return JSON.parse(localStorage.getItem('mmm_selection') || '[]'); } catch (e) { return []; }
  });
  uE(() => { try { localStorage.setItem('mmm_selection', JSON.stringify(selection)); } catch (e) {} }, [selection]);
  const toggleSel = (id) => setSelection(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const selectedTasks = selection.map(id => TASKS.find(t => t.id === id)).filter(Boolean);

  const filtered = TASKS.filter(t => {
    if (grade && t.grade !== grade) return false;
    if (diff && t.difficulty !== diff) return false;
    if (comp && t.component !== comp) return false;
    if (src && t.source !== src) return false;
    if (mode && t.mode !== mode) return false;
    if (q && !(t.title + ' ' + t.text + ' ' + (t.code || '')).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const reset = () => { setGrade(null); setDiff(null); setComp(null); setSrc(null); setMode(null); setQ(''); };

  const filterSummary = (() => {
    const parts = [];
    if (grade) parts.push(`${grade} класс`);
    if (diff) parts.push(`сложность ★${diff}`);
    if (comp) { const c = COMPONENTS.find(x => x.id === comp); parts.push(c ? `${c.id} · ${c.short}` : comp); }
    if (src) { const s = SOURCES.find(x => x.id === src); parts.push(s ? s.name : src); }
    if (mode) { const m = MODES.find(x => x.id === mode); parts.push(m ? m.name : mode); }
    if (q) parts.push(`«${q}»`);
    return parts.length ? parts.join(' · ') : 'Все задачи';
  })();

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--pad-lg)' }}>
      {role === 'student' && (
        <StudentPageHeader mascot="quad" eyebrow="Задачи" title="Хитрые задачи ждут"
          lead="Если застрянешь — нажми «Подсказка». Ошибаться можно сколько угодно: это часть пути."
          accent="#d99560" bg="linear-gradient(155deg, #fde2c8 0%, #f5b884 100%)" doodle="q"/>
      )}
      <div style={{ display: 'flex', gap: 'var(--pad-lg)' }}>
      <aside style={{ flex: '0 0 230px', display: 'flex', flexDirection: 'column', gap: 'var(--pad)', position: 'sticky', top: 0, alignSelf: 'flex-start' }}>
        <div>
          <p className="mmm-eyebrow">Фильтры</p>
          <input className="mmm-input" placeholder="Поиск…" value={q} onChange={e=>setQ(e.target.value)} style={{width:'100%'}}/>
        </div>
        <div>
          <h3 className="mmm-h3">Класс</h3>
          <div style={{display:'flex', gap:5, flexWrap:'wrap'}}>
            {GRADES.map(g => <button key={g} className={`mmm-chip ${grade===g?'active':''}`} onClick={()=>setGrade(grade===g?null:g)}>{g} кл</button>)}
          </div>
        </div>
        <div>
          <h3 className="mmm-h3">Сложность</h3>
          <div style={{display:'flex', gap:5, flexWrap:'wrap'}}>
            {DIFFICULTIES.map(d => <button key={d} className={`mmm-chip ${diff===d?'active':''}`} onClick={()=>setDiff(diff===d?null:d)}>★{d}</button>)}
          </div>
        </div>
        <div>
          <h3 className="mmm-h3">Компонент мышления</h3>
          <div style={{display:'flex', flexDirection:'column', gap:5}}>
            {COMPONENTS.map(c => <button key={c.id} className={`mmm-chip ${comp===c.id?'active':''}`} onClick={()=>setComp(comp===c.id?null:c.id)} style={{borderColor: comp===c.id?'var(--ink)':c.color, color: comp===c.id?'var(--paper)':c.color, textAlign:'left', justifyContent:'flex-start'}} title={c.desc}>{c.id} · {c.short}</button>)}
          </div>
        </div>
        <div>
          <h3 className="mmm-h3">Источник</h3>
          <div style={{display:'flex', gap:5, flexWrap:'wrap'}}>
            {SOURCES.map(s => <button key={s.id} className={`mmm-chip ${src===s.id?'active':''}`} onClick={()=>setSrc(src===s.id?null:s.id)}>{s.name}</button>)}
          </div>
        </div>
        <div>
          <h3 className="mmm-h3">Режим</h3>
          <div style={{display:'flex', gap:5, flexWrap:'wrap'}}>
            {MODES.map(m => <button key={m.id} className={`mmm-chip ${mode===m.id?'active':''}`} onClick={()=>setMode(mode===m.id?null:m.id)}>{m.icon} {m.name}</button>)}
          </div>
        </div>
        <button className="mmm-btn ghost" onClick={reset} style={{width:'100%'}}>Сбросить</button>
      </aside>

      <main style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: 'var(--pad)', minWidth: 0 }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'8px 16px'}}>
          <div>
            <p className="mmm-eyebrow">База задач</p>
            <h1 className="mmm-h1" style={{whiteSpace:'nowrap'}}>Найдено: {filtered.length} <span style={{color:'var(--ink-mute)', fontSize: 18}}>из {TASKS.length}</span></h1>
          </div>
          <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
            <button className="mmm-btn ghost" style={{whiteSpace:'nowrap'}} onClick={()=>setExportData({ tasks: selectedTasks, summary: 'Моя подборка', autoPrint: false, clearable: true })} disabled={selection.length===0} title={selection.length===0 ? 'Подборка пуста — добавьте задачи кнопкой «В подборку»' : 'Открыть подборку для печати/PDF'}>★ Подборка ({selection.length})</button>
            {selection.length > 0 && <button className="mmm-btn ghost" style={{whiteSpace:'nowrap'}} onClick={()=>{ if (confirm('Очистить подборку?')) setSelection([]); }} title="Очистить подборку">✕ Очистить</button>}
            <button className="mmm-btn ghost" style={{whiteSpace:'nowrap'}} onClick={()=>setExportData({ tasks: filtered, summary: filterSummary, autoPrint: false })} disabled={filtered.length===0} title={filtered.length===0 ? 'Нет задач для экспорта' : 'Сформировать PDF из всех найденных задач'}>⤓ Экспорт</button>
          </div>
        </div>
        <div className="mmm-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {filtered.map(t => <TaskCard key={t.id} task={t} onClick={()=>setOpen(t)}/>)}
        </div>
        {filtered.length === 0 && (
          <div className="mmm-card" style={{textAlign:'center', padding:30, color:'var(--ink-mute)'}}>
            Ничего не нашлось. <button className="mmm-chip" onClick={reset}>Сбросить</button>
          </div>
        )}
      </main>
      {open && <TaskDetail task={open} onClose={()=>setOpen(null)} role={role} inSel={selection.includes(open.id)} onToggleSel={toggleSel} onExportOne={(t,ap)=>setExportData({ tasks:[t], summary: t.title, autoPrint: ap })}/>}
      {exportData && <ExportView tasks={exportData.tasks} filterSummary={exportData.summary} autoPrint={exportData.autoPrint} role={role} onClose={()=>setExportData(null)} onClear={exportData.clearable ? ()=>{ setSelection([]); setExportData(null); } : null}/>}
      </div>
    </div>
  );
}

// ───── ОБ АВТОРАХ ─────
function AboutPage() {
  const { HeroQuad, HeroRivi } = window.MMM_HEROES;
  const authors = [
    { last: 'Кинтас', first: 'Александра', patr: 'Антоновна', initial: 'К', color: 'var(--terra)', soft: 'var(--terra-soft)', photo: (window.__resources?.authorKintas || 'author-kintas.png') },
    { last: 'Корешкова', first: 'Любовь', patr: 'Сергеевна', initial: 'К', color: 'var(--olive)', soft: 'var(--olive-soft)', photo: (window.__resources?.authorKoreshkova || 'author-koreshkova.png') },
  ];
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--pad-lg)' }}>
      <header>
        <p className="mmm-eyebrow">Об авторах</p>
        <h1 className="mmm-h1">Кто это придумал</h1>
        <p className="mmm-lead">Программу разработали в соавторстве. Учимся вместе в магистратуре двух университетов, работаем вместе в одной школе.</p>
      </header>
      <div className="mmm-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {authors.map((a) => (
          <div key={a.last} className="mmm-card" style={{ padding: 24, display:'flex', flexDirection:'column', gap: 14 }}>
            <div style={{ display:'flex', gap: 14, alignItems:'center' }}>
              {a.photo
                ? <img src={a.photo} alt={`${a.last} ${a.first} ${a.patr}`} style={{ flex:'0 0 72px', width: 72, height: 72, borderRadius:'50%', objectFit:'cover', background: a.soft, boxShadow:`0 0 0 2px var(--paper), 0 0 0 4px ${a.color}` }}/>
                : <div style={{ flex:'0 0 72px', width: 72, height: 72, borderRadius:'50%', background: a.soft, display:'grid', placeItems:'center', fontFamily:'var(--serif)', fontSize: 30, fontWeight: 700, color: a.color }}>{a.initial}</div>}
              <div>
                <h2 style={{ margin:'0 0 2px', fontFamily:'var(--serif)', fontSize: 18, fontWeight: 600, lineHeight: 1.2 }}>{a.last} {a.first} {a.patr}</h2>
                <p style={{ margin: 0, color:'var(--ink-mute)', fontSize: 12.5, fontFamily:'var(--mono)' }}>соавтор · 2026</p>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap: 8, fontSize: 13, color:'var(--ink-soft)' }}>
              <div><span style={{ fontFamily:'var(--mono)', fontSize: 11, color:'var(--ink-mute)', display:'inline-block', minWidth: 78 }}>учится:</span> ПсковГУ · НИУ ВШЭ</div>
              <div><span style={{ fontFamily:'var(--mono)', fontSize: 11, color:'var(--ink-mute)', display:'inline-block', minWidth: 78 }}>преподаёт:</span> частная начальная школа «Квадривиум»</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mmm-card" style={{ padding: 22, background:'var(--paper-2)', display:'flex', gap: 18, alignItems:'center' }}>
        <div style={{ flex:'0 0 auto', width: 56, height: 56, borderRadius: 14, background:'var(--paper)', border:'1.5px solid var(--line)', display:'grid', placeItems:'center', fontFamily:'var(--serif)', fontSize: 26, fontWeight: 700, color:'var(--ink)' }}>Q</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin:'0 0 4px', fontFamily:'var(--serif)', fontSize: 17, fontWeight: 600 }}>Школа «Квадривиум»</h3>
          <p className="mmm-body" style={{ margin: 0, fontSize: 13.5 }}>Частная начальная школа, на базе которой курс «Мастерская математического мышления» проходит апробацию. Программа опирается на еженедельную практику с детьми 1–4 классов и параллельные исследования авторов в ПсковГУ и НИУ ВШЭ.</p>
        </div>
      </div>
      <div className="mmm-card" style={{ padding: 22, background: 'var(--paper-2)' }}>
        <h3 className="mmm-h3">Герои курса</h3>
        <p style={{ margin:'4px 0 6px', fontSize: 14, color:'var(--ink-soft)', lineHeight: 1.55, maxWidth: '60ch' }}>
          Квада и Риви придумали первоклассники — на занятии, где мы попросили нарисовать «двух друзей, которые любят задачи». Мы их только оживили: дорисовали глаза, перенесли в&nbsp;интернет и&nbsp;дали им роли в&nbsp;уроках.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: '12px 20px 4px', justifyItems: 'center', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <HeroQuad size={120} pose="wave"/>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 600 }}>Квад</div>
            <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>строгий, любит порядок</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <HeroRivi size={120} pose="wave"/>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 600 }}>Риви</div>
            <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>весёлая, любит головоломки</div>
          </div>
        </div>
      </div>
    </div>
  );
}
// AboutPage end

// ───── ШАПКА УЧЕНИЧЕСКИХ СТРАНИЦ С МАСКОТАМИ ─────
function StudentPageHeader({ mascot = 'quad', eyebrow, title, lead, accent = '#c4724a', bg = 'linear-gradient(155deg, #fde2c8 0%, #f5b884 100%)', doodle = 'star' }) {
  const { HeroQuad, HeroRivi, MathDoodle } = window.MMM_HEROES;
  const Hero = mascot === 'rivi' ? HeroRivi : HeroQuad;
  return (
    <header className="mmm-fade-up" style={{
      position:'relative', overflow:'hidden',
      background: bg, border: `2px solid ${accent}`, borderRadius: 18,
      padding: '22px 26px', display:'flex', alignItems:'center', gap: 22,
    }}>
      <div className="mmm-bobble" style={{ flex:'0 0 auto' }}><Hero size={110} pose="wave"/></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="mmm-eyebrow" style={{ color: accent, margin: 0 }}>{eyebrow}</p>
        <h1 className="mmm-h1" style={{ margin:'4px 0 6px', fontSize: 32, lineHeight: 1.1 }}>{title}</h1>
        {lead && <p style={{ margin: 0, fontSize: 14.5, color:'#4a3220', maxWidth: 560 }}>{lead}</p>}
      </div>
      <div style={{ position:'absolute', top: 12, right: 16, opacity:.45 }} className="mmm-spin-slow"><MathDoodle kind={doodle} size={28} color={accent}/></div>
      <div style={{ position:'absolute', bottom: 10, left: 130, opacity:.3 }} className="mmm-float"><MathDoodle kind="spark" size={20} color={accent}/></div>
    </header>
  );
}

// Палитра тёплых цветов для карточек ученика
const STUDENT_TILES = {
  terra:  { bg:'linear-gradient(155deg, #fde2c8, #f5b884)', border:'#d99560', ink:'#7a3a18' },
  sun:    { bg:'linear-gradient(155deg, #fbe9a8, #f5cf5c)', border:'#c89a3a', ink:'#6a5018' },
  sky:    { bg:'linear-gradient(155deg, #d5e6f0, #8fb8d8)', border:'#5a8ab0', ink:'#1f4a6a' },
  mint:   { bg:'linear-gradient(155deg, #d8ecd0, #9cc89a)', border:'#5a8a5a', ink:'#244a24' },
  rose:   { bg:'linear-gradient(155deg, #fcd8d4, #f0a8a0)', border:'#c46a5a', ink:'#7a2a1a' },
  violet: { bg:'linear-gradient(155deg, #e0d6ec, #b8a4d4)', border:'#7a5aa8', ink:'#3a1f5a' },
  olive:  { bg:'linear-gradient(155deg, #e6e0c4, #c4be7a)', border:'#7a7035', ink:'#3a3414' },
};

// ───── ИНСТРУМЕНТЫ И ИГРЫ ─────
function ToolsPage({ role }) {
  const { DiceTool, CoinTool, NumberLineTool, RandomPickerTool, TimerTool, VesselsTool } = window.MMM_TOOLS;
  const [open, setOpen] = uS(null);

  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open]);

  const tools = [
    { id: 'dice1', title: 'Бросок кубика',  palette: STUDENT_TILES.terra,  glyph: '⚂',  sub: 'один кубик · статистика по граням',  Comp: () => <DiceTool count={1}/> },
    { id: 'dice2', title: 'Два кубика',      palette: STUDENT_TILES.rose,   glyph: '⚄⚂', sub: 'два кубика · статистика по суммам',  Comp: () => <DiceTool count={2}/> },
    { id: 'coin',  title: 'Монета',          palette: STUDENT_TILES.sun,    glyph: '○',  sub: 'орёл или решка · статистика',         Comp: CoinTool },
    { id: 'line',  title: 'Числовая прямая', palette: STUDENT_TILES.mint,   glyph: '↔',  sub: 'кузнечик прыгает по прямой',           Comp: NumberLineTool },
    { id: 'pick',  title: 'Случайный выбор', palette: STUDENT_TILES.violet, glyph: '?',  sub: 'кого спросить — пусть решит случай',  Comp: RandomPickerTool },
    { id: 'time',  title: 'Таймер',          palette: STUDENT_TILES.sky,    glyph: '◷',  sub: 'обратный отсчёт для задачи',           Comp: TimerTool },
    { id: 'vess',  title: 'Сосуды',          palette: STUDENT_TILES.olive,  glyph: '∪',  sub: 'переливание · любые объёмы',           Comp: VesselsTool },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--pad-lg)' }}>
      {role === 'student'
        ? <StudentPageHeader mascot="rivi" eyebrow="Инструменты" title="Что-нибудь покрутим?"
            lead="Кубики, монетка, числовая прямая. Нажми на любой — откроется на весь экран."
            accent="#5a8ab0" bg="linear-gradient(155deg, #e6f0f8 0%, #b8d4e8 100%)" doodle="plus"/>
        : (
          <header>
            <p className="mmm-eyebrow">Интерактивные инструменты</p>
            <h1 className="mmm-h1">Для работы у доски</h1>
            <p className="mmm-lead">Нажми на инструмент — он откроется на весь экран. Удобно для проектора.</p>
          </header>
        )}
      <div className="mmm-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))' }}>
        {tools.map(t => (
          <button key={t.id} onClick={()=>setOpen(t.id)} style={{
            display:'flex', flexDirection:'column', gap: 10, padding: 18, textAlign:'left',
            background: t.palette.bg, cursor:'pointer',
            border:`2px solid ${t.palette.border}`, borderRadius: 16,
            transition: 'transform .15s, box-shadow .15s', position:'relative', overflow:'hidden',
          }}
            onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px) rotate(-.5deg)'; e.currentTarget.style.boxShadow='0 10px 22px rgba(40,30,20,.14)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(255,255,255,.6)', border:`1.5px solid ${t.palette.border}`, color: t.palette.ink, display:'grid', placeItems:'center', fontFamily:'var(--serif)', fontSize: 26, fontWeight: 700 }}>{t.glyph}</div>
            <div>
              <div style={{ fontFamily:'var(--serif)', fontSize: 18, fontWeight: 700, color: t.palette.ink }}>{t.title}</div>
              <div style={{ fontSize: 12.5, color: t.palette.ink, opacity: .78, marginTop: 2 }}>{t.sub}</div>
            </div>
            <div style={{ marginTop: 'auto', fontFamily:'var(--mono)', fontSize: 10.5, color: t.palette.ink, letterSpacing: 0.5, opacity: .8 }}>открыть →</div>
          </button>
        ))}
      </div>

      {open && (() => {
        const t = tools.find(x => x.id === open);
        const Comp = t.Comp;
        return ReactDOM.createPortal(
          <div role="dialog" aria-modal="true" style={{
            position:'fixed', inset: 0, zIndex: 2000,
            background:'rgba(28,22,14,.82)', backdropFilter:'blur(4px)',
            display:'flex', flexDirection:'column', padding: 0,
            animation: 'mmm-fade-in .2s ease',
          }} onClick={(e)=>{ if (e.target === e.currentTarget) setOpen(null); }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding: '16px 24px', color:'var(--paper)', background:'rgba(0,0,0,.35)', borderBottom:'1px solid rgba(255,255,255,.15)' }}>
              <button onClick={()=>setOpen(null)} style={{
                background:'var(--paper)', color:'var(--ink)', border:'2px solid var(--ink)',
                borderRadius: 999, padding:'8px 18px 8px 12px', fontFamily:'var(--sans)', fontSize: 14, fontWeight: 600,
                cursor:'pointer', display:'flex', alignItems:'center', gap: 6,
                boxShadow:'0 2px 0 var(--ink), 0 4px 10px rgba(0,0,0,.2)',
              }}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
                onMouseLeave={e=>e.currentTarget.style.transform=''}>
                <span style={{ fontSize: 18, lineHeight: 1 }}>←</span>
                Назад к инструментам
              </button>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:'var(--mono)', fontSize: 11, opacity: 0.7, letterSpacing: 1 }}>ИНСТРУМЕНТ</div>
                <div style={{ fontFamily:'var(--serif)', fontSize: 20, fontWeight: 600 }}>{t.title}</div>
              </div>
            </div>
            <div style={{ flex: 1, overflow:'auto', display:'flex', justifyContent:'center', alignItems:'flex-start', padding: 24 }}>
              <div style={{ width:'100%', maxWidth: 640 }}>
                <Comp/>
              </div>
            </div>
          </div>,
          document.body
        );
      })()}

      <style>{`@keyframes mmm-fade-in { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </div>
  );
}

function GamesPage({ role }) {
  const { Sudoku4Game, NimGame, MagicSquareGame } = window.MMM_GAMES;
  const [open, setOpen] = uS(null);

  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open]);

  const games = [
    { id: 'sudoku',  title: 'Судоку',             tag: 'логика',    palette: STUDENT_TILES.sun,    glyph: '4',  sub: '4×4, 6×6, 9×9 — заполни без повторов', Comp: Sudoku4Game },
    { id: 'nim',     title: 'Ним',                tag: 'стратегия', palette: STUDENT_TILES.mint,   glyph: '∥',  sub: 'забери последнюю спичку',               Comp: NimGame },
    { id: 'magic',   title: 'Магический квадрат', tag: 'логика',    palette: STUDENT_TILES.rose,   glyph: '15', sub: 'расставь 1–9, сумма 15',                Comp: MagicSquareGame },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--pad-lg)' }}>
      {role === 'student'
        ? <StudentPageHeader mascot="quad" eyebrow="Игры" title="Поиграем?"
            lead="Судоку, ним и магический квадрат. Нажми на карточку — откроется на весь экран."
            accent="#c89a3a" bg="linear-gradient(155deg, #fbe9a8 0%, #f5cf5c 100%)" doodle="star"/>
        : (
          <header>
            <p className="mmm-eyebrow">Логические игры</p>
            <h1 className="mmm-h1">Голова работает в фоне</h1>
            <p className="mmm-lead">Нажми на карточку — игра откроется на весь экран.</p>
          </header>
        )}
      <div className="mmm-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(290px,1fr))' }}>
        {games.map(g => (
          <button key={g.id} onClick={()=>setOpen(g.id)} style={{
            display:'flex', flexDirection:'column', gap: 12, padding: 22, textAlign:'left',
            background: g.palette.bg, cursor:'pointer',
            border:`2px solid ${g.palette.border}`, borderRadius: 18,
            transition: 'transform .15s, box-shadow .15s',
          }}
            onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px) rotate(-.4deg)'; e.currentTarget.style.boxShadow='0 12px 24px rgba(40,30,20,.16)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(255,255,255,.6)', border:`1.5px solid ${g.palette.border}`, color: g.palette.ink, display:'grid', placeItems:'center', fontFamily:'var(--serif)', fontSize: 30, fontWeight: 700 }}>{g.glyph}</div>
              <span style={{ fontSize: 10.5, padding:'3px 9px', borderRadius: 99, background:'rgba(255,255,255,.55)', border:`1px solid ${g.palette.border}`, color: g.palette.ink, fontFamily:'var(--mono)' }}>{g.tag}</span>
            </div>
            <div>
              <div style={{ fontFamily:'var(--serif)', fontSize: 22, fontWeight: 700, color: g.palette.ink }}>{g.title}</div>
              <div style={{ fontSize: 13, color: g.palette.ink, opacity:.78, marginTop: 4 }}>{g.sub}</div>
            </div>
            <div style={{ marginTop: 'auto', fontFamily:'var(--mono)', fontSize: 11.5, color: g.palette.ink, letterSpacing: 0.5, opacity: .8 }}>играть →</div>
          </button>
        ))}
      </div>

      {open && (() => {
        const g = games.find(x => x.id === open);
        const Comp = g.Comp;
        return ReactDOM.createPortal(
          <div role="dialog" aria-modal="true" style={{
            position:'fixed', inset: 0, zIndex: 2000,
            background:'rgba(28,22,14,.82)', backdropFilter:'blur(4px)',
            display:'flex', flexDirection:'column', padding: 0,
            animation: 'mmm-fade-in .2s ease',
          }} onClick={(e)=>{ if (e.target === e.currentTarget) setOpen(null); }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding: '16px 24px', color:'var(--paper)', background:'rgba(0,0,0,.35)', borderBottom:'1px solid rgba(255,255,255,.15)' }}>
              <button onClick={()=>setOpen(null)} style={{
                background:'var(--paper)', color:'var(--ink)', border:'2px solid var(--ink)',
                borderRadius: 999, padding:'8px 18px 8px 12px', fontFamily:'var(--sans)', fontSize: 14, fontWeight: 600,
                cursor:'pointer', display:'flex', alignItems:'center', gap: 6,
                boxShadow:'0 2px 0 var(--ink), 0 4px 10px rgba(0,0,0,.2)',
              }}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
                onMouseLeave={e=>e.currentTarget.style.transform=''}>
                <span style={{ fontSize: 18, lineHeight: 1 }}>←</span>
                Назад к играм
              </button>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:'var(--mono)', fontSize: 11, opacity: 0.7, letterSpacing: 1 }}>ИГРА</div>
                <div style={{ fontFamily:'var(--serif)', fontSize: 20, fontWeight: 600 }}>{g.title}</div>
              </div>
            </div>
            <div style={{
              flex: 1, overflow:'auto', display:'flex', justifyContent:'center', alignItems:'flex-start',
              padding: 24,
            }}>
              <div style={{ width:'100%', maxWidth: 720 }}>
                <Comp/>
              </div>
            </div>
          </div>,
          document.body
        );
      })()}

      <style>{`@keyframes mmm-fade-in { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </div>
  );
}

// ───── ГЛАВНОЕ ПРИЛОЖЕНИЕ ─────
function MMMApp({ paletteClass = 'palette-warm', density = 'normal', hero = 'discover3' }) {
  const [section, setSection] = uS('home');
  const [role, setRole] = uS(null); // null = ещё не выбрал; 'teacher' | 'student'

  const teacherSections = [
    { id: 'home', label: 'Главная' },
    { id: 'modules', label: 'Программа' },
    { label: 'Методика', children: [
      { id: 'guide', label: 'Как устроен курс' },
      { id: 'teachkit', label: 'Методкабинет' },
    ] },
    { id: 'konspekts', label: 'Конспекты' },
    { id: 'readinglab', label: 'Лаборатория чтения' },
    { id: 'tasks', label: 'Задачи' },
    { id: 'kvadriga', label: '«Квадрига»' },
    { id: 'diagnostic', label: 'Диагностика' },
    { label: 'Для класса', children: [
      { id: 'tools', label: 'Инструменты' },
      { id: 'games', label: 'Игры' },
    ] },
    { id: 'about', label: 'Авторы' },
  ];
  const studentSections = [
    { id: 'home', label: 'Главная' },
    { id: 'tasks', label: 'Задачи' },
    { id: 'readinglab', label: 'Лаборатория чтения' },
    { id: 'kvadriga', label: '«Квадрига»' },
    { id: 'games', label: 'Игры' },
    { id: 'tools', label: 'Инструменты' },
  ];
  const sections = !role ? [] : (role === 'student' ? studentSections : teacherSections);

  const Page = {
    home: () => <HomePage setSection={setSection} role={role} setRole={setRole} hero={hero}/>,
    modules: () => <ModulesPage role={role} setSection={setSection}/>,
    guide: () => <window.MMM_COURSE_GUIDE.CourseGuidePage/>,
    konspekts: () => <window.MMM_KONSPEKTY.KonspektyPage/>,
    readinglab: () => <window.MMM_READING_LAB.ReadingLabPage role={role}/>,
    tasks: () => <TasksPage role={role}/>,
    diagnostic: () => <DiagnosticPage role={role}/>,
    tools: () => <ToolsPage role={role}/>,
    teachkit: () => <window.MMM_TEACHER_TOOLS.TeacherToolsPage/>,
    games: () => <GamesPage role={role}/>,
    kvadriga: () => <window.MMM_KVADRIGA.KvadrigaPage role={role}/>,
    about: () => <AboutPage/>,
  }[section] || (()=><HomePage setSection={setSection} role={role} setRole={setRole} hero={hero}/>);

  const cls = ['mmm-root', paletteClass, density === 'dense' ? 'dense' : density === 'spacious' ? 'spacious' : ''].filter(Boolean).join(' ');

  return (
    <div className={cls} style={{ position: 'absolute', inset: 0 }}>
      <div className="mmm-paper-bg"/>
      <TopBar section={section} setSection={setSection} role={role} setRole={setRole} sections={sections}/>
      <main className="mmm-page">
        <Page/>
      </main>
      <style>{`
        @keyframes mmm-shake {
          0%,100% { transform: translateY(0) rotate(0); }
          25% { transform: translateY(-2px) rotate(-3deg); }
          50% { transform: translateY(-3px) rotate(2deg); }
          75% { transform: translateY(-1px) rotate(-1deg); }
        }
      `}</style>
    </div>
  );
}

window.MMMApp = MMMApp;
