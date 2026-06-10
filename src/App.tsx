import { useState, useEffect } from 'react'
import { seedIfEmpty } from './db/seed'
import { Nav, type Tab } from './components/Nav'
import { DashboardPage } from './pages/DashboardPage'
import { HabitsPage } from './pages/HabitsPage'
import { JobsPage } from './pages/JobsPage'
import { ReflectPage } from './pages/ReflectPage'
import { FocusPage }   from './pages/FocusPage'
import { SettingsPage } from './pages/SettingsPage'
import { ErrorBoundary } from './components/ErrorBoundary'
import { usePalette } from './lib/usePalette'

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const palette = usePalette()

  useEffect(() => {
    seedIfEmpty().catch(console.error)
  }, [])

  return (
    <ErrorBoundary>
      <div className="app">
        <Nav active={tab} onChange={setTab} />
        <main className="main">
          {tab === 'home'     && <DashboardPage onNavigate={setTab} />}
          {tab === 'habits'   && <HabitsPage />}
          {tab === 'jobs'     && <JobsPage />}
          {tab === 'reflect'  && <ReflectPage />}
          {tab === 'focus'    && <FocusPage />}
          {tab === 'settings' && <SettingsPage palette={palette} />}
        </main>
      </div>
    </ErrorBoundary>
  )
}
