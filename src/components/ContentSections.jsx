// Shared sections for the content / company pages (specs/content.md §0.2, specs/landing.md T1, T5).
import AppearText from './AppearText.jsx'
import BlogCard from './BlogCard.jsx'
import { TEXT_EFFECT } from './motion.js'
import TextRollButton from './TextRollButton.jsx'
import { ImageCTA, TitleRow } from './ProductSections.jsx'
import { A, SVG, Shell, Dots } from './ui.jsx'

export const C = (f) => A(`content/${f}`)
export const POST_BG = A('p8ihsATIQW2BpC2j7ekzEF2gA.jpg') // dithered panel behind post / about hero text
export const FRAME_BG = C('5G4h16OWSlfa4F2lERWRFPE.jpg') // dithered frame behind post cover / about photo
export const TITLE_BG = C('fpSmMnbghTzYJNtWqkUhZjTF1UE.jpg') // /blog title block, case-study hero
export const DITHER_BG = C('D96xSgDLnqPtPU2OdIebnL9UZYs.jpg') // /contact, /contact/success, /about values
export const MOUNTAIN_BG = C('gGgprOgbK8sImEo5X3oHCssBw0w.jpg') // case-studies title panel

const GH_TARES = 'https://github.com/glassflow/tares'
const RIUS_GUIDES = 'https://docs.glassflow.ai/rius/guides'

// 48x72 pixel step in the top-left corner of hero/title panels.
export function PixelCorner() {
  return <img src={SVG('pixel-corner')} alt="" className="absolute left-0 top-0 h-[72px] w-12" />
}

// Amber category / section chip: Inter 12/12 w500 uppercase.
export function Chip({ children, href, className = '' }) {
  const Tag = href ? 'a' : 'span'
  return (
    <Tag
      href={href}
      className={`inline-flex shrink-0 bg-amber px-[10px] py-[6px] font-inter text-[12px] font-medium uppercase leading-[12px] text-deep ${className}`}
    >
      {children}
    </Tag>
  )
}

// 38px hero bar with #492400 dots (left, optionally right) and an optional centred child.
export function HeroBar({ bg = 'bg-deep', dotsRight = false, children }) {
  return (
    <div className={`hairline relative flex h-[38px] items-center justify-center px-4 ${bg}`}>
      <Dots tone="page" className="absolute left-4 top-1/2 -translate-y-1/2" />
      {dotsRight && <Dots tone="page" className="absolute right-4 top-1/2 -translate-y-1/2" />}
      {children}
    </div>
  )
}

// "Two products" / "Start free" band (content.md §0.2B, landing.md T1.6), built on ImageCTA.
// variant: 'blog' (/blog copy, dead buttons), 'posts' (lowercase labels, forced line breaks,
// different mobile copy), 'pages' (about / contact: capitalised labels, copy flows, 640px paragraph),
// 'cases' (case-study pages: as 'pages' with a 420px paragraph, 452 tall).
export function TwoProductsBand({ variant = 'pages' }) {
  if (variant === 'blog') {
    return (
      <ImageCTA
        title="Start free. Upgrade when your agents do."
        body="100k traces a month, no card required."
        primary={{ label: 'start from', href: null }}
        secondary={{ label: 'talk to our team', href: null }}
        arrow={false}
        textClass="max-w-[640px] gap-8"
        titleClass="max-w-[420px]"
        bodyClass="t-body"
      />
    )
  }
  const posts = variant === 'posts'
  const desktop = (
    <>
      Two products.
      <br />
      Two starting points.
    </>
  )
  const desktopBody = (
    <>
      Tares is open source. Kick the tires, open an issue, and drop a star if it&apos;s useful.
      <br />
      Rius, end to end. Guides for wiring up traces, MCP, and retention, from first span to production.
    </>
  )
  return (
    <ImageCTA
      title={
        posts ? (
          <>
            <span className="md:hidden">Give your agent one place to look. Everything your systems emit, in one call.</span>
            <span className="hidden md:inline">{desktop}</span>
          </>
        ) : (
          'Two products. Two starting points.'
        )
      }
      body={
        posts ? (
          <>
            <span className="md:hidden">Two commands and a source you already run.</span>
            <span className="hidden md:inline">{desktopBody}</span>
          </>
        ) : (
          "Tares is open source. Kick the tires, open an issue, and drop a star if it's useful. Rius, end to end. Guides for wiring up traces, MCP, and retention, from first span to production."
        )
      }
      primary={{ label: posts ? 'star Tares on GitHub' : 'Star Tares on GitHub', href: GH_TARES }}
      secondary={{ label: posts ? 'read the Rius guides' : 'Read the Rius guides', href: RIUS_GUIDES }}
      arrow={false}
      textClass="max-w-[640px] gap-8"
      titleClass="max-w-[420px]"
      bodyClass={`t-body ${posts || variant === 'cases' ? 'max-w-[420px]' : 'max-w-[640px]'}`}
    />
  )
}

// Post meta cell: 23px pixel icon, mono label, Inter w300 value.
function MetaCell({ icon, label, children, className = '' }) {
  return (
    <div className={`flex min-w-0 items-center gap-3 px-8 py-3 ${className}`}>
      <img src={SVG(icon)} alt="" className="h-[23px] w-[23px] shrink-0" />
      <div className="flex min-w-0 flex-col">
        <span className="font-mono text-[14px] font-light leading-[21px] tracking-[-0.28px] text-cream">{label}</span>
        <span className="font-inter text-[16px] font-light leading-[24px] tracking-[-0.32px] text-cream">{children}</span>
      </div>
    </div>
  )
}

// Blog post hero (content.md §2.2, landing.md T1.2).
export function PostHero({ category, title, description, author, date, datetime, cover }) {
  return (
    <Shell as="section">
      <HeroBar>
        <a href="/blog" className="font-mono text-[14px] font-light leading-[21px] tracking-[-0.28px] text-[#999999]">
          blog / …
        </a>
      </HeroBar>
      <div className="flex flex-col bg-deep lg:flex-row">
        <div className="flex flex-col lg:w-[644px] lg:shrink-0">
          <div className="relative flex-1">
            <img src={POST_BG} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <PixelCorner />
            <div className="relative flex flex-col items-center gap-[15px] p-8 text-center lg:items-start lg:px-8 lg:pb-20 lg:pt-16 lg:text-left">
              <Chip>{category}</Chip>
              {/* Text effect on load (motion.js TEXT_EFFECT): title per word, 50ms stagger, y 10 -> 0;
                  description per character, all at once, ~20ms after the title. */}
              <AppearText
                as="h1"
                split="word"
                easing={TEXT_EFFECT.easing}
                className="max-w-[580px] font-inter text-[32px] font-medium leading-[38.4px] tracking-[-1.28px] text-cream lg:font-display lg:text-[40px] lg:font-normal lg:leading-[48px] lg:tracking-[-1.6px]"
              >
                {title}
              </AppearText>
              <div className="opacity-[0.64]">
                <AppearText split="char" delay={20} easing={TEXT_EFFECT.easing} className="font-display text-[21px] leading-[29.4px] tracking-[-0.84px] text-cream">
                  {description}
                </AppearText>
              </div>
            </div>
          </div>
          <div className="line-t grid h-[71px] shrink-0 grid-cols-2">
            <MetaCell icon="icon-author" label="Written by" className="shadow-[inset_-1px_0_0_theme(colors.line)]">
              {author}
            </MetaCell>
            <MetaCell icon="icon-date" label="Date added">
              <time dateTime={datetime || undefined}>{date || ''}</time>
            </MetaCell>
          </div>
        </div>
        <div className="h-[334px] p-3 lg:h-auto lg:flex-1 lg:shadow-[inset_1px_0_0_theme(colors.line)]">
          <div className="relative h-full overflow-hidden">
            <img src={FRAME_BG} alt="" className="absolute inset-0 h-full w-full object-cover" />
            {cover && <img src={cover} alt="" className="relative h-full w-full object-contain px-6" />}
            <span className="hairline pointer-events-none absolute inset-0" aria-hidden="true" />
          </div>
        </div>
      </div>
    </Shell>
  )
}

const SHARE_ICONS = {
  x: <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />,
  facebook: (
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  ),
  linkedin: (
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
  ),
  reddit: (
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  ),
  copy: (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </g>
  ),
  share: (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" />
    </g>
  ),
}

const SHARE_TEXT = 'Great%20read%20from%20our%20blog'
const SHARES = [
  ['x', 'Share on X', (u) => `https://x.com/intent/tweet?url=${u}&text=${SHARE_TEXT}`],
  ['facebook', 'Share on Facebook', (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`],
  ['linkedin', 'Share on LinkedIn', (u) => `https://www.linkedin.com/shareArticle?url=${u}`],
  ['reddit', 'Share on Reddit', (u) => `https://www.reddit.com/submit?url=${u}&title=${SHARE_TEXT}`],
  ['copy', 'Copy link'],
  ['share', 'Share'],
]

function share(kind, intent) {
  const url = window.location.href
  if (intent) return void window.open(intent(encodeURIComponent(url)), '_blank', 'noopener,noreferrer')
  if (kind === 'copy') return void navigator.clipboard?.writeText(url).catch(() => {})
  if (navigator.share) navigator.share({ url, title: document.title }).catch(() => {})
}

// Share bar (content.md §2.4, landing.md T1.4).
export function ShareBar() {
  return (
    <Shell inner="lg:px-[192px]">
      <div className="hairline flex flex-col items-center gap-6 bg-deep px-3 py-8 md:h-16 md:flex-row md:justify-between md:gap-0 md:p-3">
        <div className="flex items-center gap-3">
          <Dots tone="page" className="hidden md:inline-flex" />
          <h2 className="font-mono text-[14px] leading-[16.8px] tracking-[-0.56px] text-cream">Share the article</h2>
        </div>
        <div className="flex gap-3">
          {SHARES.map(([k, label, intent]) => (
            <button
              key={k}
              type="button"
              aria-label={label}
              title={label}
              onClick={() => share(k, intent)}
              className="flex h-10 w-10 items-center justify-center text-white transition-opacity duration-200"
            >
              <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="currentColor" aria-hidden="true">
                {SHARE_ICONS[k]}
              </svg>
            </button>
          ))}
        </div>
      </div>
    </Shell>
  )
}

// One post rendered as the shared BlogCard. size: 'index' (424, image 242), 'related' (437, 250),
// 'category' (385, 220, empty author cell).
const CARD_IMAGE = {
  index: 'h-[209px] lg:h-[242px]',
  related: 'h-[223px] lg:h-[250px]',
  category: 'h-[220px]',
}
export function PostCard({ post, size = 'index', className = '' }) {
  return (
    <BlogCard
      href={`/blog/${post.slug}`}
      image={post.thumb}
      tag={post.category}
      title={post.title}
      description={post.cardExcerpt || post.excerpt}
      author={size === 'category' ? '' : post.author}
      imageClass={CARD_IMAGE[size]}
      titleClass="line-clamp-2"
      metaTone="text-blog-muted"
      loading={size === 'index' ? 'lazy' : undefined}
      className={className}
    />
  )
}

// "You might also like" title band + three flush related cards (content.md §2.5, landing.md T1.5).
export function RelatedPosts({ posts }) {
  return (
    <>
      <TitleRow title="You might also like" />
      <Shell inner="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-0">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} size="related" />
        ))}
      </Shell>
    </>
  )
}

// ---- Case studies (content.md §4-5, landing.md T5) ----

const CS = (f) => A(`case-studies/${f}`)
export const CASE_STUDIES = [
  {
    slug: 'restack',
    title: 'Restack scales real-time enterprise observability with GlassFlow',
    logo: CS('gU6Xy4ekBJSu57RtzjJJ0U3x1Q.svg'),
    logoW: 71,
  },
  {
    slug: 'nubrain',
    title: 'Nubrain fixes the silent errors of AI agents in their pipelines',
    logo: CS('71EJsST8RQxnFwMo7Alb9eWZXcI.svg'),
    logoW: 134,
  },
]

// Bar + dithered-mountain heading panel. index: 263 tall (image contain); detail pages' "You might also like": 184 (cover).
export function CaseStudiesTitle({ as: Tag = 'h1', title = 'Case Studies', compact = false }) {
  return (
    <Shell as="section">
      <HeroBar bg="bg-bar" />
      <div className={`relative flex items-center justify-center overflow-hidden bg-panel p-8 lg:px-8 lg:py-16 ${compact ? 'lg:h-[184px]' : 'lg:h-[263px]'}`}>
        <img src={MOUNTAIN_BG} alt="" className={`absolute inset-0 h-full w-full ${compact ? 'object-cover' : 'object-contain'}`} />
        <PixelCorner />
        <Tag className="relative text-center font-display text-[32px] leading-[32px] tracking-[-1.28px] text-cream md:text-[40px] md:leading-[40px] md:tracking-[-1.6px]">
          {title}
        </Tag>
      </div>
    </Shell>
  )
}

export function CaseStudyCards() {
  return (
    <Shell inner="grid grid-cols-1 md:grid-cols-2 md:gap-1 md:p-1">
      {CASE_STUDIES.map((c) => (
        <a key={c.slug} href={`/case-studies/${c.slug}`} className="cs-card flex flex-col bg-deep">
          <div className="hairline flex h-[78px] items-center p-6">
            <img src={c.logo} alt={c.slug} className="h-[30px]" style={{ width: c.logoW }} />
          </div>
          <div className="hairline flex h-[121px] p-6">
            <h3 className="max-w-[602px] font-display text-[26px] font-medium leading-[36.4px] tracking-[-1.04px] text-cream">
              {c.title}
            </h3>
          </div>
          <TextRollButton as="span" trigger="none" label="read more" frame="hairline bg-deep" fill="bg-panel text-cream" />
        </a>
      ))}
    </Shell>
  )
}
