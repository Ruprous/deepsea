// ページ遷移ワイプの状態。React の外に置いて、リンク・ページ・演出部品のどこからでも参照できるようにする。
//   idle → covering（青い帯が画面を覆う） → covered（覆い終わり。この間にページを差し替える） → revealing（帯が抜ける） → idle
export type WipePhase = 'idle' | 'covering' | 'covered' | 'revealing'

const COVER_MS = 320
const REVEAL_MS = 420
/** 帯が動き出してから、ページ側の演出（文字化け・カード出現）を始めるまでの待ち */
const REVEAL_LEAD_MS = 140

let phase: WipePhase = 'idle'
const subs = new Set<() => void>()
let waiters: (() => void)[] = []

function set(next: WipePhase) {
  phase = next
  subs.forEach(f => f())
  if (next === 'idle') flushWaiters()
  if (next === 'revealing') window.setTimeout(flushWaiters, REVEAL_LEAD_MS)
}

function flushWaiters() {
  const list = waiters
  waiters = []
  list.forEach(f => f())
}

export const getPhase = () => phase
export const subscribe = (f: () => void) => {
  subs.add(f)
  return () => { subs.delete(f) }
}

/** 青い帯で画面を覆う。覆い終わったら解決する。すでにワイプ中なら false */
export function cover(): Promise<boolean> {
  if (phase !== 'idle') return Promise.resolve(false)
  set('covering')
  return new Promise(resolve => {
    window.setTimeout(() => { set('covered'); resolve(true) }, COVER_MS)
  })
}

/** 覆った状態に即座にする（戻る／進むなど、覆う前にページが替わってしまった時用） */
export function coverNow() {
  if (phase === 'idle') set('covered')
}

/** 帯を抜けさせる */
export function reveal() {
  if (phase !== 'covered' && phase !== 'covering') return
  set('revealing')
  window.setTimeout(() => set('idle'), REVEAL_MS)
}

/** 画面が見える状態（ワイプ中でない）になるまで待つ。ページ側の演出の開始合図に使う */
export function whenVisible(): Promise<void> {
  if (phase === 'idle') return Promise.resolve()
  return new Promise(resolve => { waiters.push(resolve) })
}
