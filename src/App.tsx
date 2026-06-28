import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controls } from './components/Controls'
import { Library, type Credit } from './components/Library'
import { WordDisplay } from './components/WordDisplay'
import { tokenize } from './lib/text'
import { useRsvpPlayer } from './lib/useRsvpPlayer'

const SKIP = 10

export default function App() {
  const [rawText, setRawText] = useState('')
  const [credit, setCredit] = useState<Credit | null>(null)
  const [wpm, setWpm] = useState(300)

  const loadText = useCallback((text: string, c: Credit | null) => {
    setRawText(text)
    setCredit(c)
  }, [])

  const clearText = useCallback(() => {
    setRawText('')
    setCredit(null)
  }, [])

  const words = useMemo(() => tokenize(rawText), [rawText])
  const { index, playing, toggle, seek, reset } = useRsvpPlayer({ words, wpm })

  const hasText = words.length > 0
  const finished = hasText && index >= words.length
  const currentWord = finished ? null : (words[index] ?? null)
  const progress = hasText ? Math.min(index, words.length) / words.length : 0

  const back = useCallback(() => seek(index - SKIP), [seek, index])
  const forward = useCallback(() => seek(index + SKIP), [seek, index])

  // キーボードショートカット。
  useEffect(() => {
    if (!hasText) return
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'TEXTAREA' || tag === 'INPUT') return
      switch (e.key) {
        case ' ':
          e.preventDefault()
          toggle()
          break
        case 'ArrowLeft':
          back()
          break
        case 'ArrowRight':
          forward()
          break
        case 'Home':
          reset()
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hasText, toggle, back, forward, reset])

  return (
    <div className="app">
      <header className="app-header">
        <h1>English Sokudoku</h1>
        <p className="tagline">英文を1単語ずつ高速表示する RSVP 速読リーダー</p>
      </header>

      <main>
        {!hasText ? (
          <Library onLoad={loadText} />
        ) : (
          <section className="reader">
            {credit && (
              <p className="credit">
                {credit.title} — {credit.author}（出典:{' '}
                <a href={credit.gutenbergUrl} target="_blank" rel="noreferrer">
                  Project Gutenberg
                </a>
                ）
              </p>
            )}
            <WordDisplay word={finished ? null : currentWord} />

            {finished && (
              <p className="finished">読み終わり 🎉 — {words.length} 語</p>
            )}

            <div className="progress" role="progressbar" aria-valuenow={Math.round(progress * 100)}>
              <div className="progress-bar" style={{ width: `${progress * 100}%` }} />
            </div>
            <p className="counter">
              {Math.min(index + 1, words.length)} / {words.length} 語
            </p>

            <Controls
              playing={playing}
              wpm={wpm}
              onWpmChange={setWpm}
              onToggle={toggle}
              onBack={back}
              onForward={forward}
              onReset={reset}
            />

            <button type="button" className="link-button" onClick={clearText}>
              別の作品を選ぶ
            </button>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <span>Space: 再生/一時停止 ・ ← →: 10語スキップ ・ Home: 頭出し</span>
        <span className="attribution">
          同梱テキストはパブリックドメイン作品を{' '}
          <a href="https://www.gutenberg.org/" target="_blank" rel="noreferrer">
            Project Gutenberg
          </a>{' '}
          から取得・整形したもの。
        </span>
      </footer>
    </div>
  )
}
