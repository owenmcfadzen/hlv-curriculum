# Build notes — Phase 1.0

Ambiguities and small calls made while building View B for Wk2 Tue. Capturing here so Owen can review without me blocking on him during the session.

## Mid-session scope shift: minimal list → destination master-detail

Initial Phase 1.0 brief was deliberately minimal: a single-day chronological list with click-logs-id. Shipped that as `feat(view-b): minimal day view for Wk2 Tue (phase 1.0)`. Owen then redirected with a reference image (master-detail + filter bar + parallel-track columns + Overview/Slides/Analog tabs) and the note that the redo should not match the existing workbench aesthetic.

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
