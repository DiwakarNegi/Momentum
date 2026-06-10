// §5b Forgiving streak — pure functions, no Dexie dependency.
//
// Psychology rule: personal best NEVER decreases. A reset is a neutral event
// ("new run starts") not a loss event ("streak broken"). The persisted best
// is passed in from the Meta table so it survives log edits.

import { format, subDays, parseISO, differenceInCalendarDays } from 'date-fns'

export interface StreakResult {
  currentRun: number
  personalBest: number          // max(persistedBest, computedLongest, currentRun)
  daysActiveInLast30: number
}

/**
 * Main entry point. Call after any write that could affect active-day status.
 * Pass the stored personalBest from Meta so it never regresses.
 */
export function computeStreak(
  today: string,
  activeDates: Set<string>,
  persistedBest: number,
): StreakResult {
  const currentRun   = computeCurrentRun(today, activeDates)
  const computedBest = computeLongestRun(activeDates)
  // personal best is the max of all three — it only ever grows
  const personalBest = Math.max(persistedBest, computedBest, currentRun)
  const daysActiveInLast30 = countDaysActiveInLast30(today, activeDates)
  return { currentRun, personalBest, daysActiveInLast30 }
}

/**
 * Count consecutive days ending on today (inclusive).
 * A gap of 1 day resets the run — the persisted best absorbs that loss.
 */
export function computeCurrentRun(today: string, activeDates: Set<string>): number {
  let count  = 0
  let cursor = today
  while (activeDates.has(cursor)) {
    count++
    cursor = format(subDays(parseISO(cursor), 1), 'yyyy-MM-dd')
  }
  return count
}

/**
 * Find the longest consecutive run across ALL time.
 * Used to seed personalBest on first compute.
 */
export function computeLongestRun(activeDates: Set<string>): number {
  if (activeDates.size === 0) return 0
  const sorted = Array.from(activeDates).sort() // lexicographic = chronological for yyyy-MM-dd
  let best    = 1
  let current = 1
  for (let i = 1; i < sorted.length; i++) {
    const gap = differenceInCalendarDays(parseISO(sorted[i]), parseISO(sorted[i - 1]))
    if (gap === 1) {
      current++
      if (current > best) best = current
    } else {
      current = 1
    }
  }
  return best
}

/** Count how many of the last 30 days (including today) have at least one action. */
export function countDaysActiveInLast30(today: string, activeDates: Set<string>): number {
  let count = 0
  for (let i = 0; i < 30; i++) {
    if (activeDates.has(format(subDays(parseISO(today), i), 'yyyy-MM-dd'))) count++
  }
  return count
}
