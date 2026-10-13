import { A, SVG, Shell } from './ui.jsx'

const QUOTE = (
  <>
    …data is not just an asset but a fundamental building block to a company's success. It’s
    through this vital resource that systems and teams learn, adapt, innovate, and provide
    unprecedented value, driving efficiencies and creating new opportunities.{' '}
    <br />
    GlassFlow offers the tools to harness this data for AI.”
  </>
)
const PERSON = { avatar: A('es2dJiMp9kbISeoLCrGX80lfk.webp'), name: 'Thomas Dohmke', role: 'Co-founder & CEO' }
const COMPANY = { logo: A('19uBUx6oMukcPigAH32CECUiCOU.jpg'), label: 'Entire', alt: '' }

// quote / person / company: product pages (specs/products.md §3.3). `compact` is the /rius
// variant: 40px padding on the quote area (21px quote on mobile) and both attribution halves centred.
// bare: render without the Shell wrapper (case-study quote card inside the 716px article column).
// bleed (/rius only, with compact): full-bleed at tablet (no 32px gutters), 26px quote at tablet,
// and the attribution text never wraps (the live name overflows its 40px padding at 390).
export default function Testimonial({ quote = QUOTE, person = PERSON, company = COMPANY, compact = false, bare = false, bleed = false }) {
  const Wrap = bare ? 'div' : Shell
  const wrapProps = bare ? { className: 'bg-panel' } : { inner: 'bg-panel', ...(bleed ? { className: 'md:!px-0 lg:!px-16' } : {}) }
  return (
    <Wrap {...wrapProps}>
      <div className="relative">
        <img
          src={A('7xhczrFmZXWm4XtTt3xdK5HjPSc.jpg')}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className={`relative flex flex-col gap-8 ${compact ? 'p-10' : 'p-8 md:p-16'}`}>
          <img src={SVG('quote')} alt="" className="h-[34px] w-[34px]" />
          <blockquote
            className={`max-w-[800px] font-display text-cream ${
              compact
                ? bleed
                  ? 'text-[21px] leading-[21px] md:text-[26px] md:leading-[26px] lg:text-[32px] lg:leading-[32px]'
                  : 'text-[21px] leading-[21px] md:text-[32px] md:leading-[32px]'
                : 'text-[32px] leading-[32px]'
            }`}
          >
            {quote}
          </blockquote>
        </div>
      </div>
      <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
        <div
          className={`hairline flex h-[100px] items-center gap-2 ${
            compact ? 'justify-center px-3 md:px-10' : 'px-6 lg:px-[117px]'
          }`}
        >
          <img src={person.avatar} alt={person.name} className="h-12 w-12 object-cover" />
          <div className={`flex flex-col gap-1 font-mono text-[16px] font-bold leading-[18.2px] ${bleed ? 'whitespace-nowrap' : ''}`}>
            <span className="text-white">{person.name}</span>
            <span className="text-cream opacity-80">{person.role}</span>
          </div>
        </div>
        <div
          className={`hairline flex h-[100px] items-center gap-2 ${
            compact ? 'justify-center px-3 md:px-10' : 'px-6 lg:justify-center lg:px-[117px]'
          }`}
        >
          <img src={company.logo} alt={company.alt ?? ''} className="h-12 w-12 object-cover" />
          {company.label && (
            <span className="font-mono text-[16px] font-bold leading-[18.2px] text-cream opacity-80">{company.label}</span>
          )}
        </div>
      </div>
    </Wrap>
  )
}
