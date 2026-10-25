import { Link } from 'react-router-dom'
import SiteLayout from '../components/layout/SiteLayout'
import QMark from '../components/ui/QMark'
import { Deco } from '../components/ui/Deco'

// イースターエッグ（HTTP 418）
export default function TeapotPage() {
  return (
    <SiteLayout
      rails
      extraDeco={
        <div className="deco-desktop">
          <Deco name="spark" style={{ left: '30%', top: '18%', width: 70 }} />
          <Deco name="cross" color="var(--ink)" style={{ right: '24%', top: '26%', width: 40 }} />
          <Deco name="chevrons" style={{ right: '26%', bottom: '14%', width: 70 }} />
          <Deco name="barcode" color="var(--ink)" style={{ left: '28%', bottom: '8%', width: 150, opacity: 0.7 }} />
        </div>
      }
    >
      <QMark className="panel-q" style={{ left: '50%', width: 'min(70vw, 120vh)', transform: 'translate(-50%, -50%)', opacity: 0.1 }} />
      <div className="center">
        <span className="kicker">// 418</span>
        <div className="big emoji" role="img" aria-label="teapot">🫖</div>
        <p className="nf">I'M A TEAPOT</p>
        <p className="nf-sub">Sometimes, taking a slow and relaxing break is just as important.</p>
        <Link to="/" className="pill">← BACK TO HOME</Link>
      </div>
    </SiteLayout>
  )
}
