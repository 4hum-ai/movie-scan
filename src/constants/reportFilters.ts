/**
 * Report filter constants and configurations
 */
export const DATE_RANGE_OPTIONS = [
  { value: '', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
] as const

/**
 * Date range filter logic
 */
export function getDateRangeFilter(dateRange: string, reportDate: Date): boolean {
  const now = new Date()

  switch (dateRange) {
    case 'today':
      return reportDate.toDateString() === now.toDateString()
    case 'week': {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return reportDate >= weekAgo
    }
    case 'month': {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return reportDate >= monthAgo
    }
    case 'quarter': {
      const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      return reportDate >= quarterAgo
    }
    default:
      return true
  }
}
