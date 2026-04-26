import { useRef, useEffect } from 'react'
import { useMousePosition } from '../../hooks/useMousePosition'

type Corner = 'top-right' | 'bottom-left'

export default function WaveLines({ corner }: { corner: Corner }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const mouse  = useMousePosition()
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const COUNT = 10
    const W     = 340
    const H     = 580

    // path を事前生成
    const paths: SVGPathElement[] = []
    for (let i = 0; i < COUNT; i++) {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      const t = i / COUNT
      p.setAttribute('fill', 'none')
      // シアン〜水色グラデーション
      p.setAttribute('stroke', `hsl(${185 + t * 20}, 100%, ${50 + t * 20}%)`)
      p.setAttribute('stroke-width', '0.8')
      p.setAttribute('opacity',      String(0.35 + t * 0.45))
      svg.appendChild(p)
      paths.push(p)
    }

    const tick = (ts: number) => {
      const t  = ts * 0.0007
      const mx = mouse.current.x   // -0.5 〜 +0.5
      const my = mouse.current.y

      paths.forEach((path, i) => {
        const norm  = i / COUNT
        const baseX = norm * W
        const pts: string[] = []
        const STEPS = 70

        for (let s = 0; s <= STEPS; s++) {
          const prog = s / STEPS
          const y    = prog * H

          // S字カーブのエンベロープ（中間でくびれ、上下で広がる）
          const env = Math.sin(prog * Math.PI) *
                      (0.6 + 0.4 * Math.sin(prog * Math.PI * 2))

          // マウスで振幅が増幅
          const amp = (55 + Math.abs(mx) * 40) * env

          // 複数のsin波を重ねて有機的な揺らぎ
          const wave =
            Math.sin(prog * 3.5 + t        + i * 0.25) * amp * 0.55 +
            Math.sin(prog * 6.0 + t * 1.6  + i * 0.12) * amp * 0.28 +
            Math.sin(prog * 9.0 + t * 0.9  + i * 0.08) * amp * 0.17 +
            my * 30 * Math.sin(prog * Math.PI)

          const x = baseX + wave
          pts.push(
            s === 0
              ? `M ${x.toFixed(2)} ${y.toFixed(2)}`
              : `L ${x.toFixed(2)} ${y.toFixed(2)}`
          )
        }

        path.setAttribute('d', pts.join(' '))
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafRef.current)
      paths.forEach(p => svg.removeChild(p))
    }
  }, [])

  const pos: React.CSSProperties =
    corner === 'top-right'
      ? { top: -220, right: -140, transform: 'rotate(-40deg)', transformOrigin: '50% 50%' }
      : { bottom: -220, left: -140, transform: 'rotate(-40deg)', transformOrigin: '50% 50%' }

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'absolute',
        width:  340,
        height: 580,
        overflow: 'visible',
        pointerEvents: 'none',
        ...pos,
      }}
      viewBox="0 0 340 580"
    />
  )
}
