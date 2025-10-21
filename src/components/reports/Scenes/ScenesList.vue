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
      <VideoPlayer ref="videoPlayerRef" :url="videoUrl" mode="inline" @error="onVideoError" />
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
    for (const timestamp of timestamps) {
      if (timestamp > duration) {
        console.warn(
          `Timestamp ${formatTime(timestamp)} exceeds video duration (${formatTime(duration)})`,
        )
        continue
      }

      // Seek to timestamp
      videoElement.currentTime = timestamp

      // Wait for seek to complete
      await new Promise((resolve) => {
        const onSeeked = () => {
          videoElement.removeEventListener('seeked', onSeeked)
          resolve(true)
        }
        videoElement.addEventListener('seeked', onSeeked)
      })

      // Wait a bit more for frame to be ready
      await new Promise((resolve) => setTimeout(resolve, 100))

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
    }

    // Screenshots generated successfully
  } catch (error) {
    console.error('Error generating screenshots:', error)
  } finally {
    isGenerating.value = false
  }
}

// Removed unused functions

// Get screenshots for a specific scene based on its time range
const getScreenshotsForScene = (scene: ReportScene) => {
  if (!screenshots.value.length) return []

  const sceneStart = parseMicros(scene.startTime) / 1_000_000
  const sceneEnd = parseMicros(scene.endTime) / 1_000_000

  return screenshots.value.filter((screenshot) => {
    return screenshot.timestamp >= sceneStart && screenshot.timestamp <= sceneEnd
  })
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }
}

const onVideoError = (error: string) => {
  videoError.value = error
}

// Parse microsecond timestamp safely
const parseMicros = (value: string | number): number => {
  const n = typeof value === 'string' ? Number(value) : value
  return Number.isFinite(n) ? n : 0
}

// Auto generate screenshots from scene data
const autoGenerateScreenshots = async () => {
  if (!props.videoUrl || isGenerating.value || !props.scenes.length) return

  // Wait a bit for video to load
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Extract timestamps from all scenes
  const allTimestamps: number[] = []

  props.scenes.forEach((scene) => {
    if (scene.screenshots && scene.screenshots.length > 0) {
      // Convert microsecond timestamps to seconds
      scene.screenshots.forEach((microsTimestamp) => {
        const seconds = parseMicros(microsTimestamp) / 1_000_000
        if (seconds > 0) {
          allTimestamps.push(seconds)
        }
      })
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
    if (newUrl) {
      videoUrl.value = newUrl
      videoError.value = ''
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
  () => {
    if (props.videoUrl && props.scenes.length > 0) {
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
