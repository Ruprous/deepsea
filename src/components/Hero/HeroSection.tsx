import { useState, useEffect } from 'react'
import HeroSphere from './HeroSphere'
import HeroLeft   from './HeroLeft'
import HeroRight  from './HeroRight'
import WaveLines  from './WaveLines'

export default function HeroSection() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Canvas初期化を待ってからフェードイン開始
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
      {/* 球体 Canvas：全画面（カメラのX位置で球体を右寄りに見せる） */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <HeroSphere />
      </div>

      {/* 波形装飾：右上・左下 */}
      <WaveLines corner="top-right" />
      <WaveLines corner="bottom-left" />

      {/* 左端 縦書きテキスト */}
      <div
        className="z-10"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
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

      {/* 右端 縦書きテキスト */}
      <div
        className="z-10"
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
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

      {/* 3カラムレイアウト：左テキスト・中央スフィア・右テキスト */}
      <div
        className="relative z-10"
        style={{
          minHeight: '100svh',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          padding: '0 48px',
        }}
      >
        <HeroLeft />
        {/* 中央：球体エリア（何も置かない） */}
        <div />
        <HeroRight />
      </div>
    </section>
  )
}
