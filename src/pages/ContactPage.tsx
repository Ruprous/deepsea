import SiteLayout from '../components/layout/SiteLayout'
import PageHead from '../components/layout/PageHead'
import QMark from '../components/ui/QMark'
import { Deco } from '../components/ui/Deco'

const CONTACTS = [
  { label: 'X / Twitter', value: '@Ruprous', href: 'https://twitter.com/Ruprous' },
  { label: 'Discord',     value: 'Ruprous', href: null },
  { label: 'Mail',        value: 'ruprous.studio@gmail.com', href: 'mailto:ruprous.studio@gmail.com' },
  { label: 'ココナラ',     value: 'coconala.com/users/3282388', href: 'https://coconala.com/users/3282388' },
]

export default function ContactPage() {
  return (
    <SiteLayout
      extraDeco={
        <div className="deco-desktop">
          <Deco name="chevrons" style={{ left: 210, top: 44, width: 64 }} />
          <Deco name="spark" style={{ left: 560, top: 96, width: 50 }} />
          <Deco name="barcode" color="var(--ink)" style={{ left: 64, bottom: 44, width: 120, opacity: 0.7 }} />
        </div>
      }
    >
      <QMark className="panel-q" style={{ right: '8%', width: 'min(44vw, 76vh)' }} />

      <div className="contact">
        <div>
          <PageHead kicker="CONTACT" title="Contact" />
          <p className="lead">
            お仕事のご依頼・ご相談・ご質問など、お気軽にご連絡ください。<br />
            SNSのDMやメールでも受け付けています。<br />
            ココナラからのご依頼もお待ちしております。
          </p>
          <div className="rows">
            {CONTACTS.map(c => c.href ? (
              <a key={c.label} className="row" href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                <span className="lab">{c.label}</span><span className="val">{c.value}</span><span className="go">↗</span>
              </a>
            ) : (
              <div key={c.label} className="row">
                <span className="lab">{c.label}</span><span className="val">{c.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="side-cards">
          <div className="card">
            <span className="k">ACTIVE SINCE</span><span className="v mark">2018</span>
            <hr />
            <span className="k">TIMEZONE</span><span className="v">JST UTC+9</span>
          </div>
          <div className="card">
            <p className="t">I began my journey as a self-taught graphic designer in October 2018. Since then, I have been involved in a wide range of creative productions.</p>
            <p className="t">I am [ləplάːs]. Can't read it? Well, you're going to.</p>
          </div>
          <div className="card">
            <span className="v">48°52′5″S</span><br /><span className="v">123°23′6″W</span>
            <hr />
            <span className="k">DEPTH</span><span className="v">&gt; 10,000m</span><br />
            <span className="k" style={{ marginTop: 8 }}>PRESSURE</span><span className="v">&gt; 1,000atm</span>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
