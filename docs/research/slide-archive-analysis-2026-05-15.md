# Slide Archive Analysis — 15 May 2026

Author note (Cowork): I have textual extraction from the Porto 2025 PDFs (`data/porto-extraction.json`) plus the .txt versions of 7 of 8 decks. I read Day 1 in full earlier this session. I cannot visually inspect the PDFs — visual layout, typography, color usage, and image treatment cannot be characterized reliably from text alone. This analysis is heavy on content and metaphor patterns, light on visual specifics. Owen should treat the visual sections as scaffolding for a real human pass through the PDFs.

---

## Sources reviewed

8 PDF/TXT pairs in `/Users/owen/Documents/Projects/Active/hlv-workbench-private/sources/decks/`:

| File | Pages | Notes |
|---|---|---|
| HLVC Day 1 Porto 2025.pdf | 106 | Read in full as .txt. Co-Created branded. |
| HLVC Day 2 Porto July 2025.pdf | 133 | Per extraction metadata. |
| HLVC Day 3 Porto July 2025-with skipped slides.pdf | 198 | Largest deck. "With skipped slides" suggests an alt-version. |
| HLVC Day 4 Porto July 2025.pdf | unknown | Pitch day. |
| HLVC Day 5 Porto July 2025-With Skipped Slides.pdf | unknown | Wk1 Fri / team allocation + Wk2 preview. |
| HLVC Day 6 Porto July 2025.pdf | unknown | Wk2 Mon / Persona, Solution Journeys. |
| HLV - Porto Updated Day 7.pdf | unknown | Wk2 Tue / Lean Canvas, MVP. |
| HLV - Activites.pdf | unknown | Standalone activities deck (Rollercoaster, Go Bananas, Active Listening, 5 Whys, Into The Weekend). |

Total entries in `data/porto-extraction.json`: **1,112 slide-entries across 7 day decks** (Day 8-10 not present in extraction; either missing PDFs or program ran 7 days in 2025).

CoCreated material: not accessible to Cowork via filesystem. Would need explicit grant or Drive access. Skipped per brief.

---

## Slide kind distribution (across 1,112 entries)

| Kind | Count | % |
|---|---|---|
| `teaching` | 963 | 87% |
| `visual_reference` | 57 | 5% |
| `activity_instruction` | 37 | 3% |
| `cover` | 36 | 3% |
| `schedule` | 13 | 1% |
| `transition` | 1 | <1% |

(Plus `facilitator_note` and `stat`, not separately counted; together account for ~5 entries.)

**Headline read**: 87% teaching slides is high. Suggests didactic-heavy pacing with limited scaffolded activity surface in the slides themselves (activities live elsewhere — facilitator memory, sticky notes, worksheets). The 2026 workbench-driven model formalizes activity content into block.slide.students[] which the Porto 2025 decks didn't surface that way.

The single `transition` slide is suspicious — either transitions weren't tagged consistently or the deck genuinely doesn't have many. Day-end "see you tomorrow" slides exist (I saw them in Day 1) but were tagged `teaching` or `cover` by the v0 extraction.

---

## Recurring content patterns (high confidence)

### Working agreement built progressively across slides

Day 1 (.txt verified) builds the BE PRESENT working agreement across 5 slides (slides 18-22 in deck order). Each slide adds one bullet:
- Slide 18: BE PRESENT
- Slide 19: + EXPRESS YOUR POINT OF VIEW
- Slide 20: + WRITE DOWN INSIGHTS
- Slide 21: + HAVE OPEN-MINDED CONVERSATIONS
- Slide 22: + MOVE FORWARD WITH CONSENSUS

This progressive-reveal pattern is a strong design choice for facilitator pacing — each new bullet gives the room time to absorb before the next lands. Worth preserving in 2026.

### Definition slides as headline + ladder

Day 1 (.txt verified, multiple instances): a definition appears as a headline statement, then unpacked across 3-4 slides. Example: "What is entrepreneurship?" → headline → "It starts with a problem" → "You build something" → "You figure out how it can keep going."

This decomposition pattern suggests slides are designed for read-aloud-by-facilitator, not reader-self-paced.

### Methodology introduction as 5-step or 3-frame visual

- Process diagram: Discover → Refine → Develop → Define (Day 1 slide 12-13). Linear flow with arrows.
- Problem-Solution-Scale: tri-column layout (Day 1 slide 36).
- 5 Whys: introduced as a numbered method (Day 1 slide 51+).
- Active Listening: subject / listener / observer trio (Day 1 slide 53+).

Methodologies are introduced visually before being applied. This is the "show then do" rhythm.

### Sponsor / customer panel as Q&A with named panelists

Day 1 .txt shows panelists named individually (Adriana, Pedro, Rafael, Yalei, David, Rodrigo). This personal naming reinforces "real customers, not abstract personas" — a pattern the 2026 customer-panel-continuity assumption preserves.

### Student work as full case study

The WTF Matters student pitch from 2025 appears in Day 1 as a multi-slide reference (slides 32-77 area in extraction). This shows last-year's student work as both example and aspiration.

This is high-leverage. 2026 should curate 2-3 student work artifacts from prior years into a similar reference set.

### Examples ladder from famous to local

Day 1 entrepreneurship examples: Ronaldo, Kendra Scott, Mark Zuckerberg, Sam Altman → Foodtruck Owner, Hair Salon Owner, Bondalti CEO, family shop, neighbor tutoring. The ladder from celebrity to neighbor is deliberate and effective.

Worth preserving in 2026 Entrepreneurship intro.

---

## Recurring visual patterns (low-to-medium confidence — text-only analysis)

These are inferred from layout text in the extraction (e.g., text appearing in spatially-grouped clusters suggests a grid layout). Treat as scaffolding, validate visually.

### Layout systems (inferred)

- **Tri-column scan layouts**: appear in Future of Work themes (Automation/AI | Freelance | Future of work), Problem-Solution-Scale, Active Listening (Subject | Listener | Observer). Suggests a recurring 3-column grid.
- **2x5 grid**: Program Overview (10 days as 2 rows of 5). Day icons + day titles + 1-2 sentence description per cell.
- **Stat slides**: large-number-plus-small-caption layout. "$10bn Enterprise value created", "100+ Concepts launched since 2011", "91% teens would volunteer with friends". Format is consistent.
- **Progressive-reveal slides**: built across 5 slides each (working agreement, definition ladders). Implies a layout that holds a header constant while bullets accumulate below.

### Typography (inferred — needs visual validation)

- Uppercase headers consistent (BE PRESENT, EXPRESS YOUR POINT OF VIEW). Suggests a strong all-caps display style.
- Mixed-case body for narrative.
- Larger numerals for stat slides.

Cannot infer specific fonts, weights, or sizes from text extraction.

### Color usage (cannot infer from text)

- Day 1 references "pink card on the whiteboard" (in 2026 SA1 foundation, lifted from Stacey's framing). Suggests color-coded artifacts in the analog layer, but slide colors are opaque to Cowork.
- HLV color tokens defined in `index.html` CSS use Navy (#182D53), grey scale, with Coral / Pop Yellow / Gold / Green / Violet / Slate / Cream not yet seen in the SCHEDULE styling I read.

### Image treatment (cannot infer from text)

- 57 visual_reference slides (5%). Subject matter unknown without visual inspection.
- Day 1 references the WTF Matters app mock-ups as "MOCK APP" with "REDEFINING VOLUNTEERING" branding — suggests a contained-card image treatment, not full bleed.

---

## Curriculum metaphors and motifs (high confidence)

These recur across multiple decks per extraction sampling and are worth treating as locked HLV vocabulary:

| Metaphor | Where it appears | 2026 status |
|---|---|---|
| Rollercoaster | Day 1, Notion Practice Entry, my Wk1 Mon AM Intro game block | **Locked** — visual anchor, used for emotional arc + program arc |
| Problem → Solution → Scale | Day 1 framework, my Wk1 Mon AM Entrepreneurship intro foundation | **Locked** — working frame |
| Discover → Refine → Develop → Define | Day 1 process diagram, 2026 Wk2 Mon AM Week 2 Flow | **Locked** — methodology spine |
| BE PRESENT working agreement | Day 1 (built across 5 slides), 2026 Wk1 Mon AM Entrepreneurship intro student bullet | **Locked** — cultural foundation |
| ELMO (Enough, Let's Move On) | Day 1, Notion Practice Entry | **Locked** — discussion management |
| 5 Whys / Active Listening trio | Day 1 + Day 2, Notion entries | **Locked** — problem validation toolkit |
| Pink persona card | Day 6 (inferred), Owen's SA1 framing | **Active** — analog artifact for SA1 |
| Crazy 8s | Day 6 (inferred), 2026 SA2 + Wk1 User journey | **Active** — sketching format |

### Linguistic motifs (Stacey-aligned voice)

Voice patterns recur across STANDARDS-aligned writing in 2025 + Notion entries:
- "What's there" not "what could be" (descriptive over aspirational)
- "[Persona] cannot [X] because [Y]" as the canonical problem statement format
- Verb-led student instructions
- "Don't" framing for facilitator notes ("don't accept 'lack of resources'", "don't let teams smooth over contradicting evidence")

The 2026 STANDARDS.md formalizes this as the voice rule. The 2025 decks already follow it implicitly.

---

## What worked (judging by reuse)

Patterns appearing in multiple decks AND carried into Notion Practice Entries AND adopted into 2026 SCHEDULE:

1. **Rollercoaster** as both check-in and program-arc visual.
2. **Working agreement progressive reveal** — pedagogically sound, gives the room time to absorb each constraint.
3. **Problem-Solution-Scale tri-column** — dense framework on a single visual.
4. **Customer panel with named real people** — reinforces "real users."
5. **Student work as case study** — WTF Matters pitch as multi-slide reference.
6. **Definition ladder** — headline + 3-4 unpack slides for big concepts.
7. **Examples ladder from famous to local** — entrepreneurship examples Ronaldo → Foodtruck Owner.
8. **Stat slides with single large number** — $10bn, 91%, 88%. Punchy, memorable.

---

## What's inconsistent or weak

1. **Co-Created branding everywhere in Day 1.** Logos, language ("co-create with purpose"), partner credits. Retired in 2026 — needs clean removal in any lifted slide.
2. **8 entrepreneurial traits slide** (Day 1 slide 39). Stacey's reframe collapses this to 4 behaviors. Lift the new not the old.
3. **Future of Work content** (Day 1 slides 40-46): Automation/AI, Freelance, Future of work. Notion module has a tighter version (3 simplified points). Lift the Notion version, not the deck version.
4. **Slide kind counting suggests heavy didactic load** (87% teaching). 2026 workbench formalizes activities into block.slide.students[] — this is a structural improvement, not a slide design issue. Slides themselves should still be lean.
5. **Day-end transitions are weak** — only 1 slide tagged `transition` across 1112 entries. Day-ending rituals deserve a dedicated visual treatment.
6. **No visible system for distinguishing "teach" vs. "do" vs. "reflect" slides** in extraction kinds. The single `teaching` bucket flattens what should be 3+ pedagogical modes.

---

## CoCreated material

Not accessible to Cowork. Owen + Cate would have direct knowledge. Worth a separate Saturday hour digging through if Stacey's design patterns differ meaningfully from the Porto 2025 HLV-specific patterns. Best evidence I have: Stacey's "4 behaviors" reframe is in Notion, suggesting CoCreated → HLV has been a 1-way refinement, not a wholesale lift. Stacey's voice (clear, directive, unsentimental) shows in Notion entries and matches STANDARDS.md.

---

## Design library implications

8 specific patterns to formalize into a v1 design library:

1. **Slide template kinds** (with structural specs): cover, section opener, definition headline, definition unpack, framework intro, framework apply (worksheet card), exercise instruction, stat (single big number), customer / panelist quote, transition / breath, summary / synthesis.
2. **Type scale**: needs visual inspection. Working assumption: display all-caps weight (Barlow 700+), section heading, body, caption, large-number stat. 5 levels minimum.
3. **Color tokens**: formalize the palette from Owen's brief (Navy, Coral, Blue, Pop Yellow, Gold, Green, Violet, Slate, Cream) with semantic roles. From observed patterns: Navy = primary text, Pink = persona artifact, Cream = background tint. Other roles need visual confirmation.
4. **Spacing tokens**: needs visual inspection. Working assumption: dense Day 1 + 2025 layouts have low vertical rhythm; 2026 should formalize a clearer 4 / 8 / 16 / 32 px scale.
5. **Diagram primitives**:
   - Linear flow with arrows (Discover → Refine → Develop → Define)
   - Tri-column scan grid
   - 2-row × 5-column day overview grid
   - Rollercoaster curve with placement points
   - Trio role layout (Subject / Listener / Observer)
   - Problem-Solution-Scale tri-cell
6. **Exercise card pattern**: emerging in 2026 ACTIVITIES wireframes (P1 Solution Blueprint has zone specs). Templatize — 8-frame journey, 6-box canvas, 5-slot validation are recurring shapes.
7. **Reality Check card pattern**: 3 RC blocks in 2026, plus implied audience tiers. A consistent visual for "this is the test event" would help facilitators spot RCs at a glance.
8. **Customer panelist credit pattern**: how panelists are introduced and credited. 2025 decks show full names; 2026 could add headshot + role + relationship to challenge.

---

## Recommended next moves

### Lift from archive into v1 design library

- Working agreement progressive reveal pattern (5 slides)
- Definition ladder (4-5 slides per big concept)
- Stat slide with single large number
- Tri-column scan layout
- Rollercoaster visual (likely reuse existing asset, not redesign)
- Discover/Refine/Develop/Define linear flow

### Design fresh (don't lift)

- Co-Created branded slides (retired)
- 8-trait entrepreneurial slide (replaced by 4-behavior cluster)
- Future of Work 7-slide deck (replaced by Notion 3-point version)
- Day-end transition slides (almost absent in 2025; design from scratch as a deliberate ritual)
- Audience tier scoring visual (referenced by §4 in the existing ready RC block; needs design)
- ADAPT methodology one-pager (TBD per needs-owen.md)

### Defer

- Full visual audit of all 8 PDFs (needs human pass; Cowork can't do it from text)
- CoCreated source pattern integration (needs Drive access)
- Worksheet wireframe formalization (already partially done in ACTIVITIES; can wait until after Saturday walkthrough)

---

## Confidence levels

- **High confidence**: content patterns, curriculum metaphors, working agreement structure, definition ladder pattern, slide kind distribution.
- **Medium confidence**: layout systems (inferred from text grouping), tri-column / grid patterns, stat slide format.
- **Low confidence**: typography, color usage, image treatment, spacing. These need visual inspection.

A 60-min human pass through the 8 PDFs would convert most of the low-confidence items to medium or high. Cowork cannot do this pass.
