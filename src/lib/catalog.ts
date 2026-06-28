// 同梱作品カタログ（public/texts/catalog.json）の型とローダー。

export interface CatalogBook {
  slug: string
  title: string
  titleJa: string
  author: string
  level: string
  blurb: string
  gutenbergId: number
  gutenbergUrl: string
  words: number
  file: string
}

// Vite の base（GitHub Pages のサブパス）を前提に、同一オリジンの静的アセットを参照する。
const TEXTS_BASE = `${import.meta.env.BASE_URL}texts/`

export async function loadCatalog(): Promise<CatalogBook[]> {
  const res = await fetch(`${TEXTS_BASE}catalog.json`)
  if (!res.ok) throw new Error(`カタログの読み込みに失敗しました (HTTP ${res.status})`)
  const data: { books: CatalogBook[] } = await res.json()
  return data.books
}

export async function loadBookText(book: CatalogBook): Promise<string> {
  const res = await fetch(`${TEXTS_BASE}${book.file}`)
  if (!res.ok) throw new Error(`本文の読み込みに失敗しました (HTTP ${res.status})`)
  return res.text()
}
