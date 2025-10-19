<template>
  <div class="bg-background min-h-screen">
    <!-- Main Content -->
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Video Processing</h1>
        <p class="mt-2 text-sm text-gray-600">
          Upload, analyze, and review film content for compliance
        </p>
      </div>

      <!-- Progress Indicator -->
      <div class="mb-8">
        <Stepper
          :steps="videoProcessingSteps"
          :current-step="currentStep - 1"
          orientation="responsive"
          variant="default"
          size="md"
          :clickable="false"
          :show-connectors="true"
          icon-mode="always-numbers"
          aria-label="Video processing progress"
        />
      </div>

      <!-- State 1: Define Rating Systems -->
      <div v-if="currentStep === 1">
        <RatingSystemsConfiguration
          @back="currentStep = 2"
          @continue="handleRatingSystemContinue"
          @rating-system-selected="handleRatingSystemSelected"
        />
      </div>

      <!-- State 2: Choose Video -->
      <div v-if="currentStep === 2" class="mx-auto max-w-4xl">
        <!-- Upload Area -->
        <div class="text-center">
          <div
            @click="!hasUploadedVideo && (showUploadModal = true)"
            class="group rounded-lg border-2 border-dashed px-8 py-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            :class="
              hasUploadedVideo
                ? 'cursor-not-allowed border-gray-200 bg-gray-100/30 opacity-60'
                : 'cursor-pointer border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-100/50'
            "
          >
            <div class="mb-4">
              <svg
                class="mx-auto h-12 w-12 transition-colors"
                :class="
                  hasUploadedVideo ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-500'
                "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h3
              class="text-lg font-medium"
              :class="
                hasUploadedVideo ? 'text-gray-500' : 'text-gray-900 group-hover:text-gray-700'
              "
            >
              {{ hasUploadedVideo ? 'Video uploaded successfully' : 'Upload video files' }}
            </h3>
            <p
              class="mt-2 text-sm"
              :class="
                hasUploadedVideo ? 'text-gray-400' : 'text-gray-500 group-hover:text-gray-600'
              "
            >
              {{
                hasUploadedVideo
                  ? 'Ready to proceed with scan'
                  : 'Click here to select and upload your video files'
              }}
            </p>
            <p class="mt-4 text-xs text-gray-400">
              Supported formats: MP4, AVI, MOV • Max file size: 10GB
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex justify-end space-x-3">
          <button
            @click="currentStep = 1"
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            @click="proceedToScan"
            :disabled="!hasUploadedVideo"
            class="rounded-md px-4 py-2 text-sm font-medium transition-colors"
            :class="
              hasUploadedVideo
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'cursor-not-allowed bg-gray-300 text-gray-500'
            "
            :title="!hasUploadedVideo ? 'Please upload a video first' : 'Start AI scan process'"
          >
            Request Scan
          </button>
        </div>
      </div>

      <!-- State 3: Processing Status -->
      <div v-if="currentStep === 3" class="mx-auto max-w-4xl">
        <div class="rounded-lg border bg-white shadow-sm">
          <div class="p-8">
            <div class="text-center">
              <!-- Dynamic Icon based on status -->
              <div class="mx-auto mb-4 h-16 w-16">
                <!-- Processing/Spinning Icon -->
                <div v-if="isProcessing" class="animate-spin text-blue-600">
                  <svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                  </svg>
                </div>
                <!-- Success Icon -->
                <div v-else-if="isCompleted" class="text-green-600">
                  <svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <!-- Error Icon -->
                <div v-else-if="isFailed" class="text-red-600">
                  <svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <!-- Default Pending Icon -->
                <div v-else class="text-gray-400">
                  <svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
              </div>

              <!-- Dynamic Title -->
              <h3 class="mb-2 text-2xl font-bold text-gray-900">
                <span v-if="isProcessing">Processing Your Video...</span>
                <span v-else-if="isCompleted">Analysis Complete!</span>
                <span v-else-if="isFailed">Processing Failed</span>
                <span v-else>Scan Requested</span>
              </h3>

              <!-- Dynamic Description -->
              <p class="mb-6 text-sm text-gray-600">
                <span v-if="isProcessing">
                  AI is analyzing your video content. This may take a few minutes.
                </span>
                <span v-else-if="isCompleted">
                  Your video analysis is complete. View the detailed report below.
                </span>
                <span v-else-if="isFailed">
                  {{ pollingStatus.error || 'An error occurred during processing.' }}
                </span>
                <span v-else> Your video has been queued for AI analysis. </span>
              </p>

              <!-- Report ID -->
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
                    @click="goToReport"
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
                    @click="copyReportId"
                    class="rounded-md px-3 py-1 text-sm text-white"
                    :class="
                      isCompleted
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    "
                  >
                    Copy
                  </button>
                </div>
                <p class="mt-2 text-xs" :class="isCompleted ? 'text-green-700' : 'text-blue-700'">
                  <span v-if="isCompleted"
                    >Click the ID to view your complete analysis report.</span
                  >
                  <span v-else
                    >Click the ID to view report progress, or copy it to track later.</span
                  >
                </p>
              </div>

              <!-- Status Information -->
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
                    <span v-else-if="estimatedTimeRemaining">
                      {{ estimatedTimeRemaining }} minutes remaining
                    </span>
                    <span v-else>Calculating...</span>
                  </p>
                </div>
                <div class="rounded-lg border bg-gray-50 p-4">
                  <h5 class="text-sm font-medium text-gray-900">Last Checked</h5>
                  <p class="mt-1 text-sm text-gray-600">
                    <span v-if="pollingStatus.lastChecked">
                      {{ new Date(pollingStatus.lastChecked).toLocaleTimeString() }}
                    </span>
                    <span v-else>Never</span>
                  </p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div
                class="flex flex-col space-y-3 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4"
              >
                <!-- View Report Button (only when completed) -->
                <button
                  v-if="isCompleted"
                  @click="goToReport"
                  class="rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700"
                >
                  View Report
                </button>

                <!-- Retry Button (only when failed) -->
                <button
                  v-if="isFailed"
                  @click="retryProcessing"
                  class="rounded-md bg-orange-600 px-6 py-3 text-sm font-medium text-white hover:bg-orange-700"
                >
                  Retry Processing
                </button>

                <!-- View All Reports Button -->
                <button
                  @click="viewReports"
                  class="rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
                >
                  View All Reports
                </button>

                <!-- Scan Another Video Button -->
                <button
                  @click="uploadMoreVideos"
                  class="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Scan Another Video
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- File Upload Modal V2 -->
    <FileUploadModalV2
      v-if="showUploadModal"
      :accept="'video/*'"
      :max-files="5"
      :max-file-size="10 * 1024 * 1024 * 1024"
      :form-fields="videoUploadFormFields"
      :preview-mode="'single'"
      :multiple="false"
      :relationships="reportId ? [`reports:${reportId}:attachment`] : []"
      :on-before-upload="createReportBeforeUpload"
      @close="showUploadModal = false"
      @uploaded="handleVideoUploaded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Stepper from '@/components/molecules/Stepper.vue'
import FileUploadModalV2 from '@/components/FileUploadModalV2.vue'
import RatingSystemsConfiguration from '@/components/RatingSystemsConfiguration.vue'
import { useReports, useReportPolling } from '@/composables'

const router = useRouter()

// Initialize composables
const { createReport } = useReports()
const {
  pollingStatus,
  isCompleted,
  isFailed,
  isProcessing,
  estimatedTimeRemaining,
  startPolling,
  stopPolling,
  resetPolling,
} = useReportPolling()

// State management
const currentStep = ref(1) // 1: Define Rating Systems, 2: Choose Video, 3: Complete Upload
const uploadProgress = ref(0)
const reportId = ref('')
const videoLength = ref(0) // Video length in minutes
const showUploadModal = ref(false)
const uploadedFiles = ref<File[]>([])
const selectedRatingSystemId = ref('')
const hasUploadedVideo = ref(false)

// Stepper configuration
const videoProcessingSteps = ref([
  {
    id: 'define-rating-systems',
    label: 'Define Rating Systems',
    description: 'Configure content rating systems and guidelines',
  },
  {
    id: 'choose-video',
    label: 'Choose Video',
    description: 'Select video files to upload',
  },
  {
    id: 'request-scan',
    label: 'Request Scan',
    description: 'Queue video for AI analysis',
  },
])

// Video upload form fields configuration
const videoUploadFormFields = computed(() => [
  {
    key: 'type',
    label: 'Video Type',
    type: 'select' as const,
    value: 'original',
    options: ['original', 'dubbed', 'trailer', 'voice_over'],
  },
  {
    key: 'language',
    label: 'Language',
    type: 'select' as const,
    value: 'en',
    options: ['en', 'es', 'fr', 'de', 'ja', 'ko', 'zh', 'hi', 'vi'],
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea' as const,
    placeholder: 'Enter video description for compliance scanning',
    value: '',
  },
  {
    key: 'format',
    label: 'Format',
    type: 'select' as const,
    value: 'mp4',
    options: ['mp4', 'mov', 'mkv', 'avi', 'webm', 'm3u8'],
  },
  {
    key: 'tags',
    label: 'Tags',
    type: 'tags' as const,
    value: [],
  },
  // Note: relationships will be added dynamically when report is created
])

// Handle rating system selection
const handleRatingSystemSelected = (ratingSystemId: string) => {
  selectedRatingSystemId.value = ratingSystemId
}

// Handle continue from rating system configuration
const handleRatingSystemContinue = () => {
  if (!selectedRatingSystemId.value) {
    console.error('No rating system selected')
    return
  }

  // Just move to step 2 (Choose Video) without creating report yet
  currentStep.value = 2
}

// Create report before upload
const createReportBeforeUpload = async (): Promise<string | null> => {
  if (!selectedRatingSystemId.value) {
    console.error('No rating system selected')
    return null
  }

  if (reportId.value) {
    // Report already exists
    return reportId.value
  }

  try {
    const report = await createReport({
      ratingSystemId: selectedRatingSystemId.value,
    })

    reportId.value = report.id
    console.log('Report created with ID:', report.id)
    return report.id
  } catch (error) {
    console.error('Failed to create report:', error)
    return null
  }
}

// Video upload handler from FileUploadModal
const handleVideoUploaded = (data: { count: number }) => {
  console.log(`Successfully uploaded ${data.count} video(s)`)

  // Close modal
  showUploadModal.value = false

  // Mark that video has been uploaded
  hasUploadedVideo.value = true

  // Get video duration for time estimation (if available)
  if (uploadedFiles.value.length > 0) {
    const file = uploadedFiles.value[0]
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      videoLength.value = Math.ceil(video.duration / 60) // Convert to minutes
    }
    video.src = URL.createObjectURL(file)
  }

  // Stay on step 2 (Choose Video) after upload
  currentStep.value = 2
}

// Proceed to scan request after video is uploaded
const proceedToScan = async () => {
  if (!hasUploadedVideo.value) {
    console.error('No video uploaded')
    return
  }

  if (!reportId.value) {
    console.error('No report created')
    return
  }

  try {
    // Backend will automatically trigger workflow when media upload is complete
    // We just need to start polling for status updates
    await startPolling(reportId.value)

    // Proceed to step 3
    currentStep.value = 3
    console.log('Started polling for report status')
  } catch (error) {
    console.error('Error starting polling:', error)
  }
}

// Copy report ID to clipboard
const copyReportId = async () => {
  try {
    await navigator.clipboard.writeText(reportId.value)
    // You could add a toast notification here
    console.log('Report ID copied to clipboard')
  } catch (err) {
    console.error('Failed to copy report ID:', err)
  }
}

// Navigate to specific report
const goToReport = () => {
  router.push(`/reports/${reportId.value}`)
}

// Retry processing
const retryProcessing = async () => {
  if (!reportId.value) {
    console.error('No report ID available for retry')
    return
  }

  try {
    // Reset polling status and start polling again
    resetPolling()
    await startPolling(reportId.value)
    console.log('Retry polling started')
  } catch (error) {
    console.error('Error retrying polling:', error)
  }
}

// Upload more videos (reset workflow)
const uploadMoreVideos = () => {
  // Stop any ongoing polling
  stopPolling()
  resetPolling()

  // Reset all state
  currentStep.value = 1 // Start with Define Rating Systems step
  uploadProgress.value = 0
  reportId.value = ''
  videoLength.value = 0
  showUploadModal.value = false
  uploadedFiles.value = []
  selectedRatingSystemId.value = ''
  hasUploadedVideo.value = false
}

// Navigate to reports
const viewReports = () => {
  router.push('/reports')
}

// Initialize component
onMounted(() => {
  // Component initialization if needed
})
</script>
