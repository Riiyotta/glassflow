#!/usr/bin/env python3
"""Whole-page-wrapper quality gate (baseline R9). Called from extraction/verify_all.py; also
runnable alone. Reads measured heights (extraction/measured-values.json sectionHeights, recorded at
1440px from the built clone by measure_sections.mjs + record_section_heights.py).

Thresholds are pinned HERE, in code (not read from JSON):
  HERO taller than 1800px -> warn; taller than 3000px -> error unless whitelisted.
  One in-flow section holding > 50% of its page -> warn; > 60% -> error unless whitelisted.
  Pages with < 3 in-flow sections are skipped for the share rule; SHELL (chrome.*) is excluded;
  fixed/sticky elements take no page height.
  A template with no measured route, a measurement at another viewport, or an unmappable
  measurement -> error.
Whitelist (measured-values.json wrapperGateWhitelist): reviewedBy, justification >= 30 chars,
maxHeightPx above the measured height. A stale entry (no longer a hit) or an over-cap height is an
error; a whitelisted hit still warns. An agent reviewer must say "agent attestation, not a human
sign-off".
"""
import json, os, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIEWPORT = 1440
HERO_WARN_PX = 1800
HERO_ERROR_PX = 3000
SHARE_WARN = 0.50
SHARE_ERROR = 0.60
MIN_INFLOW_SECTIONS = 3
AGENT_PHRASE = "agent attestation, not a human sign-off"


def load(rel, root=REPO):
    with open(os.path.join(root, rel), encoding="utf-8") as f:
        return json.load(f)


def instances(nodes):
    """Merge the DOM blocks of one section instance (domPart 1/k .. k/k) into a single height."""
    out = []
    for n in nodes:
        if n.get("domPart") and not n["domPart"].startswith("1/") and out and out[-1]["section"] == n["section"]:
            out[-1] = dict(out[-1], heightPx=out[-1]["heightPx"] + n["heightPx"])
        else:
            out.append(dict(n))
    return out


def gate(root=REPO):
    errors, warnings, hits = [], [], []
    mv = load("extraction/measured-values.json", root)
    sh = mv.get("sectionHeights")
    templates = load("templates/templates.json", root)["templates"]
    graph = load("compatibility/graph.json", root)
    hero_keys = graph["heroKeys"]
    if not sh:
        return [f"no sectionHeights in extraction/measured-values.json: every template is unmeasured"], [], []
    if sh.get("viewport") != VIEWPORT:
        errors.append(f"sectionHeights measured at {sh.get('viewport')}px, gate requires {VIEWPORT}px")
    measured = {}
    for r in sh.get("routes", []):
        measured.setdefault(r["template"], []).append(r)
    for tid in templates:
        if tid not in measured:
            errors.append(f"{tid}: no measured route (missing measurement)")
    wl = mv.get("wrapperGateWhitelist", [])
    used = set()
    for tid, rs in measured.items():
        if tid not in templates:
            errors.append(f"sectionHeights has unknown template {tid}")
            continue
        for r in rs:
            if r.get("mapping") == "unmappable":
                errors.append(f"{tid} {r['route']}: measurement could not be mapped to the template's nodes")
                continue
            nodes = instances(r["nodes"])
            for n in nodes:
                if n.get("inFlow") and not isinstance(n.get("heightPx"), (int, float)):
                    errors.append(f"{tid} {r['route']}: {n.get('section')} has no measured height")
            page = r["pageHeightPx"]
            flow = [n for n in nodes if n.get("inFlow") and not str(n.get("section") or "").startswith("chrome.") and isinstance(n.get("heightPx"), (int, float))]
            for n in flow:
                sec = n.get("section")
                is_hero = sec is not None and any(sec == s and (v == "*" or v in n.get("variants", [])) for s, v in hero_keys)
                if is_hero and n["heightPx"] > HERO_WARN_PX:
                    hits.append(("hero", tid, r["route"], sec, n["heightPx"], n["heightPx"] > HERO_ERROR_PX))
                if len(flow) >= MIN_INFLOW_SECTIONS and page and n["heightPx"] / page > SHARE_WARN:
                    hits.append(("share", tid, r["route"], sec, n["heightPx"], n["heightPx"] / page > SHARE_ERROR, round(n["heightPx"] / page, 3)))
    for h in hits:
        kind, tid, route, sec, px, is_error = h[:6]
        what = f"{kind} {tid} {route} {sec}: {px}px" + (f" = {h[6]:.1%} of the page" if kind == "share" else "")
        w = next((i for i, e in enumerate(wl) if e.get("kind") == kind and e.get("template") == tid and e.get("section") == sec), None)
        if w is None:
            (errors if is_error else warnings).append(f"{what} ({'over the error threshold' if is_error else 'over the warn threshold'})")
            continue
        used.add(w)
        e = wl[w]
        if px > e.get("maxHeightPx", 0):
            errors.append(f"{what} exceeds whitelist maxHeightPx {e.get('maxHeightPx')}")
        else:
            warnings.append(f"{what} (whitelisted, reviewedBy: {e.get('reviewedBy')})")
    for i, e in enumerate(wl):
        if len(e.get("justification", "")) < 30:
            errors.append(f"whitelist[{i}] {e.get('template')}/{e.get('section')}: justification shorter than 30 chars")
        rb = e.get("reviewedBy", "")
        if not rb:
            errors.append(f"whitelist[{i}]: reviewedBy missing")
        elif "agent" in rb.lower() and AGENT_PHRASE not in rb:
            errors.append(f"whitelist[{i}]: an agent reviewer must state '{AGENT_PHRASE}'")
        if i not in used:
            errors.append(f"whitelist[{i}] {e.get('kind')} {e.get('template')}/{e.get('section')} is stale (no current hit)")
    return errors, warnings, hits


if __name__ == "__main__":
    errs, warns, hits = gate()
    for w in warns:
        print("  WARN ", w)
    for e in errs:
        print("  ERROR", e)
    print(f"wrapper gate: {len(errs)} error(s), {len(warns)} warning(s), {len(hits)} hit(s)")
    sys.exit(1 if errs else 0)
