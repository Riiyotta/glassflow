#!/usr/bin/env python3
"""verify_all.py: one-shot integrity check for the GlassFlow design-repo.

Checks (each proven to catch drift by extraction/prove_drift.py):
  json-parse, schema-in-sync, example-valid, allowlist-parity, allowlist-version-parity,
  manifest-counts, citation-validity (range AND quoted content), graph-validator-parity,
  pinned-forms, pinned-roles, role-closure, template-integrity, route-coverage,
  route-source-drift, motion-closure, section-completeness, no-absolute-paths,
  manifest-entrypoints, asset-refs.

The repo root is derived from __file__. Source-dependent checks (citation content, route
re-derivation, asset existence) look for the sibling project at <repo>/.. and DEGRADE TO A
WARNING when it is absent (self-contained copy).

Usage: python3 extraction/verify_all.py   (exit 1 on any error)
"""
import json, os, re, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# GLASSFLOW_SOURCE_ROOT lets extraction/prove_drift.py point a scratch copy back at the real project.
SRC_ROOT = os.environ.get("GLASSFLOW_SOURCE_ROOT") or os.path.dirname(REPO)
HAVE_SRC = os.path.isfile(os.path.join(SRC_ROOT, "src", "routes.jsx")) and os.path.isfile(os.path.join(SRC_ROOT, "tailwind.config.js"))

# Independent pinned table (second source of truth; the registries must agree with it).
PINNED_FORMS = {"contact-form": "must-not-reuse-live-endpoint", "guide-form-kafka": "must-not-reuse-live-endpoint", "guide-form-mistakes": "must-not-reuse-live-endpoint"}
PINNED_ROLES = {"person.real-photo": "must-not-fabricate", "product.screenshot": "must-not-fabricate", "logo.third-party": "must-reuse-exact",
                "logo.customer": "must-reuse-exact", "brand.glassflow-mark": "must-reuse-exact", "brand.dither-mark": "must-reuse-exact",
                "scene.mars-figurative": "must-reuse-exact", "blog.cover": "must-reuse-exact", "animation.lottie": "must-reuse-exact"}
ROLE_POLICIES = {"may-generate-new", "must-reuse-exact", "must-not-fabricate"}
COUNT_SKIP = {"absentOnOriginal", "reducedMotionFallbacks", "reducedMotionEvidence"}


def load(rel, root=REPO):
    with open(os.path.join(root, rel), encoding="utf-8") as f:
        return json.load(f)


def json_files(root=REPO):
    for d, _, fs in os.walk(root):
        for f in fs:
            if f.endswith(".json"):
                yield os.path.relpath(os.path.join(d, f), root)


def ids_in(folder, root=REPO):
    p = os.path.join(root, folder)
    return sorted(f[:-5] for f in os.listdir(p) if f.endswith(".json"))


# ---------------- counts (single definition; the manifest is generated from this too) ----------------
def count_tokens(root=REPO):
    n = 0
    fdir = os.path.join(root, "tokens/00-foundation")
    for fn in sorted(os.listdir(fdir)):
        d = load(f"tokens/00-foundation/{fn}", root)
        for k, v in d.items():
            if k.startswith("$") or k in COUNT_SKIP:
                continue
            if isinstance(v, dict) and v and all(isinstance(x, dict) for x in v.values()):
                n += len(v)
            else:
                n += 1
    return n


def compute_counts(root=REPO):
    secs = [load(f"sections/{s}.json", root) for s in ids_in("sections", root)]
    routes = load("templates/routes.json", root)["routes"]
    sem = load("tokens/10-semantic/semantic.json", root)
    return {
        "foundationTokens": count_tokens(root),
        "semanticTokens": sum(len(v) for k, v in sem.items() if not k.startswith("$")),
        "primitives": len(ids_in("primitives", root)),
        "components": len(ids_in("components", root)),
        "sections": len(secs),
        "sectionVariants": sum(len(s["variants"]) for s in secs),
        "templates": len(load("templates/templates.json", root)["templates"]),
        "routes": len(routes),
        "pageRoutes": sum(r["kind"] == "page" for r in routes),
        "redirectRoutes": sum(r["kind"] == "redirect" for r in routes),
        "sitemapRoutes": sum(r["inSitemap"] for r in routes),
        "sitemapRedirects": sum(r["inSitemap"] and r["kind"] == "redirect" for r in routes),
        "assetRoles": len(load("assets/asset-roles.json", root)["roles"]),
        "motionPatterns": len(load("tokens/00-foundation/motion.json", root)["patterns"]),
        "graphRules": len(load("compatibility/graph.json", root)["rules"]),
    }


# ---------------- pinned / closure checks (importable by the adversarial suite) ----------------
def check_pinned_forms(forms):
    errs = []
    for fid, want in PINNED_FORMS.items():
        f = forms["forms"].get(fid)
        if f is None:
            errs.append(f"pinned form {fid} missing")
        elif f["endpointPolicy"] != want:
            errs.append(f"form {fid} endpointPolicy {f['endpointPolicy']!r} != pinned {want!r}")
    for fid, f in forms["forms"].items():
        if f["endpointPolicy"] not in forms["endpointPolicyEnum"]:
            errs.append(f"form {fid} endpointPolicy outside enum")
    return errs


def check_pinned_roles(roles):
    errs = []
    for r, want in PINNED_ROLES.items():
        got = roles["roles"].get(r, {}).get("generationPolicy")
        if got != want:
            errs.append(f"role {r} generationPolicy {got!r} != pinned {want!r}")
        if not roles["roles"].get(r, {}).get("pinned"):
            errs.append(f"role {r} must be marked pinned")
    return errs


def check_role_closure(roles, root=REPO):
    errs = []
    reg = set(roles["roles"])
    allow = set(load("tokens/llm/component-allowlist.json", root)["assetRoles"])
    schema = load("schema/pagespec.schema.json", root)
    sch = set(schema["definitions"]["assetRole"]["enum"])
    used = set()
    for s in ids_in("sections", root):
        for m in re.findall(r'"assetRole": \{\s*"enum": \[([^\]]*)\]', json.dumps(load(f"sections/{s}.json", root), indent=1)):
            used |= set(json.loads(f"[{m}]"))
    for name, other in (("allowlist", allow), ("schema enum", sch)):
        if reg != other:
            errs.append(f"assetRole registry != {name}: {sorted(reg ^ other)}")
    if not used <= reg:
        errs.append(f"sections use unregistered roles {sorted(used - reg)}")
    for r, d in roles["roles"].items():
        if d.get("generationPolicy") not in ROLE_POLICIES or not d.get("guidance"):
            errs.append(f"role {r} lacks a valid generationPolicy/guidance")
    return errs


# ---------------- citations ----------------
def collect_citations(obj, where, out):
    if isinstance(obj, dict):
        if "path" in obj and "lines" in obj and isinstance(obj.get("lines"), str):
            out.append((where, obj))
        for k, v in obj.items():
            collect_citations(v, where, out)
    elif isinstance(obj, list):
        for v in obj:
            collect_citations(v, where, out)


_lines = {}


def check_citation(c):
    m = re.fullmatch(r"(\d+)(?:-(\d+))?", c["lines"])
    if not m:
        return f"bad range format {c['lines']!r}"
    a, b = int(m.group(1)), int(m.group(2) or m.group(1))
    if a < 1 or b < a:
        return f"bad range {c['lines']}"
    if c["path"].startswith("/") or ".." in c["path"].split("/"):
        return f"citation path must be project-relative: {c['path']}"
    if not HAVE_SRC:
        return None
    p = os.path.join(SRC_ROOT, c["path"])
    if not os.path.isfile(p):
        return f"cited file missing: {c['path']}"
    if p not in _lines:
        _lines[p] = open(p, encoding="utf-8").read().split("\n")
    ls = _lines[p]
    if b > len(ls):
        return f"{c['path']}:{c['lines']} exceeds file length {len(ls)}"
    if "quote" in c and c["quote"] not in "\n".join(ls[a - 1:b]):
        return f"{c['path']}:{c['lines']} does not contain quoted text {c['quote'][:60]!r}"
    return None


# ---------------- main ----------------
class Run:
    def __init__(self):
        self.errors, self.warnings, self.results = [], [], []

    def check(self, name, errs, warns=()):
        self.errors += [f"[{name}] {e}" for e in errs]
        self.warnings += [f"[{name}] {w}" for w in warns]
        self.results.append((name, "FAIL" if errs else "ok", len(errs)))


def main():
    sys.path.insert(0, os.path.join(REPO, "schema"))
    run = Run()

    errs = []
    for f in json_files():
        try:
            load(f)
        except Exception as e:  # noqa: BLE001
            errs.append(f"{f}: {e}")
    run.check("json-parse", errs)
    if errs:
        return finish(run)

    import build_schema
    disk = load("schema/pagespec.schema.json")
    run.check("schema-in-sync", [] if build_schema.build() == disk else ["pagespec.schema.json differs from build_schema.build(): rerun schema/build_schema.py"])

    import jsonschema
    import semantic_validate as sv
    ex = load("schema/example.pagespec.json")
    e7 = list(jsonschema.Draft7Validator(disk).iter_errors(ex))
    rep = sv.validate(ex)
    run.check("example-valid", [f"draft7: {e.message[:120]}" for e in e7] + rep.errors, rep.warnings)

    allow = load("tokens/llm/component-allowlist.json")
    errs = []
    for kind in ("primitives", "components", "sections"):
        files, listed = set(ids_in(kind)), set(allow[kind])
        if files - listed:
            errs.append(f"{kind}: contract files with no allowlist entry {sorted(files - listed)}")
        if listed - files:
            errs.append(f"{kind}: phantom allowlist entries {sorted(listed - files)}")
        for i in files:
            if load(f"{kind}/{i}.json")["id"] != i:
                errs.append(f"{kind}/{i}.json id field mismatch")
    if set(allow["templates"]) != set(load("templates/templates.json")["templates"]):
        errs.append("allowlist templates != templates.json")
    node_props = set(disk["definitions"]["node"]["properties"])
    if set(allow["settableNodeProperties"]) != node_props:
        errs.append(f"settableNodeProperties {allow['settableNodeProperties']} != schema node properties {sorted(node_props)}")
    if set(allow["settableMotionProperties"]) != set(disk["definitions"]["motion"]["properties"]):
        errs.append("settableMotionProperties != schema motion properties")
    run.check("allowlist-parity", errs)

    man = load("registry.manifest.json")
    errs = [] if man.get("allowlistVersion") == allow.get("allowlistVersion") else [f"manifest allowlistVersion {man.get('allowlistVersion')} != allowlist {allow.get('allowlistVersion')}"]
    readme = open(os.path.join(REPO, "README.md"), encoding="utf-8").read()
    if f"allowlistVersion {allow.get('allowlistVersion')}" not in readme:
        errs.append("README does not state the current allowlistVersion")
    run.check("allowlist-version-parity", errs)

    real = compute_counts()
    errs = [f"manifest counts.{k}={man['counts'].get(k)} but disk={v}" for k, v in real.items() if man["counts"].get(k) != v]
    errs += [f"manifest counts has unknown key {k}" for k in man["counts"] if k not in real]
    for k, v in real.items():
        if f"| {k} | {v} |" not in readme:
            errs.append(f"README counts table missing/stale row '| {k} | {v} |'")
    run.check("manifest-counts", errs)

    cites = []
    for f in json_files():
        collect_citations(load(f), f, cites)
    errs = [f"{w}: {msg}" for w, c in cites if (msg := check_citation(c))]
    for s in load("extraction/measured-values.json").get("sources", []):
        if HAVE_SRC and not os.path.exists(os.path.join(SRC_ROOT, s["file"])):
            errs.append(f"measured-values source missing: {s['file']}")
    warns = [] if HAVE_SRC else [f"sibling source tree not found at <repo>/..: {len(cites)} citations format-checked only (content/range not verifiable)"]
    run.check("citation-validity", errs, warns)

    graph_ids = {r["id"] for r in load("compatibility/graph.json")["rules"]}
    errs = []
    if graph_ids != sv.GRAPH_RULE_IDS:
        errs.append(f"graph rules vs validator rules differ: {sorted(graph_ids ^ sv.GRAPH_RULE_IDS)}")
    run.check("graph-validator-parity", errs)

    run.check("pinned-forms", check_pinned_forms(load("policies/forms.json")))
    roles = load("assets/asset-roles.json")
    run.check("pinned-roles", check_pinned_roles(roles))
    run.check("role-closure", check_role_closure(roles))

    T = load("templates/templates.json")["templates"]
    secs = {s: load(f"sections/{s}.json") for s in ids_in("sections")}
    errs = []
    for tid, t in T.items():
        fam = t["chromeFamily"]
        first, last = t["nodes"][0]["section"], t["nodes"][-1]["section"]
        if fam == "mars" and (first != "chrome.navbar" or last != "chrome.footer"):
            errs.append(f"{tid}: mars template must start with chrome.navbar and end with chrome.footer")
        if fam == "legacy" and (first != "chrome.legacy-nav" or any(n["section"] in ("chrome.navbar", "chrome.footer") for n in t["nodes"])):
            errs.append(f"{tid}: legacy template must start with chrome.legacy-nav and carry no mars chrome")
        for n in t["nodes"]:
            s = secs.get(n["section"])
            if s is None:
                errs.append(f"{tid}: unknown section {n['section']}")
                continue
            if n["variants"] != "*" and not set(n["variants"]) <= set(s["variants"]):
                errs.append(f"{tid}: {n['section']} unknown variants {n['variants']}")
            if s["family"] != fam:
                errs.append(f"{tid}: {n['section']} family {s['family']} on {fam} template")
    run.check("template-integrity", errs)

    routes = load("templates/routes.json")["routes"]
    errs = []
    paths = [r["path"] for r in routes]
    if len(paths) != len(set(paths)):
        errs.append("duplicate route paths")
    for r in routes:
        if not r["path"].startswith("/") or "://" in r["path"]:
            errs.append(f"external/invalid route {r['path']}")
        if r["kind"] == "page":
            if r.get("template") not in T:
                errs.append(f"page {r['path']} -> unknown template {r.get('template')}")
            if "redirectTo" in r:
                errs.append(f"page {r['path']} has redirectTo")
        elif r["kind"] == "redirect":
            if "template" in r or not r.get("redirectTo", "").startswith("/"):
                errs.append(f"redirect {r['path']} must have an internal redirectTo and no template")
            elif r["redirectTo"] not in {x["path"] for x in routes if x["kind"] == "page"}:
                errs.append(f"redirect {r['path']} -> {r['redirectTo']} does not land on a page route")
        else:
            errs.append(f"{r['path']}: kind must be page|redirect")
    unused = set(T) - {r.get("template") for r in routes}
    if unused:
        errs.append(f"templates with no route: {sorted(unused)}")
    run.check("route-coverage", errs)

    errs, warns = [], []
    if HAVE_SRC:
        src = open(os.path.join(SRC_ROOT, "src/routes.jsx"), encoding="utf-8").read()
        static = re.findall(r"path: '([^':]+)', element: <(\w+)", src)
        posts = json.load(open(os.path.join(SRC_ROOT, "src/data/posts.json"), encoding="utf-8"))
        static_paths = {p for p, _ in static} | {"/"}
        if not static_paths <= {r["path"] for r in routes}:
            errs.append(f"routes.jsx paths missing from routes.json: {sorted(static_paths - set(paths))}")
        redirects_src = {p for p, el in static if el == "Navigate"}
        redirects_mine = {r["path"] for r in routes if r["kind"] == "redirect" and not r["path"].startswith("/blog/")}
        if redirects_src != redirects_mine:
            errs.append(f"static redirects differ from src/routes.jsx: {sorted(redirects_src ^ redirects_mine)}")
        blog_mine = {r["path"] for r in routes if r["path"].startswith("/blog/")}
        blog_src = {f"/blog/{p['slug']}" for p in posts["posts"]}
        if blog_mine != blog_src:
            errs.append(f"blog routes differ from src/data/posts.json: {len(blog_mine ^ blog_src)} paths")
    else:
        warns.append("sibling source tree absent: route re-derivation skipped")
    run.check("route-source-drift", errs, warns)

    motion = load("tokens/00-foundation/motion.json")
    pats, fbs = set(motion["patterns"]), set(motion["reducedMotionFallbacks"])
    errs = []
    for sid, s in secs.items():
        for p in s["motion"]["allowedPatterns"]:
            if p not in pats:
                errs.append(f"{sid}: motion pattern {p} not in motion.json")
        if s["motion"]["reducedMotionFallback"] not in fbs:
            errs.append(f"{sid}: reducedMotionFallback {s['motion']['reducedMotionFallback']} not in closed fallback set")
    for p, d in motion["patterns"].items():
        if not d.get("evidence"):
            errs.append(f"motion pattern {p} has no evidence")
    for bad in ("scroll-reveal", "parallax", "marquee"):
        if bad in pats:
            errs.append(f"{bad} is not on the original and must not be a pattern")
    if set(disk["definitions"]["motion"]["properties"]["patterns"]["items"]["enum"]) != pats:
        errs.append("schema motion enum != motion.json patterns")
    run.check("motion-closure", errs)

    errs = []
    for sid, s in secs.items():
        for k in ("purpose", "variants", "implementedBy", "content", "constraints", "motion", "responsive"):
            if k not in s:
                errs.append(f"{sid}: missing {k}")
        r = s.get("responsive", {})
        for bp in ("390", "810", "1200", "evidence"):
            if bp not in r:
                errs.append(f"{sid}: responsive.{bp} missing")
        if not r.get("evidence"):
            errs.append(f"{sid}: responsive evidence empty")
    run.check("section-completeness", errs)

    errs = []
    needle = "/" + "Users" + "/"
    for d, _, fs in os.walk(REPO):
        for f in fs:
            if f.endswith((".json", ".md", ".py", ".txt")):
                p = os.path.join(d, f)
                if needle in open(p, encoding="utf-8", errors="ignore").read():
                    errs.append(f"absolute path in {os.path.relpath(p, REPO)}")
    run.check("no-absolute-paths", errs)

    errs = []
    if man.get("status") != "design-review-pending" or man.get("productionApproved") is not False:
        errs.append("manifest must be status design-review-pending, productionApproved false")
    if "versionFieldNote" not in man:
        errs.append("manifest lacks versionFieldNote")
    for k, v in man.get("entryPoints", {}).items():
        for p in (v if isinstance(v, list) else [v]):
            if p.startswith("/") or ".." in p.split("/") or not os.path.exists(os.path.join(REPO, p)):
                errs.append(f"entryPoint {k}: {p} is outside the package or missing")
    run.check("manifest-entrypoints", errs)

    errs, warns = [], []
    if HAVE_SRC:
        def refs(o):
            if isinstance(o, dict):
                if "assetRole" in o and str(o.get("ref", "")).startswith("/assets/"):
                    yield o["ref"]
                for v in o.values():
                    yield from refs(v)
            elif isinstance(o, list):
                for v in o:
                    yield from refs(v)
        for r in refs(ex):
            if not os.path.isfile(os.path.join(SRC_ROOT, "public", r.lstrip("/"))):
                errs.append(f"example asset ref missing in public/: {r}")
    else:
        warns.append("sibling source tree absent: asset existence skipped")
    run.check("asset-refs", errs, warns)
    return finish(run)


def finish(run):
    print(f"design-repo verify_all  (sibling source tree: {'present' if HAVE_SRC else 'ABSENT -> source checks degrade to warnings'})")
    for name, st, n in run.results:
        print(f"  {st:4} {name}" + (f" ({n})" if n else ""))
    for w in run.warnings:
        print("  WARN", w)
    for e in run.errors:
        print("  ERROR", e)
    print(f"RESULT: {'PASS' if not run.errors else 'FAIL'}  {len(run.results)} checks, {len(run.errors)} error(s), {len(run.warnings)} warning(s)")
    return 1 if run.errors else 0


if __name__ == "__main__":
    sys.exit(main())
