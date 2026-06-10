interface Props {
  value: number
  max: number
  color?: string   // color name: 'sage' | 'coral' | 'lavender' | 'amber' | 'sky' | 'rose'
  height?: number
  showCap?: boolean
}

export function ProgressBar({ value, max, color = 'sage', height = 8, showCap = true }: Props) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="pbar" style={{ height }}>
      <div
        className="pbar-fill"
        style={{
          width: `${pct}%`,
          background: `var(--c-${color})`,
          boxShadow: `0 0 12px -2px var(--c-${color})`,
        }}
      />
      {showCap && pct >= 100 && (
        <div className="pbar-cap" style={{ background: `var(--c-${color})` }} />
      )}
    </div>
  )
}
