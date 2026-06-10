import { useMemo } from 'react'
import { format, differenceInCalendarDays, parseISO } from 'date-fns'
import {
  useHabits,
  useTodayLogs,
  useTodayReflection,
  useJobApplications,
  useTodayScore,
  useMomentumSnapshots,
  useStreak,
  useActiveDates,
  useTodayFocusSessions,
} from '../db/hooks'
import { MomentumOrb }        from '../components/MomentumOrb'
import { StreakCard }          from '../components/StreakCard'
import { NextStepNudge }       from '../components/NextStepNudge'
import { TodayRow }            from '../components/TodayRow'
import { FunnelSummary }       from '../components/FunnelSummary'
import { MomentumSparkline }   from '../components/MomentumSparkline'
import { WeeklyInsightCard }   from '../components/WeeklyInsightCard'

type Tab = 'home' | 'habits' | 'jobs' | 'reflect' | 'focus'

interface Props {
  onNavigate: (tab: Tab) => void
}

function fmtToday() {
  return new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
}

function statusMessage(score: number, lastActiveDate: string | null, today: string): string {
  if (lastActiveDate) {
    const gap = differenceInCalendarDays(parseISO(today), parseISO(lastActiveDate))
    if (gap >= 2) return `Welcome back — your momentum is at ${score}.`
  }
  if (score >= 80) return "You're on a roll — keep it going."
  if (score >= 60) return 'Good energy today. Every action counts.'
  if (score >= 40) return "You're building something — one step at a time."
  return "A small step today is enough. You've got this."
}

export function DashboardPage({ onNavigate }: Props) {
  const today           = format(new Date(), 'yyyy-MM-dd')
  const habits          = useHabits()
  const todayLogs       = useTodayLogs()
  const reflection      = useTodayReflection()
  const jobs            = useJobApplications()
  const score           = useTodayScore() ?? 50
  const snapshots       = useMomentumSnapshots(30)
  const streak          = useStreak()
  const activeDates     = useActiveDates(30)
  const todayFocusSessions = useTodayFocusSessions()

  const todayLogIds = useMemo(
    () => new Set(todayLogs?.map(l => l.habitId) ?? []),
    [todayLogs],
  )

  const todayFocusDone = (todayFocusSessions?.length ?? 0) > 0

  const lastActiveDate = useMemo(() => {
    if (!activeDates) return null
    const sorted = [...activeDates].filter(d => d < today).sort()
    return sorted[sorted.length - 1] ?? null
  }, [activeDates, today])

  const statusMsg = statusMessage(score, lastActiveDate, today)
  const returning = lastActiveDate != null && differenceInCalendarDays(parseISO(today), parseISO(lastActiveDate)) >= 2

  return (
    <div className="page fade-up">
      <header style={{ marginBottom: 26 }}>
        <div className="eyebrow" style={{ marginBottom: 7 }}>{fmtToday()}</div>
        <h1 className="h-greet">{returning ? 'Welcome back' : 'Hello'}</h1>
      </header>

      <div className="dash-top">
        {/* hero card: orb + status + sparkline */}
        <div
          className="card card-pad"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '30px 24px' }}
        >
          <MomentumOrb score={score} />
          <p className="muted" style={{ textAlign: 'center', maxWidth: 280, margin: 0, fontSize: 14.5, lineHeight: 1.45 }}>
            {statusMsg}
          </p>
          {snapshots && snapshots.length >= 2 && (
            <div style={{ width: '100%', marginTop: 4 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>30-day momentum</div>
              <MomentumSparkline snapshots={snapshots} />
            </div>
          )}
        </div>

        {/* right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <NextStepNudge
            habits={habits}
            todayLogIds={todayLogIds}
            reflectionDone={!!reflection}
            jobs={jobs}
            todayFocusDone={todayFocusDone}
            onNavigate={onNavigate}
          />
          <StreakCard streak={streak} activeDates={activeDates} />
        </div>
      </div>

      <div className="dash-mid">
        <TodayRow
          habits={habits}
          todayLogs={todayLogs}
          reflDone={!!reflection}
          onReflect={() => onNavigate('reflect')}
        />
        <FunnelSummary jobs={jobs} onNavigate={() => onNavigate('jobs')} />
      </div>

      <div style={{ marginTop: 18 }}>
        <WeeklyInsightCard />
      </div>
    </div>
  )
}
