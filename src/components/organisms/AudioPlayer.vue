<template>
  <div class="relative w-full">
    <!-- Audio Player Container -->
    <div class="overflow-hidden rounded-lg bg-gray-900">
      <!-- Header with title and controls -->
      <div class="flex items-center justify-between bg-gray-800 p-3">
        <div class="flex min-w-0 items-center gap-3">
          <!-- Audio Icon -->
          <div class="flex-shrink-0">
            <MusicIcon class="h-6 w-6 text-gray-300" aria-hidden="true" />
          </div>

          <!-- Title -->
          <div class="min-w-0 flex-1">
            <h3 class="truncate text-sm font-medium text-white">
              {{ title || 'Audio' }}
            </h3>
            <p class="text-xs text-gray-400">
              {{ format || 'Audio file' }}
            </p>
          </div>
        </div>

        <!-- Close button for inline mode -->
        <button
          v-if="mode === 'inline'"
          @click="$emit('close')"
          class="flex-shrink-0 p-1 text-gray-400 transition-colors hover:text-white"
          aria-label="Close audio player"
        >
          <CloseIcon class="h-4 w-4" />
        </button>
      </div>

      <!-- Audio Controls -->
      <div class="space-y-4 p-4">
        <!-- Progress Bar -->
        <div class="space-y-2">
          <div class="flex justify-between text-xs text-gray-400">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
          <div class="relative">
            <div class="h-2 overflow-hidden rounded-full bg-gray-700">
              <div
                class="h-full rounded-full bg-blue-500 transition-all duration-150"
                :style="{ width: `${progressPercent}%` }"
              />
            </div>
            <input
              ref="progressInput"
              type="range"
              min="0"
              :max="duration || 0"
              :value="currentTime"
              step="0.1"
              class="absolute inset-0 h-2 w-full cursor-pointer opacity-0"
              @input="onProgressChange"
              @mousedown="isDragging = true"
              @mouseup="isDragging = false"
            />
          </div>
        </div>

        <!-- Playback Controls -->
        <div class="flex items-center justify-center gap-4">
          <!-- Previous Track (placeholder) -->
          <button
            class="p-2 text-gray-400 transition-colors hover:text-white disabled:opacity-50"
            disabled
            aria-label="Previous track"
          >
            <SkipPreviousIcon class="h-5 w-5" />
          </button>

          <!-- Play/Pause -->
          <button
            @click="togglePlay"
            class="rounded-full bg-blue-600 p-3 text-white transition-colors hover:bg-blue-700"
            aria-label="Play or pause audio"
          >
            <PlayIcon v-if="!isPlaying" class="h-6 w-6" />
            <PauseIcon v-else class="h-6 w-6" />
          </button>

          <!-- Next Track (placeholder) -->
          <button
            class="p-2 text-gray-400 transition-colors hover:text-white disabled:opacity-50"
            disabled
            aria-label="Next track"
          >
            <SkipNextIcon class="h-5 w-5" />
          </button>
        </div>

        <!-- Volume Control -->
        <div class="flex items-center gap-3">
          <VolumeIcon class="h-4 w-4 text-gray-400" />
          <div class="relative flex-1">
            <div class="h-2 overflow-hidden rounded-full bg-gray-700">
              <div
                class="h-full rounded-full bg-gray-500 transition-all duration-150"
                :style="{ width: `${volume * 100}%` }"
              />
            </div>
            <input
              ref="volumeInput"
              type="range"
              min="0"
              max="1"
              step="0.01"
              :value="volume"
              class="absolute inset-0 h-2 w-full cursor-pointer opacity-0"
              @input="onVolumeChange"
            />
          </div>
          <span class="w-8 text-right text-xs text-gray-400">
            {{ Math.round(volume * 100) }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Hidden audio element -->
    <audio
      ref="audioElement"
      :src="cdnAudioUrl"
      :preload="preload"
      @loadedmetadata="onAudioLoaded"
      @timeupdate="onTimeUpdate"
      @ended="onAudioEnded"
      @error="onAudioError"
      @volumechange="onVolumeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useCdn } from '@/composables'
import PlayIcon from '~icons/mdi/play'
import PauseIcon from '~icons/mdi/pause'
import MusicIcon from '~icons/mdi/music-note'
import VolumeIcon from '~icons/mdi/volume-high'
import CloseIcon from '~icons/mdi/close'
import SkipPreviousIcon from '~icons/mdi/skip-previous'
import SkipNextIcon from '~icons/mdi/skip-next'

// Props
interface Props {
  url: string
  title?: string
  mode?: 'inline' | 'minimal'
  autoplay?: boolean
  loop?: boolean
  preload?: 'none' | 'metadata' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'inline',
  autoplay: false,
  loop: false,
  preload: 'metadata',
})

// Emits
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'ended'): void
  (e: 'error', error: string): void
}>()

// CDN composable
const { getCdnUrl } = useCdn()

// Refs
const audioElement = ref<HTMLAudioElement | null>(null)
const progressInput = ref<HTMLInputElement | null>(null)
const volumeInput = ref<HTMLInputElement | null>(null)

// State
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isDragging = ref(false)
const format = ref<string>('')

// Computed
const progressPercent = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

// Transform audio URL to use CDN
const cdnAudioUrl = computed(() => {
  if (!props.url) return ''
  return getCdnUrl(props.url)
})

// Methods
const togglePlay = () => {
  if (!audioElement.value) return

  if (isPlaying.value) {
    audioElement.value.pause()
    emit('pause')
  } else {
    audioElement.value.play()
    emit('play')
  }
}

const onProgressChange = (event: Event) => {
  if (!audioElement.value || isDragging.value) return

  const target = event.target as HTMLInputElement
  const newTime = parseFloat(target.value)
  audioElement.value.currentTime = newTime
  currentTime.value = newTime
}

const onVolumeChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const newVolume = parseFloat(target.value)
  volume.value = newVolume

  if (audioElement.value) {
    audioElement.value.volume = newVolume
  }
}

const onAudioLoaded = () => {
  if (!audioElement.value) return

  duration.value = audioElement.value.duration
  volume.value = audioElement.value.volume

  // Detect format from URL
  const url = props.url.toLowerCase()
  if (url.includes('.mp3')) format.value = 'MP3'
  else if (url.includes('.wav')) format.value = 'WAV'
  else if (url.includes('.aac')) format.value = 'AAC'
  else if (url.includes('.flac')) format.value = 'FLAC'
  else format.value = 'Audio'

  // Autoplay if requested
  if (props.autoplay) {
    audioElement.value.play()
  }
}

const onTimeUpdate = () => {
  if (!audioElement.value) return
  currentTime.value = audioElement.value.currentTime
}

const onAudioEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
  emit('ended')
}

const onAudioError = () => {
  emit('error', 'Failed to load audio file')
}

const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00'

  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Keyboard shortcuts
const onKeyDown = (event: KeyboardEvent) => {
  if (event.target !== document.body) return

  switch (event.code) {
    case 'Space':
      event.preventDefault()
      togglePlay()
      break
    case 'ArrowLeft':
      event.preventDefault()
      if (audioElement.value) {
        audioElement.value.currentTime = Math.max(0, currentTime.value - 10)
      }
      break
    case 'ArrowRight':
      event.preventDefault()
      if (audioElement.value) {
        audioElement.value.currentTime = Math.min(duration.value, currentTime.value + 10)
      }
      break
  }
}

// Watchers
watch(
  () => props.url,
  () => {
    // Reset state when URL changes
    isPlaying.value = false
    currentTime.value = 0
    duration.value = 0
    format.value = ''
  },
)

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>
