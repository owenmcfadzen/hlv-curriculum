# Claude Code instructions — HLV Curriculum Workbench

You're working on Owen McFadzen's curriculum workbench for Hudson Lab Ventures (HLV), the 2-week high school entrepreneurship summer program in Lisbon, July 2026. Owen is the curriculum architect. Stacey handles delivery, Cate reviews and runs the alumni track.

## What this is

A single-file HTML workbench. Schedule, 9 worksheets, layers of work, decisions, facilitator walkthrough — all in `workbench.html`. Data is embedded as five JS objects at the top of `<script>`; every view renders from those objects.

The workbench has three modes:
- **Page mode** — scroll, browse, iterate
- **Slide mode** — full-screen 2D navigation. ←→ for sections + days + activities; ↓ for drill-into details
- **Print mode** — clean PDF export

## Repo structure

| Path | Purpose | You can edit? |
|---|---|---|
| `workbench.html` | Live artifact. Edit data objects only. | Yes — minimal diffs |
| `sources/decks/` | Old PPTX/PDF decks | Read only |
| `sources/notion/` | Notion exports | Read only |
| `sources/worksheets/` | Worksheet PDFs | Read only |
| `sources/transcripts/` | Voice notes, meeting notes | Read only |
| `data/` | Structured extractions you generate | Yes — write outputs here |
| `prompts/` | Task prompts | Yes — refine as patterns emerge |
| `README.md` | Human-facing | Update if structure changes |

## Voice and tone — non-negotiable

Any text that ends up user-facing — slide content, takeaways, facilitator notes, READMEs — follows these:

- **Matter-of-fact, never warm or cozy.** Owen will reject "designed to inspire" and "empowering young entrepreneurs." Just say what's there.
- **Compressed, directive, no sugar-coating.** "Pick a solution. Assign tracks." not "Pick a solution worth a week of your lives."
- **Written for smart teenagers.** No corporate jargon, no LinkedIn energy. If it sounds like a template, start over.
- **Dry humor is fine.** Earnest enthusiasm is not.

## Naming — non-negotiable

- **Tracks**: Product / Business / Market. Never "GTM" — it was the old name and is being retired.
- **Activity codes**: P1 / P2 / P3 (Product), B1 / B2 / B3 (Business), M1 / M2 / M3 (Market).
- **M3 is "First Moves"** (the older "Channel Strategy" is retired).
- **Worksheets pending PDF rename**: M1 / M2 / M3 PDFs still header "GTM TRACK" — Owen handles externally. Workbench already says "Market".

## Status vocabulary

- `ready` — content written and reviewed by Owen
- `draft` — content exists, needs Owen review
- `stub` — placeholder, no real content yet
- `partial` — for activities, means worksheet exists but has open decisions

## Workbench data schema

### `SCHEDULE.weeks[].days[].am[]` and `.pm[]`

Each entry is either a block or a phase marker:

```js
// Phase marker
{ groupLabel: "PHASE 1 · RECONNAISSANCE" }

// Block
{
  label: "Welcome",
  kind: "welcome",          // see kinds below
  sub: "...",               // optional italic sublabel under the title
  code: "P1",               // optional, links to ACTIVITIES
  track: "product",          // for kind=track only
  slide: {                  // optional — block detail slide
    status: "stub" | "draft" | "ready",
    foundation: "...",       // 1-3 sentences. The concept being taught/practiced.
    students: ["...", "..."], // bullet list of what they actually do
    facilitator: "...",      // notes for the person running it
    references: ["...", "..."],
  }
}
```

### Block kinds

`welcome / work / module / game / rc / panel / sponsor / teamteach / social / pitch / lpp / track`

These control the visual category (color in the schedule grid). Don't invent new kinds.

### `ACTIVITIES[]` — the 9 worksheets

```js
{
  code: "P1",
  track: "product",
  name: "Solution Blueprint",
  when: "Tue AM · Phase 1",
  status: "built" | "partial",
  slideStatus: "ready" | "draft" | "stub",
  shape: "...",                          // methodology, 2-3 sentences
  feeds: ["LPP \"How does it work?\"", ...],
  open: "...",                            // optional unresolved question
  note: "...",                            // optional context
  wireframe: { viewBox, zones, lines }    // SVG schematic data — don't break this
}
```

The `wireframe` object renders the worksheet schematic. Adding zones is fine; restructuring the format breaks the renderer.

### `DAYS[]` — one entry per day

```js
{
  weekIdx: 0 | 1,        // 0 = Wk1, 1 = Wk2
  dayIdx: 0..4,          // 0 = Mon, 4 = Fri
  theme: "Problems",      // one short phrase, the day's headline
  lead: "Day 2 of Discovery. Find what frustrates...",
  takeaway: "..."          // 2-3 sentences, the line you say out loud
}
```

## Ground rules

1. **Don't break the JS object schema.** Adding fields is fine; renaming or restructuring breaks the renderers.
2. **Don't reformat unrelated code.** Editing `workbench.html` should produce minimal diffs. Use targeted edits.
3. **Don't invent slide content.** When extracting from `sources/decks/`, attribute what you find. If you have to write something yourself, mark `claude_drafted: true` so Owen can review.
4. **Status defaults to `stub`.** Only set `ready` after Owen review. `draft` is the right default for content you populate.
5. **The M-track rename**: anywhere you see "GTM" in `sources/`, the equivalent in the workbench is "Market". Note any conflicts in your output.
6. **Don't touch CSS or rendering JS** unless explicitly asked. Owen iterates on visuals in claude.ai web.

## Common tasks

### Extract from Porto decks
See `prompts/extract-porto.md`. Output to `data/porto-extraction.json`. Don't update `workbench.html` in the same pass.

### Populate block slides from extraction
1. Read `data/porto-extraction.json`
2. Find entries with `proposed_2026_block` matching a workbench block
3. Update that block's `slide` object via targeted edit
4. Set `slide.status: "draft"` (not `ready`)
5. Verify file still renders (open in browser, check console)

### Add a new day theme or takeaway
Edit the matching `DAYS[]` entry. Don't change the schema.

### Rebuild Google Slides from workbench
Owen does this in Claude Desktop with the existing `google-slides-mcp`. Don't try to do it from here unless Owen explicitly asks.

## Verification before committing

For any change to `workbench.html`:
1. Open it locally in a browser, confirm it still renders
2. Check no JS console errors
3. Spot-check at least one edited slide via Slide mode (toggle Slide button, navigate)
4. `git diff` should be small and focused — if it's not, something's wrong

## Owen's signals

- "Go" = proceed immediately, don't ask for confirmation
- "What do you think?" = give a real opinion, not options to choose between
- Iteration > planning. Build, show, react, build again. Don't write long plans before doing.
- Honest assessment > polished drafts. Owen wants to know what's weak.
