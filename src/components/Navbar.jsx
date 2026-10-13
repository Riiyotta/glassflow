import { useLocation } from 'react-router-dom'
import { SVG } from './ui.jsx'

const cell = 'hairline flex h-[40px] items-center bg-deep px-4 t-mono text-muted'

const MOBILE_LINKS = [
  ['tares', '/tares'],
  ['rius', '/rius'],
  ['docs', 'https://docs.glassflow.ai/'],
  ['blog', '/blog'],
  ['contact', '/contact'],
]

function ProductsMenu() {
  const items = [
    { href: '/tares', icon: 'icon-tares', title: 'tares', desc: 'feed your agents the right data. open source.' },
    { href: '/rius', icon: 'icon-rius', title: 'rius', desc: 'see what your agents did in production.' },
  ]
  return (
    <div className="dropdown absolute left-[-1px] top-[40px] z-50 flex w-[500px] bg-white">
      {items.map((it, i) => (
        <a
          key={it.title}
          href={it.href}
          className={`flex h-[135px] w-[250px] flex-col gap-3 p-5 ${i === 0 ? 'border-r border-black/20' : ''}`}
        >
          <img src={SVG(it.icon)} alt="" className="h-6 w-6" />
          <span className="font-mono text-[14px] font-bold leading-[24px] text-black">{it.title}</span>
          <span className="font-mono text-[14px] font-medium leading-[19.6px] tracking-[-0.32px] text-black/70">
            {it.desc}
          </span>
        </a>
      ))}
    </div>
  )
}

// Per-route get_started target (specs/products.md §1.1); every other page jumps to the home quickstart.
const CTA_BY_PATH = {
  '/tares': 'https://console.tares-glassflow.com/?utm_source=button&utm_medium=website&utm_campaign=hp_start_cta',
  '/rius': 'https://console.rius-glassflow.com/signup?utm_source=framer.com&utm_medium=referral&utm_campaign=hp_start_cta',
}

export default function Navbar({ ctaHref }) {
  const { pathname } = useLocation()
  const href = ctaHref ?? CTA_BY_PATH[pathname] ?? (pathname === '/' ? '#quickstart' : '/#quickstart')
  return (
    <header className="relative z-40 w-full bg-deep md:px-8 lg:px-16">
      <nav className="flex h-[40px] items-stretch justify-between">
        <div className="flex items-stretch">
          <a href="/" className="hairline flex h-[40px] w-[149px] items-center px-3" aria-label="GlassFlow home">
            <img src={SVG('wordmark')} alt="GlassFlow" className="h-4 w-[125px]" />
          </a>
          <div className="has-dropdown relative hidden md:flex">
            <a href="#" className={`${cell} nav-products gap-1`}>
              products
              <svg viewBox="0 0 10 6" className="h-[6px] w-[10px]" aria-hidden="true">
                <path d="M10 0V2H8V4H6V6H4V4H2V2H0V0H10Z" fill="#8F8982" />
              </svg>
            </a>
            <ProductsMenu />
          </div>
          <a href="https://docs.glassflow.ai/" className={`${cell} hidden md:flex`}>docs</a>
          <a href="/blog" className={`${cell} hidden md:flex`}>blog</a>
          <a href="/contact" className={`${cell} hidden md:flex`}>contact</a>
          {/* Mobile: empty, unbordered 88px cell next to the logo */}
          <span className="block h-[40px] w-[88px] md:hidden" aria-hidden="true" />
        </div>
        <a href={href} className="flex items-stretch">
          <span className="hairline flex h-[40px] w-[111px] items-center justify-center bg-amber font-mono text-[14px] font-bold leading-[18.2px] text-on-amber">
            get_started
          </span>
          <img src={SVG('nav-arrow-cell')} alt="" className="h-[42px] w-[42px] -translate-y-px" />
        </a>
      </nav>
      {/* Mobile: second row of five 78px link cells (y 40-80 on the original) */}
      <div className="flex h-[40px] md:hidden">
        {MOBILE_LINKS.map(([label, href]) => (
          <a key={label} href={href} className={`${cell} min-w-0 flex-1 basis-0 justify-center px-0`}>
            {label}
          </a>
        ))}
      </div>
    </header>
  )
}
