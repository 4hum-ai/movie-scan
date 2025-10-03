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
            <!-- Step 1: Upload -->
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
                Upload
              </span>
            </div>

            <!-- Arrow -->
            <div class="h-0.5 w-6 bg-gray-300"></div>

            <!-- Step 2: Configure Guidelines -->
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
                Guidelines
              </span>
            </div>

            <!-- Arrow -->
            <div class="h-0.5 w-6 bg-gray-300"></div>

            <!-- Step 3: Processing -->
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
                AI Analysis
              </span>
            </div>

            <!-- Arrow -->
            <div class="h-0.5 w-6 bg-gray-300"></div>

            <!-- Step 4: Review -->
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
                Review & Tag
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- State 1: Upload -->
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

      <!-- State 2: Configure Guidelines -->
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
                <textarea
                  v-model="customGuidelines"
                  class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  rows="4"
                  placeholder="Write your custom content moderation guidelines here..."
                ></textarea>
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
            @click="proceedToProcessing"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Continue to Analysis
          </button>
        </div>
      </div>

      <!-- State 3: Processing -->
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
              <h3 class="mb-2 text-lg font-medium text-gray-900">AI Analysis in Progress</h3>
              <p class="mb-6 text-sm text-gray-600">
                Our AI is analyzing your video for content compliance. This may take a few minutes.
              </p>

              <!-- Progress Bar -->
              <div class="mb-4 h-2 w-full rounded-full bg-gray-200">
                <div
                  class="h-2 rounded-full bg-blue-600 transition-all duration-300"
                  :style="`width: ${processingProgress}%`"
                ></div>
              </div>
              <p class="text-sm text-gray-500">{{ processingProgress }}% complete</p>

              <!-- Processing Steps -->
              <div class="mt-8 space-y-3">
                <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span class="text-sm font-medium text-gray-900">Scene Detection</span>
                  <span class="text-sm text-green-600">✓ Complete</span>
                </div>
                <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span class="text-sm font-medium text-gray-900">Content Classification</span>
                  <span class="text-sm text-green-600">✓ Complete</span>
                </div>
                <div class="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                  <span class="text-sm font-medium text-gray-900">Timestamp Analysis</span>
                  <span class="text-sm text-blue-600">In Progress...</span>
                </div>
                <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span class="text-sm font-medium text-gray-900">Report Generation</span>
                  <span class="text-sm text-gray-500">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- State 4: Analysis & Review -->
      <div v-if="currentStep === 4" class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- Video Player Section -->
        <div class="lg:col-span-2">
          <div class="rounded-lg border bg-white shadow-sm">
            <div class="p-6">
              <h2 class="mb-4 text-lg font-medium text-gray-900">Video Player</h2>
              <div class="flex aspect-video items-center justify-center rounded-lg bg-gray-100">
                <div class="text-center">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-5-8V6a2 2 0 012-2h2a2 2 0 012 2v2M7 7h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z"
                    ></path>
                  </svg>
                  <p class="mt-2 text-sm text-gray-500">Video player will appear here</p>
                </div>
              </div>
              <!-- Video Controls -->
              <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <button class="p-2 text-gray-400 hover:text-gray-600">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </button>
                  <span class="text-sm text-gray-500">00:00 / 00:00</span>
                </div>
                <div class="flex items-center space-x-2">
                  <button class="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800">
                    Violence
                  </button>
                  <button class="rounded-full bg-red-100 px-3 py-1 text-xs text-red-800">
                    Nudity
                  </button>
                  <button class="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-800">
                    Profanity
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- AI Analysis Results -->
          <div class="mt-6 rounded-lg border bg-white shadow-sm">
            <div class="p-6">
              <h2 class="mb-4 text-lg font-medium text-gray-900">AI Analysis Results</h2>
              <div class="space-y-4">
                <div class="rounded-lg border p-4">
                  <div class="mb-2 flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-900"
                      >Scene 1: Violence Detection</span
                    >
                    <span class="text-sm text-gray-500">00:02:15 - 00:02:45</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="h-2 w-full rounded-full bg-gray-200">
                      <div class="h-2 rounded-full bg-red-600" style="width: 85%"></div>
                    </div>
                    <span class="text-sm font-medium text-gray-900">85%</span>
                  </div>
                </div>
                <div class="rounded-lg border p-4">
                  <div class="mb-2 flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-900">Scene 2: Nudity Detection</span>
                    <span class="text-sm text-gray-500">00:15:30 - 00:16:00</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="h-2 w-full rounded-full bg-gray-200">
                      <div class="h-2 rounded-full bg-yellow-600" style="width: 60%"></div>
                    </div>
                    <span class="text-sm font-medium text-gray-900">60%</span>
                  </div>
                </div>
                <div class="rounded-lg border p-4">
                  <div class="mb-2 flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-900"
                      >Scene 3: Profanity Detection</span
                    >
                    <span class="text-sm text-gray-500">00:45:12 - 00:45:18</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="h-2 w-full rounded-full bg-gray-200">
                      <div class="h-2 rounded-full bg-orange-600" style="width: 92%"></div>
                    </div>
                    <span class="text-sm font-medium text-gray-900">92%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tagging Panel -->
        <div class="lg:col-span-1">
          <div class="rounded-lg border bg-white shadow-sm">
            <div class="p-6">
              <h2 class="mb-4 text-lg font-medium text-gray-900">Manual Tagging</h2>

              <!-- Content Categories -->
              <div class="mb-6">
                <label class="mb-2 block text-sm font-medium text-gray-700">Content Category</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      class="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Violence</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      class="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Nudity</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Profanity</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Drug Use</span>
                  </label>
                </div>
              </div>

              <!-- Severity Level -->
              <div class="mb-6">
                <label class="mb-2 block text-sm font-medium text-gray-700">Severity Level</label>
                <select class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Extreme</option>
                </select>
              </div>

              <!-- Age Rating Suggestion -->
              <div class="mb-6">
                <label class="mb-2 block text-sm font-medium text-gray-700"
                  >Suggested Age Rating</label
                >
                <div class="rounded-md border border-blue-200 bg-blue-50 p-3">
                  <p class="text-sm font-medium text-blue-900">R (Restricted)</p>
                  <p class="mt-1 text-xs text-blue-700">Based on detected violence and profanity</p>
                </div>
              </div>

              <!-- Notes -->
              <div class="mb-6">
                <label class="mb-2 block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  rows="3"
                  placeholder="Add any additional notes or context..."
                ></textarea>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-2">
                <button
                  class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save Tag
                </button>
                <button
                  class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Clear All
                </button>
                <button
                  @click="goToReports"
                  class="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Generate Report
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
const currentStep = ref(1) // 1: Upload, 2: Guidelines, 3: Processing, 4: Analysis
const processingProgress = ref(0)

// Guideline configuration
const selectedGuidelines = ref({
  hateSpeech: true,
  violence: true,
  adult: true,
  harassment: false,
  misinformation: false,
  copyright: false,
})

const customGuidelines = ref('')

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

// Proceed to processing after guidelines are configured
const proceedToProcessing = () => {
  currentStep.value = 3
  simulateProcessing()
}

// Custom rating methods (placeholder for future implementation)
// const addCustomRating = () => { ... }
// const removeCustomRating = (index: number) => { ... }

// Simulate AI processing
const simulateProcessing = () => {
  const interval = setInterval(() => {
    processingProgress.value += Math.random() * 10

    if (processingProgress.value >= 100) {
      processingProgress.value = 100
      clearInterval(interval)

      // Move to analysis state after processing completes
      setTimeout(() => {
        currentStep.value = 4
      }, 1000)
    }
  }, 500)
}

// Navigate to reports
const goToReports = () => {
  router.push('/reports')
}

// Initialize component
onMounted(() => {
  // Component initialization logic
})
</script>
