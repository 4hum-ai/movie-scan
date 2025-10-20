import type { Media } from '@/types/models'
import type { ReportScene } from '@/composables/useReports'

export type MediaData = Pick<Media, 'fileName' | 'fileSize' | 'duration'> & { thumbnail?: string }
export type AnalysisScene = ReportScene
export interface RatingSystemData {
  name: string
  description?: string
  references?: Array<{
    title: string
    source?: string
    url?: string
  }>
  levels?: Array<{
    key: string
    title: string
    description: string
    guide: string
  }>
}

export function useReportDetail() {
  // Parse microsecond timestamp strings safely
  const parseMicros = (value: string | number): number => {
    const n = typeof value === 'string' ? Number(value) : value
    return Number.isFinite(n) ? n : 0
  }
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'processing':
        return 'Processing'
      case 'completed':
        return 'Completed'
      case 'failed':
        return 'Failed'
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatDate = (dateInput: any) => {
    if (!dateInput) return 'N/A'
    let date: Date
    if (typeof dateInput === 'string') {
      date = new Date(dateInput)
    } else if (typeof dateInput === 'object' && '_seconds' in dateInput) {
      date = new Date((dateInput as { _seconds: number })._seconds * 1000)
    } else {
      date = new Date(dateInput as Date)
    }
    return date.toLocaleDateString()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatTime = (dateInput: any) => {
    if (!dateInput) return 'N/A'
    let date: Date
    if (typeof dateInput === 'string') {
      date = new Date(dateInput)
    } else if (typeof dateInput === 'object' && '_seconds' in dateInput) {
      date = new Date((dateInput as { _seconds: number })._seconds * 1000)
    } else {
      date = new Date(dateInput as Date)
    }
    return date.toLocaleTimeString()
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const getProgressBarClass = (percentage: string) => {
    const value = parseFloat(percentage)
    if (value > 10) return 'bg-gradient-to-r from-red-500 to-red-600'
    if (value > 5) return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
    if (value > 0) return 'bg-gradient-to-r from-green-500 to-green-600'
    return 'bg-gray-300'
  }

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
    }
  }

  const getConfidenceBadgeClass = (confidence: number) => {
    if (confidence >= 90) return 'bg-red-100 text-red-800'
    if (confidence >= 75) return 'bg-orange-100 text-orange-800'
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getConfidenceClass = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800'
    if (confidence >= 75) return 'bg-yellow-100 text-yellow-800'
    if (confidence >= 60) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  const getMLDetectionDescription = (confidence: number) => {
    if (confidence >= 90) return 'ML model is very confident in this detection'
    if (confidence >= 75) return 'ML model has high confidence in this detection'
    if (confidence >= 60) return 'ML model has moderate confidence in this detection'
    return 'ML model has low confidence - manual review recommended'
  }

  const formatShortTime = (microsString: string): string => {
    const micros = parseMicros(microsString)
    const totalSeconds = Math.max(0, Math.floor(micros / 1_000_000))
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

  const getDurationText = (scene: AnalysisScene): string => {
    if (!scene.startTime || !scene.endTime) return '0.0 min violation'
    const startMicros = parseMicros(scene.startTime)
    const endMicros = parseMicros(scene.endTime)
    const durationMinutes = Math.max(0, (endMicros - startMicros) / 1_000_000 / 60)
    return `${durationMinutes.toFixed(1)} min violation`
  }

  const getSceneConfidence = (scene: AnalysisScene) => {
    return Math.round(scene.confidence * 100)
  }

  const getVideoDetectedElements = (scene: AnalysisScene) => {
    if (!scene.analysis.video) return []
    return Object.entries(scene.analysis.video).map(([label, confidence]) => ({
      label,
      confidence: Math.round((confidence || 0) * 100),
    }))
  }

  const getAudioDetectedElements = (scene: AnalysisScene) => {
    if (!scene.analysis.audio) return []
    return Object.entries(scene.analysis.audio).map(([label, confidence]) => ({
      label,
      confidence: Math.round((confidence || 0) * 100),
    }))
  }

  const getSceneConfidenceRange = (scene: AnalysisScene) => {
    const videoElements = getVideoDetectedElements(scene)
    const audioElements = getAudioDetectedElements(scene)
    const allConfidences = [
      ...videoElements.map((el) => el.confidence),
      ...audioElements.map((el) => el.confidence),
    ]
    if (allConfidences.length === 0) return null
    const minConfidence = Math.min(...allConfidences)
    const maxConfidence = Math.max(...allConfidences)
    const avgConfidence = Math.round(
      allConfidences.reduce((sum, conf) => sum + conf, 0) / allConfidences.length,
    )
    return {
      min: minConfidence,
      max: maxConfidence,
      avg: avgConfidence,
      count: allConfidences.length,
    }
  }

  const getVideoDetectionDescription = () => 'Visual content analysis detected potential issues'
  const getAudioDetectionDescription = () => 'Audio content analysis detected potential issues'

  const getRatingColorClass = (levelKey: string) => {
    const colorMap: { [key: string]: string } = {
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

  return {
    getStatusClass,
    getStatusText,
    formatDate,
    formatTime,
    formatDuration,
    formatFileSize,
    getProgressBarClass,
    getSeverityBadgeClass,
    getConfidenceBadgeClass,
    getConfidenceClass,
    getMLDetectionDescription,
    formatShortTime,
    getDurationText,
    getSceneConfidence,
    getSceneConfidenceRange,
    getVideoDetectedElements,
    getAudioDetectedElements,
    getVideoDetectionDescription,
    getAudioDetectionDescription,
    getRatingColorClass,
  }
}
