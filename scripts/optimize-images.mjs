// public/images/{works,lab} の原画像から、軽量版 WebP を public/images/_gen/ に生成する。
//   thumb: 一覧・ステッカー用（長辺 800px）
//   full : 詳細ページ・Lightbox 用（長辺 1920px）
// 原画像は消さない。出力が原画像より新しければスキップ（差分のみ生成）。
import { readdir, stat, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const imagesDir = path.join(root, 'public', 'images')
const genDir = path.join(imagesDir, '_gen')
const SOURCE_DIRS = ['works', 'lab']
const VARIANTS = [
  { kind: 'thumb', size: 800,  quality: 78 },
  { kind: 'full',  size: 1920, quality: 82 },
]
const RASTER = /\.(jpe?g|png)$/i // gif / svg はそのまま配信

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) yield* walk(p)
    else if (RASTER.test(e.name)) yield p
  }
}

let made = 0, skipped = 0, before = 0, after = 0
const jobs = []
for (const sub of SOURCE_DIRS) {
  const dir = path.join(imagesDir, sub)
  if (!existsSync(dir)) continue
  for await (const src of walk(dir)) {
    const rel = path.relative(imagesDir, src).replace(/\.[^.]+$/, '.webp')
    const srcStat = await stat(src)
    for (const v of VARIANTS) {
      const out = path.join(genDir, v.kind, rel)
      jobs.push({ src, out, v, srcMtime: srcStat.mtimeMs, srcSize: srcStat.size })
    }
  }
}

// 同時実行を絞る（メモリ・CPU を使い切らないため）
const CONCURRENCY = 4
let idx = 0
async function worker() {
  while (idx < jobs.length) {
    const j = jobs[idx++]
    if (existsSync(j.out) && (await stat(j.out)).mtimeMs >= j.srcMtime) { skipped++; continue }
    await mkdir(path.dirname(j.out), { recursive: true })
    await sharp(j.src, { limitInputPixels: false })
      .rotate()
      .resize({ width: j.v.size, height: j.v.size, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: j.v.quality, effort: 5 })
      .toFile(j.out)
    made++
    if (j.v.kind === 'full') { before += j.srcSize; after += (await stat(j.out)).size }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker))

const mb = n => (n / 1024 / 1024).toFixed(1)
console.log(`[optimize-images] generated ${made}, up-to-date ${skipped}` +
  (made ? ` (full: ${mb(before)}MB -> ${mb(after)}MB)` : ''))
