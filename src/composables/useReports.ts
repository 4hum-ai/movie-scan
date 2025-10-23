import { ref, computed, readonly } from 'vue'
import { useResourceService, useToast } from '@/composables'
import type { MediaItem, RatingSystemItem } from '@/composables'
import type { GenericObject, PaginatedResponse } from '@/types/common'

export interface VideoAnalysis {
  [key: string]: number | undefined
}

export interface AudioAnalysis {
  [key: string]: number | undefined
}

export interface AnalysisResults {
  video: VideoAnalysis
  audio: AudioAnalysis
}

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low'

export type ReportStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface ReportScene {
  /** Confidence level (0-1 range) */
  confidence: number
  /** Human-readable summary of the scene */
  summary: string
  /** Start time as timestamp number (milliseconds) */
  startTime: number
  /** End time as timestamp number (milliseconds) */
  endTime: number
  /** Guideline identifier */
  guideline: string
  /** Severity level */
  severity: SeverityLevel
  /** Screenshot timestamp numbers (milliseconds) */
  screenshots: Array<number>
  /** Analysis results */
  analysis: AnalysisResults
}

export interface ReportRating {
  /** Suggested rating */
  suggested: string
  /** Analysis text */
  analysis: string
}

export interface ReportItem {
  /** Unique identifier */
  id: string
  /** Rating system ID */
  ratingSystemId: string
  /** Report status */
  status: ReportStatus
  /** Rating information */
  rating: ReportRating
  /** Detected scenes */
  scenes: ReportScene[]
  /** Creation timestamp */
  createdAt: string
  /** Last update timestamp */
  updatedAt: string
}

/**
 * Extended report interface with enriched media and rating system data
 * Combines report data with related media and rating system information
 */
export interface EnrichedReport extends ReportItem {
  mediaData?: MediaItem
  ratingSystemData?: RatingSystemItem
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

export function useReports() {
  const { list, create, update, getById, remove } = useResourceService()
  const { push } = useToast()

  const reports = ref<ReportItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(0)

  /**
   * Computed boolean indicating if there are reports
   */
  const hasReports = computed(() => reports.value.length > 0)

  /**
   * Computed boolean indicating if on the first page
   */
  const isFirstPage = computed(() => currentPage.value <= 1)

  /**
   * Computed boolean indicating if on the last page
   */
  const isLastPage = computed(() => currentPage.value >= totalPages.value)

  /**
   * Fetch reports with optional search and filtering
   * @param filters - Filter parameters
   * @param page - Page number
   * @param limit - Items per page
   *
   * @example
   * ```typescript
   * // Fetch all reports
   * await reports.fetchReports();
   *
   * // Search for specific reports
   * await reports.fetchReports({ search: 'pending' });
   *
   * // Filter by status
   * await reports.fetchReports({ status: 'completed' });
   * ```
   */
  const fetchReports = async (
    filters: {
      search?: string
      status?: ReportStatus
      ratingSystemId?: string
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
      if (filters.status) queryParams.append('status', filters.status)
      if (filters.ratingSystemId) queryParams.append('ratingSystemId', filters.ratingSystemId)

      // Add pagination
      queryParams.append('page', page.toString())
      queryParams.append('limit', limit.toString())

      const response = await list('reports', Object.fromEntries(queryParams))

      const transformedResponse = transformPaginatedResponse<ReportItem>(response)

      reports.value = transformedResponse.data
      currentPage.value = transformedResponse.pagination.page
      totalPages.value = transformedResponse.pagination.totalPages

      return transformedResponse
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch reports'
      push({
        id: `${Date.now()}-reports-fetch` as string,
        type: 'error',
        title: 'Failed to load reports',
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
   * Fetch a single report by ID
   * @param id - Report ID
   * @returns Report item or null if not found
   */
  const fetchReportById = async (id: string): Promise<ReportItem | null> => {
    try {
      loading.value = true
      error.value = null
      const result = await getById('reports', id)
      return result as ReportItem
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch report'
      push({
        id: `${Date.now()}-report-fetch` as string,
        type: 'error',
        title: 'Failed to load report',
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
   * Create a new report
   * @param params - Report creation parameters
   * @returns Created report item
   */
  const createReport = async (params: { ratingSystemId: string }): Promise<ReportItem | null> => {
    try {
      loading.value = true
      error.value = null
      const result = await create('reports', params)

      if (result) {
        reports.value.unshift(result as ReportItem)

        push({
          id: `${Date.now()}-report-create` as string,
          type: 'success',
          title: 'Report created',
          body: 'Successfully created report',
          position: 'tr',
          timeout: 4000,
        })
      }

      return result as ReportItem
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create report'
      push({
        id: `${Date.now()}-report-create` as string,
        type: 'error',
        title: 'Failed to create report',
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
   * Update an existing report status
   * @param id - Report ID
   * @param params - Update parameters
   * @returns Updated report item
   */
  const updateReportStatus = async (
    id: string,
    params: {
      status: Exclude<ReportStatus, 'pending'>
      data?: GenericObject // For completed status
    },
  ): Promise<ReportItem | null> => {
    try {
      loading.value = true
      error.value = null
      const result = await update('reports', id, params)

      if (result) {
        const index = reports.value.findIndex((report) => report.id === id)
        if (index !== -1) {
          reports.value[index] = result as ReportItem
        }

        push({
          id: `${Date.now()}-report-update` as string,
          type: 'success',
          title: 'Report status updated',
          body: 'Successfully updated report status',
          position: 'tr',
          timeout: 4000,
        })
      }

      return result as ReportItem
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update report status'
      push({
        id: `${Date.now()}-report-update` as string,
        type: 'error',
        title: 'Failed to update report status',
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
   * Delete a report
   * @param id - Report ID
   */
  const deleteReport = async (id: string): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null
      await remove('reports', id)

      // Remove from local state
      const index = reports.value.findIndex((report) => report.id === id)
      if (index !== -1) {
        reports.value.splice(index, 1)
      }

      push({
        id: `${Date.now()}-report-delete` as string,
        type: 'success',
        title: 'Report deleted',
        body: 'Successfully deleted report',
        position: 'tr',
        timeout: 4000,
      })

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete report'
      push({
        id: `${Date.now()}-report-delete` as string,
        type: 'error',
        title: 'Failed to delete report',
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
   * Get all reports (no pagination)
   * @returns Array of all reports
   */
  const getAllReports = async (): Promise<ReportItem[]> => {
    try {
      const response = await fetchReports({}, 1, 1000) // Large limit to get all
      return response.data
    } catch (err) {
      console.error('Failed to fetch reports:', err)
      return []
    }
  }

  /**
   * Search reports by status or content
   * @param query - Search query
   * @returns Array of matching reports
   */
  const searchReports = async (query: string): Promise<ReportItem[]> => {
    try {
      const response = await fetchReports({ search: query }, 1, 1000)
      return response.data
    } catch (err) {
      console.error('Failed to search reports:', err)
      return []
    }
  }

  /**
   * Advanced search with multiple filters
   * @param filters - Advanced search filters
   * @returns Array of matching reports
   */
  const advancedSearchReports = async (filters: {
    search?: string
    status?: ReportStatus
    ratingSystemId?: string
    dateRange?: {
      start?: string
      end?: string
    }
  }): Promise<ReportItem[]> => {
    try {
      const response = await fetchReports(filters, 1, 1000)
      return response.data
    } catch (err) {
      console.error('Failed to perform advanced search:', err)
      return []
    }
  }

  const nextPage = async () => {
    if (isLastPage.value) return
    currentPage.value += 1
    await fetchReports({}, currentPage.value)
  }

  const previousPage = async () => {
    if (isFirstPage.value) return
    currentPage.value -= 1
    await fetchReports({}, currentPage.value)
  }

  return {
    reports: readonly(reports),
    loading: readonly(loading),
    error: readonly(error),
    currentPage: readonly(currentPage),
    totalPages: readonly(totalPages),
    hasReports,
    isFirstPage,
    isLastPage,
    fetchReports,
    fetchReportById,
    createReport,
    updateReportStatus,
    deleteReport,
    getAllReports,
    searchReports,
    advancedSearchReports,
    nextPage,
    previousPage,
  }
}
