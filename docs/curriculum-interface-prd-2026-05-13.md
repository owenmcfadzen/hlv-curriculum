# HLV Curriculum Interface — PRD (2026-05-13)

Spec for a new viewing layer on top of the existing workbench. Read-only v1, target Lisbon (June 27 cohort). Source of truth stays `index.html`; the new interface is a renderer, not a replacement.

This PRD freezes scope. Implementation happens in a separate session.

## Changelog

- 2026-05-13: Initial PRD
- 2026-05-13: Q1+Q2 resolved (facilitator roles enum, alumni/student audience simplification). Section 04 schema rewritten; Sections 02, 03, 06, 09, 10 updated for consistency with the new model.

---

## 00 — Pre-PRD cleanup

One housekeeping item before any new code lands.

`PROJECT.md` is currently present in both working trees. The intent per `ARCHITECTURE.md` is private-only: the public repo serves a Pages URL and visitors should never see internal facts (sponsor names, team names, Sonae). Owen has confirmed the call: `PROJECT.md` belongs in the private repo, full stop. Before the build session opens, `hlv-Workbench/PROJECT.md` and any other private-only files in the public working tree get removed (or moved into the companion repo) and a commit lands that closes that drift. Same for the untracked `README.md` if it carries project facts. This is a five-minute job; do it first so the new view never accidentally renders a leaked field.

`HANDOFF.md` and the `data/blocks-*.json` files already follow this pattern (private only, gitignored in public). The cleanup is just bringing `PROJECT.md` in line.

---

## 01 — Current state

Lifted from `docs/curriculum-interface-investigation-2026-05-13.md` and lightly edited for flow. Full investigation lives at that path.

### Repo relationship

Two repos. `hlv-Workbench` is the canonical public repo on `main` with remote `https://github.com/owenmcfadzen/hlv-curriculum.git`; last commit walks "Initial commit, Workbench v1" through "Workbench kernel hardening" and "Documentation kernel + schemas + tools" to "Ignore derivative data exports" (HEAD, 4 May). It carries the workbench, the kernel docs, the JSON Schema contracts, the validator/exporter, and the source decks pointers. `hlv-Workbench-Private` is a content-only sibling, not a fork. Its `.git/config` has no remote and the HEAD logs file is empty. It carries the HLV-specific facts (`PROJECT.md`, `HANDOFF.md`, `prompts/extract-porto.md`, the gap-analysis artifacts in `data/`) and mirrors `AGENTS.md` and `ARCHITECTURE.md` for self-contained AI context. The pattern: public holds the kernel, private holds project content.

### File structure

The workbench is one file, `index.html` (~157 KB, ~3,800 lines). Three modes, five inline JS data objects (`SCHEDULE`, `ACTIVITIES`, `DAYS`, `KIND_LEGEND`, `TRACK_LEGEND`). Weeks → days → AM/PM → blocks is a JS-object hierarchy inside `<script>`. `DAYS` is a flat array of 10 entries keyed by `(weekIdx, dayIdx)`. `ACTIVITIES` is a flat array of 9 entries keyed by `code` (P1/P2/P3, B1/B2/B3, M1/M2/M3) and linked from `SCHEDULE` blocks via that code.

### Metadata schema (today)

`SCHEDULE` block: `label` (required), `kind` (required, enum), `sub`, `code` (regex `^[A-Z][0-9]+$`, links to ACTIVITIES), `track` (enum, only when `kind: track`), `slide` (optional object with `status` enum `ready|draft|stub`, `foundation`, `students[]`, `facilitator`, `references[]`). Alternative form: a "phase marker" with only `groupLabel`. The data-object comment lists `cellSub`, `facilitator`, and `alumni` as optional/future fields that are not yet in the JSON Schema.

`SCHEDULE` day: `name` (Mon-Fri), `am[]`, `pm[]`, `amSub`, `pmSub`. `SCHEDULE` week: `tag`, `label`, `sub`, `days[]`, optional `band` ({label, kind}).

`ACTIVITY`: `code`, `track`, `name`, `when`, `status` (enum `built|partial`), `slideStatus` (enum `ready|draft|stub`), `shape`, `feeds[]`, `open` (nullable), `note` (nullable), `wireframe` (`{viewBox, zones[], lines[]}`).

`DAY`: `weekIdx` (0-N), `dayIdx` (0-4), `theme`, `lead`, `takeaway`. `KIND_LEGEND`: 12 kinds (welcome / work / module / game / rc / panel / sponsor / teamteach / social / pitch / lpp / track). `TRACK_LEGEND`: 3 tracks (product / business / market).

### Rendering stack

Single-file vanilla HTML + inline CSS + inline JS. No framework, no build step. The validator (`tools/validate.mjs`) runs in Node via `vm.createContext`: regex-slices the `const SCHEDULE = …` blocks out of the HTML, evals, structurally checks. Deployment: GitHub Pages serving `index.html` directly from `main` at `https://owenmcfadzen.github.io/hlv-curriculum/`. No CI, no workflow file.

### Existing views

Two top-level modes plus print. Top-bar nav: `01 Plan`, `02 Schedule`, `03 Activities`, `04 Layers`, `05 Decisions`, `06 Flow`. "Page" / "Slide" toggle plus "Print". Within Schedule, six pill-filters: All / Product / Business / Market / Facilitators (wip) / Alumni (wip).

### Stakeholder representation

Tracks are explicit and structured. Facilitators and alumni are implicit only: data-comment flags `facilitator` and `alumni` as `(optional, future)`; no block currently carries them; the two pills are marked `wip`. Named people (Stacey, Cate, Luke, Takeshi) appear only in `flow` prose. Sponsors are partially structured: `kind: sponsor` blocks exist, but identities live in `PROJECT.md` prose.

### Two-week shape

Two weeks × 5 days × {AM, PM} = 20 half-days. 80 blocks + 3 phase markers = 83 SCHEDULE entries. Current `slide.status` distribution: 3 ready, 2 draft, 75 missing/stub.

Collision points to design around: Wk2 Tue (Phase 1 reconnaissance AM, Team Teach 2pm, Phase 2 build PM); Wk2 Wed PM (Sponsor feedback + Guest panel + Team integration + RC Market executes); Wk1 Mon PM (Sponsor briefing through Swag challenge intro, six blocks).

---

## 02 — Target interface (three nested views)

The new layer is one screen experience composed of three views, nested. The user enters at View A, drills to B, drills to C, stacks back out. Filters are sticky across views.

### Navigation flow

```
View A (Week/Schedule Overview)
   │
   ▼  click a day
View B (Day View)
   │
   ▼  click a block
View C (Activity Detail Panel)
```

Stacking navigation: each level renders above the prior, with a persistent breadcrumb (`Wk2 / Tue / P1 Solution Blueprint`) and a back affordance. Browser back button works. Deep links work: `#/w2/tue/p1` opens straight to View C with View B and View A visible underneath as stacked context. Closing C reveals B; closing B reveals A. Filter state and time-of-day position persist across drills.

This is deliberately not a tab-strip. The drill metaphor matches how facilitators actually move through the program: zoom into a day, zoom into a block, step back out.

### View A — Week/Schedule overview

The macro. Two-week grid, 5 days × 2 weeks visible at once on desktop. Each day cell shows:

- `theme` (one short phrase from `DAYS`)
- `lead` (small line, from `DAYS`)
- Block count (e.g., "10 blocks")
- Status density bar: a tiny horizontal stack of `ready / draft / stub` segments, proportional to that day's blocks. This is the v1 way Owen sees gap-analysis progress at a glance.
- Phase-marker bands spanning the days they cover (`PHASE 1 · RECONNAISSANCE`, etc.)
- Sponsor band (the existing Wk2 banner)
- Lead chip (short label from `DAYS.lead`, free prose)

Hover or focus on a day cell highlights related downstream days (via `feeds_into` / `handoff_to` derivations). Click drills to View B.

Phase markers render as horizontal bands across the days they span, not as cells. Visually distinct (kind: phase) so they read as structural separators, not content.

### View B — Day view

The workhorse. One day, full screen. This is the view facilitators will live in on the morning of each day.

Components stack top-to-bottom:

- **DayHeader**: day name (Mon-Fri), week tag, theme, lead chip (from `DAYS.lead`), the day's `lead` and `takeaway` from `DAYS`. A small "handoffs" line: what this day produces (`produces_artifact`) and what it feeds into (`feeds_into`, surfaced day-level by aggregating block fields).
- **FilterBar**: persistent across drills. Three filter dimensions (Section 03).
- **DayTimeline**: AM and PM as two horizontal lanes. Blocks render as cards positioned by `time_start` / `time_end`. Buffer windows (`prep_buffer_minutes`, `debrief_buffer_minutes`) render as low-saturation extensions of the block card, so a 60-minute activity with a 15-minute prep + 10-minute debrief reads as 85 minutes of total facilitator commitment. Lunch and breaks render as inert gaps. The four-block PM stack on Wk2 Wed becomes visually obvious instead of squinting at a list.
- **Block cards** in the timeline carry: schedule label, kind tag, code (if present), facilitator-role badges (from `facilitator_roles`), audience badge (when `audiences` is anything other than the default mix), status pill (ready/draft/stub). Cards are color-shaded by `kind`. Filtered-out cards dim instead of disappear (see Section 03).
- **DayFooter**: optional. Total facilitator hours, block-count by kind, day-level dependencies satisfied / pending.

Click a card → View C stacks above. The day stays visible as the background layer.

### View C — Activity detail panel

The microscope. One block (or phase marker, though phase markers have less to show). Renders as a panel layered above View B, not a full page replacement; the day grid stays partially visible at the edge so the user keeps context.

Three tabs at the top:

- **Overview** (default): foundation, students[], facilitator notes, assistant notes, references, success criteria, dependencies (`dependencies` field), what it produces (`produces_artifact`), what it feeds into (`feeds_into`), handoff target (`handoff_to`), facilitator roles required, audience (student / alumni / both). If the block has a `code`, the linked ACTIVITY record renders below: shape, when, feeds, open question, the activity's canonical `name`.
- **Slides**: the Google Slides link or embed (`slides_link_or_embed`). Slides themselves live in Google Drive; this tab is a launcher with a preview thumbnail when available. Below the slides link, the existing `slide.{foundation, students, facilitator, references}` content renders as a fallback / outline. Status pill (`slide.status`) is prominent.
- **Analog**: the activity wireframe SVG (from `ACTIVITIES[code].wireframe`) renders inline. `analog_assets` list below (worksheet PDFs, props, materials). For blocks without a linked activity, this tab hides.

The panel has a header with: schedule label, kind tag, activity name (if codes resolve), facilitator-role badges, audience tag, time window. Close action returns to View B with scroll position preserved.

### SCHEDULE vs ACTIVITIES in the view layer

Resolved point. `SCHEDULE.label` and `ACTIVITIES.name` differ on purpose. `SCHEDULE` is the *plan*: working labels, placeholder names, scheduling shorthand ("The Case", "Prototype Build"). `ACTIVITIES` is the *content*: canonical activity names as run on the course ("Canvas Lite", "Prototype Spec Sheet"). They are linked, not unified.

The view layer respects this:

- View A and View B (timeline / calendar surfaces) render `SCHEDULE.label` and `SCHEDULE.sub`. That is what is on the schedule that day; that is what gets shown on the schedule view.
- View C header renders `SCHEDULE.label` as the block name, and surfaces `ACTIVITIES.name` as a sub-line ("Runs activity: Canvas Lite") when a `code` link resolves. The Overview tab makes both names visible.
- The detail content for tracked activities (shape, wireframe, slide spec) comes from `ACTIVITIES`. The block-level prose (`slide.foundation/students/facilitator/references`) is the schedule-side annotation: how this specific running of the activity is framed on this specific day.

No merging, no rename. The view layer is responsible for showing both faces of the same block without collapsing them.

---

## 03 — Filter behavior

Three filter dimensions, composable, additive within a dimension and intersecting across dimensions. Filters live in the FilterBar in View B and apply persistently into View C; View A shows the same filters but downsamples to day-level aggregates.

### Dimensions

- **Track**: Product / Business / Market. Existing filter; carries forward.
- **Role**: enum values from `facilitator_roles` (e.g., `lead`, `assistant`, `specialist_product`, `specialist_business`, `specialist_market`, `director`, `guest_speaker`, `sponsor_rep`). Selecting a role highlights activities that need that role type. The filter captures what kind of facilitator each block requires, not who fills the slot on a given day — assignment of specific people to roles happens outside the schema. Audience selection (student / alumni / both) renders as a badge on each block; if needed, audience can be added as a fourth filter dimension post-v1.
- **Moment-type**: subset of `KIND_LEGEND`. The 12 kinds collapsed into 5 facilitator-meaningful buckets for filter UI: Plenary (welcome, module, panel, lpp), Workshop (work, track), Reality Check (rc), Sponsor / Guest (sponsor, panel guests), Social / Game (social, game, teamteach, pitch). The full 12 kinds remain available in a "more" overflow for power use. Visual color coding stays on the 12-kind scheme. Note: `student-only` and `alumni-only` views are not their own moment-type; they fall out of the `audiences` field on each block (e.g., a block with `audiences: ["student"]` is student-only).

### Behavior

- **Highlight, not remove.** Filtered-out blocks dim (40% opacity or similar) and lose interactivity weight but stay in the timeline so the day's actual shape remains legible. Removing blocks would distort time and make the day read wrong. This is non-negotiable for a schedule view; collisions and density are part of the information.
- **Composable.** Filters intersect. Select Product + `specialist_product` + Workshop = Product workshops that need a product specialist. The matching set is what is highlighted; everything else dims.
- **Inverse-friendly.** Each filter has a quick toggle to invert ("everything that doesn't need a specialist"). Useful for coverage gap checking.
- **Persistent across drills.** Filter state is part of the URL hash. Sharing a link to `#/w2/tue?filter=role:specialist_product` opens View B with the matching blocks highlighted.
- **Clear in one click.** A "Clear filters" affordance always visible when any filter is active.

The FilterBar is also where the existing wip-pills get replaced. The new pills are real, driven by data, not placeholders.

---

## 04 — Data model

Existing fields stay. The view layer is layered on top, not in place of. New fields below are additive; the validator extends; the renderer reads them when present and falls back gracefully when absent.

### SCHEDULE.block — existing fields preserved

`label`, `kind`, `sub`, `code`, `track`, `slide.{status, foundation, students, facilitator, references}`. Phase markers (`groupLabel` only) still valid.

### SCHEDULE.block — new fields (additive)

| Field | Type | Notes |
|---|---|---|
| `id` | string | new. Stable identifier, format `wN-day-am|pm-slug` (matches `blocks-index.json` naming). Used for deep links and roll-ups. |
| `time_start` | string | new. `"09:00"`. Anchors the block in the timeline. |
| `time_end` | string | new. `"10:30"`. Pair with `time_start`. |
| `prep_buffer_minutes` | integer | new. Minutes of prep before `time_start`. Default 0. |
| `debrief_buffer_minutes` | integer | new. Minutes of debrief after `time_end`. Default 0. |
| `tracks` | string[] | new. Multi-track support for combined-track blocks. When present overrides single-block `track`. Values from `TRACK_LEGEND`. |
| `audiences` | string[] | new. Who's in the room. Enum v1: `student`, `alumni` (extensible later, e.g., `staff`). Default mix is `["student", "alumni"]`; a student-only block is `["student"]`; an alumni-only block is `["alumni"]`. If alumni run a different activity at the same time slot, that's a separate block record with `audiences: ["alumni"]` — the view layer renders them side by side based on time + audiences. Specialty splits are handled by `tracks`, orthogonal to audience. |
| `facilitator_roles` | string[] | new. Role enum array. What kind of facilitator this block needs, not who fills the role on the day. Values v1: `lead`, `assistant`, `specialist_product`, `specialist_business`, `specialist_market`, `director`, `guest_speaker`, `sponsor_rep`. Extensible. Assignment of specific people to roles happens outside the schema (e.g., a separate `roster.json`, or facilitator-notes prose). |
| `dependencies` | string[] | new. Block ids this block requires to have completed. Drives the critical-path roll-up. |
| `produces_artifact` | string | new. Free-text v1. What students leave with ("filled Canvas Lite worksheet", "10-slide pitch draft"). |
| `feeds_into` | string[] | new. Block ids that consume this block's output. Drives the critical-path roll-up. |
| `handoff_to` | string | new. Single block id, the next-step inheritor. Special case of `feeds_into` for the canonical hand-off relationship. |
| `success_criteria` | string[] | new. Bullet list. "What 'this block worked' looks like." |
| `analog_assets` | string[] | new. Worksheets, props, printed materials needed. References to files in `sources/` or `worksheets/`. |
| `slides_link_or_embed` | string | new. URL to the Google Slides deck for this block. Drives the Slides tab in View C. |
| `notes_facilitator` | string | new. Long-form notes for the lead. Distinct from `slide.facilitator`, which is the slide-card content. |
| `notes_assistant` | string | new. Long-form notes for the assistant. |

### Facilitator and alumni — first-class

Per Owen's call: facilitator and alumni are now schema fields, not WIP pills, not data-comments. The schema is people-agnostic. `facilitator_roles` captures what kind of facilitator the block needs; `audiences` captures who's in the room. The existing `slide.facilitator` *prose* field stays as the slide-card notes for the runner. The pill UI from the current workbench is scrapped, not ported. View B's FilterBar renders the role filter from `facilitator_roles`.

Roles, not names. The team can change between cohorts; the schema describes the shape of the program, not the current roster. Assignment of specific people to roles happens in a sibling file (e.g., `roster.json`) or in facilitator-notes prose. The role enum is extensible; v1 ships with `lead`, `assistant`, `specialist_product`, `specialist_business`, `specialist_market`, `director`, `guest_speaker`, `sponsor_rep`.

Alumni vs student. There are two audience types: `student` and `alumni`. A block lists who's in the room via `audiences`. Most blocks are `["student", "alumni"]` (everyone together). Some are `["student"]` (student-only). Some are `["alumni"]` (alumni-only). If alumni run a parallel activity at the same time slot, that's a separate block record at the same time with `audiences: ["alumni"]` — no special `alumni_state` or parallel-link field. Specialty (Product / Business / Market) is orthogonal and lives in `tracks`; both students and alumni use the same tracks.

### ACTIVITIES — existing fields preserved

`code`, `track`, `name`, `when`, `status`, `slideStatus`, `shape`, `feeds`, `open`, `note`, `wireframe`. No changes in v1. The block-level new fields cover what was missing; the activity record stays a content / spec card.

### DAYS — existing fields preserved

`weekIdx`, `dayIdx`, `theme`, `lead`, `takeaway`. View A and View B's DayHeader read from this.

### Derived roll-ups

These are not stored; they are computed at render time from the fields above. Renderable as a sidebar or a print export.

- **`role_load_per_day`**: walks every SCHEDULE block, counts blocks per day that require each role. Output: `{ "w2-tue": { lead: 6, assistant: 6, specialist_product: 2, ... }, ... }`. Used to spot uneven role demand and to surface "Wk2 Tue needs 6 leads back-to-back" before the day collapses. Pair with an external `roster.json` to compute per-person load when assignments exist.
- **`critical_path_to_LPP`**: a topological walk from the LPP block (kind: `lpp`, Wk2 Thu) back through `feeds_into` / `produces_artifact` / `handoff_to`. Output: ordered list of block ids that must work for LPP to land. Renderable as a sequence in View A or as a sidebar highlight in View B.
- **Status density per day**: `{ ready, draft, stub }` count per day, drives View A's density bar.
- **Coverage gaps**: blocks where `facilitator_roles` is unset (a "who runs this?" worklist), or `produces_artifact` is empty for blocks whose `feeds_into` is non-empty (broken chains), or `audiences` is unset.

These derivations live as functions in the script; they are not new data. Add a field, derivations stay in sync.

---

## 05 — Constraints and non-goals

Explicit. Easier to push back later if scope tries to creep.

- **Read-only v1.** No editor, no in-place editing, no auth, no DB. The workbench data objects in `index.html` are the only writable surface. Owen edits the HTML directly or via the existing block-drafts flow; the new view re-renders.
- **Same view for everyone.** No role-based UI gating. Every facilitator opens the same view; filters are user-side, not server-side. If someone wants a role-scoped slice (e.g., "everything I lead"), they filter by `facilitator_roles` on their own.
- **Reusable template.** The view layer reads from `SCHEDULE`, `ACTIVITIES`, `DAYS` and the new fields. It does not hardcode HLV facts (sponsor names, person names, dates). The kernel-reusability principle in `ARCHITECTURE.md` stays intact: another curriculum project can fork the kernel and reuse this view.
- **Source of truth is the repo.** No external CMS, no Notion sync, no spreadsheet round-trip. The workbench is canonical; the view renders it.
- **Stack continuity.** No framework migration that breaks the existing validator pipeline or the GitHub Pages deploy. See Section 08.
- **Aesthetic continuity.** The new view uses the existing CSS variables, kind colors, status pill styles, and typography. It is a new screen experience, not a visual re-skin. Owen iterates visuals by pasting `index.html` into claude.ai web; that workflow must survive.

Non-goals: print export (the existing Print mode covers this), slide-mode keyboard nav (the existing Slide mode covers this), the existing 6-section anchor nav (stays; the new view is additive). Mobile-first is not a goal v1; desktop laptop in Lisbon is the target device.

---

## 06 — Component architecture

Components are vanilla-JS modules (or vanilla-JS pseudo-components if staying single-file, see Section 08). The contract below is framework-agnostic.

### Component list

- **`WeekOverview`** — View A root. Renders the two-week grid. Props: weeks (from `SCHEDULE.weeks`), days (from `DAYS`), derived status density, derived role-coverage chips per day. Children: per-day cells. Click handler: emit `navigate("day", weekIdx, dayIdx)`.
- **`DayHeader`** — View B top section. Props: day record (`DAYS[i]`), aggregated produces/feeds from the day's blocks, lead chip (from `DAYS.lead`). No interactivity in v1.
- **`DayTimeline`** — View B body. Props: day's `am[]` and `pm[]` arrays, plus filter state. Children: `ActivityBlock` cards positioned by `time_start`. Renders lunch / break gaps. Background grid is hourly ticks.
- **`FilterBar`** — Persistent. Props: filter state (track, role, moment-type), available values derived from data. Emits filter changes. Sticky across views.
- **`ActivityBlock`** — A single block card in View B. Props: block object, filter state (for dim/highlight), click handler. Renders label, kind tag, code, facilitator-role badges, audience badge, status pill, time window with buffers. Click emits `navigate("block", blockId)`.
- **`ActivityPanel`** — View C root. Props: block id (resolves to block + linked activity). Children: tabs + `ActivityOverview` / `ActivitySlides` / `ActivityAnalog`. Close handler emits `navigate("day", weekIdx, dayIdx)`.
- **`ActivityOverview`** — Default tab. Renders block + activity prose, dependencies, produces, feeds, handoff, success criteria, audience, facilitator-role list, facilitator notes.
- **`ActivitySlides`** — Slides tab. Renders `slides_link_or_embed` (iframe or link card) + `slide.{foundation, students, facilitator, references}` as outline.
- **`ActivityAnalog`** — Analog tab. Renders `ACTIVITIES[code].wireframe` SVG + `analog_assets` list. Hidden when no `code` link.
- **`RollupSidebar`** — Optional, opens from a button in View A or View B. Renders the derived roll-ups (role load per day, critical path, coverage gaps). Initially a read-only side panel.

### Data flow

One-direction. Data objects load from `index.html` at start (existing pattern). State (current view, current week/day/block, filter state) lives in a single `state` object plus URL hash. State changes write to hash; hash changes re-render. URL hash format:

```
#/                            (view A)
#/w1                          (view A scrolled to week 1)
#/w2/tue                      (view B for Wk2 Tue)
#/w2/tue/p1                   (view C for P1 on Wk2 Tue)
#/w2/tue?filter=role:stacey   (view B with filter active)
```

Each component is a render function: `(state, data) => HTML element`. No virtual DOM v1; a top-level `render()` re-runs on state change. The kernel is small enough that full re-renders stay under a frame budget. If perf becomes an issue, scope reductions are obvious (only re-render the changed view; cache derived roll-ups).

### Validator extension

`tools/validate.mjs` extends to check the new fields:

- `time_start` and `time_end` are HH:MM, `time_end > time_start`.
- `prep_buffer_minutes` / `debrief_buffer_minutes` are integers ≥ 0.
- Entries in `facilitator_roles` are members of the role enum (`lead`, `assistant`, `specialist_product`, `specialist_business`, `specialist_market`, `director`, `guest_speaker`, `sponsor_rep`).
- Entries in `audiences` are members of the audience enum (`student`, `alumni`).
- `dependencies`, `feeds_into`, `handoff_to` all resolve to actual block ids.
- All new fields are optional; absence is valid. Validation surfaces *broken references*, not *missing data*.

---

## 07 — Build sequencing

Six phases. Each phase delivers a usable artifact. Owen sees something working in days, not weeks.

### Phase 1 — One day, one click

Build View B for one day (recommend Wk2 Tue, the load-bearing collision day). Read existing `SCHEDULE` data. No new fields required: render labels, kinds, codes, statuses from what is there today. Hard-code time positions if `time_start` is not yet populated (use a 6-block uniform spread for AM and PM). Open behind `?view=day&d=w2-tue` query param so existing modes are untouched. Outcome: a usable single-day view for the most complex day of the program. Time estimate: 1-2 days.

### Phase 2 — Filters live

Wire the FilterBar to View B. Track filter is free (data exists). Role and moment-type filters require the new schema fields to start carrying values; ship the filter UI with track active and role/moment-type stubbed for Owen to populate as content build progresses. Highlight/dim behavior. URL hash persistence. Time estimate: 1 day after Phase 1.

### Phase 3 — Week view above

Build View A on top of B. Two-week grid, day cells with theme/lead/density. Stacking navigation: View A → View B works. Phase markers render as bands. Sponsor band renders for Wk2. Time estimate: 1-2 days.

### Phase 4 — Tabs (View C)

Build View C as a panel above View B. Overview tab first (existing slide content + activity prose), then Slides tab (link launcher), then Analog tab (wireframe + assets). Deep links via hash. Time estimate: 2 days.

### Phase 5 — Roll-ups

Derive `role_load_per_day`, `critical_path_to_LPP`, status density (already in View A), and coverage gaps. Build `RollupSidebar` as a side panel openable from View A and View B. Time estimate: 1 day, mostly making the math obvious in the UI.

### Phase 6 — Full two-week content

Populate the new schema fields across all 80 blocks. This is the long pole: time windows, `facilitator_roles`, `audiences`, buffers, success criteria, dependencies. Owen does this via the existing block-driven gap-analysis loop; the new view surfaces gaps faster (coverage-gap rollup highlights every block with unset `facilitator_roles` or `audiences`). This phase runs in parallel with the Week 2 specialist track content build. Time estimate: ongoing; usable at any intermediate state.

### Parallelism with the Week 2 content build

This phase plan is intentionally parallel to Owen's content build. Phases 1-5 are interface scaffolding; they read what is already there and degrade gracefully on missing fields. Phase 6 is the content build itself, which Owen is already running. The interface does not block content; the interface surfaces content gaps.

Hard ship deadline: Lisbon, 27 June. Phase 1-4 land in week 1-2 of the build session window. Phase 5 lands when convenient. Phase 6 is the program build.

---

## 08 — Stack recommendation

**Recommendation: stay single-file vanilla.** Keep `index.html`, keep inline JS, keep the existing validator pipeline. Split the JS into modular pseudo-components within the same file (a `Components` namespace, one render function per component), but do not introduce a build step, do not migrate to Astro.

Reasoning, honest:

**Pros of staying single-file vanilla**
- The validator pipeline already works. `tools/validate.mjs` regex-slices data objects from the HTML and evals them in a Node `vm` context. Migrating to Astro means rewriting that validator against a build output, or splitting data into JSON files and rewriting export-data.mjs. Either is a real piece of work.
- GitHub Pages deploy is currently file-copy: push `main`, Pages serves `index.html`. No CI, no workflow file, no surprise. Astro requires Pages-with-Actions or a different host. That is a different headache to debug under Lisbon time pressure.
- Owen iterates visuals by pasting the file into claude.ai web. Single-file matters for that workflow. Multi-file Astro breaks it.
- The new view's needs (nested routing, filter state, composable components) are *not* large enough to require a framework. Hash routing is twenty lines. Filter state is an object. Components are render functions. Astro pays off when you have content collections and SSG; this is one page with a lot of interactivity.

**Cons of staying single-file vanilla**
- The file is already 3,800 lines. Adding View A + B + C will push past 5,000-6,000. Cognitive load grows. Mitigation: a clean `Components` namespace with one render-fn per component and tight section banners (`// ===== View B: DayTimeline =====`).
- No type checking, no test framework. Mitigation: the validator already catches data-shape errors at load; UI bugs surface visually within seconds.
- The "if this gets bigger, we'll wish we'd migrated" risk. Real but not load-bearing v1. The migration door stays open: any time post-Lisbon, splitting the JS into modules and adding Astro is a defined refactor.

**Pros of migrating to Astro (and aligning with `owen-site`)**
- Component model is real; conceptually closer to what View A/B/C wants to be.
- Aligns with Owen's main site stack, lower context-switching cost between projects.
- Better long-term maintainability if HLV becomes a multi-year evolving workbench.

**Cons of migrating to Astro**
- Validator pipeline rewrites.
- Pages deploy reconfigures (Actions, secrets, build step).
- The claude.ai paste workflow breaks.
- Time cost: 1-2 days minimum, possibly more if any of the above bites. Not free under Lisbon timeline.

The call: ship Lisbon on vanilla. After Lisbon, if HLV is going to keep evolving and the workbench wants more views, evaluate Astro migration as a discrete project. The kernel-reusability story is *stronger* in vanilla anyway (one HTML file, fork-and-replace-data, no toolchain).

---

## 09 — Open questions for Owen

### Resolved

- **Q1 (2026-05-13): Facilitator vocabulary — roles only, no names.** Schema is people-agnostic. `facilitator_roles` is an enum array (`lead`, `assistant`, `specialist_product`, `specialist_business`, `specialist_market`, `director`, `guest_speaker`, `sponsor_rep`). Assignment of specific people to roles happens outside the schema. See Section 04.
- **Q2 (2026-05-13): Alumni vs student — simplified to audiences.** `audiences` is a `["student", "alumni"]` array. No `alumni_state` enum, no `alumni_parallel_activity_id`. Parallel alumni activities are separate block records at the same time slot. Specialty splits stay in `tracks`. See Section 04.

### Open

These still need a call before or during the build session.

1. **Critical path scope.** The `critical_path_to_LPP` rollup assumes LPP is the program's keystone deliverable (Wk2 Thu). Are there secondary keystones (Final Pitches on Wk2 Fri? Sponsor briefing? Market RC?) that deserve their own critical-path views, or is LPP the only one?

2. **Time window granularity.** Some blocks are clearly 60 or 90 minutes; some (panels, sponsor briefings) might run flexibly. Should `time_end` be authoritative for the timeline, or should the renderer accept a `duration_minutes` alternative? Recommendation: `time_start` + `time_end` is simpler and matches how a printed schedule reads.

3. **Status pill behavior on phase markers.** Phase markers (`groupLabel` only) don't have status, code, or content. In View B, they render as bands across the timeline. In View C, clicking a phase marker has no meaningful detail. Should clicking be disabled, or should the panel render a minimal "Phase 1 spans these days, these blocks belong to it" summary?

4. **Backfill priority for Phase 6.** The new fields are additive and the renderer degrades gracefully on missing data. But which fields are *required for Lisbon to work*? Recommendation: `time_start`/`time_end` and `facilitator_roles` are P0 (timeline and role filter read wrong without them). `audiences` is P0 for any block where alumni run a parallel session. `produces_artifact`, `feeds_into`, `handoff_to` are P1 (rollups need them but the day still reads). `notes_facilitator` / `notes_assistant` / `success_criteria` are P2 (nice-to-have for run-quality). Confirm or override.

5. **Slides embedding policy.** `slides_link_or_embed` could be a Google Slides URL with iframe embed (works publicly), or a link-only launcher. Embed is nicer in View C; embed requires the deck to be publicly viewable, which conflicts with internal facilitator notes. Recommendation: link-only by default; embed when Owen explicitly marks a deck as student-shareable.

---

## 10 — Next session handoff

The build session opens on **Phase 1: View B for Wk2 Tue**.

Named first task: **"Build a minimal View B (`?view=day&d=w2-tue`) that reads existing `SCHEDULE.weeks[1].days[1]` from `index.html` and renders the 12 blocks of that day in an AM/PM timeline."** No new schema fields required; use uniform time spacing if `time_start` is missing. Code, label, kind tag, status pill. Click a block → console.log the block id (no View C yet). That is the smallest end-to-end vertical slice.

Before opening the build session:

- The two validator-blocking open questions (facilitator vocabulary, alumni state) are resolved as of 2026-05-13. The remaining open questions in Section 09 do not block Phase 1.
- Complete Section 00 cleanup: move `PROJECT.md` out of the public working tree, commit the diff.
- Confirm the build sequence is correct, in particular whether Phase 3 (Week view) or Phase 4 (View C tabs) should land second; current ordering prioritises shape (week → day → block), but if Lisbon facilitators will live in View B exclusively then View C might come first.

The build session's first commit message should be: `feat(view-b): minimal day view for Wk2 Tue (phase 1.0)`.

Validation gate before the build session ships its first PR: `node tools/validate.mjs` clean, plus a manual eyeball of View B on Wk2 Tue and on at least one other day. If the existing modes (Page, Slide, Print) regress, that is a stop.

---

## Autonomous decisions (override if wrong)

Decisions made during PRD writing without explicit instruction. Flagged so Owen can push back fast.

1. **Stacking navigation, not tabs.** The brief specifies "three nested views" and a "stacking navigation flow." I read that as iOS-NavigationStack-style: each view layers over the prior with breadcrumbs and back, not a tab-strip or master-detail split. Rationale: matches the zoom metaphor (program → day → block), preserves context, deep-linkable. Override path: collapse to two views with View C as a side-drawer if the layering proves annoying.

2. **Filter highlight, not remove.** Brief said "highlight not remove" so this isn't fully autonomous, but I extended it to mean filtered-out blocks dim *and stay in the timeline* including their time geometry. The alternative (collapse the dimmed blocks out and let the timeline reflow) is faster to scan but distorts day shape. I went with structure-preservation. Override path: add a "compact" toggle that reflows when filters are active.

3. **Stack: stay vanilla single-file.** Both options have real costs; I called it for vanilla on validator-continuity and claude.ai-paste-workflow grounds, weighted by Lisbon timeline pressure. The contrary case (Astro migration aligned with `owen-site`) is genuinely defensible. If Owen wants the migration done before Lisbon, the call inverts. Override path: this PRD section gets rewritten; Phase 1-5 stay valid but split across `.astro` files; validator gets ported.

Sub-decisions I made without flagging individually: the AM/PM "two-lane" timeline visualization (Section 02 View B, could equally be a single vertical timeline split at lunch); the 5-bucket moment-type filter collapse over the raw 12-kind list (Section 03, could equally be 12 kinds raw with a search affordance); `slides_link_or_embed` as a single field rather than separate `slides_link` and `slides_embed` (Section 04, simpler v1).

Two earlier sub-decisions (facilitator enumeration of named people; alumni state as a 4-value enum) have been superseded by Owen's 2026-05-13 resolutions — schema is now people-agnostic via `facilitator_roles`, and alumni live alongside students via `audiences`. See changelog and Section 09 (Resolved).

End of PRD.
