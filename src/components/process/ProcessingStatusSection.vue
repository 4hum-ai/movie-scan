<template>
  <div class="mx-auto max-w-4xl">
    <div class="rounded-lg border bg-white shadow-sm">
      <div class="p-8">
        <div class="text-center">
          <!-- Dynamic Icon based on status -->
          <div class="mx-auto mb-4 h-16 w-16">
            <div v-if="isProcessing" class="animate-spin text-blue-600">
              <svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <div v-else-if="isCompleted" class="text-green-600">
              <svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div v-else-if="isFailed" class="text-red-600">
              <svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div v-else class="text-gray-400">
              <svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <h3 class="mb-2 text-2xl font-bold text-gray-900">
            <span v-if="isProcessing">Processing Your Video...</span>
            <span v-else-if="isCompleted">Analysis Complete!</span>
            <span v-else-if="isFailed">Processing Failed</span>
            <span v-else>Scan Requested</span>
          </h3>

          <p class="mb-6 text-sm text-gray-600">
            <span v-if="isProcessing"
              >AI is analyzing your video content. This may take a few minutes.</span
            >
            <span v-else-if="isCompleted"
              >Your video analysis is complete. View the detailed report below.</span
            >
            <span v-else-if="isFailed">{{
              pollingStatus.error || 'An error occurred during processing.'
            }}</span>
            <span v-else>Your video has been queued for AI analysis.</span>
          </p>

          <div
            class="mb-8 rounded-lg border p-6"
            :class="isCompleted ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'"
          >
            <h4
              class="mb-2 text-lg font-medium"
              :class="isCompleted ? 'text-green-900' : 'text-blue-900'"
            >
              Report ID
            </h4>
            <div class="flex items-center justify-center space-x-2">
              <button
                @click="emitGoToReport()"
                class="cursor-pointer rounded px-3 py-1 font-mono text-lg transition-colors"
                :class="
                  isCompleted
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                "
                title="Click to view report"
              >
                {{ reportId }}
              </button>
              <button
                @click="emitCopyReportId()"
                class="rounded-md px-3 py-1 text-sm text-white"
                :class="
                  isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                "
              >
                Copy
              </button>
            </div>
            <p class="mt-2 text-xs" :class="isCompleted ? 'text-green-700' : 'text-blue-700'">
              <span v-if="isCompleted">Click the ID to view your complete analysis report.</span>
              <span v-else>Click the ID to view report progress, or copy it to track later.</span>
            </p>
          </div>

          <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div class="rounded-lg border bg-gray-50 p-4">
              <h5 class="text-sm font-medium text-gray-900">Analysis Status</h5>
              <p
                class="mt-1 text-sm font-medium capitalize"
                :class="{
                  'text-blue-600': isProcessing,
                  'text-green-600': isCompleted,
                  'text-red-600': isFailed,
                  'text-gray-600': !isProcessing && !isCompleted && !isFailed,
                }"
              >
                {{ pollingStatus.currentStatus }}
              </p>
            </div>
            <div class="rounded-lg border bg-gray-50 p-4">
              <h5 class="text-sm font-medium text-gray-900">Estimated Time</h5>
              <p class="mt-1 text-sm text-gray-600">
                <span v-if="isCompleted">Complete</span>
                <span v-else-if="isFailed">N/A</span>
                <span v-else-if="estimatedTimeRemaining"
                  >{{ estimatedTimeRemaining }} minutes remaining</span
                >
                <span v-else>Calculating...</span>
              </p>
            </div>
            <div class="rounded-lg border bg-gray-50 p-4">
              <h5 class="text-sm font-medium text-gray-900">Last Checked</h5>
              <p class="mt-1 text-sm text-gray-600">
                <span v-if="pollingStatus.lastChecked">{{
                  new Date(pollingStatus.lastChecked).toLocaleTimeString()
                }}</span>
                <span v-else>Never</span>
              </p>
            </div>
          </div>

          <div
            class="flex flex-col space-y-3 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4"
          >
            <button
              v-if="isCompleted"
              @click="emitGoToReport()"
              class="rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700"
            >
              View Report
            </button>
            <button
              v-if="isFailed"
              @click="emitRetry()"
              class="rounded-md bg-orange-600 px-6 py-3 text-sm font-medium text-white hover:bg-orange-700"
            >
              Retry Processing
            </button>
            <button
              @click="emitViewReports()"
              class="rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              View All Reports
            </button>
            <button
              @click="emitUploadMoreVideos()"
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
import { defineProps, defineEmits } from 'vue'

interface PollingStatus {
  currentStatus: 'pending' | 'processing' | 'completed' | 'failed'
  error: string | null
  lastChecked: Date | null
}

interface Props {
  reportId: string
  pollingStatus: PollingStatus
  isProcessing: boolean
  isCompleted: boolean
  isFailed: boolean
  estimatedTimeRemaining: number | null
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'goToReport'): void
  (e: 'retry'): void
  (e: 'viewReports'): void
  (e: 'uploadMoreVideos'): void
  (e: 'copyReportId'): void
}>()

const emitGoToReport = () => emit('goToReport')
const emitRetry = () => emit('retry')
const emitViewReports = () => emit('viewReports')
const emitUploadMoreVideos = () => emit('uploadMoreVideos')
const emitCopyReportId = () => emit('copyReportId')
</script>
