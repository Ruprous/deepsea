import { useEffect, useRef, useState } from 'react'

interface LightboxProps {
  images: string[]
  initialIndex?: number
  onClose: () => void
}

export default function Lightbox({ images, initialIndex = 0, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const touchStartX = useRef<number | null>(null)
  const multi = images.length > 1

  const prev = () => setIndex(i => (i - 1 + images.length) % images.length)
  const next = () => setIndex(i => (i + 1) % images.length)

  // キーボード操作 & スクロール禁止
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, images.length])

  // タッチスワイプ
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (delta >  50) prev()
    if (delta < -50) next()
    touchStartX.current = null
  }

  const navBtn = (onClick: () => void, label: string, side: 'left' | 'right') => (
    <button
      onClick={e => { e.stopPropagation(); onClick() }}
      style={{
        position: 'absolute',
        top: '50%',
        [side]: '20px',
        transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        color: 'rgba(255,255,255,0.7)',
        fontFamily: 'var(--font-smart)',
        fontSize: '18px',
        width: '44px',
        height: '44px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        zIndex: 1,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.18)'
        ;(e.currentTarget as HTMLButtonElement).style.color = '#fff'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'
        ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'
      }}
    >
      {label}
    </button>
  )

  return (
    <div
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.2s ease',
        cursor: 'zoom-out',
      }}
    >
      {/* 閉じるボタン */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.6)',
          fontFamily: 'var(--font-smart)',
          fontSize: '10px',
          letterSpacing: '0.25em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
      >
        CLOSE ✕
      </button>

      {/* カウンター */}
      {multi && (
        <p style={{
          position: 'absolute',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-smart)',
          fontSize: '10px',
          letterSpacing: '0.25em',
          color: 'rgba(255,255,255,0.45)',
        }}>
          {index + 1} / {images.length}
        </p>
      )}

      {/* 左ボタン */}
      {multi && navBtn(prev, '←', 'left')}

      {/* 画像 */}
      <img
        src={images[index]}
        alt={`image ${index + 1}`}
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          objectFit: 'contain',
          display: 'block',
          cursor: 'default',
          userSelect: 'none',
        }}
      />

      {/* 右ボタン */}
      {multi && navBtn(next, '→', 'right')}
    </div>
  )
}
