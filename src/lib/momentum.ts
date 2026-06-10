// §5 Momentum engine — pure functions, framework-agnostic, fully testable.
// Psychology rule: score NEVER falls below FLOOR (25). There is always a
// foundation to build on. A returning user never sees zero.

export const DECAY = 0.90          // gentle daily idle decay
export const GAIN = 1.0
export const FLOOR = 25            // absolute minimum — never hits 0

export const HABIT_POINTS = 6
export const HABIT_CAP = 18        // 3 habits max per day
export const JOB_POINTS = 8
export const JOB_CAP = 16          // 2 job actions max per day
export const REFLECTION_POINTS = 10
export const FOCUS_POINTS = 12     // a completed focus session = meaningful action
export const FOCUS_CAP = 12        // one session's worth per day

export interface DailyActivity {
  habitsCompleted: number
  jobActions: number      // distinct job apps with any stage change today
  reflectionDone: boolean
  focusSessions: number   // completed focus sessions today
}

/** Raw activity points for a single day, capped per §5. */
export function computeDailyActivity(a: DailyActivity): number {
  const habits = Math.min(a.habitsCompleted * HABIT_POINTS, HABIT_CAP)
  const jobs   = Math.min(a.jobActions     * JOB_POINTS,   JOB_CAP)
  const refl   = a.reflectionDone ? REFLECTION_POINTS : 0
  const focus  = Math.min(a.focusSessions * FOCUS_POINTS,  FOCUS_CAP)
  return habits + jobs + refl + focus
}

/**
 * Apply one day's decay + activity to the previous score.
 * Result is always in [FLOOR, 100].
 */
export function applyDecay(prevScore: number, todayActivity: number): number {
  const next = prevScore * DECAY + todayActivity * GAIN
  return clamp(next, FLOOR, 100)
}

/**
 * Backfill score across N missed (idle) days — no activity each day.
 * The FLOOR guarantee means a long absence still leaves the user at 25,
 * never at 0.
 */
export function backfillDecay(score: number, missedDays: number): number {
  let s = score
  for (let i = 0; i < missedDays; i++) {
    s = Math.max(FLOOR, s * DECAY)
  }
  return s
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}
