// Rich-text renderer for blog posts and case studies (specs/content.md §2.3, specs/landing.md T1.3).
// Typography lives in index.css (.article ...) so CMS HTML can be dropped in later unchanged.
//
// blocks: array of
//   { t: 'p', c: node }                         paragraph (node may contain <strong>/<em>/<a>/<code>)
//   { t: 'h1q', c: text }                        the unstyled body <h1> quirk (black Inter 16/19.2)
//   { t: 'h2' | 'h3' | 'h4', c: text, id? }      headings (h4 renders as a bold-paragraph heading)
//   { t: 'ul' | 'ol', items: [node | { c: node, items: [...] }] }   lists, one nesting level
//   { t: 'img', src, w?, h?, alt?, href? }       in-body image (w 720 new posts / 800 older, natural aspect)
//   { t: 'table', head: [..], rows: [[..]] }
//   { t: 'code', lang?, code }                   code block with Copy button
//   { t: 'quote', c: node }                      blockquote
import { useState } from 'react'
import { Shell } from './ui.jsx'

// Minimal tokenizer for the GitHub-dark palette (§0.3 / T1.3): keywords, strings, numbers, comments.
const KEYWORDS =
  /^(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|FULL|OUTER|INNER|ANY|ALL|SEMI|ANTI|ASOF|ARRAY|ON|USING|AS|AND|OR|NOT|IN|IS|NULL|CREATE|TABLE|VIEW|MATERIALIZED|INSERT|INTO|VALUES|ENGINE|ORDER|BY|GROUP|LIMIT|SETTINGS|TO|WITH|PRIMARY|KEY|DROP|ALTER|IF|EXISTS|import|from|def|return|const|let|var|function|class|async|await|export|true|false|null|None|True|False)$/i
const TOKEN = /(--[^\n]*|#[^\n]*|\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)/g

function highlight(code) {
  const out = []
  let last = 0
  let m
  let i = 0
  TOKEN.lastIndex = 0
  while ((m = TOKEN.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index))
    const [tok, comment, str, num, word] = m
    let cls = ''
    if (comment) cls = 'text-[#8B949E]'
    else if (str) cls = 'text-[#A5D6FF]'
    else if (num) cls = 'text-[#7EE787]'
    else if (word && KEYWORDS.test(word)) cls = /^(true|false|null|none)$/i.test(word) ? 'text-[#7EE787]' : 'text-[#FF7B72]'
    out.push(cls ? <span key={i++} className={cls}>{tok}</span> : tok)
    last = m.index + tok.length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}

export function CodeBlock({ code }) {
  return (
    <div className="article-code relative">
      <pre>
        <code>{highlight(code)}</code>
      </pre>
      <button
        type="button"
        aria-label="Copy code"
        onClick={() => navigator.clipboard?.writeText(code).catch(() => {})}
        className="absolute right-[14px] top-[14px] h-8 w-[52px] rounded-[10px] border border-white/[0.12] bg-black/[0.35] px-[10px] py-2 font-sys text-[12px] font-semibold leading-none text-white"
      >
        Copy
      </button>
    </div>
  )
}

function List({ ordered, items }) {
  const Tag = ordered ? 'ol' : 'ul'
  return (
    <Tag>
      {items.map((it, i) =>
        it && typeof it === 'object' && 'items' in it ? (
          <li key={i}>
            {it.c}
            <List ordered={it.ordered} items={it.items} />
          </li>
        ) : (
          <li key={i}>{it}</li>
        ),
      )}
    </Tag>
  )
}

function Block({ b }) {
  switch (b.t) {
    case 'p':
      return <p>{b.c}</p>
    case 'h1q':
      return <h1 className="article-h1-quirk">{b.c}</h1>
    case 'h2':
      return <h2 id={b.id}>{b.c}</h2>
    case 'h3':
      return <h3 id={b.id}>{b.c}</h3>
    case 'h4':
      return (
        <p id={b.id}>
          <strong>{b.c}</strong>
        </p>
      )
    case 'ul':
    case 'ol':
      return <List ordered={b.t === 'ol'} items={b.items} />
    case 'img': {
      const img = <img src={b.src} alt={b.alt || ''} width={b.w} height={b.h} loading="lazy" style={b.w ? { width: b.w } : undefined} />
      return b.href ? (
        <a href={b.href} target={b.external ? '_blank' : undefined} rel={b.external ? 'noopener noreferrer' : undefined} className="article-img-link">
          {img}
        </a>
      ) : (
        img
      )
    }
    case 'table':
      return (
        <figure className="article-table">
          <table>
            <thead>
              <tr>
                {b.head.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      )
    case 'code':
      return <CodeBlock code={b.code} />
    case 'quote':
      return (
        <blockquote>
          <p>{b.c}</p>
        </blockquote>
      )
    default:
      return null
  }
}

export function ArticleContent({ blocks, className = '' }) {
  return (
    <div className={`article ${className}`}>
      {blocks.map((b, i) => (
        <Block key={i} b={b} />
      ))}
    </div>
  )
}

// Post body column: 928 wide with side rules, padding 32 64 64, 800px measure (mobile 32 24 64, 340 measure).
export default function ArticleBody({ blocks }) {
  return (
    <Shell inner="lg:px-[192px]">
      <div className="px-6 pb-16 pt-8 md:shadow-[inset_1px_0_0_theme(colors.line),inset_-1px_0_0_theme(colors.line)] lg:px-16">
        <ArticleContent blocks={blocks} className="mx-auto max-w-[800px]" />
      </div>
    </Shell>
  )
}
