import type { JobStage } from '../db/types'

export const STAGES: JobStage[] = [
  'saved', 'applied', 'screen', 'interview', 'offer', 'rejected',
]

export const STAGE_META: Record<JobStage, { label: string; color: string; icon: string }> = {
  saved:     { label: 'Saved',     color: 'sky',      icon: 'saved' },
  applied:   { label: 'Applied',   color: 'amber',    icon: 'applied' },
  screen:    { label: 'Screen',    color: 'lavender', icon: 'screen' },
  interview: { label: 'Interview', color: 'coral',    icon: 'interview' },
  offer:     { label: 'Offer',     color: 'sage',     icon: 'offer' },
  rejected:  { label: 'Rejected',  color: 'rose',     icon: 'rejected' },
}

export const HABIT_COLORS = [
  { id: 'sage',     label: 'Sage' },
  { id: 'coral',    label: 'Coral' },
  { id: 'lavender', label: 'Lavender' },
  { id: 'amber',    label: 'Amber' },
  { id: 'sky',      label: 'Sky' },
  { id: 'rose',     label: 'Rose' },
]

export const HABIT_ICON_NAMES = [
  'walk', 'code', 'book', 'water', 'sun', 'leaf',
  'lift', 'pen', 'meditate', 'moon', 'heart', 'music', 'coffee', 'spark',
]
