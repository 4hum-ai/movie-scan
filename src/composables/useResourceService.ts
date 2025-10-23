import { useApiGateway } from '@/utils/useApiGateway'
import { useEventBus } from '@vueuse/core'
import { EVENT_CRUD, type CrudEventPayload } from '@/types/events'
import type { ResourceQuery } from '@/types/query'
import { ref, computed, type Ref, type ComputedRef } from 'vue'

export interface PaginatedResult<T> {
  /** Array of items returned from the API */
  data: T[]
  /** Pagination metadata */
  pagination: {
    /** Current page number */
    page: number
    /** Number of items per page */
    limit: number
    /** Total number of items available */
    total: number
    /** Total number of pages */
    totalPages: number
  }
}

export class ConnectionError extends Error {
  constructor(
    message: string,
    public originalError?: Error,
  ) {
    super(message)
    this.name = 'ConnectionError'
  }
}

/**
 * Workflow transition request body
 * Matches the StateMachineContext interface from movie-service
 */
export interface WorkflowTransitionBody {
  /** User ID who initiated the transition */
  userId?: string
  /** Human-readable reason for the transition */
  reason?: string
  /** Workflow context and processing information */
  metadata?: Record<string, unknown>
  /** Fields to update in the record during the transition */
  data?: Record<string, unknown>
}

/**
 * Supported resource types for the API
 * Extend this type as new resources are added
 */
export type ResourceType = 'titles' | 'organizations' | string // Allow custom resources

/**
 * Resource service interface providing CRUD operations with reactive state management
 */
export interface ResourceService<T = unknown> {
  /** Fetch a paginated list of items */
  list: (
    resource: ResourceType,
    query?: ResourceQuery,
    signal?: AbortSignal,
  ) => Promise<PaginatedResult<T>>
  /** Fetch a single item by ID */
  getById: (resource: ResourceType, id: string, signal?: AbortSignal) => Promise<T>
  /** Create a new item */
  create: (resource: ResourceType, body: unknown, signal?: AbortSignal) => Promise<T>
  /** Update an existing item */
  update: (resource: ResourceType, id: string, body: unknown, signal?: AbortSignal) => Promise<T>
  /** Delete an item */
  remove: (resource: ResourceType, id: string, signal?: AbortSignal) => Promise<void>
  /** Execute a workflow transition on an item */
  workflow: (
    resource: ResourceType,
    id: string,
    statusField: string,
    event: string,
    body?: WorkflowTransitionBody,
    signal?: AbortSignal,
  ) => Promise<T>

  /** Reactive boolean indicating if any operation is currently loading */
  isLoading: Ref<boolean>
  /** Check if a specific operation is loading */
  isOperationLoading: (operation: string) => boolean

  /** Reactive array of items from list operations */
  items: Ref<T[]>
  /** Reactive single item from getById operations */
  item: Ref<T | null>
  /** Reactive pagination information */
  pagination: Ref<{
    page: number
    limit: number
    total: number
    totalPages: number
  }>
  /** Reactive error message */
  error: Ref<string | null>

  /** Computed boolean indicating if there are items */
  hasItems: ComputedRef<boolean>
  /** Computed boolean indicating if no items and not loading */
  isEmpty: ComputedRef<boolean>
  /** Computed boolean indicating if there's an error */
  hasError: ComputedRef<boolean>

  /** Clear the current error */
  clearError: () => void
  /** Reset all data to initial state */
  clearData: () => void
}

/**
 * Creates a resource service instance with CRUD operations, loading states, and reactive data management
 *
 * @param base - API base path, defaults to "movie/api"
 * @returns Resource service instance with methods and reactive data
 *
 * @example
 * ```typescript
 * // Basic usage
 * const api = useResourceService();
 * await api.list("titles", { page: 1, limit: 20 });
 *
 * // With custom base path
 * const api = useResourceService("custom/api");
 *
 * // Type-safe usage
 * interface Title { id: string; title: string; }
 * const api = useResourceService<Title>();
 * ```
 */
export function useResourceService(base: string = 'movie/api') {
  const client = useApiGateway(base)
  const crudBus = useEventBus<CrudEventPayload>(EVENT_CRUD)

  // Loading state management
  const loadingStates = ref<Record<string, boolean>>({})

  /**
   * Computed property indicating if any operation is currently loading
   */
  const isLoading = computed(() => Object.values(loadingStates.value).some(Boolean))

  /**
   * Set loading state for a specific operation
   * @param operation - Operation identifier (e.g., "list:titles", "create:titles")
   * @param loading - Whether the operation is loading
   */
  const setLoading = (operation: string, loading: boolean) => {
    if (loading) {
      loadingStates.value[operation] = true
    } else {
      delete loadingStates.value[operation]
    }
  }

  /**
   * Check if a specific operation is currently loading
   * @param operation - Operation identifier
   * @returns True if the operation is loading
   *
   * @example
   * ```typescript
   * const isSearching = api.isOperationLoading("list:titles");
   * const isCreating = api.isOperationLoading("create:titles");
   * const isUpdating = api.isOperationLoading("update:titles:123");
   * ```
   */
  const isOperationLoading = (operation: string) => loadingStates.value[operation] || false

  // Reactive data management
  const items = ref<unknown[]>([])
  const item = ref<unknown>(null)
  const pagination = ref<{
    page: number
    limit: number
    total: number
    totalPages: number
  }>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const error = ref<string | null>(null)

  // Computed helpers
  /**
   * Computed boolean indicating if there are items in the list
   */
  const hasItems = computed(() => items.value.length > 0)

  /**
   * Computed boolean indicating if there are no items and not currently loading
   */
  const isEmpty = computed(() => !isLoading.value && items.value.length === 0)

  /**
   * Computed boolean indicating if there's an error
   */
  const hasError = computed(() => error.value !== null)

  /**
   * Internal request method with error handling and connection error detection
   * @param endpoint - API endpoint path
   * @param options - Fetch options
   * @returns Parsed JSON response
   * @throws {ConnectionError} When network connectivity issues occur
   * @throws {Error} When API returns an error response
   */
  const request = async <T>(
    endpoint: string,
    options: RequestInit & { signal?: AbortSignal } = {},
  ): Promise<T> => {
    try {
      const res = await client.request(endpoint, options)
      if (!res.ok) {
        let message = `HTTP error! status: ${res.status}`
        const contentType = res.headers.get('content-type') || ''
        if (/application\/json/.test(contentType)) {
          try {
            const err: unknown = await res.json()
            if (err && typeof err === 'object') {
              message =
                (err as { message?: string }).message ||
                (err as { error?: string }).error ||
                message
            }
          } catch {
            /* ignore */
          }
        } else {
          const text = await res.text().catch(() => '')
          if (text?.startsWith('<!doctype') || text?.startsWith('<!DOCTYPE')) {
            message =
              'Received HTML from server. Check VITE_PUBLIC_API_URL; the dev server likely returned index.html for a bad URL.'
          }
        }
        throw new Error(message)
      }
      const contentType = res.headers.get('content-type') || ''
      if (!/application\/json/.test(contentType)) {
        const text = await res.text().catch(() => '')
        throw new Error(
          'Server returned non-JSON response. Verify API base URL and endpoint. Sample: ' +
            text.slice(0, 120),
        )
      }
      return await res.json()
    } catch (error: unknown) {
      if (
        (error as Error)?.name === 'AbortError' ||
        /Failed to fetch|NetworkError/.test(String(error))
      ) {
        throw new ConnectionError(
          'Unable to reach API. Check connectivity and URL.',
          error as Error,
        )
      }
      throw error
    }
  }

  const list = async <T = Record<string, unknown>>(
    resource: string,
    query?: Record<string, unknown>,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<T>> => {
    const operation = `list:${resource}`
    setLoading(operation, true)
    error.value = null
    try {
      const toSearchParams = (input: ResourceQuery): URLSearchParams => {
        const search = new URLSearchParams()
        const append = (key: string, value: unknown) => {
          if (value === undefined || value === null) return
          if (value instanceof Date) {
            search.append(key, value.toISOString())
          } else if (Array.isArray(value)) {
            search.append(key, value.map((v) => String(v)).join(','))
          } else {
            search.append(key, String(value))
          }
        }
        const build = (prefix: string, value: unknown) => {
          if (value === undefined || value === null) return
          if (value instanceof Date || typeof value !== 'object' || Array.isArray(value)) {
            append(prefix, value)
            return
          }
          Object.entries(value).forEach(([k, v]) => build(`${prefix}[${k}]`, v))
        }
        Object.entries(input).forEach(([k, v]) => build(k, v))
        return search
      }
      const search = query ? toSearchParams(query) : new URLSearchParams()
      const q = search.toString()
      const path = q ? `/${resource}?${q}` : `/${resource}`
      const payload = (await request<unknown>(path, { signal })) as Record<string, unknown>
      const pg = (payload?.pagination as Record<string, unknown>) ?? {}
      const page = Number(pg.page ?? (payload as Record<string, unknown>).page ?? 1) || 1
      const limit = Number(pg.limit ?? (payload as Record<string, unknown>).limit ?? 20) || 20
      const total = Number(pg.total ?? (payload as Record<string, unknown>).total ?? 0) || 0
      const totalPages =
        Number(
          pg.totalPages ??
            (payload as Record<string, unknown>).totalPages ??
            Math.ceil(total / (limit || 1)),
        ) || Math.max(1, Math.ceil(total / (limit || 1)))

      const result: PaginatedResult<T> = {
        data: ((payload.data as unknown[]) || []) as T[],
        pagination: { page, limit, total, totalPages },
      }

      // Update reactive data
      items.value = result.data
      pagination.value = result.pagination

      return result
    } catch (err: unknown) {
      error.value = (err as Error)?.message || 'Failed to load data'
      throw err
    } finally {
      setLoading(operation, false)
    }
  }

  /**
   * Fetch a single item by its ID
   *
   * @param resource - Resource type (e.g., "titles", "organizations")
   * @param id - Item ID to fetch
   * @param signal - Optional AbortSignal for request cancellation
   * @returns Promise resolving to the item
   *
   * @example
   * ```typescript
   * const title = await api.getById("titles", "123");
   * console.log(title.title); // "Movie Title"
   * ```
   */
  const getById = async (
    resource: ResourceType,
    id: string,
    signal?: AbortSignal,
  ): Promise<unknown> => {
    const operation = `get:${resource}:${id}`
    setLoading(operation, true)
    error.value = null
    try {
      const payload = (await request<unknown>(`/${resource}/${id}`, { signal })) as Record<
        string,
        unknown
      >
      const result = (payload?.data as unknown) ?? payload

      // Update reactive data
      item.value = result

      return result
    } catch (err: unknown) {
      error.value = (err as Error)?.message || 'Failed to load item'
      throw err
    } finally {
      setLoading(operation, false)
    }
  }

  /**
   * Create a new item
   *
   * @param resource - Resource type (e.g., "titles", "organizations")
   * @param body - Item data to create
   * @param signal - Optional AbortSignal for request cancellation
   * @returns Promise resolving to the created item
   *
   * @example
   * ```typescript
   * const newTitle = await api.create("titles", {
   *   title: "New Movie",
   *   description: "A great movie",
   *   year: 2024
   * });
   * // items.value is automatically updated with the new item
   * ```
   */
  const create = async (
    resource: ResourceType,
    body: unknown,
    signal?: AbortSignal,
  ): Promise<unknown> => {
    const operation = `create:${resource}`
    setLoading(operation, true)
    error.value = null
    try {
      const payload = (await request<unknown>(`/${resource}`, {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
        signal,
      })) as Record<string, unknown>
      const result = payload.data as unknown

      // Update reactive data - add to items list
      items.value.unshift(result)
      pagination.value.total += 1

      try {
        const rid = String(
          (result as Record<string, unknown>)?.id ?? (result as Record<string, unknown>)?._id ?? '',
        )
        crudBus.emit({
          resource,
          id: rid,
          action: 'create',
          afterData: result,
          at: Date.now(),
        })
      } catch {
        /* ignore */
      }
      return result
    } catch (err: unknown) {
      error.value = (err as Error)?.message || 'Failed to create item'
      throw err
    } finally {
      setLoading(operation, false)
    }
  }

  /**
   * Update an existing item
   *
   * @param resource - Resource type (e.g., "titles", "organizations")
   * @param id - Item ID to update
   * @param body - Updated item data
   * @param signal - Optional AbortSignal for request cancellation
   * @returns Promise resolving to the updated item
   *
   * @example
   * ```typescript
   * const updatedTitle = await api.update("titles", "123", {
   *   title: "Updated Title"
   * });
   * // Both item.value and items.value are automatically updated
   * ```
   */
  const update = async (
    resource: ResourceType,
    id: string,
    body: unknown,
    signal?: AbortSignal,
  ): Promise<unknown> => {
    const operation = `update:${resource}:${id}`
    setLoading(operation, true)
    error.value = null
    try {
      let beforeData: unknown = null
      try {
        beforeData = await getById(resource, id, signal)
      } catch {
        /* ignore */
      }
      const payload = (await request<unknown>(`/${resource}/${id}`, {
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
        signal,
      })) as Record<string, unknown>
      const result = payload.data as unknown

      // Update reactive data
      {
        const current = item.value as Record<string, unknown> | null
        if (current && (current.id === id || current._id === id)) {
          item.value = result
        }
      }

      // Update in items list if present
      const itemIndex = items.value.findIndex((i: unknown) => {
        const rec = i as Record<string, unknown>
        return rec?.id === id || rec?._id === id
      })
      if (itemIndex !== -1) {
        items.value[itemIndex] = result
      }

      try {
        crudBus.emit({
          resource,
          id: String(id),
          action: 'update',
          beforeData,
          afterData: result,
          at: Date.now(),
        })
      } catch {
        /* ignore */
      }
      return result
    } catch (err: unknown) {
      error.value = (err as Error)?.message || 'Failed to update item'
      throw err
    } finally {
      setLoading(operation, false)
    }
  }

  /**
   * Delete an item
   *
   * @param resource - Resource type (e.g., "titles", "organizations")
   * @param id - Item ID to delete
   * @param signal - Optional AbortSignal for request cancellation
   * @returns Promise that resolves when deletion is complete
   *
   * @example
   * ```typescript
   * await api.remove("titles", "123");
   * // Item is automatically removed from items.value
   * ```
   */
  const remove = async (
    resource: ResourceType,
    id: string,
    signal?: AbortSignal,
  ): Promise<void> => {
    const operation = `delete:${resource}:${id}`
    setLoading(operation, true)
    error.value = null
    try {
      let beforeData: unknown = null
      try {
        beforeData = await getById(resource, id, signal)
      } catch {
        /* ignore */
      }
      await request<void>(`/${resource}/${id}`, {
        method: 'DELETE',
        signal,
      })

      // Update reactive data
      {
        const current = item.value as Record<string, unknown> | null
        if (current && (current.id === id || current._id === id)) {
          item.value = null
        }
      }

      // Remove from items list
      const itemIndex = items.value.findIndex(
        (i: unknown) =>
          (i as { id?: unknown; _id?: unknown }).id === id || (i as { _id?: unknown })._id === id,
      )
      if (itemIndex !== -1) {
        items.value.splice(itemIndex, 1)
        pagination.value.total = Math.max(0, pagination.value.total - 1)
      }

      try {
        crudBus.emit({
          resource,
          id: String(id),
          action: 'delete',
          beforeData,
          at: Date.now(),
        })
      } catch {
        /* ignore */
      }
    } catch (err: unknown) {
      error.value = (err as Error)?.message || 'Failed to delete item'
      throw err
    } finally {
      setLoading(operation, false)
    }
  }

  /**
   * Execute a workflow transition on an item
   *
   * @param resource - Resource type (e.g., "titles", "organizations", "media")
   * @param id - Item ID to transition
   * @param statusField - Field that tracks the status (e.g., "status")
   * @param event - Workflow event to trigger (e.g., "process", "complete", "fail")
   * @param body - Optional workflow transition data
   * @param signal - Optional AbortSignal for request cancellation
   * @returns Promise resolving to the updated item
   *
   * @example
   * ```typescript
   * // Simple workflow transition
   * await api.workflow("media", "123", "status", "process");
   *
   * // Workflow transition with data updates
   * await api.workflow("media", "123", "status", "complete", {
   *   userId: "user-123",
   *   reason: "Processing completed successfully",
   *   metadata: { workflowId: "transcode-123" },
   *   data: { processingCompletedAt: new Date().toISOString() }
   * });
   * ```
   */
  const workflow = async (
    resource: ResourceType,
    id: string,
    statusField: string,
    event: string,
    body?: WorkflowTransitionBody,
    signal?: AbortSignal,
  ): Promise<unknown> => {
    const operation = `workflow:${resource}:${id}:${statusField}:${event}`
    setLoading(operation, true)
    error.value = null
    try {
      let beforeData: unknown = null
      try {
        beforeData = await getById(resource, id, signal)
      } catch {
        /* ignore */
      }

      const payload = (await request<unknown>(
        `/${resource}/${id}/workflow/${statusField}/${event}`,
        {
          method: 'POST',
          body: body ? JSON.stringify(body) : undefined,
          signal,
        },
      )) as Record<string, unknown>
      const result = payload.data as unknown

      // Update reactive data
      {
        const current = item.value as Record<string, unknown> | null
        if (current && (current.id === id || current._id === id)) {
          item.value = result
        }
      }

      // Update in items list if present
      const itemIndex = items.value.findIndex((i: unknown) => {
        const rec = i as Record<string, unknown>
        return rec?.id === id || rec?._id === id
      })
      if (itemIndex !== -1) {
        items.value[itemIndex] = result
      }

      try {
        crudBus.emit({
          resource,
          id: String(id),
          action: 'workflow',
          beforeData,
          afterData: result,
          at: Date.now(),
        })
      } catch {
        /* ignore */
      }
      return result
    } catch (err: unknown) {
      error.value = (err as Error)?.message || 'Failed to execute workflow transition'
      throw err
    } finally {
      setLoading(operation, false)
    }
  }

  /**
   * Clear the current error state
   *
   * @example
   * ```typescript
   * api.clearError();
   * ```
   */
  const clearError = () => {
    error.value = null
  }

  /**
   * Reset all data to initial state
   * Useful when component unmounts or when you want to clear all data
   *
   * @example
   * ```typescript
   * import { onUnmounted } from 'vue';
   *
   * onUnmounted(() => {
   *   api.clearData();
   * });
   * ```
   */
  const clearData = () => {
    items.value = []
    item.value = null
    pagination.value = {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    }
    error.value = null
  }

  return {
    list,
    getById,
    create,
    update,
    remove,
    workflow,

    // Loading state utilities
    isLoading,
    isOperationLoading,

    // Reactive data
    items,
    item,
    pagination,
    error,

    // Computed helpers
    hasItems,
    isEmpty,
    hasError,

    // Utility methods
    clearError,
    clearData,
  }
}
