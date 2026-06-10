import { Icon } from './Icon'
import type { Habit, JobApplication } from '../db/types'

interface Props {
  habits:           Habit[]          | undefined
  todayLogIds:      Set<string>
  reflectionDone:   boolean
  jobs:             JobApplication[] | undefined
  todayFocusDone:   boolean
  onNavigate:       (tab: 'habits' | 'jobs' | 'reflect' | 'focus') => void
}

interface Nudge {
  icon:  string
  color: string
  text:  string
  cta:   string
  tab:   'habits' | 'jobs' | 'reflect' | 'focus'
}

function pickNudge(
  habits: Habit[],
  todayLogIds: Set<string>,
  reflectionDone: boolean,
  jobs: JobApplication[],
  todayFocusDone: boolean,
): Nudge {
  // Reflection is the lowest-friction entry point (30 seconds)
  if (!reflectionDone) {
    return { icon: 'spark', color: 'lavender', text: 'A 30-second check-in is all it takes.', cta: 'Do the check-in', tab: 'reflect' }
  }
  // Focus session suggestion — placed early since it's the sustain mechanic
  if (!todayFocusDone) {
    return { icon: 'focus', color: 'sky', text: 'Start a focused work session — even 10 minutes counts.', cta: 'Start focusing', tab: 'focus' }
  }
  const unlogged = habits.find(h => !todayLogIds.has(h.id))
  if (unlogged) {
    return { icon: unlogged.icon ?? 'spark', color: unlogged.color ?? 'sage', text: `One small win: ${unlogged.name}.`, cta: 'Tick it off', tab: 'habits' }
  }
  if (jobs.some(j => j.stage === 'saved')) {
    return { icon: 'applied', color: 'amber', text: 'You have a saved role ready to go.', cta: 'Apply to just one', tab: 'jobs' }
  }
  return { icon: 'offer', color: 'sage', text: "You've done what matters today — nice work.", cta: 'See your jobs', tab: 'jobs' }
}

export function NextStepNudge({ habits, todayLogIds, reflectionDone, jobs, todayFocusDone, onNavigate }: Props) {
  const n = pickNudge(habits ?? [], todayLogIds, reflectionDone, jobs ?? [], todayFocusDone)
  return (
    <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
      <div className="tile" style={{ width: 46, height: 46, '--tile-c': `var(--c-${n.color})` } as React.CSSProperties}>
        <Icon name={n.icon} size={24} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="eyebrow" style={{ marginBottom: 4 }}>Smallest next step</div>
        <p style={{ margin: 0, fontSize: 14.5, fontWeight: 500, lineHeight: 1.35 }}>{n.text}</p>
      </div>
      <button
        className="btn btn-accent btn-sm"
        style={{ flex: 'none', whiteSpace: 'nowrap' }}
        onClick={() => onNavigate(n.tab)}
      >
        {n.cta}
      </button>
    </div>
  )
}
