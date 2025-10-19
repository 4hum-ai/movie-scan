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
        <RatingSystemsConfiguration @back="currentStep = 2" @continue="currentStep = 2" />
      </div>

      <!-- State 2: Choose Video -->
      <div v-if="currentStep === 2" class="mx-auto max-w-4xl">
        <!-- Upload Area -->
        <div class="text-center">
          <div
            @click="showUploadModal = true"
            class="group cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 px-8 py-12 transition-all duration-200 hover:border-gray-400 hover:bg-gray-100/50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            <div class="mb-4">
              <svg
                class="mx-auto h-12 w-12 text-gray-400 transition-colors group-hover:text-gray-500"
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
            <h3 class="text-lg font-medium text-gray-900 group-hover:text-gray-700">
              Upload video files
            </h3>
            <p class="mt-2 text-sm text-gray-500 group-hover:text-gray-600">
              Click here to select and upload your video files
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
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Request Scan
          </button>
        </div>
      </div>

      <!-- State 3: Complete Upload -->
      <div v-if="currentStep === 3" class="mx-auto max-w-4xl">
        <div class="rounded-lg border bg-white shadow-sm">
          <div class="p-8">
            <div class="text-center">
              <!-- Success Icon -->
              <div class="mx-auto mb-4 h-16 w-16 text-green-600">
                <svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>

              <h3 class="mb-2 text-2xl font-bold text-gray-900">Scan Requested!</h3>
              <p class="mb-6 text-sm text-gray-600">
                Your video has been successfully uploaded and queued for AI Scan.
              </p>

              <!-- Report ID -->
              <div class="mb-8 rounded-lg border border-green-200 bg-green-50 p-6">
                <h4 class="mb-2 text-lg font-medium text-green-900">Report ID</h4>
                <div class="flex items-center justify-center space-x-2">
                  <button
                    @click="goToReport"
                    class="cursor-pointer rounded bg-green-100 px-3 py-1 font-mono text-lg text-green-800 transition-colors hover:bg-green-200"
                    title="Click to view report"
                  >
                    {{ reportId }}
                  </button>
                  <button
                    @click="copyReportId"
                    class="rounded-md bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                  >
                    Copy
                  </button>
                </div>
                <p class="mt-2 text-xs text-green-700">
                  Click the ID to view your report, or copy it to track progress later.
                </p>
              </div>

              <!-- Status Information -->
              <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div class="rounded-lg border bg-gray-50 p-4">
                  <h5 class="text-sm font-medium text-gray-900">Analysis Status</h5>
                  <p class="mt-1 text-sm text-gray-600">Queued for Processing</p>
                </div>
                <div class="rounded-lg border bg-gray-50 p-4">
                  <h5 class="text-sm font-medium text-gray-900">Estimated Time</h5>
                  <p class="mt-1 text-sm text-gray-600">
                    {{
                      videoLength > 0 ? `${Math.ceil(videoLength * 5)} minutes` : 'Calculating...'
                    }}
                  </p>
                </div>
                <div class="rounded-lg border bg-gray-50 p-4">
                  <h5 class="text-sm font-medium text-gray-900">Notification</h5>
                  <p class="mt-1 text-sm text-gray-600">Email when ready</p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div
                class="flex flex-col space-y-3 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4"
              >
                <button
                  @click="viewReports"
                  class="rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
                >
                  View All Reports
                </button>
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
      @close="showUploadModal = false"
      @uploaded="handleVideoUploaded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Stepper from '@/components/molecules/Stepper.vue'
import FileUploadModalV2 from '@/components/FileUploadModalV2.vue'
import RatingSystemsConfiguration from '@/components/RatingSystemsConfiguration.vue'

const router = useRouter()

// State management
const currentStep = ref(1) // 1: Define Rating Systems, 2: Choose Video, 3: Complete Upload
const uploadProgress = ref(0)
const reportId = ref('')
const videoLength = ref(0) // Video length in minutes
const showUploadModal = ref(false)
const uploadedFiles = ref<File[]>([])

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
const videoUploadFormFields = ref([
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
])

// Video upload handler from FileUploadModal
const handleVideoUploaded = (data: { count: number }) => {
  console.log(`Successfully uploaded ${data.count} video(s)`)

  // Close modal
  showUploadModal.value = false

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
const proceedToScan = () => {
  currentStep.value = 3
  simulateUpload()
}

// Simulate video upload
const simulateUpload = () => {
  const interval = setInterval(() => {
    uploadProgress.value += Math.random() * 15

    if (uploadProgress.value >= 100) {
      uploadProgress.value = 100
      clearInterval(interval)

      // Generate report ID and move to complete state
      reportId.value = generateReportId()
      setTimeout(() => {
        currentStep.value = 3
      }, 1000)
    }
  }, 300)
}

// Generate a unique report ID
const generateReportId = () => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `RPT-${timestamp}-${random}`
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

// Upload more videos (reset workflow)
const uploadMoreVideos = () => {
  currentStep.value = 1 // Start with Define Rating Systems step
  uploadProgress.value = 0
  reportId.value = ''
  videoLength.value = 0
  showUploadModal.value = false
  uploadedFiles.value = []
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
