import type { VideoAnalysisResult, ContentType, SeverityLevel } from '@/types/video-analysis'
import type {
  ReportData,
  VideoInfo,
  ContentFlag,
  TimelineEvent,
  ContentCategory,
} from '@/types/report'

export function useVideoAnalysisTransform() {
  const transformToReportData = (
    analysisResult: VideoAnalysisResult,
    videoFile: File,
    reportId: string
  ): ReportData => {
    const contentFlags: ContentFlag[] = []
    const timeline: TimelineEvent[] = []

    analysisResult.analysis_result.forEach(frame => {
      if (!frame.contents || Object.keys(frame.contents).length === 0) return

      Object.entries(frame.contents).forEach(([type, confidence]) => {
        if (confidence !== null && confidence > 0) {
          const flag: ContentFlag = {
            id: `flag-${reportId}-${Math.round(frame.frame_time * 1000)}-${type}`,
            type: type as ContentType,
            severity: 'low' as SeverityLevel,
            confidence,
            frameTime: frame.frame_time,
            description: `${type} detected (${Math.round(confidence * 100)}% confidence)`,
            category: 'other' as ContentCategory,
            isBlocking: false,
          }

          contentFlags.push(flag)

          timeline.push({
            timestamp: frame.frame_time,
            type: 'flag',
            content: flag,
            description: flag.description,
          })
        }
      })
    })

    const maxFrameTime = Math.max(...analysisResult.analysis_result.map(f => f.frame_time))

    const videoInfo: VideoInfo = {
      fileName: videoFile.name,
      fileSize: videoFile.size,
      duration: maxFrameTime,
      format: videoFile.type,
    }

    return {
      id: reportId,
      title: `Analysis Report - ${videoFile.name}`,
      status: 'completed' as const,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      videoInfo,
      analysisSummary: {
        totalFrames: analysisResult.analysis_result.length,
        flaggedFrames: new Set(contentFlags.map(f => f.frameTime)).size,
        maxConfidence: Math.max(...contentFlags.map(f => f.confidence), 0),
        detectedContent: contentFlags.map(f => ({
          type: f.type,
          confidence: f.confidence,
          severity: f.severity,
          frameTime: f.frameTime,
        })),
        severityBreakdown: { low: 0, medium: 0, high: 0, critical: 0 },
      },
      contentFlags,
      timeline,
      recommendations: [],
      compliance: {
        overall: 'compliant' as const,
        score: 100,
        issues: [],
        passedChecks: [],
        failedChecks: [],
      },
    }
  }

  return {
    transformToReportData,
  }
}
