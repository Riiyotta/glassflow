#!/usr/bin/env python3
"""Adversarial suite: every rule must REJECT a mutated instance, and every control must PASS.

Controls: the bundled example + one PageSpec per template, synthesised GENERICALLY from
templates/templates.json and each section's own content contract (no per-template code, so a
new template is covered the moment it is added).

Usage: python3 schema/tests/adversarial_test.py   (exit 1 on any failure)
"""
import copy, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(REPO, "schema"))
sys.path.insert(0, os.path.join(REPO, "extraction"))
import semantic_validate as sv  # noqa: E402
import verify_all as va  # noqa: E402

C = sv.ctx()

# samples for the few pattern-constrained strings (keyed by pattern)
PH = "[a-z0-9-]+\\.(example|invalid)"
PATTERN_SAMPLES = {
    # (clone sample, generation sample) per pattern
    rf"^Read the full article on (glassflow\.ai|{PH})$": ("Read the full article on glassflow.ai", "Read the full article on sample.example"),
    rf"^Read the full case study on (glassflow\.ai|{PH})$": ("Read the full case study on glassflow.ai", "Read the full case study on sample.example"),
    rf"^Read the full text on (glassflow\.ai|{PH})$": ("Read the full text on glassflow.ai", "Read the full text on sample.example"),
    rf"^Read the full guide page on (glassflow\.ai|{PH})$": ("Read the full guide page on glassflow.ai", "Read the full guide page on sample.example"),
    rf"^Read the full (story|text) on (glassflow\.ai|{PH})$": ("Read the full story on glassflow.ai", "Read the full story on sample.example"),
    rf"^https://(www\.glassflow\.ai|{PH})/": ("https://www.glassflow.ai/blog", "https://sample.example/read"),
    rf"^https://(app\.cal\.com|{PH})/": ("https://app.cal.com/armend-glassflow/engineering-intro-call-with-founder/embed?layout=month_view", "https://sample.example/calendar"),
    "^[a-z][a-z0-9-]{1,23}$": ("sample", "sample"),
}
GEN_ROLE_PREF = ["illustration.generated", "texture.dither-field", "icon.pixel", "screenshot.placeholder", "person.fictional-avatar",
                 "logo.placeholder-company", "brand.placeholder-mark", "asset.user-supplied"]
MODE = {"m": "clone"}


def synth(schema):
    gen = MODE["m"] == "generation"
    if schema is None:
        return None
    if "const" in schema:
        return schema["const"]
    if schema.get("x-productKey"):
        return "sample" if gen else "rius"
    if "enum" in schema:
        return schema["enum"][0]
    if "anyOf" in schema:
        return synth(schema["anyOf"][0])
    t = schema.get("type")
    if isinstance(t, list):
        t = t[0]
    if t == "object":
        props = schema.get("properties", {})
        if "assetRole" in props:
            en = props["assetRole"]["enum"]
            if gen:
                role = next(r for r in GEN_ROLE_PREF if r in en)
                return {"assetRole": role, "ref": "user-supplied:sample" if role == "asset.user-supplied" else "generate:sample generated asset", "alt": ""}
            return {"assetRole": en[0], "ref": "/assets/sample.png", "alt": ""}
        return {k: synth(props[k]) for k in schema.get("required", [])}
    if t == "array":
        return [synth(schema["items"]) for _ in range(max(schema.get("minItems", 0), 1 if schema.get("minItems", 0) else 0))]
    if t == "boolean":
        return True
    if t == "string":
        if "pattern" in schema:
            return PATTERN_SAMPLES[schema["pattern"]][1 if gen else 0]
        if schema.get("x-linkField"):
            return "/sample"
        return "Sample"
    raise ValueError(f"cannot synthesise {schema}")


def control_for(tid, mode="clone"):
    MODE["m"] = mode
    T = C["templates"][tid]
    S = C["sections"]
    route = next((r["path"] for r in C["routes"] if r.get("template") == tid), "/new-page")
    nodes = []
    for i, tn in enumerate(T["nodes"]):
        sec = S[tn["section"]]
        v = sorted(sec["variants"])[0] if tn["variants"] == "*" else tn["variants"][0]
        cs = sec["contentByVariant"][v] if "contentByVariant" in sec else sec["content"]
        nodes.append({"id": f"n{i}", "section": tn["section"], "variant": v, "content": synth(cs),
                      "motion": {"patterns": list(sec["motion"]["allowedPatterns"]), "reducedMotionFallback": sec["motion"]["reducedMotionFallback"]}})
    spec = {"pageSpecVersion": C["schema"]["properties"]["pageSpecVersion"]["const"], "mode": mode, "template": tid, "theme": T["theme"], "route": route, "meta": {"title": "Sample page"}, "nodes": nodes}
    if mode == "generation":
        spec["route"] = "/" if tid == "home" else f"/sample-page-{sorted(C['templates']).index(tid)}"
        spec["brand"] = {"name": "Sample Brand", "mark": {"assetRole": "brand.placeholder-mark", "ref": "placeholder:sample-mark", "alt": ""},
                         "products": [{"name": "Sample", "slug": "sample"}]}
    MODE["m"] = "clone"
    return spec


EXAMPLE = json.load(open(os.path.join(REPO, "schema/example.pagespec.json"), encoding="utf-8"))


def idx(spec, section, variant=None):
    return next(i for i, n in enumerate(spec["nodes"]) if n["section"] == section and (variant is None or n["variant"] == variant))


def mut(base, fn):
    s = copy.deepcopy(base)
    fn(s)
    return s


def node(spec, section):
    return spec["nodes"][idx(spec, section)]["content"]


def _set(d, k, v):
    d[k] = v


HOME = EXAMPLE


def swap_band_and_spacer(s):
    b = idx(s, "conversion.two-products-band")
    s["nodes"][b - 1], s["nodes"][b] = s["nodes"][b], s["nodes"][b - 1]


def swap_splits(s):
    i, j = idx(s, "product.feature-split", "tares-text-left"), idx(s, "product.feature-split", "rius-image-left")
    s["nodes"][i], s["nodes"][j] = s["nodes"][j], s["nodes"][i]

GEX = {f[len("generated."):-len(".pagespec.json")]: json.load(open(os.path.join(REPO, "schema/examples", f), encoding="utf-8"))
       for f in sorted(os.listdir(os.path.join(REPO, "schema/examples"))) if f.endswith(".pagespec.json")}
G_HOME, G_PROD, G_CONTACT, G_POST, G_ABOUT, G_CMP = GEX["landing"], GEX["product"], GEX["contact"], GEX["article"], GEX["company"], GEX["comparison"]
RIUS_QUOTE = "Rius found agent failures we didn't know existed. Our time to debug went from days to minutes and now we catch issues before they ever reach a customer."
CONTACT = control_for("contact")
GUIDE = control_for("legacy-guide")
POST = control_for("blog-post")
BLOGIDX = control_for("blog-index")
PRICING = control_for("pricing")
CASE = control_for("case-study-detail")

MUTATIONS = [
    # ---- schema layer
    ("schema", "wrong theme enum", mut(HOME, lambda s: _set(s, "theme", "dark"))),
    ("schema", "missing required content field (hero.headline)", mut(HOME, lambda s: node(s, "hero.home").pop("headline"))),
    ("schema", "invented section type alias", mut(HOME, lambda s: _set(s["nodes"][1], "section", "hero.marketing"))),
    ("schema", "missing reducedMotionFallback", mut(HOME, lambda s: s["nodes"][1]["motion"].pop("reducedMotionFallback"))),
    ("schema", "invented motion field", mut(HOME, lambda s: _set(s["nodes"][1]["motion"], "inventedAnimation", "spin"))),
    ("schema", "invented motion pattern (scroll-reveal does not exist on the original)", mut(HOME, lambda s: s["nodes"][1]["motion"]["patterns"].append("scroll-reveal"))),
    ("schema", "pattern not allowed for this section (faq-height on hero)", mut(HOME, lambda s: s["nodes"][1]["motion"]["patterns"].append("faq-height"))),
    ("schema", "wrong reducedMotionFallback for section", mut(HOME, lambda s: _set(s["nodes"][1]["motion"], "reducedMotionFallback", "none-needed"))),
    ("schema", "invented assetRole", mut(HOME, lambda s: _set(node(s, "hero.home")["bandImage"], "assetRole", "stock.photo"))),
    ("schema", "assetRole valid but not allowed on this field (avatar as texture)", mut(HOME, lambda s: _set(node(s, "social-proof.testimonial")["person"]["avatar"], "assetRole", "texture.dither-field"))),
    ("schema", "extra content property", mut(HOME, lambda s: _set(node(s, "hero.home"), "subtitle", "extra"))),
    ("schema", "unknown variant", mut(HOME, lambda s: _set(s["nodes"][idx(s, "faq.accordion")], "variant", "fancy"))),
    ("schema", "external domain as a route", mut(PRICING, lambda s: _set(s, "route", "https://docs.glassflow.ai"))),
    ("schema", "HubSpot pinned value changed to another VALID policy value (local-stub) - contact", mut(CONTACT, lambda s: _set(node(s, "contact.signal-form")["form"], "endpointPolicy", "local-stub"))),
    ("schema", "HubSpot pinned value changed to another VALID policy value (configured-endpoint) - guide", mut(GUIDE, lambda s: _set(node(s, "legacy.guide-hero-form")["form"], "endpointPolicy", "configured-endpoint"))),
    ("schema", "contact form onSuccess changed to inline", mut(CONTACT, lambda s: _set(node(s, "contact.signal-form")["form"], "onSuccess", "inline-status"))),
    ("schema", "long-form prose key smuggled into post body", mut(POST, lambda s: _set(node(s, "content.article-summary-body"), "paragraphs", ["full text"]))),
    ("schema", "long-form contentPolicy changed", mut(POST, lambda s: _set(node(s, "content.article-summary-body"), "contentPolicy", "full-text"))),
    # ---- structural layer (template cross-reference, keyed on (section, variant))
    ("structural", "duplicate one-per-page hero", mut(HOME, lambda s: s["nodes"].insert(2, copy.deepcopy(s["nodes"][1]) | {"id": "hero2"}))),
    ("structural", "removed mandatory section (testimonial)", mut(HOME, lambda s: s["nodes"].pop(idx(s, "social-proof.testimonial")))),
    ("structural", "reordered fixed-position sections (rius split before tares split)", mut(HOME, swap_splits)),
    ("structural", "same section, other variant swapped in (both splits tares-text-left)", mut(HOME, lambda s: _set(s["nodes"][idx(s, "product.feature-split", "rius-image-left")], "variant", "tares-text-left"))),
    ("structural", "declared template contradicts nodes (home nodes as 'about')", mut(HOME, lambda s: (_set(s, "template", "about"), _set(s, "route", "/about")))),
    ("structural", "theme contradicts template", mut(HOME, lambda s: _set(s, "theme", "legacy-black"))),
    ("structural", "legacy chrome on a mars page (navbar -> legacy nav)", mut(HOME, lambda s: s["nodes"].__setitem__(0, {"id": "nav", "section": "chrome.legacy-nav", "variant": "default", "content": {"linkTone": "text.link"}, "motion": {"patterns": [], "reducedMotionFallback": "transitions-disabled"}}))),
    ("structural", "mars footer appended to a legacy page", mut(GUIDE, lambda s: s["nodes"].append({"id": "f", "section": "chrome.footer", "variant": "default", "content": {}, "motion": {"patterns": [], "reducedMotionFallback": "transitions-disabled"}}))),
    ("structural", "consecutive spacers", mut(HOME, lambda s: s["nodes"].insert(idx(s, "layout.spacer"), {"id": "sp-x", "section": "layout.spacer", "variant": "band-65", "content": {}, "motion": {"patterns": [], "reducedMotionFallback": "none-needed"}}))),
    ("structural", "two-products band not directly before footer", mut(BLOGIDX, swap_band_and_spacer)),
    ("structural", "home template on a non-root route", mut(HOME, lambda s: _set(s, "route", "/home"))),
    ("structural", "page on an existing redirect source route", mut(PRICING, lambda s: _set(s, "route", "/enterprise"))),
    ("structural", "duplicate node ids", mut(HOME, lambda s: _set(s["nodes"][2], "id", "hero"))),
    ("structural", "optional-only node missing a required one (blog-post without share bar)", mut(POST, lambda s: s["nodes"].pop(idx(s, "blog.share-bar")))),
    # ---- runtime layer
    ("runtime", "maxWords overflow on hero.lead", mut(HOME, lambda s: _set(node(s, "hero.home"), "lead", " ".join(["word"] * 41)))),
    ("runtime", "maxWords overflow on faq answer", mut(HOME, lambda s: _set(node(s, "faq.accordion")["items"][0], "answer", " ".join(["word"] * 61)))),
    ("runtime", "long-form summary is multi-sentence copied prose", mut(POST, lambda s: _set(node(s, "content.article-summary-body")["outline"][0], "summary", "One. Two. Three sentences here."))),
    ("runtime", "long-form outline totals exceed 600 words", mut(POST, lambda s: _set(node(s, "content.article-summary-body"), "outline", [{"level": "h2", "heading": " ".join(["h"] * 16), "summary": " ".join(["w"] * 28)}] * 14))),
    ("runtime", "HubSpot endpoint string in content", mut(CONTACT, lambda s: _set(node(s, "contact.signal-form"), "title", "api.hsforms.com/139646698"))),
    ("runtime", "fabricated real-person photo (generate: on must-not-fabricate role)", mut(HOME, lambda s: _set(node(s, "social-proof.testimonial")["person"]["avatar"], "ref", "generate:smiling CEO headshot"))),
    ("runtime", "fabricated third-party logo (generate: on must-reuse-exact role)", mut(HOME, lambda s: _set(node(s, "hero.home")["logoStrip"]["logos"][0], "ref", "generate:new partner logo"))),
    ("runtime", "outbound link to a non-allowlisted host", mut(HOME, lambda s: _set(node(s, "hero.home")["cta"], "href", "https://evil.example.com/x"))),
    ("runtime", "protocol-relative link", mut(HOME, lambda s: _set(node(s, "hero.home")["cta"], "href", "//evil.example.com"))),
    ("runtime", "comparison-table row label over budget (anyOf object branch)", mut(PRICING, lambda s: _set(node(s, "pricing.comparison-table"), "rows", [{"band": "SUPPORT"}, {"label": " ".join(["w"] * 9), "values": ["check", "minus", "x", "y"]}]))),
    ("schema", "rius divider variant swapped for the all-widths divider", mut(control_for("product-rius"), lambda s: _set(s["nodes"][1], "variant", "divider-30-nope"))),
    ("structural", "pricing calculator band replaced by a default band (template expects band-70)", mut(PRICING, lambda s: _set(s["nodes"][idx(s, "conversion.calculator-banner") - 1], "variant", "band-65"))),
    ("runtime", "case-study body summary-only violated (3 sentences)", mut(CASE, lambda s: _set(node(s, "case.detail-body")["body"]["outline"][0], "summary", "A. B. C."))),
    # ---- mode layer (R1)
    ("mode", "mode missing", mut(HOME, lambda s: s.pop("mode"))),
    ("mode", "mode outside the closed enum (reference)", mut(HOME, lambda s: _set(s, "mode", "reference"))),
    ("mode", "generation spec without spec.brand", mut(G_HOME, lambda s: s.pop("brand"))),
    ("mode", "clone spec carrying spec.brand", mut(HOME, lambda s: _set(s, "brand", copy.deepcopy(G_HOME["brand"])))),
    ("mode", "real clone page relabelled mode=generation", mut(HOME, lambda s: _set(s, "mode", "generation") or _set(s, "brand", copy.deepcopy(G_HOME["brand"])))),
    # ---- generation: GlassFlow brand / logo reuse
    ("generation", "GlassFlow wordmark role in a generated product hero", mut(G_PROD, lambda s: _set(node(s, "hero.product"), "barGraphic", {"assetRole": "brand.glassflow-mark", "ref": "generate:redrawn bar mark", "alt": ""}))),
    ("generation", "GlassFlow name as spec.brand.name", mut(G_HOME, lambda s: _set(s["brand"], "name", "GlassFlow"))),
    ("generation", "brand name hidden with a zero-width space (G\u200blass Flow)", mut(G_HOME, lambda s: _set(node(s, "hero.home"), "headline", "the G\u200blass Flow data layer"))),
    ("generation", "source product name (Rius) in copy", mut(G_HOME, lambda s: _set(node(s, "faq.accordion")["items"][0], "question", "Is Rius open source?"))),
    ("generation", "source product key (rius) on a quickstart card", mut(G_HOME, lambda s: _set(node(s, "onboarding.quickstart-band")["cards"][0], "product", "rius"))),
    ("generation", "GlassFlow legal entity / address", mut(G_HOME, lambda s: _set(s["meta"], "description", "Operated by GlassFlow GmbH in Berlin."))),
    # ---- generation: real customer logos / names
    ("generation", "real customer logo role (logo.customer) on the testimonial", mut(G_HOME, lambda s: _set(node(s, "social-proof.testimonial")["company"], "logo", {"assetRole": "logo.customer", "ref": "generate:customer logo", "alt": ""}))),
    ("generation", "real customer name as testimonial company", mut(G_HOME, lambda s: _set(node(s, "social-proof.testimonial")["company"], "label", "Restack"))),
    ("generation", "real customer name in alt text (Weaviate)", mut(G_HOME, lambda s: _set(node(s, "hero.home")["logoStrip"]["logos"][0], "alt", "Weaviate"))),
    # ---- generation: real people / testimonials
    ("generation", "real person as testimonial author", mut(G_HOME, lambda s: _set(node(s, "social-proof.testimonial")["person"], "name", "Thomas Dohmke"))),
    ("generation", "real-person photo role on the testimonial avatar", mut(G_HOME, lambda s: _set(node(s, "social-proof.testimonial")["person"], "avatar", {"assetRole": "person.real-photo", "ref": "generate:smiling CEO headshot", "alt": ""}))),
    ("generation", "real testimonial quote reused verbatim", mut(G_HOME, lambda s: _set(node(s, "social-proof.testimonial"), "quote", RIUS_QUOTE))),
    ("generation", "real testimonial quote with curly quotes and an en dash", mut(G_HOME, lambda s: _set(node(s, "social-proof.testimonial"), "quote", "\u201cRius found agent failures we didn\u2019t know existed \u2013 our time to debug went from days to minutes.\u201d"))),
    ("generation", "real team member on the about page", mut(G_ABOUT, lambda s: _set(node(s, "about.team")["members"][0], "name", "Armend Avdijaj"))),
    # ---- generation: product screenshots / source assets
    ("generation", "product.screenshot role in a generated product hero", mut(G_PROD, lambda s: _set(node(s, "hero.product"), "image", {"assetRole": "product.screenshot", "ref": "placeholder:dashboard-wireframe", "alt": ""}))),
    ("generation", "real product screenshot file under a placeholder role", mut(G_PROD, lambda s: _set(node(s, "hero.product")["image"], "ref", "/assets/tares/BA3dZ6PBbmXuIYsMmsUQwZ3V64.png"))),
    ("generation", "clone-only branded scene (scene.mars-figurative) in a generated hero", mut(G_HOME, lambda s: _set(node(s, "hero.home"), "bandImage", {"assetRole": "scene.mars-figurative", "ref": "generate:astronaut on mars", "alt": ""}))),
    ("generation", "source asset id smuggled into a placeholder ref", mut(G_HOME, lambda s: _set(node(s, "hero.home")["bandImage"], "ref", "placeholder:8cuc5kelijzepw8wcqeqzfspe"))),
    # ---- generation: third-party marks
    ("generation", "third-party logo role (logo.third-party) in the hero logo strip", mut(G_HOME, lambda s: _set(node(s, "hero.home")["logoStrip"]["logos"], 0, {"assetRole": "logo.third-party", "ref": "generate:vendor logo", "alt": ""}))),
    ("generation", "third-party mark named in a logo alt (OpenAI)", mut(G_HOME, lambda s: _set(node(s, "hero.home")["logoStrip"]["logos"][0], "alt", "OpenAI"))),
    ("generation", "real competitor name on a comparison page (Langfuse)", mut(G_CMP, lambda s: _set(node(s, "alt.hero"), "lead", "Why teams leave Langfuse for a calmer pipeline."))),
    # ---- generation: source URLs / embeds
    ("generation", "GlassFlow docs URL as a link", mut(G_HOME, lambda s: _set(node(s, "hero.home")["cta"], "href", "https://docs.glassflow.ai/"))),
    ("generation", "GlassFlow GitHub org URL", mut(G_HOME, lambda s: _set(node(s, "hero.home")["cta"], "href", "https://github.com/glassflow/tares"))),
    ("generation", "non-placeholder outbound host", mut(G_HOME, lambda s: _set(node(s, "hero.home")["cta"], "href", "https://www.northwind-relay.com/start"))),
    ("generation", "GlassFlow domain mentioned in copy", mut(G_HOME, lambda s: _set(node(s, "faq.accordion")["items"][1], "answer", "See glassflow.dev for details."))),
    ("generation", "source founder calendar embed", mut(G_CONTACT, lambda s: _set(node(s, "onboarding.quickstart-band")["calendarEmbed"], "src", "https://app.cal.com/armend-glassflow/engineering-intro-call-with-founder/embed"))),
    # ---- generation: claims + copy
    ("generation", "source numeric claim (93% at ... 7 TB/day)", mut(G_HOME, lambda s: _set(node(s, "faq.accordion")["items"][2], "answer", "Teams cut corrupted metrics by 93% at about 7 TB/day."))),
    ("generation", "source price claim ($1,999 enterprise)", mut(G_HOME, lambda s: _set(node(s, "faq.accordion")["items"][2], "answer", "Enterprise starts at $1,999 a month."))),
    ("generation", "source marketing copy reused (feature split body)", mut(G_HOME, lambda s: _set(node(s, "product.feature-split"), "body", ["Open source, self-hostable, and built on a production streaming core."]))),
    ("generation", "source post title reused in an article hero", mut(G_POST, lambda s: _set(node(s, "blog.post-hero"), "title", "How to debug an AI agent in production"))),
    # ---- token policy (R10)
    ("token", "raw hex in node.tokens.surface", mut(HOME, lambda s: _set(s["nodes"][1], "tokens", {"surface": "#FFAC00"}))),
    ("token", "unknown semantic token", mut(HOME, lambda s: _set(s["nodes"][1], "tokens", {"surface": "surface.glow"}))),
    ("token", "arbitrary spacing (13px)", mut(HOME, lambda s: _set(s["nodes"][1], "tokens", {"spacingY": "13px"}))),
    ("token", "spacing token not allowed as section spacing (inset-column)", mut(HOME, lambda s: _set(s["nodes"][1], "tokens", {"spacingY": "inset-column"}))),
    ("token", "unsupported font family", mut(HOME, lambda s: _set(s["nodes"][1], "tokens", {"font": "Comic Sans MS"}))),
    ("token", "font not used by the legacy family (mono on legacy-black)", mut(GUIDE, lambda s: _set(s["nodes"][1], "tokens", {"font": "mono"}))),
    ("token", "legacy-black token on a mars page (surface.field)", mut(HOME, lambda s: _set(s["nodes"][1], "tokens", {"surface": "surface.field"}))),
    ("token", "text token in the surface slot", mut(HOME, lambda s: _set(s["nodes"][1], "tokens", {"surface": "text.primary"}))),
    ("token", "raw rgba() colour inside content copy", mut(HOME, lambda s: _set(node(s, "hero.home"), "lead", "Tint rgba(255,172,0,0.5) everywhere"))),
    ("token", "raw hex as the legacy nav link tone", mut(GUIDE, lambda s: _set(s["nodes"][0]["content"], "linkTone", "#999999"))),
]


# The rule each mutation must be rejected BY (a rejection for another reason is a false pass).
EXPECT = {
    "wrong theme enum": "SCHEMA", "missing required content field (hero.headline)": "SCHEMA", "invented section type alias": "SCHEMA",
    "missing reducedMotionFallback": "SCHEMA", "invented motion field": "SCHEMA",
    "invented motion pattern (scroll-reveal does not exist on the original)": "SCHEMA", "pattern not allowed for this section (faq-height on hero)": "SCHEMA",
    "wrong reducedMotionFallback for section": "SCHEMA", "invented assetRole": "SCHEMA", "assetRole valid but not allowed on this field (avatar as texture)": "SCHEMA",
    "extra content property": "SCHEMA", "unknown variant": "SCHEMA", "external domain as a route": "SCHEMA",
    "HubSpot pinned value changed to another VALID policy value (local-stub) - contact": "SCHEMA",
    "HubSpot pinned value changed to another VALID policy value (configured-endpoint) - guide": "SCHEMA",
    "contact form onSuccess changed to inline": "SCHEMA", "long-form prose key smuggled into post body": "SCHEMA", "long-form contentPolicy changed": "SCHEMA",
    "duplicate one-per-page hero": "ONE_HERO", "removed mandatory section (testimonial)": "TEMPLATE_SEQUENCE",
    "reordered fixed-position sections (rius split before tares split)": "TEMPLATE_SEQUENCE",
    "same section, other variant swapped in (both splits tares-text-left)": "ONE_PER_PAGE",
    "declared template contradicts nodes (home nodes as 'about')": "TEMPLATE_SEQUENCE", "theme contradicts template": "THEME_MATCHES_TEMPLATE",
    "legacy chrome on a mars page (navbar -> legacy nav)": "CHROME_FAMILY_NO_MIX", "mars footer appended to a legacy page": "CHROME_FAMILY_NO_MIX",
    "consecutive spacers": "NO_CONSECUTIVE_SPACERS", "two-products band not directly before footer": "TWO_PRODUCTS_BAND_BEFORE_FOOTER",
    "home template on a non-root route": "HOME_ROUTE_ONLY", "page on an existing redirect source route": "ROUTE_NOT_REDIRECT_OR_EXTERNAL",
    "duplicate node ids": "NODE_IDS_UNIQUE", "optional-only node missing a required one (blog-post without share bar)": "TEMPLATE_SEQUENCE",
    "maxWords overflow on hero.lead": "MAX_WORDS", "maxWords overflow on faq answer": "MAX_WORDS",
    "long-form summary is multi-sentence copied prose": "LONG_FORM_SUMMARY_ONLY", "long-form outline totals exceed 600 words": "LONG_FORM_SUMMARY_ONLY",
    "HubSpot endpoint string in content": "FORM_ENDPOINT_PINNED", "fabricated real-person photo (generate: on must-not-fabricate role)": "ASSET_ROLE_POLICY",
    "fabricated third-party logo (generate: on must-reuse-exact role)": "ASSET_ROLE_POLICY", "outbound link to a non-allowlisted host": "LINK_KINDS",
    "protocol-relative link": "LINK_KINDS", "comparison-table row label over budget (anyOf object branch)": "MAX_WORDS",
    "rius divider variant swapped for the all-widths divider": "SCHEMA",
    "mode missing": "SCHEMA", "mode outside the closed enum (reference)": "SCHEMA", "generation spec without spec.brand": "SCHEMA",
    "clone spec carrying spec.brand": "SCHEMA", "real clone page relabelled mode=generation": "GENERATION_MODE_BRAND",
    "GlassFlow wordmark role in a generated product hero": "GENERATION_MODE_BRAND", "GlassFlow name as spec.brand.name": "GENERATION_MODE_BRAND",
    "brand name hidden with a zero-width space (G\u200blass Flow)": "GENERATION_MODE_BRAND", "source product name (Rius) in copy": "GENERATION_MODE_BRAND",
    "source product key (rius) on a quickstart card": "GENERATION_MODE_BRAND", "GlassFlow legal entity / address": "GENERATION_MODE_BRAND",
    "real customer logo role (logo.customer) on the testimonial": "GENERATION_MODE_CUSTOMER", "real customer name as testimonial company": "GENERATION_MODE_CUSTOMER",
    "real customer name in alt text (Weaviate)": "GENERATION_MODE_CUSTOMER", "real person as testimonial author": "GENERATION_MODE_PERSON",
    "real-person photo role on the testimonial avatar": "GENERATION_MODE_PERSON", "real testimonial quote reused verbatim": "GENERATION_MODE_COPY",
    "real testimonial quote with curly quotes and an en dash": "GENERATION_MODE_COPY", "real team member on the about page": "GENERATION_MODE_PERSON",
    "product.screenshot role in a generated product hero": "GENERATION_MODE_SCREENSHOT", "real product screenshot file under a placeholder role": "GENERATION_MODE_ASSET",
    "clone-only branded scene (scene.mars-figurative) in a generated hero": "GENERATION_MODE_ASSET", "source asset id smuggled into a placeholder ref": "GENERATION_MODE_ASSET",
    "third-party logo role (logo.third-party) in the hero logo strip": "GENERATION_MODE_THIRD_PARTY", "third-party mark named in a logo alt (OpenAI)": "GENERATION_MODE_THIRD_PARTY",
    "real competitor name on a comparison page (Langfuse)": "GENERATION_MODE_THIRD_PARTY", "GlassFlow docs URL as a link": "GENERATION_MODE_URL",
    "GlassFlow GitHub org URL": "GENERATION_MODE_URL", "non-placeholder outbound host": "GENERATION_MODE_URL", "GlassFlow domain mentioned in copy": "GENERATION_MODE_URL",
    "source founder calendar embed": "GENERATION_MODE_EMBED", "source numeric claim (93% at ... 7 TB/day)": "GENERATION_MODE_CLAIM",
    "source price claim ($1,999 enterprise)": "GENERATION_MODE_CLAIM", "source marketing copy reused (feature split body)": "GENERATION_MODE_COPY",
    "source post title reused in an article hero": "GENERATION_MODE_COPY",
    "raw hex in node.tokens.surface": "TOKEN_RAW_VALUE", "unknown semantic token": "TOKEN_UNKNOWN", "arbitrary spacing (13px)": "TOKEN_ARBITRARY_SPACING",
    "spacing token not allowed as section spacing (inset-column)": "TOKEN_ARBITRARY_SPACING", "unsupported font family": "TOKEN_UNSUPPORTED_FONT",
    "font not used by the legacy family (mono on legacy-black)": "TOKEN_UNSUPPORTED_FONT", "legacy-black token on a mars page (surface.field)": "TOKEN_THEME_MISMATCH",
    "text token in the surface slot": "TOKEN_THEME_MISMATCH", "raw rgba() colour inside content copy": "TOKEN_RAW_VALUE", "raw hex as the legacy nav link tone": "SCHEMA", "pricing calculator band replaced by a default band (template expects band-70)": "TEMPLATE_SEQUENCE", "case-study body summary-only violated (3 sentences)": "LONG_FORM_SUMMARY_ONLY",
}


def registry_mutations():
    """Pinned-value checks at the registry layer (MASTER-GUIDE 3.23): change a pinned value to a
    DIFFERENT, still-valid enum member and confirm verify_all's pinned check rejects it."""
    forms = json.load(open(os.path.join(REPO, "policies/forms.json"), encoding="utf-8"))
    roles = json.load(open(os.path.join(REPO, "assets/asset-roles.json"), encoding="utf-8"))
    out = []
    f2 = copy.deepcopy(forms); f2["forms"]["contact-form"]["endpointPolicy"] = "local-stub"
    assert "local-stub" in f2["endpointPolicyEnum"]
    out.append(("registry", "forms.json contact-form endpointPolicy -> local-stub (valid enum, wrong pinned value)", va.check_pinned_forms(f2)))
    r2 = copy.deepcopy(roles); r2["roles"]["person.real-photo"]["cloneModePolicy"] = "may-generate-new"
    out.append(("registry", "asset-roles person.real-photo -> may-generate-new (valid enum, wrong pinned value)", va.check_pinned_roles(r2)))
    r3 = copy.deepcopy(roles); r3["roles"]["logo.third-party"]["cloneModePolicy"] = "must-not-fabricate"
    out.append(("registry", "asset-roles logo.third-party -> must-not-fabricate (valid enum, wrong pinned value)", va.check_pinned_roles(r3)))
    r4 = copy.deepcopy(roles); r4["roles"]["stock.photo"] = {"kind": "media", "cloneModePolicy": "may-generate-new", "pinned": False, "guidance": "x", "evidence": []}
    out.append(("registry", "invented assetRole added to the registry", va.check_role_closure(r4)))
    secs = C["sections"]
    # availability (R3): registry-only edits, each to a DIFFERENT but valid value
    for role, newav, newgm in (("brand.glassflow-mark", "generation-safe", "may-generate-new"), ("person.real-photo", "clone-only", "substitute-required"),
                               ("logo.customer", "generation-safe", "may-generate-new"), ("product.screenshot", "clone-only", "substitute-required")):
        r5 = copy.deepcopy(roles); r5["roles"][role]["availability"] = newav; r5["roles"][role]["generationModePolicy"] = newgm
        out.append(("registry", f"asset-roles {role} -> {newav} (registry only): semantic validator CONTRACT_INTEGRITY", sv._integrity(secs, r5["roles"])))
        out.append(("registry", f"asset-roles {role} -> {newav} (registry only): verify_all pinned-availability", va.check_pinned_availability(r5, sv.PINNED_AVAILABILITY)))
    t2 = dict(sv.PINNED_AVAILABILITY); t2["logo.customer"] = ("generation-safe", "may-generate-new")
    out.append(("registry", "pin removed from ONE validator (semantic table loosened, verify_all table not)", va.check_pinned_availability(roles, t2)))
    r6 = copy.deepcopy(roles); r6["roles"]["scene.mars-figurative"]["generationSafeSubstitutes"] = []
    out.append(("registry", "clone-only role loses its generation-safe substitutes", va.check_pinned_availability(r6, sv.PINNED_AVAILABILITY)))
    # retrieval eligibility (R8): node/contract/allowlist-level flips
    s1 = copy.deepcopy(secs); s1["contact.success-panel"]["retrievalEligible"] = True
    out.append(("registry", "runtime success panel flipped to retrievalEligible=true (contract)", sv._integrity(s1) + va.check_retrieval(s1)))
    s2 = copy.deepcopy(secs); s2["faq.accordion"]["retrievalEligible"] = False; s2["faq.accordion"]["retrievalReason"] = "x" * 40
    out.append(("registry", "content section (faq.accordion) marked retrieval-ineligible", sv._integrity(s2) + va.check_retrieval(s2)))
    s3 = copy.deepcopy(secs); s3["layout.spacer"]["retrievalEligible"] = True; s3["layout.spacer"].pop("retrievalReason")
    out.append(("registry", "utility spacer flipped eligible with its reason removed", va.check_retrieval(s3)))
    s4 = copy.deepcopy(secs); s4["chrome.cookie-banner"] = dict(copy.deepcopy(secs["faq.accordion"]), id="chrome.cookie-banner")
    out.append(("registry", "new runtime-looking section (cookie banner) left retrieval-eligible", va.check_retrieval(s4)))
    return out


def gate_mutations():
    """Wrapper gate (R9) on scratch copies of measured-values.json."""
    import shutil, tempfile
    import wrapper_gate as wg
    base = tempfile.mkdtemp(prefix="gate-")
    out = []

    def case(name, fn, expect_error=True, expect_warn_substr=None):
        root = os.path.join(base, str(len(out)))
        for d in ("extraction", "templates", "compatibility"):
            os.makedirs(os.path.join(root, d), exist_ok=True)
        for rel in ("extraction/measured-values.json", "templates/templates.json", "compatibility/graph.json"):
            shutil.copy(os.path.join(REPO, rel), os.path.join(root, rel))
        p = os.path.join(root, "extraction/measured-values.json")
        mv = json.load(open(p, encoding="utf-8"))
        fn(mv)
        json.dump(mv, open(p, "w", encoding="utf-8"))
        errs, warns, _ = wg.gate(root)
        ok = bool(errs) if expect_error else (not errs and any(expect_warn_substr in w for w in warns))
        out.append(("gate", name, ok, (errs or warns or ["-"])[0]))

    def route(mv, tid):
        return next(r for r in mv["sectionHeights"]["routes"] if r["template"] == tid)

    def setnode(mv, tid, sec, px):
        for n in route(mv, tid)["nodes"]:
            if n["section"] == sec:
                n["heightPx"] = px
    case("HERO 1900px -> warning only", lambda mv: setnode(mv, "home", "hero.home", 1900), expect_error=False, expect_warn_substr="hero home")
    case("HERO 3100px -> error", lambda mv: setnode(mv, "home", "hero.home", 3100))
    case("one section holds the majority of a page -> error", lambda mv: (setnode(mv, "about", "about.team", 12000), route(mv, "about").__setitem__("pageHeightPx", 16900)))
    case("whitelist entry without a 30-char justification", lambda mv: mv["wrapperGateWhitelist"][0].__setitem__("justification", "too short"))
    case("whitelist reviewedBy claims agent review without the attestation phrase", lambda mv: mv["wrapperGateWhitelist"][0].__setitem__("reviewedBy", "agent"))
    case("whitelisted height grows past maxHeightPx", lambda mv: setnode(mv, "blog-index", "blog.post-grid", 30000))
    case("stale whitelist entry (no hit)", lambda mv: mv["wrapperGateWhitelist"].append(dict(mv["wrapperGateWhitelist"][0], template="about", section="about.team")))
    case("template with no measurement", lambda mv: mv["sectionHeights"].__setitem__("routes", [r for r in mv["sectionHeights"]["routes"] if r["template"] != "pricing"]))
    case("measured at the wrong viewport", lambda mv: mv["sectionHeights"].__setitem__("viewport", 1280))
    case("in-flow section without a height", lambda mv: setnode(mv, "contact", "contact.signal-form", None))
    case("unmappable measurement", lambda mv: route(mv, "home").__setitem__("mapping", "unmappable"))
    shutil.rmtree(base, ignore_errors=True)
    return out


def main():
    fails = 0
    print("== controls (must pass)")
    controls = [("example.pagespec.json (mode clone, real GlassFlow assets/copy)", EXAMPLE)] + [(f"synth:{t}", control_for(t)) for t in sorted(C["templates"])]
    controls += [(f"examples/generated.{f}", spec) for f, spec in GEX.items()]
    controls += [(f"synth-generation:{t}", control_for(t, "generation")) for t in sorted(C["templates"])]
    for name, spec in controls:
        rep = sv.validate(spec)
        ok = not rep.errors
        fails += not ok
        print(f"  {'PASS' if ok else 'FAIL'} control {name}" + ("" if ok else f" -> {rep.errors[:3]}"))
    print("== mutations (must be rejected)")
    seen = set()
    for layer, name, spec in MUTATIONS:
        rep = sv.validate(spec)
        rules = sorted({e.split(':')[0] for e in rep.errors})
        ok = EXPECT[name] in rules
        fails += not ok
        seen.update(rules)
        tag = 'REJECTED' if ok else ('WRONG-RULE' if rules else 'ACCEPTED!')
        print(f"  {tag} [{layer}] {name} -> {','.join(rules) or '-'} (expected {EXPECT[name]})")
    reg = registry_mutations()
    for layer, name, errs in reg:
        ok = bool(errs)
        fails += not ok
        print(f"  {'REJECTED' if ok else 'ACCEPTED!'} [{layer}] {name} -> {errs[0] if errs else '-'}")
    gates = gate_mutations()
    for layer, name, ok, msg in gates:
        fails += not ok
        print(f"  {'CAUGHT  ' if ok else 'MISSED! '} [{layer}] {name} -> {msg[:150]}")
    assert set(EXPECT) == {m[1] for m in MUTATIONS}, "every mutation needs an expected rule"
    n_mut = len(MUTATIONS) + len(reg) + len(gates)
    print(f"\n{len(controls)} controls, {n_mut} mutations, {fails} failure(s)")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
