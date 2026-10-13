import { DeepBar } from './ProductSections.jsx'
import { Shell } from './ui.jsx'

// Rius plan cards (specs/products.md §3.9): 4 flush cards on #1E0F00.
// props: plans [{ name, icon, price, description, promo?, cta: { label, href }, highlight?, specs: [[label, value]] }]
export default function PlanCards({ plans }) {
  return (
    <Shell inner="grid grid-cols-1 lg:grid-cols-4">
      {plans.map((p) => (
        <div key={p.name} className="hairline flex flex-col bg-card-dark">
          <DeepBar />
          <div className="flex flex-1 flex-col gap-4 px-4 py-5">
            <img src={p.icon} alt="" className="h-10 w-10" />
            <h3 className="font-display text-[24px] leading-[24px] text-cream">{p.name}</h3>
            <p className="flex items-baseline text-cream">
              <span className="font-display text-[32px] leading-[32px]">{p.price}</span>
              <span className="font-mono text-[16px] leading-[24px]">/mo</span>
            </p>
            <p className="font-display text-[14px] leading-[19.6px] text-cream">{p.description}</p>
            {p.promo && (
              <span className="flex h-8 items-center bg-promo px-2 py-1 font-mono text-[14px] font-bold lowercase leading-[24px] tracking-[-0.32px] text-white">
                {p.promo}
              </span>
            )}
          </div>
          <a href={p.cta.href} className={`flex h-[52px] p-1 ${p.highlight ? 'bg-amber' : 'bg-deep'}`}>
            <span
              className={`t-btn flex h-[44px] w-full items-center justify-center px-3 ${
                p.highlight ? 'bg-amber text-card-dark' : 'bg-panel text-cream'
              }`}
            >
              {p.cta.label}
            </span>
          </a>
          {p.specs.map(([label, value]) => (
            <div key={label} className="hairline flex h-16 items-center justify-between gap-2 p-5">
              <span className="font-mono text-[14px] font-medium lowercase leading-[19.6px] tracking-[-0.32px] text-cream">
                {label}
              </span>
              <span className="bg-page px-1 font-mono text-[14px] font-bold lowercase leading-[24px] text-white">{value}</span>
            </div>
          ))}
        </div>
      ))}
    </Shell>
  )
}
