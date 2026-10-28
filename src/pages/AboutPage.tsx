import { useEffect } from 'react'
import Link from '../components/ui/Link'
import SiteLayout from '../components/layout/SiteLayout'
import PageHead from '../components/layout/PageHead'
import QMark from '../components/ui/QMark'
import { Deco } from '../components/ui/Deco'

const SNS = [
  { label: 'X / Twitter', href: 'https://x.com/Ruprous' },
  { label: 'YouTube',     href: 'https://www.youtube.com/@ruprous' },
  { label: 'エブリスタ',   href: 'https://estar.jp/users/364457212' },
  { label: 'foriio',      href: 'https://www.foriio.com/ruprous' },
  { label: 'Behance',     href: 'https://www.behance.net/Ruprous' },
]

const DISTRIBUTION = [
  { label: 'BOOTH',  href: 'https://ruprous.booth.pm/' },
  { label: 'GitHub', href: 'https://github.com/Ruprous' },
]

const SOFTWARE = [
  'Adobe Illustrator', 'Adobe Photoshop', 'Adobe Premiere Pro', 'Adobe After Effects',
  'Blender', 'AviUtl', 'AviUtl2',
]

const SERVICES = [
  { label: 'GRAPHIC', items: ['名刺・ショップカード', 'ロゴ（企業・イベント・個人用途）', 'チラシ・フライヤー', 'ジャケット'] },
  { label: 'WEB',     items: ['WEB広告・SNS広告・SNSアイコン・ヘッダー'] },
  { label: 'VIDEO',   items: ['YouTube動画編集', 'ミュージックビデオ'] },
]

function LinkGrid({ items }: { items: { label: string; href: string }[] }) {
  return (
    <div className="links">
      {items.map(s => (
        <a key={s.href} href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
      ))}
    </div>
  )
}

export default function AboutPage() {
  // ORIGIN への入口はここだけ。押される前に ORIGIN のコードを先に読んでおく
  useEffect(() => { import('./OriginPage') }, [])

  return (
    <SiteLayout
      ringSpin
      extraDeco={
        <div className="deco-desktop">
          <Deco name="spark" style={{ left: 262, top: 176, width: 58 }} />
          <Deco name="sparkSm" color="var(--ink)" style={{ left: 34, top: 452, width: 34 }} />
          <Deco name="star8" style={{ left: 300, top: 408, width: 26 }} />
        </div>
      }
    >
      <QMark className="panel-q" style={{ right: '-6%' }} />
      <PageHead kicker="ABOUT" title="About" />

      <div className="about">
        <div className="me">
          <img src="/images/ui/icon-square-440.webp" alt="Ruprous" width={220} height={220} />
          <div>
            <p className="n">Ruprous</p>
            <p className="kana">ラプラス</p>
          </div>
        </div>

        <div className="stack">
          <div className="card intro-text">
            <p className="greet">こんにちは、ラプラス（Ruprous）です！</p>
            <p className="dim">ラプラス [ləplάːs] です。読めない？いや、読むんですよ。</p>
            <p>
              2018年10月、<Link to="/origin" className="ilink">ゲーム仲間のために作って喜んでもらえたアイコン<i>↗</i></Link>が、デザインの原点です。<br />
              そこから独学でデザインを学び、様々な分野のデザインを見て視野を広げ、制作の幅を広げてきました。<br />
              現在は広告代理店・制作会社で働きながら、フリーランスとしても活動しています。<br />
              「色んなことを楽しくやる。」をスローガンに掲げる組織、<span className="mark">TEAM PNZ</span>に所属。
            </p>
            <h3>【対応可能ジャンル】</h3>
            <div className="svc">
              {SERVICES.map(g => (
                <div key={g.label} className="svc-g">
                  <span className="k">{g.label}</span>
                  <ul>{g.items.map(t => <li key={t}>{t}</li>)}</ul>
                </div>
              ))}
            </div>
            <p>
              お客様の「こうしたい！」という想いを丁寧にヒアリングし、目的に合った形で表現することを大切にしています。<br />
              デザインと映像を通じて、“伝わる・惹きつける”クリエイティブをお届けします。
            </p>
            <p className="greet">お気軽にご相談ください！</p>
            <Link to="/contact" className="pill lime">CONTACT ↗</Link>
          </div>

          <div className="card"><span className="k">SNS</span><LinkGrid items={SNS} /></div>
          <div className="card"><span className="k">DISTRIBUTION</span><LinkGrid items={DISTRIBUTION} /></div>
          <div className="card">
            <span className="k">TOOLS</span>
            <div className="chips">
              {SOFTWARE.map(s => <span key={s}>{s}</span>)}
              <Link to="/lab" className="hl">自作ツール<i>↗</i></Link>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
