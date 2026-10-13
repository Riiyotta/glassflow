import TextRollButton from './TextRollButton.jsx'
import { Shell } from './ui.jsx'

// Plan comparison table (specs/products.md §4.2).
// props:
//   plans [{ name, icon, price, cta: { label, href }, highlight? }]   (highlighted column is #1E0F00)
//   rows  [{ label, values: [..] } | { band: 'SUPPORT' }]
//         value: string, or icons.check / icons.minus (rendered as 18x18 images)
//   icons { check, minus } image urls
// Desktop: 200 + 4 x 278. Below lg: 160 + 4 x 140 inside a horizontal scroller.
const COLS = 'grid-cols-[160px_repeat(4,140px)] lg:grid-cols-[200px_repeat(4,278px)]'

export default function ComparisonTable({ plans, rows, icons }) {
  const hi = (i) => (plans[i].highlight ? 'bg-card-dark' : '')
  const value = (v) =>
    v === icons.check || v === icons.minus ? <img src={v} alt={v === icons.check ? 'included' : 'not included'} className="h-[18px] w-[18px]" /> : v
  return (
    <Shell inner="overflow-x-auto">
      <div className={`grid w-max ${COLS}`}>
        {/* header */}
        <div className="hairline" />
        {plans.map((p, i) => (
          <div key={p.name} className={`hairline flex flex-col gap-4 p-5 ${hi(i)}`}>
            <img src={p.icon} alt="" className="h-10 w-10" />
            <span className="font-display text-[16px] leading-[19.2px] text-cream">{p.name}</span>
            <span className="flex flex-wrap items-baseline font-display text-cream">
              <span className="text-[32px] leading-[48px] tracking-[-0.18px]">${p.price}</span>
              <span className="text-[16px] leading-[24px]">/mo</span>
            </span>
          </div>
        ))}
        {/* CTA row */}
        <div className="hairline" />
        {plans.map((p, i) => (
          <div key={p.name} className={`hairline ${hi(i)}`}>
            <TextRollButton
              label={p.cta.label}
              href={p.cta.href}
              frame={p.highlight ? 'bg-amber' : 'bg-card-dark'}
              fill={p.highlight ? 'bg-amber text-card-dark' : 'bg-card-dark text-cream'}
              pad="px-2 lg:px-6"
            />
          </div>
        ))}
        {rows.map((r) =>
          r.band ? (
            <div key={r.band} className="hairline col-span-5 flex h-[38px] items-center bg-table-band px-5 py-3 font-mono text-[14px] font-bold leading-[14px] text-cream">
              {r.band}
            </div>
          ) : (
            <Row key={r.label} r={r} hi={hi} value={value} />
          ),
        )}
      </div>
    </Shell>
  )
}

function Row({ r, hi, value }) {
  return (
    <>
      <div className="hairline flex items-center p-3 font-mono text-[14px] font-bold leading-[16.8px] tracking-[-0.18px] text-cream">
        {r.label}
      </div>
      {r.values.map((v, i) => (
        <div
          key={i}
          className={`hairline flex items-center justify-center p-3 text-center font-display text-[16px] font-medium leading-[24px] tracking-[-0.18px] text-cream ${hi(i)}`}
        >
          {value(v)}
        </div>
      ))}
    </>
  )
}
