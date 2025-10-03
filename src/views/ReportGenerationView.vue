<template>
  <div class="bg-background min-h-screen">
    <!-- Main Content -->
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Analysis Reports</h1>
        <p class="mt-2 text-sm text-gray-600">View and manage all video content analysis reports</p>
      </div>

      <!-- Filters and Search -->
      <div class="mb-6 rounded-lg border bg-white p-6 shadow-sm">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Search</label>
            <input
              v-model="searchQuery"
              type="text"
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="Search by report ID or filename..."
            />
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select
              v-model="statusFilter"
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <!-- Rating System Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Rating System</label>
            <select
              v-model="ratingSystemFilter"
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">All Systems</option>
              <option value="mpaa">MPAA</option>
              <option value="bbfc">BBFC</option>
              <option value="fsk">FSK</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <!-- Date Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Date Range</label>
            <select
              v-model="dateRangeFilter"
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
        </div>

        <!-- Clear Filters -->
        <div class="mt-4 flex justify-end">
          <button
            @click="clearFilters"
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Reports List -->
      <div class="rounded-lg border bg-white shadow-sm">
        <!-- Table Header -->
        <div class="border-b bg-gray-50 px-6 py-3">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              Reports ({{ filteredReports.length }})
            </h3>
            <div class="flex space-x-2">
              <button
                @click="exportSelected"
                :disabled="selectedReports.length === 0"
                class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Export Selected ({{ selectedReports.length }})
              </button>
              <button
                @click="deleteSelected"
                :disabled="selectedReports.length === 0"
                class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>

        <!-- Reports Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left">
                  <input
                    v-model="selectAll"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    @change="toggleSelectAll"
                  />
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Report
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Video
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Guidelines
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Rating System
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Created
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="report in filteredReports" :key="report.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <input
                    v-model="selectedReports"
                    :value="report.id"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td class="px-6 py-4">
                  <div>
                    <router-link
                      :to="`/reports/${report.id}`"
                      class="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {{ report.id }}
                    </router-link>
                    <p class="text-xs text-gray-500">
                      {{ formatDuration(report.processingDuration) }}
                    </p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-3">
                    <img
                      :src="report.videoFile.thumbnail"
                      :alt="report.videoFile.name"
                      class="h-12 w-20 rounded object-cover"
                    />
                    <div>
                      <p class="text-sm font-medium text-gray-900">
                        {{ report.videoFile.name }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ formatFileSize(report.videoFile.size) }} •
                        {{ formatDuration(report.videoFile.duration) }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex rounded-full px-2 py-1 text-xs font-medium"
                    :class="getStatusClass(report.status)"
                  >
                    {{ getStatusText(report.status) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="guideline in report.guidelines.slice(0, 2)"
                      :key="guideline"
                      class="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                    >
                      {{ guideline }}
                    </span>
                    <span
                      v-if="report.guidelines.length > 2"
                      class="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
                    >
                      +{{ report.guidelines.length - 2 }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-gray-900">{{ report.ratingSystem.toUpperCase() }}</span>
                </td>
                <td class="px-6 py-4">
                  <div>
                    <p class="text-sm text-gray-900">{{ formatDate(report.createdAt) }}</p>
                    <p class="text-xs text-gray-500">{{ formatTime(report.createdAt) }}</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex space-x-2">
                    <router-link
                      :to="`/reports/${report.id}`"
                      class="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      View
                    </router-link>
                    <button
                      v-if="report.status === 'completed'"
                      @click="exportReport(report.id)"
                      class="rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                    >
                      Export
                    </button>
                    <button
                      @click="deleteReport(report.id)"
                      class="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredReports.length === 0" class="p-12 text-center">
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
          <h3 class="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{
              searchQuery || statusFilter || ratingSystemFilter || dateRangeFilter
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by processing your first video.'
            }}
          </p>
          <div class="mt-6">
            <router-link
              to="/process"
              class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Process Video
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('')
const ratingSystemFilter = ref('')
const dateRangeFilter = ref('')
const selectedReports = ref<string[]>([])
const selectAll = ref(false)

// Mock data
const reports = ref<Report[]>([
  {
    id: 'RPT-2024-001',
    videoFile: {
      name: 'action_movie_trailer.mp4',
      size: 125000000,
      duration: 180,
      thumbnail: 'https://via.placeholder.com/80x45/4F46E5/FFFFFF?text=Action',
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
      thumbnail: 'https://via.placeholder.com/80x45/10B981/FFFFFF?text=Comedy',
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
      thumbnail: 'https://via.placeholder.com/80x45/F59E0B/FFFFFF?text=Doc',
    },
    status: 'failed',
    createdAt: '2024-01-15T09:15:00Z',
    guidelines: ['Violence', 'Adult Content'],
    customGuidelines: ['Graphic content'],
    ratingSystem: 'fsk',
  },
  {
    id: 'RPT-2024-004',
    videoFile: {
      name: 'horror_movie.mp4',
      size: 156000000,
      duration: 105,
      thumbnail: 'https://via.placeholder.com/80x45/EF4444/FFFFFF?text=Horror',
    },
    status: 'completed',
    createdAt: '2024-01-14T16:45:00Z',
    completedAt: '2024-01-14T18:30:00Z',
    processingDuration: 105,
    guidelines: ['Violence', 'Adult Content'],
    customGuidelines: ['Gore', 'Jump scares'],
    ratingSystem: 'custom',
    suggestedRating: '18+',
  },
])

// Computed properties
const filteredReports = computed(() => {
  let filtered = reports.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (report) =>
        report.id.toLowerCase().includes(query) ||
        report.videoFile.name.toLowerCase().includes(query),
    )
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter((report) => report.status === statusFilter.value)
  }

  // Rating system filter
  if (ratingSystemFilter.value) {
    filtered = filtered.filter((report) => report.ratingSystem === ratingSystemFilter.value)
  }

  // Date range filter
  if (dateRangeFilter.value) {
    const now = new Date()
    const reportDate = new Date()

    filtered = filtered.filter((report) => {
      reportDate.setTime(new Date(report.createdAt).getTime())

      switch (dateRangeFilter.value) {
        case 'today': {
          return reportDate.toDateString() === now.toDateString()
        }
        case 'week': {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return reportDate >= weekAgo
        }
        case 'month': {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return reportDate >= monthAgo
        }
        case 'quarter': {
          const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          return reportDate >= quarterAgo
        }
        default:
          return true
      }
    })
  }

  return filtered
})

// Methods
const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  ratingSystemFilter.value = ''
  dateRangeFilter.value = ''
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedReports.value = filteredReports.value.map((report) => report.id)
  } else {
    selectedReports.value = []
  }
}

const exportSelected = () => {
  console.log('Exporting selected reports:', selectedReports.value)
  // TODO: Implement bulk export
}

const deleteSelected = () => {
  if (confirm(`Are you sure you want to delete ${selectedReports.value.length} reports?`)) {
    reports.value = reports.value.filter((report) => !selectedReports.value.includes(report.id))
    selectedReports.value = []
    selectAll.value = false
  }
}

const exportReport = (reportId: string) => {
  console.log('Exporting report:', reportId)
  // TODO: Implement single report export
}

const deleteReport = (reportId: string) => {
  if (confirm('Are you sure you want to delete this report?')) {
    reports.value = reports.value.filter((report) => report.id !== reportId)
  }
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

// Watch for changes in filtered reports to update select all
import { watch } from 'vue'
watch(filteredReports, () => {
  selectAll.value =
    selectedReports.value.length === filteredReports.value.length &&
    filteredReports.value.length > 0
})
</script>
