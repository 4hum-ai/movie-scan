import { ReportScene } from '@/composables'
import {
  formatDate,
  formatTimeFromDate,
  formatDuration,
  formatFileSize,
  formatShortTime,
  getDurationText,
} from '@/utils/formatters'

export interface StatusConfig {
  class: string
  text: string
  dotClass?: string
}

const REPORT_STATUS_CONFIGS: Record<string, StatusConfig> = {
  pending: { class: 'bg-yellow-100 text-yellow-800', text: 'Pending', dotClass: 'bg-yellow-500' },
  processing: { class: 'bg-blue-100 text-blue-800', text: 'Processing', dotClass: 'bg-blue-500' },
  completed: { class: 'bg-green-100 text-green-800', text: 'Completed', dotClass: 'bg-green-500' },
  failed: { class: 'bg-red-100 text-red-800', text: 'Failed', dotClass: 'bg-red-500' },
}

const SEVERITY_CLASSES: Record<string, string> = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
}

const RATING_COLOR_CLASSES: Record<string, string> = {
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

export const STATUS_CONFIG = {
  pending: {
    title: 'Scan Requested',
    description: 'Your video has been queued for AI analysis.',
    icon: 'clock',
    color: 'gray',
    text: 'Pending',
    class: 'bg-yellow-100 text-yellow-800',
  },
  processing: {
    title: 'Processing Your Video...',
    description: 'AI is analyzing your video content. This may take a few minutes.',
    icon: 'refresh',
    color: 'blue',
    text: 'Processing',
    class: 'bg-blue-100 text-blue-800',
  },
  completed: {
    title: 'Analysis Complete!',
    description: 'Your video analysis is complete. View the detailed report below.',
    icon: 'check',
    color: 'green',
    text: 'Completed',
    class: 'bg-green-100 text-green-800',
  },
  failed: {
    title: 'Processing Failed',
    description: 'An error occurred during processing.',
    icon: 'warning',
    color: 'red',
    text: 'Failed',
    class: 'bg-red-100 text-red-800',
  },
} as const

export function getReportStatusConfig(status: string): StatusConfig {
  return REPORT_STATUS_CONFIGS[status] || REPORT_STATUS_CONFIGS.pending
}

export function getSeverityBadgeClass(severity: string): string {
  return SEVERITY_CLASSES[severity] || 'bg-gray-100 text-gray-800'
}

export function getConfidenceBadgeClass(confidence: number): string {
  if (confidence >= 90) return 'bg-red-100 text-red-800'
  if (confidence >= 75) return 'bg-orange-100 text-orange-800'
  if (confidence >= 60) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

export function getConfidenceClass(confidence: number): string {
  if (confidence >= 90) return 'bg-green-100 text-green-800'
  if (confidence >= 75) return 'bg-yellow-100 text-yellow-800'
  if (confidence >= 60) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}

export function getRatingColorClass(levelKey: string): string {
  return RATING_COLOR_CLASSES[levelKey] || 'bg-gray-100 text-gray-800'
}

export function getProgressBarClass(percentage: string): string {
  const value = parseFloat(percentage)
  if (value > 10) return 'bg-gradient-to-r from-red-500 to-red-600'
  if (value > 5) return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
  if (value > 0) return 'bg-gradient-to-r from-green-500 to-green-600'
  return 'bg-gray-300'
}

export function getStatusConfig(status: string) {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending
}

export function useReportDetail() {
  // Status helpers
  const getStatusClass = (status: string) => getReportStatusConfig(status).class
  const getStatusText = (status: string) => getReportStatusConfig(status).text

  // Analysis helpers
  const getMLDetectionDescription = (confidence: number) => {
    if (confidence >= 90) return 'ML model is very confident in this detection'
    if (confidence >= 75) return 'ML model has high confidence in this detection'
    if (confidence >= 60) return 'ML model has moderate confidence in this detection'
    return 'ML model has low confidence - manual review recommended'
  }

  const getSceneConfidence = (scene: ReportScene) => Math.round(scene.confidence * 100)

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
