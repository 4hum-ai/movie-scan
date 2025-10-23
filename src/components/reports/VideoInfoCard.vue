<template>
  <div class="rounded-lg border bg-white p-6 shadow-sm">
    <h2 class="mb-4 text-lg font-semibold text-gray-900">Video Information</h2>
    <div class="flex items-start space-x-4">
      <img
        v-if="media?.thumbnailUrl"
        :src="media.thumbnailUrl"
        :alt="media.fileName"
        class="h-24 w-32 rounded object-cover"
      />
      <div v-else class="flex h-24 w-32 items-center justify-center rounded bg-gray-200">
        <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </div>
      <div class="flex-1">
        <h3 class="text-lg font-medium text-gray-900">{{ media?.fileName || 'No media file' }}</h3>
        <div class="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span class="font-medium">File Size:</span>
            {{ media?.fileSize !== undefined ? formatFileSize(media.fileSize) : 'N/A' }}
          </div>
          <div>
            <span class="font-medium">Duration:</span>
            {{ media?.duration !== undefined ? formatDuration(media.duration) : 'N/A' }}
          </div>
          <div>
            <span class="font-medium">Rating System:</span>
            {{ ratingSystemName }}
          </div>
          <div>
            <span class="font-medium">Suggested Rating:</span>
            <span
              v-if="suggestedRating"
              class="ml-1 rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
            >
              {{ suggestedRating }}
            </span>
            <span v-else class="ml-1 text-sm text-gray-500"> Not available </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useReportDetail } from '@/composables'
import type { MediaItem, RatingSystemItem } from '@/composables'

interface Props {
  media?: MediaItem
  ratingSystem?: RatingSystemItem | null
  suggestedRating?: string | null
}

const props = defineProps<Props>()
const { formatDuration, formatFileSize } = useReportDetail()

const ratingSystemName = computed(() => props.ratingSystem?.name ?? 'Unknown')
</script>
