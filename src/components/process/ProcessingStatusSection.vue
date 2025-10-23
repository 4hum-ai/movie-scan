<template>
  <div class="mx-auto max-w-4xl">
    <div class="rounded-lg border bg-white shadow-sm">
      <div class="p-8">
        <div class="text-center">
          <!-- Status Icon -->
          <div class="mb-4">
            <StatusIcon
              :is-processing="isProcessing"
              :is-completed="isCompleted"
              :is-failed="isFailed"
            />
          </div>

          <h3 class="mb-2 text-2xl font-bold text-gray-900">
            {{ statusTitle }}
          </h3>

          <p class="mb-6 text-sm text-gray-600">
            {{ statusDescription }}
          </p>

          <ReportSection
            :report-id="reportId"
            :is-completed="isCompleted"
            @go-to-report="$emit('goToReport')"
            @copy-report-id="$emit('copyReportId')"
          />

          <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <StatusCard
              title="Analysis Status"
              :value="pollingStatus.currentStatus"
              :status="currentStatusType"
            />
            <StatusCard title="Last Checked" :value="lastCheckedText" />
          </div>

          <div
            class="flex flex-col space-y-3 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4"
          >
            <button
              v-if="isCompleted"
              @click="$emit('goToReport')"
              class="rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700"
            >
              View Report
            </button>
            <button
              v-if="isFailed"
              @click="$emit('retry')"
              class="rounded-md bg-orange-600 px-6 py-3 text-sm font-medium text-white hover:bg-orange-700"
            >
              Retry Processing
            </button>
            <button
              @click="$emit('viewReports')"
              class="rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              View All Reports
            </button>
            <button
              @click="$emit('uploadMoreVideos')"
              class="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Scan Another Video
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StatusIcon from '@/components/molecules/StatusIcon.vue'
import StatusCard from '@/components/molecules/StatusCard.vue'
import ReportSection from '@/components/molecules/ReportSection.vue'
import type { ReportStatus } from '@/composables'

interface PollingStatus {
  currentStatus: ReportStatus
  error: string | null
  lastChecked: Date | null
}

interface Props {
  reportId: string
  pollingStatus: PollingStatus
  isProcessing: boolean
  isCompleted: boolean
  isFailed: boolean
}

const props = defineProps<Props>()

defineEmits<{
  (e: 'goToReport'): void
  (e: 'retry'): void
  (e: 'viewReports'): void
  (e: 'uploadMoreVideos'): void
  (e: 'copyReportId'): void
}>()

// Computed properties for better template readability
const statusTitle = computed(() => {
  if (props.isProcessing) return 'Processing Your Video...'
  if (props.isCompleted) return 'Analysis Complete!'
  if (props.isFailed) return 'Processing Failed'
  return 'Scan Requested'
})

const statusDescription = computed(() => {
  if (props.isProcessing) return 'AI is analyzing your video content. This may take a few minutes.'
  if (props.isCompleted) return 'Your video analysis is complete. View the detailed report below.'
  if (props.isFailed) return props.pollingStatus.error || 'An error occurred during processing.'
  return 'Your video has been queued for AI analysis.'
})

const currentStatusType = computed(() => {
  if (props.isProcessing) return 'processing'
  if (props.isCompleted) return 'completed'
  if (props.isFailed) return 'failed'
  return 'pending'
})

const lastCheckedText = computed(() => {
  if (props.pollingStatus.lastChecked) {
    return new Date(props.pollingStatus.lastChecked).toLocaleTimeString()
  }
  return 'Never'
})
</script>
