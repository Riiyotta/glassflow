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

RULE_IDS = {"SCHEMA", "TEMPLATE_SEQUENCE", "THEME_MATCHES_TEMPLATE", "CHROME_FAMILY_NO_MIX", "ONE_PER_PAGE", "ONE_HERO",
            "HERO_FIRST_AFTER_CHROME", "NO_CONSECUTIVE_SPACERS", "BAND_SPACER_NOT_FIRST", "TWO_PRODUCTS_BAND_BEFORE_FOOTER",
            "SPACER_BEFORE_FOOTER", "HOME_ROUTE_ONLY", "ROUTE_NOT_REDIRECT_OR_EXTERNAL", "MAX_WORDS", "LONG_FORM_SUMMARY_ONLY",
            "FORM_ENDPOINT_PINNED", "LINK_KINDS", "ASSET_ROLE_POLICY", "REDUCED_MOTION_FALLBACK", "HERO_TEXT_MOTION_BUDGET", "NODE_IDS_UNIQUE"}
# "SCHEMA" is the Draft-07 layer, not a graph rule.
GRAPH_RULE_IDS = RULE_IDS - {"SCHEMA"}

PINNED_ENDPOINT = "must-not-reuse-live-endpoint"


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
    }


def words(s):
    return len(re.findall(r"\S+", s))


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
    def __init__(self):
        self.errors, self.warnings = [], []

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
    for k in ("anyOf", "oneOf"):
        if k in schema and isinstance(val, str):
            for b in schema[k]:
                if "maxWords" in b and words(val) > b["maxWords"]:
                    rep.add("MAX_WORDS", f"{path}: {words(val)} words > {b['maxWords']}", tmpl)
            return
        if k in schema and isinstance(val, dict):
            # object alternatives (e.g. comparison rows {label, values} | {band}): walk the branch whose required keys are present
            for b in schema[k]:
                if b.get("type") == "object" and set(b.get("required", [])) <= set(val):
                    walk(b, val, path, rep, tmpl)
                    return
            return
    if isinstance(val, str):
        if "maxWords" in schema and words(val) > schema["maxWords"]:
            rep.add("MAX_WORDS", f"{path}: {words(val)} words > {schema['maxWords']}", tmpl)
        if schema.get("x-linkField"):
            check_link(val, path, rep, tmpl)
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
    if href.startswith("#") or href.startswith("mailto:"):
        return
    if href.startswith("/") and not href.startswith("//"):
        return
    u = urlparse(href)
    if u.scheme != "https" or u.hostname not in L["outboundHosts"]:
        rep.add("LINK_KINDS", f"{path}: '{href}' is not an internal route or an allowed outbound https host", tmpl)


def check_media(m, path, rep, tmpl):
    role = ctx()["roles"].get(m.get("assetRole"))
    if role is None:
        rep.add("ASSET_ROLE_POLICY", f"{path}: unknown assetRole {m.get('assetRole')!r}", tmpl)
        return
    ref = m.get("ref", "")
    if ref.startswith("generate:") and role["generationPolicy"] != "may-generate-new":
        rep.add("ASSET_ROLE_POLICY", f"{path}: role {m['assetRole']} is {role['generationPolicy']}; generated refs are forbidden", tmpl)


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
    total = sum(words(t) for t in texts)
    if total > lim["maxTotalOutlineWords"]:
        rep.add("LONG_FORM_SUMMARY_ONLY", f"{path}: outline totals {total} words > {lim['maxTotalOutlineWords']}", tmpl)


def validate(spec):
    import jsonschema
    c = ctx()
    rep = Report()
    for e in sorted(jsonschema.Draft7Validator(c["schema"]).iter_errors(spec), key=lambda e: list(e.absolute_path)):
        rep.add("SCHEMA", f"{'/'.join(map(str, e.absolute_path)) or '<root>'}: {e.message[:200]}")
    if rep.errors:
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
        check_longform(n["section"], n["content"], p + ".content", rep, tid)
    scan_strings(spec, "spec", rep, tid)
    if hero_text > 1:
        rep.add("HERO_TEXT_MOTION_BUDGET", f"{hero_text} nodes use a hero text appear", tid)
    if words(spec["meta"]["title"]) > 14:
        rep.add("MAX_WORDS", "meta.title over 14 words", tid)
    return rep


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
