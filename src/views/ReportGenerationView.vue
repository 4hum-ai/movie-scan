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
      <ReportFilters
        :available-statuses="availableStatuses"
        :available-rating-systems="availableRatingSystems"
        :search-query="searchQuery"
        :status-filter="statusFilter"
        :rating-system-filter="ratingSystemFilter"
        :date-range-filter="dateRangeFilter"
        @update:search-query="searchQuery = $event"
        @update:status-filter="statusFilter = $event"
        @update:rating-system-filter="ratingSystemFilter = $event"
        @update:date-range-filter="dateRangeFilter = $event"
        @clear-filters="clearFilters"
      />

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
          <div class="mx-auto h-8 w-8 animate-spin text-blue-600">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
          </div>
          <p class="mt-2 text-sm text-gray-600">Loading reports...</p>
        </div>

        <!-- Reports Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="w-12 px-3 py-3 text-left">
                  <input
                    v-model="selectAll"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    @change="toggleSelectAll"
                  />
                </th>
                <th
                  class="w-32 px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Report
                </th>
                <th
                  class="w-64 px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Video
                </th>
                <th
                  class="w-24 px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Status
                </th>
                <th
                  class="w-24 px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Scenes
                </th>
                <th
                  class="w-40 px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Rating System
                </th>
                <th
                  class="w-32 px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Created
                </th>
                <th
                  class="w-32 px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <ReportRow
                v-for="report in filteredReports"
                :key="report.id"
                :report="report"
                v-model:selected-reports="selectedReports"
                @export-report="exportReport"
                @delete-report="deleteReport"
              />
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
import { ref, onMounted, watch } from 'vue'
import ReportFilters from '@/components/molecules/ReportFilters.vue'
import ReportRow from '@/components/molecules/ReportRow.vue'
import { useReportData } from '@/composables/useReportData'
import { useReportFilters } from '@/composables/useReportFilters'

// Initialize composables
const { reports, loading, availableStatuses, availableRatingSystems, loadReportsWithMedia } =
  useReportData()
const {
  searchQuery,
  statusFilter,
  ratingSystemFilter,
  dateRangeFilter,
  filteredReports,
  clearFilters,
} = useReportFilters(reports)

// Reactive data
const selectedReports = ref<string[]>([])
const selectAll = ref(false)

// Load data on mount
onMounted(() => {
  loadReportsWithMedia()
})

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

// Watch for changes in filtered reports to update select all
watch(filteredReports, () => {
  selectAll.value =
    selectedReports.value.length === filteredReports.value.length &&
    filteredReports.value.length > 0
})
</script>
