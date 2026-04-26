import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

const navLinks = [
  { label: 'WORK',    to: '/work' },
  { label: 'ABOUT',   to: '/about' },
  { label: 'LAB',     to: '/lab' },
  { label: 'CONTACT', to: '/contact' },
]

const linkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-smart)',
  fontSize: '11px',
  letterSpacing: '0.2em',
  color: '#fff',
  textDecoration: 'none',
  pointerEvents: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '4px',
}

const THRESHOLD = 8 // この px 以上動いたときだけ方向を判定

export default function Header() {
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)
  const lastDirection = useRef<'up' | 'down'>('up')

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      const diff = currentY - lastScrollY.current

      // 閾値未満の微小な動きは無視（ジッター防止）
      if (Math.abs(diff) < THRESHOLD) return

      if (diff > 0) {
        // 下スクロール：ページトップ付近は常に表示
        if (currentY > 80) setVisible(false)
        lastDirection.current = 'down'
      } else {
        // 上スクロール：表示
        setVisible(true)
        lastDirection.current = 'up'
      }

      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        height: '64px',
        background: 'transparent',
        pointerEvents: 'none',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.4s ease',
      }}
    >
      {/* ロゴ */}
      <Link
        to="/"
        style={{
          fontFamily: 'var(--font-avenir)',
          fontSize: '18px',
          fontWeight: 700,
          letterSpacing: '0.04em',
          color: 'var(--color-text)',
          textDecoration: 'none',
          pointerEvents: 'auto',
        }}
      >
        Ruprous
      </Link>

      {/* ナビゲーション */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
        {navLinks.map(({ label, to }) => (
          <Link
            key={label}
            to={to}
            style={linkStyle}
            onMouseEnter={e => {
              const line = e.currentTarget.querySelector('.nav-line') as HTMLElement
              if (line) line.style.transform = 'scaleX(1)'
            }}
            onMouseLeave={e => {
              const line = e.currentTarget.querySelector('.nav-line') as HTMLElement
              if (line) line.style.transform = 'scaleX(0)'
            }}
          >
            {label}
            <span
              className="nav-line"
              style={{
                display: 'block',
                height: '1px',
                background: 'var(--color-accent)',
                transform: 'scaleX(0)',
                transformOrigin: 'center',
                transition: 'transform 0.3s ease',
              }}
            />
          </Link>
        ))}
      </nav>
    </header>
  )
}
