import type { ReactNode } from 'react'
import { Deco } from '../ui/Deco'
import Scramble from '../ui/Scramble'

/** ページ見出し：// KICKER、ピクセル見出し、きらめき、バーコード、右に差し込む部品 */
export default function PageHead({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <>
      <Scramble className="kicker" text={`// ${kicker}`} />
      <div className="head">
        <Scramble as="h1" className="h1" text={title} />
        <Deco name="spark" inline style={{ width: 60 }} />
        <Deco name="barcode" color="var(--ink)" inline style={{ width: 120, opacity: 0.7 }} />
        {children}
      </div>
    </>
  )
}
