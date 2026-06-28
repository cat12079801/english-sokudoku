// Project Gutenberg から作品本文を取得し、定型ヘッダ/フッタを除去して
// public/texts/<slug>.txt に保存、併せて catalog.json を生成する。
//
// 手動実行する（PG サーバへの負荷を抑えるため毎ビルドでは叩かない）:
//   node scripts/fetch-texts.mjs
//
// 取得済みのテキストはリポジトリに同梱してコミットする。

import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { BOOKS } from './books.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public', 'texts')

// PG の正規プレーンテキスト URL。
const textUrl = (id) => `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`

/** PG の定型ヘッダ/フッタを除去する（src/lib/text.ts と同一ロジック）。 */
function stripGutenbergBoilerplate(raw) {
  const startMatch = raw.match(/\*\*\*\s*START OF (?:THE|THIS) PROJECT GUTENBERG.*?\*\*\*/is)
  const endMatch = raw.match(/\*\*\*\s*END OF (?:THE|THIS) PROJECT GUTENBERG.*?\*\*\*/is)
  let body = raw
  let offset = 0
  if (startMatch && startMatch.index !== undefined) {
    offset = startMatch.index + startMatch[0].length
    body = raw.slice(offset)
  }
  if (endMatch && endMatch.index !== undefined) {
    const endIndex = endMatch.index - offset
    if (endIndex > 0) body = body.slice(0, endIndex)
  }
  return body.trim()
}

/** RSVP 表示の雑音になる編集用マークアップを除去する。 */
function cleanText(text) {
  return text
    .replace(/^\s*Produced by[\s\S]*?\n\s*\n/i, '') // 先頭の校正者クレジット
    .replace(/\[(?:Illustration|Japanese)[^\]]*\]/gis, '') // 挿絵・ローマ字キャプション
    .replace(/_/g, '') // PG の斜体マークアップ _word_
    .replace(/[ \t]+\n/g, '\n') // 行末の空白
    .replace(/\n{3,}/g, '\n\n') // 連続する空行を圧縮
    .trim()
}

/** ざっくり語数を数える（進捗やレベル感の参考用）。 */
function countWords(text) {
  return text.split(/\s+/).filter((w) => w.length > 0).length
}

async function fetchText(id) {
  const res = await fetch(textUrl(id), {
    headers: { 'User-Agent': 'english-sokudoku build script (personal, non-bulk)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for id=${id}`)
  return res.text()
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const catalog = []
  for (const book of BOOKS) {
    process.stdout.write(`- ${book.slug} (id=${book.id}) … `)
    const raw = await fetchText(book.id)
    const body = cleanText(stripGutenbergBoilerplate(raw))
    if (body.length < 200) throw new Error(`stripped body too short for ${book.slug}`)

    await writeFile(join(OUT_DIR, `${book.slug}.txt`), body, 'utf8')
    const words = countWords(body)
    catalog.push({
      slug: book.slug,
      title: book.title,
      titleJa: book.titleJa,
      author: book.author,
      level: book.level,
      blurb: book.blurb,
      gutenbergId: book.id,
      gutenbergUrl: `https://www.gutenberg.org/ebooks/${book.id}`,
      words,
      file: `${book.slug}.txt`,
    })
    console.log(`${words.toLocaleString()} 語 OK`)

    // PG サーバへの配慮として 1 件ごとに少し待つ。
    await new Promise((r) => setTimeout(r, 1500))
  }

  await writeFile(
    join(OUT_DIR, 'catalog.json'),
    JSON.stringify({ books: catalog }, null, 2) + '\n',
    'utf8',
  )
  console.log(`\ncatalog.json に ${catalog.length} 件を書き出した。`)
}

main().catch((err) => {
  console.error('\n取得に失敗:', err.message)
  process.exit(1)
})
