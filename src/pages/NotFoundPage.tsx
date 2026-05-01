import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Header    from '../components/layout/Header'
import Footer    from '../components/layout/Footer'
import HeroSphere from '../components/Hero/HeroSphere'
import { useMobile } from '../hooks/useMobile'
// ── ランダム作品用 ──────────────────────────────────────
import worksData from '../data/works.json'

const NOIMAGE = '/images/works/noimage.jpg'
const TYPE_LABELS: Record<string, string> = {
  Cover: 'COVER', Logo: 'LOGO', Font: 'FONT', Graphic: 'GRAPHIC',
  Thumbnail: 'THUMBNAIL', MusicVideo: 'MUSIC VIDEO', Advertisement: 'AD',
  GameplayEdit: 'GAMEPLAY', Video: 'VIDEO', Direction: 'DIRECTION',
}
function getThumb(work: { thumbnail?: string; youtubeId?: string }) {
  if (work.thumbnail) return work.thumbnail
  if (work.youtubeId)  return `https://img.youtube.com/vi/${work.youtubeId}/maxresdefault.jpg`
  return NOIMAGE
}
// ───────────────────────────────────────────────────────

export default function NotFoundPage() {
  const [visible, setVisible] = useState(false)
  const isMobile = useMobile()

  // ── ランダム作品ブロック ────────────────────────────────
  const randomWork = useMemo(() => {
    const pool = (worksData as { id: string; title: string; types: string[]; thumbnail?: string; youtubeId?: string; contain?: boolean }[])
      .filter(w => getThumb(w) !== NOIMAGE)
    return pool[Math.floor(Math.random() * pool.length)]
  }, [])
  // ───────────────────────────────────────────────────────

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

        {/* ── ランダム作品ブロック ────────────────────────── */}
        {randomWork && (
          <div style={{ width: '100%', maxWidth: '320px', marginBottom: '48px' }}>
            <p style={{
              fontFamily: 'var(--font-smart)',
              fontSize: '9px',
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.3)',
              marginBottom: '16px',
            }}>
              MAYBE YOU'LL LIKE THIS
            </p>
            <Link to={`/work/${randomWork.id}`} style={{ textDecoration: 'none' }}>
              <div
                onMouseEnter={e => {
                  const img = e.currentTarget.querySelector('.r-thumb') as HTMLImageElement
                  if (img) img.style.transform = 'scale(1.04)'
                }}
                onMouseLeave={e => {
                  const img = e.currentTarget.querySelector('.r-thumb') as HTMLImageElement
                  if (img) img.style.transform = 'scale(1)'
                }}
              >
                <div style={{
                  width: '100%', aspectRatio: '16/9',
                  overflow: 'hidden', position: 'relative',
                  background: 'rgba(0,119,255,0.05)',
                }}>
                  {randomWork.contain ? (
                    <>
                      <img src={getThumb(randomWork)} alt="" aria-hidden="true" style={{
                        position: 'absolute', inset: 0, width: '100%', height: '100%',
                        objectFit: 'cover', filter: 'blur(16px) brightness(0.35)',
                        transform: 'scale(1.12)', pointerEvents: 'none',
                      }} />
                      <img className="r-thumb" src={getThumb(randomWork)} alt={randomWork.title} style={{
                        position: 'absolute', inset: 0, width: '100%', height: '100%',
                        objectFit: 'contain', display: 'block', transition: 'transform 0.4s ease',
                      }} />
                    </>
                  ) : (
                    <img className="r-thumb" src={getThumb(randomWork)} alt={randomWork.title} style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      display: 'block', transition: 'transform 0.4s ease',
                    }} />
                  )}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: '2px', background: 'var(--color-accent)',
                  }} />
                  <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '4px' }}>
                    {randomWork.types.map(t => (
                      <span key={t} style={{
                        fontFamily: 'var(--font-smart)', fontSize: '9px',
                        letterSpacing: '0.2em', color: '#fff',
                        background: 'var(--color-accent)', padding: '3px 8px',
                      }}>
                        {TYPE_LABELS[t] ?? t}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '10px 4px 0' }}>
                  <p style={{
                    fontFamily: 'var(--font-noto-sans)', fontSize: '13px',
                    letterSpacing: '0.04em', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5,
                  }}>
                    {randomWork.title}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        )}
        {/* ─────────────────────────────────────────────── */}

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
