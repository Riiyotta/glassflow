// /rius/alternatives/arize and /rius/alternatives/langfuse (specs/products.md §5).
// The live page is one HTML document in an iframe; this is a native rebuild of that template:
// one component, per-page data below. Type and colour values follow §5.1 / Appendix A
// (Inter text, Geist Mono labels, embed line colour #553619); mobile rules apply below 810px.
import { useEffect, useMemo, useState } from 'react'
import { A } from '../components/ui.jsx'
import { RIUS_QUOTE } from './Rius.jsx'

const R = (f) => A(`rius/${f}`)
const ALT = (f) => A(`alternatives/${f}`)
const CAL = 'https://cal.com/armend-glassflow/30min?utm_source=glassflow&utm_medium=rius_page&utm_campaign=signup&overlayCalendar=true'
const SIGNUP = (slug) =>
  `https://console.rius-glassflow.com/signup?utm_source=glassflow&utm_medium=alternative&utm_campaign=signup&utm_content=${slug}`
const MIGRATE = 'https://docs.glassflow.ai/rius/guides/migrate-from-langfuse'

/* ---------- type roles (Appendix A) ---------- */
const H1 = 'text-[34px] leading-[36px] tracking-[-1.36px] md:text-[48px] md:leading-[48px] md:tracking-[-1.92px]'
const H2 = 'text-[28px] leading-[32px] tracking-[-1.12px] md:text-[40px] md:leading-[48px] md:tracking-[-1.6px]'
const H3 = 'text-[24px] leading-[28px] tracking-[-0.96px]'
const LEAD = 'text-[18px] leading-[25.2px] tracking-[-0.72px] md:text-[21px] md:leading-[29.4px] md:tracking-[-0.84px]'
const BIG = 'text-[24px] leading-[28px] tracking-[-1px] md:text-[32px] md:leading-[36px]'
const MT = 'font-mono text-[14px] font-bold leading-[18.2px] tracking-normal'
const ML = 'font-mono text-[12px] leading-[18.2px] tracking-normal'
const KICK = 'font-mono text-[12px] font-medium uppercase leading-[12px] tracking-[0.04em] text-amber'
const MU = 'text-cream-64'
const SM = 'text-[14px] leading-[19.6px] tracking-[-0.32px]'
const LINE = 'border-embed-line'

/* ---------- shared data ---------- */
const CHIPS = ['Silent failure detection', 'MCP Observability', 'Live spans', 'Agent heartbeats']
const LOGOS = [
  { label: 'Used by:', logos: [['restack', 'Restack', 66, 28], ['nubrain', 'nubrain', 93, 21], ['sentri', 'Sentri', 98, 13]] },
  { label: 'Backed by CEOs of:', logos: [['entire', 'Entire', 96, 24], ['weaviate', 'Weaviate', 112, 17], ['sference', 'sference', 92, 18]] },
]
const SILENT = [
  ['infrastructure', 'Trace is green but one span shows an error', 'The run reports success. One tool call inside it failed and the agent carried on with bad data. Rius flags the span, not just the run.'],
  ['cognitive', 'Tool loop', 'The agent calls the same tool with near-identical arguments again and again. Every call returns 200. Rius flags the loop.'],
  ['infrastructure', 'Consistent error pattern', 'The same failure signature across many runs, like a deprecated model name in config. Rius groups it into one incident with counts.'],
  ['infrastructure', 'The process that vanished', 'No output, no error, no end. The heartbeat stops and Rius opens an incident within seconds.'],
  ['recovery', 'The run that crashed', 'The agent died mid-run. Rius keeps every span sent before the crash, so you see exactly where it stopped.'],
  ['cognitive', 'The wrong turn at step 7', 'The agent diverged early and kept going for 180 more steps. Rius shows the first divergence, not just the wrong final answer.'],
]
const RIUS_SELF_HOST = ['Is Rius self-hostable?', 'No. Rius is cloud only, so there is nothing to host, patch or scale.']

const INSTALL = {
  python: `Instrument this code with the Rius SDK:

# install the extra for the LLM library the code uses; it auto-instruments it:
pip install "glassflow-rius[openai]"   # or [anthropic], [langchain], ...; [instruments] for all

import rius
rius.init(service_name="my-agent")     # reads the API key from RIUS_API_KEY

Provide the key as the RIUS_API_KEY environment variable (or in an env file). Never hardcode it.
Docs: https://docs.glassflow.ai/rius/sdk`,
  typescript: `Instrument this code with the Rius SDK:

# install the SDK plus the integration for the LLM library the code uses; it auto-instruments it:
npm install @glassflow-ai/rius @opentelemetry/api
npm install @arizeai/openinference-instrumentation-openai   # OpenAI; or @arizeai/openinference-vercel @ai-sdk/otel for the Vercel AI SDK

import { init } from "@glassflow-ai/rius"
init({ serviceName: "my-agent" })     // reads the API key from RIUS_API_KEY

Provide the key as the RIUS_API_KEY environment variable (or in an env file). Never hardcode it.
Docs: https://docs.glassflow.ai/rius/sdk`,
}

/* ---------- per-page data ---------- */
// FAQ answers marked "outline" are rendered from the spec's outline (§5.2/§5.3), not the live body.
const PAGES = {
  arize: {
    slug: 'arize',
    docTitle: 'Arize Alternative for AI Agents | Rius vs Arize Phoenix',
    width: 'max-w-[1200px]',
    h1: 'Rius is an Arize alternative built for companies shipping agents every day.',
    lead: 'Phoenix means running your own stack. AX includes 25k–50k spans a month. Rius is managed, real-time and includes 500k spans for $19/mo.',
    smallPrint: '1 month free, then $19/mo · managed · 500k spans included',
    jump: 'instrument your agent in 2 minutes ↓',
    hero: [ALT('arize-hero.webp'), 'Rius Home dashboard: traces, spans, LLM calls, cost, tokens and error rate'],
    rows: ['Detection:', 'Root cause:', 'Heartbeat:', 'Alerts:', 'MCP:', 'User view:', 'Limits:', 'Price:'],
    rius: [
      ['Real-time, unlimited.', ' Loops, context overflow, error patterns.'],
      ['Automatic per incident.', ' Step, tool, change.'],
      ['Per span.', ' Frozen agent = incident in seconds.'],
      ['Unlimited', ', to Slack and agents over MCP.'],
      ['MCP-first.', ' Incidents, RCAs, traces, alerts.'],
      ['Per end user:', ' traces, failures, cost.'],
      ['500k spans · 60 days', ''],
      ['$19/mo', ', managed. First month free.'],
    ],
    versus: [
      {
        key: 'ax',
        switchLabel: 'vs Arize AX',
        heading: 'Rius vs Arize AX',
        col: ['Arize AX', ' Free / Pro'],
        cells: [
          'Signal scans every 3–6 h. 10 / 25 issues/mo.',
          'Pattern summary + fix idea. Alyx chat on request.',
          '“No data” per time window, not per run.',
          'Metric-threshold monitors → Slack, PagerDuty.',
          'Not documented (CLI + Skills).',
          'Filter by user.id.',
          '25k / 50k spans · 15 / 30 days',
          '$0 / $50 per month. SaaS.',
        ],
      },
      {
        key: 'px',
        switchLabel: 'vs Phoenix OSS',
        heading: 'Rius vs Phoenix OSS',
        col: ['Phoenix OSS', ''],
        cells: [
          'Evals you write and run.',
          'Manual trace inspection.',
          'None.',
          'None built in.',
          'Read-only: traces, prompts, datasets.',
          'Filter by user.id.',
          'Your infra, your retention.',
          'Free + infra + ops time. Self-hosted.',
        ],
      },
    ],
    stops: {
      heading: 'Where Arize stops.',
      sub: 'Strong for evals and experiments. These are the gaps in production.',
      cards: [
        ['Scheduled, not real-time', 'Signal reviews traces every 3–6 hours.', ['A loop at 9:02 shows up after the next scan', 'Alyx investigates only when you ask', 'No per-run heartbeat for frozen agents']],
        ['Low limits', 'Free and Pro run out fast with agents.', ['25k / 50k spans per month', '15 / 30 days retention', '10 / 25 Signal issues per month']],
        ['Phoenix in production', 'Free to download. Not free to run.', ['PostgreSQL, backups, auth, upgrades', 'One tenant per instance', 'No built-in alerting']],
      ],
    },
    install: true,
    splits: [
      {
        layout: 'even',
        image: [ALT('rca.webp'), 'Rius root-cause analysis with suggested next actions'],
        heading: 'Arize summarizes patterns. Rius gives you the cause.',
        body: [
          'Arize groups failures on a schedule and leaves the digging to you or a chat assistant. Rius works out which step, which tool and which change caused each incident, as it happens.',
          'Then it alerts you, or your supervisor agent over MCP, with the root cause attached.',
        ],
        flow: ['symptom', 'pattern', 'root cause', 'alert'],
      },
      {
        layout: 'textLeft',
        image: [ALT('arize-users.webp'), 'Rius users view'],
        heading: 'See every end user your agents served.',
        body: [
          'Traces, failures, cost and which agents touched each user, in one view. Untagged traffic is the first row, never hidden.',
          'Click a user to open their traces. Answer “did this customer have a bad experience?” in seconds.',
        ],
      },
      {
        layout: 'imageLeft',
        image: [ALT('arize-mcp.webp'), 'Rius MCP view: clients, sessions, tool calls and answer rate'],
        heading: 'Built to feed your agents, not just your dashboard.',
        body: [
          'Rius runs as an MCP server for many agents at once. Coding agents, supervisor agents and on-call agents pull incidents, root causes and traces, so they can investigate, fix and improve themselves.',
          'The MCP view shows which agents connect, which tools they call and whether they get an answer.',
        ],
        flow: ['incident', 'agent reads RCA', 'fix', 'verify'],
      },
    ],
    calc: {
      data: { setup: [[1, 1], [2, 1], [1.5, 1], [1.5, 1], [1, 0.5], [3, 3], [1, 1]], maint: [[1, 1], [0.5, 1], [0.75, 1], [0.5, 0.5], [0.25, 0.25]], infra: { prod: 88, lean: 14 } },
      heading: 'What does 100k spans per month cost you?',
      sub: "Same volume, four options. Phoenix is free to download, so set your engineer's hourly rate to see what running it costs.",
      volume: true,
      rateLabel: 'engineer hourly rate (Phoenix)',
      infraLabel: 'Phoenix infrastructure',
      selfName: 'Phoenix OSS',
      selfCov: 'Covers 100k spans · on your infra',
      setupLabels: ['Pick deployment path, read self-hosting docs', 'Deploy: Helm/Terraform or Compose (Claude Code drafts, you review)', 'PostgreSQL for production + backups', 'Auth, TLS, domain, networking', 'Retention policy + monitoring of the stack', 'Build alerting (not included in Phoenix)', 'SDK instrumentation + end-to-end test'],
      maintLabels: ['Phoenix upgrades and DB migrations', 'PostgreSQL patching, backup checks', 'Fixing the stack when it breaks', 'Maintaining your alerting scripts', 'Capacity and cost review'],
      infraLines: {
        prod: [['Phoenix app · EC2 t3.medium', 30], ['PostgreSQL · RDS db.t4g.small + 50 GB', 30], ['Load balancer · ALB', 18], ['Backups, logs, egress', 10]],
        lean: [['1 VM, 2 vCPU / 4 GB, app + PostgreSQL (Hetzner CPX21-class)', 8], ['40 GB volume', 3], ['Snapshots / backups', 3]],
      },
      detailTitles: ['setup hours', 'maintenance hours / month', 'infrastructure / month'],
      note: 'Phoenix figures are estimates: AWS on-demand list prices, us-east-1; hours assume heavy AI-assisted work with Claude Code (half of a manual setup); Phoenix OSS has no built-in alerting, so building it is included.',
    },
    faq: [
      ['What is the best Arize alternative for startups?', 'Rius: a managed agent monitor with real-time silent-failure detection and root cause, at $19/mo with the first month free.'],
      ['How much does it cost to self-host Arize Phoenix?', 'Use the calculator above: it estimates setup hours, monthly maintenance and infrastructure for Phoenix at 100k spans a month.'],
      ['Does Arize Phoenix have real-time alerts?', 'Phoenix OSS has no built-in alerting. Arize AX has metric-threshold monitors.'],
      ['Can I run Rius and Phoenix side by side?', 'Yes. Both speak OpenTelemetry. Add Rius as a second exporter in your OpenTelemetry Collector next to Phoenix. Keep Phoenix for evals, datasets and experiments, and use Rius for runtime failures.'],
      ['Phoenix is free. Why pay $19?', 'Phoenix is free to download, not free to run: setup, maintenance and infrastructure add up to more than $19/mo.'],
      ['Is Phoenix open source?', "Phoenix's source is public. Arize's own comparison page lists it under the Elastic License 2.0, a source-available license. Check the license terms for your use case."],
      RIUS_SELF_HOST,
      ['What does Rius not replace?', 'Prompt management, evals and datasets. Rius focuses on production failures.'],
    ],
  },
  langfuse: {
    slug: 'langfuse',
    docTitle: 'Langfuse Alternative for AI Agents | Rius by GlassFlow',
    width: 'max-w-[1234px]',
    h1: 'Rius is the Langfuse alternative that does the debugging for you.',
    lead: 'Rius is managed observability for AI agents in prod. Unlike Langfuse, which gives you traces to dig through, Rius detects silent failures like tool loops and crashed runs and points you to the root cause.',
    smallPrint: '1 month free, then $19/mo · managed · no ClickHouse to run',
    hero: [ALT('langfuse-hero.webp'), 'Rius alert view: tool loop detected on checkout-agent with root-cause analysis and delivery to Slack and a supervisor agent'],
    rows: ['Detection:', 'Root cause:', 'Heartbeat:', 'MCP:', 'Delivery:', 'Costs:'],
    rius: [
      ['Automatic.', ' Tool loops, context overflow, consistent error patterns. No evals to write.'],
      ['Per incident.', ' Which step, which tool, which change.'],
      ['Real-time per span.', ' A frozen agent becomes an incident in seconds.'],
      ['Built MCP-first.', ' Agents query traces whenever you need them. Full view of what happened, when, and which data was queried. RCAs and alerts go to your supervisor agent over MCP.'],
      ['Cloud only.', ' Nothing to host, patch or scale.'],
      ['$19/mo.', ' More value than Langfuse Cloud: more traces, longer query retention, more alerts and lower overage.'],
    ],
    versus: [
      {
        key: 'lf',
        heading: 'Rius gives you insights that Langfuse can not.',
        col: ['Langfuse', ''],
        cells: [
          'Only if you wrote an eval or score for it.',
          'Manual trace inspection.',
          'No heartbeat. Frozen looks like running.',
          'Limited.',
          'Self-hosted and cloud.',
          'Self-hosted: free license, but you manage ClickHouse and the rest of the infra. Cloud starts at $29/mo.',
        ],
      },
    ],
    stops: {
      heading: 'Where Langfuse stops.',
      sub: 'Great for traces, evals and prompts. These are the gaps.',
      cards: [
        ['Unknown failures', 'You only catch what you wrote an eval for.', ['Loops look like normal traffic', 'Truncated context throws no error', 'Customers report it first']],
        ['Frozen agents', 'A stuck agent looks exactly like a working one.', ['No heartbeat per run', 'Open traces never close', 'You find out after the SLA']],
        ['Self-hosting', "The license is free. Running it isn't.", ['Postgres, ClickHouse, Redis, S3', 'Upgrades and backups are yours', 'Ops hours every month']],
      ],
    },
    splits: [
      {
        layout: 'even',
        image: [ALT('rca.webp'), 'Rius root-cause analysis with suggested next actions'],
        heading: 'Langfuse gives you the trace. Rius gives you the cause.',
        body: [
          'Rius groups symptoms into one incident and works out which step, which tool and which change caused it. No digging through 400 spans.',
          'Then it alerts you, or your supervisor agent over MCP, with the root cause attached.',
        ],
        flow: ['symptom', 'pattern', 'root cause', 'alert'],
      },
    ],
    sideBySide: true,
    calc: {
      data: { setup: [[1, 1], [3, 1.5], [2, 1.5], [1.5, 1], [2, 1.5], [1.5, 1.5], [1, 1]], maint: [[1, 1], [0.75, 0.75], [0.5, 1], [0.75, 1], [0.25, 0.25]], infra: { prod: 202, lean: 49 } },
      heading: "Self-hosting Langfuse isn't free. Run the numbers.",
      sub: 'Estimate for ~100k traces/mo, set up and run by a mid-level engineer working heavily with Claude Code. Set your hourly rate.',
      rateLabel: 'engineer hourly rate',
      infraLabel: 'infrastructure',
      selfName: 'Self-hosted Langfuse',
      setupLabels: ['Pick deployment path, read self-hosting docs', 'Infra as code: Helm/Terraform or Compose (Claude Code drafts, you review)', 'Wire ClickHouse, Postgres, Redis, S3, secrets', 'TLS, domain, auth/SSO, networking', 'Backups + monitoring for the stack itself', 'SDK instrumentation + end-to-end test', 'Runbook + security review'],
      maintLabels: ['Langfuse upgrades and migrations', 'ClickHouse disk, TTL, query performance', 'Postgres/Redis patching, backup checks', 'Fixing the stack when it breaks', 'Capacity and cost review'],
      infraLines: {
        prod: [['Langfuse web + worker · EC2 t3.large', 61], ['ClickHouse · EC2 t3.large + 100 GB gp3', 69], ['Postgres · RDS db.t4g.small + 20 GB', 26], ['Redis · ElastiCache cache.t4g.micro', 12], ['Load balancer · ALB', 18], ['Blob storage · S3, ~5 GB/mo growing', 1], ['Backups, logs, egress', 15]],
        lean: [['1 VM, 4 vCPU / 16 GB, all containers (Hetzner CCX23-class)', 32], ['100 GB volume', 5], ['S3-compatible object storage', 6], ['Snapshots / backups', 6]],
      },
      detailTitles: ['setup hours', 'maintenance hours per month', 'infrastructure per month'],
      note: "Assumptions: ~100k traces/mo at ~50 KB · 30-day retention · AWS on-demand list prices, us-east-1 · Hours assume heavy AI-assisted work with Claude Code: half of a manual setup. Setup hours exclude your app's own instrumentation work beyond one end-to-end test.",
    },
    betterPick: {
      heading: 'Where Langfuse is still the better pick',
      sub: 'Rius isn’t a drop-in replacement for everything Langfuse does. Stick with Langfuse if:',
      cards: [
        ['You need to self-host.', 'Langfuse is open source and runs on your own infrastructure. Rius is a managed cloud service.'],
        ['Prompt management and evals are your main use case.', 'Langfuse has built-in prompt versioning, datasets and eval workflows. Rius focuses on production failures, not offline evals.'],
        ['Your agents are short, stateless LLM calls.', 'If a plain trace answers your questions, Langfuse is free and works well.'],
      ],
      closing: 'Choose Rius when agents run long, fail silently, and you’d rather get the root cause than dig through traces. You can also run both side by side.',
    },
    faq: [
      ['What’s the best Langfuse alternative for AI agents?', 'Rius: managed observability that detects silent failures like tool loops and crashed runs and points you to the root cause.'],
      ['Can Rius replace Langfuse?', 'For catching and debugging production failures, yes. If prompt management and evals are your main use case, keep Langfuse or run both side by side.'],
      ['Does Langfuse require ClickHouse?', 'Self-hosted Langfuse runs on ClickHouse, alongside Postgres, Redis and S3.'],
      ['How much does Langfuse self-hosting cost?', 'Around $478/mo in year one at ~100k traces/mo and $65/h on AWS. Run your own numbers in the calculator above.'],
      ['Langfuse is free. Why pay $19?', "The license is free. Running it isn't: setup, maintenance and infrastructure add up to more than $19/mo."],
      ['Can I use Rius and Langfuse together?', 'Yes. Route the same OpenTelemetry traces to both through the OpenTelemetry Collector and compare what each one catches.'],
      RIUS_SELF_HOST,
    ],
  },
}

/* ---------- building blocks ---------- */
function Section({ children, id }) {
  return (
    <section id={id} className={`border-b ${LINE} px-4 md:px-16`}>
      <div className={`mx-auto max-w-[1312px] border-x ${LINE} py-4 md:py-8`}>{children}</div>
    </section>
  )
}

function Bar({ tag }) {
  return (
    <div className={`flex h-8 items-center justify-between border-b ${LINE} bg-deep px-3`}>
      <span className="flex gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <i key={i} className="block h-[6px] w-[6px] bg-embed-line" />
        ))}
      </span>
      {tag === 'rius' ? (
        <img src={R('rBnv8VCnmqKbBweg6ki6cG0pAQ.svg')} alt="Rius" className="h-[14px] w-[58px] object-contain" />
      ) : (
        tag && <span className="font-mono text-[12px] leading-[12px] text-amber">{tag}</span>
      )}
    </div>
  )
}

function Panel({ tag, className = '', children }) {
  return (
    <div className={`bg-card-dark ${className}`}>
      <Bar tag={tag} />
      {children}
    </div>
  )
}

const BTN = 'inline-flex gap-2 font-mono text-[14px] font-medium lowercase leading-[24px] tracking-[-0.32px] no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber'

function PrimaryButton({ label, href }) {
  return (
    <a target="_blank" rel="noopener" href={href} className={`group ${BTN}`}>
      <span className="flex min-h-[52px] bg-amber p-1">
        <span className="flex w-full items-center justify-center border border-deep/[.28] px-6 py-[10px] text-deep group-hover:bg-amber-hover">
          {label}
        </span>
      </span>
      <span className="flex min-h-[52px] bg-amber p-1">
        <span aria-hidden="true" className="flex w-full items-center justify-center border border-deep/[.28] px-[14px] py-[10px] text-deep group-hover:bg-amber-hover">
          →
        </span>
      </span>
    </a>
  )
}

function SecondaryButton({ label, href }) {
  return (
    <a target="_blank" rel="noopener" href={href} className={`group ${BTN}`}>
      <span className="flex min-h-[52px] bg-card-dark p-1">
        <span className="flex w-full items-center justify-center bg-panel px-6 py-[10px] text-cream group-hover:bg-promo">{label}</span>
      </span>
    </a>
  )
}

function Num({ children }) {
  return (
    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center bg-amber font-mono text-[12px] font-medium leading-[12px] text-deep">
      {children}
    </span>
  )
}

function Header({ heading, sub }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 p-8">
      <h2 className={H2}>{heading}</h2>
      {sub && <p className={`max-w-[460px] ${MU}`}>{sub}</p>}
    </div>
  )
}

function Flow({ steps }) {
  return (
    <div className={`mt-3 flex flex-wrap gap-[6px] ${ML}`}>
      {steps.map((s, i) => (
        <span key={s} className="contents">
          {i > 0 && <span className="text-amber">→</span>}
          <span className="bg-panel px-[10px] py-[6px]">{s}</span>
        </span>
      ))}
    </div>
  )
}

function Details({ title, open, onToggle, small = false, children }) {
  return (
    <div className={small ? `border-t ${LINE}` : `border-b ${LINE} bg-panel`}>
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className={`flex w-full items-center justify-between gap-4 text-left font-mono font-bold leading-[18.2px] ${
          small ? 'px-3 py-[14px] text-[13px] text-cream' : 'px-6 py-5 text-[14px] text-white'
        } focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber`}
      >
        {title}
        <span
          aria-hidden="true"
          className={`inline-flex shrink-0 items-center justify-center bg-deep font-normal text-cream ${small ? 'h-[22px] w-[22px]' : 'h-7 w-7'}`}
        >
          {open ? '↑' : '↓'}
        </span>
      </button>
      {open && children}
    </div>
  )
}

/* ---------- sections ---------- */
function Hero({ d }) {
  return (
    <Section>
      <Panel tag="rius">
        <div className="grid grid-cols-1">
          <div className="flex flex-col justify-center px-5 py-10 md:px-8 md:pb-10 md:pt-16">
            <div className="flex max-w-[860px] flex-col gap-[15px]">
              <h1 className={H1}>{d.h1}</h1>
              <p className={LEAD}>{d.lead}</p>
              <div className="mt-[17px] flex flex-wrap gap-2">
                <PrimaryButton label="try 1 month free" href={SIGNUP(d.slug)} />
                <SecondaryButton label="talk to the founders" href={CAL} />
              </div>
              <p className={`${ML} ${MU}`}>{d.smallPrint}</p>
            </div>
          </div>
          <div className="flex flex-col px-3 pb-3">
            {d.jump && (
              <a
                href="#rcx-install"
                onClick={(e) => {
                  const t = document.getElementById('rcx-install')
                  if (t) {
                    e.preventDefault()
                    t.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
                className="mx-5 mb-4 self-start font-mono text-[14px] font-medium leading-[20px] tracking-normal text-amber underline underline-offset-4 hover:text-cream"
              >
                {d.jump}
              </a>
            )}
            <div className="bg-black">
              <img src={d.hero[0]} alt={d.hero[1]} width="2600" height="1440" className="block h-auto w-full" />
            </div>
          </div>
        </div>
        <div className={`grid grid-cols-1 gap-px border-t ${LINE} bg-embed-line lg:grid-cols-4 md:grid-cols-2`}>
          {CHIPS.map((c) => (
            <div key={c} className={`flex items-center justify-center gap-3 bg-card-dark px-4 py-5 ${MT}`}>
              <span aria-hidden="true" className="inline-flex h-5 w-5 shrink-0 items-center justify-center bg-amber">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6.5 5 9l5-6" stroke="#1D0E00" strokeWidth="2" strokeLinecap="square" />
                </svg>
              </span>
              {c}
            </div>
          ))}
        </div>
      </Panel>
    </Section>
  )
}

function Logos() {
  return (
    <Section>
      <div className={`grid grid-cols-1 gap-px border ${LINE} bg-embed-line md:grid-cols-2`}>
        {LOGOS.map((half) => (
          <div key={half.label} className="bg-card-dark">
            <div className={`border-b ${LINE} bg-deep px-8 py-4 ${MT} text-cream`}>{half.label}</div>
            <div className="grid grid-cols-3 gap-px bg-embed-line">
              {half.logos.map(([n, alt, w, h]) => (
                <div key={n} className="flex min-h-[120px] items-center justify-center bg-panel p-4">
                  <img src={R(`logo-${n}.svg`)} alt={alt} width={w} height={h} className="block h-auto max-w-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Quote() {
  return (
    <Section>
      <div className="bg-card-dark">
        <div className="flex flex-col gap-8 p-6 md:p-10">
          <span aria-hidden="true" className="block h-6 w-6 bg-amber" />
          <p className={BIG}>{RIUS_QUOTE}</p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-[14px]">
              <img src={R('AvNQPA2KLw0PJ8qQYPYqet4URQ.png')} alt="Andres Almansa" className="h-12 w-12 object-cover" />
              <p className="flex flex-col">
                <span className={`${MT} text-[16px]`}>Andres Almansa</span>
                <span className={MU}>CEO of Restack</span>
              </p>
            </div>
            <img src={R('oIbDPvgphfWTFE1bRAFoKFR51po.jpeg')} alt="Restack" className="h-12 w-12 object-cover" />
          </div>
        </div>
      </div>
    </Section>
  )
}

function Comparison({ d }) {
  const [vs, setVs] = useState(0)
  const v = d.versus[vs]
  const toggle = d.versus.length > 1
  const colLabel = (
    <>
      {v.col[0]}
      {v.col[1] && <span className={`font-normal ${MU}`}>{v.col[1]}</span>}
    </>
  )
  const colText = v.col.join('')
  return (
    <Section>
      <Panel tag="rius">
        {toggle ? (
          <div className="flex flex-wrap items-center justify-between gap-4 p-8">
            <h2 className={H2}>{v.heading}</h2>
            <div role="group" aria-label="Compare with" className={`inline-flex border ${LINE} bg-deep`}>
              {d.versus.map((o, i) => (
                <button
                  key={o.key}
                  type="button"
                  aria-pressed={i === vs}
                  onClick={() => setVs(i)}
                  className={`px-4 py-[10px] font-mono text-[14px] font-medium leading-[18px] ${
                    i === vs ? 'bg-amber text-deep' : `${MU} hover:text-cream`
                  }`}
                >
                  {o.switchLabel}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <Header heading={v.heading} />
        )}
        <div className="overflow-x-auto">
          <table className="block w-full border-collapse bg-card-dark md:table md:min-w-[780px]">
            <thead className="hidden md:table-header-group">
              <tr>
                <th scope="col" className={`border ${LINE} px-6 py-7`} />
                <th scope="col" className={`border ${LINE} px-6 py-7 text-center text-[20px] font-bold leading-[28px] tracking-[-0.8px] text-amber`}>
                  Rius
                </th>
                <th scope="col" className={`border ${LINE} px-6 py-7 text-center text-[20px] font-bold leading-[28px] tracking-[-0.8px] text-cream`}>
                  {colLabel}
                </th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group">
              {d.rows.map((label, i) => (
                <tr key={label} className="block md:table-row">
                  <th scope="row" className={`block w-full border-b ${LINE} bg-deep px-4 py-[14px] text-left font-normal md:table-cell md:w-[22%] md:border md:bg-transparent md:px-6 md:py-5`}>
                    <span className="flex items-center gap-3 font-mono text-[16px] font-medium leading-[24px] tracking-normal">
                      <Num>{String(i + 1).padStart(2, '0')}</Num>
                      {label}
                    </span>
                  </th>
                  <td className={`block w-full border-b ${LINE} bg-panel px-4 py-[14px] md:table-cell md:w-[39%] md:border md:px-6 md:py-5`}>
                    <span className={`mb-1 block md:hidden ${ML} text-amber`}>Rius</span>
                    <b className="font-bold">{d.rius[i][0]}</b>
                    {d.rius[i][1]}
                  </td>
                  <td className={`block w-full border-b ${LINE} px-4 py-[14px] md:table-cell md:w-[39%] md:border md:px-6 md:py-5`}>
                    <span className={`mb-1 block md:hidden ${ML} text-amber`}>{colText}</span>
                    {v.cells[i]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </Section>
  )
}

function Stops({ s }) {
  return (
    <Section>
      <Panel>
        <Header heading={s.heading} sub={s.sub} />
        <div className={`grid grid-cols-1 gap-px border-t ${LINE} bg-embed-line md:grid-cols-3`}>
          {s.cards.map(([title, line, bullets]) => (
            <div key={title} className="flex flex-col gap-3 bg-card-dark p-6">
              <span className={MT}>{title}</span>
              <p className={MU}>{line}</p>
              <div>
                {bullets.map((b) => (
                  <div key={b} className={`flex items-start gap-[10px] border-t ${LINE} py-[10px] ${SM}`}>
                    <span className="mt-[6px] h-2 w-2 shrink-0 bg-amber" />
                    {b}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </Section>
  )
}

function Silent() {
  return (
    <Section>
      <Panel tag="rius">
        <div className="grid grid-cols-1 gap-px bg-embed-line md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div className="bg-card-dark px-5 py-10 md:px-8 md:py-16">
            <h2 className={H2}>
              <span className="text-amber">Some of the silent failures</span> that Rius would have caught for you.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-px bg-embed-line md:grid-cols-2">
            {SILENT.map(([kick, title, text]) => (
              <div key={title} className="flex flex-col gap-3 bg-card-dark p-6">
                <span className={KICK}>{kick}</span>
                <p className="text-[20px] leading-[26px]">{title}</p>
                <p className={`text-[14px] leading-[19.6px] ${MU}`}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </Section>
  )
}

function Install({ slug }) {
  const [lang, setLang] = useState('python')
  const [copied, setCopied] = useState(false)
  const copy = () => {
    const txt = INSTALL[lang]
    const done = () => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    }
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(txt).then(done, done)
    else done()
  }
  return (
    <Section id="rcx-install">
      <Panel>
        <Header heading="Instrument your agent in 2 minutes." sub="No servers, no collector, no database. Paste one prompt into your coding agent and it wires up the Rius SDK for you." />
        <div className={`border-t ${LINE} bg-deep`}>
          <div className={`flex items-center gap-6 border-b ${LINE} px-5 font-mono text-[14px] uppercase leading-[18px] tracking-[0.06em]`} role="tablist">
            {['python', 'typescript'].map((l) => (
              <button
                key={l}
                type="button"
                role="tab"
                aria-selected={lang === l}
                onClick={() => setLang(l)}
                className={`border-b-[3px] pb-[14px] pt-[18px] uppercase ${lang === l ? 'border-amber text-cream' : `border-transparent ${MU} hover:text-cream`}`}
              >
                {l}
              </button>
            ))}
            <span className="ml-auto hidden text-muted md:inline">install prompt</span>
            <button type="button" onClick={copy} className="ml-auto bg-amber px-3 py-[6px] font-bold uppercase tracking-[0.06em] text-deep hover:bg-cream md:ml-0">
              {copied ? 'copied' : 'copy'}
            </button>
          </div>
          <pre className="m-0 whitespace-pre-wrap break-words bg-deep px-5 py-6 font-mono text-[14px] leading-[22px] tracking-normal text-cream">
            {INSTALL[lang]}
          </pre>
          <div className={`grid grid-cols-1 gap-px border-t ${LINE} bg-embed-line md:grid-cols-3`}>
            {['Sign up and copy your API key.', 'Paste the prompt into Claude Code, Cursor or any coding agent.', 'Run your agent. Traces and incidents show up in Rius.'].map((s, i) => (
              <div key={s} className="flex items-start gap-3 bg-card-dark p-5">
                <Num>{String(i + 1).padStart(2, '0')}</Num>
                <span>{s}</span>
              </div>
            ))}
          </div>
          <div className={`flex flex-wrap items-center gap-4 border-t ${LINE} p-5`}>
            <PrimaryButton label="get your API key" href={SIGNUP(slug)} />
            <span className={`${ML} ${MU}`}>1 month free, then $19/mo</span>
          </div>
        </div>
      </Panel>
    </Section>
  )
}

const SPLIT_COLS = {
  even: 'md:grid-cols-2',
  textLeft: 'md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]',
  imageLeft: 'md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]',
}

function Split({ s }) {
  const image = (
    <div className="flex p-3">
      <div className="self-center bg-black">
        <img src={s.image[0]} alt={s.image[1]} className="block h-auto w-full" />
      </div>
    </div>
  )
  const text = (
    <div className="flex items-center px-5 py-10 md:px-8 md:py-16">
      <div className="flex flex-col gap-[15px]">
        <h2 className={H2}>{s.heading}</h2>
        {s.body.map((p) => (
          <p key={p} className={MU}>
            {p}
          </p>
        ))}
        {s.flow && <Flow steps={s.flow} />}
      </div>
    </div>
  )
  return (
    <Section>
      <Panel tag="rius">
        <div className={`grid grid-cols-1 ${SPLIT_COLS[s.layout]}`}>
          {s.layout === 'textLeft' ? (
            <>
              {text}
              {image}
            </>
          ) : (
            <>
              {image}
              {text}
            </>
          )}
        </div>
      </Panel>
    </Section>
  )
}

const OTEL_YAML = `exporters:
  otlphttp/langfuse:
    endpoint: https://cloud.langfuse.com/api/public/otel
    headers:
      authorization: Basic \${env:LANGFUSE_BASIC_AUTH}
  otlphttp/rius:
    endpoint: https://ingest.eu.console.rius-glassflow.com
    headers:
      authorization: Bearer \${env:RIUS_API_KEY}
service:
  pipelines:
    traces:
      exporters: [otlphttp/langfuse, otlphttp/rius]`

const SDK_MAP = [
  ['@observe()', '@rius.observe'],
  ['span.update(input=.., output=..)', 'span.set_input(..) / set_output(..)'],
  ['propagate_attributes(session_id)', 'with rius.session(session_id):'],
  ['public key + secret key', 'one API key'],
]

function SideBySide() {
  const code = `m-0 overflow-x-auto whitespace-pre bg-deep p-5 font-mono text-[12px] leading-[20px] tracking-normal text-cream`
  const more = 'mt-auto font-mono text-[14px] font-medium tracking-[-0.32px] text-amber no-underline'
  return (
    <Section>
      <Panel tag="rius">
        <div className="flex flex-col gap-[15px] p-8">
          <h2 className={H2}>
            Run both side by side. <span className="text-amber">Compare what each catches.</span>
          </h2>
          <p className={MU}>Route the same traces to Langfuse and Rius for a week. Langfuse keeps running until you decide.</p>
        </div>
        <div className={`grid grid-cols-1 gap-px border-t ${LINE} bg-embed-line md:grid-cols-2`}>
          <div className="flex flex-col bg-card-dark">
            <Bar tag="01" />
            <div className="flex flex-1 flex-col gap-[10px] p-6">
              <p className={MT}>Already on OpenTelemetry? Dual-export.</p>
              <p className={MU}>Using OpenLLMetry, OpenInference or a vanilla OTel SDK? Add Rius as a second exporter in your OpenTelemetry Collector. Langfuse keeps receiving every trace.</p>
              <pre className={code}>
                <span className="text-muted"># otel-collector.yaml</span>
                {'\n'}
                {OTEL_YAML}
              </pre>
              <a target="_blank" rel="noopener" href={MIGRATE} className={more}>
                read the migration guide →
              </a>
            </div>
          </div>
          <div className="flex flex-col bg-card-dark">
            <Bar tag="02" />
            <div className="flex flex-1 flex-col gap-[10px] p-6">
              <p className={MT}>On the Langfuse SDK? Swap the decorators.</p>
              <p className={MU}>The Langfuse SDK can't send to Rius directly. The Rius SDK uses the same patterns, so the switch is mechanical.</p>
              <pre className={code}>
                <span className="text-muted">{'# Langfuse SDK'.padEnd(34)}# Rius SDK</span>
                {SDK_MAP.map(([a, b]) => (
                  <span key={a}>
                    {'\n'}
                    {a.padEnd(34)}
                    <span className="text-amber">→</span> {b}
                  </span>
                ))}
              </pre>
              <a target="_blank" rel="noopener" href={MIGRATE} className={more}>
                see all sdk differences →
              </a>
            </div>
          </div>
        </div>
      </Panel>
    </Section>
  )
}

const fmt = (n) => '$' + Math.round(n).toLocaleString('en-US')

// Self-host cost calculator (§5.4): exact inputs, data and formulas from the live script.
function SelfHostCalc({ c, slug, acc }) {
  const [rate, setRate] = useState(65)
  const [mode, setMode] = useState('prod')
  const i = mode === 'prod' ? 0 : 1
  const o = useMemo(() => {
    const sh = c.data.setup.reduce((a, x) => a + x[i], 0)
    const mh = c.data.maint.reduce((a, x) => a + x[i], 0)
    const setupM = (sh * rate) / 12
    const maintM = mh * rate
    const infra = c.data.infra[mode]
    const total = setupM + maintM + infra
    return { sh, mh, setupM, maintM, infra, total }
  }, [c, i, mode, rate])

  const pr = `flex items-center justify-between gap-3 border-t ${LINE} px-3 py-[14px] font-mono text-[14px] font-medium leading-[19.6px] tracking-[-0.32px]`
  const val = 'bg-panel px-[6px] py-[2px] text-right font-bold'
  const est = <span className="mr-2 border border-current px-[6px] py-px font-mono text-[10px] font-medium leading-[14px] tracking-[0.06em] text-amber">ESTIMATE</span>
  const detailRow = `flex items-center justify-between gap-3 border-t ${LINE} py-[10px] pl-6 pr-3 font-mono text-[13px] leading-[19.6px] tracking-[-0.32px]`
  const price = 'text-[40px] leading-[44px] tracking-[-1.6px]'
  const small = 'font-mono text-[16px] tracking-normal text-cream'
  const promo = 'self-stretch bg-promo px-[10px] py-[6px] font-mono text-[14px] font-bold lowercase leading-[24px] tracking-[-0.32px] text-white'
  const rowBtn = `flex min-h-[44px] items-center justify-center border-t ${LINE} bg-amber font-mono text-[14px] font-medium tracking-[-0.32px] text-deep no-underline`
  const isArize = slug === 'arize'

  const selfCard = (
    <div className="flex flex-col bg-card-dark">
      <Bar tag={isArize ? undefined : 'self-hosted langfuse'} />
      <div className="flex flex-col gap-[10px] p-6">
        <p className={H3}>{c.selfName}</p>
        <p className={price}>
          {fmt(o.total)}
          <small className={small}> /mo</small>
        </p>
        {c.selfCov && <span className="block bg-ok-bg px-[10px] py-2 font-mono text-[13px] font-bold leading-[18px] tracking-[-0.2px] text-ok-text">{c.selfCov}</span>}
        <p className={`${SM} ${isArize ? MU : ''}`}>Year one, setup spread over 12 months.</p>
      </div>
      <div className={pr}>
        <span>{est}setup · {o.sh} h{isArize ? '' : ' one-time'}</span>
        <span className={val}>{fmt(o.setupM)}/mo</span>
      </div>
      <div className={pr}>
        <span>{est}{isArize ? 'maint' : 'maintenance'} · {o.mh} h/mo</span>
        <span className={val}>{fmt(o.maintM)}/mo</span>
      </div>
      <div className={pr}>
        <span>{est}infrastructure</span>
        <span className={val}>{fmt(o.infra)}/mo</span>
      </div>
      {[
        [c.detailTitles[0], c.setupLabels.map((l, j) => [l, `${c.data.setup[j][i]} h`])],
        [c.detailTitles[1], c.maintLabels.map((l, j) => [l, `${c.data.maint[j][i]} h`])],
        [c.detailTitles[2], c.infraLines[mode].map(([l, p]) => [l, `$${p}`])],
      ].map(([title, lines]) => (
        <Details key={title} title={title} small open={acc.open === title} onToggle={() => acc.toggle(title)}>
          {lines.map(([l, v]) => (
            <div key={l} className={detailRow}>
              <span>{l}</span>
              <span className={val}>{v}</span>
            </div>
          ))}
        </Details>
      ))}
      {!isArize && <p className={`px-6 py-3 font-mono text-[12px] leading-[18px] tracking-normal ${MU}`}>{c.note}</p>}
    </div>
  )

  const riusCard = (
    <div className={`flex flex-col ${isArize ? 'bg-embed-hi' : 'bg-card-dark'}`}>
      <Bar tag={isArize ? undefined : 'rius'} />
      <div className="flex flex-col gap-[10px] p-6">
        <p className={H3}>Rius Core</p>
        <p className={price}>
          $19<small className={small}> /mo</small>
        </p>
        {isArize ? (
          <span className="block bg-ok-bg px-[10px] py-2 font-mono text-[13px] font-bold leading-[18px] tracking-[-0.2px] text-ok-text">Covers 100k spans · 500k included</span>
        ) : (
          <p className={SM}>Managed. 0 h setup beyond the SDK, 0 h maintenance, $0 infrastructure.</p>
        )}
        <span className={promo}>try 1 month for free</span>
      </div>
      <a target="_blank" rel="noopener" href={SIGNUP(slug)} className={rowBtn}>
        get started
      </a>
      {(isArize
        ? [['retention', '60d'], ['setup · maintenance', '0 h'], ['alerts', 'unlimited'], ['RCAs', '10/mo']]
        : [['spans incl.', '500k'], ['overage per 1m spans', '$14'], ['query retention', '60d'], ['silent failures · rca · heartbeat · mcp', 'incl.']]
      ).map(([l, v]) => (
        <div key={l} className={pr}>
          <span>{l}</span>
          <span className={val}>{v}</span>
        </div>
      ))}
      <div className={`${pr} bg-deep`}>
        <span className="text-amber">
          {isArize ? `vs Phoenix: you save ${fmt(o.total - 19)}/mo` : `you save ${fmt(o.total - 19)}/mo · ${fmt((o.total - 19) * 12)}/year`}
        </span>
      </div>
    </div>
  )

  const axCard = (name, priceVal, cov, rows) => (
    <div className="flex flex-col bg-card-dark">
      <Bar />
      <div className="flex flex-col gap-[10px] p-6">
        <p className={H3}>{name}</p>
        <p className={price}>
          <s className="text-cream-64 decoration-strike decoration-[3px]">{priceVal}</s>
          <small className={small}> /mo</small>
        </p>
        <span className="block bg-no-bg px-[10px] py-2 font-mono text-[13px] font-bold leading-[18px] tracking-[-0.2px] text-no-text">{cov}</span>
      </div>
      {rows.map(([l, v]) => (
        <div key={l} className={pr}>
          <span>{l}</span>
          <span className={val}>{v}</span>
        </div>
      ))}
    </div>
  )

  return (
    <Section>
      <Panel>
        <Header heading={c.heading} sub={c.sub} />
        {c.volume && (
          <div className={`flex flex-wrap items-baseline gap-4 border-t ${LINE} bg-deep px-8 py-5`}>
            <span className={MT}>volume</span>
            <span className={price}>
              100k <small className={small}>spans / month</small>
            </span>
          </div>
        )}
        <div className={`grid grid-cols-1 gap-px border-t ${LINE} bg-embed-line md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]`}>
          <div className="flex flex-col gap-2 bg-panel px-8 py-6">
            <label htmlFor={`rcx-rate-${slug}`} className={MT}>
              {c.rateLabel}
            </label>
            <output htmlFor={`rcx-rate-${slug}`} aria-live="polite" className={price}>
              ${rate}/h
            </output>
            <input
              id={`rcx-rate-${slug}`}
              type="range"
              min="10"
              max="100"
              step="5"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="m-0 h-11 w-full cursor-pointer accent-amber"
            />
            <div className={`flex justify-between ${ML} ${MU}`}>
              <span>$10</span>
              <span>$100</span>
            </div>
          </div>
          <fieldset className="m-0 flex flex-col justify-center gap-3 border-0 bg-panel px-8 py-6">
            <legend className={`float-left mb-1 p-0 ${MT}`}>{c.infraLabel}</legend>
            {[
              ['prod', 'production · AWS managed'],
              ['lean', 'lean · single VM'],
            ].map(([v, l]) => (
              <label key={v} className="clear-both flex min-h-8 cursor-pointer items-center gap-[10px] font-mono text-[14px] tracking-[-0.32px]">
                <input type="radio" name={`rcx-infra-${slug}`} value={v} checked={mode === v} onChange={() => setMode(v)} className="m-0 h-[18px] w-[18px] accent-amber" />
                {l}
              </label>
            ))}
          </fieldset>
        </div>
        <div className={`grid grid-cols-1 gap-px border-t ${LINE} bg-embed-line ${isArize ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2'}`}>
          {isArize ? (
            <>
              {riusCard}
              {selfCard}
              {axCard('Arize AX Free', '$0', 'Limited to 25k spans per month', [['retention', '15d'], ['ingestion', '1 GB/mo'], ['Signal issues', '10/mo']])}
              {axCard('Arize AX Pro', '$50', 'Limited to 50k spans per month', [['retention', '30d'], ['ingestion', '10 GB/mo'], ['Signal issues', '25/mo'], ['overage', 'price not published']])}
            </>
          ) : (
            <>
              {selfCard}
              {riusCard}
            </>
          )}
        </div>
        {isArize && <p className={`px-6 py-3 font-mono text-[12px] leading-[18px] tracking-normal ${MU}`}>{c.note}</p>}
      </Panel>
    </Section>
  )
}

function BetterPick({ b, slug }) {
  return (
    <Section>
      <Panel>
        <Header heading={b.heading} sub={b.sub} />
        <div className={`grid grid-cols-1 gap-px border-t ${LINE} bg-embed-line md:grid-cols-3`}>
          {b.cards.map(([t, p], i) => (
            <div key={t} className="flex flex-col gap-[10px] bg-card-dark p-6">
              <span className="self-start">
                <Num>{String(i + 1).padStart(2, '0')}</Num>
              </span>
              <p className={MT}>{t}</p>
              <p className={MU}>{p}</p>
            </div>
          ))}
        </div>
        <div className={`flex flex-wrap items-center justify-between gap-6 border-t ${LINE} bg-deep px-5 py-6 md:px-8 md:py-7`}>
          <p className={`max-w-[760px] ${LEAD}`}>{b.closing}</p>
          <PrimaryButton label="try 1 month free" href={SIGNUP(slug)} />
        </div>
      </Panel>
    </Section>
  )
}

function FaqBlock({ items, acc }) {
  return (
    <Section>
      <div className="py-8">
        <h2 className={`${H2} mb-8 text-center`}>Common questions</h2>
        <div className="mx-auto max-w-[900px]">
          {items.map(([q, a]) => (
            <Details key={q} title={q} open={acc.open === q} onToggle={() => acc.toggle(q)}>
              <p className="px-6 pb-[22px] text-[16px] leading-[19.2px]">{a}</p>
            </Details>
          ))}
        </div>
      </div>
    </Section>
  )
}

export default function Alternatives({ vendor }) {
  const d = PAGES[vendor]
  // On the live page every <details> (calculator breakdowns and FAQ) shares name="rcx-acc",
  // so at most one is open at a time across the whole page.
  const [open, setOpen] = useState(null)
  const acc = { open, toggle: (k) => setOpen((o) => (o === k ? null : k)) }

  useEffect(() => {
    document.title = d.docTitle
  }, [d])

  return (
    <div className="lg:px-16">
      <div className={`mx-auto ${d.width} bg-page font-inter text-[16px] leading-[22.4px] tracking-[-0.64px] text-cream antialiased`}>
        <Hero d={d} />
        <Logos />
        <Quote />
        <Comparison d={d} />
        <Stops s={d.stops} />
        <Silent />
        {d.install && <Install slug={d.slug} />}
        {d.splits.map((s) => (
          <Split key={s.heading} s={s} />
        ))}
        {d.sideBySide && <SideBySide />}
        <SelfHostCalc c={d.calc} slug={d.slug} acc={acc} />
        {d.betterPick && <BetterPick b={d.betterPick} slug={d.slug} />}
        <FaqBlock items={d.faq} acc={acc} />
      </div>
    </div>
  )
}
