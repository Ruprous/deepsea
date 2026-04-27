import { useState, useEffect } from 'react'

const THRESHOLD = 300

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > THRESHOLD)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.color = '#fff'
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.6)'
        ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(5,5,12,0.9)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)'
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.25)'
        ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(5,5,12,0.7)'
      }}
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 50,
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(5,5,12,0.7)',
        border: '1px solid rgba(255,255,255,0.25)',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '16px',
        cursor: 'pointer',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.3s ease, color 0.2s, border-color 0.2s, background 0.2s',
      }}
      aria-label="ページトップへ戻る"
    >
      ↑
    </button>
  )
}
