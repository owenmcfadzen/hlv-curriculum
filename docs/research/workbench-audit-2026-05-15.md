# Workbench Audit — 15 May 2026

Author note (Cowork): I am the author of most slide content audited here. This is an inside view, not external review. Treat dimension scores as self-reported and stress-test in the browser before acting on them.

---

## Summary

The workbench is functionally complete: every clickable block has slide content, the SCHEDULE renders, the validator is clean, the notes UI works for collaborative editing. **Strong**: methodology is coherent (ADAPT applied where it belongs, canonical 4-step in field semantics, cross-block dependencies surfaced in facilitator notes), voice is consistent enough that Stacey can scan without wincing. **Weak**: 7 categories of generic-feeling templated content (Welcome blocks, Game blocks), 3 invented-then-reframed Guest blocks still need real contacts, time pacing assumptions weren't stress-tested against cohort size, the 240-min Thu PM block lacks internal structure, and Cowork's own notes are sometimes verbose where one sentence would do. The work is closer to "ready for Stacey walkthrough" than "ready for delivery". Saturday Owen should invest in: 1) walkthrough with Stacey to surface what falls apart in conversation, 2) the 3 Guest contacts, 3) compressing the long blocks. Slide production and design library work are real but should not displace the walkthrough.

---

## Dimension 1: Content depth and quality

**Score: 4/5.** Comprehensive coverage, voice mostly consistent, but with thin spots Cowork should call out before Stacey does.

### Coverage

- 90+ blocks total. Every clickable block in SCHEDULE has either a populated `slide` field (for non-track blocks) or `ai_loop` populated with `code` linkage to ACTIVITIES (for track blocks). Zero remaining stubs.
- 12 blocks have `ai_loop` populated (Mon AM AI tooling, Tue AM Swag pitch, 9 Wk2 specialty rounds, Thu PM Narrative Time).
- 3 blocks (`ready` status) untouched: RC: Pitch speed dating, RC: Market executes, Tue PM Team Teach synthesis hinge.

### Voice consistency

Spot-check of 10 blocks across the program against STANDARDS.md voice rules (matter-of-fact, compressed, smart-teen audience, no LinkedIn energy):

| Block | Voice score | Note |
|---|---|---|
| Wk1 Mon AM Welcome | 5 | "Warm, direct, no corporate energy" — sets bar |
| Wk1 Mon PM Sponsor briefing | 5 | "The seed for everything Week 1 students do" — concrete |
| Wk1 Tue AM Swag pitch | 5 | ADAPT applied cleanly, "stakes intentionally low" lands |
| Wk1 Wed AM M: Solutions | 4 | Solid but the "6 reframings" reference assumes Notion lookup |
| Wk1 Thu AM Welcome | 5 | "Pitch day. Energy matters" — punchy |
| Wk1 Thu PM Pitches Round 1 | 3 | Functional but dry, reads like format spec not voice |
| Wk2 Mon PM SA3 | 4 | "Don't accept 'no one is solving this'" works |
| Wk2 Tue PM Out in Market | 5 | "5 conversations per team minimum" is the right voice |
| Wk2 Wed AM Sponsor Feedback | 5 | "Stakeholder, not judge" framing is strong |
| Wk2 Thu PM Narrative Time | 4 | Foundation good, facilitator notes are long |

**Average: 4.5.** The dry blocks are the 3 Pitch rounds Wk1 Thu — they were drafted late in the run when I was tightening output and the round-robin format made them repetitive. Worth a Saturday rewrite if Owen has 30 min.

### Source citation

References cite Notion entries by name + scope (e.g., "Stakeholder Mapping (Notion: Knowledge / Foundation)"). Format is consistent. Three citation patterns Owen should know about:

- **Real Notion entries**: most references. If Stacey clicks one and the Notion title differs (e.g., Notion folder uses an emoji prefix), the reference still resolves but isn't a hyperlink — these are textual citations, not URLs.
- **TBD placeholders**: 4 blocks reference an "ADAPT methodology one-pager (TBD: needs creation before delivery)". Real action item, logged in needs-owen.md.
- **Cross-block references**: many facilitator notes call out downstream blocks by label (e.g., "Wed PM Out in Market #2"). These build the connective tissue but assume the reader knows the schedule. Stacey will, but a new facilitator might not.

### Specific blocks worth highlighting

**Strong (lift the pattern)**:
- **Wk2 Mon PM Out in Market** (priority batch #1 era, before I tightened too far): foundation lands the "designed to be uncomfortable" framing, students bullets are action-verb-led, facilitator notes have explicit timing + the 5-conversation hard floor.
- **Wk2 Mon PM SA3 → SA4 → P1/B1/M1 specialty round 1**: the cross-block chain is explicit ("SA3 feeds M1 ai_loop.analog", etc.). This is the connective tissue model that should propagate.
- **Wk1 Mon AM AI tooling, PRD, intro pitch**: ADAPT mnemonic introduced, 5 student bullets walk through all 5 letters, facilitator timing is explicit, ai_loop populated, notes capture the mapping decision. Highest-density single block in the workbench.

**Weak (worth Saturday revision)**:
- **3 Wk1 Thu Pitches blocks**: redundant in structure, mostly differentiated by "Round 1/2/3 audience tier" sub-labels. Could be tightened to 2 blocks (or differentiated more sharply).
- **Game blocks**: I picked one game per slot (Rollercoaster, Two Truths, Go Bananas, Storytelling Roulette, Yes And) per STANDARDS.md decision #8, but the picks were thin. Owen + Stacey should swap 2-3 of these for actual energizers they trust.
- **Wk2 Mon AM Welcome**: standard template, but 30 min is generous for a "team-seating shuffle plus orientation." Could compress to 15 min (matching Tue/Wed/Thu/Fri AM Welcomes) and reclaim 15 min for Week 2 Flow PRD walkthrough which is dense.

---

## Dimension 2: Connective tissue (block-to-block flow)

**Score: 3.5/5.** Strong inside the SA spine and specialty round chain. Weaker across the panel encounters and pitch blocks.

### Where flow is explicit

- **SA spine (SA1 → SA2 → SA2.5 → SA3 → SA4)**: every block references prerequisites and downstream consumers. SA2's facilitator note says "Feeds Wk2 SA2.5 reanchor and the prototype build (P1 Solution Blueprint cites this 8-frame journey explicitly)."
- **Specialty round chain (Round 1 → Round 2 → Round 3)**: ai_loop.analog fields explicitly chain ("P2 MVP scope plus Mon PM PRD draft", "P3 takes P2 MVP scope plus Tue PM Out in Market #1 findings"). The progression is visible from the data.
- **Out in Market → Debrief**: each OiM block references its corresponding Debrief block and vice versa.
- **Mon PM input → Tue AM friction-candidate → Tue PM problem statement → Wed AM solution → Thu pitch**: I documented this chain in facilitator notes inline.

### Where flow is missing

- **Customer panelists across 4 encounters** (Mon PM Customer panel, Tue AM Revisit panel, Tue PM Panel: validation, Wed PM Panel: solution validation): I assumed same panelists carry through and noted this in block-level notes. This should be explicit in the SCHEDULE itself (e.g., a `panel_continuity_id` field or a sub-label like "third encounter, same panelists"), not just buried in notes. Logged in needs-owen.md.
- **Welcome blocks** don't reference each other across days. Each Welcome stands alone. The pattern is templated but the cross-day arc (Mon = orientation, Wed = stuck-students-check, Thu = pitch-day-anxiety, Fri = post-voting tone) isn't visible from the workbench.
- **Pitch blocks Wk1 Thu** (3 of them, plus Voting + Reflection) have audience tier sub-labels but the escalation isn't visible in the schedule grid. Stacey would need to drill into each block to see "Round 1 = peers, Round 2 = mentors, Round 3 = external". A dashboard/timeline showing audience composition across the day would help.
- **Alumni blocks** reference student blocks via `parallel_to` but the inverse isn't true — student blocks don't acknowledge alumni running parallel. F2 facilitator role is encoded, but the signal is one-directional.

### Specific connective tissue gaps

1. **Wk1 Mon AM "Entrepreneurship intro" → Wk1 Mon AM "AI tooling, PRD, intro pitch"** — the working agreement (BE PRESENT etc.) added to Entrepreneurship intro should be reinforced in AI tooling's facilitator note ("the working agreement applies to ADAPT loops too"). It isn't.
2. **Wk1 Wed PM "Pitch template" → Wk1 Thu AM "RC: Pitch speed dating"** — Wed PM Pitch prep references the Thu AM RC, but Thu AM RC (`status: ready`, untouched) doesn't reference back. This is fine because RC is locked, but worth flagging.
3. **Wk2 Wed PM "Team Alignment" → Wk2 Wed PM "Out in Market #2"** — these are sequential, both reference each other in facilitator notes, but the SCHEDULE grid doesn't visually distinguish "convergence block" from "field test." Sub-labels help but the kinds (`teamteach` vs `work`) don't match the facilitation reality.

---

## Dimension 3: Schedule structure and pacing

**Score: 3/5.** Time budgets are reasonable on average but weren't stress-tested against actual cohort size. Two long blocks need internal structure.

### Day-by-day time budget

| Day | Total | Blocks | Energy curve concern |
|---|---|---|---|
| Wk1 Mon | ~7.5 hr | 11 | Heavy intake day (sponsor + customer panel + entrepreneurship intro). Long but appropriate for Day 1. |
| Wk1 Tue | ~7 hr | 12 (incl. alumni) | Problem dive. Game at 14:30 reset works. |
| Wk1 Wed | ~7.5 hr | 12 (incl. alumni) | Solution + pitch transition. Game + Pitch game = double break, possibly redundant. |
| Wk1 Thu | ~7 hr + dinner | 11 | 3 pitch rounds in one day is heavy. Reflection block at end is right. |
| Wk1 Fri | ~7 hr + external evening | 9 | Lighter day, team formation. Pace is right. |
| Wk2 Mon | ~7 hr | 10 (incl. alumni) | Setup + SA spine + specialty round 1. Densest pure-content day. |
| Wk2 Tue | ~7 hr + field | 9 | Specialty round 2 + Out in Market. The 3-hr OiM is appropriate but exhausting. |
| Wk2 Wed | ~7 hr + field | 9 | **Highest-pressure day**: Sponsor Feedback + Round 3 + OiM #2 in 8 hours. I flagged this in the Wed AM Welcome notes but it's worth Owen's separate attention. |
| Wk2 Thu | ~12 hr (with late session) | 5 | LPP TIME (105 min) + Narrative Time (240 min) + optional late session (240 min) = potentially a 12-hour day. Burnout risk. |
| Wk2 Fri | ~7 hr | 8 | Pitch day. Energy management explicit in Welcome notes. |

### Long blocks worth attention

- **Wk2 Thu PM "LPP TIME — Narrative Time" (240 min)**: I drafted internal structure (30 min framing, 60 min Analog+Dialogue, 90 min Adjust loops, 45 min Produce, 15 min share-back) but 4 hours of focused work is hard. This needs at least one explicit break embedded in the block, not assumed. Owen should consider splitting into "Narrative Time A" (afternoon) + break + "Narrative Time B" (evening) or formalizing a coffee break at 15:00.
- **Wk1 Thu PM "Voting" (60 min)**: voting itself takes 10 min; the other 50 min is "review and reflect on pitches." Could compress to 30 min and add a longer Reflection at the end.
- **Wk2 Mon PM specialty rounds (105 min)**: P1/B1/M1 each run 105 min. Reasonable for first round but no internal break encoded. Specialists may need a 5-min stretch between Dialogue and Adjust phases.

### Energy curves

Every day has a Welcome (low-energy open) → work block (focus) → game (energy reset) → work block (focus) → reflection or transition. Pattern holds across the program. The Wk2 Wed pressure-stack is the exception — Welcome (low) → Sponsor Feedback (high) → Specialty Round 3 (focus) → Team Alignment (high) → OiM #2 (high) → Debrief (medium). 5 high-pressure events back-to-back. Consider a deliberate energizer block after Sponsor Feedback or before OiM #2.

### Break placement

**Implicit breaks only.** No explicit break blocks in SCHEDULE. Coffee breaks, bathroom breaks, transition time are presumably embedded in the time_end → time_start gaps, but those are 0 minutes in most cases (e.g., Mon PM Sponsor briefing 13:00-13:45 → Challenge Q&A 13:45-14:30 with no gap). Worth Owen + Stacey making break expectations explicit before delivery.

---

## Dimension 4: UI / readability

**Score: not Cowork-assessable.** I haven't visually inspected the deployed workbench. This dimension needs Owen's direct walk-through. Below is what I can infer from the code and what to look for.

### Inferable from code

- Schedule grid (lines 3810+ in index.html) renders blocks colored by `kind`. 12 kinds = 12 visual categories.
- Specialty round blocks have `code` field that displays as a badge prefix in the grid. The labels were originally "P1 · Solution Blueprint" which double-rendered the code; fix commit (commit 7e30a67) stripped the prefix.
- Detail panel renders `slide.foundation`, `students` (as bullet list), `facilitator` (as paragraph), `references` (as bullet list), and `notes` (as collapsible section between facilitator and references).
- Notes UI has empty-state affordance (subtle "+ Add note" button) and populated-state collapsible card with edit/delete.
- AI loop section (`renderViewBAiLoop`) renders below the slide content as a separate panel.

### What Owen should check in the walk-through

- **Schedule grid scannability**: can a new facilitator see the 10-day arc and understand "this is the structure" without reading every block? Color coding by kind should help; track colors should differentiate Product/Business/Market specialty rounds.
- **Block detail hierarchy**: does the eye go to foundation first, students second, facilitator third, references fourth? Or does the notes section dominate because of the new card styling? If notes dominate, may need to compress the visual weight.
- **Empty vs. rich content**: blocks with full slide content + ai_loop + notes are visually heavy. Blocks with just slide content are lighter. Blocks with just slide.foundation (the SA blocks before commit 2) were mid-weight. After commit 2 enrichment, all blocks should look similar in weight.
- **Track colors**: Product, Business, Market should be visually distinct and meaningful. Convention from CSS: not Cowork-checked.
- **Mobile**: production URL on phone. Workbench is desktop-first per README; mobile may degrade.
- **Specific friction points to feel for**: clicking into a block, finding the next block, getting back to the day view, finding a specific block by name (search/filter?), seeing the audience tier across a day.

---

## Dimension 5: Editorial workflow

**Score: 3.5/5.** Edit + notes UI is functional. Filtering and walk-through ergonomics are unknown to Cowork.

### What works

- **Notes UI**: edit + delete shipped this session (commit 3 of the run). localStorage persists per browser, server sync available. Hover-revealed action buttons. Append-only-plus-edit covers Stacey's collaborative use case.
- **Edit form** (existing pre-session, lines 5491+ in index.html): supports editing all slide fields plus block-level fields (label, kind, ai_loop, notes_facilitator, etc.). Save flow goes through `VIEW_B_OVERRIDES` → localStorage + remote sync.
- **Override merge**: the `effectiveBlock` function merges base SCHEDULE + override cleanly. Editors can override individual fields without losing the rest.

### Where it feels clunky

- **Notes UI re-render after submit closes the section.** User adds a note, page re-renders, the `<details>` element loses its open state. User has to click again to see their new note. Acceptable for v1 but a polish item.
- **Inline `onsubmit` handlers** (notes form): work but fragile. Event delegation would be cleaner.
- **Drill-down view bypasses the override merge** for foundation/students/facilitator/references. I worked around this in `notesRenderSection` by consulting overrides directly, but other slide fields edited via the override mechanism don't show in drill-down. This is a pre-existing inconsistency, flagged but not fixed.
- **No filtering UI surfaced** for tracks/roles/kinds in my reading. May exist elsewhere; Owen should confirm.

### What would make a 30-min walk-through with Stacey smoother

- **A "skim mode"** that hides notes by default, shows only foundation + students per block, collapses facilitator notes. Lets Stacey scan voice without the cognitive load of reviewing meta-notes.
- **A "what's missing" filter**: show only blocks marked `[INVENTED]`, blocks with TBD references (sponsors, panelists, guests), blocks tagged `stub` (none currently). Now you walk what needs human input, not the whole 90 blocks.
- **A "what changed" indicator**: per-block badge showing if it has overrides (i.e., someone edited it via the workbench since the SCHEDULE was last saved). Tells Stacey what's been touched.
- **Day-level view**: a day-at-a-glance with all blocks, audience tier, expected facilitator workload, energy curve summary. Pre-walkthrough briefing tool.

None of these exist now. None are blockers for Saturday's walk-through.

---

## Dimension 6: Methodology coherence

**Score: 4/5.** ADAPT applied where it belongs. Micro-cycle visible in field semantics. Specialty round logic chained explicitly. Reality Check tier model is partial.

### What's coherent

- **ADAPT methodology**: applied in 12 ai_loop blocks. The 5-letter mnemonic (Analog/Dialogue/Adjust/Produce/Test) appears in student-facing slide content; canonical 4-step (analog/structure/output/final/reality_check) populates ai_loop fields. Mapping documented in AI tooling block notes + STANDARDS.md.
- **Micro-cycle visibility**: the program runs Analog → Dialogue → Adjust → Produce → Test at multiple scales. Mon AM AI tooling = 45-minute cycle on intro pitch. Tue AM Swag pitch = 45-minute cycle on swag. Wk2 specialty rounds = 105-minute cycles per round. Thu PM Narrative Time = 240-minute final cycle. Each block's ai_loop reflects this.
- **Specialty round chain**: P1 → P2 → P3, B1 → B2 → B3, M1 → M2 → M3 each chain forward via ai_loop.analog citations. Round 2 explicitly takes Round 1's output as input. This is documented in the data, not just in narrative.
- **Reality Check anchors**: 3 explicit RC blocks (Pitch speed dating Thu AM, Market executes Wed PM Wk2, plus the ai_loop reality_check fields point at RCs as test events). The pattern is "your loop ends with a real test event."

### Where coherence is partial or unclear

- **Reality Check tiers across the program**: the existing `ready` RC block (Pitch speed dating) references "Audience tier scoring decision — see §4" which Cowork couldn't access. I drafted the 3 Wk1 Thu Pitches blocks as escalating tiers (peers / mentors-staff / external-alumni-sponsor) per contextual logic, but this assumption isn't validated. **Real risk**: if §4 has a different tier model, my Pitch round content needs revision.
- **ADAPT in track+code blocks**: per validator rule, track blocks with `code` cannot have a `slide` field (content lives in ACTIVITIES). The 9 specialty rounds have `ai_loop` populated but no slide content. The ADAPT mapping note that lives in non-track blocks (e.g., AI tooling Mon AM) doesn't have a parallel for track blocks. Facilitators relying solely on the workbench panel for these blocks see ai_loop without the ADAPT mnemonic frame. Workaround: ACTIVITIES content should reinforce ADAPT vocabulary; verify.
- **Working agreement (BE PRESENT etc.)**: lives as a single student bullet in Entrepreneurship intro per Owen's call. Recommended to also produce as a wall artifact. The wall artifact decision is logged but the workbench doesn't surface "this should be a poster". Saturday Owen consideration.
- **Customer panelist continuity**: 4 encounters with same panelists is a methodology choice but not visually obvious in the SCHEDULE. Sub-labels and notes mention it, but a `panel_continuity` field would make it data, not narrative.

---

## Dimension 7: Open decisions and risks

Pulled from `data/needs-owen.md`. Categorized below.

### Monday-blocker

- **Sponsor selection** (Sonae vs. JdM, hard floor 8 Jun) — placeholder used in ~6 blocks. Path: confirm with sponsor by 7 Jun, do a global find-and-replace from `[SPONSOR — TBD between Sonae and JdM, hard floor 8 Jun]` to the actual name. 10 minutes of work once decided.
- **3 Guest contacts** — Wk1 Wed Entrepreneur Story, Wk2 Mon Guest Talk (last year's product guy), Wk2 Thu Guest: How to pitch. Path: Owen pulls 3 contacts this week, replaces TBD placeholders. Likely 30 min once contacts respond.
- **Customer panelist recruitment** — 4 encounters, same panelists. Path: identify and brief 3-5 panelists by 14 Jun.

### Pre-Lisbon (next 5 weeks)

- **ADAPT methodology one-pager** — referenced in 4 blocks, doesn't exist. Path: 60 min of writing, ideally collaborative with Stacey. Should land before mid-June.
- **Notion Active Design page** still says "GTM" — 5-min edit. Cosmetic but matters for any new Claude instance loading context.
- **ADAPT vs. canonical micro-cycle confirmation with Stacey** — Owen's call is locked but Stacey hasn't weighed in. Conversation Monday.
- **Audience tier scoring decision (§4)** — verify the 3 Wk1 Thu Pitches blocks match actual scoring methodology. If different, ~30 min of slide content rewrite.

### Nice-to-have

- **Schema rename for `ai_loop.output` field semantics** — process-vs-artifact friction. Defer post-Monday.
- **Customer panelist continuity** as data not narrative — would require a schema field. Low priority but improves clarity.
- **Block-drafts cleanup** — superseded files in `data/block-drafts/`. Low priority, doesn't affect users.

---

## Where to invest the weekend

Three highest-leverage moves, in priority order.

### Move 1: Walkthrough with Stacey, Saturday afternoon

**What it is**: 90-min session with Stacey on the deployed workbench. Walk Wk1 Tue + Wed (her highest-opinion-density days) block by block. Use the notes UI to capture her edits live. Decide what stays, what changes, what's missing.

**Effort**: 90 min Owen + 90 min Stacey. Cowork is not in the loop; this is human-to-human.

**Expected impact on Stacey walk-through quality**: highest possible. Stacey hasn't seen this workbench yet; her reaction will surface what an external facilitator sees in 30 seconds that the author missed. Specific things she'll likely flag: dry Pitches blocks, generic Welcome templates, time pacing assumptions, methodology phrasings she'd word differently.

**What it unblocks for Lisbon delivery**: her buy-in. The workbench is the artifact she'll facilitate from. If she doesn't recognize her own program in it, the prep work doesn't transfer.

### Move 2: Land the 3 Guest contacts + sponsor decision by Tuesday

**What it is**: pure outreach work. Owen contacts the Lisbon 2025 product guy (for Wk2 Mon Guest Talk). Cate's network for the other 2 Guest blocks. Sponsor decision (Sonae vs. JdM) confirmed.

**Effort**: 2-3 hours Owen across the weekend + early next week. Cowork can't accelerate this.

**Expected impact**: removes 4 of the 5 Monday-blocker items. The workbench goes from "ready for walk-through with placeholders" to "ready for facilitator briefing with real names."

**What it unblocks for Lisbon delivery**: Cate can move on the sponsor agreement; guest pre-briefs can start; the program looks real to Stacey.

### Move 3: Compress the long blocks + add explicit breaks

**What it is**: targeted edits to 3-4 blocks: Wk2 Thu PM Narrative Time (240 min) needs internal break, Wk1 Thu PM Voting (60 min) can compress, the no-break gaps in Wk2 Wed need at least one energizer between Sponsor Feedback and OiM #2. Plus: decide if implicit breaks need to be made explicit blocks in SCHEDULE or stay as facilitator-managed gaps.

**Effort**: 60-90 min of Cowork + Owen back-and-forth. Best done after Saturday walkthrough so Stacey's pacing input feeds into the edits.

**Expected impact on Stacey walk-through quality**: medium. Stacey will probably flag the 240-min block first and the Wk2 Wed pressure-stack second; having compression options pre-baked accelerates the conversation.

**What it unblocks for Lisbon delivery**: realistic time budgets that survive Day 1 contact with reality. Pre-validating pacing now avoids burnout-by-day-3.

### What to defer

- Slide production (will happen via google-slides-mcp from the workbench; deferred until content is locked).
- Design library work (real but not on the critical path; Saturday Owen probably wants to do this anyway, but it's #4 not #1).
- Schema work (ai_loop rename, panel_continuity field) — defer post-Monday.
- Block-drafts cleanup — purely cosmetic, do whenever.

---

## What this audit didn't cover

Cowork is the author of most content audited here. I cannot reliably evaluate:
- Visual UI quality (haven't loaded the deployed workbench)
- Mobile experience (not tested)
- How the workbench reads to a first-time facilitator (I have full context Stacey doesn't)
- Whether the voice is right for smart teenagers (I'm a probabilistic model trained on adult prose)
- Whether the methodology actually works in the room (only delivery validates this)

These are exactly the things Stacey's Saturday walkthrough will surface. Cowork's audit is the inside view; her walkthrough is the outside view. The two together make Monday's plan.
