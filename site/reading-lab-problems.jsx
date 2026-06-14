// ════════════════════════════════════════════════════════════════
// ЛАБОРАТОРИЯ ЧТЕНИЯ ЗАДАЧ — примитивы, стили и четыре задачи
// Нативный раздел сайта. Стили scoped под .rlab, токены — из дизайн-системы.
// Экспорт в window.MMM_RL для reading-lab.jsx
// ════════════════════════════════════════════════════════════════
const { useState } = React;

// Скролл внутреннего контейнера страницы (на сайте скроллится .mmm-page, не window)
function rlScrollTop() {
  const el = document.querySelector('.mmm-page');
  if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Стили лаборатории (вставляются один раз страницей) ──
const RL_CSS = `
.rlab{
  max-width:760px; margin:0 auto; padding:2px 2px 64px;
  /* Лаборатория всегда тёплая и «детская»: фиксируем собственную палитру,
     чтобы тема «моно»/alt из Tweaks не превращала задачи в серо-чёрные */
  --paper:#f4f0e6; --paper-2:#ece6d5; --paper-3:#e1d8c2;
  --ink:#2a2520; --ink-soft:#4a4239; --ink-mute:#7a6f60;
  --line:#c8bda3; --line-soft:#d8cfb8;
  --terra:#c4724a; --terra-soft:#e8b89a;
  --olive:#5a7a4f; --olive-soft:#b8c8a8;
  --mustard:#c89a3a; --mustard-soft:#e8d090;
  --blue:#4a6a8a; --blue-soft:#a8b8c8;
  --sheet:#fcf8ee; --radius:10px;
  --shadow:0 1px 0 rgba(60,50,40,.06), 0 4px 14px rgba(60,50,40,.07);
  --shadow-lg:0 2px 0 rgba(60,50,40,.06), 0 12px 32px rgba(60,50,40,.12);
  font-family:var(--sans); color:var(--ink); line-height:1.55; font-size:16px;
}
.rlab h1,.rlab h2,.rlab h3,.rlab h4{font-family:var(--serif);line-height:1.25}
.rlab button{font-family:inherit;font-size:inherit;cursor:pointer;border:none;background:none;color:inherit}
.rlab button:focus-visible,.rlab input:focus-visible{outline:3px solid var(--blue);outline-offset:2px;border-radius:6px}

/* home */
.rlab .home-head{text-align:center;margin:6px 0 6px}
.rlab .home-head .eyebrow{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--terra);font-weight:700}
.rlab .home-head h1{font-size:clamp(28px,6vw,40px);margin:6px 0 8px;color:var(--terra)}
.rlab .home-head p{color:var(--ink-soft);max-width:54ch;margin:0 auto}
.rlab .method-strip{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:18px 0 26px}
.rlab .method-strip > span{font-size:12.5px;font-weight:600;background:var(--sheet);border:1px solid var(--line);border-radius:999px;padding:5px 12px;color:var(--ink-soft)}
.rlab .method-strip > span b{color:var(--olive)}
.rlab .cards{display:grid;grid-template-columns:1fr;gap:14px}
@media(min-width:560px){.rlab .cards{grid-template-columns:1fr 1fr}}
.rlab .card{
  text-align:left;background:var(--sheet);border:1px solid var(--line);
  border-radius:var(--radius);padding:18px 18px 16px;box-shadow:var(--shadow);
  transition:transform .15s ease, box-shadow .15s ease;display:block;width:100%;
}
.rlab .card:hover{transform:translateY(-2px);box-shadow:var(--shadow-lg)}
.rlab .card .tag{display:inline-block;font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border-radius:6px;padding:3px 8px;margin-bottom:10px}
.rlab .tag-terra{background:#f5dccb;color:#6e3a1c}
.rlab .tag-olive{background:#d8e2c8;color:#3a5028}
.rlab .tag-mustard{background:#ecdaa6;color:#6a5018}
.rlab .tag-blue{background:#c8d4e0;color:#2a4060}
.rlab .card h3{font-size:19px;margin-bottom:6px;color:#3a2010}
.rlab .card p{font-size:14px;color:var(--ink-soft)}
.rlab .card .done-mark{float:right;color:var(--olive);font-weight:800}

/* problem frame */
.rlab .topbar{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.rlab .back-btn{font-weight:700;color:var(--terra);padding:6px 10px;border-radius:8px}
.rlab .back-btn:hover{background:var(--terra-soft)}
.rlab .topbar h2{font-size:20px;flex:1;color:#3a2010}
.rlab .phasebar{display:flex;gap:4px;flex-wrap:wrap;margin:0 0 14px}
.rlab .phasebar > span{font-size:11px;font-weight:700;letter-spacing:.04em;padding:4px 9px;border-radius:999px;background:var(--sheet);border:1px solid var(--line);color:var(--ink-soft)}
.rlab .phasebar span.cur{background:var(--olive);border-color:var(--olive);color:#fff}
.rlab .phasebar span.past{background:var(--olive-soft);border-color:var(--olive-soft);color:#3a5028}

/* «листок задачи» */
.rlab .sheet{
  background:var(--sheet);
  background-image:repeating-linear-gradient(transparent 0,transparent 27px,rgba(196,114,74,.08) 27px,rgba(196,114,74,.08) 28px);
  border:1px solid var(--line);border-radius:6px;box-shadow:var(--shadow);
  padding:16px 18px;line-height:28px;font-size:16.5px;
  transform:rotate(-.25deg);margin-bottom:18px;position:relative;
}
.rlab .sheet::before{content:"";position:absolute;left:34px;top:0;bottom:0;width:1px;background:rgba(74,106,138,.25)}
.rlab .sheet .pin{position:absolute;top:-9px;left:50%;transform:translateX(-50%);width:14px;height:14px;border-radius:50%;background:var(--terra);box-shadow:0 2px 4px rgba(0,0,0,.25)}
.rlab .sheet p{padding-left:24px}
.rlab .sp{transition:background .2s}
.rlab .sp.tap{cursor:pointer;border-radius:4px}
.rlab .sp.tap:hover{background:rgba(200,154,58,.25)}
.rlab .mk-q{background:linear-gradient(transparent 52%,rgba(200,154,58,.55) 52%);font-weight:600}
.rlab .mk-data{border-bottom:3px solid rgba(74,106,138,.55)}
.rlab .mk-rule{text-decoration:underline wavy var(--terra) 2px;text-underline-offset:4px;font-weight:600}
.rlab .mk-no{background:rgba(196,114,74,.25)}
.rlab .sp.block{display:block}

/* steps */
.rlab .step{background:var(--sheet);border:1px solid var(--line);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow)}
.rlab .step h3{font-size:18px;margin-bottom:4px;color:#3a2010}
.rlab .step .lead{color:var(--ink-soft);font-size:14.5px;margin-bottom:14px}
.rlab .qtext{font-weight:600;margin:14px 0 10px;color:var(--ink)}
.rlab .opts{display:grid;gap:8px}
.rlab .opt{text-align:left;border:1.5px solid var(--line);border-radius:10px;background:#fff;padding:10px 14px;transition:all .15s;line-height:1.4;color:var(--ink)}
.rlab .opt:hover{border-color:var(--mustard)}
.rlab .opt.ok{border-color:var(--olive);background:var(--olive-soft);font-weight:600}
.rlab .opt.no{border-color:var(--terra);background:var(--terra-soft);animation:rlab-shake .3s}
.rlab .opt:disabled{cursor:default}
@keyframes rlab-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
@media(prefers-reduced-motion:reduce){.rlab .opt.no{animation:none}.rlab .card{transition:none}}
.rlab .note{margin-top:12px;background:var(--olive-soft);border-radius:10px;padding:10px 14px;font-size:14.5px;color:var(--ink)}
.rlab .note b{color:#3a5028}
.rlab .warn-note{margin-top:10px;background:var(--terra-soft);border-radius:10px;padding:10px 14px;font-size:14px;color:var(--ink)}
.rlab .solved-line{display:flex;gap:8px;align-items:baseline;font-size:14.5px;color:var(--ink-soft);margin-bottom:10px;border-bottom:1px dashed var(--line);padding-bottom:8px}
.rlab .solved-line .chk{color:var(--olive);font-weight:800}
.rlab .solved-line b{color:var(--ink)}

.rlab .numrow{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:8px}
.rlab .numrow input{width:110px;padding:9px 12px;border:1.5px solid var(--line);border-radius:10px;font-family:var(--mono);font-size:17px;background:#fff;color:var(--ink)}
.rlab .numrow input.ok{border-color:var(--olive);background:var(--olive-soft)}
.rlab .numrow input.no{border-color:var(--terra);background:var(--terra-soft)}
.rlab .btn{background:var(--olive);color:#fff;font-weight:700;border-radius:10px;padding:10px 18px;transition:transform .1s}
.rlab .btn:hover{transform:translateY(-1px)}
.rlab .btn:disabled{opacity:.45;cursor:default;transform:none}
.rlab .btn-ghost{background:transparent;color:var(--olive);border:1.5px solid var(--olive)}
.rlab .hint-btn{font-size:13.5px;color:var(--blue);font-weight:600;text-decoration:underline;text-underline-offset:3px}
.rlab .hint-box{margin-top:8px;background:var(--blue-soft);border-radius:10px;padding:9px 13px;font-size:14px;color:var(--ink)}
.rlab .nextwrap{margin-top:16px;text-align:right}
.rlab .banner{margin-top:14px;border-radius:10px;padding:12px 16px;font-weight:700;text-align:center}
.rlab .banner.contr{background:var(--terra);color:#fff;font-family:var(--serif);font-size:18px}
.rlab .banner.win{background:var(--olive);color:#fff;font-size:17px}

/* order cards */
.rlab .ocards{display:grid;gap:8px}
.rlab .ocard{text-align:left;border:1.5px solid var(--line);border-radius:10px;background:#fff;padding:10px 14px;display:flex;gap:10px;align-items:center;color:var(--ink)}
.rlab .ocard:hover{border-color:var(--mustard)}
.rlab .ocard .num{min-width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;background:var(--paper);border:1.5px dashed var(--line);color:var(--ink-soft)}
.rlab .ocard.picked .num{background:var(--mustard);border-style:solid;border-color:var(--mustard);color:#fff}
.rlab .ocard.right{border-color:var(--olive);background:var(--olive-soft)}
.rlab .ocard.wrongo{border-color:var(--terra)}

/* truth table */
.rlab .ttable{display:grid;gap:6px;margin:12px 0}
.rlab .trow{display:grid;grid-template-columns:64px 1fr 1fr;gap:6px;align-items:stretch}
.rlab .trow .rl{font-size:12.5px;font-weight:700;color:var(--ink-soft);display:flex;align-items:center}
.rlab .tcell{border:1.5px solid var(--line);border-radius:8px;background:#fff;padding:6px 9px;font-size:13.5px;display:flex;align-items:center;gap:7px;justify-content:space-between;color:var(--ink)}
.rlab .tcell .vbadge{font-weight:800;font-size:12px;border-radius:6px;padding:1px 7px;flex-shrink:0}
.rlab .tcell.vt{border-color:var(--olive);background:var(--olive-soft)}
.rlab .tcell.vt .vbadge{background:var(--olive);color:#fff}
.rlab .tcell.vf{border-color:var(--terra);background:var(--terra-soft)}
.rlab .tcell.vf .vbadge{background:var(--terra);color:#fff}
.rlab button.tcell{font-family:inherit;font-size:13.5px;text-align:left;width:100%}
.rlab .tcell:disabled{cursor:default;opacity:1}
.rlab .tcell.clk{cursor:pointer}
.rlab .tcell.clk:hover{border-color:var(--mustard);background:var(--mustard-soft)}
.rlab .tcell.wrongflash{animation:rlab-shake .3s;border-color:var(--terra);background:var(--terra-soft)}
.rlab .trow.badrow .rl{color:var(--terra)}
.rlab .trow.badrow .tcell{border-color:var(--terra);animation:rlab-shake .3s}

/* places */
.rlab .places{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:12px 0}
.rlab .place{border:1.5px dashed var(--line);border-radius:10px;background:var(--paper);text-align:center;padding:8px 4px}
.rlab .place .pn{font-size:11px;font-weight:700;color:var(--ink-soft);letter-spacing:.06em}
.rlab .place .pv{font-family:var(--serif);font-weight:700;font-size:15px;min-height:22px;color:var(--ink)}
.rlab .place.filled{border-style:solid;border-color:var(--olive);background:var(--olive-soft)}

/* bars */
.rlab .barwrap{margin:14px 0;display:grid;gap:10px}
.rlab .barrow{display:flex;align-items:center;gap:10px}
.rlab .barrow .blabel{width:92px;font-size:13px;font-weight:700;color:var(--ink-soft);text-align:right;flex-shrink:0}
.rlab .bar{display:flex;height:38px;border-radius:8px;overflow:hidden;flex:1;border:1.5px solid #7a6450}
.rlab .bseg{display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff}
.rlab .bseg.light{color:var(--ink);background:repeating-linear-gradient(45deg,#fff,#fff 6px,var(--paper) 6px,var(--paper) 12px)}

/* конструктор полоски */
.rlab .track{position:relative;height:42px;border:1.5px solid #7a6450;border-radius:8px;background:#fff;flex:1;min-width:0}
.rlab .track .seg{position:absolute;top:0;bottom:0;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;overflow:hidden;white-space:nowrap}
.rlab .track .seg.striped{background:repeating-linear-gradient(45deg,#fff,#fff 6px,var(--paper) 6px,var(--paper) 12px);color:var(--ink)}
.rlab .divline{position:absolute;left:50%;top:0;bottom:0;width:3px;background:#7a6450;transform:translateX(-1.5px);z-index:1}
.rlab .handle{position:absolute;top:-12px;bottom:-24px;width:34px;margin-left:-17px;cursor:ew-resize;touch-action:none;z-index:3}
.rlab .handle::before{content:"";position:absolute;left:15px;top:10px;bottom:22px;width:4px;background:#7a6450;border-radius:2px}
.rlab .handle .grip{position:absolute;left:4px;bottom:0;width:26px;height:26px;border-radius:50%;background:var(--mustard);border:2.5px solid #fff;box-shadow:var(--shadow)}
.rlab .tick{position:absolute;top:100%;width:2px;height:9px;background:var(--terra);transform:translateX(-1px)}
.rlab .halfslot{position:absolute;top:4px;bottom:4px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;border-radius:6px;border:none;cursor:pointer;z-index:2}
.rlab .halfslot.empty{border:2px dashed var(--mustard);background:rgba(200,154,58,.08);color:var(--ink-soft)}
.rlab .chiprow{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 4px}
.rlab .chip{border:1.5px solid var(--line);border-radius:999px;padding:7px 14px;font-weight:700;background:#fff;font-size:14px;color:var(--ink)}
.rlab .chip.sel{border-color:var(--mustard);background:var(--mustard-soft)}
.rlab .chip:disabled{opacity:.35;cursor:default}
.rlab .bracket{height:11px;border:2.5px solid var(--mustard);border-top:none;border-radius:0 0 7px 7px;position:relative;margin-top:1px}
.rlab .bracket span{position:absolute;top:11px;left:50%;transform:translateX(-50%);font-weight:800;font-size:12.5px;color:#6a5018;white-space:nowrap}

/* timeline */
.rlab .timeline{position:relative;margin:18px 6px 8px;padding-left:14px;border-left:3px solid var(--mustard)}
.rlab .tl-item{position:relative;padding:0 0 16px 16px;font-size:14px;color:var(--ink)}
.rlab .tl-item::before{content:"";position:absolute;left:-22px;top:4px;width:13px;height:13px;border-radius:50%;background:var(--mustard);border:3px solid var(--sheet)}
.rlab .tl-item b{font-family:var(--serif)}
.rlab .tl-item .sum{font-family:var(--mono);font-size:13px;color:var(--blue);font-weight:600}

/* circle */
.rlab .circle-box{text-align:center}
.rlab .circle-box svg{max-width:330px;width:100%;height:auto}
.rlab .circle-box svg text{fill:var(--ink)}
.rlab .slider-row{display:flex;align-items:center;gap:12px;justify-content:center;margin:10px 0;flex-wrap:wrap}
.rlab .slider-row input[type=range]{flex:1;max-width:300px;accent-color:var(--olive)}
.rlab .nval{font-family:var(--mono);font-size:22px;font-weight:600;min-width:56px;color:var(--ink)}
.rlab .arc-counts{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:8px 0}
.rlab .arc-counts div{border-radius:10px;padding:8px 14px;font-size:14px;font-weight:600;background:var(--paper);border:1.5px solid var(--line);color:var(--ink)}
.rlab .arc-counts div.hit{border-color:var(--olive);background:var(--olive-soft)}
.rlab .found-chips{display:flex;gap:8px;justify-content:center;margin-top:10px}
.rlab .fchip{border-radius:999px;padding:6px 16px;font-weight:800;border:2px dashed var(--line);color:var(--ink-soft)}
.rlab .fchip.got{border-style:solid;border-color:var(--olive);background:var(--olive);color:#fff}
.rlab .legend{display:flex;gap:14px;justify-content:center;font-size:12.5px;color:var(--ink-soft);flex-wrap:wrap;margin-top:6px}
.rlab .legend i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:4px}

/* teacher */
.rlab .teacher-intro{background:var(--sheet);border:1px solid var(--line);border-radius:var(--radius);padding:16px 18px;margin:14px 0 18px;font-size:14.5px;color:var(--ink-soft)}
.rlab .teacher-intro b{color:#3a5028}
.rlab .tg-step{background:var(--sheet);border:1px solid var(--line);border-left:5px solid var(--olive);border-radius:var(--radius);padding:14px 16px;margin-bottom:12px}
.rlab .tg-head{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px}
.rlab .tg-phase{font-size:11px;font-weight:800;letter-spacing:.05em;background:var(--mustard-soft);color:#6a5018;border-radius:999px;padding:3px 10px}
.rlab .tg-step h4{font-family:var(--serif);font-size:16.5px;margin:0;color:var(--ink)}
.rlab .tg-what{font-size:14.5px;margin:6px 0 2px;color:var(--ink)}
.rlab .tg-box{border-radius:10px;padding:9px 13px;font-size:13.5px;margin-top:8px;line-height:1.5}
.rlab .tg-method{background:var(--olive-soft);color:var(--ink)}
.rlab .tg-method b{color:#3a5028}
.rlab .tg-watch{background:var(--terra-soft);color:var(--ink)}
.rlab .tg-watch b{color:#6e3a1c}

/* takeaway */
.rlab .takeaway{background:var(--ink);color:var(--paper);border-radius:var(--radius);padding:20px;margin-top:16px}
.rlab .takeaway h3{color:var(--mustard);font-size:17px;margin-bottom:8px}
.rlab .takeaway p{font-size:14.5px;line-height:1.6}
.rlab .answer-card{background:var(--olive);color:#fff;border-radius:var(--radius);padding:18px;text-align:center;margin-top:16px}
.rlab .answer-card .al{font-size:12px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;opacity:.8}
.rlab .answer-card .av{font-family:var(--serif);font-size:20px;font-weight:700;margin-top:4px}
`;

function LabStyles() {
  return <style>{RL_CSS}</style>;
}

/* ================= ОБЩИЕ ПРИМИТИВЫ ================= */

const PHASES = ["Чтение 1", "Чтение 2", "Чтение 3", "Модель", "Решение", "Проверка"];

function PhaseBar({ cur }) {
  return (
    <div className="phasebar" aria-label="Этапы работы с задачей">
      {PHASES.map((p, i) => (
        <span key={p} className={i === cur ? "cur" : (i < cur ? "past" : "")}>{i < cur ? "✓ " : ""}{p}</span>
      ))}
    </div>
  );
}

function Sheet({ parts, marks, tapIds, onTap }) {
  return (
    <div className="sheet">
      <span className="pin" aria-hidden="true"></span>
      <p>
        {parts.map(pt => {
          const m = marks[pt.id] ? ("mk-" + marks[pt.id]) : "";
          const tappable = tapIds && tapIds.includes(pt.id);
          return (
            <span key={pt.id}
              className={"sp " + m + (tappable ? " tap" : "") + (pt.block ? " block" : "")}
              role={tappable ? "button" : undefined}
              tabIndex={tappable ? 0 : undefined}
              onClick={tappable ? () => onTap(pt.id) : undefined}
              onKeyDown={tappable ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onTap(pt.id); } } : undefined}
            >{pt.text}{" "}</span>
          );
        })}
      </p>
    </div>
  );
}

function Choice({ question, options, correct, note, onSolved }) {
  const [wrong, setWrong] = useState(new Set());
  const [done, setDone] = useState(false);
  const pick = i => {
    if (done) return;
    if (i === correct) { setDone(true); onSolved && onSolved(); }
    else { const w = new Set(wrong); w.add(i); setWrong(w); }
  };
  return (
    <div>
      <p className="qtext">{question}</p>
      <div className="opts">
        {options.map((o, i) => (
          <button key={i}
            className={"opt" + (done && i === correct ? " ok" : "") + (wrong.has(i) ? " no" : "")}
            disabled={done}
            onClick={() => pick(i)}>{o}</button>
        ))}
      </div>
      {done && note && <div className="note">{note}</div>}
      {!done && wrong.size > 0 && <div className="warn-note">Не торопись — вернись к тексту задачи и перечитай нужное место.</div>}
    </div>
  );
}

function NumCheck({ label, answer, suffix, hint, onSolved }) {
  const [v, setV] = useState("");
  const [st, setSt] = useState("idle");
  const [showHint, setShowHint] = useState(false);
  const check = () => {
    if (parseInt(v, 10) === answer) { setSt("ok"); onSolved && onSolved(); }
    else setSt("no");
  };
  return (
    <div>
      <p className="qtext">{label}</p>
      <div className="numrow">
        <input type="number" inputMode="numeric" value={v} disabled={st === "ok"}
          className={st === "ok" ? "ok" : (st === "no" ? "no" : "")}
          onChange={e => { setV(e.target.value); if (st === "no") setSt("idle"); }}
          onKeyDown={e => { if (e.key === "Enter") check(); }}
          aria-label={label} />
        {suffix && <span>{suffix}</span>}
        {st !== "ok" && <button className="btn" onClick={check} disabled={v === ""}>Проверить</button>}
        {st === "ok" && <span style={{ color: "var(--olive)", fontWeight: 800 }}>Верно!</span>}
      </div>
      {st === "no" && <div className="warn-note">Пока не сходится. Подумай ещё{hint ? " или возьми подсказку" : ""}.</div>}
      {hint && st !== "ok" && (
        showHint
          ? <div className="hint-box">💡 {hint}</div>
          : <p style={{ marginTop: 8 }}><button className="hint-btn" onClick={() => setShowHint(true)}>Подсказка</button></p>
      )}
    </div>
  );
}

function SolveChain({ items, onAllSolved }) {
  const [idx, setIdx] = useState(0);
  const solved = (i) => {
    if (items[i].apply) items[i].apply();
    if (i + 1 < items.length) setTimeout(() => setIdx(i + 1), 450);
    else onAllSolved && onAllSolved();
  };
  return (
    <div>
      {items.slice(0, idx).map((it, i) => (
        <div className="solved-line" key={i}>
          <span className="chk">✓</span>
          <span>{it.summary || it.question || it.label} — <b>{it.answerText || it.options[it.correct]}</b></span>
        </div>
      ))}
      {items[idx] && (
        items[idx].type === "num"
          ? <NumCheck key={idx} {...items[idx]} onSolved={() => solved(idx)} />
          : <Choice key={idx} {...items[idx]} onSolved={() => solved(idx)} />
      )}
    </div>
  );
}

function OrderCards({ cards, correctOrder, hint, onSolved }) {
  const [seq, setSeq] = useState([]);
  const [state, setState] = useState("picking");
  const tap = id => {
    if (state === "right") return;
    if (seq.includes(id)) return;
    const ns = [...seq, id];
    setSeq(ns); setState("picking");
    if (ns.length === cards.length) {
      if (ns.every((x, i) => x === correctOrder[i])) { setState("right"); onSolved && onSolved(); }
      else setState("wrong");
    }
  };
  const reset = () => { setSeq([]); setState("picking"); };
  return (
    <div>
      <div className="ocards">
        {cards.map(c => {
          const pos = seq.indexOf(c.id);
          const cls = "ocard" + (pos >= 0 ? " picked" : "") + (state === "right" ? " right" : "") + (state === "wrong" && pos >= 0 ? " wrongo" : "");
          return (
            <button key={c.id} className={cls} onClick={() => tap(c.id)} disabled={state === "right"}>
              <span className="num">{pos >= 0 ? pos + 1 : "·"}</span>
              <span>{c.t}</span>
            </button>
          );
        })}
      </div>
      {state === "wrong" && (
        <div className="warn-note">
          Порядок не сошёлся. {hint}{" "}
          <button className="hint-btn" onClick={reset}>Начать заново</button>
        </div>
      )}
      {state === "right" && <div className="note"><b>Точно!</b> Теперь события стоят так, как они происходили в жизни, а не так, как о них рассказали.</div>}
    </div>
  );
}

function StepShell({ phase, title, lead, children, solved, onNext, nextLabel }) {
  return (
    <div>
      <PhaseBar cur={phase} />
      <div className="step">
        <h3>{title}</h3>
        {lead && <p className="lead">{lead}</p>}
        {children}
        {solved && (
          <div className="nextwrap">
            <button className="btn" onClick={onNext}>{nextLabel || "Дальше →"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Takeaway({ title, text, answer }) {
  return (
    <div>
      {answer && (
        <div className="answer-card">
          <div className="al">Ответ</div>
          <div className="av">{answer}</div>
        </div>
      )}
      <div className="takeaway">
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}

function useSteps() {
  const [i, setI] = useState(0);
  const [ok, setOk] = useState(false);
  return {
    i, ok,
    solve: () => setOk(true),
    next: () => { setI(x => x + 1); setOk(false); rlScrollTop(); }
  };
}

/* ================= ЗАДАЧА 1 · ПИРОЖКИ ================= */

const PIES_PARTS = [
  { id: "s0", text: "Надя испекла пирожки с малиной, черникой и клубникой." },
  { id: "s1", text: "Пирожков с малиной получилась половина от общего количества пирожков;" },
  { id: "s2", text: "пирожков с черникой — на 14 меньше, чем пирожков с малиной." },
  { id: "s3", text: "А пирожков с клубникой получилось в два раза меньше, чем пирожков с малиной и черникой вместе." },
  { id: "s4", text: "Сколько пирожков каждого вида испекла Надя?" },
];

function usePctDrag(ref, setPct, opts) {
  const { min = 8, max = 92, disabled = false } = opts || {};
  const dragging = React.useRef(false);
  const fromEvent = e => {
    const r = ref.current.getBoundingClientRect();
    const p = (e.clientX - r.left) / r.width * 100;
    return Math.max(min, Math.min(max, p));
  };
  return {
    onPointerDown: e => { if (disabled) return; dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); },
    onPointerMove: e => { if (!dragging.current || disabled) return; setPct(fromEvent(e)); },
    onPointerUp: () => { dragging.current = false; },
    onPointerCancel: () => { dragging.current = false; },
  };
}

function SplitBar({ onDone }) {
  const ref = React.useRef(null);
  const [pct, setPct] = useState(31);
  const [fails, setFails] = useState(0);
  const [done, setDone] = useState(false);
  const drag = usePctDrag(ref, setPct, { disabled: done });
  const check = () => {
    if (Math.abs(pct - 50) <= 4) { setPct(50); setDone(true); onDone(); }
    else setFails(f => f + 1);
  };
  const key = e => {
    if (done) return;
    if (e.key === "ArrowLeft") { setPct(p => Math.max(8, p - 2)); e.preventDefault(); }
    if (e.key === "ArrowRight") { setPct(p => Math.min(92, p + 2)); e.preventDefault(); }
    if (e.key === "Enter") check();
  };
  return (
    <div>
      <p className="qtext">Шаг 1. Покажи на полоске, какую часть занимают пирожки с малиной: передвинь жёлтую ручку туда, где должна пройти граница.</p>
      <div className="barrow" style={{ marginBottom: 30 }}>
        <span className="blabel">все пирожки</span>
        <div className="track" ref={ref}>
          <div className="seg" style={{ left: 0, width: pct + "%", background: "var(--terra)" }}></div>
          <div className="seg striped" style={{ left: pct + "%", width: (100 - pct) + "%" }}></div>
          {fails >= 2 && !done && <span className="tick" style={{ left: "50%" }}></span>}
          <div className="handle" style={{ left: pct + "%" }} role="slider" tabIndex={0}
            aria-label="Граница деления полоски" aria-valuemin={8} aria-valuemax={92} aria-valuenow={Math.round(pct)}
            onKeyDown={key} {...drag}>
            <span className="grip" aria-hidden="true"></span>
          </div>
        </div>
      </div>
      {!done && <button className="btn" onClick={check}>Готово</button>}
      {fails > 0 && !done && <div className="warn-note">{fails >= 2 ? "Малина — половина всех пирожков, значит граница должна пройти ровно посередине. Красная засечка отмечает середину." : "Пока не так. Перечитай условие на листке: какая часть всех пирожков — с малиной?"}</div>}
      {done && <div className="note"><b>Точно!</b> Малина — половина всех пирожков, граница — ровно посередине. Теперь подпишем части.</div>}
    </div>
  );
}

function LabelHalves({ onDone }) {
  const CHIPS = ["малина", "черника + клубника", "только клубника"];
  const [sel, setSel] = useState(null);
  const [slots, setSlots] = useState({ L: null, R: null });
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);
  const used = v => slots.L === v || slots.R === v;
  const colorOf = v => v === "малина" ? "var(--terra)" : "var(--blue)";
  const place = side => {
    if (done) return;
    if (sel === null) { setMsg("Сначала выбери подпись внизу, потом нажми на часть полоски."); return; }
    const ns = { ...slots, [side]: CHIPS[sel] };
    setSel(null);
    if (ns.L && ns.R) {
      const have = [ns.L, ns.R];
      if (have.includes("малина") && have.includes("черника + клубника")) {
        setSlots(ns); setMsg(""); setDone(true); onDone();
      } else if (ns.L === ns.R) {
        setSlots({ ...ns, [side]: null });
        setMsg("Одна и та же подпись два раза? Так не выйдет — в полоске две РАЗНЫЕ части.");
      } else {
        setSlots({ L: ns.L === "только клубника" ? null : ns.L, R: ns.R === "только клубника" ? null : ns.R });
        setMsg("Что-то не сходится. Малина — одна половина. А во второй прячутся ОБА оставшихся вида пирожков.");
      }
    } else { setSlots(ns); setMsg(""); }
  };
  return (
    <div>
      <p className="qtext">Шаг 2. Подпиши обе половины: выбери подпись внизу, затем нажми на часть полоски.</p>
      <div className="barrow">
        <span className="blabel">делим пополам</span>
        <div className="track">
          <span className="divline" aria-hidden="true"></span>
          {["L", "R"].map((side, i) => (
            <button key={side}
              className={"halfslot" + (slots[side] ? "" : " empty")}
              style={{
                left: i === 0 ? "1.5%" : "51.5%", width: "47%",
                background: slots[side] ? colorOf(slots[side]) : undefined,
                color: slots[side] ? "#fff" : undefined
              }}
              onClick={() => place(side)}>
              {slots[side] || "?"}
            </button>
          ))}
        </div>
      </div>
      <div className="chiprow">
        {CHIPS.map((c, i) => (
          <button key={c} className={"chip" + (sel === i ? " sel" : "")} disabled={used(c) || done} onClick={() => setSel(sel === i ? null : i)}>{c}</button>
        ))}
      </div>
      {msg && !done && <div className="warn-note">{msg}</div>}
      {done && <div className="note"><b>Чертёж заговорил:</b> черника + клубника вместе занимают ровно столько же, сколько малина. В тексте этого не написано — это увидел <i>твой</i> чертёж.</div>}
    </div>
  );
}

function CompareBar({ onDone }) {
  const ref = React.useRef(null);
  const [pct, setPct] = useState(94);
  const [fixed, setFixed] = useState(false);
  const [warn, setWarn] = useState(false);
  const drag = usePctDrag(ref, setPct, { min: 14, max: 96, disabled: fixed });
  const fix = () => {
    if (pct <= 80) { setFixed(true); setWarn(false); }
    else setWarn(true);
  };
  const key = e => {
    if (fixed) return;
    if (e.key === "ArrowLeft") { setPct(p => Math.max(14, p - 2)); e.preventDefault(); }
    if (e.key === "ArrowRight") { setPct(p => Math.min(96, p + 2)); e.preventDefault(); }
    if (e.key === "Enter") fix();
  };
  return (
    <div>
      <p className="qtext">Шаг 3. Сравним малину и чернику на отдельном чертеже. Перечитай на листке, что сказано про чернику, и потяни её полоску за ручку так, чтобы чертёж стал правдивым.</p>
      <div style={{ maxWidth: 430 }}>
        <div className="barrow" style={{ marginBottom: 10 }}>
          <span className="blabel">малина</span>
          <div className="track"><div className="seg" style={{ left: 0, width: "100%", background: "var(--terra)" }}>малина</div></div>
        </div>
        <div className="barrow" style={{ marginBottom: fixed ? 4 : 30 }}>
          <span className="blabel">черника</span>
          <div className="track" ref={ref}>
            <div className="seg" style={{ left: 0, width: pct + "%", background: "var(--blue)" }}>черника</div>
            {fixed && <div className="seg striped" style={{ left: pct + "%", width: (100 - pct) + "%" }}>?</div>}
            {!fixed && <div className="handle" style={{ left: pct + "%" }} role="slider" tabIndex={0}
              aria-label="Длина полоски черники" aria-valuemin={14} aria-valuemax={96} aria-valuenow={Math.round(pct)}
              onKeyDown={key} {...drag}><span className="grip" aria-hidden="true"></span></div>}
          </div>
        </div>
        {fixed && (
          <div className="barrow" style={{ marginBottom: 18 }}>
            <span className="blabel"></span>
            <div style={{ flex: 1, display: "flex" }}>
              <div style={{ width: pct + "%" }}></div>
              <div className="bracket" style={{ width: (100 - pct) + "%" }}><span>разница</span></div>
            </div>
          </div>
        )}
      </div>
      {!fixed && <button className="btn" onClick={fix}>Зафиксировать чернику</button>}
      {warn && !fixed && <div className="warn-note">Перечитай условие: черники на 14 меньше, чем малины. Какой же должна быть её полоска?</div>}
      {fixed && (
        <div style={{ marginTop: 14 }}>
          <NumCheck label="Между черникой и малиной остался недостающий кусочек. Сколько в нём пирожков? Ответ спрятан в условии задачи." answer={14} suffix="пирожков"
            hint="Перечитай на листке: «пирожков с черникой — на 14 меньше, чем пирожков с малиной». Разница и есть этот кусочек."
            onSolved={() => onDone(pct)} />
          <div className="note" style={{ marginTop: 10 }}>Заметь: мы не знаем, НАСКОЛЬКО короче рисовать чернику, — чертёж не обязан быть точным. Важно, что разница подписана: 14.</div>
        </div>
      )}
    </div>
  );
}

function PiesModelBuilder({ onSolved }) {
  const [stage, setStage] = useState(0);
  const [pct, setPct] = useState(70);
  const [insightDone, setInsightDone] = useState(false);
  const halves = (
    <div className="barrow" style={{ marginBottom: 6 }}>
      <span className="blabel">все пирожки</span>
      <div className="track">
        <div className="seg" style={{ left: 0, width: "50%", background: "var(--terra)" }}>малина</div>
        <div className="seg" style={{ left: "50%", width: "50%", background: "var(--blue)" }}>черника + клубника</div>
      </div>
    </div>
  );
  return (
    <div className="barwrap">
      {stage === 0 && <SplitBar onDone={() => setTimeout(() => setStage(1), 700)} />}
      {stage === 1 && <LabelHalves onDone={() => setTimeout(() => setStage(2), 1100)} />}
      {stage >= 2 && halves}
      {stage === 2 && <CompareBar onDone={p => { setPct(p); setTimeout(() => setStage(3), 500); }} />}
      {stage === 3 && (
        <div>
          <div style={{ maxWidth: 430 }}>
            <div className="barrow" style={{ marginBottom: 10 }}>
              <span className="blabel">малина</span>
              <div className="track"><div className="seg" style={{ left: 0, width: "100%", background: "var(--terra)" }}>малина</div></div>
            </div>
            <div className="barrow" style={{ marginBottom: 10 }}>
              <span className="blabel">черника</span>
              <div className="track">
                <div className="seg" style={{ left: 0, width: pct + "%", background: "var(--blue)" }}>черника</div>
                <div className={"seg" + (insightDone ? "" : " striped")}
                  style={{ left: pct + "%", width: (100 - pct) + "%", background: insightDone ? "var(--mustard)" : undefined }}>
                  {insightDone ? "клубника = 14" : "14"}
                </div>
              </div>
            </div>
          </div>
          <Choice
            question="Твой чертёж говорит: черника + клубника = малина. А черника — это малина без кусочка в 14 пирожков. Каким кусочком на чертеже оказывается клубника?"
            options={["Ровно этим недостающим кусочком: клубника = 14 пирожков!", "Половиной малины", "По чертежу это узнать нельзя"]}
            correct={0}
            note={<span><b>Вот она, сила чертежа:</b> мы ещё «не начинали решать», а одно из трёх чисел уже найдено. Клубника точно заполняет промежуток между черникой и малиной.</span>}
            onSolved={() => { setInsightDone(true); onSolved(); }} />
        </div>
      )}
    </div>
  );
}

function PiesProblem({ onComplete }) {
  const S = useSteps();
  const [marks, setMarks] = useState({});
  const mark = (id, t) => setMarks(m => ({ ...m, [id]: t }));

  const tapQuestion = id => {
    if (id === "s4") { mark("s4", "q"); S.solve(); }
    else { mark(id, "no"); setTimeout(() => setMarks(m => { const c = { ...m }; if (c[id] === "no") delete c[id]; return c; }), 700); }
  };

  const steps = [
    () => (
      <StepShell phase={0} title="Прочитай задачу как историю" lead="Пока не считай ничего. Просто пойми, что происходит." solved={S.ok} onNext={S.next}>
        <Choice question="О чём эта задача?"
          options={["О том, как Надя продавала пирожки на ярмарке", "О трёх видах пирожков: сколько каких испекли", "О том, какие пирожки вкуснее — с малиной или с черникой"]}
          correct={1}
          note={<span><b>Да.</b> Есть три вида пирожков, и их количества как-то связаны между собой. Числа подождут — сначала картинка в голове.</span>}
          onSolved={S.solve} />
      </StepShell>
    ),
    () => (
      <StepShell phase={1} title="Найди вопрос" lead="Нажми на листке задачи на то предложение, в котором спрятан вопрос." solved={S.ok} onNext={S.next}>
        {S.ok
          ? <div className="note"><b>Вопрос найден и подсвечен.</b> Нам нужно три числа: малина, черника и клубника.</div>
          : <p className="lead">👆 Нажимай прямо на текст листка выше.</p>}
      </StepShell>
    ),
    () => (
      <StepShell phase={2} title="Переведи каждую фразу-сравнение" lead="Самое опасное место в задаче — слова «меньше» и «больше». Переводим их аккуратно, по одной фразе." solved={S.ok} onNext={S.next}>
        <SolveChain onAllSolved={S.solve} items={[
          {
            question: "«Пирожков с малиной — половина от общего количества». Как это записать?",
            options: ["малина = всего ÷ 2", "всего = малина ÷ 2", "малина = всего × 2"], correct: 0,
            summary: "«половина от общего»",
            note: <span>Малина — это <b>половина всех</b> пирожков.</span>,
            apply: () => mark("s1", "data")
          },
          {
            question: "«Пирожков с черникой — на 14 меньше, чем с малиной». Что это значит?",
            options: ["черника = малина + 14", "черника = малина − 14", "малина = черника − 14"], correct: 1,
            summary: "«на 14 меньше, чем с малиной»",
            note: <span><b>Ловушка пройдена!</b> Слово «меньше» относится к чернике: её меньше. Многие на автомате вычитают не из того числа или складывают — потому что «меньше» хочется превратить в действие, не думая, <i>что с чем</i> сравнивают.</span>,
            apply: () => mark("s2", "data")
          },
          {
            question: "«Клубники в два раза меньше, чем малины и черники вместе». Как записать?",
            options: ["клубника = (малина + черника) ÷ 2", "клубника = малина + черника − 2", "клубника = малина ÷ 2 + черника"], correct: 0,
            summary: "«в два раза меньше, чем … вместе»",
            note: <span>Сначала «малина и черника <b>вместе</b>» — это сумма, и уже её делим на 2. Запомни разницу: «<b>на</b> 14 меньше» — это вычитание, а «<b>в</b> два раза меньше» — деление.</span>,
            apply: () => mark("s3", "data")
          },
        ]} />
      </StepShell>
    ),
    () => (
      <StepShell phase={3} title="Построй модель сам" lead="Теперь ты — чертёжник. Готовой схемы не будет: собери модель-полоску своими руками, шаг за шагом." solved={S.ok} onNext={S.next}>
        <PiesModelBuilder onSolved={S.solve} />
      </StepShell>
    ),
    () => (
      <StepShell phase={4} title="Теперь считаем" lead="Модель построена — арифметика станет короткой." solved={S.ok} onNext={S.next}>
        <SolveChain onAllSolved={S.solve} items={[
          {
            type: "num", label: "Из твоего чертежа: клубника = 14. И по условию она в два раза меньше, чем малина и черника вместе. Сколько пирожков с малиной и черникой вместе?", answer: 28, suffix: "пирожков", answerText: "28",
            hint: "Если клубника в 2 раза меньше суммы, то сумма в 2 раза больше клубники: 14 × 2."
          },
          {
            type: "num", label: "Малина + черника = 28, при этом черника на 14 меньше малины. Сколько пирожков с малиной?", answer: 21, suffix: "пирожков", answerText: "21",
            hint: "Если бы черники было столько же, сколько малины, вместе было бы 28 + 14 = 42 — две одинаковые малины. Значит, одна малина — это 42 ÷ 2."
          },
          {
            type: "num", label: "И последний: сколько пирожков с черникой?", answer: 7, suffix: "пирожков", answerText: "7",
            hint: "Черника на 14 меньше малины: 21 − 14."
          },
        ]} />
      </StepShell>
    ),
    () => (
      <StepShell phase={5} title="Взгляд назад" lead="Ответ не готов, пока не проверен по тексту. Выполни каждую проверку сам." solved={S.ok} onNext={() => onComplete()} nextLabel="Готово! ✓">
        <SolveChain onAllSolved={S.solve} items={[
          {
            type: "num", label: "Проверка 1. Сколько всего пирожков испекла Надя: 21 + 7 + 14?", answer: 42, suffix: "пирожка", answerText: "42",
            hint: "Сложи по частям: 21 + 14 = 35, потом ещё 7."
          },
          { question: "Малины — 21 пирожок. Это половина от 42?", options: ["Да: 42 ÷ 2 = 21 — первое условие выполняется", "Нет, половина от 42 — это 24"], correct: 0, summary: "Малина — половина всех" },
          {
            type: "num", label: "Проверка 2. На сколько пирожков черники (7) меньше, чем малины (21)?", answer: 14, suffix: "", answerText: "на 14 — как в условии",
            hint: "21 − 7."
          },
          {
            type: "num", label: "Проверка 3. Во сколько раз клубники (14) меньше, чем малины и черники вместе (28)?", answer: 2, suffix: "", answerText: "в 2 раза — как в условии",
            hint: "28 ÷ 14."
          },
        ]} />
        {S.ok && <Takeaway
          answer="Малина — 21, черника — 7, клубника — 14"
          title="Чему научила эта задача"
          text="Сравнения бывают двух видов: «на сколько меньше» — отнимаем разницу, и «во сколько раз меньше» — делим. Ни то ни другое нельзя превращать в действие на автомате: сначала разберись, ЧТО с ЧЕМ сравнивают. А чертёж-полоска показал то, чего в тексте не было написано: черника и клубника вместе равны малине." />}
      </StepShell>
    ),
  ];

  return (
    <div>
      <Sheet parts={PIES_PARTS} marks={marks} tapIds={S.i === 1 && !S.ok ? PIES_PARTS.map(p => p.id) : null} onTap={tapQuestion} />
      <div key={S.i}>{steps[S.i]()}</div>
    </div>
  );
}

/* ================= ЗАДАЧА 2 · ВОЗРАСТ ДЕТЕЙ ================= */

const AGES_PARTS = [
  { id: "s0", text: "На вопрос о возрасте его детей математик ответил: — У нас с женой трое детей." },
  { id: "s1", text: "Когда родился наш первенец, суммарный возраст членов семьи был равен 45 годам;" },
  { id: "s2", text: "год назад, когда родился третий ребёнок, — 70 годам;" },
  { id: "s3", text: "а сейчас суммарный возраст детей — 14 лет." },
  { id: "s4", text: "Сколько лет каждому ребёнку, если у всех членов семьи дни рождения в один и тот же день?" },
];

function AgesTimeline() {
  return (
    <div className="timeline" aria-hidden="true">
      <div className="tl-item"><b>Родился первый ребёнок</b><br /><span className="sum">вся семья вместе: 45 лет</span></div>
      <div className="tl-item"><b>Родился второй ребёнок</b><br /><span className="sum">(в тексте об этом ни слова!)</span></div>
      <div className="tl-item"><b>Год назад: родился третий</b><br /><span className="sum">вся семья вместе: 70 лет</span></div>
      <div className="tl-item"><b>Сейчас</b><br /><span className="sum">трое детей вместе: 14 лет</span></div>
    </div>
  );
}

function AgesProblem({ onComplete }) {
  const S = useSteps();
  const [marks, setMarks] = useState({});
  const mark = (id, t) => setMarks(m => ({ ...m, [id]: t }));

  const tapQuestion = id => {
    if (id === "s4") { mark("s4", "q"); S.solve(); }
    else { mark(id, "no"); setTimeout(() => setMarks(m => { const c = { ...m }; if (c[id] === "no") delete c[id]; return c; }), 700); }
  };

  const steps = [
    () => (
      <StepShell phase={0} title="Прочитай как историю" lead="Числа пока не трогаем. Кто герои этой истории?" solved={S.ok} onNext={S.next}>
        <SolveChain onAllSolved={S.solve} items={[
          {
            question: "О чём рассказывает математик?",
            options: ["О своей работе и научных открытиях", "О своей семье и возрасте детей", "О том, как праздновали день рождения"], correct: 1,
            summary: "О чём история"
          },
          {
            question: "Сколько всего человек в семье?",
            options: ["Трое", "Четверо", "Пятеро"], correct: 2,
            summary: "Сколько человек в семье",
            note: <span>Папа, мама и <b>трое</b> детей — пятеро. Это важно: «суммарный возраст членов семьи» — это возраст <b>всех пятерых</b> (когда они уже родились!).</span>
          },
        ]} />
      </StepShell>
    ),
    () => (
      <StepShell phase={1} title="Найди вопрос" lead="Нажми на предложение с вопросом на листке задачи." solved={S.ok} onNext={S.next}>
        {S.ok
          ? <div className="note"><b>Есть!</b> Ищем три числа — возраст каждого из трёх детей.</div>
          : <p className="lead">👆 Нажимай прямо на текст листка выше.</p>}
      </StepShell>
    ),
    () => (
      <StepShell phase={2} title="Восстанови порядок событий" lead="В тексте события рассказаны вперемешку. Нажимай на карточки в том порядке, в каком события происходили НА САМОМ ДЕЛЕ — от самого давнего к сегодняшнему." solved={S.ok} onNext={S.next}>
        <OrderCards
          cards={[
            { id: "now", t: "Сейчас: трём детям вместе 14 лет" },
            { id: "third", t: "Год назад: родился третий ребёнок; всей семье вместе 70 лет" },
            { id: "second", t: "Родился второй ребёнок" },
            { id: "first", t: "Родился первый ребёнок; всей семье вместе 45 лет" },
          ]}
          correctOrder={["first", "second", "third", "now"]}
          hint={"«Год назад» — это совсем недавно. А что случилось раньше всего: рождение первого или третьего ребёнка?"}
          onSolved={() => { mark("s1", "data"); mark("s2", "data"); mark("s3", "data"); S.solve(); }} />
        {S.ok && <div className="note" style={{ marginTop: 10 }}>Заметь: про рождение <b>второго</b> ребёнка в тексте вообще ничего нет — но это событие точно было между первым и третьим. Хороший читатель видит и то, о чём текст молчит.</div>}
      </StepShell>
    ),
    () => (
      <StepShell phase={3} title="Скрытые подсказки" lead="Линия времени готова. Теперь достанем из неё то, что в тексте не написано прямо." solved={S.ok} onNext={S.next}>
        <AgesTimeline />
        <SolveChain onAllSolved={S.solve} items={[
          {
            type: "num", label: "Третий ребёнок родился год назад. Сколько ему лет сейчас?", answer: 1, suffix: "год", answerText: "1",
            hint: "Он родился ровно год назад — значит, сейчас ему исполнился…"
          },
          {
            question: "«Когда родился первенец, суммарный возраст семьи — 45 лет». Сколько лет было самому первенцу в этот момент?",
            options: ["1 год", "0 лет — он только что родился", "Неизвестно"], correct: 1,
            summary: "Возраст первенца в момент рождения",
            note: <span>Новорождённому — 0! Значит, 45 лет — это возраст <b>папы и мамы вместе</b> в тот день.</span>
          },
          {
            type: "num", label: "Всем детям сейчас вместе 14 лет, младшему — 1 год. Сколько лет вместе двум старшим?", answer: 13, suffix: "лет", answerText: "13",
            hint: "14 − 1."
          },
        ]} />
      </StepShell>
    ),
    () => (
      <StepShell phase={4} title="Идём по линии времени" lead="Главная хитрость: когда проходит год, КАЖДЫЙ член семьи становится старше на год." solved={S.ok} onNext={S.next}>
        <SolveChain onAllSolved={S.solve} items={[
          {
            type: "num", label: "Год назад вся семья (5 человек) вместе — 70 лет. Прошёл один год. Сколько лет всей семье вместе сейчас?", answer: 75, suffix: "лет", answerText: "75",
            hint: "За год каждый из пятерых стал старше на 1 год. На сколько выросла общая сумма?"
          },
          {
            type: "num", label: "Семье вместе сейчас 75 лет, из них дети — 14. Сколько лет папе и маме вместе сейчас?", answer: 61, suffix: "лет", answerText: "61",
            hint: "75 − 14."
          },
          {
            question: "Пусть старшему сейчас Х лет. Он родился Х лет назад. На сколько лет МЕНЬШЕ была тогда сумма возрастов папы и мамы?",
            options: ["На Х лет", "На 2·Х лет — их же двое!", "На Х + 2 года"], correct: 1,
            summary: "На сколько «помолодеют» родители",
            note: <span><b>Ловушка пройдена!</b> Время отматываем на Х лет, но людей <b>двое</b> — каждый был моложе на Х. Вместе — на 2·Х.</span>
          },
          {
            type: "num", label: "Сейчас родителям вместе 61, а в день рождения первенца было 45. Значит 61 − 2·Х = 45. Сколько лет старшему?", answer: 8, suffix: "лет", answerText: "8",
            hint: "61 − 45 = 16. Это и есть 2·Х."
          },
          {
            type: "num", label: "Двум старшим вместе 13. Сколько лет среднему ребёнку?", answer: 5, suffix: "лет", answerText: "5",
            hint: "13 − 8."
          },
        ]} />
      </StepShell>
    ),
    () => (
      <StepShell phase={5} title="Взгляд назад" lead="Проверим ответ 8, 5 и 1 по всем точкам линии времени." solved={S.ok} onNext={() => onComplete()} nextLabel="Готово! ✓">
        <SolveChain onAllSolved={S.solve} items={[
          {
            type: "num", label: "Проверка 1. Сложи возрасты детей: 8 + 5 + 1. В условии сказано, что сейчас детям вместе 14.", answer: 14, suffix: "лет", answerText: "14 — сходится",
            hint: "8 + 5 = 13, и ещё 1."
          },
          {
            type: "num", label: "Проверка 2. Год назад родителям вместе было 59, а детям 7 + 4 + 0 = 11. Сколько было всей семье? В условии — 70.", answer: 70, suffix: "лет", answerText: "70 — сходится",
            hint: "59 + 11."
          },
          {
            type: "num", label: "Проверка 3. Когда родился первенец (8 лет назад), родители были вместе моложе на 16 лет: 61 − 16 = ? В условии — 45.", answer: 45, suffix: "лет", answerText: "45 — сходится",
            hint: "61 − 16."
          },
        ]} />
        {S.ok && <Takeaway
          answer="Детям 8 лет, 5 лет и 1 год"
          title="Чему научила эта задача"
          text="События в тексте стояли не по порядку — и мы НЕ начали считать, пока не построили линию времени. Две скрытые подсказки текст не говорил прямо: новорождённому 0 лет, а за год сумма возрастов семьи растёт на число её членов." />}
      </StepShell>
    ),
  ];

  return (
    <div>
      <Sheet parts={AGES_PARTS} marks={marks} tapIds={S.i === 1 && !S.ok ? AGES_PARTS.map(p => p.id) : null} onTap={tapQuestion} />
      <div key={S.i}>{steps[S.i]()}</div>
    </div>
  );
}

/* ================= ЗАДАЧА 3 · КРОСС ================= */

const CROSS_PARTS = [
  { id: "s0", text: "Корреспондент районной газеты опоздал к финишу кросса и попросил болельщиков рассказать о результатах. Он получил такие ответы:", block: true },
  { id: "a0", text: "1) «Серёжа занял второе место, а Коля — третье.»", block: true },
  { id: "a1", text: "2) «Серёжа занял второе место, а Ваня — четвёртое.»", block: true },
  { id: "a2", text: "3) «Надя заняла третье место, а Толя — пятое.»", block: true },
  { id: "a3", text: "4) «Толя занял первое место, а Надя — второе.»", block: true },
  { id: "a4", text: "5) «Коля занял первое место, а Ваня — четвёртое.»", block: true },
  { id: "s4", text: "Какое место занял каждый из пяти бегунов, если каждый болельщик один раз сказал правду, а один раз соврал?", block: true },
];

const STATEMENTS = [
  ["Серёжа — 2-й", "Коля — 3-й"],
  ["Серёжа — 2-й", "Ваня — 4-й"],
  ["Надя — 3-я", "Толя — 5-й"],
  ["Толя — 1-й", "Надя — 2-я"],
  ["Коля — 1-й", "Ваня — 4-й"],
];

function TruthTable({ verdicts, clickable, onCell, wrongKey, free, badRows }) {
  return (
    <div className="ttable" aria-label="Таблица ответов болельщиков">
      {STATEMENTS.map((row, r) => (
        <div className={"trow" + (badRows && badRows.has(r) ? " badrow" : "")} key={r}>
          <span className="rl">Ответ {r + 1}</span>
          {row.map((cell, c) => {
            const k = r + "-" + c;
            const v = verdicts[k];
            const canClick = clickable && (free || !v);
            const cls = "tcell" + (v === "И" ? " vt" : (v === "Л" ? " vf" : "")) + (canClick ? " clk" : "") + (wrongKey === k ? " wrongflash" : "");
            const inner = (
              <React.Fragment>
                <span>{cell}</span>
                {v && <span className="vbadge">{v === "И" ? "правда" : "ложь"}</span>}
              </React.Fragment>
            );
            return clickable
              ? <button key={c} className={cls} onClick={() => canClick && onCell(k)} disabled={!canClick}>{inner}</button>
              : <div key={c} className={cls}>{inner}</div>;
          })}
        </div>
      ))}
    </div>
  );
}

function PlacesBoard({ places }) {
  return (
    <div className="places" aria-label="Места бегунов">
      {[1, 2, 3, 4, 5].map(p => (
        <div key={p} className={"place" + (places[p] ? " filled" : "")}>
          <div className="pn">{p} место</div>
          <div className="pv">{places[p] || "?"}</div>
        </div>
      ))}
    </div>
  );
}

const ST_DATA = [[{ who: "Серёжа", pl: 2 }, { who: "Коля", pl: 3 }],
[{ who: "Серёжа", pl: 2 }, { who: "Ваня", pl: 4 }],
[{ who: "Надя", pl: 3 }, { who: "Толя", pl: 5 }],
[{ who: "Толя", pl: 1 }, { who: "Надя", pl: 2 }],
[{ who: "Коля", pl: 1 }, { who: "Ваня", pl: 4 }],
];
const ALL_KEYS = [];
for (let r = 0; r < 5; r++) for (let c = 0; c < 2; c++) ALL_KEYS.push(r + "-" + c);
const cellAt = k => { const [r, c] = k.split("-").map(Number); return ST_DATA[r][c]; };

function deduceCell(k, verdicts) {
  const [r, c] = k.split("-").map(Number);
  const me = ST_DATA[r][c];
  const pv = verdicts[r + "-" + (1 - c)];
  if (pv === "И") return { v: "Л", why: "в ответе " + (r + 1) + " правда уже есть, по качелям эта часть обязана быть ложью" };
  if (pv === "Л") return { v: "И", why: "в ответе " + (r + 1) + " ложь уже есть, по качелям эта часть обязана быть правдой" };
  for (const k2 of ALL_KEYS) {
    if (k2 === k) continue;
    const o = cellAt(k2);
    if (o.who === me.who && o.pl === me.pl && verdicts[k2])
      return { v: verdicts[k2], why: "это же утверждение уже отмечено в ответе " + (Number(k2.split("-")[0]) + 1) + " — одно утверждение, одна судьба" };
  }
  for (const k2 of ALL_KEYS) {
    if (verdicts[k2] !== "И") continue;
    const o = cellAt(k2);
    if (o.pl === me.pl && o.who !== me.who) return { v: "Л", why: me.pl + "-е место уже занято: там " + o.who };
    if (o.who === me.who && o.pl !== me.pl) return { v: "Л", why: me.who + " уже занял " + o.pl + "-е место" };
  }
  return null;
}

function findContradictions(verdicts) {
  const rows = new Set();
  for (let r = 0; r < 5; r++) {
    const a = verdicts[r + "-0"], b = verdicts[r + "-1"];
    if (a && b && a === b) rows.add(r);
  }
  for (const k1 of ALL_KEYS) for (const k2 of ALL_KEYS) {
    if (k1 >= k2) continue;
    if (verdicts[k1] === "И" && verdicts[k2] === "И") {
      const A = cellAt(k1), B = cellAt(k2);
      if ((A.pl === B.pl && A.who !== B.who) || (A.who === B.who && A.pl !== B.pl)) {
        rows.add(Number(k1.split("-")[0])); rows.add(Number(k2.split("-")[0]));
      }
    }
  }
  return rows;
}

function applyWithDuplicates(k, v, verdicts) {
  const nv = { ...verdicts, [k]: v };
  const me = cellAt(k);
  let dup = false;
  for (const k2 of ALL_KEYS) {
    const o = cellAt(k2);
    if (o.who === me.who && o.pl === me.pl) { if (k2 !== k && !verdicts[k2]) dup = true; nv[k2] = v; }
  }
  return { nv, dup };
}

function DeduceChain({ mode, premise, verdicts, setVerdicts, onPlace, places, showPlaces, onDone }) {
  const [phase, setPhase] = useState("premise");
  const [done, setDone] = useState(false);
  const [log, setLog] = useState([]);
  const [wrong, setWrong] = useState(null);
  const [msg, setMsg] = useState("");
  const [bad, setBad] = useState(null);
  const [hint, setHint] = useState("");
  const labelOf = k => { const [r, c] = k.split("-").map(Number); return STATEMENTS[r][c]; };
  const flashWrong = (k, m) => { setWrong(k); setMsg(m); setTimeout(() => setWrong(null), 650); };

  const click = k => {
    if (done) return;
    setMsg(""); setHint("");
    if (phase === "premise") {
      if (premise.cells.includes(k)) {
        const { nv } = applyWithDuplicates(k, premise.verdict, verdicts);
        setVerdicts(nv);
        setLog(l => [...l, labelOf(k) + " — " + (premise.verdict === "И" ? "правда" : "ложь") + " (наша гипотеза). Это же утверждение окрасилось и во втором ответе"]);
        setPhase("work");
      } else flashWrong(k, "Сначала отметим саму гипотезу: ищи часть «Серёжа — 2-й».");
      return;
    }
    if (verdicts[k]) return;
    const d = deduceCell(k, verdicts);
    if (!d) { flashWrong(k, "Про эту часть пока нельзя сказать наверняка: ни правило качелей, ни занятые места её не определяют. Поищи часть, чья судьба уже предрешена."); return; }
    const { nv, dup } = applyWithDuplicates(k, d.v, verdicts);
    setVerdicts(nv);
    setLog(l => [...l, labelOf(k) + " — " + (d.v === "И" ? "правда" : "ложь") + ": " + d.why + (dup ? ". И это же утверждение окрасилось в другом ответе" : "")]);
    if (d.v === "И" && onPlace) { const me = cellAt(k); onPlace(me.pl, me.who); }
    const contr = findContradictions(nv);
    if (mode === "contradiction" && contr.size > 0) {
      setBad(contr); setDone(true); onDone();
      return;
    }
    if (mode === "complete" && ALL_KEYS.every(x => nv[x])) { setDone(true); onDone(); }
  };

  const giveHint = () => {
    for (const k of ALL_KEYS) {
      if (!verdicts[k] && deduceCell(k, verdicts)) { setHint("Присмотрись к ответу " + (Number(k.split("-")[0]) + 1) + "."); return; }
    }
  };

  return (
    <div>
      {log.map((t, i) => (<div className="solved-line" key={i}><span className="chk">✓</span><span>{t}</span></div>))}
      {phase === "premise" && !done && <p className="qtext">👉 {premise.prompt}</p>}
      {phase === "work" && !done && <p className="qtext">👉 Нажимай на любую часть, судьбу которой уже можно определить ТОЧНО, — в любом порядке. Тренажёр сам поймёт по твоим ходам, правда это или ложь.</p>}
      <TruthTable verdicts={verdicts} clickable={!done} onCell={click} wrongKey={wrong} badRows={bad} />
      {showPlaces && <PlacesBoard places={places} />}
      {msg && !done && <div className="warn-note">{msg}</div>}
      {phase === "work" && !done && (hint
        ? <div className="hint-box">💡 {hint}</div>
        : <p style={{ marginTop: 8 }}><button className="hint-btn" onClick={giveHint}>Подсказка</button></p>)}
    </div>
  );
}

const CROSS_EXPECTED = { "0-0": "Л", "0-1": "И", "1-0": "Л", "1-1": "И", "2-0": "Л", "2-1": "И", "3-0": "Л", "3-1": "И", "4-0": "Л", "4-1": "И" };

function FreeTruthCheck({ places, onSolved }) {
  const [fv, setFv] = useState({});
  const [bad, setBad] = useState(null);
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);
  const toggle = k => {
    if (done) return;
    setBad(null); setMsg("");
    setFv(v => {
      const c = { ...v };
      if (!c[k]) c[k] = "И";
      else if (c[k] === "И") c[k] = "Л";
      else delete c[k];
      return c;
    });
  };
  const check = () => {
    const marked = Object.keys(CROSS_EXPECTED).filter(k => fv[k]).length;
    if (marked < 10) { setMsg("Пока отмечено " + marked + " из 10 частей. Каждая часть — либо правда, либо ложь: разметь все."); return; }
    const ruleBad = new Set();
    for (let r = 0; r < 5; r++) {
      const a = fv[r + "-0"], b = fv[r + "-1"];
      if (!((a === "И" && b === "Л") || (a === "Л" && b === "И"))) ruleBad.add(r);
    }
    if (ruleBad.size > 0) {
      setBad(ruleBad);
      setMsg("В подсвеченных ответах нарушено правило задачи: каждый болельщик один раз сказал правду и один раз соврал.");
      return;
    }
    const placeBad = new Set();
    Object.keys(CROSS_EXPECTED).forEach(k => { if (fv[k] !== CROSS_EXPECTED[k]) placeBad.add(parseInt(k, 10)); });
    if (placeBad.size > 0) {
      setBad(placeBad);
      setMsg("Правило качелей в каждой строке соблюдено, но в подсвеченных ответах отметки спорят с доской мест. Сверь каждую часть с местами бегунов.");
      return;
    }
    setDone(true); setBad(null); setMsg(""); onSolved();
  };
  return (
    <div>
      <PlacesBoard places={places} />
      <p className="qtext">Теперь без подсказок: глядя на доску мест, разметь всю таблицу сам. Нажатие на часть: первое — «правда», второе — «ложь», третье — снимает отметку.</p>
      <TruthTable verdicts={fv} clickable={!done} free onCell={toggle} badRows={bad} />
      {!done && <button className="btn" onClick={check}>Проверить разметку</button>}
      {msg && !done && <div className="warn-note">{msg}</div>}
      {done && <div className="note"><b>Всё сходится!</b> В каждом ответе ровно одна правда и одна ложь — как и требовало условие. И забавная находка: все болельщики соврали в первой части ответа, а правду сказали во второй.</div>}
    </div>
  );
}

function CrossProblem({ onComplete }) {
  const S = useSteps();
  const [marks, setMarks] = useState({});
  const mark = (id, t) => setMarks(m => ({ ...m, [id]: t }));
  const [verdicts, setVerdicts] = useState({});
  const [places, setPlaces] = useState({});
  const setP = (p, name) => setPlaces(pl => ({ ...pl, [p]: name }));
  const [contradiction, setContradiction] = useState(false);
  const [aDone, setADone] = useState(false);
  const [bDone, setBDone] = useState(false);

  const tapRule = id => {
    if (id === "s4") { mark("s4", "rule"); S.solve(); }
    else { mark(id, "no"); setTimeout(() => setMarks(m => { const c = { ...m }; if (c[id] === "no") delete c[id]; return c; }), 700); }
  };

  const steps = [
    () => (
      <StepShell phase={0} title="Прочитай как историю" lead="Пять болельщиков, пять ответов. Но не всё в них правда…" solved={S.ok} onNext={S.next}>
        <Choice question="Что произошло в этой истории?"
          options={["Корреспондент сам видел финиш и записал результаты", "Корреспондент не видел финиш и узнаёт места из ответов болельщиков", "Бегуны рассказали корреспонденту о своих местах"]}
          correct={1}
          note={<span>Именно так. Все данные — это <b>слова болельщиков</b>, и доверять им полностью нельзя.</span>}
          onSolved={S.solve} />
      </StepShell>
    ),
    () => (
      <StepShell phase={1} title="Найди главное правило" lead="В этой задаче важнее всего не числа, а одно условие-правило. Нажми на предложение, где оно спрятано." solved={S.ok} onNext={S.next}>
        {S.ok
          ? <Choice question="«Каждый один раз сказал правду, а один раз соврал». Что это значит для КАЖДОГО ответа из двух частей?"
            options={["Обе части могут быть правдой", "Ровно одна часть — правда, а другая — обязательно ложь", "Обе части могут быть ложью"]}
            correct={1}
            note={<span><b>Это ключ ко всей задаче.</b> В каждом ответе части — как качели: если одна часть правда, вторая автоматически ложь. И наоборот!</span>}
            onSolved={() => { }} />
          : <p className="lead">👆 Нажимай прямо на текст листка выше.</p>}
      </StepShell>
    ),
    () => (
      <StepShell phase={2} title="Потренируем правило" lead="Прежде чем решать — убедимся, что «качели» понятны." solved={S.ok} onNext={S.next}>
        <TruthTable verdicts={{}} />
        <SolveChain onAllSolved={S.solve} items={[
          {
            question: "Если в ответе 1 часть «Серёжа — 2-й» — правда, то часть «Коля — 3-й» — …?",
            options: ["тоже правда", "обязательно ложь", "может быть и так, и так"], correct: 1,
            summary: "Качели в ответе 1"
          },
          {
            question: "А ещё «Серёжа — 2-й» встречается и в ответе 2. Если это правда в ответе 1, то в ответе 2 эта же часть…",
            options: ["тоже правда — это же одно и то же утверждение", "может быть ложью", "зависит от болельщика"], correct: 0,
            summary: "Одно утверждение — одна судьба",
            note: <span>Утверждение либо верно, либо нет — <b>независимо от того, кто его произнёс</b>.</span>
          },
        ]} />
      </StepShell>
    ),
    () => (
      <StepShell phase={3} title="Гипотеза № 1: пусть «Серёжа — 2-й» — правда" lead="Метод гипотезы: предполагаем и честно идём по цепочке следствий. Работай прямо в таблице — нажимай на нужную часть ответа. Если упрёмся в противоречие, гипотеза неверна, и это тоже результат!" solved={S.ok} onNext={() => { setVerdicts({}); setContradiction(false); S.next(); }} nextLabel="Проверить другую гипотезу →">
        <DeduceChain mode="contradiction"
          premise={{ cells: ["0-0", "1-0"], verdict: "И", prompt: "Принимаем гипотезу: нажми на часть «Серёжа — 2-й» (она есть в двух ответах, подойдёт любая), чтобы пометить её правдой." }}
          verdicts={verdicts} setVerdicts={setVerdicts}
          onDone={() => setADone(true)} />
        {aDone && !S.ok && <Choice question="В подсвеченных ответах случилось невозможное: утверждения спорят друг с другом — два бегуна на одном месте или две правды в одном ответе. Что это значит?"
          options={["В задаче опечатка", "Гипотеза неверна: «Серёжа — 2-й» — точно ложь. И это ценный результат!"]} correct={1}
          onSolved={() => { setContradiction(true); S.solve(); }} />}
        {contradiction && <div className="banner contr">⚡ Противоречие! Гипотеза неверна</div>}
        {S.ok && <div className="note"><b>Отлично сработано!</b> Противоречие — не ошибка, а находка: теперь мы ТОЧНО знаем, что «Серёжа — 2-й» — ложь.</div>}
      </StepShell>
    ),
    () => (
      <StepShell phase={4} title="Гипотеза № 2: «Серёжа — 2-й» — ложь" lead="Теперь рассуждение должно сойтись без противоречий. Иди любым путём: отмечай части, чья судьба уже известна, — доска мест будет заполняться сама." solved={S.ok} onNext={S.next}>
        <DeduceChain mode="complete"
          premise={{ cells: ["0-0", "1-0"], verdict: "Л", prompt: "Гипотеза № 1 рухнула — значит, «Серёжа — 2-й» точно ложь. Нажми на эту часть, чтобы отметить." }}
          verdicts={verdicts} setVerdicts={setVerdicts}
          onPlace={(pl, who) => setP(pl, who)} places={places} showPlaces
          onDone={() => setBDone(true)} />
        {bDone && (
          <Choice question="Все места, кроме одного, заняты. Какое место у Серёжи?"
            options={["Первое!", "Второе", "Пятое"]} correct={0}
            note={<span>А ведь в начале нам очень хотелось поверить, что Серёжа — второй. На самом деле он — <b>победитель</b>!</span>}
            onSolved={() => { setP(1, "Серёжа"); S.solve(); }} />
        )}
      </StepShell>
    ),
    () => (
      <StepShell phase={5} title="Взгляд назад" lead="Ответ найден, но решение не готово, пока не проверено по правилу задачи." solved={S.ok} onNext={() => onComplete()} nextLabel="Готово! ✓">
        <FreeTruthCheck places={places} onSolved={S.solve} />
        {S.ok && <Takeaway
          answer="Серёжа — 1-й, Надя — 2-я, Коля — 3-й, Ваня — 4-й, Толя — 5-й"
          title="Чему научила эта задача"
          text="Метод гипотезы: предположи → честно иди по цепочке следствий → если противоречие, предположение неверно. Противоречие — это не провал, а ценная информация. И помни: одно и то же утверждение либо верно, либо нет, кто бы его ни произнёс." />}
      </StepShell>
    ),
  ];

  return (
    <div>
      <Sheet parts={CROSS_PARTS} marks={marks} tapIds={S.i === 1 && !S.ok ? CROSS_PARTS.map(p => p.id) : null} onTap={tapRule} />
      <div key={S.i}>{steps[S.i]()}</div>
    </div>
  );
}

/* ================= ЗАДАЧА 4 · ПИРАТЫ ================= */

const PIR_PARTS = [
  { id: "s0", text: "Пираты встали в хоровод." },
  { id: "s1", text: "Лью и Дью стоят друг напротив друга." },
  { id: "s2", text: "Между Лью и Мью 6 человек, а между Дью и Мью — 26." },
  { id: "s3", text: "Сколько могло быть пиратов?" },
];

function CircleExplorer({ onBothFound }) {
  const [n, setN] = useState(36);
  const [found, setFound] = useState(new Set());
  const half = n / 2;
  const mew = 7;
  const shortPeople = half - mew - 1;
  const longPeople = n - (half - mew) - 1;
  const hitShort = shortPeople === 26;
  const hitLong = longPeople === 26;

  React.useEffect(() => {
    if (hitShort || hitLong) {
      setFound(f => {
        if (f.has(n)) return f;
        const nf = new Set(f); nf.add(n);
        if (nf.size === 2) onBothFound();
        return nf;
      });
    }
  }, [n]);

  const R = 120, CX = 160, CY = 160;
  const dots = [];
  for (let i = 0; i < n; i++) {
    const ang = -Math.PI / 2 + i * 2 * Math.PI / n;
    const x = CX + R * Math.cos(ang), y = CY + R * Math.sin(ang);
    let fill = "#C9BFA9", r = 3.4;
    if (i === 0) { fill = "var(--olive)"; r = 8; }
    else if (i === half) { fill = "var(--terra)"; r = 8; }
    else if (i === mew) { fill = "var(--mustard)"; r = 8; }
    else if (i > 0 && i < mew) { fill = "#A8B380"; r = 4; }
    else if (i > mew && i < half) { fill = "var(--blue)"; r = 4; }
    else { fill = "#B9A98E"; r = 4; }
    dots.push(<circle key={i} cx={x} cy={y} r={r} fill={fill} />);
  }
  const lbl = (idx, text) => {
    const ang = -Math.PI / 2 + idx * 2 * Math.PI / n;
    const x = CX + (R + 22) * Math.cos(ang), y = CY + (R + 22) * Math.sin(ang) + 4;
    return <text x={x} y={y} textAnchor="middle" fontSize="13" fontWeight="700" fontFamily="Manrope">{text}</text>;
  };

  return (
    <div className="circle-box">
      <svg viewBox="0 0 320 320" role="img" aria-label={"Хоровод из " + n + " пиратов"}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--line)" strokeWidth="1.5" />
        {dots}
        {lbl(0, "Лью")}{lbl(half, "Дью")}{lbl(mew, "Мью")}
      </svg>
      <div className="slider-row">
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-soft)" }}>пиратов:</span>
        <input type="range" min="34" max="72" step="2" value={n}
          onChange={e => setN(parseInt(e.target.value, 10))}
          aria-label="Число пиратов в хороводе" />
        <span className="nval">{n}</span>
      </div>
      <div className="arc-counts">
        <div className={hitShort ? "hit" : ""}>между Дью и Мью <b>по синей дуге</b>: {shortPeople} {hitShort ? "✓ 26!" : ""}</div>
        <div className={hitLong ? "hit" : ""}>между Дью и Мью <b>по дуге через Лью</b>: {longPeople} {hitLong ? "✓ 26!" : ""}</div>
      </div>
      <div className="legend">
        <span><i style={{ background: "var(--olive)" }}></i>Лью</span>
        <span><i style={{ background: "var(--terra)" }}></i>Дью</span>
        <span><i style={{ background: "var(--mustard)" }}></i>Мью</span>
        <span><i style={{ background: "#A8B380" }}></i>6 человек между Лью и Мью</span>
      </div>
      <div className="found-chips">
        <span className={"fchip" + (found.has(40) ? " got" : "")}>{found.has(40) ? "✓ " : ""}40 пиратов</span>
        <span className={"fchip" + (found.has(68) ? " got" : "")}>{found.has(68) ? "✓ " : ""}68 пиратов</span>
      </div>
      {found.size === 1 && <p className="lead" style={{ marginTop: 10 }}>Один ответ найден! Но слово «могло» намекает: поищи ещё. Попробуй, чтобы 26 человек оказались на <b>другой</b> дуге.</p>}
    </div>
  );
}

function PiratesProblem({ onComplete }) {
  const S = useSteps();
  const [marks, setMarks] = useState({});
  const mark = (id, t) => setMarks(m => ({ ...m, [id]: t }));

  const tapQuestion = id => {
    if (id === "s3") { mark("s3", "q"); S.solve(); }
    else { mark(id, "no"); setTimeout(() => setMarks(m => { const c = { ...m }; if (c[id] === "no") delete c[id]; return c; }), 700); }
  };

  const steps = [
    () => (
      <StepShell phase={0} title="Прочитай как историю" lead="Сначала — картинка в голове." solved={S.ok} onNext={S.next}>
        <Choice question="Пираты «встали в хоровод». Как они стоят?"
          options={["В одну шеренгу, плечом к плечу", "По кругу, взявшись за руки", "В колонну друг за другом"]}
          correct={1}
          note={<span><b>Круг!</b> Это меняет всё: у круга нет начала и конца, и между двумя пиратами всегда есть <i>два пути</i> — по одной дуге и по другой.</span>}
          onSolved={S.solve} />
      </StepShell>
    ),
    () => (
      <StepShell phase={1} title="Найди вопрос — и одно хитрое слово" lead="Нажми на предложение с вопросом." solved={S.ok} onNext={S.next}>
        {S.ok
          ? <Choice question="В вопросе сказано «сколько МОГЛО быть пиратов». О чём предупреждает слово «могло»?"
            options={["Это просто вежливая форма вопроса", "Ответ, возможно, не один — надо найти все варианты", "Задачу можно не решать точно"]}
            correct={1}
            note={<span>Слово «могло» — сигнал: <b>ищи все варианты</b>. Если найдёшь один ответ и остановишься — задача решена только наполовину.</span>}
            onSolved={() => { }} />
          : <p className="lead">👆 Нажимай прямо на текст листка выше.</p>}
      </StepShell>
    ),
    () => (
      <StepShell phase={2} title="Что значит «напротив»?" lead="Разберём каждое слово условия — особенно «напротив» и «между»." solved={S.ok} onNext={S.next}>
        <SolveChain onAllSolved={() => { mark("s1", "data"); mark("s2", "data"); S.solve(); }} items={[
          {
            question: "Лью и Дью стоят друг напротив друга. Сколько людей стоит между ними с одной и с другой стороны круга?",
            options: ["С одной стороны всегда меньше", "Поровну с обеих сторон", "Зависит от роста пиратов"], correct: 1,
            summary: "«Напротив» = с обеих сторон поровну людей"
          },
          {
            question: "Раз с обеих сторон между Лью и Дью поровну людей, что можно сказать про ОБЩЕЕ число пиратов?",
            options: ["Оно обязательно чётное", "Оно обязательно нечётное", "Может быть любым"], correct: 0,
            summary: "Число пиратов чётное",
            note: <span>Считаем людей: Лью и Дью (двое) плюс две одинаковые группы между ними. Двое + поровну + поровну — всегда <b>чётное число</b>. Это уже отсеивает половину всех вариантов!</span>
          },
          {
            question: "«Между Лью и Мью 6 человек». А по другой дуге между ними может стоять другое число людей?",
            options: ["Нет, «между» — это всегда одно число", "Да! По одной дуге 6, по другой — сколько-то ещё"], correct: 1,
            summary: "«Между» на круге — два пути",
            note: <span>В этом вся хитрость задачи: на круге «между двумя пиратами» можно понимать <b>по любой из двух дуг</b>.</span>
          },
        ]} />
      </StepShell>
    ),
    () => (
      <StepShell phase={3} title="Собери хоровод" lead="Лью — зелёный, Дью — напротив него, Мью — так, что между ним и Лью 6 человек. Двигай ползунок и подбери число пиратов, чтобы между Дью и Мью оказалось ровно 26 человек. Найди ОБА ответа!" solved={S.ok} onNext={S.next}>
        <CircleExplorer onBothFound={S.solve} />
        {S.ok && <div className="note"><b>Оба ответа найдены!</b> При 68 пиратах 26 человек стоят по короткой дуге, а при 40 — по дуге, проходящей через Лью.</div>}
      </StepShell>
    ),
    () => (
      <StepShell phase={4} title="А теперь — почему так?" lead="Модель показала ответы. Проверим их рассуждением, без картинки." solved={S.ok} onNext={S.next}>
        <SolveChain onAllSolved={S.solve} items={[
          {
            type: "num", label: "Случай 1: все 26 человек стоят на стороне Мью — между Мью и Дью, НЕ через Лью. Пересчитай людей между Лью и Дью с этой стороны: 6 человек, потом Мью, потом 26 человек. Сколько всего?", answer: 33, suffix: "", answerText: "33 человека",
            hint: "6 + 1 + 26. Мью — тоже человек, не забудь посчитать и его!"
          },
          {
            type: "num", label: "«Напротив» значит: с другой стороны между Лью и Дью стоит столько же — тоже 33 человека. Сколько всего пиратов в хороводе? Не забудь самих Лью и Дью!", answer: 68, suffix: "пиратов", answerText: "68",
            hint: "33 + 33 и ещё двое — Лью и Дью."
          },
          {
            type: "num", label: "Случай 2: 26 человек стоят на дуге от Мью до Дью, проходящей ЧЕРЕЗ Лью. Среди этих 26 — шестеро между Мью и Лью и сам Лью: он ведь тоже один из стоящих между! Сколько из 26 стоит между Лью и Дью: 26 − 6 − 1?", answer: 19, suffix: "", answerText: "19 человек",
            hint: "Из 26 человек убери шестерых и самого Лью."
          },
          {
            type: "num", label: "Раз «напротив» — со стороны Мью между Лью и Дью тоже 19 человек (проверь: 6 человек, Мью и ещё 12 — ровно 19). Сколько всего пиратов: 19 + 19 и сами Лью с Дью?", answer: 40, suffix: "пиратов", answerText: "40",
            hint: "19 + 19 + 2."
          },
        ]} />
      </StepShell>
    ),
    () => (
      <StepShell phase={5} title="Взгляд назад" lead="Проверим оба ответа." solved={S.ok} onNext={() => onComplete()} nextLabel="Готово! ✓">
        <SolveChain onAllSolved={S.solve} items={[
          {
            type: "num", label: "Проверка для 68 пиратов. Без Лью и Дью остаётся 66 человек — по 33 с каждой стороны. Со стороны Мью стоят: 6 человек, сам Мью и 26 человек. Сколько это вместе: 6 + 1 + 26?", answer: 33, suffix: "", answerText: "33 — ровно половина, сходится ✓",
            hint: "6 + 1 + 26."
          },
          {
            type: "num", label: "Проверка для 40 пиратов. Без Лью и Дью остаётся 38 человек — по 19 с каждой стороны. На дуге от Мью до Дью через Лью стоят: 6 человек, сам Лью и 19 человек дальней стороны. Сколько это вместе: 6 + 1 + 19?", answer: 26, suffix: "", answerText: "26 — как в условии ✓",
            hint: "6 + 1 + 19."
          },
          {
            question: "Оба ответа — 40 и 68 — чётные. Так и должно быть?",
            options: ["Да: «напротив» делит круг на две равные половины, поэтому число пиратов чётное", "Нет, это случайное совпадение"], correct: 0,
            summary: "Чётность сходится с предсказанием"
          },
        ]} />
        {S.ok && <Takeaway
          answer="Пиратов могло быть 40 или 68"
          title="Чему научила эта задача"
          text="Нестандартная задача может иметь несколько ответов — и слово «могло» предупреждало об этом с самого начала. На круге «между» означает две разные дуги. Когда текст трудно представить — построй модель и подвигай её руками." />}
      </StepShell>
    ),
  ];

  return (
    <div>
      <Sheet parts={PIR_PARTS} marks={marks} tapIds={S.i === 1 && !S.ok ? PIR_PARTS.map(p => p.id) : null} onTap={tapQuestion} />
      <div key={S.i}>{steps[S.i]()}</div>
    </div>
  );
}

/* ================= ЭКСПОРТ ================= */
window.MMM_RL = {
  LabStyles, Sheet,
  PIES_PARTS, AGES_PARTS, CROSS_PARTS, PIR_PARTS,
  PiesProblem, AgesProblem, CrossProblem, PiratesProblem,
};
