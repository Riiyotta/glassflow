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
  supabase: { label: 'Supabase / Neon', tiers: [[2, 0, 'Free'], [50, 25, 'Pro'], [300, 250, 'Pro + storage add-on'], [1000, 599, 'Team'], [Infinity, 1299, 'Enterprise']] },
  rds: { label: 'AWS RDS / Cloud SQL', tiers: [[10, 18, 'db.t3.micro'], [50, 50, 'db.t3.small'], [200, 130, 'db.t3.medium'], [Infinity, 280, 'db.m5.large']] },
  selfpg: { label: 'Self-hosted Postgres', tiers: [[10, 6, '2 GB VPS'], [50, 12, '4 GB VPS'], [Infinity, 24, '8 GB VPS']] },
}
const HOSTING = {
  railway: { label: 'Managed', sub: 'Railway/Render', tiers: [[500, 7], [2000, 20], [Infinity, 50]] },
  ecs: { label: 'Cloud Provider', sub: 'AWS ECS/Cloud Run', tiers: [[300, 18], [1000, 36], [Infinity, 85]] },
  hetzner: { label: 'Self-hosted VPS', sub: 'Hetzner/DO', tiers: [[500, 6], [2000, 12], [Infinity, 24]] },
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
const fmtHours = (n) => {
  const s = n.toFixed(1)
  return s.endsWith('.0') ? s.slice(0, -2) : s
}
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

const LABEL = 'font-sys-mono text-[11px] font-bold uppercase tracking-[0.06em] text-calc-muted'
const QUESTION = 'font-sys-mono text-[13.5px] font-bold text-cream'
const OPTION = (on) =>
  `rounded border px-[10px] py-3 text-left ${on ? 'border-amber bg-calc-accent-bg' : 'border-calc-border bg-page'}`

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <p className={title.toUpperCase() === title ? LABEL : QUESTION}>{title}</p>
      {children}
    </div>
  )
}

function Tip({ text }) {
  return (
    <span className="group relative ml-1 cursor-help text-calc-muted">
      ⓘ
      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-[220px] -translate-x-1/2 rounded-[3px] border border-calc-border bg-card-dark p-2 text-[11px] font-normal leading-[1.5] text-calc-secondary opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        {text}
      </span>
    </span>
  )
}

function Line({ label, value, sub, strong }) {
  return (
    <div className={`flex flex-col gap-1 py-2 ${strong ? 'border-t border-calc-border' : ''}`}>
      <div className={`flex justify-between gap-4 text-[13px] ${strong ? 'font-extrabold text-cream' : 'text-calc-secondary'}`}>
        <span>{label}</span>
        <span className="font-sys-mono">{value}</span>
      </div>
      {sub?.map((s) => (
        <span key={s} className="font-sys-mono text-[11px] leading-[1.6] text-calc-muted">
          {s}
        </span>
      ))}
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
  const multNote = `(${sen.label} + ${m.label} AI acceleration)`
  const selfValue = `${money(c.total)}/mo`
  const riusValue = `${money(c.tier.price)}/mo`
  const opt = OPTIONAL.filter((f) => selected.includes(f.id))
  const coreEffBuild = (RESEARCH_HOURS.build + CORE_FEATURES.reduce((a, f) => a + f.build, 0)) * c.buildMult
  const coreEffMaint = CORE_FEATURES.reduce((a, f) => a + f.maint, 0) * c.maintMult
  const dbWarning =
    db === 'supabase' && c.dbPrice > 0
      ? c.dbTier === 'Pro'
        ? 'Free tier exceeded at this data volume — Pro plan required at $25/mo'
        : `At this data volume the ${c.dbTier} plan is required at $${c.dbPrice}/mo`
      : null

  const buildLines =
    c.buildMult === 1
      ? [`${fmtHours(c.totals.build)} hrs × $${c.rate}/hr = ${money(c.buildTotal)}`]
      : [
          `${fmtHours(c.totals.build)} hrs raw × ${+c.buildMult.toFixed(4)} ${multNote} = ${fmtHours(c.effBuild)} hrs effective`,
          `× $${c.rate}/hr = ${money(c.buildTotal)}`,
        ]
  const maintLines =
    c.maintMult === 1
      ? [`${fmtHours(c.totals.maint)} hrs × $${c.rate}/hr = ${money(c.featureMaint)}/mo`]
      : [
          `${fmtHours(c.totals.maint)} hrs raw × ${+c.maintMult.toFixed(4)} ${multNote} = ${fmtHours(c.effMaint)} hrs effective`,
          `× $${c.rate}/hr = ${money(c.featureMaint)}/mo`,
        ]

  return (
    <div className="font-sys text-cream">
      {/* hero */}
      <section className="px-5 pb-16 pt-[88px] text-center">
        <h1 className="mx-auto max-w-[720px] text-[34px] font-extrabold leading-[1.25]">
          Is building your own agent observability cheaper than Rius?
        </h1>
      </section>

      {/* assumptions */}
      <section className="bg-page px-5 py-7">
        <div className="mx-auto max-w-[760px] rounded border border-calc-border bg-panel px-6 py-[18px]">
          <button
            type="button"
            aria-expanded={assumptionsOpen}
            onClick={() => setAssumptionsOpen((o) => !o)}
            className="flex w-full items-center justify-between font-sys-mono text-[15px] font-extrabold"
          >
            Assumptions behind this estimate
            <span className="text-amber">{assumptionsOpen ? '▲' : '▾'}</span>
          </button>
          {assumptionsOpen && (
            <ul className="mt-4 list-disc pl-5 text-[13.5px] leading-[1.7] text-calc-secondary">
              {ASSUMPTIONS.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* calculator */}
      <section className="py-14">
        <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-7 px-5 min-[901px]:grid-cols-2">
          {/* inputs */}
          <div className="flex min-w-0 flex-col gap-6">
            <h2 className="font-sys-mono text-[18px] font-extrabold">Inputs</h2>

            <Section title="MONTHLY TRACES">
              <div className="flex flex-wrap gap-2">
                {TRACE_PRESETS.map((k) => (
                  <button key={k} type="button" onClick={() => chooseTraces(k)} className={`flex-[1_1_80px] ${OPTION(traces === k)}`}>
                    <span className={`block font-sys-mono text-[13.5px] font-extrabold ${traces === k ? 'text-amber' : ''}`}>{fmtTraces(k)}</span>
                    <span className="block text-[10.5px] text-calc-muted">traces/mo</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-calc-muted">A trace typically represents one end-to-end agent or workflow execution.</p>
            </Section>

            <Section title="Who would build this internally?">
              <div className="flex flex-wrap gap-2">
                {Object.entries(SENIORITY).map(([k, s]) => {
                  const b = c.totals.build * s.timeMult * m.multBuild
                  const mt = c.totals.maint * s.timeMult * m.multMaint
                  return (
                    <button key={k} type="button" onClick={() => setSeniority(k)} className={`flex-[1_1_150px] ${OPTION(seniority === k)}`}>
                      <span className={`block text-[13px] font-bold ${seniority === k ? 'text-amber' : ''}`}>{s.label}</span>
                      <span className="block font-sys-mono text-[11px] text-calc-secondary">~${s.rate}/hr</span>
                      <span className="block font-sys-mono text-[10.5px] text-calc-muted">
                        {fmtHours(b)}h build · {fmtHours(mt)}h/mo maint
                      </span>
                    </button>
                  )
                })}
              </div>
            </Section>

            <Section title="How much does AI coding accelerate your team?">
              <div className="flex flex-wrap gap-2">
                {Object.entries(AI_MODES).map(([k, a]) => (
                  <button key={k} type="button" onClick={() => setMode(k)} className={`flex-[1_1_150px] ${OPTION(mode === k)}`}>
                    <span className={`block text-[13px] font-bold ${mode === k ? 'text-amber' : ''}`}>{a.label}</span>
                    {a.sub.map((s) => (
                      <span key={s} className="block font-sys-mono text-[10.5px] text-calc-muted">
                        {s}
                      </span>
                    ))}
                  </button>
                ))}
              </div>
            </Section>

            <button
              type="button"
              aria-expanded={advancedOpen}
              onClick={() => setAdvancedOpen((o) => !o)}
              className="w-full rounded border border-calc-border bg-page py-3 text-[13px] font-bold text-amber"
            >
              {advancedOpen ? 'Hide advanced settings ▲' : 'Advanced settings ▾'}
            </button>

            {advancedOpen && (
              <div className="flex flex-col gap-6">
                <Section title="MVP FEATURES (ALWAYS INCLUDED)">
                  <ul className="flex flex-col rounded border border-calc-border bg-card-dark text-[13px]">
                    <li className="flex justify-between border-b border-calc-border px-3 py-2">
                      <span>🔎 Research &amp; evaluation</span>
                      <span className="font-sys-mono text-calc-secondary">{fmtHours(RESEARCH_HOURS.build * c.buildMult)}h</span>
                    </li>
                    {CORE_FEATURES.map((f) => (
                      <li key={f.name} className="flex justify-between border-b border-calc-border px-3 py-2 last:border-b-0">
                        <span>
                          <span className="text-calc-success">✓</span> {f.name}
                          {f.tip && <Tip text={f.tip} />}
                        </span>
                        <span className="font-sys-mono text-calc-secondary">{fmtHours(f.build * c.buildMult)}h</span>
                      </li>
                    ))}
                  </ul>
                  <p className="rounded bg-calc-accent-bg px-3 py-2 font-sys-mono text-[11px] text-calc-secondary">
                    MVP: {fmtHours(coreEffBuild)}h build · {fmtHours(coreEffMaint)}h/mo maint
                  </p>
                </Section>

                <Section title="ADDITIONAL FEATURES">
                  {GROUPS.map((g) => (
                    <div key={g} className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-calc-muted">{g}</span>
                      {OPTIONAL.filter((f) => f.group === g).map((f) => (
                        <label key={f.id} className="flex cursor-pointer items-center justify-between gap-3 text-[13px]">
                          <span className="flex items-center gap-2">
                            <input type="checkbox" checked={selected.includes(f.id)} onChange={() => toggle(f.id)} className="accent-amber" />
                            {f.name}
                          </span>
                          <span className="font-sys-mono text-[11px] text-calc-secondary">
                            +{fmtHours(f.build * c.buildMult)}h · +{fmtHours(f.maint * c.maintMult)}h/mo
                          </span>
                        </label>
                      ))}
                    </div>
                  ))}
                  <p className="rounded bg-calc-accent-bg px-3 py-2 font-sys-mono text-[11px] text-calc-secondary">
                    {opt.length} selected: +{fmtHours(opt.reduce((a, f) => a + f.build, 0) * c.buildMult)}h build · +
                    {fmtHours(opt.reduce((a, f) => a + f.maint, 0) * c.maintMult)}h/mo maint
                  </p>
                </Section>

                <Section title="AVERAGE TRACE SIZE">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(TRACE_SIZE_KB).map(([k, s]) => (
                      <button key={k} type="button" onClick={() => setSize(k)} className={`flex-1 ${OPTION(size === k)}`}>
                        <span className={`text-[13px] font-bold ${size === k ? 'text-amber' : ''}`}>{s.label}</span>{' '}
                        <span className="font-sys-mono text-[11px] text-calc-muted">({s.kb} KB)</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-calc-muted">
                    {RETENTION_DAYS}-day retention · ~{c.storedGB.toFixed(1)} GB stored
                  </p>
                </Section>

                <Section title="DATABASE">
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(DB).map(([k, d]) => (
                      <button key={k} type="button" onClick={() => setDb(k)} className={OPTION(db === k)}>
                        <span className={`block text-[12px] font-bold ${db === k ? 'text-amber' : ''}`}>{d.label}</span>
                        {db === k && (
                          <span className="block font-sys-mono text-[10.5px] text-calc-warning">
                            {c.dbTier} · {money(c.dbPrice)}/mo
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  {dbWarning && <p className="text-[11px] text-calc-warning">{dbWarning}</p>}
                </Section>

                <Section title="HOSTING">
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(HOSTING).map(([k, h]) => (
                      <button key={k} type="button" onClick={() => setHosting(k)} className={OPTION(hosting === k)}>
                        <span className={`block text-[12px] font-bold ${hosting === k ? 'text-amber' : ''}`}>{h.label}</span>
                        <span className="block font-sys-mono text-[10.5px] text-calc-muted">{h.sub}</span>
                      </button>
                    ))}
                  </div>
                </Section>
              </div>
            )}
          </div>

          {/* results */}
          <div className="flex min-w-0 flex-col gap-4 self-start min-[901px]:sticky min-[901px]:top-5">
            <h2 className="font-sys-mono text-[18px] font-extrabold">Results</h2>
            <div className="flex flex-col gap-4 rounded border border-amber bg-calc-accent-bg p-[18px]">
              <p className={LABEL}>RIUS VS SELF-BUILT</p>
              <div className="flex items-start justify-center gap-6 text-center">
                <div className="flex flex-col gap-1">
                  <span className={LABEL}>SELF-BUILT</span>
                  <span className={`text-[22px] font-extrabold ${c.selfCheaper ? 'text-calc-success' : 'text-calc-danger'}`}>{selfValue}</span>
                </div>
                <span className="pt-5 text-calc-muted">vs</span>
                <div className="flex flex-col gap-1">
                  <span className={LABEL}>{c.tier.name}</span>
                  <span className={`text-[22px] font-extrabold ${c.selfCheaper ? 'text-calc-danger' : 'text-calc-success'}`}>{riusValue}</span>
                  <ul className="flex flex-col text-left font-sys-mono text-[10.5px] text-calc-secondary">
                    {TIER_HIGHLIGHTS[c.tier.key].map((h) => (
                      <li key={h}>
                        <span className="text-calc-success">✓ </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {c.selfCheaper ? (
                <p className="rounded border border-amber bg-calc-accent-bg px-3 py-2 text-center text-[13px] font-extrabold text-amber">
                  Self-built is {money(Math.abs(c.diff))}/mo · {money(c.yearly)}/year cheaper
                </p>
              ) : (
                <p className="rounded border border-calc-success bg-calc-success-bg px-3 py-2 text-center text-[13px] font-extrabold text-calc-success">
                  You save {money(c.diff)}/mo · {money(c.yearly)}/year with Rius
                </p>
              )}
              <p className="font-sys-mono text-[10.5px] text-calc-muted">
                {fmtTraces(traces)} traces/mo · {TRACE_SIZE_KB[size].kb} KB avg trace · {sen.label} · {m.label} AI acceleration
              </p>
              <a
                href={GET_STARTED}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded bg-amber py-3 text-center font-sys-mono text-[14px] font-extrabold text-panel"
              >
                Get started
              </a>
            </div>

            <div className="grid grid-cols-1 gap-[10px] min-[481px]:grid-cols-3">
              {[
                ['Infrastructure', `${money(c.infra)}/mo`],
                ['Engineering', `${money(c.engineering)}/mo`, `${fmtHours(c.effBuild)}h build · ${fmtHours(c.effMaint + c.opsHours)}h/mo ongoing`],
                ['12-month effective monthly cost', `${money(c.total)}/mo`, 'Initial build amortized over 12 months + ongoing maintenance + infrastructure.'],
              ].map(([t, v, s]) => (
                <div key={t} className="flex flex-col gap-1 rounded border border-calc-border bg-page p-[14px]">
                  <span className="text-[11px] font-bold text-calc-muted">{t}</span>
                  <span className="font-sys-mono text-[16px] font-extrabold">{v}</span>
                  {s && <span className="text-[10.5px] leading-[1.5] text-calc-muted">{s}</span>}
                </div>
              ))}
            </div>

            <div className="flex flex-col rounded border border-calc-border bg-panel p-5">
              <p className={`${LABEL} pb-2`}>COSTS BREAKDOWN</p>
              <p className="pt-2 text-[12px] font-bold text-calc-muted">Infrastructure</p>
              <Line label={`Database: ${DB[db].label} (${c.dbTier})`} value={`${money(c.dbPrice)}/mo`} />
              <Line label={`Hosting: ${HOSTING[hosting].label} (${HOSTING[hosting].sub})`} value={`${money(c.hostPrice)}/mo`} />
              <Line label="Query compute" value={`${money(c.query)}/mo`} />
              <Line label="Infrastructure subtotal" value={`${money(c.infra)}/mo`} strong />
              <p className="pt-4 text-[12px] font-bold text-calc-muted">Engineering</p>
              <Line label="Initial build" value={`${money(c.buildAmortised)}/mo`} sub={[...buildLines, `Amortised over 12 months = ${money(c.buildAmortised)}/mo`]} />
              <Line label="Feature maintenance" value={`${money(c.featureMaint)}/mo`} sub={maintLines} />
              <Line
                label="Operational overhead"
                value={`${money(c.ops)}/mo`}
                sub={[`${fmtHours(c.opsHours)} hrs/mo × $${c.rate}/hr = ${money(c.ops)}/mo`]}
              />
              <Line label="Engineering subtotal" value={`${money(c.engineering)}/mo`} strong />
              <Line label="Total" value={`${money(c.total)}/mo`} strong />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
