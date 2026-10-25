import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteLayout from '../layout/SiteLayout'
import { Deco } from '../ui/Deco'
import StickerStage from './StickerStage'
import { useKonamiCode } from '../../hooks/useKonamiCode'

const CHAOS_DURATION = 5000 // ms
const GENRES = ['ADVERTISEMENT', 'COVER', 'FONT', 'GRAPHIC', 'LOGO', 'MUSIC VIDEO']

function Ticker() {
  return (
    <p className="ticker">
      <i>//</i>
      {GENRES.map(g => <span key={g}>{g}<i>//</i></span>)}
    </p>
  )
}

/** 左右の縦書き・ステッカー以外の、デスクトップ幅だけで見せる飾り */
function HeroDeco() {
  return (
    <div className="deco-desktop">
      <Deco name="spark" style={{ left: '40.5%', top: '15%', width: '4.2vw' }} />
      <Deco name="sparkSm" color="var(--ink)" style={{ left: '44.5%', top: '24%', width: '2vw' }} />
      <Deco name="barcode" color="var(--ink)" style={{ left: '40.5%', bottom: '5.5%', width: '8.5vw', opacity: 0.8 }} />
      <Deco name="hazard" style={{ left: 0, bottom: 0, width: '13%' }} />
      <Deco name="bracket" color="var(--ink)" style={{ left: '40.5%', top: '6.5%', width: '2.2vw' }} />
      <Deco name="bracket" color="var(--ink)" style={{ left: '79%', bottom: '7%', width: '2.2vw', rotate: '180deg' }} />
      <Deco name="chevrons" style={{ left: '31.5%', bottom: '11.8%', width: '3.6vw' }} />
      <Deco name="xxx" style={{ left: '17.5%', top: '41%', width: '4.6vw', opacity: 0.9 }} />
      <Deco name="cross" color="var(--ink)" style={{ left: '95.6%', top: '92%', width: '1.6vw' }} />
    </div>
  )
}

export default function HeroSection() {
  const [chaos, setChaos] = useState(false)
  const timer = useRef<number>(0)

  // コナミコード：5秒間、色相回転 + スキャンライン + ステッカー高速入れ替え + リング高速回転
  const activateChaos = useCallback(() => {
    if (timer.current) return
    document.body.classList.add('chaos', 'chaos-hue')
    setChaos(true)
    timer.current = window.setTimeout(() => {
      document.body.classList.remove('chaos', 'chaos-hue')
      setChaos(false)
      timer.current = 0
    }, CHAOS_DURATION)
  }, [])
  useKonamiCode(activateChaos)

  useEffect(() => () => {
    window.clearTimeout(timer.current)
    document.body.classList.remove('chaos', 'chaos-hue')
  }, [])

  return (
    <SiteLayout panelClass="hero" genericDeco={false} rails bottomMid={<Ticker />} extraDeco={<HeroDeco />}>
      {chaos && <div className="glitch-scanlines" aria-hidden="true" />}
      <StickerStage chaos={chaos} />

      <div className="col-l">
        <div>
          <div className="tag-row">
            <span className="t"><i>+</i>Digital Creator</span>
            <span className="lines" aria-hidden="true">
              <span>// CREATE WITH INSIGHT</span>
              <span>// DESIGN WITH TECHNOLOGY</span>
              <span>// MOVE THE CULTURE</span>
            </span>
          </div>
          <h1 className="title">Ruprous</h1>
          <p className="kana">ラプラス</p>
        </div>

        <div className="intro">
          <p>
            お客様の「こうしたい！」という想いを丁寧にヒアリングし、目的に合った形で表現することを大切にしています。<br />
            デザインと映像を通じて、“伝わる・惹きつける”クリエイティブをお届けします。
          </p>
          <Link to="/about" className="pill sm">ABOUT ME ↗</Link>
        </div>

        <div>
          <div className="cta">
            <Link to="/work" className="pill lime sm">VIEW WORKS ↗</Link>
            <Link to="/contact" className="pill outline sm">CONTACT ↗</Link>
          </div>
          <div className="badge">
            <img src="/images/ui/icon-96.webp" alt="Ruprous" width={40} height={40} />
            <div>
              <p className="a">Freelance — Ruprous Studio</p>
              <p className="b">KANAGAWA, JAPAN</p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-r">
        <div className="card">
          <div><span className="k">ACTIVE SINCE</span><span className="v mark">2018</span></div>
          <hr />
          <div><span className="k">TIMEZONE</span><span className="v">JST UTC+9</span></div>
        </div>
        <div className="card">
          <p>I began my journey as a self-taught graphic designer in October 2018. Since then, I have been involved in a wide range of creative productions.</p>
          <p>I am [ləplάːs]. Can't read it? Well, you're going to.</p>
        </div>
        <div className="card">
          <div><span className="v">48°52′5″S</span><br /><span className="v">123°23′6″W</span></div>
          <hr />
          <div><span className="k">DEPTH</span><span className="v">&gt; 10,000m</span></div>
          <div><span className="k">PRESSURE</span><span className="v">&gt; 1,000atm</span></div>
        </div>
      </div>
    </SiteLayout>
  )
}
