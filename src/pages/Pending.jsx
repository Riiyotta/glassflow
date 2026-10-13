import { useLocation } from 'react-router-dom'
import { Shell } from '../components/ui.jsx'

// Temporary stand-in for routes whose page hasn't been built yet.
export default function Pending() {
  const { pathname } = useLocation()
  return (
    <Shell inner="flex min-h-[480px] flex-col items-center justify-center gap-4 bg-panel px-8 text-center">
      <p className="t-mono text-cream-64">{pathname}</p>
      <h1 className="t-h2">This page is being built.</h1>
      <a href={`https://www.glassflow.ai${pathname}`} className="t-mono text-amber">
        view the original
      </a>
    </Shell>
  )
}
