// Re-measures section heights at 1440px from a running build of the clone and prints JSON that
// extraction/measured-values.json stores under `sectionHeights` (consumed by extraction/wrapper_gate.py).
//
//   npx vite build --outDir <scratch> && npx vite preview --outDir <scratch> --port <port>
//   NODE_PATH="$(npm root -g)" MEASURE_BASE_URL=http://localhost:<port> node design-repo/extraction/measure_sections.mjs > heights.json
//
// Playwright is resolved through NODE_PATH (never an absolute path in this repo).
// Mapping: <header> = chrome.navbar, <footer> = chrome.footer; the in-flow children of <main>
// (descending through single-child wrappers) are matched 1:1, in order, to the template's
// non-chrome nodes. A count mismatch is recorded as an error for the gate, not guessed.
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.env.MEASURE_BASE_URL
if (!BASE) throw new Error('set MEASURE_BASE_URL (the vite preview origin)')
const PER_TEMPLATE = Number(process.env.MEASURE_ROUTES_PER_TEMPLATE || 3)
const VIEWPORT = { width: 1440, height: 900 }

const templates = JSON.parse(readFileSync(join(REPO, 'templates/templates.json'), 'utf8')).templates
const routes = JSON.parse(readFileSync(join(REPO, 'templates/routes.json'), 'utf8')).routes

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: VIEWPORT })
const out = { viewport: VIEWPORT.width, method: 'extraction/measure_sections.mjs: getBoundingClientRect().height after networkidle + 800ms, fixed/sticky elements contribute 0', templates: {} }

for (const [tid, t] of Object.entries(templates)) {
  const rs = routes.filter((r) => r.kind === 'page' && r.template === tid).slice(0, PER_TEMPLATE)
  out.templates[tid] = []
  for (const r of rs) {
    await page.goto(BASE + r.path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    const m = await page.evaluate(() => {
      const inflow = (el) => !['fixed', 'sticky'].includes(getComputedStyle(el).position) && getComputedStyle(el).display !== 'none'
      const h = (el) => Math.round(el.getBoundingClientRect().height)
      const header = document.querySelector('#root header')
      const footer = document.querySelector('#root footer')
      let kids = [...document.querySelector('main').children]
      // descend through single-child wrappers (legacy pages, the alternatives page wrapper)
      // (a <section> is a section, never a wrapper)
      for (let i = 0; i < 6; i++) {
        const flow = kids.filter(inflow).filter((k) => h(k) > 0)
        if (flow.length === 1 && ['DIV', 'MAIN'].includes(flow[0].tagName) && flow[0].children.length > 0) kids = [...flow[0].children]
        else break
      }
      const fixedKids = kids.filter((k) => !inflow(k)).map((k) => ({ tag: k.tagName.toLowerCase(), heightPx: h(k) }))
      const flow = kids.filter(inflow).filter((k) => h(k) > 0)
      return {
        pageHeightPx: document.documentElement.scrollHeight,
        navbarPx: header ? h(header) : null,
        footerPx: footer ? h(footer) : null,
        children: flow.map((k) => ({ tag: k.tagName.toLowerCase(), id: k.id || undefined, heightPx: h(k) })),
        outOfFlow: fixedKids,
      }
    })
    out.templates[tid].push({ route: r.path, ...m })
  }
}
await browser.close()
console.log(JSON.stringify(out, null, 1))
