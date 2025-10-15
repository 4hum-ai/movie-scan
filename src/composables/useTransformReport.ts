import { computed, type Ref } from 'vue'

// Types for analysis result data structure
export interface AnalysisFrame {
  frame_time: number
  contents: Record<string, number>
}

export interface AnalysisResult {
  analysis_result: AnalysisFrame[]
}

export interface CategoryFrames {
  frame_time: number[]
}

export interface TransformedReport {
  [category: string]: CategoryFrames
}

export interface FrameStatistics {
  totalFrames: number
  emptyFrames: number
  framesWithContent: number
  categories: string[]
  categoryCounts: Record<string, number>
  averageScores: Record<string, number>
}

export interface ExecutiveSummaryItem {
  guideline: string
  scenes: number
  duration: number // in seconds
  percentage: number // percentage of total duration
}

export interface ExecutiveSummary {
  items: ExecutiveSummaryItem[]
  totalScenes: number
  totalDuration: number
  totalPercentage: number
}

export interface DetectedScene {
  id: string
  category: string
  startTime: number
  endTime: number
  duration: number // in seconds
  durationFormatted: string // e.g., "0.5 min"
  frameCount: number
  frameTimes: number[]
}

export interface SceneCluster {
  category: string
  scenes: DetectedScene[]
  totalDuration: number
  totalFrames: number
}

export interface DetectedScenesSummary {
  totalScenes: number
  totalDuration: number
  categories: string[]
  sceneClusters: SceneCluster[]
  timeline: DetectedScene[]
  statistics: {
    avgSceneDuration: number
    maxSceneDuration: number
    minSceneDuration: number
  }
}

/**
 * Composable for transforming analysis report data
 * Provides various utility functions to extract and organize frame data
 */
export function useTransformReport(analysisResult: Ref<AnalysisResult> | AnalysisResult) {
  // Convert to reactive reference if needed
  const data = computed(() => {
    return 'value' in analysisResult ? analysisResult.value : analysisResult
  })

  /**
   * Get frames with empty contents
   */
  const getEmptyFrames = computed((): CategoryFrames => {
    const emptyFrames = data.value.analysis_result
      .filter((frame) => Object.keys(frame.contents).length === 0)
      .map((frame) => frame.frame_time)

    return {
      frame_time: emptyFrames,
    }
  })

  /**
   * Get frames that contain a specific category
   */
  const getFramesByCategory = (category: string): CategoryFrames => {
    const frames = data.value.analysis_result
      .filter((frame) => Object.prototype.hasOwnProperty.call(frame.contents, category))
      .map((frame) => frame.frame_time)

    return {
      frame_time: frames,
    }
  }

  /**
   * Get frames where a specific category exceeds a threshold
   */
  const getFramesByThreshold = (category: string, threshold: number = 0.5): CategoryFrames => {
    const frames = data.value.analysis_result
      .filter(
        (frame) =>
          Object.prototype.hasOwnProperty.call(frame.contents, category) &&
          frame.contents[category] > threshold,
      )
      .map((frame) => frame.frame_time)

    return {
      frame_time: frames,
    }
  }

  /**
   * Group all frames by their categories
   */
  const groupFramesByCategory = computed((): TransformedReport => {
    const result: TransformedReport = {}

    // Add empty frames
    result.empty = getEmptyFrames.value

    // Get all unique categories
    const allCategories = new Set<string>()
    data.value.analysis_result.forEach((frame) => {
      Object.keys(frame.contents).forEach((category) => {
        allCategories.add(category)
      })
    })

    // Group frames by each category
    allCategories.forEach((category) => {
      result[category] = getFramesByCategory(category)
    })

    return result
  })

  /**
   * Get comprehensive statistics about the frames
   */
  const getFrameStatistics = computed((): FrameStatistics => {
    const frames = data.value.analysis_result
    const totalFrames = frames.length
    const emptyFrames = frames.filter((frame) => Object.keys(frame.contents).length === 0).length
    const framesWithContent = totalFrames - emptyFrames

    // Get all categories
    const categories = new Set<string>()
    frames.forEach((frame) => {
      Object.keys(frame.contents).forEach((category) => {
        categories.add(category)
      })
    })

    // Count frames per category
    const categoryCounts: Record<string, number> = {}
    const categoryScores: Record<string, number[]> = {}

    categories.forEach((category) => {
      categoryCounts[category] = 0
      categoryScores[category] = []
    })

    frames.forEach((frame) => {
      Object.entries(frame.contents).forEach(([category, score]) => {
        categoryCounts[category]++
        categoryScores[category].push(score)
      })
    })

    // Calculate average scores
    const averageScores: Record<string, number> = {}
    Object.entries(categoryScores).forEach(([category, scores]) => {
      averageScores[category] = scores.reduce((sum, score) => sum + score, 0) / scores.length
    })

    return {
      totalFrames,
      emptyFrames,
      framesWithContent,
      categories: Array.from(categories),
      categoryCounts,
      averageScores,
    }
  })

  /**
   * Get frames within a specific time range
   */
  const getFramesInTimeRange = (startTime: number, endTime: number): CategoryFrames => {
    const frames = data.value.analysis_result
      .filter((frame) => frame.frame_time >= startTime && frame.frame_time <= endTime)
      .map((frame) => frame.frame_time)

    return {
      frame_time: frames,
    }
  }

  /**
   * Get frames with multiple categories (complex scenes)
   */
  const getComplexFrames = (minCategories: number = 2): CategoryFrames => {
    const frames = data.value.analysis_result
      .filter((frame) => Object.keys(frame.contents).length >= minCategories)
      .map((frame) => frame.frame_time)

    return {
      frame_time: frames,
    }
  }

  /**
   * Get top N frames with highest scores for a specific category
   */
  const getTopFrames = (
    category: string,
    limit: number = 10,
  ): Array<{ frame_time: number; score: number }> => {
    return data.value.analysis_result
      .filter((frame) => Object.prototype.hasOwnProperty.call(frame.contents, category))
      .map((frame) => ({
        frame_time: frame.frame_time,
        score: frame.contents[category],
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  /**
   * Get frames grouped by score ranges
   */
  const getFramesByScoreRange = (
    category: string,
    ranges: Array<{ min: number; max: number; label: string }>,
  ) => {
    const result: Record<string, CategoryFrames> = {}

    ranges.forEach((range) => {
      const frames = data.value.analysis_result
        .filter(
          (frame) =>
            Object.prototype.hasOwnProperty.call(frame.contents, category) &&
            frame.contents[category] >= range.min &&
            frame.contents[category] <= range.max,
        )
        .map((frame) => frame.frame_time)

      result[range.label] = { frame_time: frames }
    })

    return result
  }

  /**
   * Calculate duration for a category based on frame times
   */
  const calculateCategoryDuration = (frameTimes: number[]): number => {
    if (frameTimes.length === 0) return 0

    // Sort frame times
    const sortedFrames = [...frameTimes].sort((a, b) => a - b)

    // Calculate total duration by summing intervals between consecutive frames
    let totalDuration = 0
    for (let i = 0; i < sortedFrames.length - 1; i++) {
      const interval = sortedFrames[i + 1] - sortedFrames[i]
      // Assume each frame represents 1 second, or use actual frame interval
      totalDuration += Math.min(interval, 1) // Cap at 1 second per frame
    }

    // Add duration for the last frame
    if (sortedFrames.length > 0) {
      totalDuration += 1 // Last frame duration
    }

    return totalDuration
  }

  /**
   * Get total video duration
   */
  const getTotalDuration = computed((): number => {
    const frames = data.value.analysis_result
    if (frames.length === 0) return 0
    return Math.max(...frames.map((frame) => frame.frame_time))
  })

  /**
   * Get executive summary with duration and percentage calculations
   */
  const getExecutiveSummary = computed((): ExecutiveSummary => {
    const stats = getFrameStatistics.value
    const grouped = groupFramesByCategory.value
    const totalDuration = getTotalDuration.value

    const items: ExecutiveSummaryItem[] = stats.categories.map((category) => {
      const frameTimes = grouped[category].frame_time
      const duration = calculateCategoryDuration(frameTimes)
      const percentage = totalDuration > 0 ? (duration / totalDuration) * 100 : 0

      return {
        guideline: category,
        scenes: stats.categoryCounts[category],
        duration,
        percentage,
      }
    })

    // Sort by duration (descending)
    items.sort((a, b) => b.duration - a.duration)

    const totalScenes = items.reduce((sum, item) => sum + item.scenes, 0)
    const totalDurationSum = items.reduce((sum, item) => sum + item.duration, 0)
    const totalPercentage = items.reduce((sum, item) => sum + item.percentage, 0)

    return {
      items,
      totalScenes,
      totalDuration: totalDurationSum,
      totalPercentage,
    }
  })

  /**
   * Get formatted executive summary for display
   */
  const getFormattedExecutiveSummary = computed(() => {
    const summary = getExecutiveSummary.value

    return {
      ...summary,
      items: summary.items.map((item) => ({
        ...item,
        durationFormatted: `${(item.duration / 60).toFixed(1)}m`, // Convert to minutes
        percentageFormatted: `${item.percentage.toFixed(1)}%`,
      })),
    }
  })

  /**
   * Detect continuous scenes for a specific category
   */
  const detectScenesForCategory = (
    category: string,
    minThreshold: number = 0.5,
    maxGap: number = 5,
  ): DetectedScene[] => {
    const frames = data.value.analysis_result
      .filter(
        (frame) =>
          Object.prototype.hasOwnProperty.call(frame.contents, category) &&
          frame.contents[category] > minThreshold,
      )
      .sort((a, b) => a.frame_time - b.frame_time)

    if (frames.length === 0) return []

    const scenes: DetectedScene[] = []
    let currentScene: {
      startTime: number
      endTime: number
      frameTimes: number[]
      scores: number[]
    } | null = null

    frames.forEach((frame) => {
      const frameTime = frame.frame_time
      const score = frame.contents[category]

      if (!currentScene) {
        // Start new scene
        currentScene = {
          startTime: frameTime,
          endTime: frameTime,
          frameTimes: [frameTime],
          scores: [score],
        }
      } else {
        const timeGap = frameTime - currentScene.endTime

        if (timeGap <= maxGap) {
          // Continue current scene
          currentScene.endTime = frameTime
          currentScene.frameTimes.push(frameTime)
          currentScene.scores.push(score)
        } else {
          // End current scene and start new one
          scenes.push(createDetectedScene(category, currentScene))
          currentScene = {
            startTime: frameTime,
            endTime: frameTime,
            frameTimes: [frameTime],
            scores: [score],
          }
        }
      }
    })

    // Add the last scene
    if (currentScene) {
      scenes.push(createDetectedScene(category, currentScene))
    }

    return scenes
  }

  /**
   * Helper function to create DetectedScene object
   */
  const createDetectedScene = (
    category: string,
    sceneData: {
      startTime: number
      endTime: number
      frameTimes: number[]
      scores: number[]
    },
  ): DetectedScene => {
    const duration = sceneData.endTime - sceneData.startTime

    return {
      id: `${category}_${sceneData.startTime}_${sceneData.endTime}`,
      category,
      startTime: sceneData.startTime,
      endTime: sceneData.endTime,
      duration,
      durationFormatted: `${(duration / 60).toFixed(1)} min`,
      frameCount: sceneData.frameTimes.length,
      frameTimes: sceneData.frameTimes,
    }
  }

  /**
   * Get all detected scenes across all categories
   */
  const getDetectedScenes = (minThreshold: number = 0.5, maxGap: number = 5): DetectedScene[] => {
    const stats = getFrameStatistics.value
    const allScenes: DetectedScene[] = []

    stats.categories.forEach((category) => {
      const scenes = detectScenesForCategory(category, minThreshold, maxGap)
      allScenes.push(...scenes)
    })

    // Sort by start time
    return allScenes.sort((a, b) => a.startTime - b.startTime)
  }

  /**
   * Get detected scenes summary with clustering
   */
  const getDetectedScenesSummary = (
    minThreshold: number = 0.5,
    maxGap: number = 5,
  ): DetectedScenesSummary => {
    const allScenes = getDetectedScenes(minThreshold, maxGap)
    const stats = getFrameStatistics.value

    // Group scenes by category
    const sceneClusters: SceneCluster[] = stats.categories
      .map((category) => {
        const categoryScenes = allScenes.filter((scene) => scene.category === category)
        const totalDuration = categoryScenes.reduce((sum, scene) => sum + scene.duration, 0)
        const totalFrames = categoryScenes.reduce((sum, scene) => sum + scene.frameCount, 0)

        return {
          category,
          scenes: categoryScenes,
          totalDuration,
          totalFrames,
        }
      })
      .filter((cluster) => cluster.scenes.length > 0)

    // Calculate statistics
    const durations = allScenes.map((scene) => scene.duration)
    const totalDuration = allScenes.reduce((sum, scene) => sum + scene.duration, 0)

    return {
      totalScenes: allScenes.length,
      totalDuration,
      categories: stats.categories,
      sceneClusters,
      timeline: allScenes,
      statistics: {
        avgSceneDuration:
          durations.length > 0 ? durations.reduce((sum, d) => sum + d, 0) / durations.length : 0,
        maxSceneDuration: durations.length > 0 ? Math.max(...durations) : 0,
        minSceneDuration: durations.length > 0 ? Math.min(...durations) : 0,
      },
    }
  }

  return {
    // Data
    data,

    // Basic transforms
    getEmptyFrames,
    getFramesByCategory,
    getFramesByThreshold,
    groupFramesByCategory,

    // Statistics
    getFrameStatistics,

    // Advanced transforms
    getFramesInTimeRange,
    getComplexFrames,
    getTopFrames,
    getFramesByScoreRange,

    // Executive Summary functions
    getTotalDuration,
    getExecutiveSummary,
    getFormattedExecutiveSummary,

    // Detected Scenes functions
    detectScenesForCategory,
    getDetectedScenes,
    getDetectedScenesSummary,
  }
}
