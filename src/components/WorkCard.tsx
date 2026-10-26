import Link from './ui/Link'
import { useReveal } from '../hooks/useReveal'
import { formatDate } from '../utils/formatDate'
import { thumbSrc } from '../utils/img'
import { getThumb, labelsOf, onThumbError, onThumbLoad, entryNo, fmtNo, type Entry, type Kind } from '../utils/works'

interface WorkCardProps {
  entry: Entry
  kind: Kind
  /** false: 番号・日付の行を出さない（404のおすすめ） */
  meta?: boolean
  /** false: 先読みする（画面内に必ず出るもの） */
  lazy?: boolean
  /** 一覧から来たことを詳細ページに伝える（戻るボタン用） */
  fromList?: boolean
}

/** 作品カード。16:9 以外の画像（contain 扱い）は、元画像のグレースケール網点を背景に敷く */
export default function WorkCard({ entry, kind, meta = true, lazy = true, fromList }: WorkCardProps) {
  const labels = labelsOf(kind)
  // 画面に入ったら順番に出現する
  const reveal = useReveal<HTMLAnchorElement>()
  const src = thumbSrc(getThumb(entry))
  const imgProps = {
    src,
    onLoad: onThumbLoad,
    onError: onThumbError,
    decoding: 'async' as const,
    loading: lazy ? ('lazy' as const) : ('eager' as const),
  }

  return (
    <Link to={`/${kind}/${entry.id}`} state={fromList ? { fromList: true } : undefined} className="wcard" data-rv="0" ref={reveal}>
      <div className={`img${entry.contain ? ' contain' : ''}`}>
        {entry.contain ? (
          <>
            <img className="bg" alt="" aria-hidden="true" {...imgProps} />
            <img className="fg" alt={entry.title} {...imgProps} />
          </>
        ) : (
          <img alt={entry.title} {...imgProps} />
        )}
        <div className="tags">
          {entry.types.map(t => <span key={t} className="tag">{(labels[t] ?? t).toUpperCase()}</span>)}
        </div>
      </div>
      <h3>{entry.title}</h3>
      {meta && <p className="meta"><b>{fmtNo(entryNo(kind, entry.id))}</b>{formatDate(entry.date)}</p>}
    </Link>
  )
}
