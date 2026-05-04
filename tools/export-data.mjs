#!/usr/bin/env node
// Export embedded data objects from index.html to JSON files in data/.
// Workbench is canonical; JSON exports are derivative — generated on demand
// for AI/tooling consumption. Don't edit the JSON exports directly.
//
// Usage:
//   node tools/export-data.mjs              # writes to ./data/
//   node tools/export-data.mjs --out PATH   # write to custom dir

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const outArgIdx = process.argv.indexOf('--out');
const outDir = outArgIdx >= 0
  ? resolve(process.argv[outArgIdx + 1])
  : resolve(repoRoot, 'data');

const candidates = [
  resolve(repoRoot, 'index.html'),
  resolve(repoRoot, 'workbench.html'),
];
const file = candidates.find(p => {
  if (!existsSync(p)) return false;
  return readFileSync(p, 'utf8').includes('const SCHEDULE');
});
if (!file) {
  console.error('No workbench file found.');
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
const objects = ['SCHEDULE', 'ACTIVITIES', 'DAYS', 'KIND_LEGEND', 'TRACK_LEGEND'];
for (const name of objects) {
  vm.runInContext(`globalThis.${name} = ${extractObject(name)};`, ctx);
}

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const meta = {
  generated: new Date().toISOString().slice(0, 10),
  source: 'index.html',
  note: 'Derived from workbench data objects. Workbench is canonical — do not edit these JSON files directly.',
};

const exports = {
  'schedule.json': { _meta: meta, schedule: ctx.SCHEDULE, kind_legend: ctx.KIND_LEGEND, track_legend: ctx.TRACK_LEGEND },
  'activities.json': { _meta: meta, activities: ctx.ACTIVITIES },
  'days.json': { _meta: meta, days: ctx.DAYS },
};

for (const [name, data] of Object.entries(exports)) {
  const path = resolve(outDir, name);
  writeFileSync(path, JSON.stringify(data, null, 2));
  console.log(`✓ ${path}`);
}
console.log(`\nExported ${Object.keys(exports).length} files to ${outDir}/`);
