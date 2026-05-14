# Deploy to Railway

The workbench is a single HTML file. Railway runs a tiny Node static server
(`server.mjs`) that hands it back, plus any assets in the repo. No database,
no backend state — edits live in browser localStorage.

## What ships

- `server.mjs` — Node static server (Railway runs this via `npm start`)
- `package.json` — `"start": "node server.mjs"`, Node ≥ 20 engine
- `.node-version` — pins Node 22 for Railway / fnm / nvm consistency
- `railway.toml` — explicit build/start config

## First-time setup

1. **New project from this repo.** In Railway: `New Project` →
   `Deploy from GitHub repo` → pick `owenmcfadzen/hlv-curriculum`. Railway
   reads `package.json`, runs `npm install`, then `npm start`.

2. **`PORT` is auto.** Railway sets it; `server.mjs` reads it. Static site
   needs nothing else to come up.

3. **Volume + env vars (needed if you want edits to persist server-side).**

   By default the workbench's Edit form saves only to the visitor's browser
   localStorage. To make edits durable across browsers (and survive
   redeploys), set these in the Railway service:

   a. `Settings → Volumes → New Volume` → mount path `/data`. ~1 GB is
      plenty; the overrides file is tiny JSON.

   b. `Variables` tab → add:
      - `OVERRIDES_PATH=/data/overrides.json` (so the server writes to the
        Volume, not the container's ephemeral filesystem)
      - `EDIT_TOKEN=<some-shared-password>` (any string; treat it like a
        password — anyone with it can edit. Without this var set, writes
        are open to anyone visiting the URL.)

   Trigger a redeploy after adding these. Inspector saves now POST to
   `/api/overrides` and persist in the Volume.

4. **First deploy completes.** Open the Railway-assigned URL — should land on
   the workbench. The sync pill (git status, separate from the save flow)
   will read `⚠ server off` — expected, the git-sync sidecar is local-only.

## Custom domain

In the Railway service: `Settings → Networking → Custom Domain` → add your
domain → Railway gives you a CNAME target. Add the CNAME at your DNS host.
Railway provisions TLS automatically.

## Updates after the first deploy

Railway is watching `main`. Every push triggers a redeploy.

```bash
# from your laptop
git push origin main
# or click the Push button in the workbench (requires sync sidecar running)
```

A redeploy takes ~30s. Workbench HTML is served with `Cache-Control:
no-cache` so the new version shows up immediately on refresh.

## Backups

Two layers, both opt-in:

1. **Manual: Backup button.** In the filter bar (next to Push) there's a
   Backup button. Click → downloads a timestamped JSON file with the full
   current overrides. Stash in iCloud / Dropbox / wherever. Works whether
   the server is up or not (falls back to the local cache).

2. **Automatic: GitHub Action.** `.github/workflows/backup-overrides.yml`
   fetches `/api/overrides` once a day and commits the JSON into
   `data/backups/` on `main`. Opt in by:
     a. Setting a repo secret `BACKUP_URL` = the public overrides URL,
        e.g. `https://hlv-curriculum-production.up.railway.app/api/overrides`
     b. Enabling write permission for Actions:
        Settings → Actions → General → Workflow permissions → Read and write
     c. The workflow shows up under the Actions tab; you can also trigger
        it manually any time.

   Note: each successful snapshot lands a commit on `main`, which triggers
   a Railway redeploy. If that's noisy, change the branch in the workflow
   (or add `data/backups/` to Railway's Watch-Paths-to-ignore).

## How edits actually work in production

Two saves happen when you click Save in the Edit form:

1. **localStorage** (instant). The cache the workbench reads on every boot
   so the view comes up with the last-known state even when offline.
2. **POST `/api/overrides`** (async). The server writes the full overrides
   JSON to `OVERRIDES_PATH`. If `EDIT_TOKEN` is set, the browser must send
   `X-Edit-Token: <token>` matching it. The token is prompted once per
   browser and cached in localStorage at `hlv-vb-edit-token`.

Reads (`GET /api/overrides`) are always open — no token. Same access
level the static HTML already has.

On boot, the workbench:
- Renders immediately from localStorage cache.
- Async-fetches `/api/overrides`. If the server has content, it wins —
  the in-memory overrides get replaced and the calendar re-renders.
- If the server is unreachable (404 / network error / no Volume yet),
  the localStorage cache stands. Saves fall back to localStorage-only;
  a toast tells you the server save failed.

## What does NOT deploy to Railway

`tools/sync-server.mjs` (the git-push sidecar) is intentionally local-only:

- It shells out to `git rev-list` / `git push`. The Railway container has no
  working tree and no push credentials.
- Exposing `/sync-push` on a public URL would be a security hole.

The workbench detects this gracefully — the sync pill shows
`⚠ server off` on any host that can't reach `http://127.0.0.1:4174`. Click
the pill to retry once the sidecar comes back online (which only happens
when you run `npm run sync` locally).

## Local development

```bash
# Static workbench (serves index.html)
npm start                      # http://127.0.0.1:8080

# Or keep using python if you already have that flow
python3 -m http.server 4173

# Sync sidecar (enables the Push button)
npm run sync                   # http://127.0.0.1:4174

# Validator (run before each commit)
npm run validate
```

## Verifying a Railway deploy

Once deployed, hit these in order from a browser:

1. `https://<your-railway-host>/` → workbench loads, calendar renders.
2. `?view=week&w=1` → one-week view, day columns render.
3. `?view=day&d=w2-tue` → day view, click a block, detail panel opens.

If the page hangs or 404s on assets, check Railway logs for the request
path — likely a CWD or extname mismatch in `server.mjs`.

## Cost

Railway's free / hobby tier covers this easily. The container does almost
nothing: serves one ~250 KB HTML file and a tiny SVG worksheet asset.
Memory < 50 MB, CPU near zero.
