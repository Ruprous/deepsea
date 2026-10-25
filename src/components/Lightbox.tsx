import { useEffect, useRef, useState } from 'react'

interface LightboxProps {
  images: string[]
  initialIndex?: number
  onClose: () => void
}

/** 画像の拡大表示。← → キー・スワイプ・Esc に対応 */
export default function Lightbox({ images, initialIndex = 0, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const touchStartX = useRef<number | null>(null)
  const multi = images.length > 1

  useEffect(() => {
    const prev = () => setIndex(i => (i - 1 + images.length) % images.length)
    const next = () => setIndex(i => (i + 1) % images.length)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, images.length])

  const go = (d: number) => setIndex(i => (i + d + images.length) % images.length)

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="画像の拡大表示"
      onClick={onClose}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        if (touchStartX.current === null) return
        const delta = e.changedTouches[0].clientX - touchStartX.current
        if (delta > 50) go(-1)
        if (delta < -50) go(1)
        touchStartX.current = null
      }}
    >
      <button type="button" className="pill sm lb-close" onClick={onClose}>CLOSE ✕</button>
      {multi && <p className="lb-count">{index + 1} / {images.length}</p>}
      {multi && (
        <button type="button" className="pill icon lb-nav l" aria-label="前の画像" onClick={e => { e.stopPropagation(); go(-1) }}>←</button>
      )}
      <img src={images[index]} alt={`image ${index + 1}`} onClick={e => e.stopPropagation()} />
      {multi && (
        <button type="button" className="pill icon lb-nav r" aria-label="次の画像" onClick={e => { e.stopPropagation(); go(1) }}>→</button>
      )}
    </div>
  )
}
