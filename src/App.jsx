import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, matchPath } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Pending from './pages/Pending.jsx'
import { ROUTES } from './routes.jsx'

let lenis

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) return
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

// Legacy-design routes (ROUTES entries with `bare: true`) bring their own nav and have no footer.
// Exact static routes win over the dynamic pattern (e.g. /categories/engineering is a redirect, not bare).
function GlobalChrome({ children }) {
  const { pathname } = useLocation()
  const hit = ROUTES.find((r) => !r.path.includes(':') && matchPath(r.path, pathname)) || ROUTES.find((r) => matchPath(r.path, pathname))
  return hit?.bare ? null : children
}

export default function App() {
  // Lenis smooth scroll, same config as the original's inline script
  useEffect(() => {
    if (!window.Lenis) return
    lenis = new window.Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    let id
    const raf = (time) => {
      lenis.raf(time)
      id = requestAnimationFrame(raf)
    }
    id = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
      lenis = undefined
    }
  }, [])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-page">
        <GlobalChrome>
          <Navbar />
        </GlobalChrome>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            {ROUTES.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
            <Route path="*" element={<Pending />} />
          </Routes>
        </main>
        <GlobalChrome>
          <Footer />
        </GlobalChrome>
      </div>
    </BrowserRouter>
  )
}
