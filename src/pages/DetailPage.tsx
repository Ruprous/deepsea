import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SiteLayout from '../components/layout/SiteLayout'
import Lightbox from '../components/Lightbox'
import { useMobile } from '../hooks/useMobile'
import { useFitText } from '../hooks/useFitText'
import { formatDate } from '../utils/formatDate'
import { thumbSrc, fullSrc } from '../utils/img'
import { getList, getThumb, labelsOf, NOIMAGE, onThumbError, onThumbLoad, type CreditItem, type Kind } from '../utils/works'

/** "Role：Name1,Name2" 形式の文字列も { role, name, url? } 形式も同じ形に揃える */
function parseCredit(c: string | CreditItem): { role: string; names: { name: string; url?: string }[] } {
  if (typeof c !== 'string') return { role: c.role, names: [{ name: c.name, url: c.url }] }
  const i = c.indexOf('：')
  if (i === -1) return { role: c, names: [] }
  return {
    role: c.slice(0, i).trim(),
    names: c.slice(i + 1).split(',').map(n => ({ name: n.trim() })).filter(n => n.name),
  }
}

/** Work / Lab 共通の詳細ページ */
export default function DetailPage({ kind, id }: { kind: Kind; id?: string }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMobile(700)
  const [lightbox, setLightbox] = useState<{ index: number } | null>(null)

  const fromList = (location.state as { fromList?: boolean } | null)?.fromList ?? false
  const labels = labelsOf(kind)
  const entry = getList(kind).find(w => w.id === id)
  const listLabel = kind === 'lab' ? 'LAB' : 'WORKS'

  const { containerRef, fontSize } = useFitText(entry?.title ?? '', "'Zen Kaku Gothic New', sans-serif", 900, '-0.02em', 64, 20)

  const back = (
    <button
      type="button"
      className="pill sm outline back"
      onClick={() => (fromList ? navigate(-1) : navigate(`/${kind}`))}
    >
      ← BACK TO {listLabel}
    </button>
  )

  if (!entry) {
    return (
      <SiteLayout videoSafe>
        {back}
        <p className="v">Not found.</p>
      </SiteLayout>
    )
  }

  const thumb = getThumb(entry)
  const hasImage = thumb !== NOIMAGE
  const types = entry.types.map(t => labels[t] ?? t)
  const links = [
    ...(entry.youtubeId ? [{ label: 'YouTubeで見る', url: `https://www.youtube.com/watch?v=${entry.youtubeId}` }] : []),
    ...(entry.links ?? []),
  ]
  const credits = (entry.credit ?? []).map(parseCredit)

  // Lightbox は「メイン画像（あれば）→ ギャラリー」の順。ギャラリーの n 枚目は 1 + n
  const lightboxImages = [
    ...(hasImage ? [fullSrc(thumb)] : []),
    ...(entry.images ?? []).map(fullSrc),
  ]
  const thumbOffset = hasImage ? 1 : 0

  return (
    <SiteLayout videoSafe showRights={kind === 'work'}>
      {back}

      <span className="kicker">{`// ${types.join(' / ').toUpperCase()}`}</span>
      <div className="fit" ref={isMobile ? undefined : containerRef}>
        <h1 style={isMobile ? { fontSize: 'clamp(26px, 7.4vw, 40px)' } : { fontSize }}>{entry.title}</h1>
      </div>
      <hr className="rule" />

      <div className="detail">
        <div>
          {entry.youtubeId ? (
            <div className="media video">
              <iframe
                src={`https://www.youtube.com/embed/${entry.youtubeId}`}
                title={entry.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : hasImage && (
            <div className="media zoom">
              <img
                src={fullSrc(thumb)}
                alt={entry.title}
                onLoad={onThumbLoad}
                onError={onThumbError}
                onClick={() => setLightbox({ index: 0 })}
              />
            </div>
          )}

          {entry.sections?.map((s, i) => (
            <div key={i} className={`sec${s.heading ? '' : ' plain'}`}>
              {s.heading && <h4>{s.heading}</h4>}
              <p dangerouslySetInnerHTML={{ __html: s.body }} />
            </div>
          ))}

          {!!entry.images?.length && (
            <div className="gallery">
              {entry.images.map((src, i) => (
                <button key={src} type="button" onClick={() => setLightbox({ index: thumbOffset + i })} aria-label={`${entry.title} の画像 ${i + 1} を拡大`}>
                  <img src={thumbSrc(src)} alt={`${entry.title} - ${i + 1}`} loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}
        </div>

        <aside>
          {!!entry.client?.length && (
            <div className="card">
              <span className="k">CLIENT</span>
              {entry.client.map(c => <p key={c} className="v">{c}</p>)}
            </div>
          )}

          {credits.length > 0 && (
            <div className="card">
              <span className="k">CREDIT</span>
              {credits.map((c, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <span className="sub">{c.role.toUpperCase()}</span>
                  {c.names.map((n, j) => n.url ? (
                    <a key={j} className="v credit-link" href={n.url} target="_blank" rel="noopener noreferrer">{n.name}<i>↗</i></a>
                  ) : (
                    <span key={j} className="v" style={{ display: 'block' }}>{n.name}</span>
                  ))}
                </div>
              ))}
            </div>
          )}

          {links.length > 0 && (
            <div className="card">
              <span className="k">LINKS</span>
              <div className="linkrow">
                {links.map(l => (
                  <a key={l.url} className={`pill sm${l.url.includes('youtube.com') ? ' lime' : ''}`} href={l.url} target="_blank" rel="noopener noreferrer">
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <span className="k">INFO</span>
            <span className="sub">TYPE</span>
            {types.map(t => <p key={t} className="v">{t}</p>)}
            <span className="sub" style={{ marginTop: 10 }}>DATE</span>
            <p className="v">{formatDate(entry.date)}</p>
          </div>
        </aside>
      </div>

      {lightbox && <Lightbox images={lightboxImages} initialIndex={lightbox.index} onClose={() => setLightbox(null)} />}
    </SiteLayout>
  )
}
