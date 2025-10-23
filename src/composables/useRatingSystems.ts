import { ref, computed, readonly } from 'vue'
import { useResourceService, useToast } from '@/composables'
import type { PaginatedResponse } from '@/types/common'

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
  const r = response as {
    data?: T[]
    pagination?: { page?: number; limit?: number; total?: number; totalPages?: number }
  }
  return {
    data: r.data || [],
    pagination: {
      page: r.pagination?.page || 1,
      limit: r.pagination?.limit || 20,
      total: r.pagination?.total || 0,
      totalPages: r.pagination?.totalPages || 0,
    },
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
   * @param filters - Filter parameters
   * @param page - Page number
   * @param limit - Items per page
   *
   * @example
   * ```typescript
   * // Fetch all rating systems
   * await ratingSystems.fetchRatingSystems();
   *
   * // Search for specific rating systems
   * await ratingSystems.fetchRatingSystems({ search: 'MPAA' });
   *
   * // Filter by name
   * await ratingSystems.fetchRatingSystems({ name: 'MPAA' });
   * ```
   */
  const fetchRatingSystems = async (
    filters: {
      search?: string
      name?: string
    } = {},
    page: number = 1,
    limit: number = 20,
  ) => {
    try {
      loading.value = true
      error.value = null

      const queryParams = new URLSearchParams()

      // Add filters
      if (filters.search) queryParams.append('search', filters.search)
      if (filters.name) queryParams.append('name', filters.name)

      // Add pagination
      queryParams.append('page', page.toString())
      queryParams.append('limit', limit.toString())

      const response = await list('rating-systems', Object.fromEntries(queryParams))

      const transformedResponse = transformPaginatedResponse<RatingSystemItem>(response)

      ratingSystems.value = transformedResponse.data
      currentPage.value = transformedResponse.pagination.page
      totalPages.value = transformedResponse.pagination.totalPages

      return transformedResponse
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch rating systems'
      push({
        id: `${Date.now()}-rating-systems-fetch` as string,
        type: 'error',
        title: 'Failed to load rating systems',
        body: error.value,
        position: 'tr',
        timeout: 6000,
      })
      throw err
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
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch rating system'
      push({
        id: `${Date.now()}-rating-system-fetch` as string,
        type: 'error',
        title: 'Failed to load rating system',
        body: error.value,
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
  }): Promise<RatingSystemItem | null> => {
    try {
      loading.value = true
      error.value = null
      const payload = {
        ...params,
        references: params.references || [],
        guidelines: params.guidelines || [],
      }
      const result = await create('rating-systems', payload)

      if (result) {
        ratingSystems.value.unshift(result as RatingSystemItem)

        push({
          id: `${Date.now()}-rating-system-create` as string,
          type: 'success',
          title: 'Rating system created',
          body: `Successfully created rating system "${params.name}"`,
          position: 'tr',
          timeout: 4000,
        })
      }

      return result as RatingSystemItem
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create rating system'
      push({
        id: `${Date.now()}-rating-system-create` as string,
        type: 'error',
        title: 'Failed to create rating system',
        body: error.value,
        position: 'tr',
        timeout: 6000,
      })
      return null
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
  ): Promise<RatingSystemItem | null> => {
    try {
      loading.value = true
      error.value = null
      const result = await update('rating-systems', id, params)

      if (result) {
        const index = ratingSystems.value.findIndex((system) => system.id === id)
        if (index !== -1) {
          ratingSystems.value[index] = result as RatingSystemItem
        }

        push({
          id: `${Date.now()}-rating-system-update` as string,
          type: 'success',
          title: 'Rating system updated',
          body: `Successfully updated rating system`,
          position: 'tr',
          timeout: 4000,
        })
      }

      return result as RatingSystemItem
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update rating system'
      push({
        id: `${Date.now()}-rating-system-update` as string,
        type: 'error',
        title: 'Failed to update rating system',
        body: error.value,
        position: 'tr',
        timeout: 6000,
      })
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete a rating system
   * @param id - Rating system ID
   */
  const deleteRatingSystem = async (id: string): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null
      await remove('rating-systems', id)

      // Remove from local state
      const index = ratingSystems.value.findIndex((system) => system.id === id)
      if (index !== -1) {
        ratingSystems.value.splice(index, 1)
      }

      push({
        id: `${Date.now()}-rating-system-delete` as string,
        type: 'success',
        title: 'Rating system deleted',
        body: 'Successfully deleted rating system',
        position: 'tr',
        timeout: 4000,
      })

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete rating system'
      push({
        id: `${Date.now()}-rating-system-delete` as string,
        type: 'error',
        title: 'Failed to delete rating system',
        body: error.value,
        position: 'tr',
        timeout: 6000,
      })
      return false
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
      const response = await fetchRatingSystems({}, 1, 1000) // Large limit to get all
      return response.data
    } catch (err) {
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
      const response = await fetchRatingSystems({ search: query }, 1, 1000)
      return response.data
    } catch (err) {
      console.error('Failed to search rating systems:', err)
      return []
    }
  }

  /**
   * Advanced search with multiple filters
   * @param filters - Advanced search filters
   * @returns Array of matching rating systems
   */
  const advancedSearchRatingSystems = async (filters: {
    search?: string
    name?: string
    hasLevels?: boolean
    hasGuidelines?: boolean
  }): Promise<RatingSystemItem[]> => {
    try {
      const response = await fetchRatingSystems(filters, 1, 1000)
      return response.data
    } catch (err) {
      console.error('Failed to perform advanced search:', err)
      return []
    }
  }

  const nextPage = async () => {
    if (isLastPage.value) return
    currentPage.value += 1
    await fetchRatingSystems({}, currentPage.value)
  }

  const previousPage = async () => {
    if (isFirstPage.value) return
    currentPage.value -= 1
    await fetchRatingSystems({}, currentPage.value)
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
    advancedSearchRatingSystems,
    nextPage,
    previousPage,
  }
}
