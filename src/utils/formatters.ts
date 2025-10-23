/**
 * Utility functions for formatting data
 */

/**
 * Format file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Format duration in seconds to MM:SS format
 */
export function formatDuration(seconds?: number): string {
  if (!seconds) return 'N/A'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Format date from various input formats
 */
export function formatDate(dateInput: unknown): string {
  try {
    let date: Date

    // Handle Firebase Timestamp format
    if (dateInput && typeof dateInput === 'object' && '_seconds' in dateInput) {
      date = new Date((dateInput as { _seconds: number })._seconds * 1000)
    } else if (typeof dateInput === 'string') {
      date = new Date(dateInput)
    } else {
      console.warn('Invalid date format:', dateInput)
      return 'Invalid Date'
    }

    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateInput)
      return 'Invalid Date'
    }

    return date.toLocaleDateString()
  } catch (error) {
    console.error('Error formatting date:', error, dateInput)
    return 'Invalid Date'
  }
}

/**
 * Format time from various input formats
 */
export function formatTime(dateInput: unknown): string {
  try {
    let date: Date

    // Handle Firebase Timestamp format
    if (dateInput && typeof dateInput === 'object' && '_seconds' in dateInput) {
      date = new Date((dateInput as { _seconds: number })._seconds * 1000)
    } else if (typeof dateInput === 'string') {
      date = new Date(dateInput)
    } else {
      console.warn('Invalid date format:', dateInput)
      return 'Invalid Date'
    }

    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateInput)
      return 'Invalid Date'
    }

    return date.toLocaleTimeString()
  } catch (error) {
    console.error('Error formatting time:', error, dateInput)
    return 'Invalid Date'
  }
}
