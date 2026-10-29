# GlassFlow design-repo

AI-ready design system extracted from the GlassFlow clone (React + Vite + Tailwind v3) of
www.glassflow.ai, a real, live B2B company. A generator composes **PageSpecs** (JSON) from the closed set of
sections and templates here; `schema/` validates them structurally and semantically.

**Status: design-review-pending, productionApproved false.** allowlistVersion 1.1.0 (machine-checked);
repositoryVersion / pageSpecVersion 1.2.0 (documentation-only markers; pageSpecVersion is also a schema const).
No human has reviewed this repo: every "reviewedBy" / "classifiedBy" in it is an agent attestation, not a human sign-off.

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
| assetRoles | 19 |
| motionPatterns | 17 |
| graphRules | 36 |
| templateFamilies | 11 |
| generatedExamples | 11 |
| retrievalIneligibleSections | 2 |

Of the 160 routes, 108 are the live sitemap URLs (18 of them client redirects
via `<Navigate replace>`); the rest are reachable blog slugs from `src/data/posts.json` that the sitemap omits.
The clone's `*` catch-all (`Pending.jsx`, "This page is being built") is a fallback for unknown paths, not a
served page, and is not mapped.

## Two modes: clone and generation (`mode`, required)
- **clone**: faithful reconstruction of GlassFlow. Real GlassFlow assets, copy and links are allowed for
  fidelity. `schema/example.pagespec.json` is the clone control and still validates with real assets.
- **generation**: a new page for another brand. The PageSpec must carry `brand` (the operator's name, mark and
  1-2 product names/slugs). The semantic validator rejects every GlassFlow match, one named rule per category:
  `GENERATION_MODE_BRAND` (GlassFlow, Tares, Rius, legal entity/address, brand e-mails, wordmark roles),
  `_PERSON` (team, investors, testimonial and post authors), `_CUSTOMER` (customers/backers), `_THIRD_PARTY`
  (logo-strip vendors, competitors, investor firms), `_SCREENSHOT`, `_ASSET` (any source file or clone-only role),
  `_URL` (any non-`.example`/`.invalid` host), `_EMBED`, `_CLAIM` (source numeric claims) and `_COPY` (5-word
  shingles of source copy).
- The patterns are **derived from the real source** by `extraction/build_source_identity.py` into
  `policies/source-identity.json` (each term with its `file:line`; copy only as hashed shingles). Strings are
  normalised first (NFKC, zero-width removal, curly quotes and dashes folded, lowercase).
- One generation example per template family lives in `schema/examples/generated.<family>.pagespec.json`
  (11 families: article, company, comparison, contact, index, landing, legacy, legal, pricing, product, tool). They use a fictional brand
  ("Northwind Relay"), fictional people and companies, placeholder/generated media and `.example` URLs.
- Sections whose clone renderer hard-codes GlassFlow content (`chrome.navbar`, `chrome.footer`,
  `chrome.legacy-nav`, `conversion.two-products-band`) carry `generationSubstitution`: in generation mode the
  renderer must print `spec.brand` instead. The PageSpec layer enforces only that `brand` exists and is clean;
  renderer compliance is not machine-checked here.

## Asset roles (`assets/asset-roles.json`)
Every role has a closed `availability`: `clone-only` (real media, clone mode only), `generation-safe`, or
`blocked-for-generation` (GlassFlow marks, real people, real customers, third-party logos, product screenshots).
Each also has `cloneModePolicy`, `generationModePolicy`, `generationSafeSubstitutes` and `generatedModeGuidance`.
Generation-safe roles: `brand.placeholder-mark`, `asset.user-supplied`, `illustration.generated`,
`screenshot.placeholder`, `person.fictional-avatar`, `logo.placeholder-company`, `texture.dither-field`,
`icon.pixel`, plus the content roles `url.placeholder` and `copy.original`. Availability is pinned in code twice
(`PINNED_AVAILABILITY` in `extraction/verify_all.py` and `schema/semantic_validate.py`); editing the registry
alone fails validation (`CONTRACT_INTEGRITY`, `pinned-availability`). In generation mode a ref must be
`generate:<brief>`, `placeholder:<id>` or `user-supplied:<id>`; a `/assets/...` source file is always rejected.

## Two design systems, never mixed
- **mars** (default): square, 1px `#5F3E1F` hairlines, brown/amber tokens. Chrome: `chrome.navbar` first, `chrome.footer` last.
- **legacy-black**: the pre-rebrand system used only by `/categories/*` and the two guide pages. Chrome: `chrome.legacy-nav`; no global footer.
- Rule `CHROME_FAMILY_NO_MIX` (graph + validator) rejects any mix; sections declare `family`.

## Tokens (`tokens/llm/`)
`token-catalog.json` is generated from the real token files by `extraction/build_token_catalog.py` and checked
in sync by verify_all. `token-policy.json` defines where tokens may be referenced: the optional node-level
`tokens` object (surface / text / border / spacingY / font, added in 1.2.0) and the legacy nav `linkTone`
(now a semantic token name instead of raw hex). Rules: `TOKEN_UNKNOWN`, `TOKEN_RAW_VALUE`,
`TOKEN_ARBITRARY_SPACING`, `TOKEN_UNSUPPORTED_FONT`, `TOKEN_THEME_MISMATCH`. The clone itself has no
per-instance token override, so renderer support for `node.tokens` is not evidenced in the source.

## Section contracts
Closed by `schema/section-contract.schema.json`. Each has `source` {id, tag, file, lines} (provenance;
verify_all re-reads the range and finds the tag) and `semantic` {id, category} (taxonomy; `semantic.id` is the
contract id). `retrievalEligible` is false only for `layout.spacer` and `contact.success-panel` (pinned in both
validators; reasons in the contracts).

## Wrapper gate (`extraction/wrapper_gate.py`)
Section heights were measured at 1440px from the built clone (`vite build` + `vite preview`, not the live site)
with `extraction/measure_sections.mjs` and mapped by `extraction/record_section_heights.py` into
`extraction/measured-values.json` `sectionHeights` (up to 3 routes per template, all 17 templates). Thresholds
in code: HERO > 1800px warn, > 3000px error; one section > 50% of a page warn, > 60% error (pages with fewer than
3 in-flow sections skipped; chrome excluded). One whitelisted hit: `blog.post-grid` (91.5% of /blog, the
unpaginated grid of every post), agent attestation, not a human sign-off. The two alternatives pages map only
positionally in their middle (optional/repeatable sections): those positions are recorded with `section: null`
and candidates rather than guessed.

**R6 judgement call:** `legal.toc-document` is ~78-80% of /terms-of-service and /privacy-policy. It is kept as one
section because the clone renders it as one two-column frame (sticky TOC beside the article) and the PageSpec
model has no nested containers; its body is summary-only (headings + at most 2-sentence summaries, 600-word cap),
so it cannot carry full legal text. The gate does not flag it (fewer than 3 in-flow sections on those pages).

## Common policy binding
`registry.manifest.json` `category: "saas"` and `designPolicy` binds `n0-saas-design-constraints-common` 0.1.0
(commonIrVersion 0.5, hard-and-soft). The evidence (plan-priced Core/Growth/Pro/Enterprise tiers, console
sign-up, Terms of Service for "the SaaS platform") and the files the policy is enforced by are in
`policy/design-policy.json`; `contentHash` is a sha256 over those files, recomputed by verify_all.

## Hard rules a generator must respect
- **Forms never submit to the live endpoint.** `endpointPolicy` is pinned to `must-not-reuse-live-endpoint`.
- **Long-form is summary-only.** Post / case-study bodies, the /about story, legal texts and guide bodies are headings + one-line summaries + "Read the full ... on <site>".
- **External domains are outbound links only** (clone: closed host list in `policies/link-kinds.json`; generation: `.example` / `.invalid` only).
- **Motion is closed** to the measured patterns in `tokens/00-foundation/motion.json`; every node carries the section's `reducedMotionFallback`.
- **Known-intentional quirks** are kept on purpose: `policies/known-intentional-quirks.json`.

## Verify
Requires Python 3.8+ and `jsonschema` (`pip install jsonschema`); everything else is the standard library.
```
python3 schema/build_schema.py --check
python3 schema/semantic_validate.py schema/example.pagespec.json schema/examples/*.pagespec.json
python3 schema/tests/adversarial_test.py
python3 extraction/verify_all.py
python3 extraction/prove_drift.py --scratch <empty dir>   # one injected defect per check; each must be caught
python3 extraction/wrapper_gate.py
```
`verify_all.py` resolves citations and rebuilds `policies/source-identity.json` against the sibling project
(`<design-repo>/..`); in a standalone copy those checks degrade to warnings.

## Honest limits
- Leakage detection is **string-based** (normalised substring, whole-word and 5-word-shingle matching). It does
  not detect paraphrase, translated copy, visually similar generated images or a lookalike logo; a generated
  image brief is not inspected beyond its text.
- No human reviewed the derived patterns, the asset availability decisions or the SaaS binding.
- Visual parity between clone and live site was not measured in this pass.

## Packaging
`design-repo.zip` is produced last with the CLI `zip`, excluding `.DS_Store`. It is listed in the project's
`.gitignore` and must never be committed.
