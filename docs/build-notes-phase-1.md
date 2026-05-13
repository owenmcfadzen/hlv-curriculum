# Build notes — Phase 1.0

Ambiguities and small calls made while building View B for Wk2 Tue. Capturing here so Owen can review without me blocking on him during the session.

## Mid-session scope shifts (three rounds)

Initial Phase 1.0 brief was deliberately minimal: a single-day chronological list with click-logs-id. Shipped that as `feat(view-b): minimal day view for Wk2 Tue (phase 1.0)`.

**Round 2.** Owen redirected with a reference image (master-detail + filter bar + parallel-track columns + Overview/Slides/Analog tabs) and the note that the redo should not match the existing workbench aesthetic. Rebuilt as `feat(view-b): destination master-detail shape`.

**Round 5.** Owen reshaped the role taxonomy and asked for more readable density:

- Calendar should take more room — labels were too cramped in the two-week view.
- The filter list was missing Alumni as a primary role. The right taxonomy is **Roles**: Student / Alumni / Facilitator 1 / Facilitator 2 / Sponsor / Guest. Alumni and Student are audience types (orthogonal to Tracks); both can carry a Product/Business/Market track.

Result this commit:

- Density: filter-bar + kind-legend padding pulled in; calendar shell padding reduced to 14×14; day columns bumped from 132 → 150 px min-width; card label up to 12 px with 4 lines clamp; redundant "·kind" text dropped from the time eyebrow since the color already encodes it. The two-week view now flows wider than the viewport on narrow screens (horizontal scroll on the outer shell), trading edge-clipping for readability.
- Filter bar Role group replaced by the six roles above. Audiences default to `["student", "alumni"]` on every block; facilitator default is `["f1"]`; sponsor defaults true on `kind: "sponsor"` blocks; guest defaults true on `kind: "panel"`. Filter dim works against those defaults — clicking Alumni doesn't dim anything by default (everyone is alumni-capable), but clicking Student dims any block you've explicitly set to `audiences: ["alumni"]`.
- Edit form gains checkbox groups for Audiences (Student, Alumni), Facilitators (F1, F2), and one-off booleans for Sponsor / Guest. Save merges arrays + booleans into the localStorage patch.
- Each calendar block can render a small `ALUMNI` or `STUDENT` chip in its corner when audiences is constrained to one side, so single-audience blocks are visible without opening the panel.
- The Overview tab in the detail panel replaces the Lead-facilitator / Assistant Phase-6 placeholders with the actual computed Audiences / Facilitators / Sponsor / Guest values. Buffers and Produces/Feeds/Success stay as muted placeholders for now (not yet editable — flagged for next round).

**Round 4.** Owen pulled five improvements from the calendar version:

- Drop People filter (roles capture the same dimension).
- Color every block by its `kind` (and keep track-color left edges for track blocks) — the 12 KIND_LEGEND classifications should be scannable at a glance.
- Add a one-week view alongside the two-week program view.
- Make the detail panel editable: time length, Google Slides embed, etc. — bigger ask, expected partial answer.
- Show a colour key for the classifications.

Round-4 result, in this commit:

- People filter removed; `ROSTER` const deleted with it.
- `vb-cal-block[data-kind="..."]` colors land on every block using the existing `--k-*` tokens as light-tint backgrounds and saturated left borders. Track blocks override the kind border with their track color. A `.vb-kindlegend` strip sits directly under the filter bar listing every kind + the three tracks with matching swatches.
- View switch chips in the filter bar (Program / Wk 1 / Wk 2). URLs: `?view=week` (two-week program), `?view=week&w=1`, `?view=week&w=2`. `?view=day&d=...` unchanged.
- Edit flow: each block in View B's detail panel has an `Edit` button. The form covers label, kind, track, time start, time end, sub, and `slides_link_or_embed`. Save validates HH:MM, writes to `localStorage["hlv-vb-overrides-v1"]`, and re-renders. A `Reset` chip appears on any block that has an override; clicking it deletes that block's patch and re-renders. The calendar layout reads override `time_start`/`time_end` directly (bypassing the uniform-spread fallback) so changes show up immediately in the time axis. The Slides tab parses Google Slides URLs of the form `docs.google.com/presentation/d/{ID}/edit` and renders the deck inline at `/{ID}/embed`; non-Slides URLs render as plain links with a help line.

Out-of-scope for this round (named in build notes for the next session):

- Drag-to-resize on the calendar surface.
- Editing the prose fields (`slide.foundation`, `slide.students[]`, `slide.facilitator`, `slide.references[]`) and the Phase 6 destination fields (`facilitator_roles`, `audiences`, `prep_buffer_minutes`, etc.).
- Undo / multi-step history.
- Export the localStorage overrides back into `SCHEDULE` (durable persistence — right now edits live only in the browser that made them).

**Round 3.** Owen reframed the whole tool:
- Two-week calendar is the **entry point**, not the day view.
- The "calendar has to be more like a calendar" — time on the y-axis, blocks positioned by clock, not slot indices.
- A **People** filter at the top, capable of highlighting one person's path through the whole program.
- This is a standalone tool for facilitator team, not a Workbench extension — no Decisions/Layers/Flow language carries over.

Current state delivers all four:
- `?view=week` (now the default entry for the tool) renders a 10-day calendar grid with time rail on the left and one column per day. Blocks position via the hardcoded uniform spread (PRD §07) until Phase 6 adds real `time_start`.
- `?view=day&d=wN-day` renders the same calendar primitive as a single tall column on the left, with the detail panel on the right.
- Both views share one filter bar. Track is live; People shows Owen/Stacey/Cate (stub seed from PROJECT.md) and dashed/disabled until `ROSTER[i].blocks` is populated; Role and Moment also dashed/stubbed.
- Phase markers (`groupLabel` entries) suppress in the compact 2-week view (too dense) and render as small banners in the day view at their slot boundary.

Result: the View B in `index.html` is now the destination shape from PRD §02/§03/§06, populated with what data exists today:

- **Filter bar** (top): Track filter is live (Product/Business/Market dim non-matching blocks per PRD §03 "highlight, not remove"). Role and Moment buttons are present but stubbed — dashed border, disabled, tooltip explains the field doesn't exist in schema yet. Clear-filters affordance.
- **Timeline (left)**: day header with breadcrumb, theme, lead. AM/PM lanes with uniform-spread clock times (09:00–12:00, 13:00–17:00 per PRD §07). Consecutive `kind: "track"` blocks fold into one slot rendered as parallel columns (P1/B1/M1 share a slot, P2/B2/M2 share a slot, Team Teach is full-width). Phase markers render between slots as small dividers.
- **Detail panel (right)**: time window, title, tags (code, track, kind, status), tabs (Overview default, Slides, Analog). Overview shows all Phase-6 placeholder fields (lead facilitator, assistant, prep/debrief buffers, produces, feeds, success criteria) with an italic muted "Phase 6" note, then the actual `slide.{foundation, students, facilitator, references}` content where present, plus the linked `ACTIVITIES[code]` fold for track blocks. Slides tab degrades to the slide outline; Analog tab renders `ACTIVITIES[code].wireframe` SVG via existing `renderWireframe()`.

Visual direction: sans-serif Barlow, near-white background (`#FAFAFB`), 14px body, dense type, dashed borders for stubbed filter buttons, no decorative bars. Deliberately not the workbench artifact's warm tone, deliberately not the reference image's serif-cream. If the visual reads wrong, that's where to push back.

## Discrepancy: "12 blocks" vs actual 9 items on Wk2 Tue

Both the PRD (§10, named first task) and the build-session brief say:

> "renders the 12 blocks (AM + PM)"

The actual `SCHEDULE.weeks[1].days[1]` has **9 entries**: 7 SCHEDULE blocks + 2 phase-marker entries (`PHASE 1 · RECONNAISSANCE`, `PHASE 2 · BUILD & SCOPE`).

Render choice: 7 blocks render as clickable cards, 2 phase markers render as inline dividers between slots. The reference image Owen shared shows ~5 blocks for Day 01 Monday + a parallel alumni track at the 10:30 slot, so the "12" figure may have come from a different mockup, not from the actual Wk2 Tue data. If lunch / breaks / 2pm-hinge-as-its-own-slot / alumni-parallel should be present as actual block records, that's a Phase 6 content addition, not a view bug.

## Block id derivation (no schema fields added)

Phase 1.0 says "no new schema fields" but the click handler needs `block.id`. Derived at render-time using the PRD §04 format `wN-day-am|pm-slug` where:
- `slug` = `block.code` lowercased when present (so `P1` → `w2-tue-am-p1`)
- otherwise a slugified `block.label` (so `Team Teach (synthesis hinge)` → `w2-tue-pm-team-teach-synthesis-hinge`)

When Phase 6 adds the canonical `id` field to schema, the renderer should prefer `block.id` over the derived form. The renderer call site (`viewBBlockId`) is the only thing to change.

## Status fallback for `track` blocks

Existing `buildDetailIndex()` runs before `renderViewB()` and assigns `_slideStatus` to every block (sources from `ACTIVITIES[code].slideStatus` for track blocks, from `block.slide.status` otherwise). Phase 1.0's renderer reads `_slideStatus` so it stays consistent with how the rest of the workbench computes status — no parallel rule.

## Out-of-scope drift noticed (not addressed)

While doing the §00 PROJECT.md cleanup, noticed several other files that `ARCHITECTURE.md`'s file-layout table marks "Private repo" but are currently tracked in the public repo:

- `data/blocks-index.json`
- `data/blocks-needing-content.md`
- `data/porto-extraction.json`
- `data/porto-mapping.json`

Section 00 of the PRD only names `PROJECT.md` (and `HANDOFF.md` is already absent). I removed only `PROJECT.md` and added a defensive gitignore for `PROJECT.md` + `HANDOFF.md`. The four `data/` files are a larger cleanup decision (they may carry porto sponsor content that should leave the public repo) — not done here. Flag for a separate pass.

## Activation

Phase 1.0 view is activated by query string only:
`index.html?view=day&d=w2-tue`

The dispatcher (`tryRenderViewB`) parses `d=` generically (`w[12]-(mon|tue|wed|thu|fri)`), so any day already encoded in `SCHEDULE`/`DAYS` will render. No special-casing of Wk2 Tue in the code path — just in the call to render that the brief targets.

Without the query string, the page falls through to the existing workbench unchanged. No regression to Page / Slide / Print modes.
