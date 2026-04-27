/**
 * 日付文字列の月・日を2桁ゼロ埋めして返す
 * 例: "2023.8.20" → "2023.08.20" / "2025-6-3" → "2025-06-03"
 */
export function formatDate(date: string): string {
  const sep = date.includes('.') ? '.' : '-'
  const parts = date.split(sep)
  return parts.map((p, i) => (i === 0 ? p : p.padStart(2, '0'))).join(sep)
}
