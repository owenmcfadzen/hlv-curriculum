# HLV Design Library Seed — 15 May 2026

Author note (Cowork): Concrete first-draft spec, informed by `slide-archive-analysis-2026-05-15.md` plus the live `index.html` CSS. Hex values pulled from `index.html` lines 13-47 and font-family tokens from lines 50-51. Where the spec needs visual confirmation against actual Porto 2025 slide files, items are flagged TBD-visual. This is a feed for Claude Design, not the design itself.

---

## Foundational tokens

### Palette (locked, from `index.html` CSS lines 13-47)

| Token | Hex | Semantic role | Where it appears now | Where it should appear in 2026 production |
|---|---|---|---|---|
| `--text` (Navy) | `#182D53` | Primary text, primary brand | Body text, headings, dark accents | All text-heavy surfaces; primary brand on covers |
| `--text-mute` | `#5B6B82` | Secondary text, metadata | Note authors, captions | Slide footers, panel attributions |
| `--text-faint` | `#8A95A8` | Tertiary text, placeholders | Empty states, hints | Slide page numbers, low-emphasis labels |
| `--bg` | `#FFFFFF` | Primary canvas | Slide background | Slide background |
| `--bg-alt` | `#F7F8FA` | Subtle surface | Section dividers | Section backgrounds, callout cards (Cream-equivalent) |
| `--bg-shade` | `#EFF1F4` | Tinted surface | Notes section card, hover states | Tinted callout panels, embedded artifacts |
| `--rule` | `#DEE2E8` | Subtle borders | Card borders, dividers | Same |
| `--rule-strong` | `#B5BCC8` | Stronger borders | Emphasized dividers | Same |

### Track colors (locked)

| Token | Hex | Track | Notes |
|---|---|---|---|
| `--product` (Coral) | `#E46C41` | Product | High saturation, used as accent + badge |
| `--business` (Green) | `#34C759` | Business | iOS-system green, slightly warm |
| `--market` (Blue) | `#3B7DD8` | Market | Clear blue, distinguishable from Navy text |

### Accent / signal colors

| Token | Hex | Role | Notes |
|---|---|---|---|
| `--violet` | `#7B4FDB` | Alumni / cross-team | Used for `audiences="alumni"` styling |
| `--gold` | `#C5A462` | Sponsor / external partner | Used for sponsor block `kind` styling |
| `--pop` (Pop Yellow) | `#FFD43B` | Highlight / urgent / "look here" | Used sparingly, avoid as background |

### Block-kind tints (live in CSS, used for schedule grid)

| Kind | Hex | Mood |
|---|---|---|
| welcome | `#FBE7C8` | Warm cream, low-saturation |
| work | `#E8E9EC` | Neutral grey |
| module | `#F3D8DD` | Soft pink, signals "teach" |
| game | `#CFDFE9` | Pale blue, signals "energizer" |
| rc | `#D85050` (white text) | Strong red, signals "test event" |
| panel | `#DDECCF` | Pale green, signals "external voice" |
| sponsor | `#F2B968` | Warm orange, signals "stakeholder" |
| teamteach | `#C5B7E8` | Pale violet, signals "synthesis" |
| social | `#DCD3EC` | Soft lavender, signals "off-program" |
| pitch | `#F4D4DD` | Soft pink, signals "deliverable" |
| lpp | `#C7DECC` | Mint, signals "convergence work" |

These exist as workbench grid colors. **Open question**: should the same tints reappear in slide design as section openers, callout cards, or kind badges? Cowork recommends yes — the cognitive consistency between workbench and slides reduces facilitator load.

### Status colors

| Token | Hex | Role |
|---|---|---|
| `--built` | `#2DA84B` | Activity worksheet built / `slide.status: ready` |
| `--partial` | `#E69500` | Worksheet exists with open decisions / `slide.status: draft` |
| `--blank` | `#9AA4B5` | Stub / not started |

---

## Type system

### Locked fonts (from `index.html` CSS lines 50-51)

- **`--sans`**: `'Barlow', system-ui, -apple-system, sans-serif`
- **`--condensed`**: `'Barlow Semi Condensed', var(--sans)`

### Owen-mentioned but not yet in workbench

- **Manrope** (mentioned in brief as alternative body face) — not currently loaded; would replace or supplement Barlow for body
- **Literata** (mentioned for long-form) — not currently loaded; suggested for chapter / handout / Foundation document long-form reading

**Recommendation**: keep `Barlow` + `Barlow Semi Condensed` as the working pair. Defer Manrope/Literata until there's a specific surface that needs them (likely Foundation Chapter formatting in Notion or a printed handout). Don't introduce a 3-font system without a clear need.

### Type scale (proposed, TBD-visual confirmation against archive)

| Role | Family | Size (approx) | Weight | Color | Where used |
|---|---|---|---|---|---|
| Slide hero / display | Barlow | 64-96px | 700 | `--text` | Cover slides, big stat slides |
| Section opener | Barlow Semi Condensed | 48-64px | 700 | `--text` | Day section openers, transition slides |
| Slide title | Barlow | 36-44px | 700 | `--text` | Standard content slide titles |
| Subtitle | Barlow | 24-28px | 500 | `--text-mute` | Slide subtitles, framing lines |
| Body | Barlow | 18-22px | 400 | `--text` | Slide body, paragraph copy |
| Body emphasis | Barlow | 18-22px | 600 | `--text` | Bold inline emphasis |
| Caption / label | Barlow Semi Condensed | 11-14px | 600 | `--text-mute` | All-caps labels, metadata, panel labels |
| Stat numeral | Barlow | 120-180px | 300 | `--text` | Single-stat slides ($10bn, 91%) |
| Footer / page number | Barlow Semi Condensed | 10-12px | 500 | `--text-faint` | Slide page numbers, attribution |

8 levels. Verify against actual slide spacing in PDFs before committing. Stat-numeral weight (300) is unusual — picked light to balance the size.

### Specific size/weight/color combinations from observed archive patterns

- **All-caps labels** (BE PRESENT, EXPRESS YOUR POINT OF VIEW): Barlow Semi Condensed, 600, letter-spacing +0.08em, `--text`. Used for working agreement bullets and framework category labels.
- **Stat slides** ($10bn, 91%): single large numeral, smaller caption beneath. Captures attention without competing visual.
- **Quote / pull-out**: not heavily seen in extraction; needs visual confirmation. If used, Barlow Italic 28-36px, `--text`.

---

## Slide template kinds

11 templates, each with one-paragraph spec. Numbered for reference in the design library.

### 1. Cover slide

**Use**: program open, day open, section open. **Layout**: full-bleed brand color or white with Navy hero text. Centered or left-aligned title (Barlow 64-96px, 700, `--text`). Subtitle line in Barlow Semi Condensed 24-28px, 500, `--text-mute`. Date / location footer in Barlow Semi Condensed 10-12px, `--text-faint`. Minimal decoration. **Frequency**: ~3% of deck (36 of 1112 entries in 2025 archive).

### 2. Section opener

**Use**: introduce a new module within a day. **Layout**: large section number + section title. Section number in Barlow Semi Condensed all-caps "MODULE 02 / DAY 3" style. Title in Barlow 48-64px, 700, `--text`. Optional one-line framing in Barlow 18-22px, `--text-mute`. **Frequency**: implied recurring; not separately tagged in 2025 extraction.

### 3. Definition headline

**Use**: introduce a big concept ("What is entrepreneurship?"). **Layout**: question or statement as the hero, no body. Barlow 44-64px, 700, `--text`. White or `--bg-alt` background. Pairs with a Definition Unpack slide that follows. **Pattern**: see Day 1 slides 27, 38 (the headline-then-unpack rhythm). **Frequency**: heavy use across all decks.

### 4. Definition unpack

**Use**: decompose the headline concept across 3-4 sub-points. **Layout**: small headline at top (24-28px), 3-4 numbered or bulleted sub-points below. Each sub-point: 18-22px Barlow body. Reveal one at a time per click if presenting live. **Pattern**: Day 1 entrepreneurship definition uses a 4-point unpack. **Companion to**: Definition headline.

### 5. Framework introduction

**Use**: introduce a methodology (Problem-Solution-Scale, ADAPT, 5 Whys, Active Listening). **Layout**: framework name as title. Below: 3-5 cells in tri-column scan grid. Each cell has a sub-label and a one-line description. Use track colors or kind tints as cell backgrounds for visual differentiation. **Pattern**: Day 1 Problem-Solution-Scale slide is the canonical example.

### 6. Framework apply (worksheet card)

**Use**: students apply a framework to their own work (Solution Blueprint, Canvas Lite, Landscape Map, etc.). **Layout**: zone-based wireframe (currently exists in `ACTIVITIES` array as `wireframe.zones`). Numbered cells, labeled, with prompts. Print-ready proportions. **Frequency**: 9 worksheets currently built (P1-M3). **Recommendation**: the existing ACTIVITIES wireframe spec format (viewBox + zones array) is a good basis; formalize it as the worksheet-card template across the design library.

### 7. Exercise instruction

**Use**: tell students what to do in an activity (5 Whys, Empathy interview, Problem Spotters). **Layout**: title + 3-5 numbered steps + time-box. Steps in Barlow 18-22px. Time-box in Barlow Semi Condensed 14-16px caption. Optional: small visual at right showing the artifact (e.g., trio diagram for Active Listening). **Frequency**: 3% of 2025 deck (37 of 1112 — under-represented; 2026 should generate more).

### 8. Stat slide

**Use**: punctuate with a single number or claim. **Layout**: full-bleed white, single large numeral centered (Barlow 120-180px, 300, `--text`). One-line caption beneath in Barlow 18-22px, `--text-mute`. **Pattern**: Day 1 "$10bn", "91%", "88%". **Frequency**: low but high-impact. Use sparingly (1-3 per day max).

### 9. Customer / panelist quote

**Use**: feature a specific quote from a real customer or panelist. **Layout**: large pull-quote in Barlow 28-36px, italic or 500 weight, `--text`. Attribution line below in Barlow Semi Condensed 14-16px, `--text-mute` (Name + role + relationship to challenge). Optional headshot at left. **Frequency**: not separately tagged in 2025 extraction; recommend introducing in 2026.

### 10. Transition / breath

**Use**: end of day, pre-break, between modules. **Layout**: minimal. White or pale `--bg-alt` background. Single line of Barlow Semi Condensed 24-28px, `--text-mute`. Could be a simple instruction ("See you at 14:00"), a question for reflection ("What landed today?"), or just a blank slide with a page number. **Frequency**: 1 of 1112 in 2025 extraction (almost absent — design opportunity for 2026).

### 11. Summary / synthesis

**Use**: end of day, end of module, end of program. **Layout**: title in Barlow 36-44px, 700. Below: 3-5 take-away bullets in Barlow 18-22px. Optional: callback to the day's framework or rollercoaster placement. **Frequency**: implied across decks but not separately tagged. **Pattern**: Day 1 "Recap & Reflections" slot.

---

## Diagram primitives

6 recurring diagram shapes from archive. Specs as a starting point for vector library.

### 1. Linear flow with arrows

**Pattern**: 3-5 stages laid horizontally, connected by chevron arrows. Each stage has a one-word label + brief description. **Use**: Discover → Refine → Develop → Define. ADAPT (5 stages, Analog → Dialogue → Adjust → Produce → Test). **Spec**: equal-width cells, chevron connectors at `--rule-strong`. Cell backgrounds use sequential `--bg-alt` → `--bg-shade` to suggest progression.

### 2. Tri-column scan grid

**Pattern**: 3 equal-width cells, no connectors. Each cell has a header + 2-3 bullet points. **Use**: Future of Work themes, Active Listening trio, Problem-Solution-Scale. **Spec**: 1fr 1fr 1fr CSS grid. Optional kind-tint backgrounds. 4-8% gap between cells.

### 3. 2-row × 5-column day overview grid

**Pattern**: 10 cells in 2 rows of 5, each representing one day of the program. Each cell has Day number + title + 1-2 sentence description. **Use**: Program Overview (Day 1 slide 12). **Spec**: equal-square cells, day-color tints (sequential warm-to-cool gradient or kind-aligned by dominant block kind).

### 4. Rollercoaster curve

**Pattern**: existing visual asset, used both as activity diagram (placement points) and program-arc visualization. **Use**: Mon AM Intro game, recurring throughout program. **Spec**: keep existing asset, no redesign needed. Variants: empty curve (for placement), populated curve (for "we are here" framing).

### 5. Trio role layout

**Pattern**: 3 figures or labeled cells representing roles (Subject / Listener / Observer). **Use**: Active Listening exercise. **Spec**: tri-column with stick figure or icon at top of each, role label below, behavior description at bottom. Functions as an exercise instruction graphic.

### 6. Problem-Solution-Scale tri-cell

**Pattern**: 3 connected cells with arrows, representing the problem-to-solution-to-scale flow. **Use**: Day 1 framework slide, recurring concept anchor. **Spec**: 3 cells with chevron connectors. Each cell has a label and a one-line question (What is the problem? How do you solve it? How does it become a business?).

### Worksheet wireframe primitives (from existing ACTIVITIES)

The 9 worksheets in `index.html` ACTIVITIES already have zone-based wireframe specs. Recurring shapes:
- 8-frame journey grid (P1 Solution Blueprint)
- 6-box canvas (B1 Canvas Lite — 3x2 grid)
- 5-slot validation map (M1 Landscape Map)
- Single-page narrative spec sheets (P3 Prototype Spec Sheet, B3 100-Day Plan)

These are already built. Formalize the wireframe-zone format (viewBox + zones array with x/y/w/h/label) as the worksheet-card template type.

---

## Patterns NOT to use

From Porto 2025 archive — explicitly do not lift forward:

1. **Co-Created branding** (logos, "co-create with purpose" language, partner credit slides). Retired in 2026; replace with HLV branding.
2. **8-trait entrepreneurial slide** (Day 1 slide 39 with detailed trait descriptions). Replaced by Stacey's 4-behavior cluster (Problem spotter / Experimenter / Gravity maker / Resilient learner). Lift the new not the old.
3. **Future of Work 7-slide deck** (Day 1 slides 40-46, AI/automation/freelance themes as standalone deck section). Replaced by Notion 3-point version (1 slide max).
4. **Heavy didactic slides** (talking-head bullet lists with dense paragraphs). The 87% teaching-tagged proportion in 2025 is too high; 2026 should rebalance toward exercise instruction and framework apply.
5. **Generic transition slides** (almost absent in 2025; design intentional ones rather than skipping).
6. **Logo-heavy partner credit slides** unless contractually required. Distract from program flow.

---

## Open questions for Owen

1. **Cream**: Owen's brief lists Cream as a palette token but the workbench CSS uses `--bg-alt` (`#F7F8FA`) and `--bg-shade` (`#EFF1F4`) for warm-neutral surfaces. Is Cream a third variant, a rename of `--bg-alt`, or a slide-specific token?
2. **Manrope and Literata**: not loaded in workbench. Bring them in for slide production, or stay with Barlow only?
3. **Cell-background tints in slides**: should the kind-tint colors used in workbench grid (welcome cream, work grey, module pink, etc.) recur in slide design as section openers or callout cards? Cowork recommends yes; needs Owen confirmation.
4. **Stat-numeral weight 300**: light weight is a contrast move against the size, but Barlow 300 may not be loaded. Confirm font weights available.
5. **Transition slides**: how much design effort to invest? 2025 had almost none (1 of 1112). 2026 could make day-end rituals a deliberate design.
6. **Quote slide format**: customer / panelist quotes recur in spirit (named panelists, real frustrations) but aren't a tagged template type. Worth formalizing?
7. **Audience tier visual**: the 3 Wk1 Thu Pitches blocks use audience tiers (peers / mentors-staff / external-alumni-sponsor). Does this need a visual treatment so the room knows which tier they're in?
8. **Reality Check card**: 3 RC blocks in 2026 plus implicit audience tiers. Distinct visual treatment so RCs feel different from regular work blocks?

---

## Recommended first cuts for Claude Design

If Saturday Owen has 60-90 min on the design library:

1. **Lock the palette** — copy the table above into Claude Design with hex values + semantic roles. ~15 min.
2. **Lock the type scale** — 8 levels, mostly Barlow. ~15 min.
3. **Build templates 1-4 first** (cover, section opener, definition headline, definition unpack). These cover ~40% of slides by frequency. ~30 min.
4. **Build templates 8 + 10** (stat, transition). High-impact, low-effort. ~15 min.
5. **Defer**: framework apply (already exists in ACTIVITIES), exercise instruction (needs voice pass with Stacey first), customer quote (needs panelist confirmation), summary / synthesis (depends on day-end ritual decision).

Then defer the diagram primitives library to a separate session — vector work warrants its own sprint.
