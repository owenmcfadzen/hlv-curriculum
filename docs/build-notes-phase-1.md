# Build notes — Phase 1.0

Ambiguities and small calls made while building the minimal View B for Wk2 Tue. Capturing here so Owen can review without me blocking on him during the session.

## Discrepancy: "12 blocks" vs actual 9 items on Wk2 Tue

Both the PRD (§10, named first task) and the build-session brief say:

> "renders the 12 blocks (AM + PM)"

The actual `SCHEDULE.weeks[1].days[1]` has **9 entries**: 7 SCHEDULE blocks + 2 phase-marker entries (`PHASE 1 · RECONNAISSANCE`, `PHASE 2 · BUILD & SCOPE`).

Render choice for Phase 1.0:
- The 7 blocks render as clickable cards with derived ids (`w2-tue-am-p1`, `w2-tue-pm-team-teach-synthesis-hinge`, etc.).
- The 2 phase markers render inline as small uppercase dividers between cards — they preserve the day's chronological reading but are not clickable (consistent with PRD §02: "phase markers have less to show").

If the "12" figure was correct and the underlying day data is missing blocks (lunch, breaks, an alumni-parallel session that hasn't been encoded yet, the 2pm hinge as a distinct slot vs the team-teach block), that is a Phase 6 content gap rather than a Phase 1.0 view bug. Flagging so it can be reconciled before further View B work.

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
