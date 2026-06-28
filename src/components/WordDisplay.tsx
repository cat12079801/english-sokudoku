import { orpIndex } from '../lib/text'

interface Props {
  word: string | null
}

/**
 * 単語を ORP（赤の基準文字）を中心に左右で揃えて表示する。
 * 3 つの span（前半 / 基準文字 / 後半）を grid で配置し、基準文字を常に中央線に固定する。
 */
export function WordDisplay({ word }: Props) {
  if (!word) {
    return (
      <div className="word-display">
        <span className="word-placeholder">準備完了</span>
      </div>
    )
  }

  const i = orpIndex(word)
  const before = word.slice(0, i)
  const pivot = word.slice(i, i + 1)
  const after = word.slice(i + 1)

  return (
    <div className="word-display">
      <div className="reticle reticle-top" aria-hidden />
      <div className="word" aria-label={word}>
        <span className="word-before">{before}</span>
        <span className="word-pivot">{pivot}</span>
        <span className="word-after">{after}</span>
      </div>
      <div className="reticle reticle-bottom" aria-hidden />
    </div>
  )
}
