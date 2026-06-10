import { describe, it, expect } from 'vitest'
import {
  computeCurrentRun,
  computeLongestRun,
  countDaysActiveInLast30,
  computeStreak,
} from './streak'

const set = (...dates: string[]) => new Set(dates)

describe('computeCurrentRun', () => {
  it('returns 0 when today is not active', () => {
    expect(computeCurrentRun('2024-06-08', set('2024-06-07', '2024-06-06'))).toBe(0)
  })

  it('counts consecutive days including today', () => {
    expect(computeCurrentRun('2024-06-08', set('2024-06-08', '2024-06-07', '2024-06-06'))).toBe(3)
  })

  it('stops at a gap', () => {
    // gap on 06-06, so run = 2 (06-08, 06-07)
    expect(computeCurrentRun('2024-06-08', set('2024-06-08', '2024-06-07', '2024-06-05'))).toBe(2)
  })
})

describe('computeLongestRun', () => {
  it('returns 0 for empty set', () => {
    expect(computeLongestRun(new Set())).toBe(0)
  })

  it('finds the longest consecutive run', () => {
    const dates = set('2024-01-01', '2024-01-02', '2024-01-03', '2024-01-10', '2024-01-11')
    expect(computeLongestRun(dates)).toBe(3)
  })

  it('handles a single-day set', () => {
    expect(computeLongestRun(set('2024-06-08'))).toBe(1)
  })
})

describe('countDaysActiveInLast30', () => {
  it('counts only within the last 30 days', () => {
    const today = '2024-06-08'
    const recent = set('2024-06-08', '2024-06-07', '2024-06-01')
    const old    = set('2024-04-01') // outside window
    expect(countDaysActiveInLast30(today, new Set([...recent, ...old]))).toBe(3)
  })

  it('returns 0 when nothing is in window', () => {
    expect(countDaysActiveInLast30('2024-06-08', set('2024-01-01'))).toBe(0)
  })
})

describe('computeStreak — personal best NEVER decreases', () => {
  it('personal best stays when current run resets', () => {
    const activeDates = set('2024-06-05', '2024-06-06', '2024-06-07') // run ended, today (06-08) inactive
    const today = '2024-06-08'
    const { currentRun, personalBest } = computeStreak(today, activeDates, 10)

    // Current run resets to 0 (today inactive)
    expect(currentRun).toBe(0)
    // Personal best does NOT decrease — it was 10, computed best is 3
    expect(personalBest).toBe(10)
  })

  it('personal best grows when current run exceeds stored best', () => {
    const dates = set('2024-06-04','2024-06-05','2024-06-06','2024-06-07','2024-06-08')
    const { personalBest } = computeStreak('2024-06-08', dates, 3)
    // Current run is 5, which beats stored best of 3
    expect(personalBest).toBe(5)
  })

  it('personal best is always max(stored, computed, current)', () => {
    const dates = set('2024-06-08') // current run = 1
    const { personalBest } = computeStreak('2024-06-08', dates, 7) // stored = 7
    expect(personalBest).toBe(7)
  })

  it('30-day count survives a current-run reset', () => {
    const today = '2024-06-08'
    // Active many days in the last 30, but today is inactive (run resets)
    const dates = set('2024-06-05', '2024-06-04', '2024-06-03', '2024-05-25', '2024-05-20')
    const { currentRun, daysActiveInLast30 } = computeStreak(today, dates, 0)
    expect(currentRun).toBe(0)
    expect(daysActiveInLast30).toBe(5) // all 5 are within 30 days of 2024-06-08
  })
})
