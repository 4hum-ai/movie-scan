/**
 * Report status constants and configurations
 */
export const REPORT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const

export type ReportStatus = (typeof REPORT_STATUS)[keyof typeof REPORT_STATUS]

/**
 * Status display configurations
 */
export const STATUS_CONFIG = {
  [REPORT_STATUS.PENDING]: {
    text: 'Pending',
    class: 'bg-yellow-100 text-yellow-800',
  },
  [REPORT_STATUS.PROCESSING]: {
    text: 'Processing',
    class: 'bg-blue-100 text-blue-800',
  },
  [REPORT_STATUS.COMPLETED]: {
    text: 'Completed',
    class: 'bg-green-100 text-green-800',
  },
  [REPORT_STATUS.FAILED]: {
    text: 'Failed',
    class: 'bg-red-100 text-red-800',
  },
} as const

/**
 * Get status configuration by status
 */
export function getStatusConfig(status: string) {
  return (
    STATUS_CONFIG[status as ReportStatus] || {
      text: 'Unknown',
      class: 'bg-gray-100 text-gray-800',
    }
  )
}

/**
 * Get status text by status
 */
export function getStatusText(status: string): string {
  return getStatusConfig(status).text
}
