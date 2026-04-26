import { useEffect, useRef } from 'react'

/**
 * ウィンドウに対して -0.5 〜 +0.5 に正規化したマウス座標を返す
 * useRef で保持するので再レンダリングなし
 */
export function useMousePosition() {
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth  - 0.5
      mouse.current.y = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return mouse
}
