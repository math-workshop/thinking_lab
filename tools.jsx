// Интерактивные инструменты: кубики, монета, числовая прямая, случайный выбор, таймер.

const { useState, useEffect, useRef, useMemo } = React;

// === КУБИКИ ===
function DiceFace({ value, size = 56 }) {
  const dots = {
    1: [[1,1]],
    2: [[0,0],[2,2]],
    3: [[0,0],[1,1],[2,2]],
    4: [[0,0],[0,2],[2,0],[2,2]],
    5: [[0,0],[0,2],[1,1],[2,0],[2,2]],
    6: [[0,0],[0,2],[1,0],[1,2],[2,0],[2,2]],
  }[value] || [];
  const dot = size / 6;
  return (
    <div style={{
      width: size, height: size, background: '#fdfaee',
      border: '1.5px solid var(--ink)', borderRadius: size * 0.18,
      position: 'relative', boxShadow: '0 2px 0 var(--ink), 0 4px 8px rgba(60,50,40,.15)',
    }}>
      {dots.map(([r,c],i)=>(
        <div key={i} style={{
          position: 'absolute',
          top: `${(r+0.5)*size/3 - dot/2}px`, left: `${(c+0.5)*size/3 - dot/2}px`,
          width: dot, height: dot, borderRadius: '50%', background: 'var(--ink)',
        }}/>
      ))}
    </div>
  );
}

function DiceTool({ count = 1 }) {
  const [vals, setVals] = useState(() => Array.from({length:count}, ()=>1));
  const [rolling, setRolling] = useState(false);
  // For 1 die: stats by face 1..6. For >=2 dice: stats by sum.
  const initStats = () => {
    if (count === 1) return { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
    const o = {};
    for (let s = count; s <= 6*count; s++) o[s] = 0;
    return o;
  };
  const [stats, setStats] = useState(initStats);
  const [total, setTotal] = useState(0);

  const roll = () => {
    setRolling(true);
    let frames = 0;
    const id = setInterval(()=>{
      setVals(Array.from({length:count}, ()=>1+Math.floor(Math.random()*6)));
      if (++frames > 8) {
        clearInterval(id);
        const final = Array.from({length:count}, ()=>1+Math.floor(Math.random()*6));
        setVals(final);
        const key = count === 1 ? final[0] : final.reduce((a,b)=>a+b,0);
        setStats(s => ({ ...s, [key]: (s[key]||0) + 1 }));
        setTotal(t => t + 1);
        setRolling(false);
      }
    }, 60);
  };
  const reset = () => { setStats(initStats()); setTotal(0); };

  const sum = vals.reduce((a,b)=>a+b, 0);
  const keys = Object.keys(stats).map(Number).sort((a,b)=>a-b);
  const maxN = Math.max(1, ...keys.map(k=>stats[k]));

  return (
    <div className="mmm-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 className="mmm-h2" style={{ margin: 0 }}>{count === 1 ? 'Бросок кубика' : `Бросок ${count} кубиков`}</h3>
        {count > 1 && <span className="mmm-tag terra">Сумма: {sum}</span>}
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', padding: '20px 0',
        background: 'var(--paper-2)', borderRadius: 8, border: '1px dashed var(--line)' }}>
        {vals.map((v,i) => (
          <div key={i} style={{ animation: rolling ? 'mmm-shake .15s infinite' : 'none' }}>
            <DiceFace value={v} size={64} />
          </div>
        ))}
      </div>
      <button className="mmm-btn terra" onClick={roll} disabled={rolling}>
        {rolling ? 'Бросаем...' : 'Бросить'}
      </button>
      <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', fontSize: 11.5, color:'var(--ink-mute)', fontFamily:'var(--mono)' }}>
          <span>статистика · {count===1?'по граням':'по суммам'}</span>
          <span>всего бросков: <b style={{color:'var(--ink)'}}>{total}</b> <button className="mmm-chip" style={{marginLeft:6}} onClick={reset}>Сброс</button></span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns: `repeat(${keys.length}, 1fr)`, gap: 4, alignItems:'end', height: 56 }}>
          {keys.map(k => (
            <div key={k} style={{ display:'flex', flexDirection:'column', justifyContent:'flex-end', alignItems:'center', height:'100%' }}>
              <div style={{ width:'100%', height: `${(stats[k]/maxN)*100}%`, background:'var(--terra)', borderRadius:'3px 3px 0 0', minHeight: stats[k]>0?3:0, transition:'height .3s' }} title={`${k}: ${stats[k]}`}/>
              <div style={{ fontSize: 10, color:'var(--ink-mute)', marginTop: 2, fontFamily:'var(--mono)' }}>{k}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// === МОНЕТА ===
function CoinTool() {
  const [side, setSide] = useState('орёл');
  const [flipping, setFlipping] = useState(false);
  const [stats, setStats] = useState({ орёл: 0, решка: 0 });

  const flip = () => {
    setFlipping(true);
    setTimeout(() => {
      const result = Math.random() < 0.5 ? 'орёл' : 'решка';
      setSide(result);
      setStats(s => ({ ...s, [result]: s[result] + 1 }));
      setFlipping(false);
    }, 700);
  };

  return (
    <div className="mmm-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h3 className="mmm-h2" style={{ margin: 0 }}>Подбрасывание монеты</h3>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0',
        background: 'var(--paper-2)', borderRadius: 8, border: '1px dashed var(--line)' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: side === 'орёл' ? 'radial-gradient(#e8d090, #c89a3a)' : 'radial-gradient(#d8c8a0, #a88a50)',
          border: '2px solid var(--ink)', boxShadow: '0 3px 0 var(--ink), 0 6px 14px rgba(60,50,40,.2)',
          display: 'grid', placeItems: 'center',
          fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700, color: 'var(--ink)',
          transition: 'transform .15s',
          transform: flipping ? 'rotateY(720deg) scale(1.1)' : 'rotateY(0)',
          transitionDuration: flipping ? '.7s' : '.15s',
        }}>
          {flipping ? '?' : side === 'орёл' ? 'О' : 'Р'}
        </div>
      </div>
      <button className="mmm-btn terra" onClick={flip} disabled={flipping}>Бросить</button>
      <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: 12, color: 'var(--ink-mute)' }}>
        <span>Орёл: <b style={{color:'var(--ink)'}}>{stats.орёл}</b></span>
        <span>Решка: <b style={{color:'var(--ink)'}}>{stats.решка}</b></span>
        <button className="mmm-chip" onClick={()=>setStats({орёл:0, решка:0})}>Сброс</button>
      </div>
    </div>
  );
}

// === ЧИСЛОВАЯ ПРЯМАЯ ===
function NumberLineTool() {
  const [pos, setPos] = useState(0);
  const [history, setHistory] = useState([0]);
  const [step, setStep] = useState(3);

  const move = (dir) => {
    const next = pos + dir * step;
    setPos(next);
    setHistory(h => [...h, next]);
  };
  const reset = () => { setPos(0); setHistory([0]); };

  const min = -10, max = 20;
  const range = max - min;

  return (
    <div className="mmm-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h3 className="mmm-h2" style={{ margin: 0 }}>Числовая прямая</h3>
      <div style={{ background: 'var(--paper-2)', borderRadius: 8, padding: 20, border: '1px dashed var(--line)' }}>
        <div style={{ position: 'relative', height: 70 }}>
          <div style={{ position: 'absolute', top: 35, left: 0, right: 0, height: 2, background: 'var(--ink)' }}/>
          {Array.from({length: range + 1}, (_,i) => i + min).map(n => {
            const x = ((n - min) / range) * 100;
            const major = n % 5 === 0;
            return (
              <div key={n} style={{ position: 'absolute', left: `${x}%`, top: 35, transform: 'translateX(-50%)' }}>
                <div style={{ width: 1.5, height: major ? 12 : 6, background: 'var(--ink)', marginTop: -3 }}/>
                {major && <div style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 2, textAlign: 'center', transform: 'translateX(-50%)', position: 'relative', left: '50%' }}>{n}</div>}
              </div>
            );
          })}
          {/* Кузнечик */}
          <div style={{
            position: 'absolute', left: `${((pos - min) / range) * 100}%`,
            top: 5, transform: 'translateX(-50%)',
            transition: 'left .35s cubic-bezier(.3,1.5,.5,1)',
            fontSize: 22,
          }}>
            <div style={{
              width: 26, height: 26, background: 'var(--olive)', borderRadius: '50%',
              border: '2px solid var(--ink)', display: 'grid', placeItems: 'center',
              color: 'white', fontSize: 11, fontWeight: 700,
              boxShadow: '0 2px 0 var(--ink)',
            }}>{pos}</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="mmm-btn ghost" onClick={()=>move(-1)}>− {step}</button>
        <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>Шаг:</span>
        <input className="mmm-input" type="number" value={step} onChange={e=>setStep(+e.target.value||1)} style={{width:60, textAlign:'center'}}/>
        <button className="mmm-btn ghost" onClick={()=>move(1)}>+ {step}</button>
        <button className="mmm-chip" onClick={reset}>Сброс</button>
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', textAlign: 'center' }}>
        Прыжки: {history.join(' → ')}
      </div>
    </div>
  );
}

// === СЛУЧАЙНЫЙ ВЫБОР УЧЕНИКА ===
function RandomPickerTool() {
  const [namesText, setNamesText] = useState('Аня, Боря, Вика, Гриша, Даша, Егор, Женя, Зина');
  const [chosen, setChosen] = useState(null);
  const [animating, setAnimating] = useState(false);

  const pick = () => {
    const names = namesText.split(',').map(s=>s.trim()).filter(Boolean);
    if (!names.length) return;
    setAnimating(true);
    let frames = 0;
    const id = setInterval(()=>{
      setChosen(names[Math.floor(Math.random()*names.length)]);
      if (++frames > 14) {
        clearInterval(id);
        setChosen(names[Math.floor(Math.random()*names.length)]);
        setAnimating(false);
      }
    }, 90);
  };

  return (
    <div className="mmm-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h3 className="mmm-h2" style={{ margin: 0 }}>Случайный ученик</h3>
      <textarea className="mmm-input" rows={2} value={namesText} onChange={e=>setNamesText(e.target.value)}
        style={{ resize: 'vertical', fontFamily: 'var(--sans)', fontSize: 13 }}
        placeholder="Имена через запятую"/>
      <div style={{
        background: 'var(--paper-2)', borderRadius: 8, padding: '24px 16px',
        border: '1px dashed var(--line)', textAlign: 'center',
        fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 600, color: 'var(--ink)',
        minHeight: 70,
      }}>
        {chosen || <span style={{color:'var(--ink-mute)', fontSize:14, fontStyle:'italic'}}>Нажмите «Выбрать»</span>}
      </div>
      <button className="mmm-btn terra" onClick={pick} disabled={animating}>Выбрать</button>
    </div>
  );
}

// === ТАЙМЕР ===
function TimerTool() {
  const [target, setTarget] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  useEffect(()=>{
    if (running) {
      ref.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) { setRunning(false); return 0; }
          return r - 1;
        });
      }, 1000);
      return () => clearInterval(ref.current);
    }
  }, [running]);

  const setT = (n) => { setTarget(n); setRemaining(n); setRunning(false); };
  const reset = () => { setRemaining(target); setRunning(false); };

  const pct = Math.max(0, remaining / target);
  const m = Math.floor(remaining / 60), s = remaining % 60;

  return (
    <div className="mmm-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h3 className="mmm-h2" style={{ margin: 0 }}>Таймер</h3>
      <div style={{
        background: 'var(--paper-2)', borderRadius: 8, padding: 20,
        border: '1px dashed var(--line)', textAlign: 'center',
        fontFamily: 'var(--mono)', fontSize: 42, fontWeight: 600, color: remaining < 10 ? 'var(--terra)' : 'var(--ink)',
      }}>
        {String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
        <div style={{ height: 5, background: 'var(--paper-3)', borderRadius: 3, marginTop: 14, overflow: 'hidden' }}>
          <div style={{ width: `${pct*100}%`, height: '100%', background: 'var(--terra)', transition: 'width 1s linear' }}/>
        </div>
      </div>
      <div style={{ display:'flex', gap:6, justifyContent:'center', flexWrap:'wrap' }}>
        {[60, 300, 900, 1800].map(n => (
          <button key={n} className={`mmm-chip ${target===n?'active':''}`} onClick={()=>setT(n)}>
            {n<60?n+'с':Math.floor(n/60)+' мин'}
          </button>
        ))}
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <button className="mmm-btn terra" onClick={()=>setRunning(r=>!r)} style={{flex:1}}>
          {running ? 'Пауза' : 'Старт'}
        </button>
        <button className="mmm-btn ghost" onClick={reset}>Сброс</button>
      </div>
    </div>
  );
}

// === СОСУДЫ ===
function VesselsTool() {
  const [setup, setSetup] = useState(true);
  const [capA, setCapA] = useState(5);
  const [capB, setCapB] = useState(3);
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const start = () => {
    if (capA < 1 || capB < 1) return;
    setA(0); setB(0); setSetup(false);
  };
  const reset = () => setSetup(true);
  const fillA = () => setA(capA);
  const fillB = () => setB(capB);
  const empA = () => setA(0);
  const empB = () => setB(0);
  const aToB = () => { const x = Math.min(a, capB - b); setA(a-x); setB(b+x); };
  const bToA = () => { const x = Math.min(b, capA - a); setA(a+x); setB(b-x); };

  if (setup) {
    return (
      <div className="mmm-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h3 className="mmm-h2" style={{ margin: 0 }}>Сосуды</h3>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-soft)' }}>Сколько литров вмещает каждый сосуд?</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
          {[{lbl:'Сосуд A', v:capA, set:setCapA}, {lbl:'Сосуд B', v:capB, set:setCapB}].map((f,i)=>(
            <label key={i} style={{ display:'flex', flexDirection:'column', gap: 4, fontSize: 12, color:'var(--ink-mute)', fontFamily:'var(--mono)' }}>
              {f.lbl}
              <input type="number" min="1" max="20" value={f.v} onChange={e=>f.set(Math.max(1, Math.min(20, parseInt(e.target.value)||1)))}
                style={{ padding:'8px 10px', border:'1.5px solid var(--line)', borderRadius: 6, fontFamily:'var(--mono)', fontSize: 18, fontWeight: 600, color:'var(--ink)', background:'var(--paper)' }}/>
            </label>
          ))}
        </div>
        <button className="mmm-btn terra" onClick={start}>Начать · {capA} и {capB} л</button>
      </div>
    );
  }

  return (
    <div className="mmm-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <h3 className="mmm-h2" style={{ margin: 0 }}>Сосуды ({capA} и {capB} л)</h3>
        <button className="mmm-chip" onClick={reset}>Изменить</button>
      </div>
      <div style={{ display: 'flex', gap: 28, justifyContent: 'center', padding: '14px 0',
        background: 'var(--paper-2)', borderRadius: 8, border: '1px dashed var(--line)' }}>
        {[{cap:capA, val:a, label:`${capA} л`},{cap:capB, val:b, label:`${capB} л`}].map((v,i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{
              width: 60, height: 110, border: '2.5px solid var(--ink)', borderTop: 0,
              borderRadius: '0 0 6px 6px', position: 'relative', background: '#fdfaee',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            }}>
              <div style={{
                background: 'linear-gradient(#7eaeda, #4a8aba)',
                height: `${(v.val/v.cap)*100}%`,
                transition: 'height .5s cubic-bezier(.4,0,.2,1)',
                borderTop: '2px solid #2a6a9a',
              }}/>
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 4 }}>{v.label} · <b style={{color:'var(--ink)'}}>{v.val}</b></div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5, fontSize: 12 }}>
        <button className="mmm-chip" onClick={fillA}>Налить A</button>
        <button className="mmm-chip" onClick={aToB}>A → B</button>
        <button className="mmm-chip" onClick={empA}>Вылить A</button>
        <button className="mmm-chip" onClick={fillB}>Налить B</button>
        <button className="mmm-chip" onClick={bToA}>B → A</button>
        <button className="mmm-chip" onClick={empB}>Вылить B</button>
      </div>
    </div>
  );
}

window.MMM_TOOLS = { DiceTool, CoinTool, NumberLineTool, RandomPickerTool, TimerTool, VesselsTool, DiceFace };
