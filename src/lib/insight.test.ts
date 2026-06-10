import { describe, it, expect } from 'vitest'
import { computeWeeklyInsight } from './insight'
import type { WeekAggregate } from './insight'

function week(
  weekStart: string,
  avgEnergy: number | null,
  habitsCompleted: number,
  appsSent: number,
): WeekAggregate {
  return { weekStart, avgEnergy, habitsCompleted, appsSent }
}

describe('computeWeeklyInsight', () => {
  it('returns no-data when fewer than 2 weeks', () => {
    const result = computeWeeklyInsight([week('2024-01-01', 7, 5, 2)])
    expect(result.hasData).toBe(false)
    expect(result.text).toMatch(/not enough data/i)
  })

  it('returns no-data when correlation is too weak (all same values)', () => {
    const weeks = [
      week('2024-01-01', 5, 3, 3),
      week('2024-01-08', 5, 3, 3),
      week('2024-01-15', 5, 3, 3),
    ]
    const result = computeWeeklyInsight(weeks)
    expect(result.hasData).toBe(false)
  })

  it('detects strong energy-habits correlation', () => {
    // High energy weeks → more habits done
    const weeks = [
      week('2024-01-01', 8, 10, 2),
      week('2024-01-08', 9, 12, 3),
      week('2024-01-15', 4,  3, 2),
      week('2024-01-22', 3,  2, 1),
    ]
    const result = computeWeeklyInsight(weeks)
    expect(result.hasData).toBe(true)
    expect(result.text.length).toBeGreaterThan(10)
  })

  it('detects negative energy-apps correlation', () => {
    // High energy → fewer apps (quality over quantity pattern)
    const weeks = [
      week('2024-01-01', 8, 5, 1),
      week('2024-01-08', 9, 6, 0),
      week('2024-01-15', 3, 3, 5),
      week('2024-01-22', 2, 2, 6),
    ]
    const result = computeWeeklyInsight(weeks)
    expect(result.hasData).toBe(true)
  })

  it('still works when some weeks have no energy data', () => {
    const weeks = [
      week('2024-01-01', null, 5, 2),
      week('2024-01-08', null, 8, 5),
      week('2024-01-15', null, 3, 1),
      week('2024-01-22', null, 7, 4),
    ]
    // Should fall back to habits-apps correlation
    const result = computeWeeklyInsight(weeks)
    // result may or may not have data depending on correlation strength — just no crash
    expect(typeof result.hasData).toBe('boolean')
    expect(result.text.length).toBeGreaterThan(0)
  })

  it('insight text is never empty when hasData is true', () => {
    const weeks = [
      week('2024-01-01', 8, 10, 1),
      week('2024-01-08', 7,  9, 1),
      week('2024-01-15', 3,  2, 8),
      week('2024-01-22', 2,  1, 9),
    ]
    const result = computeWeeklyInsight(weeks)
    if (result.hasData) {
      expect(result.text.length).toBeGreaterThan(20)
    }
  })
})
