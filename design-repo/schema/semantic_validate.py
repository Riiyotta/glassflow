#!/usr/bin/env python3
"""Semantic validator for GlassFlow PageSpecs: everything JSON Schema cannot express.

Every rule id emitted here is declared under the same id in compatibility/graph.json
(verify_all.py checks the two sets are identical). Structural checks key on (section, variant).

Usage: python3 schema/semantic_validate.py <pagespec.json> [...]
Exit 1 if any error (schema or semantic); warnings never fail.
"""
import json, os, re, sys
from functools import lru_cache
from urllib.parse import urlparse

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

RULE_IDS = {"SCHEMA", "CONTRACT_INTEGRITY", "TEMPLATE_SEQUENCE", "THEME_MATCHES_TEMPLATE", "CHROME_FAMILY_NO_MIX", "ONE_PER_PAGE", "ONE_HERO",
            "HERO_FIRST_AFTER_CHROME", "NO_CONSECUTIVE_SPACERS", "BAND_SPACER_NOT_FIRST", "TWO_PRODUCTS_BAND_BEFORE_FOOTER",
            "SPACER_BEFORE_FOOTER", "HOME_ROUTE_ONLY", "ROUTE_NOT_REDIRECT_OR_EXTERNAL", "MAX_WORDS", "LONG_FORM_SUMMARY_ONLY",
            "FORM_ENDPOINT_PINNED", "LINK_KINDS", "ASSET_ROLE_POLICY", "REDUCED_MOTION_FALLBACK", "HERO_TEXT_MOTION_BUDGET", "NODE_IDS_UNIQUE",
            # token policy (tokens/llm/token-policy.json)
            "TOKEN_UNKNOWN", "TOKEN_RAW_VALUE", "TOKEN_ARBITRARY_SPACING", "TOKEN_UNSUPPORTED_FONT", "TOKEN_THEME_MISMATCH",
            # mode = generation: one rule per source-identity category (policies/source-identity.json)
            "GENERATION_MODE_BRAND", "GENERATION_MODE_PERSON", "GENERATION_MODE_CUSTOMER", "GENERATION_MODE_THIRD_PARTY",
            "GENERATION_MODE_SCREENSHOT", "GENERATION_MODE_ASSET", "GENERATION_MODE_URL", "GENERATION_MODE_EMBED",
            "GENERATION_MODE_CLAIM", "GENERATION_MODE_COPY"}
# "SCHEMA" is the Draft-07 layer, not a graph rule.
GRAPH_RULE_IDS = RULE_IDS - {"SCHEMA"}

PINNED_ENDPOINT = "must-not-reuse-live-endpoint"

# Second source of truth for asset availability (MASTER-GUIDE 3.23 / baseline R3): generation-mode
# decisions use THIS table, not the registry, and any registry disagreement is CONTRACT_INTEGRITY.
# Same table as extraction/verify_all.py PINNED_AVAILABILITY (verify_all checks the two are equal).
PINNED_AVAILABILITY = {
    "logo.third-party": ("blocked-for-generation", "blocked"),
    "logo.customer": ("blocked-for-generation", "blocked"),
    "brand.glassflow-mark": ("blocked-for-generation", "blocked"),
    "brand.dither-mark": ("blocked-for-generation", "blocked"),
    "person.real-photo": ("blocked-for-generation", "blocked"),
    "product.screenshot": ("blocked-for-generation", "blocked"),
    "scene.mars-figurative": ("clone-only", "substitute-required"),
    "blog.cover": ("clone-only", "substitute-required"),
    "animation.lottie": ("clone-only", "substitute-required"),
    "texture.dither-field": ("generation-safe", "may-generate-new"),
    "icon.pixel": ("generation-safe", "may-generate-new"),
    "brand.placeholder-mark": ("generation-safe", "may-generate-new"),
    "asset.user-supplied": ("generation-safe", "operator-supplied"),
    "illustration.generated": ("generation-safe", "may-generate-new"),
    "screenshot.placeholder": ("generation-safe", "may-generate-new"),
    "person.fictional-avatar": ("generation-safe", "may-generate-new"),
    "logo.placeholder-company": ("generation-safe", "may-generate-new"),
    "url.placeholder": ("generation-safe", "placeholder-only"),
    "copy.original": ("generation-safe", "must-be-original"),
}
# which identity rule a non-generation-safe role trips in mode = generation (default GENERATION_MODE_ASSET)
ROLE_RULE = {"brand.glassflow-mark": "GENERATION_MODE_BRAND", "brand.dither-mark": "GENERATION_MODE_BRAND",
             "person.real-photo": "GENERATION_MODE_PERSON", "logo.customer": "GENERATION_MODE_CUSTOMER",
             "logo.third-party": "GENERATION_MODE_THIRD_PARTY", "product.screenshot": "GENERATION_MODE_SCREENSHOT"}
GEN_REF = re.compile(r"^(generate:.{8,200}|placeholder:[a-z0-9][a-z0-9-]{2,59}|user-supplied:[a-z0-9][a-z0-9-]{2,59})$")
PLACEHOLDER_HOST = re.compile(r"(^|\.)[a-z0-9-]+\.(example|invalid)$")

# Runtime/utility sections that are NOT retrieval exemplars (baseline R8). Same pin as verify_all.py;
# a contract whose retrievalEligible disagrees is CONTRACT_INTEGRITY.
RETRIEVAL_INELIGIBLE = {"layout.spacer", "contact.success-panel"}

sys.path.insert(0, os.path.join(REPO, "extraction"))
from build_source_identity import normalise, words, squash, shingles, claim_keys, IDENTITY_FIELDS  # noqa: E402


def _load(rel):
    with open(os.path.join(REPO, rel), encoding="utf-8") as f:
        return json.load(f)


@lru_cache(None)
def ctx():
    secs = {}
    for fn in os.listdir(os.path.join(REPO, "sections")):
        if fn.endswith(".json"):
            s = _load(f"sections/{fn}")
            secs[s["id"]] = s
    graph = _load("compatibility/graph.json")
    return {
        "sections": secs,
        "templates": _load("templates/templates.json")["templates"],
        "routes": _load("templates/routes.json")["routes"],
        "graph": graph,
        "severity": {r["id"]: r["severity"] for r in graph["rules"]},
        "exceptions": {r["id"]: set(r.get("exceptions", [])) for r in graph["rules"]},
        "roles": _load("assets/asset-roles.json")["roles"],
        "links": _load("policies/link-kinds.json"),
        "forms": _load("policies/forms.json"),
        "longform": _load("policies/long-form-content.json"),
        "schema": _load("schema/pagespec.schema.json"),
        "identity": _identity(),
        "catalog": _load("tokens/llm/token-catalog.json"),
        "tokenPolicy": _load("tokens/llm/token-policy.json"),
        "integrity": _integrity(secs),
    }


def _identity():
    d = _load("policies/source-identity.json")

    def terms(key):
        out = []
        for t in d[key]:
            ws = tuple(words(t["value"]))
            out.append({"value": t["value"], "words": ws, "squash": squash(t["value"]), "scope": t["match"]})
        return out
    return {"brand": terms("brand"), "persons": terms("persons"), "customers": terms("customers"),
            "thirdParty": terms("thirdPartyMarks"), "hosts": set(d["urls"]["hosts"]),
            "urlPrefixes": list(d["urls"]["urlPrefixes"]), "embeds": list(d["embeds"]),
            "stems": {x.lower() for x in d["assets"]["opaqueStems"]}, "assetFiles": set("/" + f for f in d["assets"]["files"]),
            "claims": set(d["claims"]), "shingles": set(d["copy"]["shingles"])}


def _integrity(secs, roles=None):
    """Also importable by the adversarial suite with a mutated registry / contracts."""
    errs = []
    roles = roles if roles is not None else _load("assets/asset-roles.json")["roles"]
    for r, (av, gm) in PINNED_AVAILABILITY.items():
        d = roles.get(r)
        if d is None:
            errs.append(f"pinned role {r} missing from assets/asset-roles.json")
        elif (d.get("availability"), d.get("generationModePolicy")) != (av, gm):
            errs.append(f"asset-roles {r} is ({d.get('availability')}, {d.get('generationModePolicy')}) but pinned ({av}, {gm})")
    for r in set(roles) - set(PINNED_AVAILABILITY):
        errs.append(f"asset role {r} has no PINNED_AVAILABILITY entry")
    for sid, sec in secs.items():
        want = sid not in RETRIEVAL_INELIGIBLE
        if sec.get("retrievalEligible") is not want:
            errs.append(f"{sid}.retrievalEligible is {sec.get('retrievalEligible')!r} but the pin says {want}")
    return errs


def nwords(s):
    return len(re.findall(r"\S+", s))


RAW_COLOR = re.compile(r"(?<![\w/&])#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?(?:[0-9a-fA-F]{2})?\b(?!-)|\b(?:rgba?|hsla?|oklch|color)\(", re.I)
RAW_LEN = re.compile(r"^-?\d+(\.\d+)?(px|rem|em|%)?$")


def check_token(slot, val, path, rep, tmpl):
    """slot: surface | text | border | spacingY | font."""
    c = ctx()
    cat, pol = c["catalog"], c["tokenPolicy"]["slots"]
    if slot in ("surface", "text", "border"):
        if RAW_COLOR.search(val) or val.startswith("#"):
            rep.add("TOKEN_RAW_VALUE", f"{path}: raw colour {val!r}; use a semantic token name", tmpl)
            return
        mine = cat["themes"][rep.theme]["semantic"]
        others = {t for t, d in cat["themes"].items() if t != rep.theme and val in d["semantic"]}
        if val in mine:
            if not val.startswith(pol[f"node.tokens.{slot}"]["prefix"]):
                rep.add("TOKEN_THEME_MISMATCH", f"{path}: {val!r} is not a {slot} token (needs prefix {pol[f'node.tokens.{slot}']['prefix']!r})", tmpl)
        elif others:
            rep.add("TOKEN_THEME_MISMATCH", f"{path}: {val!r} exists only in theme {sorted(others)}, not {rep.theme!r}", tmpl)
        else:
            rep.add("TOKEN_UNKNOWN", f"{path}: {val!r} is not a token in tokens/llm/token-catalog.json", tmpl)
    elif slot == "spacingY":
        allowed = pol["node.tokens.spacingY"]["allowed"]
        if RAW_LEN.match(val.strip()):
            rep.add("TOKEN_ARBITRARY_SPACING", f"{path}: arbitrary spacing {val!r}; use one of {allowed}", tmpl)
        elif val not in cat["groups"]["spacing"]["tokens"]:
            rep.add("TOKEN_UNKNOWN", f"{path}: {val!r} is not a spacing token", tmpl)
        elif val not in allowed:
            rep.add("TOKEN_ARBITRARY_SPACING", f"{path}: spacing token {val!r} is not allowed as vertical section spacing ({allowed})", tmpl)
    elif slot == "font":
        fams = cat["groups"]["typography.fontFamily"]["tokens"]
        if val not in fams:
            rep.add("TOKEN_UNSUPPORTED_FONT", f"{path}: font {val!r} is not in typography.fontFamily {sorted(fams)}", tmpl)
        elif val not in pol["node.tokens.font"]["allowedByFamily"][rep.family]:
            rep.add("TOKEN_UNSUPPORTED_FONT", f"{path}: font {val!r} is not used by the {rep.family} family", tmpl)


def key_match(tnode, node):
    return tnode["section"] == node["section"] and (tnode["variants"] == "*" or node["variant"] in tnode["variants"])


def sequence_ok(tnodes, nodes):
    @lru_cache(None)
    def m(i, j):
        if i == len(tnodes):
            return j == len(nodes)
        t = tnodes[i]
        if not t["required"] and m(i + 1, j):
            return True
        if j < len(nodes) and key_match(t, nodes[j]):
            if t["repeatable"] and m(i, j + 1):
                return True
            return m(i + 1, j + 1)
        return False
    return m(0, 0)


class Report:
    def __init__(self, mode="clone", theme="mars", family="mars"):
        self.errors, self.warnings = [], []
        self.mode, self.theme, self.family = mode, theme, family

    def add(self, rule, msg, template=None):
        c = ctx()
        if rule != "SCHEMA" and template and template in c["exceptions"].get(rule, set()):
            return
        sev = "error" if rule == "SCHEMA" else c["severity"][rule]
        (self.errors if sev == "error" else self.warnings).append(f"{rule}: {msg}")


def content_schema(sec, variant):
    if "contentByVariant" in sec:
        return sec["contentByVariant"].get(variant)
    return sec["content"]


def walk(schema, val, path, rep, tmpl):
    """Walk content against its contract: maxWords, link fields, media roles."""
    if schema is None:
        return
    if schema.get("x-productKey") and isinstance(val, str) and rep.mode == "generation" and val not in rep.brand_slugs:
        rep.add("GENERATION_MODE_BRAND", f"{path}: product key {val!r} must be one of spec.brand.products slugs {sorted(rep.brand_slugs)}", tmpl)
    for k in ("anyOf", "oneOf"):
        if k in schema and isinstance(val, str):
            for b in schema[k]:
                if "maxWords" in b and nwords(val) > b["maxWords"]:
                    rep.add("MAX_WORDS", f"{path}: {nwords(val)} words > {b['maxWords']}", tmpl)
            return
        if k in schema and isinstance(val, dict):
            # object alternatives (e.g. comparison rows {label, values} | {band}): walk the branch whose required keys are present
            for b in schema[k]:
                if b.get("type") == "object" and set(b.get("required", [])) <= set(val):
                    walk(b, val, path, rep, tmpl)
                    return
            return
    if isinstance(val, str):
        if "maxWords" in schema and nwords(val) > schema["maxWords"]:
            rep.add("MAX_WORDS", f"{path}: {nwords(val)} words > {schema['maxWords']}", tmpl)
        if schema.get("x-linkField"):
            check_link(val, path, rep, tmpl)
        elif schema.get("x-tokenField"):
            check_token(schema["x-tokenField"], val, path, rep, tmpl)
        elif RAW_COLOR.search(val):
            rep.add("TOKEN_RAW_VALUE", f"{path}: raw colour value in content ({RAW_COLOR.search(val).group(0)!r}); reference a semantic token", tmpl)
        return
    if val is None and schema.get("x-linkField"):
        # null is only schema-legal on the known dead-button fields (policies/known-intentional-quirks.json)
        if "null" not in (schema.get("type") or []):
            rep.add("LINK_KINDS", f"{path}: null href outside a known dead-button field", tmpl)
        return
    if isinstance(val, dict):
        props = schema.get("properties", {})
        if "assetRole" in val:
            check_media(val, path, rep, tmpl)
        for k, v in val.items():
            walk(props.get(k), v, f"{path}.{k}", rep, tmpl)
    elif isinstance(val, list):
        for i, v in enumerate(val):
            walk(schema.get("items"), v, f"{path}[{i}]", rep, tmpl)


def check_link(href, path, rep, tmpl):
    L = ctx()["links"]
    if href.startswith("#") or (href.startswith("mailto:") and rep.mode == "clone"):
        return
    if href.startswith("/") and not href.startswith("//"):
        return
    u = urlparse(href)
    if rep.mode == "generation":
        return  # generation mode: every absolute URL is judged by GENERATION_MODE_URL (placeholder hosts only)
    if u.scheme != "https" or u.hostname not in L["outboundHosts"]:
        rep.add("LINK_KINDS", f"{path}: '{href}' is not an internal route or an allowed outbound https host", tmpl)


def check_media(m, path, rep, tmpl):
    role = ctx()["roles"].get(m.get("assetRole"))
    if role is None:
        rep.add("ASSET_ROLE_POLICY", f"{path}: unknown assetRole {m.get('assetRole')!r}", tmpl)
        return
    ref = m.get("ref", "")
    if rep.mode == "generation":
        av, gm = PINNED_AVAILABILITY.get(m["assetRole"], ("blocked-for-generation", "blocked"))
        if av != "generation-safe":
            rule = ROLE_RULE.get(m["assetRole"], "GENERATION_MODE_ASSET")
            rep.add(rule, f"{path}: assetRole {m['assetRole']} is {av}; use one of {role.get('generationSafeSubstitutes')}", tmpl)
        if not GEN_REF.match(ref):
            rule = "GENERATION_MODE_SCREENSHOT" if m["assetRole"] == "product.screenshot" else "GENERATION_MODE_ASSET"
            rep.add(rule, f"{path}: ref {ref!r} is not generate:/placeholder:/user-supplied: (source files are clone-only)", tmpl)
        if m["assetRole"] == "asset.user-supplied" and not ref.startswith("user-supplied:"):
            rep.add("ASSET_ROLE_POLICY", f"{path}: asset.user-supplied needs a user-supplied:<id> ref", tmpl)
        return
    if not ref.startswith("/assets/") and role["cloneModePolicy"] not in ("may-generate-new", "operator-supplied"):
        rep.add("ASSET_ROLE_POLICY", f"{path}: role {m['assetRole']} is {role['cloneModePolicy']} in clone mode; only an existing /assets/ file is allowed", tmpl)


def scan_strings(val, path, rep, tmpl):
    pats = ctx()["forms"]["forbiddenEndpointPatterns"]
    if isinstance(val, str):
        low = val.lower()
        for p in pats:
            if p.lower() in low:
                rep.add("FORM_ENDPOINT_PINNED", f"{path}: references a live HubSpot endpoint ({p})", tmpl)
    elif isinstance(val, dict):
        if "endpointPolicy" in val and val["endpointPolicy"] != PINNED_ENDPOINT:
            rep.add("FORM_ENDPOINT_PINNED", f"{path}.endpointPolicy is {val['endpointPolicy']!r}, must be {PINNED_ENDPOINT!r}", tmpl)
        for k, v in val.items():
            scan_strings(v, f"{path}.{k}", rep, tmpl)
    elif isinstance(val, list):
        for i, v in enumerate(val):
            scan_strings(v, f"{path}[{i}]", rep, tmpl)


def check_longform(sec_id, content, path, rep, tmpl):
    lf = ctx()["longform"]
    if sec_id not in lf["appliesTo"]:
        return
    lim = lf["limits"]

    def forbidden(v, p):
        if isinstance(v, dict):
            for k, x in v.items():
                if k in lf["forbiddenContentKeys"]:
                    rep.add("LONG_FORM_SUMMARY_ONLY", f"{p}.{k}: prose key forbidden on long-form sections", tmpl)
                forbidden(x, f"{p}.{k}")
        elif isinstance(v, list):
            for i, x in enumerate(v):
                forbidden(x, f"{p}[{i}]")

    # case.detail-body nests its long-form part under 'body'
    body = content.get("body") if sec_id == "case.detail-body" else content
    if sec_id == "case.detail-body":
        forbidden({k: v for k, v in content.items() if k != "body"}, path)
    else:
        forbidden(content, path)
    if not isinstance(body, dict):
        return
    if sec_id != "legal.single-document" and body.get("contentPolicy") != "summary-only":
        rep.add("LONG_FORM_SUMMARY_ONLY", f"{path}: contentPolicy must be 'summary-only'", tmpl)
    texts = []
    for item in body.get("outline", []) + body.get("sections", []):
        s = item.get("summary")
        if s:
            texts.append(s)
            if len(re.findall(r"[.!?](\s|$)", s)) > lim["maxSentencesPerSummary"]:
                rep.add("LONG_FORM_SUMMARY_ONLY", f"{path}: summary has more than {lim['maxSentencesPerSummary']} sentences (looks like copied prose)", tmpl)
        texts.append(item.get("heading", ""))
    texts += body.get("storyOutline", [])
    total = sum(nwords(t) for t in texts)
    if total > lim["maxTotalOutlineWords"]:
        rep.add("LONG_FORM_SUMMARY_ONLY", f"{path}: outline totals {total} words > {lim['maxTotalOutlineWords']}", tmpl)


def validate(spec):
    import jsonschema
    c = ctx()
    tmpl = c["templates"].get(spec.get("template")) if isinstance(spec, dict) else None
    rep = Report(mode=spec.get("mode", "clone") if isinstance(spec, dict) else "clone",
                 theme=spec.get("theme", "mars") if isinstance(spec, dict) else "mars",
                 family=(tmpl or {}).get("chromeFamily", "mars"))
    rep.brand_slugs = {p["slug"] for p in spec.get("brand", {}).get("products", []) if isinstance(p, dict) and "slug" in p} if isinstance(spec, dict) and isinstance(spec.get("brand"), dict) else set()
    for e in c["integrity"]:
        rep.add("CONTRACT_INTEGRITY", e)
    for e in sorted(jsonschema.Draft7Validator(c["schema"]).iter_errors(spec), key=lambda e: list(e.absolute_path)):
        rep.add("SCHEMA", f"{'/'.join(map(str, e.absolute_path)) or '<root>'}: {e.message[:200]}")
    if any(e.startswith("SCHEMA:") for e in rep.errors):
        return rep  # semantic layer assumes a schema-valid shape
    tid = spec["template"]
    T = c["templates"][tid]
    nodes = spec["nodes"]
    S = c["sections"]

    # template cross-reference (not nodes[] in isolation)
    if spec["theme"] != T["theme"]:
        rep.add("THEME_MATCHES_TEMPLATE", f"theme {spec['theme']!r} but template {tid} is {T['theme']!r}", tid)
    fam = T["chromeFamily"]
    for i, n in enumerate(nodes):
        if S[n["section"]]["family"] != fam:
            rep.add("CHROME_FAMILY_NO_MIX", f"nodes[{i}] {n['section']} is a {S[n['section']]['family']} section on a {fam} template", tid)
    secs = [n["section"] for n in nodes]
    if fam == "mars" and ("chrome.navbar" not in secs or "chrome.footer" not in secs):
        rep.add("CHROME_FAMILY_NO_MIX", "mars page must carry chrome.navbar and chrome.footer", tid)
    if fam == "legacy" and "chrome.legacy-nav" not in secs:
        rep.add("CHROME_FAMILY_NO_MIX", "legacy page must carry chrome.legacy-nav", tid)

    ids = [n["id"] for n in nodes]
    if len(ids) != len(set(ids)):
        rep.add("NODE_IDS_UNIQUE", "duplicate node ids", tid)

    tn = T["nodes"]
    if not sequence_ok(tn, nodes):
        missing = [f"({t['section']},{t['variants']})" for t in tn if t["required"] and not any(key_match(t, n) for n in nodes)]
        extra = [f"({n['section']},{n['variant']})" for n in nodes if not any(key_match(t, n) for t in tn)]
        detail = (f" missing required {missing}" if missing else "") + (f" not in template {extra}" if extra else "") or " order / multiplicity differs from template"
        rep.add("TEMPLATE_SEQUENCE", f"nodes do not match template {tid}:{detail}", tid)

    # ONE_PER_PAGE keyed on (section, variant)
    from collections import Counter
    cnt = Counter((n["section"], n["variant"]) for n in nodes)
    for (s, v), k in cnt.items():
        slots = [t for t in tn if t["section"] == s and (t["variants"] == "*" or v in t["variants"])]
        if any(t["repeatable"] for t in slots) or S[s]["constraints"].get("repeatable"):
            continue
        if k > max(1, len(slots)):
            rep.add("ONE_PER_PAGE", f"({s},{v}) appears {k} times", tid)

    hero_keys = c["graph"]["heroKeys"]
    is_hero = lambda n: any(n["section"] == s and (v == "*" or n["variant"] == v) for s, v in hero_keys)
    heroes = [i for i, n in enumerate(nodes) if is_hero(n)]
    if len(heroes) > 1:
        rep.add("ONE_HERO", f"{len(heroes)} hero nodes at {heroes}", tid)
    if heroes:
        first = next((i for i, n in enumerate(nodes) if not n["section"].startswith("chrome.") and n["section"] != "layout.spacer"), None)
        if heroes[0] != first:
            rep.add("HERO_FIRST_AFTER_CHROME", f"hero at nodes[{heroes[0]}] is not the first content node", tid)
    for i in range(1, len(nodes)):
        if nodes[i]["section"] == nodes[i - 1]["section"] == "layout.spacer":
            rep.add("NO_CONSECUTIVE_SPACERS", f"spacers at nodes[{i-1}] and nodes[{i}]", tid)
    if len(nodes) > 1 and nodes[0]["section"] == "chrome.navbar" and nodes[1]["section"] == "layout.spacer" and nodes[1]["variant"] == "band-65":
        rep.add("BAND_SPACER_NOT_FIRST", "band-65 spacer directly under the nav", tid)
    for i, n in enumerate(nodes):
        if n["section"] == "conversion.two-products-band" and (i + 1 >= len(nodes) or nodes[i + 1]["section"] != "chrome.footer"):
            rep.add("TWO_PRODUCTS_BAND_BEFORE_FOOTER", f"nodes[{i}] two-products band not followed by chrome.footer", tid)
        if n["section"] == "chrome.footer" and i > 0 and nodes[i - 1]["section"] == "layout.spacer":
            rep.add("SPACER_BEFORE_FOOTER", "spacer directly before the footer", tid)

    route = spec["route"]
    if (tid == "home" or "hero.home" in secs) and route != "/":
        rep.add("HOME_ROUTE_ONLY", f"home template / hero.home on {route!r}", tid)
    redirects = {r["path"] for r in c["routes"] if r["kind"] == "redirect"}
    if route in redirects:
        rep.add("ROUTE_NOT_REDIRECT_OR_EXTERNAL", f"{route} is an existing redirect source", tid)

    hero_text = 0
    for i, n in enumerate(nodes):
        sec = S[n["section"]]
        p = f"nodes[{i}]({n['section']})"
        if n["motion"].get("reducedMotionFallback") != sec["motion"]["reducedMotionFallback"]:
            rep.add("REDUCED_MOTION_FALLBACK", f"{p}: fallback must be {sec['motion']['reducedMotionFallback']!r}", tid)
        if set(n["motion"]["patterns"]) & {"hero-word-blur-in", "text-effect"}:
            hero_text += 1
        walk(content_schema(sec, n["variant"]), n["content"], p + ".content", rep, tid)
        for slot, v in n.get("tokens", {}).items():
            check_token(slot, v, f"{p}.tokens.{slot}", rep, tid)
        check_longform(n["section"], n["content"], p + ".content", rep, tid)
    if "brand" in spec:
        walk(c["schema"]["definitions"]["brand"], spec["brand"], "brand", rep, tid)
    scan_strings(spec, "spec", rep, tid)
    if hero_text > 1:
        rep.add("HERO_TEXT_MOTION_BUDGET", f"{hero_text} nodes use a hero text appear", tid)
    if nwords(spec["meta"]["title"]) > 14:
        rep.add("MAX_WORDS", "meta.title over 14 words", tid)
    if rep.mode == "generation":
        generation_scan(spec, rep, tid)
    return rep


# ---------------------------------------------------------------- mode = generation
URL_RE = re.compile(r"(?:https?:)?//([a-z0-9.-]+)|mailto:[^@\s]+@([a-z0-9.-]+)|[\w.+-]+@([a-z0-9-]+(?:\.[a-z0-9-]+)+)|\b((?:[a-z0-9-]+\.)+(?:com|ai|dev|io|net|org|co|eu|app|cloud|so|xyz|tech|sh|de|gg|me))\b", re.I)


def _has_words(ws, needle):
    n = len(needle)
    return n > 0 and any(tuple(ws[i:i + n]) == needle for i in range(len(ws) - n + 1))


def _fixed(schema):
    return bool(schema) and any(k in schema for k in ("const", "enum", "pattern"))


def scan_string(s, path, key, schema, rep, tmpl):
    I = ctx()["identity"]
    ws, sq, low = words(s), squash(s), normalise(s)
    identity_field = key in IDENTITY_FIELDS
    for t in I["brand"]:
        if (len(t["squash"]) >= 8 and t["squash"] in sq) or _has_words(ws, t["words"]):
            rep.add("GENERATION_MODE_BRAND", f"{path}: source brand/entity {t['value']!r}", tmpl)
            break
    for cat, rule in (("persons", "GENERATION_MODE_PERSON"), ("customers", "GENERATION_MODE_CUSTOMER"), ("thirdParty", "GENERATION_MODE_THIRD_PARTY")):
        for t in I[cat]:
            if (t["scope"] == "anywhere" or identity_field) and _has_words(ws, t["words"]):
                rep.add(rule, f"{path}: real {cat[:-1] if cat != 'thirdParty' else 'third-party mark'} {t['value']!r}", tmpl)
                break
    for m in URL_RE.finditer(low):
        host = next(g for g in m.groups() if g).lower().rstrip(".")
        if PLACEHOLDER_HOST.search(host):
            continue
        src = host in I["hosts"] or any(low.find(u) >= 0 for u in I["urlPrefixes"] if "/" in u and u.split("/")[0] == host)
        rep.add("GENERATION_MODE_URL", f"{path}: {'source' if src else 'non-placeholder'} host {host!r}; generated pages use .example/.invalid hosts only", tmpl)
    if schema and schema.get("x-embedField") or any(e in low for e in I["embeds"]):
        h = urlparse(s).hostname or ""
        if not PLACEHOLDER_HOST.search(h) or any(e in low for e in I["embeds"]):
            rep.add("GENERATION_MODE_EMBED", f"{path}: embed {s!r} is a source/non-placeholder embed", tmpl)
    if any(st in low for st in I["stems"]) or s in I["assetFiles"]:
        rep.add("GENERATION_MODE_ASSET", f"{path}: references a source asset file", tmpl)
    if _fixed(schema):
        return  # schema-fixed strings (const/enum/pattern) are layout text, not authored copy
    hits = I["claims"] & claim_keys(s)
    if hits:
        rep.add("GENERATION_MODE_CLAIM", f"{path}: source-specific claim {sorted(hits)[:3]}", tmpl)
    sh = [h for h in shingles(s) if h in I["shingles"]]
    if sh:
        rep.add("GENERATION_MODE_COPY", f"{path}: {len(sh)} 5-word shingle(s) of source copy", tmpl)


def scan_tree(schema, val, path, key, rep, tmpl):
    schema = schema or {}
    if isinstance(val, str):
        if "anyOf" in schema or "oneOf" in schema:
            schema = next((b for b in schema.get("anyOf", schema.get("oneOf")) if b.get("type") in ("string", None)), {})
        scan_string(val, path, key, schema, rep, tmpl)
    elif isinstance(val, dict):
        if "anyOf" in schema or "oneOf" in schema:
            schema = next((b for b in schema.get("anyOf", schema.get("oneOf")) if b.get("type") == "object" and set(b.get("required", [])) <= set(val)), {})
        props = schema.get("properties", {})
        for k, v in val.items():
            scan_tree(props.get(k), v, f"{path}.{k}", k, rep, tmpl)
    elif isinstance(val, list):
        for i, v in enumerate(val):
            scan_tree(schema.get("items"), v, f"{path}[{i}]", key, rep, tmpl)


def generation_scan(spec, rep, tmpl):
    c = ctx()
    scan_string(spec["route"], "route", "route", {}, rep, tmpl)
    for k, v in spec["meta"].items():
        scan_string(v, f"meta.{k}", k, {}, rep, tmpl)
    scan_tree(c["schema"]["definitions"]["brand"], spec.get("brand", {}), "brand", None, rep, tmpl)
    for i, n in enumerate(spec["nodes"]):
        scan_string(n["id"], f"nodes[{i}].id", "id", {"pattern": "id"}, rep, tmpl)
        sec = c["sections"][n["section"]]
        scan_tree(content_schema(sec, n["variant"]), n["content"], f"nodes[{i}]({n['section']}).content", None, rep, tmpl)


def main(argv):
    bad = 0
    for p in argv:
        with open(p, encoding="utf-8") as f:
            rep = validate(json.load(f))
        print(f"{p}: {len(rep.errors)} error(s), {len(rep.warnings)} warning(s)")
        for e in rep.errors:
            print("  ERROR", e)
        for w in rep.warnings:
            print("  WARN ", w)
        bad += bool(rep.errors)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:] or [os.path.join(REPO, "schema/example.pagespec.json")]))
