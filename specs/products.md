Source: https://www.glassflow.ai/

# Product pages spec: /tares, /rius, /rius/pricing, /rius/alternatives/{arize,langfuse}, /rius/calculator-building-your-own-agent-observability, plus redirects

Measured live 2026-10-13 with an isolated headless Chromium (Playwright 1.63) at 1440x900 and 390x844. All px values are computed (`getComputedStyle` / `getBoundingClientRect`). Coordinates are page coordinates `[x, y, w, h]` at 1440 unless marked. Home tokens and sections are in `/Users/riyaghosh/V3/GLASSFLOW/CLONE_SPEC.md` (written "home §N" below). Asset URLs per section are in `/Users/riyaghosh/V3/GLASSFLOW/specs/products-assets.md`.

Scope: www.glassflow.ai only. External hrefs (docs.glassflow.ai, console.*, rius.glassflow.ai, tares.glassflow.ai, cal.com, github, x, linkedin) are listed as outbound links only and were not followed.

---------------------------------------------------------------------------------------------------

## 0. Routing: four paths in scope are redirects

`curl` against the live site returns HTTP **308** for these paths. They have no page of their own:

| path | 308 Location | build as |
|---|---|---|
| /product | `/` | redirect to `/` |
| /integrations | `/` | redirect to `/` |
| /proof-of-concept | `/` | redirect to `/` |
| /enterprise | `/rius/pricing` | redirect to `/rius/pricing` |

Use a client-side `<Navigate replace>` or a router redirect. The rendered result matches home and /rius/pricing exactly (identical heights: 5033/7784 and 5377/7571).

---------------------------------------------------------------------------------------------------

## 1. Shared across all product pages

### 1.1 Global chrome: nav, CTA band and footer

| page | Nav (home §1, `Navbar.jsx`) | CTA band (home §8) + footer (home §9) via `Footer.jsx` |
|---|---|---|
| /tares | unchanged except `get_started` href = `https://console.tares-glassflow.com/?utm_source=button&utm_medium=website&utm_campaign=hp_start_cta` | unchanged |
| /rius | unchanged except `get_started` href = `https://console.rius-glassflow.com/signup?utm_source=framer.com&utm_medium=referral&utm_campaign=hp_start_cta` | unchanged |
| /rius/pricing | unchanged (`get_started` -> `/#quickstart`) | unchanged |
| /rius/alternatives/* | unchanged (`/#quickstart`) | unchanged |
| /rius/calculator-... | unchanged (`/#quickstart`) | unchanged |

Make `Navbar` accept a `ctaHref` prop (default `/#quickstart`). The CTA band and footer are byte-identical on every page: same images, copy, hrefs and the 594px "Desktop" block (320 band + 208 footer + 66 legal). Live hrefs are written relative (`./blog`, `../blog`, `../../blog`), but they all resolve to the same absolute paths as home.

**Gap under the nav.** On home the hero starts at y=40. On product pages a 32px blank `divider` band sits under the nav (y=40..72: page bg, bordered column; reuse `Spacer` with `inner="h-[30px]"` or similar). Mobile: the nav is 80 tall (home §1) and the 32px divider follows (y=80..112). Calculator page: this band is 66px tall (y=40..106). Alternatives pages: no band; the embed starts at y=40.

**Spacers.** Sections are separated by the home 67px `Spacer` band (`<Spacer/>`) unless noted.

### 1.2 New tokens

These appear on product pages and are not in home §0. Everything else reuses home tokens (page #492400, panel #2D1804, bar #2D1803, deep #1D0E00, line #5F3E1F, amber #FFAC00, cream #F1EFDF, cream64, white).

| token | value | used for |
|---|---|---|
| card-dark | `#1E0F00` rgb(30,15,0) | dark content panels (`main-wr`, `row-xl`, pricing highlight column, timeline log lines, outer frame of DarkButton and text-roll buttons, blog author bar, text on cream buttons) |
| amber-2 | `#FFAA00` rgb(255,170,0) | active tab number chip; amber "finding" text in the /tares timeline |
| amber-tint | `rgba(255,172,0,0.05)` | highlighted final timeline log box (/tares) |
| table-band | `#54310F` rgb(84,49,15) | pricing table group header rows ("SUPPORT", "BILLING", "In every plan") |
| promo | `#5B3200` rgb(91,50,0) | "try 1 month for free" pill |
| blog-title | `#E0E0E0` | blog card title |
| blog-muted | `rgba(230,230,230,0.8)` | blog card description and author |
| traffic-red/yellow/green | `#FE5F57` / `#FEBC2E` / `#27C840` | blog card dot squares on hover (rest = page #492400) |

### 1.3 New type roles (desktop; all Inter Display 400 unless noted)

| role | size/line-height | letter-spacing | colour |
|---|---|---|---|
| Product hero H1 | 48/48 | -1.92px (-0.04em) | cream |
| Product hero lead | 21/29.4 | -0.84px | cream at opacity .64 |
| Section H2 large | 40/40 (rius retrospective: 40/48) | -1.6px | cream |
| Section title (row title) | 32/32 | 0 | cream |
| Image-card title | Geist Mono 700, 18/18.2 | 0 | cream |
| Image-card body | 16/22.4 | -0.64px | cream at opacity .64 |
| Tab title | Geist Mono 700, 14/18.2 | 0 | cream (opacity .64 when inactive) |
| Tab body | 16/19.2 | 0 | cream at opacity .8 |
| Number chip | Geist Mono 700, 12/18.2 | 0 | #1E0F00 on #FFAA00 (active); cream on #1E0F00 (inactive) |

Mobile: hero H1 stays 48/48 at 390 (/tares, /rius), but /rius/pricing H1 drops to 32/32. Section title stays 32. Rius H2 large drops to 32/32 ls -1.28 ("Agents aren't one length").

### 1.4 New shared components (spec'd once, reused below)

**A. ProductHero** (used on /tares and /rius). Section `hero`: 1312x630 at x=64, y=72.
- Top bar 1312x38, bg deep #1D0E00, padding 16. A 58x12 pixel graphic sits at the right (x=1302, y=85). /rius uses the image `rBnv8VCnmqKbBweg6ki6cG0pAQ.svg`; /tares uses an inline data-URI SVG of the same size.
- Content row 1312x592, flex row:
  - Left 644x592: image `TBMiwA4xBut87o4aLpVaFd9bjq0.jpg` (object-fit cover; the same image on both pages). A 48x72 data-URI pixel-corner SVG sits at its top-left (x=64, y=110). Overlaid copy block `content-wr`: padding 64px 32px, gap 15px, vertically centred, x=96, width 580.
    - H1 (product hero H1).
    - Lead (product hero lead, opacity .64). The live element has opacity .64 on the wrapper.
    - Buttons row, 31px below the lead, gap 8px: `BigButton` (label + arrow cell) then `DarkButton` (no arrow). DarkButton measured: outer 177x52 bg #1E0F00 with 4px padding, inner bg panel #2D1804, padding 10px 24px, Geist Mono 500 14/24, ls -0.32, cream.
  - Right 668x592: image (cover) with 12px padding; per-page image.
- Mobile (390): bar 390x38; left becomes 390x565 image with the copy over it (padding 64px 32px, H1 still 48/48 in 326 width); right image 390x360 below. Total 963 (/rius) or 1040 (/tares).

**B. TitleRow** (section title band). 1312x160, padding 64px 24px, H2 "section title" 32/32 left-aligned at x=88. Mobile: 390x160, padding 64px 24px.

**C. ImageCard grid** (/tares "What teams build with it": 4 x 328; /rius "How it works": 3 x 437). Each card is 300 tall with a full-bleed bg image (cover), padding 24, flex column `justify-content: space-between`. Top: 64x64 icon (data-URI SVG). Bottom group: title (image-card title, can wrap to 2 lines at 280 width) with an 8px gap to the body (image-card body, opacity .64; the wrapper is opacity .64). Cards sit flush with 1px line separators. Mobile: stacked, each 390x300. No hover change (measured).

**D. Tabs accordion** (/tares only; see §2.5).

**E. Text-roll button** (pricing table CTAs, blog "read article"). Outer frame height 52 with padding 4. The label is rendered twice, the second copy 30px below the first, clipped by `overflow:hidden`. On hover both copies translate up about 30-31px, settling in about 220ms with a 1px overshoot (spring). Measured y offsets: 0ms 0, 60ms -9, 112ms -22, 164ms -28, 216ms -31, 322ms -30. Use `transition: transform .25s cubic-bezier(.3,1.4,.5,1)` or a spring.

**F. Blog card** (/rius "Blog"). See §3.11.

**G. Plan card** (/rius "Rius Pricing"). See §3.9.

### 1.5 Motion on every product page (measured)

1. **Blur-in text appear on mount.** The SSR HTML ships split text with `display:inline-block; opacity:0.001; filter:blur(10px); transform:translateY(10px)` per span. Headings split per word; paragraphs split per character. After hydration each span animates to opacity 1, blur 0, translateY 0.
   - Sampled on /rius with rAF: word 1 starts about 1.37s after navigation start (on hydration) and reaches 1 at about 1.95s, so **duration is about 0.6s**. The curve is S-shaped: about 0.05 at 0.08s, 0.24 at 0.25s, 0.51 at 0.38s, 0.77 at 0.48s, 1 at 0.58s. Use `cubic-bezier(0.44,0,0.56,1)` (Framer "ease").
   - **Stagger** is about 0.05s per word in headings. Character spans within a paragraph start within about 30ms of each other, so a paragraph effectively fades as one block. The paragraph starts about 0.07s after the H1's first word.
   - Trigger: mount, not viewport. Split spans far below the fold were already at opacity 1 when scrolled to, with no scroll-triggered replay.
   - Which blocks use it (from SSR):
     - /tares: hero H1 (8 words), hero lead (190 chars), the 4 "What teams build" card bodies, "What is in Tares" H2 (4 words) and its lead.
     - /rius: hero H1 (7 words), hero lead, every cell of the "Agents aren't one length" table, and the 3 "How it works" bodies.
     - /rius/pricing: only the add-on card descriptions.
   - Replicate with an IntersectionObserver-free mount effect, e.g. CSS `@keyframes` with `animation-delay: calc(var(--i) * 50ms)`. Home's `reveal-word` class can be reused if it matches these values.
2. **BigButton hover** (measured on the /tares hero): the arrow and arrow-clone (stacked 30px apart) translate up 30px. Sampled: 0ms 0, 55ms -1, 108ms -9, 160ms -21, 212ms -26, 265ms -29, 319ms -30. That is about 0.3s ease-in-out with no overshoot. The label does not move. This is the existing `arrow-track` behaviour in `BigButton`.
3. **DarkButton, nav cells, ImageCards, `what-you-get` cards, cta-xs banner:** no measurable hover change (computed styles identical before and after hover).
4. **FAQ rows** (`Faq`): clicking a closed row expands it with a height tween of about 0.25s (sampled heights 40 -> 61 -> 94 -> 106 at ~60ms steps). **Rows are independent**: opening one does not close the others. That matches the current `Faq.jsx` per-row state. The open toggle is amber with a minus icon; closed rows show a panel-colour 40x40 square with a chevron.
5. Lenis smooth scroll (home §11) is loaded on every product page (`<html class="lenis">`, same unpkg script).
6. No CSS keyframe animations and no transitions on static elements (`document.getAnimations()` empty, all `transition: all 0s`). Exception: the Lottie canvas on /rius (§3.5).

---------------------------------------------------------------------------------------------------

## 2. /tares

Title "GlassFlow Tares | The open-source data plane for AI agents". Meta description: "Open source and self-hosted. Tares correlates every source you run into one timeline per entity and serves it to your agents over MCP, so they read state in one call instead of ten." og:image `https://framerusercontent.com/assets/alqOg336j7veNdgfpbVpzbrQR4.jpg`. Height 4918 (desktop) / 7918 (390).

Order (desktop y): nav 0 | divider 40-72 | §2.1 hero 72-702 | spacer | §2.2 TitleRow + cards 769-1229 | spacer | §2.3 "What is in Tares" 1296-1882 | spacer | §2.4 "From event to finding" band 1949-2160 + §2.5 timeline 2160-2777 | spacer | §2.6 "Run it in two commands" 2845-3311 | spacer | §2.7 FAQ 3378-3826 | spacer | §2.8 closing CTA 3892-4256 | spacer | CTA band 4323 + footer.

### 2.1 Hero: ProductHero (§1.4A)
- H1: "Tares is open-source platform for always-on AI agents" (2 lines, 96 tall).
- Lead: "Chat agents wait for a prompt. Tares agents wait for an event: every event from you systems lands on the timeline per thing, a trigger wakes an agent the moment it matters, and the finding it writes back is there for the next reader." (Live typo "you systems" is kept as-is; 4 lines, 118 tall.)
- Buttons: `BigButton` label **"sart on the cloud"** (live typo; 245x52) -> https://console.tares-glassflow.com/ ; `DarkButton` "run it yourself" -> https://docs.glassflow.ai/tares/quickstart.
- Right image: `gHnD0OdArW5qQdvx69aQhJaArJk.jpg`.

### 2.2 "What teams build with it": TitleRow + ImageCard grid (4 cols x 328, y=929, 300 tall)
| # | title | body |
|---|---|---|
| 1 | An AI SRE | An alert fires; the agent reads the service's whole timeline and writes the diagnosis before anyone opens a dashboard. |
| 2 | A context repo that stays current | Commits land; when a change matters to the team, the agent opens a pull request against the shared context repository. |
| 3 | A triage agent for anything that runs | Failed jobs, sandbox runs, voice calls: each gets a timeline, a trigger on failure, and a finding that says what broke. |
| 4 | A better read path for the agents you have | Claude Code, Cursor, or your own loop asks one question and gets the correlated history of an entity instead of ten tool calls. |

Titles are bottom-aligned (1-line titles sit at y=1112, 2-line at y=1093). Mobile: 4 stacked cards 390x300.

### 2.3 "What is in Tares": tabs accordion section (1312x586)
- Top bar 1312x38, bg deep, padding 16, with the dots and the right-hand 58x12 graphic (same as the hero bar).
- Body `main-wr` 1312x548, bg **#1E0F00**, 2 columns of 656:
  - Left `content-wr`: padding 64px 32px, gap 15px, vertically centred. H2 "What is in Tares" (40/40, ls -1.6). Lead "Everything here is a page in the console, editable there." (21/29.4, ls -0.84, op .64). Below it the accordion (592 wide, gap 4px between rows).
  - Right: image 656x548 (cover, 12px padding wrapper). It swaps with the active tab.
- **Accordion rows:**
  - Active: bg panel #2D1804, padding 8px 16px, gap 12px, flex row, height 96 (115 for tab 02, whose body wraps to 3 lines). Contents: number chip 24x24 bg #FFAA00, padding 6, "01" Geist Mono 700 12/18.2 #1E0F00; then a column with the title (Geist Mono 700 14/18.2 cream) and body (Inter Display 16/19.2 cream op .8) 4px below.
  - Inactive: 40 tall, transparent, padding 8px 16px; chip bg #1E0F00 with cream number; title opacity .64; body hidden.
- **Interaction (measured):** click any row to activate it. The previously active row collapses while the clicked one expands, a height tween of about 0.45s (e.g. 96,40 -> 46,89 at 150ms -> 40,96 at 490ms). Exactly one row is open; clicking the active row does nothing. The right image swaps **instantly** at click time (no crossfade; opacity stays 1). No auto-advance (unchanged after 7s idle). Cursor pointer.
- Tab content (live copy; tabs 03 and 04 reuse tab 01's body text on the live site, kept verbatim):
  | # | title | body | image |
  |---|---|---|---|
  | 01 (default) | Connect anything that emits events. | Prometheus, logs, alert webhooks, GitHub, Postgres, Vercel, OpenTelemetry, or any webhook. Every event is keyed to the thing it is about, from a connector card or a pasted snippet of YAML connectors. | CuYhVCgpunml0AFh27rgIeYdlOI.png |
  | 02 | One timeline per entity, with triggers watching it. | Sources that share a key merge into one time-ordered timeline per service, repo or customer; the agent view shows the exact text an agent receives. Triggers watch the live view and fire on a condition, once, with a cooldown. triggers | H6fLrCMmzzk6wbPFSMlmHRAjMw.jpg |
  | 03 | Agents that run inside Tares | (same as 01) | WylXMWoX6XhNVJMpsK1mCHmgP20.jpg |
  | 04 | Everything is available over MCP | (same as 01) | qO6OS4QHZfzEhywgrLBqkKq8dDg.jpg |
- Mobile: column; bar, then text (padding 32px, H2 40/40, lead 21/29.4 in 326 width, accordion 326 wide; the active row is 172 tall), then image 390x359.

### 2.4 "From event to finding" heading band
1312x211 at y=1949. The bg image is the home quickstart image `ARgMqlYnmiFWpdywy7EoO9FO9vI.png` (cover), padding 64px 24px. Centred block 440 wide, gap 19px: H2 "From event to finding" (Inter Display 40/40, centred, cream) and sub "One real incident on one service's timeline, minute by minute" (16/24, ls -0.18, op .8, centred). This reuses the `Quickstart` header styling without cards. Mobile: 390x275, H2 wraps to 2 lines.

### 2.5 Incident timeline (new component, 1312x617, no spacer between it and §2.4)
- Wrapper padding 0 128px, so the column is 1056 wide at x=192. Six `snippet` rows stacked with no gap. Each row is flex: a 24px marker column (24x24 inline SVG `icon-box` at top-left) and a 1032-wide `code-snippet`.
- `code-snippet` = header bar bg panel #2D1804 (first row: padding 16, 38 tall; others: padding 8px 16px, 56 tall), flex row gap 12, followed by an optional log line.
  - Time chip: bg line #5F3E1F, padding 2px 6px, 48x22, Geist Mono 700 12/18.2 cream (e.g. "02:03").
  - Title: Geist Mono 700 14/18.2 cream. Optional sub-line: Inter Display 14/18.2 cream op .8.
  - Log line box: bg #1E0F00, padding 17px 24px, 52 tall. ">" (Geist Mono 700 14 cream) then 21px gap, then text Geist Mono 400 12/18.2 cream.
- Rows (verbatim live copy, including typos and repeated titles):
  1. 02:03 · "An event lands" · log `logs POST /charge 600 “upstream retry limit” x214`
  2. 02:11 · "Your alerting decides" / "Prometheus keeps owning the thresholds. Tares only reacts to what fired." · log `alerts HighCheckoutLatency firing saverity=page`
  3. 02:11 · "An event lands" / "It saw the alert event land on the view it watches. A cooldown holds it there" · log `logs POST /charge 600 “upstream retry limit” x214`
  4. 02:11 · "An event lands" / "One read: the last 90 seconds of metrics, logs, deploys and alerts for this service. Not the alert one." · log `read(api-server) → 47 events - 4 sources`
  5. 02:14 · "An event lands" / "Written back onto the timeline next to the evidence, and delivered to #incidents." · highlighted log box bg `rgba(255,172,0,0.05)`, 89 tall, text #FFAA00 Geist Mono 12/18.2, 3 lines: "Uncapped retries from the 01:50 deploy (PR #482). / Error rate and p99 follow the rollout window exactly. / Next: cap retries at 3, or roll back."
  6. Later · "An event lands" / "The finding is an event too. The next investigation, humar or agent, opens with the last one’s conclusion." · no log line.
- Mobile: column inset x=24..390 (366 wide); bars wrap to 75-93 tall.

### 2.6 "Run it in two commands": quickstart band (1312x466)
- Same bg image as §2.4, padding 64px 24px, gap 32. Header 440 wide, centred: H2 "Run it in two commands" 40/40; sub (16/24 op .8, 2 lines): "The quickstart takes it from here. Rather not host it? / Use the cloud."
- Two terminal cards, each 400 wide, flush (x=320..720 and 720..1120, total 800, centred):
  - Title bar 400x42 bg bar #2D1803 with three small squares at the left (the Rectangle 34628278/79/80 dots) and no label.
  - Body bg deep #1D0E00, padding 16, rows gap 16. Comment rows: "#" Geist Mono 700 14 cream + text Geist Mono 12/18.2 op .8. Command rows: ">" + text Geist Mono 12/18.2 cream.
  - Card 1: `# daemon + console → http://127.0.0.1:8787` / `> uv tool install tares` / `> tares up`
  - Card 2: `# agent endpoint → http://localhost:8788/mcp` (wraps after "→") / `> tares mcp` / `> claude mcp add --transport http \` + `tares http://localhost:8788/mcp` (continuation indented to x=823).
- Mobile: the cards stay side by side at 171 wide each (x=24 and 195), text wraps; band 390x579.

### 2.7 FAQ: reuse `Faq`, with differences
- Heading "Common questions" (not "Frequently Asked Questions").
- Column is **inset**: wrapper padding 0 128px, so the heading panel and rows are 1056 wide at x=192 (home is 1312 wide). The corner decorations and 24px pixel squares are at the inset edges (x=1215..1263).
- 3 rows, row 1 open by default:
  - Q "Does this replace my warehouse or my pipelines?" A: "No. Your pipelines keep landing data in Postgres or Redshift for BI. Tares sits beside them as the read path for agents, and treats the warehouse itself as one more source. Analysts keep SQL; agents get MCP."
  - Q "Is this only for logs and metrics?" A: "No. Observability was one vertical; the plane is general. Anything that can be pulled, received, or extracted becomes a source: database rows, API responses, documents, files, webhooks. If it has an entity and a timestamp, it correlates."
  - Q "Do my agents query my sources directly?" A: "Never. Tares ingests each source once into its own store, and agents read from Tares. Your production database and your rate-limited APIs see one well-behaved reader instead of a fleet of agents."
- Mobile: full-bleed 390, the inset is removed.

Make `Faq` take props: `heading`, `items`, `inset` (128px side padding at lg).

### 2.8 Closing CTA band (new: "ImageCTA", reused on /rius/pricing)
- 1312x364, bg image `h0ej46NDlXvCksM6LvlI4w4Ss.jpg` (cover), padding 64px 128px. Copy column 640 wide at x=192, gap 64.
- H2 "Connect any source. Query it from an agent minutes later." (40/40, 420 wide, 3 lines).
- Buttons, gap 8: `BigButton` "start on the cloud" (201x52) -> https://console.tares-glassflow.com/ ; `DarkButton` "star on github" (169x52) -> https://github.com/glassflow/tares.
- Mobile: 390x440, padding 64px 32px, H2 42/42 (4 lines); buttons stack vertically with an 8px gap.

---------------------------------------------------------------------------------------------------

## 3. /rius

Title "GlassFlow Rius | AI Agent Observability in Production". Meta description: "Catch and debug AI agent failures in production. Real-time traces, alerts, and monitoring for long-running AI agents in production." og:image `https://framerusercontent.com/assets/eiEYcN5Y14sh6UGCu4l4BOWru8.jpg`. Height 8617 / 15272 (390).

Order (desktop y): divider 40-72 | §3.1 hero 72-702 | §3.2 benefits strip 702-774 | spacer | §3.3 social proof + testimonial 841-1358 | spacer | §3.4 retrospective 1425-1955 | spacer | §3.5 "Agents aren't one length" 2022-3028 | spacer | §3.6 "How it works" 3095-3555 | spacer | §3.7 "What you get" 3622-4741 | spacer | §3.8 quickstart 4808-5475 | spacer | §3.9 "Rius Pricing" 5542-6254 + §3.10 cta-xs 6286-6390 | spacer | §3.11 Blog 6457-7309 | spacer | §3.12 FAQ 7376-7955 | spacer | CTA band 8023 + footer.

### 3.1 Hero: ProductHero (§1.4A)
- Bar graphic: `rBnv8VCnmqKbBweg6ki6cG0pAQ.svg` (121x29, displayed 58x12).
- H1 "Catch agent failures before your customers do" (2 lines).
- Lead: "GlassFlow Rius is the observability layer for AI agents in production. Real-time visibility while your agents are running, not a post-mortem after they crash." (3 lines).
- Buttons, gap 8: `BigButton` "Try 1 month free" (237x52) -> https://console.rius-glassflow.com/signup?utm_source=glassflow&utm_medium=pricing_page&utm_campaign=signup&utm_content=core ; `DarkButton` "talk to the founders" (218x52) -> https://cal.com/armend-glassflow/30min?utm_source=glassflow&utm_medium=rius_page&utm_campaign=signup
- Right image `WrecUgpaG7OyoHyzr12sCjsrOLg.jpg`.

### 3.2 Benefits strip (new). Directly under the hero, no spacer.
1312x72, bg #1E0F00, flex row centred. 4 items, each a 24x24 data-URI pixel icon + 8px gap + label (Geist Mono 700 14/18.2 cream): "Long-running agents" (icon x=132), "Query via MCP" (485), "Privacy Controls" (801), "Collab with your team" (1108). Items are spread evenly. Mobile: 390x288, stacked, 72 per row.

### 3.3 Social proof logos + testimonial
- Logos block 1312x175: two halves 656 wide. Each half has a header 656x50 (bg panel, padding 16px 32px, "Used by:" / "Backed by CEOs of:" Geist Mono 700 14/18.2 cream) and a row of 3 logo cells 219x125 (padding 24, centred).
  - Logos are cream data-URI SVGs: Restack 66x28, nubrain 93x21, Sentri 120x16 | Entire 100x25, Weaviate 122x18, sference 92x18.
  - Mobile: each half stacks; logos form a 3 x 130 grid, 125 tall.
- Testimonial: reuse `Testimonial`, with these differences:
  - Upper area 1312x242 (not 386), padding 40 (not 64), gap 32. Same bg image `7xhczrFmZXWm4XtTt3xdK5HjPSc.jpg`. Quote icon 34x34 at x=104.
  - Quote (32/32, 800 wide): "\"Rius found agent failures we didn't know existed. Our time to debug went from days to minutes and now we catch issues before they ever reach a customer.\"" (straight double quotes).
  - Attribution row 1312x100: two halves, each padding 40 with content **centred**.
    - Left: avatar 48x48 `AvNQPA2KLw0PJ8qQYPYqet4URQ.png`, name "Andres Almansa" (white Geist Mono 700 16/18.2), role "CEO of Restack" (cream, opacity .8).
    - Right: company logo 48x48 `oIbDPvgphfWTFE1bRAFoKFR51po.jpeg` only (no company text).
  - Mobile: quote 21/21 in 310 width; upper image 390x251; section 351 tall.

### 3.4 "Retrospective" split (new, 1312x530)
- Left 656x530: image `cz4OCmAigDhK3lTGZTCj6JubaE0.jpg` (cover, 12px padding wrapper). Centred over it is a **Lottie canvas** 400x405 at x=192, y=1488 (i.e. inset 128px from the left and 63px from the top of the panel).
  - The animation is a "session - agent_ops_007" window: a dark title bar, 3 white stat tiles ("72h uptime", "14,456 total events", "3 sub-agents") and a 17-column amber (#FFAC00) pixel-block bar chart on a cream grid. The bars rise and fall continuously.
  - Source: `https://framerusercontent.com/assets/vUQ6vAk7qnGO0kq09zG3qaBBo.json` (Lottie 5.7.5, 437.59x416.99, 60fps, frames 0-918 = 15.3s). It is rendered by `@lottiefiles/dotlottie-web@0.65.0` (WASM from cdn.jsdelivr.net), autoplay, loop, canvas transparent.
  - Build: `lottie-web` or `@lottiefiles/dotlottie-react` with that JSON (download into /public), autoplay + loop, sized 400x405 (mobile 275x278 at x=58).
- Right `content-wr` 656 wide, padding 64px 32px, gap 15:
  - H2 "Retrospective observability is fine for two-second runs. What if yours take six hours?" (40/48, ls -1.6, 3 lines).
  - Body (18/25.2, ls -0.72, op .64) in 4 short paragraphs. Outline: (1) most tools give a post-mortem after the trace closes; (2) fine for 2-second runs, useless for six-hour ones; (3) example: an agent diverges at step 7, burns tokens for 180 more steps and returns a wrong answer at hour six; (4) "The failure took seconds. Finding it took a day."
- Mobile: image 390x372 (canvas inside), then text (H2 40/48 in 326 width).

### 3.5 "Agents aren't one length" (new; 1312x1006)
- Bar 38 (deep).
- Heading row `row-xl` 1312x490, bg #1E0F00:
  - Left 525 wide: image `CF2a8yg6rUJQ9kRH8Qk75fHGhhk.jpg` with H2 overlaid, centred: "Agents aren't / one length" (40/40, ls -1.6, centred, 2 lines).
  - Right 787x490: image `kwNUTQWIQPqbu8DejioFKvDd4k.jpg` (12px padding wrapper).
- Comparison table `rows`: 5 rows, CSS grid `437.33px 437.33px 437.34px`, bg #1E0F00, 1px line borders. All cells padding 20.
  - Header row (96 tall): col 1 empty. Cols 2-3 are Inter Display 500 20/28, ls -0.8, amber #FFAC00, centred: "How long they run for", "What they typically do".
  - Body rows: col 1 = 32x32 pixel icon + 20px gap + label (Geist Mono 500 16/24 cream). Cols 2-3 = Inter Display 16/22.4, ls -0.64, cream op .8. The duration word in col 2 is bold 700.
    | label | how long (bold word) | what they do | row h |
    |---|---|---|---|
    | Short: | Typically running for **seconds** | Chat turns, classifiers, RAG lookups. | 72 |
    | Mid: | Usually run for **minutes** | A content agent drafting a post. An incident summarizer. A nightly sync. | 107 |
    | Long: | Agents that can run for **hours** | Hour-long calls transcribed and reasoned over. Thousand-page document sets. Deep research that plans, retrieves, verifies,. Optimization loops. | 107 |
    | Always-on: | Agents that run **indefinitely** / or are always-on | Infra monitors. Ops agents. Live queues that never close. | 96 |
- Mobile: heading row stacks (left image 390x144 with H2 32/32, right image 390x347). Each table row becomes one column of cells, each cell 350 wide with padding 20; the section is 1690 tall.

### 3.6 "How it works": TitleRow + ImageCard grid (3 cols x 437, 300 tall)
| title | body |
|---|---|
| Instrument | two OpenTelemetry lines. / Every step streams in as it happens. |
| Watch | live traces, open-trace metrics, heartbeat detection, alerts mid-run. |
| Act | query from your coding agent over MCP, find the first divergence, ship the fix. |

### 3.7 "What you get" (new: feature card grid)
- Title row 1312x178, padding 64px 24px: H2 "What you get" (32/32, 656 wide, left) and on the right, a description 600 wide (18/25.2, ls -0.72, op .64): "Alongside the standard features, such as a dashboard, alerts, traces and span view, you will get unique functionalities."
- Grid 2 cols of 652, gap 8 (row gap 8), 2 rows. Each card is 652x466, bg #1E0F00, column:
  - Bar 652x38 (bg deep, padding 16) with a centred title (Geist Mono 700 14/18.2 **amber**).
  - Image 652x300 (cover). The top two images are wrapped in `<a>` with no visible hover.
  - Text area 652x76, padding 20px 16px, centred text Geist Mono 700 14/18.2 cream (2 lines, about 420 wide).
  - CTA row 652x52: outer bg deep, padding 4; inner bg panel #2D1804, padding 10px 12px. Centred label "read more" (Geist Mono 500 14/24, ls -0.32, cream) -> https://docs.glassflow.ai/rius/quickstart (all 4).
  | title | text | image |
  |---|---|---|
  | Long-running agents | One session across restarts and sub-agents, not thousands of disconnected requests. | ypPPtAmKs7GN5EUUsnZFHaup5fU.png |
  | Query via MCP | Your coding agent queries traces over MCP / and ships the fix. No dashboard. | C30wyrelJdoqD8SJLxqY6WaUMQ.png |
  | Privacy Controls | Strip or mask sensitive content in your own process, so PII never reaches our backend. | RO233ORpmhdwm5ELT37gnlWU3Y.png |
  | Collab with your team | Share a window of traces with anyone. They see metadata and rollups. No login or seat required | VE4uzuRtCj4sgehabFjku1AR1k.png |
- Mobile: single column 390 wide, cards stacked with an 8px gap; the title row stacks (H2, then description).

### 3.8 Quickstart: reuse `Quickstart`, with differences
- Band 1312x667 (not 743), same bg image.
- H2 "From setup to first trace in minutes." with **"in minutes."** in amber (home highlights "first result").
- Sub lines (16/24 op .8): "Follow the quickstart: add the SDK, send your first trace." / "No infra to run, fully scalable and best value for money."
- **One card only** (490 wide, centred at x=475): the rius card.
  - Title "glassflow-" in cream64 + "rius" in amber.
  - Same pitch box and 3 bullets as home.
  - Footer has only the "open the rius quickstart" button (490x52, outer deep padding 4, inner panel) -> https://docs.glassflow.ai/rius/quickstart. There is **no** amber "Start with rius" button.
- Make `Quickstart` take `heading`, `sub`, `cards` and a per-card `start` that may be absent.

### 3.9 "Rius Pricing": TitleRow + plan cards (new: PlanCard)
- Grid 4 x 328, flush, 552 tall. Each card bg #1E0F00:
  - Bar 328x38 (deep).
  - Content padding 20px 16px, gap 16:
    - 40x40 plan icon (pixel art; inline SVG).
    - Name: Inter Display 24/24 cream.
    - Price: 32/32 + "/mo" in Geist Mono 400 16/24 cream, baseline-aligned.
    - Description: Inter Display 14/19.6 cream.
    - Core only: promo pill 296x32, bg #5B3200, padding 4px 8px, "try 1 month for free" (Geist Mono 700 14/24, ls -0.32, white, lowercase).
  - CTA row 328x52: Core/Pro/Enterprise use outer deep with an inner panel; Growth uses amber outer and inner with #1E0F00 text. Label Geist Mono 500 14/24 ls -0.32: "get started" (x3) / "get in touch" (Enterprise). All -> https://docs.glassflow.ai/rius/quickstart (live).
  - Three spec rows, each 64 tall with padding 20: label Geist Mono 500 14/19.6 ls -0.32 cream lowercase, and a value pill (bg page #492400, padding 0 4px, Geist Mono 700 14/24 white lowercase) right-aligned.
  | plan | price | description | spans incl. | overage per 1m spans | query retention |
  |---|---|---|---|---|---|
  | Core | $19 | Observe your first agents and send traces in minutes. | 500k | $14 | 60d |
  | Growth | $79 | Add more agents and bring the whole team onto one view. | 2.5m | $12 | 180d |
  | Pro | $199 | Scale to production with the retention and audit trail your SLAs demand. | 10m | $10 | 3y |
  | Enterprise | $1,999 | Make agent observability a governed part of your stack. | 25m | $8 | custom |
  (Core's label reads "spans incl" without the trailing dot on live.)
- Mobile: cards stacked full width (390), each about 552 tall.

### 3.10 cta-xs banner (new; below the pricing grid, no spacer, with a 32px gap)
A whole-banner link -> `/rius/pricing`. Wrapper padding 0 128px, banner 1056x104 at x=192. Bg image `h5Uv5LSjJ15Dll5BV8VwMsW3oo.jpg` (cover), padding 32, gap 24, flex row. Contents: a 40x40 data-URI icon, then the text "Explore the Rius plans" (Inter Display 24/24 cream). No hover change. Mobile: 390x200, text 32/32 on 2 lines ("Explore the" / "Rius plans").

### 3.11 Blog: TitleRow "Blog" + 2 blog cards (new: BlogCard)
- Listing: flex row, gap 8, two cards 652x692. Each card is an `<a>` with bg panel #2D1804, column:
  - Bar 652x38 (deep, padding 16) holding three 8x8-ish squares at x=80/90/100 (bg page #492400 at rest).
  - Image 652x373 (cover, overflow hidden).
  - Description padding 24, gap 16:
    - Tag pill: bg amber, padding 6px 10px, Geist Mono 500 12/12 uppercase, colour page #492400.
    - Title: Geist Mono 500 16/20.8, ls -0.64, #E0E0E0, single line, clipped.
    - Description: Inter Display 16/22, ls -0.32, rgba(230,230,230,.8), 2 lines clipped.
  - Author bar 652x40, bg #1E0F00, two halves centred: "Written by" (Geist Mono 14/21 muted) | author name (Inter Display 14/21 muted).
  - CTA 652x52: outer #1E0F00, padding 4; inner bg **cream #F1EFDF**, padding 10px 24px. Label "read article" Geist Mono 500 14/24, colour #1E0F00, as a text-roll button (§1.4E).
- Cards (live CMS, latest two):
  1. tag "AGENT INFRASTRUCTURE", title "Can a decision model replace an LLM? Tune it on your own data first", desc "We ran Cloudflare's Clef-flash next to Claude Haiku for 6 days on production logs. As a filter, it cut LLM calls ~80%. Test it on your own data with Tares.", author Ashish Bagri, image `mFirefQhQKw3QXF3cpXhF7l4sLw.png`, href `/blog/decision-model-vs-llm`.
  2. tag "AGENT OBSERVABILITY", title "How to detect silent AI agent failures in production", desc "Fifteen signals and a five-stage framework for detecting silent AI agent failures while runs are still running", author Armend Avdijaj, image `DK46aveL39yduU5qMbUqGPAWoI.png`, href `/blog/how-to-detect-ai-agent-failures-in-production`.
- **Hover (measured, about 0.25-0.3s ease-out):**
  - Card bg changes panel #2D1804 -> #1E0F00.
  - The three bar squares change #492400 -> #FE5F57 / #FEBC2E / #27C840 (macOS traffic lights). Midpoint at 82ms is about 80% of the way, so ease-out.
  - The image scales to 1.1 (`transform: scale(1.1)`, centre origin, clipped).
- Mobile: column, gap 24, cards 390x543, image 390x223.

### 3.12 FAQ: reuse `Faq`, inset 128 (as §2.7), heading "Common questions", 4 rows, row 1 open
- Q "Why do I need an observability layer for my agents?" Outline of A: agents fail differently from APIs; a run can spend 40 minutes and $12 and be wrong, or crash at step 190 with spans lost in memory.
- Q "Why should I not use an open source solution?" Outline: you can, but total cost matters; for a 3-15 person startup, maintaining OSS observability ($400-$800/mo) costs shipping time. It ends with "Read more about the effort to self-host solutions here." (the "here" link target was not captured; the probe recorded text only).
- Q "Why should I not vibe code a solution?" Outline: a Postgres table plus a generated dashboard breaks on crashes, scale or audit needs; hidden cost 40-80h to build and 3-5h/mo to maintain (~$400-$500/mo); "The  Rius Core plan gives you everything..." (double space on live).
- Q "What happens when an agent crashes mid-run?" A: "Nothing is lost. Every span streams in real time, not on a timer flush at trace close. A run that dies at hour six is still fully queryable. You simply reconstruct exactly what it did before it went down, instead of finding a trace that never closed."

---------------------------------------------------------------------------------------------------

## 4. /rius/pricing (also the target of the /enterprise redirect)

Title "GlassFlow Rius Pricing | Agent Observability from $0". Meta description: "GlassFlow Rius pricing: start free with 100k traces a month and scale to 20m. Transparent per-trace pricing, no seat fees. Compare all four plans." og:image `https://framerusercontent.com/assets/h3ZXI7Ec2JQjiJL74yzMBFnsE.jpg`. Height 5377 / 7571.

Order: divider 40-72 | §4.1 hero 72-561 | spacer | §4.2 comparison table 628-1812 | spacer | §4.3 "In every plan" 1879-2205 | spacer | §4.4 add-ons 2272-3000 | spacer | §4.5 calculator banner 3072-3522 | spacer | §4.6 FAQ 3589-4220 | spacer | §4.7 closing CTA 4287-4715 | spacer | CTA band 4782 + footer.

### 4.1 Hero
- `TitleBar` label "products" (1312x50, bar bg, home §4 bar).
- Grid `656px 656px`, 439 tall:
  - Left: bg panel, padding 64, gap 64, everything **centre-aligned**.
    - H1 "Easy to start. / Scales with usage." (Inter Display 48/48, ls 0, centred).
    - Sub (21/31.5, ls -0.18, op .8): "Four plans, priced per trace, not per seat. / Start free, pay for what you actually send."
    - `BigButton` "start free" (189x52) -> https://console.rius-glassflow.com/signup?utm_source=framer.com&utm_medium=referral&utm_campaign=hp_start_cta
    - Note (16/24, op .8): "No credit card required on Core".
  - Right: image `JNirgiJudYykrpH4soF4CcOqbI.jpg` 656x439 (cover).
- Mobile: H1 32/32 (2 lines centred, 326 wide), sub 21/31.5, image 390x400 below.

### 4.2 Plan comparison table (new: PricingTable), 1312x1184 at y=628
- Columns: label column 200 wide (x=64..264, label text inset 12px, 176 wide) + 4 plan columns of 278 (x=264, 542, 820, 1098).
- The **Growth column is highlighted** with bg #1E0F00 for its whole height. The other columns are transparent over page #492400. All cells have 1px line borders.
- **Header cells** (`details`) 278x163, padding 20, gap 16:
  - 40x40 icon: a pixel-art SVG with a 1px #5F3E1F square outline, served as an `<img>` data-URI. Core = person, Growth = trend arrow, Pro = book, Enterprise = building.
  - Name: 16/19.2 cream.
  - Price: "$" + amount in Inter Display 32/48 ls -0.18, then "/mo" 16/24.
  - Prices: Core $19, Growth $79, Pro $199, Enterprise $1999 (no comma here).
- **CTA row** 278x52 per column: outer padding 4 with an inner 270x44 block (padding 10px 24px). Core/Pro/Enterprise use #1E0F00 inner with cream text; Growth uses amber outer and inner with #1E0F00 text. Labels are text-roll buttons (§1.4E): "get started" x3, "contact us".
  - Core -> https://console.rius-glassflow.com/signup?utm_source=glassflow&utm_medium=pricing_page&utm_campaign=signup&utm_content=core
  - Growth -> same URL with `utm_content=growth`
  - Pro -> same URL with `utm_content=pro`
  - Enterprise -> https://cal.com/armend-glassflow/30min?utm_source=glassflow&utm_medium=pricing_page&utm_campaign=signup&utm_content=enterprise
- **Rows** (48 tall with text, 42 with icons; padding 12):
  - Labels: Geist Mono 700 14/16.8, ls -0.18, cream.
  - Values: Inter Display 500 16/24, ls -0.18, cream, centred.
  - "✓" = 18x18 check SVG (viewBox 24); blank = empty cell.
  | row | Core | Growth | Pro | Enterprise |
  |---|---|---|---|---|
  | Spans incl. | 500k | 2.5M | 10M | 25M |
  | Overage per 1M spans | $14 | $12 | $10 | $4 |
  | Query retention | 60d | 180d | 3y | Custom |
  | Audit logs | ✓ | ✓ | 1y | Custom |
  | Ingestion throughput | 5k/min | 10k/min | 20k/min | Custom |
  | Heartbeat | ✓ | ✓ | ✓ | ✓ |
  | RCAs / month | ✓ | ✓ | ✓ | ✓ |
  | Query MCP | ✓ | ✓ | ✓ | ✓ |
  | Alerts | 10 | 25 | 100 | 500 |
  | Workspaces | 2 | 5 | Unlimited | Unlimited |
  | Users | 2 | Unlimited | Unlimited | Unlimited |
  | Data region | EU/US | EU/US | EU/US | Select your own |
  | **SUPPORT** (full-width band) | | | | |
  | SLA | Add-on | Add-on | Add-on | ✓ |
  | Onboarding | ✓ | ✓ | ✓ | ✓ |
  | Support response | 48h/Chat | 48h/Chat | 24h/Chat | Custom |
  | Dedicated Slack | Add-on | Add-on | ✓ | ✓ |
  | **BILLING** (band) | | | | |
  | Credit Card | ✓ | ✓ | ✓ | ✓ |
  | Pay via invoice (30d net) | Add-on | Add-on | Add-on | ✓ (58 tall, label wraps) |
  | Contract duration | Monthly | Monthly | Monthly | Yearly |

  (Live values are kept verbatim. They disagree with /rius §3.9, e.g. Enterprise overage $4 vs $8.)
- Group band rows ("SUPPORT", "BILLING"): 1312x38, bg #54310F, padding 12px 20px, Geist Mono 700 14/14 cream.
- Mobile: the table keeps its desktop column widths (label column 160, plan columns 140) inside a horizontally scrollable container (`main-wr` has `overflow:auto`). The section is 1936 tall at 390.

### 4.3 "In every plan" (new)
1312x326: header band 1312x38 (bg #54310F, Geist Mono 700 14/14 "In every plan"), then a 2-col grid (656 each) 288 tall, bg #1E0F00. Seven items, each a 24x24 icon + text (Geist Mono 700 14/18.2 cream), on a 72px row pitch (text x=120 / 776, rows at y=1944/2016/2088/2160):
- Left: "Real-time traces and spans", "Dashboards", "Agent workflow maps", "OpenTelemetry ingest in two lines"
- Right: "Alerts", "Cost and token tracking", "One continuous session across restarts and sub-agents"

Mobile: one column of 72-tall rows (the 6th is 84 tall), 516 total.

### 4.4 Add-ons (new)
- Bar 38 (deep).
- `row-xl` 1312x642, bg #1E0F00:
  - Left 394 wide: image `CF2a8yg6rUJQ9kRH8Qk75fHGhhk.jpg` (cover) with H2 "Add-ons" (40/40, ls -1.6) at the lower-left (x=96, y=2627).
  - Right 918 wide: `cards` grid of 4 cols (224.6 each), padding 4, gap 4. Row 1 is 315 tall, row 2 is 293.
- Card (column, centred):
  - Content padding 20/16: 40x40 icon, name (Inter Display 14/16.8), price "$" + amount 32/48 + "/mo" 16/24, description (14/19.6, ls -0.56, 143 wide).
  - CTA 225x52: outer deep, padding 4; inner `Overlay` bg panel, padding 10px 12px. "Add to your plan" Geist Mono 500 14/24 cream.
  | name | price | description | CTA href |
  |---|---|---|---|
  | Dedicated region | $199/mo | Your data in a specific regional cluster — Frankfurt, Virginia, London, Singapore | docs rius quickstart |
  | Dedicated slack | $49/mo | Direct channel with GlassFlow team | console signup (hp_start_cta URL) |
  | Pay by invoice | $49/mo | Net 30 invoicing instead of credit card | docs rius quickstart |
  | Extened retention (sic) | $49/mo | Add 1 year beyond your tier limit | docs rius quickstart |
  | Audit logs | $49/mo | Add 1 year beyond your tier limit | docs rius quickstart |
  | SLA guarantee | $299/mo | 99.9% uptime SLA with response commitments | docs rius quickstart |
  | Higher ingestion throughput | $49/mo | Increase to 20k/min | docs rius quickstart |
- Mobile: image 390x120 with H2 over it; the cards become a horizontally scrolling single row of 240-wide cards (`overflow:auto`, gap 4, padding 4).

### 4.5 Calculator banner (new)
- 1312x450 bg image `VKjI50ZtcspgwHCXdPDhyKc3A0.png` (cover). Centred copy 990 wide:
  - Heading "Think building your own observability is cheaper?" (Inter Display **500** 32/32 white, centred).
  - Sub (Inter Display **600** 24/36, ls -0.18, white, centred, 2 lines): "Most teams underestimate the real cost. / Plug in your trace volume and team, and find out in 30 seconds."
  - `BigButton` "Calculate my cost" (245x52).
- Both texts and the button link to `https://rius.glassflow.ai/calculator-building-your-own-agent-observability` (external subdomain on live). The same calculator exists on www at `/rius/calculator-building-your-own-agent-observability` (§6), so point the clone's internal link there.
- Mobile (live defect): the copy block stays 990 wide at x=-300 and is clipped, and the sub swaps to the hero text "Four plans, priced per trace, not per seat. Start free, pay for what you actually send.". Clone with the copy constrained to 326 wide instead.

### 4.6 FAQ: reuse `Faq`, inset 128, heading "Frequently Asked Questions", 6 rows, row 1 open
1. "What counts as a trace?" - "One agent run, regardless of how many steps, tool calls, or sub-agents it contains."
2. "What happens if I exceed my included traces?" - "You're billed per additional trace at your plan's overage rate: $7 on Core, $6 on Growth, $5 on Pro, and $4 on Enterprise. Nothing stops working. You will get notified by email once you reach 80% of your plan’s trace capacity so you can take any necessary action."
3. "Do you charge per seat?" - "No. Pricing is based on traces, not users. Invite your whole team on any plan."
4. "What's the difference between \"ingest only\" and \"both ways\"?" - "Ingest only sends traces into GlassFlow. Both ways also lets your coding agent query those traces over MCP. Ask what broke and ship the fix from your editor. Available on all plans."
5. "What happens to traces after my retention period?" - "On Core, traces stay queryable for six months, on Growth for 180 days, on Pro for 3 years while on Enterprise plans, retention is custom. You can purchase an extended retention period that adds 1 year beyond your tier limit as an add-on."
6. "Can I change plans anytime?" - "Yes, up or down. Changes take effect on your next billing cycle."

### 4.7 Closing CTA: ImageCTA (§2.8) variant
1312x428, same image `h0ej46NDlXvCksM6LvlI4w4Ss.jpg`.
- H2 "Two products. Two starting points." (40/40, 420 wide).
- Body (16/24, ls -0.18, op .8, 420 wide): "Tares is open source. Kick the tires, open an issue, and drop a star if it's useful. Rius, end to end. Guides for wiring up traces, MCP, and retention, from first span to production."
- Buttons: `BigButton` "start today" (145x52) -> console rius signup (`utm_medium=pricing_page`, `utm_content=core`); `DarkButton` "read the Rius guides" (218x52) -> https://docs.glassflow.ai/rius/guides.
- Mobile: 390x526, H2 42/42.

---------------------------------------------------------------------------------------------------

## 5. /rius/alternatives/arize and /rius/alternatives/langfuse (one template)

### 5.1 How the live page is built
- The page body between the nav and the CTA band is a **Framer Embed**: a single `<iframe srcdoc="...">` holding a self-contained HTML document.
  - The document has a `<main class="rcx">`, one `<style>` block, one small inline `<script>`, and a Framer resize `postMessage` script. Images are base64 data-URIs inside the srcdoc. No network images.
  - The Framer wrapper: flex column, padding 0 64px, gap 40, bg page.
- **Iframe geometry** (fixed widths, not fluid):
  - arize: 1200x8492 at x=120, y=40 (page H 9126).
  - langfuse: 1234x7627 at x=103, y=40 (page H 8261).
  - Mobile: 420 wide at x=-15 (overflows the 390 viewport by 15px each side, clipped). Heights 12868 / 11482.
- Inside the embed, every section is `.s` (padding 0 64px; 0 16px at <=809px) > `.w` (max-width 1312, 1px line left/right borders, padding 32px 0). So the visible content column at 1440 is 1072 wide (arize) / 1106 (langfuse), not 1312.
- **Build recommendation:** port the embed natively as one `AlternativePage` component.
  - Use the CSS in Appendix A verbatim (scoped under `.rcx`) and the JS behaviour in Appendix B.
  - Render it inside a centred container whose width matches the iframe: `max-width:1200px` (arize) / `1234px` (langfuse), `margin: 0 auto`.
  - Embed tokens differ slightly from the site: `--line:#553619` (not #5F3E1F), `--card:#1E0F00`, `--brown:#5B3200`. Fonts come from Google: "Inter Display" is not loaded inside the embed, so text actually renders in **Inter** (opsz 14..32) plus Geist Mono.
- Typography inside the embed:
  | role | value |
  |---|---|
  | `.h1` | 48/48, ls -1.92 |
  | `.h2` | 40/48, ls -1.6 |
  | `.h3` | 24/28, ls -0.96 |
  | `.lead` | 21/29.4, ls -0.84 |
  | `.big` | 32/36, ls -1 |
  | base | 16/22.4, ls -0.64 |
  | `.mt` | Geist Mono 700 14/18.2 |
  | `.ml` | Geist Mono 12/18.2 |
  | `.kick` | Geist Mono 500 12/12 uppercase, ls .04em, amber |
  Mobile (<=809): h1 34/36, h2 28/32, lead 18/25.2, big 24/28.
- Each `.p` panel starts with a 32px `.bar` (bg #1D0E00) holding 6x6 `#553619` dots.

### 5.2 Section outline (arize; langfuse differences in §5.3)
1. **Hero** (`.hero`, single column):
   - H1 "Rius is an Arize alternative built for companies shipping agents every day."
   - Lead (1 sentence on Phoenix self-hosting vs AX span limits vs Rius 500k spans for $19/mo).
   - Buttons (`.btns`, gap 8, margin-top 17):
     - Primary `.bp` (amber 4px frame, inner with 1px rgba(29,14,0,.28) border, hover inner bg #FFBD33): "try 1 month free→" -> console rius signup.
     - Secondary `.bs` (outer #1E0F00, inner #2D1804, hover inner #5B3200): "talk to the founders" -> cal.com.
   - Small print `.ml.mu`: "1 month free, then $19/mo · managed · 500k spans included".
   - Right/under: an amber underlined jump link "instrument your agent in 2 minutes ↓" (`data-jump="rcx-install"`, smooth-scrolls to the install section; hover turns it cream).
   - Dashboard screenshot (base64, intrinsic 2600x1440, shown 1046x579 inside 12px padding).
   - Below the hero: a 4-up chip row (`.grid.g4`, each chip padding 20px 16px, Geist Mono 700 14 with an amber icon): "Silent failure detection", "MCP Observability", "Live spans", "Agent heartbeats".
2. **Logos** (`.lg2.grid.g2`):
   - Two halves, each with a header `.lh` ("Used by:" / "Backed by CEOs of:") over 3 logo cells (`.lc`, min-height 120, bg panel). Logos are cream SVG data-URIs (300w intrinsic): Restack, nubrain, Sentri | Entire, Weaviate, sference.
3. **Quote** (`.q`, padding 40, gap 32):
   - `.big` quote, identical to the /rius testimonial.
   - Avatar 48x48 + "Andres Almansa / CEO of Restack" (`.mt` 16px), and the Restack logo 48x48 on the right.
4. **Comparison with toggle** (arize only):
   - `.tth` header row: H2 "Rius vs Arize AX" + a segmented switch `.tsw` with two labels "vs Arize AX" | "vs Phoenix OSS". The active label has bg amber and ink text; inactive is muted, cream on hover.
   - CSS-only: radio inputs `#rcx-vs-ax` (checked) / `#rcx-vs-px` show panel `.tpn-ax` / `.tpn-px`. The H2 changes to "Rius vs Phoenix OSS" in the second panel.
   - Table `.t`: header "Rius" | "Arize AX Free / Pro" (or "Phoenix OSS"). Eight rows, `th` = "01Detection:" etc. (the `.num` chip 24x24 amber + label). The Rius column cell has bg panel.
   - Row topics: Detection, Root cause, Heartbeat, Alerts, MCP, User view, Limits, Price. Each cell is one short sentence; Rius cells stress real-time/automatic/unlimited/MCP-first/$19. Arize AX cells: scans every 3-6h, 25k/50k spans, 15/30 days, $0/$50. Phoenix cells: evals you write, manual inspection, no heartbeat, no alerts, read-only MCP, self-hosted.
   - Mobile: the table collapses to blocks (thead hidden; each td shows its `data-l` label in amber 12px above the value).
5. **"Where Arize stops."**: H2 + muted sub "Strong for evals and experiments. These are the gaps in production."
   - 3 cards (`.grid.g3`), each a title (h3-ish), a muted one-liner and 3 `.li` bullet rows (8x8 amber square + text):
     - "Scheduled, not real-time" (scan delay, Alyx on request, no per-run heartbeat)
     - "Low limits" (25k/50k spans, 15/30 days, 10/25 issues)
     - "Phoenix in production" (Postgres/backups/auth/upgrades, one tenant per instance, no alerting)
6. **Silent failures grid** (`.cat`: 1fr + 2fr). Left H2 "Some of the silent failures that Rius would have caught for you."; right a 2x3 grid of cards, each with a `.kick` category label, a 20/26 title and a muted 14px sentence:
   - infrastructure "Trace is green but one span shows an error"
   - cognitive "Tool loop"
   - infrastructure "Consistent error pattern"
   - infrastructure "The process that vanished"
   - recovery "The run that crashed"
   - cognitive "The wrong turn at step 7"
7. **Install** (`#rcx-install`, arize only):
   - H2 "Instrument your agent in 2 minutes." + muted sub (one sentence: no servers, paste one prompt into your coding agent).
   - `.inst` box: tab header `.ih` (uppercase Geist Mono 14, ls .06em) with radio tabs "python" | "typescript". The active tab gets a 3px amber underline and cream text. The header also shows the muted label "install prompt" and an amber "COPY" button `.cp`.
   - `pre.code` with the install prompt (python: pip install of the Rius SDK extra plus instructions; typescript: npm equivalent). Each is a few lines of a coding-agent prompt.
   - Then 3 numbered steps: "01 Sign up and copy your API key." / "02 Paste the prompt into Claude Code, Cursor or any coding agent." / "03 Run your agent. Traces and incidents show up in Rius."
   - Then an action row: primary button "get your API key→" + "1 month free, then $19/mo".
   - Copy button: copies the visible prompt and its text becomes "copied" for 1.6s.
8. **Split: "Arize summarizes patterns. Rius gives you the cause."**: image left (RCA screenshot, 1350x1500 intrinsic), text right. Two muted paragraphs (RCA per incident; alerts you or your agent over MCP) and a `.ml` flow line "symptom→pattern→root cause→alert".
9. **Split wide (2fr/3fr): "See every end user your agents served."**: text left (2 muted sentences on the users view), image right (users view 1400x940).
10. **Split wide (3fr/2fr): "Built to feed your agents, not just your dashboard."**: image left (MCP view 1400x940), text right (2 muted sentences) + flow line "incident→agent reads RCA→fix→verify".
11. **Cost calculator** (`.calc`, interactive, see §5.4): H2 "What does 100k spans per month cost you?" + muted sub. A `.vol` strip "volume 100k spans / month". Controls, then 4 cost cards `.g4c`:
    - "Rius Core $19 /mo": highlighted `.pc-r` bg #26140A, promo pill, amber `.rowbtn.on` "get started", spec rows, and a savings row.
    - "Phoenix OSS $0 /mo": computed estimate rows, plus 3 `<details class="bd">` accordions for setup hours, maintenance hours and infrastructure.
    - "Arize AX Free $0 /mo" and "Arize AX Pro $50 /mo": static rows.
    - Footnote `.note`.
12. **FAQ** (`.faq` max-width 900, centred, H2 "Common questions" centred):
    - `<details name="rcx-acc">`. The shared `name` makes them **exclusive**: opening one closes the others.
    - Summary: Geist Mono 700 14 white, padding 20px 24px, bg panel. A 28x28 ink square on the right shows "↓" closed / "↑" open.
    - Questions (answers are 1-3 sentences, outline only):
      - best Arize alternative for startups
      - cost to self-host Phoenix (estimate pointer to the calculator)
      - does Phoenix have real-time alerts (OSS none; AX metric monitors)
      - run Rius and Phoenix side by side (yes, dual OTel export)
      - "Phoenix is free. Why pay $19?"
      - is Phoenix open source (Elastic License 2.0, source-available)
      - is Rius self-hostable (no, cloud only)
      - what Rius does not replace (prompt mgmt, evals, datasets)

### 5.3 Langfuse differences (same CSS minus the `.tt/.tsw` toggle rules; identical script)
- Hero H1 "Rius is the Langfuse alternative that does the debugging for you."; lead 1 sentence (managed, detects silent failures vs Langfuse traces you dig through); small print "1 month free, then $19/mo · managed · no ClickHouse to run". No jump link. Hero image = alert view screenshot (2600x1440, shown 1080x598).
- Logos and quote: identical.
- Comparison: a single table, no toggle. H2 "Rius gives you insights that Langfuse can not."; columns Rius | Langfuse; **6 rows**: Detection, Root cause, Heartbeat, MCP, Delivery, Costs.
- "Where Langfuse stops." (sub "Great for traces, evals and prompts. These are the gaps."), cards: "Unknown failures", "Frozen agents", "Self-hosting".
- Silent failures grid: identical.
- Split "Langfuse gives you the trace. Rius gives you the cause." (same RCA image).
- No install section, no users/MCP splits. Instead: **"Run both side by side. Compare what each catches."** (sub: route the same traces for a week). Two `.pc` cards in `.g2`, bars "01"/"02":
  - "Already on OpenTelemetry? Dual-export.": muted sentence + `pre.code` showing an `otel-collector.yaml` with two exporters (langfuse + rius) + link "read the migration guide →".
  - "On the Langfuse SDK? Swap the decorators.": muted sentence + `pre.code` mapping `@observe()` → `@rius.observe` etc. + link "see all sdk differences →".
  - Both links -> https://docs.glassflow.ai/rius/guides/migrate-from-langfuse.
- Calculator: H2 "Self-hosting Langfuse isn't free. Run the numbers."; only **2 cards** (`.g2`): "Self-hosted Langfuse" (estimate rows + 3 detail accordions + note) and "Rius Core $19 /mo" (spans incl. 500k, overage $14, retention 60d, "silent failures · rca · heartbeat · mcp incl.", savings row). Different `data-calc` numbers (§5.4).
- **"Where Langfuse is still the better pick"** (`.lbp`): 3 numbered cards ("You need to self-host.", "Prompt management and evals are your main use case.", "Your agents are short, stateless LLM calls."), then a `.bpc` strip with a lead sentence and the "try 1 month free→" button.
- FAQ: 7 questions (best Langfuse alternative; can Rius replace Langfuse; does Langfuse require ClickHouse; self-hosting cost; "Langfuse is free. Why pay $19?"; use both together; is Rius self-hostable).
- Page meta: title "Langfuse Alternative for AI Agents | Rius by GlassFlow"; the description and og:image fall back to the site defaults (home's).

Arize page meta: title "Arize Alternative for AI Agents | Rius vs Arize Phoenix"; description "Looking for an Arize or Phoenix alternative? Rius is a managed agent monitor with real-time silent-failure detection and root cause. $19/mo, 1 month free."; og `https://framerusercontent.com/assets/55pSz2A6Vkt6lHiYRmUXFqvUWhw.jpg`.

### 5.4 Embed calculator logic (exact, from the inline script)
- Inputs:
  - Range `#rcx-rate`: min 10, max 100, step 5, default 65 ("engineer hourly rate").
  - Radio `name="rcx-infra"`: `prod` (default, "production · AWS managed") | `lean` ("lean · single VM").
- Data (`data-calc` JSON; each pair is `[prod, lean]` hours):
  - arize: `setup` = [[1,1],[2,1],[1.5,1],[1.5,1],[1,0.5],[3,3],[1,1]], `maint` = [[1,1],[0.5,1],[0.75,1],[0.5,0.5],[0.25,0.25]], `infra` = {prod: 88, lean: 14}
  - langfuse: `setup` = [[1,1],[3,1.5],[2,1.5],[1.5,1],[2,1.5],[1.5,1.5],[1,1]], `maint` = [[1,1],[0.75,0.75],[0.5,1],[0.75,1],[0.25,0.25]], `infra` = {prod: 202, lean: 49}
- Formulas (i = 0 for prod, 1 for lean; r = rate):
  - `sh = Σ setup[j][i]`, `mh = Σ maint[j][i]`
  - `setupM = sh*r/12`, `maintM = mh*r`, `infra = d.infra[mode]`, `total = setupM + maintM + infra`
  - Outputs (by `data-o`):
    | key | value |
    |---|---|
    | rate | "$r/h" |
    | setupH | sh |
    | maintH | mh |
    | setupM / maintM / infra | `fmt(x)+"/mo"` |
    | total | `fmt(total)` |
    | saveM | `fmt(total-19)+"/mo"` |
    | saveY | `fmt((total-19)*12)+"/year"` |
  - `fmt(n) = "$" + Math.round(n).toLocaleString("en-US")`
  - Per-line hours `[data-h="setup-j"]` / `[data-h="maint-j"]` update to the selected mode. Rows with `data-mode` show only when they match the mode.
- Defaults check: langfuse prod at $65 gives setup 12h → $65/mo, maint 3.25h → $211/mo, infra $202, total **$478/mo**, save "$459/mo · $5,511/year". These match the live render.
- Line-item labels (detail accordions) are in the outline. Arize Phoenix prod infra: EC2 t3.medium $30, RDS $30, ALB $18, backups $10; lean: VM $8, volume $3, snapshots $3.

---------------------------------------------------------------------------------------------------

## 6. /rius/calculator-building-your-own-agent-observability

Title "GlassFlow | Agent Observability Cost Calculator: Build vs Buy"; description and og:image are the site defaults. Height 2357 / 5848.

### 6.1 Page frame
- Nav, then a 66px page-bg band (y=40..106), then the calculator wrapper (Framer section padding 0 64px, gap 40) containing a 1312-wide **bg panel #2D1804** block (y=106..1696), then a 67px band, then the CTA band and footer (unchanged).
- The calculator is a Framer code component that injects an HTML string (scoped `.rius-calculator-root`) and runs a vanilla script. It uses **system fonts**, not the site fonts: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` and mono `"SF Mono","Menlo","Consolas",monospace`. Rounded corners (4px/3px) appear here, unlike the rest of the site.
- Its own tokens:
  | token | value |
  |---|---|
  | text-primary | #f1efdf |
  | text-secondary | #c9bba0 |
  | text-muted | #8f8672 |
  | danger | #ff6b4a |
  | warning | #ffc15c |
  | success | #4ade80 |
  | accent | #ffac00 |
  | surface-0 | #1e0f00 |
  | surface-1 | #492400 |
  | surface-2 | #2d1804 |
  | border | rgba(255,220,180,0.14) |
  | bg-accent | rgba(255,172,0,0.16) |
  | bg-success | rgba(74,222,128,0.14) |

### 6.2 Layout (desktop measured)
- **Hero** section: padding 88px 0 64px, centred, `.wrap-narrow` max 720. H1 "Is building your own agent observability cheaper than Rius?" (34px / 1.25, weight 800, 2 lines, 680 wide).
- **Assumptions** section: bg surface-1 #492400, padding 28px 0. A 760-wide box (bg surface-2, 1px border, radius 4, padding 18px 24px) holds a full-width toggle button: "Assumptions behind this estimate" (mono 15/800) with an amber chevron "▾" on the right.
  - On click it shows `.disclaimer-content`: a sub line plus an 11-item bullet list (13.5/1.7). The chevron becomes "▲".
  - Bullet outline: DB cost from data volume (ingest GB = traces x size; stored = ingest/30 x 30 days); hosting scales with trace count; costs vary; self-built feature set auto-matches the compared Rius tier; flat 12h research allowance; security hardening excluded; Rius entitlements shown as highlights not hours; MCP features not modelled; AI multipliers are estimates; ops overhead scales with volume; query compute explained.
- **Calculator** section: padding 56px 0. `.wrap` max 1120 + padding 0 20, so content is x=180..1260. Grid `1fr 1fr`, gap 28 (columns 526 each). At <=900px it becomes 1 column. At >=901px the **results column is `position: sticky; top: 20px`**.
  - **Inputs column** (title "Inputs", mono 18/800):
    - "MONTHLY TRACES" (section label mono 11/700 uppercase, ls .06em, muted): 6 preset buttons in a flex-wrap row, gap 8, each `flex:1 1 80px`, 81x57. Buttons have bg surface-1, a 1px border, radius 4, padding 12px 10px. Label mono 13.5/800, sub "traces/mo" 10.5 muted. Active: border amber, bg bg-accent, label amber. Presets: 10k, 100k (default), 500k, 1M, 2M, 5M. Note under them (11px muted): "A trace typically represents one end-to-end agent or workflow execution."
    - "Who would build this internally?" (mono 13.5/700): 3 buttons 170x72 showing label, "~$40/hr", and computed "{effBuild}h build · {effMaint}h/mo maint". Options: Junior engineer ($40/hr), Mid-level engineer ($65/hr, default), Senior engineer ($90/hr).
    - "How much does AI coding accelerate your team?": 3 buttons: Conservative ("15% faster build" / "10% faster maintenance"), Typical (default, 25%/15%), AI-native (45%/20%).
    - "Advanced settings ▾" full-width button (bg surface-1, border, amber 13/700, padding 12px 0, radius 4). It toggles the advanced panel; the label becomes "Hide advanced settings ▲". The panel contains:
      - MVP list: a locked "🔎 Research & evaluation" row plus 10 locked "✓" core features, each with effective hours. Some have an ⓘ tooltip (220 wide, appears on hover with a 0.15s opacity transition). Then a summary bar.
      - "Additional features" checkboxes grouped Observability / Multi-tenancy / Platform / Operations, plus a summary.
      - "Average trace size" pills: Light (10 KB) / Typical (50 KB, default) / Heavy (200 KB), plus a retention note.
      - "Database" provider grid, 3 cols: Supabase / Neon (default), AWS RDS / Cloud SQL, Self-hosted Postgres. The selected one shows its tier in warning yellow.
      - A warning line.
      - "Hosting" grid: Managed (Railway/Render, default), Cloud Provider (AWS ECS/Cloud Run), Self-hosted VPS (Hetzner/DO).
  - **Results column** (title "Results"):
    - Compare box: 1px amber border, bg bg-accent, radius 4, padding 18. Contents:
      - "RIUS VS SELF-BUILT" label.
      - Two centred items "SELF-BUILT" / "{tier name}" with values 22/800: self-built in danger red and Rius in success green, or swapped when self-built is cheaper. A muted "vs" sits between them.
      - Under the Rius value, a highlights list (mono 10.5, "✓ " prefix in green).
      - Savings bar (bg-success, green border, 13/800 green): "You save $X/mo · $Y/year with Rius". If self-built is cheaper it is amber: "Self-built is $X/mo · $Y/year cheaper".
      - Assumption summary line (mono 10.5 muted).
      - Full-width amber "Get started" button (mono 14/800, text #2d1804, radius 4, padding 12px 0) -> https://eu.console.rius-glassflow.com (new tab).
    - Then 3 cards (`repeat(3,1fr)`, gap 10; bg surface-1, border, radius 4, padding 14): "Infrastructure" $/mo; "Engineering" $/mo + sub "{effBuild}h build · {maint+ops}h/mo ongoing"; "12-month effective monthly cost" $/mo + sub "Initial build amortized over 12 months + ongoing maintenance + infrastructure."
    - "COSTS BREAKDOWN" panel (bg surface-2, border, padding 20) with Infrastructure lines + subtotal, Engineering lines (initial build, feature maintenance, operational overhead) + subtotal, and the total.
- Default render (100k, Mid, Typical, 50 KB, Supabase, Railway) matches live: Self-Built **$943/mo** vs Rius Core **$19/mo**; "You save $924/mo · $11,087/year with Rius"; Infrastructure $37 (Supabase Pro $25 + Railway $7 + compute $5); Engineering $906 (79.5h build → $5,168 → $431/mo; 6.3h raw × 0.85 = 5.3h → $345/mo; ops 2h → $130/mo).

### 6.3 Calculator data and formulas (exact)
- `CORE_FEATURES` (build h / maint h/mo):
  | feature | build | maint |
  |---|---|---|
  | Agent SDK | 8 | 0.5 |
  | Event ingestion API | 12 | 1.0 |
  | Telemetry storage | 6 | 0.5 |
  | Trace reconstruction | 10 | 0.5 |
  | Runs list UI | 8 | 0.5 |
  | Trace viewer UI | 16 | 1.0 |
  | Basic authentication | 8 | 0.5 |
  | API keys | 6 | 0.5 |
  | Alerts | 12 | 0.75 |
  | Cost and token tracking | 8 | 0.5 |
  Plus `RESEARCH_HOURS` build 12 / maint 0.
- Tooltips: Agent SDK "Covers a single SDK for one language (e.g. Python or TypeScript). Supporting additional languages requires additional build time."; Telemetry storage "Schema, persistence and basic querying for trace data using the selected database."; Trace viewer UI "Basic trace hierarchy, span details, inputs/outputs, errors and timing."; Alerts "Basic rule-based alerts with configurable thresholds and notifications."
- `OPTIONAL` (build / maint):
  | group | feature | build | maint |
  |---|---|---|---|
  | Observability | Heartbeat / frozen agent detection | 16 | 1.0 |
  | Multi-tenancy | Workspaces | 20 | 1.0 |
  | Multi-tenancy | Organizations | 16 | 0.75 |
  | Multi-tenancy | Roles and permissions | 24 | 1.0 |
  | Platform | Data regions | 40 | 2.0 |
  | Operations | CI/CD pipeline | 16 | 1.0 |
  | Operations | Backup and recovery | 12 | 1.0 |
- `AI_MODES` multipliers (multBuild / multMaint): conservative 0.85 / 0.90; typical 0.75 / 0.85; ai_native 0.55 / 0.80.
- `SENIORITY` (rate, timeMult): junior 40, 1.5; mid 65, 1.0; senior 90, 0.75.
- `TRACE_PRESETS`: values in thousands: 10, 100, 500, 1000, 2000, 5000. `TRACE_SIZE_KB`: light 10, typical 50, heavy 200. `RETENTION_DAYS` = 30.
- DB tiers by stored GB (`max` → price, tier name):
  - Supabase / Neon: ≤2 → $0 Free; ≤50 → $25 Pro; ≤300 → $250 "Pro + storage add-on"; ≤1000 → $599 Team; above → $1299 Enterprise.
  - AWS RDS / Cloud SQL: ≤10 → $18 db.t3.micro; ≤50 → $50 db.t3.small; ≤200 → $130 db.t3.medium; above → $280 db.m5.large.
  - Self-hosted Postgres: ≤10 → $6 "2 GB VPS"; ≤50 → $12 "4 GB VPS"; above → $24 "8 GB VPS".
- Hosting tiers by traces (k):
  - Railway: ≤500 → $7; ≤2000 → $20; above → $50.
  - AWS ECS: ≤300 → $18; ≤1000 → $36; above → $85.
  - Hetzner: ≤500 → $6; ≤2000 → $12; above → $24.
- `OPS_OVERHEAD` hours by traces (k): ≤100 → 2, ≤500 → 3, ≤1000 → 4, ≤2000 → 5, above → 6. Not scaled by multipliers.
- `QUERY_COMPUTE` $ by traces (k): ≤10 → 0, ≤100 → 5, ≤500 → 15, ≤1000 → 30, ≤2000 → 60, above → 120.
- `RIUS_TIERS` by traces (k): ≤100 → Rius Core $19; ≤500 → Rius Growth $79; ≤2000 → Rius Pro **$249**; above → Rius Enterprise $1999. (The calculator's Pro price differs from the $199 on the pricing page; kept verbatim.)
- `TIER_FEATURE_PRESETS`: when the trace volume crosses into a new Rius tier, the optional checkboxes are reset to:
  - core: []
  - growth: [heartbeat]
  - pro: [heartbeat, workspaces, roles_permissions]
  - enterprise: [heartbeat, workspaces, organizations, roles_permissions, data_regions, backup_recovery, cicd]
- `TIER_HIGHLIGHTS`:
  - core: "48h support response", "SLA available as add-on"
  - growth: core's + "Dedicated Slack as add-on"
  - pro: "24h support response", "Dedicated Slack included", "1y audit logs included"
  - enterprise: "SLA included (99.9% uptime)", "Dedicated Slack included", "White-glove onboarding", "Custom audit logs & retention", "Choose your own data region"
- Compute:
  - `buildMult = seniority.timeMult * mode.multBuild`, `maintMult = seniority.timeMult * mode.multMaint`
  - `totals.build = 12 + Σcore.build + Σselected.build`; `totals.maint = Σcore.maint + Σselected.maint`
  - `effBuild = totals.build*buildMult`; `buildTotal = effBuild*rate`; `buildAmortised = buildTotal/12`
  - `featureMaint = totals.maint*maintMult*rate`; `ops = opsHours*rate`; `engineering = buildAmortised + featureMaint + ops`
  - `ingestGB = traces*1000*KB/1048576`; `storedGB = ingestGB/30*30`
  - `infra = dbTier(storedGB).price + hostTier(traces).price + queryCompute(traces)`
  - `total = infra + engineering`; `diff = total - riusTier.price`; `selfCheaper = diff < 0`; `yearly = |diff|*12`
  - `money(n) = "$" + Math.round(n).toLocaleString()`; hours `fmtHours` = 1 decimal, trimmed if whole.
- Breakdown copy pattern: "{raw} hrs raw × {mult} ({Seniority label} + {Mode} AI acceleration) = {eff} hrs effective" / "× $65/hr = $5,168" / "Amortised over 12 months = $431/mo". When mult = 1 the shorter form is "{raw} hrs × $rate/hr = $X".
- DB warning (Supabase only): at the Pro tier, "Free tier exceeded at this data volume — Pro plan required at $25/mo"; at higher tiers, "At this data volume the {tier} plan is required at ${price}/mo".

### 6.4 Mobile (390)
- Wrapper padding becomes 0 16px; panel 358 wide; the grid is single-column (Inputs, then Results; sticky is off below 901px). Preset buttons wrap. Cards are 3-up down to 480px, then stacked.
- **Live defect:** at 390 the page renders a second, non-functional copy of the calculator below the first (y=2682..4379, padding 0 64, all values "$0/mo"). This is because the script uses `document.getElementById`. Build one instance only.

---------------------------------------------------------------------------------------------------

## 7. Outbound links on these pages (not followed)
- console.tares-glassflow.com (plus `?utm_source=button&utm_medium=website&utm_campaign=hp_start_cta`)
- console.rius-glassflow.com/signup with these utm variants:
  - `utm_source=framer.com&utm_medium=referral&utm_campaign=hp_start_cta`
  - `utm_source=glassflow&utm_medium=pricing_page&utm_campaign=signup&utm_content={core|growth|pro}`
  - `utm_medium=footer`
- eu.console.rius-glassflow.com
- cal.com/armend-glassflow/30min (`utm_medium=rius_page` or `pricing_page`, `utm_content=enterprise`)
- docs.glassflow.ai: /tares/quickstart, /rius/quickstart, /rius/guides, /rius/guides/migrate-from-langfuse
- rius.glassflow.ai/calculator-building-your-own-agent-observability
- github.com/glassflow/tares

Internal links: /rius/pricing (cta-xs), /blog/decision-model-vs-llm, /blog/how-to-detect-ai-agent-failures-in-production, plus the global nav and footer links.

## 8. Not measured / limits
- Exact easing curves are inferred from rAF samples; durations are about ±30ms.
- `Faq` answer link targets inside /rius FAQ 2 ("here") were not captured.
- Alternatives embed images are base64 inside `srcdoc` and have no URLs. Extract them by loading the live page and reading `document.querySelector('iframe').getAttribute('srcdoc')` (arize ~975KB, langfuse ~657KB).
- Tablet (810) was not measured for these pages; home's 810 rules (32px gutters, stacked panels) presumably apply.

---------------------------------------------------------------------------------------------------

## Appendix A: alternatives embed CSS (verbatim from the arize srcdoc; langfuse is identical minus the `/* rius vs toggle */` block)

```css
html,body{margin:0;background:#492400}.rcx{--bg:#492400;--ink:#1D0E00;--card:#1E0F00;--panel:#2D1804;--line:#553619;--brown:#5B3200;--acc:#FFAC00;--tx:#F1EFDF;--mu:rgba(241,239,223,.64);--grey:#8F8982;--cream:#F1EFDF; --disp:"Inter Display","Inter",system-ui,sans-serif;--mono:"Geist Mono","Geist Mono Variable",ui-monospace,monospace; background:var(--bg);color:var(--tx);font-family:var(--disp);font-size:16px;line-height:22.4px;letter-spacing:-.64px;-webkit-font-smoothing:antialiased;width:100%}
.rcx *,.rcx *::before,.rcx *::after{box-sizing:border-box}
.rcx p{margin:0}
.rcx a{color:inherit}
.rcx .s{padding:0 64px;border-bottom:1px solid var(--line)}
.rcx .w{max-width:1312px;margin:0 auto;border-left:1px solid var(--line);border-right:1px solid var(--line);padding:32px 0}
.rcx .p{background:var(--card)}
.rcx .bar{height:32px;background:var(--ink);display:flex;align-items:center;justify-content:space-between;padding:0 12px;border-bottom:1px solid var(--line)}
.rcx .dots{display:flex;gap:4px}.rcx .dots i{display:block;width:6px;height:6px;background:var(--line)}
.rcx .bar .tag{font-family:var(--mono);font-size:12px;line-height:12px;letter-spacing:0;color:var(--acc)}
.rcx .grid{display:grid;gap:1px;background:var(--line)}
.rcx .grid>*{background:var(--card)}
.rcx .g2{grid-template-columns:repeat(2,minmax(0,1fr))}
.rcx .g3{grid-template-columns:repeat(3,minmax(0,1fr))}
.rcx .g4{grid-template-columns:repeat(4,minmax(0,1fr))}
.rcx .h1{font-size:48px;line-height:48px;letter-spacing:-1.92px;font-weight:400;margin:0}
.rcx .h2{font-size:40px;line-height:48px;letter-spacing:-1.6px;font-weight:400;margin:0}
.rcx .h3{font-size:24px;line-height:28px;letter-spacing:-.96px;font-weight:400;margin:0}
.rcx .lead{font-size:21px;line-height:29.4px;letter-spacing:-.84px}
.rcx .big{font-size:32px;line-height:36px;letter-spacing:-1px;font-weight:400}
.rcx .acc{color:var(--acc)}
.rcx .mu{color:var(--mu)}
.rcx .sm{font-size:14px;line-height:19.6px;letter-spacing:-.32px}
.rcx .mt{font-family:var(--mono);font-size:14px;line-height:18.2px;font-weight:700;letter-spacing:0}
.rcx .ml{font-family:var(--mono);font-size:12px;line-height:18.2px;font-weight:400;letter-spacing:0}
.rcx .kick{font-family:var(--mono);font-size:12px;line-height:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--acc)}
.rcx .th{font-size:20px;line-height:28px;letter-spacing:-.8px;font-weight:700;color:var(--acc)}
.rcx .stack{display:flex;flex-direction:column;gap:15px}
.rcx .pad{padding:64px 32px}
.rcx .padc{padding:24px}
/* buttons */
.rcx .btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:17px}
.rcx .btn{display:inline-flex;gap:8px;text-decoration:none;font-family:var(--mono);font-size:14px;line-height:24px;font-weight:500;letter-spacing:-.32px;text-transform:lowercase}
.rcx .bx{display:flex;padding:4px;min-height:52px}
.rcx .in{display:flex;align-items:center;justify-content:center;padding:10px 24px;width:100%}
.rcx .bp .bx{background:var(--acc)}.rcx .bp .in{border:1px solid rgba(29,14,0,.28);color:var(--ink)}
.rcx .bp .ar .in{padding:10px 14px}
.rcx .bp:hover .in{background:#ffbd33}
.rcx .bs .bx{background:var(--card)}.rcx .bs .in{background:var(--panel);color:var(--tx)}
.rcx .bs:hover .in{background:var(--brown)}
.rcx .btn:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
/* hero */
.rcx .hero{display:grid;grid-template-columns:minmax(0,1fr)}
.rcx .hero .l{display:flex;flex-direction:column;justify-content:center}
.rcx .hero .l .stack{max-width:860px}
.rcx .hero .l.pad{padding:64px 32px 40px}
.rcx .hero .r{padding:0 12px 12px;display:flex}
.rcx .hero .r.rj{flex-direction:column;align-items:stretch}
.rcx .jump{align-self:flex-start;margin:0 20px 16px;font-family:var(--mono);font-size:14px;line-height:20px;font-weight:500;letter-spacing:0;color:var(--acc);text-decoration:underline;text-underline-offset:4px;cursor:pointer}
.rcx .jump:hover{color:var(--tx)}
.rcx .bar .tag .rl{display:block;width:58px;height:14px;background:url(<base64 PNG of the Rius wordmark, 58x14 display; extract from srcdoc>) no-repeat center/contain}
/* rius vs toggle */
.rcx .tt>input{position:absolute;opacity:0;pointer-events:none}
.rcx .tpn{display:none}
.rcx .tth{display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;align-items:center;padding:32px}
.rcx .tsw{display:inline-flex;border:1px solid var(--line);background:var(--ink)}
.rcx .tsw label{cursor:pointer;font-family:var(--mono);font-size:14px;line-height:18px;font-weight:500;letter-spacing:0;padding:10px 16px;color:var(--mu)}
.rcx .tsw label:hover{color:var(--tx)}
.rcx .tsw label.on{background:var(--acc);color:var(--ink)}
.rcx #rcx-vs-ax:checked ~ .tpn-ax{display:block}
.rcx #rcx-vs-px:checked ~ .tpn-px{display:block}
/* tl;dr + better pick */
.rcx .tlb{display:flex;gap:20px;align-items:baseline;padding:20px 32px;border-top:1px solid var(--line);background:var(--ink)}
.rcx .tlb .mt{flex:none;font-size:13px}
.rcx .tlb p{font-size:15px;line-height:22px;letter-spacing:-.3px;color:var(--mu);max-width:1040px}
.rcx .lbp .card{display:flex;flex-direction:column;gap:10px}
.rcx .lbp .card .num{align-self:flex-start}
.rcx .bpc{display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;padding:28px 32px;border-top:1px solid var(--line);background:var(--ink)}
.rcx .bpc .lead{max-width:760px}
/* install prompt */
.rcx .inst{border-top:1px solid var(--line);background:var(--ink)}
.rcx .inst>input{position:absolute;opacity:0;pointer-events:none}
.rcx .ih{display:flex;align-items:center;gap:24px;padding:0 20px;border-bottom:1px solid var(--line);font-family:var(--mono);font-size:14px;line-height:18px;letter-spacing:.06em;text-transform:uppercase}
.rcx .ih label{cursor:pointer;color:var(--mu);padding:18px 0 14px;border-bottom:3px solid transparent}
.rcx .ih label:hover{color:var(--tx)}
.rcx #rcx-py:checked ~ .ih label[for=rcx-py],.rcx #rcx-ts:checked ~ .ih label[for=rcx-ts]{color:var(--tx);border-bottom-color:var(--acc)}
.rcx #rcx-py:focus-visible ~ .ih label[for=rcx-py],.rcx #rcx-ts:focus-visible ~ .ih label[for=rcx-ts]{outline:2px solid var(--acc);outline-offset:2px}
.rcx .ik{margin-left:auto;color:var(--grey)}
.rcx .cp{font:inherit;text-transform:uppercase;letter-spacing:.06em;background:var(--acc);color:var(--ink);border:0;padding:6px 12px;cursor:pointer;font-weight:700}
.rcx .cp:hover{background:var(--tx)}
.rcx pre.code.ip{display:none;font-size:14px;line-height:22px;padding:24px 20px;white-space:pre-wrap;word-break:break-word;overflow-x:visible}
.rcx #rcx-py:checked ~ pre.ip-py,.rcx #rcx-ts:checked ~ pre.ip-ts{display:block}
.rcx .ist{display:flex;gap:12px;align-items:flex-start;padding:20px}
.rcx .ia{display:flex;align-items:center;gap:16px;flex-wrap:wrap;padding:20px;border-top:1px solid var(--line)}
.rcx .chip{display:flex;align-items:center;justify-content:center;gap:12px;padding:20px 16px}
.rcx .ck{width:20px;height:20px;background:var(--acc);display:inline-flex;align-items:center;justify-content:center;flex:none}
/* media placeholder */
.rcx .media{flex:1;min-height:420px;background:#000;display:flex;align-items:center;justify-content:center;padding:40px}
.rcx .media.mimg{flex:0 1 auto;align-self:center;width:100%;padding:0;min-height:0;background:#000}
.rcx .media.mimg img{display:block;width:100%;height:auto;max-width:100%}
.rcx .shot{background:var(--cream);color:var(--ink);border:1px dashed #c26a00;font-family:var(--mono);font-size:12px;line-height:18px;letter-spacing:0;padding:20px;max-width:520px;display:flex;flex-direction:column;gap:8px}
.rcx .shot b{color:#a34b00}
/* cards */
.rcx .card{padding:24px;display:flex;flex-direction:column;gap:12px}
.rcx .ico{width:32px;height:32px;background:var(--panel);display:flex;align-items:center;justify-content:center}
.rcx .li{display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-top:1px solid var(--line)}
.rcx .sq{width:8px;height:8px;background:var(--acc);flex:none;margin-top:6px}
.rcx .num{font-family:var(--mono);font-size:12px;line-height:12px;font-weight:500;letter-spacing:0;background:var(--acc);color:var(--ink);width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;flex:none}
/* table */
.rcx .tw{overflow-x:auto}
.rcx table.t{width:100%;min-width:780px;border-collapse:collapse;background:var(--card)}
.rcx .t th,.rcx .t td{border:1px solid var(--line);padding:20px 24px;text-align:left;vertical-align:middle;font-weight:400}
.rcx .t thead th{padding:28px 24px}
.rcx .t thead th.c{text-align:center}
.rcx .t thead th.th{font-weight:700}
.rcx .t tbody th{width:22%}
.rcx .t td{width:39%}
.rcx .t tbody th .row{display:flex;gap:12px;align-items:center;font-family:var(--mono);font-size:16px;line-height:24px;font-weight:500;letter-spacing:0}
.rcx .t td.rius{background:var(--panel)}
.rcx .t td b{font-weight:700}
.rcx .note{font-family:var(--mono);font-size:12px;line-height:18px;letter-spacing:0;color:var(--mu);padding:12px 24px}
/* code */
.rcx .code{background:var(--ink);font-family:var(--mono);font-size:12px;line-height:20px;letter-spacing:0;color:var(--tx);padding:20px;margin:0;white-space:pre;overflow-x:auto}
.rcx .code .c{color:var(--grey)}.rcx .code .k{color:var(--acc)}
/* pricing-style cost cards */
.rcx .pc{display:flex;flex-direction:column}
.rcx .pc .body{padding:24px;display:flex;flex-direction:column;gap:10px;flex:1}
.rcx .price{font-size:40px;line-height:44px;letter-spacing:-1.6px}
.rcx .price small{font-family:var(--mono);font-size:16px;letter-spacing:0;color:var(--tx)}
.rcx .promo{font-family:var(--mono);font-size:14px;line-height:24px;font-weight:700;letter-spacing:-.32px;text-transform:lowercase;color:#fff;background:var(--brown);padding:6px 10px;align-self:stretch}
.rcx .pr{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 12px;border-top:1px solid var(--line);font-family:var(--mono);font-size:14px;line-height:19.6px;font-weight:500;letter-spacing:-.32px}
.rcx .val{background:var(--panel);padding:2px 6px;font-weight:700;text-align:right}
.rcx .lab{font-family:var(--mono);font-size:10px;line-height:14px;letter-spacing:.06em;padding:1px 6px;border:1px solid;margin-right:8px;font-weight:500}
.rcx .fact{color:#a6e3b8}.rcx .asm{color:var(--acc)}
.rcx .rowbtn{display:flex;align-items:center;justify-content:center;min-height:44px;background:var(--panel);font-family:var(--mono);font-size:14px;font-weight:500;letter-spacing:-.32px;text-decoration:none;color:var(--tx);border-top:1px solid var(--line)}
.rcx .rowbtn.on{background:var(--acc);color:var(--ink)}
/* quote */
.rcx .q{padding:40px;display:flex;flex-direction:column;gap:32px}
.rcx .qlogo{width:24px;height:24px;background:var(--acc)}
/* faq */
.rcx .faq{max-width:900px;margin:0 auto}
.rcx details{background:var(--panel);border-bottom:1px solid var(--line)}
.rcx summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px;font-family:var(--mono);font-size:14px;line-height:18.2px;font-weight:700;letter-spacing:0;color:#fff}
.rcx summary::-webkit-details-marker{display:none}
.rcx summary::after{content:"\2193";width:28px;height:28px;background:var(--ink);color:var(--tx);display:inline-flex;align-items:center;justify-content:center;flex:none;font-weight:400}
.rcx details[open] summary::after{content:"\2191"}
.rcx details p{padding:0 24px 22px;font-size:16px;line-height:19.2px;color:var(--tx)}
.rcx summary:focus-visible{outline:2px solid var(--acc);outline-offset:-2px}
/* hub tabs (CSS only) */
.rcx .tabs>input{position:absolute;opacity:0;pointer-events:none}
.rcx .tl{display:flex;flex-wrap:wrap;gap:1px;background:var(--line);border-bottom:1px solid var(--line)}
.rcx .tl label{flex:1 1 160px;cursor:pointer;background:var(--ink);color:var(--tx);font-family:var(--mono);font-size:14px;line-height:18.2px;font-weight:700;letter-spacing:0;padding:16px;text-align:center}
.rcx .tl label:hover{background:var(--panel)}
.rcx .tp{display:none}
.rcx .tabs>input:focus-visible + *{outline:none}
/* links grid */
.rcx a.card{text-decoration:none;color:var(--tx)}
.rcx a.card:hover{background:var(--panel)}
.rcx .more{text-decoration:none;font-family:var(--mono);font-size:14px;font-weight:500;letter-spacing:-.32px;color:var(--acc);margin-top:auto}
/* split */
.rcx .split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
.rcx .split .r{padding:12px;display:flex}
.rcx .split.wide.ml0{grid-template-columns:minmax(0,3fr) minmax(0,2fr)}
.rcx .split.wide.mr0{grid-template-columns:minmax(0,2fr) minmax(0,3fr)}
.rcx .price s.x{text-decoration:line-through;text-decoration-thickness:3px;text-decoration-color:#ff6a3d;color:var(--mu)}
/* self-host calculator */
.rcx .ctrl{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr);gap:1px;background:var(--line);border-top:1px solid var(--line)}
.rcx .ctrl>*{background:var(--panel);padding:24px 32px;margin:0}
.rcx .sl{display:flex;flex-direction:column;gap:8px}
.rcx .sl input[type=range]{width:100%;height:44px;accent-color:var(--acc);cursor:pointer;margin:0}
.rcx .mode{border:0;display:flex;flex-direction:column;gap:12px;justify-content:center}
.rcx .mode legend{float:left;margin-bottom:4px;padding:0}
.rcx .mode label{display:flex;gap:10px;align-items:center;min-height:32px;font-family:var(--mono);font-size:14px;letter-spacing:-.32px;cursor:pointer;clear:both}
.rcx .mode input{accent-color:var(--acc);width:18px;height:18px;margin:0}
.rcx details.bd{background:transparent;border-top:1px solid var(--line);border-bottom:0}
.rcx details.bd summary{padding:14px 12px;font-size:13px;color:var(--tx)}
.rcx details.bd summary::after{width:22px;height:22px}
.rcx details.bd .pr{padding:10px 12px 10px 24px;font-size:13px;font-weight:400}
.rcx .pr[hidden]{display:none}
/* logo strip */
.rcx .lg2{border:1px solid var(--line)}
.rcx .lh{background:var(--ink);padding:16px 32px;border-bottom:1px solid var(--line);font-size:14px;color:var(--tx)}
.rcx .g3l{grid-template-columns:repeat(3,minmax(0,1fr))}
.rcx .lc{display:flex;align-items:center;justify-content:center;min-height:120px;padding:16px;background:var(--panel)}
.rcx .lc img{display:block;max-width:100%;height:auto}
/* arize calc + multi table */
.rcx .vol{display:flex;align-items:baseline;gap:16px;flex-wrap:wrap;padding:20px 32px;background:var(--ink);border-top:1px solid var(--line)}
.rcx .g4c{grid-template-columns:repeat(4,minmax(0,1fr))}
.rcx .cov{display:block;font-family:var(--mono);font-size:13px;line-height:18px;font-weight:700;letter-spacing:-.2px;padding:8px 10px}
.rcx .cov.ok{background:#1f3a1a;color:#a6e3b8}
.rcx .cov.no{background:#4a1607;color:#ffb199}
.rcx .pc-r{background:#26140a}
.rcx table.tm{min-width:900px}
.rcx .tm tbody th{width:16%;padding:14px 20px}
.rcx .tm td{width:28%;font-size:15px;line-height:21px;padding:14px 20px}
.rcx .tm thead th{padding:20px}
/* catches grid */
.rcx .cat{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:1px;background:var(--line)}
.rcx .cat>*{background:var(--card)}
/* cta strip */
.rcx .cta{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr) minmax(0,1fr)}
.rcx .cta>div{padding:48px 40px;display:flex;flex-direction:column;justify-content:center;gap:8px}
.rcx .cta .c{align-items:center;text-align:center}
@media (max-width:1199px){.rcx .g4,.rcx .g4c{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:809px){ .rcx .s{padding:0 16px}
.rcx .w{padding:16px 0}
.rcx .ik{display:none}
.rcx .tlb{flex-direction:column;gap:8px;padding:18px 20px}
.rcx .bpc{padding:24px 20px}
.rcx .split.wide.ml0,.rcx .split.wide.mr0,.rcx .hero,.rcx .split,.rcx .g2,.rcx .g3,.rcx .cta,.rcx .cat,.rcx .ctrl,.rcx .g4c{grid-template-columns:minmax(0,1fr)}
.rcx table.tm{min-width:0}
.rcx .g4{grid-template-columns:minmax(0,1fr)}
.rcx .h1{font-size:34px;line-height:36px;letter-spacing:-1.36px}
.rcx .h2{font-size:28px;line-height:32px;letter-spacing:-1.12px}
.rcx .lead{font-size:18px;line-height:25.2px;letter-spacing:-.72px}
.rcx .big{font-size:24px;line-height:28px}
.rcx .pad{padding:40px 20px}
.rcx .media{min-height:280px;padding:20px}
.rcx .q{padding:24px}
.rcx .cta>div{padding:32px 20px}
.rcx table.t{min-width:0}
.rcx .t thead{display:none}
.rcx .t,.rcx .t tbody,.rcx .t tr,.rcx .t th,.rcx .t td{display:block;width:100%}
.rcx .t tbody th{width:100%;background:var(--ink)}
.rcx .t th,.rcx .t td{padding:14px 16px;border-width:0 0 1px 0}
.rcx .t td::before{content:attr(data-l);display:block;font-family:var(--mono);font-size:12px;line-height:18px;letter-spacing:0;color:var(--acc);margin-bottom:4px}
}
```

## Appendix B: alternatives embed script (verbatim, both pages)

```js
function wireCalc(root) {
  root.querySelectorAll('[data-jump]').forEach(function (a) {
    if (a.__wired) return; a.__wired = true;
    a.addEventListener('click', function (e) {
      var t = root.querySelector('#' + a.getAttribute('data-jump'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
  root.querySelectorAll('[data-copy]').forEach(function (b) {
    if (b.__wired) return; b.__wired = true;
    b.addEventListener('click', function () {
      var box = b.closest('.inst');
      var ts = box.querySelector('#rcx-ts');
      var txt = box.querySelector(ts && ts.checked ? '.ip-ts' : '.ip-py').textContent;
      var done = function () { b.textContent = 'copied'; setTimeout(function () { b.textContent = 'copy'; }, 1600); };
      var fallback = function () { var ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (x) {} document.body.removeChild(ta); done(); };
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(txt).then(done, fallback); } else { fallback(); }
    });
  });
  var calcs = root.querySelectorAll('[data-calc]');
  calcs.forEach(function (el) {
    if (el.__wired) return; el.__wired = true;
    var d = JSON.parse(el.getAttribute('data-calc'));
    var rate = el.querySelector('[data-rate]');
    var fmt = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
    var set = function (k, v) { el.querySelectorAll('[data-o="' + k + '"]').forEach(function (n) { n.textContent = v; }); };
    var mode = function () { var c = el.querySelector('input[name="rcx-infra"]:checked'); return c ? c.value : 'prod'; };
    var calc = function () {
      var r = Number(rate.value), m = mode(), i = m === 'prod' ? 0 : 1;
      var sh = d.setup.reduce(function (a, x) { return a + x[i]; }, 0);
      var mh = d.maint.reduce(function (a, x) { return a + x[i]; }, 0);
      d.setup.forEach(function (x, j) { el.querySelectorAll('[data-h="setup-' + j + '"]').forEach(function (n) { n.textContent = x[i]; }); });
      d.maint.forEach(function (x, j) { el.querySelectorAll('[data-h="maint-' + j + '"]').forEach(function (n) { n.textContent = x[i]; }); });
      el.querySelectorAll('[data-mode]').forEach(function (n) { n.hidden = n.getAttribute('data-mode') !== m; });
      var setupM = sh * r / 12, maintM = mh * r, infra = d.infra[m], total = setupM + maintM + infra;
      set('rate', '$' + r + '/h'); set('setupH', sh); set('maintH', mh);
      set('setupM', fmt(setupM) + '/mo'); set('maintM', fmt(maintM) + '/mo'); set('infra', fmt(infra) + '/mo');
      set('total', fmt(total)); set('saveM', fmt(total - 19) + '/mo'); set('saveY', fmt((total - 19) * 12) + '/year');
    };
    rate.addEventListener('input', calc);
    el.querySelectorAll('input[name="rcx-infra"]').forEach(function (n) { n.addEventListener('change', calc); });
    calc();
  });
}
document.querySelectorAll(".rcx").forEach(wireCalc);
```
