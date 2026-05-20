# HLV Curriculum Repos — Investigation (2026-05-13)

Section 1 — Current State, fed into the curriculum-interface PRD. Investigation only; no proposals.

## Repo relationship

Both repos exist on disk and are mounted in this session.

- **`hlv-Workbench`** — the active source of truth. It is a real git repo on `main` with remote `https://github.com/owenmcfadzen/hlv-curriculum.git`. Last 7 commits walk from "Initial commit — workbench v1" through "Workbench kernel hardening" and "Documentation kernel + schemas + tools" to "Ignore derivative data exports" (HEAD, 4 May). The workbench (`index.html`), the kernel docs (`AGENTS.md`, `ARCHITECTURE.md`, `CLAUDE.md`), the JSON Schema contracts (`schema/`), the validator and exporter (`tools/`), and the source decks (`sources/decks/`) all live here. **This is the canonical repo.**
- **`hlv-Workbench-Private`** — a *content-only sibling*, not a fork. Its `.git/config` has no remote and the HEAD logs file is empty, so it is a local-only working directory in a partially-initialised git state. It carries `PROJECT.md` (HLV-specific facts — Lisbon July 2026, sponsors, the team), `HANDOFF.md`, `prompts/extract-porto.md`, and the gap-analysis artifacts in `data/` (`blocks-index.json`, `blocks-needing-content.md`, `porto-extraction.json`, `porto-mapping.json`). It also mirrors `AGENTS.md` and `ARCHITECTURE.md` so an AI working in either repo has self-contained context.

Notable drift: `hlv-Workbench` *also* now contains `PROJECT.md` and `README.md` in its working tree (dated 8 May, after the last commit). They're untracked/uncommitted but present. The doc says PROJECT.md "lives in the private repo" — in practice both copies exist on disk.

The intended pattern (per `ARCHITECTURE.md` + `PROJECT.md`): public repo holds the *kernel* (renderer, schema, tools, universal docs); private repo holds *project-specific data* (sponsor names, source decks, extraction artifacts, prompts, handoffs). The split is for the eventual Pages URL: visitors should never see internal docs or sponsor info.

## File structure

The workbench is **a single file**: `index.html` (~157 KB, ~3,800 lines). One file, three modes, five inline JS data objects (`SCHEDULE`, `ACTIVITIES`, `DAYS`, `KIND_LEGEND`, `TRACK_LEGEND`). There are no per-day folders, no per-block markdown files, no Astro pages — everything is inline.

Weeks → days → AM/PM → blocks is a JS-object hierarchy inside `<script>`, not a directory tree. `DAYS` is a flat array of 10 entries keyed by `(weekIdx, dayIdx)`. `ACTIVITIES` is a flat array of 9 entries keyed by `code` (P1/P2/P3, B1/B2/B3, M1/M2/M3) and linked from `SCHEDULE` blocks via that code.

Top-level layout (public repo):

```
hlv-Workbench/
├── index.html                  ← canonical workbench (the single-file artifact)
├── AGENTS.md / ARCHITECTURE.md / CLAUDE.md / PROJECT.md / README.md
├── schema/                     ← JSON Schema Draft-07 contracts
│   ├── schedule.schema.json
│   ├── block.schema.json
│   ├── activities.schema.json
│   ├── days.schema.json
│   ├── extraction-entry.schema.json
│   └── mapping-entry.schema.json
├── tools/
│   ├── validate.mjs            ← node CLI that vm-extracts the data objects
│   └── export-data.mjs         ← writes data/{schedule,activities,days}.json
├── data/                       ← derivative JSON exports (gitignored)
└── sources/decks/              ← Porto 2025 PDFs + .txt extracts
```

Private repo adds `data/blocks-index.json`, `data/blocks-needing-content.md`, `data/porto-extraction.json`, `data/porto-mapping.json`, `prompts/extract-porto.md`, `HANDOFF.md`.

## Metadata schema

The full per-shape schema, from `schema/*.schema.json` and confirmed against `data/*.json`:

**SCHEDULE block** (the unit you'll most want to extend): `label` (required), `kind` (required, enum), `sub`, `code` (regex `^[A-Z][0-9]+$`, links to ACTIVITIES), `track` (enum, only when `kind: track`), `slide` (optional object with `status` enum `ready|draft|stub`, `foundation`, `students[]`, `facilitator`, `references[]`). Alternative form: a "phase marker" with only `groupLabel`. The `SCHEDULE` data-object comment also lists two optional/future fields that are not yet in the JSON Schema: `cellSub`, `facilitator`, `alumni`.

**SCHEDULE day**: `name` (Mon–Fri), `am[]`, `pm[]`, `amSub`, `pmSub`.

**SCHEDULE week**: `tag`, `label`, `sub`, `days[]`, optional `band` ({label, kind}).

**ACTIVITY**: `code`, `track`, `name`, `when`, `status` (enum `built|partial`), `slideStatus` (enum `ready|draft|stub` — separate from block.slide.status by design), `shape`, `feeds[]`, `open` (nullable), `note` (nullable), `wireframe` (`{viewBox, zones[], lines[]}` SVG schematic).

**DAY**: `weekIdx` (0–N), `dayIdx` (0–4), `theme`, `lead`, `takeaway`.

**KIND_LEGEND**: 12 kinds — `welcome / work / module / game / rc / panel / sponsor / teamteach / social / pitch / lpp / track`.

**TRACK_LEGEND**: 3 tracks — `product / business / market`. ("GTM" is retired, but legacy worksheet PDFs still read "GTM Track".)

## Content separation

There is **no markdown body and no frontmatter** in the conventional sense. Every field — both metadata and prose — is a JS object property. Block-level prose ("foundation", "students[]", "facilitator", "references[]") lives inside `block.slide`. Activity-level prose ("shape", "feeds[]", "open", "note") lives at the activity root. Day-level prose ("lead", "takeaway") lives on the DAY entry.

Slides as in *Google Slides*: not in the repo. `PROJECT.md` says Owen rebuilds Google Slides from the workbench using `google-slides-mcp` in Claude Desktop — separate pipeline.

Analog assets: the Porto 2025 deck PDFs and `.txt` extracts live in `sources/decks/` (gitignored in public, present locally in both). Worksheet PDFs aren't in this repo at all — only their SVG schematics, encoded as `wireframe.zones[]` on each ACTIVITY entry.

## Rendering stack

Confirmed: **single-file vanilla HTML + inline CSS + inline JS**. No framework. No build step. No Astro. No bundler. Google Fonts via CDN; everything else is inline. The validator (`tools/validate.mjs`) runs in Node via `vm.createContext` — it regex-slices the `const SCHEDULE = …` blocks out of the HTML, evals them, and structurally checks them.

Deployment target named in `HANDOFF.md`: `https://owenmcfadzen.github.io/hlv-curriculum/` (GitHub Pages, serving `index.html` directly). There is no `.github/workflows/` directory and no CI — Pages just serves the file from `main`. The HANDOFF explicitly lists CI/GitHub Actions as "P1 — defer".

## Existing views

Within the one HTML file: **two top-level modes** plus print, six page sections.

Top-bar nav (anchor links): `01 Plan` (overview), `02 Schedule`, `03 Activities`, `04 Layers`, `05 Decisions`, `06 Flow`. A "Page" / "Slide" toggle plus a "Print" button.

- **Page mode** — scrollable single page through the six sections.
- **Slide mode** — full-screen 2D navigation: ← → across sections + days + activities, ↓ to drill into a single block's detail slide (its `slide` object). Triggered by the toggle or `s` key; Esc exits.
- **Print mode** — clean PDF export, strips chrome.

Within Schedule there are also six pill-filters: `All / Product / Business / Market / Facilitators (wip) / Alumni (wip)`. The two `wip` pills are the relevant signal for question 7 below — the chrome exists, the data layer does not.

Three modes total. Owen's earlier framing as "Page / Slide / Print" is correct.

## Stakeholder representation

- **Tracks** — *explicit and structured.* Every track block carries `track: product|business|market`; ACTIVITY entries also carry `track`. Filter pills work.
- **Facilitators** — *implicit only.* The data-comment in `index.html` flags `facilitator` as `(optional, future)` on blocks; no block currently carries it. There is a `slide.facilitator` *prose* field (notes for the runner) — but no facilitator-as-person field. The "Facilitators" pill is marked `wip`. Named people (Stacey, Cate, Luke, Takeshi) appear only in the `flow` section's prose.
- **Alumni** — *implicit only.* Same status: comment says `alumni` is `(optional, future)`, no block carries it, "Alumni" pill is marked `wip`. Cate is described in `PROJECT.md` as "Reviewer + alumni track" but alumni involvement is not in data.
- **Sponsors** — *partially structured.* Sponsor *blocks* exist (`kind: sponsor`) and Week 2 has a `band: { label: "Sponsor access available throughout Week 2", kind: "sponsor" }`. Sponsor *identities* (Sonae for Lisbon) live in `PROJECT.md` prose and one `slide.references` line, not as data.

## Two-week shape summary

Two weeks × 5 days × {AM, PM} = 20 half-days. The block index counts **80 blocks + 3 phase markers = 83 SCHEDULE entries**. Current `slide.status` distribution from `blocks-index.json`: **3 ready, 2 draft, 75 missing/stub**.

Per-day block counts: Wk1 Mon 4/6, Tue 4/6, Wed 5/6, Thu 3/5, Fri 4/4. Wk2 Mon 6/3, Tue 4/5 (incl. 2 phase markers), Wed 4/4 (incl. 1 phase marker), Thu 3/1, Fri 1/4.

Currently `ready`: `w1-thu-am-rc-pitch-speed-dating` (first Reality Check), `w2-tue-pm-team-teach-synthesis-hinge` (the "Team Teach" hinge between Phase 1 and Phase 2), `w2-wed-pm-rc-market-executes` ("Market executes" — async overnight Reality Check). Currently `draft`: `w1-mon-am-welcome`, `w1-mon-pm-sponsor-briefing`.

**Collision points** that already read as load-bearing on a single day:

- **Wk2 Tue** — Phase 1 reconnaissance AM (P1+B1+M1), Team Teach 2pm, Phase 2 build PM (P2+B2+M2). DAYS calls it "the biggest day of Week 2 — if the 2pm Team Teach lands, the rest of the week works."
- **Wk2 Wed PM** — Sponsor feedback panel + Guest perspective panel + Team integration (P+B) + RC Market executes. Four heterogeneous blocks back-to-back.
- **Wk1 Mon PM** — Sponsor briefing, Q&A, Game, Customer panel, Debrief problems, Swag challenge intro. Six blocks; the heaviest PM in Wk1.

**Alumni handling today**: nothing in data. Implicit in prose; Cate owns it per PROJECT.md.

**Sponsor touchpoints**: `w1-mon-pm-sponsor-briefing` (draft), `w1-mon-pm-swag-challenge-intro` (stub), `w2-fri-pm-partner-joins` (stub), plus the Week 2 banner band. Sponsor names live in prose only.

**Named sessions to preserve in any new view**: "Market executes" (RC, Wk2 Wed PM), "Team Teach (synthesis hinge)" (Wk2 Tue PM), "RC: Pitch speed dating" (first RC, Wk1 Thu AM), "Freakout" (Wk2 Fri PM), the three Phase markers (`PHASE 1 · RECONNAISSANCE`, `PHASE 2 · BUILD & SCOPE`, `PHASE 3 · BUILD & PLAN`).

## Open questions for Owen

1. **Business-track name drift.** SCHEDULE labels `B1 = "The Case"` and `B2 = "Canvas Lite"`. The ACTIVITIES detail entries say `B1 = "Canvas Lite"` and `B2 = "Back-of-Napkin Economics"`. The brief refers to "B1 Canvas Lite" — which alignment is the canonical one for the new view? (Validator does *not* check name agreement, so this drift has gone unflagged.) Same for `P3`: schedule says "Prototype Build", activity says "Prototype Spec Sheet".
2. **Where does PROJECT.md actually live?** It's in *both* working trees. The intent per `ARCHITECTURE.md` is private-only. Before the new view is built, lock down which repo owns it so the eventual Pages deploy doesn't leak sponsor names.
3. **`facilitator` / `alumni` as data, or stay in prose?** The view-pills already exist with `wip` badges. The data-comment says these fields are "optional, future". The new view layer is the natural moment to either promote them into the schema or formally leave them as facilitation prose only.
4. The 75 missing-content blocks — does the new view *require* them populated first, or can it ship with the current 3-ready/2-draft/75-stub state and use the same status visual treatment the workbench already uses?

## Recommended next step

Proceed to PRD, but front-load Owen's resolution of open question #1 (B/P name drift) and #3 (whether facilitator/alumni become structured fields) before the PRD freezes scope. Both are cheap to answer (one sentence each) and either changes the shape of the new view materially. Everything else is downstream of those calls — the kernel is healthy, well-documented, and modelled enough to build on; the only risk is starting the PRD on top of unresolved naming + schema-extension decisions that would force a rewrite mid-stream.
