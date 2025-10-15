import { readFileSync } from 'fs'

// Simple implementation of useTransformReport functions for testing
class TransformReport {
  constructor(analysisResult) {
    this.data = analysisResult
  }

  // Get frames with empty contents
  getEmptyFrames() {
    const emptyFrames = this.data.analysis_result
      .filter((frame) => Object.keys(frame.contents).length === 0)
      .map((frame) => frame.frame_time)

    return {
      frame_time: emptyFrames,
    }
  }

  // Get frames that contain a specific category
  getFramesByCategory(category) {
    const frames = this.data.analysis_result
      .filter((frame) => Object.prototype.hasOwnProperty.call(frame.contents, category))
      .map((frame) => frame.frame_time)

    return {
      frame_time: frames,
    }
  }

  // Get frames where a specific category exceeds a threshold
  getFramesByThreshold(category, threshold = 0.5) {
    const frames = this.data.analysis_result
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

  // Group all frames by their categories
  groupFramesByCategory() {
    const result = {}

    // Add empty frames
    result.empty = this.getEmptyFrames()

    // Get all unique categories
    const allCategories = new Set()
    this.data.analysis_result.forEach((frame) => {
      Object.keys(frame.contents).forEach((category) => {
        allCategories.add(category)
      })
    })

    // Group frames by each category
    allCategories.forEach((category) => {
      result[category] = this.getFramesByCategory(category)
    })

    return result
  }

  // Get comprehensive statistics about the frames
  getFrameStatistics() {
    const frames = this.data.analysis_result
    const totalFrames = frames.length
    const emptyFrames = frames.filter((frame) => Object.keys(frame.contents).length === 0).length
    const framesWithContent = totalFrames - emptyFrames

    // Get all categories
    const categories = new Set()
    frames.forEach((frame) => {
      Object.keys(frame.contents).forEach((category) => {
        categories.add(category)
      })
    })

    // Count frames per category
    const categoryCounts = {}
    const categoryScores = {}

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
    const averageScores = {}
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
  }

  // Get frames within a specific time range
  getFramesInTimeRange(startTime, endTime) {
    const frames = this.data.analysis_result
      .filter((frame) => frame.frame_time >= startTime && frame.frame_time <= endTime)
      .map((frame) => frame.frame_time)

    return {
      frame_time: frames,
    }
  }

  // Get frames with multiple categories (complex scenes)
  getComplexFrames(minCategories = 2) {
    const frames = this.data.analysis_result
      .filter((frame) => Object.keys(frame.contents).length >= minCategories)
      .map((frame) => frame.frame_time)

    return {
      frame_time: frames,
    }
  }

  // Get top N frames with highest scores for a specific category
  getTopFrames(category, limit = 10) {
    return this.data.analysis_result
      .filter((frame) => Object.prototype.hasOwnProperty.call(frame.contents, category))
      .map((frame) => ({
        frame_time: frame.frame_time,
        score: frame.contents[category],
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  // Get frames grouped by score ranges
  getFramesByScoreRange(category, ranges) {
    const result = {}

    ranges.forEach((range) => {
      const frames = this.data.analysis_result
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

  // NEW FUNCTIONS - Executive Summary
  calculateCategoryDuration(frameTimes) {
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

  getTotalDuration() {
    const frames = this.data.analysis_result
    if (frames.length === 0) return 0
    return Math.max(...frames.map((frame) => frame.frame_time))
  }

  getExecutiveSummary() {
    const stats = this.getFrameStatistics()
    const grouped = this.groupFramesByCategory()
    const totalDuration = this.getTotalDuration()

    const items = stats.categories.map((category) => {
      const frameTimes = grouped[category].frame_time
      const duration = this.calculateCategoryDuration(frameTimes)
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
  }

  getFormattedExecutiveSummary() {
    const summary = this.getExecutiveSummary()

    return {
      ...summary,
      items: summary.items.map((item) => ({
        ...item,
        durationFormatted: `${(item.duration / 60).toFixed(1)}m`, // Convert to minutes
        percentageFormatted: `${item.percentage.toFixed(1)}%`,
      })),
    }
  }

  // NEW FUNCTIONS - Detected Scenes
  detectScenesForCategory(category, minThreshold = 0.5, maxGap = 5) {
    const frames = this.data.analysis_result
      .filter(
        (frame) =>
          Object.prototype.hasOwnProperty.call(frame.contents, category) &&
          frame.contents[category] > minThreshold,
      )
      .sort((a, b) => a.frame_time - b.frame_time)

    if (frames.length === 0) return []

    const scenes = []
    let currentScene = null

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
          scenes.push(this.createDetectedScene(category, currentScene))
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
      scenes.push(this.createDetectedScene(category, currentScene))
    }

    return scenes
  }

  createDetectedScene(category, sceneData) {
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

  getDetectedScenes(minThreshold = 0.5, maxGap = 5) {
    const stats = this.getFrameStatistics()
    const allScenes = []

    stats.categories.forEach((category) => {
      const scenes = this.detectScenesForCategory(category, minThreshold, maxGap)
      allScenes.push(...scenes)
    })

    // Sort by start time
    return allScenes.sort((a, b) => a.startTime - b.startTime)
  }

  getDetectedScenesSummary(minThreshold = 0.5, maxGap = 5) {
    const allScenes = this.getDetectedScenes(minThreshold, maxGap)
    const stats = this.getFrameStatistics()

    // Group scenes by category
    const sceneClusters = stats.categories
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
}

// Main execution
async function main() {
  try {
    console.log('🎬 Loading The Piano (1993) analysis data...')

    // Load the JSON data
    const jsonData = JSON.parse(readFileSync('./result_The_Piano_1993.json', 'utf8'))

    // Create transform report instance
    const transformReport = new TransformReport(jsonData)

    console.log('✅ Data loaded successfully!')
    console.log('📊 Total frames:', jsonData.analysis_result.length)

    // Test basic functions
    console.log('\n📈 Frame Statistics:')
    const stats = transformReport.getFrameStatistics()
    console.log(`- Total frames: ${stats.totalFrames}`)
    console.log(`- Empty frames: ${stats.emptyFrames}`)
    console.log(`- Frames with content: ${stats.framesWithContent}`)
    console.log(`- Categories found: ${stats.categories.length}`)

    console.log('\n🔍 Top Categories by Count:')
    Object.entries(stats.categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .forEach(([category, count]) => {
        console.log(`- ${category}: ${count} frames`)
      })

    console.log('\n📊 Top Categories by Average Score:')
    Object.entries(stats.averageScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .forEach(([category, avgScore]) => {
        console.log(`- ${category}: ${avgScore.toFixed(6)}`)
      })

    console.log('\n🚫 Empty Frames (first 10):')
    const emptyFrames = transformReport.getEmptyFrames()
    console.log(emptyFrames.frame_time.slice(0, 10))

    console.log('\n🔥 NSFW Frames (first 10):')
    const nsfwFrames = transformReport.getFramesByCategory('general_nsfw')
    console.log(nsfwFrames.frame_time.slice(0, 10))

    console.log('\n⚠️ High NSFW Frames (>0.99, first 10):')
    const highNsfwFrames = transformReport.getFramesByThreshold('general_nsfw', 0.99)
    console.log(highNsfwFrames.frame_time.slice(0, 10))

    console.log('\n🏆 Top 5 NSFW Frames:')
    const topNsfwFrames = transformReport.getTopFrames('general_nsfw', 5)
    topNsfwFrames.forEach((frame, index) => {
      console.log(`${index + 1}. Frame ${frame.frame_time}: ${frame.score.toFixed(6)}`)
    })

    console.log('\n🎭 Complex Frames (3+ categories):')
    const complexFrames = transformReport.getComplexFrames(3)
    console.log(`- Found ${complexFrames.frame_time.length} complex frames`)
    console.log(`- First 5: ${complexFrames.frame_time.slice(0, 5).join(', ')}`)

    console.log('\n⏰ Frames in time range 3600-3700:')
    const framesInRange = transformReport.getFramesInTimeRange(3600, 3700)
    console.log(framesInRange.frame_time)

    console.log('\n📋 Sample Grouped Data:')
    const grouped = transformReport.groupFramesByCategory()
    Object.entries(grouped).forEach(([category, data]) => {
      console.log(`${category}: ${data.frame_time.length} frames`)
      if (data.frame_time.length > 0) {
        console.log(`  First few: ${data.frame_time.slice(0, 3).join(', ')}`)
      }
    })

    // Test new Executive Summary functions
    console.log('\n📊 Executive Summary:')
    const executiveSummary = transformReport.getExecutiveSummary()
    console.log(`- Total Scenes: ${executiveSummary.totalScenes}`)
    console.log(`- Total Duration: ${(executiveSummary.totalDuration / 60).toFixed(1)}m`)
    console.log(`- Total Percentage: ${executiveSummary.totalPercentage.toFixed(1)}%`)

    console.log('\n📈 Top 5 Categories by Duration:')
    executiveSummary.items.slice(0, 5).forEach((item, index) => {
      console.log(
        `${index + 1}. ${item.guideline}: ${item.scenes} scenes, ${(item.duration / 60).toFixed(1)}m (${item.percentage.toFixed(1)}%)`,
      )
    })

    console.log('\n🎯 Formatted Executive Summary:')
    const formattedSummary = transformReport.getFormattedExecutiveSummary()
    formattedSummary.items.slice(0, 3).forEach((item) => {
      console.log(
        `- ${item.guideline}: ${item.scenes} scenes, ${item.durationFormatted}, ${item.percentageFormatted}`,
      )
    })

    console.log('\n⏱️ Total Video Duration:')
    const totalDuration = transformReport.getTotalDuration()
    console.log(
      `- Duration: ${Math.floor(totalDuration / 60)}:${Math.floor(totalDuration % 60)
        .toString()
        .padStart(2, '0')}`,
    )

    // Test new Detected Scenes functions
    console.log('\n🎬 Detected Scenes:')
    const detectedScenes = transformReport.getDetectedScenes(0.7, 10) // threshold 0.7, max gap 10s
    console.log(`- Total scenes detected: ${detectedScenes.length}`)

    console.log('\n📋 First 5 Detected Scenes:')
    detectedScenes.slice(0, 5).forEach((scene, index) => {
      const startTime = `${Math.floor(scene.startTime / 60)}:${Math.floor(scene.startTime % 60)
        .toString()
        .padStart(2, '0')}`
      const endTime = `${Math.floor(scene.endTime / 60)}:${Math.floor(scene.endTime % 60)
        .toString()
        .padStart(2, '0')}`
      console.log(
        `${index + 1}. ${startTime} - ${endTime} | ${scene.category} | ${scene.durationFormatted} | ${scene.frameCount} frames`,
      )
    })

    console.log('\n📊 Detected Scenes Summary:')
    const scenesSummary = transformReport.getDetectedScenesSummary(0.7, 10)
    console.log(`- Total scenes: ${scenesSummary.totalScenes}`)
    console.log(`- Total duration: ${(scenesSummary.totalDuration / 60).toFixed(1)}m`)
    console.log(
      `- Average scene duration: ${(scenesSummary.statistics.avgSceneDuration / 60).toFixed(1)}m`,
    )
    console.log(
      `- Max scene duration: ${(scenesSummary.statistics.maxSceneDuration / 60).toFixed(1)}m`,
    )

    console.log('\n📈 Scene Clusters by Category:')
    scenesSummary.sceneClusters.slice(0, 3).forEach((cluster) => {
      console.log(
        `- ${cluster.category}: ${cluster.scenes.length} scenes, ${(cluster.totalDuration / 60).toFixed(1)}m total`,
      )
    })

    console.log('\n✅ All tests completed successfully!')
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Run the main function
main()
