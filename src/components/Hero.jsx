import { Fragment, useRef } from 'react'
import { useRevealWords } from './motion.js'
import { A, SVG, Shell, Spacer, Dots, BigButton } from './ui.jsx'

const WORDS = ['the', 'data', 'infrastructure', 'for', 'AI', 'Agents', 'in', 'production']

function PanelBar({ className = '' }) {
  return (
    <div className={`hairline h-[38px] items-center bg-panel px-4 ${className || 'flex'}`}>
      <Dots tone="page" />
    </div>
  )
}

export default function Hero() {
  const h1 = useRef(null)
  useRevealWords(h1)
  return (
    <section>
      <Shell>
        <img
          src={A('8Cuc5KELijZEPw8wCqEqzfspE.png')}
          alt=""
          className="block h-[296px] w-full object-cover md:h-[228px] lg:h-[401px]"
        />
      </Shell>

      {/* Panels are transparent (page bg shows through); only the 38px bars are panel-coloured */}
      <Shell className="line-t" inner="flex flex-col md:flex-row md:gap-8">
        <div className="hairline flex flex-1 flex-col">
          <PanelBar />
          <div className="flex flex-col justify-center gap-4 p-8 md:h-[240px]">
            <h1 ref={h1} className="t-h1 max-w-[576px]" data-reveal-words>
              {/* space must sit outside the inline-block span or it collapses */}
              {WORDS.map((w, i) => (
                <Fragment key={i}>
                  <span className="reveal-word inline-block" style={{ '--i': i }}>
                    {w}
                  </span>
                  {i < WORDS.length - 1 ? ' ' : ''}
                </Fragment>
              ))}
            </h1>
          </div>
        </div>
        <div className="hairline flex flex-1 flex-col">
          <PanelBar className="hidden md:flex" />
          <div className="flex flex-col justify-center gap-4 px-8 pb-8 md:h-[240px] md:pt-8">
            <p className="t-lead max-w-[576px] opacity-80">
              GlassFlow is one data layer for both sides of the agent:{' '}
              <a href="/tares" className="inline-link">GlassFlow Tares</a> feeds agents correlated data, and{' '}
              <a href="/rius" className="inline-link">GlassFlow Rius</a> traces and debugs every run.
            </p>
            <div>
              <BigButton href="#quickstart" />
            </div>
          </div>
        </div>
      </Shell>

      <Spacer />

      <LogoStrip />
    </section>
  )
}

// inPanel: /contact left-column variant (specs/content.md §7.1): no Shell, caption bar centred on top,
// 4 cells in one row (2x2 on mobile).
export function LogoStrip({ inPanel = false }) {
  const logos = [
    { n: 'vercel', w: 101, h: 21, alt: 'Vercel' },
    { n: 'claude', w: 112, h: 24, alt: 'Claude' },
    { n: 'cursor', w: 101, h: 24, alt: 'Cursor' },
    { n: 'openai', w: 98, h: 24, alt: 'OpenAI' },
  ]
  if (inPanel) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4">
        <div className="hairline col-span-2 flex h-[50px] items-center justify-center px-8 py-4 md:col-span-4">
          <p className="t-mono text-center text-cream">Works with the tools you already use.</p>
        </div>
        {logos.map((l) => (
          <div key={l.n} className="hairline flex h-[125px] items-center justify-center p-6">
            <img src={SVG(l.n)} alt={l.alt} style={{ width: l.w, height: l.h }} className="max-w-full" />
          </div>
        ))}
      </div>
    )
  }
  return (
    <Shell inner="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-[280px_repeat(4,1fr)]">
      <div className="hairline col-span-2 flex h-[50px] items-center bg-panel px-8 py-4 md:col-span-4 lg:col-span-1 lg:h-auto">
        <p className="t-mono text-cream lg:max-w-[216px]">Works with the tools you already use.</p>
      </div>
      {logos.map((l) => (
        <div key={l.n} className="hairline flex h-[125px] items-center justify-center">
          <img src={SVG(l.n)} alt={l.alt} style={{ width: l.w, height: l.h }} />
        </div>
      ))}
    </Shell>
  )
}
