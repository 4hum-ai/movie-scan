import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { computeDateRange } from '@/utils/date'
import type { UiConfig } from '@/types/ui-config'
import type { FieldFilter } from '@/types/query'

type OperatorObject = {
  $between?: unknown
  $gte?: unknown
  $lte?: unknown
}

export interface QueryState {
  page: number
  limit: number
  search?: string
  searchField?: string
  sort?: string
  filters?: Record<string, FieldFilter>
}

export function useQueryBuilder(options: {
  resource: () => string
  uiConfig: () => UiConfig | null | undefined
  defaultLimit?: number
}) {
  const route = useRoute()
  const router = useRouter()

  const limit = ref<number>(options.defaultLimit || 20)
  const timeWindow = ref<{ preset?: string; from?: string; to?: string }>({})

  const dateField = computed(() => options.uiConfig()?.views?.calendar?.dateField || 'createdAt')

  const queryState = computed<QueryState>(() => {
    const q = route.query
    const page = Number(q.page || 1) || 1
    const limitFromQuery = Number(q.limit || limit.value) || limit.value
    const search = (q.search as string) || undefined
    const searchField = (q.searchFields as string) || (q.searchField as string) || undefined
    const sort = (q.sort as string) || undefined
    const params: QueryState = { page, limit: limitFromQuery }
    if (search) params.search = search
    if (searchField) params.searchField = searchField
    if (sort) params.sort = sort // Parse generic filters from URL query (filters[<field>] and filters[<field>][$op])

    // Parse generic filters from URL query (filters[<field>] and filters[<field>][$op])
    const parsedFilters: Record<string, FieldFilter> = {}
    Object.keys(q).forEach(key => {
      if (!key.startsWith('filters[')) return // patterns: filters[field] or filters[field][$op]
      const match = key.match(/^filters\[(.+?)\](?:\[(\$\w+)\])?$/)
      if (!match) return
      const field = match[1]
      const op = match[2]
      const raw = q[key]
      if (!field) return
      if (op) {
        parsedFilters[field] = (parsedFilters[field] || {}) as unknown as FieldFilter
        const value = String(raw)
        if (op === '$between') {
          const [a, b] = value
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
          if (a && b) (parsedFilters[field] as unknown as OperatorObject)['$between'] = [a, b]
        } else if (op === '$gte' || op === '$lte') {
          ;(parsedFilters[field] as unknown as OperatorObject)[op] = value
        }
      } else {
        // direct equality
        parsedFilters[field] = String(raw)
      }
    })
    if (Object.keys(parsedFilters).length > 0) {
      params.filters = { ...(params.filters || {}), ...parsedFilters }
    } // Merge time window into filters for the configured dateField

    const range = computeDateRange(
      timeWindow.value.preset,
      timeWindow.value.from,
      timeWindow.value.to
    )
    if (range && (range.from || range.to)) {
      params.filters = params.filters || {}
      if (range.from && range.to)
        params.filters[dateField.value] = { $between: [range.from, range.to] }
      else if (range.from) params.filters[dateField.value] = { $gte: range.from }
      else if (range.to) params.filters[dateField.value] = { $lte: range.to }
    }
    return params
  }) // Note: chips are a presentation detail; compute them in views instead

  function setLimit(next: number) {
    // Update local state and sync URL so it is shareable and triggers reloads
    limit.value = next
    try {
      const nextQuery: Record<string, string> = {
        ...route.query,
        limit: String(next),
        page: '1',
      }
      router.replace({ query: nextQuery as unknown as import('vue-router').LocationQueryRaw })
    } catch {
      void 0
    }
  }

  function setTimeWindow(payload: { preset?: string; from?: string; to?: string }) {
    timeWindow.value = { ...payload }
    try {
      const nextQuery: Record<string, string> = { ...(route.query as Record<string, string>) }
      delete nextQuery.preset
      delete nextQuery.from
      delete nextQuery.to
      const keysToRemove: string[] = []
      const betweenKey = `filters[${dateField.value}][$between]`
      const gteKey = `filters[${dateField.value}][$gte]`
      const lteKey = `filters[${dateField.value}][$lte]`
      for (const k of Object.keys(nextQuery)) {
        if (k === betweenKey || k === gteKey || k === lteKey) keysToRemove.push(k)
      }
      for (const k of keysToRemove) delete nextQuery[k]
      const range = computeDateRange(payload.preset, payload.from, payload.to)
      if (range?.from && range?.to) nextQuery[betweenKey] = `${range.from},${range.to}`
      else if (range?.from) nextQuery[gteKey] = range.from
      else if (range?.to) nextQuery[lteKey] = range.to
      nextQuery.page = '1'
      router.replace({ query: nextQuery as unknown as import('vue-router').LocationQueryRaw })
    } catch {
      void 0
    }
  }

  function applyFilters(payload: {
    preset?: string
    from?: string
    to?: string
    filters?: Record<string, unknown>
  }) {
    try {
      const nextQuery: Record<string, string> = { ...(route.query as Record<string, string>) }
      // Remove any existing time window keys for the active dateField
      const betweenKey = `filters[${dateField.value}][$between]`
      const gteKey = `filters[${dateField.value}][$gte]`
      const lteKey = `filters[${dateField.value}][$lte]`
      delete nextQuery.preset
      delete nextQuery.from
      delete nextQuery.to
      for (const k of [betweenKey, gteKey, lteKey]) delete nextQuery[k] // Remove existing defaultFilters for this resource from URL

      const cfg = options.uiConfig()
      const fields = (cfg?.views?.list?.defaultFilters || []).map(
        (f: unknown) => (f as { field?: string }).field
      )
      for (const k of Object.keys(nextQuery)) {
        const m = k.match(/^filters\[(.+?)\]/)
        if (m && fields.includes(m[1])) delete nextQuery[k]
      } // Add provided field filters

      const nextFilters = payload?.filters || {}
      for (const [field, value] of Object.entries(nextFilters)) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          if (
            '$between' in value &&
            Array.isArray((value as Record<string, unknown>)['$between'])
          ) {
            const arr = (value as Record<string, unknown>)['$between'] as unknown[]
            const asString = arr.map(v => String(v)).join(',')
            nextQuery[`filters[${field}][$between]`] = asString
          }
          if ('$gte' in value)
            nextQuery[`filters[${field}][$gte]`] = String(
              (value as Record<string, unknown>)['$gte']
            )
          if ('$lte' in value)
            nextQuery[`filters[${field}][$lte]`] = String(
              (value as Record<string, unknown>)['$lte']
            )
        } else if (value !== undefined && value !== null && value !== '') {
          nextQuery[`filters[${field}]`] = String(value)
        }
      } // Add computed time window keys

      const range = computeDateRange(payload?.preset, payload?.from, payload?.to)
      if (range?.from && range?.to) nextQuery[betweenKey] = `${range.from},${range.to}`
      else if (range?.from) nextQuery[gteKey] = range.from
      else if (range?.to) nextQuery[lteKey] = range.to // Reset page

      nextQuery.page = '1'
      router.replace({ query: nextQuery as unknown as import('vue-router').LocationQueryRaw })
    } catch {
      void 0
    }
  }

  function setFilters(nextFilters: Record<string, unknown>) {
    try {
      const nextQuery: Record<string, string> = { ...(route.query as Record<string, string>) }
      // Remove existing defaultFilters for this resource from URL
      const cfg = options.uiConfig()
      const fields = (cfg?.views?.list?.defaultFilters || []).map(
        (f: unknown) => (f as { field?: string }).field
      )
      for (const k of Object.keys(nextQuery)) {
        const m = k.match(/^filters\[(.+?)\]/)
        if (m && fields.includes(m[1])) delete nextQuery[k]
      } // Add new filters
      for (const [field, value] of Object.entries(nextFilters || {})) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          if (
            '$between' in value &&
            Array.isArray((value as Record<string, unknown>)['$between'])
          ) {
            const arr = (value as Record<string, unknown>)['$between'] as unknown[]
            const asString = arr.map(v => String(v)).join(',')
            nextQuery[`filters[${field}][$between]`] = asString
          }
          if ('$gte' in value)
            nextQuery[`filters[${field}][$gte]`] = String(
              (value as Record<string, unknown>)['$gte']
            )
          if ('$lte' in value)
            nextQuery[`filters[${field}][$lte]`] = String(
              (value as Record<string, unknown>)['$lte']
            )
        } else if (value !== undefined && value !== null && value !== '') {
          nextQuery[`filters[${field}]`] = String(value)
        }
      }
      nextQuery.page = '1'
      router.replace({ query: nextQuery as unknown as import('vue-router').LocationQueryRaw })
    } catch {
      void 0
    }
  }

  function clearFilter(key: string) {
    const nextQuery: Record<string, string> = { ...(route.query as Record<string, string>) }
    delete nextQuery[key]
    if (key === 'search') {
      delete nextQuery.searchField
      delete nextQuery.searchFields
    }
    const betweenKey = `filters[${dateField.value}][$between]`
    const gteKey = `filters[${dateField.value}][$gte]`
    const lteKey = `filters[${dateField.value}][$lte]`
    if (key === betweenKey || key === gteKey || key === lteKey) {
      delete nextQuery[betweenKey]
      delete nextQuery[gteKey]
      delete nextQuery[lteKey]
      timeWindow.value = {}
    }
    nextQuery.page = '1'
    router.replace({ query: nextQuery as unknown as import('vue-router').LocationQueryRaw })
  }

  function clearAllFilters() {
    const nextQuery: Record<string, string> = { ...(route.query as Record<string, string>) }
    delete nextQuery.search
    delete nextQuery.searchField
    delete nextQuery.searchFields // Remove all filters[*] keys
    for (const k of Object.keys(nextQuery)) {
      if (k.startsWith('filters[')) delete nextQuery[k]
    }
    timeWindow.value = {}
    nextQuery.page = '1'
    router.replace({ query: nextQuery as unknown as import('vue-router').LocationQueryRaw })
  }

  function setSort(field: string, direction: string) {
    try {
      const q: Record<string, string> = {
        ...(route.query as Record<string, string>),
        sort: `${field}:${direction}`,
        page: '1',
      }
      router.replace({ query: q as unknown as import('vue-router').LocationQueryRaw })
    } catch {
      void 0
    }
  }

  function setPage(page: number) {
    try {
      const q: Record<string, string> = {
        ...(route.query as Record<string, string>),
        page: String(page),
      }
      router.replace({ query: q as unknown as import('vue-router').LocationQueryRaw })
    } catch {
      void 0
    }
  }

  const canonicalQueryString = computed(() => {
    const q = route.query
    const sort = String(q.sort || '')
    const search = String(q.search || '')
    const searchField = String(q.searchField || q.searchFields || '')
    const page = String(q.page || '1')
    const limitStr = String(q.limit || String(limit.value)) // Include all filters[*] params to trigger reloads when filters change
    const filterEntries = Object.keys(q)
      .filter(k => k.startsWith('filters['))
      .sort()
      .reduce<Record<string, string>>((acc, k) => {
        acc[k] = String(q[k])
        return acc
      }, {})
    const mod = String(options.resource())
    return JSON.stringify({
      mod,
      sort,
      search,
      searchField,
      page,
      limit: limitStr,
      filters: filterEntries,
    })
  })

  function initTimeWindowFromUrl() {
    try {
      const q = route.query
      const betweenKey = `filters[${dateField.value}][$between]`
      const gteKey = `filters[${dateField.value}][$gte]`
      const lteKey = `filters[${dateField.value}][$lte]`
      let from: string | undefined
      let to: string | undefined
      if (q[betweenKey]) {
        const val = String(q[betweenKey])
        const [a, b] = val.split(',').map(s => s.trim())
        from = a || undefined
        to = b || undefined
      } else {
        if (q[gteKey]) from = String(q[gteKey])
        if (q[lteKey]) to = String(q[lteKey])
      }
      timeWindow.value = { preset: 'custom', from, to }
    } catch {
      void 0
    }
  }

  watch(
    () => options.uiConfig(),
    cfg => {
      const pageSize = cfg?.views?.list?.pageSize
      if (pageSize && typeof pageSize === 'number') limit.value = pageSize
    },
    { immediate: true }
  )

  return {
    // state
    limit,
    timeWindow,
    dateField,
    queryState,
    canonicalQueryString, // actions
    setLimit,
    setTimeWindow,
    applyFilters,
    setFilters,
    clearFilter,
    clearAllFilters,
    setSort,
    setPage,
    initTimeWindowFromUrl,
  }
}
