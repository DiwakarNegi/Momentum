import { useState, useEffect, useRef } from 'react'

const FLOOR = 25

const WAVE_A = 'M0,24 C30,15 60,15 90,24 C120,33 150,33 180,24 C210,15 240,15 270,24 C300,33 330,33 360,24 L360,48 L0,48 Z'
const WAVE_B = 'M0,24 C30,31 60,31 90,24 C120,17 150,17 180,24 C210,31 240,31 270,24 C300,17 330,17 360,24 L360,48 L0,48 Z'

const BUBBLES = [
  { l: '26%', s: 6, d: 5.6, delay: 0,   h: 120 },
  { l: '46%', s: 4, d: 7.0, delay: 1.7, h: 150 },
  { l: '62%', s: 7, d: 5.0, delay: 2.9, h: 110 },
  { l: '38%', s: 3, d: 7.6, delay: 3.7, h: 160 },
  { l: '72%', s: 5, d: 6.2, delay: 0.9, h: 130 },
]

function lerp(a: number, b: number, t: number) { return Math.round(a + (b - a) * t) }

function orbRGB(score: number): [number, number, number] {
  const L: [number,number,number] = [156, 196, 232]  // sky (low)
  const M: [number,number,number] = [240, 197, 120]  // amber (mid)
  const H: [number,number,number] = [240, 165, 148]  // coral (high)
  if (score <= 50) {
    const t = score / 50
    return [lerp(L[0],M[0],t), lerp(L[1],M[1],t), lerp(L[2],M[2],t)]
  }
  const t = (score - 50) / 50
  return [lerp(M[0],H[0],t), lerp(M[1],H[1],t), lerp(M[2],H[2],t)]
}

interface Props {
  score: number
  size?: number
}

export function MomentumOrb({ score, size = 232 }: Props) {
  const pct = Math.max(FLOOR, Math.min(100, score))
  const [r, g, b] = orbRGB(pct)
  const fill = `rgb(${r},${g},${b})`
  const glow = `rgba(${r},${g},${b},0.42)`

  // Animate the displayed number toward score
  const [shown, setShown] = useState(pct)
  const raf = useRef(0)

  useEffect(() => {
    cancelAnimationFrame(raf.current)
    const from = shown
    const to = pct
    const start = performance.now()
    const dur = 650
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      const e = 1 - Math.pow(1 - t, 3)
      setShown(Math.round(from + (to - from) * e))
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [pct]) // eslint-disable-line

  return (
    <div className="orb-wrap" style={{ width: size }}>
      <div
        className="orb-breathe"
        style={{ width: size, height: size, boxShadow: `0 0 60px 0 ${glow}, 0 0 0 1px var(--border)` }}
      >
        <div className="orb-inner" style={{ width: size, height: size }}>
          {/* liquid fill */}
          <div
            className="orb-fill"
            style={{
              height: `${pct}%`,
              background: `linear-gradient(180deg, ${fill} 0%, rgba(${r},${g},${b},0.82) 100%)`,
            }}
          />
          {/* rising bubbles */}
          <div className="orb-bubbles" style={{ height: `${pct}%` }}>
            {BUBBLES.map((bub, i) => (
              <span
                key={i}
                className="orb-bubble"
                style={{
                  left: bub.l,
                  width: bub.s,
                  height: bub.s,
                  '--d': bub.d + 's',
                  '--delay': bub.delay + 's',
                  '--h': bub.h + 'px',
                } as React.CSSProperties}
              />
            ))}
          </div>
          {/* two wave layers at the fill line */}
          <div className="orb-wave" style={{ bottom: `calc(${pct}% - 24px)` }}>
            <svg viewBox="0 0 360 48" preserveAspectRatio="none" className="orb-wave-svg">
              <path d={WAVE_A} fill={fill} />
            </svg>
            <svg viewBox="0 0 360 48" preserveAspectRatio="none" className="orb-wave-svg orb-wave-2">
              <path d={WAVE_B} fill={fill} />
            </svg>
          </div>
          {/* soft top sheen */}
          <div className="orb-sheen" />
          {/* readout */}
          <div className="orb-readout">
            <span className="orb-num">{shown}</span>
            <span className="orb-label">momentum</span>
          </div>
        </div>
      </div>
    </div>
  )
}
