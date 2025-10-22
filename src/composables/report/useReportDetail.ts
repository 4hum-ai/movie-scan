import { ReportScene } from '@/composables'
import {
  formatDate,
  formatTimeFromDate,
  formatDuration,
  formatFileSize,
  formatShortTime,
  getDurationText,
} from '@/utils/formatting'
import {
  getReportStatusConfig,
  getSeverityBadgeClass,
  getConfidenceBadgeClass,
  getConfidenceClass,
  getProgressBarClass,
  getRatingColorClass,
} from '@/utils/statusConfig'

export function useReportDetail() {
  // Use centralized status configuration
  const getStatusClass = (status: string) => {
    return getReportStatusConfig(status).class
  }

  const getStatusText = (status: string) => {
    return getReportStatusConfig(status).text
  }

  const getMLDetectionDescription = (confidence: number) => {
    if (confidence >= 90) return 'ML model is very confident in this detection'
    if (confidence >= 75) return 'ML model has high confidence in this detection'
    if (confidence >= 60) return 'ML model has moderate confidence in this detection'
    return 'ML model has low confidence - manual review recommended'
  }

  const getSceneConfidence = (scene: ReportScene) => {
    return Math.round(scene.confidence * 100)
  }

  const getVideoDetectedElements = (scene: ReportScene) => {
    if (!scene.analysis.video) return []
    return Object.entries(scene.analysis.video).map(([label, confidence]) => ({
      label,
      confidence: Math.round((confidence || 0) * 100),
    }))
  }

  const getAudioDetectedElements = (scene: ReportScene) => {
    if (!scene.analysis.audio) return []
    return Object.entries(scene.analysis.audio).map(([label, confidence]) => ({
      label,
      confidence: Math.round((confidence || 0) * 100),
    }))
  }

  const getSceneConfidenceRange = (scene: ReportScene) => {
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

  return {
    getStatusClass,
    getStatusText,
    formatDate,
    formatTime: formatTimeFromDate,
    formatDuration,
    formatFileSize,
    getProgressBarClass,
    getSeverityBadgeClass,
    getConfidenceBadgeClass,
    getConfidenceClass,
    getMLDetectionDescription,
    formatShortTime,
    getDurationText: (scene: ReportScene) => getDurationText(scene.startTime, scene.endTime),
    getSceneConfidence,
    getSceneConfidenceRange,
    getVideoDetectedElements,
    getAudioDetectedElements,
    getVideoDetectionDescription,
    getAudioDetectionDescription,
    getRatingColorClass,
  }
}
