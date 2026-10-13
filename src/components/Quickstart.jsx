import { A, Shell, Dots } from './ui.jsx'

export const QUICKSTART_CARDS = [
  {
    name: 'rius',
    pitchW: 'lg:max-w-[345px]',
    ring: 'ring-in-5',
    pitch: ['See your first agent run appear live.', 'Drop in the OTEL receiver, run your agent, and watch the trace stream in.'],
    bullets: [
      ['Long-running agents:', 'trace hours-long runs, lose nothing'],
      ['MCP both ways:', 'agents send traces; coding agents query back'],
      ['Replay any run:', 'reconstruct what happened last week'],
    ],
    docs: ['open the rius quickstart', 'https://docs.glassflow.ai/rius/quickstart'],
    start: ['Start with rius', 'https://console.rius-glassflow.com/signup?utm_source=framer.com&utm_medium=referral&utm_campaign=hp_start_cta'],
  },
  {
    name: 'tares',
    pitchW: 'md:max-w-[345px]',
    ring: 'ring-in-4',
    pitch: ['Deliver your first correlated data package. Install, connect your sources, and serve one clean read to an agent.'],
    bullets: [
      ['Cut token spend:', 'one clean read, not dozens of tool calls'],
      ['Kill latency:', "data's ready before the agent asks"],
      ['One connection:', 'all your sources, unified'],
    ],
    docs: ['open the tares quickstart', 'https://docs.glassflow.ai/tares/quickstart'],
    start: ['Start with tares', 'https://console.tares-glassflow.com/?utm_source=button&utm_medium=website&utm_campaign=hp_start_cta'],
  },
]

function Card({ c }) {
  return (
    <div className="flex w-full flex-col md:w-[490px]">
      {/* title bar: dots at 14/18; label centred on mobile, text at x+180 from tablet up */}
      <div className="hairline relative h-[42px] bg-bar">
        <Dots className="absolute left-[14px] top-[18px]" />
        <span className="t-mono absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap md:left-[180px] md:translate-x-0">
          <span className="text-cream-64">glassflow-</span>
          <span className="text-amber">{c.name}</span>
        </span>
      </div>
      <div className="hairline flex flex-col items-center justify-center bg-panel p-4 md:min-h-[87px]">
        <p className={`t-mono text-center text-amber ${c.pitchW}`}>
          {c.pitch.map((l, i) => (
            <span key={i} className="md:block">
              {l}
              {i < c.pitch.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
      </div>
      <div className="hairline bg-deep p-4">
        <ul className="flex flex-col gap-4">
          {c.bullets.map(([label, text]) => (
            <li key={label} className="flex items-center gap-[21px] text-cream">
              <span className="t-mono opacity-[0.24]">&gt;</span>
              <span className="flex flex-col gap-[2px]">
                <span className="t-mono">{label}</span>
                <span className="font-mono text-[12px] leading-[18.2px]">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="hairline-2 flex flex-col gap-2 bg-deep p-1">
        <a href={c.docs[1]} className="hairline flex h-[44px] items-center justify-center bg-panel px-3 font-mono text-[14px] font-medium leading-[24px] tracking-[-0.32px] text-cream">
          <span className="opacity-90">{c.docs[0]}</span>
        </a>
        {c.start && <a href={c.start[1]} className={`${c.ring} flex h-[44px] items-center justify-center bg-amber px-3 font-mono text-[14px] font-bold leading-[24px] tracking-[-0.32px] text-btn-ink`}>
          <span className="opacity-90">{c.start[0]}</span>
        </a>}
      </div>
    </div>
  )
}

const HEADING = (
  <>
    From install to <span className="text-amber">first result</span> in minutes.
  </>
)
const SUB = [
  'Pick a product and follow the quickstart.',
  'Both are copy-paste and run on your own machine, no waitlist. Up and running in minutes.',
]

// heading / sub (one <p> per line) / cards: product pages (specs/products.md §3.8).
// A card's `start` button is optional.
// children: replaces the product cards row with custom cards on the same section frame
// (/contact calendar, /about "Discover more"; specs/content.md §0.1). An empty `sub` renders no sub block.
export default function Quickstart({ heading = HEADING, sub = SUB, cards = QUICKSTART_CARDS, id = 'quickstart', children }) {
  return (
    <Shell id={id}>
      <div className="relative overflow-hidden">
        <img src={A('ARgMqlYnmiFWpdywy7EoO9FO9vI.png')} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="relative flex flex-col items-center justify-center gap-8 px-6 py-16">
          <div className="flex max-w-[440px] flex-col items-center gap-[19px] text-center">
            <h2 className="font-display text-[40px] leading-[40px] text-cream">{heading}</h2>
            {sub.length > 0 && (
              <div className="t-body opacity-80">
                {sub.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </div>
            )}
          </div>
          {children ?? (
            <div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row lg:items-stretch">
              {cards.map((c) => (
                <Card key={c.name} c={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Shell>
  )
}
