# GlassFlow design-repo

AI-ready design system extracted from the GlassFlow clone (React + Vite + Tailwind v3) of
www.glassflow.ai. A generator composes **PageSpecs** (JSON) from the closed set of sections and
templates here; `schema/` validates them structurally and semantically.

**Status: design-review-pending, productionApproved false.** allowlistVersion 1.0.0 (machine-checked);
repositoryVersion / pageSpecVersion 1.1.0 (documentation-only, see `registry.manifest.json`.versionFieldNote).

## Counts (recomputed from disk by `extraction/verify_all.py`)

| count | value |
|---|---|
| foundationTokens | 126 |
| semanticTokens | 34 |
| primitives | 18 |
| components | 16 |
| sections | 68 |
| sectionVariants | 99 |
| templates | 17 |
| routes | 160 |
| pageRoutes | 133 |
| redirectRoutes | 27 |
| sitemapRoutes | 108 |
| sitemapRedirects | 18 |
| assetRoles | 11 |
| motionPatterns | 17 |
| graphRules | 20 |

Of the 160 routes, 108 are the live sitemap URLs (18 of them client redirects
via `<Navigate replace>`); the rest are reachable blog slugs from `src/data/posts.json` that the sitemap omits
(43 live posts + 9 non-live posts that redirect to /blog).

## Two design systems, never mixed
- **mars** (default): square, 1px `#5F3E1F` hairlines, brown/amber tokens. Chrome: `chrome.navbar` first, `chrome.footer` (incl. CTA band) last.
- **legacy-black**: the pre-rebrand ClickHouse-era system used only by `/categories/*` and the two guide pages. Chrome: `chrome.legacy-nav`; no global footer, no CTA band; rounded controls allowed.
- Rule `CHROME_FAMILY_NO_MIX` (graph + validator) rejects any mix; sections declare `family`.

## Layout
`tokens/` (00-foundation, 10-semantic, 20-component, 30-layout, themes, llm) · `primitives/` · `components/` · `sections/` (one contract per section type, variants inside) ·
`templates/templates.json` + `templates/routes.json` (kind page|redirect) · `compatibility/graph.json` · `assets/asset-roles.json` ·
`policies/` (forms, link-kinds, long-form-content, known-intentional-quirks) · `schema/` · `extraction/`.

## Hard rules a generator must respect
- **Real company.** Every media field is `{assetRole, ref, alt}` with a closed role enum. Real people's photos and product screenshots are `must-not-fabricate`; third-party/customer logos, GlassFlow marks, figurative Mars scenes, post covers are `must-reuse-exact`; only abstract dither textures and pixel icons are `may-generate-new`. Pinned roles are checked against an independent table.
- **Forms never submit to the live endpoint.** `endpointPolicy` is pinned to `must-not-reuse-live-endpoint` (schema const + verify_all pinned table + adversarial mutation to another valid value). Contact goes to /contact/success after a fake delay; the guide forms show an inline status.
- **Long-form is summary-only.** Post / case-study bodies, the /about story, legal texts and guide bodies are headings + one-line summaries + "Read the full ... on glassflow.ai". No prose keys, <= 2 sentences per summary, <= 600 outline words.
- **External domains are outbound links only** (closed host list in `policies/link-kinds.json`), plus one cal.com embed; never routes.
- **Motion is closed** to the measured patterns in `tokens/00-foundation/motion.json`; there are no scroll reveals, parallax or marquees. Every node carries the section's `reducedMotionFallback`.
- **Known-intentional quirks** (typos, missing privacy TOC entries, dead buttons) are kept on purpose: `policies/known-intentional-quirks.json`.

## Verify
Requires Python 3.8+ and `jsonschema` (`pip install jsonschema`); everything else is the standard library.
```
python3 schema/build_schema.py --check
python3 schema/semantic_validate.py schema/example.pagespec.json
python3 schema/tests/adversarial_test.py
python3 extraction/verify_all.py
python3 extraction/prove_drift.py      # injects one defect per check into scratch copies; each must be caught
```
`verify_all.py` resolves citations against the sibling project (`<design-repo>/..`); in a standalone copy
those checks degrade to warnings. `extraction/prove_drift.py` is the executable drift proof for every
verify_all check (its last recorded output is in CHANGELOG.md).

## Packaging
`design-repo.zip` is produced last with the CLI `zip`, excluding `.DS_Store`. The source project is not a git
repository, so the `.gitignore` / `git ls-files` zip check is N/A (recorded in the manifest).
