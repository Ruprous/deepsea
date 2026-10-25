import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import QMark from '../ui/QMark'
import { Ring, Burst } from '../ui/Deco'
import { thumbSrc } from '../../utils/img'
import { allWorks, entryNo, fmtNo, LONG_LABELS, type Entry } from '../../utils/works'

// 中心(cx,cy)・面積・回転（単位 u）。画像の縦横比が違っても見た目の大きさが揃う
const SLOTS = [
  { cx: 20, cy: 10, area: 300, rot:  3 },
  { cx:  9, cy: 25, area: 270, rot: -7 },
  { cx: 27, cy: 28, area: 320, rot:  5 },
  { cx: 11, cy: 42, area: 190, rot: -3 },
]

const POOL = allWorks.filter(w => w.thumbnail || w.youtubeId)

function pickRandom(): Entry[] {
  const pool = POOL.slice()
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, SLOTS.length)
}

// ステッカーは小さいので YouTube は mqdefault（320x180）で足りる
const stickerSrc = (e: Entry) => (e.thumbnail ? thumbSrc(e.thumbnail) : `https://img.youtube.com/vi/${e.youtubeId}/mqdefault.jpg`)

function Sticker({ entry, slot, index }: { entry: Entry; slot: (typeof SLOTS)[number]; index: number }) {
  const [ar, setAr] = useState<number | null>(null)
  const a = ar ?? 1.5
  const style = {
    '--cx': slot.cx,
    '--cy': slot.cy,
    '--rot': `${slot.rot}deg`,
    '--d': `${index * 90}ms`,
    '--ar': a,
    '--wu': Math.sqrt(slot.area * a).toFixed(2),
    zIndex: index + 1,
  } as CSSProperties

  return (
    <Link to={`/work/${entry.id}`} className={`sticker${ar ? ' on' : ''}`} style={style} title={entry.title}>
      <span className="ph">
        <img
          src={stickerSrc(entry)}
          alt={entry.title}
          decoding="async"
          onLoad={e => {
            const img = e.currentTarget
            setAr(Math.min(Math.max(img.naturalWidth / img.naturalHeight, 0.66), 1.9))
          }}
        />
      </span>
      <span className="chip">{fmtNo(entryNo('work', entry.id))} {LONG_LABELS[entry.types[0]] ?? entry.types[0]}</span>
    </Link>
  )
}

/** 中央：青いQ + 全作品からランダムに選ぶ4枚のステッカー。chaos 中は高速で入れ替わる */
export default function StickerStage({ chaos }: { chaos: boolean }) {
  const [picked, setPicked] = useState<Entry[]>(pickRandom)
  const [round, setRound] = useState(0)
  const shuffle = useCallback(() => { setPicked(pickRandom()); setRound(r => r + 1) }, [])

  useEffect(() => {
    if (!chaos) return
    const t = window.setInterval(shuffle, 240)
    return () => window.clearInterval(t)
  }, [chaos, shuffle])

  return (
    <div className="stage">
      <Ring spin className="ring" />
      <QMark className="q" />
      <Burst to="/work" value={allWorks.length} label="WORKS" />
      {picked.map((w, i) => <Sticker key={`${round}-${w.id}`} entry={w} slot={SLOTS[i]} index={i} />)}
      <button type="button" className="pill icon shuffle" onClick={shuffle} aria-label="Shuffle works" title="Shuffle">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 12a8 8 0 1 1-2.6-5.9" />
          <path d="M20 4v5h-5" />
        </svg>
      </button>
      <span className="cross" style={{ left: '-6%', top: '2%' }} aria-hidden="true">+</span>
      <span className="cross" style={{ right: '-4%', top: '6%' }} aria-hidden="true">+</span>
      <span className="cross" style={{ right: '2%', bottom: '-2%' }} aria-hidden="true">+</span>
    </div>
  )
}
