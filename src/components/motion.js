// Shared motion primitives. Every value here was measured on the live original
// (www.glassflow.ai, Framer) - see the comments for the source of each number.
import { useEffect, useLayoutEffect, useRef } from 'react'

export const EASE = {
  // Framer spring { bounce: 0, duration: 1 } exactly as Framer hands it to WAAPI
  // (read from Animation.effect.getTiming().easing on the hero words).
  springB0D1: 'linear(0 0%, 0.0041 1.01%, 0.0154 2.02%, 0.0326 3.03%, 0.0545 4.04%, 0.0802 5.05%, 0.1088 6.06%, 0.1396 7.07%, 0.172 8.08%, 0.2054 9.09%, 0.2395 10.10%, 0.2738 11.11%, 0.308 12.12%, 0.3419 13.13%, 0.3752 14.14%, 0.4078 15.15%, 0.4396 16.16%, 0.4704 17.17%, 0.5001 18.18%, 0.5288 19.19%, 0.5563 20.20%, 0.5827 21.21%, 0.6079 22.22%, 0.6319 23.23%, 0.6547 24.24%, 0.6764 25.25%, 0.6969 26.26%, 0.7164 27.27%, 0.7348 28.28%, 0.7522 29.29%, 0.7686 30.30%, 0.784 31.31%, 0.7985 32.32%, 0.8122 33.33%, 0.825 34.34%, 0.837 35.35%, 0.8483 36.36%, 0.8588 37.37%, 0.8687 38.38%, 0.8779 39.39%, 0.8866 40.40%, 0.8946 41.41%, 0.9022 42.42%, 0.9092 43.43%, 0.9157 44.44%, 0.9218 45.45%, 0.9275 46.46%, 0.9328 47.47%, 0.9377 48.48%, 0.9423 49.49%, 0.9466 50.50%, 0.9505 51.51%, 0.9542 52.52%, 0.9576 53.53%, 0.9608 54.54%, 0.9637 55.55%, 0.9664 56.56%, 0.969 57.57%, 0.9713 58.58%, 0.9735 59.59%, 0.9755 60.60%, 0.9774 61.61%, 0.9791 62.62%, 0.9807 63.63%, 0.9822 64.64%, 0.9836 65.65%, 0.9848 66.66%, 0.986 67.67%, 0.9871 68.68%, 0.9881 69.69%, 0.989 70.70%, 0.9899 71.71%, 0.9906 72.72%, 0.9914 73.73%, 0.9921 74.74%, 0.9927 75.75%, 0.9932 76.76%, 0.9938 77.77%, 0.9943 78.78%, 0.9947 79.79%, 0.9951 80.80%, 0.9955 81.81%, 0.9959 82.82%, 0.9962 83.83%, 0.9965 84.84%, 0.9968 85.85%, 0.997 86.86%, 0.9973 87.87%, 0.9975 88.88%, 0.9977 89.89%, 0.9979 90.90%, 0.998 91.91%, 0.9982 92.92%, 0.9983 93.93%, 0.9985 94.94%, 0.9986 95.95%, 0.9987 96.96%, 0.9988 97.97%, 0.9989 98.98%, 1 100%)',
  // Framer spring { bounce: 0.2, duration: 0.4 } (stiffness 505.6, damping 35.98, mass 1),
  // sampled every 10ms; matches the measured dropdown opacity curve.
  springB02D04: 'linear(0.0000 0%, 0.0224 2.5%, 0.0794 5%, 0.1581 7.5%, 0.2486 10%, 0.3435 12.5%, 0.4375 15%, 0.5269 17.5%, 0.6093 20%, 0.6833 22.5%, 0.7484 25%, 0.8044 27.5%, 0.8518 30%, 0.8911 32.5%, 0.9231 35%, 0.9487 37.5%, 0.9688 40%, 0.9841 42.5%, 0.9954 45%, 1.0036 47.5%, 1.0091 50%, 1.0125 52.5%, 1.0144 55%, 1.0151 57.5%, 1.0150 60%, 1.0142 62.5%, 1.0131 65%, 1.0118 67.5%, 1.0104 70%, 1.0089 72.5%, 1.0076 75%, 1.0063 77.5%, 1.0051 80%, 1.0041 82.5%, 1.0032 85%, 1.0024 87.5%, 1.0018 90%, 1.0013 92.5%, 1.0009 95%, 1.0006 97.5%, 1.0003 100%)',
  // Primary button hover: tween 0.4s ease [.44, 0, 0, 1]
  primary: 'cubic-bezier(0.44, 0, 0, 1)',
  // FAQ open/close and nav link hover: ease [.5, 0, .88, .77]
  easeInish: 'cubic-bezier(0.5, 0, 0.88, 0.77)',
  // /tares "What is in Tares" accordion: ~0.45s, rows ~89% of the way at 150ms
  // (96,40 -> 46,89 -> 40,96 at 490ms); fast-out curve fitted to those samples.
  tabs: 'cubic-bezier(0.16, 1, 0.3, 1)',
  // Legacy black template, mobile menu open (/kafka-to-clickhouse-pipeline-guide @390):
  // opacity 0 -> 1 measured per frame fits 1 - e^(-t / 97ms) (rms 0.011); 600ms to settle.
  legacyMenu: 'linear(0 0%, 0.2660 5%, 0.4613 10%, 0.6046 15%, 0.7098 20%, 0.7870 25%, 0.8437 30%, 0.8852 35%, 0.9158 40%, 0.9382 45%, 0.9546 50%, 0.9667 55%, 0.9756 60%, 0.9821 65%, 0.9868 70%, 0.9903 75%, 0.9929 80%, 0.9948 85%, 0.9962 90%, 0.9972 95%, 1 100%)',
}

// Blog post + /about hero text (Framer Text Effect, measured via an Element.animate hook on fresh load):
// opacity .001 -> 1 and blur(10px) -> 0 via WAAPI, 600ms, ease [.5, 0, .88, .77], fill both.
// Titles: per word, 50ms stagger, plus y 10px -> 0 on the same timing.
// Descriptions: per character, no y; post description all chars delay 0, /about paragraphs delay
// = visual line index * 50ms (continuing across paragraphs).
export const TEXT_EFFECT = { duration: 600, stagger: 50, easing: EASE.easeInish }

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Fire `cb` once when `el` enters the viewport. Framer's text effect uses
// inView(el, cb, { amount: 0 }) -> any visible pixel, no root margin, once.
export function onInViewOnce(el, cb, { amount = 0, rootMargin = '0px' } = {}) {
  if (!el) return () => {}
  if (typeof IntersectionObserver === 'undefined') {
    cb()
    return () => {}
  }
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect()
        cb()
      }
    },
    { threshold: amount, rootMargin },
  )
  io.observe(el)
  return () => io.disconnect()
}

// Per-word appear (Framer Text Effect "appear", tokenization: word):
//   from { opacity: .001, filter: blur(10px), y: 10px } to rest,
//   spring bounce 0 / 1s, stagger 50ms per word, trigger onInView (amount 0), once.
// With reduced motion Framer drops everything but opacity; we do the same.
// Initial hidden state lives in index.css ([data-reveal-words] .reveal-word).
export function revealWords(root, { stagger = 50, duration = 1000 } = {}) {
  const words = root.querySelectorAll('.reveal-word')
  const reduced = prefersReducedMotion()
  const from = reduced
    ? { opacity: 0.001 }
    : { opacity: 0.001, filter: 'blur(10px)', transform: 'translateY(10px)' }
  const to = reduced ? { opacity: 1 } : { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' }
  words.forEach((w, i) => {
    const done = () => w.setAttribute('data-revealed', '')
    if (!w.animate) return done()
    const a = w.animate([from, to], {
      duration,
      delay: i * stagger,
      easing: EASE.springB0D1,
      fill: 'both',
    })
    a.finished.then(() => {
      done()
      a.cancel()
    }).catch(() => {})
  })
}

export function useRevealWords(ref) {
  useEffect(() => onInViewOnce(ref.current, () => revealWords(ref.current)), [ref])
}

// Product pages text appear (specs/products.md §1.5.1): same blur/opacity/y start as the
// home words, but triggered on mount (not in view), 0.6s Framer "ease" [.44,0,.56,1],
// 50ms per word in headings; paragraphs fade as one block.
// Targets: `root` itself if it has .appear-part, else every .appear-part inside it.
export const APPEAR = { duration: 600, stagger: 50, easing: 'cubic-bezier(0.44, 0, 0.56, 1)' }

// Options (all default to the product-page values above):
//   easing      WAAPI easing
//   y           false = opacity + blur only (per-character text effects have no y)
//   lineStagger > 0: delay by visual line instead of by index (line = index of the distinct
//               top edge among the parts, in DOM order), as Framer does on /about.
export function appear(
  root,
  { delay = 0, stagger = APPEAR.stagger, duration = APPEAR.duration, easing = APPEAR.easing, y = true, lineStagger = 0 } = {},
) {
  if (!root) return
  const parts = root.classList.contains('appear-part') ? [root] : [...root.querySelectorAll('.appear-part')]
  const reduced = prefersReducedMotion()
  const from = reduced
    ? { opacity: 0.001 }
    : y
      ? { opacity: 0.001, filter: 'blur(10px)', transform: 'translateY(10px)' }
      : { opacity: 0.001, filter: 'blur(10px)' }
  const to = reduced
    ? { opacity: 1 }
    : y
      ? { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' }
      : { opacity: 1, filter: 'blur(0px)' }
  let delays
  if (lineStagger) {
    let line = -1
    let lastTop = -Infinity
    delays = parts.map((el) => {
      const top = el.getBoundingClientRect().top
      if (top > lastTop + 4) {
        line += 1
        lastTop = top
      }
      return delay + line * lineStagger
    })
  } else {
    delays = parts.map((_, i) => delay + i * stagger)
  }
  parts.forEach((el, i) => {
    const done = () => el.setAttribute('data-revealed', '')
    if (!el.animate) return done()
    const a = el.animate([from, to], { duration, delay: delays[i], easing, fill: 'both' })
    // Mount-only, never scroll-gated: the live effects all run once on load. If the document
    // timeline stalls (hidden/backgrounded tab, offscreen parts not ticked), force the end state on
    // a timer so below-the-fold text is never left at its .001 start opacity waiting for a scroll.
    const fallback = setTimeout(() => {
      if (a.playState !== 'finished') a.finish()
    }, delays[i] + duration + 50)
    a.finished.then(() => {
      clearTimeout(fallback)
      done()
      a.cancel()
    }).catch(() => {
      clearTimeout(fallback)
      done()
    })
  })
}

export function useAppear(ref, opts) {
  useEffect(() => appear(ref.current, opts), [ref]) // eslint-disable-line react-hooks/exhaustive-deps
}

// Height change animated the way Framer's layout animation reads on the FAQ rows:
// the row's box eases from its old to its new height while following siblings jump
// straight to their final position (a compensating margin keeps the flow fixed).
// Measured: 200ms, cubic-bezier(.5, 0, .88, .77), both directions.
export function animateHeight(el, from, to, { duration = 200, easing = EASE.easeInish } = {}) {
  if (!el || from === to || !el.animate || prefersReducedMotion()) return
  const prev = { position: el.style.position, zIndex: el.style.zIndex, overflow: el.style.overflow }
  el.style.position = 'relative'
  el.style.zIndex = '1'
  el.style.overflow = 'hidden'
  const a = el.animate(
    [
      { height: `${from}px`, marginBottom: `${to - from}px` },
      { height: `${to}px`, marginBottom: '0px' },
    ],
    { duration, easing },
  )
  const restore = () => Object.assign(el.style, prev)
  a.finished.then(restore).catch(restore)
}

// Records an element's height right before a state change and animates to the
// new height after React commits it. Call `capture()` before setState.
export function useHeightTransition(dep, opts) {
  const ref = useRef(null)
  const from = useRef(null)
  const capture = () => {
    if (ref.current) from.current = ref.current.getBoundingClientRect().height
  }
  useLayoutEffect(() => {
    if (from.current == null || !ref.current) return
    animateHeight(ref.current, from.current, ref.current.getBoundingClientRect().height, opts)
    from.current = null
  }, [dep]) // eslint-disable-line react-hooks/exhaustive-deps
  return [ref, capture]
}
