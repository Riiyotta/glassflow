// /blog (specs/content.md §1)
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import TextRollButton from '../components/TextRollButton.jsx'
import { Chip, PostCard, TwoProductsBand, TITLE_BG, C } from '../components/ContentSections.jsx'
import { Shell, Spacer, TitleBar } from '../components/ui.jsx'
import { CATEGORIES, POSTS, FEATURED } from '../data/blog.js'

const CAT_PARAM = 'category-2'

function TitleBlock() {
  return (
    <Shell as="section">
      <div className="relative flex flex-col items-center justify-center gap-4 overflow-hidden px-6 py-16 text-center lg:h-[310px] lg:px-0">
        <img src={TITLE_BG} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <Chip className="relative">blog</Chip>
        <h1 className="relative max-w-[1200px] font-display text-[56px] leading-[67.2px] tracking-[-2.24px] text-[#FAFAFA]">
          The GlassFlow blog
        </h1>
        <p className="relative max-w-[560px] font-display text-[21px] leading-[29.4px] tracking-[-0.84px] text-cream">
          How we think about agent observability and the data that feeds AI agents. New features, real use cases, tech lessons learned
        </p>
      </div>
    </Shell>
  )
}

function Featured({ post }) {
  return (
    <Shell as="section" inner="bg-deep">
      <TitleBar label="featured-blog" dotsRight />
      <a href={`/blog/${post.slug}`} className="flex flex-col lg:h-[412px] lg:flex-row">
        <div className="flex flex-col lg:w-[644px] lg:shrink-0">
          <div className="flex flex-col justify-center gap-4 p-6 lg:h-[360px]">
            <Chip className="self-start">{post.category}</Chip>
            <h3 className="max-w-[596px] font-display text-[32px] leading-[38.4px] tracking-[-1.28px] text-white">{post.title}</h3>
            <p className="font-display text-[16px] leading-[24px] tracking-[-0.32px] text-cream">{post.excerpt}</p>
          </div>
          <TextRollButton as="span" trigger="none" label="read more" frame="bg-deep" fill="hairline bg-panel text-cream" className="w-full" />
        </div>
        <div className="relative h-[245px] p-3 lg:h-auto lg:flex-1">
          <img src={C('YiSYWMdzERJyLVRZRpiutPwoGI.jpg')} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <img src={post.cover} alt="" className="relative h-full w-full border border-[rgba(153,153,153,0.3)] object-cover" />
        </div>
      </a>
    </Shell>
  )
}

function FilterBar({ category, title, onCategory, onTitle }) {
  const tabs = [{ label: 'All', slug: null }, ...CATEGORIES.map((c) => ({ label: c.label, slug: c.slug }))]
  return (
    <Shell inner="px-3 lg:h-[88px]">
      <div className="hairline flex h-full items-center">
        <div className="relative hidden min-w-0 flex-1 md:block lg:max-w-[1098px]">
          <div className="flex gap-[10px] overflow-x-auto py-8 pl-3 pr-8" role="tablist" aria-label="Blog categories">
            {tabs.map((t) => {
              const active = (category || null) === t.slug
              return (
                <button
                  key={t.label}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onCategory(t.slug)}
                  className={`h-[22px] shrink-0 whitespace-nowrap px-2 font-mono text-[14px] uppercase leading-[22.4px] tracking-[-0.28px] ${
                    active ? 'bg-amber text-deep' : 'text-white'
                  }`}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
          <span
            className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-[linear-gradient(90deg,rgba(73,36,0,0),#492400)]"
            aria-hidden="true"
          />
        </div>
        <label className="ml-auto flex h-10 w-full items-center gap-3 p-3 md:w-[180px] md:shrink-0">
          {/* 24px icon slot: the live search glyph was not captured (content.md §10) */}
          <span className="block h-6 w-6 shrink-0" aria-hidden="true" />
          <input
            type="search"
            value={title}
            onChange={(e) => onTitle(e.target.value)}
            placeholder="Search…"
            aria-label="Search posts by title"
            className="w-full min-w-0 border-0 bg-transparent font-mono text-[14px] leading-[16.8px] text-white outline-none"
          />
        </label>
      </div>
    </Shell>
  )
}

export default function BlogIndex() {
  const [params, setParams] = useSearchParams()
  const category = params.get(CAT_PARAM)
  const title = params.get('title') || ''

  useEffect(() => {
    document.title = 'GlassFlow | Blog'
  }, [])

  const set = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const q = title.trim().toLowerCase()
  const shown = POSTS.filter((p) => (!category || p.categorySlug === category) && (!q || p.title.toLowerCase().includes(q)))

  return (
    <>
      <Spacer inner="h-[30px]" />
      <TitleBlock />
      <Featured post={FEATURED} />
      <Spacer />
      <FilterBar category={category} title={title} onCategory={(v) => set(CAT_PARAM, v)} onTitle={(v) => set('title', v)} />
      <Shell inner="grid grid-cols-1 p-3 md:grid-cols-2 md:gap-2 lg:grid-cols-3">
        {shown.map((p) => (
          <PostCard key={p.slug} post={p} size="index" />
        ))}
      </Shell>
      <Spacer />
      <TwoProductsBand variant="blog" />
    </>
  )
}
