import { useId, type CSSProperties } from 'react'

/** 三角フラスコのシルエットのステッカー（白フチ＋黒の縁＋ずらした影）。Lab の入口に使う */
const BODY = 'M37 11 H63 V45 L90 97 Q95 108 84 108 H16 Q5 108 10 97 L37 45 Z'
const LIP = 'M33 11 H67'

export default function FlaskSticker({ className, style }: { className?: string; style?: CSSProperties }) {
  const id = useId()
  const clip = `${id}-clip`

  return (
    <svg className={`flask${className ? ` ${className}` : ''}`} style={style} viewBox="-8 0 116 124" aria-hidden="true">
      <defs>
        <clipPath id={clip}><path d={BODY} /></clipPath>
      </defs>

      {/* 影 → 黒の縁 → 白フチ → 中身 */}
      <g transform="translate(5 6)" fill="rgba(10,10,16,.16)" stroke="rgba(10,10,16,.16)" strokeWidth="17" strokeLinejoin="round" strokeLinecap="round">
        <path d={BODY} />
      </g>
      <path d={BODY} fill="#0a0a10" stroke="#0a0a10" strokeWidth="17" strokeLinejoin="round" strokeLinecap="round" />
      <path d={BODY} fill="#fff" stroke="#fff" strokeWidth="13" strokeLinejoin="round" strokeLinecap="round" />

      <path d={BODY} fill="#0736fe" />
      {/* 泡（大きめの丸） */}
      <g clipPath={`url(#${clip})`}>
        <circle className="flask-bub b1" cx="38" cy="89" r="10.5" fill="#fff" />
        <circle className="flask-bub b2" cx="65" cy="80" r="7.5" fill="#fff" />
        <circle className="flask-bub b3" cx="55" cy="99" r="5" fill="#fff" />
        <circle className="flask-bub b4" cx="49" cy="62" r="4" fill="#fff" />
        <circle className="flask-bub b5" cx="50" cy="33" r="3" fill="#fff" />
      </g>
      <path d={LIP} stroke="#fff" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}
