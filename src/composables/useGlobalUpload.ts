import { reactive, readonly } from 'vue'

export type UploadStatus = 'pending' | 'uploading' | 'completed' | 'failed'

export interface UploadItem {
  id: string
  fileName: string
  size: number
  type: string
  progress: number // 0-100
  status: UploadStatus
  error?: string
}

const state = reactive<{ queue: UploadItem[] }>({ queue: [] })

export function useGlobalUpload() {
  function add(item: Omit<UploadItem, 'progress' | 'status'> & Partial<UploadItem>) {
    const next: UploadItem = {
      progress: 0,
      status: 'pending',
      ...item,
    } as UploadItem
    state.queue.push(next)
    return next.id
  }
  function update(id: string, patch: Partial<UploadItem>) {
    const it = state.queue.find((q) => q.id === id)
    if (it) Object.assign(it, patch)
  }
  function remove(id: string) {
    const i = state.queue.findIndex((q) => q.id === id)
    if (i >= 0) state.queue.splice(i, 1)
  }
  function clearCompleted() {
    state.queue = state.queue.filter((q) => q.status !== 'completed')
  }
  function clearQueue() {
    state.queue.splice(0, state.queue.length)
  }
  return {
    queue: readonly(state.queue),
    add,
    update,
    remove,
    clearCompleted,
    clearQueue,
  }
}
