import type { SyntheticEvent } from 'react'
import worksData from '../data/works.json'
import labData from '../data/lab.json'

// ── 型 ────────────────────────────────────────────────────
export interface Section { heading?: string; body: string }
export interface Link { label: string; url: string }
export interface CreditItem { role: string; name: string; url?: string }

/** works.json / lab.json の1件。Lab には youtubeId / client が無いだけで形は共通 */
export interface Entry {
  id: string
  title: string
  types: string[]
  date: string
  client?: string[]
  thumbnail?: string
  youtubeId?: string
  credit?: (string | CreditItem)[]
  links?: Link[]
  sections?: Section[]
  images?: string[]
  contain?: boolean
}

export type Kind = 'work' | 'lab'

// ── ジャンル表示名 ────────────────────────────────────────
export const WORK_LABELS: Record<string, string> = {
  Cover: 'COVER', Logo: 'LOGO', Font: 'FONT', Graphic: 'GRAPHIC', Thumbnail: 'THUMBNAIL',
  MusicVideo: 'MUSIC VIDEO', Advertisement: 'AD', GameplayEdit: 'GAMEPLAY', Video: 'VIDEO', Direction: 'DIRECTION',
}
export const LAB_LABELS: Record<string, string> = {
  WebSite: 'Website', MinecraftMOD: 'Minecraft Mod', AdobePlugin: 'Adobe Plugin', BlenderAddon: 'Blender Addon',
  StreamTool: 'Stream Tool', WebApp: 'Web App', Tool: 'Tool',
}
export const labelsOf = (kind: Kind) => (kind === 'lab' ? LAB_LABELS : WORK_LABELS)

/** トップのステッカーのラベルは「AD」ではなく正式名で見せる */
export const LONG_LABELS: Record<string, string> = { ...WORK_LABELS, Advertisement: 'ADVERTISEMENT' }

// ── 画像 ──────────────────────────────────────────────────
export const NOIMAGE = '/images/works/noimage.jpg'

/** 原画像のパス（縮小版への変換は utils/img.ts の thumbSrc / fullSrc） */
export function getThumb(e: Pick<Entry, 'thumbnail' | 'youtubeId'>): string {
  if (e.thumbnail) return e.thumbnail
  if (e.youtubeId) return `https://img.youtube.com/vi/${e.youtubeId}/maxresdefault.jpg`
  return NOIMAGE
}

// maxresdefault が無い時、YouTube は 404 ではなく 120x90 の代替画像を 200 で返す。
// onLoad で実寸を見て、代替画像なら mqdefault に差し替える。
export function onThumbLoad(e: SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget
  if (img.src.includes('maxresdefault') && img.naturalWidth === 120 && img.naturalHeight === 90) {
    img.src = img.src.replace('maxresdefault', 'mqdefault')
  }
}
export function onThumbError(e: SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget
  if (img.src.includes('maxresdefault')) img.src = img.src.replace('maxresdefault', 'mqdefault')
}

// ── 並び順・通し番号 ──────────────────────────────────────
const byDateDesc = (a: Entry, b: Entry) => (!a.date ? 1 : !b.date ? -1 : b.date.localeCompare(a.date))

function build(raw: Entry[]) {
  const items = raw.slice().sort(byDateDesc)               // 新しい順（一覧用）
  const oldest = raw.slice().sort((a, b) => byDateDesc(b, a)) // 古い順
  const numbers = new Map(oldest.map((e, i) => [e.id, i + 1]))
  return { items, numbers }
}

const works = build(worksData as Entry[])
const lab = build(labData as Entry[])

export const allWorks = works.items
export const allLab = lab.items
export const getList = (kind: Kind) => (kind === 'lab' ? allLab : allWorks)
/** 古い順の通し番号（No.001〜）。トップのステッカーや一覧のラベルに使う */
export const entryNo = (kind: Kind, id: string) => (kind === 'lab' ? lab.numbers : works.numbers).get(id) ?? 0
export const fmtNo = (n: number) => `No.${String(n).padStart(3, '0')}`
