import { useState, useEffect } from 'react'
import Header      from '../components/layout/Header'
import Footer      from '../components/layout/Footer'
import HeroSphere  from '../components/Hero/HeroSphere'
import HeroRight   from '../components/Hero/HeroRight'
import { useMobile } from '../hooks/useMobile'

const contacts = [
  {
    label: 'X / Twitter',
    value: '@Ruprous',
    href: 'https://twitter.com/Ruprous',
  },
  {
    label: 'Discord',
    value: 'Ruprous',
    href: null,
  },
  {
    label: 'Mail',
    value: 'ruprous.studio@gmail.com',
    href: 'mailto:ruprous.studio@gmail.com',
  },
  {
    label: 'ココナラ',
    value: 'coconala.com/users/3282388',
    href: 'https://coconala.com/users/3282388',
  },
]

export default function ContactPage() {
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
      {/* 背景スフィア */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <HeroSphere />
      </div>

      <Header />

      <main
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100svh',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr auto',
          padding: isMobile ? '0 24px' : '0 48px',
        }}
      >
        {/* 左カラム：コンテンツ */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: isMobile ? '100px 0 60px' : '120px 40px 80px 32px' }}>

        {/* ラベル */}
        <p
          style={{
            fontFamily: 'var(--font-smart)',
            fontSize: '10px',
            letterSpacing: '0.3em',
            color: 'var(--color-accent)',
            marginBottom: '16px',
          }}
        >
          // CONTACT
        </p>

        {/* 見出し */}
        <h1
          style={{
            fontFamily: 'var(--font-avenir)',
            fontSize: 'clamp(48px, 6vw, 88px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: '#fff',
            marginBottom: '40px',
          }}
        >
          Contact
        </h1>

        {/* 説明文 */}
        <p
          style={{
            fontFamily: 'var(--font-smart)',
            fontSize: '16px',
            lineHeight: 2,
            letterSpacing: '0.1em',
            color: '#fff',
            maxWidth: '640px',
            wordBreak: 'break-word',
            marginBottom: '64px',
            borderLeft: '1px solid rgba(0,119,255,0.3)',
            paddingLeft: '16px',
          }}
        >
          お仕事のご依頼・ご相談・ご質問など、お気軽にご連絡ください。<br />
          SNSのDMやメールでも受け付けています。<br />
          ココナラからのご依頼もお待ちしております。
        </p>

        {/* 連絡先リスト */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {contacts.map((c, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: isMobile ? '4px' : '48px',
                padding: '24px 0',
                borderTop: i === 0 ? '1px solid rgba(0,119,255,0.2)' : 'none',
                borderBottom: '1px solid rgba(0,119,255,0.2)',
              }}
            >
              {/* ラベル */}
              <span
                style={{
                  fontFamily: 'var(--font-smart)',
                  fontSize: '10px',
                  letterSpacing: '0.25em',
                  color: 'rgba(255,255,255,0.35)',
                  minWidth: isMobile ? 'unset' : '100px',
                }}
              >
                {c.label}
              </span>

              {/* 値 */}
              {c.href ? (
                <a
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  style={{
                    fontFamily: 'var(--font-smart)',
                    fontSize: isMobile ? '12px' : '13px',
                    letterSpacing: '0.1em',
                    color: '#fff',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    wordBreak: 'break-all',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#fff')}
                >
                  {c.value} <span style={{ fontSize: '12px' }}>↗</span>
                </a>
              ) : (
                <span
                  style={{
                    fontFamily: 'var(--font-smart)',
                    fontSize: isMobile ? '12px' : '13px',
                    letterSpacing: '0.1em',
                    color: '#fff',
                    wordBreak: 'break-all',
                  }}
                >
                  {c.value}
                </span>
              )}
            </div>
          ))}
        </div>
        </div>

        {/* 右カラム：HeroRight（PCのみ） */}
        {!isMobile && <HeroRight />}
      </main>

      {/* フッター：背景の上にかぶせて固定表示 */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2 }}>
        <Footer />
      </div>
    </div>
  )
}
