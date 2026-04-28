import { useEffect, useRef } from 'react'

const SEQUENCE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

export function useKonamiCode(onSuccess: () => void) {
  const input    = useRef<string[]>([])
  const callback = useRef(onSuccess)
  callback.current = onSuccess

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      input.current = [...input.current, e.key].slice(-SEQUENCE.length)
      if (input.current.join(',') === SEQUENCE.join(',')) {
        callback.current()
        input.current = []
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}
