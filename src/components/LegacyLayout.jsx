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

// Static stand-in for the buttons.js GitHub star widget (live: a 170x28 buttons.github.io iframe,
// data-size="large", light scheme): mark-github + "clickhouse-etl" button, then the "504" count.
const GH_MARK =
  'M6.766 11.328c-2.063-.25-3.516-1.734-3.516-3.656 0-.781.281-1.625.75-2.188-.203-.515-.172-1.609.063-2.062.625-.078 1.468.25 1.968.703.594-.187 1.219-.281 1.985-.281.765 0 1.39.094 1.953.265.484-.437 1.344-.765 1.969-.687.218.422.25 1.515.046 2.047.5.593.766 1.39.766 2.203 0 1.922-1.453 3.375-3.547 3.64.531.344.89 1.094.89 1.954v1.625c0 .468.391.734.86.547C13.781 14.359 16 11.53 16 8.03 16 3.61 12.406 0 7.984 0 3.563 0 0 3.61 0 8.031a7.88 7.88 0 0 0 5.172 7.422c.422.156.828-.125.828-.547v-1.25c-.219.094-.5.156-.75.156-1.031 0-1.64-.562-2.078-1.609-.172-.422-.36-.672-.719-.719-.187-.015-.25-.093-.25-.187 0-.188.313-.328.625-.328.453 0 .844.281 1.25.86.313.452.64.655 1.031.655s.641-.14 1-.5c.266-.265.47-.5.657-.656'
const GH_PART = 'inline-flex h-7 items-center whitespace-nowrap border border-[#d1d9e0] px-[10px] py-[5px] font-sys text-[12px] font-semibold leading-4 text-[#25292e]'

function GithubStar() {
  return (
    <a href={GH_ETL} className="inline-flex h-7 align-bottom" aria-label="Star glassflow/clickhouse-etl on GitHub">
      <span className={`${GH_PART} rounded-l-[3px] bg-[linear-gradient(180deg,#f6f8fa,#ebf0f4_90%)] hover:bg-[linear-gradient(180deg,#eff2f5,#e5eaee_90%)]`}>
        <svg viewBox="0 0 16 16" width="16" height="16" className="mr-[3.2px] h-4 w-4 shrink-0 fill-current" aria-hidden="true">
          <path d={GH_MARK} />
        </svg>
        clickhouse-etl
      </span>
      <span className={`${GH_PART} rounded-r-[3px] border-l-0 bg-white hover:text-[#0969da]`}>504</span>
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
        {/* live: 1x26 #3B3B3B rule at logo+24, first link at logo+48; links 24px apart, chevron 2px after text */}
        <span className="ml-6 mr-[23px] hidden h-[26px] w-px bg-[#3B3B3B] md:block" aria-hidden="true" />
        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map(([label, href]) =>
            MENUS[label] ? (
              <div key={label} className="legacy-dd-item relative flex h-[62px] items-center">
                <a href={href} className={`flex items-center gap-0.5 ${linkCls(tone)}`}>
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
