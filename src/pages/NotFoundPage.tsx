import { useState } from 'react'
import { Link } from 'react-router-dom'
import SiteLayout from '../components/layout/SiteLayout'
import QMark from '../components/ui/QMark'
import WorkCard from '../components/WorkCard'
import { Deco } from '../components/ui/Deco'
import { allWorks, getThumb, NOIMAGE } from '../utils/works'

export default function NotFoundPage() {
  // 迷子になった人に、ランダムで作品を1つ勧める
  const [pick] = useState(() => {
    const pool = allWorks.filter(w => getThumb(w) !== NOIMAGE)
    return pool[Math.floor(Math.random() * pool.length)]
  })

  return (
    <SiteLayout
      rails
      extraDeco={
        <div className="deco-desktop">
          <Deco name="warning" color="var(--ink)" style={{ left: '20%', top: '16%', width: 96, rotate: '-12deg' }} />
          <Deco name="cross" color="var(--ink)" style={{ right: '21%', top: '24%', width: 44 }} />
          <Deco name="spark" style={{ right: '30%', top: '12%', width: 70 }} />
          <Deco name="barcode" color="var(--ink)" style={{ left: '28%', bottom: '8%', width: 150, opacity: 0.7 }} />
          <Deco name="chevrons" style={{ right: '24%', bottom: '12%', width: 70 }} />
        </div>
      }
    >
      <QMark className="panel-q" style={{ left: '50%', width: 'min(70vw, 120vh)', transform: 'translate(-50%, -50%)', opacity: 0.1 }} />
      <div className="center">
        <span className="kicker">// 404</span>
        <div className="big">404</div>
        <p className="nf">PAGE NOT FOUND</p>
        {pick && (
          <div className="pick">
            <span className="k">MAYBE YOU'LL LIKE THIS</span>
            <WorkCard entry={pick} kind="work" meta={false} lazy={false} />
          </div>
        )}
        <Link to="/" className="pill">← BACK TO HOME</Link>
      </div>
    </SiteLayout>
  )
}
