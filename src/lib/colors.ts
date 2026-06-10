export const HABIT_COLORS = [
  { id: 'habit-sage',     label: 'Sage',     hex: '#8aa98f' },
  { id: 'habit-coral',    label: 'Coral',    hex: '#e89a8c' },
  { id: 'habit-lavender', label: 'Lavender', hex: '#b3a5d6' },
  { id: 'habit-amber',    label: 'Amber',    hex: '#e6b667' },
  { id: 'habit-sky',      label: 'Sky',      hex: '#8fb6da' },
  { id: 'habit-rose',     label: 'Rose',     hex: '#e0a7b9' },
] as const

export type HabitColorId = typeof HABIT_COLORS[number]['id']
