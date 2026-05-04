#!/usr/bin/env node
// Validate workbench.html data objects against the kernel schema.
// Reads index.html (or workbench.html legacy), extracts SCHEDULE/ACTIVITIES/DAYS via vm,
// runs structural checks, and prints a clean report.
//
// Exit code: 0 = clean, 1 = at least one error, 2 = parse failure.
//
// Usage:
//   node tools/validate.mjs
//   node tools/validate.mjs --file path/to/file.html

import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');

const argFile = process.argv.includes('--file')
  ? process.argv[process.argv.indexOf('--file') + 1]
  : null;

const candidates = argFile
  ? [argFile]
  : [resolve(repoRoot, 'index.html'), resolve(repoRoot, 'workbench.html')];

// Pick the first file that exists AND contains the data markers (so a thin
// redirect index.html doesn't get selected over the real workbench).
const file = candidates.find(p => {
  if (!existsSync(p)) return false;
  const head = readFileSync(p, 'utf8');
  return head.includes('const SCHEDULE');
});
if (!file) {
  console.error('No workbench file with SCHEDULE found. Looked for:', candidates.join(', '));
  process.exit(2);
}

const src = readFileSync(file, 'utf8');

function extractObject(name) {
  const re = new RegExp(`(?:^|\\n)\\s*const\\s+${name}\\s*=\\s*`, 'm');
  const start = src.search(re);
  if (start < 0) throw new Error(`not found: const ${name}`);
  const after = src.slice(start).replace(re, '');
  let depth = 0, i = 0, inStr = null, esc = false;
  for (; i < after.length; i++) {
    const c = after[i];
    if (esc) { esc = false; continue; }
    if (inStr) {
      if (c === '\\') { esc = true; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '{' || c === '[') depth++;
    else if (c === '}' || c === ']') {
      depth--;
      if (depth === 0) { i++; break; }
    }
  }
  return after.slice(0, i);
}

const ctx = vm.createContext({});
let SCHEDULE, ACTIVITIES, DAYS, KIND_LEGEND, TRACK_LEGEND;
try {
  vm.runInContext(`globalThis.SCHEDULE = ${extractObject('SCHEDULE')};`, ctx);
  vm.runInContext(`globalThis.ACTIVITIES = ${extractObject('ACTIVITIES')};`, ctx);
  vm.runInContext(`globalThis.DAYS = ${extractObject('DAYS')};`, ctx);
  vm.runInContext(`globalThis.KIND_LEGEND = ${extractObject('KIND_LEGEND')};`, ctx);
  vm.runInContext(`globalThis.TRACK_LEGEND = ${extractObject('TRACK_LEGEND')};`, ctx);
  ({ SCHEDULE, ACTIVITIES, DAYS, KIND_LEGEND, TRACK_LEGEND } = ctx);
} catch (e) {
  console.error('PARSE FAILURE:', e.message);
  process.exit(2);
}

const VALID_KINDS = new Set(KIND_LEGEND.map(k => k.kind));
const VALID_TRACKS = new Set(TRACK_LEGEND.map(t => t.track));
const VALID_STATUS = new Set(['ready', 'draft', 'stub']);
const VALID_ACTIVITY_STATUS = new Set(['built', 'partial']);

const errors = [];
const warnings = [];
const err = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

// --- SCHEDULE ---
const codesInSchedule = new Set();
SCHEDULE.weeks.forEach((week, wi) => {
  if (!week.tag || !week.label) err(`SCHEDULE.weeks[${wi}] missing tag/label`);
  week.days.forEach((day, di) => {
    if (!['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(day.name)) {
      err(`SCHEDULE.weeks[${wi}].days[${di}].name='${day.name}' not in Mon/Tue/Wed/Thu/Fri`);
    }
    ['am', 'pm'].forEach(half => {
      (day[half] || []).forEach((b, bi) => {
        const loc = `SCHEDULE.weeks[${wi}].days[${di}].${half}[${bi}]`;
        if (b.groupLabel) {
          if (Object.keys(b).length > 1) {
            warn(`${loc} phase marker has extra fields: ${Object.keys(b).filter(k => k !== 'groupLabel').join(', ')}`);
          }
          return;
        }
        if (!b.label) err(`${loc} missing label`);
        if (!b.kind) err(`${loc} missing kind`);
        else if (!VALID_KINDS.has(b.kind)) err(`${loc} kind='${b.kind}' not in KIND_LEGEND`);
        if (b.track && !VALID_TRACKS.has(b.track)) {
          err(`${loc} track='${b.track}' not in TRACK_LEGEND`);
        }
        if (b.kind === 'track' && !b.track) {
          err(`${loc} kind='track' but no track field`);
        }
        if (b.code) {
          if (codesInSchedule.has(b.code)) {
            err(`${loc} duplicate code '${b.code}'`);
          }
          codesInSchedule.add(b.code);
        }
        if (b.slide) {
          if (!VALID_STATUS.has(b.slide.status)) {
            err(`${loc}.slide.status='${b.slide.status}' not in ${[...VALID_STATUS]}`);
          }
          // Track blocks defer to ACTIVITIES.slideStatus via code lookup. A
          // slide on a track block would be silently ignored by the renderer.
          if (b.kind === 'track' && b.code) {
            err(`${loc} track block has both code='${b.code}' and slide — ambiguous (renderer uses ACTIVITIES.slideStatus). Drop the slide.`);
          }
        }
      });
    });
  });
});

// --- ACTIVITIES ---
const codesInActivities = new Set();
ACTIVITIES.forEach((a, i) => {
  const loc = `ACTIVITIES[${i}]`;
  if (!a.code) err(`${loc} missing code`);
  else {
    if (codesInActivities.has(a.code)) err(`${loc} duplicate code '${a.code}'`);
    codesInActivities.add(a.code);
  }
  if (!VALID_TRACKS.has(a.track)) err(`${loc} track='${a.track}' not in TRACK_LEGEND`);
  if (!a.name) err(`${loc} missing name`);
  if (!a.when) err(`${loc} missing when`);
  if (!VALID_ACTIVITY_STATUS.has(a.status)) {
    err(`${loc} status='${a.status}' not in built/partial`);
  }
  if (!a.shape) err(`${loc} missing shape`);
  if (!a.wireframe || !a.wireframe.viewBox || !a.wireframe.zones) {
    err(`${loc} missing or malformed wireframe`);
  }
});

// --- Cross-references ---
codesInSchedule.forEach(code => {
  if (!codesInActivities.has(code)) {
    err(`SCHEDULE references code '${code}' but no ACTIVITIES entry has it`);
  }
});
codesInActivities.forEach(code => {
  if (!codesInSchedule.has(code)) {
    warn(`ACTIVITIES has code '${code}' but no SCHEDULE block references it`);
  }
});

// --- DAYS ---
const seenDays = new Set();
DAYS.forEach((d, i) => {
  const loc = `DAYS[${i}]`;
  if (!Number.isInteger(d.weekIdx) || d.weekIdx < 0) err(`${loc} weekIdx invalid`);
  if (!Number.isInteger(d.dayIdx) || d.dayIdx < 0 || d.dayIdx > 4) err(`${loc} dayIdx must be 0-4`);
  if (!d.theme) err(`${loc} missing theme`);
  if (!d.lead) err(`${loc} missing lead`);
  if (!d.takeaway) err(`${loc} missing takeaway`);
  const k = `${d.weekIdx}-${d.dayIdx}`;
  if (seenDays.has(k)) err(`${loc} duplicate (weekIdx=${d.weekIdx}, dayIdx=${d.dayIdx})`);
  seenDays.add(k);
});

// --- Report ---
const total = errors.length + warnings.length;
console.log(`Validating ${file}`);
console.log(`SCHEDULE: ${SCHEDULE.weeks.length} weeks, ${codesInSchedule.size} coded blocks`);
console.log(`ACTIVITIES: ${ACTIVITIES.length} entries`);
console.log(`DAYS: ${DAYS.length} entries`);
console.log('');
if (errors.length) {
  console.log(`✗ ${errors.length} error(s):`);
  for (const e of errors) console.log(`  - ${e}`);
}
if (warnings.length) {
  console.log(`! ${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  - ${w}`);
}
if (!total) {
  console.log('✓ Clean — no errors or warnings.');
}
process.exit(errors.length ? 1 : 0);
