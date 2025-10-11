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
    reportId: string,
    ratingSystem: string = 'vietnam',
    guidelines: string[] = [],
    customGuidelines: string[] = []
  ): ReportData => {
    const contentFlags: ContentFlag[] = []
    const timeline: TimelineEvent[] = []

    // Process each frame and create content flags
    analysisResult.analysis_result.forEach(frame => {
      if (!frame.contents || Object.keys(frame.contents).length === 0) return

      Object.entries(frame.contents).forEach(([type, confidence]) => {
        if (confidence !== null && confidence > 0) {
          // Map content types to categories and severity
          const { category, severity } = mapContentTypeToCategoryAndSeverity(
            type as ContentType,
            confidence
          )

          const flag: ContentFlag = {
            id: `flag-${reportId}-${Math.round(frame.frame_time * 1000)}-${type}`,
            type: type as ContentType,
            severity,
            confidence,
            frameTime: frame.frame_time,
            description: `${type} detected (${Math.round(confidence * 100)}% confidence)`,
            category,
            isBlocking: severity === 'critical' || severity === 'high',
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
      // M: These fields need real implementation
      resolution: '1920x1080',
      frameRate: 30,
    }

    // Calculate severity breakdown
    const severityBreakdown = contentFlags.reduce(
      (acc, flag) => {
        acc[flag.severity] = (acc[flag.severity] || 0) + 1
        return acc
      },
      { low: 0, medium: 0, high: 0, critical: 0 } as Record<SeverityLevel, number>
    )

    // Generate suggested rating based on content analysis
    const suggestedRating = generateSuggestedRating(contentFlags, ratingSystem)

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
        severityBreakdown,
      },
      contentFlags,
      timeline,
      // M: These fields need real implementation
      recommendations: generateMockRecommendations(contentFlags),
      compliance: {
        overall: determineComplianceStatus(contentFlags),
        score: calculateComplianceScore(contentFlags),
        issues: generateMockComplianceIssues(contentFlags),
        passedChecks: ['M:Content analysis completed', 'M:Guidelines checked'],
        failedChecks: contentFlags.filter(f => f.isBlocking).map(f => `M:${f.type} violation`),
      },
      // Additional fields needed by ReportDetailView
      ratingSystem,
      guidelines,
      customGuidelines,
      suggestedRating,
      processingDuration: Math.floor(Math.random() * 300) + 60, // M: Mock processing time
    } as ReportData & {
      ratingSystem: string
      guidelines: string[]
      customGuidelines: string[]
      suggestedRating?: string
      processingDuration?: number
    }
  }

  // Helper function to map content types to categories and severity
  const mapContentTypeToCategoryAndSeverity = (
    type: ContentType,
    confidence: number
  ): { category: ContentCategory; severity: SeverityLevel } => {
    // Map content types to categories
    const categoryMap: Record<string, ContentCategory> = {
      // Nudity and sexual content
      general_nsfw: 'sexual_content',
      general_suggestive: 'sexual_content',
      sexual_intent: 'sexual_content',
      undressed: 'nudity',
      sexual_activity: 'sexual_content',
      realistic_nsfw: 'sexual_content',
      female_underwear: 'nudity',
      bra: 'nudity',
      panties: 'nudity',
      negligee: 'nudity',
      female_swimwear: 'nudity',
      bodysuit: 'nudity',
      miniskirt: 'nudity',
      sports_bra: 'nudity',
      sportswear_bottoms: 'nudity',
      male_underwear: 'nudity',
      male_shirtless: 'nudity',
      cleavage: 'nudity',
      female_nudity: 'nudity',
      male_nudity: 'nudity',
      breast: 'nudity',
      genitals: 'nudity',
      butt: 'nudity',
      bulge: 'nudity',
      kissing: 'sexual_content',
      licking: 'sexual_content',
      sex_toy: 'sexual_content',
      animal_genitalia_and_human: 'sexual_content',
      animated_animal_genitalia: 'sexual_content',
      animal_genitalia_only: 'sexual_content',
    }

    // Determine severity based on confidence and content type
    let severity: SeverityLevel = 'low'
    if (confidence >= 0.9) {
      severity = 'critical'
    } else if (confidence >= 0.7) {
      severity = 'high'
    } else if (confidence >= 0.5) {
      severity = 'medium'
    }

    // Adjust severity for more sensitive content types
    if (['genitals', 'sexual_activity', 'animal_genitalia_and_human'].includes(type)) {
      if (severity === 'low') severity = 'medium'
      else if (severity === 'medium') severity = 'high'
      else if (severity === 'high') severity = 'critical'
    }

    return {
      category: categoryMap[type] || 'other',
      severity,
    }
  }

  // Generate suggested rating based on content analysis
  const generateSuggestedRating = (contentFlags: ContentFlag[], ratingSystem: string): string => {
    const criticalFlags = contentFlags.filter(f => f.severity === 'critical')
    const highFlags = contentFlags.filter(f => f.severity === 'high')
    const totalFlags = contentFlags.length

    // Vietnam rating system
    if (ratingSystem === 'vietnam') {
      if (criticalFlags.length > 0) return 'T18'
      if (highFlags.length > 2) return 'T16'
      if (highFlags.length > 0 || totalFlags > 5) return 'T13'
      if (totalFlags > 2) return 'K'
      return 'P'
    }

    // Default fallback
    if (criticalFlags.length > 0) return 'M:R'
    if (highFlags.length > 2) return 'M:PG-13'
    if (highFlags.length > 0 || totalFlags > 5) return 'M:PG'
    return 'M:G'
  }

  // Generate mock recommendations
  const generateMockRecommendations = (contentFlags: ContentFlag[]) => {
    return contentFlags
      .filter(f => f.severity === 'high' || f.severity === 'critical')
      .slice(0, 3)
      .map(flag => ({
        id: `rec-${flag.id}`,
        type: 'edit' as const,
        severity: flag.severity,
        title: `M:Review ${flag.type} content`,
        description: `M:Content at ${flag.frameTime}s may need editing`,
        suggestedAction: `M:Consider editing or censoring this scene`,
        affectedFrames: [Math.round(flag.frameTime * 30)], // M: Assume 30fps
        estimatedTime: Math.floor(Math.random() * 60) + 30, // M: Mock time
      }))
  }

  // Determine compliance status
  const determineComplianceStatus = (
    contentFlags: ContentFlag[]
  ): 'compliant' | 'non_compliant' | 'requires_review' => {
    const criticalFlags = contentFlags.filter(f => f.severity === 'critical')
    const highFlags = contentFlags.filter(f => f.severity === 'high')

    if (criticalFlags.length > 0) return 'non_compliant'
    if (highFlags.length > 2) return 'requires_review'
    return 'compliant'
  }

  // Calculate compliance score
  const calculateComplianceScore = (contentFlags: ContentFlag[]): number => {
    if (contentFlags.length === 0) return 100

    const totalPenalty = contentFlags.reduce((penalty, flag) => {
      switch (flag.severity) {
        case 'critical':
          return penalty + 25
        case 'high':
          return penalty + 15
        case 'medium':
          return penalty + 8
        case 'low':
          return penalty + 3
        default:
          return penalty
      }
    }, 0)

    return Math.max(0, 100 - totalPenalty)
  }

  // Generate mock compliance issues
  const generateMockComplianceIssues = (contentFlags: ContentFlag[]) => {
    return contentFlags
      .filter(f => f.severity === 'high' || f.severity === 'critical')
      .map(flag => ({
        id: `issue-${flag.id}`,
        type: flag.type,
        severity: flag.severity,
        description: `M:${flag.type} content detected at ${flag.frameTime}s`,
        frames: [Math.round(flag.frameTime * 30)], // M: Assume 30fps
        suggestedAction: `M:Review and potentially edit this content`,
      }))
  }

  return {
    transformToReportData,
  }
}
