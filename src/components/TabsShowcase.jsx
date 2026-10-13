import { useLayoutEffect, useRef, useState } from 'react'
import AppearText from './AppearText.jsx'
import { DeepBar } from './ProductSections.jsx'
import { Shell } from './ui.jsx'
import { animateHeight, EASE } from './motion.js'

// Bar + two-column panel: heading, lead and an accordion on the left, the active tab's image
// on the right (specs/products.md §2.3). Exactly one row is open; clicking the open row does
// nothing; the image swaps instantly; rows tween height ~0.45s.
// props: title, lead, tabs [{ title, body, image }], barGraphic
export default function TabsShowcase({ title, lead, tabs, barGraphic }) {
  const [active, setActive] = useState(0)
  const rows = useRef([])
  const before = useRef(null)

  const select = (i) => {
    if (i === active) return
    before.current = rows.current.map((el) => el?.getBoundingClientRect().height)
    setActive(i)
  }

  useLayoutEffect(() => {
    if (!before.current) return
    rows.current.forEach((el, i) => {
      const to = el.getBoundingClientRect().height
      animateHeight(el, before.current[i], to, { duration: 450, easing: EASE.tabs })
    })
    before.current = null
  }, [active])

  return (
    <Shell as="section">
      <DeepBar graphic={barGraphic} />
      <div className="grid grid-cols-1 bg-card-dark lg:h-[548px] lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-[15px] p-8 lg:px-8 lg:py-16">
          <AppearText as="h2" split="word" className="font-display text-[40px] leading-[40px] tracking-[-1.6px] text-cream">
            {title}
          </AppearText>
          <div className="max-w-[600px] opacity-[0.64]">
            <AppearText delay={70} className="font-display text-[21px] leading-[29.4px] tracking-[-0.84px] text-cream">
              {lead}
            </AppearText>
          </div>
          <div className="flex flex-col gap-1 lg:max-w-[592px]">
            {tabs.map((t, i) => {
              const on = i === active
              return (
                <button
                  key={t.title}
                  ref={(el) => (rows.current[i] = el)}
                  type="button"
                  aria-expanded={on}
                  onClick={() => select(i)}
                  className={`flex w-full cursor-pointer gap-3 px-4 py-2 text-left ${on ? "items-start bg-panel" : "items-center"}`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center font-mono text-[12px] font-bold leading-[18.2px] ${
                      on ? 'bg-amber-2 text-card-dark' : 'bg-card-dark text-cream'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className={`t-mono text-cream ${on ? '' : 'opacity-[0.64]'}`}>{t.title}</span>
                    {on && <span className="font-display text-[16px] leading-[19.2px] text-cream opacity-80">{t.body}</span>}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        {/* live: the image fills its cell on mobile / desktop; tablet insets it 64px in a 500 band */}
        <div className="h-[359px] md:h-[500px] md:p-16 lg:h-[548px] lg:p-0">
          <img src={tabs[active].image} alt="" className="h-full w-full object-cover" />
        </div>
      </div>
    </Shell>
  )
}
