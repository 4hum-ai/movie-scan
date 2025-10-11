import { ref, computed, readonly } from 'vue'
import type {
  GetTokenRequest,
  GetTokenResponse,
  AuthState,
  VideoAnalysisConfig,
} from '@/types/video-analysis'
import { VIDEO_ANALYSIS_CONSTANTS } from './constants'

export function useVideoAnalysisAuth(config: VideoAnalysisConfig) {
  const state = ref<AuthState>({
    isLoading: false,
    error: null,
    token: null,
    expiresAt: null,
  })

  const isAuthenticated = computed(() => {
    if (!state.value.token || !state.value.expiresAt) return false
    return Date.now() < state.value.expiresAt
  })

  const needsRefresh = computed(() => {
    if (!state.value.expiresAt) return true
    return (
      Date.now() >
      state.value.expiresAt - VIDEO_ANALYSIS_CONSTANTS.TOKEN_REFRESH_THRESHOLD_MINUTES * 60 * 1000
    )
  })

  const generateRequestId = (): string => {
    return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
  }

  const generateTraceId = (): string => {
    return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
  }

  const getToken = async (): Promise<string> => {
    // Return existing valid token if available
    if (isAuthenticated.value && !needsRefresh.value) {
      return state.value.token!
    }

    state.value.isLoading = true
    state.value.error = null

    try {
      const requestId = generateRequestId()
      const traceId = generateTraceId()

      const request: GetTokenRequest = {
        requestId,
        clientId: config.clientId,
        traceId,
        access_key: config.accessKey,
      }

      const formData = new FormData()
      Object.entries(request).forEach(([key, value]) => {
        formData.append(key, value)
      })

      const response = await fetch(
        `${config.baseUrl}${VIDEO_ANALYSIS_CONSTANTS.ENDPOINTS.GET_TOKEN}`,
        {
          method: 'POST',
          body: formData,
          headers: {
            [VIDEO_ANALYSIS_CONSTANTS.HEADERS.ACCEPT]: VIDEO_ANALYSIS_CONSTANTS.CONTENT_TYPES.JSON,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status} ${response.statusText}`)
      }

      const result: GetTokenResponse = await response.json()

      // Check if there's an error code (only if code field exists)
      if (result.code !== undefined && result.code !== 0) {
        throw new Error(result.message || 'Authentication failed')
      }

      if (!result.access_token) {
        throw new Error('No access token received')
      }

      const expiresAt = Date.now() + VIDEO_ANALYSIS_CONSTANTS.TOKEN_EXPIRY_HOURS * 60 * 60 * 1000

      state.value.token = result.access_token
      state.value.expiresAt = expiresAt
      state.value.error = null

      return result.access_token
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
      state.value.error = errorMessage
      state.value.token = null
      state.value.expiresAt = null
      throw error
    } finally {
      state.value.isLoading = false
    }
  }

  const clearAuth = () => {
    state.value.token = null
    state.value.expiresAt = null
    state.value.error = null
  }

  const getValidToken = async (): Promise<string> => {
    if (needsRefresh.value) {
      return await getToken()
    }
    return state.value.token!
  }

  return {
    state: readonly(state),
    isLoading: computed(() => state.value.isLoading),
    error: computed(() => state.value.error),
    token: computed(() => state.value.token),
    isAuthenticated,
    needsRefresh,
    getToken,
    getValidToken,
    clearAuth,
  }
}
