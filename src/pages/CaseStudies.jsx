// /case-studies (specs/content.md §4, specs/landing.md T5) and /case-studies/:slug (§5).
import { Fragment, useEffect } from 'react'
import { ArticleContent } from '../components/ArticleBody.jsx'
import Testimonial from '../components/Testimonial.jsx'
import {
  CaseStudiesTitle,
  CaseStudyCards,
  Chip,
  TwoProductsBand,
  TITLE_BG,
} from '../components/ContentSections.jsx'
import { A, Shell, Spacer } from '../components/ui.jsx'

const CS = (f) => A(`case-studies/${f}`)
const SITE_TITLE = 'AI Agent Observability & Data Infrastructure | GlassFlow'

export function CaseStudiesIndex() {
  useEffect(() => {
    document.title = SITE_TITLE
  }, [])
  return (
    <>
      <Spacer inner="h-[30px]" />
      <CaseStudiesTitle />
      <CaseStudyCards />
    </>
  )
}

// Bodies: the live headings with the spec's one-line summaries / recorded bullet leads (§5.4), not the prose.
const STUDIES = {
  nubrain: {
    docTitle: 'Nubrain fixes the silent errors of AI agents in their pipelines - GlassFlow | Open-Source Kafka to ClickHouse Ingestion',
    title: 'Nubrain fixes the silent errors of AI agents in their pipelines',
    metrics: [
      ['93%', 'Reduction of silently duplicated or corrupted metrics'],
      ['3x', 'Improved scalability as agent throughput increased'],
      ['7 TB/day', 'Stable processing'],
    ],
    quote: '"GlassFlow helped eliminate silent failures in our pipelines. Dead-letter queues and pipeline metrics significantly improved reliability while keeping everything self-hosted."',
    person: { avatar: CS('EB74VMW0V1AQrN80SXS6xOsXPg.jpeg'), name: 'Ingo Marquardt,', role: 'CTO, Nubrain.' },
    company: { logo: CS('hOEgbo26i8shpzvhlvFGZZHDQY.jpeg'), alt: 'Nubrain' },
    summary:
      "Nubrain replaced Kafka table engines and stateless custom code with GlassFlow's stateful transformations, dedup and dead-letter queues, cutting silently corrupted metrics by 93% at about 7 TB/day.",
    body: [
      { t: 'h2', c: 'Results' },
      { t: 'h2', c: 'Key takeaways' },
      { t: 'h2', c: 'The Challenge' },
      {
        t: 'ul',
        items: ['Stateless transforms', 'Scalability', 'Observability', 'Silent data issues', 'Operational complexity'].map((x) => (
          <strong key={x}>{x}</strong>
        )),
      },
      { t: 'h2', c: 'Why GlassFlow' },
      { t: 'h2', c: 'Solution' },
    ],
    logo: CS('71EJsST8RQxnFwMo7Alb9eWZXcI.svg'),
    overview: [
      'Nubrain is building a Human Mind API for non-invasive brain-computer interfaces. Their platform processes large volumes of AI-driven data produced by autonomous agents and research systems.',
      'As Nubrain moved from experimentation to production workloads, they needed streaming pipelines that could handle state, scale reliably, and provide deep observability.',
    ],
    site: 'https://nubrain.com/',
  },
  restack: {
    docTitle: 'Restack scales real-time enterprise observability with GlassFlow - GlassFlow | Open-Source Kafka to ClickHouse Ingestion',
    title: 'Restack scales real-time enterprise observability with GlassFlow',
    metrics: [
      ['84%', 'Reduction in engineering effort for building and maintaining pipelines'],
      ['87%', 'Reduction in pipeline-related incidents'],
      ['10 TB / day', 'Stable processing'],
    ],
    quote: '"I am happy we found GlassFlow. I was fed up seeing my engineers debugging broken observability pipelines and spending their time creating custom solutions, while our focus should have been on improving our own product."',
    person: { avatar: CS('AvNQPA2KLw0PJ8qQYPYqet4URQ.png'), name: 'Andres Tapia,', role: 'CEO, Restack.' },
    company: { logo: CS('oIbDPvgphfWTFE1bRAFoKFR51po.jpeg'), alt: 'Restack' },
    summary:
      'Restack moved its real-time observability pipeline to GlassFlow, cutting pipeline engineering effort by 84% and incidents by 87% while ingesting about 10 TB/day from Kafka to ClickHouse.',
    body: [
      { t: 'h2', c: 'Results' },
      { t: 'h2', c: 'Key takeaways' },
      { t: 'h2', c: 'Challenge - Real-time Observability' },
      { t: 'h2', c: 'Solution' },
    ],
    logo: CS('gU6Xy4ekBJSu57RtzjJJ0U3x1Q.svg'),
    overview: [
      'Where product teams design, test and optimize agents at Enterprise Scale.',
      'The open-source stack enabling product teams to improve their agent experience while engineers make them reliable at scale on Kubernetes.',
      'As data volume and customer expectations have grown, Restack needed a more reliable way to build and operate streaming observability pipelines.',
    ],
    site: 'https://www.restack.io/',
  },
}

// Per-letter roll of the live Framer "Secondary" button (motion in index.css, .char-roll):
// --i = letter index (hover-in stagger), --r = letters remaining (hover-out runs last letter first).
function CharRoll({ text }) {
  const letters = text.replace(/\s/g, '').length
  let i = -1
  return (
    <>
      <span className="sr-only">{text}</span>
      {text.split(' ').map((word, w) => (
        <Fragment key={w}>
          {w > 0 && ' '}
          {[...word].map((c) => {
            i += 1
            return (
              <span key={i} className="char-roll" style={{ '--i': i, '--r': letters - 1 - i }} aria-hidden="true">
                <span>{c}</span>
                <span className="char-roll-b">{c}</span>
              </span>
            )
          })}
        </Fragment>
      ))}
    </>
  )
}

function Sidebar({ s }) {
  return (
    <aside className="flex flex-col gap-5 bg-deep px-6 py-10 lg:sticky lg:top-[128px] lg:w-[320px] lg:shrink-0 lg:self-start">
      <img src={s.logo} alt="" className="h-8 w-[272px] max-w-full object-contain object-left" />
      <h6 className="font-mono text-[16px] font-medium uppercase leading-[22.4px] tracking-[-0.32px] text-[#ABABBA]">Company Overview</h6>
      {s.overview.map((p) => (
        <p key={p} className="font-display text-[18px] leading-[32.4px] text-cream">
          {p}
        </p>
      ))}
      <a href={s.site} target="_blank" rel="noopener noreferrer" className="char-roll-host hairline inline-flex h-12 items-center self-start px-5 py-1 font-inter text-[14px] font-medium text-white">
        <span className="relative block h-6 overflow-hidden whitespace-nowrap leading-6">
          <CharRoll text="Visit Website" />
        </span>
      </a>
    </aside>
  )
}

export function CaseStudy({ slug }) {
  const s = STUDIES[slug]
  useEffect(() => {
    document.title = s.docTitle
  }, [s])
  const blocks = [
    ...s.body.flatMap((b, i) => (i === 0 ? [b, { t: 'p', c: s.summary }] : [b])),
    { t: 'p', c: <a href={`https://www.glassflow.ai/case-studies/${slug}`}>Read the full case study on glassflow.ai</a> },
  ]
  return (
    <>
      <Spacer inner="h-[30px]" />
      <Shell as="section">
        <div className="relative flex flex-col items-center justify-center gap-4 overflow-hidden px-4 py-16 text-center lg:h-[280px]">
          <img src={TITLE_BG} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <Chip href="/case-studies" className="relative">
            Case Studies
          </Chip>
          <h1 className="relative max-w-[620px] font-display text-[40px] leading-[48px] tracking-[-1.6px] text-[#FAFAFA]">{s.title}</h1>
        </div>
      </Shell>
      <Shell inner="grid grid-cols-1 gap-1 px-1 py-8 lg:grid-cols-3 lg:gap-8">
        {s.metrics.map(([m, label]) => (
          <div key={label} className="flex flex-col gap-5 bg-deep p-5 lg:h-[163px]">
            <h2 className="font-inter text-[24px] font-medium leading-[28.8px] tracking-[-1.28px] text-white lg:text-[32px] lg:leading-[38.4px]">{m}</h2>
            <p className="font-display text-[18px] leading-[32.4px] text-cream">{label}</p>
          </div>
        ))}
      </Shell>
      <Shell inner="flex flex-col lg:flex-row lg:justify-center">
        <div className="p-4 lg:w-[780px] lg:shrink-0 lg:p-8">
          <Testimonial bare compact quote={s.quote} person={s.person} company={s.company} />
          <ArticleContent blocks={blocks} className="mt-10 [&_ul]:mt-8" />
        </div>
        <Sidebar s={s} />
      </Shell>
      <Spacer />
      <CaseStudiesTitle as="h2" title="You might also like" compact />
      <CaseStudyCards />
      <Spacer />
      <TwoProductsBand variant="cases" />
    </>
  )
}
