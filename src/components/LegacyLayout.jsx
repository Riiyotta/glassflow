// Legacy black (pre-rebrand) shell shared by /categories/:slug and the T4 guide pages
// (specs/content.md §3, specs/landing.md T4.1). Own fixed nav, no global Navbar/Footer.
import { useLayoutEffect, useRef, useState } from 'react'
import { EASE, prefersReducedMotion } from './motion.js'
import { A, SVG } from './ui.jsx'

export const L = (f) => A(`legacy/${f}`)
const GH_ETL = 'https://github.com/glassflow/clickhouse-etl'

const MENUS = {
  Product: [
    ['Overview', '/product'],
    ['Integrations', '/integrations'],
    ['For Enterprises', '/enterprise'],
    ['For ClickStack', '/clickstack'],
  ],
  Resources: [
    ['Tutorials', 'https://github.com/glassflow/clickhouse-etl/tree/main/demos'],
    ['Blog', '/blog'],
    ['Docs', 'https://docs.glassflow.dev'],
  ],
}
const LINKS = [
  ['Product', '/product'],
  ['Case Studies', '/case-studies'],
  ['Pricing', '/rius/pricing'],
  ['Resources', '/product'],
  ['Contact', '/contact'],
]

// link colour: #999999 on the guide pages, #A8A3A3 on the category pages
const linkCls = (tone) =>
  `font-inter text-[14px] font-medium leading-[16.8px] tracking-[-0.28px] ${tone} transition-colors duration-300 ease-[cubic-bezier(0.44,0,0.56,1)] hover:text-[#FAFAFA]`

function Chevron({ className = '' }) {
  return <img src={SVG('chevron-legacy')} alt="" className={`h-[14px] w-[14px] ${className}`} />
}

// Static stand-in for the buttons.js GitHub star widget ("clickhouse-etl | 504"); the live widget is a third-party iframe.
function GithubStar() {
  return (
    <a
      href={GH_ETL}
      className="flex h-7 items-stretch overflow-hidden rounded-md bg-white font-sys text-[12px] font-semibold leading-none text-[#24292f]"
      aria-label="Star glassflow/clickhouse-etl on GitHub"
    >
      <span className="flex items-center gap-1.5 px-3">
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
        </svg>
        clickhouse-etl
      </span>
      <span className="flex items-center border-l border-black/15 px-3">504</span>
    </a>
  )
}

function Dropdown({ items }) {
  return (
    // panel sits 4px under the 62px bar; the pt-1 wrapper bridges the gap so hover is not lost.
    // Open/close motion: .legacy-dd / .legacy-dd-panel in index.css (opacity + scale .95 from top centre).
    <div className="legacy-dd absolute left-1/2 top-[62px] z-50 -translate-x-1/2 pt-1">
      <div className="legacy-dd-panel flex w-[150px] flex-col gap-2 rounded-[15px] bg-black/80 p-[15px] shadow-[0_0_0_1px_rgba(0,0,0,0.05)]">
      {items.map(([label, href]) => (
        <a
          key={label}
          href={href}
          className="font-inter text-[15px] font-medium leading-[22.5px] tracking-[-0.15px] text-[#999999] transition-colors duration-300 ease-[cubic-bezier(0.44,0,0.56,1)] hover:text-[#FAFAFA]"
        >
          {label}
        </a>
      ))}
      </div>
    </div>
  )
}

function LegacyNav({ tone }) {
  const [open, setOpen] = useState(false)
  const menu = useRef(null)
  // Mobile menu open: opacity 0 -> 1, 600ms, measured exponential ease-out (EASE.legacyMenu).
  // The live menu also morphs its box from the hidden 342x401 card to a full-width 390x599 sheet;
  // the clone's open layout is the 342x401 card, so only the fade applies here. The live X does not
  // close the menu at all, so there is no close motion to match: the clone closes instantly.
  useLayoutEffect(() => {
    const el = menu.current
    if (!open || !el || !el.animate || prefersReducedMotion()) return
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: EASE.legacyMenu })
  }, [open])
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[62px] bg-black/80 px-6 backdrop-blur-[50px]">
      <div className="mx-auto flex h-full max-w-[1220px] items-center">
        <a href="/" aria-label="GlassFlow home" className="shrink-0">
          <img src={L('uJSz4vz8ntpPgNuLAZrGGPBhGFo.svg')} alt="GlassFlow" className="h-4 w-[114px]" />
        </a>
        <span className="mx-6 hidden h-4 w-px bg-[#333333] md:block" aria-hidden="true" />
        <nav className="hidden items-center gap-5 md:flex">
          {LINKS.map(([label, href]) =>
            MENUS[label] ? (
              <div key={label} className="legacy-dd-item relative flex h-[62px] items-center">
                <a href={href} className={`flex items-center gap-1 ${linkCls(tone)}`}>
                  {label}
                  <Chevron className="legacy-chev" />
                </a>
                <Dropdown items={MENUS[label]} />
              </div>
            ) : (
              <a key={label} href={href} className={linkCls(tone)}>
                {label}
              </a>
            ),
          )}
        </nav>
        <div className="ml-auto hidden md:block">
          <GithubStar />
        </div>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="relative z-10 ml-auto flex h-3 w-4 flex-col justify-between md:hidden"
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="block h-[2px] w-4 bg-white" />
          ))}
        </button>
      </div>
      {open && (
        <div ref={menu} className="fixed left-6 right-6 top-[3px] flex min-h-[401px] flex-col items-center gap-6 rounded-2xl bg-black/[0.92] p-6 md:hidden">
          <div className="flex w-full items-center justify-between">
            <img src={L('uJSz4vz8ntpPgNuLAZrGGPBhGFo.svg')} alt="GlassFlow" className="h-4 w-[114px]" />
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="font-inter text-[20px] leading-none text-white">
              ×
            </button>
          </div>
          {LINKS.map(([label, href]) => (
            <a key={label} href={href} className={linkCls(tone)}>
              {label}
            </a>
          ))}
          <a href={GH_ETL} className="flex h-12 w-[126px] items-center justify-center bg-white font-inter text-[14px] font-medium text-black">
            Start building
          </a>
          <GithubStar />
        </div>
      )}
    </header>
  )
}

// tone: nav link colour class
export default function LegacyLayout({ tone = 'text-[#999999]', children }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black font-inter">
      <LegacyNav tone={tone} />
      {children}
    </div>
  )
}
