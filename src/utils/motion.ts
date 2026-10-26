/** OS の「視差効果を減らす」設定が有効か。有効なら演出はすべて省く */
export const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** マウスホバーのある端末か（タッチ端末ではホバー演出を出さない） */
export const canHover = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

/**
 * 数字をカウントアップする。root は <CountText> の外側の要素（.cnt）。
 * 終わったら本来の表示（.cnt-real）に戻る。返り値は中断用。
 */
export function countUp(
  root: HTMLElement,
  from: number,
  to: number,
  format: (n: number) => string,
  { delay = 0, duration = 650 }: { delay?: number; duration?: number } = {},
): () => void {
  const live = root.querySelector<HTMLElement>('.cnt-live')
  if (!live || from === to || reduceMotion()) return () => {}

  let raf = 0
  let started = 0
  const ease = (t: number) => 1 - Math.pow(1 - t, 3)

  const finish = () => { root.dataset.s = '' }
  const tick = (now: number) => {
    if (!started) started = now
    const t = Math.min(1, (now - started) / duration)
    live.textContent = format(Math.round(from + (to - from) * ease(t)))
    if (t < 1) raf = requestAnimationFrame(tick)
    else finish()
  }

  live.textContent = format(from)
  root.dataset.s = 'run'
  const timer = window.setTimeout(() => { raf = requestAnimationFrame(tick) }, delay)
  return () => { window.clearTimeout(timer); cancelAnimationFrame(raf); finish() }
}
