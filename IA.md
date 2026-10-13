# https://www.glassflow.ai/ (sitemap.xml) as implemented in the local clone

Source: https://www.glassflow.ai/ (sitemap.xml) as implemented in the local clone
Status: **measured-from-clone** · production approved: **false**
108 routes · 19 templates · 71 unique sections

> Generated from `ia.json` by `build.mjs`. Edit the JSON, not this file.

## Shape of the site

The largest 3 templates (Blog post, Client redirect, Legacy category) account for 89 of 108 routes (82%). The remaining 19 routes span 16 templates.

| template | routes | share |
|---|---:|---:|
| Blog post | 64 | 59% |
| Client redirect | 18 | 17% |
| Legacy category | 7 | 6% |
| Case study | 2 | 2% |
| Legal (with contents) | 2 | 2% |
| Legacy ebook guide | 2 | 2% |
| Home | 1 | 1% |
| Product: Tares | 1 | 1% |
| Product: Rius | 1 | 1% |
| Rius pricing | 1 | 1% |
| Alternative: Arize | 1 | 1% |
| Alternative: Langfuse | 1 | 1% |
| Build-vs-buy calculator | 1 | 1% |
| Blog index | 1 | 1% |
| Case studies index | 1 | 1% |
| About | 1 | 1% |
| Contact | 1 | 1% |
| Contact success | 1 | 1% |
| Legal (plain) | 1 | 1% |

## Page chrome

**81 routes carry chrome = `main`** — Home, Product: Tares, Product: Rius, Rius pricing, Alternative: Arize, Alternative: Langfuse, Build-vs-buy calculator, Blog index, Blog post, Case studies index, Case study, About, Contact, Contact success, Legal (with contents), Legal (plain).

**9 routes carry chrome = `legacy`** — Legacy category, Legacy ebook guide.

**18 routes carry chrome = `none`** — Client redirect.

## Sections by reuse

How widely a section is shared determines whether it belongs in a shared
component library or stays local to its page.

| section | category | templates | routes | implementation | scope |
|---|---|---:|---:|---|---|
| `chrome.navbar` | CHROME | 16 | 81 | `src/components/Navbar.jsx` | Every route that uses the main brown/amber design, i.e. all routes except the redirects and the legacy black-design pages. |
| `chrome.cta-band` | CHROME | 16 | 81 | `src/components/Footer.jsx > CtaBand` | Rendered by the global Footer, so it sits on every main-design route. |
| `chrome.footer` | CHROME | 16 | 81 | `src/components/Footer.jsx` | Every main-design route. |
| `conversion.two-products-band` | CONVERSION | 5 | 69 | `src/components/ContentSections.jsx > TwoProductsBand` | Content-family routes: /blog, every blog post, the 2 case-study pages, /about and /contact. |
| `hero.post` | HERO | 1 | 64 | `src/components/ContentSections.jsx > PostHero` | Every blog post route. |
| `content.article-body` | CONTENT | 1 | 64 | `src/components/ArticleBody.jsx` | Every blog post route. |
| `content.share-bar` | CONTENT | 1 | 64 | `src/components/ContentSections.jsx > ShareBar` | Every blog post route. |
| `content.related-posts` | CONTENT | 1 | 64 | `src/components/ContentSections.jsx > RelatedPosts` | Every blog post route. |
| `chrome.legacy-nav` | CHROME | 2 | 9 | `src/components/LegacyLayout.jsx` | The 7 live category pages and the 2 ebook guide pages. |
| `hero.legacy-category` | HERO | 1 | 7 | `src/pages/Category.jsx (h1)` | The 7 live category pages. |
| `conversion.legacy-bottom-cta` | CONVERSION | 1 | 7 | `src/pages/Category.jsx > BottomCta` | The 7 live category pages. |
| `content.legacy-post-grid` | CONTENT | 1 | 7 | `src/pages/Category.jsx (PostCard size="category")` | The 7 live category pages. |
| `support.faq` | SUPPORT | 4 | 4 | `src/components/Faq.jsx` | Home, /tares, /rius and /rius/pricing. |
| `proof.testimonial` | PROOF | 3 | 4 | `src/components/Testimonial.jsx` | Home, /rius and the 2 case-study detail pages. |
| `hero.product` | HERO | 2 | 2 | `src/components/ProductSections.jsx > ProductHero` | The two product pages, /tares and /rius. |
| `hero.alternative` | HERO | 2 | 2 | `src/pages/Alternatives.jsx > Hero` | Both alternatives pages (Arize and Langfuse). |
| `proof.works-with-strip` | PROOF | 2 | 2 | `src/components/Hero.jsx > LogoStrip` | Home, and inside the contact panel on /contact. |
| `proof.alternative-logos` | PROOF | 2 | 2 | `src/pages/Alternatives.jsx > Logos` | Both alternatives pages. |
| `proof.alternative-quote` | PROOF | 2 | 2 | `src/pages/Alternatives.jsx > Quote` | Both alternatives pages. |
| `product.image-card-grid` | PRODUCT | 2 | 2 | `src/components/ProductSections.jsx > TitleRow + ImageCardGrid` | The two product pages, /tares and /rius. |
| `comparison.vs-table` | COMPARISON | 2 | 2 | `src/pages/Alternatives.jsx > Comparison` | Both alternatives pages. |
| `comparison.where-it-stops` | COMPARISON | 2 | 2 | `src/pages/Alternatives.jsx > Stops` | Both alternatives pages. |
| `comparison.silent-failures` | COMPARISON | 2 | 2 | `src/pages/Alternatives.jsx > Silent` | Both alternatives pages. |
| `comparison.feature-splits` | COMPARISON | 2 | 2 | `src/pages/Alternatives.jsx > Split` | Both alternatives pages (one or more rows each, from per-vendor data). |
| `commerce.cost-calculator-embed` | COMMERCE | 2 | 2 | `src/pages/Alternatives.jsx > SelfHostCalc` | Both alternatives pages. |
| `conversion.quickstart` | CONVERSION | 2 | 2 | `src/components/Quickstart.jsx` | Home and /rius. |
| `conversion.image-cta` | CONVERSION | 2 | 2 | `src/components/ProductSections.jsx > ImageCTA` | /tares and /rius/pricing. |
| `support.alternative-faq` | SUPPORT | 2 | 2 | `src/pages/Alternatives.jsx > FaqBlock` | Both alternatives pages. |
| `hero.case-study` | HERO | 1 | 2 | `src/pages/CaseStudies.jsx > CaseStudy (title + results Shells)` | The 2 case-study detail pages. |
| `hero.legacy-guide` | HERO | 1 | 2 | `src/pages/Guide.jsx` | The 2 legacy ebook guide pages. |
| `content.case-study-body` | CONTENT | 1 | 2 | `src/pages/CaseStudies.jsx > ArticleContent + Sidebar` | The 2 case-study detail pages. |
| `content.more-case-studies` | CONTENT | 1 | 2 | `src/components/ContentSections.jsx > CaseStudiesTitle (compact) + CaseStudyCards` | The 2 case-study detail pages. |
| `content.legal-with-toc` | CONTENT | 1 | 2 | `src/pages/Legal.jsx > LegalDoc (Toc + Section + FullLink)` | /terms-of-service and /privacy-policy. |
| `hero.home` | HERO | 1 | 1 | `src/components/Hero.jsx` | Home only. |
| `hero.pricing` | HERO | 1 | 1 | `src/pages/RiusPricing.jsx > Hero` | /rius/pricing only. |
| `hero.blog-index` | HERO | 1 | 1 | `src/pages/BlogIndex.jsx > TitleBlock` | /blog only. |
| `hero.case-studies-index` | HERO | 1 | 1 | `src/components/ContentSections.jsx > CaseStudiesTitle` | /case-studies only (the same component is reused lower down on case-study detail pages as content.more-case-studies). |
| `hero.about` | HERO | 1 | 1 | `src/pages/About.jsx > Hero` | /about only. |
| `proof.customer-logos` | PROOF | 1 | 1 | `src/pages/Rius.jsx > Logos` | /rius only. |
| `proof.investors` | PROOF | 1 | 1 | `src/pages/About.jsx > Investors` | /about only. |
| `product.tares-feature` | PRODUCT | 1 | 1 | `src/components/Product.jsx > Tares` | Home only. |
| `product.rius-feature` | PRODUCT | 1 | 1 | `src/components/Product.jsx > Rius` | Home only. |
| `product.tabs-showcase` | PRODUCT | 1 | 1 | `src/components/TabsShowcase.jsx` | /tares only. |
| `product.incident-timeline` | PRODUCT | 1 | 1 | `src/pages/Tares.jsx > HeadingBand + Timeline` | /tares only. |
| `product.run-it-terminals` | PRODUCT | 1 | 1 | `src/pages/Tares.jsx > RunIt` | /tares only. |
| `product.benefits-strip` | PRODUCT | 1 | 1 | `src/pages/Rius.jsx > Benefits` | /rius only. |
| `product.retrospective` | PRODUCT | 1 | 1 | `src/pages/Rius.jsx > Retrospective (LottiePlayer)` | /rius only. |
| `product.agents-length-table` | PRODUCT | 1 | 1 | `src/pages/Rius.jsx > AgentsLength` | /rius only. |
| `product.what-you-get` | PRODUCT | 1 | 1 | `src/pages/Rius.jsx > WhatYouGet` | /rius only. |
| `comparison.install-steps` | COMPARISON | 1 | 1 | `src/pages/Alternatives.jsx > Install` | The Arize alternatives page only (the Langfuse data has no install block). |
| `comparison.side-by-side` | COMPARISON | 1 | 1 | `src/pages/Alternatives.jsx > SideBySide` | The Langfuse alternatives page only. |
| `comparison.better-pick` | COMPARISON | 1 | 1 | `src/pages/Alternatives.jsx > BetterPick` | The Langfuse alternatives page only. |
| `commerce.plan-cards` | COMMERCE | 1 | 1 | `src/components/PlanCards.jsx` | /rius only. |
| `commerce.pricing-banner` | COMMERCE | 1 | 1 | `src/pages/Rius.jsx > CtaXs` | /rius only. |
| `commerce.comparison-table` | COMMERCE | 1 | 1 | `src/components/ComparisonTable.jsx` | /rius/pricing only. |
| `commerce.every-plan` | COMMERCE | 1 | 1 | `src/pages/RiusPricing.jsx > EveryPlan` | /rius/pricing only. |
| `commerce.add-ons` | COMMERCE | 1 | 1 | `src/pages/RiusPricing.jsx > AddOns` | /rius/pricing only. |
| `commerce.build-vs-buy-calculator` | COMMERCE | 1 | 1 | `src/components/BuildVsBuyCalculator.jsx` | The calculator page only. |
| `conversion.calculator-banner` | CONVERSION | 1 | 1 | `src/pages/RiusPricing.jsx > CalculatorBanner` | /rius/pricing only. |
| `conversion.contact-form` | CONVERSION | 1 | 1 | `src/pages/Contact.jsx > SignalPanel + ContactForm` | /contact only. |
| `conversion.book-call` | CONVERSION | 1 | 1 | `src/pages/Contact.jsx > Calendar` | /contact only. |
| `conversion.contact-success` | CONVERSION | 1 | 1 | `src/pages/Contact.jsx > ContactSuccess` | /contact/success only. |
| `content.featured-post` | CONTENT | 1 | 1 | `src/pages/BlogIndex.jsx > Featured` | /blog only. |
| `content.blog-filter-bar` | CONTENT | 1 | 1 | `src/pages/BlogIndex.jsx > FilterBar` | /blog only. |
| `content.post-card-grid` | CONTENT | 1 | 1 | `src/components/ContentSections.jsx > PostCard (grid in BlogIndex.jsx)` | /blog only. |
| `content.blog-card-row` | CONTENT | 1 | 1 | `src/components/BlogCard.jsx (row in Rius.jsx)` | /rius only. |
| `content.case-study-cards` | CONTENT | 1 | 1 | `src/components/ContentSections.jsx > CaseStudyCards` | /case-studies only (detail pages use content.more-case-studies). |
| `content.values` | CONTENT | 1 | 1 | `src/pages/About.jsx > Values` | /about only. |
| `content.team` | CONTENT | 1 | 1 | `src/pages/About.jsx > Team` | /about only. |
| `content.discover-more` | CONTENT | 1 | 1 | `src/pages/About.jsx > Discover` | /about only. |
| `content.legal-plain` | CONTENT | 1 | 1 | `src/pages/Legal.jsx > Imprint` | /imprint only. |

**21 shared sections** appear in more than one template and belong in a component library.

**50 single-use sections** appear in exactly one template. Building these
as "reusable" components up front would be speculative — keep them page-local
until a second caller actually appears.

## Templates

### Home — `template.home`

1 route · `/` · chrome: **main**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.navbar` | shared ×16 |
| 2 | HERO | `hero.home` | page-local |
| 3 | PROOF | `proof.works-with-strip` | shared ×2 |
| 4 | PROOF | `proof.testimonial` | shared ×3 |
| 5 | PRODUCT | `product.tares-feature` | page-local |
| 6 | PRODUCT | `product.rius-feature` | page-local |
| 7 | CONVERSION | `conversion.quickstart` | shared ×2 |
| 8 | SUPPORT | `support.faq` | shared ×4 |
| 9 | CHROME | `chrome.cta-band` | shared ×16 |
| 10 | CHROME | `chrome.footer` | shared ×16 |

### Product: Tares — `template.product-tares`

1 route · `/tares` · chrome: **main**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.navbar` | shared ×16 |
| 2 | HERO | `hero.product` | shared ×2 |
| 3 | PRODUCT | `product.image-card-grid` | shared ×2 |
| 4 | PRODUCT | `product.tabs-showcase` | page-local |
| 5 | PRODUCT | `product.incident-timeline` | page-local |
| 6 | PRODUCT | `product.run-it-terminals` | page-local |
| 7 | SUPPORT | `support.faq` | shared ×4 |
| 8 | CONVERSION | `conversion.image-cta` | shared ×2 |
| 9 | CHROME | `chrome.cta-band` | shared ×16 |
| 10 | CHROME | `chrome.footer` | shared ×16 |

### Product: Rius — `template.product-rius`

1 route · `/rius` · chrome: **main**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.navbar` | shared ×16 |
| 2 | HERO | `hero.product` | shared ×2 |
| 3 | PRODUCT | `product.benefits-strip` | page-local |
| 4 | PROOF | `proof.customer-logos` | page-local |
| 5 | PROOF | `proof.testimonial` | shared ×3 |
| 6 | PRODUCT | `product.retrospective` | page-local |
| 7 | PRODUCT | `product.agents-length-table` | page-local |
| 8 | PRODUCT | `product.image-card-grid` | shared ×2 |
| 9 | PRODUCT | `product.what-you-get` | page-local |
| 10 | CONVERSION | `conversion.quickstart` | shared ×2 |
| 11 | COMMERCE | `commerce.plan-cards` | page-local |
| 12 | COMMERCE | `commerce.pricing-banner` | page-local |
| 13 | CONTENT | `content.blog-card-row` | page-local |
| 14 | SUPPORT | `support.faq` | shared ×4 |
| 15 | CHROME | `chrome.cta-band` | shared ×16 |
| 16 | CHROME | `chrome.footer` | shared ×16 |

### Rius pricing — `template.rius-pricing`

1 route · `/rius/pricing` · chrome: **main**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.navbar` | shared ×16 |
| 2 | HERO | `hero.pricing` | page-local |
| 3 | COMMERCE | `commerce.comparison-table` | page-local |
| 4 | COMMERCE | `commerce.every-plan` | page-local |
| 5 | COMMERCE | `commerce.add-ons` | page-local |
| 6 | CONVERSION | `conversion.calculator-banner` | page-local |
| 7 | SUPPORT | `support.faq` | shared ×4 |
| 8 | CONVERSION | `conversion.image-cta` | shared ×2 |
| 9 | CHROME | `chrome.cta-band` | shared ×16 |
| 10 | CHROME | `chrome.footer` | shared ×16 |

### Alternative: Arize — `template.alternative-arize`

1 route · `/rius/alternatives/arize` · chrome: **main**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.navbar` | shared ×16 |
| 2 | HERO | `hero.alternative` | shared ×2 |
| 3 | PROOF | `proof.alternative-logos` | shared ×2 |
| 4 | PROOF | `proof.alternative-quote` | shared ×2 |
| 5 | COMPARISON | `comparison.vs-table` | shared ×2 |
| 6 | COMPARISON | `comparison.where-it-stops` | shared ×2 |
| 7 | COMPARISON | `comparison.silent-failures` | shared ×2 |
| 8 | COMPARISON | `comparison.install-steps` | page-local |
| 9 | COMPARISON | `comparison.feature-splits` | shared ×2 |
| 10 | COMMERCE | `commerce.cost-calculator-embed` | shared ×2 |
| 11 | SUPPORT | `support.alternative-faq` | shared ×2 |
| 12 | CHROME | `chrome.cta-band` | shared ×16 |
| 13 | CHROME | `chrome.footer` | shared ×16 |

### Alternative: Langfuse — `template.alternative-langfuse`

1 route · `/rius/alternatives/langfuse` · chrome: **main**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.navbar` | shared ×16 |
| 2 | HERO | `hero.alternative` | shared ×2 |
| 3 | PROOF | `proof.alternative-logos` | shared ×2 |
| 4 | PROOF | `proof.alternative-quote` | shared ×2 |
| 5 | COMPARISON | `comparison.vs-table` | shared ×2 |
| 6 | COMPARISON | `comparison.where-it-stops` | shared ×2 |
| 7 | COMPARISON | `comparison.silent-failures` | shared ×2 |
| 8 | COMPARISON | `comparison.feature-splits` | shared ×2 |
| 9 | COMPARISON | `comparison.side-by-side` | page-local |
| 10 | COMMERCE | `commerce.cost-calculator-embed` | shared ×2 |
| 11 | COMPARISON | `comparison.better-pick` | page-local |
| 12 | SUPPORT | `support.alternative-faq` | shared ×2 |
| 13 | CHROME | `chrome.cta-band` | shared ×16 |
| 14 | CHROME | `chrome.footer` | shared ×16 |

### Build-vs-buy calculator — `template.calculator`

1 route · `/rius/calculator-building-your-own-agent-observability` · chrome: **main**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.navbar` | shared ×16 |
| 2 | COMMERCE | `commerce.build-vs-buy-calculator` | page-local |
| 3 | CHROME | `chrome.cta-band` | shared ×16 |
| 4 | CHROME | `chrome.footer` | shared ×16 |

### Blog index — `template.blog-index`

1 route · `/blog` · chrome: **main**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.navbar` | shared ×16 |
| 2 | HERO | `hero.blog-index` | page-local |
| 3 | CONTENT | `content.featured-post` | page-local |
| 4 | CONTENT | `content.blog-filter-bar` | page-local |
| 5 | CONTENT | `content.post-card-grid` | page-local |
| 6 | CONVERSION | `conversion.two-products-band` | shared ×5 |
| 7 | CHROME | `chrome.cta-band` | shared ×16 |
| 8 | CHROME | `chrome.footer` | shared ×16 |

### Blog post — `template.blog-post`

64 routes · `/blog/{slug}` · chrome: **main**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.navbar` | shared ×16 |
| 2 | HERO | `hero.post` | page-local |
| 3 | CONTENT | `content.article-body` | page-local |
| 4 | CONTENT | `content.share-bar` | page-local |
| 5 | CONTENT | `content.related-posts` | page-local |
| 6 | CONVERSION | `conversion.two-products-band` | shared ×5 |
| 7 | CHROME | `chrome.cta-band` | shared ×16 |
| 8 | CHROME | `chrome.footer` | shared ×16 |

### Case studies index — `template.case-studies-index`

1 route · `/case-studies` · chrome: **main**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.navbar` | shared ×16 |
| 2 | HERO | `hero.case-studies-index` | page-local |
| 3 | CONTENT | `content.case-study-cards` | page-local |
| 4 | CHROME | `chrome.cta-band` | shared ×16 |
| 5 | CHROME | `chrome.footer` | shared ×16 |

### Case study — `template.case-study`

2 routes · `/case-studies/nubrain`, `/case-studies/restack` · chrome: **main**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.navbar` | shared ×16 |
| 2 | HERO | `hero.case-study` | page-local |
| 3 | PROOF | `proof.testimonial` | shared ×3 |
| 4 | CONTENT | `content.case-study-body` | page-local |
| 5 | CONTENT | `content.more-case-studies` | page-local |
| 6 | CONVERSION | `conversion.two-products-band` | shared ×5 |
| 7 | CHROME | `chrome.cta-band` | shared ×16 |
| 8 | CHROME | `chrome.footer` | shared ×16 |

### About — `template.about`

1 route · `/about` · chrome: **main**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.navbar` | shared ×16 |
| 2 | HERO | `hero.about` | page-local |
| 3 | CONTENT | `content.values` | page-local |
| 4 | CONTENT | `content.team` | page-local |
| 5 | CONTENT | `content.discover-more` | page-local |
| 6 | PROOF | `proof.investors` | page-local |
| 7 | CONVERSION | `conversion.two-products-band` | shared ×5 |
| 8 | CHROME | `chrome.cta-band` | shared ×16 |
| 9 | CHROME | `chrome.footer` | shared ×16 |

### Contact — `template.contact`

1 route · `/contact` · chrome: **main**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.navbar` | shared ×16 |
| 2 | CONVERSION | `conversion.contact-form` | page-local |
| 3 | PROOF | `proof.works-with-strip` | shared ×2 |
| 4 | CONVERSION | `conversion.book-call` | page-local |
| 5 | CONVERSION | `conversion.two-products-band` | shared ×5 |
| 6 | CHROME | `chrome.cta-band` | shared ×16 |
| 7 | CHROME | `chrome.footer` | shared ×16 |

### Contact success — `template.contact-success`

1 route · `/contact/success` · chrome: **main**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.navbar` | shared ×16 |
| 2 | CONVERSION | `conversion.contact-success` | page-local |
| 3 | CHROME | `chrome.cta-band` | shared ×16 |
| 4 | CHROME | `chrome.footer` | shared ×16 |

### Legal (with contents) — `template.legal-toc`

2 routes · `/terms-of-service`, `/privacy-policy` · chrome: **main**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.navbar` | shared ×16 |
| 2 | CONTENT | `content.legal-with-toc` | page-local |
| 3 | CHROME | `chrome.cta-band` | shared ×16 |
| 4 | CHROME | `chrome.footer` | shared ×16 |

### Legal (plain) — `template.legal-plain`

1 route · `/imprint` · chrome: **main**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.navbar` | shared ×16 |
| 2 | CONTENT | `content.legal-plain` | page-local |
| 3 | CHROME | `chrome.cta-band` | shared ×16 |
| 4 | CHROME | `chrome.footer` | shared ×16 |

### Legacy category — `template.legacy-category`

7 routes · `/categories/agent-infrastructure`, `/categories/data-for-agents`, `/categories/mcp`, `/categories/observability`, `/categories/product-updates`, `/categories/tutorials`, `/categories/use-cases` · chrome: **legacy**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.legacy-nav` | shared ×2 |
| 2 | HERO | `hero.legacy-category` | page-local |
| 3 | CONTENT | `content.legacy-post-grid` | page-local |
| 4 | CONVERSION | `conversion.legacy-bottom-cta` | page-local |

### Legacy ebook guide — `template.legacy-guide`

2 routes · `/kafka-to-clickhouse-pipeline-guide`, `/clickhouse-mistakes-guide` · chrome: **legacy**

| # | category | section | |
|---:|---|---|---|
| 1 | CHROME | `chrome.legacy-nav` | shared ×2 |
| 2 | HERO | `hero.legacy-guide` | page-local |

### Client redirect — `template.redirect`

18 routes · `/imprint-old`, `/cookie-policy`, `/proof-of-concept`, `/product`, `/integrations`, `/enterprise`, `/newsletter`, `/replacingmergetree-alternative`, `/clickstack`, `/joins`, `/kafka-to-clickhouse-connector`, `/vector-dev-alternative`, `/use-cases/real-time-observability-pipelines`, `/categories/engineering`, `/categories/comparisons`, `/blog/handle-semi-structured-data-log-pipelines`, `/blog/kafka-to-clickhouse-with-glassflow-and-altinity-cloud`, `/blog/part-4-apache-flink-is-not-the-solution-to-clickhouse-duplications` · chrome: **none**

| # | category | section | |
|---:|---|---|---|

## Section reference

### CHROME

_Site-wide frame around page content: navigation, the closing CTA band and footer, and the legacy black-design header._

**`chrome.navbar`** — Main-design top bar: wordmark, products dropdown (tares/rius), docs/blog/contact links, amber get_started CTA whose target changes per route; on mobile a second row of five link cells.

· Every route that uses the main brown/amber design, i.e. all routes except the redirects and the legacy black-design pages. · appears on 81 routes · implemented by `src/components/Navbar.jsx`

**`chrome.cta-band`** — Three-cell closing band above the footer: an image cell with a closing question headline, then Start with Tares and Start with Rius cells, each with an amber get_started button.

· Rendered by the global Footer, so it sits on every main-design route. · appears on 81 routes · implemented by `src/components/Footer.jsx > CtaBand`

**`chrome.footer`** — Main-design footer: wordmark cell, products block (tares/rius link cards), contact/docs/blog/about link column, X/LinkedIn/GitHub cells, and the legal bar (copyright, Terms, Privacy).

· Every main-design route. · appears on 81 routes · implemented by `src/components/Footer.jsx`

**`chrome.legacy-nav`** — Older ClickHouse-era black design header: fixed, blurred, with Product/Case Studies/Pricing/Resources/Contact dropdowns, a GitHub star look-alike and a hamburger menu on mobile. These pages have no footer and no CTA band.

· The 7 live category pages and the 2 ebook guide pages. · appears on 9 routes · implemented by `src/components/LegacyLayout.jsx`

### HERO

_The opening block of a route, directly under the nav._

**`hero.home`** — Home opener: full-width dithered Mars image band, then two bordered panels holding the per-word-revealed H1 and the one-line positioning paragraph with the amber get_started button.

· Home only. · appears on 1 routes · implemented by `src/components/Hero.jsx`

**`hero.product`** — Product-page opener for a single product: badge, appear-animated headline and lead, primary and secondary buttons, and the product imagery.

· The two product pages, /tares and /rius. · appears on 2 routes · implemented by `src/components/ProductSections.jsx > ProductHero`

**`hero.pricing`** — Rius pricing opener: title bar, pricing headline and intro, and the amber get_started button.

· /rius/pricing only. · appears on 1 routes · implemented by `src/pages/RiusPricing.jsx > Hero`

**`hero.alternative`** — Competitor-alternative opener: 'Rius is an X alternative' headline, one-sentence lead, try-free and talk-to-founders buttons, pricing small print, jump link, dashboard screenshot and a four-chip capability row.

· Both alternatives pages (Arize and Langfuse). · appears on 2 routes · implemented by `src/pages/Alternatives.jsx > Hero`

**`hero.blog-index`** — Blog index title block: page heading with category chip.

· /blog only. · appears on 1 routes · implemented by `src/pages/BlogIndex.jsx > TitleBlock`

**`hero.post`** — Blog post opener: breadcrumb, per-word-revealed title, description, author/date/category meta row and cover image.

· Every blog post route. · appears on 64 routes · implemented by `src/components/ContentSections.jsx > PostHero`

**`hero.case-studies-index`** — Case studies listing title row.

· /case-studies only (the same component is reused lower down on case-study detail pages as content.more-case-studies). · appears on 1 routes · implemented by `src/components/ContentSections.jsx > CaseStudiesTitle`

**`hero.case-study`** — Case-study detail opener: back-to-case-studies chip, customer title and summary, followed by the outcome metrics strip.

· The 2 case-study detail pages. · appears on 2 routes · implemented by `src/pages/CaseStudies.jsx > CaseStudy (title + results Shells)`

**`hero.about`** — About opener: panel bar with pixel-corner decoration and two appear-animated text blocks introducing the company.

· /about only. · appears on 1 routes · implemented by `src/pages/About.jsx > Hero`

**`hero.legacy-guide`** — Legacy ebook landing block: amber pill, gradient-text H1, lead, 'What's inside' checklist, device mock-up imagery, and the lead-capture form beside it.

· The 2 legacy ebook guide pages. · appears on 2 routes · implemented by `src/pages/Guide.jsx`

**`hero.legacy-category`** — Legacy black-design category heading: centred category name.

· The 7 live category pages. · appears on 7 routes · implemented by `src/pages/Category.jsx (h1)`

### PROOF

_Third-party credibility: customer and tool logos, quotes, investors, outcome metrics._

**`proof.works-with-strip`** — 'Works with the tools you already use' label cell plus four cream tool logos (Vercel, Claude, Cursor, OpenAI).

· Home, and inside the contact panel on /contact. · appears on 2 routes · implemented by `src/components/Hero.jsx > LogoStrip`

**`proof.testimonial`** — Customer quote block: quote glyph, large quote text, then attribution with avatar, name/role and company tile. Full-width on home, a compact variant on /rius, and a bare inline variant inside case-study bodies.

· Home, /rius and the 2 case-study detail pages. · appears on 4 routes · implemented by `src/components/Testimonial.jsx`

**`proof.customer-logos`** — Rius customer and backer logo row.

· /rius only. · appears on 1 routes · implemented by `src/pages/Rius.jsx > Logos`

**`proof.alternative-logos`** — Two-half logo block on the alternatives pages: 'Used by' and 'Backed by CEOs of', three logo cells each.

· Both alternatives pages. · appears on 2 routes · implemented by `src/pages/Alternatives.jsx > Logos`

**`proof.alternative-quote`** — Single customer quote with avatar, name/title and company logo, styled for the alternatives template (it reuses the /rius quote text).

· Both alternatives pages. · appears on 2 routes · implemented by `src/pages/Alternatives.jsx > Quote`

**`proof.investors`** — Investors and backers grid with title row.

· /about only. · appears on 1 routes · implemented by `src/pages/About.jsx > Investors`

### PRODUCT

_Explanation of what a GlassFlow product does and how it works._

**`product.tares-feature`** — Two-column Tares product block on home: badge, headline, description and github/learn_more buttons beside the Tares dashboard image.

· Home only. · appears on 1 routes · implemented by `src/components/Product.jsx > Tares`

**`product.rius-feature`** — Two-column Rius product block on home, mirrored: Rius metrics image beside badge, headline, description and get_started/learn_more buttons.

· Home only. · appears on 1 routes · implemented by `src/components/Product.jsx > Rius`

**`product.image-card-grid`** — Title row followed by a grid of image cards, each with a screenshot and short caption.

· The two product pages, /tares and /rius. · appears on 2 routes · implemented by `src/components/ProductSections.jsx > TitleRow + ImageCardGrid`

**`product.tabs-showcase`** — 'What is in Tares' numbered tab accordion: selecting a tab expands its description (0.45s height tween) and swaps the paired image instantly; nothing auto-advances.

· /tares only. · appears on 1 routes · implemented by `src/components/TabsShowcase.jsx`

**`product.incident-timeline`** — Heading band plus a log-style incident timeline with one highlighted entry.

· /tares only. · appears on 1 routes · implemented by `src/pages/Tares.jsx > HeadingBand + Timeline`

**`product.run-it-terminals`** — 'Run it' block: heading band and two terminal-window cards with commands.

· /tares only. · appears on 1 routes · implemented by `src/pages/Tares.jsx > RunIt`

**`product.benefits-strip`** — Row of short Rius benefit cells directly under the product hero.

· /rius only. · appears on 1 routes · implemented by `src/pages/Rius.jsx > Benefits`

**`product.retrospective`** — Retrospective section built around a Lottie animation of an agent run.

· /rius only. · appears on 1 routes · implemented by `src/pages/Rius.jsx > Retrospective (LottiePlayer)`

**`product.agents-length-table`** — 'Agents aren't one length' table comparing short, mid, long and always-on agent runs.

· /rius only. · appears on 1 routes · implemented by `src/pages/Rius.jsx > AgentsLength`

**`product.what-you-get`** — 'What you get' feature cards, each with an image and short copy.

· /rius only. · appears on 1 routes · implemented by `src/pages/Rius.jsx > WhatYouGet`

### COMPARISON

_Competitor-versus-Rius argument blocks on the alternatives pages._

**`comparison.vs-table`** — Rius-versus-competitor table of numbered topic rows (detection, root cause, heartbeat, alerts, MCP, user view, limits, price), with the Rius column highlighted. Arize adds a toggle between two competitor products. Collapses to labelled blocks on mobile.

· Both alternatives pages. · appears on 2 routes · implemented by `src/pages/Alternatives.jsx > Comparison`

**`comparison.where-it-stops`** — 'Where X stops' heading and three gap cards, each with a title, a one-liner and three bullets.

· Both alternatives pages. · appears on 2 routes · implemented by `src/pages/Alternatives.jsx > Stops`

**`comparison.silent-failures`** — Heading on the left and a 2x3 grid of failure-type cards on the right, each with a category kicker, title and one sentence.

· Both alternatives pages. · appears on 2 routes · implemented by `src/pages/Alternatives.jsx > Silent`

**`comparison.install-steps`** — 'Instrument your agent in 2 minutes': python/typescript tabbed install prompt with a COPY button, three numbered steps and a get-API-key action row.

· The Arize alternatives page only (the Langfuse data has no install block). · appears on 1 routes · implemented by `src/pages/Alternatives.jsx > Install`

**`comparison.feature-splits`** — Repeated image-plus-text split rows, each arguing one Rius capability, with an optional flow line (e.g. symptom→pattern→root cause→alert).

· Both alternatives pages (one or more rows each, from per-vendor data). · appears on 2 routes · implemented by `src/pages/Alternatives.jsx > Split`

**`comparison.side-by-side`** — Two-panel side-by-side comparison block with paired bars.

· The Langfuse alternatives page only. · appears on 1 routes · implemented by `src/pages/Alternatives.jsx > SideBySide`

**`comparison.better-pick`** — Numbered 'when each tool is the better pick' guidance block, closing with a primary button.

· The Langfuse alternatives page only. · appears on 1 routes · implemented by `src/pages/Alternatives.jsx > BetterPick`

### COMMERCE

_Plans, prices, add-ons and cost calculators._

**`commerce.plan-cards`** — Rius plan cards (title row plus one card per plan with price, inclusions and CTA).

· /rius only. · appears on 1 routes · implemented by `src/components/PlanCards.jsx`

**`commerce.pricing-banner`** — Slim banner linking from the plan cards to the full /rius/pricing page.

· /rius only. · appears on 1 routes · implemented by `src/pages/Rius.jsx > CtaXs`

**`commerce.comparison-table`** — Full plan-by-feature comparison table with the Growth column highlighted; scrolls sideways on mobile.

· /rius/pricing only. · appears on 1 routes · implemented by `src/components/ComparisonTable.jsx`

**`commerce.every-plan`** — 'In every plan' list of features included across all tiers.

· /rius/pricing only. · appears on 1 routes · implemented by `src/pages/RiusPricing.jsx > EveryPlan`

**`commerce.add-ons`** — Add-on cards with price and button.

· /rius/pricing only. · appears on 1 routes · implemented by `src/pages/RiusPricing.jsx > AddOns`

**`commerce.cost-calculator-embed`** — Interactive 'what does 100k spans per month cost you' calculator: volume strip, controls, and four cost cards (Rius highlighted) with breakdown accordions and a footnote.

· Both alternatives pages. · appears on 2 routes · implemented by `src/pages/Alternatives.jsx > SelfHostCalc`

**`commerce.build-vs-buy-calculator`** — Standalone build-versus-buy agent-observability cost calculator: inputs, advanced panel, cost breakdown, savings result and assumptions. Its maths is exported as computeCost().

· The calculator page only. · appears on 1 routes · implemented by `src/components/BuildVsBuyCalculator.jsx`

### CONVERSION

_Blocks whose job is a sign-up, contact, booking or next-page click._

**`conversion.quickstart`** — 'From install to first result in minutes' block over a Mars backdrop: two quickstart cards (glassflow-rius, glassflow-tares), each with pitch, three bullets, a docs link and a Start-with button.

· Home and /rius. · appears on 2 routes · implemented by `src/components/Quickstart.jsx`

**`conversion.image-cta`** — Closing image-backed CTA block with headline, short line and button.

· /tares and /rius/pricing. · appears on 2 routes · implemented by `src/components/ProductSections.jsx > ImageCTA`

**`conversion.calculator-banner`** — Banner pointing from pricing to the build-versus-buy calculator, with an amber button.

· /rius/pricing only. · appears on 1 routes · implemented by `src/pages/RiusPricing.jsx > CalculatorBanner`

**`conversion.two-products-band`** — 'Two products' closing band pointing to Tares and Rius, with page-family copy variants (posts, cases, pages) and different copy on mobile.

· Content-family routes: /blog, every blog post, the 2 case-study pages, /about and /contact. · appears on 69 routes · implemented by `src/components/ContentSections.jsx > TwoProductsBand`

**`conversion.contact-form`** — Contact panel: title bar, signal image panel with the tool logo strip, and the contact form (name, email, company, interest chips, message). It has sending and error states. Submit never posts to the live HubSpot form; it fakes a delay and routes to /contact/success.

· /contact only. · appears on 1 routes · implemented by `src/pages/Contact.jsx > SignalPanel + ContactForm`

**`conversion.book-call`** — Founders and calendar booking block built on the Quickstart shell, with an outbound cal.com embed.

· /contact only. · appears on 1 routes · implemented by `src/pages/Contact.jsx > Calendar`

**`conversion.contact-success`** — Thank-you panel: title bar, signal image panel, 'Thanks for reaching out!' heading and link rows to next resources.

· /contact/success only. · appears on 1 routes · implemented by `src/pages/Contact.jsx > ContactSuccess`

**`conversion.legacy-bottom-cta`** — Legacy black-design closing CTA under the category post grid.

· The 7 live category pages. · appears on 7 routes · implemented by `src/pages/Category.jsx > BottomCta`

### CONTENT

_Editorial and informational bodies: blog listings, articles, legal text, company story._

**`content.featured-post`** — Featured post panel at the top of the blog: title bar, chip, title, excerpt and a text-roll read button.

· /blog only. · appears on 1 routes · implemented by `src/pages/BlogIndex.jsx > Featured`

**`content.blog-filter-bar`** — Category tabs (synced to ?category-2=) plus title search (synced to ?title=). On mobile only the search shows.

· /blog only. · appears on 1 routes · implemented by `src/pages/BlogIndex.jsx > FilterBar`

**`content.post-card-grid`** — Grid of all blog post cards. Hovering a card turns the dots into traffic lights, scales the image to 1.1 and darkens the background. There is no pagination.

· /blog only. · appears on 1 routes · implemented by `src/components/ContentSections.jsx > PostCard (grid in BlogIndex.jsx)`

**`content.blog-card-row`** — Title row and a short row of blog cards promoting related articles.

· /rius only. · appears on 1 routes · implemented by `src/components/BlogCard.jsx (row in Rius.jsx)`

**`content.article-body`** — Article body renderer (h2/h3, paragraphs, lists, images, tables, quotes, code block with Copy). In this clone it renders only the article's heading outline with one-line summaries and a link to the full article on glassflow.ai; full article text is not reproduced.

· Every blog post route. · appears on 64 routes · implemented by `src/components/ArticleBody.jsx`

**`content.share-bar`** — Share-this-post icon bar (0.2s opacity hover).

· Every blog post route. · appears on 64 routes · implemented by `src/components/ContentSections.jsx > ShareBar`

**`content.related-posts`** — 'You might also like' row of three fixed post cards.

· Every blog post route. · appears on 64 routes · implemented by `src/components/ContentSections.jsx > RelatedPosts`

**`content.legacy-post-grid`** — Legacy black-design grid of post cards for one category: 3 columns on desktop, 2 on tablet, 1 on mobile (the clone fixes the live mobile squeeze).

· The 7 live category pages. · appears on 7 routes · implemented by `src/pages/Category.jsx (PostCard size="category")`

**`content.case-study-cards`** — Grid of case-study cards linking to each customer story.

· /case-studies only (detail pages use content.more-case-studies). · appears on 1 routes · implemented by `src/components/ContentSections.jsx > CaseStudyCards`

**`content.case-study-body`** — Two-column case-study body: inline customer quote and the story's heading outline with summaries in the main column, plus a sidebar of customer facts. Full story text is not reproduced; it links to the original.

· The 2 case-study detail pages. · appears on 2 routes · implemented by `src/pages/CaseStudies.jsx > ArticleContent + Sidebar`

**`content.more-case-studies`** — 'You might also like' compact title row plus the case-study card grid, closing a detail page.

· The 2 case-study detail pages. · appears on 2 routes · implemented by `src/components/ContentSections.jsx > CaseStudiesTitle (compact) + CaseStudyCards`

**`content.values`** — Company values panels with title bar and icon per value.

· /about only. · appears on 1 routes · implemented by `src/pages/About.jsx > Values`

**`content.team`** — Team grid with photos, names, roles and LinkedIn buttons.

· /about only. · appears on 1 routes · implemented by `src/pages/About.jsx > Team`

**`content.discover-more`** — 'Discover more' link cards built on the Quickstart shell, with text-roll buttons.

· /about only. · appears on 1 routes · implemented by `src/pages/About.jsx > Discover`

**`content.legal-with-toc`** — Legal document layout with a contents sidebar (hover colour fades 0.3s; not sticky) beside numbered sections. Each section shows its heading and a one-line summary, and the page closes with a link to the full text on glassflow.ai.

· /terms-of-service and /privacy-policy. · appears on 2 routes · implemented by `src/pages/Legal.jsx > LegalDoc (Toc + Section + FullLink)`

**`content.legal-plain`** — Single-column legal page without a sidebar (company/imprint details).

· /imprint only. · appears on 1 routes · implemented by `src/pages/Legal.jsx > Imprint`

### SUPPORT

_Question-and-answer blocks._

**`support.faq`** — Main-design FAQ: centred heading panel with pixel-corner decorations, then accordion rows where several can be open at once (200ms height change, icon cell turns amber and flips).

· Home, /tares, /rius and /rius/pricing. · appears on 4 routes · implemented by `src/components/Faq.jsx`

**`support.alternative-faq`** — 'Common questions' FAQ on the alternatives template: native details rows that are mutually exclusive (opening one closes the rest, shared with the calculator breakdowns), with an arrow square on the right.

· Both alternatives pages. · appears on 2 routes · implemented by `src/pages/Alternatives.jsx > FaqBlock`
