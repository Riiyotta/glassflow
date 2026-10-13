// /categories/:slug: legacy black template (specs/content.md §3). The 7 live categories;
// comparisons / engineering redirect to /blog in routes.jsx.
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PostCard } from '../components/ContentSections.jsx'
import LegacyLayout, { L } from '../components/LegacyLayout.jsx'
import { BY_SLUG, CATEGORIES } from '../data/blog.js'
import Pending from './Pending.jsx'

const META = {
  'agent-infrastructure': 'Architecture, reliability, and cost patterns for running agents at scale.',
  'data-for-agents': 'Pre-processing, context curation, and token/latency reduction to make agents perform.',
  mcp: 'Building with the Model Context Protocol to connect agents to data and tools.',
  observability: 'Monitoring, tracing, and debugging AI agents in production.',
  'product-updates': 'Explore the latest enhancements, new features, and unlock new potential with GlassFlow.',
  tutorials: 'Tutorials',
  'use-cases': 'Discover various use cases of GlassFlow with code samples.',
}

export const GRADIENT_TEXT = 'bg-[linear-gradient(244deg,#A8A8A8_0%,#FFFFFF_100%)] bg-clip-text text-transparent'
const HEADING = 'font-inter text-[56px] font-medium leading-[67.2px] tracking-[-2.24px]'
// Live paints the gradients on an inline <span> inside each heading (not the block), so the
// 244deg title gradient spans only the word and the CTA's 0deg white->grey restarts on every line.
const CTA_GRADIENT = 'bg-[linear-gradient(0deg,#FFFFFF_0%,#A8A8A8_100%)] bg-clip-text text-transparent'

function BottomCta() {
  return (
    // live: copy sits 408px into the image box, 24px side padding and 160px below, so the box grows
    // when the subtitle wraps (tablet: 846 vs 818).
    <section className="relative flex w-full max-w-[1400px] flex-col items-center px-6 pb-[159px] pt-[408px] text-center">
      <div className="absolute inset-0 overflow-hidden">
        <img src={L('IXfpuu2qaDEHssgxdeU5Z0pWoI.jpeg')} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#000000_0%,rgba(0,0,0,0)_40%)]" aria-hidden="true" />
      </div>
      {/* live (Inter 500) breaks after "TB"; the clone only ships Inter 400, so cap the width to keep that break */}
      <h2 className={`relative w-full max-w-[720px] break-words ${HEADING}`}>
        <span className={CTA_GRADIENT}>Data transformations at TB scale for ClickHouse</span>
      </h2>
      <p className="relative mt-[17px] font-inter text-[20px] leading-[28px] tracking-[-0.8px] text-[#A8A3A3]">
        Get query ready data, lower ClickHouse load, and reliable pipelines at enterprise scale.
      </p>
      <div className="relative mt-6 flex flex-wrap justify-center gap-[10px]">
        <a
          href="https://cal.com/team/glassflow-founders/founders"
          className="flex h-12 w-[123px] items-center justify-center rounded-md bg-white font-inter text-[14px] font-medium text-black"
        >
          Get in Touch
        </a>
        <a
          href="https://github.com/glassflow/clickhouse-etl"
          className="flex h-12 w-[150px] items-center justify-center rounded-md border border-[#333333] bg-black font-inter text-[14px] font-medium text-white"
        >
          Explore the code
        </a>
      </div>
    </section>
  )
}

export default function Category() {
  const { slug } = useParams()
  const cat = CATEGORIES.find((c) => c.slug === slug)
  const live = cat && META[slug] !== undefined

  useEffect(() => {
    if (!live) return
    document.title = 'AI Agent Observability & Data Infrastructure | GlassFlow'
    document.querySelector('meta[name="description"]')?.setAttribute('content', META[slug])
  }, [live, slug])

  if (!live) return <Pending />
  const posts = cat.posts.map((s) => BY_SLUG[s]).filter(Boolean)

  return (
    <LegacyLayout tone="text-[#A8A3A3]">
      <main className="flex flex-col items-center gap-[86px] px-4 pb-[140px] pt-[140px] md:px-5">
        <h1 className={`w-full max-w-[1220px] text-center ${HEADING}`}>
          <span className={GRADIENT_TEXT}>{cat.label}</span>
        </h1>
        {/* live grid block: 34px top / 48px bottom padding (82px even when empty), 24px sides, 3 columns
            from tablet up. Live squeezes 3 columns at 390 (defect); clone fix: one column, 16px gutters. */}
        <div className="w-full pt-[34px] md:px-6">
          <div className="mx-auto grid w-full max-w-[1220px] grid-cols-1 gap-8 pb-12 md:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} size="category" />
            ))}
          </div>
        </div>
        <BottomCta />
      </main>
    </LegacyLayout>
  )
}
