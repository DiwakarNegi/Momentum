import { useDroppable } from '@dnd-kit/core'
import { Icon } from './Icon'
import type { JobApplication, JobStage } from '../db/types'
import { STAGE_META } from '../lib/stages'
import { JobCard } from './JobCard'

interface Props {
  stage:  JobStage
  apps:   JobApplication[]
  onEdit: (app: JobApplication) => void
}

export function KanbanColumn({ stage, apps, onEdit }: Props) {
  const meta = STAGE_META[stage]

  const { setNodeRef, isOver } = useDroppable({
    id:   `col-${stage}`,
    data: { stage },
  })

  return (
    <div
      ref={setNodeRef}
      className={`col${isOver ? ' drag-over' : ''}`}
      style={{ '--col-c': `var(--c-${meta.color})` } as React.CSSProperties}
    >
      <div className="col-head">
        <span className="col-dot" style={{ background: `var(--c-${meta.color})` }} />
        <span style={{ fontWeight: 600, fontSize: 13.5, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          <span style={{ color: `var(--c-${meta.color})`, display: 'inline-flex' }}>
            <Icon name={meta.icon} size={16} />
          </span>
          {meta.label}
        </span>
        <span className="col-count">{apps.length}</span>
      </div>

      {apps.map(app => (
        <JobCard key={app.id} app={app} onEdit={() => onEdit(app)} />
      ))}

      {apps.length === 0 && (
        <div
          className="faint"
          style={{ fontSize: 12, textAlign: 'center', padding: '14px 6px', border: '1px dashed var(--border)', borderRadius: 12 }}
        >
          {stage === 'saved' ? 'Drop a role here to start' : 'Nothing here yet'}
        </div>
      )}
    </div>
  )
}
