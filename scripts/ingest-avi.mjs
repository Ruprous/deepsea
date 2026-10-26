// works-inbox/avi に置かれた Avi の画像を、サイト用に揃えて取り込む。
//   node scripts/ingest-avi.mjs [取り込み元フォルダ] [--keep]
//
// - 長辺 1600px 以内の JPG（q85）に変換して public/images/avi/avi-001.jpg … に保存
//   （透過があれば白で塗りつぶす。GIF/WebP のアニメーションは WebP のまま幅 800px に縮める）
// - 一覧データ src/data/avi.json に追記（番号は既存の続きから振る）
// - 取り込んだ元ファイルは works-inbox/_original/avi/ へ移す（同じ内容のファイルは duplicates/ へ）
//   --keep を付ける（または取り込み元が _original/avi 自身）と、元ファイルは動かさない（作り直し用）
// 一覧表示用の縮小 WebP は、dev / build の前に scripts/optimize-images.mjs が作る。
import { readdir, readFile, writeFile, mkdir, rename, copyFile, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const inbox = path.resolve(args.find(a => !a.startsWith('--')) ?? path.join(root, '..', '..', 'works-inbox', 'avi'))
const archive = path.resolve(inbox, '..', '_original', 'avi')
const keep = args.includes('--keep') || inbox === path.resolve(path.join(root, '..', '..', 'works-inbox', '_original', 'avi'))
const outDir = path.join(root, 'public', 'images', 'avi')
const dataFile = path.join(root, 'src', 'data', 'avi.json')

const IMAGE = /\.(jpe?g|png|webp|gif|bmp|tiff?|avif)$/i
const LONG_SIDE = 1600
const ANIMATED_WIDTH = 800
const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })

async function moveFile(from, to) {
  await mkdir(path.dirname(to), { recursive: true })
  try { await rename(from, to) } catch { await copyFile(from, to); await unlink(from) }
}

if (!existsSync(inbox)) { console.error(`取り込み元が見つからない: ${inbox}`); process.exit(1) }
const names = (await readdir(inbox, { withFileTypes: true }))
  .filter(e => e.isFile() && IMAGE.test(e.name))
  .map(e => e.name)
  .sort(collator.compare)
if (!names.length) { console.log('取り込む画像がない'); process.exit(0) }

const list = existsSync(dataFile) ? JSON.parse(await readFile(dataFile, 'utf8')) : []
const used = list.map(a => Number(/avi-(\d+)/.exec(a.src)?.[1] ?? 0))
let next = Math.max(0, ...used) + 1
const seen = new Map() // 内容のハッシュ -> 取り込み済みの名前
await mkdir(outDir, { recursive: true })

let inBytes = 0, outBytes = 0, dup = 0
for (const name of names) {
  const from = path.join(inbox, name)
  const buf = await readFile(from)
  const hash = createHash('sha1').update(buf).digest('hex')
  if (seen.has(hash)) {
    console.log(`  重複: ${name} (= ${seen.get(hash)})`)
    if (!keep) await moveFile(from, path.join(archive, 'duplicates', name))
    dup++
    continue
  }
  seen.set(hash, name)

  const meta = await sharp(buf, { limitInputPixels: false, animated: true }).metadata()
  const animated = (meta.pages ?? 1) > 1
  const id = `avi-${String(next++).padStart(3, '0')}`
  const file = `${id}.${animated ? 'webp' : 'jpg'}`
  const to = path.join(outDir, file)

  const img = sharp(buf, { limitInputPixels: false, animated }).rotate()
  const info = animated
    ? await img.resize({ width: ANIMATED_WIDTH, withoutEnlargement: true }).webp({ quality: 80 }).toFile(to)
    : await img
        .resize({ width: LONG_SIDE, height: LONG_SIDE, fit: 'inside', withoutEnlargement: true })
        .flatten({ background: '#ffffff' })
        .jpeg({ quality: 85, mozjpeg: true })
        .toFile(to)

  list.push({ src: `/images/avi/${file}`, w: info.width, h: info.height })
  inBytes += buf.length
  outBytes += info.size
  if (!keep) await moveFile(from, path.join(archive, name))
}

await writeFile(dataFile, '[\n' + list.map(a => '  ' + JSON.stringify(a)).join(',\n') + '\n]\n')
const mb = n => (n / 1024 / 1024).toFixed(1)
console.log(`[ingest-avi] ${list.length - used.length} 枚を取り込み（重複 ${dup}）: ${mb(inBytes)}MB -> ${mb(outBytes)}MB`)
