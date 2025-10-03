<template>
  <div class="bg-background min-h-screen">
    <!-- Main Content -->
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <div class="mb-6">
        <router-link
          to="/reports"
          class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          Back to Reports
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="flex flex-col items-center">
          <div
            class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
          ></div>
          <p class="mt-2 text-sm text-gray-600">Loading report...</p>
        </div>
      </div>

      <!-- Report Not Found -->
      <div v-else-if="!report" class="py-12 text-center">
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Report not found</h3>
        <p class="mt-1 text-sm text-gray-500">
          The report you're looking for doesn't exist or has been deleted.
        </p>
        <div class="mt-6">
          <router-link
            to="/reports"
            class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            View All Reports
          </router-link>
        </div>
      </div>

      <!-- Report Content -->
      <div v-else>
        <!-- Report Header -->
        <div class="mb-8 rounded-lg border bg-white p-6 shadow-sm">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <h1 class="text-2xl font-bold text-gray-900">{{ report.id }}</h1>
                <span
                  class="inline-flex rounded-full px-3 py-1 text-sm font-medium"
                  :class="getStatusClass(report.status)"
                >
                  {{ getStatusText(report.status) }}
                </span>
              </div>
              <p class="mt-2 text-sm text-gray-600">
                Created {{ formatDate(report.createdAt) }} at {{ formatTime(report.createdAt) }}
              </p>
              <div v-if="report.completedAt" class="mt-1 text-sm text-gray-600">
                Completed {{ formatDate(report.completedAt) }} at
                {{ formatTime(report.completedAt) }}
                <span class="ml-2 text-gray-500">
                  (Processing time: {{ formatDuration(report.processingDuration) }})
                </span>
              </div>
            </div>
            <div class="flex space-x-3">
              <button
                v-if="report.status === 'completed'"
                @click="() => exportReport()"
                class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Export Report
              </button>
              <button
                @click="deleteReport"
                class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete Report
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <!-- Main Content -->
          <div class="space-y-8 lg:col-span-2">
            <!-- Video Information -->
            <div class="rounded-lg border bg-white p-6 shadow-sm">
              <h2 class="mb-4 text-lg font-semibold text-gray-900">Video Information</h2>
              <div class="flex items-start space-x-4">
                <img
                  :src="report.videoFile.thumbnail"
                  :alt="report.videoFile.name"
                  class="h-24 w-32 rounded object-cover"
                />
                <div class="flex-1">
                  <h3 class="text-lg font-medium text-gray-900">{{ report.videoFile.name }}</h3>
                  <div class="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span class="font-medium">File Size:</span>
                      {{ formatFileSize(report.videoFile.size) }}
                    </div>
                    <div>
                      <span class="font-medium">Duration:</span>
                      {{ formatDuration(report.videoFile.duration) }}
                    </div>
                    <div>
                      <span class="font-medium">Rating System:</span>
                      {{ report.ratingSystem.toUpperCase() }}
                    </div>
                    <div v-if="report.suggestedRating">
                      <span class="font-medium">Suggested Rating:</span>
                      <span
                        class="ml-1 rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                      >
                        {{ report.suggestedRating }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Analysis Results -->
            <div
              v-if="report.status === 'completed'"
              class="rounded-lg border bg-white p-6 shadow-sm"
            >
              <h2 class="mb-4 text-lg font-semibold text-gray-900">Analysis Results</h2>

              <!-- Content Detection Summary -->
              <div class="mb-6">
                <h3 class="text-md mb-3 font-medium text-gray-900">Content Detection Summary</h3>
                <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div class="rounded-lg bg-red-50 p-4">
                    <div class="flex items-center">
                      <div class="flex-shrink-0">
                        <svg
                          class="h-6 w-6 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                          ></path>
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-red-800">Violence Detected</p>
                        <p class="text-2xl font-bold text-red-900">{{ getViolenceCount() }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="rounded-lg bg-orange-50 p-4">
                    <div class="flex items-center">
                      <div class="flex-shrink-0">
                        <svg
                          class="h-6 w-6 text-orange-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-orange-800">Adult Content</p>
                        <p class="text-2xl font-bold text-orange-900">
                          {{ getAdultContentCount() }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="rounded-lg bg-yellow-50 p-4">
                    <div class="flex items-center">
                      <div class="flex-shrink-0">
                        <svg
                          class="h-6 w-6 text-yellow-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          ></path>
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-yellow-800">Language Issues</p>
                        <p class="text-2xl font-bold text-yellow-900">
                          {{ getLanguageIssuesCount() }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Detected Scenes -->
              <div>
                <h3 class="text-md mb-3 font-medium text-gray-900">Detected Scenes</h3>
                <div class="space-y-3">
                  <div
                    v-for="scene in getMockAnalysisResults()"
                    :key="scene.timestamp"
                    class="flex items-start space-x-4 rounded-lg border p-4"
                  >
                    <img
                      :src="scene.screenshot"
                      :alt="`Scene at ${scene.timestamp}`"
                      class="h-16 w-24 rounded object-cover"
                    />
                    <div class="flex-1">
                      <div class="flex items-center justify-between">
                        <h4 class="text-sm font-medium text-gray-900">{{ scene.category }}</h4>
                        <span class="text-xs text-gray-500">{{ scene.timestamp }}</span>
                      </div>
                      <p class="mt-1 text-sm text-gray-600">{{ scene.description }}</p>
                      <div class="mt-2 flex items-center space-x-2">
                        <span class="text-xs text-gray-500">Confidence:</span>
                        <div class="h-2 flex-1 rounded-full bg-gray-200">
                          <div
                            class="h-2 rounded-full"
                            :class="getConfidenceColor(scene.confidence)"
                            :style="{ width: `${scene.confidence}%` }"
                          ></div>
                        </div>
                        <span class="text-xs font-medium text-gray-700"
                          >{{ scene.confidence }}%</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Processing Status -->
            <div
              v-else-if="report.status === 'processing'"
              class="rounded-lg border bg-white p-6 shadow-sm"
            >
              <h2 class="mb-4 text-lg font-semibold text-gray-900">Processing Status</h2>
              <div class="flex items-center space-x-4">
                <div
                  class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
                ></div>
                <div>
                  <p class="text-sm font-medium text-gray-900">AI analysis in progress...</p>
                  <p class="text-sm text-gray-600">
                    This may take several minutes depending on video length
                  </p>
                </div>
              </div>
            </div>

            <!-- Failed Status -->
            <div
              v-else-if="report.status === 'failed'"
              class="rounded-lg border bg-white p-6 shadow-sm"
            >
              <h2 class="mb-4 text-lg font-semibold text-gray-900">Processing Failed</h2>
              <div class="flex items-center space-x-4">
                <svg
                  class="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-900">Analysis failed to complete</p>
                  <p class="text-sm text-gray-600">Please try processing the video again</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Guidelines Applied -->
            <div class="rounded-lg border bg-white p-6 shadow-sm">
              <h3 class="mb-4 text-lg font-semibold text-gray-900">Guidelines Applied</h3>

              <!-- Predefined Guidelines -->
              <div v-if="report.guidelines.length > 0" class="mb-4">
                <h4 class="mb-2 text-sm font-medium text-gray-700">Predefined Guidelines</h4>
                <div class="space-y-2">
                  <div
                    v-for="guideline in report.guidelines"
                    :key="guideline"
                    class="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked
                      disabled
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="text-sm text-gray-900">{{ guideline }}</span>
                    <span
                      class="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                      >Predefined</span
                    >
                  </div>
                </div>
              </div>

              <!-- Custom Guidelines -->
              <div v-if="report.customGuidelines.length > 0">
                <h4 class="mb-2 text-sm font-medium text-gray-700">Custom Guidelines</h4>
                <div class="space-y-2">
                  <div
                    v-for="guideline in report.customGuidelines"
                    :key="guideline"
                    class="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked
                      disabled
                      class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span class="text-sm text-gray-900">{{ guideline }}</span>
                    <span
                      class="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
                      >Custom</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Rating Information -->
            <div class="rounded-lg border bg-white p-6 shadow-sm">
              <h3 class="mb-4 text-lg font-semibold text-gray-900">Rating Information</h3>
              <div class="space-y-3">
                <div>
                  <span class="text-sm font-medium text-gray-700">Rating System:</span>
                  <span class="ml-2 text-sm text-gray-900">{{
                    report.ratingSystem.toUpperCase()
                  }}</span>
                </div>
                <div v-if="report.suggestedRating">
                  <span class="text-sm font-medium text-gray-700">Suggested Rating:</span>
                  <span
                    class="ml-2 rounded bg-blue-100 px-2 py-1 text-sm font-medium text-blue-800"
                  >
                    {{ report.suggestedRating }}
                  </span>
                </div>
                <div v-if="report.status === 'completed'">
                  <button
                    @click="showRatingOverride = !showRatingOverride"
                    class="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Override Rating
                  </button>
                  <div v-if="showRatingOverride" class="mt-2">
                    <select class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                      <option value="">Select new rating</option>
                      <option value="G">G - General Audiences</option>
                      <option value="PG">PG - Parental Guidance</option>
                      <option value="PG-13">PG-13 - Parents Strongly Cautioned</option>
                      <option value="R">R - Restricted</option>
                      <option value="NC-17">NC-17 - No One 17 and Under Admitted</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Export Options -->
            <div
              v-if="report.status === 'completed'"
              class="rounded-lg border bg-white p-6 shadow-sm"
            >
              <h3 class="mb-4 text-lg font-semibold text-gray-900">Export Options</h3>
              <div class="space-y-3">
                <button
                  @click="exportReport('pdf')"
                  class="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Export as PDF
                </button>
                <button
                  @click="exportReport('docx')"
                  class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Export as DOCX
                </button>
                <button
                  @click="printReport"
                  class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Print Report
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
import { useRoute, useRouter } from 'vue-router'

// Mock data interface
interface Report {
  id: string
  videoFile: {
    name: string
    size: number
    duration: number
    thumbnail: string
  }
  status: 'processing' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
  processingDuration?: number
  guidelines: string[]
  customGuidelines: string[]
  ratingSystem: string
  suggestedRating?: string
}

interface AnalysisScene {
  timestamp: string
  category: string
  confidence: number
  description: string
  screenshot: string
}

// Route and router
const route = useRoute()
const router = useRouter()

// Reactive data
const loading = ref(true)
const report = ref<Report | null>(null)
const showRatingOverride = ref(false)

// Mock data
const mockReports: Report[] = [
  {
    id: 'RPT-2024-001',
    videoFile: {
      name: 'action_movie_trailer.mp4',
      size: 125000000,
      duration: 180,
      thumbnail: 'https://placehold.co/80x45/4F46E5/FFFFFF?text=Action',
    },
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    completedAt: '2024-01-15T12:45:00Z',
    processingDuration: 135,
    guidelines: ['Violence', 'Adult Content'],
    customGuidelines: ['Excessive gun violence'],
    ratingSystem: 'mpaa',
    suggestedRating: 'R',
  },
  {
    id: 'RPT-2024-002',
    videoFile: {
      name: 'family_comedy.mp4',
      size: 89000000,
      duration: 95,
      thumbnail: 'https://placehold.co/80x45/10B981/FFFFFF?text=Comedy',
    },
    status: 'processing',
    createdAt: '2024-01-15T14:20:00Z',
    guidelines: ['Hate Speech'],
    customGuidelines: [],
    ratingSystem: 'bbfc',
  },
  {
    id: 'RPT-2024-003',
    videoFile: {
      name: 'documentary.mp4',
      size: 210000000,
      duration: 120,
      thumbnail: 'https://placehold.co/80x45/F59E0B/FFFFFF?text=Doc',
    },
    status: 'failed',
    createdAt: '2024-01-15T09:15:00Z',
    guidelines: ['Violence', 'Adult Content'],
    customGuidelines: ['Graphic content'],
    ratingSystem: 'fsk',
  },
]

// Methods
const loadReport = () => {
  const reportId = route.params.id as string
  const foundReport = mockReports.find((r) => r.id === reportId)

  setTimeout(() => {
    report.value = foundReport || null
    loading.value = false
  }, 1000) // Simulate loading
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'processing':
      return 'bg-yellow-100 text-yellow-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'processing':
      return 'Processing'
    case 'completed':
      return 'Completed'
    case 'failed':
      return 'Failed'
    default:
      return 'Unknown'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString()
}

const formatDuration = (seconds?: number) => {
  if (!seconds) return 'N/A'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const formatFileSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
}

const getMockAnalysisResults = (): AnalysisScene[] => {
  if (!report.value || report.value.status !== 'completed') return []

  return [
    {
      timestamp: '0:45',
      category: 'Violence',
      confidence: 85,
      description: 'Gun violence scene with multiple shots fired',
      screenshot: 'https://placehold.co/96x64/EF4444/FFFFFF?text=Violence',
    },
    {
      timestamp: '1:23',
      category: 'Adult Content',
      confidence: 92,
      description: 'Sexual content and nudity detected',
      screenshot: 'https://placehold.co/96x64/F59E0B/FFFFFF?text=Adult',
    },
    {
      timestamp: '2:15',
      category: 'Violence',
      confidence: 78,
      description: 'Physical altercation between characters',
      screenshot: 'https://placehold.co/96x64/EF4444/FFFFFF?text=Fight',
    },
    {
      timestamp: '3:42',
      category: 'Language',
      confidence: 65,
      description: 'Strong language and profanity detected',
      screenshot: 'https://placehold.co/96x64/8B5CF6/FFFFFF?text=Language',
    },
  ]
}

const getViolenceCount = () => {
  return getMockAnalysisResults().filter((scene) => scene.category === 'Violence').length
}

const getAdultContentCount = () => {
  return getMockAnalysisResults().filter((scene) => scene.category === 'Adult Content').length
}

const getLanguageIssuesCount = () => {
  return getMockAnalysisResults().filter((scene) => scene.category === 'Language').length
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 80) return 'bg-red-500'
  if (confidence >= 60) return 'bg-yellow-500'
  return 'bg-green-500'
}

const exportReport = (format: string = 'pdf') => {
  console.log(`Exporting report ${report.value?.id} as ${format}`)
  // TODO: Implement export functionality
}

const printReport = () => {
  window.print()
}

const deleteReport = () => {
  if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
    console.log(`Deleting report ${report.value?.id}`)
    // TODO: Implement delete functionality
    router.push('/reports')
  }
}

// Lifecycle
onMounted(() => {
  loadReport()
})
</script>
