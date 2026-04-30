# Porto 2025 deck extraction

Process every PDF in `sources/decks/`. Single output: `data/porto-extraction.json`. **No workbench changes in this pass.**

## Why this exists

The 2025 Porto program ran with a CBO/CMO/CPO role model. The 2026 Lisbon program uses Product/Business/Market specialty tracks. Some old material applies directly, some needs reframing, much is retired. This pass captures everything that was there so we can decide what carries forward — without setting fire to a context window in the middle of it.

## Output schema

A JSON array. One entry per slide. Roughly 200 entries expected across 8 decks.

```json
{
  "deck": "Day 2",
  "slide_n": 14,
  "title": "Problem validation panel",
  "kind": "teaching",
  "content": "<verbatim text from the slide; paraphrase only if rendering is broken>",
  "facilitator_voice": "<speaker notes or facilitator-aimed text, if any>",
  "proposed_2026_block": "day-w1-tue / pm / Panel: validation",
  "status": "applicable",
  "note": "<short reason, especially for retired/reframe>"
}
```

## Field rules

**`kind`** — one of:
- `teaching` — concept explanation, methodology
- `activity_instruction` — what students do
- `facilitator_note` — for the runner, not the room
- `visual_reference` — diagram, chart, photo
- `cover` — section/day cover slide
- `transition` — filler / "see you tomorrow"
- `schedule` — schedule grid or timeline
- `stat` — single number / quote slide

**`status`** — one of:
- `applicable` — direct match. Carries forward roughly as-is.
- `retired` — old role-based content (CBO/CMO/CPO), Porto-specific sponsor material, removed sessions
- `reframe` — same idea but needs adapting for P/B/M structure or a different schedule slot
- `general_resource` — useful background, not tied to a specific block

**`proposed_2026_block`** — format `day-w<1|2>-<mon|tue|wed|thu|fri> / <am|pm> / <block label>`. Reference `workbench.html` SCHEDULE for valid block labels. Set to `null` for `general_resource` or when nothing fits.

## Mapping rules

- Old role names map roughly: **CBO → Business**, **CMO → Market**, **CPO → Product**. But don't force it — many old slides won't fit the new structure. Mark those `retired` or `reframe` rather than constructing a doomed mapping.
- Wk1 days: Mon = sponsor briefing, Tue = problems, Wed = solutions, Thu = pitches/RC, Fri = team allocation
- Wk2 days: Mon = setup, Tue = Phase 1 + Hinge + Phase 2, Wed = Phase 3 + Market RC, Thu = LPP narrative, Fri = final pitches
- Activity codes follow the new naming: P1/P2/P3 (Product), B1/B2/B3 (Business), M1/M2/M3 (Market). M3 = "First Moves" not "Channel Strategy".

## How to read the PDFs

`pdftotext -layout` for clean text. For visual-heavy slides, `pdftoppm` to rasterize then `tesseract` for OCR if the PDF text extraction is empty. Don't trust PDF metadata for slide order — use page number from the file.

```bash
for pdf in sources/decks/*.pdf; do
  pdftotext -layout "$pdf" "${pdf%.pdf}.txt"
done
```

## Don't

- Don't update `workbench.html` in this pass. Extraction only.
- Don't drop slides because they "look the same" — every slide gets an entry. Use `kind: transition` for filler.
- Don't paraphrase aggressively. Verbatim is better than smooth — Owen needs to see what was actually there before deciding what carries forward.
- Don't classify `applicable` optimistically. When in doubt, `reframe` is the safer call.

## When done

1. `wc -l data/porto-extraction.json` and report the entry count
2. Spot-check three entries (first, middle, last) — paste them in chat for Owen's review
3. Group counts by status: how many applicable / retired / reframe / general_resource
4. Group counts by deck
5. Commit: `git add data/porto-extraction.json && git commit -m "Add Porto 2025 extraction (N entries from 8 decks)"`

Hand back to Owen for review before any workbench changes. The extraction is the durable artifact — workbench population happens in subsequent focused passes.
