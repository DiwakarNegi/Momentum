// Pure functions — no framework deps. Tested independently.

export interface WeekAggregate {
  weekStart:       string        // yyyy-MM-dd (Monday)
  avgEnergy:       number | null // null = no reflections that week
  habitsCompleted: number
  appsSent:        number
}

export interface InsightResult {
  text:    string
  hasData: boolean  // false = "not enough data" friendly state
}

const MIN_WEEKS = 2
// Lower threshold than typical (0.5+) since we may only have a few weeks
const MIN_CORR  = 0.35

function pearson(xs: number[], ys: number[]): number {
  const n = xs.length
  if (n < 2) return 0
  const mx = xs.reduce((a, b) => a + b, 0) / n
  const my = ys.reduce((a, b) => a + b, 0) / n
  let num = 0, dx2 = 0, dy2 = 0
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx, dy = ys[i] - my
    num += dx * dy
    dx2 += dx * dx
    dy2 += dy * dy
  }
  const denom = Math.sqrt(dx2 * dy2)
  return denom === 0 ? 0 : num / denom
}

type Pair = 'energy-habits' | 'energy-apps' | 'habits-apps'

// All copy is phrased as neutral observations, never directives or scolds (§8)
function insightText(pair: Pair, r: number): string {
  const pos = r > 0
  switch (pair) {
    case 'energy-habits':
      return pos
        ? 'Your habits tend to flow more easily on higher-energy weeks — the two seem to reinforce each other.'
        : 'You keep up your habits even on lower-energy weeks — that takes genuine grit.'
    case 'energy-apps':
      return pos
        ? 'More applications seem to happen on your higher-energy weeks — momentum feeding momentum.'
        : 'You logged higher energy the weeks you applied to fewer roles — quality over quantity might be your style.'
    case 'habits-apps':
      return pos
        ? 'Weeks with strong habits also tend to have more applications — a nice double win.'
        : "When applications are lighter, your habits shine — and that's a valid way to pace yourself."
  }
}

export function computeWeeklyInsight(weeks: WeekAggregate[]): InsightResult {
  const noData: InsightResult = {
    text:    "Not enough data yet — keep going and patterns will start to emerge here.",
    hasData: false,
  }

  if (weeks.length < MIN_WEEKS) return noData

  // Build per-pair arrays, filtering to weeks where both values are present
  const withEnergy = weeks.filter(w => w.avgEnergy !== null)

  const pairs: { pair: Pair; xs: number[]; ys: number[] }[] = [
    {
      pair: 'energy-habits',
      xs: withEnergy.map(w => w.avgEnergy!),
      ys: withEnergy.map(w => w.habitsCompleted),
    },
    {
      pair: 'energy-apps',
      xs: withEnergy.map(w => w.avgEnergy!),
      ys: withEnergy.map(w => w.appsSent),
    },
    {
      pair: 'habits-apps',
      xs: weeks.map(w => w.habitsCompleted),
      ys: weeks.map(w => w.appsSent),
    },
  ]

  const candidates = pairs
    .filter(p => p.xs.length >= MIN_WEEKS)
    .map(p => ({ pair: p.pair, r: pearson(p.xs, p.ys) }))

  if (candidates.length === 0) return noData

  const best = candidates.reduce((a, b) => Math.abs(b.r) > Math.abs(a.r) ? b : a)

  if (Math.abs(best.r) < MIN_CORR) return noData

  return { text: insightText(best.pair, best.r), hasData: true }
}
