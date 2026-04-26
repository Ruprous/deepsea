import { useState } from 'react'

const genres = [
  'ADVERTISEMENT',
  'COVER',
  'FONT',
  'GRAPHIC',
  'LOGO',
  'MUSIC VIDEO',
]

export default function DesignTicker() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div
      style={{
        overflow: 'hidden',
        background: 'transparent',
        padding: '10px 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {genres.map((genre, i) => (
          <div
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {/* 左の // */}
            {i === 0 && (
              <span
                style={{
                  color: 'var(--color-accent)',
                  fontFamily: 'var(--font-smart)',
                  fontSize: '13px',
                  transition: 'margin 0.3s ease',
                  marginRight: hoveredIndex === i ? '20px' : '10px',
                }}
              >
                //
              </span>
            )}

            {/* ジャンルテキスト */}
            <span
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                fontFamily: 'var(--font-smart)',
                fontSize: '11px',
                letterSpacing: hoveredIndex === i ? '0.35em' : '0.2em',
                color: hoveredIndex === i ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)',
                whiteSpace: 'nowrap',
                cursor: 'default',
                transition: 'letter-spacing 0.3s ease, color 0.3s ease',
              }}
            >
              {genre}
            </span>

            {/* 右の // */}
            <span
              style={{
                color: 'var(--color-accent)',
                fontFamily: 'var(--font-smart)',
                fontSize: '13px',
                transition: 'margin 0.3s ease',
                marginLeft: hoveredIndex === i ? '20px' : '10px',
                marginRight: hoveredIndex === i + 1 ? '20px' : '10px',
              }}
            >
              //
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
