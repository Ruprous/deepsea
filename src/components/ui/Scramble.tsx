import { useEffect, useRef, type CSSProperties, type ElementType } from 'react'
import { canHover, reduceMotion } from '../../utils/motion'
import { whenVisible } from '../../utils/wipe'

const LATIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@+*/<>=?'
const KANA = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン'

const FRAME_MS = 50   // 文字を入れ替える間隔
const LOCK_MIN = 160  // 最初の1文字が確定するまで
const SPREAD_MAX = 520 // 最初の確定から最後の確定までの幅

function randomGlyph(original: string) {
  const pool = original.charCodeAt(0) >= 0x3000 ? KANA : LATIN
  return pool[Math.floor(Math.random() * pool.length)]
}

interface ScrambleProps {
  text: string
  as?: ElementType
  className?: string
  style?: CSSProperties
  /** mount: 表示された時に1回 / hover: 親のリンク・ボタンにホバーした時 */
  mode?: 'mount' | 'hover'
}

/**
 * 文字が別の文字にがががっと入れ替わってから、左から順に本来の文字に確定する見出し。
 * 本来の文字（.scr-real）は置いたままなのでレイアウトは動かず、動かしている間だけ上に重ねる（.scr-live）。
 * 文字を画像にしたりはしないので、検索やスクリーンリーダーには最初から本来の文字が読まれる。
 */
export default function Scramble({ text, as: Tag = 'span', className, style, mode = 'mount' }: ScrambleProps) {
  const root = useRef<HTMLElement>(null)
  const stop = useRef<() => void>(() => {})

  useEffect(() => {
    const el = root.current
    if (!el || reduceMotion()) return
    const live = el.querySelector<HTMLElement>('.scr-live')!
    const chars = [...text]
    const spread = Math.min(SPREAD_MAX, chars.length * 45)

    function play() {
      stop.current()
      const lockAt = chars.map((_, i) => LOCK_MIN + (chars.length > 1 ? (i / (chars.length - 1)) * spread : 0) + Math.random() * 90)
      const end = Math.max(...lockAt)
      const spans = chars.map(() => document.createElement('span'))
      live.replaceChildren(...spans)
      el!.dataset.s = 'run'

      let raf = 0
      let last = -FRAME_MS
      const t0 = performance.now()
      // 描画が止まる環境（裏タブなど）でも、本来の文字が隠れたままにならないようにする
      const finish = () => { el!.dataset.s = ''; live.replaceChildren() }
      const failsafe = window.setTimeout(finish, end + 1500)
      const tick = (now: number) => {
        const t = now - t0
        if (now - last >= FRAME_MS || t >= end) {
          last = now
          chars.forEach((c, i) => {
            const done = c === ' ' || t >= lockAt[i]
            spans[i].textContent = done ? c : randomGlyph(c)
            spans[i].className = done ? '' : 'sc'
          })
        }
        if (t < end) raf = requestAnimationFrame(tick)
        else finish()
      }
      raf = requestAnimationFrame(tick)
      stop.current = () => { cancelAnimationFrame(raf); window.clearTimeout(failsafe); finish() }
    }

    if (mode === 'hover') {
      if (!canHover()) return
      const target = el.closest('a, button') ?? el
      target.addEventListener('mouseenter', play)
      return () => { target.removeEventListener('mouseenter', play); stop.current() }
    }

    // 表示される前から隠しておき、画面が見えるようになってから（ページ遷移中ならワイプが抜け始めてから）始める
    el.dataset.s = 'wait'
    let cancelled = false
    whenVisible().then(() => { if (!cancelled) play() })
    return () => { cancelled = true; stop.current(); el.dataset.s = '' }
  }, [text, mode])

  return (
    <Tag ref={root} className={`scr${className ? ` ${className}` : ''}`} style={style} data-s={mode === 'mount' ? 'wait' : undefined}>
      <span className="scr-real">{text}</span>
      <span className="scr-live" aria-hidden="true" />
    </Tag>
  )
}
