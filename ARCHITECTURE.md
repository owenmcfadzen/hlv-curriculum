# ARCHITECTURE.md — Curriculum Workbench Kernel

The system underlying the HLV workbench, designed to be reusable for any curriculum or program-design project. Project-specific facts live in `PROJECT.md`. Universal Owen-prefs live in `AGENTS.md`.

## What the kernel is

A **single-file HTML workbench** for designing and walking through a multi-day program. One file, three modes, five JS data objects.

```
index.html
├── <style>     — visual layer (Owen iterates this in claude.ai web)
├── <body>      — DOM scaffolding, mode switches, navigation chrome
└── <script>
    ├── DATA OBJECTS    — SCHEDULE, ACTIVITIES, DAYS, KIND_LEGEND, TRACK_LEGEND
    ├── VALIDATION      — runs at load, shows banner if data is malformed
    └── RENDERERS       — page mode, slide mode, print mode
```

## The three modes

| Mode | Purpose | Activated by |
|---|---|---|
| **Page** | Scroll, browse, iterate. The default working view. | Default |
| **Slide** | Full-screen 2D navigation. ←→ for sections + days + activities; ↓ to drill into a single block's slide. | "Slide" toggle |
| **Print** | Clean PDF export. Strips chrome, formats for paper. | Browser print / "Print" toggle |

## Data schema

All data lives as JS objects at the top of `<script>`. The schemas are formalized in `schema/*.schema.json` and validated at load.

### `SCHEDULE`

The program schedule. Weeks → days → AM/PM blocks.

```js
{
  weeks: [
    {
      tag: "WEEK 1",
      label: "Discovery",
      sub: "...",                    // one-line week framing
      days: [
        {
          name: "Mon",
          am: [block | groupLabel, ...],
          pm: [block | groupLabel, ...],
          amSub: "...",               // optional sub-line
          pmSub: "...",               // optional sub-line
        },
        ...
      ],
      band: { label: "...", kind: "..." },  // optional banner across the week
    },
    ...
  ]
}
```

A **block** is one of:

```js
// Phase marker (no slide, just a header in the day grid)
{ groupLabel: "PHASE 1 · RECONNAISSANCE" }

// Schedule block
{
  label: "Welcome",                  // visible name
  kind: "welcome",                   // see KIND_LEGEND below
  sub: "...",                        // optional italic sublabel
  code: "P1",                        // optional, links to ACTIVITIES entry
  track: "product",                  // for kind: "track" only
  slide: {                           // optional — block detail content
    status: "ready" | "draft" | "stub",
    foundation: "...",               // 1-3 sentences, the concept
    students: ["...", "..."],         // bullet list, what students do
    facilitator: "...",              // notes for the runner
    references: ["...", "..."],
  }
}
```

### `ACTIVITIES`

The worksheets / activity entries (P1-P3, B1-B3, M1-M3 in HLV). Linked from SCHEDULE blocks via `code`.

```js
{
  code: "P1",                                       // unique
  track: "product" | "business" | "market",
  name: "Solution Blueprint",
  when: "Tue AM · Phase 1",                         // human-readable timing
  status: "built" | "partial",
  shape: "...",                                     // methodology, 2-3 sentences
  feeds: ["LPP \"How does it work?\"", ...],          // downstream consumers
  open: "...",                                      // optional unresolved question
  note: "...",                                      // optional context
  wireframe: { viewBox, zones, lines }              // SVG schematic — DO NOT restructure
}
```

**Status precedence (the `_slideStatus` rule):**

For each SCHEDULE block, the rendered status (`_slideStatus`) is computed at load:

| Block type | Source of truth |
|---|---|
| Non-track block (`kind: welcome / work / module / ...`) | `block.slide.status` (or `"stub"` if missing) |
| Track block (`kind: "track"`, has `code`) | `ACTIVITIES[code].slideStatus` (or `"draft"` if missing) |

Track blocks intentionally don't carry their own `slide.status` — the renderer ignores it if you set both. The validator errors on this case to prevent silent drift. This is the *one* place in the schema where two fields name similar concepts; they describe different artifacts (a block's detail slide vs an activity's spec card) and the precedence rule keeps them tractable.

The `wireframe` object renders the worksheet schematic. Adding zones is fine; restructuring the format breaks the renderer.

### `DAYS`

One entry per day across the program. Drives the day-level lead/takeaway.

```js
{
  weekIdx: 0 | 1,             // 0 = Wk1, 1 = Wk2
  dayIdx: 0..4,               // 0 = Mon, 4 = Fri
  theme: "Problems",          // one short phrase, the day's headline
  lead: "...",                // 1-2 sentences, the day's framing
  takeaway: "...",            // 2-3 sentences, the line you say out loud
}
```

### `KIND_LEGEND`

Enum of valid block kinds. Each maps to a visual category (color in the schedule grid).

```
welcome / work / module / game / rc / panel / sponsor /
teamteach / social / pitch / lpp / track
```

Don't invent new kinds. If you need a new one: add it to `KIND_LEGEND`, add a CSS class, add a schema entry.

### `TRACK_LEGEND`

Enum of valid track names. For specialty tracks in week 2.

```
product / business / market
```

## Validation at load

`workbench.html` runs a `validate()` function on page load. It walks every data object and checks:

- Every block has a `kind` in `KIND_LEGEND`.
- Every `code` referenced in SCHEDULE has a matching entry in ACTIVITIES.
- Every `track` is in `TRACK_LEGEND`.
- Every `slide.status` is one of `ready | draft | stub`.
- Every `DAYS` entry has valid `weekIdx` and `dayIdx`.
- No two SCHEDULE blocks have the same `code`.

If any check fails, a red banner appears at the top of the page with a list of the failures. The renderer still runs (best-effort), so the rest of the page is still visible while you fix the issue.

The same checks run via `node tools/validate.mjs` for CLI/CI use. **Run that before every commit.**

## File layout

| Path | Purpose | Lives in |
|---|---|---|
| `index.html` | Live workbench artifact. The kernel. | Public repo |
| `AGENTS.md` | Universal Owen-prefs | Public repo |
| `ARCHITECTURE.md` | This file — system docs | Public repo |
| `PROJECT.md` | Project-specific facts (HLV) | Private repo |
| `schema/*.schema.json` | JSON Schema contracts | Public repo |
| `tools/validate.mjs` | CLI validator | Public repo |
| `tools/export-data.mjs` | Extract data objects to JSON | Public repo |
| `data/blocks-index.json` | Derived from SCHEDULE | Private repo |
| `data/blocks-needing-content.md` | Gap list — the working spec | Private repo |
| `data/porto-extraction.json` | Old deck content extraction | Private repo |
| `data/porto-mapping.json` | Carry-forward decisions | Private repo |
| `prompts/` | Task prompts for AI assistants | Private repo |
| `sources/` | Raw materials (decks, transcripts, worksheets) | Private repo (or local) |

## The block-driven gap-analysis model

The durable working loop for populating program content. Don't bulk-extract from old materials and try to map; do it the other way.

```
1. SCHEDULE has 80 blocks.
2. Each block either has slide content (ready/draft) or doesn't (stub/missing).
3. tools/build-blocks-index.mjs walks SCHEDULE → produces data/blocks-index.json.
4. data/blocks-needing-content.md is a human-scannable view: the spec for what to populate.
5. For each block: research, draft to data/block-drafts/<id>.md, review, commit one at a time.
6. Edit workbench.html block.slide via targeted edit. Status: draft.
7. Owen reviews. Status flips to ready.
```

This inversion (block-driven, not slide-driven) is the lesson learned from the v0 extraction: don't ask the source material "where do you fit?" Ask the destination "what do you need?"

## Regen and tooling

| Tool | Purpose |
|---|---|
| `tools/validate.mjs` | Run schema validation on `index.html` |
| `tools/export-data.mjs` | Export embedded data objects to `data/{schedule,activities,days}.json` for AI/tooling consumption |
| `tools/build-blocks-index.mjs` | Regenerate `data/blocks-index.json` from `SCHEDULE` (lives in private repo since it writes to `data/`) |

The workbench is **canonical**; JSON exports are **derivative**. The export tool produces them on demand. Don't edit the JSON exports directly — edit the workbench, re-export.

## Verification before any commit

```bash
node tools/validate.mjs       # must pass
```

For changes to `index.html`:
1. Validation passes (above).
2. Open it locally in a browser. No console errors. Workbench renders.
3. If you edited a block's `slide`, navigate to it in Slide mode and confirm.
4. `git diff` is small and focused.

## Reusability

To start a new curriculum project from this kernel:

1. Fork the public repo (or copy `index.html`, `AGENTS.md`, `ARCHITECTURE.md`, `schema/`, `tools/`).
2. Replace `PROJECT.md` with your project's facts.
3. Replace the data inside `index.html`'s data objects (`SCHEDULE`, `ACTIVITIES`, `DAYS`).
4. Update `KIND_LEGEND` / `TRACK_LEGEND` if the project's vocabulary is different (and update CSS accordingly).
5. Run `node tools/validate.mjs` until clean.
6. Stand up a private companion repo for project-specific data and prompts.

The kernel — schema, renderer, validation, three modes, gap-analysis loop — stays. Project-specific content swaps.

## What NOT to touch unless asked

- The `wireframe` SVG data inside `ACTIVITIES` entries. Restructuring breaks the renderer.
- CSS / visual styling. Owen iterates these by pasting the file into claude.ai web.
- The renderer functions in `<script>`. Validation can be added; rendering logic is separate concern.
- The data shapes themselves — adding fields is fine; renaming or removing breaks downstream consumers.
