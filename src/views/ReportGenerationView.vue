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

        <!-- Loading State -->
        <div v-if="loading" class="p-12 text-center">
          <div class="animate-spin mx-auto h-8 w-8 text-blue-600">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </div>
          <p class="mt-2 text-sm text-gray-600">Loading reports...</p>
        </div>

        <!-- Reports Table -->
        <div v-else class="overflow-x-auto">
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
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-3">
                    <img
                      v-if="report.mediaData?.thumbnail"
                      :src="report.mediaData.thumbnail"
                      :alt="report.mediaData.fileName"
                      class="h-12 w-20 rounded object-cover"
                    />
                    <div v-else class="h-12 w-20 rounded bg-gray-200 flex items-center justify-center">
                      <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">
                        {{ report.mediaData?.fileName || 'No media file' }}
                      </p>
                      <p class="text-xs text-gray-500">
                        <span v-if="report.mediaData">
                          {{ formatFileSize(report.mediaData.fileSize) }} •
                          {{ formatDuration(report.mediaData.duration) }}
                        </span>
                        <span v-else>No media data</span>
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
                      v-for="scene in report.scenes.slice(0, 2)"
                      :key="scene.guideline"
                      class="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                    >
                      {{ scene.guideline }}
                    </span>
                    <span
                      v-if="report.scenes.length > 2"
                      class="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
                    >
                      +{{ report.scenes.length - 2 }}
                    </span>
                    <span
                      v-if="report.scenes.length === 0"
                      class="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
                    >
                      No scenes detected
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-gray-900">
                    {{ report.ratingSystemData?.name || report.ratingSystemId || 'Unknown' }}
                  </span>
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
import { ref, computed, onMounted } from 'vue'
import { useReports, useMediaRelationships, useResourceService, useRatingSystems, type ReportItem } from '@/composables'

// Combined data interface for UI
interface ReportWithMedia extends ReportItem {
  mediaData?: {
    fileName: string
    fileSize: number
    duration: number
    thumbnail?: string
  }
  ratingSystemData?: {
    name: string
    description?: string
  }
}

// Initialize composables
const { 
  reports: rawReports, 
  loading: reportsLoading, 
  error: reportsError,
  fetchReports 
} = useReports()

const { 
  getMediaIdsByEntity,
  getMediaRelationshipsByEntity,
  fetchMediaRelationships
} = useMediaRelationships()

const { 
  getById,
  list
} = useResourceService()

const {
  fetchRatingSystemById
} = useRatingSystems()

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('')
const ratingSystemFilter = ref('')
const dateRangeFilter = ref('')
const selectedReports = ref<string[]>([])
const selectAll = ref(false)
const reports = ref<ReportWithMedia[]>([])
const loading = ref(false)

// Load reports with media data (optimized - fetch all data once)
const loadReportsWithMedia = async () => {
  try {
    loading.value = true
    console.log('Starting optimized data loading...')
    
    // 1. Fetch all reports
    console.log('Fetching reports...')
    await fetchReports()
    console.log('Raw reports:', rawReports.value)
    
    if (rawReports.value.length === 0) {
      reports.value = []
      return
    }
    
    // 2. Fetch all media-relationships with attachment type
    console.log('Fetching all media-relationships...')
    const { data: allMediaRelationships } = await fetchMediaRelationships({
      relationshipType: 'attachment',
      entityType: 'reports'
    }, 1, 1000) // Get all relationships
    
    // 3. Get all unique media IDs and rating system IDs
    const mediaIds = [...new Set(allMediaRelationships.map(rel => rel.mediaId))]
    const ratingSystemIds = [...new Set(rawReports.value.map(report => report.ratingSystemId).filter(Boolean))]
    
    console.log('Unique media IDs:', mediaIds)
    console.log('Unique rating system IDs:', ratingSystemIds)
    
    // 4. Fetch all media data in one call
    console.log('Fetching all media data...')
    const mediaResponse = await list('media', { page: 1, limit: 1000 })
    const allMedia = mediaResponse.data || []
    const mediaMap = new Map(allMedia.map((media: any) => [media.id, media]))
    
    // 5. Fetch all rating systems data in one call  
    console.log('Fetching all rating systems data...')
    const ratingSystemsResponse = await list('rating-systems', { page: 1, limit: 1000 })
    const allRatingSystems = ratingSystemsResponse.data || []
    const ratingSystemMap = new Map(allRatingSystems.map((ratingSystem: any) => [ratingSystem.id, ratingSystem]))
    
    // 6. Create media relationships map (reportId -> mediaId)
    const reportMediaMap = new Map<string, string>()
    allMediaRelationships.forEach(rel => {
      if (rel.entityType === 'reports' && rel.relationshipType === 'attachment') {
        reportMediaMap.set(rel.entityId, rel.mediaId)
      }
    })
    
    // 7. Map all data together
    console.log('Mapping all data...')
    const reportsWithMedia: ReportWithMedia[] = rawReports.value.map(report => {
      // Get media data
      const mediaId = reportMediaMap.get(report.id)
      const media = mediaId ? mediaMap.get(mediaId) : null
      const mediaData = media ? {
        fileName: media.fileName || 'Unknown file',
        fileSize: media.fileSize || 0,
        duration: media.duration || 0,
        thumbnail: media.thumbnail || undefined,
      } : undefined
      
      // Get rating system data
      const ratingSystem = report.ratingSystemId ? ratingSystemMap.get(report.ratingSystemId) : null
      const ratingSystemData = ratingSystem ? {
        name: ratingSystem.name || 'Unknown rating system',
        description: ratingSystem.description || undefined,
      } : undefined
      
      return {
        ...report,
        mediaData,
        ratingSystemData,
      }
    })
    
    console.log('All reports with media (optimized):', reportsWithMedia)
    reports.value = reportsWithMedia
  } catch (error) {
    console.error('Failed to load reports:', error)
  } finally {
    loading.value = false
  }
}

// Load data on mount
onMounted(() => {
  loadReportsWithMedia()
})

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

const deleteSelected = async () => {
  if (confirm(`Are you sure you want to delete ${selectedReports.value.length} reports?`)) {
    try {
      // TODO: Implement bulk delete API call
      console.log('Deleting reports:', selectedReports.value)
      
      // For now, just remove from local state
      reports.value = reports.value.filter((report) => !selectedReports.value.includes(report.id))
      selectedReports.value = []
      selectAll.value = false
    } catch (error) {
      console.error('Failed to delete reports:', error)
    }
  }
}

const exportReport = (reportId: string) => {
  console.log('Exporting report:', reportId)
  // TODO: Implement single report export
}

const deleteReport = async (reportId: string) => {
  if (confirm('Are you sure you want to delete this report?')) {
    try {
      // TODO: Implement delete API call
      console.log('Deleting report:', reportId)
      
      // For now, just remove from local state
      reports.value = reports.value.filter((report) => report.id !== reportId)
    } catch (error) {
      console.error('Failed to delete report:', error)
    }
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'processing':
      return 'bg-blue-100 text-blue-800'
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
    case 'pending':
      return 'Pending'
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

const formatDate = (dateInput: any) => {
  try {
    let date: Date
    
    // Handle Firebase Timestamp format
    if (dateInput && typeof dateInput === 'object' && dateInput._seconds) {
      date = new Date(dateInput._seconds * 1000)
    } else if (typeof dateInput === 'string') {
      date = new Date(dateInput)
    } else {
      console.warn('Invalid date format:', dateInput)
      return 'Invalid Date'
    }
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateInput)
      return 'Invalid Date'
    }
    
    return date.toLocaleDateString()
  } catch (error) {
    console.error('Error formatting date:', error, dateInput)
    return 'Invalid Date'
  }
}

const formatTime = (dateInput: any) => {
  try {
    let date: Date
    
    // Handle Firebase Timestamp format
    if (dateInput && typeof dateInput === 'object' && dateInput._seconds) {
      date = new Date(dateInput._seconds * 1000)
    } else if (typeof dateInput === 'string') {
      date = new Date(dateInput)
    } else {
      console.warn('Invalid date format:', dateInput)
      return 'Invalid Date'
    }
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateInput)
      return 'Invalid Date'
    }
    
    return date.toLocaleTimeString()
  } catch (error) {
    console.error('Error formatting time:', error, dateInput)
    return 'Invalid Date'
  }
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
