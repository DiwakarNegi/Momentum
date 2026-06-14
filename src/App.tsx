import { useState, useEffect } from 'react'
import { seedIfEmpty } from './db/seed'
import { clearAllData, importAllData } from './db/operations'
import { Nav, type Tab } from './components/Nav'
import { DashboardPage } from './pages/DashboardPage'
import { HabitsPage } from './pages/HabitsPage'
import { JobsPage } from './pages/JobsPage'
import { ReflectPage } from './pages/ReflectPage'
import { FocusPage } from './pages/FocusPage'
import { SettingsPage } from './pages/SettingsPage'
import { LoginPage } from './pages/LoginPage'
import { ErrorBoundary } from './components/ErrorBoundary'
import { usePalette } from './lib/usePalette'
import { supabase, pullFromCloud, type Session } from './lib/supabase'

export default function App() {
  const [session, setSession] = useState<Session | null | 'loading'>('loading')
  const [synced,  setSynced]  = useState(false)
  const [tab,     setTab]     = useState<Tab>('home')
  const palette = usePalette()

  // ── Auth state ──────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  // ── On login: pull cloud data → import into Dexie → seed if brand new ───────
  useEffect(() => {
    if (!session || session === 'loading') { setSynced(false); return }
    ;(async () => {
      try {
        const cloudData = await pullFromCloud()
        if (cloudData) {
          await importAllData(JSON.stringify(cloudData))
        } else {
          await seedIfEmpty()
        }
      } catch (e) {
        console.error('Sync failed, seeding locally:', e)
        await seedIfEmpty()
      }
      setSynced(true)
    })()
  }, [session === 'loading' ? null : (session as Session | null)?.user?.id ?? null])  // eslint-disable-line

  // ── Sign out: wipe local Dexie so next login starts clean ───────────────────
  async function handleSignOut() {
    await supabase.auth.signOut()
    await clearAllData()
    setSynced(false)
  }

  // ── Loading splash ───────────────────────────────────────────────────────────
  if (session === 'loading' || (session && !synced)) {
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16, background: 'var(--bg)',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--accent)',
          boxShadow: '0 0 48px -8px var(--accent), 0 0 0 1px rgba(255,255,255,0.08)',
          animation: 'orbBreathe 3s ease-in-out infinite',
          overflow: 'hidden', position: 'relative',
        }}>
          <svg width="64" height="64" viewBox="0 0 72 72" fill="none" style={{ position: 'absolute', inset: 0 }}>
            <path d="M0 44 C9 44 10 30 18 30 C26 30 27 40 36 37 C45 34 46 24 54 22 C62 20 64 28 72 26 L72 72 L0 72 Z" fill="rgba(255,255,255,0.18)" />
            <path d="M0 44 C9 44 10 30 18 30 C26 30 27 40 36 37 C45 34 46 24 54 22 C62 20 64 28 72 26" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="55" cy="22" r="4" fill="white" opacity="0.9" />
          </svg>
        </div>
        <p className="muted" style={{ fontSize: 14 }}>
          {session && !synced ? 'Syncing your data…' : 'Loading…'}
        </p>
      </div>
    )
  }

  if (!session) return <LoginPage />

  return (
    <ErrorBoundary>
      <div className="app">
        <Nav active={tab} onChange={setTab} />
        <main className="main">
          {tab === 'home'     && <DashboardPage onNavigate={setTab} userName={(session as import('@supabase/supabase-js').Session).user.user_metadata?.full_name ?? ''} />}
          {tab === 'habits'   && <HabitsPage />}
          {tab === 'jobs'     && <JobsPage />}
          {tab === 'reflect'  && <ReflectPage />}
          {tab === 'focus'    && <FocusPage />}
          {tab === 'settings' && <SettingsPage palette={palette} onSignOut={handleSignOut} />}
        </main>
      </div>
    </ErrorBoundary>
  )
}
