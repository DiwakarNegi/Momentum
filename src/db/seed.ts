// Seeds the DB with a small example dataset on first run ONLY.
// Runs when 'initialized' meta key is absent.
// Easily clearable via Settings → Clear all data.

import { v4 as uuid } from 'uuid'
import { format, subDays } from 'date-fns'
import { db, setMeta } from './index'
import { recomputeToday } from './operations'

export async function seedIfEmpty(): Promise<void> {
  const initialized = await db.meta.get('initialized')
  if (initialized) return

  const now   = new Date()
  const day   = (n: number) => format(subDays(now, n), 'yyyy-MM-dd')
  const iso   = (n: number) => subDays(now, n).toISOString()

  // 3 starter habits — use icon names + short color IDs
  const habits = [
    { id: uuid(), name: 'Morning walk',     icon: 'walk', cadence: 'daily'    as const, color: 'sage',     createdAt: iso(14), archived: false },
    { id: uuid(), name: 'LeetCode / skills', icon: 'code', cadence: 'flexible' as const, targetPerWeek: 4, color: 'sky',      createdAt: iso(14), archived: false },
    { id: uuid(), name: 'Read 20 min',      icon: 'book', cadence: 'daily'    as const, color: 'lavender', createdAt: iso(14), archived: false },
  ]
  await db.habits.bulkAdd(habits)

  // Habit logs: scattered over last 10 days (intentionally not perfect)
  const activeDays = [0, 1, 2, 4, 5, 7, 8, 9]
  const logs = activeDays.flatMap(n =>
    habits.slice(0, 2).map(h => ({ id: uuid(), habitId: h.id, date: day(n) }))
  )
  await db.habitLogs.bulkAdd(logs)

  // 3 job applications
  const jobs = [
    {
      id: uuid(), company: 'Acme Corp',    role: 'Frontend Engineer',
      stage: 'applied' as const,  fitScore: 4,
      createdAt: iso(9), updatedAt: iso(6),
      stageHistory: [
        { stage: 'saved'   as const, at: iso(9) },
        { stage: 'applied' as const, at: iso(6) },
      ],
    },
    {
      id: uuid(), company: 'Globex',       role: 'React Developer',
      stage: 'screen' as const,   fitScore: 3,
      createdAt: iso(7), updatedAt: iso(3),
      stageHistory: [
        { stage: 'saved'   as const, at: iso(7) },
        { stage: 'applied' as const, at: iso(5) },
        { stage: 'screen'  as const, at: iso(3) },
      ],
    },
    {
      id: uuid(), company: 'Initech',      role: 'UI Engineer',
      stage: 'saved' as const,    fitScore: 5,
      createdAt: iso(2), updatedAt: iso(2),
      stageHistory: [{ stage: 'saved' as const, at: iso(2) }],
    },
  ]
  await db.jobApplications.bulkAdd(jobs)

  // A few reflections
  const prompts = [
    { type: 'gratitude' as const, text: "What's one thing you're grateful for today?" },
    { type: 'reframe'   as const, text: "What's one small thing in your control right now?" },
    { type: 'identity'  as const, text: "What's one thing a skilled engineer would do today?" },
  ]
  const reflDays = [0, 1, 3, 5, 8]
  await db.reflections.bulkAdd(
    reflDays.map((n, i) => ({
      id:         uuid(),
      date:       day(n),
      energy:     5 + (i % 4),
      promptType: prompts[i % 3].type,
      promptText: prompts[i % 3].text,
    })),
  )

  await setMeta('initialized', true)
  await recomputeToday()
}
