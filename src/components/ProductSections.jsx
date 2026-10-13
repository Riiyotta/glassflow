// Shared product-page sections (specs/products.md §1.4, §2.8).
import AppearText from './AppearText.jsx'
import { A, Shell, Dots, BigButton, DarkButton } from './ui.jsx'

const HERO_LEFT = A('tares/TBMiwA4xBut87o4aLpVaFd9bjq0.jpg')
const HERO_CORNER = A('tares/hero-corner.svg')

// 38px deep bar with the 6px dots; optional 58x12 graphic on the right.
export function DeepBar({ graphic, className = '' }) {
  return (
    <div className={`hairline flex h-[38px] shrink-0 items-center justify-between bg-deep px-4 ${className}`}>
      <Dots />
      {graphic && <img src={graphic} alt="" className="h-3 w-[58px] object-contain" />}
    </div>
  )
}

// Section title band (§1.4B): 160 tall, padding 64px 24px, 32/32 title left-aligned.
// /about bands (specs/content.md §6.3): height="h-[168px]" titleClass="text-[40px] leading-[40px]".
export function TitleRow({ title, height = 'h-[160px]', titleClass = 'text-[32px] leading-[32px]' }) {
  return (
    <Shell inner={`hairline flex ${height} items-center px-6 py-16`}>
      <h2 className={`font-display ${titleClass} text-cream`}>{title}</h2>
    </Shell>
  )
}

// Dark secondary button as used on product pages: #1E0F00 frame, panel inner, 10px 24px.
export function ProductDarkButton({ label, href }) {
  return <DarkButton label={label} href={href} bg="bg-card-dark" inner="bg-panel" pad="px-6" />
}

// Product hero (§1.4A).
// props: title (string, split per word), lead, primary {label, href}, secondary {label, href},
//        image (right column), barGraphic (58x12 graphic in the top bar)
export function ProductHero({ title, lead, primary, secondary, image, barGraphic }) {
  return (
    <Shell as="section">
      <DeepBar graphic={barGraphic} />
      <div className="flex flex-col lg:h-[592px] lg:flex-row">
        <div className="relative lg:w-[644px] lg:shrink-0">
          <img src={HERO_LEFT} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <img src={HERO_CORNER} alt="" className="absolute left-0 top-0 h-[72px] w-12" />
          <div className="relative flex h-full flex-col justify-center gap-[15px] px-8 py-16">
            <AppearText
              as="h1"
              split="word"
              className="font-display text-[48px] leading-[48px] tracking-[-1.92px] text-cream"
            >
              {title}
            </AppearText>
            <div className="opacity-[0.64]">
              <AppearText delay={70} className="font-display text-[21px] leading-[29.4px] tracking-[-0.84px] text-cream">
                {lead}
              </AppearText>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <BigButton label={primary.label} href={primary.href} />
              <ProductDarkButton label={secondary.label} href={secondary.href} />
            </div>
          </div>
        </div>
        <div className="h-[360px] p-3 lg:h-auto lg:flex-1">
          <img src={image} alt="" className="h-full w-full object-cover" />
        </div>
      </div>
    </Shell>
  )
}

// Full-bleed image cards (§1.4C).
// props: cards [{ image, icon, title, body }], cols (lg grid class)
export function ImageCardGrid({ cards, cols = 'lg:grid-cols-4' }) {
  return (
    <Shell inner={`grid grid-cols-1 ${cols}`}>
      {cards.map((c) => (
        <div key={c.title} className="hairline relative flex h-[300px] flex-col justify-between overflow-hidden p-6">
          <img src={c.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <img src={c.icon} alt="" className="relative h-16 w-16" />
          <div className="relative flex flex-col gap-2">
            <h3 className="font-mono text-[18px] font-bold leading-[18.2px] text-cream">{c.title}</h3>
            <div className="opacity-[0.64]">
              <AppearText className="font-display text-[16px] leading-[22.4px] tracking-[-0.64px] text-cream">
                {c.body}
              </AppearText>
            </div>
          </div>
        </div>
      ))}
    </Shell>
  )
}

// Closing image CTA (§2.8, §4.7).
// props: title, body (optional), primary {label, href}, secondary {label, href}, image
// Content pages' "Two products" band (specs/content.md §0.2B) reuses this with:
//   arrow={false} (label-only primary), textClass (text group width/gap), titleClass, bodyClass.
export function ImageCTA({
  title,
  body,
  primary,
  secondary,
  image = A('tares/h0ej46NDlXvCksM6LvlI4w4Ss.jpg'),
  arrow = true,
  textClass = 'max-w-[420px] gap-2',
  titleClass = '',
  bodyClass = 't-body opacity-80',
}) {
  return (
    <Shell>
      <div className="relative overflow-hidden">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="relative flex max-w-[896px] flex-col gap-16 px-8 py-16 lg:px-[128px]">
          <div className={`flex flex-col ${textClass}`}>
            <h2 className={`font-display text-[42px] leading-[42px] text-cream md:text-[40px] md:leading-[40px] ${titleClass}`}>{title}</h2>
            {body && <p className={bodyClass}>{body}</p>}
          </div>
          <div className="flex flex-col items-start gap-2 md:flex-row">
            <BigButton label={primary.label} href={primary.href} arrow={arrow} />
            <ProductDarkButton label={secondary.label} href={secondary.href} />
          </div>
        </div>
      </div>
    </Shell>
  )
}
