# PROJECT.md — HLV Curriculum Workbench

This file is HLV-specific. Replace per project. For universal Owen-prefs see `AGENTS.md`. For the workbench architecture see `ARCHITECTURE.md`.

## What this project is

The curriculum workbench for **Hudson Lab Ventures (HLV)** — the 2-week high school entrepreneurship summer program in **Lisbon, July 2026**.

| Role | Person |
|---|---|
| Curriculum architect | Owen McFadzen |
| Delivery | Stacey |
| Reviewer + alumni track | Cate |

The workbench is the artifact this team works from. Schedule, 9 worksheets, layers of work, decisions, facilitator walkthrough — all in `workbench.html`.

## Audience for user-facing content

Anything written into a slide, takeaway, facilitator note, or panel framing is for **smart teenagers** — high schoolers who applied to a competitive program. Apply the universal voice rules from `AGENTS.md` (matter-of-fact, compressed, no LinkedIn energy) and add:

- No condescension. They picked a program over their summer; treat them as competent.
- No corporate vocabulary. "Stakeholder", "value prop", "growth mindset" — replace.
- Concrete > abstract. "Pick a solution worth a week of your life" > "Choose meaningful direction".

## Naming — non-negotiable

- **Tracks**: Product / Business / Market. Never **GTM** — it was the old name, retired.
- **Activity codes**: P1 / P2 / P3 (Product), B1 / B2 / B3 (Business), M1 / M2 / M3 (Market).
- **M3 is "First Moves"** — the older "Channel Strategy" name is retired.
- **Worksheet PDFs lag**: M1 / M2 / M3 PDFs still header "GTM TRACK". Owen handles the rename externally; the workbench already says "Market".

## Status vocabulary

These are the values that appear in `slide.status` and `activity.status`:

| Value | Meaning |
|---|---|
| `ready` | Content written and reviewed by Owen |
| `draft` | Content exists, needs Owen review |
| `stub` | Placeholder, no real content yet |
| `partial` | (activities only) worksheet exists but has open decisions |

Default for new content is `draft` or `stub`, never `ready`. Only Owen marks something `ready`.

## The 10-day shape

**Week 1 — Discovery** · shared, mostly analog, sponsor challenge, pitch, team allocation.

| Day | Theme |
|---|---|
| Mon | Welcome + sponsor briefing |
| Tue | Problems |
| Wed | Solutions |
| Thu | Pitches + RC |
| Fri | Team allocation |

**Week 2 — Specialize** · Phase 1 reconnaissance → Team Teach (synthesis hinge) → Phase 2 build → Phase 3 + Market RC.

| Day | Theme |
|---|---|
| Mon | Team setup, designer joins |
| Tue | Phase 1 (Reconnaissance) AM, Hinge + Phase 2 (Build & Scope) PM |
| Wed | Phase 3 (Build & Plan) AM, Sponsor feedback + Market RC PM |
| Thu | LPP Time |
| Fri | Final pitches |

## Sponsors and partners (current intent)

| Location | Sponsor |
|---|---|
| Lisbon (2026) | Sonae |
| Porto (2025, prior) | Continente / WTF challenge |
| NYC | IKEA |
| Seoul | Coupang |

## Common tasks

### Extract from old decks
See `prompts/extract-porto.md`. Output to `data/porto-extraction.json`. Don't update `workbench.html` in the same pass.

### Populate block slides
1. Read `data/blocks-needing-content.md` — that's the gap list.
2. For one block, pull relevant content from `data/porto-extraction.json` or directly from `sources/decks/*.txt`.
3. Draft proposed content to `data/block-drafts/<block-id>.md` for Owen review.
4. After approval, edit the matching block's `slide` object in `workbench.html` (status: `draft`).
5. Run the validator (`node tools/validate.mjs`).
6. Commit.

### Add a day theme or takeaway
Edit the matching `DAYS[]` entry in `workbench.html`. Don't change the schema.

### Rebuild Google Slides from workbench
Owen does this in Claude Desktop with the existing `google-slides-mcp`. Don't try to do it from here unless asked.

## Repository convention for HLV

- This file (`PROJECT.md`) lives in the **private** companion repo, alongside `prompts/`, `data/`, and the source materials.
- The workbench (`index.html`), kernel docs (`AGENTS.md`, `ARCHITECTURE.md`), schemas, and tools live in the **public** repo (`hlv-curriculum`).
- The split exists so visitors to the public Pages URL never see internal docs, names, or sponsor info.

## Source materials

`sources/` contains decks, Notion exports, transcripts, and worksheet PDFs from prior cohorts (Porto 2025) and reference material. Read-only. Used to inform 2026 content but not directly carried forward.

## Workflow signal

The block-driven gap-analysis model (see `ARCHITECTURE.md` for mechanics):
1. Pull stub blocks from `SCHEDULE` → `data/blocks-needing-content.md`
2. For each, decide what content it needs
3. Pull from sources, draft, review, commit one block at a time

This is the *durable working loop* for HLV. Don't try to populate everything in a bulk pass — that was the v0 mistake.
