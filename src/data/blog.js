// Blog data access (specs/posts.json, trimmed to src/data/posts.json with local image paths).
import data from './posts.json'
import { POST_BODIES } from './postBodies.jsx'

export const CATEGORIES = data.categories
export const POSTS = data.posts.map((p) => {
  const o = POST_BODIES[p.slug]
  // the stray-text live bug on how-to-debug-an-ai-agent shows on the card excerpt too
  return o?.description && p.slug === 'how-to-debug-an-ai-agent' ? { ...p, cardExcerpt: o.description } : p
})
export const BY_SLUG = Object.fromEntries(POSTS.map((p) => [p.slug, p]))
export const FEATURED = BY_SLUG[data.featured]
export const LIVE_URL = (path) => `https://www.glassflow.ai${path}`
