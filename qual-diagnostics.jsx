// ════════════════════════════════════════════════════════════════
// ЭССЕ И ПОРТФОЛИО — два инструмента ВНУТРИ раздела «Диагностика»
// Дополняют ДТМ / КПН / ОПМ. Открываются как отдельные инструменты
// (плитки в DiagnosticPage), с кнопкой «← К диагностикам».
//   1. Финальное эссе «Моя любимая задача» (§5.4.2, Прил. У)
//   2. Портфолио учебных достижений (§5.3.3, Прил. Ф)
// Экспорт: window.MMM_QUAL_DIAG = { EssayInstrument, PortfolioInstrument }
// Подключение: см. инструкцию рядом с файлом.
// ════════════════════════════════════════════════════════════════
(function () {
  const { useState: qS } = React;

  const ESSAY_CRITERIA = [
    ['Осознанность выбора задачи', 'Называет «любую» или простейшую', 'Называет задачу с кратким объяснением выбора', 'Объясняет, чем задача была трудной или неожиданной'],
    ['Описание процесса решения', 'Сообщает только ответ', 'Описывает отдельные шаги', 'Воспроизводит ход рассуждения с объяснением переломных моментов'],
    ['Личная позиция', 'Не выражена', 'Общая оценка («интересно», «нравится»)', 'Конкретная позиция с обоснованием'],
  ];
  const PORTFOLIO_CRITERIA = [
    ['Полнота (охват материала)', 'Заполнено менее 50 % листов', 'Заполнено 50–80 % листов', 'Заполнено более 80 % листов'],
    ['Глубина рассуждений', 'Преимущественно ответы без объяснений', 'Часть ответов содержит объяснения', 'Большинство ответов содержат развёрнутые рассуждения'],
    ['Рост сложности задач', 'Задачи примерно одного уровня сложности', 'Заметен переход к более сложным задачам', 'Выраженный прогресс от простых к сложным'],
    ['Рефлексивность', 'Рефлексивные вопросы не заполнены или формальны', 'Есть попытки описать трудности', 'Ребёнок осмысленно описывает свой путь и ошибки'],
  ];
  const PORTFOLIO_MATERIALS = [
    'рабочие листы с условием и ходом решения',
    '«листы доказательства» (4 класс)',
    'задачи модуля «Своя задача»',
    'ответы на итоговые рефлексивные вопросы',
  ];

  function BackBtn({ onHome }) {
    return (
      <button onClick={onHome} className="mmm-btn ghost" style={{ alignSelf: 'flex-start', fontSize: 12, padding: '6px 12px' }}>
        ← К диагностикам
      </button>
    );
  }

  function PrintArea({ title, hint, onClose, children }) {
    React.useEffect(() => { const t = setTimeout(() => window.print(), 350); return () => clearTimeout(t); }, []);
    React.useEffect(() => { const h = (e) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, []);
    return ReactDOM.createPortal(
      <div className="qd-print-portal">
        <style>{`
          .qd-print-portal { position: fixed; inset: 0; z-index: 400; background: var(--paper); overflow: auto; font-family: var(--sans); color: var(--ink); }
          .qd-print-bar { position: sticky; top: 0; z-index: 2; display: flex; gap: 10px; align-items: center; padding: 12px 20px; background: var(--paper-2); border-bottom: 1.5px solid var(--line); }
          .qd-print-bar .grow { flex: 1 1 auto; }
          .qd-print-sheet { max-width: 820px; margin: 0 auto; padding: 32px 44px 80px; }
          .qd-print-sheet h1 { font-family: var(--serif); font-size: 26px; margin: 0 0 4px; }
          @media print {
            @page { size: A4 portrait; margin: 14mm; }
            html, body { background: #fff !important; height: auto !important; overflow: visible !important; }
            #root { display: none !important; }
            .qd-print-portal { position: static !important; inset: auto !important; overflow: visible !important; height: auto !important; background: #fff !important; }
            .qd-print-bar { display: none !important; }
            .qd-print-sheet { max-width: none; margin: 0; padding: 0; }
            .qd-print-portal * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          }
        `}</style>
        <div className="qd-print-bar">
          <strong style={{ fontFamily: 'var(--serif)', fontSize: 15 }}>Печать · {title}</strong>
          <span className="grow" />
          <button className="mmm-btn terra" onClick={() => window.print()}>⎙ Сохранить в PDF</button>
          <button className="mmm-btn ghost" onClick={onClose}>Закрыть</button>
        </div>
        <div className="qd-print-sheet">
          <p className="mmm-eyebrow" style={{ margin: 0 }}>Мастерская математического мышления</p>
          <h1>{title}</h1>
          {hint && <p className="mmm-body" style={{ margin: '0 0 18px', color: 'var(--ink-mute)' }}>{hint}</p>}
          {children}
        </div>
      </div>,
      document.body
    );
  }

  const th = { textAlign: 'left', padding: '8px 10px', fontFamily: 'var(--sans)', fontWeight: 700, fontSize: 12, background: 'var(--paper-2)', borderBottom: '2px solid var(--line)' };
  const td = { padding: '8px 10px', fontSize: 12.5, lineHeight: 1.45, borderBottom: '1px solid var(--line-soft)', verticalAlign: 'top' };

  function CriteriaTable({ critLabel, rows }) {
    return (
      <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--line-soft)' }}>
        <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse' }}>
          <thead><tr>
            <th style={th}>{critLabel}</th><th style={th}>1 балл</th><th style={th}>2 балла</th><th style={th}>3 балла</th>
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={{ ...td, fontFamily: 'var(--serif)', fontWeight: 600 }}>{r[0]}</td>
                <td style={{ ...td, color: 'var(--ink-soft)' }}>{r[1]}</td>
                <td style={{ ...td, color: 'var(--ink-soft)' }}>{r[2]}</td>
                <td style={{ ...td }}>{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function BlankSheet({ cols, rows = 14 }) {
    const cell = { border: '1px solid #aaa', padding: '8px 10px', fontSize: 12 };
    return (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr>{cols.map((c, i) => <th key={i} style={{ ...cell, background: '#f1eee6', textAlign: i < 2 ? 'left' : 'center' }}>{c}</th>)}</tr></thead>
        <tbody>
          {Array.from({ length: rows }, (_, i) => (
            <tr key={i}>{cols.map((c, ci) => <td key={ci} style={{ ...cell, height: 26, textAlign: ci === 0 ? 'center' : 'left' }}>{ci === 0 ? i + 1 : ''}</td>)}</tr>
          ))}
        </tbody>
      </table>
    );
  }

  // ── Инструмент 1: финальное эссе ──────────────────────────────
  function EssayInstrument({ onHome }) {
    const [print, setPrint] = qS(false);
    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--pad-lg)' }}>
        <BackBtn onHome={onHome} />
        <header>
          <p className="mmm-eyebrow">Итоговая диагностика · качественный инструмент</p>
          <h1 className="mmm-h1">Финальное эссе «Моя любимая задача»</h1>
          <p className="mmm-lead">
            В конце года ученик письменно (в 1 классе — устно) называет запомнившуюся задачу, объясняет выбор и
            рассказывает, как её решал. Даёт доступ к рефлексивному компоненту мышления (К5), который не выявляется тестом.
          </p>
        </header>
        <div style={{ padding: '12px 16px', background: '#f5e8d8', borderRadius: 8, border: '1px solid var(--terra-soft)' }}>
          <p className="mmm-body" style={{ margin: 0, fontSize: 13 }}>
            <b>Диагностический маркер:</b> если ребёнок выбирает нерешённую задачу или задачу, в которой ошибся, —
            это признак высокого рефлексивного уровня.
          </p>
        </div>
        <CriteriaTable critLabel="Параметр (шкала 1–3)" rows={ESSAY_CRITERIA} />
        <p className="mmm-body" style={{ fontSize: 12.5, color: 'var(--ink-mute)', margin: 0 }}>
          Максимум — 9 баллов (3 параметра × 3). Интерпретация: 3–4 — низкий уровень рефлексии; 5–7 — средний; 8–9 — высокий.
          Балл не суммируется с ДТМ, а используется как дополнительный качественный показатель индивидуальной траектории.
        </p>
        <div><button className="mmm-btn terra" onClick={() => setPrint(true)}>⎙ Распечатать бланк оценки</button></div>
        {print && (
          <PrintArea title="Финальное эссе «Моя любимая задача» — бланк оценки" hint="Шкала 1–3 по каждому параметру; Σ — сумма (максимум 9)." onClose={() => setPrint(false)}>
            <BlankSheet cols={['№', 'Фамилия, имя', 'Осознанность', 'Процесс', 'Позиция', 'Σ']} />
          </PrintArea>
        )}
      </div>
    );
  }

  // ── Инструмент 2: портфолио ───────────────────────────────────
  function PortfolioInstrument({ onHome }) {
    const [print, setPrint] = qS(false);
    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--pad-lg)' }}>
        <BackBtn onHome={onHome} />
        <header>
          <p className="mmm-eyebrow">Текущий мониторинг · качественный инструмент</p>
          <h1 className="mmm-h1">Портфолио учебных достижений</h1>
          <p className="mmm-lead">
            Ведётся каждым учеником весь год; педагог оценивает его дважды (в середине и в конце года), фиксируя динамику.
            Вместе с картой наблюдения и сигнальной карточкой образует комплект текущего мониторинга.
          </p>
        </header>
        <div>
          <p className="mmm-eyebrow" style={{ margin: '0 0 6px' }}>Четыре типа материалов</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PORTFOLIO_MATERIALS.map((m, i) => <span key={i} className="mmm-tag">{m}</span>)}
          </div>
        </div>
        <CriteriaTable critLabel="Критерий (шкала 1–3)" rows={PORTFOLIO_CRITERIA} />
        <p className="mmm-body" style={{ fontSize: 12.5, color: 'var(--ink-mute)', margin: 0 }}>
          Максимум — 12 баллов (4 критерия × 3). Две оценки за год показывают прогресс по параметрам, которые
          не сводятся к итоговому баллу теста.
        </p>
        <div><button className="mmm-btn terra" onClick={() => setPrint(true)}>⎙ Распечатать бланк оценки</button></div>
        {print && (
          <PrintArea title="Портфолио учебных достижений — бланк оценки" hint="Шкала 1–3 по каждому критерию; Σ — сумма (максимум 12). Оценивается дважды в год." onClose={() => setPrint(false)}>
            <BlankSheet cols={['№', 'Фамилия, имя', 'Полнота', 'Глубина', 'Рост', 'Рефлексия', 'Σ']} />
          </PrintArea>
        )}
      </div>
    );
  }

  window.MMM_QUAL_DIAG = { EssayInstrument, PortfolioInstrument };
})();
