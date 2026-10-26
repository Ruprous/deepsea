import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Link from '../ui/Link'
import Scramble from '../ui/Scramble'
import { Deco, Ring } from '../ui/Deco'

const NAV = [
  { label: 'WORK',    to: '/work' },
  { label: 'ABOUT',   to: '/about' },
  { label: 'LAB',     to: '/lab' },
  { label: 'CONTACT', to: '/contact' },
]

const RAIL_TEXT = 'CREATE WITH INSIGHT // DESIGN WITH TECHNOLOGY // MOVE THE CULTURE'

interface SiteLayoutProps {
  children: ReactNode
  /** パネルに足すクラス（トップは 'hero'） */
  panelClass?: string
  /** パネル四隅のブラケット・斜線の帯・背面リング。トップは独自の装飾を持つので false */
  genericDeco?: boolean
  /** 背面リングを回す（回すのは About とトップだけ） */
  ringSpin?: boolean
  /** 左右の縦書きテキスト（トップ・404・418） */
  rails?: boolean
  /** 下バー中央に BACK TO TOP ボタン */
  topButton?: boolean
  /** 下バー中央に置く内容（指定時は topButton より優先） */
  bottomMid?: ReactNode
  /** パネル直下に差し込むページ固有の装飾 */
  extraDeco?: ReactNode
  /**
   * 動画（iframe）を載せるページ用。再生中の動画が角丸の overflow:hidden に囲まれると
   * 毎フレームのクリップ処理でコマ落ちしやすいので、シート/パネルのクリップをやめ、
   * はみ出す装飾だけを別の箱（.panel-bg）の中でクリップする。
   */
  videoSafe?: boolean
  /** 作品の著作権についての注意書きを、一番下に出す（Work のページだけ） */
  showRights?: boolean
}

/** 縦書きレールの長さをパネル高さに収める（長すぎたら文字を縮める） */
function useRailFit(enabled: boolean) {
  useLayoutEffect(() => {
    if (!enabled) return
    const fit = () => {
      document.querySelectorAll<HTMLElement>('.panel > .rail').forEach(r => {
        const max = (r.parentElement?.clientHeight ?? 0) - 64
        if (max <= 0) return
        let fs = 11
        r.style.fontSize = `${fs}px`
        const range = document.createRange()
        range.selectNodeContents(r)
        while (range.getBoundingClientRect().height > max && fs > 6) {
          fs -= 0.25
          r.style.fontSize = `${fs}px`
        }
      })
    }
    fit()
    document.fonts?.ready.then(fit)
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [enabled])
}

function TopBar() {
  const { pathname } = useLocation()
  // 開いた時のパスを覚える。別ページへ移動すると open が自然に false になる
  const [openAt, setOpenAt] = useState<string | null>(null)
  const open = openAt === pathname
  const setOpen = (v: boolean) => setOpenAt(v ? pathname : null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`)

  return (
    <>
      <header className="bar">
        <Link to="/" className="pill logo"><Scramble mode="hover" text="Ruprous" /></Link>
        <span className="runline" aria-hidden="true" />
        <nav className="nav" aria-label="メインナビゲーション">
          {NAV.map(n => (
            <Link key={n.to} to={n.to} className={`pill${isActive(n.to) ? ' blue' : ''}`}><Scramble mode="hover" text={n.label} /></Link>
          ))}
        </nav>
        <button type="button" className="pill icon menu-btn" onClick={() => setOpen(true)} aria-label="メニューを開く">
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M1 1h18M1 7h18M1 13h18" />
          </svg>
        </button>
      </header>

      <div className={`menu${open ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="メニュー" aria-hidden={!open}>
        <div className="menu-sheet">
          <div className="bar">
            <Link to="/" className="pill logo">Ruprous</Link>
            <button type="button" className="pill icon menu-btn" style={{ display: 'inline-flex' }} onClick={() => setOpen(false)} aria-label="メニューを閉じる">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M2 2l12 12M14 2L2 14" />
              </svg>
            </button>
          </div>
          <nav className="menu-links">
            {NAV.map((n, i) => (
              <Link key={n.to} to={n.to} className={`pill${isActive(n.to) ? ' blue' : ''}`}>
                <span>{n.label}</span><span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              </Link>
            ))}
          </nav>
          <p className="menu-foot">Ruprous — KANAGAWA, JAPAN</p>
        </div>
      </div>
    </>
  )
}

function BottomBar({ topButton, mid }: { topButton?: boolean; mid?: ReactNode }) {
  return (
    <footer className="bar bottom">
      <span className="pill">©2026 Ruprous</span>
      <Deco name="spectrum" inline style={{ width: 104 }} />
      <div className="bar-mid">
        {mid ?? (topButton && (
          <button type="button" className="pill sm outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            ↑ BACK TO TOP
          </button>
        ))}
      </div>
      <span className="spacer" />
    </footer>
  )
}

export default function SiteLayout({
  children, panelClass, genericDeco = true, ringSpin, rails, topButton, bottomMid, extraDeco, videoSafe, showRights,
}: SiteLayoutProps) {
  useRailFit(!!rails)

  const decor = (
    <>
      <div className="tone-bg" aria-hidden="true" />
      {rails && (
        <>
          <div className="rail l" aria-hidden="true">{RAIL_TEXT}</div>
          <div className="rail r" aria-hidden="true">{RAIL_TEXT}</div>
        </>
      )}
      {genericDeco && (
        <>
          <Ring spin={ringSpin} style={{ right: '-14%', top: '2%', left: 'auto', width: '36vw', transform: 'none' }} />
          <Deco name="hazard" style={{ right: 0, bottom: 0, width: '14%' }} />
          <Deco name="bracket" color="var(--ink)" style={{ right: 20, top: 20, width: 26, rotate: '90deg' }} />
          <Deco name="bracket" color="var(--ink)" style={{ left: 20, bottom: 20, width: 26, rotate: '270deg' }} />
        </>
      )}
      {extraDeco}
    </>
  )

  return (
    <>
      <div className="edge" aria-hidden="true" />
      <div className={`sheet${videoSafe ? ' open' : ''}`}>
        <TopBar />
        <main className={`panel${panelClass ? ` ${panelClass}` : ''}${videoSafe ? ' open' : ''}`}>
          {videoSafe ? <div className="panel-bg" aria-hidden="true">{decor}</div> : decor}
          {children}
        </main>
        <BottomBar topButton={topButton} mid={bottomMid} />
        {showRights && (
          <p className="rights">
            <span>サイトに掲載している作品の画像・ロゴ・イラスト・映像などの著作権は、制作者および各クライアントに帰属します。無断での転載・転用はご遠慮ください。</span>
          </p>
        )}
      </div>
    </>
  )
}
