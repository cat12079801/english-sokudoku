import { useCallback, useEffect, useRef, useState } from 'react'
import { delayMultiplier } from './text'

interface UseRsvpPlayerArgs {
  words: string[]
  wpm: number
}

/**
 * RSVP 再生の状態機械。
 * 単語ごとに delayMultiplier を加味した待ち時間で index を進める。
 * setTimeout を再帰的に張り直すことで「単語ごとに可変の間隔」を実現する。
 */
export function useRsvpPlayer({ words, wpm }: UseRsvpPlayerArgs) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<number | null>(null)

  // 最新値をタイマーのクロージャから参照するための ref。
  const wpmRef = useRef(wpm)
  const wordsRef = useRef(words)
  wpmRef.current = wpm
  wordsRef.current = words

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const stop = useCallback(() => {
    clearTimer()
    setPlaying(false)
  }, [clearTimer])

  // テキストが差し替わったら頭出しして停止する。
  useEffect(() => {
    clearTimer()
    setPlaying(false)
    setIndex(0)
  }, [words, clearTimer])

  // 再生ループ。playing と index に追従して次の単語のタイマーを張る。
  useEffect(() => {
    if (!playing) return
    const list = wordsRef.current
    if (index >= list.length) {
      setPlaying(false)
      return
    }
    const baseMs = 60000 / Math.max(1, wpmRef.current)
    const ms = baseMs * delayMultiplier(list[index])
    timerRef.current = window.setTimeout(() => {
      setIndex((i) => i + 1)
    }, ms)
    return clearTimer
  }, [playing, index, clearTimer])

  const play = useCallback(() => {
    if (wordsRef.current.length === 0) return
    setIndex((i) => (i >= wordsRef.current.length ? 0 : i))
    setPlaying(true)
  }, [])

  const toggle = useCallback(() => {
    setPlaying((p) => !p)
  }, [])

  const seek = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(next, Math.max(0, wordsRef.current.length - 1)))
      setIndex(clamped)
    },
    [],
  )

  const reset = useCallback(() => {
    stop()
    setIndex(0)
  }, [stop])

  return { index, playing, play, stop, toggle, seek, reset, setIndex }
}
