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
        <div class="flex items-center justify-center">
          <div class="flex items-center space-x-2">
            <!-- Step 1: Choose Video -->
            <div class="flex items-center">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium"
                :class="currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'"
              >
                1
              </div>
              <span
                class="ml-2 text-sm font-medium"
                :class="currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'"
              >
                Choose Video
              </span>
            </div>

            <!-- Arrow -->
            <div class="h-0.5 w-6 bg-gray-300"></div>

            <!-- Step 2: Define Guidelines -->
            <div class="flex items-center">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium"
                :class="currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'"
              >
                2
              </div>
              <span
                class="ml-2 text-sm font-medium"
                :class="currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'"
              >
                Define Guidelines
              </span>
            </div>

            <!-- Arrow -->
            <div class="h-0.5 w-6 bg-gray-300"></div>

            <!-- Step 3: Uploading -->
            <div class="flex items-center">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium"
                :class="currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'"
              >
                3
              </div>
              <span
                class="ml-2 text-sm font-medium"
                :class="currentStep >= 3 ? 'text-blue-600' : 'text-gray-500'"
              >
                Uploading
              </span>
            </div>

            <!-- Arrow -->
            <div class="h-0.5 w-6 bg-gray-300"></div>

            <!-- Step 4: Complete Upload -->
            <div class="flex items-center">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium"
                :class="currentStep >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'"
              >
                4
              </div>
              <span
                class="ml-2 text-sm font-medium"
                :class="currentStep >= 4 ? 'text-blue-600' : 'text-gray-500'"
              >
                Complete Upload
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- State 1: Choose Video -->
      <div v-if="currentStep === 1" class="mx-auto max-w-4xl">
        <!-- Upload Area -->
        <div class="rounded-lg border bg-white shadow-sm">
          <div class="p-8">
            <div class="text-center">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div class="mt-4">
                <label for="file-upload" class="cursor-pointer">
                  <span class="mt-2 block text-sm font-medium text-gray-900">
                    Upload video files
                  </span>
                  <span class="mt-1 block text-sm text-gray-500">
                    Drag and drop files here, or click to select
                  </span>
                </label>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  class="sr-only"
                  accept="video/*"
                  multiple
                  @change="handleFileUpload"
                />
              </div>
              <div class="mt-4">
                <p class="text-xs text-gray-500">
                  Supported formats: MP4, AVI, MOV • Max file size: 10GB
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Uploads -->
        <div class="mt-8">
          <h2 class="mb-4 text-lg font-medium text-gray-900">Recent Uploads</h2>
          <div class="rounded-lg border bg-white shadow-sm">
            <div class="p-6">
              <p class="text-center text-gray-500">No recent uploads to display</p>
            </div>
          </div>
        </div>
      </div>

      <!-- State 2: Define Guidelines -->
      <div v-if="currentStep === 2" class="mx-auto max-w-6xl">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <!-- Content Guidelines -->
          <div class="rounded-lg border bg-white shadow-sm">
            <div class="p-6">
              <h2 class="mb-4 text-lg font-medium text-gray-900">Content Guidelines</h2>

              <!-- Predefined Guidelines -->
              <div class="mb-6">
                <h3 class="mb-3 text-sm font-medium text-gray-700">Predefined Guidelines</h3>
                <div class="space-y-3">
                  <label class="flex items-start">
                    <input
                      type="checkbox"
                      v-model="selectedGuidelines.hateSpeech"
                      class="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <div class="ml-3">
                      <span class="text-sm font-medium text-gray-900"
                        >Hate Speech & Discrimination</span
                      >
                      <p class="text-xs text-gray-500">
                        Detect content that promotes hatred, violence, or discrimination
                      </p>
                    </div>
                  </label>
                  <label class="flex items-start">
                    <input
                      type="checkbox"
                      v-model="selectedGuidelines.violence"
                      class="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <div class="ml-3">
                      <span class="text-sm font-medium text-gray-900"
                        >Violent or Graphic Content</span
                      >
                      <p class="text-xs text-gray-500">
                        Detect scenes with violence, gore, or disturbing imagery
                      </p>
                    </div>
                  </label>
                  <label class="flex items-start">
                    <input
                      type="checkbox"
                      v-model="selectedGuidelines.adult"
                      class="mt-1 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <div class="ml-3">
                      <span class="text-sm font-medium text-gray-900"
                        >Adult & Explicit Content</span
                      >
                      <p class="text-xs text-gray-500">
                        Identify sexual content, nudity, and explicit material
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Custom Guidelines -->
              <div class="mb-6">
                <h3 class="mb-3 text-sm font-medium text-gray-700">Custom Guidelines</h3>

                <!-- Guidelines List -->
                <div class="mb-4 space-y-2">
                  <div
                    v-for="(guideline, index) in customGuidelines"
                    :key="index"
                    class="flex items-center space-x-2 rounded-lg border bg-gray-50 p-3"
                  >
                    <span class="flex-1 text-sm text-gray-900">{{ guideline }}</span>
                    <button
                      @click="removeCustomGuideline(index)"
                      class="rounded-md p-1 text-red-600 hover:bg-red-100"
                      title="Remove guideline"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Add New Guideline -->
                <div class="flex space-x-2">
                  <input
                    v-model="newGuideline"
                    type="text"
                    class="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Enter a custom guideline..."
                    @keyup.enter="addCustomGuideline"
                  />
                  <button
                    @click="addCustomGuideline"
                    :disabled="!newGuideline.trim()"
                    class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Content Rating Systems -->
          <div class="rounded-lg border bg-white shadow-sm">
            <div class="p-6">
              <h2 class="mb-4 text-lg font-medium text-gray-900">Content Rating System</h2>

              <!-- Rating System Selection -->
              <div class="mb-6">
                <label class="mb-2 block text-sm font-medium text-gray-700"
                  >Select Rating System</label
                >
                <select
                  v-model="selectedRatingSystem"
                  class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="mpaa">MPAA (Motion Picture Association of America)</option>
                  <option value="bbfc">BBFC (British Board of Film Classification)</option>
                  <option value="fsk">FSK (Germany)</option>
                  <option value="custom">Custom Rating System</option>
                </select>
              </div>

              <!-- Rating System Details -->
              <div class="mb-6">
                <h3 class="mb-3 text-sm font-medium text-gray-700">Rating Levels</h3>
                <div v-if="selectedRatingSystem === 'mpaa'" class="space-y-2">
                  <div class="flex items-center justify-between rounded-lg bg-green-50 p-3">
                    <span class="text-sm font-medium text-gray-900">G - General Audiences</span>
                    <span class="text-xs text-gray-500">All ages admitted</span>
                  </div>
                  <div class="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                    <span class="text-sm font-medium text-gray-900">PG - Parental Guidance</span>
                    <span class="text-xs text-gray-500"
                      >Some material may not be suitable for children</span
                    >
                  </div>
                  <div class="flex items-center justify-between rounded-lg bg-yellow-50 p-3">
                    <span class="text-sm font-medium text-gray-900"
                      >PG-13 - Parents Strongly Cautioned</span
                    >
                    <span class="text-xs text-gray-500"
                      >Some material may be inappropriate for children under 13</span
                    >
                  </div>
                  <div class="flex items-center justify-between rounded-lg bg-orange-50 p-3">
                    <span class="text-sm font-medium text-gray-900">R - Restricted</span>
                    <span class="text-xs text-gray-500"
                      >Under 17 requires accompanying parent or adult guardian</span
                    >
                  </div>
                </div>
              </div>
            </div>
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
            @click="proceedToUploading"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Continue to Upload
          </button>
        </div>
      </div>

      <!-- State 3: Uploading -->
      <div v-if="currentStep === 3" class="mx-auto max-w-4xl">
        <div class="rounded-lg border bg-white shadow-sm">
          <div class="p-8">
            <div class="text-center">
              <div class="mx-auto mb-4 h-12 w-12 text-blue-600">
                <svg class="h-12 w-12 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <h3 class="mb-2 text-lg font-medium text-gray-900">Uploading Video</h3>
              <p class="mb-6 text-sm text-gray-600">
                Your video is being uploaded and queued for AI analysis. This may take a few
                minutes.
              </p>

              <!-- Upload Progress -->
              <div class="mb-4 h-2 w-full rounded-full bg-gray-200">
                <div
                  class="h-2 rounded-full bg-blue-600 transition-all duration-300"
                  :style="`width: ${uploadProgress}%`"
                ></div>
              </div>
              <p class="text-sm text-gray-500">{{ uploadProgress }}% uploaded</p>

              <!-- Upload Steps -->
              <div class="mt-8 space-y-3">
                <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span class="text-sm font-medium text-gray-900">File Validation</span>
                  <span class="text-sm text-green-600">✓ Complete</span>
                </div>
                <div class="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                  <span class="text-sm font-medium text-gray-900">Uploading to Server</span>
                  <span class="text-sm text-blue-600">In Progress...</span>
                </div>
                <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span class="text-sm font-medium text-gray-900">Queue for AI Analysis</span>
                  <span class="text-sm text-gray-500">Pending</span>
                </div>
                <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span class="text-sm font-medium text-gray-900">Generate Report ID</span>
                  <span class="text-sm text-gray-500">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- State 4: Complete Upload -->
      <div v-if="currentStep === 4" class="mx-auto max-w-4xl">
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

              <h3 class="mb-2 text-2xl font-bold text-gray-900">Upload Complete!</h3>
              <p class="mb-6 text-sm text-gray-600">
                Your video has been successfully uploaded and queued for AI analysis.
              </p>

              <!-- Report ID -->
              <div class="mb-8 rounded-lg border border-green-200 bg-green-50 p-6">
                <h4 class="mb-2 text-lg font-medium text-green-900">Report ID</h4>
                <div class="flex items-center justify-center space-x-2">
                  <code class="rounded bg-green-100 px-3 py-1 font-mono text-lg text-green-800">
                    {{ reportId }}
                  </code>
                  <button
                    @click="copyReportId"
                    class="rounded-md bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                  >
                    Copy
                  </button>
                </div>
                <p class="mt-2 text-xs text-green-700">
                  Use this ID to track your analysis progress and access results later.
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
                  <p class="mt-1 text-sm text-gray-600">2-4 hours</p>
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
                  @click="uploadMoreVideos"
                  class="rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Upload More Videos
                </button>
                <button
                  @click="goToDashboard"
                  class="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Go to Dashboard
                </button>
                <button
                  @click="viewReports"
                  class="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  View All Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State management
const currentStep = ref(1) // 1: Choose Video, 2: Define Guidelines, 3: Uploading, 4: Complete Upload
const uploadProgress = ref(0)
const reportId = ref('')

// Guideline configuration
const selectedGuidelines = ref({
  hateSpeech: true,
  violence: true,
  adult: true,
  harassment: false,
  misinformation: false,
  copyright: false,
})

const customGuidelines = ref<string[]>([])
const newGuideline = ref('')

// Content rating system
const selectedRatingSystem = ref('mpaa')

// File upload handler
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files && files.length > 0) {
    // Move to guideline configuration step
    currentStep.value = 2
  }
}

// Proceed to uploading after guidelines are configured
const proceedToUploading = () => {
  currentStep.value = 3
  simulateUpload()
}

// Custom guidelines management
const addCustomGuideline = () => {
  if (newGuideline.value.trim()) {
    customGuidelines.value.push(newGuideline.value.trim())
    newGuideline.value = ''
  }
}

const removeCustomGuideline = (index: number) => {
  customGuidelines.value.splice(index, 1)
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
        currentStep.value = 4
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

// Upload more videos (reset workflow)
const uploadMoreVideos = () => {
  currentStep.value = 1
  uploadProgress.value = 0
  reportId.value = ''
  customGuidelines.value = []
  newGuideline.value = ''
}

// Navigate to dashboard
const goToDashboard = () => {
  router.push('/')
}

// Navigate to reports
const viewReports = () => {
  router.push('/reports')
}

// Initialize component
onMounted(() => {
  // Component initialization logic
})
</script>
