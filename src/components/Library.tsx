import { useEffect, useState } from 'react'
import { loadBookText, loadCatalog, type CatalogBook } from '../lib/catalog'
import { TextInput } from './TextInput'

export interface Credit {
  title: string
  author: string
  gutenbergUrl: string
}

interface Props {
  onLoad: (text: string, credit: Credit | null) => void
}

/**
 * 起点となるライブラリ画面。同梱作品の一覧と、自分のテキストを使う入力欄を出す。
 * 作品を選ぶと同一オリジンの静的テキストを fetch して読み込む。
 */
export function Library({ onLoad }: Props) {
  const [books, setBooks] = useState<CatalogBook[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null)
  const [showPaste, setShowPaste] = useState(false)

  useEffect(() => {
    loadCatalog().then(setBooks).catch((e) => setError(e.message))
  }, [])

  const selectBook = async (book: CatalogBook) => {
    setLoadingSlug(book.slug)
    setError(null)
    try {
      const text = await loadBookText(book)
      onLoad(text, {
        title: book.title,
        author: book.author,
        gutenbergUrl: book.gutenbergUrl,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setLoadingSlug(null)
    }
  }

  return (
    <div className="library">
      <h2 className="section-title">作品を選ぶ</h2>
      {error && <p className="error">{error}</p>}
      {!books && !error && <p className="muted">読み込み中…</p>}

      <ul className="book-grid">
        {books?.map((book) => (
          <li key={book.slug}>
            <button
              type="button"
              className="book-card"
              onClick={() => selectBook(book)}
              disabled={loadingSlug !== null}
            >
              <span className="book-level">{book.level}</span>
              <span className="book-title-ja">{book.titleJa}</span>
              <span className="book-title-en">{book.title}</span>
              <span className="book-author">{book.author}</span>
              <span className="book-blurb">{book.blurb}</span>
              <span className="book-words">
                {loadingSlug === book.slug ? '読み込み中…' : `${book.words.toLocaleString()} 語`}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="paste-toggle">
        <button type="button" className="link-button" onClick={() => setShowPaste((v) => !v)}>
          {showPaste ? '× 自分のテキストを閉じる' : '自分の英文を貼り付ける →'}
        </button>
      </div>
      {showPaste && <TextInput onLoad={(text) => onLoad(text, null)} />}
    </div>
  )
}
