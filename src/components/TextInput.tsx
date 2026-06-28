import { useRef, useState } from 'react'
import { stripGutenbergBoilerplate } from '../lib/text'

interface Props {
  onLoad: (text: string) => void
}

const SAMPLE = `It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.`

/**
 * 英文の入力 UI。テキスト貼り付け / .txt アップロードに対応し、
 * Gutenberg の定型ヘッダ除去をオプションで行う。
 */
export function TextInput({ onLoad }: Props) {
  const [text, setText] = useState('')
  const [stripBoilerplate, setStripBoilerplate] = useState(true)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const content = await file.text()
    setText(content)
  }

  const handleLoad = () => {
    const processed = stripBoilerplate ? stripGutenbergBoilerplate(text) : text
    onLoad(processed)
  }

  return (
    <div className="text-input">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ここに英文を貼り付け、または .txt をアップロード…"
        spellCheck={false}
        rows={8}
      />
      <div className="text-input-actions">
        <button type="button" onClick={() => fileRef.current?.click()}>
          .txt をアップロード
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".txt,text/plain"
          onChange={handleFile}
          hidden
        />
        <button type="button" onClick={() => setText(SAMPLE)}>
          サンプル文を入れる
        </button>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={stripBoilerplate}
            onChange={(e) => setStripBoilerplate(e.target.checked)}
          />
          Gutenberg のヘッダ/フッタを除去
        </label>
        <button
          type="button"
          className="primary"
          onClick={handleLoad}
          disabled={text.trim().length === 0}
        >
          読み込む
        </button>
      </div>
      <p className="hint">
        パブリックドメインの英文は{' '}
        <a href="https://www.gutenberg.org/" target="_blank" rel="noreferrer">
          Project Gutenberg
        </a>{' '}
        からプレーンテキスト (Plain Text UTF-8) を取得して貼り付けると便利。
      </p>
    </div>
  )
}
