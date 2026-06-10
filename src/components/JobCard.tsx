import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Icon } from './Icon'
import type { JobApplication } from '../db/types'
import { STAGE_META } from '../lib/stages'

interface Props {
  app:     JobApplication
  onEdit:  () => void
  overlay?: boolean
}

export function JobCard({ app, onEdit, overlay = false }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app.id,
    disabled: overlay,
  })

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined
  const meta  = STAGE_META[app.stage]
  const color = meta.color

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div
        className={`jcard${isDragging ? ' dragging' : ''}`}
        style={{ '--jc': `var(--c-${color})` } as React.CSSProperties}
        onClick={() => { if (!transform) onEdit() }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div
            className="tile"
            style={{ width: 34, height: 34, borderRadius: 10, '--tile-c': `var(--c-${color})` } as React.CSSProperties}
          >
            <Icon name={meta.icon} size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14.5, lineHeight: 1.2 }}>{app.company}</div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {app.role}
            </div>
          </div>
          <span className="faint" style={{ display: 'inline-flex', marginTop: 2 }}>
            <Icon name="drag" size={16} />
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 11 }}>
          <FitDots score={app.fitScore ?? 0} color={color} />
          {app.notes && <span className="faint" style={{ fontSize: 11 }}>note</span>}
          {app.reframe && (
            <span style={{ fontSize: 11, color: `var(--c-${color})`, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon name="reframe" size={13} /> reframed
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function FitDots({ score, color }: { score: number; color: string }) {
  return (
    <div className="fit-dots" title={`Fit ${score}/5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className={`fit-dot${i <= score ? ' on' : ''}`}
          style={{ '--jc': `var(--c-${color})` } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
