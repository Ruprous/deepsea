import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header     from '../components/layout/Header'
import Footer     from '../components/layout/Footer'
import HeroSphere  from '../components/Hero/HeroSphere'
import ScrollToTop from '../components/ScrollToTop'
import labData     from '../data/lab.json'
import { useMobile } from '../hooks/useMobile'

// ── 型定義 ────────────────────────────────────────────────
interface LabItem {
  id: string
  title: string
  types: string[]
  date: string
  thumbnail?: string
  contain?: boolean
}

// ── タイプ表示名マッピング ────────────────────────────────
const TYPE_LABELS: Record<string, string> = {
  WebSite:      'WEBSITE',
  MinecraftMOD: 'MINECRAFT MOD',
  AdobePlugin:  'ADOBE PLUGIN',
  BlenderAddon: 'BLENDER ADDON',
  StreamTool:   'STREAM TOOL',
}

const NOIMAGE = '/images/works/noimage.jpg'

function getThumb(item: LabItem): string {
  if (item.thumbnail) return item.thumbnail
  return NOIMAGE
}

// ── ソート（新しい順） ────────────────────────────────────
const allItems = (labData as LabItem[])
  .slice()
  .sort((a, b) => {
    if (!a.date) return 1
    if (!b.date) return -1
    return b.date.localeCompare(a.date)
  })

const allTypes = [
  'ALL',
  ...Array.from(new Set(allItems.flatMap(w => w.types)))
    .sort((a, b) => (TYPE_LABELS[a] ?? a).localeCompare(TYPE_LABELS[b] ?? b)),
]

// ─────────────────────────────────────────────────────────
export default function LabPage() {
  const [visible,      setVisible]      = useState(false)
  const [selectedType, setSelectedType] = useState('ALL')
  const isMobile = useMobile()

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(t)
  }, [])

  const filtered = selectedType === 'ALL'
    ? allItems
    : allItems.filter(w => w.types.includes(selectedType))

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
      {/* 背景スフィア：固定 */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <HeroSphere />
      </div>

      <Header />

      <main style={{ flex: 1, position: 'relative', zIndex: 1, padding: isMobile ? '100px 24px 60px' : '120px 160px 80px' }}>

        {/* ── ヘッダーエリア ── */}
        <div style={{ marginBottom: '40px' }}>
          <p style={{
            fontFamily: 'var(--font-smart)',
            fontSize: '10px',
            letterSpacing: '0.3em',
            color: 'var(--color-accent)',
            marginBottom: '8px',
          }}>
            // LAB
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
            <h1 style={{
              fontFamily: 'var(--font-avenir)',
              fontSize: 'clamp(48px, 6vw, 88px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              color: '#fff',
              margin: 0,
            }}>
              Lab
            </h1>
            <a
              href="https://github.com/Ruprous"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-smart)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.45)',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '6px 14px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#fff'
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.6)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)'
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.2)'
              }}
            >
              GitHub ↗
            </a>
          </div>

          {/* 区切り線 */}
          <div style={{ width: '100%', height: '1px', background: 'rgba(0,119,255,0.2)', marginBottom: '24px' }} />

          {/* フィルター */}
          {isMobile ? (
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              style={{
                fontFamily: 'var(--font-noto-sans)',
                fontSize: '11px',
                letterSpacing: '0.15em',
                padding: '9px 14px',
                background: 'rgba(5,5,12,0.8)',
                color: '#fff',
                border: '1px solid var(--color-accent)',
                cursor: 'pointer',
                width: '100%',
                appearance: 'none',
                WebkitAppearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230077ff' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center',
                paddingRight: '36px',
              }}
            >
              {allTypes.map(type => (
                <option key={type} value={type} style={{ background: '#050508', color: '#fff' }}>
                  {type === 'ALL' ? 'ALL' : (TYPE_LABELS[type] ?? type)}
                </option>
              ))}
            </select>
          ) : (
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {allTypes.map(type => {
              const active = selectedType === type
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  style={{
                    fontFamily: 'var(--font-noto-sans)',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    padding: '7px 18px',
                    background: active ? 'var(--color-accent)' : 'transparent',
                    color: '#fff',
                    border: `1px solid ${active ? 'var(--color-accent)' : 'rgba(255,255,255,0.5)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {type === 'ALL' ? 'ALL' : (TYPE_LABELS[type] ?? type)}
                </button>
              )
            })}
            </div>
          )}

          {/* 区切り線 */}
          <div style={{ width: '100%', height: '1px', background: 'rgba(0,119,255,0.2)', marginTop: '24px' }} />
        </div>

        {/* ── グリッド ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(1, 1fr)' : 'repeat(3, 1fr)',
          gap: '24px',
        }}>
          {filtered.map(item => (
            <Link
              key={item.id}
              to={`/lab/${item.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{ cursor: 'pointer' }}
                onMouseEnter={e => {
                  const img = e.currentTarget.querySelector('.lab-thumb') as HTMLImageElement
                  if (img) img.style.transform = 'scale(1.04)'
                }}
                onMouseLeave={e => {
                  const img = e.currentTarget.querySelector('.lab-thumb') as HTMLImageElement
                  if (img) img.style.transform = 'scale(1)'
                }}
              >
                {/* サムネイル */}
                <div style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  overflow: 'hidden',
                  position: 'relative',
                  background: 'rgba(0,119,255,0.05)',
                }}>
                  {item.contain ? (
                    <>
                      <img
                        src={getThumb(item)}
                        alt=""
                        aria-hidden="true"
                        style={{
                          position: 'absolute', inset: 0,
                          width: '100%', height: '100%',
                          objectFit: 'cover',
                          filter: 'blur(16px) brightness(0.35)',
                          transform: 'scale(1.12)',
                          pointerEvents: 'none',
                        }}
                      />
                      <img
                        className="lab-thumb"
                        src={getThumb(item)}
                        alt={item.title}
                        style={{
                          position: 'absolute', inset: 0,
                          width: '100%', height: '100%',
                          objectFit: 'contain',
                          display: 'block',
                          transition: 'transform 0.4s ease',
                        }}
                      />
                    </>
                  ) : (
                    <img
                      className="lab-thumb"
                      src={getThumb(item)}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.4s ease',
                      }}
                    />
                  )}
                  {/* 下部ボーダー */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'var(--color-accent)',
                  }} />

                  {/* タイプバッジ：左上オーバーレイ */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    display: 'flex',
                    gap: '4px',
                  }}>
                    {item.types.map(t => (
                      <span key={t} style={{
                        fontFamily: 'var(--font-smart)',
                        fontSize: '9px',
                        letterSpacing: '0.2em',
                        color: '#fff',
                        background: 'var(--color-accent)',
                        padding: '3px 8px',
                      }}>
                        {TYPE_LABELS[t] ?? t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* タイトル */}
                <div style={{ padding: '12px 4px 0' }}>
                  <p style={{
                    fontFamily: 'var(--font-noto-sans)',
                    fontSize: '14px',
                    letterSpacing: '0.04em',
                    color: 'rgba(255,255,255,0.85)',
                    lineHeight: 1.5,
                  }}>
                    {item.title}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── ページトップへ戻るボタン ── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '64px' }}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = '#fff'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.7)'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(5,5,12,0.85)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(5,5,12,0.6)'
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 32px',
              background: 'rgba(5,5,12,0.6)',
              color: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(255,255,255,0.3)',
              fontFamily: 'var(--font-smart)',
              fontSize: '10px',
              letterSpacing: '0.25em',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: '12px', lineHeight: 1 }}>↑</span>
            BACK TO TOP
          </button>
        </div>
      </main>

      {/* フッター */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Footer />
      </div>

      <ScrollToTop />
    </div>
  )
}
