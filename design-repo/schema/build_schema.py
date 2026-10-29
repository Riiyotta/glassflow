#!/usr/bin/env python3
"""Builds schema/pagespec.schema.json (JSON Schema draft-07) from the section contracts,
templates, asset roles and motion patterns. verify_all.py re-runs this in memory and fails
if the on-disk schema has drifted from the contracts.

Usage: python3 schema/build_schema.py [--check]
"""
import json, os, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load(rel):
    with open(os.path.join(REPO, rel), encoding="utf-8") as f:
        return json.load(f)


def sections():
    out = {}
    for fn in sorted(os.listdir(os.path.join(REPO, "sections"))):
        if fn.endswith(".json"):
            s = load(f"sections/{fn}")
            out[s["id"]] = s
    return out


def defname(sid, variant=None):
    return "content__" + sid.replace(".", "_").replace("-", "_") + (f"__{variant.replace('-', '_')}" if variant else "")


def build():
    S = sections()
    T = load("templates/templates.json")["templates"]
    roles = load("assets/asset-roles.json")["roles"]
    pats = load("tokens/00-foundation/motion.json")["patterns"]
    defs = {
        "motion": {"type": "object", "required": ["patterns", "reducedMotionFallback"],
                   "properties": {"patterns": {"type": "array", "uniqueItems": True, "items": {"enum": sorted(pats)}},
                                  "reducedMotionFallback": {"type": "string"}},
                   "additionalProperties": False,
                   "description": "Closed to the real fields; patterns closed to tokens/00-foundation/motion.json."},
        "assetRole": {"enum": sorted(r for r, d in roles.items() if d.get("kind", "media") == "media")},
        "tokens": {"type": "object", "additionalProperties": False, "minProperties": 1,
                   "properties": {k: {"type": "string", "minLength": 1} for k in ("surface", "text", "border", "spacingY", "font")},
                   "description": "Optional per-node token NAMES (tokens/llm/token-policy.json slots). Strings, not enums, so the semantic validator can name the failure (TOKEN_UNKNOWN / _RAW_VALUE / _ARBITRARY_SPACING / _UNSUPPORTED_FONT / _THEME_MISMATCH)."},
    }
    branches = []
    for sid, s in S.items():
        cond = {"properties": {"section": {"const": sid}}, "required": ["section"]}
        motion = {"type": "object", "required": ["patterns", "reducedMotionFallback"], "additionalProperties": False,
                  "properties": {"patterns": {"type": "array", "uniqueItems": True, "items": {"enum": s["motion"]["allowedPatterns"]} if s["motion"]["allowedPatterns"] else {"enum": []}},
                                 "reducedMotionFallback": {"const": s["motion"]["reducedMotionFallback"]}}}
        then = {"properties": {"variant": {"enum": sorted(s["variants"])}, "motion": motion}}
        if "contentByVariant" in s:
            for v, c in s["contentByVariant"].items():
                defs[defname(sid, v)] = c
                branches.append({"if": {"properties": {"section": {"const": sid}, "variant": {"const": v}}, "required": ["section", "variant"]},
                                 "then": {"properties": {"content": {"$ref": f"#/definitions/{defname(sid, v)}"}}}})
        else:
            defs[defname(sid)] = s["content"]
            then["properties"]["content"] = {"$ref": f"#/definitions/{defname(sid)}"}
        branches.append({"if": cond, "then": then})
    node = {"type": "object", "required": ["id", "section", "variant", "content", "motion"], "additionalProperties": False,
            "properties": {"id": {"type": "string", "pattern": "^[a-z0-9][a-z0-9-]*$"}, "section": {"enum": sorted(S)},
                           "variant": {"type": "string"}, "content": {"type": "object"}, "motion": {"$ref": "#/definitions/motion"},
                           "tokens": {"$ref": "#/definitions/tokens"}},
            "allOf": branches}
    defs["node"] = node
    PH = "^(generate:.{8,200}|placeholder:[a-z0-9][a-z0-9-]{2,59}|user-supplied:[a-z0-9][a-z0-9-]{2,59})$"
    defs["brand"] = {
        "type": "object", "additionalProperties": False, "required": ["name", "mark", "products"],
        "description": "mode=generation only (required there, forbidden in clone mode): the OPERATOR's brand. Renderers of sections with generationSubstitution (chrome.navbar, chrome.footer, chrome.legacy-nav, conversion.two-products-band) render these values in place of the clone's fixed GlassFlow wordmark/product names.",
        "properties": {
            "name": {"type": "string", "minLength": 2, "maxWords": 4},
            "mark": {"type": "object", "additionalProperties": False, "required": ["assetRole", "ref", "alt"],
                     "properties": {"assetRole": {"enum": ["brand.placeholder-mark", "asset.user-supplied"]},
                                    "ref": {"type": "string", "pattern": PH}, "alt": {"type": "string", "maxWords": 14}}},
            "products": {"type": "array", "minItems": 1, "maxItems": 2,
                         "items": {"type": "object", "additionalProperties": False, "required": ["name", "slug"],
                                   "properties": {"name": {"type": "string", "minLength": 2, "maxWords": 3},
                                                  "slug": {"type": "string", "pattern": "^[a-z][a-z0-9-]{1,23}$"}}}},
        },
    }
    return {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$id": "glassflow-design-repo/pagespec.schema.json",
        "title": "GlassFlow PageSpec (generated by schema/build_schema.py - do not hand-edit)",
        "type": "object", "additionalProperties": False,
        "required": ["pageSpecVersion", "mode", "template", "theme", "route", "meta", "nodes"],
        "properties": {
            "pageSpecVersion": {"const": "1.2.0"},
            "mode": {"enum": ["clone", "generation"],
                     "description": "clone = faithful GlassFlow reconstruction (real assets/copy allowed). generation = a new page for another brand: the semantic validator rejects every GlassFlow identity, asset, URL, claim and copy match (GENERATION_MODE_* rules)."},
            "template": {"enum": sorted(T)},
            "theme": {"enum": ["mars", "legacy-black"]},
            "route": {"type": "string", "pattern": "^/[a-z0-9/_-]*$"},
            "meta": {"type": "object", "additionalProperties": False, "required": ["title"],
                     "properties": {"title": {"type": "string", "maxWords": 14}, "description": {"type": "string", "maxWords": 40}}},
            "nodes": {"type": "array", "minItems": 1, "items": {"$ref": "#/definitions/node"}},
            "brand": {"$ref": "#/definitions/brand"},
        },
        "allOf": [{"if": {"properties": {"mode": {"const": "generation"}}, "required": ["mode"]},
                   "then": {"required": ["brand"]}, "else": {"not": {"required": ["brand"]}}}],
        "definitions": defs,
    }


if __name__ == "__main__":
    sch = build()
    path = os.path.join(REPO, "schema/pagespec.schema.json")
    text = json.dumps(sch, indent=2, ensure_ascii=False) + "\n"
    if "--check" in sys.argv:
        cur = open(path, encoding="utf-8").read() if os.path.exists(path) else ""
        print("schema in sync" if cur == text else "SCHEMA DRIFT")
        sys.exit(0 if cur == text else 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("wrote", os.path.relpath(path, REPO), len(sch["definitions"]), "definitions")
