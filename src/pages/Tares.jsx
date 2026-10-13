// /tares (specs/products.md §2)
import { useEffect } from 'react'
import Faq from '../components/Faq.jsx'
import TabsShowcase from '../components/TabsShowcase.jsx'
import { ProductHero, TitleRow, ImageCardGrid, ImageCTA } from '../components/ProductSections.jsx'
import { A, Shell, Spacer, Dots } from '../components/ui.jsx'

const T = (f) => A(`tares/${f}`)
const CONSOLE = 'https://console.tares-glassflow.com/'
const QS_BG = A('ARgMqlYnmiFWpdywy7EoO9FO9vI.png')

const CARDS = [
  { image: T('DiH9BEHyAmD3YzKMDiSCmJzne8.jpg'), icon: T('card-1.svg'), title: 'An AI SRE', body: "An alert fires; the agent reads the service's whole timeline and writes the diagnosis before anyone opens a dashboard." },
  { image: T('xIq1GQ7z3r1Ptn37Mi5lbPB0W4w.jpg'), icon: T('card-2.svg'), title: 'A context repo that stays current', body: 'Commits land; when a change matters to the team, the agent opens a pull request against the shared context repository.' },
  { image: T('yp8B5z0VsH2VoROmeiA7wpDyTxA.jpg'), icon: T('card-3.svg'), title: 'A triage agent for anything that runs', body: 'Failed jobs, sandbox runs, voice calls: each gets a timeline, a trigger on failure, and a finding that says what broke.' },
  { image: T('npJU6yM3NivZG6Lgj3b9ihnEXPY.jpg'), icon: T('card-4.svg'), title: 'A better read path for the agents you have', body: 'Claude Code, Cursor, or your own loop asks one question and gets the correlated history of an entity instead of ten tool calls.' },
]

const TAB1_BODY = 'Prometheus, logs, alert webhooks, GitHub, Postgres, Vercel, OpenTelemetry, or any webhook. Every event is keyed to the thing it is about, from a connector card or a pasted snippet of YAML connectors.'
const TABS = [
  { title: 'Connect anything that emits events.', body: TAB1_BODY, image: T('CuYhVCgpunml0AFh27rgIeYdlOI.png') },
  { title: 'One timeline per entity, with triggers watching it.', body: 'Sources that share a key merge into one time-ordered timeline per service, repo or customer; the agent view shows the exact text an agent receives. Triggers watch the live view and fire on a condition, once, with a cooldown. triggers', image: T('H6fLrCMmzzk6wbPFSMlmHRAjMw.jpg') },
  // tabs 03 and 04 reuse tab 01's body on the live site (kept verbatim)
  { title: 'Agents that run inside Tares', body: TAB1_BODY, image: T('WylXMWoX6XhNVJMpsK1mCHmgP20.jpg') },
  { title: 'Everything is available over MCP', body: TAB1_BODY, image: T('qO6OS4QHZfzEhywgrLBqkKq8dDg.jpg') },
]

// live copy kept verbatim, including typos and repeated titles
const TIMELINE = [
  { time: '02:03', title: 'An event lands', log: 'logs POST /charge 600 “upstream retry limit” x214' },
  { time: '02:11', title: 'Your alerting decides', sub: 'Prometheus keeps owning the thresholds. Tares only reacts to what fired.', log: 'alerts HighCheckoutLatency firing saverity=page' },
  { time: '02:11', title: 'An event lands', sub: 'It saw the alert event land on the view it watches. A cooldown holds it there', log: 'logs POST /charge 600 “upstream retry limit” x214' },
  { time: '02:11', title: 'An event lands', sub: 'One read: the last 90 seconds of metrics, logs, deploys and alerts for this service. Not the alert one.', log: 'read(api-server) → 47 events - 4 sources' },
  {
    time: '02:14',
    title: 'An event lands',
    sub: 'Written back onto the timeline next to the evidence, and delivered to #incidents.',
    finding: ['Uncapped retries from the 01:50 deploy (PR #482).', 'Error rate and p99 follow the rollout window exactly.', 'Next: cap retries at 3, or roll back.'],
  },
  { time: 'Later', title: 'An event lands', sub: 'The finding is an event too. The next investigation, humar or agent, opens with the last one’s conclusion.' },
]

const FAQS = [
  ['Does this replace my warehouse or my pipelines?', 'No. Your pipelines keep landing data in Postgres or Redshift for BI. Tares sits beside them as the read path for agents, and treats the warehouse itself as one more source. Analysts keep SQL; agents get MCP.'],
  ['Is this only for logs and metrics?', 'No. Observability was one vertical; the plane is general. Anything that can be pulled, received, or extracted becomes a source: database rows, API responses, documents, files, webhooks. If it has an entity and a timestamp, it correlates.'],
  ['Do my agents query my sources directly?', 'Never. Tares ingests each source once into its own store, and agents read from Tares. Your production database and your rate-limited APIs see one well-behaved reader instead of a fleet of agents.'],
]

function HeadingBand({ title, sub, className = '' }) {
  return (
    <div className={`flex max-w-[440px] flex-col items-center gap-[19px] text-center ${className}`}>
      <h2 className="font-display text-[40px] leading-[40px] text-cream">{title}</h2>
      <div className="t-body opacity-80">{sub}</div>
    </div>
  )
}

function Timeline() {
  return (
    <Shell inner="lg:px-[128px]">
      {TIMELINE.map((r, i) => (
        <div key={i} className="flex">
          <img src={T(`timeline-${i + 1}.svg`)} alt="" className="h-6 w-6 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className={`flex items-center gap-3 bg-panel px-4 py-2 ${r.sub ? 'min-h-[56px]' : 'min-h-[38px]'}`}>
              <span className="shrink-0 bg-line px-[6px] py-[2px] font-mono text-[12px] font-bold leading-[18.2px] text-cream">
                {r.time}
              </span>
              <span className="flex flex-col gap-1">
                <span className="t-mono text-cream">{r.title}</span>
                {r.sub && <span className="font-display text-[14px] leading-[18.2px] text-cream opacity-80">{r.sub}</span>}
              </span>
            </div>
            {r.log && (
              <div className="flex gap-[21px] bg-card-dark px-6 py-[17px] text-cream">
                <span className="t-mono">&gt;</span>
                <span className="font-mono text-[12px] leading-[18.2px]">{r.log}</span>
              </div>
            )}
            {r.finding && (
              <div className="flex gap-[21px] bg-amber-tint px-6 py-[17px]">
                <span className="t-mono text-cream">&gt;</span>
                <span className="font-mono text-[12px] leading-[18.2px] text-amber-2">
                  {r.finding.map((l) => (
                    <span key={l} className="block">{l}</span>
                  ))}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </Shell>
  )
}

function Terminal({ rows }) {
  return (
    <div className="flex min-w-0 flex-col lg:w-[400px]">
      <div className="hairline relative h-[42px] bg-bar">
        <Dots className="absolute left-[14px] top-[18px]" />
      </div>
      <div className="hairline flex flex-1 flex-col gap-4 bg-deep p-4 text-cream">
        {rows.map(([mark, text, cont]) => (
          <div key={typeof text === 'string' ? text : mark + cont} className="flex gap-[21px]">
            <span className="t-mono">{mark}</span>
            <span className={`min-w-0 break-words font-mono text-[12px] leading-[18.2px] ${mark === '#' ? 'opacity-80' : ''}`}>
              {text}
              {/* live: the continuation line never wraps and is centred in the column (overflows on mobile) */}
              {cont && <span className="flex justify-center whitespace-nowrap">{cont}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RunIt() {
  return (
    <Shell>
      <div className="relative overflow-hidden">
        <img src={QS_BG} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="relative flex flex-col items-center gap-8 px-6 py-16">
          <HeadingBand
            title="Run it in two commands"
            sub={
              <>
                <p>
                  The quickstart takes it from here. Rather not host it? <br className="hidden md:inline" />
                  Use the cloud.
                </p>
              </>
            }
          />
          <div className="grid w-full max-w-[800px] grid-cols-2">
            <Terminal rows={[['#', 'daemon + console → http://127.0.0.1:8787'], ['>', 'uv tool install tares'], ['>', 'tares up']]} />
            <Terminal
              rows={[
                ['#', <>agent endpoint →<br />http://localhost:8788/mcp</>],
                ['>', 'tares mcp'],
                ['>', 'claude mcp add --transport http \\', 'tares http://localhost:8788/mcp'],
              ]}
            />
          </div>
        </div>
      </div>
    </Shell>
  )
}

export default function Tares() {
  useEffect(() => {
    document.title = 'GlassFlow Tares | The open-source data plane for AI agents'
  }, [])
  return (
    <>
      <Spacer inner="h-[30px]" />
      <ProductHero
        barGraphic={T('bar-graphic.svg')}
        title="Tares is open-source platform for always-on AI agents"
        lead="Chat agents wait for a prompt. Tares agents wait for an event: every event from you systems lands on the timeline per thing, a trigger wakes an agent the moment it matters, and the finding it writes back is there for the next reader."
        primary={{ label: 'sart on the cloud', href: CONSOLE }}
        secondary={{ label: 'run it yourself', href: 'https://docs.glassflow.ai/tares/quickstart' }}
        image={T('gHnD0OdArW5qQdvx69aQhJaArJk.jpg')}
      />
      <Spacer />
      <TitleRow title="What teams build with it" />
      <ImageCardGrid cards={CARDS} cols="md:grid-cols-2 lg:grid-cols-4" />
      <Spacer />
      <TabsShowcase
        barGraphic={T('bar-graphic.svg')}
        title="What is in Tares"
        lead="Everything here is a page in the console, editable there."
        tabs={TABS}
      />
      <Spacer />
      <Shell>
        <div className="relative overflow-hidden">
          <img src={QS_BG} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="relative flex justify-center px-6 py-16">
            <HeadingBand title="From event to finding" sub="One real incident on one service's timeline, minute by minute" />
          </div>
        </div>
      </Shell>
      <Timeline />
      <Spacer />
      <RunIt />
      <Spacer />
      <Faq heading="Common questions" items={FAQS} inset />
      <Spacer />
      <ImageCTA
        title="Connect any source. Query it from an agent minutes later."
        gapClass="gap-8 md:gap-16"
        primary={{ label: 'start on the cloud', href: CONSOLE }}
        secondary={{ label: 'star on github', href: 'https://github.com/glassflow/tares' }}
      />
    </>
  )
}
