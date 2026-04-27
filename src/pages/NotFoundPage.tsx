import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header    from '../components/layout/Header'
import Footer    from '../components/layout/Footer'
import HeroSphere from '../components/Hero/HeroSphere'
import { useMobile } from '../hooks/useMobile'

export default function NotFoundPage() {
  const [visible, setVisible] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      minHeight: '100svh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg)',
      color: 'var(--color-text)',
      position: 'relative',
      opacity: visible ? 1 : 0,
      transition: 'opacity 1.4s ease-out',
    }}>
      {/* 背景スフィア */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <HeroSphere />
      </div>

      {/* 左端 縦書きテキスト（PCのみ） */}
      {!isMobile && (
        <div style={{
          position: 'fixed',
          left: 0, top: 0, bottom: 0,
          width: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          pointerEvents: 'none',
        }}>
          <span style={{
            transform: 'rotate(-90deg)',
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-smart)',
            fontSize: '12px',
            letterSpacing: '0.25em',
            color: 'var(--color-accent)',
          }}>
            CREATE WITH INSIGHT // DESIGN WITH TECHNOLOGY // MOVE THE CULTURE
          </span>
        </div>
      )}

      {/* 右端 縦書きテキスト（PCのみ） */}
      {!isMobile && (
        <div style={{
          position: 'fixed',
          right: 0, top: 0, bottom: 0,
          width: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          pointerEvents: 'none',
        }}>
          <span style={{
            transform: 'rotate(90deg)',
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-smart)',
            fontSize: '12px',
            letterSpacing: '0.25em',
            color: 'var(--color-accent)',
          }}>
            CREATE WITH INSIGHT // DESIGN WITH TECHNOLOGY // MOVE THE CULTURE
          </span>
        </div>
      )}

      <Header />

      <main style={{
        flex: 1,
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 80px',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-smart)',
          fontSize: '10px',
          letterSpacing: '0.3em',
          color: 'var(--color-accent)',
          marginBottom: '16px',
        }}>
          // 404
        </p>

        <h1 style={{
          fontFamily: 'var(--font-avenir)',
          fontSize: 'clamp(80px, 16vw, 180px)',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: '#fff',
          marginBottom: '24px',
        }}>
          404
        </h1>

        <p style={{
          fontFamily: 'var(--font-smart)',
          fontSize: '12px',
          letterSpacing: '0.25em',
          color: 'rgba(255,255,255,0.45)',
          marginBottom: '56px',
        }}>
          PAGE NOT FOUND
        </p>

        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 32px',
            background: 'transparent',
            color: 'rgba(255,255,255,0.65)',
            border: '1px solid rgba(255,255,255,0.3)',
            fontFamily: 'var(--font-smart)',
            fontSize: '10px',
            letterSpacing: '0.25em',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = '#fff'
            ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.7)'
            ;(e.currentTarget as HTMLAnchorElement).style.background = 'rgba(5,5,12,0.85)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.65)'
            ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.3)'
            ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
          }}
        >
          <span style={{ fontSize: '12px', lineHeight: 1 }}>←</span>
          BACK TO HOME
        </Link>
      </main>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Footer />
      </div>
    </div>
  )
}
