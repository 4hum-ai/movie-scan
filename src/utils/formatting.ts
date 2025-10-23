/**
 * Centralized formatting utilities
 * Consolidates all duplicate formatting functions across the application
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
 * Format time in seconds to HH:MM:SS or MM:SS format
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }
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
    } else if (dateInput instanceof Date) {
      date = dateInput
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
export function formatTimeFromDate(dateInput: unknown): string {
  try {
    let date: Date

    // Handle Firebase Timestamp format
    if (dateInput && typeof dateInput === 'object' && '_seconds' in dateInput) {
      date = new Date((dateInput as { _seconds: number })._seconds * 1000)
    } else if (typeof dateInput === 'string') {
      date = new Date(dateInput)
    } else if (dateInput instanceof Date) {
      date = dateInput
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

/**
 * Format short time from millisecond timestamp
 */
export function formatShortTime(millis: number): string {
  const totalSeconds = Math.max(0, Math.floor(millis / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Get duration text for a scene
 */
export function getDurationText(startTime: number, endTime: number): string {
  if (startTime == null || endTime == null || startTime === endTime) return '0 sec violation'

  const durationMs = Math.max(0, endTime - startTime)
  const durationSeconds = durationMs / 1000
  const durationMinutes = durationSeconds / 60

  // If less than 1 minute, show seconds
  if (durationMinutes < 1) {
    const seconds = Math.ceil(durationSeconds) + 1
    return `${seconds} sec violation`
  }

  // If 1 minute or more, show minutes with 1 decimal place
  return `${durationMinutes.toFixed(1)} min violation`
}
