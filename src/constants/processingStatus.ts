/**
 * Processing status constants and configurations
 */
export const PROCESSING_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const

export type ProcessingStatus = (typeof PROCESSING_STATUS)[keyof typeof PROCESSING_STATUS]

/**
 * Status display configurations
 */
export const STATUS_CONFIG = {
  [PROCESSING_STATUS.PENDING]: {
    title: 'Scan Requested',
    description: 'Your video has been queued for AI analysis.',
    icon: 'clock',
    color: 'gray',
  },
  [PROCESSING_STATUS.PROCESSING]: {
    title: 'Processing Your Video...',
    description: 'AI is analyzing your video content. This may take a few minutes.',
    icon: 'refresh',
    color: 'blue',
  },
  [PROCESSING_STATUS.COMPLETED]: {
    title: 'Analysis Complete!',
    description: 'Your video analysis is complete. View the detailed report below.',
    icon: 'check',
    color: 'green',
  },
  [PROCESSING_STATUS.FAILED]: {
    title: 'Processing Failed',
    description: 'An error occurred during processing.',
    icon: 'warning',
    color: 'red',
  },
} as const

/**
 * Get status configuration by status
 */
export function getStatusConfig(status: ProcessingStatus) {
  return STATUS_CONFIG[status] || STATUS_CONFIG[PROCESSING_STATUS.PENDING]
}
