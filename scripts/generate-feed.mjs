// src/data/works.json から RSS 2.0 フィード public/feed.xml を生成する（WORK のみ・新しい順 FEED_LIMIT 件）。
//   pubDate : 作品の date（制作日）。「2023-04」「2022」のような月・年だけの値は 1 日扱い
//   サムネ  : 自前の画像は 長辺 800px の JPEG を public/images/_gen/feed/ に作って配信
//             （リーダーによっては WebP が出ないので、サイトで使う WebP は流用しない）
//             YouTube 作品は YouTube のサムネ、外部URLのサムネはそのまま使う
// 出力は prebuild / predev で毎回作り直す（git 管理しない）。
import { readFile, writeFile, stat, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const feedImgDir = path.join(publicDir, 'images', '_gen', 'feed')
const SITE = 'https://ruprous.me'
const FEED_LIMIT = 30
const FEED_IMG_WIDTH = 800

const works = JSON.parse((await readFile(path.join(root, 'src', 'data', 'works.json'), 'utf8')).replace(/^﻿/, ''))
works.sort((a, b) => (!a.date ? 1 : !b.date ? -1 : b.date.localeCompare(a.date)))
const items = works.slice(0, FEED_LIMIT)

// ── 文字列・日付 ──────────────────────────────────────────
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const cdata = s => `<![CDATA[${String(s).replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const p2 = n => String(n).padStart(2, '0')
function rfc822(dateStr) {
  const [y, m = '1', d = '1'] = dateStr.split('-')
  const t = new Date(Date.UTC(+y, +m - 1, +d))
  return `${WD[t.getUTCDay()]}, ${p2(t.getUTCDate())} ${MON[t.getUTCMonth()]} ${t.getUTCFullYear()} 00:00:00 +0900`
}
const overview = w => (w.sections?.find(s => s.heading === '概要') ?? w.sections?.[0])?.body ?? ''

// ── 画像 ──────────────────────────────────────────────────
/** { url, type?, length? } を返す。length が分かるのは自前の画像だけ（enclosure 用） */
async function feedImage(w) {
  if (w.thumbnail?.startsWith('/')) {
    const src = path.join(publicDir, w.thumbnail.split('?')[0])
    if (existsSync(src)) {
      const out = path.join(feedImgDir, `${w.id}.jpg`)
      if (!existsSync(out) || (await stat(out)).mtimeMs < (await stat(src)).mtimeMs) {
        await mkdir(feedImgDir, { recursive: true })
        await sharp(src, { limitInputPixels: false })
          .rotate()
          .flatten({ background: '#ffffff' })
          .resize({ width: FEED_IMG_WIDTH, withoutEnlargement: true })
          .jpeg({ quality: 80, mozjpeg: true })
          .toFile(out)
      }
      return { url: `${SITE}/images/_gen/feed/${w.id}.jpg`, type: 'image/jpeg', length: (await stat(out)).size }
    }
  }
  if (w.thumbnail) return { url: w.thumbnail }
  // maxresdefault は無い動画があるので、必ずある 16:9 の mqdefault を使う
  if (w.youtubeId) return { url: `https://img.youtube.com/vi/${w.youtubeId}/mqdefault.jpg` }
  return null
}

// ── XML ───────────────────────────────────────────────────
const itemXml = async w => {
  const link = `${SITE}/work/${w.id}`
  const img = await feedImage(w)
  const body = overview(w)
  const meta = [w.client?.length ? `クライアント：${w.client.join('、')}` : '', w.date].filter(Boolean).join(' / ')
  const html = [
    img ? `<p><img src="${esc(img.url)}" alt="${esc(w.title)}" /></p>` : '',
    body ? `<p>${esc(body).replace(/\r?\n/g, '<br />')}</p>` : '',
    meta ? `<p>${esc(meta)}</p>` : '',
  ].join('')
  return [
    '    <item>',
    `      <title>${esc(w.title)}</title>`,
    `      <link>${link}</link>`,
    `      <guid isPermaLink="true">${link}</guid>`,
    `      <pubDate>${rfc822(w.date)}</pubDate>`,
    ...(w.types ?? []).map(t => `      <category>${esc(t)}</category>`),
    `      <description>${cdata(body)}</description>`,
    `      <content:encoded>${cdata(html)}</content:encoded>`,
    ...(img?.length ? [`      <enclosure url="${esc(img.url)}" length="${img.length}" type="${img.type}" />`] : []),
    '    </item>',
  ].join('\n')
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
  '  <channel>',
  '    <title>Ruprous | WORK</title>',
  `    <link>${SITE}/work</link>`,
  `    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />`,
  '    <description>Ruprous の制作実績（動画・デザインなど）の新着フィードです。</description>',
  '    <language>ja</language>',
  `    <lastBuildDate>${rfc822(new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10))}</lastBuildDate>`,
  ...(await Promise.all(items.map(itemXml))),
  '  </channel>',
  '</rss>',
  '',
].join('\n')

await writeFile(path.join(publicDir, 'feed.xml'), xml, 'utf8')
console.log(`[generate-feed] ${items.length} items -> public/feed.xml`)
