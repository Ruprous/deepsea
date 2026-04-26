import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useMobile } from '../../hooks/useMobile'

const navLinks = [
  { label: 'WORK',    to: '/work' },
  { label: 'ABOUT',   to: '/about' },
  { label: 'LAB',     to: '/lab' },
  { label: 'CONTACT', to: '/contact' },
]

const THRESHOLD = 8

export default function Header() {
  const [visible,     setVisible]     = useState(true)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const lastScrollY   = useRef(0)
  const isMobile      = useMobile()

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      const diff = currentY - lastScrollY.current
      if (Math.abs(diff) < THRESHOLD) return
      if (diff > 0) {
        if (currentY > 80) setVisible(false)
      } else {
        setVisible(true)
      }
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // メニュー開いてる間はスクロール無効
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '0 24px' : '0 48px',
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
          onClick={() => setMenuOpen(false)}
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

        {/* PC ナビ */}
        {!isMobile && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
            {navLinks.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                style={{
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
                }}
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
        )}

        {/* モバイル ハンバーガーボタン */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            style={{
              pointerEvents: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
            }}
            aria-label="メニューを開く"
          >
            <span style={{
              display: 'block', width: '24px', height: '1.5px',
              background: '#fff',
              transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
              transition: 'transform 0.3s ease',
            }} />
            <span style={{
              display: 'block', width: '24px', height: '1.5px',
              background: '#fff',
              opacity: menuOpen ? 0 : 1,
              transition: 'opacity 0.3s ease',
            }} />
            <span style={{
              display: 'block', width: '24px', height: '1.5px',
              background: '#fff',
              transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
              transition: 'transform 0.3s ease',
            }} />
          </button>
        )}
      </header>

      {/* モバイル フルスクリーンメニュー */}
      {isMobile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: 'rgba(5,5,12,0.97)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '80px 32px 48px',
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? 'auto' : 'none',
            transition: 'opacity 0.3s ease',
          }}
        >
          {/* 上部ラベル */}
          <p style={{
            fontFamily: 'var(--font-smart)',
            fontSize: '9px',
            letterSpacing: '0.35em',
            color: 'var(--color-accent)',
          }}>
            // NAVIGATION
          </p>

          {/* ナビリスト */}
          {menuOpen && (
            <nav style={{ display: 'flex', flexDirection: 'column' }}>
              {navLinks.map(({ label, to }, i) => (
                <Link
                  key={label}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className="menu-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '24px 0',
                    borderBottom: '1px solid rgba(0,119,255,0.2)',
                    textDecoration: 'none',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-smart)',
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    color: 'var(--color-accent)',
                    minWidth: '24px',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-avenir)',
                    fontSize: '32px',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    color: '#fff',
                    flex: 1,
                  }}>
                    {label}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-smart)',
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.3)',
                  }}>
                    ↗
                  </span>
                </Link>
              ))}
            </nav>
          )}

          {/* 下部アンビエント情報 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <p style={{
              fontFamily: 'var(--font-smart)',
              fontSize: '9px',
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.2)',
            }}>
              Ruprous — KANAGAWA, JAPAN
            </p>
            <p style={{
              fontFamily: 'var(--font-smart)',
              fontSize: '9px',
              letterSpacing: '0.2em',
              color: 'rgba(0,119,255,0.4)',
            }}>
              // DESIGN WITH TECHNOLOGY
            </p>
          </div>
        </div>
      )}
    </>
  )
}
