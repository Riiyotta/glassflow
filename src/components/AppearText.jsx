import { Children, Fragment, cloneElement, isValidElement, useRef } from 'react'
import { useAppear } from './motion.js'

// Blur-in text appear on mount (specs/products.md §1.5.1).
// split="word": `children` must be a string; each word animates with `stagger` ms between words (headings).
// split="block": the element fades as one block (paragraphs; the live per-character spans
// start within ~30ms of each other).
// split="char": every character is its own part (Framer Text Effect, tokenization: character).
//   Works through nested elements (<p>, <a>), splitting their string children. An element with
//   data-appear="block" animates as a single part instead (keeps text-decoration on links).
//   Words stay unbreakable (nowrap wrapper), spaces stay plain text so wrapping is unchanged.
// delay: ms offset (a lead paragraph starts ~70ms after its H1's first word).
// stagger / lineStagger / easing / y: passed through to appear() (see motion.js).
export default function AppearText({
  as: Tag = 'p',
  split = 'block',
  delay = 0,
  stagger,
  lineStagger,
  easing,
  y,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null)
  useAppear(ref, {
    delay,
    stagger: split === 'char' && stagger === undefined ? 0 : stagger,
    lineStagger,
    easing,
    y: split === 'char' && y === undefined ? false : y,
  })
  if (split === 'word' && typeof children === 'string') {
    const words = children.split(' ')
    return (
      <Tag ref={ref} className={`${y === false ? 'appear-noy ' : ''}${className}`} {...rest}>
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="appear-part inline-block">{w}</span>
            {i < words.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </Tag>
    )
  }
  if (split === 'char') {
    return (
      <Tag ref={ref} className={`${y === true ? '' : 'appear-noy '}${className}`} {...rest}>
        {splitChars(children)}
      </Tag>
    )
  }
  return (
    <Tag ref={ref} className={`appear-part ${y === false ? 'appear-noy ' : ''}${className}`} {...rest}>
      {children}
    </Tag>
  )
}

function splitChars(node) {
  if (typeof node === 'string') {
    // Each unbreakable run gets a nowrap wrapper; runs end at spaces and after hyphens / dashes /
    // slashes (adjacent inline-blocks keep the break opportunity plain text has there).
    return node.split(/(\s+)/).map((w, i) =>
      !w || /^\s+$/.test(w) ? (
        w
      ) : (
        <Fragment key={i}>
          {w.split(/(?<=[-‐-—/])/).map((run, k) => (
            <span key={k} className="inline-block whitespace-nowrap">
              {[...run].map((c, j) => (
                <span key={j} className="appear-part inline-block">
                  {c}
                </span>
              ))}
            </span>
          ))}
        </Fragment>
      ),
    )
  }
  if (Array.isArray(node)) return Children.map(node, (n) => splitChars(n))
  if (isValidElement(node)) {
    if (node.props['data-appear'] === 'block') {
      return cloneElement(node, { className: `${node.props.className || ''} appear-part` })
    }
    return cloneElement(node, undefined, splitChars(node.props.children))
  }
  return node
}
