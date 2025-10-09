import { ref, computed, readonly } from 'vue'
import type {
  VideoAnalysisResult,
  VideoAnalysisState,
  VideoAnalysisConfig,
  ContentDetection,
  AnalysisSummary,
  ContentType,
  SeverityLevel,
} from '@/types/video-analysis'
import { useVideoAnalysisAuth } from './useAuth'

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
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  const generateTraceId = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
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
        if (state.value.progress < 90) {
          state.value.progress += Math.random() * 10
        }
      }, 500)

      const response = await fetch(`${config.baseUrl}/api/v1.0/sync/analyze`, {
        method: 'POST',
        body: formData,
        headers: {
          'x-access-token': token,
          clientId: config.clientId,
          Accept: 'application/json',
        },
      })

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

  const getContentDetections = (): ContentDetection[] => {
    if (!state.value.result) return []

    const detections: ContentDetection[] = []

    state.value.result.analysis_result.forEach(frame => {
      if (!frame.contents) return

      Object.entries(frame.contents).forEach(([type, confidence]) => {
        if (confidence !== null && confidence > 0) {
          detections.push({
            type: type as ContentType,
            confidence,
            severity: getSeverityLevel(confidence),
            frameTime: frame.frame_time,
          })
        }
      })
    })

    return detections.sort((a, b) => b.confidence - a.confidence)
  }

  const getSeverityLevel = (confidence: number): SeverityLevel => {
    if (confidence >= 0.8) return 'critical'
    if (confidence >= 0.6) return 'high'
    if (confidence >= 0.4) return 'medium'
    return 'low'
  }

  const getAnalysisSummary = (): AnalysisSummary => {
    if (!state.value.result) {
      return {
        totalFrames: 0,
        flaggedFrames: 0,
        maxConfidence: 0,
        detectedContent: [],
        severityBreakdown: { low: 0, medium: 0, high: 0, critical: 0 },
      }
    }

    const detections = getContentDetections()
    const flaggedFrames = new Set(detections.map(d => d.frameTime)).size
    const maxConfidence = Math.max(...detections.map(d => d.confidence), 0)

    const severityBreakdown = detections.reduce(
      (acc, detection) => {
        acc[detection.severity]++
        return acc
      },
      { low: 0, medium: 0, high: 0, critical: 0 } as Record<SeverityLevel, number>
    )

    return {
      totalFrames: state.value.result.analysis_result.length,
      flaggedFrames,
      maxConfidence,
      detectedContent: detections,
      severityBreakdown,
    }
  }

  const getDetectionsByType = (contentType: ContentType): ContentDetection[] => {
    return getContentDetections().filter(d => d.type === contentType)
  }

  const getDetectionsBySeverity = (severity: SeverityLevel): ContentDetection[] => {
    return getContentDetections().filter(d => d.severity === severity)
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
    getContentDetections,
    getAnalysisSummary,
    getDetectionsByType,
    getDetectionsBySeverity,
    getSeverityLevel,
    clearResults,
    reset,
  }
}
