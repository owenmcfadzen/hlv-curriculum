# HLV Curriculum Workbench

Hudson Lab Ventures · Lisbon 2026. The working surface for the two-week high school entrepreneurship curriculum.

## What's here

```
workbench.html        single-file interactive workbench
sources/              raw materials Claude Code reads from
  decks/                old PPTX/PDF presentations (Porto 2025 etc.)
  notion/               Notion exports (markdown)
  worksheets/           A2 worksheet PDFs
  transcripts/          voice notes, meeting notes
data/                 structured extractions generated from sources/
prompts/              Claude Code prompts for repeated tasks
CLAUDE.md             conventions and ground rules for Claude Code
```

## How to view

Open `workbench.html` in any browser. No build, no server.

For a shareable link, enable GitHub Pages on this repo's `main` branch. The workbench will be at:
`https://owenmcfadzen.github.io/<repo-name>/workbench.html`

## How to edit

Data lives at the top of the `<script>` block in `workbench.html`. Five labelled objects:

- `SCHEDULE` — week → day → AM/PM → blocks
- `ACTIVITIES` — the 9 worksheets (P1 / B1 / M1 / P2 / B2 / M2 / P3 / B3 / M3) with shape + wireframe data
- `DAYS` — day-level theme + lead + takeaway (10 entries)
- `LAYERS` / `DECISIONS` / `FLOW` — supporting sections

Save, refresh browser. Every view updates. No build step.

## Three-surface workflow

| Surface | Best for |
|---|---|
| claude.ai web (this project) | Visual iteration, design changes, slide layouts |
| Claude Code (terminal, Mac) | Bulk content ingestion, multi-file edits, repo operations |
| Claude Desktop | Production into Google Slides via `google-slides-mcp` |

Mobile is for review and decisions, not editing.

## Status

8 weeks out from delivery. Workbench captures schedule, activity wireframes, layers, decisions, and a stakeholder walkthrough. Block-level slide content (foundation, students, facilitator notes) is mostly stub — to be populated from `sources/decks/` extraction.

Currently 80 clickable block slides + 9 activity slides + 6 high-level section slides + 10 day slides. Status dot on each block shows what's `ready` / `draft` / `stub`.

## Quick start (Claude Code)

```
cd <this-folder>
git init
git add .
git commit -m "Initial commit — workbench v1 + sources + prompts"
gh repo create <repo-name> --public --source=. --push
```

Then to start the Porto extraction:

```
cat prompts/extract-porto.md
# paste contents into Claude Code, drop the Porto PDFs into sources/decks/, go
```
