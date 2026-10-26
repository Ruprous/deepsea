import type { Ref } from 'react'

/**
 * カウントアップ用の数字。本来の表示（.cnt-real）を置いたまま、動かす間だけ上に別の数字（.cnt-live）を重ねる。
 * 動かしている最中も幅が変わらず、スクリーンリーダーには最初から最終の数字が読まれる。
 * 動かすのは utils/motion.ts の countUp。
 */
export default function CountText({ value, format = String, ref }: {
  value: number
  format?: (n: number) => string
  ref?: Ref<HTMLSpanElement>
}) {
  return (
    <span className="cnt" ref={ref}>
      <span className="cnt-real">{format(value)}</span>
      <span className="cnt-live" aria-hidden="true" />
    </span>
  )
}
