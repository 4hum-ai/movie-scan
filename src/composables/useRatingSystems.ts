import { ref, computed, readonly } from 'vue'
import { useResourceService, useToast } from '@/composables'
import type { GenericObject, PaginatedResponse } from '@/types/common'

export interface RatingSystemReference {
  /** Reference title */
  title: string
  /** Reference source (optional) */
  source?: string
  /** Reference URL (optional) */
  url?: string
}

export interface RatingSystemLevel {
  /** Level key identifier */
  key: string
  /** Level title */
  title: string
  /** Level description */
  description: string
  /** Level guide/prompt */
  guide: string
}

export interface RatingSystemKeyword {
  /** Keyword key */
  key: string
  /** Keyword label */
  label: string
}

export interface RatingSystemGuideline {
  /** Guideline group */
  group: string
  /** Guideline name */
  name: string
  /** Guideline description */
  description: string
  /** Associated keywords */
  keywords: RatingSystemKeyword[]
}

export interface RatingSystemItem {
  /** Unique identifier */
  id: string
  /** Rating system name */
  name: string
  /** Reference information */
  references: RatingSystemReference[]
  /** Rating levels */
  levels: RatingSystemLevel[]
  /** Content guidelines */
  guidelines: RatingSystemGuideline[]
  /** Creation timestamp */
  createdAt?: string | Date
  /** Last update timestamp */
  updatedAt?: string | Date
}

/**
 * Transform raw API response to standardized paginated response format
 * @param response - Raw API response
 * @returns Standardized paginated response
 */
function transformPaginatedResponse<T>(response: unknown): PaginatedResponse<T> {
  const payload = (response as GenericObject) || {}
  const pg = (payload.pagination as GenericObject) || {}
  const page = Number(pg.page ?? payload.page ?? 1) || 1
  const limit = Number(pg.limit ?? payload.limit ?? 20) || 20
  const total = Number(pg.total ?? payload.total ?? 0) || 0
  const totalPages =
    Number(pg.totalPages ?? payload.totalPages ?? Math.ceil(total / (limit || 1))) ||
    Math.max(1, Math.ceil(total / (limit || 1)))

  return {
    data: ((payload.data as T[]) || []) as T[],
    pagination: { page, limit, total, totalPages },
  }
}

export function useRatingSystems() {
  const { list, create, update, getById, remove } = useResourceService()
  const { push } = useToast()

  const ratingSystems = ref<RatingSystemItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(0)

  /**
   * Computed boolean indicating if there are rating systems
   */
  const hasRatingSystems = computed(() => ratingSystems.value.length > 0)

  /**
   * Computed boolean indicating if on the first page
   */
  const isFirstPage = computed(() => currentPage.value <= 1)

  /**
   * Computed boolean indicating if on the last page
   */
  const isLastPage = computed(() => currentPage.value >= totalPages.value)

  /**
   * Fetch rating systems with optional search and filtering
   * @param options - Search and filter options
   *
   * @example
   * ```typescript
   * // Fetch all rating systems
   * await ratingSystems.fetchRatingSystems();
   *
   * // Search for specific rating systems
   * await ratingSystems.fetchRatingSystems({ search: 'MPAA' });
   *
   * // Filter by status
   * await ratingSystems.fetchRatingSystems({
   *   filters: { status: 'active' }
   * });
   * ```
   */
  const fetchRatingSystems = async (options?: { search?: string; filters?: GenericObject }) => {
    try {
      loading.value = true
      error.value = null
      const params: GenericObject = {
        page: currentPage.value,
        limit: 20,
      }
      if (options?.search) params.search = options.search
      if (options?.filters) Object.assign(params, options.filters)

      const raw = await list('rating-systems', params)
      const result: PaginatedResponse<RatingSystemItem> =
        transformPaginatedResponse<RatingSystemItem>(raw)
      ratingSystems.value = result.data
      totalPages.value = result.pagination.totalPages
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Failed to fetch rating systems'
      error.value = message
      push({
        id: `${Date.now()}-rating-systems-fetch` as string,
        type: 'error',
        title: 'Failed to load rating systems',
        body: message,
        position: 'tr',
        timeout: 6000,
      })
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch a single rating system by ID
   * @param id - Rating system ID
   * @returns Rating system item or null if not found
   */
  const fetchRatingSystemById = async (id: string): Promise<RatingSystemItem | null> => {
    try {
      loading.value = true
      error.value = null
      const result = await getById('rating-systems', id)
      return result as RatingSystemItem
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Failed to fetch rating system'
      error.value = message
      push({
        id: `${Date.now()}-rating-system-fetch` as string,
        type: 'error',
        title: 'Failed to load rating system',
        body: message,
        position: 'tr',
        timeout: 6000,
      })
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new rating system
   * @param params - Rating system creation parameters
   * @returns Created rating system item
   */
  const createRatingSystem = async (params: {
    name: string
    references?: RatingSystemReference[]
    levels: RatingSystemLevel[]
    guidelines?: RatingSystemGuideline[]
  }): Promise<RatingSystemItem> => {
    try {
      loading.value = true
      error.value = null
      const payload = {
        ...params,
        references: params.references || [],
        guidelines: params.guidelines || [],
      }
      const result = await create('rating-systems', payload)

      push({
        id: `${Date.now()}-rating-system-create` as string,
        type: 'success',
        title: 'Rating system created',
        body: `Successfully created rating system "${params.name}"`,
        position: 'tr',
        timeout: 4000,
      })

      return result as RatingSystemItem
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Failed to create rating system'
      error.value = message
      push({
        id: `${Date.now()}-rating-system-create` as string,
        type: 'error',
        title: 'Failed to create rating system',
        body: message,
        position: 'tr',
        timeout: 6000,
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update an existing rating system
   * @param id - Rating system ID
   * @param params - Update parameters
   * @returns Updated rating system item
   */
  const updateRatingSystem = async (
    id: string,
    params: Partial<{
      name: string
      references: RatingSystemReference[]
      levels: RatingSystemLevel[]
      guidelines: RatingSystemGuideline[]
    }>,
  ): Promise<RatingSystemItem> => {
    try {
      loading.value = true
      error.value = null
      const result = await update('rating-systems', id, params)

      push({
        id: `${Date.now()}-rating-system-update` as string,
        type: 'success',
        title: 'Rating system updated',
        body: `Successfully updated rating system`,
        position: 'tr',
        timeout: 4000,
      })

      return result as RatingSystemItem
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Failed to update rating system'
      error.value = message
      push({
        id: `${Date.now()}-rating-system-update` as string,
        type: 'error',
        title: 'Failed to update rating system',
        body: message,
        position: 'tr',
        timeout: 6000,
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete a rating system
   * @param id - Rating system ID
   */
  const deleteRatingSystem = async (id: string): Promise<void> => {
    try {
      loading.value = true
      error.value = null
      await remove('rating-systems', id)

      push({
        id: `${Date.now()}-rating-system-delete` as string,
        type: 'success',
        title: 'Rating system deleted',
        body: 'Successfully deleted rating system',
        position: 'tr',
        timeout: 4000,
      })

      // Refresh the list
      await fetchRatingSystems()
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Failed to delete rating system'
      error.value = message
      push({
        id: `${Date.now()}-rating-system-delete` as string,
        type: 'error',
        title: 'Failed to delete rating system',
        body: message,
        position: 'tr',
        timeout: 6000,
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Get all rating systems (since there's no status field in schema)
   * @returns Array of all rating systems
   */
  const getAllRatingSystems = async (): Promise<RatingSystemItem[]> => {
    try {
      await fetchRatingSystems()
      return ratingSystems.value
    } catch (err: unknown) {
      console.error('Failed to fetch rating systems:', err)
      return []
    }
  }

  /**
   * Search rating systems by name or content
   * @param query - Search query
   * @returns Array of matching rating systems
   */
  const searchRatingSystems = async (query: string): Promise<RatingSystemItem[]> => {
    try {
      await fetchRatingSystems({ search: query })
      return ratingSystems.value
    } catch (err: unknown) {
      console.error('Failed to search rating systems:', err)
      return []
    }
  }

  const nextPage = async () => {
    if (isLastPage.value) return
    currentPage.value += 1
    await fetchRatingSystems()
  }

  const previousPage = async () => {
    if (isFirstPage.value) return
    currentPage.value -= 1
    await fetchRatingSystems()
  }

  return {
    ratingSystems: readonly(ratingSystems),
    loading: readonly(loading),
    error: readonly(error),
    currentPage: readonly(currentPage),
    totalPages: readonly(totalPages),
    hasRatingSystems,
    isFirstPage,
    isLastPage,
    fetchRatingSystems,
    fetchRatingSystemById,
    createRatingSystem,
    updateRatingSystem,
    deleteRatingSystem,
    getAllRatingSystems,
    searchRatingSystems,
    nextPage,
    previousPage,
  }
}
