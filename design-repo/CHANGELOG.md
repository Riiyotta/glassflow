# CHANGELOG

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

### Drift proofs: last output of `python3 extraction/prove_drift.py`
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
