export const VIDEO_ANALYSIS_CONSTANTS = {
  // Token expiration
  TOKEN_EXPIRY_HOURS: 1,
  TOKEN_REFRESH_THRESHOLD_MINUTES: 5,

  // Progress simulation
  PROGRESS_INTERVAL_MS: 500,
  PROGRESS_INCREMENT_MAX: 10,
  PROGRESS_MAX_BEFORE_COMPLETE: 90,

  // API endpoints
  ENDPOINTS: {
    GET_TOKEN: '/get_token',
    HEALTH_CHECK: '/health',
    ANALYZE: '/api/v1.0/sync/analyze',
  },

  // Headers
  HEADERS: {
    ACCESS_TOKEN: 'x-access-token',
    CLIENT_ID: 'clientId',
    ACCEPT: 'Accept',
  },

  // Content types
  CONTENT_TYPES: {
    FORM_URLENCODED: 'application/x-www-form-urlencoded',
    JSON: 'application/json',
  },
} as const
