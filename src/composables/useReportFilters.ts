import { ref, computed, type Ref } from 'vue'
import { getDateRangeFilter } from '@/constants/reportFilters'
import type { ReportWithMedia } from './useReportData'

export function useReportFilters(reports: Ref<ReportWithMedia[]>) {
  // Filter state
  const searchQuery = ref('')
  const statusFilter = ref('')
  const ratingSystemFilter = ref('')
  const dateRangeFilter = ref('')

  // Computed filtered reports
  const filteredReports = computed(() => {
    let filtered = reports.value

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(
        (report) =>
          report.id.toLowerCase().includes(query) ||
          report.mediaData?.fileName.toLowerCase().includes(query),
      )
    }

    // Status filter
    if (statusFilter.value) {
      filtered = filtered.filter((report) => report.status === statusFilter.value)
    }

    // Rating system filter
    if (ratingSystemFilter.value) {
      filtered = filtered.filter((report) => report.ratingSystemId === ratingSystemFilter.value)
    }

    // Date range filter
    if (dateRangeFilter.value) {
      filtered = filtered.filter((report) => {
        const reportDate = new Date(report.createdAt)
        return getDateRangeFilter(dateRangeFilter.value, reportDate)
      })
    }

    return filtered
  })

  // Clear all filters
  const clearFilters = () => {
    searchQuery.value = ''
    statusFilter.value = ''
    ratingSystemFilter.value = ''
    dateRangeFilter.value = ''
  }

  return {
    searchQuery,
    statusFilter,
    ratingSystemFilter,
    dateRangeFilter,
    filteredReports,
    clearFilters,
  }
}
