import { useCallback, useEffect, useRef } from 'react'
import { reduceMotion } from '../utils/motion'
import { whenVisible } from '../utils/wipe'

// 画面に入った要素を「順番に」出現させる。監視役（IntersectionObserver）は全体で1つだけ。
const STAGGER_MS = 70
const STAGGER_MAX = 8

const callbacks = new WeakMap<Element, (delayMs: number) => void>()
let observer: IntersectionObserver | null = null

function getObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(entries => {
    const hits = entries.filter(e => e.isIntersecting).map(e => e.target as HTMLElement)
    if (!hits.length) return
    // 同時に画面へ入ったものは、上から・左から順に時間差をつける
    hits.sort((a, b) => {
      const ra = a.getBoundingClientRect()
      const rb = b.getBoundingClientRect()
      return ra.top - rb.top || ra.left - rb.left
    })
    // ページ遷移のワイプで覆われている間は待つ
    whenVisible().then(() => {
      hits.forEach((el, k) => {
        observer?.unobserve(el)
        const cb = callbacks.get(el)
        callbacks.delete(el)
        const delay = Math.min(k, STAGGER_MAX) * STAGGER_MS
        el.style.setProperty('--rv-d', `${delay}ms`)
        el.dataset.rv = '1'
        cb?.(delay)
      })
    })
  }, { rootMargin: '0px 0px -6% 0px' })
  return observer
}

/**
 * ref を付けた要素（data-rv="0" で隠しておく）が画面に入ったら data-rv="1" にして出現させる。
 * onReveal には、その要素に付けた時間差（ms）が渡される（カウントアップの開始を合わせるのに使う）。
 */
export function useReveal<T extends HTMLElement>(onReveal?: (delayMs: number) => void) {
  const latest = useRef(onReveal)
  useEffect(() => { latest.current = onReveal })

  return useCallback((el: T | null) => {
    if (!el) return
    if (reduceMotion() || typeof IntersectionObserver === 'undefined') {
      el.dataset.rv = '1'
      return
    }
    callbacks.set(el, delay => latest.current?.(delay))
    getObserver().observe(el)
    return () => { observer?.unobserve(el); callbacks.delete(el) }
  }, [])
}
