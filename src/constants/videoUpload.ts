/**
 * Video upload configuration constants
 */
export const VIDEO_UPLOAD_CONFIG = {
  SUPPORTED_FORMATS: ['MP4', 'AVI', 'MOV'],
  MAX_FILE_SIZE: '10GB',
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024 * 1024, // 10GB in bytes
} as const

/**
 * Get formatted supported formats string
 */
export function getSupportedFormatsString(): string {
  return VIDEO_UPLOAD_CONFIG.SUPPORTED_FORMATS.join(', ')
}

/**
 * Get file size limit string
 */
export function getFileSizeLimitString(): string {
  return `Max file size: ${VIDEO_UPLOAD_CONFIG.MAX_FILE_SIZE}`
}
