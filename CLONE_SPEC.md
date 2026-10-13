Source: https://www.glassflow.ai/

# CLONE_SPEC: glassflow.ai home (single route "/")

Measured live (Playwright, Chromium) at 1440x900, 810x1080, 390x844. Framer-built site (Framer generator 0da2bc6). Page title: "AI Agent Observability & Data Infrastructure | GlassFlow". Meta description: "Give AI agents the context they need and observe their actions. Built for both short & always-on, long-running agents. Open source, self-hosted." og:image https://framerusercontent.com/assets/PTY3z7Ur6ZW6KXa0gAPOKvtrsw.jpg, twitter:card summary_large_image. Favicon https://framerusercontent.com/images/KlTqdj1CNXfY3Rt6YyGbhGx1Dk.png, apple-touch-icon .../images/eP9e6kyl5GqdJSxaZ6dHvOLDsM.png.
Reference screenshots (live, taken by Recon): /Users/riyaghosh/V3/GLASSFLOW/.playwright-mcp/full-desktop.png, full-mobile.png, products-menu.png, hover-blog.png.

Total heights: desktop 5033px, tablet 6878px, mobile 7784px. No horizontal overflow at any width.

## 0. Global design language

Aesthetic: dark brown "Mars" terminal/blueprint. EVERYTHING IS SQUARE (border-radius 0 everywhere, no shadows, no gradients in CSS, no blur). Structure is drawn with 1px grid lines. Imagery is dithered/halftone Mars photography + product UI screenshots.

Color tokens (computed):
- page bg (body / outer gutters): `#492400` rgb(73,36,0)
- panel bg (cards, hero text panels, testimonial, FAQ rows, footer link cells): `#2D1804` rgb(45,24,4) (some bars use rgb(45,24,3) `#2D1803`, visually identical)
- darkest bg (nav bar, footer bg, "Works with" label cell, quickstart code panel body): `#1D0E00` rgb(29,14,0)
- grid line / border color: `#5F3E1F` rgb(95,62,31), 1px solid (Framer renders them as ::after pseudo 1px borders on 98 elements; replicate with plain 1px borders)
- accent amber: `#FFAC00` rgb(255,172,0) (buttons, badge bg, "first result" word, FAQ open toggle, nav CTA)
- link amber (inline product links): `#D48F04` rgb(212,143,4)
- cream text (primary): `#F1EFDF` rgb(241,239,223)
- muted nav text: `#8F8982` rgb(143,137,130)
- muted section label text: rgba(241,239,223,0.64)
- white text (FAQ questions, footer product names, person name): `#FFFFFF`
- text on amber: `#1D0E00`; quickstart button text rgb(52,29,3)/(57,34,3) (~`#341D03`)
- dropdown menu (products) bg white `#FFFFFF`, text dark (see nav).

Fonts (3 families):
- "Inter Display" 400 (Framer-hosted woff2; headings and body prose). Fallback `"Inter Display Placeholder", sans-serif`. Closest Google font: Inter (optical size "display"; use `font-variation-settings:"opsz" 32` or Inter Tight-like). Only weight 400 is used.
- "Inter" 400 (small UI paragraphs, fallback `"Inter Placeholder", sans-serif`).
- "Geist Mono" 400/500/700 + "Geist Mono Variable" 100-900 (Google Fonts, gstatic woff2 e.g. https://fonts.gstatic.com/s/geistmono/v6/or3nQ6H-1_WfwkMZI_qYFrcdmg.woff2). Fallback `monospace`. Use Google Fonts `Geist Mono:wght@400;500;700`.
- body font-family computed "sans-serif"; all text sets its own font.

Type roles (all desktop unless noted; letter-spacing "normal" = 0):
| role | font | size/line-height | weight | letter-spacing | color |
|---|---|---|---|---|---|
| H1 hero | Inter Display | 50px/50px | 400 | 0 | #F1EFDF |
| H2 section (tares/rius) | Inter Display | 40px/40px | 400 | 0 | #F1EFDF |
| H2 quickstart ("From install to first result in minutes.") | Inter Display | 40px/40px | 400 | 0 | cream; words "first result" #FFAC00 |
| H2 FAQ heading | Inter Display | 32px/32px | 400 | 0 | cream |
| Testimonial quote | Inter Display | 32px/32px | 400 | 0 | cream |
| Hero sub / lead | Inter Display | 18px/27px | 400 | -0.18px | cream; links #D48F04 |
| Body (product desc, quickstart sub) | Inter Display | 16px/24px | 400 | -0.18px | cream; links #D48F04 |
| FAQ answer | Inter Display | 16px/19.2px | 400 | 0 | cream |
| CTA band heading ("Start with Tares") | Inter Display | 24px/24px | 400 | 0 | cream |
| Nav links (products/docs/blog/contact) | Geist Mono | 14px/18.2px | 700 | 0 | #8F8982 |
| Nav CTA "get_started" | Geist Mono Variable | 14px/18.2px | 700 (wght 700) | 0 | #1D0E00 |
| Button label (hero/section) | Geist Mono | 14px/24px | 500 | -0.32px | #1D0E00 on amber; cream (#F1EFDF) on dark secondary buttons |
| Quickstart primary button label | Geist Mono | 14px/24px | 700 | -0.32px | ~#341D03 |
| Section label ("products", badge) | Geist Mono | 14px/18.2px | 700 | 0 | rgba(241,239,223,.64); badge text #1D0E00 |
| Card title bar mono ("glassflow-rius", "glassflow-tares") | Geist Mono | 14px/18.2px | 700 | 0 | #FFAC00 |
| Quickstart bullet label | Geist Mono | 14px/18.2px | 700 | 0 | cream |
| Quickstart bullet text | Geist Mono | 12px/18.2px | 400 | 0 | cream |
| "Works with the tools you already use." | Geist Mono | 14px/18.2px | 700 | 0 | cream |
| Person name | Geist Mono | 16px/18.2px | 700 | 0 | #fff |
| Person role / "Entire" | Geist Mono | 16px/18.2px | 700 | 0 | cream |
| FAQ question | Geist Mono | 14px/18.2px | 700 | 0 | #fff |
| Footer link / product title | Geist Mono | 14px/24px (title) and 14px/19.6px (desc, lowercase) | 700 title / 500 desc | -0.32px | #fff; footer small links rgba cream .64 700 |
| Copyright / Terms / Privacy | Geist Mono | 14px | 700-ish | 0 | cream |
Text-transform: product names in footer are lowercase ("tares","rius"); labels in source are literally lowercase with underscores (get_started, learn_more).

Responsive type: hero H1 / sub same at tablet; mobile quote 24px/24px (desktop/tablet 32px), mobile H2 tares/rius 32px/32px, mobile FAQ heading wraps (2 lines in 326px). Tablet quote 32px, H2 tares 32? (measured: tablet text list shows 40px quickstart, 32px quote; tares H2 same as mobile pattern 32px on mobile, 40px desktop).

Container / grid: outer page = full-width with 64px side gutters on desktop (content width 1312 = 1440-128, left edge x=64). Gutters (x 0-64 and 1376-1440) show page bg #492400 with vertical 1px border lines at x=64 and x=1376 (the content column is bordered). Tablet (810): gutters 32px, content 746. Mobile (390): gutters 0 in sections (content full-bleed 390; text padded 32px for hero/tares copy, 24px quickstart). Breakpoints (Framer): desktop >=1200? layouts observed: 1440 two-column; 810 stacked; 390 stacked. Switch from 2-col to stacked happens somewhere between 810 and 1440 (Framer default tablet <1200, mobile <810 — assume 1200/810).

Pixel-grid decoration: small 24x24 `#492400` squares (Rectangle 34628254/57/59/58) in top-right of FAQ heading panel (x 1328-1376, y 3850-3898, "checker" corner) and a pixel-stepped square pattern in left of FAQ heading (see screenshot); also dithered pixel blocks that fade across hero testimonial bg image and tares image (they are baked into the images).

## 1. Nav (top of page, NOT sticky)

- Measured: nav is `position: relative` at y=0, height 40px (+1px border overhang: wrapper 42px tall at y=-1). After scrolling 1800px its rect.y = -1800: it scrolls away, no fixed/sticky, no background change on scroll, no hide/show behavior.
- Bar: full width 1440, bg #1D0E00, padding 0 64px, then a 1312-wide bordered frame (1px #5F3E1F) with cells.
- Left cell: logo link "./" x=64..213 (149 wide x 42), padding 0 12px, logo = inline SVG background image 125x16 at x=76,y=12 (GlassFlow wordmark with orange/amber 3-stripe mark; svg data-URI; see ASSETS.md notes).
- Links group x=213..548, each cell bordered 1px #5F3E1F, bg #1D0E00, padding 3.06px 16px (visual 16px), gap 4px inside: "products" (113 wide, with 10x6 caret-down svg at x=300,y=17; opens dropdown), "docs" 66w, "blog" 66w, "contact" 91w. Cell height 40.
- Right: CTA "get_started" cell x=1223..1334 (111w x 40) bg #FFAC00 text #1D0E00 mono 14/700, padding ~3px 9px; next to it a 42x42 square with arrow-right icon (svg 42x42 at x=1334) bg #FFAC00. Total 153 x 42, right edge at x=1376.
- Products dropdown (opens on hover over "products"; measured links): white panel at x=212..712, y=40..175, two cells 250 wide each, 1px dark border between; each cell: 24x24 icon chip (cream bg, dark icon: stack/database icon for tares, eye icon for rius) at top-left with 20px pad, title mono 14/700 black ("tares", "rius"), description mono 14 / ~20px black-grey: "feed your agents the right data. open source." and "see what your agents did in production." Links: /tares and /rius. Appears overlaying hero image, instant-ish (Framer overlay, ~0.2s fade assumed; not precisely measured).
- Tablet 810: same nav, padding 32px (logo x=32, CTA right edge 778), products cell present (docs at x=294).
- Mobile 390: nav shows logo (x=12, 125x16) in cell width 149, then a cell x=149..237 (88 wide: this is the "products"-or-menu cell; text "tares" visible at x=18,y=51 = dropdown content hidden/closed state), CTA "get_started" cell x=237..348 (111w) amber, then 42x42 arrow square x=348..390. docs/blog/contact links are hidden on mobile (not visible in layout); the products cell's content rendering is Framer variant; treat mobile nav as: logo | (empty/menu cell, 88px) | get_started | arrow. Nav is 40px tall; a further 40px of page-bg spacer exists above hero on mobile (hero begins y=80). Desktop/tablet hero image begins y=40.
- Hover states: nav text cells and buttons showed NO measurable color change (computed bg/colors identical before/after hover; screenshot while hovering "blog" shows no change). Treat hover as cursor-pointer only, plus dropdown for products. Framer link `transition: all` computed with 0s duration. The big hero button when hovered looked identical to idle in the screenshot (double amber outline, see button).

## 2. Hero (y=40..719 on desktop, 679 tall; tablet 506 tall; mobile 702 tall)

Structure desktop:
1. Hero image band: y=40..441 (401 tall), x=64..1376 (1312 wide), `object-fit: cover`. Image https://framerusercontent.com/images/8Cuc5KELijZEPw8wCqEqzfspE.png (intrinsic 2950x892; served with ?scale-down-to=512/1024/2048). Dithered astronaut on Mars at sunset. Mobile: image 390x296 at y=80 (aspect ~ 4:3 crop, cover). Tablet: width 746.
2. Two panels row y=441..719 (278 tall), padding 0 64px, inner gap 32px?? measured: panel A x=64..704 (640w) bg #2D1804, panel B x=736..1376 (640w) bg #2D1804; gap between = 32px (shows page bg with vertical lines). Each panel has a 38px dark top "bar" (bg #2D1803... visually darker #1D0E00-ish band with three small amber/brown squares "..." icon at left x=79, 16px padding) — draw as a 38px bar (y=441..479) containing 3 tiny 6x6px squares, color ~#7a4a10 / amber at low opacity.
   - Left panel: H1 text at x=96 (32px inner left padding), vertically centered, width 576: "the data infrastructure for AI Agents in production" (wraps "the data infrastructure for / AI Agents in production"; per-word spans: the,data,infrastructure,for,AI,Agents,in,production - each word is a separate span for the load animation). 50px/50px cream.
   - Right panel: text block at x=768 (32px padding), width 576: "GlassFlow is one data layer for both sides of the agent: **GlassFlow Tares** feeds agents correlated data, and **GlassFlow Rius** traces and debugs every run." 18/27, -0.18px; links amber #D48F04 -> /tares and /rius. Below, button at y=621 (gap ~28px after text; text block y=524..605): "get_started" large button 197x52 at x=768.
   - Large button anatomy (197x52, outer bg #FFAC00 padding 4px): left part 145x52 (inner bordered area: padding 10px 24px, text box 89x24, inner border 1px dark brown inset, text "get_started" mono 14/500 #1D0E00, -0.32px) + right part 52x52 (inner 44x44 with 16x14 pixel arrow icon, arrow svg; there are two arrows "arrow" and "arrow-clone" stacked for a slide-through hover effect). Visual: amber outline double frame (outer 4px amber ring, inner dark-1px line). Secondary buttons (e.g. github/learn_more): bg #2D1804 / #492400 with 1px amber-ish border look, cream text.
   - Pixel arrow svg viewBox 0 0 16 14, path "M 0 6 L 0 8 L 16 8 L 16 6 Z M 12 8 L 12 10 L 14 10 L 14 8 Z M 10 10 L 10 1..." (pixel-art arrow pointing right; fill #1D0E00 on amber).
3. Spacer row y=719..786 with grid lines continuing (67px blank bordered band; rows are separated by full-width 1px lines at y=441, 719, 786).
4. "Works with the tools you already use." logo strip y=786..911 (125 tall): 5 equal-ish cells within 1312: first cell label x=64..344 (280w x 124, bg #1D0E00, padding 16px 32px, text mono 14/700 cream, 2 lines "Works with the tools you / already use."), then 4 logo cells ~258 wide each, bg transparent (page bg #492400? appears #2D1804 panel) separated by 1px lines: Vercel (logo 101x21 at x=423), Claude (112x24 at x=675), Cursor (101x24 at x=939), OpenAI (98x24 at x=1198). Logos are cream (#F1EFDF) inline SVG data-URIs (not network files).

Tablet hero: image 746x~?, panels stacked (single 746 column? hero row remains 2-up with 32px gap at 810: row y=268..546, gap 64? measured "Frame 2087326097 0,268,810,278 padding 0px 32px, gap 64px"). Mobile: H1 and sub stack, padding 32px sides, sub text 326 wide, button at x=60..? (centered label at x=60,y=712).

Load animation (hero): the H1 is split into 8 per-word spans (Framer text-appear effect: words fade/slide in with stagger). Exact timings could not be read from getAnimations() (none running at measurement time) — assume Framer "appear" default: opacity 0 -> 1, translateY ~ 20px, duration ~0.4-0.6s, ease-out, stagger ~0.05s/word. Mark as UNMEASURED; keep subtle.

## 3. Testimonial (y=911..1397 desktop, 486 tall; mobile 842; tablet 550)

- Outer panel x=64..1376, bg #2D1804, height 486, with full-bleed background image https://framerusercontent.com/images/7xhczrFmZXWm4XtTt3xdK5HjPSc.jpg (972x434 intrinsic, `object-fit: cover`, covers the 1312x386 upper area; dithered dark pixel field fading to right; mobile 390x642).
- Upper area 1312x386, padding 64px, inner column x=128..1312 (1184w), gap 32px.
  - Quote-mark/logo icon 34x34 (svg "Group 1321323845", amber rounded-square quote glyph) at x=128,y=975.
  - Quote text, x=128, w=800 (desktop), 32/32 cream: "…data is not just an asset but a fundamental building block to a company's success. It's through this vital resource that systems and teams learn, adapt, innovate, and provide unprecedented value, driving efficiencies and creating new opportunities. GlassFlow offers the tools to harness this data for AI.”" (opening is an ellipsis; closing curly quote ” only; apostrophe in "It’s" is typographic).
- Attribution row y=1297..1397 (100 tall), two cells 1px bordered: left cell x=64..~720: avatar 48x48 (object-fit cover) at x=181 using https://framerusercontent.com/images/es2dJiMp9kbISeoLCrGX80lfk.webp (525x700 crop to square), name "Thomas Dohmke" (white mono 16/700) at x=237, role "Co-founder & CEO" (cream mono 16/700, below, 22px lower); right cell: company logo square 48x48 at x=991 image https://framerusercontent.com/images/19uBUx6oMukcPigAH32CECUiCOU.jpg (400x400, black "Entire" logo tile) with text "Entire" (cream mono 16/700) next to it.
- Mobile: quote 24/24 at x=32 width 326; avatar 48 at x=24,y=1817; name x=80; company row below at y=1917.

## 4. Product 1: Tares (y=1464..2185 desktop; section 721 tall)

- Header "bar": y=1464..1514, 1312 wide, bg #2D1803, padding 16px, contains the label "products" mono 14/700 rgba(241,239,223,.64) centered (x≈686 center) preceded by the 3-dot "..." icon at left. Bar h=50 incl borders.
- Content: CSS grid 2 columns (656 + 656 = 1312), y=1514..2185 (671 tall). 
  - Left col (text, x=64..720): bg #2D1804, padding 64px, gap 64px (flex column, space between: top group then buttons). Contents top group: badge (134x26, bg #FFAC00, padding 4px, text "GlassFlow Tares" mono 14/700 #1D0E00) at x=128,y=1614; H2 (528 wide) "One correlated read over every system your agents touch." 40/40 at y=1673 (3 lines, 120 tall); para (528w) at y=1825: "Instead of your agent firing dozens of live tool calls at runtime (slow, expensive, inconsistent), **GlassFlow Tares** [link /tares + small external-arrow icon link https://tares.glassflow.ai/] prepares and delivers exactly the data each agent needs, already correlated across every source. One clean read replaces many brittle ones: less latency, fewer tokens, more reliable decisions." then empty paragraph spacer, then "Open source, self-hostable, and built on a production streaming core." (all 16/24, -0.18px). Buttons row at y=2033: "github" (80w? measured 132x52 outer at x=128; secondary dark-brown #492400 bg w/ amber-framed, label cream mono 14/500, includes a 52x52 GitHub-star/arrow icon cell at x=208) → https://github.com/glassflow/tares; "learn_more" (113x52 at x=268, bg #2D1804) → https://tares.glassflow.ai/. Gap between buttons 8px (x=260..268). The 52x52 icon is "Frame 2087325992" 52x52 svg (GitHub logo/arrow).
  - Right col (image, x=720..1376): img https://framerusercontent.com/images/QbnjXbaRacmtUbQLtN9sy4wEKw.png (1430x1284, cover, 656x671) — Tares dashboard "Sources" screenshot on Mars-dune backdrop (dithered pixel blocks top-left).
- Mobile: stacked; image first (390x400, block) then text col (padding 32px, gap 64px). Tablet: text first (746x494, padding 40px) then image 746x671.

Hero-of-section ordering: Tares: text LEFT, image RIGHT.

## 5. Product 2: Rius (y=2252..2973; 721 tall)

- Same bar at y=2252 (label "products").
- Grid 2 columns: image LEFT x=64..720, text RIGHT x=720..1376 (reversed vs Tares). Image: https://framerusercontent.com/images/RBpuXgGdzUNXmLFkFBttmTsnw.jpg (2141x1987, cover 656x671): Rius metrics dashboard (2,259 / 11,184 / 4,465 / 4.39s / $0.48 / 245k / 2.6% charts) on orange sunset astronaut silhouette.
- Text col (padding 64px, gap 64px, bg #2D1804): badge "GlassFlow Rius" (126x26, amber) at x=784,y=2387; H2 "Catch and debug agent failures in production." 40/40; paragraph: "Once agents are live, **GlassFlow Rius** [/rius] tells you what they did, why they failed, and how quality is changing. **Rius** [/rius] is built for any agent, running from short chat sessions to long-running agents that span across hours or days. Live metrics on running agents (not just the completed minority), heartbeat detection that flags a frozen agent instead of hiding it, and bidirectional MCP so Claude Code, Cursor or ChatGPT Codex can query a failure and open a PR with the fix. Every trace kept as long as you need it, not capped at 30 days" (no trailing period on live site). Buttons at y=2837: big "get_started" (173/121? outer amber 121x52 label + 52x52 arrow, total ~173x52) → https://console.rius-glassflow.com/signin?utm_source=glassflow&utm_medium=homepage&utm_campaign=signup&utm_content=core (inner nested link also https://console.rius-glassflow.com/signup?utm_source=framer.com&utm_medium=referral&utm_campaign=hp_start_cta), and "learn_more" (113x52, x=965) → https://rius.glassflow.ai/.
- Mobile: image first (400 tall) then text (padding 32, 702 tall) — for Rius the mobile order is text? Measured: Tares mobile: image y=2108 then text y=2508; Rius mobile: image y=3232 then text y=3632. So image first on both on mobile.

## 6. Quickstart (y=3040..3783 desktop, 743 tall; id="quickstart", target of "get_started" nav links)

- Full-bleed background image https://framerusercontent.com/images/ARgMqlYnmiFWpdywy7EoO9FO9vI.png (2652x1566, cover) on a 1312x743 frame x=64..1376 (mobile 390x1235): dark dithered Mars landscape.
- Frame padding 64px 24px, gap 32px, flex column, centered.
- Heading block (Frame 2087326054 at x=88, w=1264, y=3307..3719?) — header sits above cards: H2 centered: "From install to first result in minutes." with "first result" in #FFAC00 (40/40, wraps to 2 lines centered: "From install to first result / in minutes."), box 440 wide centered at x=500). Sub: line1 "Pick a product and follow the quickstart." (16/24 cream, centered) line2 "Both are copy-paste and run on your own machine, no waitlist. Up and running in minutes." (2 lines at 440 width, centered).
- Two cards side by side, each 490 wide, gap 8px (x=226..716 and x=724..1214; total 988 centered), each:
  - Title bar (Rectangle 34628322) y=3307..3349 (42 tall) bg #2D1803, 3-dot icon at left, centered mono label amber 14/700: "glassflow-rius" / "glassflow-tares".
  - Pitch box y=3349..3436 (87 tall) bg #2D1804, padding 16px, centered text (mono, 14px, amber/cream bold): Rius: "See your first agent run appear live." + line "Drop in the OTEL receiver, run your agent, and watch the trace stream in." Tares: "Deliver your first correlated data package. Install, connect your sources, and serve one clean read to an agent." (Rius title line is amber bold, sub line amber/cream bold mono ~14px; in screenshot all four are amber-ish centered).
  - Bullets box y=3436..3615 (179 tall) bg #1D0E00, padding 16px, gap 8px: 3 rows, each row has ">" mono marker (amber? cream) + label bold 14 + text 12 regular on next line:
    Rius: ">" "Long-running agents:" / "trace hours-long runs, lose nothing"; ">" "MCP both ways:" / "agents send traces; coding agents query back"; ">" "Replay any run:" / "reconstruct what happened last week".
    Tares: ">" "Cut token spend:" / "one clean read, not dozens of tool calls"; ">" "Kill latency:" / "data's ready before the agent asks"; ">" "One connection:" / "all your sources, unified".
  - Button stack y=3615..3719 (104 tall) bg #1D0E00, padding 4px, gap 8px: top full-width (482x44) bg #2D1804 padding 10px 12px centered cream mono 14 "open the rius quickstart" / "open the tares quickstart" → https://docs.glassflow.ai/rius/quickstart and /tares/quickstart; bottom full-width 482x44 bg #FFAC00, text "Start with rius" / "Start with tares" mono 14/700 dark, links https://console.rius-glassflow.com/signup?utm_source=framer.com&utm_medium=referral&utm_campaign=hp_start_cta and https://console.tares-glassflow.com/?utm_source=button&utm_medium=website&utm_campaign=hp_start_cta
- Mobile: cards stacked (342w each, x=24, gap 8), pitch box 105 tall.

## 7. FAQ (y=3850..4372; 522 tall)

- Heading panel y=3850..4010 (160 tall) x=64..1376 bg #2D1804 padding 64px 32px: H2 centered "Frequently Asked Questions" 32/32 cream (text width 392, centered at x=524). Decorative: pixel squares 24x24 bg #492400 at the top-right corner (x=1328..1376,y=3850..3898; four squares in a stepped pattern) and a "Group 1321323850" 72x48 svg at x=64,y=3962 (stepped pixel corner, bottom-left). Also 202x194 pixel-pattern svg bg on the footer-left.
- Accordion rows: 4 rows, each x=64..1376 (1312w), bg #492400, padding 17px 24px, gap 64px, 1px #5F3E1F border. Row 1 (open) y=4010..4150 (140 tall): question row 40 tall; the question text at x=88 width 640 mono 14/700 white, toggle square 40x40 bg #FFAC00 at right with 16x16 minus/arrow icon dark; answer 640w x 58 tall 16/19.2 cream. Rows 2-4 closed 74 tall each (4150, 4224, 4298): question text white mono 14/700, toggle 40x40 bg #492400-ish (darker, with white chevron-down 16x16 icon).
  Q1 (open by default): "What is GlassFlow?" A: "GlassFlow is the data infrastructure for AI agents in production. It has two products: GlassFlow Tares, which feeds agents correlated data from every system they touch, and GlassFlow Rius, which traces and debugs what agents do once they’re running."
  Q2: "What’s the difference between GlassFlow Tares and GlassFlow Rius?" Q3: "Is GlassFlow open source?" Q4: "What makes GlassFlow different for long-running agents?" (answers for Q2-Q4 are in the DOM only when opened; NOT captured — Recon did not expand them; build with placeholder/derive from site copy, or expand live site to read.)
- Interaction: click row toggles; the toggle icon swaps chevron/minus; open row has amber toggle. Row expand animation is Framer height tween (duration not measured; ~0.3s ease assumed).
- Tablet: rows at x=32..778; Mobile: question text wraps, rows 197 tall for open.

## 8. CTA band (y=4439..4759; 320 tall) just above footer (inside the "Desktop" footer wrapper, bg #1D0E00)

- Grid x=64..1376: left cell x=64..726 (662w x 320) image https://framerusercontent.com/images/p8ihsATIQW2BpC2j7ekzEF2gA.jpg (559x661, cover) with overlaid heading "Ready to give your agents better data and total recall?" (Inter Display 40px? appears ~32-40px white/cream, 3 lines at left x≈96); mobile image 390x160.
- Middle cell x=726..1051 (325w) bg image https://framerusercontent.com/images/dkWQcxyRjqORomn3COxNj6KgRl4.jpg (319x320) with overlay: title "Start with Tares" (Inter Display 24/24 cream, centered, y=4528), sub "Feed your agents the right data." (mono 12-14, cream), button "get_started" big (197x52 at x=790,y=4614) → https://console.tares-glassflow.com/
- Right cell x=1051..1376 (325w) bg image https://framerusercontent.com/images/ZsW3C35h6WXWKMkdVHcrVPc.jpg (319x320): "Start with Rius" / "See and debug agents in production." + button "get_started" at x=1115,y=4614 → https://console.rius-glassflow.com/signup?utm_source=glassflow&utm_medium=footer&utm_campaign=signup&utm_content=core
- Mobile: left image 390x160, then Tares 390x320, then Rius 390x320 (stacked; section 800 tall).

## 9. Footer (y=4759..5033 desktop; row 208 tall + legal bar)

- bg #1D0E00. Footer grid y=4759..4967 (208 tall), padding 0 64px, bordered cells:
  - Logo cell x=64..274 (202x194 svg pattern bg w/ GlassFlow logo wordmark centered, cream logo ~125x16 at x≈112,y≈4860).
  - "products" block x=282..1077 (795w): header bar y=4767..4817 (50 tall, bg #2D1803, label "products" mono 14/700 muted, centered ~x=680 w/ 3-dot icon at left); below two link cells 398x142 each (x=282..680 and 680..1078), padding 20px, each with 24x24 icon (stack icon for tares at x=302,y=4840; eye icon for rius at x=700) , title "tares" / "rius" (mono 14/700 white lowercase, 24px lh) and description mono 14/500 lowercase white 19.6px: "feed your agents the right data. open source" / "see what your agents did in production." Links /tares, /rius.
  - Link column x=1085..1260 (175w): 4 stacked cells 42 tall (y=4767,4817,4867,4917; gap 8px), bg #2D1803, padding 16px, gap 16px, 3-dot icon then label mono 14/700 muted: contact (/contact), docs (https://docs.glassflow.ai/), blog (/blog), about (/about).
  - Social column x=1268..1368: 3 icon cells (100x59 each, y=4767/4833/4900): X (https://x.com/glassflowdev), LinkedIn (https://www.linkedin.com/company/glassflow-dev/), GitHub (https://github.com/glassflow/tares). Icons 15-17px cream svg.
- Legal bar y=4967..5033 (≈66): padding 0 64px; items: "2026 - Copyright GlassFlow.ai" (left, x≈96), "Terms & Conditions" (center, /terms-of-service, x=707), "Privacy Policy" (right, /privacy-policy, x=1234..1352). Mono 14/700 cream, 1px top border.
- Mobile footer: stacked, tares/rius cards 24px padding.

## 10. Route/link inventory

Internal (relative to https://www.glassflow.ai/): / , /#quickstart (nav + hero + "get_started" CTAs), /tares, /rius, /blog, /contact, /about, /terms-of-service, /privacy-policy.
External: https://docs.glassflow.ai/ (nav "docs", footer "docs"), https://docs.glassflow.ai/rius/quickstart, https://docs.glassflow.ai/tares/quickstart, https://tares.glassflow.ai/, https://rius.glassflow.ai/, https://github.com/glassflow/tares, https://console.tares-glassflow.com/ (+ ?utm_source=button&utm_medium=website&utm_campaign=hp_start_cta), https://console.rius-glassflow.com/signin?utm_source=glassflow&utm_medium=homepage&utm_campaign=signup&utm_content=core, https://console.rius-glassflow.com/signup?utm_source=glassflow&utm_medium=footer&utm_campaign=signup&utm_content=core, https://console.rius-glassflow.com/signup?utm_source=framer.com&utm_medium=referral&utm_campaign=hp_start_cta, https://x.com/glassflowdev, https://www.linkedin.com/company/glassflow-dev/.
Nav: [logo -> /] products (dropdown: tares /tares, rius /rius) | docs | blog | contact || get_started -> /#quickstart.
Footer: tares, rius, contact, docs, blog, about, X, LinkedIn, GitHub, Terms & Conditions, Privacy Policy. Only the home page was measured; /tares, /rius, /blog, /contact, /about, /terms-of-service, /privacy-policy were not scraped.

## 11. Motion and scripting

- Lenis smooth scroll: injected inline script on page, loaded from https://unpkg.com/lenis@1.1.14/dist/lenis.min.js (also a copy in the saved _files folder `lenis.min.js`). Exact config from source:
  `new Lenis({ duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true })`, driven by `requestAnimationFrame(raf)` loop started on DOMContentLoaded. `<html class="lenis">`. Default direction vertical, no anchors config (the "#quickstart" anchor handled natively by Framer).
- Nav: no scroll behavior (scrolls away with page). No parallax detected (all transforms "none" at rest; no scroll-linked inline styles found); no CSS keyframe animations or transitions active (document.getAnimations() empty; computed transitions all "all 0s"). Framer's own appear effects (hero word reveal; section fade-ins) are driven by framer-motion at runtime: at measure time everything was already settled (opacity 1, transform none) so delays/easing are UNMEASURED. Reasonable replica: IntersectionObserver reveal, opacity 0->1 + translateY(12-20px)->0, 0.5s ease-out, hero H1 words staggered ~0.05s.
- Hover: dropdown opens on hover of "products". Buttons: no computed color change observable (Framer variant swaps may exist on the arrow "arrow"/"arrow-clone" duplicates — suggests arrow slide on hover; not verified visually). Add cursor:pointer and a subtle arrow slide as optional.
- No video, no canvas, no Lottie. No marquee (logo strip is static).
- Third-party scripts (not to replicate): GTM GTM-58F2TMS7, gtag G-WPH4STGXF1, Fathom, Hotjar 4962480, Apollo tracker, Reo, Leadsy, Trovo, GitHub buttons.js, Framer events.

## 12. Unmeasured / gaps
- FAQ answers for Q2-Q4 (collapsed DOM).
- Exact load/scroll animation timings (not observable post-settle).
- Exact hover colors (no change detected).
- Mobile hamburger behavior (no visible menu button; docs/blog/contact hidden at 390).
- Logo SVGs (Vercel/Claude/Cursor/OpenAI, GlassFlow wordmark, icons) are inline data-URI SVGs in the DOM; can be extracted from page source (`background-image: url("data:image/svg+xml,...")`) — see ASSETS.md.
