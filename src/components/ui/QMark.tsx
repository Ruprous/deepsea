import { useId, type CSSProperties } from 'react'

/** ロゴ（Q）を青く染めて、網点を重ねた大きなグラフィック。単色画像を SVG フィルタ/マスクで加工するので追加画像は不要 */
export default function QMark({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={className} viewBox="0 0 1000 1000" aria-hidden="true" style={style}>
      <defs>
        <filter id={`${id}t`} colorInterpolationFilters="sRGB">
          <feFlood floodColor="#0736FE" />
          <feComposite in2="SourceAlpha" operator="in" />
        </filter>
        <pattern id={`${id}d`} width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="4.5" cy="4.5" r="2" fill="#DEDFE8" />
        </pattern>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".75" stopColor="#000" />
        </linearGradient>
        <mask id={`${id}q`}><image href="/images/ui/logo-q.webp" width="1000" height="1000" /></mask>
        <mask id={`${id}f`}><rect width="1000" height="1000" fill={`url(#${id}g)`} /></mask>
      </defs>
      <image href="/images/ui/logo-q.webp" width="1000" height="1000" filter={`url(#${id}t)`} />
      <g mask={`url(#${id}q)`}>
        <rect width="1000" height="1000" fill={`url(#${id}d)`} mask={`url(#${id}f)`} opacity=".8" />
      </g>
    </svg>
  )
}
