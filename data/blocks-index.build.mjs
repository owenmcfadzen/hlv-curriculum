import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const src = readFileSync('/Users/owen/Documents/Projects/Active/hlv-Workbench/workbench.html', 'utf8');

function extract(name) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*`, 'm');
  const start = src.search(re);
  if (start < 0) throw new Error(`not found: ${name}`);
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

const SCHED = extract('SCHEDULE');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(`globalThis.SCHEDULE = ${SCHED};`, ctx);
const SCHEDULE = ctx.SCHEDULE;

const dayNames = ['mon', 'tue', 'wed', 'thu', 'fri'];
const out = [];
SCHEDULE.weeks.forEach((week, wi) => {
  week.days.forEach((day, di) => {
    ['am', 'pm'].forEach(half => {
      (day[half] || []).forEach((b, bi) => {
        if (b.groupLabel) {
          out.push({
            block_id: `w${wi+1}-${dayNames[di]}-${half}-phase-${bi}`,
            type: 'phase_marker',
            week: wi + 1,
            day: dayNames[di],
            half,
            position: bi,
            label: b.groupLabel,
          });
          return;
        }
        const slug = b.label.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .slice(0, 40);
        const entry = {
          block_id: `w${wi+1}-${dayNames[di]}-${half}-${slug}${b.code ? '-' + b.code.toLowerCase() : ''}`,
          type: 'block',
          week: wi + 1,
          day: dayNames[di],
          half,
          position: bi,
          label: b.label,
          kind: b.kind,
          ...(b.code ? { code: b.code } : {}),
          ...(b.track ? { track: b.track } : {}),
          ...(b.sub ? { sub: b.sub } : {}),
          slide_status: b.slide ? b.slide.status : null,
          slide_foundation: b.slide ? b.slide.foundation : null,
          has_slide_content: !!b.slide,
        };
        out.push(entry);
      });
    });
  });
});

const counts = {
  total: out.length,
  blocks: out.filter(e => e.type === 'block').length,
  phase_markers: out.filter(e => e.type === 'phase_marker').length,
  by_status: {},
};
for (const e of out) {
  if (e.type !== 'block') continue;
  const s = e.slide_status || 'missing';
  counts.by_status[s] = (counts.by_status[s] || 0) + 1;
}

const result = { _meta: { generated: '2026-05-01', source: 'workbench.html SCHEDULE' }, counts, blocks: out };
writeFileSync('/Users/owen/Documents/Projects/Active/hlv-Workbench/data/blocks-index.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(counts, null, 2));
