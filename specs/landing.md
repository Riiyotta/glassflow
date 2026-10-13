Source: https://www.glassflow.ai/

# Landing / SEO / legal routes: build spec

Measured live on 2026-10-13 with headless Chromium (Playwright). Viewports were 1440x900 (desktop) and 390x844 (mobile). Each page was scrolled top to bottom before measuring so Framer appear effects had settled. Coordinates are document px at 1440 unless marked (390).
Tokens, nav, footer and primitives come from `/Users/riyaghosh/V3/GLASSFLOW/CLONE_SPEC.md` and existing code. "Reuse X" means: use the existing component as-is, plus only the deltas listed.

- Code primitives (`src/components/ui.jsx`): `Shell`, `Spacer`, `Dots`, `TitleBar`, `BigButton`, `DarkButton`, `Arrow`.
- Code sections: `Navbar`, `Footer` (this includes the 67px spacer, the CTA band and the footer grid), plus `Hero`, `LogoStrip`, `Testimonial`, `Tares`/`Rius`, `Quickstart` and `Faq`.
- Tailwind token names used below: `page` #492400, `panel` #2D1804, `bar` #2D1803, `deep` #1D0E00, `line` #5F3E1F, `amber` #FFAC00, `link` #D48F04, `cream` #F1EFDF, `cream-64`, `muted` #8F8982, `on-amber` #1D0E00.
- New colour seen on these pages: `#1E0F00`, rgb(30,15,0). It is the blog hero panel, share bar, author row, code block bg and case-study card bg. It is visually the same as `deep` #1D0E00, but it is a distinct computed value; add it as token `ink` or reuse `deep`. Also `#2D1805` for the case-studies heading panel (same as `panel`).

## 0. What these URLs actually are (important)

Most of the requested paths are **308 permanent redirects**, verified with curl and Playwright. Two serve a legacy template that predates the current design.

| requested path | HTTP | final URL | template |
|---|---|---|---|
| /clickstack | 308 | /blog/open-source-observability-clickstack-glassflow | **T1 Blog post** |
| /joins | 308 | /blog/clickhouse-joins | **T1 Blog post** |
| /kafka-to-clickhouse-connector | 308 then 308 | /blog/kafka-to-clickhouse-with-glassflow-and-altinity-cloud, which 308s to **/blog** (blog index) | Blog listing (see section 6) |
| /kafka-to-clickhouse-pipeline-guide | 200 | itself | **T4 Legacy gated-ebook page** |
| /replacingmergetree-alternative | 308 | /blog/part-3-clickhouse-replacingmergetree-materialized-views-not-enough | **T1 Blog post** |
| /vector-dev-alternative | 308 | /blog/when-vector-becomes-your-streaming-engine | **T1 Blog post** |
| /use-cases/real-time-observability-pipelines | 308 | /case-studies | **T5 Case-studies index** |
| /clickhouse-mistakes-guide | 200 | itself | **T4 Legacy gated-ebook page** |
| /terms-of-service | 200 | itself | **T2 Legal with TOC sidebar** |
| /privacy-policy | 200 | itself | **T2 Legal with TOC sidebar** |
| /cookie-policy | 308 | /privacy-policy | (T2, same page as privacy) |
| /imprint | 200 | itself | **T3 Legal single column** |
| /imprint-old | 308 | /imprint | (T3, same page as imprint) |

Implementation recommendation:
- Register the redirects as real redirects (or `<Navigate replace>` client routes) to the target paths.
- Build the targets once per template.
- Blog body copy links to the short SEO slugs, e.g. `../replacingmergetree-alternative` and `../vector-dev-alternative`. That is why these redirects exist, so keep them.

### Shared chrome per page

| page | home Navbar | Footer (spacer + CTA band + footer grid) |
|---|---|---|
| T1 blog posts (4) | yes, unchanged at desktop (mobile: see 0.1) | yes, unchanged. The page's own "Two products" CTA section sits immediately before Footer's 67px spacer |
| T2 terms / privacy | yes | yes, unchanged, but preceded by **one extra** 67px `Spacer` (two 67px bands before the CTA band) |
| T3 imprint | yes | yes, unchanged, also preceded by one extra 67px `Spacer` |
| T5 /case-studies | yes | yes, unchanged (only Footer's own 67px spacer) |
| /blog | yes | yes, unchanged |
| T4 legacy guides (2) | **NO**: different legacy black nav (section 4.1) | **NO**: no CTA band and no footer at all; the page ends after the hero |

### 0.1 Navbar delta observed on ALL new-design pages at 390 (flag for Navbar owner)

- The mobile nav is **80px tall, in two rows**.
- Row 1 (y 0-40): logo cell, then `get_started` (amber, x 246) plus the 42px arrow cell.
- Row 2 (`data-framer-name="mobile-links"`, y 40-80, full-bleed, bg `deep`) holds five link cells: `tares` (x 18) → /tares, `rius` (x 100) → /rius, `docs` (x 178) → https://docs.glassflow.ai/, `blog` (x 256) → /blog, `contact` (x 322) → /contact.
- All row-2 labels are Geist Mono 14/18.2 w700 `muted`.
- The current `Navbar.jsx` renders an empty 88px cell instead. That matches the home spec, which only saw "tares" at y=51. On these pages the page content starts at y=80 (390).

---

## T1. Blog post template (4 routes)

Routes and per-post data are in T1.9. Desktop page heights: clickstack 13398, joins 23988, part-3 9014, vector 8112. Mobile (390): 23819 / 39112 / 16271 / 13966.

### T1.1 Section stack (desktop, clickstack y-values; hero height varies with title length)

| # | section | y | height | build |
|---|---|---|---|---|
| 1 | Navbar | 0 | 40 | reuse `Navbar` |
| 2 | divider-xs | 40 | 32 | `Spacer` variant with inner height 30 (32 incl. borders), bg `page`, column border lines at x=64/1376 |
| 3 | Post hero | 72 | 480 (joins 462, part-3 510, vector 432) | NEW, T1.2 |
| 4 | divider | 552 | 67 | reuse `Spacer` |
| 5 | Article body | 619 | content-driven | NEW, T1.3 |
| 6 | divider | | 67 | reuse `Spacer` |
| 7 | Share bar | | 64 | NEW, T1.4 |
| 8 | "You might also like" | | 160 + 570 | NEW, T1.5 |
| 9 | divider | | 67 | reuse `Spacer` |
| 10 | "Two products" CTA | | 452 | NEW, T1.6 |
| 11 | Footer | | 67 + 320 + 208 + 66 | reuse `Footer` (its 67px spacer = divider before the CTA band) |

### T1.2 Post hero (NEW section type, also the basis of T5 and the blog index hero)

Wrapper `Shell` (0 64px padding). Inside, a 1312-wide block:
- **Bar**: 38px tall, bg `deep`, padding 16px, 1px `line` bottom border.
  - `Dots` at the left (x=80).
  - Centred breadcrumb link "blog / …" → `/blog`, Geist Mono 14px/21px w300, letter-spacing -0.28px, colour #999999. It is literally "blog / " followed by a U+2026 ellipsis, not the post title.
- **Main row** (`main-wr`): bg #1E0F00, flex row, height = hero minus 38.
  - **Left column** 644 wide (x 64-708), flex column:
    - Background: image `p8ihsATIQW2BpC2j7ekzEF2gA.jpg` (the same dithered image as the CTA band's left cell), `object-fit: cover`, filling the column's upper "content" area (644 x hero-109).
    - Top-left decoration: a 48x72 pixel-step SVG at (64,111): three 24px squares, fill #492400 (markup in landing-assets.md).
    - `content-wr` padding 64px 32px, flex column, gap 15px. Children:
      - **Category pill**: bg `amber`, padding 6px 10px, 24px tall. Text Inter 12px/12px w500, UPPERCASE, colour #1D0E00, centred. Values: "Engineering" or "Agent Observability".
      - **Title (h1 role)**: max-width 580. Inter Display 40px/48px w400, letter-spacing -1.6px, `cream`. Rendered as one span per word for the appear animation (T1.8).
      - **Description**: Inter Display 21px/29.4px w400, letter-spacing -0.84px, `cream`, on a wrapper with **opacity 0.64**. Rendered as one span per character.
    - **Details row**: 71px tall, 1px `line` top border, two equal cells 322 wide (1px `line` divider between). Each cell has padding 12px 32px, flex row, gap 12:
      - a 23x23 line icon (author cell: person outline; date cell: calendar outline; cream stroke, drawn inside a 1px square frame);
      - a two-line label stack: "Written by" / "Date added" in Geist Mono 14px/21px w300, letter-spacing -0.28, `cream`; then the value (author name; date as `<time>`) in Inter 16px/24px w300, letter-spacing -0.32, `cream`.
  - **Right column** 668 wide (x 708-1376), 1px `line` left border, padding 12px:
    - Inner 644 x (hero-62) frame with background image `5G4h16OWSlfa4F2lERWRFPE.jpg` (dithered orange pixel field), cover.
    - On top, the post cover image with `object-fit: contain`, padding 0 24px (596 wide), vertically centred.
- Mobile (390), stacked:
  - bar at y=80 (38);
  - `main-wr` flex column;
  - `content-wr` padding 32px, pill centred;
  - **title switches to Inter (not Display) 32px/38.4px w500, letter-spacing -1.28px, centred**;
  - description centred (same 21/29.4);
  - details row 2 x 195 cells;
  - then the right panel 390 x 334 (padding 12, inner 366x310, cover image contain 318 wide).
- Mobile hero total is 789 tall; then a 67px divider (full-bleed, no gutters).

### T1.3 Article body (NEW: rich-text renderer)

- Outer: `Shell`, then an inner column 928 wide at x=256-1184. That column has 1px `line` left and right borders (drawn as ::after), padding 32px 64px 64px.
- Content measure: **800px** at x=320. Background is page `page` #492400; the gutters between x=64-256 and 1184-1376 are plain `page` with the 1312-column lines at 64/1376.
- Mobile: no outer gutters; padding 32px 24px 64px; measure 340 at x=24.

Element styles (Framer presets; spacing is margin-top only, margin-bottom 0):

| element | font | size / line-height | weight | letter-spacing | colour | margin-top | notes |
|---|---|---|---|---|---|---|---|
| p | Inter Display | 18 / 32.4 | 400 | -0.36 | `cream` | 20 | left aligned |
| h2 | Inter | 32 / 44.8 | 500 | -1.28 | #FFFFFF | 40 | |
| h3 | Inter Display | 26 / 36.4 | 500 | -1.04 | #FAFAFA | 40 | |
| "bold-paragraph heading" | Inter Display 18 / 32.4 w700 | | 700 | -0.36 | `cream` | 20 | many sub-heads are `<p><strong>` |
| strong (inline) | inherit | | 700 | | `cream` | | |
| em (figure captions) | Inter Display 18/32.4 | | 400 italic | | `cream` | | e.g. "Figure 1: …" |
| a (inline) | inherit | | 400 | | **#FFAC00**, `text-decoration: underline` | | |
| inline code | Geist Mono 18 / 32.4 | | 400 | -0.36 | rgba(255,255,255,0.7) | | bg #1E0F00, radius **6px**, padding 1.8px 3.6px. A link inside code keeps amber + underline |
| ul / ol | | | | | | 16 | `padding-left: 0`. Each `li` has padding-left 22.08px with an absolute `::before` "•" (8.64px wide, `cream`) at left 0; ol uses numerals in the same slot. li spacing 0 (li contains a p 18/32.4) |
| img | | | | | | 16 (0 when first) | full 800 width, `object-fit: fill`, 1px solid #222222 border, radius 0. Some images are wrapped in a link |
| table | figure wrapper margin-top 16, `overflow-x: auto` | | | | | | table 800 wide, 1px solid `line` outer border, `border-collapse: separate`, spacing 0; cells carry 1px `line` top borders (td border-top measured; column separators also visible in `line` colour). th/td padding 16px; cell text is p Inter Display 18/32.4 w400 `cream` (header not bold); **th bg rgba(153,153,153,0.1)**, td transparent |
| code block | | | | | | 16 | see below |
| h1 inside body (quirk) | Inter 16 / 19.2 w400 | | | | **#000000** | | joins ("Mastering JOINs in ClickHouse") and part-3 (repeats the post title) have an unstyled h1 that renders near-invisible black-on-brown. Reproduce as-is for parity, or drop it. Note it either way |

Code block (Framer `framer-cb`, Sandpack-style):
- Container 800 wide, bg #1E0F00 (rgb 30,15,0), **1px solid rgb(93,60,28)** border, radius 0. `pre` padding 32px 32px 32px 36px, `overflow-x: auto`. No line numbers, no tabs or filename bar.
- Text: Geist Mono 14px/21px **w600**.
- Syntax colours (GitHub-dark palette):

| token | colour |
|---|---|
| base / punctuation | #E6EDF3 |
| keywords (CREATE, SELECT, TABLE) | #FF7B72 |
| strings / JSON keys | #A5D6FF |
| numbers / booleans | #7EE787 |
| comments | #8B949E |

- **Copy button**: absolute, top 14px, right 14px, 52x32, padding 8px 10px, radius 10px, 1px solid rgba(255,255,255,0.12), bg rgba(0,0,0,0.35). Text "Copy" in the system sans-serif 12px w600, white. Click copies the code (aria-label "Copy code").

Deprecation banner image:
- clickstack and part-3 start the body with an image link (`tUJLrWUiAaxxMQEGHnoT5vE1w.png`, 798x149) → https://www.glassflow.ai/ (opens in a new tab).
- It shows: "This product is no longer in development. You can access the open source code on GitHub: glassflow/clickhouse-etl. GlassFlow is now building data infra products for AI Agents. Check what's new at glassflow.ai".
- It is baked into the image; no live text.

### T1.4 Share bar (NEW)

- Row: `Shell`, inner padding 0 192px. The bar is 928 wide at x=256, 64 tall, bg #1E0F00, padding 12px, flex row, space-between.
- Left: `Dots` (x 268), then h2 "Share the article" in Geist Mono 14px/16.8px w400, letter-spacing -0.56, `cream` (x 306).
- Right: six 22x22 icon buttons, white (`currentColor` #FFF), pitch 52px (x 881, 933, 985, 1037, 1089, 1141), cursor pointer. These are not `<a>` elements; they open popups:
  1. X: `https://x.com/intent/tweet?url=<encoded page URL>&text=Great%20read%20from%20our%20blog`
  2. Facebook: `https://www.facebook.com/sharer/sharer.php?u=<url>`
  3. LinkedIn: `https://www.linkedin.com/shareArticle?url=<url>` (live redirects through the LinkedIn login)
  4. Reddit: `https://www.reddit.com/submit?url=<url>&title=Great%20read%20from%20our%20blog`
  5. Copy-link icon: copies the URL, no navigation
  6. Share icon: no popup observed (Web Share API, `navigator.share`)
- SVG markup is in landing-assets.md.
- Mobile: 390 x 145, column, padding 32px 12px, gap 24; title centred, icons in a row below.

### T1.5 "You might also like" (NEW; the card is the shared blog card used on /blog too)

- Title row: `Shell`, inner padding 64px 24px, height 160. Text "You might also like" (p) in Inter Display 32px/32px w400, `cream`, x=88.
- Listing row: `Shell` with 3 cards flush (437 / 437 / 438 wide, x 64 / 501 / 939), height 570, no gap.
- Card anatomy (`Stack`, bg `panel` #2D1804, the whole card is one `<a>`):
  1. **Bar**: 38px, bg `deep`, padding 16, `Dots` left, no label.
  2. **Image**: 437x250, object-fit cover.
  3. **Description block**: padding 24, flex column, gap 16.
     - Tag pill: bg `amber`, padding 6px 10px; Geist Mono 12px/12px w500 UPPERCASE, colour **#492400**.
     - Title (2-line clamp): Geist Mono 16px/20.8px w500, letter-spacing -0.64, #E0E0E0.
     - Excerpt (2-line clamp, ellipsis): Inter Display 16px/22px w400, letter-spacing -0.32, rgba(230,230,230,0.8).
  4. **Author row**: 40 tall, bg #1E0F00, two halves with a 1px `line` divider.
     - Left: "Written by" in Geist Mono 14/21 w400, letter-spacing -0.32, rgba(230,230,230,0.8), centred.
     - Right: author name in Inter Display 14/21 w400, same colour, centred.
  5. **Button**: 52 tall. Frame bg #1E0F00, padding 4. Inner bg `cream` #F1EFDF, padding 10px 24px. Label "read article" in Geist Mono 14px/24px w500, letter-spacing -0.32, #1E0F00, centred.
     - Rolling-text hover (measured): the label is rendered twice, stacked 30px apart, in a 24px-high clip. On card hover both copies translate up 30px, so the second copy rolls in (the idle copy moves y 697→667).
     - Duration not readable; use ~0.3s ease.
     - No other hover change: image, title colour and card opacity are unchanged.
- The same three cards appear on all four posts:
  1. TUTORIALS, "Fraud Detection Pipelines with Kafka, Glassflow, and ClickHouse", "A demo using GlassFlow to deduplicate and filter Kafka events before they reach ClickHouse for real-time fraud detection.", Armend Avdijaj → `/blog/fraud-detection-pipelines-kafka-glassflow-clickhouse`
  2. PRODUCT UPDATES, "GlassFlow Streaming ETL now scales to 500k+ Events/Sec with zero changes to your existing pipeline", "Teams kept asking if Glassflow would scale, so we rebuilt it to grow from small to massive workloads without changing…", Armend Avdijaj → `/blog/glassflow-now-scales-to-500k-events-per-sec`
  3. ENGINEERING, "How to Handle Semi-Structured Data in Your Log Pipelines", "Turn messy logs into analytics-ready data with GlassFlow & ClickHouse.", Armend Avdijaj → `/blog/handle-semi-structured-data-log-pipelines`
- Mobile: cards are full-bleed 390 wide, stacked with a 24px gap; image 223 tall; card 543 tall.

### T1.6 "Two products. Two starting points." CTA (NEW)

- `Shell`, a 1312 x 452 frame with background image `h0ej46NDlXvCksM6LvlI4w4Ss.jpg` (3936x1500, cover). The image is a dithered amber/yellow GlassFlow 3-stripe mark on the right over an orange pixel field.
- Padding 64px 128px. Copy column 640 wide at x=192: flex column, gap 64 (copy, then buttons); copy gap 32.
- Heading: "Two products." / "Two starting points." (2 lines) in Inter Display 40px/40px w400, `cream`.
- Body: Inter Display 16px/24px w400, letter-spacing -0.18, `cream`. Text: "Tares is open source. Kick the tires, open an issue, and drop a star if it's useful." followed by a line break, then "Rius, end to end. Guides for wiring up traces, MCP, and retention, from first span to production."
- Buttons row, gap 8:
  - **Primary** 218x52: reuse `BigButton` styling **without the arrow cell**. Amber frame padding 4; inner hairline cell padding 10px 24px; label "star Tares on GitHub" in Geist Mono 14/24 w500, letter-spacing -0.32, `on-amber`. Links to https://github.com/glassflow/tares.
  - **Secondary** 218x52: frame bg #1E0F00 padding 4; inner bg `panel` padding 10px 24px; label "read the Rius guides" in `cream`. Closest primitive is `DarkButton` with bg #1E0F00. Links to https://docs.glassflow.ai/rius/guides.
- **Mobile (390) uses DIFFERENT COPY** (a Framer mobile variant):
  - frame padding 64px 32px;
  - heading "Give your agent one place to look. Everything your systems emit, in one call." in Inter Display **42px/42px** (5 lines, 326 wide);
  - body "Two commands and a source you already run.";
  - same two buttons stacked vertically (pitch 57px); section 562 tall.

### T1.7 Interactions

- Breadcrumb links to /blog. Share icons as in T1.4. Inline body links are amber and underlined; internal ones use the short slugs that redirect.
- Code Copy button. Card "read article" rolling text.
- No sticky elements (the nav scrolls away, as on home). Smooth scroll is the global Lenis setup.

### T1.8 Motion (measured by sampling computed styles every 100ms from navigation start)

- **Hero title words**: start at opacity 0.001, transform translateY(10px), filter blur(10px). They animate to opacity 1, translateY 0, blur 0.
  - Each word takes ~600ms. Curve: the first ~100ms is slow, most of the change happens in the middle, and the last 100ms settles, so use a cubic ease-out/in-out.
  - **Stagger ~35ms per word**: word 4 lags word 1 by about 100ms.
  - Animation starts on hydration (~1.2s after navigation in headless; not a fixed delay).
- **Description characters**: same effect (opacity 0.001→1, y 10→0, blur 10→0), starting with the title.
- Everything else (right image panel, body, cards) was at opacity 1 / no transform at all sample points. No scroll-triggered reveals were observed on cards.
- No CSS keyframes. Global transitions: `color 0.3s cubic-bezier(0.44,0,0.56,1)` (Framer link preset).

### T1.9 Per-post content (only these differ between the 4 posts)

| | clickstack | joins | part-3 (replacingmergetree) | vector |
|---|---|---|---|---|
| final URL | /blog/open-source-observability-clickstack-glassflow | /blog/clickhouse-joins | /blog/part-3-clickhouse-replacingmergetree-materialized-views-not-enough | /blog/when-vector-becomes-your-streaming-engine |
| `<title>` | ClickStack: Open Source Observability Stack Setup Guide \| GlassFlow | ClickHouse JOINs Explained: Types, Examples & Best Practices | Limitations of ReplacingMergeTree and Materialized Views in ClickHouse | Scaling Vector for ClickHouse: Throughput, Backpressure, and Stateful Limits |
| meta description | Build a real-time, open source observability stack using ClickStack and GlassFlow. Deduplicate logs, evolve schemas safely, and reduce pipeline complexity and cost. | ClickHouse join algorithms explained: hash join, merge join, grace hash and when to use global join in distributed clusters. | ReplacingMergeTree and Materialized Views help with JOINs and deduplication in ClickHouse – but often fail at scale. Learn what works better for large, real-time datasets. | Exploring Vector's design envelope in high-throughput observability systems. Learn where core scaling flattens, how backpressure propagates, and why long-lived state changes the architecture. |
| pill | ENGINEERING | ENGINEERING | ENGINEERING | AGENT OBSERVABILITY |
| hero title | ClickStack: How to Build an Open Source Observability Stack with GlassFlow | ClickHouse JOIN Guide: Global Join, Algorithms, Asof, Semi & Anti | Part 3: ClickHouse ReplacingMergeTree and Materialized Views are not enough | When Vector Becomes Your Streaming Engine |
| description | Open source observability with ClickStack and GlassFlow | Learn ClickHouse JOINs step by step: types, examples & best practices. | Deep dive on limitations of ReplacingMergeTree and Materialized Views. | This is what happens when vertical scaling becomes your bottleneck |
| author / date | Armend Avdijaj / Jul 1, 2025 | Armend Avdijaj / Sep 26, 2025 | Armend Avdijaj / Mar 28, 2025 | Armend Avdijaj / Feb 12, 2026 |
| cover image (also og:image) | 2H7CSL9l0NoquN1PyW3SwMuFE2Q.png | 3hxsOE4L7XVTLV87Sf9Txk54M.jpeg | bmoCJ0qMNk3pOZHS9O1RgkELr2g.svg | An04fpR6GVV6jHuH4S5T3Z6jGE.png |
| hero height | 480 | 462 | 510 | 432 |
| body blocks | deprecation banner, 2 tables, 2 lists, 2 code blocks, 3 images | 4 diagrams, tables, lists, ol, many code blocks (28 Copy buttons) | deprecation banner, lists, code blocks | prose only (headings are `<strong>` inside h2/h3) |

Body outlines (heading level, then a one-line summary; do not transcribe prose; CMS or MD content to be sourced separately):

**clickstack** (all H2):
- Introduction: teams are caught between costly managed observability vendors and DIY complexity; frames ClickStack + GlassFlow as the answer.
- Understanding ClickStack as a Complete Observability Platform: ClickStack unifies logs/metrics/traces as wide events on ClickHouse. Includes a 2-col table "Traditional Observability Stack vs ClickStack Unified Approach", the architecture figure with caption, and a bullet list of advantages.
- GlassFlow's Real-Time ETL Capabilities: GlassFlow as the stream processor between Kafka and ClickHouse. Bold sub-heads: Real-time Deduplication, Temporal Stream Joins, Exactly-Once Semantics, Schema Evolution Handling; feature table.
- Solving Observability Data Challenges: GlassFlow + ClickStack: dedup, schema evolution, enrichment and data quality problems and how the pair solves them.
- Architecture Patterns and Best Practices: three-layer design (Kafka buffer, GlassFlow transform, ClickStack store); includes a wide diagram image.
- Real-World Implementation Examples: production precedents (Cloudflare etc.) plus a JSON pipeline config code block and a SQL schema code block.
- Implementation Guide and Migration Strategy: Docker Compose local setup and phased migration. Bullet list with bold lead-ins: Monitoring and Alerting, Security, Disaster Recovery, Performance Validation.
- Final Thoughts: summary of benefits.
- References: link list.

**joins**:
- H1 (unstyled quirk) "Mastering JOINs in ClickHouse", then "TL;DR: Key Takeaways" bullet list (Denormalize First, Join Second; Use the Right JOIN for the Job; Performance is in Your Hands; Know the Algorithms).
- H2 Why JOINs in a Columnar World?: ClickHouse is columnar/OLAP so JOINs behave differently than in row stores.
- H2 A Refresher on Standard SQL JOINs: basics, with sample tables in code blocks.
  - H3 Inner Join / Left Outer Join / Right Outer Join / Full Outer Join: definition, diagram image, query and result code blocks each.
  - H3 Why Venn Diagrams Can Be Misleading: Venn diagrams depict set operations, not joins.
- H2 ClickHouse JOIN: ClickHouse extensions to standard joins.
  - H3 Strictness Modifiers: ANY and ALL: ALL returns every match, ANY the first match.
  - H3 Filtering JOIN: SEMI and ANTI: filter one table by another.
  - H3 Time-Series Magic: ASOF JOIN: nearest-match joins on time.
  - H3 A Special Case: Unnesting with ARRAY JOIN: unnests array columns.
  - H3 The Summary of ClickHouse JOIN Toolkit: quick-reference table (JOIN Type | …).
- H2 A Peak Under the Hood at JOIN Algorithms: algorithm choice drives performance.
  - H3 The Default Workhorse: Hash-Based Joins; H3 Leveraging Order: Merge-Based Join; H3 The Ultimate Speed: Direct Join (bold sub-heads: Direct Join, Full Sorting Merge Join, Grace Hash Join, Partial Merge Join).
  - H3 Choosing the Right JOIN Algorithm: trade-off between RAM and disk.
- H2 Performance Playbook: Optimizing Your ClickHouse JOINs: query-design tips (small table on the right, filter early…).
- H2 Navigating the Limitations: where ClickHouse JOINs struggle.
- H2 Conclusion: wrap-up.

**part-3 (replacingmergetree)**:
- Deprecation banner, then H1 (unstyled quirk, repeats the title). Intro: after Parts 1-2, this part reviews ClickHouse-native fixes.
- H2 Handling JOIN Performance in ClickHouse: large JOINs hurt real-time analytics.
  - H3 Using Materialized Views for Pre-Joined Data: precompute joins (bold "Limitations of Materialized Views", SQL code block).
  - H3 Denormalization instead of JOINs: store all fields in one table (bold "Example:" / "Limitations:").
  - H3 Lookups through external Dictionaries: key-value dictionary lookups instead of joins.
- H2 Conclusion on solving JOINs directly on ClickHouse: fine for small/mid data, breaks at scale.
- H2 Handling Duplicates in ClickHouse: Kafka duplicates need handling.
  - H3 Using ReplacingMergeTree for Deduplication: how it works and its limits (bold "How it works:", "Limitations:", "Merge duration:"; ol/ul lists; code).
- H2 Conclusion on solving Duplicates directly on ClickHouse: works for small datasets only.
- Closing lines: bold amber link "Try GlassFlow Open Source for ClickHouse on GitHub!" → https://github.com/glassflow/clickhouse-etl. Then "Next part:" followed by a link "Part 4: Can Apache Flink be the solution?" → /blog/part-4-apache-flink-is-not-the-solution-to-clickhouse-duplications.

**vector** (no images, tables or code):
- Intro: "Most observability stacks don't start complicated." Vector (linked, amber) grows into the streaming engine.
- H2 When Scaling Stops Feeling Linear: adding cores stops adding throughput.
  - H3 A Shared Flow Has Coordination Costs: single topology with bounded channels limits parallelism.
- H2 Backpressure and Blast Radius: slow sinks back-pressure every source.
- H2 When State Enters the Picture: long-lived state (dedup/joins) strains the model.
- H2 ClickHouse Amplifies the Edges: fast inserts hide weaknesses until merges and disk pressure bite.
- H2 When Ingestion Becomes Critical Infrastructure: the pipeline becomes a tier-1 system.
- H2 The Design Envelope: not a critique of tools; about design envelopes.
- H2 The Questions That Eventually Surface: the questions teams end up asking; closing.

---

## T2. Legal with TOC sidebar (/terms-of-service, /privacy-policy; /cookie-policy redirects here)

### T2.1 Layout (desktop)

- Navbar (reuse), y 0-40. There is no divider-xs: content starts directly at y=40.
- Main: full width, bg `page`, padding 0 64px, flex column, gap 40px. Inner: 1312-wide flex row (column border lines at x=64/1376 as everywhere).
- **TOC sidebar** (NEW): 306 wide (x 64-370), starts at y=40, 1px `line` right border.
  - Not sticky, so it scrolls away with the page.
  - Cells are full-width rows separated by 1px `line` hairlines.
  1. Header cell: 65 tall (y 40-105), padding 24px 16px.
     - Text: "Terms and Conditions" on terms, "Table of contents" on privacy.
     - Font: Geist Mono 14px/16.8px w700, `cream`.
  2. "Summary of key points" row: **highlighted** (bg `cream` #F1EFDF, text #1E0F00, same font), 49 tall, padding 16.
     - Static on both pages: it never changes with scroll or click (verified at scrollY 0 / 4000 / after anchor click).
     - Not a link.
  3. Link rows: padding 16. Height 49 for one line, 66 for two lines (text wraps inside 274px).
     - Text: `<strong>` Geist Mono 14/16.8 w700, colour rgba(242,240,225,0.8).
     - **Hover**: colour goes to #F1EFDF with `transition: color 0.3s cubic-bezier(0.44,0,0.56,1)`; no bg change.
     - Click: hash-jump to an anchor `<div id="<Section Title>">` (ids contain spaces, e.g. `#User Obligations`). Scroll lands with the anchor exactly at the viewport top (no offset). The URL hash updates.
- **Content column**: 620 wide, centred in the remaining area (x 563-1183). The first element is at y=104 (64px below the nav).
  - Mobile: sidebar `display:none`; main padding 0 16px; content at x=32, width 326; H1 at y=144.

### T2.2 Typography (legal body)

| role | font | size / lh | weight | ls | colour | notes |
|---|---|---|---|---|---|---|
| Document H1 | Inter | 46 / 55.2 | 400 | -1.84 | #FAFAFA | "Terms and conditions" / "Privacy Policy" |
| Meta lines (terms only) | Inter | 16 / 24 | 400 (strong) | -0.32 | `cream` | "Version 1.0" newline "Release Date 09.09.2026" (y 193/217) |
| Section heading | Inter | 24 / 28.8 | 400 | -0.96 | #FAFAFA | real `<h1>` tags inside numbered `<ol>`: numbers render as list markers. Sections 1-9 are indented +30px (x 593), 10+ +45px (x 608). "1. Introduction" (terms) and "Summary of key points" (privacy) are not in the ol (x 563). Gap above a section ~64px, heading to body 24px |
| Sub-heading (privacy, US section) | Inter | 20 / 24 | 400 | -0.8 | #FAFAFA | |
| Odd one (terms "Definitions") | Inter | 24 / 24 | 400 | 0 | #FFFFFF | p styled as heading |
| Body p | Inter | 16 / 24 | **300** | -0.32 | `cream` | paragraph gap 24px |
| Bold lead-in (strong) | Inter | 16 / 24 | 400 | -0.32 | `cream` | "User:", "In Short:" etc. (bold = w400 against body w300) |
| Lists | Inter 16/24 w300 | | | | | bullets "•", item indent 20px (x 583), nested lists +20 |
| Links | Inter 16/24 w300 | | | | `cream` (help@glassflow.ai) or #999999 ("Section 13 BGB") | |
| Inconsistent items (privacy) | Inter Display 16 / 19.2 | | 400 | 0 | `cream` | some list items in the "What information do we collect" section; reproduce or normalise |

### T2.3 Bottom

After the content: two 67px `Spacer` bands, then reuse `Footer` (its own spacer is the second band).
- terms: content ends at y 10399, footer CTA band at 10533, page H 11127.
- privacy: H 15324.

### T2.4 /terms-of-service content

- `<title>` "GlassFlow | Terms & Conditions"; meta "GlassFlow's Terms & Conditions: the terms governing your use of our platform and services."; og `55pSz2A6Vkt6lHiYRmUXFqvUWhw.jpg`.
- Document title "Terms and conditions". **Version 1.0, Release Date 09.09.2026.** No separate "last updated" line.
- TOC labels and hrefs (`/terms-of-service#<id>`):

| label | anchor id |
|---|---|
| 1. Introduction | introduction |
| 2. Definitions | Definitions |
| 3. Eligibility | Eligibility |
| 4. Service Access and Availability | Service Access and Availability |
| 5. Account Registration and Responsibilities | Account Registration and Responsibilities |
| 6. Subscription Plans and Payments | Subscription Plans and Payments |
| 7. User Obligations | User Obligations |
| 8. Data Protection and Privacy | Data Protection and Privacy |
| 9. Intellectual Property | Intellectual Property |
| 10. Service Levels (Custom Only) | service-levels- |
| 11. Liability Limitation | Liability Limitation |
| 12. Right of Withdrawal (Consumers Only) | right-of-withdrawal |
| 13. Termination and Data Retrieval | Termination and Data Retrieval |
| 14. Dispute Resolution | Dispute Resolution |
| 15. Force Majeure | Force Majeure |
| 16. Modifications to Terms | Modifications to Terms |

- Heading outline with one-line summaries:
  1. Introduction: Glassflow GmbH's ToS govern the SaaS platform; German/EU law and GDPR; plain-language summary of the contract; self-serve checkout vs enterprise Order Form.
  2. Definitions: User, Consumer (§13 BGB), Business Customer, Client Data, Client Personal Data, etc.
  3. Eligibility: users must be 18+ / of legal majority.
  4. Service Access and Availability: worldwide access, local variation; Free Tier terms; releases/updates of the Solution.
  5. Account Registration and Responsibilities: accurate info, credential security.
  6. Subscription Plans and Payments: in-product checkout is the Order Form; billing, renewals, fees.
  7. User Obligations: lawful use, no misuse.
  8. Data Protection and Privacy: GDPR processing, DPA.
  9. Intellectual Property: Glassflow keeps IP; client owns its data.
  10. Service Levels (Custom Only): SLAs only for enterprise/Order Form clients.
  11. Liability Limitation: governed by §§309/310 BGB; consumer statutory rights preserved.
  12. Right of Withdrawal (Consumers Only): 14-day withdrawal.
  13. Termination and Data Retrieval: ending the contract and exporting data.
  14. Dispute Resolution: governing law and venue.
  15. Force Majeure.
  16. Modifications to Terms: 30 days' notice; you can leave with a refund.
- Closing line: italic "For any questions or concerns, please email help@glassflow.ai" (email in strong).

### T2.5 /privacy-policy content (/cookie-policy lands here)

- `<title>` "GlassFlow | Privacy Policy"; meta "Learn how GlassFlow protects your privacy and keeps your data secure."; og `55pSz2A6Vkt6lHiYRmUXFqvUWhw.jpg`.
- Document title "Privacy Policy". **No "last updated" or version date is present anywhere on the page** (searched all text). Intro paragraph: "This privacy notice for GlassFlow GmbH ('we', 'us', or 'our'), describes how and why we might collect, store, use, and/or share…".
- TOC header "Table of contents". Its labels, which are inconsistent on the live site, are listed as-is (href ids in brackets):
  - 1. What information do we collect? [What information do we collect?]
  - 2. How do we process your information [How do we process your information?]
  - 3. What legal bases do we rely on to process your information? [same text]
  - 4. When and with whom do we share your personal information? [same]
  - 6. How do we handle your social logins? [same] (**5 is missing** from the TOC: the cookies section exists in the body but not in the TOC)
  - 7. How long do we keep your information? [same]
  - 8. How do we keep your information safe? [**#How long do we keep your information?**, a wrong anchor on live]
  - 9. Do we collect information from minors? [same]
  - 10. What are your privacy rights? [same]
  - 11. Controls for do-not-track features [Controls for Do-Not-Track Features]
  - 12. Do United States residents have specific privacy rights? [same]
  - 13. Do we make updates to this notice? [same]
  - 14. How can you contact us about this notice? [same]
  - 15. How can you review, update, or delete the data we collect from you? [how-can-you-review-update-or-delete-the-data-we-collect-from-you]
- Body heading outline (each section opens with a bold "In Short:" lead-in):
  - Summary of key points (unnumbered): bullet summary of the notice with links to sections.
  - 1 What information do we collect?: data you provide, plus product telemetry (includes items like models, token counts, timing, success; "the folder path, git branch, and Claude Code version").
  - 2 How do we process your information?: to provide/improve services, communicate, security, legal compliance.
  - 3 What legal bases do we rely on…?: GDPR/UK bases (consent, contract, legal obligation, legitimate interests), Canada.
  - 4 When and with whom do we share…?: business transfers, service providers.
  - 5 Do we use cookies and other tracking technologies?: cookies/trackers.
  - 6 How do we handle your social logins?: data received from social providers.
  - 7 How long do we keep your information?: retention as long as necessary.
  - 8 How do we keep your information safe?: organisational/technical measures.
  - 9 Do we collect information from minors?: no under-18s.
  - 10 What are your privacy rights?: EEA/UK/CH/CA rights, withdrawing consent, account info.
  - 11 Controls for Do-Not-Track Features: DNT not honoured (no standard).
  - 12 Do United States residents have specific privacy rights?: California/Colorado/Virginia. H-20 subheads: What categories of personal information do we collect? (category table), Category Examples Collected, How do we use and share your personal information?, Will your information be shared with anyone else?, CCPA Privacy Notice, Right to request deletion of the data - Request to delete.
  - 13 Do we make updates to this notice?: notice updated as needed.
  - 14 How can you contact us about this notice?: contact details.
  - 15 How can you review, update, or delete the data we collect from you?: data-subject request process.

---

## T3. Legal single column (/imprint; /imprint-old redirects here)

- Same shell as T2 without the sidebar. Column 620 wide, centred in the 1312 column (x 410-1030). First element at y=104. Mobile: x=32, w 326, starts y=144.
- `<title>` "Imprint | GlassFlow"; meta "Legal notice for GlassFlow, including company details, registered address, management and contact information as required under German law (§5 DDG)."; og `55pSz2A6Vkt6lHiYRmUXFqvUWhw.jpg`. **No last-updated date.**
- Typography:
  - H1 "Imprint": Inter 46/55.2 w400, ls -1.84, #FAFAFA.
  - Section headings: Inter **20/28** w400, ls -0.8, #FFFFFF, ~28px gap before the body.
  - Body: Inter 16/24 w300, ls -0.32, **#FAFAFA**. Lines within a block have no paragraph spacing; blocks are separated by 32px.
  - Links (#FAFAFA, not underlined in computed style): mailto:info@glassflow.dev, http://ec.europa.eu/odr.
- Heading outline:
  1. Information according to §5 TMG (Telemedia Act): legal form/registered office (GlassFlow GmbH, Prinzessinnenstraße 19/20, 10969 Berlin, …), VAT ID DE361405627, tax number 37/308/50336, representatives Armend Avdijaj and Ashish Bagri, e-mail info@glassflow.dev.
  2. Further Information: §2 Service Information Regulation; German law and Berlin venue; EU ODR platform link.
  3. Liability: responsibility for own content under the Telemedia Act; external links.
  4. Copyright Notice: site content is protected; no unauthorised use.
- Bottom: two 67px `Spacer` bands (y 1439 and 1506), then `Footer` at 1573. Page H 2167 (390: 3691).

---

## T4. Legacy gated-ebook page (/kafka-to-clickhouse-pipeline-guide, /clickhouse-mistakes-guide)

This is the **old pre-rebrand design**: black background, Inter, rounded inputs. It shares nothing with the current design system: no home nav, no CTA band, no footer. Spec it as a standalone template.

### T4.1 Legacy nav (NEW, only on these two pages)

- **position: fixed**, top 0, full width, 62 tall, bg rgba(0,0,0,0.8), **backdrop-filter: blur(50px)**, padding 0 24px. Content box 1220 wide centred (x 110-1330).
- Logo: image `uJSz4vz8ntpPgNuLAZrGGPBhGFo.svg` (114x16, x 110, y 23), → `./`.
- Then a 1px vertical divider (x≈248, visible in the screenshot; colour ~#333).
- Links: Inter 14px/16.8px w500, ls -0.28, #999999; hover #FAFAFA (`color 0.3s cubic-bezier(0.44,0,0.56,1)`). Items and hrefs (live hrefs, including dead legacy routes):
  - "Product" with a 14x14 chevron (stroke #AAA) → ./product. Hover opens a dropdown: Overview ./product, Integrations ./integrations, For Enterprises ./enterprise, For ClickStack ./clickstack.
  - "Case Studies" → ./case-studies.
  - "Pricing" → ./rius/pricing.
  - "Resources" with chevron. Hover opens: Tutorials https://github.com/glassflow/clickhouse-etl/tree/main/demos, Blog ./blog, Docs https://docs.glassflow.dev.
  - "Contact" → ./contact.
  - Gaps: Product x 272, Case Studies 363, Pricing 472, Resources 541, Contact 649.
- Dropdown panel: 150x144 at (231,66), bg rgba(0,0,0,0.8), radius 15px, padding 15px, gap 8px, box-shadow 0 0 0 1px rgba(0,0,0,0.05). Items Inter 15px/22.5px w500, ls -0.15, #999999. The chevron flips up while open.
- Right: GitHub star widget (`github-button`, buttons.js, data-size large, show-count) for glassflow/clickhouse-etl. It renders as a white pill "clickhouse-etl | 504" at x 1160-1330, y 16-44. Without buttons.js it degrades to a plain 12px blue underlined link "clickhouse-etl".
- Mobile (390):
  - bar 62 tall; logo at x 24; hamburger icon 16x12 at (346,25).
  - Menu panel "Nav Links": 342x401 at (24,3), bg rgba(0,0,0,0.92), radius 16px, hidden at opacity 0 and translateX offset.
  - Panel contents: logo, then Product / Case Studies / Pricing / Resources / Contact centred (Inter 14 w500 #999999), then a white "Start building" button (126x48) → https://github.com/glassflow/clickhouse-etl, then the GitHub widget.
  - Open/close animation not measured (Framer variant).

### T4.2 Hero (whole page)

- Root bg #000000. Hero padding 128px 24px (mobile 128px 24px 256px), gap 40. `main` 1220 wide, flex row: left content 540 wide at x=110; the right side is decorative imagery.
- Background layers:
  - "Background Image" at y=178: a dark blue-grey pixel-grid glow (`eMUNSXzDARdSsMat78pTslrdn4.png`, 1740x1342, `object-fit: contain`, centred, 1740x833 box at x -150). Used on the Kafka page only.
  - Gradient overlay `linear-gradient(270deg, rgba(0,0,0,0) 49%, #000 100%)` over the full hero (mobile `352deg, transparent 19%, #000 34%`).
  - Top-right image `i7Uti49dVPGVtAs2iCwnJBnuWso.png` (601x509 at x 839,y 0; a dark grid tile).
- Left column (flex column, gap 33):
  1. **Pill**: bg #FFAC00, padding 6px 10px (24 tall). Inter 12/12 w500 UPPERCASE, #1E0F00. Text "Free eBook" (Kafka) / "Free Guide" (mistakes).
  2. **H1**: Inter 42px/50.4px w500, ls -1.68. **Gradient text**: `background: linear-gradient(278524deg /* = 244deg */, #A8A8A8 0%, #FFFFFF 100%); background-clip: text; color: transparent`. 540 wide, 3 lines.
  3. **Lead**: Inter 20/28 w400, ls -0.8, #A8A3A3. In the Kafka lead, "Kafka → ClickHouse" is #FFFFFF. Mobile 18/25.2.
  4. (mistakes only) "What's inside:" as strong Inter 20/28 **w700**, #FCFAFA.
  5. **Checklist**: 3 rows, gap 12. Each row is a 24x24 green check-circle PNG (`k68ifFtfMbT8As7lCeihZaxTO6w.png`) plus text at x=144: Inter 18/25.2 w400, ls -0.72, #A8A3A3 (mobile 16/22.4).
  6. **HubSpot form** (embed, external): iframe 480x104 (mobile 342 wide, fields stacked: 232 / 309 tall).
     - Labels: system sans (-apple-system) 14/20 w500, white; required asterisk red.
     - Inputs: 43 tall, bg #1A1A1A, 1px solid #2A2A2A, radius 12px, padding 0 24px, text 16 white.
     - Submit: 134x43, bg #FFFFFF, text #000 16 w600, radius 12px, padding 0 40px. Inline row with gap 8.
     - Script `https://js-eu1.hsforms.net/forms/shell.js`, portal 139646698, eu1.
     - Kafka form fields: First name* (`firstname`), Email* (`email`); form id `4ba457ad-a3ee-4dde-a34f-6318380d20d3`.
     - Mistakes form fields: Email* (`email`), First Name (`firstname`), Last Name (`lastname`); form id `51d896a2-def6-4113-b5c1-235063f350d7`.
     - Post-submit state (thank-you / download) not tested: read-only recon, no submissions made.
- Right visual: a tilted tablet mock-up on a Mars rock. On the Kafka page it is baked into `eMUNSXzDARdSsMat78pTslrdn4.png`. On the mistakes page it is `4OxP9MgO3bmtsoyWUD8aGGIWXM.png` (905x604 at x 864,y 331; cover, bleeds off the right edge). Mobile: the image sits below the form (Kafka at y 968, 390x301).
- Page height: 1011 desktop. Mobile: Kafka 1269, mistakes 1500. No footer.

### T4.3 Per-page copy

| | /kafka-to-clickhouse-pipeline-guide | /clickhouse-mistakes-guide |
|---|---|---|
| title | Kafka to ClickHouse: A Practical Guide to Data Pipelines \| GlassFlow | Free Guide: 10 Common ClickHouse Mistakes & How to Fix Them \| GlassFlow |
| meta | Master Kafka to ClickHouse data pipelines. Learn strategies for handling duplicates, late events, and JOINs with real-world examples. Download your free GlassFlow ebook. | Access the free practical guide covering the 10 most common ClickHouse mistakes in production: deduplication, schema design, sharding, materialized views, disaster recovery and more. |
| og | assets/m5c9zhRXC5QD84a464obnLQ2vno.jpg | assets/8Gg0fHHa3qdFTQXjVqsz3naE.png |
| pill | FREE EBOOK | FREE GUIDE |
| H1 | A practical guide on how to build Kafka to ClickHouse pipelines | 10 ClickHouse Mistakes That Break Data Pipelines in Production |
| lead | This ebook covers everything you need to know about building dependable Kafka → ClickHouse pipelines. | This guide covers the 10 most common mistakes teams make when adopting ClickHouse, from the first week of setup to running it at scale in production. Each mistake includes what goes wrong, why it happens, and exactly how to fix it. |
| checklist | Walks you through building a reliable pipeline with strategies for handling duplicates, late events, and JOINs / Gives real-world examples from finance, e-commerce, and observability / Offers practical insights and best practices for both beginners and those looking to improve existing setups | (after "What's inside:") Why deduplication in ClickHouse doesn't work the way you expect and how to handle it before it corrupts your analytics / When ClickHouse sharding helps and when it makes everything worse / The disaster recovery gap most self-hosted ClickHouse teams discover too late |
| form | First name*, Email*, Submit | Email*, First Name, Last Name, Submit |

Motion: none measured beyond the nav link colour transition and the dropdown open. `getAnimations()` was empty after load.

---

## T5. /case-studies (target of /use-cases/real-time-observability-pipelines)

- `<title>` "AI Agent Observability & Data Infrastructure | GlassFlow" (the home title, unchanged); meta is the home meta; og `PTY3z7Ur6ZW6KXa0gAPOKvtrsw.jpg`. H 1293 (390: 2233).

| section | y | spec |
|---|---|---|
| Navbar | 0 | reuse |
| divider-xs | 40-72 | 32px `Spacer` variant |
| Hero | 72-373 | bar 38 (bg `bar` #2D1803, `Dots` left, no label) + heading panel 263 tall, bg #2D1805. Background image `gGgprOgbK8sImEo5X3oHCssBw0w.jpg` (1312x262, contain; a dithered mountain silhouette) plus the 48x72 pixel corner at top-left. Padding 64px 32px; H1 "Case Studies" in Inter Display 40/40, ls -1.6, `cream`, centred (y 214). Mobile: panel 112 tall, padding 32, H1 **32/32**, ls -1.28 |
| Listing | 373-632 | `Shell`, 2 cards, each 650x251, at x 68 and 722 (4px inset from the column edges, 4px gap between). See below |
| Footer | 632 | reuse `Footer` (its 67px spacer at 632-699) |

- **Case-study card** (NEW), one `<a>`, bg #1E0F00, 1px `line` hairlines between rows:
  1. Logo row: 78 tall, padding 24; logo image 30px tall (restack 71x30 svg, nubrain 134x30 svg; white logos).
  2. Title row: 121 tall, padding 24. h3 in Inter Display 26/36.4 w500, ls -1.04, `cream`, max 602 wide.
  3. Button row: 52 tall, padding 4. Inner bg `panel`, padding 10px 24px. Centred "read more" in Geist Mono 14/24 w500, ls -0.32, `cream`, with the same rolling duplicate-label hover as T1.5.
- Cards:
  - Restack: "Restack scales real-time enterprise observability with GlassFlow" → /case-studies/restack
  - Nubrain: "Nubrain fixes the silent errors of AI agents in their pipelines" → /case-studies/nubrain
- Mobile: cards full-bleed 390 wide, stacked with **no gap** (262 and 513), title at x 24.

---

## 6. /blog (target of /kafka-to-clickhouse-connector)

The blog index route is probably specced elsewhere. Only the structure is recorded here so the redirect target is known. The title is "GlassFlow | Blog". Sections:

- **divider-xs**.
- **Hero** (310 tall). Background image `fpSmMnbghTzYJNtWqkUhZjTF1UE.jpg` (cover). It contains:
  - pill "BLOG";
  - H1 "The GlassFlow blog", Inter Display 56/67.2, ls -2.24, #FAFAFA, centred;
  - sub "How we think about agent observability and the data that feeds AI agents. New features, real use cases, tech lessons l…" (truncated in capture), Inter Display 21/29.4, ls -0.84, centred, 560 wide.
- **Featured card** (463 tall):
  - `TitleBar` with the label "featured-blog";
  - left: pill, h3 in Inter Display 32/38.4, ls -1.28, white; excerpt; a full-width "read more" button;
  - right: a 668x412 image panel. Its padding-12 frame uses `YiSYWMdzERJyLVRZRpiutPwoGI.jpg` with the post image `mFirefQhQKw3QXF3cpXhF7l4sLw.png` on top.
- **divider**.
- **Filter chips**: Geist Mono 14/22.4, uppercase. The active "All" chip is amber with ink text; the others are white on `page`. Chips: All, MCP, Data for Agents, Agent Infrastructure, Agent Observability, Use Cases, Engineering, Product Updates, Comparisons, Tutorials.
- **Grid**: 3 x 424px, gap 8, padding 12. It uses the T1.5 blog card with these deltas: image 242 tall, no button row, card height 562. 118 unique card thumbnails.
- **Footer**.

Page H 24922. The redirect source slug `/blog/kafka-to-clickhouse-with-glassflow-and-altinity-cloud` no longer exists; it 308s to /blog.

---

## 7. New components to build (summary)

1. `SpacerXs`: a 32px divider. Alternatively give `Spacer` a height prop: 32 or 67.
2. `PostHero` (T1.2), with a variant without details/right panel for `/case-studies` (T5 hero) and the blog index.
3. `RichText` renderer with the T1.3 presets: p, h2, h3, strong, em, a, inline code, ul/ol with "•" pseudo-bullets, img, table, code block with Copy.
4. `ShareBar` (T1.4).
5. `BlogCard` plus a `RelatedPosts` row (T1.5), and `RollingLabelButton` (cream inner, two stacked labels sliding 30px on hover; also used dark-inner in T5).
6. `TwoProductsCta` (T1.6), with mobile copy variant.
7. `LegalLayout`: TOC sidebar plus a 620px column (T2), and the no-sidebar variant (T3).
8. `LegacyGuidePage`: legacy nav, gradient H1, checklist, HubSpot embed (T4). It is standalone and not wrapped in Navbar/Footer.
9. `CaseStudyCard` (T5).

## 8. Gaps / not measurable

- HubSpot form success state and validation messages: no form was submitted (read-only).
- Exact easing and duration of the rolling-label hover and the legacy dropdown/mobile-menu animations: only the end states were captured.
- Hero appear timing was derived from 100ms sampling (≈600ms per word, ≈35ms stagger, blur 10px, y 10px). The exact Framer spring/bezier is not exposed.
- Full prose of the posts and legal pages is intentionally not transcribed (outlines only). Fetch from the live pages or the CMS if verbatim copy is needed.
- Author/date icon SVGs are `<use>` references to an inline sprite (person and calendar outlines). Their path data was not extracted.
