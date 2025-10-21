<template>
  <tr class="hover:bg-gray-50">
    <td class="w-12 px-3 py-4">
      <input
        v-model="isSelected"
        type="checkbox"
        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
    </td>
    <td class="w-32 px-4 py-4">
      <div>
        <router-link
          :to="`/reports/${report.id}`"
          class="block truncate text-sm font-medium text-blue-600 hover:text-blue-800"
          :title="report.id"
        >
          {{ report.id }}
        </router-link>
      </div>
    </td>
    <td class="w-64 px-4 py-4">
      <div class="flex items-center space-x-3">
        <img
          v-if="report.mediaData?.thumbnail"
          :src="report.mediaData.thumbnail"
          :alt="report.mediaData.fileName"
          class="h-12 w-20 flex-shrink-0 rounded object-cover"
        />
        <div
          v-else
          class="flex h-12 w-20 flex-shrink-0 items-center justify-center rounded bg-gray-200"
        >
          <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <p
            class="truncate text-sm font-medium text-gray-900"
            :title="report.mediaData?.fileName || 'No media file'"
          >
            {{ report.mediaData?.fileName || 'No media file' }}
          </p>
          <p class="text-xs text-gray-500">
            <span v-if="report.mediaData">
              {{ formatFileSize(report.mediaData.fileSize) }} •
              {{ formatDuration(report.mediaData.duration) }}
            </span>
            <span v-else>No media data</span>
          </p>
        </div>
      </div>
    </td>
    <td class="w-24 px-4 py-4">
      <StatusBadge :status="report.status" />
    </td>
    <td class="w-24 px-4 py-4">
      <div class="flex flex-wrap gap-1">
        <span
          v-if="report.scenes.length === 0"
          class="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium whitespace-nowrap text-gray-800"
        >
          No content
        </span>
        <span
          v-else-if="report.scenes.length === 1"
          class="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium whitespace-nowrap text-blue-800"
        >
          1 scene
        </span>
        <span
          v-else
          class="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium whitespace-nowrap text-blue-800"
        >
          {{ report.scenes.length }} scenes
        </span>
      </div>
    </td>
    <td class="w-40 px-4 py-4">
      <span
        class="block truncate text-sm text-gray-900"
        :title="report.ratingSystemData?.name || report.ratingSystemId || 'Unknown'"
      >
        {{ report.ratingSystemData?.name || report.ratingSystemId || 'Unknown' }}
      </span>
    </td>
    <td class="w-32 px-4 py-4">
      <div>
        <p class="text-sm text-gray-900">{{ formatDate(report.createdAt) }}</p>
        <p class="text-xs text-gray-500">{{ formatTime(report.createdAt) }}</p>
      </div>
    </td>
    <td class="w-32 px-4 py-4">
      <div class="flex space-x-1">
        <router-link
          :to="`/reports/${report.id}`"
          class="rounded-md bg-blue-600 px-2 py-1 text-xs font-medium whitespace-nowrap text-white hover:bg-blue-700"
        >
          View
        </router-link>
        <button
          v-if="report.status === 'completed'"
          @click="$emit('export-report', report.id)"
          class="rounded-md bg-green-600 px-2 py-1 text-xs font-medium whitespace-nowrap text-white hover:bg-green-700"
        >
          Export
        </button>
        <button
          @click="$emit('delete-report', report.id)"
          class="rounded-md bg-red-600 px-2 py-1 text-xs font-medium whitespace-nowrap text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import { formatFileSize, formatDuration, formatDate, formatTime } from '@/utils/formatters'

interface MediaData {
  fileName: string
  fileSize: number
  duration: number
  thumbnail?: string
}

interface RatingSystemData {
  name: string
  description?: string
}

interface ReportWithMedia {
  id: string
  status: string
  ratingSystemId?: string
  createdAt: unknown
  scenes: Array<{ screenshots: unknown[] }>
  mediaData?: MediaData
  ratingSystemData?: RatingSystemData
}

interface Props {
  report: ReportWithMedia
  selectedReports: string[]
}

interface Emits {
  (e: 'update:selected-reports', value: string[]): void
  (e: 'export-report', reportId: string): void
  (e: 'delete-report', reportId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isSelected = computed({
  get: () => props.selectedReports.includes(props.report.id),
  set: (value: boolean) => {
    if (value) {
      emit('update:selected-reports', [...props.selectedReports, props.report.id])
    } else {
      emit(
        'update:selected-reports',
        props.selectedReports.filter((id) => id !== props.report.id),
      )
    }
  },
})
</script>
