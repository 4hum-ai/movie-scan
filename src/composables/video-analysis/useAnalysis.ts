import { ref, computed, readonly } from 'vue'
import type {
  VideoAnalysisResult,
  VideoAnalysisState,
  VideoAnalysisConfig,
} from '@/types/video-analysis'
import { useVideoAnalysisAuth } from './useAuth'
import { VIDEO_ANALYSIS_CONSTANTS } from './constants'

export function useVideoAnalysis(config: VideoAnalysisConfig) {
  const auth = useVideoAnalysisAuth(config)

  const state = ref<VideoAnalysisState>({
    isLoading: false,
    error: null,
    result: null,
    progress: 0,
  })

  const hasResults = computed(() => state.value.result !== null)
  const isReady = computed(() => auth.isAuthenticated.value && !state.value.isLoading)

  const generateRequestId = (): string => {
    return (
      Math.random()
        .toString(36)
        .substring(2, VIDEO_ANALYSIS_CONSTANTS.REQUEST_ID_LENGTH + 2) +
      Math.random()
        .toString(36)
        .substring(2, VIDEO_ANALYSIS_CONSTANTS.REQUEST_ID_LENGTH + 2)
    )
  }

  const generateTraceId = (): string => {
    return (
      Math.random()
        .toString(36)
        .substring(2, VIDEO_ANALYSIS_CONSTANTS.TRACE_ID_LENGTH + 2) +
      Math.random()
        .toString(36)
        .substring(2, VIDEO_ANALYSIS_CONSTANTS.TRACE_ID_LENGTH + 2)
    )
  }

  const analyzeVideo = async (videoFile: File): Promise<VideoAnalysisResult> => {
    if (!videoFile) {
      throw new Error('Video file is required')
    }

    // Ensure we have a valid token
    const token = await auth.getValidToken()

    state.value.isLoading = true
    state.value.error = null
    state.value.progress = 0

    try {
      const requestId = generateRequestId()
      const traceId = generateTraceId()

      const formData = new FormData()
      formData.append('requestId', requestId)
      formData.append('clientId', config.clientId)
      formData.append('traceId', traceId)
      formData.append('video_file', videoFile)

      const progressInterval = setInterval(() => {
        if (state.value.progress < VIDEO_ANALYSIS_CONSTANTS.PROGRESS_MAX_BEFORE_COMPLETE) {
          state.value.progress += Math.random() * VIDEO_ANALYSIS_CONSTANTS.PROGRESS_INCREMENT_MAX
        }
      }, VIDEO_ANALYSIS_CONSTANTS.PROGRESS_INTERVAL_MS)

      const response = await fetch(
        `${config.baseUrl}${VIDEO_ANALYSIS_CONSTANTS.ENDPOINTS.ANALYZE}`,
        {
          method: 'POST',
          body: formData,
          headers: {
            [VIDEO_ANALYSIS_CONSTANTS.HEADERS.ACCESS_TOKEN]: token,
            [VIDEO_ANALYSIS_CONSTANTS.HEADERS.CLIENT_ID]: config.clientId,
            [VIDEO_ANALYSIS_CONSTANTS.HEADERS.ACCEPT]: VIDEO_ANALYSIS_CONSTANTS.CONTENT_TYPES.JSON,
          },
        }
      )

      clearInterval(progressInterval)
      state.value.progress = 100

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status} ${response.statusText}`)
      }

      const result: VideoAnalysisResult = await response.json()

      state.value.result = result
      state.value.error = null

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Video analysis failed'
      state.value.error = errorMessage
      state.value.result = null
      throw error
    } finally {
      state.value.isLoading = false
      state.value.progress = 0
    }
  }

  const clearResults = () => {
    state.value.result = null
    state.value.error = null
    state.value.progress = 0
  }

  const reset = () => {
    clearResults()
    auth.clearAuth()
  }

  return {
    state: readonly(state),
    isLoading: computed(() => state.value.isLoading),
    error: computed(() => state.value.error),
    result: computed(() => state.value.result),
    progress: computed(() => state.value.progress),
    hasResults,
    isReady,
    auth,
    analyzeVideo,
    clearResults,
    reset,
  }
}
