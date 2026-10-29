#!/usr/bin/env python3
"""Adds the two closed objects every section contract carries (baseline R7):

  source   {id, tag, file, lines}  what the DOM/component is (traceable provenance)
  semantic {id, category}          what the AI sees (taxonomy); semantic.id == contract id

source is derived from the contract's own implementedBy citations: the first citation whose quote
names a component/function/element gives `tag` (e.g. 'Testimonial', 'Shell'), `file` and `lines`.
verify_all.py (contract-provenance) re-reads every range from the real file and fails if the tag is
not inside it, or if source.id == semantic.id. Wrapper/class naming never decides semantic.category:
it is the contract's reviewed `category`.

Usage: python3 extraction/build_contract_provenance.py [--check]
"""
import json, os, re, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TAG = re.compile(r"(?:export\s+(?:default\s+)?)?function\s+(\w+)|const\s+([A-Z_][A-Z0-9_]*)\b|<([A-Z]\w*)|\b([A-Z]\w*)\(|\.(\w+)\.map\(")


def tag_of(quote):
    m = TAG.search(quote)
    return next((g for g in m.groups() if g), None) if m else None


def provenance(sec):
    for c in sec.get("implementedBy", []):
        t = tag_of(c["quote"])
        if t:
            return {"id": f"src:{t}@{c['path']}:{c['lines']}", "tag": t, "file": c["path"], "lines": c["lines"]}
    raise SystemExit(f"{sec['id']}: no implementedBy citation names a tag")


def apply(sec):
    out = {}
    for k, v in sec.items():
        if k in ("source", "semantic"):
            continue
        out[k] = v
        if k == "implementedBy":
            out["source"] = provenance(sec)
            out["semantic"] = {"id": sec["id"], "category": sec["category"]}
    return out


def main():
    drift = []
    for fn in sorted(os.listdir(os.path.join(REPO, "sections"))):
        p = os.path.join(REPO, "sections", fn)
        cur = open(p, encoding="utf-8").read()
        new = json.dumps(apply(json.loads(cur)), indent=2, ensure_ascii=False) + "\n"
        if new != cur:
            drift.append(fn)
            if "--check" not in sys.argv:
                open(p, "w", encoding="utf-8").write(new)
    if "--check" in sys.argv:
        print("contract provenance in sync" if not drift else f"PROVENANCE DRIFT in {drift}")
        return 1 if drift else 0
    print(f"updated {len(drift)} section contracts")
    return 0


if __name__ == "__main__":
    sys.exit(main())
