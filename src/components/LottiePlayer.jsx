import { useEffect, useRef } from 'react'
import lottie from 'lottie-web/build/player/lottie_canvas'

// Autoplaying, looping Lottie on a transparent canvas (specs/products.md §3.4).
export default function LottiePlayer({ src, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const anim = lottie.loadAnimation({
      container: ref.current,
      renderer: 'canvas',
      loop: true,
      autoplay: true,
      path: src,
      rendererSettings: { clearCanvas: true, preserveAspectRatio: 'xMidYMid meet' },
    })
    return () => anim.destroy()
  }, [src])
  return <div ref={ref} className={className} aria-hidden="true" />
}
