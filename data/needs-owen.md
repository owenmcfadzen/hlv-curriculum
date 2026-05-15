# Needs Owen

Running scratchpad of items where Cowork hit a decision that should not be made unilaterally. Owen triages.

Created: 2026-05-15
Last update: 2026-05-15 (post overnight run, flushed)

---

## Overnight commit log

Owen: commit these in order when you wake up. Each is staged on disk, ready for `git add` + `git commit` + `git push`. Validate before each.

1. [ ] **Commit 5: `content: Wk1 Tue (problems, modules, panels)`**
   - Files touched: index.html, data/needs-owen.md
   - Notable: 10 blocks. Swag pitch gets first solo `ai_loop` per Owen's brief. Game slot uses Go Bananas (post-lunch energizer). Customer panelists carry through Mon PM → Tue AM → Tue PM (same people, third encounter).

2. [ ] **Commit 6: `content: Wk1 Wed (solutions, top solutions, pitch prep)`**
   - Files touched: index.html
   - Notable: 11 blocks. Problem Reframing (Notion gold) carries the morning. Pitch template + prep set up Thu's RC: Pitch speed dating (already ready).

3. [ ] **Commit 7: `content: Wk1 Thu/Fri (pitches, voting, allocation)`**
   - Files touched: index.html
   - Notable: 14 blocks. Three Pitches blocks Thu (AM + PM x2) deliberately differentiated by audience tier (peers / mentors-staff / external-alumni-sponsor). Fri AM populates 3-tracks intro → Repitch the 5 → Preferences pipeline. Dinner + External team activity already drafted, left alone.

4. [ ] **Commit 8: `content: Wk1 Mon PM remaining + Wk1 remaining Welcome/Game blocks`**
   - Files touched: index.html
   - Notable: Wk1 Mon PM 5 blocks (Challenge Q&A, Game, Customer panel, Debrief: problems, Swag challenge intro). All other Welcome/Game blocks across Wk1 already drafted in prior commits. Alumni Wk1 arc untouched (already drafted).

5. [ ] **Commit 9: `docs: session-summary-2026-05-15 + final needs-owen.md flush + cleanup`**
   - Files touched: data/needs-owen.md, data/session-summary-2026-05-15.md (new), data/block-drafts/ deletions
   - Notable: Session summary covers full overnight run. Cleanup: `git rm data/block-drafts/w2-fri-pm-final-pitches.md` (explicitly superseded). Other block-drafts can also be removed at Owen's discretion (see session summary).

6. [ ] **Commit 10: `content: guest framing per Cate brief (3 blocks)`**
   - Files touched: index.html, data/needs-owen.md
   - Notable: 3 Guest blocks reframed per Owen's evening Cate brief. Wk1 Wed AM renamed `Guest: valuable idea?` → `Entrepreneur Story` (founder narrative). Wk2 Mon AM renamed `Guest: Product` → `Guest Talk` (last year's Lisbon product guy returning). Wk2 Thu AM `Guest: How to pitch` keeps label, gains interactive-beat requirement. All `[INVENTED]` tags removed. Guest selection stays open (contacts pending).

After all 6 commits land:
```bash
git push
```

---

## Open items — by priority

### P0 — block delivery prep (sponsor confirms by 8 Jun hard floor)

**1. Sponsor selection** (Sonae vs. JdM)
- Status: hard floor 8 Jun.
- Used as `[SPONSOR — TBD between Sonae and JdM, hard floor 8 Jun]` placeholder in references throughout. ~6 blocks reference the placeholder.
- Action: confirm sponsor, replace placeholder via global find/replace.

**2. Customer panelist recruitment**
- Status: 4 panel encounters across Wk1 reference `[CUSTOMER PANELISTS — TBD]`.
- Same panelists across all 4 (Mon PM Customer panel, Tue AM Revisit panel, Tue PM Panel: validation, Wed PM Panel: solution validation).
- Action: confirm recruitment + brief.

### P1 — block facilitator prep

**3. Guest Talk** (Wk2 Mon AM 11:15-12:00) — was "Guest: Product"
- Status: framing locked per Owen's Cate brief. Contact pending.
- Drafted angle: same product guy from Lisbon 2025 (local, Stanford grad, gave the strong product talk). Owen is pulling his contact.
- Action: confirm contact, replace `[GUEST — Lisbon 2025 product guy, contact pending Owen]` placeholder in references.

**4. Guest: How to pitch** (Wk2 Thu AM 11:00-12:00)
- Status: framing locked per Owen's Cate brief. Guest TBD.
- Drafted angle: pitch coach, comms person, storyteller, or founder known for clarity. Focus on story structure plus what makes the problem land in 3 minutes. Not slide design, not investor decks. Interactive: students bring real material, guest reacts.
- Time slot is 60 min vs. Owen's 30-45 spec — extra time accommodates interactive segment; can compress if guest is shorter form.
- Action: identify guest, replace `[GUEST — TBD: pitch coach, comms, storyteller, or clarity-known founder]` placeholder.

**5. Entrepreneur Story** (Wk1 Wed AM 11:00-11:30) — was "Guest: valuable idea?"
- Status: framing locked per Owen's Cate brief. Guest TBD.
- Drafted angle: early-stage founder telling actual journey (first users, validation, what nearly broke). Bar is narrative over expertise. Last year's product guy worked because he could tell the story.
- Action: identify founder, replace `[GUEST — TBD: early-stage founder, narrative-strong]` placeholder.

**6. ADAPT methodology one-pager** — needs creation before delivery
- Status: TBD, referenced in 4 blocks (Mon AM AI tooling, Tue AM Swag pitch, Wk2 Mon AM Week 2 Flow, Wk2 Thu PM Narrative Time).
- Action: write a one-page student handout that introduces ADAPT (Analog/Dialogue/Adjust/Produce/Test) with the canonical mapping note for facilitators.

### P2 — content surface alignment

**7. Notion "HLV Curriculum — Active Design" page** still says "GTM"
- Status: stale (last updated April 21).
- PROJECT.md retired GTM in favor of Market. Workbench schema and SCHEDULE both use Market.
- Action: update Notion page (5 min edit). Onboarding doc for new Claude instances.

**8. ADAPT vs. canonical micro-cycle** — for Stacey discussion Monday
- Status: locked decision but worth confirming with Stacey.
- Decision: ADAPT (Analog/Dialogue/Adjust/Produce/Test) is the student-facing brand. ai_loop fields keep canonical Stacey names (analog/structure/output/final/reality_check).
- Mapping documented in AI tooling block notes + STANDARDS.md.
- Action: Stacey conversation Monday. If she pushes back, the rename is reversible.

### P3 — deferred workstreams

**9. Schema rename for `ai_loop` field semantics**
- Status: deferred per Owen's decision #3.
- Issue: `output: "The working artifact"` field receives process-language ("Iterate with AI until the pitch sounds like you"). Reads weird.
- Action: separate schema rename workstream, post-Monday.

### P4 — verifications (low urgency)

**10. Audience tier scoring decision** (Wk1 Thu pitches)
- Status: drafted the 3 Pitch rounds as escalating audience tiers (cohort peers → mentors/staff → external/alumni/sponsor) per contextual logic.
- The existing `ready` RC block references "Audience tier scoring decision — see §4" but §4 isn't accessible to Cowork.
- Action: verify tier composition matches actual scoring methodology.

**11. Customer panelist continuity** (Wk1 panel encounters)
- Status: drafted on assumption that same panelists carry through 4 encounters (Mon PM → Tue AM → Tue PM → Wed PM).
- Action: confirm with whoever recruits panelists.

---

## Resolved (audit trail)

### ADAPT vs. canonical micro-cycle — RESOLVED

- **Decision (2026-05-15)**: ADAPT is the locked student-facing brand. ai_loop fields keep canonical Stacey names. Mapping documented.

### Specialty track names — RESOLVED (action remains)

- **Decision (2026-05-15)**: Market (per PROJECT.md, confirmed). All slide content uses Market.
- **Action item**: update Notion Active Design page (item #7 above).

### Working agreement — RESOLVED

- **Decision (2026-05-15)**: lives as a single student bullet in Entrepreneurship intro (BE PRESENT, EXPRESS POV, WRITE INSIGHTS, OPEN-MINDED, MOVE FORWARD WITH CONSENSUS, plus ELMO). Also produce as a physical wall artifact at the venue.

### Specialty round labels (rename mismatch) — RESOLVED

- **Decision (2026-05-15)**: Option A. Schedule blocks adopt ACTIVITIES names. P3=Prototype Spec Sheet, B1=Canvas Lite, B2=Back-of-Napkin Economics. The 3 stated rename mismatches in Owen's brief came from stale `blocks-needing-content.md`.
- **Action item**: none (resolved by following ACTIVITIES truth).

### Specialty round display labels (code duplication bug) — RESOLVED

- **Decision (2026-05-15)**: stripped `code · ` prefix from labels (e.g., "P1 · Solution Blueprint" → "Solution Blueprint"). Code field stays for grid badge linkage. Cleaner data/display separation.

### Notes UI scope (edit/delete) — RESOLVED

- **Decision (2026-05-15)**: append-only insufficient for Stacey's collaborative use. Edit + delete shipped. Author preserved across edits. ts updates. `edited: true` flag added.

### Migration timestamp future-dating bug — RESOLVED

- **Decision (2026-05-15)**: backdated migration ts from `22:00:00Z` to `18:00:00Z` so future edits sort newer.
- **Standard**: new notes use realistic current ts (`2026-05-15T22:30:00Z` for this session). Documented in STANDARDS.md.

### Empty-state notes affordance — RESOLVED

- **Decision (2026-05-15)**: subtle `+ Add note` button on every block (no notes section header until first note). Click expands inline form. Submit transitions block to populated state.

---

## Companion files

- `data/STANDARDS.md` — locked content standards (voice, field shape, ai_loop, em-dash rule, emoji rule, drafted/INVENTED tagging)
- `data/session-summary-2026-05-15.md` — full overnight run summary (block counts, commits, patterns, triage order)
- `block-drafts/*.md` — superseded but retained for reference. Removable per session summary §"Anything skipped or flagged for next iteration".
