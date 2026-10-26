import SiteLayout from '../components/layout/SiteLayout'
import PageHead from '../components/layout/PageHead'
import AviWall from '../components/AviWall'
import Link from '../components/ui/Link'
import QMark from '../components/ui/QMark'
import { Deco } from '../components/ui/Deco'
import { useReveal } from '../hooks/useReveal'
import aviData from '../data/avi.json'

interface Chapter { no: string; title: string; body: string[] }

const CHAPTERS: Chapter[] = [
  {
    no: '01', title: 'はじまり',
    body: [
      '2018年、荒野行動を始めた。初めて遊んだモバイルのシューティングゲームで、ほかのゲームにはあまりない「好きな画像をアイコンに設定できる機能」があった。また、ゲーム内でチームを組める機能があり、個々のプレイヤーが集まってコミュニティができるのを促していた。',
      '一人でプレイしていた私は、ゲーム内で仲良くなった人と遊ぶうちに、チームに入ることになった。10名前後の小さなチームだったが、私にとってはとてもいいコミュニティだった。',
      'ある時、ふと思った。みんなで集まって遊んでいるのだから、共通のアイコンが欲しい。',
      '当時はCall of DutyからAviの文化が荒野行動に流れ込み、定着しつつあった。Aviの作り方を投稿している人の動画を参考に、初めてのAviを作って、チームのみんなに見せた。色を変えて、一人一人の特別なものも作った。',
      'とても喜んでくれた。ここが私のオリジンである。',
    ],
  },
  {
    no: '02', title: '広がり',
    body: [
      'そのチームは自然消滅してしまったが、仲の良かった人と別のチームに入った。現在まで活動を続けている古株のチームだ。そこで、そのチームのアイコンを作った。アイコンはチームの顔になり、多くの人が自分のアイコン画像に設定してくれた。',
      'これをきっかけに、ほかのチームからも「Aviを作ってほしい」と頼まれるようになった。この時、私は初めて自分の制作で対価をもらった。',
      '制作を続けるうちに、新しい出会いがあった。荒野行動（やほかのゲーム）でAviを作る人たちの、Twitter上のコミュニティだ。同じようにAviを作る仲間であり、ライバルでもある人たちに出会った。自分よりはるか上のレベルがあることを知った。表現の自由さを知った。',
      'ここから私は、本格的に制作の依頼を受けるようになる。デザイナー同士で組むチームもあった。アパレルブランドを展開するチームもあれば、ただ仲良く遊ぶだけのチームもあった。私はいくつかのチームに入ったり、出たりしていた。',
    ],
  },
  {
    no: '03', title: 'それから',
    body: [
      '時が流れ、制作の対象は、気づけばAviだけでなく、ヘッダーや映像にまで広がっていた。',
      '当時のコミュニティは学生が多かったが、やがて大学生や社会人が増え、みんなが進路を選ぶ時期に入った。デザインを本業にした人。Aviから始めたデザインから派生して、世界的なアーティストになった人。3DCGアーティストになった人。デザインから離れて、普通の日々を送るようになった人。',
      '私は、Aviから始めたデザインと、そこでできた人脈を大切にして、別ジャンルの制作も幅広く請け負うフリーランスになった。大学生の傍ら、フリーランスとして依頼を受け、広告バナーなどの制作を多く手がけた。',
      '大学卒業が見えた時、また進路に悩んだ。このままフリーランスを続けるのか、それとも企業に入るのか。',
      '私は両方を選んだ。フリーランスとして活動しながら、広告制作・広告代理の企業に入社した。欲が深いのかもしれないが、今は良い選択だったと思っている。',
    ],
  },
]

function ChapterBlock({ no, title, body }: Chapter) {
  const ref = useReveal<HTMLElement>()
  return (
    <section className="chap" data-rv="0" ref={ref}>
      <div className="chap-head">
        <span className="chap-no">{no}</span>
        <h3>{title}</h3>
      </div>
      <div className="chap-body">
        {body.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </section>
  )
}

/** Avi の一覧は src/data/avi.json（scripts/ingest-avi.mjs が作る。並びは固定のシャッフル） */
const AVI = aviData.map(a => a.src)

/** 活動の原点：Avi（アバターアイコン）の話と、当時の作品 */
export default function OriginPage() {
  const quote = useReveal<HTMLElement>()

  return (
    <SiteLayout
      topButton
      ringSpin
      extraDeco={
        <div className="deco-desktop">
          <Deco name="spark" style={{ left: 410, top: 150, width: 52 }} />
          <Deco name="star8" style={{ left: 36, top: 520, width: 24 }} />
        </div>
      }
    >
      <QMark className="panel-q" style={{ right: '-8%' }} />
      <PageHead kicker="ORIGIN" title="Origin">
        <Link to="/about" className="pill sm outline">← ABOUT</Link>
      </PageHead>

      <div className="origin-lead">
        <h2><span className="mark">好きなものを作って、</span><br /><span className="mark">人に喜んでもらう。</span></h2>
        <p>私の創作活動の原点は、ここにある。</p>
      </div>

      <div className="chaps">
        {CHAPTERS.map(c => <ChapterBlock key={c.no} {...c} />)}
      </div>

      <section className="origin-quote" data-rv="0" ref={quote}>
        <p>一人でやっても見られない世界がある。<br />続けないと見られない世界もある。</p>
        <p className="sub">この二つを大事に、今日も頑張る。</p>
      </section>

      <div className="card avi-def">
        <span className="k">{'// AVATAR ICON（AVI）とは'}</span>
        <p className="v">
          ゲームのプレイヤーや、クラン・チームのアイコンとして使う、加工したグラフィック（GFX）。もとはCall of Dutyなどで、クランやチームのロゴをかっこよく加工する文化から始まり、さまざまなゲームタイトルに広がっていった。
        </p>
      </div>

      <AviWall images={AVI} />
    </SiteLayout>
  )
}
