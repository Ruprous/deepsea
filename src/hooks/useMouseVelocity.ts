import { useEffect, useRef } from 'react'

/**
 * マウスの移動速度・方向を返す
 * - velocity.x / y : 正規化された移動方向ベクトル（生値）
 * - velocity.mag   : 速度の大きさ（0〜1にクランプ）
 * useFrame内でフレームごとに減衰させて使う想定
 */
export function useMouseVelocity() {
  const velocity = useRef({ x: 0, y: 0, mag: 0 })
  const prev     = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth  - 0.5
      const ny = e.clientY / window.innerHeight - 0.5

      if (prev.current !== null) {
        const dx = (nx - prev.current.x) * 25  // 感度スケール
        const dy = (ny - prev.current.y) * 25
        velocity.current.x   = dx
        velocity.current.y   = dy
        velocity.current.mag = Math.min(Math.sqrt(dx * dx + dy * dy), 1.0)
      }

      prev.current = { x: nx, y: ny }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return velocity
}
