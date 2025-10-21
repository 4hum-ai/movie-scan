<template>
  <div class="container mx-auto space-y-6 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Video Sprite Generator</h1>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Generate screenshots from video at specific timestamps
      </div>
    </div>

    <!-- Input Section -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Video URL Input -->
      <div class="space-y-4">
        <div>
          <label
            for="videoUrl"
            class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Video URL
          </label>
          <input
            id="videoUrl"
            v-model="videoUrl"
            type="url"
            placeholder="Enter video URL (mp4, webm, m3u8, etc.)"
            class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            :class="{ 'border-red-500': videoUrlError }"
          />
          <p v-if="videoUrlError" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ videoUrlError }}
          </p>
        </div>

        <!-- Timestamps Input -->
        <div>
          <label
            for="timestamps"
            class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Timestamps (seconds)
          </label>
          <textarea
            id="timestamps"
            v-model="timestampsInput"
            placeholder="Enter timestamps separated by commas (e.g., 10, 30, 60, 120)"
            rows="4"
            class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            :class="{ 'border-red-500': timestampsError }"
          />
          <p v-if="timestampsError" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ timestampsError }}
          </p>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enter timestamps in seconds (e.g., 10, 30, 60) or time format (e.g., 0:10, 0:30, 1:00)
          </p>
        </div>

        <!-- Generate Button -->
        <button
          @click="generateScreenshots"
          :disabled="!canGenerate || isGenerating"
          class="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          <span v-if="isGenerating" class="flex items-center justify-center gap-2">
            <div
              class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            ></div>
            Generating Screenshots...
          </span>
          <span v-else>Generate Screenshots</span>
        </button>
      </div>

      <!-- Video Player -->
      <div class="space-y-4">
        <div v-if="videoUrl && !videoError" class="relative">
          <VideoPlayer ref="videoPlayerRef" :url="videoUrl" mode="inline" @error="onVideoError" />
        </div>

        <!-- Video Error -->
        <div
          v-if="videoError"
          class="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
        >
          <div class="flex items-center gap-2 text-red-800 dark:text-red-200">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="font-medium">Video Error</span>
          </div>
          <p class="mt-1 text-sm text-red-700 dark:text-red-300">{{ videoError }}</p>
        </div>

        <!-- Video Placeholder -->
        <div
          v-if="!videoUrl"
          class="flex aspect-video items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800"
        >
          <div class="text-center text-gray-500 dark:text-gray-400">
            <svg
              class="mx-auto mb-2 h-12 w-12"
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
            <p>Enter a video URL to preview</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Screenshots Section -->
    <div v-if="screenshots.length > 0" class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Generated Screenshots ({{ screenshots.length }})
        </h2>
        <button
          @click="clearScreenshots"
          class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Clear All
        </button>
      </div>

      <!-- Screenshots Grid -->
      <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        <div
          v-for="(screenshot, index) in screenshots"
          :key="index"
          class="group relative cursor-pointer"
          @click="seekToTimestamp(screenshot.timestamp)"
        >
          <div
            class="aspect-video overflow-hidden rounded-lg border-2 border-transparent bg-gray-100 transition-colors group-hover:border-blue-500 dark:bg-gray-800"
          >
            <img
              :src="screenshot.dataUrl"
              :alt="`Screenshot at ${formatTime(screenshot.timestamp)}`"
              class="h-full w-full object-cover"
            />
          </div>
          <div
            class="absolute right-0 bottom-0 left-0 bg-black/70 p-1 text-center text-xs text-white"
          >
            {{ formatTime(screenshot.timestamp) }}
          </div>
          <div class="absolute top-1 right-1 rounded bg-blue-600 px-1 py-0.5 text-xs text-white">
            {{ index + 1 }}
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!isGenerating && videoUrl" class="py-12 text-center">
      <svg
        class="mx-auto mb-4 h-16 w-16 text-gray-400 dark:text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-white">
        No Screenshots Generated
      </h3>
      <p class="text-gray-500 dark:text-gray-400">
        Enter timestamps and click "Generate Screenshots" to create video thumbnails
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import VideoPlayer from '@/components/organisms/VideoPlayer.vue'
import { useToast } from '@/composables'

interface Screenshot {
  timestamp: number
  dataUrl: string
}

// Composables
const { push: showToast } = useToast()

// Refs
const videoPlayerRef = ref<InstanceType<typeof VideoPlayer>>()
const videoUrl = ref(
  'https://storage.googleapis.com/movie-dubie-studio-dev/media_1758721594460_yr6npxyq6/master.m3u8',
)
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
        showToast({
          body: `Timestamp ${formatTime(timestamp)} exceeds video duration (${formatTime(duration)})`,
          type: 'warning',
          id: `warning-${timestamp}`,
          position: 'tr',
        })
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

    showToast({
      body: `Generated ${screenshots.value.length} screenshots successfully`,
      type: 'success',
      id: 'screenshots-success',
      position: 'tr',
    })
  } catch (error) {
    console.error('Error generating screenshots:', error)
    showToast({
      body: `Failed to generate screenshots: ${error instanceof Error ? error.message : 'Unknown error'}`,
      type: 'error',
      id: 'screenshots-error',
      position: 'tr',
    })
  } finally {
    isGenerating.value = false
  }
}

const seekToTimestamp = (timestamp: number) => {
  if (!videoPlayerRef.value) return

  const videoElement = videoPlayerRef.value.$refs?.videoRef as HTMLVideoElement
  if (videoElement) {
    videoElement.currentTime = timestamp
    showToast({
      body: `Seeking to ${formatTime(timestamp)}`,
      type: 'info',
      id: `seek-${timestamp}`,
      position: 'tr',
    })
  }
}

const clearScreenshots = () => {
  screenshots.value = []
  showToast({
    body: 'Screenshots cleared',
    type: 'info',
    id: 'screenshots-cleared',
    position: 'tr',
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
