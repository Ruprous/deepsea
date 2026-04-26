// ダイヤ型デコレーション
// filter で黒→青に塗りつぶし、mix-blend-mode: screen で背景を透過

const BLUE_FILTER =
  'brightness(0) invert(39%) sepia(100%) saturate(2000%) hue-rotate(199deg) brightness(107%)'

const diamonds = [
  // 右上・大
  { src: 'diamond-01@2x.png', size: 120, top: '6%',  right: '18%', rotate: 12,  opacity: 0.55 },
  // 右上・小
  { src: 'diamond-03@2x.png', size: 42,  top: '14%', right: '9%',  rotate: -8,  opacity: 0.35 },
  // 右中・中
  { src: 'diamond-04@2x.png', size: 70,  top: '42%', right: '5%',  rotate: 30,  opacity: 0.40 },
  // 左上・中
  { src: 'diamond-02@2x.png', size: 55,  top: '10%', left: '10%',  rotate: -18, opacity: 0.30 },
  // 左中・小
  { src: 'diamond-03@2x.png', size: 32,  top: '55%', left: '5%',   rotate: 45,  opacity: 0.25 },
  // 中央やや上・極小
  { src: 'diamond-01@2x.png', size: 24,  top: '22%', left: '48%',  rotate: 20,  opacity: 0.20 },
  // 右下・中
  { src: 'diamond-02@2x.png', size: 65,  bottom: '18%', right: '12%', rotate: -25, opacity: 0.35 },
  // 左下・大
  { src: 'diamond-04@2x.png', size: 90,  bottom: '12%', left: '8%',   rotate: 15,  opacity: 0.30 },
]

export default function DiamondDecorations() {
  return (
    <>
      {diamonds.map((d, i) => (
        <img
          key={i}
          src={`/images/env/${d.src}`}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: d.size,
            height: 'auto',
            top:    d.top,
            bottom: d.bottom,
            left:   d.left,
            right:  d.right,
            transform: `rotate(${d.rotate}deg)`,
            opacity: d.opacity,
            filter: BLUE_FILTER,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      ))}
    </>
  )
}
