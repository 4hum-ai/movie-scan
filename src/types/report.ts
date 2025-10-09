import type { ContentType, SeverityLevel } from './video-analysis'

export interface ReportData {
  id: string
  title: string
  status: 'processing' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
  videoInfo: VideoInfo
  analysisSummary: AnalysisSummary
  contentFlags: ContentFlag[]
  timeline: TimelineEvent[]
  recommendations: Recommendation[]
  compliance: ComplianceStatus
}

export interface VideoInfo {
  fileName: string
  fileSize: number
  duration: number
  format: string
  resolution?: string
  frameRate?: number
}

export interface ContentFlag {
  id: string
  type: ContentType
  severity: SeverityLevel
  confidence: number
  frameTime: number
  description: string
  category: ContentCategory
  isBlocking: boolean
}

export interface TimelineEvent {
  timestamp: number
  type: 'flag' | 'scene_change' | 'audio_change'
  content: ContentFlag | null
  description: string
}

export interface Recommendation {
  id: string
  type: 'edit' | 'censor' | 'warning' | 'approve'
  severity: SeverityLevel
  title: string
  description: string
  suggestedAction: string
  affectedFrames: number[]
  estimatedTime?: number
}

export interface ComplianceStatus {
  overall: 'compliant' | 'non_compliant' | 'requires_review'
  score: number
  issues: ComplianceIssue[]
  passedChecks: string[]
  failedChecks: string[]
}

export interface ComplianceIssue {
  id: string
  type: ContentType
  severity: SeverityLevel
  description: string
  frames: number[]
  suggestedAction: string
}

export interface AnalysisSummary {
  totalFrames: number
  flaggedFrames: number
  maxConfidence: number
  detectedContent: ContentDetection[]
  severityBreakdown: Record<SeverityLevel, number>
}

export interface ContentDetection {
  type: ContentType
  confidence: number
  severity: SeverityLevel
  frameTime: number
}

export type ContentCategory =
  | 'nudity'
  | 'sexual_content'
  | 'violence'
  | 'language'
  | 'drugs'
  | 'alcohol'
  | 'tobacco'
  | 'gambling'
  | 'other'
