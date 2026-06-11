#!/usr/bin/env node
/* Build `studio/data.generated.js` — a synchronous JS file that assigns
   window.STUDIO with the Studio Planner schema, adapted from the real
   curriculum data exports in data/.

   Run:  node tools/build-studio-data.mjs
   Output: studio/data.generated.js
*/

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const schedule  = JSON.parse(readFileSync(resolve(root, "data/schedule.json"),    "utf8"));
const daysMeta  = JSON.parse(readFileSync(resolve(root, "data/days.json"),         "utf8"));
const activities= JSON.parse(readFileSync(resolve(root, "data/activities.json"),   "utf8"));
let slideDecks;
try { slideDecks = JSON.parse(readFileSync(resolve(root, "data/slide-decks.json"), "utf8")); }
catch { slideDecks = { decks: [] }; }

const KIND_TO_TRACK = {
  welcome: "core", work: "core", module: "core",
  game: "ops",
  rc: "talks", panel: "talks", sponsor: "talks",
  teamteach: "build", pitch: "build", lpp: "build", track: "build",
  social: "evening",
};

const LOCAL_HTML_DECKS = {
  B1: "/decks-html/B1-canvas-lite.html",
  B2: "/decks-html/B2-napkin-economics.html",
  M1: "/decks-html/M1-landscape-map.html",
  M2: "/decks-html/M2-validation-design.html",
  P1: "/decks-html/P1-solution-blueprint.html",
  P2: "/decks-html/P2-product-definition.html",
  P3: "/decks-html/P3-prototype-build.html",
  B3: "/decks-html/B3M3-joint-100-day-plan.html",
  M3: "/decks-html/B3M3-joint-100-day-plan.html",
};

const m = (hhmm) => {
  if (!hhmm) return null;
  const [h, mm] = hhmm.split(":").map(Number);
  return h * 60 + mm;
};
const minToHHMM = (min) => {
  const h = Math.floor(min / 60), mm = min % 60;
  return String(h).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
};

function inferAspects(blk) {
  const out = [];
  if (blk.kind === "sponsor")   out.push("sponsor");
  if (blk.kind === "panel")     out.push("guest");
  if (blk.kind === "rc")        out.push("rc");
  if (blk.kind === "social")    out.push("social");
  if (blk.kind === "pitch")     out.push("pitch");
  return out;
}

const decksByCode = {};
slideDecks.decks.forEach(d => { if (d.code) decksByCode[d.code] = d; });

// Stable per-session key, derived from source block attributes (NOT the editable
// fields), so user edits stored in overrides.json survive a rebuild. Deduped.
const slug = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32);
const usedSids = new Set();
function makeSid(di, half, label) {
  let base = `${di}-${half}-${slug(label) || "x"}`;
  let sid = base, n = 2;
  while (usedSids.has(sid)) sid = `${base}-${n++}`;
  usedSids.add(sid);
  return sid;
}

const SESSIONS = [];
let nextId = 0;
schedule.schedule.weeks.forEach((wk, wkIdx) => {
  wk.days.forEach((day, dayIdx) => {
    const di = wkIdx * 5 + dayIdx;
    ["am", "pm"].forEach(half => {
      const blocks = day[half] || [];
      blocks.forEach(blk => {
        if (!blk.label || blk.groupLabel && !blk.label) return;
        if (!blk.time_start || !blk.time_end) return;
        const start = m(blk.time_start), end = m(blk.time_end);
        if (start == null || end == null || end <= start) return;
        // Alumni sessions run as a parallel cohort (titled "Alumni: …") — give
        // them their own track so they read distinctly and can be filtered.
        const isAlumni = /^Alumni:/i.test(blk.label || "");
        const track = isAlumni ? "alumni" : (KIND_TO_TRACK[blk.kind] || "core");
        const aspects = inferAspects(blk);
        let micro = null;
        if (blk.slide && Array.isArray(blk.slide.students) && blk.slide.students.length) {
          const total = end - start;
          const n = blk.slide.students.length;
          const per = Math.max(2, Math.round(total / n));
          let cursor = start;
          micro = blk.slide.students.map((label, i) => {
            const a = cursor;
            const b = (i === n - 1) ? end : Math.min(end, cursor + per);
            cursor = b;
            return { t: minToHHMM(a), end: minToHHMM(b), label: String(label) };
          });
        }
        let deck = null;
        if (blk.code && decksByCode[blk.code]) {
          const d = decksByCode[blk.code];
          deck = {
            title: d.name || blk.label,
            slides: d.slideCount || 0,
            status: d.status || "draft",
            url: LOCAL_HTML_DECKS[blk.code] || d.url || blk.slides_link_or_embed || null,
            isLocal: !!LOCAL_HTML_DECKS[blk.code],
            pdfUrl: d.pdfUrl || null,
            code: blk.code,
          };
        } else if (blk.slides_link_or_embed) {
          deck = {
            title: blk.label,
            slides: 0,
            status: blk.slide ? blk.slide.status : "draft",
            url: blk.slides_link_or_embed.startsWith("decks-html") ? "/" + blk.slides_link_or_embed : blk.slides_link_or_embed,
            isLocal: blk.slides_link_or_embed.startsWith("/") || blk.slides_link_or_embed.startsWith("decks-html"),
            pdfUrl: null,
            code: null,
          };
        }
        const note = (blk.slide && blk.slide.foundation) || blk.sub || null;
        let assets = null;
        if (blk.slide && Array.isArray(blk.slide.references) && blk.slide.references.length) {
          assets = blk.slide.references.map(r => ({ t: String(r), k: "pdf" }));
        }
        SESSIONS.push({
          id: "s" + (nextId++),
          sid: makeSid(di, half, blk.label),
          day: di,
          start, end,
          track,
          title: blk.label,
          room: blk.room || "",
          facils: blk.facils || [],
          group: blk.track ? (blk.track[0].toUpperCase() + blk.track.slice(1)) : "All",
          kind: blk.kind,
          code: blk.code || null,
          sub: blk.sub || null,
          aspects,
          half, // am | pm
          ...(micro ? { micro } : {}),
          ...(deck ? { deck } : {}),
          ...(note ? { note } : {}),
          ...(assets ? { assets } : {}),
          ...(blk.slide ? {
            facilitatorCue: blk.slide.facilitator || null,
            studentTasks: blk.slide.students || null,
          } : {}),
        });
      });
    });
  });
});

const TRACKS = {
  core:    { label: "Core",     accent: "#0A8C3D", tint: "#E3F6EC", ink: "#0A8C3D" },
  build:   { label: "Studio",   accent: "#0B5FB0", tint: "#E4F0FC", ink: "#0B5FB0" },
  talks:   { label: "Talks",    accent: "#7649C2", tint: "#EFE6FB", ink: "#7649C2" },
  alumni:  { label: "Alumni",   accent: "#0E8C86", tint: "#E1F3F1", ink: "#0B6E69" },
  ops:     { label: "Ops",      accent: "#939393", tint: "#F1F0EE", ink: "#565656" },
  evening: { label: "Evening",  accent: "#C98A00", tint: "#FBF1D6", ink: "#8A6400" },
};

// Week-2 specialty streams share the Studio (blue) identity but are told apart
// by a P/B/M badge in shades of blue — keeps the locked palette, adds legibility.
const GROUPS_META = {
  Product:  { letter: "P", label: "Product",  color: "#0B5FB0" },
  Business: { letter: "B", label: "Business", color: "#2E86E0" },
  Market:   { letter: "M", label: "Market",   color: "#06366A" },
};

const ASPECTS = {
  guest:   { label: "Guest",         color: "#7649C2", icon: "guest" },
  sponsor: { label: "Sponsor",       color: "#0B5FB0", icon: "sponsor" },
  rc:      { label: "Reality Check", color: "#C2342B", icon: "alumni" },
  social:  { label: "Social",        color: "#C98A00", icon: "family" },
  pitch:   { label: "Pitch",         color: "#0A8C3D", icon: "family" },
};

const DAYS = [
  { i: 0, wk: 1, dow: "Mon", date: "Jun 29", evening: null },
  { i: 1, wk: 1, dow: "Tue", date: "Jun 30", evening: null },
  { i: 2, wk: 1, dow: "Wed", date: "Jul 1",  evening: null },
  { i: 3, wk: 1, dow: "Thu", date: "Jul 2",  evening: null },
  { i: 4, wk: 1, dow: "Fri", date: "Jul 3",  evening: null },
  { i: 5, wk: 2, dow: "Mon", date: "Jul 6",  evening: null },
  { i: 6, wk: 2, dow: "Tue", date: "Jul 7",  evening: null },
  { i: 7, wk: 2, dow: "Wed", date: "Jul 8",  evening: null },
  { i: 8, wk: 2, dow: "Thu", date: "Jul 9",  evening: "Final pitches" },
  { i: 9, wk: 2, dow: "Fri", date: "Jul 10", evening: "Reception" },
].map((d, i) => {
  const meta = daysMeta.days[i] || {};
  return { ...d, theme: meta.theme || null, lead: meta.lead || null, takeaway: meta.takeaway || null };
});

const PEOPLE = {
  OM: { name: "Owen McFadzen", role: "Program Lead",  track: "core" },
  ST: { name: "Stacey",         role: "Facilitator",   track: "core" },
};
const GROUPS = ["All", "Product", "Business", "Market"];
const DAY_START = 8 * 60;
const DAY_END   = 19 * 60;

const PAYLOAD = {
  TRACKS, PEOPLE, GROUPS, GROUPS_META, DAYS, SESSIONS,
  DAY_START, DAY_END, ASPECTS,
  ACTIVITIES: activities.activities || [],
};

const out = `/* AUTOGENERATED by tools/build-studio-data.mjs — do not edit by hand.
   Source: data/schedule.json + data/days.json + data/activities.json + data/slide-decks.json */
window.STUDIO = ${JSON.stringify(PAYLOAD, null, 2)};
`;

const target = resolve(root, "studio/data.generated.js");
writeFileSync(target, out);
console.log(`✓ wrote ${target}`);
console.log(`  ${SESSIONS.length} sessions across ${DAYS.length} days`);
const trackCounts = {};
SESSIONS.forEach(s => { trackCounts[s.track] = (trackCounts[s.track] || 0) + 1; });
console.log(`  track distribution:`, trackCounts);
const decks = SESSIONS.filter(s => s.deck).length;
console.log(`  ${decks} sessions have a deck attached`);
