// Shared primitives for the GlassFlow clone.

export const A = (p) => `/assets/${p}`
export const SVG = (n) => `/assets/svg/${n}.svg`

// Full-width row whose inner content column is 1312px wide at 1440 (64px gutters),
// 32px gutters on tablet, full-bleed on mobile. Vertical grid lines run down the column edges.
export function Shell({ className = '', inner = '', children, as: Tag = 'div', ...rest }) {
  return (
    <Tag className={`w-full md:px-8 lg:px-16 ${className}`} {...rest}>
      <div className={`shell-lines relative ${inner}`}>{children}</div>
    </Tag>
  )
}

// 67px blank band between sections, bordered top/bottom across the full width.
// `inner` sets the band height (product pages use a 32px divider under the nav: inner="h-[30px]").
export function Spacer({ className = 'bg-page', inner = 'h-[65px]' }) {
  return (
    <Shell className={`border-y border-line ${className}`} inner={inner} aria-hidden="true" />
  )
}

// Three 6px squares (4px gap) shown at the left of title bars.
// tone: 'dot' = line @80% over bar -> rgb(85,54,25) as measured; 'page' for hero panel bars.
export function Dots({ className = '', tone = 'dot' }) {
  const bg = tone === 'page' ? 'bg-page' : 'bg-line/80'
  return (
    <span className={`inline-flex shrink-0 gap-1 ${className}`} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} className={`block h-[6px] w-[6px] ${bg}`} />
      ))}
    </span>
  )
}

export function Arrow({ className = 'h-[14px] w-[16px]', src = 'arrow' }) {
  return <img src={SVG(src)} alt="" className={className} />
}

// Large amber CTA: [ label ][ → ] inside a 4px amber frame with inner hairlines.
// arrow={false}: label-only variant (content pages' "Two products" band, specs/content.md §0.2B).
export function BigButton({ label = 'get_started', href = '#', bold = false, className = '', arrow = true }) {
  return (
    <a
      href={href}
      className={`btn-primary inline-flex h-[52px] shrink-0 gap-2 bg-amber p-1 ${className}`}
    >
      <span
        className={`hairline flex h-[44px] items-center px-6 font-mono text-[14px] leading-[24px] tracking-[-0.32px] ${
          bold ? 'font-bold text-btn-ink' : 'font-medium text-on-amber'
        }`}
      >
        <span className="opacity-90">{label}</span>
      </span>
      {arrow && (
        <span className="hairline arrow-track flex h-[44px] w-[44px] items-center justify-center">
          <Arrow className="arrow-a h-[14px] w-[16px]" />
          <Arrow className="arrow-b h-[14px] w-[16px]" />
        </span>
      )}
    </a>
  )
}

// Dark secondary button (optionally with a 52px arrow cell; `outlined` adds the outer 1px frame).
// `inner` adds a fill to the inner block, `pad` its side padding (product pages: bg-panel / px-6).
export function DarkButton({ label, href = '#', withArrow = false, bg = 'bg-page', outlined = false, className = '', inner = '', pad = 'px-3' }) {
  return (
    <a href={href} className={`inline-flex h-[52px] shrink-0 ${className}`}>
      <span className={`flex h-[52px] items-center p-1 ${bg} ${outlined ? 'hairline' : ''}`}>
        <span className={`hairline flex h-[44px] items-center ${pad} ${inner} font-mono text-[14px] font-medium leading-[24px] tracking-[-0.32px] text-cream`}>
          <span className="opacity-90">{label}</span>
        </span>
      </span>
      {withArrow && (
        <span className="flex h-[52px] w-[52px] items-center justify-center bg-page p-1">
          {/* static on the original: no hover motion on github / learn_more */}
          <span className="hairline flex h-[44px] w-[44px] items-center justify-center">
            <CreamArrow />
          </span>
        </span>
      )}
    </a>
  )
}

function CreamArrow({ className = '' }) {
  return (
    <svg viewBox="0 0 16 14" className={`h-[14px] w-[16px] fill-cream ${className}`} aria-hidden="true">
      <path d="M0 6v2h16V6zM12 8v2h2V8zM10 10v2h2v-2zM8 12v2h2v-2zM12 6V4h2v2z" />
      <path d="M10 10V2h2v8zM8 12V0h2v12z" />
    </svg>
  )
}

// Title bar used above product sections and in the footer: dots left, label centred.
// The product-section bars render the label at opacity 0 on the original (dots only visible).
// dotsRight: second dot group at the right edge (/blog "featured-blog" bar, /about bars).
export function TitleBar({ label, className = '', labelClass = 'text-cream-64', hideLabel = false, dotsRight = false }) {
  return (
    <div className={`hairline relative flex h-[50px] items-center justify-center bg-bar px-4 ${className}`}>
      <Dots className="absolute left-4 top-1/2 -translate-y-1/2" />
      {dotsRight && <Dots className="absolute right-4 top-1/2 -translate-y-1/2" />}
      <span className={`t-mono ${labelClass} ${hideLabel ? 'opacity-0' : ''}`} aria-hidden={hideLabel || undefined}>{label}</span>
    </div>
  )
}
