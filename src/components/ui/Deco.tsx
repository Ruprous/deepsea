import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

// 単色PNG（public/images/deco/）をマスクにして、好きな色で塗る装飾部品
const DECO = {
  ring:     { file: 's56',  ar: '1' },        // 十字つきの円
  spark:    { file: 's86',  ar: '205/128' },  // 4点のきらめき
  sparkSm:  { file: 's85',  ar: '206/128' },
  barcode:  { file: 's60',  ar: '547/116' },
  hazard:   { file: 's69',  ar: '805/105' },  // 斜線の帯
  bracket:  { file: 's29',  ar: '1' },        // コーナーのブラケット
  chevrons: { file: 's27',  ar: '191/69' },
  cross:    { file: 's53',  ar: '1' },        // ×印
  spectrum: { file: 's90',  ar: '980/211' },
  star8:    { file: 's153', ar: '1' },
  xxx:      { file: 'r76',  ar: '640/214' },
  warning:  { file: 't39',  ar: '640/555' },
  burst:    { file: 'r35',  ar: '1' },        // 24点のスターバースト
} as const

export type DecoName = keyof typeof DECO

interface DecoProps {
  name: DecoName
  /** 色（CSS値）。省略時は青 */
  color?: string
  /** 位置・サイズ・回転など */
  style?: CSSProperties
  /** true: 通常フロー内に置く（flexの子など） */
  inline?: boolean
  className?: string
}

export function Deco({ name, color, style, inline, className }: DecoProps) {
  const d = DECO[name]
  const vars = {
    '--s': `url(/images/deco/${d.file}.png)`,
    '--ar': d.ar,
    ...(color ? { '--c': color } : {}),
  } as CSSProperties
  return (
    <i
      className={`d${inline ? ' in' : ''}${className ? ` ${className}` : ''}`}
      style={{ ...vars, ...style }}
      aria-hidden="true"
    />
  )
}

/** 背面の大きな十字リング。spin=true でゆっくり回転 */
export function Ring({ spin, className, style }: { spin?: boolean; className?: string; style?: CSSProperties }) {
  return (
    <div className={`d-wrap ${className ?? ''}`} style={style} aria-hidden="true">
      <Deco name="ring" color="var(--ink)" className={spin ? 'spin' : undefined} style={{ opacity: 0.09 }} />
    </div>
  )
}

interface BurstProps {
  to: string
  value: number | string
  label: string
  className?: string
  style?: CSSProperties
}

/** 黄緑のスターバースト（数字バッジ）。クリックで一覧へ */
export function Burst({ to, value, label, className, style }: BurstProps) {
  return (
    <Link to={to} className={`burst${className ? ` ${className}` : ''}`} style={style}>
      <Deco name="burst" color="var(--lime)" />
      <span><b>{value}</b>{label}</span>
    </Link>
  )
}
