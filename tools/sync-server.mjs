#!/usr/bin/env node
// Small companion server for the workbench's git-sync feature.
//
// Endpoints:
//   GET  /sync-status   → { ok, unpushed }
//   POST /sync-push     → { ok, pushed, output }   or { ok: false, error }
//
// Runs alongside the static server (python http.server on :4173). The browser
// fetches across origins so CORS is wide-open — this is localhost-only.
//
// Usage:
//   node tools/sync-server.mjs            # default port 4174
//   PORT=4180 node tools/sync-server.mjs  # custom port

import http from 'node:http';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const exec = promisify(execFile);
const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const PORT = parseInt(process.env.PORT || '4174', 10);

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, code, body) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

async function getSyncStatus() {
  try {
    const { stdout } = await exec('git', ['rev-list', '--count', '@{u}..HEAD'], { cwd: repoRoot });
    const unpushed = parseInt(stdout.trim(), 10);
    if (!Number.isFinite(unpushed)) throw new Error(`unparseable count: ${stdout}`);
    let branch = 'HEAD';
    try {
      const { stdout: b } = await exec('git', ['symbolic-ref', '--short', 'HEAD'], { cwd: repoRoot });
      branch = b.trim();
    } catch (_) { /* detached */ }
    return { ok: true, unpushed, branch };
  } catch (err) {
    return { ok: false, error: String(err.stderr || err.message || err) };
  }
}

async function doPush() {
  try {
    const before = await getSyncStatus();
    const pushed = before.ok ? before.unpushed : 0;
    const { stdout, stderr } = await exec('git', ['push', 'origin', 'HEAD'], { cwd: repoRoot });
    return { ok: true, pushed, output: (stdout + stderr).trim() };
  } catch (err) {
    return { ok: false, error: String(err.stderr || err.stdout || err.message || err) };
  }
}

const server = http.createServer(async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }

  if (req.method === 'GET' && req.url === '/sync-status') {
    return sendJson(res, 200, await getSyncStatus());
  }
  if (req.method === 'POST' && req.url === '/sync-push') {
    const result = await doPush();
    return sendJson(res, result.ok ? 200 : 500, result);
  }

  sendJson(res, 404, { ok: false, error: 'not found' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`sync-server listening at http://127.0.0.1:${PORT}`);
  console.log(`  GET  /sync-status`);
  console.log(`  POST /sync-push`);
  console.log(`repoRoot: ${repoRoot}`);
});
