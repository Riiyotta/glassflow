Source: https://www.glassflow.ai/

# Content and company pages: build spec

Measured live with Playwright (Chromium) on 2026-10-13 at 1440x900, with 390x844 checks. SSR HTML for every page was also fetched with curl and parsed (for full post lists, dates and image URLs). Read this together with:
- `/Users/riyaghosh/V3/GLASSFLOW/CLONE_SPEC.md` (home page, global tokens)
- `specs/posts.json`: every card on /blog (119), with slug, title, date, category, author, thumbnail/cover, excerpt (25 words max), one-sentence summary, related slugs and heading outline
- `specs/content-assets.md`: every image/SVG URL used by these pages

Scope: only www.glassflow.ai paths. External links are recorded as hrefs only (not followed).

---

## 0. Shared rules for all pages in this file

### 0.1 Reused components (already in src/components)

| Component | Use on these pages | Differences |
|---|---|---|
| `Navbar` | All pages except `/categories/*` | **Unchanged**: same cells, same `products` dropdown, `get_started` → `/#quickstart`. At 390 the live nav is the same `MOBILE_LINKS` second row (tares / rius / docs / blog / contact, 78x40 cells at y=40..80) that Navbar.jsx already has. |
| `Footer` (67px spacer, CTA band, footer grid, legal bar) | All pages except `/categories/*` | **Unchanged**. The CTA band copy, images and hrefs are identical. (The live DOM has the footer product descriptions in sentence case, "Feed your agents the right data. Open source", while Footer.jsx uses lowercase. The home page shows them lowercase too, so keep Footer.jsx as is.) |
| `TitleBar` | /blog "featured-blog" bar, about "products"-style bars | The featured bar has the 3-dot group on **both** left (x+16) and right (x+1270). Add a `dotsRight` prop. |
| `Dots` | Every card and panel title bar | Two sizes are used on these pages. Footer/TitleBar dots are 6x6 `#553619` with a 4px gap (the existing primitive). Card and hero bars use 6x6 **`#492400`** squares with a 4px gap (group 26x6). Add a `tone` prop. Note: ui.jsx currently draws 3x3 cream/30% dots, but the live measurement is 6x6 for both kinds. |
| `BigButton` | Pricing / "Two products" band primary button, case-study pages | Same 4px amber frame. The variant used in these bands has **no arrow cell** (label only, e.g. 218x52). Add `arrow={false}`. |
| `DarkButton` | "talk to our team", "read the Rius guides", case-study "read more", featured "read more" | Same anatomy (outer `#1E0F00` with 4px padding, inner `#2D1804` with 10px 24px padding, 1px `#5F3E1F` hairline). Used full-width inside cards. |
| `Spacer` | Every "divider" row between sections (67px) | Unchanged. New: a **32px** "divider-xs" row sits directly under the nav on every content page (y=40..72): the same bordered Shell, with inner height 30. Add a `size="xs"` prop. |
| `Shell` | Every section | Unchanged (1312 column at 1440, 64px gutters). |
| `Testimonial` | Case-study quote card | Same background image (7xhczrFmZXWm4XtTt3xdK5HjPSc.jpg) and attribution row, at a smaller size. See 5.3. |
| Quickstart card shell (`Quickstart.jsx` card) | /contact calendar card, /about "Discover more" cards | Same section background (ARgMqlYnmiFWpdywy7EoO9FO9vI.png, 64px 24px padding, 32px gap, centred heading). The cards themselves are new. See 6 and 7. |
| Hero logo strip (`LogoStrip` in Hero.jsx) | /contact left panel bottom | Same 4 logos, laid out as one 656-wide row of 4 cells (164x125 each) with a "Works with the tools you already use." caption bar above. See 7. |

### 0.2 New shared section types (spec once, reuse everywhere)

**A. PostCard** (blog grid, related posts, category pages). Card widths: 424 on /blog, 437 in related posts, 385 on category pages. Measured at 424:
- `<a>` card, bg `#2D1804`, 1px `#5F3E1F` border (drawn as an inset ::after), flex column, overflow clip. Height 562 (424 wide) / 570 (437) / 540 (385).
- Bar 38px: bg `#1D0E00`, padding 16, 3 dots (6x6 `#492400`, gap 4) at top-left, 1px `#5F3E1F` border.
- Image: full width x 242px (424w), 250px (437w), 220px (385w). object-fit cover. On index and category cards the src is the post `thumbnail`.
- Body: padding 24, gap 16, height 190, 1px border:
  - Category chip: inline-flex, bg `#FFAC00`, padding 6px 10px, height 24; text Geist Mono 12px/12px, weight 500, **uppercase**, colour `#492400`.
  - Title: Geist Mono 16px/20.8px, weight 500, letter-spacing -0.64px, colour `#E0E0E0`, clamped to **2 lines** (box 42px, overflow clip).
  - Excerpt: Inter Display 16px/22px, weight 400, letter-spacing -0.32px, colour `rgba(230,230,230,0.8)`, clamped to **2 lines** with an ellipsis (44px).
- Author row 40px: bg `#1E0F00`, two equal cells (212 each at 424). The left cell shows "Written by" centred (Geist Mono 14px/21px, weight 400, letter-spacing -0.32px, `rgba(230,230,230,0.8)`). The right cell shows the author name centred (Inter Display 14px/21px, same colour). Category pages render this cell empty.
- Button row 52px: bg `#1E0F00`, padding 4, 1px border. The inner button is full width x 44, bg **`#F1EFDF`** (cream), padding 10px 24px, 1px `#5F3E1F` hairline. Label "read article" in Geist Mono 14px/24px, weight 500, letter-spacing -0.32px, `#1E0F00`, centred. The label is duplicated directly below (y+30) inside an overflow-clip box, which is the Framer roll-up hover: on hover the label slides up 30px and the copy slides in. Not timed; use 0.3s ease.
- The whole card is one link to `/blog/<slug>`.

**B. Pricing / "Two products" CTA band** (sits between the last content section and the Footer on /blog, posts, case studies, /about, /contact).
- Shell; inner padding 64px 128px, 1312 wide. Background image `h0ej46NDlXvCksM6LvlI4w4Ss.jpg` (cover). Height 380 on /blog, 452 on posts and case studies, 428 on /about and /contact.
- Left column 640 wide, gap 64. The text group (gap 32) has:
  - Heading: Inter Display 40px/40px, weight 400, cream, 420 wide.
  - Paragraph: Inter Display 16px/24px, letter-spacing -0.18px, cream, 420 to 640 wide.
- Button row (gap 8): BigButton without arrow, then DarkButton.
- Copy variants:
  - **/blog**: heading "Start free. Upgrade when your agents do."; paragraph "100k traces a month, no card required."; buttons "start from" (137x52, amber) and "talk to our team" (185x52, dark). **Neither button has an href on live** (dead buttons).
  - **Posts, case studies, /about, /contact**: heading "Two products. Two starting points."; paragraph "Tares is open source. Kick the tires, open an issue, and drop a star if it's useful. Rius, end to end. Guides for wiring up traces, MCP, and retention, from first span to production."; buttons go to https://github.com/glassflow/tares and https://docs.glassflow.ai/rius/guides, each 218x52.
  - Button label case: posts use "star Tares on GitHub" / "read the Rius guides". About, contact and case studies use "Star Tares on GitHub" / "Read the Rius guides".
- 390: heading 42px/42px across 326px (3 lines); buttons stack vertically (gap 8) at x=32.

**C. Hero title-bar + panel** (posts, case studies, /about, /contact, /contact/success, /case-studies). This is a 38 or 50px bar on top of a panel, with these parts:
- Bar 38px with bg `#1D0E00` (posts, /about) or `#2D1803` (/case-studies, /contact uses 50px). Dots at the left (and also at the right on posts). An optional centred label.
- **pixel-corner**: an inline SVG 48x72 at the panel's top-left (`#492400` squares; see content-assets.md section 3).

### 0.3 New colour tokens seen on these pages

- `#1E0F00` rgb(30,15,0): card author rows, button frames, featured row bg, code block bg, inline-code bg, blockquote bg, case-study cards. It is one unit off `deep` (#1D0E00); add it as `ink` (the form also uses it as `ink`).
- `#E0E0E0`: PostCard title.
- `rgba(230,230,230,0.8)`: PostCard excerpt and author.
- `#FAFAFA`: blog H1 and post h3.
- `#999999` / `rgba(153,153,153,0.3)`: featured image frame border.
- `#222222`: 1px border on in-article images.
- Syntax colours (code blocks): keyword `#FF7B72`, string `#A5D6FF`, static/number `#7EE787`, punctuation/plain `#E6EDF3`.

### 0.4 Motion on these pages

- Lenis smooth scroll as on home.
- Per-character text split: the post hero description and the /about hero paragraphs are rendered as one `<span>` per character (SSR HTML confirms this), the same Framer "appear" text effect as the home H1. Timings could not be observed after settle (UNMEASURED). Replicate with a per-character opacity 0→1 stagger of about 0.01s, total under 1s, or skip it.
- The "read article", "read more", "find out more" and "Visit Website" labels are duplicated for a roll-up hover (see PostCard).
- Share buttons: `transition: opacity 0.2s`.
- The case-study sidebar is `position: sticky; top: 128px`.
- No other scroll-linked effects were found.

---

## 1. /blog (index)

Title "GlassFlow | Blog". Meta description "Learn about data streaming for Kafka and ClickHouse." og:image PTY3z7Ur6ZW6KXa0gAPOKvtrsw.jpg. Total height 24,923 at 1440.

Nav: **unchanged**. Footer and CTA band: **unchanged** (Footer starts at y=24,261 with its 67px spacer). There is **no** home Quickstart/FAQ.

### 1.1 Layout at 1440 (y ranges)

| y | height | section |
|---|---|---|
| 0 | 40 | Navbar |
| 40 | 32 | divider-xs |
| 72 | 310 | Title block |
| 382 | 463 | Featured post |
| 845 | 67 | Spacer |
| 912 | 88 | Filter bar |
| 1000 | 22,814 | Post grid (119 cards, 40 rows) |
| 23,814 | 67 | Spacer |
| 23,881 | 380 | Pricing band (B, /blog copy) |
| 24,261 | | Footer |

### 1.2 Title block
- Shell, inner 1312x310, padding 64px 0, flex column, gap 16, centred.
- Background image `fpSmMnbghTzYJNtWqkUhZjTF1UE.jpg`, 1312x310, cover.
- Chip "BLOG": bg `#FFAC00`, padding 6px 10px (53x24), text Inter 12px/12px, weight 500, uppercase, `#1E0F00`. Centred (x=694).
- H1 "The GlassFlow blog": Inter Display **56px/67.2px**, weight 400, letter-spacing -2.24px, `#FAFAFA`, centred, box 1200 wide.
- Sub "How we think about agent observability and the data that feeds AI agents. New features, real use cases, tech lessons learned": Inter Display **21px/29.4px**, letter-spacing -0.84px, cream, centred, max width 560 (2 lines).

### 1.3 Featured post (newest post: `decision-model-vs-llm`)
- Wrapper 1312x463, bg `#1E0F00`.
- TitleBar 50px: bg `#2D1803`, padding 16. Label "featured-blog" in Geist Mono 14/18.2, weight 700, `rgba(241,239,223,.64)`, centred. Dots `#553619` at both left and right.
- Row 412px, one `<a>` to `/blog/decision-model-vs-llm`:
  - Left 644 wide. Content padding 24, gap 16, vertically centred in 360px:
    - Chip "Agent Infrastructure": Inter 12px, weight 500, uppercase, `#1E0F00` on amber.
    - H3 title: Inter Display **32px/38.4px**, letter-spacing -1.28px, `#FFFFFF`, 596 wide.
    - Excerpt: Inter Display 16px/24px, letter-spacing -0.32px, cream.
    - Then a full-width DarkButton row (644x52) labelled "read more" (cream Geist Mono 14/24, weight 500).
  - Right 668x412, padding 12: backdrop `YiSYWMdzERJyLVRZRpiutPwoGI.jpg` (cover, fills 668x412). The cover `mFirefQhQKw3QXF3cpXhF7l4sLw.png` sits on top at 644x388 (cover), with a 1px `rgba(153,153,153,.3)` border.
- 390: stacks text then image (image 390x245, cover inset 12). H3 stays 32px/38.4px across 342px.

### 1.4 Filter bar (category tabs + search)
- Shell inner 1312x88, padding 0 12px. Inner row with a 1px border.
- Tabs scroller: 1098 wide, `overflow: auto` (scrolls horizontally), padding 32px 32px 32px 12px, gap 10. A 32px right-edge fade `linear-gradient(90deg, rgba(73,36,0,0), #492400)`.
- Tab: height 22, padding 0 8px. Text Geist Mono **14px/22.4px**, weight 400, letter-spacing -0.28px, **uppercase**.
  - Default: transparent bg, `#FFFFFF` text.
  - Active: bg `#FFAC00`, text `#1E0F00`.
- Tabs in order:

| label | `?category-2=` value |
|---|---|
| All | none |
| MCP | mcp |
| Data for Agents | data-for-agents |
| Agent Infrastructure | agent-infrastructure |
| Agent Observability | observability (inferred from the category-page slug, not clicked) |
| Use Cases | use-cases |
| Engineering | engineering |
| Product Updates | product-updates (verified) |
| Comparisons | comparisons |
| Tutorials | tutorials |

- Behaviour (verified):
  - Clicking a tab filters the grid client-side and updates the URL to `/blog?category-2=<slug>` with no reload.
  - The featured block stays visible.
  - With zero matches (MCP, Comparisons) the grid is simply empty: **no empty-state message**, and the pricing band follows directly.
  - The tabs are not links.
- Search: a cell 180x40 at the right (x=1183, padding 12). A 24px icon slot sits before the input (icon not captured). The input is Geist Mono 14px/16.8px, white, transparent, borderless, placeholder "Search…".
  - Typing filters the grid by **title contains** and sets `?title=<query>` (verified: "joins" returned 4 posts).
- 390: **the tabs row is hidden**. Only the search row shows (input 294 wide at x=60).

### 1.5 Grid
- `blog_articles_grid`: Shell inner padding 12, CSS grid, 3 columns of 424px, gap 8. 119 PostCards (A), each 424x562.
- **No pagination and no load-more**: all 119 cards are in the SSR HTML.
- Order is the CMS order (mostly newest first, but not strictly by date). Use `index_order` from posts.json.
- 390: one column, cards 366x529 at x=12, no gap between rows. Image 366x209.

### 1.6 Post inventory (summary; full data in specs/posts.json)
- 119 cards on the index. **107** resolve to live posts. **12 cards link to URLs that 308-redirect to `/blog`**:
  - handle-semi-structured-data-log-pipelines
  - load-test-glass-flow-for-click-house-real-time-deduplication-at-scale
  - kafka-to-clickhouse-with-glassflow-and-altinity-cloud
  - part-4-apache-flink-is-not-the-solution-to-clickhouse-duplications
  - connect-google-pubsub-to-glassflow-data-streaming
  - connect-zapier-to-glassflow-real-time-data-processing
  - connect-amazon-sqs-to-glassflow-data-integration
  - build-real-time-applications-with-aws-kinesis-dynamodb-and-glassflowbuild-real-time-applications-with-aws-kinesis-dynamodb-and-glassflow
  - real-time-alerts-with-ai-and-streamlit
  - revolutionizing-real-time-alerts-with-ai-nats-and-streamlit
  - postgres-to-snowflake
  - glassflow-vs-aws-lambda
- Three of those 12 are in the sitemap (handle-semi-structured…, kafka-to-clickhouse-with-glassflow-and-altinity-cloud, part-4-…).
- Sitemap cross-check: sitemap.xml has **67** `/blog/*` URLs, not 69. All 67 appear on the index; 52 index cards are not in the sitemap.
- Posts per category (one category per post):

| category | posts |
|---|---|
| Engineering | 90 |
| Use Cases | 9 |
| Agent Observability | 5 |
| Product Updates | 5 |
| Tutorials | 5 |
| Agent Infrastructure | 3 |
| Data for Agents | 2 |
| MCP | 0 |
| Comparisons | 0 |

- Authors: Armend Avdijaj 76, Bobur Umurzokov 13, Ashish Bagri 10, GlassFlow 7, Meryem Cebeci 6, Pablo Pardo Garcia 3, Vimalraj Selvam 3, "Guest Author: Karolis Ščerbiakas" 1.

---

## 2. Blog post template: /blog/[slug]

Measured on `how-to-debug-an-ai-agent` (height 10,554 at 1440, 17,786 at 390). Spot-checked `clickhouse-joins` (24,040) and `news-announcing-glassflow-raised-seed-round` (5,238). All three use one template. They differ only in hero height (it grows with title and description length: 491 vs 414) and in which rich-text elements appear.

Nav: **unchanged**. Footer and CTA band: **unchanged**. The `<title>` is the post SEO title (posts.json `seo_title`). og:image is the post cover.

### 2.1 Layout at 1440

| y | height | section |
|---|---|---|
| 0 | 40 | Navbar |
| 40 | 32 | divider-xs |
| 72 | 491 | Hero (38 bar + 453 row) |
| 563 | 67 | Spacer |
| 630 | 7,883 | Article body |
| 8,513 | 67 | Spacer |
| 8,580 | 64 | Share bar |
| 8,644 | 160 | "You might also like" title |
| 8,804 | 570 | Related posts |
| 9,374 | 67 | Spacer |
| 9,441 | 452 | Two-products band (B) |
| 9,893 | 67 | Spacer |
| 9,960 | | Footer |

There is **no table of contents, no author box, no newsletter block and no comments**. The author appears only in the hero meta row.

### 2.2 Hero
- Bar 38px, bg `#1D0E00`, padding 16. Dots (6x6 `#492400`) at left x=80 and right x=1334. Centred breadcrumb link "blog / …" → `/blog`, Geist Mono 14px/21px, **weight 300**, letter-spacing -0.28px, cream.
- Row 1312x453, bg `#1E0F00`, two cells:
  - **Left 644 wide.** Background image `p8ihsATIQW2BpC2j7ekzEF2gA.jpg` covers the upper 644x382 behind the text. pixel-corner SVG 48x72 at top-left. Content padding 64px 32px, gap 15:
    - Pill (category) at y=174: amber, padding 6px 10px, Inter 12px/12px, weight 500, uppercase, `#1D0E00`.
    - H1: Inter Display **40px/48px**, weight 400, letter-spacing -1.6px, cream, 580 wide.
    - Description (the post excerpt field): Inter Display **21px/29.4px**, letter-spacing -0.84px, cream (rendered per character, see 0.4).
    - Meta row: 71px tall, two equal cells (322 each), padding 12px 32px, gap 12, 1px top border. Each cell has a 23x23 pixel icon (author / calendar, content-assets.md section 3), a label and a value:
      - Label: Geist Mono 14px/21px, weight 300, letter-spacing -0.28px, cream ("Written by", "Date added").
      - Value: Inter 16px/24px, **weight 300**, letter-spacing -0.32px, cream (author name; date in `<time datetime>`, format "Sep 21, 2026").
  - **Right 668 wide**, padding 12: a 644x429 frame with the backdrop `5G4h16OWSlfa4F2lERWRFPE.jpg` (cover). The post cover is centred inside with horizontal padding 24 (596x429), **object-fit: contain**.

### 2.3 Article body
- Shell. Inner padding 0 192px gives a 928-wide column (x=256..1184) with 1px `#5F3E1F` left and right borders. Column padding: top 32, left/right 64, bottom 64. The **text measure is 800px** (x=320).

| element | font | size / line-height | weight | letter-spacing | colour | spacing | other |
|---|---|---|---|---|---|---|---|
| p | Inter Display | 18px / 32.4px | 400 | -0.36px | #F1EFDF | margin-top 20 (first 0) | |
| h2 | **Inter** | 32px / 44.8px | 500 | -1.28px | #FFFFFF | margin-top 40 | |
| h3 | Inter Display | 26px / 36.4px | 500 | -1.04px | #FAFAFA | margin-top 40 | |
| ul / ol | Inter Display (as p) | 18px / 32.4px | 400 | -0.36px | #F1EFDF | margin-top 16; no gap between li | li padding-left 22px (ul) / 20px (ol); markers disc / decimal in cream; nested lists indent once more (seen in restack) |
| strong | as p | as p | 700 | as p | as p | | |
| em | as p | as p | 400 | as p | as p | | italic |
| a (inline) | as p | as p | 400 | as p | **#FFAC00** | | underline |
| inline code | Geist Mono | 18px / 32.4px | 400 | -0.36px | rgba(255,255,255,0.7) | padding 1.8px 3.6px | bg #1E0F00, radius **6px** (the only rounded element on the site) |
| blockquote (22 posts) | p inside: Inter Display | 16px / 28.8px | 500 | | #F1EFDF | margin-top 20; padding 32px 32px 32px 34px | bg #1E0F00, text italic; a 2px ::before bar at the left in the same #1E0F00, so it is invisible |

- **Images**:
  - `img.framer-image` at **720px wide** (not the full 800), natural aspect (e.g. 720x405, 720x310), 1px `#222222` border, margin-top 16.
  - Some are wrapped in an `<a>` (e.g. to a related post).
  - Older posts use 800-wide images (e.g. clickhouse-joins 800x400).
  - No captions observed.
- **Tables** (50 posts):
  - `figure.framer-table-wrapper`, margin-top 16, `overflow-x: auto`. Table 800 wide with 1px `#5F3E1F` outer and cell grid lines and transparent cells.
  - Cell padding 16. Cell text is the p style (18/32.4 cream). The header row (first row, `th` or `td`) is bold.
  - No zebra striping. Reference: .playwright-mcp/post-table.png.
- **Code blocks** (50 posts):
  - Framer Code Block (Sandpack/CodeMirror, "dark" variant). Container 800 wide, bg `#1E0F00`, square corners, no line numbers.
  - `pre` padding 32px 32px 32px 36px. Geist Mono 14px/21px, **weight 600**, colour `#E6EDF3`, `white-space: pre`, horizontal scroll.
  - Syntax colours as in 0.3.
  - "Copy" button at top-right (52x32, inset about 15px), bg `rgba(0,0,0,0.35)`, white text "Copy".
  - Margin-top as p (20). Reference: .playwright-mcp/post-codeblock.png.
- hr, h4, figcaption and video embeds were not seen in the three posts checked.
- FAQ sections inside posts are plain h3 + p (no accordion).

### 2.4 Share bar
- Shell inner padding 0 192px. Bar 928x64, bg `#1E0F00`, padding 12, 1px border.
- Dots (`#492400`) at left, then "Share the article" (h2) in Geist Mono 14px/16.8px, weight 400, letter-spacing -0.56px, cream, at x=306.
- Six `<button>`s at the right, 40x40, gap 12, transparent, white 22x22 icons. aria-labels:
  - "Share on X", "Share on Facebook", "Share on LinkedIn", "Share on Reddit": open the network share-intent URL.
  - "Copy link": copies the URL.
  - "Share": Web Share API.
- The click behaviour was not exercised; build with the standard intent URLs. Hover is an opacity transition, 0.2s.

### 2.5 Related posts
- Title band 160px: Shell inner padding 64px 24px. "You might also like" in Inter Display 32px/32px, cream, left aligned.
- Row: 3 PostCards (A) at 437 wide with no gap (x=64, 501, 939), 570 tall. Image 437x250.
- Source of the related list: a fixed per-post reference, not "same category". posts.json `related`.
  - 93 of the 107 live posts show the same three: `fraud-detection-pipelines-kafka-glassflow-clickhouse`, `glassflow-now-scales-to-500k-events-per-sec`, `handle-semi-structured-data-log-pipelines`. **The last one is a dead (308) link on live.**

### 2.6 At 390
- Hero stacks:
  - Bar.
  - Left panel: image 390x426 behind the text. Pill at y=156. H1 **32px/38.4px** at x=32, 326 wide. Description 21/29.4. Meta row 2x195 cells at y≈545.
  - Then the cover frame 366x310 at x=12.
- Body column x=24, 340 wide (padding 24). Type sizes unchanged (p 18/32.4, h2 32/44.8, h3 26/36.4). The table keeps 340 width and wraps (815 tall).
- Share bar: the six buttons centred in one row (x=45..345).
- Related: cards stack full-bleed 390x543.
- Two-products band as in B.

### 2.7 The three measured posts

| slug | title | date | author | category | cover | summary | outline |
|---|---|---|---|---|---|---|---|
| how-to-debug-an-ai-agent | How to Debug an AI Agent: A Step-by-Step Guide | Sep 21, 2026 | Pablo Pardo Garcia | Agent Observability | https://framerusercontent.com/images/ZYFgdipfUsSImL2VBbWVD01uk.png | A six-step process for debugging production AI agents: pin the symptom, retrieve the whole run, walk forward to the first divergence, inspect that step, classify the failure mode, then fix it and add a regression check. | h2 Why debugging agents is different / Before you start / The six-step process (h3 Steps 1-6) / Example: the report that lost its second half / Debugging long-running agents specifically / Common mistakes / h3 FAQ (5 Q&As as h3+p) / closing "Debug agent runs where you already work" with a "get in touch" link to /contact. 3 images, 1 table, 2 inline code. Live bug: the hero description and the card excerpt end with the stray text `" slug: "blog/what-is-agent-observability`. |
| clickhouse-joins | ClickHouse JOIN Guide: Global Join, Algorithms, Asof, Semi & Anti | Sep 26, 2025 | Armend Avdijaj | Engineering | https://framerusercontent.com/images/3hxsOE4L7XVTLV87Sf9Txk54M.jpeg | A long-form reference on ClickHouse JOINs: standard join types, ClickHouse strictness modifiers (ANY/ALL, SEMI/ANTI, ASOF, ARRAY JOIN), the join algorithms (hash, merge, direct), performance tips and limitations. | Heaviest variant: 28 code blocks (SQL), 2 tables, 4 diagram images at 800x400. SEO title "ClickHouse JOINs Explained: Types, Examples & Best Practices". |
| news-announcing-glassflow-raised-seed-round | Announcing our $4.8m seed round | Oct 28, 2024 | Armend Avdijaj | Product Updates | https://framerusercontent.com/images/63g8ickbcSVM8azszVBa574J8.png | GlassFlow announces a $4.8M seed round led by Upfront Ventures and explains the data-engineering pain points behind its Python-first event-driven pipeline platform. | Lightest variant: p, strong, h2 only, plus 1 founders photo (iDO1DdR9JYTIWyDM5r0KAQMqJkI.jpg, 800x544). Hero 414 tall. SEO title "GlassFlow secures seed funding led by Upfront Ventures to revolutionize event-driven data pipelines". |

The `clickhouse-joins` h2s are: Why JOINs in a Columnar World? / A Refresher on Standard SQL JOINs (h3: Inner, Left Outer, Right Outer, Full Outer, Why Venn Diagrams Can Be Misleading) / ClickHouse JOIN (h3: Strictness Modifiers ANY and ALL, Filtering JOIN SEMI and ANTI, ASOF JOIN, ARRAY JOIN, Summary toolkit) / A Peak Under the Hood at JOIN Algorithms (h3: Hash, Merge, Direct, Choosing) / Performance Playbook / Navigating the Limitations / Conclusion.

The seed-round h2s are: The (Many) Pain Points That Led Us Here / The Problem? Most Tools aren't built for data people / GlassFlow: The Event-Driven Pipeline Platform Built Just for Python Developers / Users are getting updated from batch to stream in no time / So, What's Next for Us?

Every other post's title, date, author, cover, summary and h2/h3 outline is in specs/posts.json. One live post (`how-to-detect-and-prevent-credit-card-fraud-in-real-time`) renders no date.

---

## 3. /categories/[slug] (legacy template)

These pages are **not** in the new Mars design. They are a leftover black ClickHouse-era Framer template.
- `/categories/comparisons` and `/categories/engineering` **308-redirect to `/blog`**.
- The other 7 return 200: agent-infrastructure, data-for-agents, mcp, observability, product-updates, tutorials, use-cases.
- `<title>` is the generic site title. The meta description is per category:

| slug | H1 | meta description | posts shown (in order) |
|---|---|---|---|
| agent-infrastructure | Agent Infrastructure | Architecture, reliability, and cost patterns for running agents at scale. | decision-model-vs-llm, ai-agent-failure-modes, blog-autonomous-agents-infrastructure-not-trust |
| data-for-agents | Data for Agents | Pre-processing, context curation, and token/latency reduction to make agents perform. | agents-in-production-context-failure, agent-defined-data-model |
| mcp | MCP | Building with the Model Context Protocol to connect agents to data and tools. | (none: the grid is empty and the page is just H1 + CTA) |
| observability | Agent Observability | Monitoring, tracing, and debugging AI agents in production. | how-to-detect-ai-agent-failures-in-production, how-to-debug-an-ai-agent, cost-self-hosting-your-agent-observability-stack, when-vector-becomes-your-streaming-engine, observability-in-the-ai-era-scaling-logs-with-clickhouse-glassflow |
| product-updates | Product Updates | Explore the latest enhancements, new features, and unlock new potential with GlassFlow. | glassflow-v3.1.0-v3.2.0-clickhouse-retries-pipeline-observability, clean-enriched-otel-data-in-clickhouse-otel-data-clickhouse, glassflow-now-scales-to-500k-events-per-sec, news-announcing-glassflow-raised-seed-round, new-design-and-ready-to-use-jupyter-examples |
| tutorials | Tutorials | Tutorials | ran-signal-quality-opentelemetry-glassflow-clickhouse, clickhouse-telemetry-pipeline-with-opentelemetry-and-glassflow, fraud-detection-pipelines-kafka-glassflow-clickhouse, building-observability-stack-with-opentelemetry-and-kafka, solve-clickhouse-join-limitations-with-glassflow |
| use-cases | Use Cases | Discover various use cases of GlassFlow with code samples. | the 9 "Use Cases" posts in index order (posts.json `categories[].post_slugs`) |
| comparisons, engineering | | | 308 → /blog |

Template at 1440 (observability page is 2,531 tall; mcp is 1,419):
- body bg `#000000`. **No home Navbar, no CTA band, no Footer.**
- **Legacy nav**, y=0..62:
  - Logo `uJSz4vz8ntpPgNuLAZrGGPBhGFo.svg` 114x16 at x=110 → `/`, then a 1px vertical divider.
  - Links in Inter 14px/16.8px, weight 500, letter-spacing -0.28px, `#A8A3A3`:
    - Product (with chevron) → /product
    - Case Studies → /case-studies
    - Pricing → /rius/pricing
    - Resources (with chevron) → /product
    - Contact → /contact
  - Right: GitHub-buttons star widget "clickhouse-etl | 504" → https://github.com/glassflow/clickhouse-etl (white pill, renders from buttons.js).
- Main: padding 140px 20px, gap 86, centred.
  - H1: Inter 56px/67.2px, weight 500, letter-spacing -2.24px, centred, gradient text (white to `#A8A8A8`).
  - Grid: 1220 wide (x=110), 3 columns of 385, gap 32. Cards are **PostCard (A)** at 385 wide (image 220 tall). The author-name cell renders empty.
- Bottom CTA:
  - Image `IXfpuu2qaDEHssgxdeU5Z0pWoI.jpeg` (meteor + logo) 1400x818 with a black top fade.
  - H2 "Data transformations at TB scale for ClickHouse": Inter 56/67.2, weight 500, -2.24px, gradient, 800 wide, centred.
  - P "Get query ready data, lower ClickHouse load, and reliable pipelines at enterprise scale.": Inter 20px/28px, -0.8px, `#A8A3A3`.
  - Buttons: "Get in Touch" (white bg, black text, 123x48) → https://cal.com/team/glassflow-founders/founders, and "Explore the code" (black bg, 1px grey border, white text, 150x48) → https://github.com/glassflow/clickhouse-etl.
- 390: **not responsive on live**. The desktop nav overflows to the right and the 3-column grid squeezes to 79px-wide cards. Treat this as a live defect. The clone should either mirror it, or (recommended, caller to decide) collapse to one column with 16px gutters.
- Reference screenshots: .playwright-mcp/cat-mcp-1440.png, cat-obs-1440.png.

---

## 4. /case-studies (index)

Title is the generic site title, with the generic meta description. Height 1,293. Nav: **unchanged**. Footer and CTA band: **unchanged**. The Footer follows the listing after one 67px Spacer, with **no** Two-products band.

- divider-xs (32).
- Title section, 301px:
  - Bar 38px, bg `#2D1803`, dots.
  - Panel 1312x263, bg `rgb(45,24,5)`, background image `gGgprOgbK8sImEo5X3oHCssBw0w.jpg` (object-fit contain), pixel-corner. Padding 64px 32px.
  - H1 "Case Studies": Inter Display 40px/40px, -1.6px, cream, centred.
- Listing 259px: Shell inner padding 4, gap 4. Two cards 650x251:
  - Card: bg `#1E0F00`, 1px `#5F3E1F` border.
  - Logo row 78px, padding 24, logo 30px tall. Restack `gU6Xy4ekBJSu57RtzjJJ0U3x1Q.svg` is 71x30; Nubrain `71EJsST8RQxnFwMo7Alb9eWZXcI.svg` is 134x30.
  - Title block 121px, padding 24: H3 in Inter Display **26px/36.4px**, weight 500, -1.04px, cream, 602 wide.
  - Full-width DarkButton row 52px: "read more" with roll-up hover.
  - Order: Restack (`/case-studies/restack`), then Nubrain (`/case-studies/nubrain`).
- 390: cards stack (full width, title 26px/36.4px).

---

## 5. Case-study template: /case-studies/[slug]

The same component block also appears at the bottom of each detail page as "You might also like" (the case-studies title panel plus the same two-card listing, with the H1 "You might also like" at 40/40, centred).

### 5.1 Layout at 1440 (restack, height 4,825; nubrain 5,274)
- Navbar, then divider-xs.
- **Hero** 280px: 1312 wide, background `fpSmMnbghTzYJNtWqkUhZjTF1UE.jpg` (cover), padding 64px 0, gap 16, centred:
  - Chip "Case Studies" (amber, Inter 12px weight 500 uppercase `#1E0F00`) → `/case-studies`.
  - H1: Inter Display **40px/48px**, -1.6px, `#FAFAFA`, centred, 620 wide.
- **Results strip** 227px: padding 32px 4px, three `cs-bullet` cells 413x163:
  - Each cell: bg `#1E0F00`, padding 20, gap 20.
  - Metric: h2 in Inter 32px/38.4px, weight 500, -1.28px, white.
  - Label: Inter Display 18px/32.4px, cream.
- **Body row** (Shell, starting y=579): article column 780 wide at x=170 (padding 32; content 716 at x=202), plus a sidebar 320 wide at x=950.
  - Article: first the **quote card** (5.3), then rich text using **the same typography as posts 2.3** (h2 Inter 32/44.8 white margin-top 40; p 18/32.4 margin-top 20; ul margin-top 32 here; li padding-left 22).
  - **Sidebar "CTA"**: bg `#1E0F00`, padding 40px 24px, gap 20, **sticky top 128px**, 320x639 (nubrain) / 692 (restack). Contents:
    - Company logo (272x32, contain).
    - h6 "Company Overview": Geist Mono 16px/22.4px, weight 500, letter-spacing -0.32px, `#ABABBA`, uppercase.
    - 2 to 3 paragraphs: Inter Display 18px/32.4px, cream.
    - "Visit Website" button: 125x48, padding 4px 20px. Inter 14px, weight 500, white, roll-up label (per-character spans). Links to the company site.
- Spacer, "You might also like" block (title panel 222 + listing 259), Spacer, Two-products band (B), Spacer, Footer (all **unchanged**).

### 5.2 At 390
- Hero H1 40px/48px across 358px.
- Results cells stack (382 wide; metric 24px/28.8px).
- Article padding 16 (text 358 wide).
- The quote card comes first (358x435; quote text **21px/21px**).
- **The sidebar moves below the article** (390 wide, still sticky).
- Then "You might also like" (32px/32px heading), stacked cards, band and Footer.

### 5.3 Quote card (Testimonial variant)
- 716 wide, bg `#2D1804`.
- Upper part: background `7xhczrFmZXWm4XtTt3xdK5HjPSc.jpg`, padding 40, gap 32. Quote glyph `quote.svg` (34x34, as home). Quote text in Inter Display **32px/32px**, cream, 636 wide.
- Attribution row 100px, two cells of 358, padding 40, gap 8:
  - Left: avatar 48x48, name (Geist Mono 16px/18.2px, weight 700, white) and role (Geist Mono 16/18.2, weight 700, cream).
  - Right: a 48x48 company tile.
- Height 374 (nubrain) / 412 (restack). This is the home `Testimonial` with smaller padding (40 instead of 64) and width (716 instead of 1312).

### 5.4 Per-page content

| | nubrain | restack |
|---|---|---|
| URL | /case-studies/nubrain | /case-studies/restack |
| `<title>` | "Nubrain fixes the silent errors of AI agents in their pipelines - GlassFlow \| Open-Source Kafka to ClickHouse Ingestion" | "Restack scales real-time enterprise observability with GlassFlow - GlassFlow \| Open-Source Kafka to ClickHouse Ingestion" |
| H1 | Nubrain fixes the silent errors of AI agents in their pipelines | Restack scales real-time enterprise observability with GlassFlow |
| Metrics | 93% / "Reduction of silently duplicated or corrupted metrics"; 3x / "Improved scalability as agent throughput increased"; 7 TB/day / "Stable processing" | 84% / "Reduction in engineering effort for building and maintaining pipelines"; 87% / "Reduction in pipeline-related incidents"; 10 TB / day / "Stable processing" |
| Quote | "GlassFlow helped eliminate silent failures in our pipelines. Dead-letter queues and pipeline metrics significantly improved reliability while keeping everything self-hosted." | "I am happy we found GlassFlow. I was fed up seeing my engineers debugging broken observability pipelines and spending their time creating custom solutions, while our focus should have been on improving our own product." |
| Attribution | Ingo Marquardt, / CTO, Nubrain. Avatar EB74VMW0V1AQrN80SXS6xOsXPg.jpeg, tile hOEgbo26i8shpzvhlvFGZZHDQY.jpeg | Andres Tapia, / CEO, Restack. Avatar AvNQPA2KLw0PJ8qQYPYqet4URQ.png, tile oIbDPvgphfWTFE1bRAFoKFR51po.jpeg |
| Body outline | Results (bulleted outcomes) / Key takeaways / The Challenge (5 bold-lead bullets: stateless transforms, scalability, observability, silent data issues, operational complexity) / Why GlassFlow / Solution (two bullet lists, closing line) | Results (bullets incl. a nested list of alerting examples) / Key takeaways / Challenge - Real-time Observability (5 bullets) / Solution (two bullet lists; "full rollout was completed in fifteen days") |
| Sidebar logo | 71EJsST8RQxnFwMo7Alb9eWZXcI.svg | gU6Xy4ekBJSu57RtzjJJ0U3x1Q.svg |
| Sidebar copy | "Nubrain is building a Human Mind API for non-invasive brain-computer interfaces. Their platform processes large volumes of AI-driven data produced by autonomous agents and research systems." / "As Nubrain moved from experimentation to production workloads, they needed streaming pipelines that could handle state, scale reliably, and provide deep observability." | "Where product teams design, test and optimize agents at Enterprise Scale." / "The open-source stack enabling product teams to improve their agent experience while engineers make them reliable at scale on Kubernetes." / "As data volume and customer expectations have grown, Restack needed a more reliable way to build and operate streaming observability pipelines." |
| Visit Website | https://nubrain.com/ | https://www.restack.io/ |
| One-sentence summary | Nubrain replaced Kafka table engines and stateless custom code with GlassFlow's stateful transformations, dedup and dead-letter queues, cutting silently corrupted metrics by 93% at about 7 TB/day. | Restack moved its real-time observability pipeline to GlassFlow, cutting pipeline engineering effort by 84% and incidents by 87% while ingesting about 10 TB/day from Kafka to ClickHouse. |

Both pages share the site og:image PTY3z7Ur6ZW6KXa0gAPOKvtrsw.jpg and the generic meta description. No published dates are shown.

---

## 6. /about

Title "About GlassFlow | Infrastructure for AI Agents". Meta "GlassFlow builds infrastructure for AI agents: Rius, observability for AI agents, and Tares, an open-source data plane that feeds them." og:image https://framerusercontent.com/assets/5ErGRvzLzclNdw6dtMv4E23b0.png. Height 6,749 at 1440 (10,014 at 390). Nav: **unchanged**. Footer and CTA band: **unchanged**.

| y | height | section |
|---|---|---|
| 0 | 40 | Navbar |
| 40 | 32 | divider-xs |
| 72 | 595 | Hero |
| 667 | 67 | Spacer |
| 734 | 400 | Values |
| 1,134 | 67 | Spacer |
| 1,201 | 1,766 | Team |
| 2,967 | 67 | Spacer |
| 3,034 | 692 | Discover more |
| 3,726 | 67 | Spacer |
| 3,793 | 1,800 | Investors |
| 5,593 | 67 | Spacer |
| 5,660 | 428 | Two-products band (B) |
| 6,088 | 67 | Spacer |
| 6,155 | | Footer |

### 6.1 Hero
- Bar 38px (`#1D0E00`, dots).
- Row 1312x557, bg `#1E0F00`.
- **Left 729 wide**: background `p8ihsATIQW2BpC2j7ekzEF2gA.jpg` (cover), pixel-corner, padding 64px 32px, gap 15.
  - H1 "Developing data infra products for AI agents": Inter Display **48px/48px**, -1.92px, cream, 665 wide.
  - Three paragraphs: **Inter** 17px/23.8px, weight 400, letter-spacing -0.68px, **white**, 600 wide, about 20px apart. Inline links "Tares" → /tares and "Rius" → /rius in amber `#FFAC00`.
- **Right 583 wide**: team photo `z5vl4a9tCeiczbox4Aqgzy11Dk.png` (cover) over the `5G4h16…` backdrop.
- Story outline (do not transcribe beyond this):
  1. GlassFlow builds the infrastructure AI agents need in production. Agents are only as good as their data and are hard to debug once live.
  2. Two products: Tares feeds agents correlated real-time data; Rius is the observability layer showing what agents do and why they fail.
  3. The team has built systems at scale at Google, Uber, SumUp, Avira and Mister Spex.
- 390: H1 48px/48px across 326px (3 lines). Paragraphs stack, then the photo.

### 6.2 Values
- Bar 50px (`#2D1803`).
- Grid of 3 cells (437 each, 350 tall). Each cell has bg `#2D1803` plus background image `D96xSgDLnqPtPU2OdIebnL9UZYs.jpg` (cover), padding 64px 24px, gap 64, centred:
  - 64x64 amber pixel icon.
  - Title: Geist Mono 18px/18.2px, weight 700, cream.
  - Text: Inter Display 18px/27px, -0.18px, cream, centred, 389 wide.
- Copy:
  - Simplicity: "We believe in making the complex simple. GlassFlow allows engineers to focus on innovation without being bogged down by unnecessary setup or management of data pipelines."
  - Empowerment: "GlassFlow is built to empower data engineers and teams to maximize productivity and creativity. We remove technical barriers so that you can focus on developing impactful solutions."
  - Curiosity: "In an ever-changing environment, a curious mindset drives us to ask the right questions, explore possibilities, and uncover creative solutions. We are committed to stay curious"
  - The live DOM also holds a hidden variant of each text reading "Four plans, priced per trace…"; ignore it.
- 390: the cells stack (390x273, padding 32).

### 6.3 Team ("Meet our team")
- Title band 168px, padding 64px 24px: "Meet our team" in Inter Display 40px/40px, cream, left aligned.
- Grid: padding 4, gap 4, 3 columns of 432. Cards 432x394, bg `#1E0F00`:
  - Bar 38 (`#1D0E00`).
  - Photo 432x300 (cover, links to LinkedIn).
  - Footer row 56px: name in Geist Mono 14px/18.2px, weight 700, **`#FFAC00`**; role in Geist Mono 14/18.2, weight 700, cream; padding 8px 8px 8px 12px, gap 4.
  - A 56x52 square LinkedIn button at the right (20x20 white-80% LinkedIn glyph).
- 11 members in this order: Armend Avdijaj, Vladimir Cutkovic, Kiran Nambiar, Petr Nuzhnov, Meryem Cebeci, Pablo Pardo Garcia, Benjamin Gorski, Ayaan Islam, Ashish Bagri, Markos Sfikas, Bahareh Darbandi. Roles, photos and links are in content-assets.md.
- The last row has 2 cards. The lower cards' photos are lazy-loaded.
- 390: 2 columns of 195.

### 6.4 Discover more
- Section bg `ARgMqlYnmiFWpdywy7EoO9FO9vI.png` (as home Quickstart), padding 64px 24px, gap 32.
- Heading "Discover more": Inter Display 40px/40px, centred, 440 wide.
- Two cards of 490, gap 8 (x=226 and 724):
  - Top 280px: a 42px title bar with the label ("careers" / "blog") centred in Geist Mono 14/18.2, weight 700, `rgba(241,239,223,.64)`, over the card image (`gheBrKCK3Ciu5xEcHzMBCgSv3o.jpg` / `HzF3suL0qSMigUGajw02x3z6U98.jpg`).
  - Text box 118px, bg `#2D1804`, padding 16: h3 in **Inter** 24px/28.8px, weight 500, -0.96px, white, centred, 320 wide.
    - careers: "We are hiring people who want to shape the data streaming future with us."
    - blog: "Check the latest news, product updates and best practices."
  - Full-width DarkButton row (482x44 inner) "find out more" → https://join.com/companies/getglassflow (careers) / `/blog`.
- This is the home Quickstart card frame with different contents.

### 6.5 Investors ("Backed by the best")
- Title band as in 6.3: "Backed by the best".
- Grid: padding 20, gap 20, 5 columns of 238.
- Each card: photo 238x238 with a 32x32 badge at bottom-right (x+202, y+203); then name and firm, centred:
  - Name: Geist Mono **13px/18.2px**, weight 700, cream.
  - Firm: Geist Mono **12px/14px**, weight 700, cream.
- 21 investors (5 rows of 5 plus 1). List and images are in content-assets.md.
- 390: 3 columns of 130 (each cell 194 tall).

---

## 7. /contact

Title "GlassFlow | Contact". Generic meta. Height 3,049 at 1440 (4,508 at 390). Nav: **unchanged**. Footer and CTA band: **unchanged**.

| y | height | section |
|---|---|---|
| 0 | 40 | Navbar |
| 40 | 32 | divider-xs |
| 72 | 789 | Hero (50 bar + 738 row) |
| 861 | 67 | Spacer |
| 928 | 965 | Calendar |
| 1,893 | 67 | Spacer |
| 1,960 | 428 | Two-products band |
| 2,388 | 67 | Spacer |
| 2,455 | | Footer |

### 7.1 Hero (2 x 656 grid)
- Bar 50px (`#2D1803`, dots).
- **Left 656 wide**, bg `#2D1803`:
  - Image `D96xSgDLnqPtPU2OdIebnL9UZYs.jpg` 656x563 (cover) behind the text. Content padding 64, gap 64, centred.
  - Title "Send us / a signal": Inter Display **48px/48px**, **`#FFAC00`**, centred, 408 wide, 2 lines.
  - Sub: Inter Display 21px/31.5px, -0.18px, cream, centred, 408 wide:
    - 1440: "Two products, one platform. / Feed your agents the right data with Tares, see what they did in production with Rius. / Tell us what you're building." (3 lines/paragraphs).
    - **390: different copy**: "Four plans, priced per trace, not per seat. Start free, pay for what you actually send."
  - Under the image, a caption bar (50px, padding 16px 32px): "Works with the tools you already use." in Geist Mono 14/18.2, weight 700, cream, centred.
  - Then a 4-cell logo row (164x125 each, padding 24): Vercel, Claude, Cursor, OpenAI (reuse the LogoStrip SVGs).
  - 390: the logo row becomes 2x2 (195x125).
- **Right 656 wide**: outer bg `#1E0F00`, padding 40. Inner form panel 576x658, bg `#2D1804`, padding 40.

### 7.2 Contact form (custom React code component, HubSpot submit; **do NOT submit while testing**)
- `<form novalidate>`, width 100%. Font `"Geist Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`, size 14.
- Fields in order. Each has a label above it (14px, line-height 1.3, `#F1EFDF`, margin-bottom 10). Fields are 16px apart.

| name / id | label | type | placeholder | required attr |
|---|---|---|---|---|
| firstname / gf-firstname | First Name | text | e.g. John | yes |
| lastname / gf-lastname | Last Name | text | e.g. Doe | yes |
| email / gf-email | E-Mail | email | e.g. john@example.com | yes |
| which_glassflow_solution_are_you_interested_in | Which GlassFlow Solution are you interested in? | radio chips: "Tares" (value "GlassFlow Tares"), "Rius" (value "GlassFlow Rius") | | no |
| message / gf-message | Message | textarea, 139px tall, padding 14px 16px, line-height 1.5, `resize: none` | Your message... | no |

- Inputs: height 43, padding 0 16, no border, radius 0, bg `#FFFFFF`, text `#1E0F00`.
  - Placeholder `#1E0F00` at opacity 0.64.
  - Focus: `outline: 1px solid #5F3E1F; outline-offset: -1px`.
  - Width 496 at 1440 (x=800), 310 at 390.
- Radio chips:
  - The native radio is visually hidden.
  - Chip: inline-flex, gap 8, padding 6px 8px, 14px, line-height 1. Off state: bg `#1E0F00`, text `#F1EFDF`, 1px border `#5F3E1F`. A 20x20 box with a 1px `#5F3E1F` edge, containing a hidden check.
  - Checked: bg `#FFAC00`, text `#492400`, border `#FFAC00`, box edge `#492400`, check visible.
  - Focus-visible: 1px `#FFAC00` outline.
  - Chip sizes 88x34 ("Tares") and 80x34 ("Rius"), gap 8.
- Submit row (height 52, flex):
  - `<button type=submit class=gf-submit>` flexes to fill (444 wide at 1440): bg `#FFAC00`, `box-shadow: inset 0 0 0 4px #FFAC00, inset 0 0 0 5px #5F3E1F` (the BigButton double frame), text "submit" lowercase, `#1E0F00`, opacity 0.9.
  - Followed by a 52x52 amber square with the same frame and the 16x14 pixel arrow (fill `#492400`), aria-hidden.
  - While sending, the label is "sending" and the button is disabled (opacity 0.6).
- Validation and submit (read from the component source; not executed):
  - **No client-side validation**: `noValidate` is set and the `required` attributes are only advisory.
  - On submit: `preventDefault`. Only non-empty fields are POSTed as JSON to `https://api.hsforms.com/submissions/v3/integration/submit/139646698/199d435a-bff8-45ec-b20e-7eeb50c5e83f`. Body: `{fields:[{objectTypeId:"0-1",name,value}], context:{hutk: <hubspotutk cookie>, pageUri, pageName}}`.
  - On success: **redirect to `/contact/success`** (`successAction: "redirect"`). The fallback success message "Thanks — we'll be in touch." is not used here.
  - On a non-OK response: show HubSpot's first error message, or "Submission failed (<status>)" / "Something went wrong", in a `role="alert"` div under the button (margin-top 12, 12px, colour `#5F3E1F`). The form stays filled.
  - For the clone: post to the same endpoint or stub it, then route to /contact/success.

### 7.3 Calendar section ("Stuck on something? Let's talk.")
- Section bg `ARgMqlYnmiFWpdywy7EoO9FO9vI.png`, padding 64px 24px, gap 32, centred.
- Heading "Stuck on something? / Let's talk.": Inter Display 40px/40px, centred, 440 wide.
- Sub "Sometimes the docs don't cut it. That's what the founder's calendar is for. Grab 30 minutes below.": 16px/24px, -0.18px.
- Card 800 wide (x=320), bg `#2D1804`, padding 4, gap 8:
  - Title bar "calendar-app" (as Quickstart title bar, muted label).
  - Embedded cal.com iframe 792x571: `https://app.cal.com/armend-glassflow/engineering-intro-call-with-founder/embed?layout=month_view&...` (external; embed as-is).
  - Under the card: two 400x56 founder cells (bg `#1D0E00`, padding 4, gap 8), each with a 48x48 avatar and name/role in Geist Mono 14/18.2, weight 700. Names cream, roles at 64%: "Armend Avdijaj / Founder & CEO", "Ashish Bagri / Founder & CTO".
- 390: card 342 wide.

Then Spacer, Two-products band (B), Spacer, Footer.

---

## 8. /contact/success

Generic title and meta. Height 1,413. Nav: **unchanged**. Footer and CTA band: **unchanged**. There is no Two-products band.
- divider-xs, then hero 680px: bar 50 (`#2D1803`), then a 2 x 656 grid:
  - **Left** (bg `#2D1803`):
    - Image `D96xSgDLnqPtPU2OdIebnL9UZYs.jpg` 656x417 behind the centred text block (padding 64, gap 64):
      - "Thanks for reaching out!": Inter Display 48px/48px, **cream**, centred, 408 wide.
      - "We've got your message. One of our engineers or founders will get back to you shortly.": Inter Display 18px/27px, -0.18px, centred.
      - "In the meantime, here's where to poke around:" in the same style.
    - Below the image, three 71px link rows (padding 16px 32px, gap 12, 1px borders). Each row has a 24x24 amber check icon, a title (Geist Mono 14/18.2, weight 700, cream) and a line of Inter Display 14px/16.8px cream:
      1. "Tares on GitHub ↗" → https://github.com/glassflow/tares. "Open source. Feed your agents the right data clone it, run it, drop a star." (sic, no punctuation after "data")
      2. "Read the Blog" → `/blog`. "How we think about agent observability and long-running agents."
      3. "Rius guides ↗": **no href on live**. "Wire up traces, MCP, and retention: from first span to production." (the intended target is presumably https://docs.glassflow.ai/rius/guides)
  - **Right 656x630**: image `rEJrzUhJOm30gvdjvFesntLyB0k.jpg` (cover), padding 40.
- Spacer, Footer.
- 390: the columns stack (left text first). Not separately measured beyond the stack order.

---

## 9. /newsletter

**308 Permanent Redirect → `/blog`** (as are `/categories/comparisons` and `/categories/engineering`). There is no page to build; add redirects in the router.

---

## 10. Measurement notes and gaps

- The Playwright browser was shared with other agents during this run, so several reads were repeated. Every value above comes from a check that the URL matched before reading.
- **Unmeasured**:
  - Hover visuals beyond the duplicated roll-up labels and the share-button opacity transition.
  - Appear-animation timings.
  - The /blog search icon glyph.
  - The `?category-2=` value for "Agent Observability" (inferred).
  - Share-button click behaviour.
  - The /contact/success layout at 390 beyond stacking.
  - Below-the-fold /about images at 390 (they are lazy-loaded; URLs come from SSR).
- Reference screenshots in /Users/riyaghosh/V3/GLASSFLOW/.playwright-mcp/: post-top-1440.png, post-table.png, post-codeblock.png, post-blockquote.png, cs-restack-1440.png, about-1440.png, cat-mcp-1440.png, cat-obs-1440.png. Raw measurement JSON: m_*.json, blog_struct.json.
