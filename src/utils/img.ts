// scripts/optimize-images.mjs が生成する軽量版 WebP のパスへ変換する。
//   thumbSrc: 一覧・ステッカー用 / fullSrc: 詳細ページ・Lightbox 用
// /images/ 配下のラスター画像（jpg/png）のみ対象。gif・外部URL（YouTubeなど）はそのまま返す。
function gen(src: string, kind: 'thumb' | 'full'): string {
  if (!src.startsWith('/images/') || !/\.(jpe?g|png)$/i.test(src)) return src
  return src.replace('/images/', `/images/_gen/${kind}/`).replace(/\.[^./]+$/, '.webp')
}

export const thumbSrc = (src: string) => gen(src, 'thumb')
export const fullSrc = (src: string) => gen(src, 'full')
