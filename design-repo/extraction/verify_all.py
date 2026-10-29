#!/usr/bin/env python3
"""verify_all.py: one-shot integrity check for the GlassFlow design-repo.

Checks (each proven to catch drift by extraction/prove_drift.py):
  json-parse, schema-in-sync, example-valid, allowlist-parity, allowlist-version-parity,
  manifest-counts, citation-validity (range AND quoted content), graph-validator-parity,
  pinned-forms, pinned-roles, role-closure, template-integrity, route-coverage,
  route-source-drift, motion-closure, section-completeness, no-absolute-paths,
  manifest-entrypoints, asset-refs, pinned-availability, substitute-closure, contract-schema,
  contract-provenance, retrieval-pin, wrapper-gate, token-catalog-in-sync, token-policy-resolves,
  source-identity, generated-examples, policy-binding.

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
# cloneModePolicy pins (what clone mode may do with each source role)
PINNED_ROLES = {"person.real-photo": "must-not-fabricate", "product.screenshot": "must-not-fabricate", "logo.third-party": "must-reuse-exact",
                "logo.customer": "must-reuse-exact", "brand.glassflow-mark": "must-reuse-exact", "brand.dither-mark": "must-reuse-exact",
                "scene.mars-figurative": "must-reuse-exact", "blog.cover": "must-reuse-exact", "animation.lottie": "must-reuse-exact"}
ROLE_POLICIES = {"may-generate-new", "must-reuse-exact", "must-not-fabricate", "operator-supplied", "not-applicable"}
GEN_POLICIES = {"blocked", "substitute-required", "may-generate-new", "operator-supplied", "placeholder-only", "must-be-original"}
AVAILABILITY = {"clone-only", "generation-safe", "blocked-for-generation"}
# (availability, generationModePolicy) pins. Same table as schema/semantic_validate.py PINNED_AVAILABILITY;
# check pinned-availability fails if the two tables, or the registry, disagree.
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
REAL_MARK_ROLES = {"brand.glassflow-mark", "brand.dither-mark", "logo.third-party", "logo.customer"}
# Runtime/utility UI that is not a retrieval exemplar (baseline R8); same pin as semantic_validate.py.
RETRIEVAL_INELIGIBLE = {"layout.spacer", "contact.success-panel"}
RUNTIME_UI_NAME = re.compile(r"cookie|consent|modal|dialog|drawer|popup|overlay|preload|toast|banner-notice|success|spacer|cursor", re.I)
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
        "templateFamilies": len(load("templates/templates.json", root)["templateFamilies"]["families"]),
        "generatedExamples": len([f for f in os.listdir(os.path.join(root, "schema/examples")) if f.endswith(".pagespec.json")]),
        "retrievalIneligibleSections": sum(s.get("retrievalEligible") is False for s in secs),
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
        got = roles["roles"].get(r, {}).get("cloneModePolicy")
        if got != want:
            errs.append(f"role {r} cloneModePolicy {got!r} != pinned {want!r}")
        if not roles["roles"].get(r, {}).get("pinned"):
            errs.append(f"role {r} must be marked pinned")
    return errs


def check_role_closure(roles, root=REPO):
    errs = []
    reg = {r for r, d in roles["roles"].items() if d.get("kind") == "media"}
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
        if d.get("cloneModePolicy") not in ROLE_POLICIES or not d.get("guidance"):
            errs.append(f"role {r} lacks a valid cloneModePolicy/guidance")
        if d.get("kind") not in ("media", "url", "copy"):
            errs.append(f"role {r} kind must be media|url|copy")
    return errs


def check_pinned_availability(roles, sv_table=None):
    """registry vs code pin (verify_all) vs code pin (semantic_validate); substitutes; guidance."""
    errs = []
    R = roles["roles"]
    if sv_table is not None and sv_table != PINNED_AVAILABILITY:
        errs.append("PINNED_AVAILABILITY differs between extraction/verify_all.py and schema/semantic_validate.py")
    if set(R) != set(PINNED_AVAILABILITY):
        errs.append(f"roles without a pin / pins without a role: {sorted(set(R) ^ set(PINNED_AVAILABILITY))}")
    for r, d in R.items():
        av, gm = d.get("availability"), d.get("generationModePolicy")
        if av not in AVAILABILITY:
            errs.append(f"role {r} availability {av!r} not in {sorted(AVAILABILITY)}")
        if gm not in GEN_POLICIES:
            errs.append(f"role {r} generationModePolicy {gm!r} not in closed set")
        if r in PINNED_AVAILABILITY and (av, gm) != PINNED_AVAILABILITY[r]:
            errs.append(f"role {r} ({av}, {gm}) != pinned {PINNED_AVAILABILITY[r]}")
        if not d.get("generatedModeGuidance"):
            errs.append(f"role {r} has no generatedModeGuidance")
        subs = d.get("generationSafeSubstitutes")
        if not isinstance(subs, list):
            errs.append(f"role {r} has no generationSafeSubstitutes list")
            continue
        if av != "generation-safe" and not subs:
            errs.append(f"role {r} is {av} but names no generation-safe substitute")
        for x in subs:
            if R.get(x, {}).get("availability") != "generation-safe":
                errs.append(f"role {r} substitute {x} is not a generation-safe role")
        if r in REAL_MARK_ROLES and (av == "generation-safe" or gm != "blocked"):
            errs.append(f"real mark/logo role {r} must be blocked-for-generation (never reusable in generation mode)")
    return errs


def check_substitute_closure(roles, root=REPO):
    """Every media field that accepts a non-generation-safe role also accepts all of its substitutes,
    and each section's generatedAssetRoles equals the generation-safe roles its fields accept."""
    errs = []
    R = roles["roles"]
    for sid in ids_in("sections", root):
        sec = load(f"sections/{sid}.json", root)
        found = set()

        def walk(o, path):
            if isinstance(o, dict):
                ar = o.get("assetRole")
                if isinstance(ar, dict) and "enum" in ar:
                    en = set(ar["enum"])
                    for r in en:
                        miss = set(R.get(r, {}).get("generationSafeSubstitutes", [])) - en
                        if miss:
                            errs.append(f"{sid}{path}: accepts {r} but not its substitutes {sorted(miss)}")
                    found.update(x for x in en if R.get(x, {}).get("availability") == "generation-safe")
                for k, v in o.items():
                    walk(v, f"{path}.{k}")
            elif isinstance(o, list):
                for i, v in enumerate(o):
                    walk(v, f"{path}[{i}]")
        walk(sec.get("content"), ".content")
        walk(sec.get("contentByVariant"), ".contentByVariant")
        if set(sec.get("generatedAssetRoles", [])) != found:
            errs.append(f"{sid}: generatedAssetRoles {sorted(sec.get('generatedAssetRoles', []))} != generation-safe roles its fields accept {sorted(found)}")
    return errs


def check_retrieval(secs):
    errs = []
    for sid, s in secs.items():
        want = sid not in RETRIEVAL_INELIGIBLE
        if s.get("retrievalEligible") is not want:
            errs.append(f"{sid}: retrievalEligible {s.get('retrievalEligible')!r} != pin {want}")
        if not want and len(s.get("retrievalReason", "")) < 30:
            errs.append(f"{sid}: retrievalReason must be >= 30 chars")
        if RUNTIME_UI_NAME.search(sid + " " + s.get("purpose", "")[:40]) and sid not in RETRIEVAL_INELIGIBLE:
            errs.append(f"{sid}: id/purpose looks like runtime/utility UI but is not in RETRIEVAL_INELIGIBLE")
    return errs


def check_provenance(secs):
    errs = []
    for sid, s in secs.items():
        src, sem = s.get("source"), s.get("semantic")
        if not isinstance(src, dict) or not isinstance(sem, dict):
            errs.append(f"{sid}: missing source/semantic object")
            continue
        if sem.get("id") != sid:
            errs.append(f"{sid}: semantic.id {sem.get('id')!r} != contract id")
        if src.get("id") == sem.get("id"):
            errs.append(f"{sid}: source.id must differ from semantic.id")
        if sem.get("category") != s.get("category"):
            errs.append(f"{sid}: semantic.category {sem.get('category')!r} != category {s.get('category')!r}")
        if not HAVE_SRC:
            continue
        p = os.path.join(SRC_ROOT, src["file"])
        if not os.path.isfile(p):
            errs.append(f"{sid}: source.file missing {src['file']}")
            continue
        m = re.fullmatch(r"(\d+)(?:-(\d+))?", src["lines"])
        ls = open(p, encoding="utf-8").read().split("\n")
        a, b = int(m.group(1)), int(m.group(2) or m.group(1))
        if b > len(ls):
            errs.append(f"{sid}: source {src['file']}:{src['lines']} exceeds file length {len(ls)}")
        elif not any(src["tag"] in l for l in ls[a - 1:b]):
            errs.append(f"{sid}: source.tag {src['tag']!r} not found in {src['file']}:{src['lines']}")
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
    sys.path.insert(0, os.path.join(REPO, "extraction"))
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
    run.check("pinned-availability", check_pinned_availability(roles, sv.PINNED_AVAILABILITY))
    run.check("substitute-closure", check_substitute_closure(roles))

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
        cat_src = open(os.path.join(SRC_ROOT, "src/pages/Category.jsx"), encoding="utf-8").read()
        meta = cat_src[cat_src.index("const META = {"):cat_src.index("}", cat_src.index("const META = {"))]
        live_cats = {f"/categories/{k}" for k in re.findall(r"^\s+'?([a-z-]+)'?:", meta, re.M)}
        cat_mine = {r["path"] for r in routes if r["path"].startswith("/categories/") and r["kind"] == "page"}
        if live_cats != cat_mine:
            errs.append(f"live category pages differ from Category.jsx META: {sorted(live_cats ^ cat_mine)}")
        served = static_paths | blog_src | live_cats
        extra = set(paths) - served
        if extra:
            errs.append(f"routes.json maps paths the clone's router does not serve: {sorted(extra)}")
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

    cschema = load("schema/section-contract.schema.json")
    v = jsonschema.Draft7Validator(cschema)
    errs = [f"{sid}: {'/'.join(map(str, e.absolute_path)) or '<root>'}: {e.message[:140]}" for sid, s in secs.items() for e in v.iter_errors(s)]
    run.check("contract-schema", errs)
    errs = check_provenance(secs)
    import build_contract_provenance as bcp
    errs += [f"{sid}: source/semantic differ from build_contract_provenance.py output" for sid, s in secs.items() if bcp.apply(s) != s]
    run.check("contract-provenance", errs)
    errs = check_retrieval(secs)
    if sv.RETRIEVAL_INELIGIBLE != RETRIEVAL_INELIGIBLE:
        errs.append("RETRIEVAL_INELIGIBLE differs between verify_all.py and semantic_validate.py")
    run.check("retrieval-pin", errs)

    import wrapper_gate
    gerrs, gwarns, _ = wrapper_gate.gate()
    run.check("wrapper-gate", gerrs, gwarns)

    import build_token_catalog
    cat = load("tokens/llm/token-catalog.json")
    run.check("token-catalog-in-sync", [] if build_token_catalog.build() == cat else ["tokens/llm/token-catalog.json differs from build_token_catalog.build(): rerun extraction/build_token_catalog.py"])
    pol = load("tokens/llm/token-policy.json")
    errs = []
    sp = pol["slots"]
    for name in sp["node.tokens.spacingY"]["allowed"]:
        if name not in cat["groups"]["spacing"]["tokens"]:
            errs.append(f"token-policy spacing {name!r} not in catalog")
    fams = cat["groups"]["typography.fontFamily"]["tokens"]
    for fam, names in sp["node.tokens.font"]["allowedByFamily"].items():
        for n in names:
            if n not in fams:
                errs.append(f"token-policy font {n!r} not in catalog")
    for slot in ("surface", "text", "border"):
        pre = sp[f"node.tokens.{slot}"]["prefix"]
        if not any(k.startswith(pre) for th in cat["themes"].values() for k in th["semantic"]):
            errs.append(f"token-policy slot {slot} prefix {pre!r} resolves to no catalog token")
    for rid in pol["rules"]:
        if rid not in graph_ids:
            errs.append(f"token-policy rule {rid} not declared in compatibility/graph.json")
    if set(disk["definitions"]["tokens"]["properties"]) != {k.split(".")[-1] for k in sp if k.startswith("node.tokens.")}:
        errs.append("schema node.tokens properties != token-policy node.tokens slots")
    man_cat = man.get("entryPoints", {})
    for k in ("tokenCatalog", "tokenPolicy"):
        if k not in man_cat:
            errs.append(f"manifest entryPoints lacks {k}")
    run.check("token-policy-resolves", errs)

    errs, warns = [], []
    ident = load("policies/source-identity.json")
    for k in ("brand", "persons", "customers", "thirdPartyMarks"):
        if not ident.get(k):
            errs.append(f"source-identity {k} is empty")
        for t in ident.get(k, []):
            if not t.get("evidence"):
                errs.append(f"source-identity {k} {t.get('value')!r} has no file:line evidence")
    for k in ("urls", "embeds", "claims", "copy", "assets"):
        if not ident.get(k):
            errs.append(f"source-identity {k} is empty")
    if HAVE_SRC:
        import build_source_identity as bsi
        if bsi.render(bsi.build()) != open(os.path.join(REPO, "policies/source-identity.json"), encoding="utf-8").read():
            errs.append("policies/source-identity.json differs from a rebuild from the real source: rerun extraction/build_source_identity.py")
    else:
        warns.append("sibling source tree absent: source-identity rebuild comparison skipped (shape checked only)")
    run.check("source-identity", errs, warns)

    errs = []
    fams = load("templates/templates.json")["templateFamilies"]["families"]
    if {t["templateFamily"] for t in T.values()} != set(fams):
        errs.append("templateFamilies.families != families used by templates")
    gdir = os.path.join(REPO, "schema/examples")
    seen = {}
    for fn in sorted(os.listdir(gdir)) if os.path.isdir(gdir) else []:
        if not fn.endswith(".pagespec.json"):
            continue
        spec = load(f"schema/examples/{fn}")
        if spec.get("mode") != "generation":
            errs.append(f"{fn}: mode must be generation")
        r = sv.validate(spec)
        errs += [f"{fn}: {e[:160]}" for e in r.errors]
        fam = T.get(spec.get("template"), {}).get("templateFamily")
        seen.setdefault(fam, []).append(fn)
    for fam in fams:
        if fam not in seen:
            errs.append(f"template family {fam} has no generated example in schema/examples/")
    if ex.get("mode") != "clone":
        errs.append("schema/example.pagespec.json (the real-asset control) must be mode clone")
    run.check("generated-examples", errs)

    errs = []
    dp = man.get("designPolicy") or {}
    if man.get("category") not in ("saas", "consumer-app", "consumer-service-marketplace"):
        errs.append(f"manifest category {man.get('category')!r} missing/unknown")
    pfile = dp.get("ref")
    if not pfile or not os.path.isfile(os.path.join(REPO, pfile)):
        errs.append(f"designPolicy.ref {pfile!r} missing")
    else:
        pol_doc = load(pfile)
        for k in ("policyId", "policyVersion", "commonIrVersion"):
            if dp.get(k) != pol_doc.get(k):
                errs.append(f"manifest designPolicy.{k} {dp.get(k)!r} != {pfile} {pol_doc.get(k)!r}")
        if dp.get("commonIrVersion") != "0.5" or dp.get("enforcementMode") != "hard-and-soft":
            errs.append("designPolicy must be commonIrVersion 0.5, enforcementMode hard-and-soft")
        is_saas = pol_doc.get("classification", {}).get("isSaaS")
        if is_saas and (dp.get("policyId"), dp.get("policyVersion")) != ("n0-saas-design-constraints-common", "0.1.0"):
            errs.append("a SaaS classification must bind n0-saas-design-constraints-common 0.1.0")
        if is_saas is False and dp.get("policyId") == "n0-saas-design-constraints-common":
            errs.append("a non-SaaS classification must not bind the SaaS policy")
        if (man.get("category") == "saas") != bool(is_saas):
            errs.append("manifest category and policy classification.isSaaS disagree")
        want = policy_hash(pol_doc["enforcedBy"])
        if dp.get("contentHash") != want:
            errs.append(f"designPolicy.contentHash {dp.get('contentHash')} != computed {want} (run: python3 extraction/verify_all.py --write-policy-hash)")
    run.check("policy-binding", errs)

    errs = []
    needles = ["/" + "Users" + "/", "/" + "private" + "/", "/" + "tmp" + "/", "C:" + "\\" + "Users"]
    for d, _, fs in os.walk(REPO):
        for f in fs:
            if f.endswith((".json", ".md", ".py", ".txt", ".mjs")):
                p = os.path.join(d, f)
                txt = open(p, encoding="utf-8", errors="ignore").read()
                for nd in needles:
                    if nd in txt:
                        errs.append(f"absolute path ({nd}) in {os.path.relpath(p, REPO)}")
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


def policy_hash(files, root=REPO):
    import hashlib
    h = hashlib.sha256()
    for rel in sorted(files):
        h.update(rel.encode() + b"\0")
        with open(os.path.join(root, rel), "rb") as f:
            h.update(f.read())
        h.update(b"\0")
    return "sha256:" + h.hexdigest()


def write_policy_hash():
    man = load("registry.manifest.json")
    pol = load(man["designPolicy"]["ref"])
    man["designPolicy"]["contentHash"] = policy_hash(pol["enforcedBy"])
    with open(os.path.join(REPO, "registry.manifest.json"), "w", encoding="utf-8") as f:
        f.write(json.dumps(man, indent=2, ensure_ascii=False) + "\n")
    print("designPolicy.contentHash =", man["designPolicy"]["contentHash"])


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
    if "--write-policy-hash" in sys.argv:
        sys.exit(write_policy_hash())
    sys.exit(main())
