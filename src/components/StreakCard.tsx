import { Icon } from './Icon'
import { format, subDays } from 'date-fns'
import type { StreakResult } from '../lib/streak'

interface Props {
  streak:      StreakResult | undefined
  activeDates: Set<string> | undefined
}

export function StreakCard({ streak, activeDates }: Props) {
  const today = format(new Date(), 'yyyy-MM-dd')

  const dots = Array.from({ length: 30 }, (_, i) => {
    const d = format(subDays(new Date(), 29 - i), 'yyyy-MM-dd')
    return { d, on: activeDates?.has(d) ?? false, today: d === today }
  })

  const curr = streak?.currentRun   ?? 0
  const best = streak?.personalBest ?? 0
  const days = streak?.daysActiveInLast30 ?? 0
  const newBest = curr > 0 && curr === best && best > 1

  return (
    <div className="card card-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18 }}>
          <Stat label="Current run" value={curr} unit="days" />
          <div style={{ width: 1, height: 30, background: 'var(--border)' }} />
          <Stat label="Personal best" value={best} unit="days" highlight={newBest} accent />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="num" style={{ fontSize: 19, fontWeight: 700 }}>
            {days}<span className="faint" style={{ fontSize: 13, fontWeight: 500 }}> / 30</span>
          </div>
          <div className="eyebrow" style={{ marginTop: 2 }}>days active</div>
        </div>
      </div>

      <div className="dotrow" role="img" aria-label={`${days} of last 30 days active`}>
        {dots.map(d => (
          <div
            key={d.d}
            className={`dot${d.on ? ' on' : ''}${d.today ? ' today' : ''}`}
            style={{ opacity: d.on ? 1 : 0.55 }}
          />
        ))}
      </div>

      {curr === 0 && best > 0 && (
        <p className="muted" style={{ fontSize: 12.5, marginTop: 14, marginBottom: 0, display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ color: 'var(--accent)', display: 'inline-flex' }}><Icon name="spark" size={15} /></span>
          New run starts today — your best is {best}. Let's go.
        </p>
      )}
    </div>
  )
}

function Stat({ label, value, unit, highlight, accent }: {
  label: string; value: number; unit: string; highlight?: boolean; accent?: boolean
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span
          className={`num${highlight ? ' pop-num' : ''}`}
          style={{ fontSize: 30, fontWeight: 700, color: accent ? 'var(--accent)' : 'var(--ink)' }}
        >
          {value}
        </span>
        <span className="faint" style={{ fontSize: 12 }}>{unit}</span>
      </div>
      <div className="eyebrow" style={{ marginTop: 3 }}>{label}</div>
    </div>
  )
}
