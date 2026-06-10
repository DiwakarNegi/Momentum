import { describe, it, expect } from 'vitest'
import {
  computeDailyActivity,
  applyDecay,
  backfillDecay,
  FLOOR,
  HABIT_CAP,
  JOB_CAP,
  REFLECTION_POINTS,
} from './momentum'

describe('computeDailyActivity', () => {
  it('returns 0 when nothing is done', () => {
    expect(computeDailyActivity({ habitsCompleted: 0, jobActions: 0, reflectionDone: false, focusSessions: 0 })).toBe(0)
  })

  it('caps habit points at HABIT_CAP regardless of how many habits completed', () => {
    const withThree = computeDailyActivity({ habitsCompleted: 3, jobActions: 0, reflectionDone: false, focusSessions: 0 })
    const withTen   = computeDailyActivity({ habitsCompleted: 10, jobActions: 0, reflectionDone: false, focusSessions: 0 })
    expect(withThree).toBe(HABIT_CAP)
    expect(withTen).toBe(HABIT_CAP)
  })

  it('caps job points at JOB_CAP', () => {
    const with2  = computeDailyActivity({ habitsCompleted: 0, jobActions: 2,  reflectionDone: false, focusSessions: 0 })
    const with99 = computeDailyActivity({ habitsCompleted: 0, jobActions: 99, reflectionDone: false, focusSessions: 0 })
    expect(with2).toBe(JOB_CAP)
    expect(with99).toBe(JOB_CAP)
  })

  it('adds reflection points correctly', () => {
    const without = computeDailyActivity({ habitsCompleted: 0, jobActions: 0, reflectionDone: false, focusSessions: 0 })
    const with_   = computeDailyActivity({ habitsCompleted: 0, jobActions: 0, reflectionDone: true, focusSessions: 0 })
    expect(with_ - without).toBe(REFLECTION_POINTS)
  })

  it('full day caps out below 50 (generous but not overwhelming)', () => {
    const full = computeDailyActivity({ habitsCompleted: 99, jobActions: 99, reflectionDone: true, focusSessions: 0 })
    expect(full).toBe(HABIT_CAP + JOB_CAP + REFLECTION_POINTS) // 18+16+10 = 44
    expect(full).toBeLessThan(50)
  })
})

describe('applyDecay', () => {
  it('score NEVER falls below FLOOR (25)', () => {
    // Even starting at FLOOR with no activity, it stays at FLOOR
    expect(applyDecay(FLOOR, 0)).toBe(FLOOR)
    // Starting at 0 with no activity still hits FLOOR
    expect(applyDecay(0, 0)).toBe(FLOOR)
  })

  it('score NEVER exceeds 100', () => {
    expect(applyDecay(100, 44)).toBe(100)
    expect(applyDecay(99, 44)).toBe(100)
  })

  it('decays gently — one idle day keeps ~90% of score', () => {
    const score = applyDecay(80, 0)
    expect(score).toBeCloseTo(72, 0) // 80 * 0.90 = 72
  })

  it('recovers with activity', () => {
    const idle   = applyDecay(60, 0)   // 54
    const active = applyDecay(60, 30)  // 60*0.9 + 30 = 84
    expect(active).toBeGreaterThan(idle)
  })
})

describe('backfillDecay', () => {
  it('0 missed days leaves score unchanged', () => {
    expect(backfillDecay(80, 0)).toBe(80)
  })

  it('NEVER drops below FLOOR even after many missed days', () => {
    expect(backfillDecay(100, 365)).toBeGreaterThanOrEqual(FLOOR)
    expect(backfillDecay(FLOOR,  1)).toBe(FLOOR)
  })

  it('decays monotonically', () => {
    const s1 = backfillDecay(100, 5)
    const s2 = backfillDecay(100, 10)
    expect(s1).toBeGreaterThan(s2)
  })
})
