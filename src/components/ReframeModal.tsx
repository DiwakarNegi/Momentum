// §2 rule 5: CBT reframing is opt-in. This modal appears after a card moves
// to Rejected. Skip is always one click. Never framed as failure.

import { useState } from 'react'
import { Icon } from './Icon'
import { updateJobApplication } from '../db/operations'

interface Props {
  appId:   string
  company: string
  role:    string
  onClose: () => void
}

export function ReframeModal({ appId, company, role, onClose }: Props) {
  const [text,   setText]   = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!text.trim()) { onClose(); return }
    setSaving(true)
    await updateJobApplication(appId, { reframe: text.trim() })
    setSaving(false)
    onClose()
  }

  return (
    <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" style={{ maxWidth: 420 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div
              className="tile"
              style={{ width: 38, height: 38, '--tile-c': 'var(--c-lavender)' } as React.CSSProperties}
            >
              <Icon name="reframe" size={20} />
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="close" size={17} />
          </button>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Moved on from {company}</h2>
        <p className="muted" style={{ fontSize: 13.5, marginBottom: 20 }}>
          {role} · Want to capture a quick thought? Totally optional — skip anytime.
        </p>

        <div className="eyebrow" style={{ marginBottom: 9 }}>
          What did you learn, or what's one thing still in your control?
        </div>
        <textarea
          className="field"
          style={{ width: '100%', boxSizing: 'border-box', minHeight: 88, resize: 'vertical' }}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="e.g. I got a phone screen, which means my resume is working…"
          maxLength={300}
          autoFocus
        />

        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          {/* Skip is equally prominent — never the wrong choice */}
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>
            Skip
          </button>
          <button className="btn btn-accent" style={{ flex: 1 }} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save thought'}
          </button>
        </div>
      </div>
    </div>
  )
}
