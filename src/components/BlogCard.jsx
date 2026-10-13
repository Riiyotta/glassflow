import TextRollButton from './TextRollButton.jsx'

// Blog listing card (specs/products.md §3.11).
// props: href, image (url), tag, title, description, author, ctaLabel, className
//   imageClass  image box height (content pages: 242 on /blog, 250 related, 220 category pages)
//   titleClass  title overflow (content pages clamp to 2 lines: 'line-clamp-2')
//   metaTone    author-row text colour (content pages: text-blog-muted)
//   loading     img loading attribute ('lazy' on the 119-card /blog grid)
// Hover (measured on /blog, related posts and category pages): card bg panel -> card-dark, bar squares
// -> traffic lights, image scales to 1.1 and the CTA label rolls (TextRollButton trigger="group"),
// all on the Framer spring bounce .2 / .4s (scale peaks at 1.1015 ~230ms in), both directions.
// The whole card is the hover target.
const DOT_HOVER = ['group-hover:bg-traffic-red', 'group-hover:bg-traffic-yellow', 'group-hover:bg-traffic-green']
const EASE = 'duration-[400ms] ease-[var(--ease-spring-b02-d04)] motion-reduce:transition-none'

export default function BlogCard({
  href,
  image,
  tag,
  title,
  description,
  author,
  ctaLabel = 'read article',
  className = '',
  imageClass = 'h-[223px] md:h-[373px]',
  titleClass = 'truncate',
  metaTone = 'text-muted',
  loading,
}) {
  return (
    <a href={href} className={`group flex min-w-0 flex-col bg-panel transition-colors ${EASE} hover:bg-card-dark ${className}`}>
      <div className="hairline flex h-[38px] shrink-0 items-center gap-[2px] bg-deep px-4">
        {DOT_HOVER.map((h) => (
          <span key={h} className={`block h-2 w-2 bg-page transition-colors ${EASE} ${h}`} />
        ))}
      </div>
      <div className={`shrink-0 overflow-hidden ${imageClass}`}>
        <img
          src={image}
          alt=""
          loading={loading}
          className={`h-full w-full object-cover transition-transform ${EASE} group-hover:scale-110`}
        />
      </div>
      <div className="flex min-h-[190px] flex-1 flex-col gap-4 p-6">
        <span className="self-start bg-amber px-[10px] py-[6px] font-mono text-[12px] font-medium uppercase leading-[12px] text-page">
          {tag}
        </span>
        <h3 className={`${titleClass} font-mono text-[16px] font-medium leading-[20.8px] tracking-[-0.64px] text-blog-title`}>
          {title}
        </h3>
        <p className="line-clamp-2 font-display text-[16px] leading-[22px] tracking-[-0.32px] text-blog-muted">
          {description}
        </p>
      </div>
      <div className={`grid h-10 shrink-0 grid-cols-2 bg-card-dark text-[14px] leading-[21px] ${metaTone}`}>
        <span className="flex items-center justify-center font-mono">Written by</span>
        <span className="flex items-center justify-center font-display">{author}</span>
      </div>
      <TextRollButton as="span" trigger="group" label={ctaLabel} fill="bg-cream text-card-dark" className="shrink-0" />
    </a>
  )
}
