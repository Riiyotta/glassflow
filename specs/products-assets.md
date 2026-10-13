Source: https://www.glassflow.ai/

# Product pages: asset manifest

Companion to `/Users/riyaghosh/V3/GLASSFLOW/specs/products.md`. Raster URLs are the base Framer URLs; download them without query params to get the original. "Original" sizes come from Framer's `width=`/`height=` query params; display sizes are measured at 1440. Assets already listed in `/Users/riyaghosh/V3/GLASSFLOW/ASSETS.md` (home) are marked **[home]**.

/product, /integrations and /proof-of-concept 308-redirect to `/`, and /enterprise 308-redirects to `/rius/pricing`, so they have no assets of their own.

## Shared on every product page
| section | display | original | URL |
|---|---|---|---|
| CTA band left **[home]** | 662x320 cover | 559x661 jpg | https://framerusercontent.com/images/p8ihsATIQW2BpC2j7ekzEF2gA.jpg |
| CTA band Tares cell **[home]** | 325x320 | 319x320 jpg | https://framerusercontent.com/images/dkWQcxyRjqORomn3COxNj6KgRl4.jpg |
| CTA band Rius cell **[home]** | 325x320 | 319x320 jpg | https://framerusercontent.com/images/ZsW3C35h6WXWKMkdVHcrVPc.jpg |
| Nav and footer SVGs (logo, arrow, caret, social, dropdown icons) **[home]** | | inline data-URI | see ASSETS.md |

## /tares
| section | display (1440) | original | URL |
|---|---|---|---|
| og:image | | jpg | https://framerusercontent.com/assets/alqOg336j7veNdgfpbVpzbrQR4.jpg |
| Hero left image (behind H1) | 644x592 cover | 1428x1320 jpg | https://framerusercontent.com/images/TBMiwA4xBut87o4aLpVaFd9bjq0.jpg |
| Hero right image | 668x592 cover | 1429x1319 jpg | https://framerusercontent.com/images/gHnD0OdArW5qQdvx69aQhJaArJk.jpg |
| "What teams build" card 1 (An AI SRE) | 328x300 cover | 329x375 jpg | https://framerusercontent.com/images/DiH9BEHyAmD3YzKMDiSCmJzne8.jpg |
| card 2 (context repo) | 328x300 | 329x375 jpg | https://framerusercontent.com/images/xIq1GQ7z3r1Ptn37Mi5lbPB0W4w.jpg |
| card 3 (triage agent) | 328x300 | 329x375 jpg | https://framerusercontent.com/images/yp8B5z0VsH2VoROmeiA7wpDyTxA.jpg |
| card 4 (better read path) | 328x300 | 329x375 jpg | https://framerusercontent.com/images/npJU6yM3NivZG6Lgj3b9ihnEXPY.jpg |
| "What is in Tares" tab 01 image (default) | 656x548 cover | 1312x1208 png | https://framerusercontent.com/images/CuYhVCgpunml0AFh27rgIeYdlOI.png |
| tab 02 image (loaded on click) | 656x548 | jpg (656x604 variant observed) | https://framerusercontent.com/images/H6fLrCMmzzk6wbPFSMlmHRAjMw.jpg |
| tab 03 image | 656x548 | jpg (656x604 variant observed) | https://framerusercontent.com/images/WylXMWoX6XhNVJMpsK1mCHmgP20.jpg |
| tab 04 image | 656x548 | jpg (656x604 variant observed) | https://framerusercontent.com/images/qO6OS4QHZfzEhywgrLBqkKq8dDg.jpg |
| "From event to finding" band bg and "Run it in two commands" bg **[home quickstart bg]** | 1312x211 and 1312x466 cover | 2652x1566 png | https://framerusercontent.com/images/ARgMqlYnmiFWpdywy7EoO9FO9vI.png |
| Closing CTA "Connect any source..." bg | 1312x364 cover | 3936x1500 jpg | https://framerusercontent.com/images/h0ej46NDlXvCksM6LvlI4w4Ss.jpg |

Inline SVGs on /tares (data-URI `background-image` or inline `<svg>`; no network URL; extract from the live DOM via `getComputedStyle(el).backgroundImage`):
- Hero and "What is in Tares" top bar: right-side pixel graphic, 58x12.
- Hero image top-left pixel corner pattern, 48x72.
- "What teams build" card icons, 64x64 x4 (cream pixel art).
- Timeline marker `icon-box`, 24x24 x6.
- FAQ: corner pattern 72x48 **[home]**, toggle icons 16x16 **[home]**.
- BigButton arrow and arrow-clone 16x14 **[home]**.

## /rius
| section | display (1440) | original | URL |
|---|---|---|---|
| og:image | | jpg | https://framerusercontent.com/assets/eiEYcN5Y14sh6UGCu4l4BOWru8.jpg |
| Hero top bar right graphic | 58x12 | 121x29 **svg** | https://framerusercontent.com/images/rBnv8VCnmqKbBweg6ki6cG0pAQ.svg |
| Hero left image (shared with /tares) | 644x592 cover | 1428x1320 jpg | https://framerusercontent.com/images/TBMiwA4xBut87o4aLpVaFd9bjq0.jpg |
| Hero right image | 668x592 cover | 1429x1319 jpg | https://framerusercontent.com/images/WrecUgpaG7OyoHyzr12sCjsrOLg.jpg |
| Testimonial bg **[home]** | 1312x242 cover | 972x434 jpg | https://framerusercontent.com/images/7xhczrFmZXWm4XtTt3xdK5HjPSc.jpg |
| Testimonial avatar (Andres Almansa) | 48x48 cover | 200x200 png | https://framerusercontent.com/images/AvNQPA2KLw0PJ8qQYPYqet4URQ.png |
| Testimonial company logo (Restack) | 48x48 cover | 200x200 jpeg | https://framerusercontent.com/images/oIbDPvgphfWTFE1bRAFoKFR51po.jpeg |
| Retrospective left image | 656x530 cover | 1234x1176 jpg | https://framerusercontent.com/images/cz4OCmAigDhK3lTGZTCj6JubaE0.jpg |
| Retrospective **Lottie** ("session - agent_ops_007") | 400x405 canvas | Lottie JSON 5.7.5, 437.59x416.99, 60fps, 918 frames | https://framerusercontent.com/assets/vUQ6vAk7qnGO0kq09zG3qaBBo.json |
| Lottie player runtime (live uses this; any Lottie player works) | | wasm | https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web@0.65.0/dist/dotlottie-player.wasm |
| "Agents aren't one length" left image (also /rius/pricing add-ons) | 525x450 cover | 870x972 jpg | https://framerusercontent.com/images/CF2a8yg6rUJQ9kRH8Qk75fHGhhk.jpg |
| "Agents aren't one length" right image | 787x490 cover | 1754x972 jpg | https://framerusercontent.com/images/kwNUTQWIQPqbu8DejioFKvDd4k.jpg |
| "How it works" card Instrument | 437x300 cover | 875x748 jpg | https://framerusercontent.com/images/i3v7FwXRVHAclAvgY9c6xaZNKOg.jpg |
| "How it works" card Watch | 437x300 | 875x748 jpg | https://framerusercontent.com/images/iCcMvtgsRs2G4yPcJQcjES1s.jpg |
| "How it works" card Act | 437x300 | 875x748 jpg | https://framerusercontent.com/images/hfNqoTWQ35URgwfQOvzzyJFpR1I.jpg |
| "What you get": Long-running agents | 652x300 cover | 1312x1068 png | https://framerusercontent.com/images/ypPPtAmKs7GN5EUUsnZFHaup5fU.png |
| "What you get": Query via MCP | 652x300 | 1312x872 png | https://framerusercontent.com/images/C30wyrelJdoqD8SJLxqY6WaUMQ.png |
| "What you get": Privacy Controls | 652x300 | 2017x1392 png | https://framerusercontent.com/images/RO233ORpmhdwm5ELT37gnlWU3Y.png |
| "What you get": Collab with your team | 652x300 | 2109x1331 png | https://framerusercontent.com/images/VE4uzuRtCj4sgehabFjku1AR1k.png |
| Quickstart bg **[home]** | 1312x667 cover | 2652x1566 png | https://framerusercontent.com/images/ARgMqlYnmiFWpdywy7EoO9FO9vI.png |
| cta-xs "Explore the Rius plans" bg | 1056x104 cover | 913x123 jpg | https://framerusercontent.com/images/h5Uv5LSjJ15Dll5BV8VwMsW3oo.jpg |
| Blog card 1 (decision-model-vs-llm) | 652x373 cover | 1300x784 png | https://framerusercontent.com/images/mFirefQhQKw3QXF3cpXhF7l4sLw.png |
| Blog card 2 (detect silent failures) | 652x373 | 1300x784 png | https://framerusercontent.com/images/DK46aveL39yduU5qMbUqGPAWoI.png |

Inline SVGs on /rius (data-URI, no URL):
- Hero image pixel corner 48x72.
- Benefits strip icons 24x24 x4 (Long-running agents, Query via MCP, Privacy Controls, Collab with your team).
- Social-proof logos (cream): Restack 66x28, nubrain 93x21, Sentri 120x16, Entire 100x25, Weaviate 122x18, sference 92x18.
- Quote icon 34x34 **[home]**.
- "Agents" table row icons 32x32 x4.
- "How it works" card icons 64x64 x3.
- Plan card icons 40x40 x4.
- cta-xs icon 40x40.
- FAQ icons **[home]**.

## /rius/pricing (also /enterprise)
| section | display (1440) | original | URL |
|---|---|---|---|
| og:image | | jpg | https://framerusercontent.com/assets/h3ZXI7Ec2JQjiJL74yzMBFnsE.jpg |
| Hero right image | 656x439 cover | 656x435 jpg | https://framerusercontent.com/images/JNirgiJudYykrpH4soF4CcOqbI.jpg |
| Add-ons left image (shared with /rius) | 394x642 cover | 870x972 jpg | https://framerusercontent.com/images/CF2a8yg6rUJQ9kRH8Qk75fHGhhk.jpg |
| Calculator banner bg | 1312x450 cover | 1429x1284 png | https://framerusercontent.com/images/VKjI50ZtcspgwHCXdPDhyKc3A0.png |
| Closing CTA bg (shared with /tares) | 1312x428 cover | 3936x1500 jpg | https://framerusercontent.com/images/h0ej46NDlXvCksM6LvlI4w4Ss.jpg |

Inline SVGs on /rius/pricing:
- Plan header icons 40x40 x4: `<img src="data:image/svg+xml,...">` with a 1px rgb(95,62,31) square outline and cream pixel glyphs (Core person, Growth trend arrow, Pro book, Enterprise building).
- Table check marks 18x18 (viewBox 24).
- "In every plan" item icons 24x24 x7.
- Add-on card icons 40x40 x7.
- FAQ icons **[home]**; BigButton arrows **[home]**.

## /rius/alternatives/arize and /rius/alternatives/langfuse
No network images. All imagery is base64 inside the iframe `srcdoc` (fetch it from the live page with `document.querySelector('iframe').getAttribute('srcdoc')`).

| page | section | intrinsic | alt text |
|---|---|---|---|
| arize | hero screenshot | 2600x1440 (base64 PNG/JPG) | "Rius Home dashboard: traces, spans, LLM calls, cost, tokens and error ..." |
| langfuse | hero screenshot | 2600x1440 | "Rius alert view: tool loop detected on checkout-agent with root-cause ..." |
| both | logos (SVG data-URI, cream) | 300w each: Restack 300x127, nubrain 300x68, Sentri 300x40, Entire 300x75, Weaviate 300x46, sference 300x59 | company names |
| both | quote avatar | 96x96 | "Andres Almansa" |
| both | quote company logo | 96x96 | "Restack" |
| both | RCA split screenshot | 1350x1500 | "Rius root-cause analysis with suggested next actions" |
| arize | users view split | 1400x940 | "Rius users view" |
| arize | MCP view split | 1400x940 | "Rius MCP view: clients, sessions, tool calls and answer rate" |
| both | `.bar .tag .rl` Rius wordmark (CSS background) | displayed 58x14 | (decorative) |
| both | chip icons (inline `<svg>`, amber) | | Silent failure detection / MCP Observability / Live spans / Agent heartbeats |

og:image: arize https://framerusercontent.com/assets/55pSz2A6Vkt6lHiYRmUXFqvUWhw.jpg ; langfuse uses the site default https://framerusercontent.com/images/PTY3z7Ur6ZW6KXa0gAPOKvtrsw.jpg.

Embed fonts (Google Fonts CSS, loaded inside the srcdoc): https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;700&family=Inter:opsz,wght@14..32,400;14..32,500;14..32,700&display=swap

## /rius/calculator-building-your-own-agent-observability
No images. The calculator uses system fonts (-apple-system / SF Mono stack) and Unicode glyphs only (▾ ▲ ✓ ⓘ 🔎). og:image is the site default https://framerusercontent.com/images/PTY3z7Ur6ZW6KXa0gAPOKvtrsw.jpg.

Live component bundle (reference only; logic is fully transcribed in products.md §6.3): https://framerusercontent.com/sites/3jBdF0EvQEVVQnUArWeyte/lBRZtZnE7tgAuuwZY7rv-I_JwFc6BCdzp3whhowHMOM.B-DapkxG.mjs

## Fonts loaded on these pages
- Geist Mono (Google, gstatic):
  - https://fonts.gstatic.com/s/geistmono/v6/or3nQ6H-1_WfwkMZI_qYFrcdmg.woff2
  - https://fonts.gstatic.com/s/geistmono/v6/or3nQ6H-1_WfwkMZI_qYFrcdmhHkjko.woff2
  - https://fonts.gstatic.com/s/geistmono/v6/or3yQ6H-1_WfwkMZI_qYPLs1a-t7PU0AbeE9KJ5W7ihaO_CS.woff2
  - https://fonts.gstatic.com/s/geistmono/v6/or3yQ6H-1_WfwkMZI_qYPLs1a-t7PU0AbeEPKJ5W7ihaO_CS.woff2
  - https://fonts.gstatic.com/s/geistmono/v6/or3yQ6H-1_WfwkMZI_qYPLs1a-t7PU0AbeHaL55W7ihaO_CS.woff2
- Framer-hosted (Inter Display / Inter subsets):
  - https://framerusercontent.com/assets/bHYNJqzTyl2lqvmMiRRS6Y16Es.woff2
  - https://framerusercontent.com/assets/vQyevYAyHtARFwPqUzQGpnDs.woff2
  - https://framerusercontent.com/assets/iwWTDc49ENF2tCHbqlNARXw6Ug.woff2
  - https://framerusercontent.com/assets/qITWJ2WdG0wrgQPDb8lvnYnTXDg.woff2
  - https://framerusercontent.com/assets/PfdOpgzFf7N2Uye9JX7xRKYTgSc.woff2
