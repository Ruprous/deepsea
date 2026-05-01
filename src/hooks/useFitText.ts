import { useRef, useState, useEffect } from 'react'

/**
 * コンテナ幅に合わせてフォントサイズを自動調整するフック
 * オフスクリーンの計測用 span を使うことで overflow の影響を受けない
 *
 * ref → wrapper div に付ける
 * fontSize → h1 の fontSize に使う
 */
export function useFitText(
  text: string,
  fontFamily: string,
  fontWeight: string | number,
  letterSpacing: string,
  maxSize = 60,
  minSize = 16,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState(maxSize)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // オフスクリーン計測用 span
    const probe = document.createElement('span')
    probe.style.cssText = [
      'position:fixed',
      'top:-9999px',
      'left:-9999px',
      'visibility:hidden',
      'white-space:nowrap',
      `font-family:${fontFamily}`,
      `font-weight:${fontWeight}`,
      `letter-spacing:${letterSpacing}`,
    ].join(';')
    probe.textContent = text
    document.body.appendChild(probe)

    const fit = () => {
      const available = container.clientWidth
      if (available <= 0) return

      let lo = minSize
      let hi = maxSize

      while (hi - lo > 0.5) {
        const mid = (lo + hi) / 2
        probe.style.fontSize = `${mid}px`
        if (probe.offsetWidth <= available) {
          lo = mid
        } else {
          hi = mid
        }
      }
      setFontSize(Math.floor(lo))
    }

    const ro = new ResizeObserver(fit)
    ro.observe(container)
    fit()

    return () => {
      ro.disconnect()
      document.body.removeChild(probe)
    }
  }, [text, fontFamily, fontWeight, letterSpacing, maxSize, minSize])

  return { containerRef, fontSize }
}
