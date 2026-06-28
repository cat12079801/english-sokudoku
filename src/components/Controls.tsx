interface Props {
  playing: boolean
  wpm: number
  onWpmChange: (wpm: number) => void
  onToggle: () => void
  onBack: () => void
  onForward: () => void
  onReset: () => void
}

/**
 * 再生コントロール。再生/一時停止・前後スキップ・WPM 調整・頭出し。
 */
export function Controls({
  playing,
  wpm,
  onWpmChange,
  onToggle,
  onBack,
  onForward,
  onReset,
}: Props) {
  return (
    <div className="controls">
      <div className="control-buttons">
        <button type="button" onClick={onReset} title="頭出し (Home)">
          ⏮
        </button>
        <button type="button" onClick={onBack} title="10 語戻る (←)">
          ⏪
        </button>
        <button type="button" className="primary play" onClick={onToggle} title="再生/一時停止 (Space)">
          {playing ? '⏸' : '▶'}
        </button>
        <button type="button" onClick={onForward} title="10 語進む (→)">
          ⏩
        </button>
      </div>
      <div className="wpm">
        <label htmlFor="wpm-range">速度: {wpm} WPM</label>
        <input
          id="wpm-range"
          type="range"
          min={100}
          max={900}
          step={25}
          value={wpm}
          onChange={(e) => onWpmChange(Number(e.target.value))}
        />
      </div>
    </div>
  )
}
