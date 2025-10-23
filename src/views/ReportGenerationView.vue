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
      <ReportsTable
        :reports="filteredReports"
        :loading="loading"
        v-model:selected-reports="selectedReports"
        v-model:select-all="selectAll"
        :search-query="searchQuery"
        :status-filter="statusFilter"
        :rating-system-filter="ratingSystemFilter"
        :date-range-filter="dateRangeFilter"
        @export-selected="exportSelected"
        @delete-selected="deleteSelected"
        @export-report="exportReport"
        @delete-report="deleteReport"
      />
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-if="showDeleteModal"
      :open="showDeleteModal"
      :title="deleteModalTitle"
      :message="deleteModalMessage"
      confirm-label="Delete"
      cancel-label="Cancel"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import ReportFilters from '@/components/molecules/ReportFilters.vue'
import ReportsTable from '@/components/organisms/ReportsTable.vue'
import ConfirmModal from '@/components/molecules/ConfirmModal.vue'
import {
  useReportFilters,
  useReports,
  useResourceService,
  useMediaRelationships,
  useRatingSystems,
  type EnrichedReport,
  type ReportStatus,
  type RatingSystemItem,
  type MediaItem,
} from '@/composables'

// Initialize composables
const { reports: rawReports, fetchReports } = useReports()
const { deleteReport: deleteReportApi } = useReports()
const { remove } = useResourceService()
const { fetchMediaRelationships } = useMediaRelationships()
const { ratingSystems: allRatingSystems, fetchRatingSystems } = useRatingSystems()

// Local state
const reports = ref<EnrichedReport[]>([])
const loading = ref(false)
const availableStatuses = ref<ReportStatus[]>([])
const availableRatingSystems = ref<RatingSystemItem[]>([])

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

// Modal state
const showDeleteModal = ref(false)
const deleteModalTitle = ref('')
const deleteModalMessage = ref('')
const deleteAction = ref<'single' | 'bulk'>('single')
const reportToDelete = ref<string>('')

// Load and enrich reports data
const loadReportsWithMedia = async (): Promise<void> => {
  try {
    loading.value = true

    // Step 1: Fetch all reports
    await fetchReports()

    // Early return if no reports found
    if (rawReports.value.length === 0) {
      reports.value = []
      return
    }

    // Step 2: Fetch all media-relationships for reports
    const { data: allMediaRelationships } = await fetchMediaRelationships(
      {
        entityType: 'reports',
        relationshipType: 'attachment',
      },
      1,
      1000,
    )

    // Step 3: Bulk fetch all media data
    const { list } = useResourceService()
    const mediaResponse = await list('media', { page: 1, limit: 1000 })
    const allMedia = mediaResponse.data as unknown as MediaItem[]
    const mediaMap = new Map(allMedia.map((media: MediaItem) => [media.id, media]))

    // Step 4: Bulk fetch all rating systems data
    await fetchRatingSystems()
    const ratingSystemMap = new Map(
      allRatingSystems.value.map((ratingSystem) => [ratingSystem.id, ratingSystem]),
    )

    // Step 5: Extract filter options from the data
    // Build available statuses for filter dropdown
    const uniqueStatuses = [
      ...new Set(rawReports.value.map((report) => report.status).filter(Boolean)),
    ]
    availableStatuses.value = uniqueStatuses.sort()

    // Build available rating systems for filter dropdown
    availableRatingSystems.value = [...allRatingSystems.value].sort((a, b) =>
      a.name.localeCompare(b.name),
    ) as RatingSystemItem[]

    // Step 6: Create relationship mapping
    const reportMediaMap = new Map<string, string>()
    allMediaRelationships.forEach((rel) => {
      if (rel.entityType === 'reports' && rel.relationshipType === 'attachment') {
        reportMediaMap.set(rel.entityId, rel.mediaId)
      }
    })

    // Step 7: Enrich reports with related data
    const reportsWithMedia: EnrichedReport[] = rawReports.value.map((report) => {
      // Lookup media data for this report
      const mediaId = reportMediaMap.get(report.id)
      const media = mediaId ? mediaMap.get(mediaId) : undefined

      // Lookup rating system data for this report
      const ratingSystem = report.ratingSystemId
        ? ratingSystemMap.get(report.ratingSystemId)
        : undefined

      // Return enriched report with all related data
      return {
        ...report,
        mediaData: media,
        ratingSystemData: ratingSystem,
      } as EnrichedReport
    })

    // Update reactive state with enriched data
    reports.value = reportsWithMedia
  } catch (error) {
    console.error('Failed to load reports:', error)
    // TODO: Show user-friendly error message
    reports.value = [] // Reset to empty state on error
  } finally {
    loading.value = false
  }
}

// Load data on mount
onMounted(() => {
  loadReportsWithMedia()
})

const toggleSelectAll = (checked: boolean) => {
  if (checked) {
    selectedReports.value = filteredReports.value.map((report) => report.id)
  } else {
    selectedReports.value = []
  }
}

const exportSelected = () => {
  console.log('Exporting selected reports:', selectedReports.value)
  // TODO: Implement bulk export
}

// Helper function to delete media associated with a report
const deleteReportMedia = async (reportId: string): Promise<void> => {
  try {
    // Find the report in the current reports list to get its media data
    const report = reports.value.find((r) => r.id === reportId)
    if (report?.mediaData?.id) {
      await remove('media', report.mediaData.id)
    }
  } catch (error) {
    console.error('Failed to delete media for report:', reportId, error)
    // Don't throw error here, continue with report deletion
  }
}

// Helper function to handle report deletion with error handling
const handleReportDeletion = async (reportIds: string[]): Promise<void> => {
  try {
    // Delete media for all reports first
    await Promise.all(reportIds.map((reportId) => deleteReportMedia(reportId)))

    // Delete reports
    await Promise.all(reportIds.map((reportId) => deleteReportApi(reportId)))

    // Update local reports array to reflect deletions
    reports.value = reports.value.filter((report) => !reportIds.includes(report.id))

    // Clear selection if bulk delete
    if (reportIds.length > 1) {
      selectedReports.value = []
      selectAll.value = false
    }
  } catch (error) {
    console.error('Failed to delete reports:', error)
    throw error // Re-throw to be handled by caller
  }
}

const deleteSelected = () => {
  deleteAction.value = 'bulk'
  deleteModalTitle.value = 'Delete Selected Reports'
  deleteModalMessage.value = `Are you sure you want to delete ${selectedReports.value.length} reports and their associated media files? This action cannot be undone.`
  showDeleteModal.value = true
}

const exportReport = (reportId: string) => {
  console.log('Exporting report:', reportId)
  // TODO: Implement single report export
}

const deleteReport = (reportId: string) => {
  deleteAction.value = 'single'
  reportToDelete.value = reportId
  deleteModalTitle.value = 'Delete Report'
  deleteModalMessage.value =
    'Are you sure you want to delete this report and its associated media files? This action cannot be undone.'
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    const reportIds =
      deleteAction.value === 'single' ? [reportToDelete.value] : selectedReports.value

    await handleReportDeletion(reportIds)
  } catch (error) {
    console.error('Failed to delete reports:', error)
    // TODO: Show user-friendly error message
  } finally {
    showDeleteModal.value = false
  }
}

// Watch for changes in filtered reports to update select all
const stopWatcher = watch(filteredReports, () => {
  selectAll.value =
    selectedReports.value.length === filteredReports.value.length &&
    filteredReports.value.length > 0
})

// Watch for selectAll changes from ReportsTable component
watch(selectAll, (newValue) => {
  toggleSelectAll(newValue)
})

// Cleanup watcher on unmount
onBeforeUnmount(() => {
  stopWatcher()
})
</script>
