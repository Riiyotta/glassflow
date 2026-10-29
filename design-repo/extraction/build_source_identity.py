#!/usr/bin/env python3
"""Derives the GENERATION-mode blocklist (policies/source-identity.json) from the REAL source
project (the clone folder that contains design-repo/): src/, CLONE_SPEC.md, ASSETS.md,
specs/*.md and public/assets.

Nothing in the output is hand-typed: every term carries the file:line it was read from, and copy
is stored only as hashed 5-word shingles (sha256, 16 hex chars) of the normalised text.
schema/semantic_validate.py loads the output and, when a PageSpec has mode = "generation",
rejects any match under one named rule per category (GENERATION_MODE_BRAND / _PERSON /
_CUSTOMER / _THIRD_PARTY / _URL / _EMBED / _CLAIM / _COPY / _ASSET / _SCREENSHOT).

The extractors are specific to this source (they know where GlassFlow keeps its team table,
logo strips, testimonials and post authors). A handful of decisions are judgement calls and are
listed in JUDGEMENT below; no human has reviewed them (agent-derived).

Usage:
  python3 extraction/build_source_identity.py          # write policies/source-identity.json
  python3 extraction/build_source_identity.py --check  # exit 1 if the file differs from a rebuild
Source root: <design-repo>/.. or $GLASSFLOW_SOURCE_ROOT.
"""
import hashlib, json, os, re, sys, unicodedata

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.environ.get("GLASSFLOW_SOURCE_ROOT") or os.path.dirname(REPO)
OUT = os.path.join(REPO, "policies/source-identity.json")

# Judgement calls (agent-made, not human-reviewed):
#  - Common English words that are also real company/product names are matched only inside
#    identity fields (name/label/alt/company/role/author/caption), never in free copy.
COMMON_WORD_TERMS = {"entire", "claude", "cursor", "core", "growth", "pro"}
#  - 'GlassFlow' is the author of 7 posts; it is a brand term, not a person.
NOT_PERSONS = {"glassflow"}
#  - Words that make a 5-word shingle too generic to prove copying.
STOP = set("a an and are as at be but by can do for from has have how i if in into is it its of on or our so that the their them then there these this to up us we what when which will with you your not no all any more most one".split())

ZW = re.compile("[​‌‍⁠﻿­]")
QUOTES = {"‘": "'", "’": "'", "‚": "'", "‛": "'", "′": "'", "“": '"', "”": '"', "„": '"', "″": '"', "«": '"', "»": '"'}
DASHES = re.compile("[‐‑‒–—―−﹘﹣－]")


def normalise(s):
    """Shared with schema/semantic_validate.py (it imports this function): NFKC, zero-width removal,
    curly quotes -> straight, unicode dashes -> '-', lowercase, whitespace collapsed."""
    s = ZW.sub("", unicodedata.normalize("NFKC", s))
    s = "".join(QUOTES.get(c, c) for c in s)
    s = DASHES.sub("-", s)
    return re.sub(r"\s+", " ", s).strip().lower()


def words(s):
    return re.findall(r"[a-z0-9]+(?:'[a-z]+)?", normalise(s))


def squash(s):
    return re.sub(r"[^a-z0-9]", "", normalise(s))


def shingle_hash(ws):
    return hashlib.sha256(" ".join(ws).encode()).hexdigest()[:16]


def shingles(text):
    ws = words(text)
    for i in range(len(ws) - 4):
        g = ws[i:i + 5]
        if sum(w in STOP for w in g) >= 4 or all(w.isdigit() for w in g):
            continue
        yield shingle_hash(g)


NUM_UNIT = re.compile(r"(\$\s?\d[\d,.]*\s?[km]?|\d[\d,.]*\s?(?:%|x\b|×|k\b|m\b|tb\b|gb\b|ms\b|\+))")


def claim_keys(text):
    """Numeric claim fingerprints: '<number><unit> <next word>' pairs plus bare currency amounts."""
    t = normalise(text).replace("×", "x")
    out = set()
    for m in NUM_UNIT.finditer(t):
        tok = re.sub(r"\s+", "", m.group(1)).rstrip(".,")
        if not re.search(r"[%x+$kmtgb]", tok):
            continue
        nxt = re.match(r"\s*(?:/\s*)?([a-z]+)", t[m.end():])
        if tok.startswith("$") and len(re.sub(r"\D", "", tok)) >= 3:
            out.add(tok)
        if nxt:
            out.add(f"{tok} {nxt.group(1)}")
    return out


# ---------------------------------------------------------------- source readers
def read(rel):
    with open(os.path.join(SRC, rel), encoding="utf-8") as f:
        return f.read()


def src_files():
    out = []
    for d in ("src/pages", "src/components", "src/data"):
        for fn in sorted(os.listdir(os.path.join(SRC, d))):
            if fn.endswith((".jsx", ".js", ".json")):
                out.append(f"{d}/{fn}")
    return out


def grep(rel, pattern, flags=0):
    """yield (lineno, match) for every match of pattern on a line of rel."""
    for i, line in enumerate(read(rel).split("\n"), 1):
        for m in re.finditer(pattern, line, flags):
            yield i, m, line


def ev(rel, line, quote):
    return {"path": rel, "lines": str(line), "quote": quote.strip()[:120]}


class Terms:
    def __init__(self):
        self.d = {}

    def add(self, cat, value, rel, line, quote, scope=None):
        value = value.strip().rstrip(",.").strip()
        if not value or len(value) < 3:
            return
        key = (cat, normalise(value))
        if key not in self.d:
            sc = scope or ("identity-field" if normalise(value) in COMMON_WORD_TERMS else "anywhere")
            self.d[key] = {"value": value, "match": sc, "evidence": []}
        if len(self.d[key]["evidence"]) < 3:
            self.d[key]["evidence"].append(ev(rel, line, quote))

    def out(self, cat):
        return sorted((v for (c, _), v in self.d.items() if c == cat), key=lambda v: normalise(v["value"]))


def build():
    T = Terms()
    files = src_files()

    # ---- BRAND: the wordmark, product names, legal entity + address, mail domains
    for rel in files + ["index.html"]:
        for ln, m, line in grep(rel, r"\bGlass ?Flow\b", re.I):
            T.add("brand", "GlassFlow", rel, ln, line)
            break
    for rel in ("src/components/Product.jsx", "src/components/Quickstart.jsx"):
        for ln, m, line in grep(rel, r"GlassFlow (Tares|Rius)\b"):
            T.add("brand", m.group(1), rel, ln, line)
    for ln, m, line in grep("src/pages/Legal.jsx", r"(GlassFlow GmbH), ([^,']+), (\d{5} \w+)"):
        T.add("brand", m.group(1), "src/pages/Legal.jsx", ln, line)
        T.add("brand", m.group(2), "src/pages/Legal.jsx", ln, line)
    for rel in files:
        for ln, m, line in grep(rel, r"[\w.+-]+@(glassflow\.(?:ai|dev))"):
            T.add("brand", m.group(0), rel, ln, line)

    # ---- PERSON: team + investors table, testimonial people, case-study people, post authors
    for ln, m, line in grep("src/pages/About.jsx", r"^\s*\['([^']+)', '([^']+)', '[A-Za-z0-9]+\.(?:png|jpe?g|webp)'"):
        T.add("person", m.group(1), "src/pages/About.jsx", ln, line)
        org = re.search(r"\bat (.+)$", m.group(2))
        if org:
            T.add("thirdParty", org.group(1), "src/pages/About.jsx", ln, line, scope="identity-field")
    for rel in files:
        for ln, m, line in grep(rel, r"name: '([^']+)',\s*role: '([^']+)'"):
            T.add("person", m.group(1), rel, ln, line)
            org = re.search(r"(?:\bof|\bat|,) ([A-Z][\w.]+)\.?$", m.group(2))
            if org:
                T.add("customer", org.group(1), rel, ln, line)
    for ln, m, line in grep("src/pages/Alternatives.jsx", r'alt="([A-Z][a-z]+ [A-Z][a-z]+)"'):
        T.add("person", m.group(1), "src/pages/Alternatives.jsx", ln, line)
    for ln, m, line in grep("src/data/posts.json", r'"author": "(?:Guest Author: )?([^"]+)"'):
        if normalise(m.group(1)) not in NOT_PERSONS:
            T.add("person", m.group(1), "src/data/posts.json", ln, line)

    # ---- CUSTOMER: 'Used by' / 'Backed by CEOs of' logo groups, testimonial company, case studies
    for ln, m, line in grep("src/pages/Rius.jsx", r"\['(\w+)', '([^']+)', \d+, \d+\]"):
        T.add("customer", m.group(2), "src/pages/Rius.jsx", ln, line)
    for ln, m, line in grep("src/components/Testimonial.jsx", r"label: '([^']+)'"):
        T.add("customer", m.group(1), "src/components/Testimonial.jsx", ln, line)
    for ln, m, line in grep("src/pages/CaseStudies.jsx", r"company: \{[^}]*alt: '([^']+)'"):
        T.add("customer", m.group(1), "src/pages/CaseStudies.jsx", ln, line)

    # ---- THIRD_PARTY marks: home logo strip, alternatives vendors
    for ln, m, line in grep("src/components/Hero.jsx", r"\{ n: '\w+', w: \d+, h: \d+, alt: '([^']+)' \}"):
        T.add("thirdParty", m.group(1), "src/components/Hero.jsx", ln, line)
    for ln, m, line in grep("src/routes.jsx", r"vendor=\"(\w+)\""):
        T.add("thirdParty", m.group(1).capitalize(), "src/routes.jsx", ln, line)

    # ---- URL: every absolute URL in src (host + path prefix), EMBED: iframe sources
    urls, hosts, embeds = {}, {}, {}
    for rel in files + ["src/routes.jsx", "src/App.jsx", "index.html"]:
        for ln, m, line in grep(rel, r"https?://([A-Za-z0-9.-]+\.[a-z]{2,})(/[^\s'\"`)<>}${]*)?"):
            host = m.group(1).lower()
            if host in ("localhost",) or re.match(r"\d", host):
                continue
            hosts.setdefault(host, ev(rel, ln, line))
            u = (host + (m.group(2) or "")).rstrip("/")
            urls.setdefault(u, ev(rel, ln, line))
        for ln, m, line in grep(rel, r"<iframe[^>]*|src=\"(https://[^\"]+/embed[^\"]*)\""):
            if m.lastindex and m.group(1):
                embeds.setdefault(m.group(1).split("?")[0].replace("https://", ""), ev(rel, ln, line))

    # ---- ASSET / SCREENSHOT: every file the clone ships under public/assets (stems are opaque ids)
    assets = []
    for d, _, fs in os.walk(os.path.join(SRC, "public/assets")):
        for f in fs:
            if f.startswith("."):
                continue
            assets.append(os.path.relpath(os.path.join(d, f), os.path.join(SRC, "public")).replace(os.sep, "/"))
    assets.sort()
    stems = sorted({os.path.splitext(os.path.basename(a))[0] for a in assets if len(os.path.splitext(os.path.basename(a))[0]) >= 12})
    shots = []
    for rel in files:
        for ln, m, line in grep(rel, r"alt=\"(GlassFlow [^\"]*(?:dashboard|view|UI|screen|console)[^\"]*)\""):
            shots.append(ev(rel, ln, line))

    # ---- CLAIMS + COPY: string literals / JSX text in src, string values in posts.json,
    #      quoted copy in CLONE_SPEC.md and specs/*.md
    segs = []  # (rel, text)
    lits = [re.compile(r"'((?:[^'\\\n]|\\.){12,})'|\"((?:[^\"\\\n]|\\.){12,})\"|`([^`]{12,})`"),  # string literals
            re.compile(r"[>}]([^<>{}=&|;\"`]{12,})[<{]", re.S)]  # JSX text runs
    for rel in files:
        txt = read(rel)
        if not rel.endswith(".json"):
            # comments are not rendered copy
            txt = re.sub(r"\{?/\*.*?\*/\}?", " ", txt, flags=re.S)
            txt = re.sub(r"(^|\s)//[^\n]*", r"\1", txt)
        if rel.endswith(".json"):
            def walk(o):
                if isinstance(o, str):
                    segs.append((rel, o))
                elif isinstance(o, dict):
                    for v in o.values():
                        walk(v)
                elif isinstance(o, list):
                    for v in o:
                        walk(v)
            walk(json.loads(txt))
            continue
        for m in (m for lit in lits for m in lit.finditer(txt)):
            s = next(g for g in m.groups() if g is not None)
            toks = s.split()
            if len(toks) < 3 or sum(bool(re.search(r"[\[\]:/=]|^-|\w-\w", t)) for t in toks) > 0.3 * len(toks):
                continue  # class lists, paths, code
            segs.append((rel, s))
    md = ["CLONE_SPEC.md", "ASSETS.md"] + [f"specs/{f}" for f in sorted(os.listdir(os.path.join(SRC, "specs"))) if f.endswith(".md")]
    for rel in md:
        for m in re.finditer(r"[\"“]([^\"“”\n]{20,})[\"”]", read(rel)):
            segs.append((rel, m.group(1)))

    sh, per_file = set(), {}
    claims = {}
    for rel, s in segs:
        hs = set(shingles(s))
        sh |= hs
        per_file[rel] = per_file.get(rel, 0) + len(hs)
        if rel.startswith("src/"):
            for k in claim_keys(s):
                claims.setdefault(k, {"path": rel, "excerpt": s.strip()[:90]})

    return {
        "$description": "GENERATED by extraction/build_source_identity.py from the real source (do not hand-edit). Generation-mode blocklist: when a PageSpec has mode = generation, schema/semantic_validate.py rejects any match. Detection is string-based on normalised text (NFKC, zero-width removed, curly quotes/dashes folded, lowercased); it is a floor, not proof of originality. No human has reviewed these patterns.",
        "generator": "extraction/build_source_identity.py",
        "normalisation": ["NFKC", "zero-width/soft-hyphen removal", "curly quotes -> straight", "unicode dashes -> '-'", "lowercase", "whitespace collapsed"],
        "matchScopes": {"anywhere": "whole-word match in any PageSpec string (brand also matches with spaces/punctuation squashed out)",
                        "identity-field": "whole-word match only in identity fields: " + ", ".join(IDENTITY_FIELDS)},
        "brand": T.out("brand"),
        "persons": T.out("person"),
        "customers": T.out("customer"),
        "thirdPartyMarks": T.out("thirdParty"),
        "urls": {"hosts": dict(sorted(hosts.items())), "urlPrefixes": dict(sorted(urls.items()))},
        "embeds": dict(sorted(embeds.items())),
        "assets": {"count": len(assets), "files": assets, "opaqueStems": stems},
        "screenshotEvidence": shots,
        "claims": dict(sorted(claims.items())),
        "copy": {"shingleSize": 5, "hash": "sha256(normalised words joined by one space)[:16]",
                 "dropped": "shingles with >= 4 stop-words or all-numeric",
                 "sources": dict(sorted(per_file.items())), "count": len(sh), "shingles": sorted(sh)},
    }


IDENTITY_FIELDS = ["name", "label", "alt", "company", "role", "author", "caption", "title"]


def render(d):
    return json.dumps(d, indent=1, ensure_ascii=False) + "\n"


def main():
    if not os.path.isfile(os.path.join(SRC, "src/routes.jsx")):
        print(f"source project not found (expected src/routes.jsx under the design-repo's parent or $GLASSFLOW_SOURCE_ROOT)")
        return 2
    text = render(build())
    if "--check" in sys.argv:
        cur = open(OUT, encoding="utf-8").read() if os.path.exists(OUT) else ""
        print("source-identity in sync" if cur == text else "SOURCE-IDENTITY DRIFT: rerun extraction/build_source_identity.py")
        return 0 if cur == text else 1
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(text)
    d = json.loads(text)
    print(f"wrote policies/source-identity.json: brand {len(d['brand'])}, persons {len(d['persons'])}, customers {len(d['customers'])}, "
          f"thirdParty {len(d['thirdPartyMarks'])}, hosts {len(d['urls']['hosts'])}, urls {len(d['urls']['urlPrefixes'])}, embeds {len(d['embeds'])}, "
          f"assets {d['assets']['count']}, claims {len(d['claims'])}, shingles {d['copy']['count']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
