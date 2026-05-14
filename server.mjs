#!/usr/bin/env node
// Static file server for the HLV curriculum workbench.
//
// Used in two places:
//   - Railway (production): `npm start` invokes this, listens on $PORT
//   - Local dev (optional): `node server.mjs` listens on 8080 — but you can
//     keep using `python3 -m http.server 4173` if that's already your flow
//
// Sync feature (tools/sync-server.mjs) is local-only — it shells out to
// git, which only makes sense on a host with a working tree + push creds.
// On Railway the sync pill will show "⚠ server off"; that's correct
// degradation, the workbench is still fully usable as a viewer.

import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, dirname, extname, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || '8080', 10);
const HOST = process.env.HOST || '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md':   'text/markdown; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico':  'image/x-icon',
  '.txt':  'text/plain; charset=utf-8',
};

function safePath(urlPath) {
  // Strip query string, decode, normalize. Reject anything that escapes the root.
  const raw = decodeURIComponent(urlPath.split('?')[0]);
  const clean = normalize(raw).replace(/^[/\\]+/, '');
  if (clean.split(sep).some(p => p === '..')) return null;
  return clean;
}

const server = http.createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.end('method not allowed');
    return;
  }
  const clean = safePath(req.url || '/');
  if (clean === null) {
    res.statusCode = 400;
    res.end('bad path');
    return;
  }
  let target = clean === '' ? 'index.html' : clean;
  let full = resolve(here, target);
  try {
    let st = await stat(full);
    if (st.isDirectory()) {
      full = resolve(full, 'index.html');
      st = await stat(full);
    }
    const data = await readFile(full);
    const mime = MIME[extname(full).toLowerCase()] || 'application/octet-stream';
    res.setHeader('Content-Type', mime);
    res.setHeader('Content-Length', data.length);
    // Static assets get short cache, HTML never cached (so workbench updates are immediate).
    if (mime.startsWith('text/html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=300');
    }
    if (req.method === 'HEAD') { res.end(); return; }
    res.end(data);
  } catch (err) {
    if (err.code === 'ENOENT' || err.code === 'EISDIR') {
      res.statusCode = 404;
      res.end('not found');
      return;
    }
    res.statusCode = 500;
    res.end('server error');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`hlv-workbench listening on http://${HOST}:${PORT}`);
  console.log(`repoRoot: ${here}`);
});
