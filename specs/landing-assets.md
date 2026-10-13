Source: https://www.glassflow.ai/

# Landing / legal routes: image and SVG asset manifest

All raster/SVG files are on `https://framerusercontent.com/images/<hash>.<ext>`. Framer appends `?scale-down-to=512|1024|2048&width=W&height=H`. Download the base URL (no query) for the original.
Sizes:
- "box" = rendered px at 1440 (x,y,w,h, document coordinates);
- "nat" = intrinsic size at the loaded scale (the `width`/`height` query parameters give the original size).

Files already present in `/Users/riyaghosh/V3/GLASSFLOW/public/assets` are marked **[have]**.

## Shared (used by several templates)

| asset | where | box @1440 | notes |
|---|---|---|---|
| https://framerusercontent.com/images/p8ihsATIQW2BpC2j7ekzEF2gA.jpg **[have]** | T1 post hero left column bg; Footer CTA band left cell (all new-design pages) | 64,110,644,371 (hero) | orig 559x661, cover |
| https://framerusercontent.com/images/dkWQcxyRjqORomn3COxNj6KgRl4.jpg **[have]** | Footer CTA band "Start with Tares" | 726,y,325,320 | 319x320 |
| https://framerusercontent.com/images/ZsW3C35h6WXWKMkdVHcrVPc.jpg **[have]** | Footer CTA band "Start with Rius" | 1051,y,325,320 | 319x320 |
| https://framerusercontent.com/images/5G4h16OWSlfa4F2lERWRFPE.jpg | T1 post hero right panel bg (dithered orange pixel field) | 720,122,644,418 | orig 593x593, cover |
| inline data-URI SVG (pixel corner) | T1 post hero and T5 case-studies hero, top-left corner | 64,111,48,72 | `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 72"><path d="M 24 72 L 48 72 L 48 48 L 24 48 Z M 0 48 L 24 48 L 24 24 L 0 24 Z M 0 24 L 24 24 L 24 0 L 0 0 Z M 24 24 L 48 24 L 48 0 L 24 0 Z" fill="rgb(73,36,0)"/></svg>` |
| Navbar / Footer SVGs (wordmark, nav arrow cell, footer-pattern, icon-tares, icon-rius, x, linkedin, github, arrow) **[have]** in /assets/svg | Navbar, Footer | | identical to home |

## T1 blog posts

### Common to all 4 posts

| asset | section | box @1440 | notes |
|---|---|---|---|
| https://framerusercontent.com/images/h0ej46NDlXvCksM6LvlI4w4Ss.jpg | "Two products. Two starting points." CTA bg | 64,y,1312,452 | orig 3936x1500, cover (dithered yellow 3-stripe mark) |
| https://framerusercontent.com/images/wNMHfmYf3kJCGkAltRIs1mwpuLw.png | Related card 1 (Fraud Detection…) image | 64,y,437,250 | orig 5784x3228, cover |
| https://framerusercontent.com/images/f9lCjIJTOy8RiKh5PayI7bJO4I.jpg | Related card 2 (500k+ Events/Sec) image | 501,y,437,250 | orig 1236x721 |
| https://framerusercontent.com/images/BKXmb5NAzSTCwwy7rjAkhT2W448.jpeg | Related card 3 (Semi-Structured Data) image | 939,y,437,250 | orig 1154x649 |
| inline SVGs: share icons (22x22, `fill="currentColor"`, white) | Share bar | x 881…1141, step 52 | markup below |
| inline SVG sprite (`<use>`): person icon, calendar icon | Hero details row | 23x23 | paths not extracted (sprite ids svg205525157_688 / svg-1430816419_718); draw simple line icons |
| `Dots` primitive | breadcrumb bar, share bar, card bars | | existing |

Share icon markup (viewBox 0 0 24 24, rendered 22x22):
- X: `<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>`
- Facebook: `<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>`
- LinkedIn: `<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>`
- Reddit: the standard Simple Icons Reddit glyph (1173-char path; same as simpleicons.org "reddit"), fill currentColor.
- Copy: `fill="none" stroke="currentColor" stroke-width="2"`: `<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`
- Share: `fill="none" stroke="currentColor" stroke-width="2"`: `<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49"/>`

### Per post

**/blog/open-source-observability-clickstack-glassflow (from /clickstack)**

| asset | section | box @1440 | orig |
|---|---|---|---|
| https://framerusercontent.com/images/2H7CSL9l0NoquN1PyW3SwMuFE2Q.png | hero cover (contain); also og:image | 744,122,596,418 | 2308x1298 |
| https://framerusercontent.com/images/tUJLrWUiAaxxMQEGHnoT5vE1w.png | body, first block: deprecation banner (link to https://www.glassflow.ai/) | 321,652,798,149 | 1689x315 |
| https://framerusercontent.com/images/s07Dw6dDDI2JqlU5BZtJBN6r8MI.jpg | body: "Understanding ClickStack…" architecture figure | 320,2620,800,484 | 1768x1070 |
| https://framerusercontent.com/images/kVGsZWOm65XSmGPNZNHVie8590.jpg | body: "Architecture Patterns…" wide pipeline diagram | 320,6307,800,167 | 1768x370 |

**/blog/clickhouse-joins (from /joins)**

| asset | section | box @1440 | orig |
|---|---|---|---|
| https://framerusercontent.com/images/3hxsOE4L7XVTLV87Sf9Txk54M.jpeg | hero cover; og:image | 744,122,596,400 | 2308x1298 |
| https://framerusercontent.com/images/M5NeIIAwz6q2OtuL3OiMfnebIcg.png | body H3 "Inner Join" diagram | 320,3257,800,400 | 1601x801 |
| https://framerusercontent.com/images/g2R8mBOVpAcZydsCwIuGTnvCEk.png | body H3 "Left Outer Join" diagram | 320,4472,800,400 | 1601x801 |
| https://framerusercontent.com/images/HEdg8B9Z8O21Ua22w0smqF687eE.png | body H3 "Right Outer Join" diagram | 320,5749,800,400 | 1601x801 |
| https://framerusercontent.com/images/MjTjALrSvKUqooOp90MFFrEWpzs.png | body H3 "Full Outer Join" diagram | 320,7027,800,400 | 1601x801 |

**/blog/part-3-clickhouse-replacingmergetree-materialized-views-not-enough (from /replacingmergetree-alternative)**

| asset | section | box @1440 | orig |
|---|---|---|---|
| https://framerusercontent.com/images/bmoCJ0qMNk3pOZHS9O1RgkELr2g.svg | hero cover (SVG, contain); og:image | 744,122,596,448 | 1264x720 |
| https://framerusercontent.com/images/tUJLrWUiAaxxMQEGHnoT5vE1w.png | body, first block: deprecation banner | 321,682,798,149 | 1689x315 |

**/blog/when-vector-becomes-your-streaming-engine (from /vector-dev-alternative)**

| asset | section | box @1440 | orig |
|---|---|---|---|
| https://framerusercontent.com/images/An04fpR6GVV6jHuH4S5T3Z6jGE.png | hero cover; og:image | 744,122,596,370 | 1154x649 |
| (none) | body has no images | | |

## T2 / T3 legal (/terms-of-service, /privacy-policy, /imprint)

| asset | section | notes |
|---|---|---|
| (none page-specific) | | Only the shared Navbar/Footer/CTA-band assets load |
| https://framerusercontent.com/assets/55pSz2A6Vkt6lHiYRmUXFqvUWhw.jpg | og:image (meta only) for all three | |

## T4 legacy guide pages

| asset | section | box @1440 | notes |
|---|---|---|---|
| https://framerusercontent.com/images/uJSz4vz8ntpPgNuLAZrGGPBhGFo.svg | legacy nav logo (GlassFlow wordmark, white text) | 110,23,114,16 | 300x42 intrinsic |
| inline data-URI SVG chevron | legacy nav "Product" / "Resources" carets | 14x14 | `<svg viewBox="0 0 14 14"><path d="M 3 5.5 L 7 9.5 L 11 5.5" fill="transparent" stroke-width="2" stroke="#aaa" stroke-linecap="round" stroke-linejoin="round"/></svg>` |
| inline SVG hamburger (16x12) | legacy mobile nav | 346,25 @390 | 3-line menu icon, white |
| https://framerusercontent.com/images/i7Uti49dVPGVtAs2iCwnJBnuWso.png | top-right dark grid tile decoration (both pages) | 839,0,601,509 | 1226x1018, cover |
| https://framerusercontent.com/images/k68ifFtfMbT8As7lCeihZaxTO6w.png | checklist icon (green check circle), 3x per page | 110,437,24,24 | 48x48 |
| https://framerusercontent.com/images/eMUNSXzDARdSsMat78pTslrdn4.png | Kafka guide: hero background (blue pixel grid glow + tablet mock-up on rock) | -150,178,1740,833 | 1742x1344, contain |
| https://framerusercontent.com/images/4OxP9MgO3bmtsoyWUD8aGGIWXM.png | Mistakes guide: tablet mock-up "10 Most Common ClickHouse Mistakes" on rock | 864,331,905,604 | 1041x695, cover |
| https://framerusercontent.com/assets/m5c9zhRXC5QD84a464obnLQ2vno.jpg | Kafka guide og:image (meta only) | | |
| https://framerusercontent.com/assets/8Gg0fHHa3qdFTQXjVqsz3naE.png | Mistakes guide og:image (meta only) | | |
| GitHub star widget | nav right | 1160,16,170,28 | rendered by https://buttons.github.io/buttons.js (`a.github-button` → https://github.com/glassflow/clickhouse-etl); not a static asset |
| HubSpot form | hero form | iframe | https://js-eu1.hsforms.net/forms/shell.js, portal 139646698, forms 4ba457ad-a3ee-4dde-a34f-6318380d20d3 (Kafka) / 51d896a2-def6-4113-b5c1-235063f350d7 (Mistakes); external embed |

## T5 /case-studies (from /use-cases/real-time-observability-pipelines)

| asset | section | box @1440 | notes |
|---|---|---|---|
| https://framerusercontent.com/images/gGgprOgbK8sImEo5X3oHCssBw0w.jpg | hero heading panel bg (dithered mountain) | 64,110,1312,263 | 800x160 (scaled), contain |
| https://framerusercontent.com/images/gU6Xy4ekBJSu57RtzjJJ0U3x1Q.svg | card 1 logo: restack | 92,401,71,30 | 1000x425 |
| https://framerusercontent.com/images/71EJsST8RQxnFwMo7Alb9eWZXcI.svg | card 2 logo: nubrain | 746,401,134,30 | 89x20 |
| 48x72 pixel corner (shared, above) | hero top-left | 64,111 | |
| https://framerusercontent.com/images/PTY3z7Ur6ZW6KXa0gAPOKvtrsw.jpg **[have]** | og:image | | home og |

## /blog (from /kafka-to-clickhouse-connector): above-the-fold only

| asset | section | box @1440 |
|---|---|---|
| https://framerusercontent.com/images/fpSmMnbghTzYJNtWqkUhZjTF1UE.jpg | blog index hero bg | 64,72,1312,310 (1312x693) |
| https://framerusercontent.com/images/YiSYWMdzERJyLVRZRpiutPwoGI.jpg | featured card image-panel bg | 708,432,668,412 (559x661) |
| https://framerusercontent.com/images/mFirefQhQKw3QXF3cpXhF7l4sLw.png | featured post image | 720,444,644,388 (1300x784) |
| 118 CMS card thumbnails | blog grid | 424x242 each. Not listed here: CMS-driven, belongs to the blog-index spec |
