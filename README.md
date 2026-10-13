# GlassFlow clone

A local React 18 + Vite + Tailwind v3 replica of https://www.glassflow.ai/, built for reference. It is not affiliated with GlassFlow. The text, imagery and logos belong to GlassFlow and to the third parties shown (Vercel, Anthropic/Claude, Cursor, OpenAI and others), so don't deploy it publicly as-is.

```bash
npm install
npm run dev        # http://localhost:5301/
```

## Information architecture

| file | edit? | what it is |
|---|---|---|
| `ia.json` | **yes, the only file to hand-edit** | categories, sections (each defined once, with `implementedBy` pointing at the real component) and templates (ordered section lists with routes) |
| `IA.md` | no, generated | readable IA: template share, chrome partition, section reuse, per-template tables, section reference |
| `matrix.csv` | no, generated | section × template matrix |
| `validate.mjs`, `build.mjs` | no | generic scripts from the ia-builder skill |

After changing routes or pages, edit `ia.json` and re-run:

```bash
node validate.mjs && node build.mjs
```

### What the data shows

- **Most routes come from one template.** 64 of the 108 sitemap routes (59%) are blog posts from a single template, and 18 (17%) are client-side redirects with no content. The rest of the site is 26 routes spread over 17 templates, and most of those templates serve a single route.
- **Little is shared outside the chrome.** Of 71 sections, 21 are used by more than one template and 50 are page-local. Apart from the navbar, CTA band and footer (on all 81 main-design routes), the only widely shared block is `conversion.two-products-band` (69 routes: the blog, posts, case studies, about and contact). The FAQ and testimonial appear on 4 routes each.
- **There are two design systems.** 81 routes use the main brown/amber design with the global nav, CTA band and footer. 9 routes (7 category pages and 2 ebook guides) use the older black design, which has its own header and no footer. The two chromes never appear together on one template.
- **The two alternatives pages are separate templates.** They share most sections but differ in three per-vendor blocks: Arize has the install steps, and Langfuse has the side-by-side and better-pick blocks. They are kept as two templates so each section list is literally true.

### Notes before you "fix" a number

- **Scope sentences list parts, not totals.** `validate.mjs` reports three informational notes (`chrome.legacy-nav` 7 + 2 = 9; `proof.testimonial` and `conversion.two-products-band` mentioning "the 2 case-study pages"). Those scope sentences name sub-groups of the computed total, so both numbers are correct; don't edit one to match the other.
- **Clone-only routes aren't counted.** The route set is the original's `sitemap.xml`. The clone's `/blog/:slug` route also serves 43 live posts that are linked from /blog cards but missing from the sitemap, and redirects 9 more retired post slugs to `/blog`. Those 52 clone-only routes are not counted in `ia.json`.
- **Long-form bodies are summaries.** Blog articles, case studies, legal pages, the /about story and the guides render only their heading outline, a one-line summary per heading, and a link to the full original on glassflow.ai.
- **Forms never submit to the live site.** The contact and guide forms don't post to GlassFlow's live HubSpot form; submitting fakes a delay and shows the success state.
- **Spacers aren't sections.** The 67px gap bands between sections (`ui.jsx > Spacer`) are layout rhythm and are deliberately not modelled as sections.
