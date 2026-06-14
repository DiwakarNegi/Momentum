import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export type { Session } from '@supabase/supabase-js'

export async function pushToCloud(data: object): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { error } = await supabase.from('user_data').upsert(
    { user_id: user.id, data, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' },
  )
  if (error) console.error('Cloud sync failed:', error.message)
}

export async function pullFromCloud(): Promise<Record<string, unknown> | null> {
  const { data, error } = await supabase.from('user_data').select('data').maybeSingle()
  if (error) { console.error('Cloud pull failed:', error.message); return null }
  return (data?.data as Record<string, unknown>) ?? null
}
