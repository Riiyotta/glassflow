# CHANGELOG

## 1.1.0 (2026-10-13), source refresh. Status: design-review-pending

Two pixel-audit fix passes changed 19 source files after 1.0.0 (list in extraction/measured-values.json `sourceChangesSinceV1_0`), and
79 citations broke. Every affected fact was re-derived from the current source rather than re-pointed. Unless stated otherwise, each change below is a SOURCE change, not a 1.0.0 contract error. tailwind.config.js, index.css and the assets did not change.

### Contract changes (what changed, not just line numbers)
- **layout.spacer**: two new variants. `divider-30-tablet-up` is the /rius under-nav divider, hidden below 810. `band-70` is the 72px band before the /rius/pricing calculator banner. `top-64` is now documented as desktop-only. Templates updated: product-rius starts `navbar, divider-30-tablet-up`; pricing has `add-ons, band-70, calculator-banner`.
- **pricing.comparison-table** (breaking): the component was rewritten as flex row groups.
  - Plans are now objects `{name, price, cta, highlight, icon}`, since each header cell carries a text-roll CTA.
  - Rows are `{label, values}` OR `{band}` (e.g. SUPPORT).
  - Motion: `text-roll`.
  - Responsive widths: label 160/200/200, plans 140/160/278, value padding 32/40/12.
- **pricing.add-ons**: max items 4 -> 8. The source has 7 add-ons; 1.0.0's limit of 4 was wrong even then. Tablet: 4-column grid, 642px tall, title panel 184px.
- **pricing.every-plan**: one grid filled row by row (interleaved), 1 -> 2 columns from 810.
- **hero.pricing**: H1 is 48/48 at every width. The 1.0.0 source set 32 on mobile. Padding is 32/40/64 and the image 400/671/full.
- **Tablet (810-1199) tier re-derived**:
  - benefits strip: 2 columns
  - logo groups: 2 columns
  - image-card grid: 2 columns (/tares), 3 (/rius)
  - retrospective: text first, then a 600px image; Lottie 562x281
  - agents table: 3 columns with equal Mid/Long rows; the phone column heads are replaced by a 262px cell
  - what-you-get: 2 columns, equal rows, 13px text
  - plan cards: 2x2
  - cta-xs: a row with 64px padding
  - Rius blog row: STACKED at tablet with 426px images, a row only at 1200
  - tabs image: 500px, inset 64
  - product hero image: 672px
  - calculator banner: 610px tall, text max 420
- **hero.product**: the image fills its cell (no 12px inset). The button row never wraps; at 390 the second button runs past the edge, recorded as a known-intentional quirk.
- **feature.timeline**: no 24px left inset below 1200.
- **conversion.image-cta / two-products-band**: copy-to-buttons gap is 32 on phone and 64 from tablet. The body is capped at 420 for pages/posts/cases (the 1.0.0 source used 640 for pages).
- **social-proof.testimonial `compact`** (/rius) is compact + bleed: quote 21/26/32, full-bleed at tablet.
- **hero.home**: on phones the hairline between the two stacked panels is removed.
- **Alternatives (all 12 alt.* sections)**: fixed, centred, clipped frame 420 / 918 / 1200 (arize) or 1234 (langfuse), typeset in font-display, not Inter.
- **tool.build-vs-buy-calculator**: no top band below 1200, gutters 16/64/64, root in the system font. Number formatting, table brand/subtitle fields and the short labels are code-owned, outside the content contract.
- **contact.signal-form**: panel padding 32/40/64, form frame 0/24/40, panel 564 tall. The calendar iframe is 552 tall.
- **contact.success-panel**: the image is hidden below 1200; panel padding is 64 everywhere.
- **case.studies-title**: padding is 32, or 64x32 from tablet.
- **case.study-cards**: stacked until 1200 (the 1.0.0 source had 2 columns from 810).
- **case.detail-body**: Visit Website opens a new tab.
- **legacy.category-grid**: 3 columns from 810 (the 1.0.0 source had 2 at tablet). The grid is padded 34/48 with 24px sides, and card images use a 385/220 aspect.
- **legacy.bottom-cta**: copy starts 408px into the image box. The heading is capped at 720px with break-words, and its gradient is 0deg per line.
- **chrome.legacy-nav**: a 1x26 #3B3B3B rule, links 24px apart, and a static GitHub star widget that embeds GitHub's mark (third-party: reuse exactly).
- **chrome.navbar**: the products cell is a focusable dropdown trigger (`span tabIndex=0 aria-haspopup`), not a link.

### Token changes
- **Colour**:
  - legacy `divider` #333333 is now attributed to the Category outline-button border.
  - new `nav-rule` #3B3B3B.
  - new `cta-heading-gradient` (0deg).
  - new `untokenised` block: #ABABBA, plus the GitHub widget palette (not palette tokens).
- **Typography**:
  - display font also covers the alternatives base text.
  - sys font is now the calculator's root font.
  - new roles: alternatives-body, calculator-title, calculator-section-label.
- **Radius**: calculator box 4px, subtotal row 3px, help dot round; legacy dropdown 15px, GitHub widget 3px.
- **Spacing and layout**:
  - spacing: band-70 and the calculator gutters.
  - layout: the alternatives fixed frames replace the old max-width claim.
- **Motion**: no values changed. `appear()` gained a forced end-state timer (delay + duration + 50ms); recorded on product-appear.

### Validator / tests
- The maxWords walk now follows object `anyOf` branches, so comparison-table row labels are budget-checked.
- 3 new mutations: a row label over budget, an invalid spacer variant, and a default band where band-70 is required. Totals: 18 controls, 49 mutations.

### Versions
- repositoryVersion 1.0.0 -> 1.1.0.
- pageSpecVersion 1.0.0 -> 1.1.0 (comparison-table and spacer contracts changed shape).
- allowlistVersion stays 1.0.0: the allowlisted ids are unchanged.

### Drift proofs at 1.1.0: output of `python3 extraction/prove_drift.py`
```
  CAUGHT    [allowlist-parity] phantom allowlist entry
            ERROR [allowlist-parity] sections: phantom allowlist entries ['hero.phantom']
  CAUGHT    [allowlist-parity] orphan contract with no allowlist entry
            ERROR [allowlist-parity] primitives: contract files with no allowlist entry ['orphan']
  CAUGHT    [allowlist-version-parity] manifest allowlistVersion drift
            ERROR [allowlist-version-parity] manifest allowlistVersion 9.9.9 != allowlist 1.0.0
  CAUGHT    [manifest-counts] hand-bumped manifest count
            ERROR [manifest-counts] manifest counts.sections=69 but disk=68
  CAUGHT    [manifest-counts] README count row stale
            ERROR [manifest-counts] README counts table missing/stale row '| templates | 17 |'
  CAUGHT    [citation-validity] out-of-range citation
            ERROR [citation-validity] sections/hero.home.json: src/components/Hero.jsx:99999 exceeds file length 106
  CAUGHT    [citation-validity] in-range citation pointing at the wrong line
            ERROR [citation-validity] sections/hero.home.json: src/components/Hero.jsx:33 does not contain quoted text 'max-md:shadow-[inset_1px_1px_0_0_#5F3E1F,inset_-1px_0_0_0_#5'
  CAUGHT    [citation-validity] motion value drift (stagger 50 -> 35 in quoted evidence)
            ERROR [citation-validity] tokens/00-foundation/motion.json: src/components/motion.js:62 does not contain quoted text 'export function revealWords(root, { stagger = 35, du
  CAUGHT    [pinned-forms] contact endpointPolicy -> local-stub (valid enum member)
            ERROR [pinned-forms] form contact-form endpointPolicy 'local-stub' != pinned 'must-not-reuse-live-endpoint'
  CAUGHT    [pinned-roles] person.real-photo -> may-generate-new (valid enum member)
            ERROR [pinned-roles] role person.real-photo generationPolicy 'may-generate-new' != pinned 'must-not-fabricate'
  CAUGHT    [role-closure] invented role in registry
            ERROR [role-closure] assetRole registry != allowlist: ['stock.photo']
  CAUGHT    [graph-validator-parity] graph rule removed
            ERROR [graph-validator-parity] graph rules vs validator rules differ: ['HERO_TEXT_MOTION_BUDGET']
  CAUGHT    [schema-in-sync] schema hand-edited
            ERROR [schema-in-sync] pagespec.schema.json differs from build_schema.build(): rerun schema/build_schema.py
  CAUGHT    [motion-closure] invented motion pattern in a section
            ERROR [motion-closure] faq.accordion: motion pattern scroll-reveal not in motion.json
  CAUGHT    [route-coverage] route bound to a non-existent template
            ERROR [route-coverage] page / -> unknown template ghost
  CAUGHT    [route-source-drift] redirect silently dropped from routes.json
            ERROR [route-source-drift] routes.jsx paths missing from routes.json: ['/newsletter']
  CAUGHT    [template-integrity] legacy section added to a mars template
            ERROR [template-integrity] home: legacy.bottom-cta family legacy on mars template
  CAUGHT    [no-absolute-paths] absolute path in manifest
            ERROR [no-absolute-paths] absolute path in registry.manifest.json
  CAUGHT    [manifest-entrypoints] entryPoint outside the package
            ERROR [manifest-entrypoints] entryPoint ia: ../ia.json is outside the package or missing
  CAUGHT    [example-valid] example field over its maxWords budget
            ERROR [example-valid] MAX_WORDS: nodes[1](hero.home).content.lead: 41 words > 40
  CAUGHT    [asset-refs] example references an asset that does not exist
            ERROR [asset-refs] example asset ref missing in public/: /assets/missing-file.png
  CAUGHT    [section-completeness] section loses its responsive block
            ERROR [section-completeness] blog.share-bar: missing responsive
  PASS      untouched repo -> RESULT: PASS  19 checks, 0 error(s), 0 warning(s)

22 drift cases, 0 failure(s)
```

## 1.0.0 (2026-10-13), initial build. Status: design-review-pending

Built from scratch against the GlassFlow clone (src/ is ground truth; specs are a strong first draft).

### Built
- Tokens: foundation (colour incl. a separate legacy-black group, typography, radius, spacing, breakpoints, elevation, icon sizes, motion),
  semantic roles, component and layout tokens, two themes (`mars`, `legacy-black`), and the LLM layer (allowlist 1.0.0, catalog, policy).
- 18 primitives, 16 components, 68 section contracts (97 variants), 17 templates, 160 routes (108 sitemap; 27 redirects, 18 of them in the sitemap).
- Closed `assetRole` vocabulary (11 roles) with generation and licensing guidance; 9 roles are pinned.
- Policies: forms (endpoint pinned to `must-not-reuse-live-endpoint`), link kinds, long-form summary-only, known-intentional quirks.
- Compatibility graph: 20 rules with ids identical to `schema/semantic_validate.py`.
- Schema generated from the contracts (`schema/build_schema.py`), the home example, the semantic validator, the adversarial suite
  (18 controls, 46 mutations, each asserted against its expected rule), `extraction/verify_all.py` (19 checks) and `extraction/prove_drift.py`.

### Decisions
- `/tares` and `/rius` are separate templates: their node sequences differ (see templates.json).
- Arize and Langfuse share ONE `alternatives` template. `alt.install`, `alt.side-by-side` and `alt.better-pick` are optional, and `alt.split` is repeatable.
- Redirects are `routes.json` entries with kind=redirect, never templates.
- Spec-vs-src disagreements are recorded in `extraction/measured-values.json`; src was followed in every case.
- Source files that changed while this build ran (the concurrent motion pass) are listed in `extraction/measured-values.json`.concurrentChangesDuringBuild. Every motion citation was re-validated against the final source.

### Known gaps (recorded, not hidden)
- The /rius Lottie loop has no reduced-motion handling in src (`no-reduced-motion-handling`).
- Legacy nav link hover colour transitions have no motion-reduce class.
- Some dithered images are role-classified from manifest descriptions without visual inspection (marked INFERRED).

### Drift proofs at 1.0.0: output of `python3 extraction/prove_drift.py`
```
  CAUGHT    [allowlist-parity] phantom allowlist entry
            ERROR [allowlist-parity] sections: phantom allowlist entries ['hero.phantom']
  CAUGHT    [allowlist-parity] orphan contract with no allowlist entry
            ERROR [allowlist-parity] primitives: contract files with no allowlist entry ['orphan']
  CAUGHT    [allowlist-version-parity] manifest allowlistVersion drift
            ERROR [allowlist-version-parity] manifest allowlistVersion 9.9.9 != allowlist 1.0.0
  CAUGHT    [manifest-counts] hand-bumped manifest count
            ERROR [manifest-counts] manifest counts.sections=69 but disk=68
  CAUGHT    [manifest-counts] README count row stale
            ERROR [manifest-counts] README counts table missing/stale row '| templates | 17 |'
  CAUGHT    [citation-validity] out-of-range citation
            ERROR [citation-validity] sections/hero.home.json: src/components/Hero.jsx:99999 exceeds file length 104
  CAUGHT    [citation-validity] in-range citation pointing at the wrong line
            ERROR [citation-validity] sections/hero.home.json: src/components/Hero.jsx:93 does not contain quoted text 'lg:grid-cols-[280px_repeat(4,1fr)]'
  CAUGHT    [citation-validity] motion value drift (stagger 50 -> 35 in quoted evidence)
            ERROR [citation-validity] tokens/00-foundation/motion.json: src/components/motion.js:62 does not contain quoted text 'export function revealWords(root, { stagger = 35, du
  CAUGHT    [pinned-forms] contact endpointPolicy -> local-stub (valid enum member)
            ERROR [pinned-forms] form contact-form endpointPolicy 'local-stub' != pinned 'must-not-reuse-live-endpoint'
  CAUGHT    [pinned-roles] person.real-photo -> may-generate-new (valid enum member)
            ERROR [pinned-roles] role person.real-photo generationPolicy 'may-generate-new' != pinned 'must-not-fabricate'
  CAUGHT    [role-closure] invented role in registry
            ERROR [role-closure] assetRole registry != allowlist: ['stock.photo']
  CAUGHT    [graph-validator-parity] graph rule removed
            ERROR [graph-validator-parity] graph rules vs validator rules differ: ['HERO_TEXT_MOTION_BUDGET']
  CAUGHT    [schema-in-sync] schema hand-edited
            ERROR [schema-in-sync] pagespec.schema.json differs from build_schema.build(): rerun schema/build_schema.py
  CAUGHT    [motion-closure] invented motion pattern in a section
            ERROR [motion-closure] faq.accordion: motion pattern scroll-reveal not in motion.json
  CAUGHT    [route-coverage] route bound to a non-existent template
            ERROR [route-coverage] page / -> unknown template ghost
  CAUGHT    [route-source-drift] redirect silently dropped from routes.json
            ERROR [route-source-drift] routes.jsx paths missing from routes.json: ['/newsletter']
  CAUGHT    [template-integrity] legacy section added to a mars template
            ERROR [template-integrity] home: legacy.bottom-cta family legacy on mars template
  CAUGHT    [no-absolute-paths] absolute path in manifest
            ERROR [no-absolute-paths] absolute path in registry.manifest.json
  CAUGHT    [manifest-entrypoints] entryPoint outside the package
            ERROR [manifest-entrypoints] entryPoint ia: ../ia.json is outside the package or missing
  CAUGHT    [example-valid] example field over its maxWords budget
            ERROR [example-valid] MAX_WORDS: nodes[1](hero.home).content.lead: 41 words > 40
  CAUGHT    [asset-refs] example references an asset that does not exist
            ERROR [asset-refs] example asset ref missing in public/: /assets/missing-file.png
  CAUGHT    [section-completeness] section loses its responsive block
            ERROR [section-completeness] blog.share-bar: missing responsive
  PASS      untouched repo -> RESULT: PASS  19 checks, 0 error(s), 0 warning(s)

22 drift cases, 0 failure(s)
```
