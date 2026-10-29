#!/usr/bin/env python3
"""Maps the raw output of extraction/measure_sections.mjs onto template nodes and stores it in
extraction/measured-values.json under `sectionHeights` (read by extraction/wrapper_gate.py).

Mapping rules (no guessing):
  * <header> -> chrome.navbar (or chrome.legacy-nav, which is position:fixed and takes no page
    height), <footer> -> chrome.footer;
  * the in-flow children of <main> are matched in order to the template's other nodes, honouring
    required / repeatable flags; a section that renders as several sibling blocks consumes that many
    children (DOM_SIBLINGS, each with a source citation);
  * every assignment consistent with the template is enumerated: one => mapping "exact"; several =>
    positions on which all assignments agree are named, the rest get section null + candidates
    ("positional-ambiguous"); none => "unmappable" (an error in the gate).

Usage: python3 extraction/record_section_heights.py <raw-measure.json>
"""
import json, os, sys, datetime

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOM_SIBLINGS = {
    "feature.what-you-get": (2, {"path": "src/pages/Rius.jsx", "lines": "228-258", "quote": "function WhatYouGet()"}),
    "blog.related-posts": (2, {"path": "src/components/ContentSections.jsx", "lines": "285-297", "quote": "export function RelatedPosts"}),
    "legacy.category-grid": (2, {"path": "src/pages/Category.jsx", "lines": "75-79", "quote": "<h1 className={`w-full max-w-[1220px] text-center ${HEADING}`}>"}),
}
FIXED_CHROME = {"chrome.legacy-nav": {"path": "src/components/LegacyLayout.jsx", "lines": "92", "quote": "<header className=\"fixed inset-x-0 top-0 z-50 h-[62px]"}}


def load(rel):
    with open(os.path.join(REPO, rel), encoding="utf-8") as f:
        return json.load(f)


def assignments(tnodes, n_children, limit=2000):
    """All ways to lay template nodes over n children: lists of (node_index) per child."""
    out = []

    def rec(i, pos, acc):
        if len(out) >= limit:
            return
        if i == len(tnodes):
            if pos == n_children:
                out.append(list(acc))
            return
        t = tnodes[i]
        k = DOM_SIBLINGS.get(t["section"], (1,))[0]
        if not t["required"]:
            rec(i + 1, pos, acc)
        if pos + k <= n_children:
            acc.extend([i] * k)
            if t["repeatable"]:
                rec(i, pos + k, acc)
            rec(i + 1, pos + k, acc)
            del acc[-k:]
    rec(0, 0, [])
    # de-duplicate (repeatable + skip can produce identical layouts)
    uniq = []
    for a in out:
        if a not in uniq:
            uniq.append(a)
    return uniq


def map_route(tid, T, m):
    tn = [n for n in T["nodes"] if n["section"] not in ("chrome.navbar", "chrome.footer") and n["section"] not in FIXED_CHROME]
    kids = m["children"]
    alts = assignments(tn, len(kids))
    nodes = []
    for chrome in ("chrome.navbar", "chrome.legacy-nav"):
        if any(n["section"] == chrome for n in T["nodes"]):
            fixed = chrome in FIXED_CHROME
            nodes.append({"section": chrome, "variants": ["default"], "heightPx": 0 if fixed else m["navbarPx"], "inFlow": not fixed,
                          **({"note": f"position:fixed ({m['navbarPx']}px tall, takes no page height)"} if fixed else {})})
    mapping = "exact" if len(alts) == 1 else ("unmappable" if not alts else "positional-ambiguous")
    for j, c in enumerate(kids):
        cand = sorted({tn[a[j]]["section"] for a in alts})
        if len(cand) == 1:
            t = tn[alts[0][j]]
            part = None
            k = DOM_SIBLINGS.get(t["section"], (1,))[0]
            if k > 1:
                part = f"{sum(1 for x in alts[0][:j] if x == alts[0][j]) % k + 1}/{k}"
            nodes.append({"section": t["section"], "variants": t["variants"], "heightPx": c["heightPx"], "inFlow": True, **({"domPart": part} if part else {})})
        else:
            nodes.append({"section": None, "candidates": cand, "heightPx": c["heightPx"], "inFlow": True})
    if any(n["section"] == "chrome.footer" for n in T["nodes"]):
        nodes.append({"section": "chrome.footer", "variants": ["default"], "heightPx": m["footerPx"], "inFlow": True})
    return {"template": tid, "route": m["route"], "pageHeightPx": m["pageHeightPx"], "mapping": mapping,
            "assignments": len(alts), "nodes": nodes}


def main(raw_path):
    raw = json.load(open(raw_path, encoding="utf-8"))
    T = load("templates/templates.json")["templates"]
    routes = []
    for tid, ms in raw["templates"].items():
        for m in ms:
            routes.append(map_route(tid, T[tid], m))
    mv = load("extraction/measured-values.json")
    mv["sectionHeights"] = {
        "viewport": raw["viewport"],
        "viewportNote": "1440px desktop, measured from the built clone (vite build + vite preview), not the live site",
        "method": raw["method"],
        "tool": "extraction/measure_sections.mjs -> extraction/record_section_heights.py",
        "measuredOn": datetime.date.today().isoformat(),
        "domSiblings": {k: {"blocks": v[0], "evidence": v[1]} for k, v in DOM_SIBLINGS.items()},
        "fixedChrome": FIXED_CHROME,
        "routes": routes,
    }
    with open(os.path.join(REPO, "extraction/measured-values.json"), "w", encoding="utf-8") as f:
        f.write(json.dumps(mv, indent=2, ensure_ascii=False) + "\n")
    for r in routes:
        print(f"{r['template']:20} {r['route'][:48]:48} {r['mapping']:22} {r['assignments']}")


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
