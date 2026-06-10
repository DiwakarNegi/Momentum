import { Icon } from './Icon'
import { ProgressBar } from './ProgressBar'
import { STAGES, STAGE_META } from '../lib/stages'
import type { JobApplication, JobStage } from '../db/types'

interface Props {
  jobs:       JobApplication[] | undefined
  onNavigate: () => void
}

export function FunnelSummary({ jobs, onNavigate }: Props) {
  const counts: Record<JobStage, number> = {} as Record<JobStage, number>
  STAGES.forEach(s => { counts[s] = 0 })
  jobs?.forEach(j => { counts[j.stage]++ })

  const total   = jobs?.length ?? 0
  const visible = STAGES.filter(s => s !== 'rejected')
  const maxC    = Math.max(1, ...visible.map(s => counts[s]))

  return (
    <button
      className="card card-pad"
      onClick={onNavigate}
      style={{ textAlign: 'left', cursor: 'pointer', display: 'block', width: '100%' }}
      aria-label="Open jobs board"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="eyebrow">Job funnel</div>
        <span className="muted" style={{ fontSize: 12.5, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          {total} active <Icon name="arrowRight" size={14} />
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {visible.map(s => {
          const m = STAGE_META[s]
          const c = counts[s]
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <span style={{ color: c ? `var(--c-${m.color})` : 'var(--ink-faint)', display: 'inline-flex' }}>
                <Icon name={m.icon} size={17} />
              </span>
              <span style={{ width: 64, fontSize: 13, fontWeight: 600, color: c ? 'var(--ink)' : 'var(--ink-faint)' }}>
                {m.label}
              </span>
              <div style={{ flex: 1 }}>
                <ProgressBar value={c} max={maxC} color={m.color} height={7} showCap={false} />
              </div>
              <span
                className="num"
                style={{ width: 16, textAlign: 'right', fontSize: 13, fontWeight: 700, color: c ? 'var(--ink)' : 'var(--ink-faint)' }}
              >
                {c}
              </span>
            </div>
          )
        })}
      </div>
    </button>
  )
}
