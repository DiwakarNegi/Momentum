import { useState } from 'react'
import { Icon } from './Icon'
import { useWeekAggregates, useSettings } from '../db/hooks'
import { computeWeeklyInsight } from '../lib/insight'

export function WeeklyInsightCard() {
  const weeks    = useWeekAggregates(8)
  const settings = useSettings()
  const [dismissed, setDismissed] = useState(false)

  if (dismissed)                                      return null
  if (!weeks)                                         return null
  if (settings && !settings.showWeeklyInsights)       return null

  const insight = computeWeeklyInsight(weeks)

  return (
    <div className="card card-pad fade-up" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div className="tile" style={{ width: 42, height: 42, '--tile-c': 'var(--c-amber)' } as React.CSSProperties}>
        <Icon name="identity" size={22} />
      </div>
      <div style={{ flex: 1 }}>
        <div className="eyebrow" style={{ marginBottom: 5 }}>This week, gently noticed</div>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.45 }}>{insight.text}</p>
      </div>
      <button
        className="icon-btn"
        style={{ width: 30, height: 30 }}
        onClick={() => setDismissed(true)}
        aria-label="Dismiss insight"
      >
        <Icon name="close" size={15} />
      </button>
    </div>
  )
}
