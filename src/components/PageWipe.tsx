import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from 'react'
import { useLocation } from 'react-router-dom'
import { coverNow, getPhase, reveal, subscribe } from '../utils/wipe'

/** ページ遷移ワイプの青い帯。パスが変わったら（＝新しいページに替わったら）帯を抜けさせる */
export default function PageWipe() {
  const phase = useSyncExternalStore(subscribe, getPhase, () => 'idle' as const)
  const { pathname } = useLocation()
  const last = useRef(pathname)

  // リンク以外（ブラウザの戻る/進むなど）で替わった時は、描画前に覆っておく
  useLayoutEffect(() => {
    if (pathname === last.current) return
    last.current = pathname
    coverNow()
  }, [pathname])

  // 覆った状態で新しいページが出来たら、少し待ってから帯を抜けさせる
  useEffect(() => {
    if (phase !== 'covered') return
    const t = window.setTimeout(reveal, 80)
    return () => window.clearTimeout(t)
  }, [phase, pathname])

  // 万一ページが替わらなかった時に、覆ったままにしない
  useEffect(() => {
    if (phase !== 'covered') return
    const t = window.setTimeout(reveal, 2500)
    return () => window.clearTimeout(t)
  }, [phase])

  return <div className={`wipe ${phase}`} aria-hidden="true" />
}
