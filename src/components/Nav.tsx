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
        <div className="brand-mark"><Icon name="spark" size={20} /></div>
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
