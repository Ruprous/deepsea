import { useState, useEffect } from 'react'
import HeroSphere from './HeroSphere'
import HeroLeft   from './HeroLeft'
import HeroRight  from './HeroRight'
import WaveLines  from './WaveLines'
import { useMobile } from '../../hooks/useMobile'

export default function HeroSection() {
  const [visible, setVisible] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      className="relative w-full"
      style={{
        minHeight: '100svh',
        background: 'var(--color-bg)',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1.4s ease-out',
      }}
    >
      {/* 球体 Canvas */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <HeroSphere />
      </div>

      {/* 波形装飾 */}
      <WaveLines corner="top-right" />
      <WaveLines corner="bottom-left" />

      {/* 左端 縦書きテキスト（PCのみ） */}
      {!isMobile && (
        <div
          className="z-10"
          style={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'visible',
            pointerEvents: 'none',
          }}
        >
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
        <div
          className="z-10"
          style={{
            position: 'absolute',
            right: 0, top: 0, bottom: 0,
            width: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'visible',
            pointerEvents: 'none',
          }}
        >
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

      {/* レイアウト */}
      <div
        className="relative z-10"
        style={{
          minHeight: '100svh',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
          padding: isMobile ? '0 24px' : '0 48px',
        }}
      >
        <HeroLeft />
        {!isMobile && <div />}
        {!isMobile && <HeroRight />}
      </div>
    </section>
  )
}
