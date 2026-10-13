import { A, SVG, Shell, Dots, TitleBar, BigButton } from './ui.jsx'

function CtaBand() {
  const cells = [
    {
      bg: 'dkWQcxyRjqORomn3COxNj6KgRl4.jpg',
      title: 'Start with Tares',
      sub: 'Feed your agents the right data.',
      href: 'https://console.tares-glassflow.com/',
    },
    {
      bg: 'ZsW3C35h6WXWKMkdVHcrVPc.jpg',
      title: 'Start with Rius',
      sub: 'See and debug agents in production.',
      href: 'https://console.rius-glassflow.com/signup?utm_source=glassflow&utm_medium=footer&utm_campaign=signup&utm_content=core',
    },
  ]
  return (
    <Shell inner="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[662fr_325fr_325fr]">
      {/* heading cell: 160 tall/left on mobile, 224 tall/centred on tablet, 320 tall/left on desktop */}
      <div className="hairline relative flex h-[160px] items-center overflow-hidden p-8 md:col-span-2 md:h-[224px] md:justify-center md:p-16 lg:col-span-1 lg:h-[320px] lg:justify-start lg:p-8">
        <img src={A('p8ihsATIQW2BpC2j7ekzEF2gA.jpg')} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <h2 className="relative max-w-[271px] font-display text-[32px] leading-[32px] text-cream">
          Ready to give your agents better data and total recall?
        </h2>
      </div>
      {cells.map((c) => (
        <div key={c.title} className="hairline relative flex h-[320px] items-center justify-center overflow-hidden p-6">
          <img src={A(c.bg)} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="relative flex flex-col items-center gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <h3 className="font-display text-[24px] leading-[24px] text-cream">{c.title}</h3>
              <p className="t-mono whitespace-nowrap text-cream opacity-80">{c.sub}</p>
            </div>
            <BigButton href={c.href} />
          </div>
        </div>
      ))}
    </Shell>
  )
}

function ProductLink({ href, icon, title, desc }) {
  return (
    <a href={href} className="hairline flex h-[155px] flex-col justify-center gap-2 p-5 md:h-[142px]">
      <img src={SVG(icon)} alt="" className="h-6 w-6" />
      <span className="flex flex-col">
        <span className="font-mono text-[14px] font-bold leading-[24px] tracking-[-0.32px] text-white opacity-90">{title}</span>
        <span className="max-w-[211px] font-mono text-[14px] font-medium lowercase leading-[19.6px] tracking-[-0.32px] text-white opacity-[0.64]">
          {desc}
        </span>
      </span>
    </a>
  )
}

const LINKS = [
  ['contact', '/contact', 'h-16'],
  ['docs', 'https://docs.glassflow.ai/', 'h-16'],
  ['blog', '/blog', 'h-16'],
  ['about', '/about', 'h-8'],
]
const SOCIAL = [
  ['x', 'https://x.com/glassflowdev', 'X', 'h-4 w-4'],
  ['linkedin', 'https://www.linkedin.com/company/glassflow-dev/', 'LinkedIn', 'h-[15px] w-[15px]'],
  ['github', 'https://github.com/glassflow/tares', 'GitHub', 'h-[16px] w-[17px]'],
]

export default function Footer() {
  return (
    <footer className="bg-deep">
      <div className="h-[67px] border-b border-line md:px-8 lg:px-16">
        <div className="h-full md:border-x md:border-line" />
      </div>
      <CtaBand />
      {/* link row: 8px padding/gap; 208 tall on desktop (logo cell 194 overhangs the 192 content box) */}
      <Shell className="line-t" inner="flex flex-col gap-2 p-2 lg:h-[208px] lg:flex-row lg:items-center">
        <a
          href="/"
          className="hairline relative hidden h-[194px] w-[202px] shrink-0 items-center justify-center bg-cover lg:flex"
          style={{ backgroundImage: `url(${SVG('footer-pattern')})` }}
          aria-label="GlassFlow home"
        >
          <img src={SVG('wordmark')} alt="GlassFlow" className="h-4 w-[125px]" />
        </a>
        {/* products block is a fixed 192px on every breakpoint; the 155px mobile cells overhang it like the original */}
        <div className="flex h-[192px] shrink-0 flex-col lg:flex-1">
          <TitleBar label="products" />
          <div className="grid grid-cols-2">
            <ProductLink href="/tares" icon="icon-tares" title="tares" desc="Feed your agents the right data. Open source" />
            <ProductLink href="/rius" icon="icon-rius" title="rius" desc="See what your agents did in production." />
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:w-[175px]">
          {LINKS.map(([label, href, h]) => (
            <a key={label} href={href} className={`hairline flex ${h} items-center gap-4 bg-bar px-4 lg:h-[42px]`}>
              <Dots />
              <span className="t-mono text-cream-64">{label}</span>
            </a>
          ))}
        </div>
        <div className="flex gap-2 md:hidden lg:flex lg:w-[100px] lg:flex-col lg:justify-center">
          {SOCIAL.map(([n, href, label, size]) => (
            <a key={n} href={href} aria-label={label} className="hairline flex h-16 flex-1 items-center justify-center lg:h-[59px] lg:flex-none">
              <img src={SVG(n)} alt="" className={size} />
            </a>
          ))}
        </div>
      </Shell>
      <Shell className="line-t" inner="flex h-[66px] items-center justify-between overflow-hidden px-6 t-mono text-cream">
        <span className="whitespace-nowrap opacity-80">2026 - Copyright GlassFlow.ai</span>
        <a href="/terms-of-service" className="whitespace-nowrap opacity-80">Terms &amp; Conditions</a>
        <a href="/privacy-policy" className="whitespace-nowrap opacity-80">Privacy Policy</a>
      </Shell>
    </footer>
  )
}
