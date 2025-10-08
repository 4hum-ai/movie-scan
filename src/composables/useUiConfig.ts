import { reactive, readonly, computed } from 'vue'
import { useApiGateway } from '@/utils/useApiGateway'
import type { UiConfig } from '@/types/ui-config'

export interface GetUiConfigOptions {
  force?: boolean
  signal?: AbortSignal
}

type UiConfigState = {
  configs: Record<string, UiConfig>
  initialized: boolean
  loading: boolean
  error: string | null
}

const state = reactive<UiConfigState>({
  configs: {},
  initialized: false,
  loading: false,
  error: null,
})

const LOCAL_STORAGE_KEY = 'admin-ui:configs'

const configFromLocal = (() => {
  const env: Record<string, unknown> = (import.meta as { env?: Record<string, unknown> }).env || {}
  return (
    env?.VITE_ADMIN_UI_CONFIG_FROM_LOCAL === 'true' || env?.VITE_ADMIN_UI_CONFIG_FROM_LOCAL === true
  )
})()
const localPath = (() => {
  const env: Record<string, unknown> = (import.meta as { env?: Record<string, unknown> }).env || {}
  // Path to models index file served from public. Default to /ui-configs/index.json
  return (env?.VITE_ADMIN_UI_CONFIG_LOCAL_PATH as string) || '/ui-configs/index.json'
})()

// Shared singleton cache across composable instances
export type AdminResourceInfo = {
  name: string
  displayName: string
  description?: string
  icon?: string
  path: string
}
let cachedResources: AdminResourceInfo[] | null = null
let modelsPromise: Promise<AdminResourceInfo[]> | null = null

export function useUiConfig() {
  const api = useApiGateway()

  const loadFromCache = () => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') {
        const incoming = parsed as Record<string, unknown>
        const normalized: Record<string, UiConfig> = {}
        let mutated = false
        for (const [mod, cfg] of Object.entries(incoming)) {
          const flat =
            cfg && typeof cfg === 'object' && 'config' in cfg
              ? (cfg as { config: unknown }).config
              : cfg
          if (flat !== cfg) mutated = true
          normalized[mod] = flat as UiConfig
        }
        state.configs = normalized
        if (mutated) saveToCache()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const saveToCache = () => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.configs))
    } catch {
      /* ignore */
    }
  }

  const clearCache = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
      state.configs = {}
      state.initialized = false
    } catch {
      /* ignore */
    }
  }

  const setConfig = (resourceName: string, cfg: UiConfig) => {
    state.configs[resourceName] = cfg
    saveToCache()
  }

  const getConfig = (resourceName: string): UiConfig | null => {
    return state.configs[resourceName] || null
  }
  const models = computed(() => Object.keys(state.configs))

  const fetchconfigFromLocal = async (
    resourceName: string,
    signal?: AbortSignal
  ): Promise<UiConfig | null> => {
    const res = await fetch(`/ui-configs/${resourceName}.json`, {
      cache: 'no-store',
      signal,
    })
    if (!res.ok) return null
    const contentType = res.headers.get('content-type') || ''
    if (!/application\/json/.test(contentType)) return null
    try {
      return (await res.json()) as UiConfig
    } catch {
      return null
    }
  }

  const listResources = async (
    opts: { force?: boolean; signal?: AbortSignal } = {}
  ): Promise<AdminResourceInfo[]> => {
    if (!opts.force && cachedResources) return cachedResources
    if (!opts.force && modelsPromise) return modelsPromise
    modelsPromise = (async () => {
      // Try local index first
      try {
        const res = await fetch(localPath, {
          cache: 'no-store',
          signal: opts.signal,
        })
        if (res.ok) {
          const contentType = res.headers.get('content-type') || ''
          if (!/application\/json/.test(contentType)) {
            return cachedResources ?? []
          }
          const json: unknown = await res.json().catch(() => null)
          const models = Array.isArray((json as { models?: unknown })?.models)
            ? ((json as { models: AdminResourceInfo[] }).models ?? [])
            : []
          if (models.length > 0) {
            cachedResources = models
            return cachedResources
          }
        }
      } catch {
        /* ignore */
      }
      if (configFromLocal) {
        // local-only mode: do not hit backend
        return cachedResources ?? []
      }
      // Fallback to backend
      try {
        const res = await api.request(`/api/admin-ui/models`, {
          method: 'GET',
          signal: opts.signal,
        })
        if (!res.ok) return cachedResources ?? []
        const contentType = res.headers.get('content-type') || ''
        if (!/application\/json/.test(contentType)) return cachedResources ?? []
        const payload: unknown = await res.json().catch(() => null)
        const models = Array.isArray((payload as { models?: unknown })?.models)
          ? ((payload as { models: AdminResourceInfo[] }).models ?? [])
          : []
        cachedResources = models
        return cachedResources
      } catch {
        return cachedResources ?? []
      }
    })()
    const result = await modelsPromise
    modelsPromise = null
    return result
  }

  const get = async (
    resourceName: string,
    opts: GetUiConfigOptions = {}
  ): Promise<UiConfig | null> => {
    if (!opts.force) {
      const cached = getConfig(resourceName)
      if (cached) return cached
    }

    // Try local JSON next
    const localCfg = await fetchconfigFromLocal(resourceName, opts.signal)
    if (localCfg) {
      setConfig(resourceName, localCfg)
      return localCfg
    }

    // Fallback to backend
    try {
      const res = await api.request(`/static/ui-configs/${resourceName}.json`, {
        method: 'GET',
        signal: opts.signal,
      })
      if (!res.ok) return null
      const contentType = res.headers.get('content-type') || ''
      if (!/application\/json/.test(contentType)) return null
      const payload = await res.json().catch(() => null)
      const cfg = (payload as { config?: unknown })?.config ?? payload
      if (cfg) setConfig(resourceName, cfg)
      return cfg ?? null
    } catch {
      return null
    }
  }

  const init = async (opts: { force?: boolean } = {}) => {
    if (state.initialized && !opts.force) return
    state.loading = true
    state.error = null
    try {
      if (!opts.force) {
        loadFromCache()
        if (Object.keys(state.configs).length > 0) {
          state.initialized = true
          return
        }
      }
      // Load resource list via unified helper
      let resourceNames: string[] = []
      const moduleInfos = await listResources({ force: true })
      resourceNames = moduleInfos.map(m => m.name)

      // Load each module's UI config based on env preference
      for (const name of resourceNames) {
        if (!name) continue
        if (configFromLocal) {
          const cfg = await fetchconfigFromLocal(name)
          if (cfg) {
            setConfig(name, cfg)
            continue
          }
        }
        try {
          const res = await api.request(`/static/ui-configs/${name}.json`, { method: 'GET' })
          if (res.ok) {
            const contentType = res.headers.get('content-type') || ''
            if (/application\/json/.test(contentType)) {
              const payload = await res.json().catch(() => null)
              const remoteCfg = (payload as { config?: unknown })?.config ?? payload
              if (remoteCfg) setConfig(name, remoteCfg as UiConfig)
            }
          }
        } catch {
          /* ignore single resource failure */
        }
      }
      state.initialized = true
    } catch (e: unknown) {
      state.error = (e as Error)?.message || 'Failed to initialize UI configs'
    } finally {
      state.loading = false
    }
  }

  // Get list of available resource types (entityTypes) for relationships
  const resourceTypes = computed(() => {
    return Object.keys(state.configs).map(name => ({
      value: name,
      label: state.configs[name]?.displayName || name,
    }))
  })

  return { get, models, init, listResources, clearCache, resourceTypes, state: readonly(state) }
}
