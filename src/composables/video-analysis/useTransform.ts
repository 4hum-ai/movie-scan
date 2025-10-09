import type { VideoAnalysisResult, SeverityLevel, ContentType } from '@/types/video-analysis'
import type {
  ReportData,
  VideoInfo,
  ContentFlag,
  TimelineEvent,
  Recommendation,
  ComplianceStatus,
  ContentCategory,
} from '@/types/report'

export function useVideoAnalysisTransform() {
  const getContentCategory = (type: ContentType): ContentCategory => {
    const categoryMap: Record<string, ContentCategory> = {
      // Nudity
      female_nudity: 'nudity',
      male_nudity: 'nudity',
      genitals: 'nudity',
      breast: 'nudity',
      butt: 'nudity',

      // Sexual Content
      sexual_activity: 'sexual_content',
      sexual_intent: 'sexual_content',
      kissing: 'sexual_content',
      licking: 'sexual_content',
      sex_toy: 'sexual_content',
      general_nsfw: 'sexual_content',
      general_suggestive: 'sexual_content',

      // Clothing/Underwear
      female_underwear: 'sexual_content',
      male_underwear: 'sexual_content',
      bra: 'sexual_content',
      panties: 'sexual_content',
      negligee: 'sexual_content',
      female_swimwear: 'sexual_content',
      bodysuit: 'sexual_content',
      miniskirt: 'sexual_content',
      sports_bra: 'sexual_content',
      sportswear_bottoms: 'sexual_content',
      cleavage: 'sexual_content',
      bulge: 'sexual_content',

      // Other
      undressed: 'nudity',
      male_shirtless: 'nudity',
      realistic_nsfw: 'sexual_content',
    }

    return categoryMap[type] || 'other'
  }

  const getSeverityDescription = (severity: SeverityLevel): string => {
    const descriptions = {
      low: 'Minor concern - may require review',
      medium: 'Moderate concern - likely needs attention',
      high: 'Serious concern - requires action',
      critical: 'Critical issue - must be addressed',
    }
    return descriptions[severity]
  }

  const getContentDescription = (type: ContentType, confidence: number): string => {
    const descriptions: Record<ContentType, string> = {
      general_nsfw: 'General NSFW content detected',
      general_suggestive: 'Suggestive content detected',
      sexual_intent: 'Sexual intent or behavior detected',
      undressed: 'Undressed or partially clothed person',
      sexual_activity: 'Sexual activity detected',
      realistic_nsfw: 'Realistic NSFW content detected',
      female_underwear: 'Female underwear visible',
      bra: 'Bra visible',
      panties: 'Panties visible',
      negligee: 'Negligee or lingerie visible',
      female_swimwear: 'Female swimwear visible',
      bodysuit: 'Bodysuit visible',
      miniskirt: 'Miniskirt visible',
      sports_bra: 'Sports bra visible',
      sportswear_bottoms: 'Sportswear bottoms visible',
      male_underwear: 'Male underwear visible',
      cleavage: 'Cleavage visible',
      female_nudity: 'Female nudity detected',
      male_nudity: 'Male nudity detected',
      breast: 'Breast exposure detected',
      genitals: 'Genital exposure detected',
      butt: 'Buttock exposure detected',
      bulge: 'Genital bulge visible',
      kissing: 'Kissing detected',
      licking: 'Licking behavior detected',
      sex_toy: 'Sex toy detected',
      male_shirtless: 'Male shirtless detected',
      animal_genitalia_and_human: 'Animal genitalia with human interaction',
      animated_animal_genitalia: 'Animated animal genitalia',
      animal_genitalia_only: 'Animal genitalia only',
    }

    const baseDescription = descriptions[type] || 'Content detected'
    return `${baseDescription} (${Math.round(confidence * 100)}% confidence)`
  }

  const isBlockingContent = (type: ContentType, severity: SeverityLevel): boolean => {
    const blockingTypes: ContentType[] = [
      'genitals',
      'sexual_activity',
      'female_nudity',
      'male_nudity',
    ]

    return blockingTypes.includes(type) || severity === 'critical'
  }

  const generateRecommendations = (contentFlags: ContentFlag[]): Recommendation[] => {
    const recommendations: Recommendation[] = []
    const groupedFlags = new Map<ContentType, ContentFlag[]>()

    contentFlags.forEach(flag => {
      if (!groupedFlags.has(flag.type)) {
        groupedFlags.set(flag.type, [])
      }
      groupedFlags.get(flag.type)!.push(flag)
    })

    groupedFlags.forEach((flags, type) => {
      const maxSeverity = flags.reduce(
        (max, flag) =>
          ['low', 'medium', 'high', 'critical'].indexOf(flag.severity) >
          ['low', 'medium', 'high', 'critical'].indexOf(max)
            ? flag.severity
            : max,
        'low' as SeverityLevel
      )

      const recommendation: Recommendation = {
        id: `rec-${type}-${Date.now()}`,
        type: maxSeverity === 'critical' ? 'censor' : maxSeverity === 'high' ? 'edit' : 'warning',
        severity: maxSeverity,
        title: `Address ${type.replace(/_/g, ' ')} content`,
        description: getSeverityDescription(maxSeverity),
        suggestedAction: getSuggestedAction(type, maxSeverity),
        affectedFrames: flags.map(f => f.frameTime),
        estimatedTime: flags.length * 2, // 2 minutes per flag
      }

      recommendations.push(recommendation)
    })

    return recommendations.sort(
      (a, b) =>
        ['low', 'medium', 'high', 'critical'].indexOf(b.severity) -
        ['low', 'medium', 'high', 'critical'].indexOf(a.severity)
    )
  }

  const getSuggestedAction = (_type: ContentType, severity: SeverityLevel): string => {
    if (severity === 'critical') {
      return 'Remove or censor this content completely'
    }
    if (severity === 'high') {
      return 'Edit or blur this content'
    }
    if (severity === 'medium') {
      return 'Consider editing or add warning'
    }
    return 'Review and consider if editing is needed'
  }

  const calculateComplianceScore = (contentFlags: ContentFlag[]): number => {
    if (contentFlags.length === 0) return 100

    const criticalFlags = contentFlags.filter(f => f.severity === 'critical').length
    const highFlags = contentFlags.filter(f => f.severity === 'high').length
    const mediumFlags = contentFlags.filter(f => f.severity === 'medium').length
    const lowFlags = contentFlags.filter(f => f.severity === 'low').length

    const penalty = criticalFlags * 25 + highFlags * 15 + mediumFlags * 8 + lowFlags * 3
    return Math.max(0, 100 - penalty)
  }

  const transformToReportData = (
    analysisResult: VideoAnalysisResult,
    videoFile: File,
    reportId: string
  ): ReportData => {
    const contentFlags: ContentFlag[] = []
    const timeline: TimelineEvent[] = []

    analysisResult.analysis_result.forEach(frame => {
      if (!frame.contents) return

      Object.entries(frame.contents).forEach(([type, confidence]) => {
        if (confidence !== null && confidence > 0) {
          const severity: SeverityLevel =
            confidence >= 0.8
              ? 'critical'
              : confidence >= 0.6
                ? 'high'
                : confidence >= 0.4
                  ? 'medium'
                  : 'low'

          const flag: ContentFlag = {
            id: `flag-${reportId}-${frame.frame_time}-${type}`,
            type: type as ContentType,
            severity,
            confidence,
            frameTime: frame.frame_time,
            description: getContentDescription(type as ContentType, confidence),
            category: getContentCategory(type as ContentType),
            isBlocking: isBlockingContent(type as ContentType, severity),
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

    const analysisSummary = {
      totalFrames: analysisResult.analysis_result.length,
      flaggedFrames: new Set(contentFlags.map(f => f.frameTime)).size,
      maxConfidence: Math.max(...contentFlags.map(f => f.confidence), 0),
      detectedContent: contentFlags.map(f => ({
        type: f.type,
        confidence: f.confidence,
        severity: f.severity,
        frameTime: f.frameTime,
      })),
      severityBreakdown: contentFlags.reduce(
        (acc, flag) => {
          acc[flag.severity]++
          return acc
        },
        { low: 0, medium: 0, high: 0, critical: 0 } as Record<SeverityLevel, number>
      ),
    }

    const recommendations = generateRecommendations(contentFlags)
    const complianceScore = calculateComplianceScore(contentFlags)

    const compliance: ComplianceStatus = {
      overall:
        complianceScore >= 80
          ? 'compliant'
          : complianceScore >= 60
            ? 'requires_review'
            : 'non_compliant',
      score: complianceScore,
      issues: contentFlags
        .filter(f => f.severity === 'high' || f.severity === 'critical')
        .map(f => ({
          id: f.id,
          type: f.type,
          severity: f.severity,
          description: f.description,
          frames: [f.frameTime],
          suggestedAction: getSuggestedAction(f.type, f.severity),
        })),
      passedChecks: contentFlags.filter(f => f.severity === 'low').map(f => f.type),
      failedChecks: contentFlags.filter(f => f.severity !== 'low').map(f => f.type),
    }

    const videoInfo: VideoInfo = {
      fileName: videoFile.name,
      fileSize: videoFile.size,
      duration: Math.max(...analysisResult.analysis_result.map(f => f.frame_time)),
      format: videoFile.type,
    }

    return {
      id: reportId,
      title: `Analysis Report - ${videoFile.name}`,
      status: 'completed',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      videoInfo,
      analysisSummary,
      contentFlags,
      timeline,
      recommendations,
      compliance,
    }
  }

  return {
    transformToReportData,
    getContentCategory,
    getSeverityDescription,
    getContentDescription,
    isBlockingContent,
    generateRecommendations,
    calculateComplianceScore,
  }
}
