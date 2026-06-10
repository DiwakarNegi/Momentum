import { useState } from 'react'
import { format } from 'date-fns'
import { toggleHabitLog } from '../db/operations'
import { Icon } from './Icon'
import type { Habit, HabitLog } from '../db/types'

interface Props {
  habits:    Habit[]    | undefined
  todayLogs: HabitLog[] | undefined
  reflDone:  boolean
  onReflect: () => void
}

export function TodayRow({ habits, todayLogs, reflDone, onReflect }: Props) {
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const doneIds  = new Set(todayLogs?.map(l => l.habitId) ?? [])
  const list     = habits ?? []

  async function tap(habitId: string) {
    await toggleHabitLog(habitId, todayStr)
  }

  return (
    <div className="card card-pad">
      <div className="eyebrow" style={{ marginBottom: 14 }}>Today</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {list.map(h => {
          const done = doneIds.has(h.id)
          return (
            <HabitChip
              key={h.id}
              habit={h}
              done={done}
              onTap={() => tap(h.id)}
            />
          )
        })}
        <button
          className={`chip${reflDone ? ' done' : ''}`}
          style={reflDone ? { background: 'var(--c-lavender)' } : {}}
          onClick={onReflect}
          aria-pressed={reflDone}
        >
          <span className="chip-ic"><Icon name="spark" size={17} /></span>
          {reflDone ? 'Check-in done' : 'Check-in'}
        </button>
        {list.length === 0 && !reflDone && (
          <p className="muted" style={{ fontSize: 13 }}>Add some habits to get started.</p>
        )}
      </div>
    </div>
  )
}

function HabitChip({ habit, done, onTap }: { habit: Habit; done: boolean; onTap: () => void }) {
  const [ring, setRing] = useState(false)

  const tap = () => {
    if (!done) { setRing(true); setTimeout(() => setRing(false), 450) }
    onTap()
  }

  return (
    <button
      className={`chip${done ? ' done' : ''}`}
      style={done ? { background: `var(--c-${habit.color ?? 'sage'})` } : {}}
      onClick={tap}
      aria-pressed={done}
    >
      <span
        className="chip-ic"
        style={{ color: done ? 'var(--on-accent)' : `var(--c-${habit.color ?? 'sage'})` }}
      >
        <Icon name={habit.icon ?? 'spark'} size={17} />
      </span>
      {habit.name}
      <span
        className={`bloom-ring${ring ? ' go' : ''}`}
        style={{ color: `var(--c-${habit.color ?? 'sage'})` }}
      />
    </button>
  )
}
