#!/usr/bin/env python3
"""Proves each verify_all.py check catches drift: copies this design-repo to a scratch dir,
injects ONE defect per case, runs verify_all there, and requires the named check to FAIL.
Then runs verify_all on the untouched repo and requires PASS.

Source-dependent cases (citation content/range) need the sibling project; when it is absent
they are reported as SKIPPED, not passed.

Usage: python3 extraction/prove_drift.py [--scratch DIR]   (or a bare DIR; default: a new temp dir)
"""
import json, os, re, shutil, subprocess, sys, tempfile

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.dirname(REPO)
HAVE_SRC = os.path.isfile(os.path.join(SRC, "src", "routes.jsx"))


def jload(p):
    return json.load(open(p, encoding="utf-8"))


def jsave(p, d):
    json.dump(d, open(p, "w", encoding="utf-8"), indent=2, ensure_ascii=False)


def edit(rel, fn):
    def f(root):
        p = os.path.join(root, rel)
        d = jload(p)
        fn(d)
        jsave(p, d)
    return f


def text(rel, old, new):
    def f(root):
        p = os.path.join(root, rel)
        s = open(p, encoding="utf-8").read()
        assert old in s, (rel, old)
        open(p, "w", encoding="utf-8").write(s.replace(old, new, 1))
    return f


def first_citation(d):
    stack = [d]
    while stack:
        o = stack.pop()
        if isinstance(o, dict):
            if "path" in o and "lines" in o and "quote" in o:
                return o
            stack.extend(o.values())
        elif isinstance(o, list):
            stack.extend(o)


def bad_range(d):
    first_citation(d)["lines"] = "99999"


def wrong_content(d):
    c = first_citation(d)
    a = int(re.match(r"\d+", c["lines"]).group())
    c["lines"] = str(a + 1)  # in range, but the quoted text is not there


def add_file(rel, obj):
    def f(root):
        jsave(os.path.join(root, rel), obj)
    return f


CASES = [
    ("allowlist-parity", "phantom allowlist entry", edit("tokens/llm/component-allowlist.json", lambda d: d["sections"].append("hero.phantom")), False),
    ("allowlist-parity", "orphan contract with no allowlist entry", add_file("primitives/orphan.json", {"id": "orphan", "kind": "primitive"}), False),
    ("allowlist-version-parity", "manifest allowlistVersion drift", edit("registry.manifest.json", lambda d: d.__setitem__("allowlistVersion", "9.9.9")), False),
    ("manifest-counts", "hand-bumped manifest count", edit("registry.manifest.json", lambda d: d["counts"].__setitem__("sections", d["counts"]["sections"] + 1)), False),
    ("manifest-counts", "README count row stale", text("README.md", "| templates | ", "| templates | 99"), False),
    ("citation-validity", "out-of-range citation", edit("sections/hero.home.json", bad_range), True),
    ("citation-validity", "in-range citation pointing at the wrong line", edit("sections/hero.home.json", wrong_content), True),
    ("citation-validity", "motion value drift (stagger 50 -> 35 in quoted evidence)", text("tokens/00-foundation/motion.json", "stagger = 50, duration = 1000", "stagger = 35, duration = 1000"), True),
    ("pinned-forms", "contact endpointPolicy -> local-stub (valid enum member)", edit("policies/forms.json", lambda d: d["forms"]["contact-form"].__setitem__("endpointPolicy", "local-stub")), False),
    ("pinned-roles", "person.real-photo cloneModePolicy -> may-generate-new (valid enum member)", edit("assets/asset-roles.json", lambda d: d["roles"]["person.real-photo"].__setitem__("cloneModePolicy", "may-generate-new")), False),
    ("role-closure", "invented role in registry", edit("assets/asset-roles.json", lambda d: d["roles"].__setitem__("stock.photo", {"kind": "media", "cloneModePolicy": "may-generate-new", "pinned": False, "guidance": "x", "evidence": []})), False),
    ("pinned-availability", "registry: GlassFlow wordmark -> generation-safe", edit("assets/asset-roles.json", lambda d: d["roles"]["brand.glassflow-mark"].update(availability="generation-safe", generationModePolicy="may-generate-new")), False),
    ("pinned-availability", "registry: real-photo -> clone-only (different valid value)", edit("assets/asset-roles.json", lambda d: d["roles"]["person.real-photo"].update(availability="clone-only", generationModePolicy="substitute-required")), False),
    ("pinned-availability", "pin loosened in semantic_validate.py only (registry + validator flipped together)", lambda r: (text("schema/semantic_validate.py", '"logo.customer": ("blocked-for-generation", "blocked"),', '"logo.customer": ("generation-safe", "may-generate-new"),')(r), edit("assets/asset-roles.json", lambda d: d["roles"]["logo.customer"].update(availability="generation-safe", generationModePolicy="may-generate-new"))(r)), False),
    ("pinned-availability", "pin removed from verify_all.py", text("extraction/verify_all.py", '    "logo.customer": ("blocked-for-generation", "blocked"),\n', ''), False),
    ("pinned-availability", "clone-only role loses its substitutes", edit("assets/asset-roles.json", lambda d: d["roles"]["blog.cover"].__setitem__("generationSafeSubstitutes", [])), False),
    ("substitute-closure", "section field accepts a real logo but not its placeholder substitute", edit("sections/social-proof.testimonial.json", lambda d: d["content"]["properties"]["company"]["properties"]["logo"]["properties"]["assetRole"]["enum"].remove("logo.placeholder-company")), False),
    ("contract-schema", "unknown key in a section contract", edit("sections/faq.accordion.json", lambda d: d.__setitem__("inventedField", True)), False),
    ("contract-provenance", "source.tag no longer inside source.lines", edit("sections/hero.home.json", lambda d: d["source"].__setitem__("lines", "1-3")), True),
    ("contract-provenance", "semantic.id equals source.id", edit("sections/faq.accordion.json", lambda d: d["source"].__setitem__("id", "faq.accordion")), False),
    ("retrieval-pin", "runtime success panel flipped to retrievalEligible=true", edit("sections/contact.success-panel.json", lambda d: (d.__setitem__("retrievalEligible", True), d.pop("retrievalReason"))), False),
    ("retrieval-pin", "content section flipped ineligible (contract + reason together)", edit("sections/faq.accordion.json", lambda d: d.update(retrievalEligible=False, retrievalReason="x" * 40)), False),
    ("wrapper-gate", "home hero measured 3100px", edit("extraction/measured-values.json", lambda d: [n.__setitem__("heightPx", 3100) for r in d["sectionHeights"]["routes"] if r["template"] == "home" for n in r["nodes"] if n["section"] == "hero.home"]), False),
    ("wrapper-gate", "template measurement removed", edit("extraction/measured-values.json", lambda d: d["sectionHeights"].__setitem__("routes", [r for r in d["sectionHeights"]["routes"] if r["template"] != "about"])), False),
    ("wrapper-gate", "whitelist justification emptied", edit("extraction/measured-values.json", lambda d: d["wrapperGateWhitelist"][0].__setitem__("justification", "")), False),
    ("token-catalog-in-sync", "token file value changed, catalog not rebuilt", edit("tokens/00-foundation/color.json", lambda d: d["mars"]["amber"].__setitem__("$value", "#FFAD00")), False),
    ("token-policy-resolves", "token policy names a spacing token that does not exist", edit("tokens/llm/token-policy.json", lambda d: d["slots"]["node.tokens.spacingY"]["allowed"].append("spacer-ghost")), False),
    ("source-identity", "a real person dropped from the blocklist", edit("policies/source-identity.json", lambda d: d.__setitem__("persons", d["persons"][1:])), True),
    ("source-identity", "blocklist term without evidence", edit("policies/source-identity.json", lambda d: d["brand"][0].__setitem__("evidence", [])), False),
    ("generated-examples", "GlassFlow brand leaks into a generated example", edit("schema/examples/generated.landing.pagespec.json", lambda d: d["meta"].__setitem__("title", "GlassFlow for teams")), False),
    ("generated-examples", "a template family loses its generated example", lambda r: os.remove(os.path.join(r, "schema/examples/generated.legal.pagespec.json")), False),
    ("policy-binding", "enforcing validator edited without re-hashing", text("schema/semantic_validate.py", "Exit 1 if any error", "Exit 1 on any error"), False),
    ("policy-binding", "SaaS classification bound to another policy id", edit("registry.manifest.json", lambda d: d["designPolicy"].__setitem__("policyId", "consumer-app-web")), False),
    ("route-source-drift", "live category page dropped from routes.json", edit("templates/routes.json", lambda d: d.__setitem__("routes", [r for r in d["routes"] if r["path"] != "/categories/mcp"])), True),
    ("graph-validator-parity", "graph rule removed", edit("compatibility/graph.json", lambda d: d.__setitem__("rules", d["rules"][:-1])), False),
    ("schema-in-sync", "schema hand-edited", edit("schema/pagespec.schema.json", lambda d: d["properties"]["theme"].__setitem__("enum", ["mars"])), False),
    ("motion-closure", "invented motion pattern in a section", edit("sections/faq.accordion.json", lambda d: d["motion"]["allowedPatterns"].append("scroll-reveal")), False),
    ("route-coverage", "route bound to a non-existent template", edit("templates/routes.json", lambda d: d["routes"][0].__setitem__("template", "ghost")), False),
    ("route-source-drift", "redirect silently dropped from routes.json", edit("templates/routes.json", lambda d: d.__setitem__("routes", [r for r in d["routes"] if r["path"] != "/newsletter"])), True),
    ("template-integrity", "legacy section added to a mars template", edit("templates/templates.json", lambda d: d["templates"]["home"]["nodes"].insert(2, {"section": "legacy.bottom-cta", "variants": ["default"], "required": True, "repeatable": False})), False),
    ("no-absolute-paths", "absolute path in manifest", edit("registry.manifest.json", lambda d: d.__setitem__("sourcePath", "/" + "Users/someone/V3/GLASSFLOW")), False),
    ("manifest-entrypoints", "entryPoint outside the package", edit("registry.manifest.json", lambda d: d["entryPoints"].__setitem__("ia", "../ia.json")), False),
    ("example-valid", "example field over its maxWords budget", edit("schema/example.pagespec.json", lambda d: d["nodes"][1]["content"].__setitem__("lead", " ".join(["w"] * 41))), False),
    ("asset-refs", "example references an asset that does not exist", edit("schema/example.pagespec.json", lambda d: d["nodes"][1]["content"]["bandImage"].__setitem__("ref", "/assets/missing-file.png")), True),
    ("section-completeness", "section loses its responsive block", edit("sections/blog.share-bar.json", lambda d: d.pop("responsive")), False),
]


def run_verify(root):
    env = dict(os.environ)
    if HAVE_SRC:
        env["GLASSFLOW_SOURCE_ROOT"] = SRC
    r = subprocess.run([sys.executable, os.path.join(root, "extraction/verify_all.py")], capture_output=True, text=True, env=env)
    return r.returncode, r.stdout


def main():
    args = sys.argv[1:]
    if "--scratch" in args:
        base = args[args.index("--scratch") + 1]
    else:
        base = args[0] if args else tempfile.mkdtemp(prefix="drift-")
    os.makedirs(base, exist_ok=True)
    fails = 0
    for check, name, inject, needs_src in CASES:
        if needs_src and not HAVE_SRC:
            print(f"  SKIPPED   [{check}] {name} (needs the sibling source tree)")
            continue
        root = os.path.join(base, re.sub(r"\W+", "_", name))
        shutil.rmtree(root, ignore_errors=True)
        shutil.copytree(REPO, root, ignore=shutil.ignore_patterns("__pycache__"))
        inject(root)
        code, out = run_verify(root)
        caught = code != 0 and re.search(rf"^\s+FAIL {re.escape(check)}\b", out, re.M)
        fails += not caught
        err = next((l.strip() for l in out.splitlines() if l.strip().startswith(f"ERROR [{check}]")), "")
        print(f"  {'CAUGHT' if caught else 'MISSED!'}    [{check}] {name}\n            {err[:170]}")
    code, out = run_verify(REPO)
    print(f"  {'PASS' if code == 0 else 'FAIL'}      untouched repo -> {out.strip().splitlines()[-1]}")
    fails += code != 0
    print(f"\n{len(CASES)} drift cases, {fails} failure(s)")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
