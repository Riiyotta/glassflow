# GlassFlow asset manifest (Source: https://www.glassflow.ai/)

Raster images (download the base URL without query params for the original; Framer also serves ?scale-down-to=512|1024|2048&width=..&height=.. variants). Copies already exist in `/Users/riyaghosh/V3/GLASSFLOW/AI Agent Observability & Data Infrastructure _ GlassFlow_files/` under the same filenames.

| Section | Display size (desktop) | Intrinsic | URL |
|---|---|---|---|
| Hero band | 1312x401 cover | 2950x892 png | https://framerusercontent.com/images/8Cuc5KELijZEPw8wCqEqzfspE.png |
| Testimonial bg | 1312x386 cover | 972x434 jpg | https://framerusercontent.com/images/7xhczrFmZXWm4XtTt3xdK5HjPSc.jpg |
| Testimonial avatar (Thomas Dohmke) | 48x48 cover | 525x700 webp | https://framerusercontent.com/images/es2dJiMp9kbISeoLCrGX80lfk.webp |
| Testimonial company tile (Entire) | 48x48 cover | 400x400 jpg | https://framerusercontent.com/images/19uBUx6oMukcPigAH32CECUiCOU.jpg |
| Tares section image (right col) | 656x671 cover | 1430x1284 png | https://framerusercontent.com/images/QbnjXbaRacmtUbQLtN9sy4wEKw.png |
| Rius section image (left col) | 656x671 cover | 2141x1987 jpg | https://framerusercontent.com/images/RBpuXgGdzUNXmLFkFBttmTsnw.jpg |
| Quickstart bg | 1312x743 cover | 2652x1566 png | https://framerusercontent.com/images/ARgMqlYnmiFWpdywy7EoO9FO9vI.png |
| CTA band left image | 662x320 cover | 559x661 jpg | https://framerusercontent.com/images/p8ihsATIQW2BpC2j7ekzEF2gA.jpg |
| CTA band Tares cell bg | 325x320 cover | 319x320 jpg | https://framerusercontent.com/images/dkWQcxyRjqORomn3COxNj6KgRl4.jpg |
| CTA band Rius cell bg | 325x320 cover | 319x320 jpg | https://framerusercontent.com/images/ZsW3C35h6WXWKMkdVHcrVPc.jpg |
| Favicon | - | png | https://framerusercontent.com/images/KlTqdj1CNXfY3Rt6YyGbhGx1Dk.png |
| Apple touch icon | - | png | https://framerusercontent.com/images/eP9e6kyl5GqdJSxaZ6dHvOLDsM.png |
| OG image | 1200x630-ish | jpg | https://framerusercontent.com/assets/PTY3z7Ur6ZW6KXa0gAPOKvtrsw.jpg |

Inline SVG (no network URL; embedded in the DOM as data-URI backgrounds or inline `<svg>`; extract from the live DOM via `getComputedStyle(el).backgroundImage`, or from the saved HTML file):
- Nav/footer GlassFlow wordmark: 124.51x15.96 (rendered 125x16), svg viewBox 0 0 124.51 15.963.
- Pixel arrow-right icon: 16x14 viewBox (used in all big buttons, nav CTA 42x42 cell, footer cells).
- Nav caret-down: 10x6.
- Logo strip (cream): Vercel 101x21, Claude 111.7x24, Cursor 101x24 (viewBox 100.978x24), OpenAI 97.5x24.
- Quote icon 34x34, 52x52 button icon (GitHub/arrow), 72x48 FAQ corner pattern, 202x194 footer logo-cell pattern (fills rgb(45,24,4)).
- 16x16 FAQ/icon sprites (4 on FAQ rows), social icons X (16x16), LinkedIn (15x15), GitHub (16.7x16.3).
- Dropdown/footer icons 24x24 (stack icon for tares, eye icon for rius).

Fonts:
- Inter Display 400 and Inter 400: Framer-hosted woff2 under https://framerusercontent.com/assets/*.woff2 (exact file for the Latin subset not isolated; use Google Fonts "Inter" with opsz axis as substitute).
- Geist Mono 400/500/700 + Variable: Google Fonts, e.g. https://fonts.gstatic.com/s/geistmono/v6/or3nQ6H-1_WfwkMZI_qYFrcdmg.woff2 (Latin) -- easiest: `https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;700&display=swap`.

Scripts: Lenis https://unpkg.com/lenis@1.1.14/dist/lenis.min.js (config in CLONE_SPEC.md section 11).

Reference screenshots (live): /Users/riyaghosh/V3/GLASSFLOW/.playwright-mcp/full-desktop.png, full-mobile.png, products-menu.png, hover-blog.png
