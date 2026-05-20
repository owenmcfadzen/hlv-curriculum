#!/usr/bin/env node
// tools/sync-slide-manifest.mjs
// Copy the slide-deck manifest from the PRIVATE companion repo into this
// PUBLIC repo so the workbench (served as a static site) can fetch it at
// runtime.
//
// Layout assumed (the two repos live as siblings on disk):
//
//   ~/Documents/Projects/Active/
//     ├── hlv-Workbench/              (this repo, public)
//     │   └── data/slide-decks.json   (destination; written by this script)
//     └── hlv-workbench-private/      (companion repo, private)
//         └── data/slide-decks.json   (source of truth)
//
// Override the source path via SLIDE_MANIFEST_SOURCE if your layout differs.
//
// Usage:
//   node tools/sync-slide-manifest.mjs
//   SLIDE_MANIFEST_SOURCE=/path/to/slide-decks.json node tools/sync-slide-manifest.mjs
//
// Exit codes: 0 OK · 1 source missing or unreadable · 2 destination write failed.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const defaultSource = resolve(repoRoot, '..', 'hlv-workbench-private', 'data', 'slide-decks.json');
const source = process.env.SLIDE_MANIFEST_SOURCE || defaultSource;
const dest = resolve(repoRoot, 'data', 'slide-decks.json');

if (!existsSync(source)) {
  console.error(`[sync-slide-manifest] source not found: ${source}`);
  console.error(`Set SLIDE_MANIFEST_SOURCE to the private repo's slide-decks.json if it lives elsewhere.`);
  process.exit(1);
}

let raw;
try {
  raw = readFileSync(source, 'utf8');
  JSON.parse(raw); // validate
} catch (err) {
  console.error(`[sync-slide-manifest] could not read or parse source as JSON:`, err.message);
  process.exit(1);
}

try {
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, raw, 'utf8');
} catch (err) {
  console.error(`[sync-slide-manifest] write failed:`, err.message);
  process.exit(2);
}

const parsed = JSON.parse(raw);
const count = Array.isArray(parsed?.decks) ? parsed.decks.length : 0;
console.log(`[sync-slide-manifest] copied ${count} deck${count === 1 ? '' : 's'}`);
console.log(`  source: ${source}`);
console.log(`  dest:   ${dest}`);
