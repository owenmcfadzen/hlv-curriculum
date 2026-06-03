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
import { readFile, writeFile, stat, mkdir } from 'node:fs/promises';
import { resolve, dirname, extname, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || '8080', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Persistent overrides store. On Railway: set OVERRIDES_PATH=/data/overrides.json
// and mount a Railway Volume at /data. Locally: defaults to ./overrides.json.
const OVERRIDES_PATH = process.env.OVERRIDES_PATH || resolve(here, 'overrides.json');
// Uploaded session files. On Railway: set UPLOADS_PATH=/data/uploads (volume).
const UPLOADS_DIR = process.env.UPLOADS_PATH || resolve(here, 'uploads');
// Optional shared-password gate for writes. Reads always public.
const EDIT_TOKEN = process.env.EDIT_TOKEN || null;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.jsx':  'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md':   'text/markdown; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico':  'image/x-icon',
  '.txt':  'text/plain; charset=utf-8',
  '.pdf':  'application/pdf',
};

function safePath(urlPath) {
  // Strip query string, decode, normalize. Reject anything that escapes the root.
  const raw = decodeURIComponent(urlPath.split('?')[0]);
  const clean = normalize(raw).replace(/^[/\\]+/, '');
  if (clean.split(sep).some(p => p === '..')) return null;
  return clean;
}

async function readOverrides() {
  try {
    const raw = await readFile(OVERRIDES_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return {};
    throw err;
  }
}

async function writeOverrides(obj) {
  await mkdir(dirname(OVERRIDES_PATH), { recursive: true }).catch(() => {});
  await writeFile(OVERRIDES_PATH, JSON.stringify(obj, null, 2));
}

function setApiCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Edit-Token');
}

async function handleOverridesApi(req, res) {
  setApiCors(res);
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
  if (req.method === 'GET') {
    try {
      const data = await readOverrides();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache');
      res.end(JSON.stringify(data));
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: String(err.message || err) }));
    }
    return;
  }
  if (req.method === 'POST') {
    if (EDIT_TOKEN && req.headers['x-edit-token'] !== EDIT_TOKEN) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'invalid or missing edit token' }));
      return;
    }
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > 1_000_000) { body = ''; res.statusCode = 413; res.end('too large'); req.destroy(); } });
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body || '{}');
        if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
          throw new Error('payload must be a JSON object keyed by block id');
        }
        await writeOverrides(parsed);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: true, blockCount: Object.keys(parsed).length }));
      } catch (err) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, error: String(err.message || err) }));
      }
    });
    return;
  }
  res.statusCode = 405;
  res.end('method not allowed');
}

// Sanitize an upload filename: keep base name, strip path + unsafe chars, prefix a
// short timestamp so re-uploads of the same name don't collide.
function safeUploadName(raw) {
  const base = String(raw || 'file').split(/[\\/]/).pop();
  const cleaned = base.replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^\.+/, '').slice(0, 100) || 'file';
  return `${Date.now().toString(36)}-${cleaned}`;
}

async function handleUploadApi(req, res) {
  setApiCors(res);
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
  if (req.method !== 'POST') { res.statusCode = 405; res.end('method not allowed'); return; }
  if (EDIT_TOKEN && req.headers['x-edit-token'] !== EDIT_TOKEN) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'invalid or missing edit token' }));
    return;
  }
  const name = safeUploadName(req.headers['x-filename']);
  const chunks = [];
  let size = 0, tooBig = false;
  req.on('data', chunk => {
    size += chunk.length;
    if (size > 25_000_000) { tooBig = true; req.destroy(); return; }
    chunks.push(chunk);
  });
  req.on('end', async () => {
    if (tooBig) { res.statusCode = 413; res.end('file too large (25MB max)'); return; }
    try {
      await mkdir(UPLOADS_DIR, { recursive: true }).catch(() => {});
      await writeFile(resolve(UPLOADS_DIR, name), Buffer.concat(chunks));
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true, url: `/uploads/${name}`, name, size }));
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: false, error: String(err.message || err) }));
    }
  });
}

async function serveUpload(req, res, clean) {
  const name = clean.slice('uploads/'.length);
  if (!name || name.includes('/') || name.includes('..')) { res.statusCode = 400; res.end('bad path'); return; }
  try {
    const data = await readFile(resolve(UPLOADS_DIR, name));
    res.setHeader('Content-Type', MIME[extname(name).toLowerCase()] || 'application/octet-stream');
    res.setHeader('Content-Length', data.length);
    res.setHeader('Cache-Control', 'public, max-age=300');
    if (req.method === 'HEAD') { res.end(); return; }
    res.end(data);
  } catch {
    res.statusCode = 404; res.end('not found');
  }
}

const server = http.createServer(async (req, res) => {
  // API routes
  if (req.url && req.url.split('?')[0] === '/api/overrides') {
    return handleOverridesApi(req, res);
  }
  if (req.url && req.url.split('?')[0] === '/api/upload') {
    return handleUploadApi(req, res);
  }

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
  // Uploaded session files live outside the repo root on Railway (a volume) —
  // serve them from UPLOADS_DIR rather than the static root.
  if (clean.startsWith('uploads/')) {
    return serveUpload(req, res, clean);
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
  console.log(`repoRoot:        ${here}`);
  console.log(`OVERRIDES_PATH:  ${OVERRIDES_PATH}`);
  console.log(`EDIT_TOKEN:      ${EDIT_TOKEN ? '(set, writes require X-Edit-Token header)' : '(unset, writes are open)'}`);
});
