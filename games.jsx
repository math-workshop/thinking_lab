// Логические игры: судоку 4/6/9 с генератором, ним со спичками, магический квадрат 3×3.

const { useState: useS, useEffect: useE, useMemo: useM, useCallback: useCB } = React;

// ╔════════════════════════════════════════════════════════════╗
// ║                      СУДОКУ — ГЕНЕРАТОР                    ║
// ╚════════════════════════════════════════════════════════════╝
// Базовые валидные сетки по размерам; затем тасуем символы / строки / столбцы внутри полос.
const SUDOKU_BASE = {
  4: { boxR: 2, boxC: 2, grid: [
    [1,2,3,4],
    [3,4,1,2],
    [2,1,4,3],
    [4,3,2,1],
  ]},
  6: { boxR: 2, boxC: 3, grid: [
    [1,2,3,4,5,6],
    [4,5,6,1,2,3],
    [2,3,1,5,6,4],
    [5,6,4,2,3,1],
    [3,1,2,6,4,5],
    [6,4,5,3,1,2],
  ]},
  9: { boxR: 3, boxC: 3, grid: [
    [1,2,3,4,5,6,7,8,9],
    [4,5,6,7,8,9,1,2,3],
    [7,8,9,1,2,3,4,5,6],
    [2,3,1,5,6,4,8,9,7],
    [5,6,4,8,9,7,2,3,1],
    [8,9,7,2,3,1,5,6,4],
    [3,1,2,6,4,5,9,7,8],
    [6,4,5,9,7,8,3,1,2],
    [9,7,8,3,1,2,6,4,5],
  ]},
};

function shuffle(a) { const r = a.slice(); for (let i=r.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [r[i],r[j]]=[r[j],r[i]]; } return r; }

function generateSudoku(size) {
  const { grid: base, boxR, boxC } = SUDOKU_BASE[size];
  let g = base.map(r => r.slice());
  // 1) перестановка символов
  const perm = shuffle(Array.from({length:size}, (_,i)=>i+1));
  g = g.map(row => row.map(v => perm[v-1]));
  // 2) перестановка строк внутри каждой "полосы" (band) высотой boxR
  for (let band=0; band<size/boxR; band++) {
    const idx = shuffle(Array.from({length:boxR}, (_,i)=>band*boxR+i));
    const rows = idx.map(i => g[i].slice());
    for (let k=0;k<boxR;k++) g[band*boxR+k] = rows[k];
  }
  // 3) перестановка столбцов внутри каждого "стека" (stack) шириной boxC
  for (let stack=0; stack<size/boxC; stack++) {
    const idx = shuffle(Array.from({length:boxC}, (_,i)=>stack*boxC+i));
    const cols = idx.map(i => g.map(row => row[i]));
    for (let k=0;k<boxC;k++) for (let r=0;r<size;r++) g[r][stack*boxC+k] = cols[k][r];
  }
  // 4) удалить клетки (доля зависит от размера)
  const removeFrac = size===4 ? 0.45 : size===6 ? 0.50 : 0.55;
  const cells = shuffle(Array.from({length: size*size}, (_,i)=>i));
  const removeN = Math.floor(cells.length * removeFrac);
  const puzzle = g.map(r => r.slice());
  for (let i=0;i<removeN;i++) {
    const c = cells[i]; puzzle[Math.floor(c/size)][c%size] = 0;
  }
  return { puzzle, solution: g, size, boxR, boxC };
}

function SudokuGame() {
  const [size, setSize] = useS(4);
  const [data, setData] = useS(()=>generateSudoku(4));
  const [grid, setGrid] = useS(() => data.puzzle.map(r=>r.slice()));
  const [sel, setSel] = useS(null);
  const fixed = data.puzzle;
  const won = useM(() => {
    for (let r=0;r<data.size;r++) for (let c=0;c<data.size;c++)
      if (grid[r][c] !== data.solution[r][c]) return false;
    return true;
  }, [grid, data]);
  const errors = useM(() => {
    // подсветить клетки, где значение не совпадает с решением
    const e = new Set();
    for (let r=0;r<data.size;r++) for (let c=0;c<data.size;c++) {
      const v = grid[r][c];
      if (v && !fixed[r][c] && v !== data.solution[r][c]) e.add(`${r},${c}`);
    }
    return e;
  }, [grid, data, fixed]);

  const newGame = (s) => {
    const d = generateSudoku(s);
    setData(d); setGrid(d.puzzle.map(r=>r.slice())); setSel(null); setSize(s);
  };
  const reset = () => { setGrid(data.puzzle.map(r=>r.slice())); setSel(null); };
  const hint = () => {
    if (!sel) return;
    const [r,c] = sel;
    if (fixed[r][c]) return;
    const next = grid.map(row=>row.slice());
    next[r][c] = data.solution[r][c];
    setGrid(next);
  };
  const setCell = (v) => {
    if (!sel) return;
    const [r,c] = sel;
    if (fixed[r][c]) return;
    const next = grid.map(row=>row.slice());
    next[r][c] = v;
    setGrid(next);
  };

  const cellSize = data.size === 9 ? 36 : data.size === 6 ? 44 : 52;
  const boardW = cellSize * data.size;

  return (
    <div className="mmm-card" style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:8, flexWrap:'wrap'}}>
        <h3 className="mmm-h2" style={{ margin:0 }}>Судоку</h3>
        {won
          ? <span className="mmm-tag olive">✓ Решено!</span>
          : errors.size > 0
            ? <span className="mmm-tag terra">{errors.size} ошибок</span>
            : <span className="mmm-tag">{data.size}×{data.size}</span>}
      </div>
      <div style={{display:'flex', gap:4, justifyContent:'center'}}>
        {[4,6,9].map(s => (
          <button key={s} className={`mmm-chip ${size===s?'active':''}`} onClick={()=>newGame(s)}>
            {s}×{s}
          </button>
        ))}
      </div>
      <div style={{ background:'var(--paper-2)', padding:12, borderRadius:8, border:'1px dashed var(--line)' }}>
        <div style={{
          display:'grid', gridTemplateColumns:`repeat(${data.size}, ${cellSize}px)`, gap: 0,
          width: boardW, margin: '0 auto', border: '2.5px solid var(--ink)',
        }}>
          {grid.map((row,r) => row.map((v,c) => {
            const isFixed = fixed[r][c] !== 0;
            const isSel = sel && sel[0]===r && sel[1]===c;
            const isErr = errors.has(`${r},${c}`);
            // толстая граница на стыках боксов
            const thickR = (c+1) % data.boxC === 0 && c < data.size-1;
            const thickB = (r+1) % data.boxR === 0 && r < data.size-1;
            return (
              <button key={`${r}${c}`}
                onClick={()=>!isFixed && setSel([r,c])}
                style={{
                  width: cellSize, height: cellSize,
                  background: isErr ? '#f5cabc' : isSel ? 'var(--terra-soft)' : isFixed ? 'var(--paper-3)' : '#fdfaee',
                  border: 0,
                  borderRight: c<data.size-1 ? (thickR ? '2px solid var(--ink)' : '1px solid var(--line)') : 0,
                  borderBottom: r<data.size-1 ? (thickB ? '2px solid var(--ink)' : '1px solid var(--line)') : 0,
                  fontFamily: 'var(--serif)', fontSize: cellSize*0.45, fontWeight: 600,
                  color: isFixed ? 'var(--ink)' : isErr ? '#8a2a18' : 'var(--terra)',
                  cursor: isFixed ? 'default' : 'pointer',
                  padding: 0,
                }}>
                {v || ''}
              </button>
            );
          }))}
        </div>
      </div>
      <div style={{ display:'flex', gap:4, justifyContent:'center', flexWrap:'wrap' }}>
        {Array.from({length: data.size}, (_,i)=>i+1).map(n => (
          <button key={n} className="mmm-btn ghost" onClick={()=>setCell(n)}
            style={{minWidth: 32, padding:'6px 0', justifyContent:'center', fontFamily:'var(--serif)', fontSize:16}}>
            {n}
          </button>
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'center' }}>
        <button className="mmm-btn ghost" onClick={()=>setCell(0)} title="Стереть">стереть</button>
      </div>
      <div style={{display:'flex', gap:6, justifyContent:'center', flexWrap:'wrap'}}>
        <button className="mmm-chip" onClick={()=>newGame(size)}>↻ Новая</button>
        <button className="mmm-chip" onClick={reset}>Сбросить</button>
        <button className="mmm-chip" onClick={hint} disabled={!sel || (sel && fixed[sel[0]][sel[1]])}
          style={{ opacity: (!sel || (sel && fixed[sel[0]][sel[1]])) ? 0.4 : 1 }}>
          💡 Подсказка
        </button>
      </div>
      <p className="mmm-body" style={{margin:0, fontSize:11.5, textAlign:'center', color:'var(--ink-mute)'}}>
        В каждой строке, столбце и боксе цифры от 1 до {data.size} без повторов.
      </p>
    </div>
  );
}

// ╔════════════════════════════════════════════════════════════╗
// ║                          НИМ                                ║
// ╚════════════════════════════════════════════════════════════╝
// Клик на спичку = взять её и все правее из этой строки.
function NimGame() {
  const INIT = [3, 5, 7];
  const [piles, setPiles] = useS(INIT);
  const [turn, setTurn] = useS('player');
  const [winner, setWinner] = useS(null);
  const [hover, setHover] = useS(null); // [pileIdx, matchIdx] — кандидат хода

  useE(() => {
    if (winner || turn !== 'computer') return;
    const t = setTimeout(() => {
      let xor = piles.reduce((a,b)=>a^b, 0);
      let next = piles.slice();
      if (xor === 0) {
        const nz = piles.map((v,i)=>v?i:null).filter(i=>i!==null);
        const idx = nz[Math.floor(Math.random()*nz.length)];
        next[idx] = next[idx] - 1;
      } else {
        for (let i=0;i<piles.length;i++) {
          const target = piles[i] ^ xor;
          if (target < piles[i]) { next[i] = target; break; }
        }
      }
      setPiles(next);
      if (next.every(v=>v===0)) setWinner('computer');
      else setTurn('player');
    }, 700);
    return () => clearTimeout(t);
  }, [turn, piles, winner]);

  const takeFrom = (pileIdx, matchIdx) => {
    // взять спички с matchIdx..конца включительно
    if (turn !== 'player' || winner) return;
    const take = piles[pileIdx] - matchIdx;
    if (take <= 0) return;
    const next = piles.slice();
    next[pileIdx] = matchIdx;
    setPiles(next); setHover(null);
    if (next.every(v=>v===0)) setWinner('player');
    else setTurn('computer');
  };

  const reset = () => { setPiles(INIT); setTurn('player'); setWinner(null); setHover(null); };

  const Match = ({ pile, idx, willTake }) => (
    <button
      onMouseEnter={()=>turn==='player' && !winner && setHover([pile, idx])}
      onMouseLeave={()=>setHover(null)}
      onClick={()=>takeFrom(pile, idx)}
      disabled={turn!=='player' || !!winner}
      title={`Взять ${piles[pile]-idx}`}
      style={{
        position:'relative', width: 12, height: 38, padding: 0,
        background:'transparent', border: 0,
        cursor: turn==='player' && !winner ? 'pointer' : 'default',
      }}>
      {/* головка */}
      <div style={{
        position:'absolute', top: 0, left: 2, width: 8, height: 9, borderRadius: '50%',
        background: willTake ? '#b04a2a' : 'var(--terra)',
        boxShadow: willTake ? '0 0 6px rgba(176,74,42,.6)' : 'none',
        transition:'all .12s',
      }}/>
      {/* палочка */}
      <div style={{
        position:'absolute', top: 9, left: 4, width: 4, height: 29,
        background: willTake ? '#8a6a3a' : '#b8966a',
        opacity: willTake ? 0.5 : 1,
        transition: 'opacity .12s',
      }}/>
    </button>
  );

  const willTakeCount = hover ? piles[hover[0]] - hover[1] : 0;

  return (
    <div className="mmm-card" style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
        <h3 className="mmm-h2" style={{ margin:0 }}>Ним (спички)</h3>
        {winner
          ? <span className={`mmm-tag ${winner==='player'?'olive':'terra'}`}>{winner==='player'?'Вы выиграли':'Компьютер выиграл'}</span>
          : <span className="mmm-tag mustard">{turn==='player'?'Ваш ход':'Ход компьютера…'}</span>}
      </div>
      <div style={{ padding: 14, background:'var(--paper-2)', borderRadius: 8, border:'1px dashed var(--line)' }}>
        {piles.map((count, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'4px 0' }}>
            <span style={{fontSize:11, color:'var(--ink-mute)', width:22, fontFamily:'var(--mono)'}}>#{i+1}</span>
            <div style={{display:'flex', gap:2, flex:1, minHeight: 38, alignItems:'center'}}>
              {Array.from({length:count}, (_,j) => {
                const willTake = hover && hover[0]===i && j >= hover[1];
                return <Match key={j} pile={i} idx={j} willTake={willTake}/>;
              })}
              {count===0 && <span style={{fontSize:11, color:'var(--ink-mute)', fontStyle:'italic'}}>пусто</span>}
            </div>
            <span style={{fontSize:11, color:'var(--ink-mute)', width:18, textAlign:'right', fontFamily:'var(--mono)'}}>{count}</span>
          </div>
        ))}
      </div>
      <div style={{textAlign:'center', fontSize:12, color: hover?'var(--terra)':'var(--ink-mute)', minHeight:18}}>
        {hover ? `Возьмёте ${willTakeCount} из #${hover[0]+1}` : 'Наведи и кликни на спичку — заберёшь её и все правее.'}
      </div>
      <div style={{display:'flex', gap:8, justifyContent:'center'}}>
        <button className="mmm-chip" onClick={reset}>↻ Новая игра</button>
        <span style={{fontSize:11, color:'var(--ink-mute)', alignSelf:'center'}}>Кто берёт последнюю — выигрывает.</span>
      </div>
    </div>
  );
}

// ╔════════════════════════════════════════════════════════════╗
// ║                  МАГИЧЕСКИЙ КВАДРАТ 3×3                    ║
// ╚════════════════════════════════════════════════════════════╝
// Сумма 1+2+…+9 = 45, поделить на 3 строки = 15. Решение Lo Shu (центр 5).
const LO_SHU = [[2,7,6],[9,5,1],[4,3,8]];

function MagicSquareGame() {
  const [grid, setGrid] = useS([[0,0,0],[0,0,0],[0,0,0]]);
  const [sel, setSel] = useS(null);

  const used = useM(() => new Set(grid.flat().filter(v=>v>0)), [grid]);
  const sums = useM(() => {
    const r = grid.map(row => row.reduce((a,b)=>a+b,0));
    const c = [0,1,2].map(i => grid[0][i]+grid[1][i]+grid[2][i]);
    const d1 = grid[0][0]+grid[1][1]+grid[2][2];
    const d2 = grid[0][2]+grid[1][1]+grid[2][0];
    return { r, c, d1, d2 };
  }, [grid]);
  const filledFull = used.size === 9;
  const isMagic = useM(() => {
    if (!filledFull) return false;
    const all = [...sums.r, ...sums.c, sums.d1, sums.d2];
    return all.every(s => s === 15);
  }, [sums, filledFull]);

  // место какого числа в сетке (или null)
  const findCell = (n) => {
    for (let r=0;r<3;r++) for (let c=0;c<3;c++) if (grid[r][c]===n) return [r,c];
    return null;
  };

  const place = (n) => {
    if (!sel) return;
    const [r,c] = sel;
    const next = grid.map(row=>row.slice());
    // если n уже стоит где-то — убрать там (перемещение)
    const existing = findCell(n);
    if (existing) next[existing[0]][existing[1]] = 0;
    next[r][c] = n;
    setGrid(next);
  };
  const clearCell = () => {
    if (!sel) return;
    const next = grid.map(row=>row.slice());
    next[sel[0]][sel[1]] = 0; setGrid(next);
  };
  const reset = () => { setGrid([[0,0,0],[0,0,0],[0,0,0]]); setSel(null); };
  const showSolution = () => { setGrid(LO_SHU.map(r=>r.slice())); setSel(null); };

  // подсветка строк/столбцов/диагоналей: зелёный если =15 и заполнено, красный если >15
  const lineColor = (sum, filled) => sum===15 && filled ? 'var(--olive)' : sum > 15 ? 'var(--terra)' : 'var(--ink-mute)';
  const rowFilled = (r) => grid[r].every(v=>v>0);
  const colFilled = (c) => [0,1,2].every(r=>grid[r][c]>0);
  const d1Filled = grid[0][0]>0 && grid[1][1]>0 && grid[2][2]>0;
  const d2Filled = grid[0][2]>0 && grid[1][1]>0 && grid[2][0]>0;

  return (
    <div className="mmm-card" style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
        <h3 className="mmm-h2" style={{ margin:0 }}>Магический квадрат</h3>
        {isMagic
          ? <span className="mmm-tag olive">✓ Магический!</span>
          : <span className="mmm-tag">цель: 15</span>}
      </div>
      <div style={{ padding:14, background:'var(--paper-2)', borderRadius:8, border:'1px dashed var(--line)' }}>
        <div style={{
          display:'grid', gridTemplateColumns:'34px repeat(3, 50px) 34px',
          gridTemplateRows:'24px repeat(3, 50px)', gap:0,
          width:'fit-content', margin:'0 auto', alignItems:'center',
        }}>
          {/* главная диагональ ↘ — верхний левый угол (диагональ идёт сверху-слева вниз-направо) */}
          <div style={{gridRow:1, gridColumn:1, fontSize:11, color: lineColor(sums.d1, d1Filled), textAlign:'center', fontWeight:600, fontFamily:'var(--mono)'}}>
            ↘{sums.d1||0}
          </div>
          {/* верхняя строка: суммы столбцов */}
          {sums.c.map((s,i)=> (
            <div key={'c'+i} style={{gridRow:1, gridColumn:i+2, fontSize:12, color: lineColor(s, colFilled(i)), textAlign:'center', fontWeight:600, fontFamily:'var(--mono)'}}>
              {s||'·'}
            </div>
          ))}
          {/* анти-диагональ ↗ — верхний правый угол (диагональ идёт снизу-слева вверх-направо) */}
          <div style={{gridRow:1, gridColumn:5, fontSize:11, color: lineColor(sums.d2, d2Filled), textAlign:'center', fontWeight:600, fontFamily:'var(--mono)'}}>
            ↗{sums.d2||0}
          </div>
          {/* строки: сумма строки слева + клетки */}
          {grid.map((row,r) => (
            <React.Fragment key={r}>
              <div style={{gridRow:r+2, gridColumn:1, fontSize:12, color: lineColor(sums.r[r], rowFilled(r)), fontWeight:600, fontFamily:'var(--mono)', textAlign:'center'}}>
                {sums.r[r]||'·'}
              </div>
              {row.map((v,c) => {
                const isSel = sel && sel[0]===r && sel[1]===c;
                return (
                  <button key={c} onClick={()=>setSel([r,c])} style={{
                    gridRow:r+2, gridColumn:c+2,
                    width:50, height:50, border: '1.5px solid var(--ink)', marginLeft:-0.75, marginTop:-0.75,
                    background: isSel ? 'var(--terra-soft)' : v ? '#fdfaee' : 'var(--paper)',
                    fontFamily:'var(--serif)', fontSize:22, fontWeight:600, color:'var(--ink)',
                    cursor:'pointer', padding: 0,
                  }}>
                    {v || ''}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div style={{display:'flex', gap:5, justifyContent:'center', flexWrap:'wrap'}}>
        {[1,2,3,4,5,6,7,8,9].map(n => {
          const placed = used.has(n);
          return (
            <button key={n} className="mmm-btn ghost"
              onClick={()=>place(n)}
              disabled={!sel}
              title={placed ? `${n} уже стоит — кликни в новую клетку, переедет` : `Поставить ${n}`}
              style={{
                minWidth:34, padding:'6px 0', justifyContent:'center', fontFamily:'var(--serif)', fontSize:16,
                opacity: !sel ? 0.4 : placed ? 0.55 : 1,
                background: placed ? 'var(--paper-3)' : undefined,
              }}>
              {n}
            </button>
          );
        })}
      </div>
      <div style={{display:'flex', justifyContent:'center'}}>
        <button className="mmm-chip" onClick={clearCell} disabled={!sel} style={{opacity: !sel?0.4:1}}>стереть</button>
      </div>
      <div style={{display:'flex', gap:6, justifyContent:'center', flexWrap:'wrap'}}>
        <button className="mmm-chip" onClick={reset}>↻ Очистить</button>
        <button className="mmm-chip" onClick={showSolution}>💡 Показать решение</button>
      </div>
      <p className="mmm-body" style={{margin:0, fontSize:11.5, textAlign:'center', color:'var(--ink-mute)'}}>
        Выбери клетку → нажми число. Все 3 строки, 3 столбца и 2 диагонали должны давать 15.
      </p>
    </div>
  );
}

window.MMM_GAMES = { Sudoku4Game: SudokuGame, SudokuGame, NimGame, MagicSquareGame };
