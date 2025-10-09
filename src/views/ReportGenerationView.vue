<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
  >
    <!-- Background Pattern -->
    <div
      class="absolute inset-0 opacity-40"
      style="
        background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;);
      "
    ></div>

    <!-- Main Content -->
    <div class="relative mx-auto max-w-7xl px-4 pt-24 pb-8 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="animate-fade-in mb-12 text-center">
        <div
          class="animate-scale-in mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-1"
        >
          <div class="rounded-full bg-white px-4 py-2 dark:bg-gray-900">
            <h1
              class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent"
            >
              Analysis Reports
            </h1>
          </div>
        </div>
        <p class="animate-slide-up text-lg text-gray-600 dark:text-gray-300">
          View and manage all video content analysis reports
        </p>
      </div>

      <!-- Filters and Search -->
      <div
        class="animate-slide-up mb-8 rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm dark:bg-gray-800/80"
        style="animation-delay: 0.1s"
      >
        <div class="mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Filter & Search</h2>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Refine your reports with advanced filters
          </p>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
          <!-- Search -->
          <div class="group">
            <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >Search</label
            >
            <div class="relative">
              <IconMagnify class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                class="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-700/80 dark:text-white dark:focus:border-blue-400"
                placeholder="Search by report ID or filename..."
              />
            </div>
          </div>

          <!-- Status Filter -->
          <div class="group">
            <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >Status</label
            >
            <select
              v-model="statusFilter"
              class="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-700/80 dark:text-white dark:focus:border-blue-400"
            >
              <option value="">All Status</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <!-- Rating System Filter -->
          <div class="group">
            <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >Rating System</label
            >
            <select
              v-model="ratingSystemFilter"
              class="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-700/80 dark:text-white dark:focus:border-blue-400"
            >
              <option value="">All Systems</option>
              <option value="mpaa">MPAA</option>
              <option value="bbfc">BBFC</option>
              <option value="fsk">FSK</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <!-- Date Range -->
          <div class="group">
            <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >Date Range</label
            >
            <select
              v-model="dateRangeFilter"
              class="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-700/80 dark:text-white dark:focus:border-blue-400"
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
        <div class="mt-6 flex justify-end">
          <button
            @click="clearFilters"
            class="inline-flex items-center rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 shadow-lg transition-all duration-300 hover:scale-105 hover:from-slate-200 hover:to-slate-300 hover:shadow-xl dark:from-slate-700/50 dark:to-slate-600/50 dark:text-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-500"
          >
            <IconClose class="mr-2 h-4 w-4" />
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Reports List -->
      <div
        class="animate-slide-up rounded-2xl bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80"
        style="animation-delay: 0.2s"
      >
        <!-- Table Header -->
        <div
          class="border-b border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-gray-100/80 px-8 py-6 backdrop-blur-sm dark:from-gray-700/50 dark:to-gray-600/50"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
              >
                <IconChartLine class="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                  Reports ({{ filteredReports.length }})
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-300">Manage your analysis reports</p>
              </div>
            </div>
            <div class="flex space-x-3">
              <button
                @click="exportSelected"
                :disabled="selectedReports.length === 0"
                class="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:scale-100 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
              >
                Export Selected ({{ selectedReports.length }})
              </button>
              <button
                @click="deleteSelected"
                :disabled="selectedReports.length === 0"
                class="rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:scale-100 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>

        <!-- Reports Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-white/20">
                <th class="px-8 py-6 text-left">
                  <div class="flex items-center">
                    <input
                      v-model="selectAll"
                      type="checkbox"
                      class="h-5 w-5 rounded-lg border-2 border-gray-300 text-blue-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      @change="toggleSelectAll"
                    />
                  </div>
                </th>
                <th class="px-8 py-6 text-left">
                  <div class="flex items-center space-x-2">
                    <IconFileDocument class="h-4 w-4 text-blue-600" />
                    <span class="text-sm font-bold text-gray-700 dark:text-gray-300">Report</span>
                  </div>
                </th>
                <th class="px-8 py-6 text-left">
                  <div class="flex items-center space-x-2">
                    <IconVideo class="h-4 w-4 text-green-600" />
                    <span class="text-sm font-bold text-gray-700 dark:text-gray-300">Video</span>
                  </div>
                </th>
                <th class="px-8 py-6 text-left">
                  <div class="flex items-center space-x-2">
                    <IconCheckCircle class="h-4 w-4 text-purple-600" />
                    <span class="text-sm font-bold text-gray-700 dark:text-gray-300">Status</span>
                  </div>
                </th>
                <th class="px-8 py-6 text-left">
                  <div class="flex items-center space-x-2">
                    <IconShield class="h-4 w-4 text-orange-600" />
                    <span class="text-sm font-bold text-gray-700 dark:text-gray-300"
                      >Guidelines</span
                    >
                  </div>
                </th>
                <th class="px-8 py-6 text-left">
                  <div class="flex items-center space-x-2">
                    <IconStar class="h-4 w-4 text-yellow-600" />
                    <span class="text-sm font-bold text-gray-700 dark:text-gray-300"
                      >Rating System</span
                    >
                  </div>
                </th>
                <th class="px-8 py-6 text-left">
                  <div class="flex items-center space-x-2">
                    <IconCalendar class="h-4 w-4 text-indigo-600" />
                    <span class="text-sm font-bold text-gray-700 dark:text-gray-300">Created</span>
                  </div>
                </th>
                <th class="px-8 py-6 text-left">
                  <div class="flex items-center space-x-2">
                    <IconCog class="h-4 w-4 text-gray-600" />
                    <span class="text-sm font-bold text-gray-700 dark:text-gray-300">Actions</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="report in filteredReports"
                :key="report.id"
                class="border-b border-white/10 transition-all duration-300 hover:bg-white/20 dark:hover:bg-gray-700/20"
              >
                <td class="px-6 py-4 align-middle">
                  <div class="flex items-center justify-center">
                    <input
                      v-model="selectedReports"
                      :value="report.id"
                      type="checkbox"
                      class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </td>
                <td class="px-6 py-4 align-middle">
                  <div
                    class="rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-3 dark:from-blue-900/20 dark:to-blue-800/20"
                  >
                    <router-link
                      :to="`/reports/${report.id}`"
                      class="block text-sm font-semibold whitespace-nowrap text-blue-600 transition-colors duration-200 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {{ report.id }}
                    </router-link>
                    <p class="mt-1 text-xs text-blue-500 dark:text-blue-300">
                      {{ formatDuration(report.processingDuration) }}
                    </p>
                  </div>
                </td>
                <td class="px-6 py-4 align-middle">
                  <div class="flex items-center space-x-3">
                    <div class="relative flex-shrink-0 overflow-hidden rounded-lg shadow-sm">
                      <img
                        :src="report.videoFile.thumbnail"
                        :alt="report.videoFile.name"
                        class="h-12 w-16 object-cover transition-transform duration-200 hover:scale-105"
                      />
                      <div
                        class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                      ></div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-semibold break-words text-gray-900 dark:text-white">
                        {{ report.videoFile.name }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatFileSize(report.videoFile.size) }} •
                        {{ formatDuration(report.videoFile.duration) }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 align-middle">
                  <span
                    class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                    :class="getStatusClass(report.status)"
                  >
                    {{ getStatusText(report.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 align-middle">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="guideline in report.guidelines.slice(0, 2)"
                      :key="guideline"
                      class="inline-flex rounded-full bg-gradient-to-r from-orange-100 to-orange-200 px-2 py-1 text-xs font-medium text-orange-800 dark:from-orange-900/30 dark:to-orange-800/30 dark:text-orange-200"
                    >
                      {{ guideline }}
                    </span>
                    <span
                      v-if="report.guidelines.length > 2"
                      class="inline-flex rounded-full bg-gradient-to-r from-gray-100 to-gray-200 px-2 py-1 text-xs font-medium text-gray-800 dark:from-gray-700/50 dark:to-gray-600/50 dark:text-gray-300"
                    >
                      +{{ report.guidelines.length - 2 }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 align-middle">
                  <span
                    class="rounded-lg bg-gradient-to-r from-purple-100 to-purple-200 px-3 py-1 text-sm font-semibold text-purple-800 dark:from-purple-900/30 dark:to-purple-800/30 dark:text-purple-200"
                  >
                    {{ report.ratingSystem.toUpperCase() }}
                  </span>
                </td>
                <td class="px-6 py-4 align-middle">
                  <div>
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{ formatDate(report.createdAt) }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatTime(report.createdAt) }}
                    </p>
                  </div>
                </td>
                <td class="px-6 py-4 align-middle">
                  <div class="flex space-x-1">
                    <router-link
                      :to="`/reports/${report.id}`"
                      class="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      View
                    </router-link>
                    <button
                      v-if="report.status === 'completed'"
                      @click="exportReport(report.id)"
                      class="rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      Export
                    </button>
                    <button
                      @click="deleteReport(report.id)"
                      class="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
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
        <div v-if="filteredReports.length === 0" class="p-16 text-center">
          <div
            class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-gray-100 to-gray-200 shadow-lg dark:from-gray-700/50 dark:to-gray-600/50"
          >
            <IconChartLine class="h-10 w-10 text-gray-400" />
          </div>
          <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">No reports found</h3>
          <p class="mb-8 text-gray-600 dark:text-gray-300">
            {{
              searchQuery || statusFilter || ratingSystemFilter || dateRangeFilter
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by processing your first video.'
            }}
          </p>
          <div>
            <router-link
              to="/process"
              class="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <IconPlus class="mr-2 h-5 w-5" />
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
import IconChartLine from '~icons/mdi/chart-line'
import IconMagnify from '~icons/mdi/magnify'
import IconPlus from '~icons/mdi/plus'
import IconClose from '~icons/mdi/close'
import IconFileDocument from '~icons/mdi/file-document'
import IconVideo from '~icons/mdi/video'
import IconCheckCircle from '~icons/mdi/check-circle'
import IconShield from '~icons/mdi/shield'
import IconStar from '~icons/mdi/star'
import IconCalendar from '~icons/mdi/calendar'
import IconCog from '~icons/mdi/cog'

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
  {
    id: 'RPT-2024-004',
    videoFile: {
      name: 'horror_movie.mp4',
      size: 156000000,
      duration: 105,
      thumbnail: 'https://placehold.co/80x45/EF4444/FFFFFF?text=Horror',
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
      report =>
        report.id.toLowerCase().includes(query) ||
        report.videoFile.name.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(report => report.status === statusFilter.value)
  }

  // Rating system filter
  if (ratingSystemFilter.value) {
    filtered = filtered.filter(report => report.ratingSystem === ratingSystemFilter.value)
  }

  // Date range filter
  if (dateRangeFilter.value) {
    const now = new Date()
    const reportDate = new Date()

    filtered = filtered.filter(report => {
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
    selectedReports.value = filteredReports.value.map(report => report.id)
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
    reports.value = reports.value.filter(report => !selectedReports.value.includes(report.id))
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
    reports.value = reports.value.filter(report => report.id !== reportId)
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'processing':
      return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 dark:from-yellow-900/30 dark:to-yellow-800/30 dark:text-yellow-200'
    case 'completed':
      return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-200'
    case 'failed':
      return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/30 dark:to-red-800/30 dark:text-red-200'
    default:
      return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 dark:from-gray-700/50 dark:to-gray-600/50 dark:text-gray-300'
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
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
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
