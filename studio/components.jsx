/* ═══════════════════════════════════════════════════════════════════════
   components.jsx · Studio — shell, views, inspector
   ═══════════════════════════════════════════════════════════════════════ */
const { useState, useEffect, useRef } = React;
const D = window.STUDIO;

/* ── ICONS — square, explicit stroke (no currentColor surprises) ───────── */
const Ic = {
  grid:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  cal:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}><rect x="3" y="4" width="18" height="17"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>,
  day:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}><rect x="4" y="3" width="16" height="18"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>,
  people:(p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}><rect x="3" y="4" width="7" height="7"/><path d="M14 5h7M14 9h7M3 15h18M3 19h18"/></svg>,
  box:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}><rect x="3" y="3" width="18" height="18"/><path d="M3 9h18M9 9v12"/></svg>,
  layers:(p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></svg>,
  inbox: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}><path d="M3 13l3-8h12l3 8v6H3v-6z"/><path d="M3 13h5l1.5 3h5L16 13h5"/></svg>,
  gear:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}><rect x="9" y="9" width="6" height="6"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>,
  clock: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="3" y="3" width="18" height="18"/><path d="M12 7v5l3 2"/></svg>,
  pin:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="5" y="3" width="14" height="14"/><path d="M12 17v4"/></svg>,
  grp:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="3" y="8" width="6" height="6"/><rect x="15" y="8" width="6" height="6"/><rect x="9" y="3" width="6" height="6"/></svg>,
  search:(p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>,
  today: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="3" y="4" width="18" height="17"/><path d="M3 9h18M12 13v4M10 15h4"/></svg>,
  close: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>,
  plus:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  chevL: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M15 5l-7 7 7 7"/></svg>,
  chevR: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M9 5l7 7-7 7"/></svg>,
  filter:(p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M3 5h18M6 12h12M10 19h4"/></svg>,
  present:(p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="3" y="4" width="18" height="13"/><path d="M12 17v4M8 21h8"/></svg>,
  // aspect glyphs
  guest:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="8" y="3" width="8" height="10"/><path d="M12 13v5M7 21h10"/></svg>,
  sponsor:(p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="5" y="4" width="14" height="13"/><path d="M9 17l-2 4 5-2 5 2-2-4"/></svg>,
  alumni: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M3 8l9-4 9 4-9 4-9-4z"/><path d="M7 11v5c0 1 2.5 2 5 2s5-1 5-2v-5"/></svg>,
  family: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="4" y="9" width="6" height="6"/><rect x="14" y="9" width="6" height="6"/><path d="M4 20h16"/></svg>,
  offsite:(p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="4" y="4" width="16" height="16"/><path d="M8 4v16M16 4v16M4 9h4M16 9h4M4 15h4M16 15h4"/></svg>,
  // asset kinds
  pdf:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>,
  print:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="6" y="3" width="12" height="6"/><rect x="4" y="9" width="16" height="7"/><rect x="7" y="14" width="10" height="6"/></svg>,
  sheet:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="4" y="3" width="16" height="18"/><path d="M4 9h16M4 15h16M12 3v18"/></svg>,
  deckIc: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="3" y="4" width="18" height="12"/><path d="M12 16v4M8 20h8"/></svg>,
  download:(p)=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M12 3v12M7 11l5 5 5-5M5 21h14"/></svg>,
};

/* ── helpers ───────────────────────────────────────────────────────────── */
const pad = (n) => String(n).padStart(2, "0");
const fmt = (mins) => { const h = Math.floor(mins/60), mm = mins%60; const ap = h<12?"AM":"PM"; const h12 = ((h+11)%12)+1; return `${h12}:${pad(mm)} ${ap}`; };
const fmtShort = (mins) => { const h = Math.floor(mins/60), mm = mins%60; const h12 = ((h+11)%12)+1; return mm===0 ? `${h12} ${h<12?"am":"pm"}` : `${h12}:${pad(mm)}`; };
const dur = (s,e) => { const d = e-s; return d>=60 ? `${Math.floor(d/60)}h${d%60?` ${d%60}m`:""}` : `${d}m`; };
const trackStyle = (tk) => { const t = D.TRACKS[tk]; return { "--blk-tint": t.tint, "--blk-accent": t.accent, "--blk-ink": t.ink }; };

function Avatar({ id, size }) {
  const p = D.PEOPLE[id]; const tk = p ? p.track : "ops";
  const cls = "avatar" + (size ? " " + size : "");
  return <span className={cls} style={{ background: D.TRACKS[tk].accent }} title={p ? p.name : id}>{id === "GUEST" ? "G" : id}</span>;
}

/* ═══════════════ LEFT RAIL ═══════════════ */
function Rail({ view, setView }) {
  const items = [
    { k: "week", ic: Ic.cal,  tip: "One-Week" },
    { k: "plan", ic: Ic.grid, tip: "Two-Week" },
    { k: "day",  ic: Ic.day,  tip: "Day Detail" },
  ];
  return (
    <nav className="rail">
      <div className="mark"><span className="asterisk" style={{ "--ast": "30px" }}><i></i></span></div>
      {items.map(it => (
        <div key={it.k} className={"nav-i" + (view === it.k || (view === "session" && it.k === "week") ? " on" : "")} onClick={() => setView(it.k)}>
          <it.ic /><span className="tip">{it.tip}</span>
        </div>
      ))}
      <div style={{ height: 14 }}></div>
      <div className="nav-i" onClick={() => window.open("workbench.html", "_blank")}>
        <Ic.layers /><span className="tip">Curriculum workbench</span>
      </div>
      <div className="spacer"></div>
      <div className="nav-i"><Ic.gear /><span className="tip">Settings</span></div>
      <div className="avatar lg" style={{ background: D.TRACKS.core.accent, marginTop: 6 }}>OM</div>
    </nav>
  );
}

/* ═══════════════ TOPBAR ═══════════════ */
function Topbar({ view, setView }) {
  const tabs = [
    { k: "week", label: "1 week",  ic: Ic.cal },
    { k: "plan", label: "2 weeks", ic: Ic.grid },
    { k: "day",  label: "Day",     ic: Ic.day },
  ];
  const active = view === "session" ? "week" : view;
  return (
    <header className="topbar">
      <div className="prog">
        <div className="ttl">HLV Summer School &rsquo;26 &middot; Lisbon</div>
        <div className="meta">Jul 6 &ndash; 17 &middot; 10 days &middot; Product &middot; Business &middot; Market</div>
      </div>
      <div className="grow"></div>
      <div className="switch">
        {tabs.map(t => (
          <button key={t.k} className={active === t.k ? "on" : ""} onClick={() => setView(t.k)}>
            <t.ic />{t.label}
          </button>
        ))}
      </div>
      <button className="tbtn" onClick={() => window.open("https://prd-lab-production.up.railway.app/", "_blank")}><Ic.deckIc />PRD Lab</button>
      <button className="tbtn" onClick={() => window.open("workbench.html", "_blank")}><Ic.layers />Workbench</button>
    </header>
  );
}

/* ═══════════════ WEEK SWITCH (one-week view header) ═══════════════ */
function WeekSwitch({ weekIdx, setWeekIdx }) {
  const weeks = [
    { t: "Week 1", s: "Discover", c: "var(--GRNd)" },
    { t: "Week 2", s: "Build \u2192 Demo", c: "var(--BLUd)" },
  ];
  return (
    <div className="weekswitch">
      <button className="wk-arrow" onClick={() => setWeekIdx(Math.max(0, weekIdx - 1))} disabled={weekIdx === 0}><Ic.chevL width="16" height="16" /></button>
      <div className="wk-seg">
        {weeks.map((w, i) => (
          <button key={i} className={"wk-opt" + (i === weekIdx ? " on" : "")} onClick={() => setWeekIdx(i)}
                  style={i === weekIdx ? { "--wkc": w.c } : {}}>
            <span className="wk-t">{w.t}</span>
            <span className="wk-s">{w.s}</span>
          </button>
        ))}
      </div>
      <button className="wk-arrow" onClick={() => setWeekIdx(Math.min(1, weekIdx + 1))} disabled={weekIdx === 1}><Ic.chevR width="16" height="16" /></button>
    </div>
  );
}

/* ═══════════════ FILTER BAR — tracks + aspects (replaces People) ═══════ */
function FilterBar({ filters, toggle, clear, counts }) {
  const trackOrder = ["core", "build", "talks", "ops", "evening"];
  const aspectOrder = Object.keys(D.ASPECTS);
  const any = filters.tracks.size > 0 || filters.aspects.size > 0;
  return (
    <div className="filterbar">
      <span className="fb-label"><Ic.filter width="14" height="14" />Tracks</span>
      <div className="fb-group">
        {trackOrder.map(k => {
          const on = filters.tracks.has(k);
          return (
            <button key={k} className={"chip" + (on ? " on" : "")} onClick={() => toggle("tracks", k)}
                    style={on ? { borderColor: D.TRACKS[k].accent, background: D.TRACKS[k].tint, color: D.TRACKS[k].ink } : {}}>
              <span className="cdot" style={{ background: D.TRACKS[k].accent }}></span>{D.TRACKS[k].label}
            </button>
          );
        })}
      </div>
      <span className="fb-div"></span>
      <span className="fb-label">Aspects</span>
      <div className="fb-group">
        {aspectOrder.map(k => {
          const a = D.ASPECTS[k]; const on = filters.aspects.has(k); const AIc = Ic[a.icon];
          return (
            <button key={k} className={"chip" + (on ? " on" : "")} onClick={() => toggle("aspects", k)}
                    style={on ? { borderColor: a.color, background: a.color, color: "#fff" } : { color: a.color, borderColor: a.color }}>
              <AIc width="13" height="13" />{a.label}
            </button>
          );
        })}
      </div>
      <span className="grow"></span>
      {any
        ? <button className="fb-clear" onClick={clear}>Showing {counts.shown} of {counts.total} &middot; Clear</button>
        : <span className="hint">Filter to isolate an aspect &middot; click a block to open it</span>}
    </div>
  );
}

/* ═══════════════ SLIDE-DECK BUILDER — run-of-show → embedded slides ════ */
// Each session's deck = title slide + one slide per run-of-show step + recap.
// Presenter notes are derived so a facilitator can orient and present.
const CUES = [
  "Set the frame, then hand to the room. Watch the clock.",
  "Keep this tight. One example, then move on.",
  "Let a team answer before you do. Silence is fine.",
  "Demonstrate live if you can. Talk less, show more.",
  "Call on a quieter team here. Spread the air time.",
  "Land the takeaway out loud before the next beat.",
];
function buildSlides(s) {
  const slides = [];
  slides.push({ kind: "title", title: s.title, sub: D.TRACKS[s.track].label + " \u00b7 " + s.room,
    note: (s.note ? s.note + " " : "") + "Open with why this matters for their venture, not the theory. Name the outcome they'll leave with." });
  const steps = s.micro || [];
  if (steps.length) {
    steps.forEach((mr, i) => {
      const sm = mr.t.split(":"), em = mr.end.split(":");
      const mins = (+em[0] * 60 + +em[1]) - (+sm[0] * 60 + +sm[1]);
      slides.push({ kind: "content", title: mr.label, time: fmt(+sm[0]*60 + +sm[1]), mins,
        who: mr.who || null, note: `About ${mins} min. ${CUES[i % CUES.length]}` });
    });
  } else {
    ["Why this matters", "The core idea", "Walk a real example", "Your turn \u2014 teams work", "Share back"].forEach((tt, i) => {
      slides.push({ kind: "content", title: tt, note: CUES[i % CUES.length] });
    });
  }
  slides.push({ kind: "close", title: "Recap & what's next", note: "Restate the one thing to remember. Point to the next session and any homework." });
  return slides;
}

window.StudioUI = { Ic, Avatar, Rail, Topbar, FilterBar, WeekSwitch, buildSlides, fmt, fmtShort, dur, trackStyle, pad, D };
