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
      <ChooseVideoSection
        v-if="currentStep === 2"
        :has-uploaded-video="hasUploadedVideo"
        @back="currentStep = 1"
        @proceed="proceedToScan"
        @open-upload-modal="showUploadModal = true"
      />

      <!-- State 3: Processing Status -->
      <ProcessingStatusSection
        v-if="currentStep === 3"
        :report-id="reportId"
        :polling-status="pollingStatus"
        :is-processing="isProcessing"
        :is-completed="isCompleted"
        :is-failed="isFailed"
        :estimated-time-remaining="estimatedTimeRemaining"
        @go-to-report="goToReport"
        @retry="retryProcessing"
        @view-reports="viewReports"
        @upload-more-videos="uploadMoreVideos"
        @copy-report-id="copyReportId"
      />
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

import FileUploadModalV2 from '@/components/process/upload/FileUploadModalV2.vue'

import ChooseVideoSection from '@/components/process/ChooseVideoSection.vue'
import ProcessingStatusSection from '@/components/process/ProcessingStatusSection.vue'
import RatingSystemsConfiguration from '@/components/process/RatingSystemsConfiguration.vue'

import { useReports, useReportPolling, useResourceService } from '@/composables'

const router = useRouter()

// Initialize composables
const { createReport } = useReports()
const { update } = useResourceService()
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
    await update('reports', reportId.value, { status: 'processing' })

    await startPolling(reportId.value)

    currentStep.value = 3
  } catch (error) {
    console.error('Error triggering workflow or starting polling:', error)
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
