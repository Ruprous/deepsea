# PFUM — Portfolio Ultra Marine

Ruprous（ラプラス）のポートフォリオサイト。公開先: https://ruprous.me

コードネームは歴代で SC（summer-clouds / 夏の空）→ DS（deepsea / 深海）→ **PFUM（Ultra Marine）**。
群青 `#0736FE` と紙色のグレーを基調にした、静的でCSS中心の作りです（WebGLなし）。

## 技術スタック

- React 19 + TypeScript + Vite
- React Router（`BrowserRouter`）
- スタイルは `src/index.css` 1枚（デザイントークンはファイル先頭の `:root`）
- フォント: Pixelify Sans / Zen Kaku Gothic New（Google Fonts）、03SmartFontUI（必要な文字だけに絞った woff2 を自前配信）
- 画像の軽量化: `sharp`（ビルド時に自動実行）
- ホスティング: GitHub Pages（GitHub Actions）

## 使い方

```bash
npm install
npm run dev        # 開発サーバー（起動前に縮小画像を自動生成）
npm run build      # 型チェック + 本番ビルド（ビルド前に縮小画像を自動生成）
npm run preview    # ビルド結果の確認
npm run lint
npm run optimize:images   # 縮小画像だけを作り直したい時
```

Node は 20.19 以上、22 系なら 22.12 以上（Vite 8 の要件）。CI は Node 20、手元は 22 で動作確認しています。

## 公開（デプロイ）

`main` に push すると、`.github/workflows/deploy.yml` が自動でビルドして GitHub Pages に公開します。
ブランチを push しただけでは公開されません。

- 独自ドメイン: `public/CNAME`
- 直リンク（`/work/xxx` など）の対策: `public/404.html` が元のパスを保存してトップへ戻し、`index.html` が復元します

## 作品を追加・更新する

データは `src/data/works.json`（Work）と `src/data/lab.json`（Lab）。ページはデータから自動で作られます。一覧は日付の新しい順に並び、`No.001` からの通し番号は古い順に自動で付きます。

```jsonc
{
  "id": "logo-example",                  // URLになる。英数字とハイフン。既存と重複させない
  "title": "例 ロゴ",
  "client": ["クライアント名"],            // 任意
  "date": "2026-10-18",                   // 2026-10-18 / 2026-10 / 2026 のどれか
  "thumbnail": "/images/works/logo-example.jpg",
  "contain": true,                        // 16:9 でない画像のときだけ。背景にグレーの網点を敷いて全体を見せる
  "images": ["/images/works/logo-example-2.jpg"],   // 任意。詳細ページのギャラリーと拡大表示に出る
  "youtubeId": "xxxxxxxxxxx",             // YouTube作品。サムネと埋め込みは自動（thumbnail は空でよい）
  "credit": ["Vocal：名前", "Movie：Ruprous"],       // 「役割：名前」。複数人は半角カンマ区切り
  "links": [{ "label": "linkco.re", "url": "https://..." }],
  "types": ["Logo"],
  "sections": [{ "heading": "概要", "body": "○○様のロゴを制作しました。" }]
}
```

- **ジャンル** — Work: `MusicVideo` `Graphic` `Advertisement` `Cover` `Logo` `Font` `Thumbnail` `Direction` `GameplayEdit` ／ Lab: `Tool` `StreamTool` `WebApp` `AdobePlugin` `WebSite` `MinecraftMOD` `BlenderAddon`
- **画像** は `public/images/works/`（Lab は `public/images/lab/`）に置きます。長辺 2560px 以下の JPG を推奨（4K の PNG をそのまま置かない）。一覧用・詳細用の WebP は `npm run dev` / `npm run build` が `public/images/_gen/` に自動生成します（Git には入りません）。
- **YouTube作品** は `youtubeId` から「YouTubeで見る」リンクが自動で出るので、`links` に YouTube を重ねて書かないこと。
- **人名** は姓名の間にスペースを入れない（例: シオザワトシヒロ）。
- クレジットに URL を付ける書き方（`{ "role": "...", "name": "...", "url": "..." }`）は機能として残してありますが、データでは使っていません。

## フォントの軽量化

`public/fonts/03SmartFontUI.subset.woff2` は、サイトで使う文字だけに絞ったものです。本文やUIに新しい文字を足して、フォントが代替フォントで表示された時は、作り直します。

```bash
pip install fonttools brotli
python scripts/subset-font.py
```

元の `03SmartFontUI.ttf` / `.woff` は削除しないでください（再生成の元になります）。

## ディレクトリ構成

```
src/
  index.css                  全スタイル（トークン・部品・レスポンシブ）
  data/                      works.json / lab.json
  pages/                     ListPage / DetailPage（Work と Lab で共通）、About、Contact、404、418
  components/
    layout/SiteLayout.tsx    白いシート + 上下バー + モバイルメニュー。全ページ共通
    layout/PageHead.tsx      ページ見出し
    ui/Deco.tsx              装飾（単色PNGを CSS mask で色替え）
    ui/QMark.tsx             青いロゴ（SVGフィルタ）
    Hero/                    トップ（ステッカーのコラージュ）
    WorkCard.tsx  Lightbox.tsx  ScrollReset.tsx
  utils/                     works.ts（データ処理）、img.ts（縮小画像のパス変換）
public/
  images/works|lab/          作品画像（原本）
  images/deco|ui/            装飾の素材、ノイズなどのテクスチャ
  fonts/
scripts/
  optimize-images.mjs        縮小 WebP の生成
  subset-font.py             フォントのサブセット化
```

## デザインの約束

- 色: 群青 `#0736FE` / 紙 `#DEDFE8` / インク `#0A0A10` / 白 / 黄緑 `#E4FF3A`（黄緑は差し色として部分的にだけ）
- 動き: 常時動くのは、トップと About の背面リングのゆっくりした回転だけ。ページ全面を覆うノイズ層や、巨大要素への `mask-image` は使わない（動画ページのコマ落ちの原因になる）
- 動画（iframe）のあるページは、動画の親要素に角丸の `overflow: hidden` を付けない（`SiteLayout` の `videoSafe`）

## イースターエッグ

- トップでコナミコード（↑↑↓↓←→←→BA）: 5秒間のカオスモード
- `/teapot`: HTTP 418
