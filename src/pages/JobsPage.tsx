import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { Icon } from '../components/Icon'
import { useJobApplications, useSettings } from '../db/hooks'
import { moveJobStage } from '../db/operations'
import type { JobApplication, JobStage } from '../db/types'
import { STAGES } from '../lib/stages'
import { KanbanColumn } from '../components/KanbanColumn'
import { JobCard }      from '../components/JobCard'
import { JobModal }     from '../components/JobModal'
import { ReframeModal } from '../components/ReframeModal'

interface PendingReframe { appId: string; company: string; role: string }

export function JobsPage() {
  const apps     = useJobApplications()
  const settings = useSettings()

  const [activeId,       setActiveId]       = useState<string | null>(null)
  const [editApp,        setEditApp]        = useState<JobApplication | 'new' | null>(null)
  const [pendingReframe, setPendingReframe] = useState<PendingReframe | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const activeApp = apps?.find(a => a.id === activeId) ?? null

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over) return
    const targetStage = over.data.current?.stage as JobStage | undefined
    if (!targetStage) return
    const app = apps?.find(a => a.id === active.id)
    if (!app || app.stage === targetStage) return
    await moveJobStage(String(active.id), targetStage)
    if (targetStage === 'rejected' && (settings?.showReframePrompt ?? true)) {
      setPendingReframe({ appId: app.id, company: app.company, role: app.role })
    }
  }

  if (!apps) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  const byStage = (stage: JobStage) => apps.filter(a => a.stage === stage)

  return (
    <div className="page page-wide fade-up">
      <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="h-greet" style={{ fontSize: 27 }}>The Funnel</h1>
          <p className="muted" style={{ margin: '6px 0 0', fontSize: 14.5 }}>
            Drag a card forward when something moves. Rejections are just a soft step sideways.
          </p>
        </div>
        <button className="btn btn-accent" onClick={() => setEditApp('new')}>
          <Icon name="plus" size={17} /> Save a role
        </button>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="board no-sb">
          {STAGES.map(stage => (
            <KanbanColumn
              key={stage}
              stage={stage}
              apps={byStage(stage)}
              onEdit={app => setEditApp(app)}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
          {activeApp && <JobCard app={activeApp} onEdit={() => {}} overlay />}
        </DragOverlay>
      </DndContext>

      {apps.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 24px' }}>
          <div style={{ fontSize: 42, marginBottom: 16 }}>💼</div>
          <h2 style={{ fontSize: 19, marginBottom: 8 }}>Start your funnel</h2>
          <p className="muted" style={{ fontSize: 14.5, maxWidth: 300, margin: '0 auto' }}>
            Add roles you're excited about. Drag them through the stages as things progress.
          </p>
        </div>
      )}

      {editApp !== null && (
        <JobModal app={editApp === 'new' ? null : editApp} onClose={() => setEditApp(null)} />
      )}
      {pendingReframe !== null && (
        <ReframeModal
          appId={pendingReframe.appId}
          company={pendingReframe.company}
          role={pendingReframe.role}
          onClose={() => setPendingReframe(null)}
        />
      )}
    </div>
  )
}
