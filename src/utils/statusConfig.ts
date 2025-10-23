/**
 * Centralized status configuration system
 * Consolidates all status-related styling and text across the application
 */

export interface StatusConfig {
  class: string
  text: string
  dotClass?: string
}

/**
 * Get status configuration for report statuses
 */
export function getReportStatusConfig(status: string): StatusConfig {
  const configs: Record<string, StatusConfig> = {
    pending: {
      class: 'bg-yellow-100 text-yellow-800',
      text: 'Pending',
      dotClass: 'bg-yellow-500',
    },
    processing: {
      class: 'bg-blue-100 text-blue-800',
      text: 'Processing',
      dotClass: 'bg-blue-500',
    },
    completed: {
      class: 'bg-green-100 text-green-800',
      text: 'Completed',
      dotClass: 'bg-green-500',
    },
    failed: {
      class: 'bg-red-100 text-red-800',
      text: 'Failed',
      dotClass: 'bg-red-500',
    },
  }

  return configs[status] || configs.pending
}

/**
 * Get status configuration for general statuses
 */
export function getStatusConfig(status: string): StatusConfig {
  const configs: Record<string, StatusConfig> = {
    active: {
      class: 'bg-green-100 text-green-800',
      text: 'Active',
      dotClass: 'bg-green-500',
    },
    success: {
      class: 'bg-green-100 text-green-800',
      text: 'Success',
      dotClass: 'bg-green-500',
    },
    paid: {
      class: 'bg-green-100 text-green-800',
      text: 'Paid',
      dotClass: 'bg-green-500',
    },
    online: {
      class: 'bg-green-100 text-green-800',
      text: 'Online',
      dotClass: 'bg-green-500',
    },
    pending: {
      class: 'bg-yellow-100 text-yellow-800',
      text: 'Pending',
      dotClass: 'bg-yellow-500',
    },
    warning: {
      class: 'bg-yellow-100 text-yellow-800',
      text: 'Warning',
      dotClass: 'bg-yellow-500',
    },
    inactive: {
      class: 'bg-gray-100 text-gray-800',
      text: 'Inactive',
      dotClass: 'bg-gray-500',
    },
    offline: {
      class: 'bg-gray-100 text-gray-800',
      text: 'Offline',
      dotClass: 'bg-gray-500',
    },
    draft: {
      class: 'bg-gray-100 text-gray-800',
      text: 'Draft',
      dotClass: 'bg-gray-500',
    },
    suspended: {
      class: 'bg-red-100 text-red-800',
      text: 'Suspended',
      dotClass: 'bg-red-500',
    },
    error: {
      class: 'bg-red-100 text-red-800',
      text: 'Error',
      dotClass: 'bg-red-500',
    },
    failed: {
      class: 'bg-red-100 text-red-800',
      text: 'Failed',
      dotClass: 'bg-red-500',
    },
    published: {
      class: 'bg-blue-100 text-blue-800',
      text: 'Published',
      dotClass: 'bg-blue-500',
    },
    archived: {
      class: 'bg-purple-100 text-purple-800',
      text: 'Archived',
      dotClass: 'bg-purple-500',
    },
    processing: {
      class: 'bg-blue-100 text-blue-800',
      text: 'Processing',
      dotClass: 'bg-blue-500',
    },
    completed: {
      class: 'bg-green-100 text-green-800',
      text: 'Completed',
      dotClass: 'bg-green-500',
    },
    queued: {
      class: 'bg-gray-100 text-gray-800',
      text: 'Queued',
      dotClass: 'bg-gray-500',
    },
    cancelled: {
      class: 'bg-red-100 text-red-800',
      text: 'Cancelled',
      dotClass: 'bg-red-500',
    },
    needs_review: {
      class: 'bg-yellow-100 text-yellow-800',
      text: 'Needs Review',
      dotClass: 'bg-yellow-500',
    },
    approved: {
      class: 'bg-green-100 text-green-800',
      text: 'Approved',
      dotClass: 'bg-green-500',
    },
    rejected: {
      class: 'bg-red-100 text-red-800',
      text: 'Rejected',
      dotClass: 'bg-red-500',
    },
  }

  return configs[status] || configs.pending
}

/**
 * Get severity badge class
 */
export function getSeverityBadgeClass(severity: string): string {
  const severityMap: Record<string, string> = {
    critical: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  }
  return severityMap[severity] || 'bg-gray-100 text-gray-800'
}

/**
 * Get confidence badge class
 */
export function getConfidenceBadgeClass(confidence: number): string {
  if (confidence >= 90) return 'bg-red-100 text-red-800'
  if (confidence >= 75) return 'bg-orange-100 text-orange-800'
  if (confidence >= 60) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

/**
 * Get confidence class (inverted logic for confidence)
 */
export function getConfidenceClass(confidence: number): string {
  if (confidence >= 90) return 'bg-green-100 text-green-800'
  if (confidence >= 75) return 'bg-yellow-100 text-yellow-800'
  if (confidence >= 60) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}

/**
 * Get rating color class
 */
export function getRatingColorClass(levelKey: string): string {
  const colorMap: Record<string, string> = {
    P: 'bg-green-100 text-green-800',
    K: 'bg-blue-100 text-blue-800',
    T13: 'bg-yellow-100 text-yellow-800',
    T16: 'bg-orange-100 text-orange-800',
    T18: 'bg-red-100 text-red-800',
    C: 'bg-red-900 text-white',
    G: 'bg-green-100 text-green-800',
    PG: 'bg-yellow-100 text-yellow-800',
    'PG-13': 'bg-orange-100 text-orange-800',
    R: 'bg-red-100 text-red-800',
    'NC-17': 'bg-red-900 text-white',
  }
  return colorMap[levelKey] || 'bg-gray-100 text-gray-800'
}

/**
 * Get progress bar class based on percentage
 */
export function getProgressBarClass(percentage: string): string {
  const value = parseFloat(percentage)
  if (value > 10) return 'bg-gradient-to-r from-red-500 to-red-600'
  if (value > 5) return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
  if (value > 0) return 'bg-gradient-to-r from-green-500 to-green-600'
  return 'bg-gray-300'
}
