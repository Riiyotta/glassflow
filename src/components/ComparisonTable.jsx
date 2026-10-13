import TextRollButton from './TextRollButton.jsx'
import { Shell } from './ui.jsx'

// Plan comparison table (specs/products.md §4.2).
// props:
//   plans [{ name, icon, price, cta: { label, href }, highlight? }]   (highlighted column is #1E0F00)
//   rows  [{ label, values: [..] } | { band: 'SUPPORT' }]
//         value: string, or icons.check / icons.minus (rendered as 18x18 images)
//   icons { check, minus } image urls
// Live structure (measured at 1440 / 810 / 390): a stack of row groups, each a flex row that
// overflows the scroller; the header is one 216px block per plan (20px padded icon + name/price,
// then the 52px CTA), with an empty label cell beside it.
// Column widths: label 160 / 200 / 200, plans 140 / 160 / 278.
// Cell padding: label 20 below lg, 12 at lg; values 32 at 390, 40 at 810, 12 at lg
// (rows 88 / 104 / 48 tall, 82 / 98 / 42 for icon rows).
const LABEL_W = 'w-[160px] md:w-[200px]'
const PLAN_W = 'w-[140px] md:w-[160px] lg:w-[278px]'

export default function ComparisonTable({ plans, rows, icons }) {
  const hi = (i) => (plans[i].highlight ? 'bg-card-dark' : '')
  const value = (v) =>
    v === icons.check || v === icons.minus ? <img src={v} alt={v === icons.check ? 'included' : 'not included'} className="h-[18px] w-[18px]" /> : v
  return (
    <Shell inner="overflow-x-auto">
      <div className="flex w-max min-w-full flex-col">
        {/* header */}
        <div className="flex">
          <div className={`hairline shrink-0 ${LABEL_W}`} />
          {plans.map((p, i) => (
            <div key={p.name} className={`hairline flex shrink-0 flex-col ${PLAN_W} ${hi(i)}`}>
              <div className="flex flex-col gap-4 p-5">
                <img src={p.icon} alt="" className="h-10 w-10" />
                <div className="flex flex-col">
                  <span className="font-display text-[16px] leading-[19.2px] text-cream">{p.name}</span>
                  <span className="flex items-center gap-1 whitespace-nowrap font-display text-cream">
                    <span className="text-[32px] leading-[48px] tracking-[-0.18px]">${p.price}</span>
                    <span className="text-[16px] leading-[24px] opacity-80">/mo</span>
                  </span>
                </div>
              </div>
              <TextRollButton
                label={p.cta.label}
                href={p.cta.href}
                frame={p.highlight ? 'bg-amber' : 'bg-card-dark'}
                fill={p.highlight ? 'bg-amber text-card-dark' : 'bg-card-dark text-cream'}
                pad="px-2 lg:px-6"
              />
            </div>
          ))}
        </div>
        {rows.map((r) =>
          r.band ? (
            <div key={r.band} className="hairline flex h-[38px] items-center bg-table-band px-5 py-3 font-mono text-[14px] font-bold leading-[14px] text-cream">
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
    <div className="flex">
      <div
        className={`hairline flex shrink-0 items-center p-5 font-mono text-[14px] font-bold leading-[16.8px] tracking-[-0.18px] text-cream lg:p-3 ${LABEL_W}`}
      >
        {r.label}
      </div>
      {r.values.map((v, i) => (
        <div
          key={i}
          className={`hairline flex shrink-0 items-center justify-center whitespace-nowrap p-8 text-center font-display text-[16px] font-medium leading-[24px] tracking-[-0.18px] text-cream md:p-10 lg:p-3 ${PLAN_W} ${hi(i)}`}
        >
          {value(v)}
        </div>
      ))}
    </div>
  )
}
