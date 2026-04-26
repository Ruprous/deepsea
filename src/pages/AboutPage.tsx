import { useState, useEffect } from 'react'
import Header     from '../components/layout/Header'
import Footer     from '../components/layout/Footer'
import HeroSphere from '../components/Hero/HeroSphere'
import { useMobile } from '../hooks/useMobile'

const sns = [
  { label: 'X / Twitter', href: 'https://x.com/Ruprous' },
  { label: 'YouTube',     href: 'https://www.youtube.com/@ruprous' },
  { label: 'エブリスタ',  href: 'https://estar.jp/users/364457212' },
  { label: 'foriio',      href: 'https://www.foriio.com/ruprous' },
  { label: 'Behance',     href: 'https://www.behance.net/Ruprous' },
]

const distribution = [
  { label: 'BOOTH',  href: 'https://ruprous.booth.pm/' },
  { label: 'GitHub', href: 'https://github.com/Ruprous' },
]

const software = [
  'Adobe Illustrator',
  'Adobe Photoshop',
  'Adobe Premiere Pro',
  'Adobe After Effects',
  'Blender',
  'AviUtl',
  'AviUtl2',
  '自作ツール（Python など）',
]

export default function AboutPage() {
  const [visible, setVisible] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      minHeight: '100svh',
      background: 'var(--color-bg)',
      color: 'var(--color-text)',
      position: 'relative',
      overflow: 'hidden',
      opacity: visible ? 1 : 0,
      transition: 'opacity 1.4s ease-out',
    }}>
      {/* 背景スフィア：固定表示 */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <HeroSphere />
      </div>

      <Header />

      <main
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: isMobile ? '100px 24px 60px' : '120px 80px 80px',
        }}
      >
        {/* ラベル */}
        <p style={{
          fontFamily: 'var(--font-smart)',
          fontSize: '10px',
          letterSpacing: '0.3em',
          color: 'var(--color-accent)',
          marginBottom: '16px',
        }}>
          // ABOUT
        </p>

        {/* 見出し + ロゴ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '48px' }}>
          <h1 style={{
            fontFamily: 'var(--font-avenir)',
            fontSize: 'clamp(48px, 6vw, 88px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: '#fff',
            margin: 0,
          }}>
            About
          </h1>
          <img
            src="/images/Logo_white.png"
            alt="Ruprous Logo"
            style={{ height: 'clamp(56px, 7vw, 101px)', width: 'auto', objectFit: 'contain', pointerEvents: 'none' }}
          />
        </div>

        {/* メインコンテンツ：2カラム→モバイルは縦積み */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'auto 1fr',
          gap: isMobile ? '32px' : '64px',
          alignItems: 'start',
        }}>

          {/* 左：アイコン画像 + 名前 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
            <img
              src="/images/icon_square.png"
              alt="Ruprous"
              style={{
                width: '180px',
                height: '180px',
                objectFit: 'cover',
                border: '1px solid rgba(0,119,255,0.3)',
              }}
            />
            <div style={{ textAlign: 'left', width: '180px' }}>
              <p style={{
                fontFamily: 'var(--font-avenir)',
                fontSize: '26px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: '#fff',
                lineHeight: 1.2,
              }}>
                Ruprous
              </p>
              <p style={{
                fontFamily: 'var(--font-noto-serif)',
                fontSize: '17px',
                letterSpacing: '-0.05em',
                color: 'rgba(255,255,255,0.6)',
                marginTop: '4px',
              }}>
                ラプラス
              </p>
            </div>
          </div>

          {/* 右：テキスト */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 自己紹介 */}
            <div style={{
              background: 'rgba(5,5,8,0.25)',
              padding: '20px 20px 20px 16px',
            }}>
              <p style={{
                fontFamily: 'var(--font-smart)',
                fontSize: '13px',
                lineHeight: 2.2,
                letterSpacing: '0.08em',
                color: '#fff',
                wordBreak: 'break-word',
                marginBottom: '20px',
              }}>
                グラフィックデザイナー・デジタルクリエイター。2018年10月より独学でグラフィックデザインを開始。<br />
                現在に至るまで多くのクリエイティブ制作に携わる。<br />
                「色んなことを楽しくやる。」をスローガンに掲げる組織、TEAM PNZに所属。
              </p>
              <p style={{
                fontFamily: 'var(--font-smart)',
                fontSize: '13px',
                lineHeight: 2.2,
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.7)',
                wordBreak: 'break-word',
                marginBottom: '20px',
              }}>
                ラプラス [ləplάːs] です。読めない？いや、読むんですよ。
              </p>
              <p style={{
                fontFamily: 'var(--font-smart)',
                fontSize: '13px',
                lineHeight: 2.2,
                letterSpacing: '0.08em',
                color: '#fff',
                wordBreak: 'break-word',
              }}>
                お客様の「こうしたい！」というお気持ちを丁寧にヒアリングし、目的に合った形で表現することを大切にしています。
                デザインと映像を通じて、"伝わる・惹きつける"クリエイティブをお届けします。<br />
                お気軽にご相談ください！
              </p>
            </div>

            {/* SNS */}
            <div style={{ background: 'rgba(5,5,8,0.25)', padding: '20px' }}>
              <p style={{
                fontFamily: 'var(--font-smart)',
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: 'var(--color-accent)',
                marginBottom: '16px',
              }}>
                // SNS
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0' }}>
                {sns.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: '1px solid rgba(0,119,255,0.2)',
                      gap: '12px',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#fff')}
                  >
                    <span style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-smart)', fontSize: '11px' }}>//</span>
                    <span style={{
                      fontFamily: 'var(--font-smart)',
                      fontSize: '11px',
                      letterSpacing: '0.15em',
                      color: 'inherit',
                    }}>
                      {s.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* DISTRIBUTION */}
            <div style={{ background: 'rgba(5,5,8,0.25)', padding: '20px' }}>
              <p style={{
                fontFamily: 'var(--font-smart)',
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: 'var(--color-accent)',
                marginBottom: '16px',
              }}>
                // DISTRIBUTION
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0' }}>
                {distribution.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: '1px solid rgba(0,119,255,0.2)',
                      gap: '12px',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#fff')}
                  >
                    <span style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-smart)', fontSize: '11px' }}>//</span>
                    <span style={{
                      fontFamily: 'var(--font-smart)',
                      fontSize: '11px',
                      letterSpacing: '0.15em',
                      color: 'inherit',
                    }}>
                      {s.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* 使用ソフト */}
            <div style={{ background: 'rgba(5,5,8,0.25)', padding: '20px' }}>
              <p style={{
                fontFamily: 'var(--font-smart)',
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: 'var(--color-accent)',
                marginBottom: '16px',
              }}>
                // TOOLS
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0' }}>
                {software.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid rgba(0,119,255,0.2)',
                    gap: '12px',
                  }}>
                    <span style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-smart)', fontSize: '11px' }}>//</span>
                    <span style={{
                      fontFamily: 'var(--font-smart)',
                      fontSize: '11px',
                      letterSpacing: '0.15em',
                      color: '#fff',
                    }}>
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* フッター */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2 }}>
        <Footer />
      </div>
    </div>
  )
}
