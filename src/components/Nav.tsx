import { Icon } from './Icon'

export type Tab = 'home' | 'habits' | 'jobs' | 'reflect' | 'focus' | 'settings'

interface Props {
  active: Tab
  onChange: (tab: Tab) => void
}

const NAV = [
  { id: 'home'    as Tab, label: 'Home',    icon: 'home' },
  { id: 'habits'  as Tab, label: 'Garden',  icon: 'garden' },
  { id: 'jobs'    as Tab, label: 'Jobs',    icon: 'jobs' },
  { id: 'reflect' as Tab, label: 'Reflect', icon: 'reflect' },
  { id: 'focus'   as Tab, label: 'Focus',   icon: 'focus' },
]

export function Nav({ active, onChange }: Props) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" style={{ overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 72 72" fill="none" style={{ position: 'absolute' }}>
            <path d="M0 44 C9 44 10 30 18 30 C26 30 27 40 36 37 C45 34 46 24 54 22 C62 20 64 28 72 26 L72 72 L0 72 Z" fill="currentColor" opacity="0.25" />
            <path d="M0 44 C9 44 10 30 18 30 C26 30 27 40 36 37 C45 34 46 24 54 22 C62 20 64 28 72 26" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <circle cx="55" cy="22" r="7" fill="currentColor" />
          </svg>
        </div>
        <span className="brand-name">Momentum</span>
      </div>
      <nav className="nav-group" aria-label="Main">
        {NAV.map(n => (
          <button
            key={n.id}
            className={`nav-item${active === n.id ? ' active' : ''}`}
            onClick={() => onChange(n.id)}
            aria-current={active === n.id ? 'page' : undefined}
          >
            <Icon name={n.icon} size={20} />
            <span className="nav-label">{n.label}</span>
          </button>
        ))}
      </nav>
      <div className="nav-foot">
        <button
          className={`nav-item${active === 'settings' ? ' active' : ''}`}
          onClick={() => onChange('settings')}
          aria-current={active === 'settings' ? 'page' : undefined}
        >
          <Icon name="sliders" size={20} />
          <span className="nav-label">Settings</span>
        </button>
      </div>
    </aside>
  )
}
