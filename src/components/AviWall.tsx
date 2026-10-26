import { useCallback, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import Lightbox from './Lightbox'
import { useReveal } from '../hooks/useReveal'
import { fullSrc, thumbSrc } from '../utils/img'

const INITIAL_SEED = 20261027

/** 乱数。シードが同じなら毎回同じ並び・同じ傾きになる */
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Pose { id: number; dx: number; dy: number; rot: number; sc: number }

/** 並びを混ぜ、それぞれに「ずれ・傾き・大きさ」を与える（ずれの単位は自分の大きさに対する割合） */
function layout(n: number, seed: number): Pose[] {
  const r = rng(seed)
  const ids = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
  }
  return ids.map(id => ({ id, dx: (r() - 0.5) * 0.36, dy: (r() - 0.5) * 0.36, rot: (r() - 0.5) * 18, sc: 0.92 + r() * 0.2 }))
}

interface TileProps { pose: Pose; src: string; onOpen: (id: number) => void; bump: () => number }

/** ステッカー1枚。マウスならドラッグで動かせる（スマホはスクロールを邪魔しないよう、タップで拡大だけ） */
function Tile({ pose, src, onOpen, bump }: TileProps) {
  const reveal = useReveal<HTMLButtonElement>()
  const grab = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)
  const moved = useRef(false)

  function down(e: PointerEvent<HTMLButtonElement>) {
    if (e.pointerType === 'touch' || e.button !== 0) return
    const el = e.currentTarget
    grab.current = {
      x: e.clientX, y: e.clientY,
      ox: parseFloat(el.style.getPropertyValue('--mx')) || 0,
      oy: parseFloat(el.style.getPropertyValue('--my')) || 0,
    }
    moved.current = false
    el.style.setProperty('--z', String(bump())) // 触ったものを一番手前に
    try { el.setPointerCapture(e.pointerId) } catch { /* 取れなくても、要素の上にいる間は動かせる */ }
  }
  function move(e: PointerEvent<HTMLButtonElement>) {
    const g = grab.current
    if (!g) return
    const dx = e.clientX - g.x
    const dy = e.clientY - g.y
    if (!moved.current && Math.hypot(dx, dy) < 5) return
    moved.current = true
    const el = e.currentTarget
    el.classList.add('drag')
    el.style.setProperty('--mx', `${g.ox + dx}px`)
    el.style.setProperty('--my', `${g.oy + dy}px`)
  }
  function up(e: PointerEvent<HTMLButtonElement>) {
    grab.current = null
    e.currentTarget.classList.remove('drag')
  }

  return (
    <button
      type="button"
      className="stk"
      data-rv="0"
      ref={reveal}
      style={{ '--dx': pose.dx, '--dy': pose.dy, '--rot': `${pose.rot}deg`, '--sc': pose.sc } as CSSProperties}
      aria-label={`Avi ${pose.id + 1} を拡大`}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onClick={() => { if (moved.current) { moved.current = false; return } onOpen(pose.id) }}
    >
      <img src={src} alt="" draggable={false} decoding="async" loading="lazy" />
    </button>
  )
}

/**
 * Avi のステッカー壁。全部を少し傾けて重ねて貼り、ドラッグで動かせる（マウス）。
 * クリックで拡大表示。シャッフルで貼り直し（並び・傾き・重なりがすべて変わる）。
 */
export default function AviWall({ images }: { images: string[] }) {
  const [seed, setSeed] = useState(INITIAL_SEED)
  const [open, setOpen] = useState<number | null>(null)
  const poses = useMemo(() => layout(images.length, seed), [images.length, seed])
  const top = useRef(10)
  const bump = useCallback(() => ++top.current, [])
  const thumbs = useMemo(() => images.map(thumbSrc), [images])

  return (
    <div className="avi-wall-wrap" role="region" aria-label="Avi ギャラリー">
      <div className="avi-head">
        <span className="k">{'// GALLERY'}</span>
        <span className="avi-ctrl">
          <span className="avi-count">{images.length} PIECES</span>
          <button
            type="button"
            className="pill icon"
            onClick={() => setSeed(Math.floor(Math.random() * 1e9))}
            aria-label="貼り直す"
            title="Shuffle"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 12a8 8 0 1 1-2.6-5.9" />
              <path d="M20 4v5h-5" />
            </svg>
          </button>
        </span>
      </div>
      <p className="avi-hint">DRAG TO MOVE // CLICK TO ZOOM</p>

      <div className="avi-wall">
        {poses.map(p => <Tile key={`${seed}-${p.id}`} pose={p} src={thumbs[p.id]} onOpen={setOpen} bump={bump} />)}
      </div>

      {open !== null && <Lightbox images={images.map(fullSrc)} initialIndex={open} onClose={() => setOpen(null)} />}
    </div>
  )
}
