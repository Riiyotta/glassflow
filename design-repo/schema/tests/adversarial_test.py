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
PATTERN_SAMPLES = {
    r"^Read the full article on glassflow\.ai$": "Read the full article on glassflow.ai",
    r"^Read the full case study on glassflow\.ai$": "Read the full case study on glassflow.ai",
    r"^Read the full text on glassflow\.ai$": "Read the full text on glassflow.ai",
    r"^Read the full guide page on glassflow\.ai$": "Read the full guide page on glassflow.ai",
    r"^Read the full (story|text) on glassflow\.ai$": "Read the full story on glassflow.ai",
    r"^https://www\.glassflow\.ai/": "https://www.glassflow.ai/blog",
    r"^https://app\.cal\.com/": "https://app.cal.com/armend-glassflow/engineering-intro-call-with-founder/embed?layout=month_view",
}


def synth(schema):
    if schema is None:
        return None
    if "const" in schema:
        return schema["const"]
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
            role = props["assetRole"]["enum"][0]
            return {"assetRole": role, "ref": "/assets/sample.png", "alt": ""}
        return {k: synth(props[k]) for k in schema.get("required", [])}
    if t == "array":
        return [synth(schema["items"]) for _ in range(max(schema.get("minItems", 0), 1 if schema.get("minItems", 0) else 0))]
    if t == "boolean":
        return True
    if t == "string":
        if "pattern" in schema:
            return PATTERN_SAMPLES[schema["pattern"]]
        if schema.get("x-linkField"):
            return "/blog"
        return "Sample"
    raise ValueError(f"cannot synthesise {schema}")


def control_for(tid):
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
    return {"pageSpecVersion": C["schema"]["properties"]["pageSpecVersion"]["const"], "template": tid, "theme": T["theme"], "route": route, "meta": {"title": "Sample page"}, "nodes": nodes}


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
    ("structural", "legacy chrome on a mars page (navbar -> legacy nav)", mut(HOME, lambda s: s["nodes"].__setitem__(0, {"id": "nav", "section": "chrome.legacy-nav", "variant": "default", "content": {"linkTone": "#999999"}, "motion": {"patterns": [], "reducedMotionFallback": "transitions-disabled"}}))),
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
    "rius divider variant swapped for the all-widths divider": "SCHEMA", "pricing calculator band replaced by a default band (template expects band-70)": "TEMPLATE_SEQUENCE", "case-study body summary-only violated (3 sentences)": "LONG_FORM_SUMMARY_ONLY",
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
    r2 = copy.deepcopy(roles); r2["roles"]["person.real-photo"]["generationPolicy"] = "may-generate-new"
    out.append(("registry", "asset-roles person.real-photo -> may-generate-new (valid enum, wrong pinned value)", va.check_pinned_roles(r2)))
    r3 = copy.deepcopy(roles); r3["roles"]["logo.third-party"]["generationPolicy"] = "must-not-fabricate"
    out.append(("registry", "asset-roles logo.third-party -> must-not-fabricate (valid enum, wrong pinned value)", va.check_pinned_roles(r3)))
    r4 = copy.deepcopy(roles); r4["roles"]["stock.photo"] = {"generationPolicy": "may-generate-new", "pinned": False, "guidance": "x", "evidence": []}
    out.append(("registry", "invented assetRole added to the registry", va.check_role_closure(r4)))
    return out


def main():
    fails = 0
    print("== controls (must pass)")
    controls = [("example.pagespec.json", EXAMPLE)] + [(f"synth:{t}", control_for(t)) for t in sorted(C["templates"])]
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
    for layer, name, errs in registry_mutations():
        ok = bool(errs)
        fails += not ok
        print(f"  {'REJECTED' if ok else 'ACCEPTED!'} [{layer}] {name} -> {errs[0] if errs else '-'}")
    assert set(EXPECT) == {m[1] for m in MUTATIONS}, "every mutation needs an expected rule"
    n_mut = len(MUTATIONS) + 4
    print(f"\n{len(controls)} controls, {n_mut} mutations, {fails} failure(s)")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
