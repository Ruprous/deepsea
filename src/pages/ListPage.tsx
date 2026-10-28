import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SiteLayout from '../components/layout/SiteLayout'
import PageHead from '../components/layout/PageHead'
import WorkCard from '../components/WorkCard'
import Link from '../components/ui/Link'
import { Burst } from '../components/ui/Deco'
import { getList, labelsOf, type Kind } from '../utils/works'

/** Work / Lab 共通の一覧ページ（ジャンルフィルター付き） */
export default function ListPage({ kind }: { kind: Kind }) {
  const location = useLocation()
  const navigate = useNavigate()
  const labels = labelsOf(kind)
  const items = getList(kind)

  const types = useMemo(() => [
    'ALL',
    ...Array.from(new Set(items.flatMap(w => w.types)))
      .sort((a, b) => (labels[a] ?? a).localeCompare(labels[b] ?? b)),
  ], [items, labels])

  const [selected, setSelected] = useState<string>(
    (location.state as { filter?: string } | null)?.filter ?? 'ALL',
  )

  // 戻るボタンで一覧に帰ってきた時にフィルターが残るよう、履歴に状態を保存する
  function select(type: string) {
    setSelected(type)
    navigate('.', { replace: true, state: { filter: type } })
  }

  const filtered = selected === 'ALL' ? items : items.filter(w => w.types.includes(selected))
  const isLab = kind === 'lab'

  return (
    <SiteLayout topButton showRights={kind === 'work'}>
      <Burst
        to={`/${kind}`}
        value={filtered.length}
        label={isLab ? 'PROJECTS' : 'WORKS'}
        className="list"
        style={{ right: 64, top: 22, width: 116, height: 116, rotate: '12deg' }}
      />

      <PageHead kicker={isLab ? 'LAB' : 'WORK'} title={isLab ? 'Lab' : 'Work'}>
        {isLab && <Link to="/about" className="pill sm outline">← ABOUT</Link>}
        {isLab && (
          <a className="pill sm outline" href="https://github.com/Ruprous" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        )}
      </PageHead>

      <hr className="rule" />
      <div className="filters" role="group" aria-label="ジャンルで絞り込む">
        {types.map(t => (
          <button key={t} type="button" className={`fpill${t === selected ? ' on' : ''}`} onClick={() => select(t)} aria-pressed={t === selected}>
            {t === 'ALL' ? 'ALL' : (labels[t] ?? t).toUpperCase()}
          </button>
        ))}
      </div>
      <hr className="rule" />

      <div className="grid3">
        {filtered.map(w => <WorkCard key={w.id} entry={w} kind={kind} fromList />)}
      </div>
    </SiteLayout>
  )
}
