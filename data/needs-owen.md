# Needs Owen

Running scratchpad of items where Cowork hit a decision that should not be made unilaterally. Owen triages.

Created: 2026-05-15
Last update: 2026-05-15 (Phase 1: ADAPT vocab + working agreement)

---

## Resolved (kept here for audit trail)

### ADAPT vs. the canonical micro-cycle — RESOLVED

- **Decision**: ADAPT (Analog → Dialogue → Adjust → Produce → Test) is the locked student-facing brand. `ai_loop` fields keep the canonical Stacey names (analog / structure / output / final / reality_check). Mapping documented in the AI tooling block's notes.
- **Action item for Owen**: discuss the mnemonic with Stacey on Monday. ADAPT one-pager needs creation before delivery (referenced as TBD in the AI tooling block).

### Specialty track names — RESOLVED (action remains)

- **Decision**: Market (per PROJECT.md, confirmed). All slide content uses Market.
- **Action item for Owen**: update the Notion "HLV Curriculum — Active Design" page from "GTM" to "Market" post-Monday. Onboarding doc for new Claude instances.

### Working agreement — RESOLVED

- **Decision**: lives as a single student bullet in Entrepreneurship intro (BE PRESENT, EXPRESS POV, WRITE INSIGHTS, OPEN-MINDED, MOVE FORWARD WITH CONSENSUS, plus ELMO). Also produce as a physical wall artifact at the venue per the block's notes.

---

## Schema / workbench

### `ai_loop.output` field semantics

- **Status**: deferred per Owen's call (decision #3).
- **Issue**: Schema field description says `output: "The working artifact"`. Owen's brief mapping puts process-language ("Iterate with AI until the pitch sounds like you") into this field. Reads weird.
- **What I did**: populated as Owen specified, flagged in block notes.
- **Decision needed**: separate schema rename workstream, post-Monday.

### Track block labels — RENAME during priority batch (BLOCKED on name discrepancy)

- **Status**: blocked, needs Owen call before priority batch can proceed.
- **Original decision (Owen's #5)**:
  - Product: Solution Blueprint → MVP Scoping → **Prototype Build** (Mon PM / Tue AM / Wed AM Wk2)
  - Business: **The Case** → **Canvas Lite** → 100-Day Plan
  - Market: Landscape Map → Validation Design → First Moves
- **Discrepancy discovered (2026-05-15 priority batch prep)**: 3 of the 9 names don't match the actual built worksheets in `ACTIVITIES`.

| Code | Owen's stated rename | Actual `ACTIVITIES.name` |
|---|---|---|
| P1 | Solution Blueprint | Solution Blueprint ✓ |
| P2 | MVP Scoping | MVP Scoping ✓ |
| P3 | Prototype Build | **Prototype Spec Sheet** |
| B1 | The Case | **Canvas Lite** |
| B2 | Canvas Lite | **Back-of-Napkin Economics** |
| B3 | 100-Day Plan | The 100-Day Plan ✓ |
| M1 | Landscape Map | Landscape Map ✓ |
| M2 | Validation Design | Validation Design ✓ |
| M3 | First Moves | First Moves ✓ |

- **Root cause**: Owen's stated rename list came from the stale `blocks-needing-content.md` (generated 2026-05-01 from a stale blocks-index). `ACTIVITIES` is the current truth.
- **What I did**: paused the priority batch. Did NOT apply mismatched names. Need Owen to decide:
  - **Option A**: keep ACTIVITIES names as-is (P3=Prototype Spec Sheet, B1=Canvas Lite, B2=Back-of-Napkin Economics). Schedule blocks adopt these labels via `code` linkage.
  - **Option B**: rename ACTIVITIES worksheets to match Owen's intent (P3→Prototype Build, B1→The Case, B2→Canvas Lite). This is a content edit on the worksheets, not just labels.
  - **Option C**: keep ACTIVITIES names AND keep generic schedule block labels (no rename), let students discover worksheet names when they open them.
- **Recommendation**: Option A. The worksheets are built and the names are in the wireframes. Renaming them mid-flight creates churn.

---

## Sponsor / guest format

### Guest: Product (Wk2 Mon AM)

- **Status**: [INVENTED] foundation, needs guest selection.
- **Block**: `Wk2 Mon AM` 11:15-12:00, 45 min.
- **What I did**: drafted a generic "guest practitioner from a product role talks about their working process, focus on the Adjust step" framing. Format spec: 5 min intro, 20 min talk, 20 min Q&A. Pre-brief asks the guest to speak about real working process, not portfolio.
- **What's needed from Owen**: confirm guest, name in references, possibly tweak framing if guest's actual angle is different.

### Guest: How to pitch (Wk2 Thu AM)

- **Status**: [INVENTED] foundation, needs guest selection.
- **Block**: `Wk2 Thu AM` 11:00-12:00, 60 min.
- **What I did**: drafted a generic "pitch coach who pitches for a living" framing. Angle: opens, anti-patterns, "one thing they wish more pitches answered." Format spec: 25 min talk, 25 min Q&A. Pre-brief asks the guest to focus on what students can apply tomorrow, not theory.
- **What's needed from Owen**: confirm guest, name in references, possibly tweak angle if their natural pitch is different.

---

## 2026 blocks without 2025 source AND no obvious draft path

(Empty — flag here as encountered during weekend run)

---

## Other ambiguities

(Empty — flag here as encountered during weekend run)
