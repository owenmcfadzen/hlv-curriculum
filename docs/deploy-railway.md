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

2. **No env vars required.** Railway sets `PORT` automatically; the server
   listens on whatever it's given. The static site has no secrets.

3. **First deploy completes.** Open the Railway-assigned URL — should land on
   the workbench. The sync pill will read `⚠ server off` (expected — sync
   sidecar is local-only, see below).

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
