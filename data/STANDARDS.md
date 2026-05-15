# Workbench Content Standards

Locked patterns for all block-content lifts. Distilled from the Wk1 Mon AM rebuild (Owen-approved 2026-05-15). Apply to every block. Flag back only if a block doesn't fit the pattern.

Companion files:
- `data/needs-owen.md` — running scratchpad of unilateral-decision flags
- `block-drafts/*.md` — superseded; we now write directly to `index.html` SCHEDULE

---

## 1. Block field shape

Every populated block in `SCHEDULE` carries:

```js
{
  label, kind, time_start, time_end,
  audiences?: ["student", "alumni"],
  facilitators?: ["f1", "f2"],         // alumni-parallel blocks
  parallel_to?: "<parent block detail key>",
  ai_loop?: { ... },                    // only on AI-using blocks
  slide: {
    status: "draft",                    // never "ready" — only Owen marks ready
    foundation: "...",
    students: ["...", "..."],
    facilitator: "...",
    references: ["...", "..."],
    notes: [{ author, ts, text, edited? }, ...]
  }
}
```

**Required**: `label`, `kind`, `slide.status`. Everything else optional but populate per the rules below.

---

## 2. Voice (universal)

Per `AGENTS.md` + `PROJECT.md`. These rules apply to all student- and facilitator-facing text:

- Matter-of-fact, never warm or cozy. "Pick a solution. Assign tracks." not "Pick a solution worth a week of your lives."
- Compressed, directive, no sugar-coating.
- No corporate jargon, no LinkedIn energy.
- Smart teenagers — they applied to a competitive program. No condescension. No "stakeholder", "value prop", "growth mindset".
- Concrete > abstract. "Pick 5 people you'll talk to in the next 90 minutes" > "Identify potential interview subjects".
- Dry humor is fine. Earnest enthusiasm is not.

**Approved voice samples** (lift these patterns):

> "Cold openings hide real state. The diagram makes it visible." (Intro game foundation)

> "Move students from 'entrepreneur = billionaire founder' to a usable definition: noticing real problems, building solutions, finding a way for them to survive." (Entrepreneurship intro foundation)

> "The artifact is small. The point is feeling the loop." (AI tooling foundation)

---

## 3. `slide.foundation`

- **Length**: 1-3 sentences. Hard cap. If you need more, push it into `facilitator`.
- **Content**: the WHY of the block, plus the artifact-by-end-of-block if applicable. Not a description of activities (those go in `students`).
- **Tone**: matter-of-fact, see §2.

**Good**:
> "Rollercoaster Check-in opens the program by giving students a visual way to say where they actually are. Cold openings hide real state. The diagram makes it visible, surfaces clusters, and gives shy students a label to pick rather than improvise."

**Bad** (too long, abstract, LinkedIn-y):
> "This carefully designed opening activity creates psychological safety while inviting students to authentically share their emotional journey, building trust that will carry them through the challenges ahead."

---

## 4. `slide.students[]`

- **Format**: array of strings. Each string is one bullet rendered as a `<li>` in the workbench.
- **Length per bullet**: 1-2 sentences typical. 3 max.
- **Voice**: action-oriented. Verbs first. "Take a sticky. Write your name." not "Students should take a sticky and write their names."
- **Count per block**: 3-6 bullets typical. 4-5 is the sweet spot. 7+ means the block is overloaded.

**Good**:
> ["Take a sticky. Write your name.", "Place yourself on the rollercoaster: where you actually are right now, not where you think you should be."]

**Bad**:
> ["Identify potential interview subjects."] (too vague, no verb energy)

---

## 5. `slide.facilitator`

- **Format**: single string (not an array). Multi-paragraph allowed; use `\n\n` for breaks if needed.
- **Content**: tactical guidance for the runner. Always include explicit timing if the block is more than 30 min. Suggested split format works well.
- **Length**: 2-6 sentences typical. Can be longer if there's real complexity to manage.

**Good**:
> "30 min total. 5 min set up the rollercoaster on the whiteboard, 10 min for placement and writing, 10 min share-around (cap each at ~30 sec), 5 min surface what the data tells you about the room. Place yourself too. Use the data diagnostically: cluster in valleys = energizer needed. All at peaks = overconfidence flag."

---

## 6. `slide.references[]`

- **Format**: array of strings. Each string is one source citation rendered as a `<li>`.
- **Citation patterns**:
  - Notion Practice Entry: `"Rollercoaster Check-in (Notion Knowledge / Activity)"`
  - Notion Module: `"What is Entrepreneurship? (Notion: Modules)"`
  - Notion top-level page: `"HLV Curriculum: Active Design (Notion canonical)"`
  - 2025 PDF lift: `"porto-2025/Day-N · Slide topic"` (used when no Notion source)
  - TBD/missing: `"ADAPT methodology one-pager (TBD: needs creation before delivery)"`
- **NO emojis** in references. Strip 📚, 🚀, etc. from Notion folder names when citing.
- **NO em-dashes** anywhere in references.

---

## 7. `slide.notes[]`

- **Purpose**: meta notes about the block. Drafted-by reasoning, source attribution, flags for Owen, design-decision rationale. NOT facilitator instructions — those go in `slide.facilitator`.
- **Shape**: `{ author, ts, text, edited? }`. Schema enforces. `edited` set automatically by the UI on first edit.
- **Author for Cowork-drafted notes**: `"Cowork"`. Owen edits use `"Owen"`. Others use the actual author name.
- **ts**: ISO 8601 datetime. **Use the actual time at write time** (`new Date().toISOString()` in JS, or a real current ts in hand-written data). Do NOT use placeholder future dates — they sort wrong when notes get edited later.
- **Newest sort to top** in the UI. Order in storage is insertion order.
- **One bullet per insight**. Don't combine unrelated thoughts into a single multi-paragraph note.

**Good notes (Cowork)**:
> "Rebuilt from the Notion Practice Entry (Rollercoaster Check-in) rather than the Porto 2025 Day 1 deck. Notion is more recent and explicit about diagnostic use ('Use the data, do not just collect it')."

> "ADAPT vs canonical mapping (locked Owen call, for Monday discussion with Stacey): ADAPT (Analog / Dialogue / Adjust / Produce / Test) is the student-facing mnemonic. ai_loop fields use the canonical Stacey-developed names."

---

## 8. `ai_loop` — when and how

**Populate `ai_loop` only on blocks where students actually use AI as a working tool.** Not on every block. Examples:
- Mon AM Wk1 AI tooling/PRD/intro pitch — yes
- Tue AM Wk1 Swag pitch — yes (first solo loop)
- Wk2 specialty rounds — yes (PRD Lab)
- Wk1 Mon AM Welcome — no
- Wk1 Mon PM Sponsor briefing — no

**Field names are canonical (Stacey micro-cycle)**, not ADAPT:

```js
ai_loop: {
  analog: "what's the analog input",
  structure: "how AI structures the analog input",
  output: "the working artifact",
  final: "the final shipped output",
  reality_check: "how the loop output is tested",
  uses_prd_lab: true | false
}
```

**ADAPT (student-facing) maps to ai_loop fields** as:
- A (Analog) → `analog`
- D (Dialogue) → `structure`
- Adjust → `output`
- Produce → `final`
- T (Test) → `reality_check`

Slide content (`foundation`, `students`, `facilitator`) uses ADAPT vocabulary. The `ai_loop` block keeps canonical names. Per Owen-locked decision (2026-05-15).

---

## 9. `slide.status`

- **`stub`** — placeholder, no real content.
- **`draft`** — content exists, needs Owen review. **Default for Cowork-written content.**
- **`ready`** — Owen-reviewed. **Never set this from Cowork.** Only Owen marks ready.

---

## 10. Style locks (universal)

- **No em-dashes** anywhere in slide content, notes, or references. Use period, comma, parentheses, or "plus" instead.
- **No emojis** in slide content, notes, references, or UI labels. Strip them when found in source material (e.g., 📚 in Notion folder names).
- **Sponsor placeholder**: `[SPONSOR — TBD between Sonae and JdM, hard floor 8 Jun]` wherever the sponsor name would go in NEW writing. Existing populated content with explicit sponsor names stays untouched.
- **No bullet points in `slide.facilitator`** — it's a single string. Use sentence-level structure with timing fragments.
- **Tracks are**: Product, Business, Market. Never GTM. Never Marketing.

---

## 11. Track block label renames (Owen decision #5)

When populating Wk2 specialty round blocks, rename the existing labels:

| Track | Round 1 (Mon PM) | Round 2 (Tue AM) | Round 3 (Wed AM) |
|---|---|---|---|
| Product | Solution Blueprint | MVP Scoping | Prototype Build |
| Business | The Case | Canvas Lite | 100-Day Plan |
| Market | Landscape Map | Validation Design | First Moves |

Apply rename as part of the content lift (label change + slide population in same edit). Existing labels in SCHEDULE: `Product: Prototype`, `Product: deep user journey`, `Product`, `Business: Biz Model`, `Business: Biz Model Canvas`, `Business`, `Market: Experiments`, `Market: Design Experiments`, `Market`. Replace with the descriptive names above.

---

## 12. Tagging conventions

- **`> [drafted]`**: only used in `block-drafts/*.md` files (legacy workflow). For direct-to-SCHEDULE writes, drafted-by-Cowork status is captured by `notes[]` entries with `author: "Cowork"`. No separate `[drafted]` tag needed in SCHEDULE.
- **`[INVENTED]`**: prefix in `slide.foundation` ONLY when no source material exists AND no obvious draft path. Example: `"[INVENTED] Foundation drafted from scratch — no Notion or 2025 source. Owen review needed."`
- **`(TBD: ...)`** in references for sources that need creation. Example: `"ADAPT methodology one-pager (TBD: needs creation before delivery)"`.

---

## 13. When to flag back to Owen

Add to `data/needs-owen.md` (don't stall the lift):

- Sponsor-specific content beyond the generic placeholder
- Format specs for guest sessions (who, what)
- Anything where a 2026 block has no clear 2025/Notion source AND no obvious draft path
- Workflow conflicts (block needs renaming beyond the §11 list, schema feels wrong)
- Anything you'd otherwise mark `[INVENTED]` with low confidence

For low-confidence INVENTED items: write the block AND flag in `needs-owen.md`. Don't skip the block.

---

## 14. Commit messages (when Cowork commits land via Owen)

- Schema changes: `schema: <terse description>`
- UI features: `feat: <terse description>`
- Content lifts: `content: <day or batch> from <source>`
- Cleanup/style: `chore: <description>` or `style: <description>`

Always describe the WHY, not just the WHAT, in the body if there's room. Body optional for small commits.

---

## 15. Validate before commit

`node tools/validate.mjs` after every batch. If validator errors, fix before continuing. If it warns, decide case-by-case.
