import { ref } from 'vue'
import { useEventBus } from '@vueuse/core'
import {
  EVENT_CRUD,
  EVENT_ACTIVITIES_UPDATED,
  EVENT_VISITS_UPDATED,
  type CrudEventPayload,
  type CrudAction,
} from '@/types/events'
import { useToast } from './useToast'
import { useResourceService } from './useResourceService'

export type VisitEntry<T = unknown> = {
  resource: string
  id: string
  data: T
  lastVisited: number
  count: number
}

export type ActivityEntry<T = unknown> = {
  resource: string
  id: string
  action: CrudAction
  at: number
  beforeData?: T
  afterData?: T
}

const VISITS_KEY = 'md_admin_recent_visits'
const ACTIVITIES_KEY = 'md_admin_recent_activities'

const started = ref(false)
let offCrud: (() => void) | null = null

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return (parsed as T) ?? fallback
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

function getLimit(): number {
  const env: Record<string, unknown> = (import.meta as { env?: Record<string, unknown> }).env || {}
  const n = Number(env?.VITE_DASHBOARD_ACTIVITY_LIMIT)
  return Number.isFinite(n) && n > 0 ? n : 10
}

export function useActivity() {
  const crudBus = useEventBus<CrudEventPayload>(EVENT_CRUD)
  const visitsBus = useEventBus<null>(EVENT_VISITS_UPDATED)
  const activitiesBus = useEventBus<null>(EVENT_ACTIVITIES_UPDATED)
  const toast = useToast()
  const service = useResourceService()

  const start = () => {
    if (started.value) return
    started.value = true
    offCrud = crudBus.on((evt: CrudEventPayload) => {
      try {
        logActivityFromEvent(evt)
      } catch {
        /* ignore */
      }
    })
  }

  const stop = () => {
    if (offCrud) offCrud()
    offCrud = null
    started.value = false
  }

  const recordVisit = (entry: { resource: string; id: string; data: unknown }) => {
    const limit = getLimit()
    const list = readJson<VisitEntry[]>(VISITS_KEY, [])
    const idx = list.findIndex((v) => v.resource === entry.resource && v.id === String(entry.id))
    const now = Date.now()
    if (idx >= 0) {
      const cur = list[idx]
      list[idx] = {
        ...cur,
        data: entry.data ?? cur.data,
        count: (cur.count || 0) + 1,
        lastVisited: now,
      }
    } else {
      list.push({
        resource: entry.resource,
        id: String(entry.id),
        data: entry.data,
        lastVisited: now,
        count: 1,
      })
    }
    // Sort and cap
    list.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count
      return b.lastVisited - a.lastVisited
    })
    writeJson(VISITS_KEY, list.slice(0, limit))
    visitsBus.emit(null)
  }

  const getRecentVisits = (limit?: number): VisitEntry[] => {
    const list = readJson<VisitEntry[]>(VISITS_KEY, [])
    const cap = limit ?? getLimit()
    return list.slice(0, cap)
  }

  function logActivityFromEvent(evt: CrudEventPayload) {
    const limit = getLimit()
    const list = readJson<ActivityEntry[]>(ACTIVITIES_KEY, [])
    list.unshift({
      resource: evt.resource,
      id: String(evt.id),
      action: evt.action,
      at: evt.at,
      beforeData: evt.beforeData,
      afterData: evt.afterData,
    })
    // Cap
    writeJson(ACTIVITIES_KEY, list.slice(0, limit))
    activitiesBus.emit(null)
  }

  const getRecentActivities = (limit?: number): ActivityEntry[] => {
    const list = readJson<ActivityEntry[]>(ACTIVITIES_KEY, [])
    const cap = limit ?? getLimit()
    return list
      .slice()
      .sort((a, b) => b.at - a.at)
      .slice(0, cap)
  }

  const revert = async (entry: ActivityEntry) => {
    try {
      if (entry.action === 'create') {
        await service.remove(entry.resource, entry.id)
        toast.push({
          id: Math.random().toString(36).slice(2),
          type: 'success' as const,
          title: 'Reverted creation',
          position: 'tr',
          body: `${entry.resource} ${entry.id} deleted`,
        })
      } else if (entry.action === 'update') {
        if (entry.beforeData) {
          await service.update(entry.resource, entry.id, entry.beforeData)
        }
        toast.push({
          id: Math.random().toString(36).slice(2),
          type: 'success' as const,
          title: 'Reverted update',
          position: 'tr',
          body: `${entry.resource} ${entry.id} restored`,
        })
      } else if (entry.action === 'delete') {
        if (entry.beforeData) {
          await service.create(entry.resource, entry.beforeData)
        }
        toast.push({
          id: Math.random().toString(36).slice(2),
          type: 'success' as const,
          title: 'Reverted deletion',
          position: 'tr',
          body: `${entry.resource} ${entry.id} recreated`,
        })
      } else if (entry.action === 'workflow') {
        // Workflow actions cannot be reverted as they represent state transitions
        toast.push({
          id: Math.random().toString(36).slice(2),
          type: 'warning' as const,
          title: 'Cannot revert workflow',
          position: 'tr',
          body: 'Workflow transitions cannot be reverted',
        })
        return
      }
    } catch (e: unknown) {
      toast.push({
        id: Math.random().toString(36).slice(2),
        type: 'error' as const,
        title: 'Revert failed',
        position: 'tr',
        body: (e as Error)?.message || 'Operation failed',
      })
      throw e
    }
  }

  const clearAll = () => {
    try {
      localStorage.removeItem(VISITS_KEY)
      localStorage.removeItem(ACTIVITIES_KEY)
    } catch {
      /* ignore */
    }
    visitsBus.emit(null)
    activitiesBus.emit(null)
  }

  return {
    start,
    stop,
    recordVisit,
    getRecentVisits,
    getRecentActivities,
    revert,
    clearAll,
  }
}
