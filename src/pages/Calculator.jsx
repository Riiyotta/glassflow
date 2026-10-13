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
      <Spacer inner="h-[64px]" />
      <Shell className="px-4" inner="bg-panel">
        <BuildVsBuyCalculator />
      </Shell>
    </>
  )
}
