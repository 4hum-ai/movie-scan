import { ref, computed, readonly } from 'vue'
import { useResourceService, useToast } from '@/composables'
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
 * Status display configurations
 */
export const STATUS_CONFIG = {
  pending: {
    title: 'Scan Requested',
    description: 'Your video has been queued for AI analysis.',
    icon: 'clock',
    color: 'gray',
    text: 'Pending',
    class: 'bg-yellow-100 text-yellow-800',
  },
  processing: {
    title: 'Processing Your Video...',
    description: 'AI is analyzing your video content. This may take a few minutes.',
    icon: 'refresh',
    color: 'blue',
    text: 'Processing',
    class: 'bg-blue-100 text-blue-800',
  },
  completed: {
    title: 'Analysis Complete!',
    description: 'Your video analysis is complete. View the detailed report below.',
    icon: 'check',
    color: 'green',
    text: 'Completed',
    class: 'bg-green-100 text-green-800',
  },
  failed: {
    title: 'Processing Failed',
    description: 'An error occurred during processing.',
    icon: 'warning',
    color: 'red',
    text: 'Failed',
    class: 'bg-red-100 text-red-800',
  },
} as const

/**
 * Get status configuration by status
 */
export function getStatusConfig(status: ReportStatus) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.pending
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
   * @param options - Search and filter options
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
   * await reports.fetchReports({
   *   filters: { status: 'completed' }
   * });
   * ```
   */
  const fetchReports = async (options?: { search?: string; filters?: GenericObject }) => {
    try {
      loading.value = true
      error.value = null
      const params: GenericObject = {
        page: currentPage.value,
        limit: 20,
      }
      if (options?.search) params.search = options.search
      if (options?.filters) Object.assign(params, options.filters)

      const raw = await list('reports', params)
      const result: PaginatedResponse<ReportItem> = transformPaginatedResponse<ReportItem>(raw)
      reports.value = result.data
      totalPages.value = result.pagination.totalPages
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Failed to fetch reports'
      error.value = message
      push({
        id: `${Date.now()}-reports-fetch` as string,
        type: 'error',
        title: 'Failed to load reports',
        body: message,
        position: 'tr',
        timeout: 6000,
      })
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
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Failed to fetch report'
      error.value = message
      push({
        id: `${Date.now()}-report-fetch` as string,
        type: 'error',
        title: 'Failed to load report',
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
   * Create a new report
   * @param params - Report creation parameters
   * @returns Created report item
   */
  const createReport = async (params: { ratingSystemId: string }): Promise<ReportItem> => {
    try {
      loading.value = true
      error.value = null
      const result = await create('reports', params)

      push({
        id: `${Date.now()}-report-create` as string,
        type: 'success',
        title: 'Report created',
        body: 'Successfully created report',
        position: 'tr',
        timeout: 4000,
      })

      return result as ReportItem
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Failed to create report'
      error.value = message
      push({
        id: `${Date.now()}-report-create` as string,
        type: 'error',
        title: 'Failed to create report',
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
  ): Promise<ReportItem> => {
    try {
      loading.value = true
      error.value = null
      const result = await update('reports', id, params)

      push({
        id: `${Date.now()}-report-update` as string,
        type: 'success',
        title: 'Report status updated',
        body: 'Successfully updated report status',
        position: 'tr',
        timeout: 4000,
      })

      return result as ReportItem
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Failed to update report status'
      error.value = message
      push({
        id: `${Date.now()}-report-update` as string,
        type: 'error',
        title: 'Failed to update report status',
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
   * Delete a report
   * @param id - Report ID
   */
  const deleteReport = async (id: string): Promise<void> => {
    try {
      loading.value = true
      error.value = null
      await remove('reports', id)

      push({
        id: `${Date.now()}-report-delete` as string,
        type: 'success',
        title: 'Report deleted',
        body: 'Successfully deleted report',
        position: 'tr',
        timeout: 4000,
      })

      // Refresh the list
      await fetchReports()
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Failed to delete report'
      error.value = message
      push({
        id: `${Date.now()}-report-delete` as string,
        type: 'error',
        title: 'Failed to delete report',
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
   * Get all reports (no pagination)
   * @returns Array of all reports
   */
  const getAllReports = async (): Promise<ReportItem[]> => {
    try {
      await fetchReports()
      return reports.value
    } catch (err: unknown) {
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
      await fetchReports({ search: query })
      return reports.value
    } catch (err: unknown) {
      console.error('Failed to search reports:', err)
      return []
    }
  }

  const nextPage = async () => {
    if (isLastPage.value) return
    currentPage.value += 1
    await fetchReports()
  }

  const previousPage = async () => {
    if (isFirstPage.value) return
    currentPage.value -= 1
    await fetchReports()
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
    nextPage,
    previousPage,
  }
}
