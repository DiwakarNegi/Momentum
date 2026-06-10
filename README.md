# Momentum

A local-first productivity app built for surviving the job hunt without burning out.

Track habits, job applications, and daily reflections — and turn them into a single **momentum score** that encourages you back instead of punishing you for missing a day.

---

## Features

**Dashboard**
- Breathing momentum orb (0–100 score that never hits zero)
- Forgiving streak — current run + personal best + days active in last 30
- "Smallest next step" nudge to beat starting friction
- Today's habits as tappable chips
- 30-day sparkline

**Habits — The Garden**
- Heatmap grid for each habit (last 8 weeks)
- Tap to log, satisfying bloom animation
- Per-habit emoji, color, and cadence (daily / weekly / flexible)
- Rolling "X of last 7 days" instead of reset-to-zero streaks

**Jobs — The Funnel**
- Kanban board: Saved → Applied → Screen → Interview → Offer → Rejected
- Drag cards between stages
- Optional CBT reframe prompt on rejection (always skippable)
- Fit score (1–5) for weekly insight correlation

**Reflect**
- 30-second daily check-in: energy slider + rotating prompt
- Energy-over-time chart
- Past reflections log

**Focus**
- Daily task list — add tasks, tap to complete, launch a session from any task
- Pomodoro-style timer with a calming orb that drains as time passes
- Distraction capture ("park a thought, stay in session")
- Session notepad — jot during, review after
- Abandoned sessions are neutral, never failure

**Settings**
- 6 color palettes + font switcher
- Export / import all data as JSON (you own your data)
- Clear all data

---

## Philosophy

No punishing streaks. A missed day is neutral (gray), never red. The momentum score decays gently when idle but never resets — there's always a floor to build from. Returning after a gap feels warm, not guilty.

---

## Tech Stack

- **Vite + React + TypeScript**
- **Tailwind CSS v4**
- **Dexie.js** (IndexedDB) — fully local, no backend, no auth, works offline
- **dnd-kit** — kanban drag and drop
- **Recharts** — energy trend chart
- **date-fns** — date math

---

## Run Locally

```bash
git clone https://github.com/DiwakarNegi/Momentum.git
cd Momentum
npm install
npm run dev
```

Open `http://localhost:5173`. Data lives in your browser's IndexedDB.

---

## Deploy

```bash
npm run build   # outputs to dist/
```

Deploy the `dist/` folder to any static host — **Cloudflare Pages**, **Vercel**, or **Netlify** all work out of the box. Config files for all three are included (`vercel.json`, `public/_redirects`).

---

## Data & Privacy

Everything is stored locally in your browser (IndexedDB). Nothing is ever sent to a server. Use **Settings → Export** to back up your data as JSON, and **Import** to restore or move between devices.

---

## License

MIT
