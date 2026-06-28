// 英文テキストの前処理とトークナイズ。

/**
 * Project Gutenberg のテキストには本文の前後に定型のヘッダ/フッタが付く。
 * `*** START OF ...` と `*** END OF ...` のマーカーで挟まれた本文だけを抜き出す。
 * マーカーが見つからなければ元のテキストをそのまま返す。
 */
export function stripGutenbergBoilerplate(raw: string): string {
  const startMatch = raw.match(/\*\*\*\s*START OF (?:THE|THIS) PROJECT GUTENBERG.*?\*\*\*/is)
  const endMatch = raw.match(/\*\*\*\s*END OF (?:THE|THIS) PROJECT GUTENBERG.*?\*\*\*/is)

  let body = raw
  if (startMatch && startMatch.index !== undefined) {
    body = body.slice(startMatch.index + startMatch[0].length)
  }
  if (endMatch && endMatch.index !== undefined) {
    // endMatch.index は元テキスト基準なので、start を削った分を補正する。
    const offset = startMatch?.index !== undefined ? startMatch.index + startMatch[0].length : 0
    const endIndex = endMatch.index - offset
    if (endIndex > 0) body = body.slice(0, endIndex)
  }
  return body.trim()
}

/**
 * テキストを「表示単位」の配列に分割する。
 * 空白で区切るが、ハイフンや句読点はその単語にくっつけたまま保持する。
 */
export function tokenize(text: string): string[] {
  return text
    .replace(/\r\n?/g, '\n')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0)
}

/**
 * ORP (Optimal Recognition Point): 単語のどの文字に視点を固定すると認識が速いか。
 * 単語長に応じて中央やや左の文字インデックスを返す。
 * 参考的なヒューリスティック（Spritz 等で使われる経験則）。
 */
export function orpIndex(word: string): number {
  const len = word.length
  if (len <= 1) return 0
  if (len <= 5) return 1
  if (len <= 9) return 2
  if (len <= 13) return 3
  return 4
}

/**
 * 単語ごとの表示時間の倍率。長い単語や句読点で終わる単語は少し長めに見せる。
 */
export function delayMultiplier(word: string): number {
  let m = 1
  if (word.length > 8) m += 0.3
  if (/[.!?]$/.test(word)) m += 0.9
  else if (/[,;:]$/.test(word)) m += 0.45
  return m
}
