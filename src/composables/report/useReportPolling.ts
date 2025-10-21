import { ref, computed, onUnmounted } from 'vue'
import { ReportStatus, useReports, ReportItem } from '@/composables'

export interface PollingStatus {
  isPolling: boolean
  currentStatus: ReportStatus
  error: string | null
  retryCount: number
  lastChecked: Date | null
}

export function useReportPolling() {
  const { fetchReportById } = useReports()

  const pollingStatus = ref<PollingStatus>({
    isPolling: false,
    currentStatus: 'pending',
    error: null,
    retryCount: 0,
    lastChecked: null,
  })

  const currentReport = ref<ReportItem | null>(null)
  const pollingInterval = ref<number | null>(null)
  const maxRetries = 10
  const baseDelay = 2000 // 2 seconds
  const maxDelay = 30000 // 30 seconds

  const isCompleted = computed(() => pollingStatus.value.currentStatus === 'completed')

  const isFailed = computed(() => pollingStatus.value.currentStatus === 'failed')

  const isProcessing = computed(() => pollingStatus.value.currentStatus === 'processing')

  const estimatedTimeRemaining = computed(() => {
    if (!isProcessing.value || !currentReport.value) return null

    // Default estimation: 5-10 minutes for processing
    // TODO: Get actual video duration from media service when available
    return 5 // Default 5 minutes
  })

  const startPolling = async (reportId: string) => {
    if (pollingStatus.value.isPolling) {
      console.warn('Polling already in progress')
      return
    }

    pollingStatus.value = {
      isPolling: true,
      currentStatus: 'pending',
      error: null,
      retryCount: 0,
      lastChecked: null,
    }

    // Initial fetch
    await pollReport(reportId)
  }

  const stopPolling = () => {
    if (pollingInterval.value) {
      clearTimeout(pollingInterval.value)
      pollingInterval.value = null
    }

    pollingStatus.value.isPolling = false
  }

  const pollReport = async (reportId: string) => {
    try {
      pollingStatus.value.lastChecked = new Date()

      const report = await fetchReportById(reportId)

      if (!report) {
        throw new Error('Report not found')
      }

      currentReport.value = report
      pollingStatus.value.currentStatus = report.status
      pollingStatus.value.error = null

      // Check if we should continue polling
      if (report.status === 'completed' || report.status === 'failed') {
        stopPolling()
        return
      }

      // Continue polling with exponential backoff
      if (pollingStatus.value.retryCount < maxRetries) {
        const delay = Math.min(baseDelay * Math.pow(2, pollingStatus.value.retryCount), maxDelay)

        pollingInterval.value = setTimeout(() => {
          pollingStatus.value.retryCount++
          pollReport(reportId)
        }, delay)
      } else {
        // Max retries reached
        pollingStatus.value.error = 'Maximum retry attempts reached'
        pollingStatus.value.currentStatus = 'failed'
        stopPolling()
      }
    } catch (error) {
      console.error('Polling error:', error)
      pollingStatus.value.error = error instanceof Error ? error.message : 'Unknown error'

      // Retry on error with exponential backoff
      if (pollingStatus.value.retryCount < maxRetries) {
        const delay = Math.min(baseDelay * Math.pow(2, pollingStatus.value.retryCount), maxDelay)

        pollingInterval.value = setTimeout(() => {
          pollingStatus.value.retryCount++
          pollReport(reportId)
        }, delay)
      } else {
        pollingStatus.value.currentStatus = 'failed'
        stopPolling()
      }
    }
  }

  const resetPolling = () => {
    stopPolling()
    pollingStatus.value = {
      isPolling: false,
      currentStatus: 'pending',
      error: null,
      retryCount: 0,
      lastChecked: null,
    }
    currentReport.value = null
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stopPolling()
  })

  return {
    pollingStatus: computed(() => pollingStatus.value),
    currentReport: computed(() => currentReport.value),
    isCompleted,
    isFailed,
    isProcessing,
    estimatedTimeRemaining,
    startPolling,
    stopPolling,
    resetPolling,
  }
}
