import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header     from '../components/layout/Header'
import Footer     from '../components/layout/Footer'
import HeroSphere from '../components/Hero/HeroSphere'
import worksData  from '../data/works.json'

// ── 型定義 ────────────────────────────────────────────────
interface Section {
  heading?: string
  body: string
}

interface WorkLink {
  label: string
  url: string
}

interface Work {
  id: string
  title: string
  types: string[]
  date: string
  thumbnail?: string
  youtubeId?: string
  credit?: string[]
  links?: WorkLink[]
  sections?: Section[]
  images?: string[]
  contain?: boolean
}

// ── タイプ表示名マッピング ────────────────────────────────
const TYPE_LABELS: Record<string, string> = {
  Cover:         'COVER',
  Logo:          'LOGO',
  Font:          'FONT',
  Graphic:       'GRAPHIC',
  MusicVideo:    'MUSIC VIDEO',
  Advertisement: 'AD',
  GameplayEdit:  'GAMEPLAY',
  Video:         'VIDEO',
  Direction:     'DIRECTION',
}

const NOIMAGE = '/images/works/noimage.jpg'

function getThumb(work: Work): string {
  if (work.thumbnail) return work.thumbnail
  if (work.youtubeId)  return `https://img.youtube.com/vi/${work.youtubeId}/hqdefault.jpg`
  return NOIMAGE
}

const allWorks = worksData as Work[]

// ─────────────────────────────────────────────────────────
export default function WorkDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0 })
    const t = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(t)
  }, [id])

  const work = allWorks.find(w => w.id === id)

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

      <main style={{ flex: 1, position: 'relative', zIndex: 1, padding: '120px 160px 80px' }}>

        {/* ── 戻るリンク ── */}
        <Link
          to="/work"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-smart)',
            fontSize: '10px',
            letterSpacing: '0.25em',
            color: 'rgba(255,255,255,0.45)',
            textDecoration: 'none',
            marginBottom: '48px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
        >
          ← BACK TO WORKS
        </Link>

        {/* ── 作品が見つからない場合 ── */}
        {!work ? (
          <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-smart)', fontSize: '13px', letterSpacing: '0.1em' }}>
            Work not found.
          </p>
        ) : (
          <>
            {/* ── メタ情報 ── */}
            <div style={{ marginBottom: '32px' }}>
              <p style={{
                fontFamily: 'var(--font-smart)',
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: 'var(--color-accent)',
                marginBottom: '10px',
              }}>
                // {work.types.map(t => TYPE_LABELS[t] ?? t).join(' / ')}
              </p>
              <h1 style={{
                fontFamily: 'var(--font-avenir)',
                fontSize: 'clamp(32px, 4vw, 60px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: '#fff',
                marginBottom: '16px',
              }}>
                {work.title}
              </h1>
            </div>

            {/* 区切り線 */}
            <div style={{ width: '100%', height: '1px', background: 'rgba(0,119,255,0.2)', marginBottom: '48px' }} />

            {/* ── 2カラムレイアウト ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 320px',
              gap: '64px',
              alignItems: 'start',
            }}>

              {/* ── 左：メインコンテンツ ── */}
              <div>
                {/* サムネイル */}
                <div style={{
                  width: '100%',
                  ...(work.contain ? {} : { aspectRatio: '16/9' }),
                  overflow: 'hidden',
                  position: 'relative',
                  background: 'rgba(0,119,255,0.05)',
                  marginBottom: '40px',
                }}>
                  {work.youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${work.youtubeId}`}
                      title={work.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                    />
                  ) : work.contain ? (
                    /* 元比率のまま表示 */
                    <img
                      src={getThumb(work)}
                      alt={work.title}
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  ) : (
                    <img
                      src={getThumb(work)}
                      alt={work.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  )}
                  {/* 下部ボーダー */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    height: '2px',
                    background: 'var(--color-accent)',
                  }} />
                </div>

                {/* sections */}
                {work.sections && work.sections.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginBottom: '48px' }}>
                    {work.sections.map((sec, i) => (
                      sec.heading ? (
                        <div key={i} style={{ borderLeft: '2px solid var(--color-accent)', paddingLeft: '20px' }}>
                          <p style={{
                            fontFamily: 'var(--font-smart)',
                            fontSize: '20px',
                            letterSpacing: '0.25em',
                            color: 'var(--color-accent)',
                            marginBottom: '10px',
                          }}>
                            {sec.heading}
                          </p>
                          <p
                            style={{
                              fontFamily: 'var(--font-noto-sans)',
                              fontSize: '14px',
                              lineHeight: 1.9,
                              letterSpacing: '0.04em',
                              color: 'rgba(255,255,255,0.75)',
                              whiteSpace: 'pre-wrap',
                            }}
                            dangerouslySetInnerHTML={{ __html: sec.body }}
                          />
                        </div>
                      ) : (
                        <p
                          key={i}
                          style={{
                            fontFamily: 'var(--font-noto-sans)',
                            fontSize: '14px',
                            lineHeight: 1.9,
                            letterSpacing: '0.04em',
                            color: 'rgba(255,255,255,0.75)',
                            whiteSpace: 'pre-wrap',
                          }}
                          dangerouslySetInnerHTML={{ __html: sec.body }}
                        />
                      )
                    ))}
                  </div>
                )}

                {/* 追加画像ギャラリー（任意） */}
                {work.images && work.images.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px',
                    marginBottom: '48px',
                  }}>
                    {work.images.map((src, i) => (
                      <div key={i} style={{
                        aspectRatio: '16/9',
                        overflow: 'hidden',
                        position: 'relative',
                        background: 'rgba(0,119,255,0.05)',
                      }}>
                        <img
                          src={src}
                          alt={`${work.title} - ${i + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          height: '2px', background: 'var(--color-accent)',
                        }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── 右：サイドバー ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                {/* クレジット */}
                {work.credit && work.credit.length > 0 && (
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-smart)',
                      fontSize: '9px',
                      letterSpacing: '0.3em',
                      color: 'var(--color-accent)',
                      marginBottom: '16px',
                    }}>
                      CREDIT
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {work.credit.map((c, i) => {
                        const sep   = c.indexOf('：')
                        const role  = sep !== -1 ? c.slice(0, sep).trim() : c
                        const raw   = sep !== -1 ? c.slice(sep + 1) : ''
                        const names = raw.split(',').map(n => n.trim()).filter(Boolean)
                        return (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{
                              fontFamily: 'var(--font-smart)',
                              fontSize: '9px',
                              letterSpacing: '0.2em',
                              color: 'rgba(255,255,255,0.35)',
                              marginBottom: '1px',
                            }}>
                              {role.toUpperCase()}
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              {names.map((name, j) => (
                                <span key={j} style={{
                                  fontFamily: 'var(--font-noto-sans)',
                                  fontSize: '13px',
                                  letterSpacing: '0.04em',
                                  color: 'rgba(255,255,255,0.75)',
                                }}>
                                  {name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* リンク */}
                {(work.youtubeId || (work.links && work.links.length > 0)) && (
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-smart)',
                      fontSize: '9px',
                      letterSpacing: '0.3em',
                      color: 'var(--color-accent)',
                      marginBottom: '12px',
                    }}>
                      LINKS
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {/* YouTube リンク（自動生成） */}
                      {work.youtubeId && (() => {
                        const url = `https://www.youtube.com/watch?v=${work.youtubeId}`
                        return (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontFamily: 'var(--font-smart)',
                              fontSize: '10px',
                              letterSpacing: '0.15em',
                              color: 'rgba(255,255,255,0.6)',
                              textDecoration: 'none',
                              padding: '8px 14px',
                              border: '1px solid rgba(255,255,255,0.15)',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLAnchorElement).style.color = '#fff'
                              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,119,255,0.6)'
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.6)'
                              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.15)'
                            }}
                          >
                            YouTubeで見る
                            <span style={{ fontSize: '11px' }}>↗</span>
                          </a>
                        )
                      })()}
                      {/* JSON links */}
                      {work.links && work.links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontFamily: 'var(--font-smart)',
                            fontSize: '10px',
                            letterSpacing: '0.15em',
                            color: 'rgba(255,255,255,0.6)',
                            textDecoration: 'none',
                            padding: '8px 14px',
                            border: '1px solid rgba(255,255,255,0.15)',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLAnchorElement).style.color = '#fff'
                            ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,119,255,0.6)'
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.6)'
                            ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.15)'
                          }}
                        >
                          {link.label}
                          <span style={{ fontSize: '11px' }}>↗</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* 基本情報 */}
                <div>
                  <p style={{
                    fontFamily: 'var(--font-smart)',
                    fontSize: '9px',
                    letterSpacing: '0.3em',
                    color: 'var(--color-accent)',
                    marginBottom: '12px',
                  }}>
                    INFO
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <p style={{ fontFamily: 'var(--font-smart)', fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', marginBottom: '3px' }}>TYPE</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {work.types.map(t => (
                          <p key={t} style={{ fontFamily: 'var(--font-noto-sans)', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                            {TYPE_LABELS[t] ?? t}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-smart)', fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', marginBottom: '3px' }}>DATE</p>
                      <p style={{ fontFamily: 'var(--font-noto-sans)', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                        {work.date}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}
      </main>

      {/* フッター */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Footer />
      </div>
    </div>
  )
}
