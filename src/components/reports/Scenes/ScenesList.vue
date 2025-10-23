<template>
  <div>
    <div class="mb-6 flex items-center">
      <div class="flex-shrink-0">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
          <svg
            class="h-5 w-5 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
      <div class="ml-3">
        <h3 class="text-lg font-semibold text-gray-900">Detected Scenes</h3>
        <p class="text-sm text-gray-500">Detailed analysis of content violations</p>
      </div>
    </div>

    <!-- Hidden Video Player for Screenshot Generation -->
    <div v-if="videoUrl" class="hidden">
      <VideoPlayer
        ref="videoPlayerRef"
        :url="videoUrl"
        mode="inline"
        :autoplay="false"
        @error="onVideoError"
      />
    </div>

    <div class="space-y-6">
      <SceneCard
        v-for="s in scenes"
        :key="s.startTime"
        :scene="s"
        :screenshots="getScreenshotsForScene(s)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SceneCard from './SceneCard.vue'
import type { ReportScene } from '@/composables'
import { formatTime } from '@/utils/formatters'

import { ref, computed, watch } from 'vue'
import VideoPlayer from '@/components/organisms/VideoPlayer.vue'

interface Screenshot {
  timestamp: number
  dataUrl: string
}

interface Props {
  scenes: ReportScene[]
  videoUrl?: string
}
const props = defineProps<Props>()

// Refs
const videoPlayerRef = ref<InstanceType<typeof VideoPlayer>>()
const videoUrl = ref(props.videoUrl || '')
const timestampsInput = ref('0:05,0:10,0:15,0:20,0:25')
const screenshots = ref<Screenshot[]>([])
const isGenerating = ref(false)
const videoError = ref('')
const hasGeneratedScreenshots = ref(false)

// Validation
const videoUrlError = ref('')
const timestampsError = ref('')

// Computed
const canGenerate = computed(() => {
  return (
    videoUrl.value.trim() &&
    timestampsInput.value.trim() &&
    !videoUrlError.value &&
    !timestampsError.value &&
    !isGenerating.value
  )
})

// Methods
const validateVideoUrl = (url: string): boolean => {
  if (!url.trim()) {
    videoUrlError.value = 'Video URL is required'
    return false
  }

  try {
    new URL(url)
    videoUrlError.value = ''
    return true
  } catch {
    videoUrlError.value = 'Please enter a valid URL'
    return false
  }
}

const parseTimestamps = (input: string): number[] => {
  if (!input.trim()) {
    timestampsError.value = 'Timestamps are required'
    return []
  }

  const timestamps: number[] = []
  const parts = input.split(',').map((part) => part.trim())

  for (const part of parts) {
    if (!part) continue

    // Try to parse as time format (MM:SS or HH:MM:SS)
    if (part.includes(':')) {
      const timeParts = part.split(':').map((p) => parseInt(p.trim()))
      if (timeParts.length === 2) {
        // MM:SS format
        const seconds = timeParts[0] * 60 + timeParts[1]
        if (!isNaN(seconds) && seconds >= 0) {
          timestamps.push(seconds)
          continue
        }
      } else if (timeParts.length === 3) {
        // HH:MM:SS format
        const seconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2]
        if (!isNaN(seconds) && seconds >= 0) {
          timestamps.push(seconds)
          continue
        }
      }
    } else {
      // Try to parse as seconds
      const seconds = parseFloat(part)
      if (!isNaN(seconds) && seconds >= 0) {
        timestamps.push(seconds)
        continue
      }
    }

    timestampsError.value = `Invalid timestamp format: "${part}". Use seconds (e.g., 10) or time format (e.g., 0:10, 1:30)`
    return []
  }

  if (timestamps.length === 0) {
    timestampsError.value = 'No valid timestamps found'
    return []
  }

  // Sort and remove duplicates
  const uniqueTimestamps = [...new Set(timestamps)].sort((a, b) => a - b)
  timestampsError.value = ''
  return uniqueTimestamps
}

const generateScreenshots = async () => {
  if (!canGenerate.value) return

  // Validate inputs
  if (!validateVideoUrl(videoUrl.value)) return
  const timestamps = parseTimestamps(timestampsInput.value)
  if (timestamps.length === 0) return

  isGenerating.value = true
  screenshots.value = []

  try {
    // Get the video element from VideoPlayer
    const videoElement = videoPlayerRef.value?.$refs?.videoRef as HTMLVideoElement
    if (!videoElement) {
      throw new Error('Video element not found')
    }

    // Ensure video is muted for screenshot generation
    videoElement.muted = true
    videoElement.volume = 0

    // Wait for video to be ready
    if (videoElement.readyState < 2) {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Video loading timeout')), 10000)
        videoElement.addEventListener(
          'loadeddata',
          () => {
            clearTimeout(timeout)
            resolve(true)
          },
          { once: true },
        )
        videoElement.addEventListener(
          'error',
          () => {
            clearTimeout(timeout)
            reject(new Error('Video failed to load'))
          },
          { once: true },
        )
      })
    }

    const duration = videoElement.duration
    if (!duration || isNaN(duration)) {
      throw new Error('Video duration not available')
    }

    // Generate screenshots for each timestamp
    for (let i = 0; i < timestamps.length; i++) {
      const timestamp = timestamps[i]

      if (timestamp > duration) {
        console.warn(
          `Timestamp ${formatTime(timestamp)} exceeds video duration (${formatTime(duration)}) - skipping`,
        )
        continue
      }

      try {
        // Seek to timestamp
        videoElement.currentTime = timestamp

        // Wait for seek to complete
        await new Promise((resolve, reject) => {
          const seekTimeout = setTimeout(() => {
            reject(new Error('Seek timeout'))
          }, 3000)

          const onSeeked = () => {
            clearTimeout(seekTimeout)
            videoElement.removeEventListener('seeked', onSeeked)
            resolve(true)
          }
          videoElement.addEventListener('seeked', onSeeked)
        })

        // Wait a bit more for frame to be ready
        await new Promise((resolve) => setTimeout(resolve, 200))

        // Capture screenshot
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          throw new Error('Canvas context not available')
        }

        canvas.width = videoElement.videoWidth
        canvas.height = videoElement.videoHeight

        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8)

        screenshots.value.push({
          timestamp,
          dataUrl,
        })
      } catch (error) {
        console.error(`Error capturing screenshot ${i + 1} at ${formatTime(timestamp)}:`, error)
      }
    }
  } catch (error) {
    console.error('Error generating screenshots:', error)
  } finally {
    isGenerating.value = false
  }
}

// Removed unused functions

// Get screenshots for a specific scene based on its time range
const getScreenshotsForScene = (scene: ReportScene) => {
  if (!screenshots.value.length) {
    return []
  }

  const sceneStart = scene.startTime / 1000 // Convert milliseconds to seconds
  const sceneEnd = scene.endTime / 1000 // Convert milliseconds to seconds

  const filteredScreenshots = screenshots.value.filter((screenshot) => {
    // Add small tolerance for floating point precision issues
    const tolerance = 1.0 // 1 second tolerance
    const isInRange =
      screenshot.timestamp >= sceneStart - tolerance && screenshot.timestamp <= sceneEnd + tolerance
    return isInRange
  })

  return filteredScreenshots
}

const onVideoError = (error: string) => {
  videoError.value = error
}

// Auto generate screenshots from scene data
const autoGenerateScreenshots = async () => {
  if (
    !props.videoUrl ||
    isGenerating.value ||
    !props.scenes.length ||
    hasGeneratedScreenshots.value
  )
    return

  hasGeneratedScreenshots.value = true

  // Wait a bit for video to load
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Extract timestamps from all scenes with better validation
  const allTimestamps: number[] = []

  props.scenes.forEach((scene) => {
    if (scene.screenshots && scene.screenshots.length > 0) {
      // Convert millisecond timestamps to seconds with validation
      scene.screenshots.forEach((millisTimestamp) => {
        const seconds = millisTimestamp / 1000

        // Validate timestamp
        if (seconds > 0 && !isNaN(seconds) && isFinite(seconds)) {
          allTimestamps.push(seconds)
        } else {
          console.warn(`Invalid timestamp: ${millisTimestamp}ms -> ${seconds}s`)
        }
      })
    }
  })

  // Check if we're missing startTime screenshots for first 4 scenes
  props.scenes.slice(0, 4).forEach((scene) => {
    const sceneStartSeconds = scene.startTime / 1000
    const hasStartTimeScreenshot = allTimestamps.includes(sceneStartSeconds)

    if (!hasStartTimeScreenshot) {
      // Add the missing startTime screenshot
      allTimestamps.push(sceneStartSeconds)
    }
  })

  // Remove duplicates and sort
  const uniqueTimestamps = [...new Set(allTimestamps)].sort((a, b) => a - b)

  if (uniqueTimestamps.length > 0) {
    // Set timestamps from scene data
    timestampsInput.value = uniqueTimestamps.map((ts) => formatTime(ts)).join(',')
    await generateScreenshots()
  }
}

// Watch for props.videoUrl changes
watch(
  () => props.videoUrl,
  (newUrl) => {
    if (newUrl && newUrl !== videoUrl.value) {
      videoUrl.value = newUrl
      videoError.value = ''
      hasGeneratedScreenshots.value = false // Reset flag when video changes
      validateVideoUrl(newUrl)
      // Auto generate screenshots when videoUrl is available
      autoGenerateScreenshots()
    }
  },
  { immediate: true },
)

// Watch for scenes changes to regenerate screenshots
watch(
  () => props.scenes,
  (newScenes) => {
    if (
      props.videoUrl &&
      newScenes.length > 0 &&
      !isGenerating.value &&
      !hasGeneratedScreenshots.value
    ) {
      autoGenerateScreenshots()
    }
  },
  { immediate: true },
)

// Watch for URL changes to clear errors
watch(
  () => videoUrl.value,
  (newUrl) => {
    if (newUrl) {
      videoError.value = ''
      validateVideoUrl(newUrl)
    }
  },
)

// Watch for timestamps changes to clear errors
watch(
  () => timestampsInput.value,
  (newInput) => {
    if (newInput) {
      timestampsError.value = ''
    }
  },
)
</script>
