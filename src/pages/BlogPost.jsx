// /blog/:slug (specs/content.md §2, specs/landing.md T1). One template for every live post.
// Bodies are rendered from the spec outline (headings + one-line summaries), never the live prose.
import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import ArticleBody from '../components/ArticleBody.jsx'
import { PostHero, ShareBar, RelatedPosts, TwoProductsBand } from '../components/ContentSections.jsx'
import { Spacer } from '../components/ui.jsx'
import { BY_SLUG, LIVE_URL } from '../data/blog.js'
import { POST_BODIES, BANNER } from '../data/postBodies.jsx'
import Pending from './Pending.jsx'

// posts.json outline entries look like "h2: Heading text"
function outlineBlocks(post) {
  return post.outline.map((line) => {
    const m = /^(h[234]):\s*(.*)$/.exec(line)
    return m ? { t: m[1], c: m[2] } : { t: 'p', c: line }
  })
}

function bodyFor(post) {
  const o = POST_BODIES[post.slug] || {}
  let blocks = o.blocks
  if (!blocks) {
    blocks = []
    if (post.banner) blocks.push(BANNER)
    if (post.summary) blocks.push({ t: 'p', c: post.summary })
    if (o.leadImage) blocks.push(o.leadImage)
    blocks.push(...outlineBlocks(post))
  }
  return [
    ...blocks,
    {
      t: 'p',
      c: <a href={LIVE_URL(`/blog/${post.slug}`)}>Read the full article on glassflow.ai</a>,
    },
  ]
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = BY_SLUG[slug]

  useEffect(() => {
    if (post?.live) document.title = post.seoTitle || post.title
  }, [post])

  if (!post) return <Pending />
  // 12 index cards point at posts that 308 to /blog on live
  if (!post.live) return <Navigate to="/blog" replace />

  const o = POST_BODIES[post.slug] || {}
  const related = post.related.map((s) => BY_SLUG[s]).filter(Boolean)

  return (
    <>
      <Spacer inner="h-[30px]" />
      <PostHero
        category={post.category}
        title={post.title}
        description={o.description || post.excerpt}
        author={post.author}
        date={post.date}
        datetime={post.datetime}
        cover={post.cover}
      />
      <Spacer />
      <ArticleBody blocks={bodyFor(post)} />
      <Spacer />
      <ShareBar />
      {related.length > 0 && <RelatedPosts posts={related} />}
      <Spacer />
      <TwoProductsBand variant="posts" />
    </>
  )
}
