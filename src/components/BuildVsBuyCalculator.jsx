import { useMemo, useState } from 'react'

// "Build your own agent observability vs Rius" calculator (specs/products.md §6).
// Data and formulas transcribed from §6.3. System font stacks and the calculator's own tokens
// (calc-*) per §6.1. Defaults (100k, Mid, Typical, 50 KB, Supabase, Railway) give
// $943/mo vs $19/mo and "You save $924/mo · $11,087/year with Rius".

const RESEARCH_HOURS = { build: 12, maint: 0 }
const CORE_FEATURES = [
  { name: 'Agent SDK', build: 8, maint: 0.5, tip: 'Covers a single SDK for one language (e.g. Python or TypeScript). Supporting additional languages requires additional build time.' },
  { name: 'Event ingestion API', build: 12, maint: 1.0 },
  { name: 'Telemetry storage', build: 6, maint: 0.5, tip: 'Schema, persistence and basic querying for trace data using the selected database.' },
  { name: 'Trace reconstruction', build: 10, maint: 0.5 },
  { name: 'Runs list UI', build: 8, maint: 0.5 },
  { name: 'Trace viewer UI', build: 16, maint: 1.0, tip: 'Basic trace hierarchy, span details, inputs/outputs, errors and timing.' },
  { name: 'Basic authentication', build: 8, maint: 0.5 },
  { name: 'API keys', build: 6, maint: 0.5 },
  { name: 'Alerts', build: 12, maint: 0.75, tip: 'Basic rule-based alerts with configurable thresholds and notifications.' },
  { name: 'Cost and token tracking', build: 8, maint: 0.5 },
]
const OPTIONAL = [
  { id: 'heartbeat', group: 'Observability', name: 'Heartbeat / frozen agent detection', build: 16, maint: 1.0 },
  { id: 'workspaces', group: 'Multi-tenancy', name: 'Workspaces', build: 20, maint: 1.0 },
  { id: 'organizations', group: 'Multi-tenancy', name: 'Organizations', build: 16, maint: 0.75 },
  { id: 'roles_permissions', group: 'Multi-tenancy', name: 'Roles and permissions', build: 24, maint: 1.0 },
  { id: 'data_regions', group: 'Platform', name: 'Data regions', build: 40, maint: 2.0 },
  { id: 'cicd', group: 'Operations', name: 'CI/CD pipeline', build: 16, maint: 1.0 },
  { id: 'backup_recovery', group: 'Operations', name: 'Backup and recovery', build: 12, maint: 1.0 },
]
const GROUPS = ['Observability', 'Multi-tenancy', 'Platform', 'Operations']
const AI_MODES = {
  conservative: { label: 'Conservative', multBuild: 0.85, multMaint: 0.9, sub: ['15% faster build', '10% faster maintenance'] },
  typical: { label: 'Typical', multBuild: 0.75, multMaint: 0.85, sub: ['25% faster build', '15% faster maintenance'] },
  ai_native: { label: 'AI-native', multBuild: 0.55, multMaint: 0.8, sub: ['45% faster build', '20% faster maintenance'] },
}
const SENIORITY = {
  junior: { label: 'Junior engineer', rate: 40, timeMult: 1.5 },
  mid: { label: 'Mid-level engineer', rate: 65, timeMult: 1.0 },
  senior: { label: 'Senior engineer', rate: 90, timeMult: 0.75 },
}
const TRACE_PRESETS = [10, 100, 500, 1000, 2000, 5000]
const TRACE_SIZE_KB = { light: { label: 'Light', kb: 10 }, typical: { label: 'Typical', kb: 50 }, heavy: { label: 'Heavy', kb: 200 } }
const RETENTION_DAYS = 30
const DB = {
  supabase: { label: 'Supabase / Neon', brand: 'Supabase', sub: 'Managed — Free → Pro → Team', tiers: [[2, 0, 'Free'], [50, 25, 'Pro'], [300, 250, 'Pro + storage add-on'], [1000, 599, 'Team'], [Infinity, 1299, 'Enterprise']] },
  rds: { label: 'AWS RDS / Cloud SQL', brand: 'AWS RDS', sub: 'Scales by instance size', tiers: [[10, 18, 'db.t3.micro'], [50, 50, 'db.t3.small'], [200, 130, 'db.t3.medium'], [Infinity, 280, 'db.m5.large']] },
  selfpg: { label: 'Self-hosted Postgres', brand: 'Self-hosted', sub: 'Hetzner or DigitalOcean VPS', tiers: [[10, 6, '2 GB VPS'], [50, 12, '4 GB VPS'], [Infinity, 24, '8 GB VPS']] },
}
const HOSTING = {
  railway: { label: 'Managed', brand: 'Railway', sub: 'Railway / Render', tiers: [[500, 7], [2000, 20], [Infinity, 50]] },
  ecs: { label: 'Cloud Provider', brand: 'AWS ECS', sub: 'AWS ECS / Cloud Run', tiers: [[300, 18], [1000, 36], [Infinity, 85]] },
  hetzner: { label: 'Self-hosted VPS', brand: 'Hetzner', sub: 'Hetzner or DigitalOcean', tiers: [[500, 6], [2000, 12], [Infinity, 24]] },
}
const OPS_OVERHEAD = [[100, 2], [500, 3], [1000, 4], [2000, 5], [Infinity, 6]]
const QUERY_COMPUTE = [[10, 0], [100, 5], [500, 15], [1000, 30], [2000, 60], [Infinity, 120]]
const RIUS_TIERS = [
  [100, { key: 'core', name: 'Rius Core', price: 19 }],
  [500, { key: 'growth', name: 'Rius Growth', price: 79 }],
  [2000, { key: 'pro', name: 'Rius Pro', price: 249 }],
  [Infinity, { key: 'enterprise', name: 'Rius Enterprise', price: 1999 }],
]
const TIER_FEATURE_PRESETS = {
  core: [],
  growth: ['heartbeat'],
  pro: ['heartbeat', 'workspaces', 'roles_permissions'],
  enterprise: ['heartbeat', 'workspaces', 'organizations', 'roles_permissions', 'data_regions', 'backup_recovery', 'cicd'],
}
const CORE_HIGHLIGHTS = ['48h support response', 'SLA available as add-on']
const TIER_HIGHLIGHTS = {
  core: CORE_HIGHLIGHTS,
  growth: [...CORE_HIGHLIGHTS, 'Dedicated Slack as add-on'],
  pro: ['24h support response', 'Dedicated Slack included', '1y audit logs included'],
  enterprise: ['SLA included (99.9% uptime)', 'Dedicated Slack included', 'White-glove onboarding', 'Custom audit logs & retention', 'Choose your own data region'],
}
// §6.2 assumptions list: the spec gives an outline only; rendered as that outline.
const ASSUMPTIONS = [
  'Database cost follows data volume: ingest GB = traces × average trace size; stored GB = ingest / 30 × 30 retention days.',
  'Hosting cost scales with monthly trace count.',
  'Provider prices are list prices and vary by region and contract.',
  'The self-built feature set automatically matches the Rius tier it is compared with.',
  'A flat 12 hours of research and evaluation is included in the build.',
  'Security hardening is excluded.',
  'Rius plan entitlements are shown as highlights, not as hours.',
  'MCP features are not modelled.',
  'AI acceleration multipliers are estimates.',
  'Operational overhead scales with trace volume and is not reduced by AI acceleration.',
  'Query compute covers the cost of serving dashboard and trace queries at this volume.',
]
const GET_STARTED = 'https://eu.console.rius-glassflow.com'

const pick = (table, v) => table.find(([max]) => v <= max)
const money = (n) => '$' + Math.round(n).toLocaleString('en-US')
// Live helpers: fmtHours rounds to one decimal and drops ".0"; preset/summary hours use whole build hours.
const fmtHours = (n) => {
  const r = Math.round(n * 10) / 10
  return r % 1 === 0 ? r.toFixed(0) : r.toFixed(1)
}
const r1 = (n) => Math.round(n * 10) / 10
const fmtGB = (n) => String(Math.round(n * 10) / 10)
const fmtMult = (n) => String(Math.round(n * 100) / 100)
const fmtTraces = (k) => (k >= 1000 ? `${k / 1000}M` : `${k}k`)
const riusTier = (k) => pick(RIUS_TIERS, k)[1]

export function computeCost({ traces, seniority, mode, selected, size, db, hosting }) {
  const sen = SENIORITY[seniority]
  const m = AI_MODES[mode]
  const buildMult = sen.timeMult * m.multBuild
  const maintMult = sen.timeMult * m.multMaint
  const opt = OPTIONAL.filter((f) => selected.includes(f.id))
  const sum = (list, k) => list.reduce((a, f) => a + f[k], 0)
  const totals = {
    build: RESEARCH_HOURS.build + sum(CORE_FEATURES, 'build') + sum(opt, 'build'),
    maint: sum(CORE_FEATURES, 'maint') + sum(opt, 'maint'),
  }
  const effBuild = totals.build * buildMult
  const effMaint = totals.maint * maintMult
  const rate = sen.rate
  const buildTotal = effBuild * rate
  const buildAmortised = buildTotal / 12
  const featureMaint = effMaint * rate
  const opsHours = pick(OPS_OVERHEAD, traces)[1]
  const ops = opsHours * rate
  const engineering = buildAmortised + featureMaint + ops
  const ingestGB = (traces * 1000 * TRACE_SIZE_KB[size].kb) / 1048576
  const storedGB = (ingestGB / RETENTION_DAYS) * RETENTION_DAYS
  const [, dbPrice, dbTier] = pick(DB[db].tiers, storedGB)
  const hostPrice = pick(HOSTING[hosting].tiers, traces)[1]
  const query = pick(QUERY_COMPUTE, traces)[1]
  const infra = dbPrice + hostPrice + query
  const total = infra + engineering
  const tier = riusTier(traces)
  const diff = total - tier.price
  return {
    buildMult, maintMult, totals, effBuild, effMaint, rate, buildTotal, buildAmortised, featureMaint,
    opsHours, ops, engineering, ingestGB, storedGB, dbPrice, dbTier, hostPrice, query, infra, total,
    tier, diff, selfCheaper: diff < 0, yearly: Math.abs(diff) * 12,
  }
}

/* Preset, pill, provider and advanced-toggle buttons reset to font-family:inherit (system stack) live.
   Class roles mirror the live embed's stylesheet (.rius-calculator-root). Nothing there sets a
   line-height, so the root resets to `normal` and the 12px size the Framer wrapper passes down. */
const MONO = 'font-sys-mono'
const SECTION_LABEL = `${MONO} mb-[10px] text-[11px] font-bold uppercase tracking-[0.06em] text-calc-muted`
const QUESTION = `${MONO} mb-[10px] text-[13.5px] font-bold text-cream`
const NOTE = 'text-[11px] leading-[1.5] text-calc-muted'
const BOX = 'rounded-[4px] border border-calc-border'
const PRESET = (on) =>
  `flex-[1_1_80px] cursor-pointer rounded-[4px] border px-[10px] py-3 text-center ${on ? 'border-amber bg-calc-accent-bg' : 'border-calc-border bg-page'}`
const PB_LABEL = (on) => `text-[13.5px] font-extrabold ${on ? 'text-amber' : 'text-cream'}`
const PB_SUB = 'mt-[3px] text-[10.5px] text-calc-muted'
const PILL = (on) =>
  `flex-1 cursor-pointer rounded-[3px] border px-[6px] py-2 text-center text-[12px] font-semibold ${on ? 'border-amber bg-calc-accent-bg text-amber' : 'border-calc-border bg-page text-calc-secondary'}`
const PROVIDER = (on) =>
  `cursor-pointer rounded-[4px] border px-[11px] py-[10px] text-left ${on ? 'border-amber bg-calc-accent-bg' : 'border-calc-border bg-page'}`
const BD_FLEX = `${MONO} flex justify-between`
const BD_ROW = `${BD_FLEX} py-[3px] text-[13px]`
const BD_DETAIL = `${BD_FLEX} py-[3px] text-[12.5px] text-calc-secondary`
const BD_GROUP = `${MONO} mb-2 text-[11px] font-bold uppercase tracking-[0.06em] text-calc-muted`
const BD_SUB = `${BD_FLEX} -mx-2 rounded-[3px] bg-page px-2 py-[6px] text-[13px] font-bold`
const BD_TOTAL = `${BD_FLEX} py-[3px] text-[15px] font-extrabold`
const SUMMARY_BAR = 'mt-3 rounded-[3px] bg-page px-[14px] py-3 text-center text-[13px] font-bold'

function Tip({ text }) {
  return (
    <span className="group relative ml-[6px] inline-flex items-center align-middle">
      <span className="inline-flex h-[13px] w-[13px] cursor-help items-center justify-center rounded-full border border-calc-border font-sys text-[10.5px] leading-none text-calc-muted">
        ⓘ
      </span>
      <span className="pointer-events-none invisible absolute bottom-[135%] left-1/2 z-20 w-[220px] -translate-x-1/2 rounded-[4px] border border-calc-border bg-page px-[10px] py-2 font-sys text-[11px] font-normal normal-case leading-[1.5] text-cream opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100">
        {text}
      </span>
    </span>
  )
}

// `follows` = preceded by another row (live: .feat-row + .feat-row { margin-top: 2px }).
function FeatRow({ core, follows, check, name, hours }) {
  return (
    <div className={`flex items-center gap-[10px] rounded-[3px] px-[10px] py-[9px] text-[13px] ${follows ? 'mt-[2px]' : ''} ${core ? 'bg-page' : ''}`}>
      <span className="flex flex-[0_0_18px] items-center justify-center">{check}</span>
      <span className={`${MONO} flex-auto font-semibold`}>{name}</span>
      <span className={`${MONO} flex-none whitespace-nowrap text-right text-[11.5px] text-calc-muted`}>{hours}</span>
    </div>
  )
}

export default function BuildVsBuyCalculator() {
  const [traces, setTraces] = useState(100)
  const [seniority, setSeniority] = useState('mid')
  const [mode, setMode] = useState('typical')
  const [selected, setSelected] = useState(TIER_FEATURE_PRESETS.core)
  const [size, setSize] = useState('typical')
  const [db, setDb] = useState('supabase')
  const [hosting, setHosting] = useState('railway')
  const [assumptionsOpen, setAssumptionsOpen] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const c = useMemo(
    () => computeCost({ traces, seniority, mode, selected, size, db, hosting }),
    [traces, seniority, mode, selected, size, db, hosting],
  )

  const chooseTraces = (k) => {
    const next = riusTier(k).key
    if (next !== riusTier(traces).key) setSelected(TIER_FEATURE_PRESETS[next])
    setTraces(k)
  }
  const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const sen = SENIORITY[seniority]
  const m = AI_MODES[mode]
  const combo = `${sen.label} + ${m.label} AI acceleration`
  const coreBuild = RESEARCH_HOURS.build + CORE_FEATURES.reduce((a, f) => a + f.build, 0)
  const coreMaint = CORE_FEATURES.reduce((a, f) => a + f.maint, 0)
  const featureCount = CORE_FEATURES.length + selected.length
  const dbWarning =
    db === 'supabase' && c.dbPrice > 0
      ? c.dbTier === 'Pro'
        ? 'Free tier exceeded at this data volume — Pro plan required at $25/mo'
        : `At this data volume the ${c.dbTier} plan is required at $${c.dbPrice}/mo`
      : ''

  return (
    <div className="bg-panel font-sys text-[12px] leading-[normal] tracking-normal text-cream antialiased">
      {/* hero */}
      <section className="bg-panel pb-16 pt-[88px] text-center">
        <div className="mx-auto max-w-[720px] px-5">
          <h1 className="mb-4 text-[34px] font-extrabold leading-[1.25]">Is building your own agent observability cheaper than Rius?</h1>
        </div>
      </section>

      {/* assumptions */}
      <section className="bg-page py-7">
        <div className="mx-auto max-w-[1120px] px-5">
          <div className={`mx-auto max-w-[760px] bg-panel px-6 py-[18px] ${BOX}`}>
            <button
              type="button"
              aria-expanded={assumptionsOpen}
              onClick={() => setAssumptionsOpen((o) => !o)}
              className={`flex w-full cursor-pointer items-center justify-between p-0 ${MONO} text-[15px] font-extrabold text-cream`}
            >
              <span>Assumptions behind this estimate</span>
              <span className="text-[13px] text-amber">{assumptionsOpen ? '▴' : '▾'}</span>
            </button>
            {assumptionsOpen && (
              <ul className="m-0 mt-[14px] list-disc pl-5">
                {ASSUMPTIONS.map((a) => (
                  <li key={a} className="text-[13.5px] leading-[1.7] text-cream">
                    {a}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* calculator */}
      <section className="py-14">
        <div className="mx-auto max-w-[1120px] px-5">
          <div className="grid grid-cols-1 items-start gap-7 min-[901px]:grid-cols-2">
            {/* inputs */}
            <div className="min-w-0">
              <h2 className={`${MONO} mb-4 text-[18px] font-extrabold`}>Inputs</h2>

              <div className="mb-6">
                <div className={SECTION_LABEL}>Monthly traces</div>
                <div className="flex flex-wrap gap-2">
                  {TRACE_PRESETS.map((k) => (
                    <button key={k} type="button" onClick={() => chooseTraces(k)} className={PRESET(traces === k)}>
                      <div className={PB_LABEL(traces === k)}>{fmtTraces(k)}</div>
                      <div className={PB_SUB}>traces/mo</div>
                    </button>
                  ))}
                </div>
                <p className={`${NOTE} mb-3 mt-[10px]`}>A trace typically represents one end-to-end agent or workflow execution.</p>
              </div>

              <div className="mb-6">
                <div className={QUESTION}>Who would build this internally?</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(SENIORITY).map(([k, s]) => (
                    <button key={k} type="button" onClick={() => setSeniority(k)} className={PRESET(seniority === k)}>
                      <div className={PB_LABEL(seniority === k)}>{s.label}</div>
                      <div className={PB_SUB}>~${s.rate}/hr</div>
                      <div className={PB_SUB}>
                        {Math.round(c.totals.build * s.timeMult * m.multBuild)}h build · {r1(c.totals.maint * s.timeMult * m.multMaint)}h/mo maint
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className={QUESTION}>How much does AI coding accelerate your team?</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(AI_MODES).map(([k, a]) => (
                    <button key={k} type="button" onClick={() => setMode(k)} className={PRESET(mode === k)}>
                      <div className={PB_LABEL(mode === k)}>{a.label}</div>
                      {a.sub.map((s) => (
                        <div key={s} className={PB_SUB}>
                          {s}
                        </div>
                      ))}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                aria-expanded={advancedOpen}
                onClick={() => setAdvancedOpen((o) => !o)}
                className={`mb-6 block w-full cursor-pointer bg-page py-3 text-center ${BOX} text-[13px] font-bold text-amber`}
              >
                {advancedOpen ? 'Hide advanced settings ▲' : 'Advanced settings ▾'}
              </button>

              {advancedOpen && (
                <div className={`-mt-1 mb-6 bg-panel p-[18px] ${BOX}`}>
                  <div className={SECTION_LABEL}>What you'd need to build</div>
                  <p className={`${NOTE} -mt-1 mb-3`}>Estimates assume a functional internal implementation, not a production-grade commercial observability product.</p>
                  <div>
                    <FeatRow
                      core
                      check={<span className="text-[13px] font-extrabold text-calc-success">🔎</span>}
                      name="Research & evaluation (DB, hosting, architecture)"
                      hours={`${fmtHours(RESEARCH_HOURS.build * c.buildMult)}h build · –`}
                    />
                    {CORE_FEATURES.map((f) => (
                      <FeatRow
                        key={f.name}
                        core
                        follows
                        check={<span className="text-[13px] font-extrabold text-calc-success">✓</span>}
                        name={
                          <>
                            {f.name}
                            {f.tip && <Tip text={f.tip} />}
                          </>
                        }
                        hours={`${fmtHours(f.build * c.buildMult)}h build · ${fmtHours(f.maint * c.maintMult)}h/mo`}
                      />
                    ))}
                    <div className={SUMMARY_BAR}>
                      MVP core ({combo}): {Math.round(coreBuild * c.buildMult)}h build · {r1(coreMaint * c.maintMult)}h/mo maintenance
                    </div>
                  </div>
                  <div className="my-5 border-t border-calc-border" />
                  <div className={SECTION_LABEL}>Additional features</div>
                  <p className={`${NOTE} -mt-1 mb-3`}>Pre-selected to match the Rius tier your traces compare against — check or uncheck to customise.</p>
                  <div>
                    {GROUPS.map((g, gi) => (
                      <div key={g} className="mb-1">
                        <div className={`${MONO} mb-[6px] text-[11px] font-bold uppercase tracking-[0.05em] text-calc-muted ${gi ? 'mt-4' : ''}`}>{g}</div>
                        {OPTIONAL.filter((f) => f.group === g).map((f, i) => (
                          <FeatRow
                            key={f.id}
                            follows={i > 0}
                            check={
                              <input
                                type="checkbox"
                                aria-label={f.name}
                                checked={selected.includes(f.id)}
                                onChange={() => toggle(f.id)}
                                className="h-[15px] w-[15px] cursor-pointer accent-amber"
                              />
                            }
                            name={f.name}
                            hours={`${fmtHours(f.build * c.buildMult)}h build · ${fmtHours(f.maint * c.maintMult)}h/mo`}
                          />
                        ))}
                      </div>
                    ))}
                    <div className={SUMMARY_BAR}>
                      {featureCount} features selected · {Math.round(c.totals.build * c.buildMult)}h build · {r1(c.totals.maint * c.maintMult)}h/mo maintenance ({combo})
                    </div>
                  </div>
                  <div className="my-5 border-t border-calc-border" />
                  <div className={SECTION_LABEL}>Average trace size</div>
                  <div className="mb-5 mt-[10px] flex gap-2">
                    {Object.entries(TRACE_SIZE_KB).map(([k, s]) => (
                      <button key={k} type="button" onClick={() => setSize(k)} className={PILL(size === k)}>
                        {s.label} ({s.kb} KB)
                      </button>
                    ))}
                  </div>
                  <p className={`${NOTE} -mt-1 mb-3`}>
                    Avg. trace: {TRACE_SIZE_KB[size].kb} KB · Retention: {RETENTION_DAYS} days · 100% of traces retained
                  </p>
                  <div className={SECTION_LABEL}>Database</div>
                  <div className="mb-[6px] grid grid-cols-1 gap-[10px] min-[521px]:grid-cols-3">
                    {Object.entries(DB).map(([k, d]) => (
                      <button key={k} type="button" onClick={() => setDb(k)} className={PROVIDER(db === k)}>
                        <div className="text-[12.5px] font-bold leading-[1.3] text-cream">{d.label}</div>
                        <div className="mt-[3px] text-[10.5px] leading-[1.3] text-calc-muted">{d.sub}</div>
                        <div className="mt-[5px] min-h-[14px] text-[11px] font-bold text-calc-warning">{db === k ? c.dbTier : ''}</div>
                      </button>
                    ))}
                  </div>
                  <div className="mb-[18px] mt-1 min-h-[14px] text-[12px] font-semibold text-calc-warning">{dbWarning}</div>
                  <div className={SECTION_LABEL}>Hosting</div>
                  <div className="mb-[6px] grid grid-cols-1 gap-[10px] min-[521px]:grid-cols-3">
                    {Object.entries(HOSTING).map(([k, h]) => (
                      <button key={k} type="button" onClick={() => setHosting(k)} className={PROVIDER(hosting === k)}>
                        <div className="text-[12.5px] font-bold leading-[1.3] text-cream">{h.label}</div>
                        <div className="mt-[3px] text-[10.5px] leading-[1.3] text-calc-muted">{h.sub}</div>
                        <div className="mt-[5px] min-h-[14px] text-[11px] font-bold text-calc-warning">{hosting === k ? `$${c.hostPrice}/mo` : ''}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* results */}
            <div className="min-w-0 min-[901px]:sticky min-[901px]:top-5">
              <h2 className={`${MONO} mb-4 text-[18px] font-extrabold`}>Results</h2>
              <div className="mb-4 rounded-[4px] border border-amber bg-calc-accent-bg p-[18px]">
                <div className={SECTION_LABEL}>Rius vs Self-Built</div>
                <div className="mt-2 flex items-start justify-between gap-3">
                  <div className="flex-1 text-center">
                    <div className={`${MONO} mb-1 text-[11px] font-bold uppercase tracking-[0.04em] text-calc-secondary`}>Self-Built</div>
                    <div className={`text-[22px] font-extrabold ${c.selfCheaper ? 'text-calc-success' : 'text-calc-danger'}`}>{money(c.total)}/mo</div>
                  </div>
                  <div className={`${MONO} mt-[21px] flex-none text-[12px] font-bold text-calc-muted`}>vs</div>
                  <div className="flex-1 text-center">
                    <div className={`${MONO} mb-1 text-[11px] font-bold uppercase tracking-[0.04em] text-calc-secondary`}>{c.tier.name}</div>
                    <div className={`text-[22px] font-extrabold ${c.selfCheaper ? 'text-calc-danger' : 'text-calc-success'}`}>{money(c.tier.price)}/mo</div>
                    <ul className="m-0 mt-[10px] inline-flex list-none flex-col gap-1 p-0 text-left">
                      {TIER_HIGHLIGHTS[c.tier.key].map((h) => (
                        <li key={h} className={`${MONO} text-[10.5px] leading-[1.4] text-calc-secondary`}>
                          <span className="font-extrabold text-calc-success">✓ </span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {c.selfCheaper ? (
                  <div className="mt-[14px] rounded-[3px] border border-amber bg-calc-accent-bg px-3 py-[10px] text-center text-[13px] font-extrabold text-amber">
                    Self-built is {money(Math.abs(c.diff))}/mo · {money(c.yearly)}/year cheaper
                  </div>
                ) : (
                  <div className="mt-[14px] rounded-[3px] border border-calc-success bg-calc-success-bg px-3 py-[10px] text-center text-[13px] font-extrabold text-calc-success">
                    You save {money(c.diff)}/mo · {money(c.yearly)}/year with Rius
                  </div>
                )}
                <p className={`${MONO} mt-[10px] text-center text-[10.5px] leading-[1.6] text-calc-muted`}>
                  {fmtTraces(traces)} traces/mo · {TRACE_SIZE_KB[size].kb} KB avg. trace · {RETENTION_DAYS}-day retention · {sen.label} · {m.label} AI acceleration
                </p>
                <a
                  href={GET_STARTED}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-3 block rounded-[4px] bg-amber py-3 text-center ${MONO} text-[14px] font-extrabold text-panel no-underline`}
                >
                  Get started
                </a>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-[10px] min-[481px]:grid-cols-3">
                {[
                  ['Infrastructure', `${money(c.infra)}/mo`],
                  ['Engineering', `${money(c.engineering)}/mo`, `${fmtHours(c.effBuild)}h build · ${fmtHours(c.effMaint + c.opsHours)}h/mo ongoing`],
                  ['12-month effective monthly cost', `${money(c.total)}/mo`, 'Initial build amortized over 12 months + ongoing maintenance + infrastructure.'],
                ].map(([t, v, s]) => (
                  <div key={t} className={`bg-page p-[14px] ${BOX}`}>
                    <div className={`${MONO} mb-[6px] text-[11px] text-calc-secondary`}>{t}</div>
                    <div className="text-[19px] font-bold">{v}</div>
                    {s && <div className={`${MONO} mt-1 text-[10.5px] text-cream`}>{s}</div>}
                  </div>
                ))}
              </div>

              <div className={`${SECTION_LABEL} mt-1`}>Costs Breakdown</div>
              <div className={`mb-4 bg-panel p-5 ${BOX}`}>
                <div className={BD_GROUP}>Infrastructure</div>
                <div className={`${BD_DETAIL} tabular-nums`}>
                  {fmtGB(c.ingestGB)} GB ingested/mo → {fmtGB(c.storedGB)} GB stored ({RETENTION_DAYS}d retention)
                </div>
                <div className={`${BD_ROW} mt-[6px]`}>
                  <span>
                    Database ({DB[db].brand} {c.dbTier})
                  </span>
                  <span className="tabular-nums">{money(c.dbPrice)}</span>
                </div>
                <div className={BD_ROW}>
                  <span>
                    Hosting ({HOSTING[hosting].brand} {HOSTING[hosting].label})
                  </span>
                  <span className="tabular-nums">{money(c.hostPrice)}</span>
                </div>
                <div className={BD_ROW}>
                  <span>Query &amp; processing compute</span>
                  <span className="tabular-nums">{money(c.query)}</span>
                </div>
                <div className="my-2 border-t-[0.5px] border-calc-border" />
                <div className={BD_SUB}>
                  <span>Infrastructure total</span>
                  <span className="tabular-nums">{money(c.infra)}</span>
                </div>
                <div className={`${BD_GROUP} mt-4`}>Engineering</div>
                <div className={BD_DETAIL}>Initial build</div>
                {c.buildMult === 1 ? (
                  <div className={`${BD_DETAIL} tabular-nums`}>
                    {fmtHours(c.totals.build)} hrs × {money(c.rate)}/hr = {money(c.buildTotal)}
                  </div>
                ) : (
                  <>
                    <div className={`${BD_DETAIL} tabular-nums`}>
                      {fmtHours(c.totals.build)} hrs raw × {fmtMult(c.buildMult)} ({combo}) = {fmtHours(c.effBuild)} hrs effective
                    </div>
                    <div className={`${BD_DETAIL} tabular-nums`}>
                      × {money(c.rate)}/hr = {money(c.buildTotal)}
                    </div>
                  </>
                )}
                <div className={`${BD_DETAIL} tabular-nums`}>Amortised over 12 months = {money(c.buildAmortised)}/mo</div>
                <div className={`${BD_DETAIL} mt-2`}>Feature maintenance</div>
                {c.maintMult === 1 ? (
                  <div className={`${BD_DETAIL} tabular-nums`}>
                    {fmtHours(c.totals.maint)} hrs/mo × {money(c.rate)}/hr = {money(c.featureMaint)}/mo
                  </div>
                ) : (
                  <>
                    <div className={`${BD_DETAIL} tabular-nums`}>
                      {fmtHours(c.totals.maint)} hrs/mo raw × {fmtMult(c.maintMult)} ({combo}) = {fmtHours(c.effMaint)} hrs/mo effective
                    </div>
                    <div className={`${BD_DETAIL} tabular-nums`}>
                      × {money(c.rate)}/hr = {money(c.featureMaint)}/mo
                    </div>
                  </>
                )}
                <div className={`${BD_DETAIL} mt-2`}>Operational overhead</div>
                <div className={`${BD_DETAIL} tabular-nums`}>
                  {fmtHours(c.opsHours)} hrs/mo × {money(c.rate)}/hr = {money(c.ops)}/mo
                </div>
                <div className="my-2 border-t-[0.5px] border-calc-border" />
                <div className={BD_SUB}>
                  <span>Engineering total</span>
                  <span className="tabular-nums">{money(c.engineering)}/mo</span>
                </div>
                <div className="my-3 border-t border-calc-border" />
                <div className={BD_TOTAL}>
                  <span>12-month effective monthly cost</span>
                  <span className="tabular-nums">{money(c.total)}/mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
