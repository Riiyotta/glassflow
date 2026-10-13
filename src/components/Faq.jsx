import { useState } from 'react'
import { SVG, Shell } from './ui.jsx'
import { useHeightTransition } from './motion.js'

const FAQS = [
  ['What is GlassFlow?', 'GlassFlow is the data infrastructure for AI agents in production. It has two products: GlassFlow Tares, which feeds agents correlated data from every system they touch, and GlassFlow Rius, which traces and debugs what agents do once they’re running.'],
  ['What’s the difference between GlassFlow Tares and GlassFlow Rius?', 'GlassFlow Tares handles the data going into the agent, preparing and delivering exactly what each agent needs. GlassFlow Rius handles the data coming out: tracing, metrics, and debugging for agents in production. You can use either on its own or both together.'],
  ['Is GlassFlow open source?', 'Yes. GlassFlow Tares is open source and self-hostable on your own infrastructure. A managed Cloud tier is available when you’d rather not run it yourself.'],
  ['What makes GlassFlow different for long-running agents?', 'Most observability tools were built for short chat sessions and only compute metrics on completed traces. GlassFlow is built for agents that run for hours or days with live metrics on running agents, heartbeat detection for frozen ones, and unlimited retention so you can always reconstruct what happened.'],
]

// Original (Framer FAQ component, transition tween 0.2s ease [.5,0,.88,.77]):
// - answer mounts/unmounts instantly; the row's box eases between heights (layout
//   animation) while the rows below jump straight to their new position
// - icon cell bg rgb(45,24,4) <-> rgb(255,172,0) and icon rotate 180deg <-> 360deg, same tween
function Row({ q, a, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const [rowRef, capture] = useHeightTransition(open)
  const tween = 'faq-motion duration-200 ease-[cubic-bezier(0.5,0,0.88,0.77)]'
  return (
    <div ref={rowRef} className="hairline bg-page px-6 py-[17px]">
      <button
        type="button"
        onClick={() => {
          capture()
          setOpen((o) => !o)
        }}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="t-mono max-w-[640px] text-white">{q}</span>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center transition-colors ${tween} ${open ? 'bg-amber' : 'bg-panel'}`}>
          <img
            src={SVG(open ? 'faq-minus' : 'faq-chevron')}
            alt=""
            className={`h-4 w-4 transition-transform ${tween} ${open ? 'rotate-[360deg]' : 'rotate-180'}`}
          />
        </span>
      </button>
      {open && (
        <p className="max-w-[640px] pt-2 font-display text-[16px] leading-[19.2px] text-cream opacity-80">{a}</p>
      )}
    </div>
  )
}

// heading/items/inset: product pages (specs/products.md §2.7). `inset` pulls the column in
// 128px each side at lg (1056 wide at 1440); full-bleed below lg.
export default function Faq({ heading = 'Frequently Asked Questions', items = FAQS, inset = false }) {
  return (
    <Shell inner={inset ? 'lg:px-[128px]' : ''}>
      <div className="hairline relative flex items-center justify-center bg-panel px-8 py-16 md:h-[160px]">
        <h2 className="text-center font-display text-[32px] leading-[32px] text-cream">
          {heading}
        </h2>
        {/* top-right stepped squares (Group 1321323836, 48x72) */}
        <span className="absolute right-6 top-0 h-6 w-6 bg-page" aria-hidden="true" />
        <span className="absolute right-0 top-0 h-6 w-6 bg-page" aria-hidden="true" />
        <span className="absolute right-0 top-6 h-6 w-6 bg-page" aria-hidden="true" />
        <span className="absolute right-6 top-12 h-6 w-6 bg-page" aria-hidden="true" />
        <img src={SVG('faq-corner')} alt="" className="absolute bottom-0 left-0 h-12 w-[72px]" />
      </div>
      {items.map(([q, a], i) => (
        <Row key={q} q={q} a={a} defaultOpen={i === 0} />
      ))}
    </Shell>
  )
}
