/* ═══════════════════════════════════════════════════════════════════════
   views.jsx · Studio — Two-Week grid, Day detail, Session detail, Inspector
   ═══════════════════════════════════════════════════════════════════════ */
const { Ic, Avatar, fmt, fmtShort, dur, trackStyle, pad, buildSlides, D } = window.StudioUI;

const TODAY = 6; // pretend "today" is Day 6 (Tue, Week 2) for the now-line + accents

/* Lane packing for concurrent sessions (alumni 2-up, Week-2 specialty 3-up).
   Builds clusters of transitively-overlapping blocks, assigns each the leftmost
   free lane, and reports the cluster's max concurrency so callers can size columns.
   Returns Map<id, {lane, lanes}>. Singletons get {lane:0, lanes:1} → render full-width. */
function packLanes(items) {
  const sorted = [...items].sort((a, b) => a.start - b.start || a.end - b.end);
  const out = new Map();
  let i = 0;
  while (i < sorted.length) {
    let clusterEnd = sorted[i].end;
    const cluster = [sorted[i]];
    let j = i + 1;
    while (j < sorted.length && sorted[j].start < clusterEnd) {
      clusterEnd = Math.max(clusterEnd, sorted[j].end);
      cluster.push(sorted[j]);
      j++;
    }
    const laneEnds = [];
    for (const b of cluster) {
      let p = laneEnds.findIndex(e => e <= b.start);
      if (p === -1) { p = laneEnds.length; laneEnds.push(b.end); }
      else laneEnds[p] = b.end;
      out.set(b.id, { lane: p, lanes: 0 });
    }
    for (const b of cluster) out.get(b.id).lanes = laneEnds.length;
    i = j;
  }
  return out;
}

/* Inline left/right for a lane, staying inside the same insets a full-width block
   uses (so split blocks align edge-to-edge with stacked single blocks — no spill).
   leftBase/rightBase are the px insets of the un-split block; gap separates lanes. */
function laneStyle(ln, leftBase, rightBase, gap) {
  if (!ln || ln.lanes <= 1) return null;
  const { lane, lanes } = ln;
  const g = gap / 2;
  const span = `(100% - ${leftBase + rightBase}px)`;
  const left = `calc(${leftBase}px + ${lane} * ${span} / ${lanes}${lane > 0 ? ` + ${g}px` : ""})`;
  const right = `calc(${rightBase}px + ${lanes - 1 - lane} * ${span} / ${lanes}${lane < lanes - 1 ? ` + ${g}px` : ""})`;
  return { left, right, width: "auto" };
}

/* aspect tag chips (read-only, used across views) */
function AspectTags({ aspects, sm }) {
  if (!aspects || !aspects.length) return null;
  return (
    <span className={"asp-tags" + (sm ? " sm" : "")}>
      {aspects.map(k => {
        const a = D.ASPECTS[k]; const AIc = Ic[a.icon];
        return <span className="asp-tag" key={k} style={{ color: a.color, borderColor: a.color }}><AIc width="11" height="11" />{a.label}</span>;
      })}
    </span>
  );
}

/* specialty-stream badge (Product / Business / Market) — P/B/M in blue shades */
function GroupBadge({ group, withLabel }) {
  const g = D.GROUPS_META && D.GROUPS_META[group];
  if (!g) return null;
  return (
    <span className="grp-badge" style={{ background: g.color }} title={g.label}>
      {g.letter}{withLabel ? <span className="gb-label">{g.label}</span> : null}
    </span>
  );
}

/* ═══════════════ TWO-WEEK / ONE-WEEK PLAN ═══════════════ */
function PlanView({ hourPx, onSelect, selId, match, filtering, mode, weekIdx }) {
  const oneWeek = mode === "week";
  const days = oneWeek ? D.DAYS.filter(d => d.wk === weekIdx + 1) : D.DAYS;
  const headTop = oneWeek ? 0 : 30;
  const ppm = hourPx / 60;
  const startH = Math.floor(D.DAY_START / 60);
  const endH = Math.ceil(D.DAY_END / 60);
  const totalH = (D.DAY_END - D.DAY_START) * ppm;
  const hours = [];
  for (let h = startH; h <= endH; h++) hours.push(h);
  const now = 11 * 60 + 35;
  const nowY = (now - D.DAY_START) * ppm;

  return (
    <div className={"grid" + (oneWeek ? " week" : "")}>
      {!oneWeek && <>
        <div className="corner"></div>
        {days.map(d => (
          <div key={"wk" + d.i} className={"wk-cell " + (d.wk === 1 ? "w1" : "w2")}
               style={{ visibility: (d.i === 0 || d.i === 5) ? "visible" : "hidden" }}>
            {d.i === 0 ? "Week 01 \u00b7 Discover" : d.i === 5 ? "Week 02 \u00b7 Build \u2192 Demo" : "\u00a0"}
          </div>
        ))}
      </>}
      <div className="corner" style={{ top: headTop }}></div>
      {days.map(d => (
        <div key={"day" + d.i} className={"day-cell" + (d.i === TODAY ? " today" : "")} style={{ top: headTop }}>
          <span className="dow">{d.dow}</span>
          <span className="dt">{d.date}</span>
          {d.evening && <span className="evdot" title={d.evening}></span>}
        </div>
      ))}

      <div className="gutter" style={{ height: totalH }}>
        {hours.map(h => (
          <span key={h} className="hr" style={{ top: (h * 60 - D.DAY_START) * ppm }}>{fmtShort(h * 60)}</span>
        ))}
      </div>
      {days.map(d => {
        const blocks = D.SESSIONS.filter(s => s.day === d.i);
        const lanes = packLanes(blocks);
        return (
          <div key={"lane" + d.i} className={"lane" + (!oneWeek && d.i === 5 ? " wkend-gap" : "")} style={{ height: totalH }}>
            {hours.map(h => (
              <React.Fragment key={h}>
                <span className="hrline" style={{ top: (h * 60 - D.DAY_START) * ppm }}></span>
                <span className="hrline half" style={{ top: (h * 60 + 30 - D.DAY_START) * ppm }}></span>
              </React.Fragment>
            ))}
            {d.i === TODAY && <span className="nowline" style={{ top: nowY }}></span>}
            {blocks.map(s => {
              const top = (s.start - D.DAY_START) * ppm;
              const h = (s.end - s.start) * ppm;
              const tiny = h < 42;
              const ok = match(s);
              const lead = s.aspects[0] ? D.ASPECTS[s.aspects[0]] : null;
              const ln = lanes.get(s.id);
              const split = laneStyle(ln, 5, 5, 6);
              return (
                <div key={s.id}
                     className={"block" + (s.track === "ops" ? " ops-blk" : "") + (tiny ? " tiny" : "") + (split ? " split" : "") + (selId === s.id ? " sel" : "") + (filtering && !ok ? " dim" : "") + (filtering && ok ? " hit" : "")}
                     style={{ top: top + 1, height: h - 2, ...trackStyle(s.track), ...(split || {}), ...(filtering && ok && lead ? { "--hit": lead.color } : {}) }}
                     onClick={() => onSelect(s)}>
                  <div className="bt">{s.group && D.GROUPS_META[s.group] && <GroupBadge group={s.group} />}{s.title}</div>
                  <div className="bm">{fmtShort(s.start)}&ndash;{fmtShort(s.end)}{s.room && s.track !== "ops" ? " \u00b7 " + s.room : ""}</div>
                  {s.aspects.length > 0 && !tiny && (
                    <div className="b-asp">{s.aspects.map(k => <span key={k} className="ba-dot" style={{ background: D.ASPECTS[k].color }} title={D.ASPECTS[k].label}></span>)}</div>
                  )}
                  {s.deck && !tiny && <span className="deckdot" title={s.deck.slides ? s.deck.slides + " slides" : "Has a deck"}></span>}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════ DAY DETAIL (proportional timeline) ═══════════════ */
function DayView({ onSelect, selId, match, filtering, dayI, setDayI }) {
  const d = D.DAYS[dayI];
  const blocks = D.SESSIONS.filter(s => s.day === dayI).sort((a, b) => a.start - b.start);
  const dayLanes = packLanes(blocks);
  const PPM = 1.7;
  const tlStart = Math.floor(blocks[0].start / 60) * 60;
  const tlEnd = Math.ceil(blocks[blocks.length - 1].end / 60) * 60;
  const tlHeight = (tlEnd - tlStart) * PPM;
  const hours = [];
  for (let h = tlStart / 60; h <= tlEnd / 60; h++) hours.push(h);
  return (
    <div className="dayview">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <button className="tbtn icon" onClick={() => setDayI(Math.max(0, dayI - 1))}><Ic.chevL /></button>
        <button className="tbtn icon" onClick={() => setDayI(Math.min(9, dayI + 1))}><Ic.chevR /></button>
        <div className="dh" style={{ margin: 0 }}>
          <span className="big">{d.dow}</span>
          <span className="sub">{d.date} &middot; Week {d.wk} &middot; Day {dayI + 1}</span>
        </div>
      </div>
      <div className="dsub">
        {blocks.length} blocks scheduled, {fmt(blocks[0].start)} to {fmt(blocks[blocks.length - 1].end)}.
        {d.evening ? ` Evening: ${d.evening}.` : " No evening event."}
      </div>
      <div className="dtl" style={{ height: tlHeight }}>
        <div className="dtl-gutter">
          {hours.map(h => (
            <span key={h} className="dtl-hr" style={{ top: (h * 60 - tlStart) * PPM }}>{fmtShort(h * 60)}</span>
          ))}
        </div>
        <div className="dtl-track">
          {hours.map(h => (
            <React.Fragment key={h}>
              <span className="dtl-line" style={{ top: (h * 60 - tlStart) * PPM }}></span>
              <span className="dtl-line half" style={{ top: (h * 60 + 30 - tlStart) * PPM }}></span>
            </React.Fragment>
          ))}
          {blocks.map(s => {
            const t = D.TRACKS[s.track];
            const top = (s.start - tlStart) * PPM;
            const h = (s.end - s.start) * PPM;
            const ln = dayLanes.get(s.id);
            const split = laneStyle(ln, 18, 0, 8);
            const compact = h < 58 || split;
            const mini = h < 30;
            const ok = match(s);
            return (
              <div className={"dtl-card" + (s.track === "ops" ? " ops" : "") + (compact ? " compact" : "") + (split ? " split" : "") + (filtering && !ok ? " dim" : "")}
                   key={s.id} style={{ top, height: h - 4, ...trackStyle(s.track), ...(split || {}) }} onClick={() => onSelect(s)}>
                <div className="tc-top">
                  <span className="tc-ttl">{s.group && D.GROUPS_META[s.group] && <GroupBadge group={s.group} />}{s.title}</span>
                  {!mini && <span className="tc-right">
                    <span className="tc-time">{fmt(s.start)} &ndash; {fmt(s.end)} &middot; {dur(s.start, s.end)}</span>
                  </span>}
                </div>
                {!compact && (
                  <div className="tc-meta">
                    <span className="mi" style={{ color: t.ink, fontWeight: 600 }}>{t.label}</span>
                    {s.room && <span className="mi"><Ic.pin width="13" height="13" />{s.room}</span>}
                    {s.deck && <span className="mi" style={{ color: t.ink, fontWeight: 600 }}><Ic.deckIc width="13" height="13" />{s.deck.slides ? s.deck.slides + " slides" : "Deck"}</span>}
                    {s.aspects.map(k => { const a = D.ASPECTS[k]; const AIc = Ic[a.icon];
                      return <span className="mi" key={k} style={{ color: a.color, fontWeight: 600 }}><AIc width="13" height="13" />{a.label}</span>; })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ SESSION DETAIL (the event "page" a facilitator runs from) ═══════ */
function SessionDetail({ s, onBack, onOpenDay }) {
  const t = D.TRACKS[s.track];
  const d = D.DAYS[s.day];
  const slides = s.deck ? buildSlides(s) : null;
  return (
    <div className="sd">
      <div className="sd-top">
        <button className="back" onClick={onBack}><Ic.chevL width="16" height="16" />Back to plan</button>
        <span className="sd-chip" style={{ borderColor: t.accent, color: t.ink }}><span className="d" style={{ background: t.accent }}></span>{t.label}</span>
        <AspectTags aspects={s.aspects} />
      </div>
      <h1 className="sd-title">{s.title}</h1>
      <div className="sd-meta">
        <button className="sd-when" onClick={() => onOpenDay(s.day)}><Ic.cal width="15" height="15" />{d.dow}, {d.date}</button>
        <span><Ic.clock width="15" height="15" />{fmt(s.start)} &ndash; {fmt(s.end)} &middot; {dur(s.start, s.end)}</span>
        <span><Ic.pin width="15" height="15" />{s.room}</span>
        <span><Ic.grp width="15" height="15" />{s.group === "All" ? "All teams" : s.group}</span>
      </div>

      <div className="sd-grid">
        <div className="sd-main">
          {slides ? <DeckViewer slides={slides} track={s.track} status={s.deck.status} deck={s.deck} />
            : <div className="sd-nodeck"><span className="asterisk" style={{ "--ast": "48px" }}><i></i></span><p>No deck attached to this session yet.</p></div>}
        </div>
        <aside className="sd-side">
          {s.note && (
            <div className="sd-card">
              <div className="sd-card-h">Facilitator note</div>
              <p className="sd-note">{s.note}</p>
            </div>
          )}
          {s.micro && (
            <div className="sd-card">
              <div className="sd-card-h">Run of show <span className="ct">&middot; {s.micro.length} steps</span></div>
              <div className="micro">
                {s.micro.map((mr, i) => {
                  const sm = mr.t.split(":"), em = mr.end.split(":");
                  const sMin = +sm[0] * 60 + +sm[1], eMin = +em[0] * 60 + +em[1];
                  return (
                    <div className="mrow" key={i}>
                      <div className="mt">{fmt(sMin)}<span className="dur">{eMin - sMin} min</span></div>
                      <div className="ml">{mr.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="sd-card">
            <div className="sd-card-h">Printouts &amp; assets</div>
            {s.assets ? (
              <div className="assets">
                {s.assets.map((a, i) => { const AIc = Ic[a.k] || Ic.pdf;
                  return (
                    <button className="asset" key={i}>
                      <span className="asset-ic" style={{ borderColor: t.accent, color: t.ink }}><AIc width="16" height="16" /></span>
                      <span className="asset-t">{a.t}</span>
                      <span className="asset-k mono">{a.k}</span>
                      <Ic.download width="15" height="15" />
                    </button>
                  );
                })}
              </div>
            ) : <p className="sd-empty">No printouts for this session.</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* turn a deck record into an embeddable src: local HTML decks load directly,
   Google Slides links become their /embed form so the real slides render inline */
function deckEmbedSrc(deck) {
  if (!deck || !deck.url) return null;
  if (deck.isLocal) return deck.url;
  const m = deck.url.match(/\/presentation\/d\/([A-Za-z0-9_-]+)/);
  if (m) return `https://docs.google.com/presentation/d/${m[1]}/embed?start=false&loop=false&rm=minimal`;
  return deck.url;
}

/* session deck \u2014 embeds the real deck; falls back to the outline scaffold only
   when a session has a deck record but no embeddable URL */
function DeckViewer({ slides, track, status, deck }) {
  const t = D.TRACKS[track];
  const openPdf = () => { if (deck && deck.pdfUrl) window.open(deck.pdfUrl, "_blank"); };
  const embed = deckEmbedSrc(deck);
  const frameRef = React.useRef(null);
  const [notes, setNotes] = React.useState(null);
  const [noteIdx, setNoteIdx] = React.useState(0);
  const [full, setFull] = React.useState(false);

  // open the embedded deck full-bleed, resuming at the slide currently shown
  const fullSrc = embed ? (deck && deck.isLocal ? embed + "#" + (noteIdx + 1) : embed) : null;
  React.useEffect(() => {
    if (!full) return;
    const onKey = (e) => { if (e.key === "Escape") setFull(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [full]);

  // local HTML decks carry positional speaker notes + a slidechange event;
  // read them out of the (same-origin) iframe and sync the panel to the deck
  const onFrameLoad = () => {
    if (!deck || !deck.isLocal) return;
    try {
      const doc = frameRef.current.contentDocument;
      const tag = doc.getElementById("speaker-notes");
      const arr = tag ? JSON.parse(tag.textContent) : null;
      setNotes(Array.isArray(arr) && arr.length ? arr : null);
      const stage = doc.querySelector("deck-stage");
      const cur = doc.querySelector(".current");
      const n = cur ? parseInt(cur.textContent, 10) : NaN;
      setNoteIdx(isNaN(n) ? 0 : n - 1);
      if (stage) stage.addEventListener("slidechange", (e) => {
        if (e.detail && typeof e.detail.index === "number") setNoteIdx(e.detail.index);
      });
    } catch (err) { setNotes(null); }
  };

  return (
    <div className="dv">
      <div className="dv-head">
        <span className="sec-label" style={{ margin: 0 }}>Session deck <span className="ct">&middot; {status}</span></span>
        <span className="grow"></span>
        {deck && deck.pdfUrl && <button className="tbtn" onClick={openPdf}><Ic.pdf width="15" height="15" />PDF</button>}
        {embed && <button className="tbtn" onClick={() => setFull(true)} style={{ background: t.accent, color: "#fff", borderColor: t.accent }}><Ic.present width="15" height="15" />Open full</button>}
      </div>
      {embed
        ? <>
            <div className="dv-embed"><iframe ref={frameRef} src={embed} title="Session deck" allowFullScreen loading="lazy" onLoad={onFrameLoad}></iframe></div>
            {notes && notes[noteIdx] && (
              <div className="dv-notes" style={{ "--blk-accent": t.accent }}>
                <div className="dvn-h">
                  <span className="dvn-label">Presenter notes</span>
                  <span className="dvn-time mono">Slide {noteIdx + 1} / {notes.length}</span>
                </div>
                <p className="dvn-body">{notes[noteIdx]}</p>
              </div>
            )}
          </>
        : <OutlineViewer slides={slides} track={track} />}
      {full && fullSrc && (
        <div className="dv-full" role="dialog" aria-label="Deck fullscreen">
          <button className="dv-full-x" onClick={() => setFull(false)} aria-label="Close fullscreen">
            <Ic.close width="18" height="18" />Close<span className="dv-full-esc mono">Esc</span>
          </button>
          <iframe className="dv-full-frame" src={fullSrc} title="Session deck (full)" allowFullScreen></iframe>
        </div>
      )}
    </div>
  );
}

function OutlineViewer({ slides, track }) {
  const [idx, setIdx] = React.useState(0);
  const t = D.TRACKS[track];
  const total = slides.length;
  const go = (n) => setIdx(Math.max(0, Math.min(total - 1, n)));
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "ArrowRight") go(idx + 1); if (e.key === "ArrowLeft") go(idx - 1); };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [idx, total]);
  const sl = slides[idx];
  return (
    <>
      <SlideFrame slide={sl} track={track} n={idx + 1} total={total} />
      <div className="dv-nav">
        <button className="tbtn icon" onClick={() => go(idx - 1)} disabled={idx === 0}><Ic.chevL /></button>
        <span className="dv-count mono">{pad(idx + 1)} / {pad(total)}</span>
        <button className="tbtn icon" onClick={() => go(idx + 1)} disabled={idx === total - 1}><Ic.chevR /></button>
        <span className="grow"></span>
        <span className="dv-kbd mono">&larr; &rarr; to step</span>
      </div>
      <div className="dv-notes" style={{ "--blk-accent": t.accent }}>
        <div className="dvn-h">
          <span className="dvn-label">Presenter notes</span>
          {sl.time && <span className="dvn-time mono">{sl.time}{sl.mins ? " \u00b7 " + sl.mins + " min" : ""}</span>}
        </div>
        <p className="dvn-body">{sl.note}</p>
      </div>
      <div className="dv-strip">
        {slides.map((s, i) => (
          <button key={i} className={"dv-thumb" + (i === idx ? " on" : "")} onClick={() => go(i)}
                  style={i === idx ? { borderColor: t.accent } : {}}>
            <span className="dvt-tick" style={{ background: t.accent }}></span>
            <span className="dvt-t">{s.title}</span>
            <span className="dvt-n mono">{pad(i + 1)}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function SlideFrame({ slide, track, n, total }) {
  const t = D.TRACKS[track];
  return (
    <div className="slide" style={{ "--accent": t.accent, "--tint": t.tint, "--ink": t.ink }}>
      <span className="sl-corner" aria-hidden="true">
        {[0,1,2,3,4,5,6,7,8].map(i => <i key={i} style={{ background: (i % 3 === 0 || i === 4) ? t.accent : t.tint }}></i>)}
      </span>
      {slide.kind === "title" && (
        <div className="sl-body title">
          <span className="sl-kick mono" style={{ color: t.ink }}>{slide.sub}</span>
          <h2 className="sl-h">{slide.title}</h2>
          <span className="sl-rule" style={{ background: t.accent }}></span>
        </div>
      )}
      {slide.kind === "content" && (
        <div className="sl-body content">
          <span className="sl-kick mono" style={{ color: t.ink }}>{slide.time ? slide.time : t.label}</span>
          <h2 className="sl-h">{slide.title}</h2>
        </div>
      )}
      {slide.kind === "close" && (
        <div className="sl-body title">
          <span className="sl-kick mono" style={{ color: t.ink }}>Wrap</span>
          <h2 className="sl-h">{slide.title}</h2>
          <span className="sl-rule" style={{ background: t.accent }}></span>
        </div>
      )}
      <span className="sl-pg mono">{pad(n)} / {pad(total)}</span>
    </div>
  );
}

/* ═══════════════ INSPECTOR (quick peek + edit) ═══════════════ */
function Inspector({ s, rev, apiOn, editToken, onSave, onClose, onOpenSession }) {
  const open = !!s;
  return (
    <>
      <div className={"scrim" + (open ? " on" : "")} onClick={onClose}></div>
      <aside className={"inspector" + (open ? " open" : "")} style={s ? trackStyle(s.track) : {}}>
        {s ? <InspectorBody key={s.sid} s={s} apiOn={apiOn} editToken={editToken} onSave={onSave} onClose={onClose} onOpenSession={onOpenSession} /> :
          <div className="insp-empty">
            <div className="motif"><span className="asterisk" style={{ "--ast": "72px" }}><i></i></span></div>
            <p>Select a session for its breakdown, deck, and materials.</p>
          </div>}
      </aside>
    </>
  );
}

function InspectorBody({ s, apiOn, editToken, onSave, onClose, onOpenSession }) {
  const [editing, setEditing] = React.useState(false);
  const t = D.TRACKS[s.track];
  const d = D.DAYS[s.day];
  if (editing) return <EditForm s={s} apiOn={apiOn} editToken={editToken} onSave={onSave} onClose={onClose} onDone={() => setEditing(false)} />;
  return (
    <>
      <div className="insp-head">
        <span className="seam"></span>
        <button className="insp-close" onClick={onClose}><Ic.close width="16" height="16" /></button>
        <span className="insp-chip"><span className="d"></span>{t.label}</span>
        <div className="ttl">{s.title}</div>
        <div className="when"><Ic.clock width="15" height="15" />{fmt(s.start)} &ndash; {fmt(s.end)} &middot; {dur(s.start, s.end)}</div>
        <button className="insp-edit" onClick={() => setEditing(true)} title={apiOn ? "Edit this session" : "Editing needs the local server"}>
          <Ic.gear width="14" height="14" />Edit
        </button>
      </div>
      <div className="insp-body">
        <div className="kvrow"><span className="kk">Day</span><span className="vv">{d.dow}, {d.date} &middot; Week {d.wk}</span></div>
        <div className="kvrow"><span className="kk">Room</span><span className="vv"><Ic.pin width="14" height="14" />{s.room}</span></div>
        {s.group && D.GROUPS_META[s.group] && (
          <div className="kvrow"><span className="kk">Stream</span><span className="vv"><GroupBadge group={s.group} withLabel /></span></div>
        )}
        {s.aspects.length > 0 && (
          <div className="kvrow"><span className="kk">Aspects</span><span className="vv"><AspectTags aspects={s.aspects} sm /></span></div>
        )}

        <button className="open-session" style={{ background: t.accent }} onClick={() => onOpenSession(s)}>
          <Ic.present width="16" height="16" />Open session {s.deck ? (s.deck.slides ? "\u00b7 " + s.deck.slides + " slides" : "\u00b7 deck") : "detail"}<span className="grow"></span><Ic.chevR width="15" height="15" />
        </button>

        {s.note && (<><div className="sec-label">Note</div><div className="note">{s.note}</div></>)}

        {s.micro && (
          <>
            <div className="sec-label">Run of show <span className="ct">&middot; {s.micro.length} steps</span></div>
            <div className="micro">
              {s.micro.map((mr, i) => {
                const sm = mr.t.split(":"), em = mr.end.split(":");
                const sMin = +sm[0] * 60 + +sm[1], eMin = +em[0] * 60 + +em[1];
                return (
                  <div className="mrow" key={i}>
                    <div className="mt">{fmt(sMin)}<span className="dur">{eMin - sMin} min</span></div>
                    <div className="ml">{mr.label}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {s.assets && (
          <>
            <div className="sec-label">Printouts</div>
            <div className="assets compact">
              {s.assets.map((a, i) => { const AIc = Ic[a.k] || Ic.pdf;
                return a.url
                  ? <a className="asset-mini mono" key={i} href={a.url} target="_blank" rel="noreferrer"><AIc width="13" height="13" />{a.t}</a>
                  : <span className="asset-mini mono" key={i}><AIc width="13" height="13" />{a.t}</span>; })}
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* ═══════════════ EDIT FORM ═══════════════
   In-app editor for a session. Edits a local draft, POSTs a patch via onSave
   (→ /api/overrides, keyed by stable sid). File uploads stream to /api/upload
   and append to the session's printouts (assets). */
const minToHM = (mins) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
const hmToMin = (hm) => { const [h, m] = String(hm || "").split(":").map(Number); return (h || 0) * 60 + (m || 0); };

function EditForm({ s, apiOn, editToken, onSave, onClose, onDone }) {
  const [f, setF] = React.useState({
    title: s.title || "",
    day: s.day,
    start: minToHM(s.start),
    end: minToHM(s.end),
    track: s.track,
    group: s.group || "All",
    kind: s.kind || "",
    room: s.room || "",
    note: s.note || "",
    aspects: [...(s.aspects || [])],
    assets: [...(s.assets || [])],
  });
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const fileRef = React.useRef(null);

  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }));
  const toggleAspect = (k) => setF(prev => ({
    ...prev,
    aspects: prev.aspects.includes(k) ? prev.aspects.filter(a => a !== k) : [...prev.aspects, k],
  }));
  const removeAsset = (i) => setF(prev => ({ ...prev, assets: prev.assets.filter((_, j) => j !== i) }));

  const upload = async (file) => {
    setErr(null); setBusy(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream", "X-Filename": file.name, ...(editToken ? { "X-Edit-Token": editToken } : {}) },
        body: file,
      });
      if (res.status === 401) throw new Error("Editing key rejected — set it in the top-bar Admin menu.");
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || "upload failed");
      setF(prev => ({ ...prev, assets: [...prev.assets, { t: file.name, k: "pdf", url: j.url }] }));
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const save = async () => {
    setErr(null);
    const start = hmToMin(f.start), end = hmToMin(f.end);
    if (end <= start) { setErr("End time must be after start time."); return; }
    const patch = {
      title: f.title.trim(),
      day: Number(f.day),
      start, end,
      track: f.track,
      group: f.group,
      kind: f.kind,
      room: f.room.trim(),
      note: f.note.trim() || null,
      aspects: f.aspects,
      assets: f.assets.length ? f.assets : null,
    };
    setBusy(true);
    try {
      await onSave(s.sid, patch);
      onDone();
    } catch (e) {
      setErr(e && e.status === 401
        ? "Editing key rejected — set it in the top-bar Admin menu."
        : "Save failed — is the write server reachable?");
      setBusy(false);
    }
  };

  return (
    <>
      <div className="insp-head">
        <span className="seam"></span>
        <button className="insp-close" onClick={onDone}><Ic.close width="16" height="16" /></button>
        <span className="insp-chip"><span className="d"></span>Editing</span>
        <div className="ttl">{f.title || "Untitled session"}</div>
        <div className="when"><Ic.clock width="15" height="15" />{fmt(hmToMin(f.start))} &ndash; {fmt(hmToMin(f.end))}</div>
      </div>
      <div className="insp-body ef">
        {!apiOn && <div className="ef-warn">Editing needs the local write server. Changes won&rsquo;t persist on the static host.</div>}

        <label className="ef-field"><span className="ef-lbl">Title</span>
          <input className="ef-in" value={f.title} onChange={e => set("title", e.target.value)} />
        </label>

        <div className="ef-row">
          <label className="ef-field"><span className="ef-lbl">Day</span>
            <select className="ef-in" value={f.day} onChange={e => set("day", e.target.value)}>
              {D.DAYS.map(d => <option key={d.i} value={d.i}>{d.dow} {d.date} &middot; Wk {d.wk}</option>)}
            </select>
          </label>
          <label className="ef-field sm"><span className="ef-lbl">Start</span>
            <input className="ef-in" type="time" value={f.start} onChange={e => set("start", e.target.value)} />
          </label>
          <label className="ef-field sm"><span className="ef-lbl">End</span>
            <input className="ef-in" type="time" value={f.end} onChange={e => set("end", e.target.value)} />
          </label>
        </div>

        <div className="ef-row">
          <label className="ef-field"><span className="ef-lbl">Track</span>
            <select className="ef-in" value={f.track} onChange={e => set("track", e.target.value)}>
              {Object.keys(D.TRACKS).map(k => <option key={k} value={k}>{D.TRACKS[k].label}</option>)}
            </select>
          </label>
          <label className="ef-field"><span className="ef-lbl">Stream</span>
            <select className="ef-in" value={f.group} onChange={e => set("group", e.target.value)}>
              {D.GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>
        </div>

        <div className="ef-row">
          <label className="ef-field"><span className="ef-lbl">Format</span>
            <input className="ef-in" value={f.kind} onChange={e => set("kind", e.target.value)} placeholder="module, work, panel…" />
          </label>
          <label className="ef-field"><span className="ef-lbl">Room</span>
            <input className="ef-in" value={f.room} onChange={e => set("room", e.target.value)} />
          </label>
        </div>

        <div className="ef-lbl">Aspects</div>
        <div className="ef-aspects">
          {Object.keys(D.ASPECTS).map(k => {
            const a = D.ASPECTS[k]; const on = f.aspects.includes(k); const AIc = Ic[a.icon];
            return (
              <button key={k} className={"ef-asp" + (on ? " on" : "")} onClick={() => toggleAspect(k)}
                style={on ? { color: "#fff", background: a.color, borderColor: a.color } : { color: a.color, borderColor: a.color }}>
                <AIc width="12" height="12" />{a.label}
              </button>
            );
          })}
        </div>

        <label className="ef-field"><span className="ef-lbl">Note</span>
          <textarea className="ef-in ef-area" rows="3" value={f.note} onChange={e => set("note", e.target.value)} />
        </label>

        <div className="ef-lbl">Files &amp; printouts</div>
        {f.assets.length > 0 && (
          <div className="ef-assets">
            {f.assets.map((a, i) => { const AIc = Ic[a.k] || Ic.pdf;
              return (
                <span className="ef-asset mono" key={i}>
                  <AIc width="13" height="13" />
                  {a.url ? <a href={a.url} target="_blank" rel="noreferrer">{a.t}</a> : a.t}
                  <button className="ef-asset-x" onClick={() => removeAsset(i)} title="Remove"><Ic.close width="12" height="12" /></button>
                </span>
              ); })}
          </div>
        )}
        <input ref={fileRef} type="file" className="ef-file" onChange={e => { const file = e.target.files[0]; if (file) upload(file); }} />
        <button className="ef-upload" disabled={busy || !apiOn} onClick={() => fileRef.current && fileRef.current.click()}>
          <Ic.plus width="14" height="14" />{busy ? "Uploading…" : "Add file"}
        </button>

        {err && <div className="ef-err">{err}</div>}

        <div className="ef-actions">
          <button className="ef-cancel" onClick={onDone} disabled={busy}>Cancel</button>
          <button className="ef-save" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save changes"}</button>
        </div>
      </div>
    </>
  );
}

window.StudioViews = { PlanView, DayView, SessionDetail, Inspector };
