// /rius (specs/products.md §3)
import { useEffect } from 'react'
import AppearText from '../components/AppearText.jsx'
import BlogCard from '../components/BlogCard.jsx'
import Faq from '../components/Faq.jsx'
import LottiePlayer from '../components/LottiePlayer.jsx'
import PlanCards from '../components/PlanCards.jsx'
import Quickstart, { QUICKSTART_CARDS } from '../components/Quickstart.jsx'
import Testimonial from '../components/Testimonial.jsx'
import { ProductHero, TitleRow, ImageCardGrid, DeepBar } from '../components/ProductSections.jsx'
import { A, Shell, Spacer } from '../components/ui.jsx'

const R = (f) => A(`rius/${f}`)
const DOCS_QS = 'https://docs.glassflow.ai/rius/quickstart'

const BENEFITS = ['Long-running agents', 'Query via MCP', 'Privacy Controls', 'Collab with your team']

const LOGOS = [
  { label: 'Used by:', logos: [['restack', 'Restack', 66, 28], ['nubrain', 'nubrain', 93, 21], ['sentri', 'Sentri', 120, 16]] },
  { label: 'Backed by CEOs of:', logos: [['entire', 'Entire', 100, 25], ['weaviate', 'Weaviate', 122, 18], ['sference', 'sference', 92, 18]] },
]

export const RIUS_QUOTE = '"Rius found agent failures we didn\'t know existed. Our time to debug went from days to minutes and now we catch issues before they ever reach a customer."'

// Retrospective body: the spec gives an outline only (§3.4); rendered as that outline.
const RETRO = [
  'Most tools give you a post-mortem after the trace closes.',
  'That is fine for two-second runs, and useless for six-hour ones.',
  'An agent diverges at step 7, burns tokens for 180 more steps and returns a wrong answer at hour six.',
  'The failure took seconds. Finding it took a day.',
]

const AGENTS = [
  { icon: 'agents-short', label: 'Short:', how: ['Typically running for ', 'seconds', ''], what: 'Chat turns, classifiers, RAG lookups.' },
  { icon: 'agents-mid', minH: 'lg:min-h-[107px]', label: 'Mid:', how: ['Usually run for ', 'minutes', ''], what: 'A content agent drafting a post. An incident summarizer. A nightly sync.' },
  { icon: 'agents-long', label: 'Long:', how: ['Agents that can run for ', 'hours', ''], what: 'Hour-long calls transcribed and reasoned over. Thousand-page document sets. Deep research that plans, retrieves, verifies,. Optimization loops.' },
  { icon: 'agents-always', minH: 'lg:min-h-[96px]', label: 'Always-on:', how: ['Agents that run ', 'indefinitely', 'or are always-on'], what: 'Infra monitors. Ops agents. Live queues that never close.' },
]

const HOW = [
  { image: R('i3v7FwXRVHAclAvgY9c6xaZNKOg.jpg'), icon: R('how-instrument.svg'), title: 'Instrument', body: <>two OpenTelemetry lines. <br />Every step streams in as it happens.</> },
  { image: R('iCcMvtgsRs2G4yPcJQcjES1s.jpg'), icon: R('how-watch.svg'), title: 'Watch', body: 'live traces, open-trace metrics, heartbeat detection, alerts mid-run.' },
  { image: R('hfNqoTWQ35URgwfQOvzzyJFpR1I.jpg'), icon: R('how-act.svg'), title: 'Act', body: 'query from your coding agent over MCP, find the first divergence, ship the fix.' },
]

const FEATURES = [
  { title: 'Long-running agents', text: 'One session across restarts and sub-agents, not thousands of disconnected requests.', image: R('ypPPtAmKs7GN5EUUsnZFHaup5fU.png') },
  { title: 'Query via MCP', text: <>Your coding agent queries traces over MCP <br />and ships the fix. No dashboard.</>, image: R('C30wyrelJdoqD8SJLxqY6WaUMQ.png') },
  { title: 'Privacy Controls', text: 'Strip or mask sensitive content in your own process, so PII never reaches our backend.', image: R('RO233ORpmhdwm5ELT37gnlWU3Y.png') },
  { title: 'Collab with your team', text: 'Share a window of traces with anyone. They see metadata and rollups. No login or seat required', image: R('VE4uzuRtCj4sgehabFjku1AR1k.png') },
]

const PLANS = [
  { name: 'Core', icon: R('plan-core.svg'), price: '$19', description: 'Observe your first agents and send traces in minutes.', promo: 'try 1 month for free', specs: [['spans incl', '500k'], ['overage per 1m spans', '$14'], ['query retention', '60d']] },
  { name: 'Growth', icon: R('plan-growth.svg'), price: '$79', highlight: true, description: 'Add more agents and bring the whole team onto one view.', specs: [['spans incl.', '2.5m'], ['overage per 1m spans', '$12'], ['query retention', '180d']] },
  { name: 'Pro', icon: R('plan-pro.svg'), price: '$199', description: 'Scale to production with the retention and audit trail your SLAs demand.', specs: [['spans incl.', '10m'], ['overage per 1m spans', '$10'], ['query retention', '3y']] },
  { name: 'Enterprise', icon: R('plan-enterprise.svg'), price: '$1,999', description: 'Make agent observability a governed part of your stack.', cta: 'get in touch', specs: [['spans incl.', '25m'], ['overage per 1m spans', '$8'], ['query retention', 'custom']] },
].map((p) => ({ ...p, cta: { label: p.cta || 'get started', href: DOCS_QS } }))

export const BLOG_POSTS = [
  {
    href: '/blog/decision-model-vs-llm',
    image: R('mFirefQhQKw3QXF3cpXhF7l4sLw.png'),
    tag: 'AGENT INFRASTRUCTURE',
    title: 'Can a decision model replace an LLM? Tune it on your own data first',
    description: "We ran Cloudflare's Clef-flash next to Claude Haiku for 6 days on production logs. As a filter, it cut LLM calls ~80%. Test it on your own data with Tares.",
    author: 'Ashish Bagri',
  },
  {
    href: '/blog/how-to-detect-ai-agent-failures-in-production',
    image: R('DK46aveL39yduU5qMbUqGPAWoI.png'),
    tag: 'AGENT OBSERVABILITY',
    title: 'How to detect silent AI agent failures in production',
    description: 'Fifteen signals and a five-stage framework for detecting silent AI agent failures while runs are still running',
    author: 'Armend Avdijaj',
  },
]

// Answers 1-3: the spec gives outlines only (§3.12); rendered as those outlines.
const FAQS = [
  ['Why do I need an observability layer for my agents?', 'Agents fail differently from APIs. A run can spend 40 minutes and $12 and still be wrong, or crash at step 190 with its spans lost in memory.'],
  [
    'Why should I not use an open source solution?',
    'You can, but total cost matters. For a 3-15 person startup, maintaining OSS observability ($400-$800/mo) costs shipping time. Read more about the effort to self-host solutions here.',
  ],
  [
    'Why should I not vibe code a solution?',
    'A Postgres table plus a generated dashboard breaks on crashes, scale or audit needs. The hidden cost is 40-80h to build and 3-5h/mo to maintain (~$400-$500/mo). The  Rius Core plan gives you everything...',
  ],
  ['What happens when an agent crashes mid-run?', 'Nothing is lost. Every span streams in real time, not on a timer flush at trace close. A run that dies at hour six is still fully queryable. You simply reconstruct exactly what it did before it went down, instead of finding a trace that never closed.'],
]

function Benefits() {
  return (
    <Shell inner="grid grid-cols-1 bg-card-dark lg:grid-cols-4">
      {BENEFITS.map((b) => (
        <div key={b} className="flex h-[72px] items-center justify-center gap-2">
          <img src={R('benefit.svg')} alt="" className="h-6 w-6" />
          <span className="t-mono text-cream">{b}</span>
        </div>
      ))}
    </Shell>
  )
}

function Logos() {
  return (
    <Shell inner="grid grid-cols-1 lg:grid-cols-2">
      {LOGOS.map((half) => (
        <div key={half.label}>
          <div className="hairline flex h-[50px] items-center bg-panel px-8 py-4">
            <span className="t-mono text-cream">{half.label}</span>
          </div>
          <div className="grid grid-cols-3">
            {half.logos.map(([n, alt, w, h]) => (
              <div key={n} className="hairline flex h-[125px] items-center justify-center p-6">
                <img src={R(`logo-${n}.svg`)} alt={alt} style={{ width: w, height: h }} className="max-w-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </Shell>
  )
}

function Retrospective() {
  return (
    <Shell inner="grid grid-cols-1 lg:grid-cols-2">
      <div className="relative h-[372px] p-3 lg:h-[530px]">
        <img src={R('cz4OCmAigDhK3lTGZTCj6JubaE0.jpg')} alt="" className="h-full w-full object-cover" />
        <LottiePlayer
          src={R('vUQ6vAk7qnGO0kq09zG3qaBBo.json')}
          className="absolute left-1/2 top-1/2 h-[278px] w-[275px] -translate-x-1/2 -translate-y-1/2 lg:h-[405px] lg:w-[400px]"
        />
      </div>
      <div className="flex flex-col justify-center gap-[15px] px-8 py-16">
        <h2 className="font-display text-[40px] leading-[48px] tracking-[-1.6px] text-cream">
          Retrospective observability is fine for two-second runs. What if yours take six hours?
        </h2>
        <div className="flex flex-col font-display text-[18px] leading-[25.2px] tracking-[-0.72px] text-cream opacity-[0.64]">
          {RETRO.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </Shell>
  )
}

const CELL_TEXT = 'font-display text-[16px] leading-[22.4px] tracking-[-0.64px] text-cream'

function AgentsLength() {
  return (
    <Shell as="section">
      <DeepBar />
      <div className="grid grid-cols-1 bg-card-dark lg:h-[490px] lg:grid-cols-[525px_1fr]">
        <div className="relative flex h-[144px] items-center justify-center overflow-hidden lg:h-auto">
          <img src={R('CF2a8yg6rUJQ9kRH8Qk75fHGhhk.jpg')} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <h2 className="relative text-center font-display text-[32px] leading-[32px] tracking-[-1.28px] text-cream lg:text-[40px] lg:leading-[40px] lg:tracking-[-1.6px]">
            Agents aren't <br />
            one length
          </h2>
        </div>
        <div className="h-[347px] p-3 lg:h-auto">
          <img src={R('kwNUTQWIQPqbu8DejioFKvDd4k.jpg')} alt="" className="h-full w-full object-cover" />
        </div>
      </div>
      <div className="bg-card-dark">
        <div className="grid grid-cols-1 px-5 lg:grid-cols-3 lg:px-0">
          <div className="hairline hidden lg:block" />
          {['How long they run for', 'What they typically do'].map((h) => (
            <div key={h} className="hairline flex items-center justify-center p-5 lg:h-[96px]">
              <AppearText className="text-center font-display text-[20px] font-medium leading-[28px] tracking-[-0.8px] text-amber">
                {h}
              </AppearText>
            </div>
          ))}
        </div>
        {AGENTS.map((a) => (
          // live row heights: header and Always-on are min 96, Mid and Long share a 2-row grid (107 each)
          <div key={a.label} className={`grid grid-cols-1 px-5 lg:grid-cols-3 lg:px-0 ${a.minH || ''}`}>
            <div className="hairline flex items-center gap-5 p-5">
              <img src={R(`${a.icon}.svg`)} alt="" className="h-8 w-8" />
              <AppearText as="span" className="font-mono text-[16px] font-medium leading-[24px] text-cream">
                {a.label}
              </AppearText>
            </div>
            <div className="hairline flex items-center p-5">
              <div className="opacity-80">
                <AppearText className={CELL_TEXT}>
                  {a.how[0]}
                  <b className="font-bold">{a.how[1]}</b>
                  {a.how[2] && (
                    <>
                      <br />
                      {a.how[2]}
                    </>
                  )}
                </AppearText>
              </div>
            </div>
            <div className="hairline flex items-center p-5">
              <div className="opacity-80">
                <AppearText className={CELL_TEXT}>{a.what}</AppearText>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  )
}

function WhatYouGet() {
  return (
    <>
      <Shell inner="hairline flex flex-col gap-4 px-6 py-16 lg:h-[178px] lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        <h2 className="font-display text-[32px] leading-[32px] text-cream lg:w-[656px]">What you get</h2>
        <p className="font-display text-[18px] leading-[25.2px] tracking-[-0.72px] text-cream opacity-[0.64] lg:w-[600px]">
          Alongside the standard features, such as a dashboard, alerts, traces and span view, you will get unique functionalities.
        </p>
      </Shell>
      <Shell inner="grid grid-cols-1 gap-2 lg:grid-cols-2">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex flex-col bg-card-dark">
            <div className="hairline flex h-[38px] items-center justify-center bg-deep p-4">
              <span className="t-mono text-amber">{f.title}</span>
            </div>
            <img src={f.image} alt="" className="h-[300px] w-full object-cover" />
            <div className="flex min-h-[76px] items-center justify-center px-4 py-5">
              <p className="t-mono max-w-[420px] text-center text-cream">{f.text}</p>
            </div>
            <a href={DOCS_QS} className="flex h-[52px] bg-deep p-1">
              <span className="t-btn flex h-[44px] w-full items-center justify-center bg-panel px-3 py-[10px] text-cream">read more</span>
            </a>
          </div>
        ))}
      </Shell>
    </>
  )
}

function CtaXs() {
  return (
    <Shell inner="pt-8 lg:px-[128px]">
      <a href="/rius/pricing" className="relative flex h-[200px] flex-col justify-center gap-6 overflow-hidden p-8 md:h-[104px] md:flex-row md:items-center md:justify-start">
        <img src={R('h5Uv5LSjJ15Dll5BV8VwMsW3oo.jpg')} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <img src={R('cta-xs.svg')} alt="" className="relative h-10 w-10" />
        <span className="relative font-display text-[32px] leading-[32px] text-cream md:text-[24px] md:leading-[24px]">
          Explore the <br className="md:hidden" />
          Rius plans
        </span>
      </a>
    </Shell>
  )
}

export default function Rius() {
  useEffect(() => {
    document.title = 'GlassFlow Rius | AI Agent Observability in Production'
  }, [])
  return (
    <>
      <Spacer inner="h-[30px]" />
      <ProductHero
        barGraphic={R('rBnv8VCnmqKbBweg6ki6cG0pAQ.svg')}
        title="Catch agent failures before your customers do"
        lead="GlassFlow Rius is the observability layer for AI agents in production. Real-time visibility while your agents are running, not a post-mortem after they crash."
        primary={{
          label: 'Try 1 month free',
          href: 'https://console.rius-glassflow.com/signup?utm_source=glassflow&utm_medium=pricing_page&utm_campaign=signup&utm_content=core',
        }}
        secondary={{
          label: 'talk to the founders',
          href: 'https://cal.com/armend-glassflow/30min?utm_source=glassflow&utm_medium=rius_page&utm_campaign=signup',
        }}
        image={R('WrecUgpaG7OyoHyzr12sCjsrOLg.jpg')}
      />
      <Benefits />
      <Spacer />
      <Logos />
      <Testimonial
        compact
        quote={RIUS_QUOTE}
        person={{ avatar: R('AvNQPA2KLw0PJ8qQYPYqet4URQ.png'), name: 'Andres Almansa', role: 'CEO of Restack' }}
        company={{ logo: R('oIbDPvgphfWTFE1bRAFoKFR51po.jpeg'), alt: 'Restack' }}
      />
      <Spacer />
      <Retrospective />
      <Spacer />
      <AgentsLength />
      <Spacer />
      <TitleRow title="How it works" />
      <ImageCardGrid cards={HOW} cols="lg:grid-cols-3" />
      <Spacer />
      <WhatYouGet />
      <Spacer />
      <Quickstart
        heading={
          <>
            From setup to first trace <span className="text-amber">in minutes.</span>
          </>
        }
        sub={['Follow the quickstart: add the SDK, send your first trace.', 'No infra to run, fully scalable and best value for money.']}
        cards={[{ ...QUICKSTART_CARDS[0], start: undefined }]}
      />
      <Spacer />
      <TitleRow title="Rius Pricing" />
      <PlanCards plans={PLANS} />
      <CtaXs />
      <Spacer />
      <TitleRow title="Blog" />
      <Shell inner="flex flex-col gap-6 md:flex-row md:gap-2">
        {BLOG_POSTS.map((p) => (
          <BlogCard key={p.href} {...p} className="md:flex-1" />
        ))}
      </Shell>
      <Spacer />
      <Faq heading="Common questions" items={FAQS} inset />
    </>
  )
}
