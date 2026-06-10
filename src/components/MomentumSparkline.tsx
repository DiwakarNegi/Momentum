import type { MomentumSnapshot } from '../db/types'

function lerp(a: number, b: number, t: number) { return Math.round(a + (b - a) * t) }
function orbRGB(score: number): [number, number, number] {
  const L: [number,number,number] = [156, 196, 232]
  const M: [number,number,number] = [240, 197, 120]
  const H: [number,number,number] = [240, 165, 148]
  if (score <= 50) { const t = score / 50; return [lerp(L[0],M[0],t), lerp(L[1],M[1],t), lerp(L[2],M[2],t)] }
  const t = (score - 50) / 50; return [lerp(M[0],H[0],t), lerp(M[1],H[1],t), lerp(M[2],H[2],t)]
}

interface Props {
  snapshots: MomentumSnapshot[] | undefined
  height?: number
}

export function MomentumSparkline({ snapshots, height = 64 }: Props) {
  if (!snapshots || snapshots.length < 2) return null

  const W = 320, H = height, pad = 6
  const n = snapshots.length
  const min = 20, max = 100
  const xOf = (i: number) => pad + (i / (n - 1)) * (W - pad * 2)
  const yOf = (v: number) => pad + (H - pad * 2) * (1 - (v - min) / (max - min))
  const line = snapshots.map((s, i) => `${xOf(i).toFixed(1)},${yOf(s.score).toFixed(1)}`).join(' ')
  const area = `${pad},${H} ${line} ${W - pad},${H}`
  const last = snapshots[n - 1]
  const [lr, lg, lb] = orbRGB(last.score)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height }}
      preserveAspectRatio="none"
      aria-label="30-day momentum sparkline"
      role="img"
    >
      <defs>
        <linearGradient id="sparkArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={`rgb(${lr},${lg},${lb})`} stopOpacity="0.32" />
          <stop offset="100%" stopColor={`rgb(${lr},${lg},${lb})`} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#sparkArea)" />
      <polyline
        points={line}
        fill="none"
        stroke={`rgb(${lr},${lg},${lb})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={xOf(n - 1)}
        cy={yOf(last.score)}
        r="3.5"
        fill={`rgb(${lr},${lg},${lb})`}
        stroke="var(--surface)"
        strokeWidth="2"
      />
    </svg>
  )
}
