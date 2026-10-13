// /rius/pricing, also the /enterprise redirect target (specs/products.md §4)
import { useEffect } from 'react'
import AppearText from '../components/AppearText.jsx'
import ComparisonTable from '../components/ComparisonTable.jsx'
import Faq from '../components/Faq.jsx'
import { DeepBar, ImageCTA } from '../components/ProductSections.jsx'
import { A, Shell, Spacer, TitleBar, BigButton } from '../components/ui.jsx'

const P = (f) => A(`rius-pricing/${f}`)
const SIGNUP = (plan) =>
  `https://console.rius-glassflow.com/signup?utm_source=glassflow&utm_medium=pricing_page&utm_campaign=signup&utm_content=${plan}`
const HP_SIGNUP = 'https://console.rius-glassflow.com/signup?utm_source=framer.com&utm_medium=referral&utm_campaign=hp_start_cta'
const DOCS_QS = 'https://docs.glassflow.ai/rius/quickstart'
export const CALCULATOR_PATH = '/rius/calculator-building-your-own-agent-observability'

const ICONS = { check: P('check.svg'), minus: P('minus.svg') }
const Y = ICONS.check
// The live table renders a dimmed minus glyph (stroke #96785A) in these cells, not a check.
const N = ICONS.minus

const PLANS = [
  { name: 'Core', icon: P('plan-core.svg'), price: '19', cta: { label: 'get started', href: SIGNUP('core') } },
  { name: 'Growth', icon: P('plan-growth.svg'), price: '79', highlight: true, cta: { label: 'get started', href: SIGNUP('growth') } },
  { name: 'Pro', icon: P('plan-pro.svg'), price: '199', cta: { label: 'get started', href: SIGNUP('pro') } },
  {
    name: 'Enterprise',
    icon: P('plan-enterprise.svg'),
    price: '1999',
    cta: {
      label: 'contact us',
      href: 'https://cal.com/armend-glassflow/30min?utm_source=glassflow&utm_medium=pricing_page&utm_campaign=signup&utm_content=enterprise',
    },
  },
]

// live values kept verbatim (they disagree with /rius §3.9, e.g. Enterprise overage $4 vs $8)
const ROWS = [
  { label: 'Spans incl.', values: ['500k', '2.5M', '10M', '25M'] },
  { label: 'Overage per 1M spans', values: ['$14', '$12', '$10', '$4'] },
  { label: 'Query retention', values: ['60d', '180d', '3y', 'Custom'] },
  { label: 'Audit logs', values: [N, N, '1y', 'Custom'] },
  { label: 'Ingestion throughput', values: ['5k/min', '10k/min', '20k/min', 'Custom'] },
  { label: 'Heartbeat', values: [Y, Y, Y, Y] },
  { label: 'RCAs / month', values: [Y, Y, Y, Y] },
  { label: 'Query MCP', values: [Y, Y, Y, Y] },
  { label: 'Alerts', values: ['10', '25', '100', '500'] },
  { label: 'Workspaces', values: ['2', '5', 'Unlimited', 'Unlimited'] },
  { label: 'Users', values: ['2', 'Unlimited', 'Unlimited', 'Unlimited'] },
  { label: 'Data region', values: ['EU/US', 'EU/US', 'EU/US', 'Select your own'] },
  { band: 'SUPPORT' },
  { label: 'SLA', values: ['Add-on', 'Add-on', 'Add-on', Y] },
  { label: 'Onboarding', values: [N, N, N, Y] },
  { label: 'Support response', values: ['48h/Chat', '48h/Chat', '24h/Chat', 'Custom'] },
  { label: 'Dedicated Slack', values: ['Add-on', 'Add-on', Y, Y] },
  { band: 'BILLING' },
  { label: 'Credit Card', values: [Y, Y, Y, Y] },
  { label: 'Pay via invoice (30d net)', values: ['Add-on', 'Add-on', 'Add-on', Y] },
  { label: 'Contract duration', values: ['Monthly', 'Monthly', 'Monthly', 'Yearly'] },
]

const EVERY_PLAN = [
  ['Real-time traces and spans', 'Dashboards', 'Agent workflow maps', 'OpenTelemetry ingest in two lines'],
  ['Alerts', 'Cost and token tracking', 'One continuous session across restarts and sub-agents'],
]

const ADDONS = [
  ['Dedicated region', '199', 'Your data in a specific regional cluster — Frankfurt, Virginia, London, Singapore', DOCS_QS],
  ['Dedicated slack', '49', 'Direct channel with GlassFlow team', HP_SIGNUP],
  ['Pay by invoice', '49', 'Net 30 invoicing instead of credit card', DOCS_QS],
  ['Extened retention', '49', 'Add 1 year beyond your tier limit', DOCS_QS],
  ['Audit logs', '49', 'Add 1 year beyond your tier limit', DOCS_QS],
  ['SLA guarantee', '299', '99.9% uptime SLA with response commitments', DOCS_QS],
  ['Higher ingestion throughput', '49', 'Increase to 20k/min', DOCS_QS],
]

const FAQS = [
  ['What counts as a trace?', 'One agent run, regardless of how many steps, tool calls, or sub-agents it contains.'],
  ['What happens if I exceed my included traces?', 'You’re billed per additional trace at your plan’s overage rate: $7 on Core, $6 on Growth, $5 on Pro, and $4 on Enterprise. Nothing stops working. You will get notified by email once you reach 80% of your plan’s trace capacity so you can take any necessary action.'],
  ['Do you charge per seat?', 'No. Pricing is based on traces, not users. Invite your whole team on any plan.'],
  ['What\'s the difference between "ingest only" and "both ways"?', 'Ingest only sends traces into GlassFlow. Both ways also lets your coding agent query those traces over MCP. Ask what broke and ship the fix from your editor. Available on all plans.'],
  ['What happens to traces after my retention period?', 'On Core, traces stay queryable for six months, on Growth for 180 days, on Pro for 3 years while on Enterprise plans, retention is custom. You can purchase an extended retention period that adds 1 year beyond your tier limit as an add-on.'],
  ['Can I change plans anytime?', 'Yes, up or down. Changes take effect on your next billing cycle.'],
]

function Hero() {
  return (
    <Shell as="section">
      <TitleBar label="products" hideLabel />
      <div className="grid grid-cols-1 lg:h-[439px] lg:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-16 bg-panel p-8 text-center md:p-16">
          <div className="flex flex-col items-center gap-[6px]">
            <h1 className="font-display text-[32px] leading-[32px] text-cream md:text-[48px] md:leading-[48px]">
              Easy to start. <br />
              Scales with usage.
            </h1>
            <p className="font-display text-[21px] leading-[31.5px] tracking-[-0.18px] text-cream opacity-80">
              Four plans, priced per trace, not per seat. <br className="hidden md:inline" />
              Start free, pay for what you actually send.
            </p>
          </div>
          <div className="flex flex-col items-center gap-[6px]">
            <BigButton label="start free" href={HP_SIGNUP} />
            <p className="t-body text-[16px] opacity-80">No credit card required on Core</p>
          </div>
        </div>
        <img src={P('JNirgiJudYykrpH4soF4CcOqbI.jpg')} alt="" className="h-[400px] w-full object-cover lg:h-full" />
      </div>
    </Shell>
  )
}

function EveryPlan() {
  return (
    <Shell as="section">
      <div className="hairline flex h-[38px] items-center bg-table-band px-5 py-3 font-mono text-[14px] font-bold leading-[14px] text-cream">
        In every plan
      </div>
      <div className="grid grid-cols-1 bg-card-dark lg:grid-cols-2">
        {EVERY_PLAN.map((col, i) => (
          <ul key={i} className="flex flex-col">
            {col.map((t) => (
              <li key={t} className="flex min-h-[72px] items-center gap-2 px-6 py-3">
                <img src={A('rius/benefit.svg')} alt="" className="h-6 w-6 shrink-0" />
                <span className="t-mono text-cream">{t}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </Shell>
  )
}

function AddOns() {
  return (
    <Shell as="section">
      <DeepBar />
      <div className="grid grid-cols-1 bg-card-dark lg:h-[642px] lg:grid-cols-[394px_1fr]">
        <div className="relative flex h-[120px] items-center overflow-hidden px-8 lg:h-auto lg:items-start lg:pt-[317px]">
          <img src={A('rius/CF2a8yg6rUJQ9kRH8Qk75fHGhhk.jpg')} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <h2 className="relative font-display text-[40px] leading-[40px] tracking-[-1.6px] text-cream">Add-ons</h2>
        </div>
        <div className="flex gap-1 overflow-x-auto p-1 lg:grid lg:grid-cols-4 lg:grid-rows-[315px_293px] lg:overflow-visible">
          {ADDONS.map(([name, price, desc, href], i) => (
            <div key={name} className="hairline flex w-[240px] shrink-0 flex-col items-center text-center lg:w-auto">
              <div className="flex flex-1 flex-col items-center gap-4 px-4 py-5">
                <img src={P(`addon-${i + 1}.svg`)} alt="" className="h-10 w-10" />
                <span className="font-display text-[14px] leading-[16.8px] text-cream">{name}</span>
                <span className="flex items-baseline font-display text-cream">
                  <span className="text-[32px] leading-[48px]">${price}</span>
                  <span className="text-[16px] leading-[24px]">/mo</span>
                </span>
                <AppearText className="max-w-[143px] font-display text-[14px] leading-[19.6px] tracking-[-0.56px] text-cream">
                  {desc}
                </AppearText>
              </div>
              <a href={href} className="flex h-[52px] w-full bg-deep p-1">
                <span className="t-btn flex h-[44px] w-full items-center justify-center bg-panel px-3 py-[10px] text-cream">
                  Add to your plan
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}

function CalculatorBanner() {
  return (
    <Shell as="section">
      <div className="relative flex h-[450px] items-center justify-center overflow-hidden px-8">
        <img src={P('VKjI50ZtcspgwHCXdPDhyKc3A0.png')} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="relative flex max-w-[326px] flex-col items-center gap-6 text-center md:max-w-[990px]">
          <a href={CALCULATOR_PATH} className="font-display text-[32px] font-medium leading-[32px] text-white">
            Think building your own observability is cheaper?
          </a>
          <a href={CALCULATOR_PATH} className="font-display text-[24px] font-semibold leading-[36px] tracking-[-0.18px] text-white">
            Most teams underestimate the real cost. <br className="hidden md:inline" />
            Plug in your trace volume and team, and find out in 30 seconds.
          </a>
          <BigButton label="Calculate my cost" href={CALCULATOR_PATH} />
        </div>
      </div>
    </Shell>
  )
}

export default function RiusPricing() {
  useEffect(() => {
    document.title = 'GlassFlow Rius Pricing | Agent Observability from $0'
  }, [])
  return (
    <>
      <Spacer inner="h-[30px]" />
      <Hero />
      <Spacer />
      <ComparisonTable plans={PLANS} rows={ROWS} icons={ICONS} />
      <Spacer />
      <EveryPlan />
      <Spacer />
      <AddOns />
      <Spacer />
      <CalculatorBanner />
      <Spacer />
      <Faq items={FAQS} inset />
      <Spacer />
      <ImageCTA
        title="Two products. Two starting points."
        body="Tares is open source. Kick the tires, open an issue, and drop a star if it's useful. Rius, end to end. Guides for wiring up traces, MCP, and retention, from first span to production."
        primary={{ label: 'start today', href: SIGNUP('core') }}
        secondary={{ label: 'read the Rius guides', href: 'https://docs.glassflow.ai/rius/guides' }}
      />
    </>
  )
}
