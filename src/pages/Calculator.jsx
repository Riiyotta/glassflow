// /rius/calculator-building-your-own-agent-observability (specs/products.md §6)
import { useEffect } from 'react'
import BuildVsBuyCalculator from '../components/BuildVsBuyCalculator.jsx'
import { Shell, Spacer } from '../components/ui.jsx'

export default function Calculator() {
  useEffect(() => {
    document.title = 'GlassFlow | Agent Observability Cost Calculator: Build vs Buy'
  }, [])
  return (
    <>
      {/* Live: the 66px band exists only on desktop; tablet/phone put the calculator straight under the
          nav in a 64px / 16px gutter. */}
      <div className="hidden lg:block">
        <Spacer inner="h-[64px]" />
      </div>
      <Shell className="px-4 md:!px-16" inner="bg-panel">
        <BuildVsBuyCalculator />
      </Shell>
    </>
  )
}
