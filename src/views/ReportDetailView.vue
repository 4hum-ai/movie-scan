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
        <ReportHeader
          ref="actionsMenuRef"
          :id="report.id"
          :status="report.status"
          :createdAt="report.createdAt"
          :menuItems="menuItems"
        />

        <div class="space-y-8">
          <VideoInfoCard
            :media="report.mediaData"
            :ratingSystem="currentRatingSystem"
            :suggestedRating="report.rating?.suggested || null"
          />

          <RatingInfoCard
            :ratingSystem="currentRatingSystem"
            :selectedKey="report.rating?.suggested || null"
          />

          <div
            v-if="report.status === 'completed'"
            class="rounded-lg border bg-white p-6 shadow-sm"
          >
            <AnalysisSummary
              :rows="guidelinesTableData"
              :scenesCount="analysisResults.length"
              :totalViolationMinutes="totalViolationMinutes"
              :primaryCategory="primaryViolationCategory"
            />
            <ScenesList :scenes="analysisResults" :videoUrl="videoUrl" />
          </div>

          <!-- Processing Status -->
          <ProcessingStatusCard v-else-if="report.status === 'processing'" />

          <!-- Failed Status -->
          <FailedStatusCard v-else-if="report.status === 'failed'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// Constants
const MICROSECONDS_TO_SECONDS = 1_000_000
const SECONDS_TO_MINUTES = 60
const TOAST_TIMEOUT = 6000
import { useRoute, useRouter } from 'vue-router'
import {
  ReportScene,
  EnrichedReport,
  MediaItem,
  RatingSystemItem,
  useReports,
  useMediaRelationships,
  useRatingSystems,
  useResourceService,
  useToast,
  useReportDetail,
} from '@/composables'
import type { MenuItem } from '@/components/atoms/ActionsMenu.vue'
import ReportHeader from '@/components/reports/ReportHeader.vue'
import VideoInfoCard from '@/components/reports/VideoInfoCard.vue'
import RatingInfoCard from '@/components/reports/RatingInfoCard.vue'
import AnalysisSummary from '@/components/reports/AnalysisSummary/AnalysisSummary.vue'
import ScenesList from '@/components/reports/Scenes/ScenesList.vue'
import ProcessingStatusCard from '@/components/reports/Status/ProcessingStatusCard.vue'
import FailedStatusCard from '@/components/reports/Status/FailedStatusCard.vue'

// Route
const route = useRoute()
const router = useRouter()

// Initialize composables
const { fetchReportById } = useReports()
const { getMediaRelationshipsByEntity } = useMediaRelationships()
const { fetchRatingSystemById } = useRatingSystems()
const { getById } = useResourceService()
const { push } = useToast()
const { parseMicros } = useReportDetail()

// Reactive data
const loading = ref(true)
const report = ref<EnrichedReport | null>(null)
const actionsMenuRef = ref<InstanceType<typeof ReportHeader> | null>(null)

// Computed properties for rating system data
const currentRatingSystem = computed(() => {
  if (!report.value) return null
  return report.value.ratingSystemData
})

// Computed property for video URL
const videoUrl = computed(() => {
  if (!report.value) return undefined
  return report.value.mediaData?.fileUrl
})

// Memoized computed properties for performance
const analysisResults = computed(() => {
  if (!report.value || report.value.status !== 'completed') return []
  return (report.value.scenes || []) as ReportScene[]
})

const guidelinesTableData = computed(() => {
  if (!report.value) return []

  const guidelines = report.value.ratingSystemData?.guidelines || []
  const scenes = report.value.scenes || []

  const totalDurationMinutes = report.value.mediaData?.duration
    ? report.value.mediaData.duration / SECONDS_TO_MINUTES
    : 0

  return guidelines.map((guideline: { name: string }) => {
    const matchingScenes = scenes.filter(
      (scene) =>
        scene.guideline === guideline.name ||
        scene.guideline.includes(guideline.name) ||
        guideline.name.includes(scene.guideline),
    )

    const totalMinutes = matchingScenes.reduce(
      (sum: number, scene: { endTime: string; startTime: string }) => {
        if (!scene.startTime || !scene.endTime) return sum
        const startMicros = parseMicros(scene.startTime)
        const endMicros = parseMicros(scene.endTime)
        const minutes = Math.max(
          0,
          (endMicros - startMicros) / MICROSECONDS_TO_SECONDS / SECONDS_TO_MINUTES,
        )
        return sum + minutes
      },
      0,
    )

    const percentageOfDuration =
      totalDurationMinutes > 0 ? ((totalMinutes / totalDurationMinutes) * 100).toFixed(1) : '0.0'

    return {
      name: guideline.name,
      scenesDetected: matchingScenes.length,
      totalMinutes: totalMinutes.toFixed(1),
      percentageOfDuration: percentageOfDuration,
    }
  })
})

const totalViolationMinutes = computed(() => {
  const scenes = analysisResults.value
  if (scenes.length === 0) return '0.0'

  const totalSeconds = scenes.reduce((total, scene) => {
    if (scene.startTime && scene.endTime) {
      const startMicros = parseMicros(scene.startTime)
      const endMicros = parseMicros(scene.endTime)
      const diffSeconds = Math.max(0, (endMicros - startMicros) / MICROSECONDS_TO_SECONDS)
      return total + diffSeconds
    }
    return total
  }, 0)

  return (totalSeconds / SECONDS_TO_MINUTES).toFixed(1)
})

const primaryViolationCategory = computed(() => {
  const scenes = analysisResults.value
  const categoryStats: {
    [key: string]: { criticalCount: number; totalCount: number; duration: number }
  } = {}
  let totalCriticalCount = 0

  scenes.forEach((scene) => {
    const category = scene.guideline || 'Unknown'
    if (!categoryStats[category]) {
      categoryStats[category] = { criticalCount: 0, totalCount: 0, duration: 0 }
    }

    categoryStats[category].totalCount += 1

    if (scene.severity === 'critical') {
      categoryStats[category].criticalCount += 1
      totalCriticalCount += 1
    }

    let sceneDuration = 0
    if (scene.startTime && scene.endTime) {
      const startMicros = parseMicros(scene.startTime)
      const endMicros = parseMicros(scene.endTime)
      sceneDuration = Math.max(0, (endMicros - startMicros) / MICROSECONDS_TO_SECONDS)
    }

    categoryStats[category].duration += sceneDuration
  })

  const categories = Object.keys(categoryStats)
  if (categories.length === 0) {
    return { category: 'No violations detected', criticalCount: 0 }
  }

  const primaryCategory = categories.reduce((a, b) => {
    const statsA = categoryStats[a]
    const statsB = categoryStats[b]

    if (statsA.criticalCount !== statsB.criticalCount) {
      return statsA.criticalCount > statsB.criticalCount ? a : b
    }

    if (statsA.totalCount !== statsB.totalCount) {
      return statsA.totalCount > statsB.totalCount ? a : b
    }

    if (statsA.duration !== statsB.duration) {
      return statsA.duration > statsB.duration ? a : b
    }

    return a < b ? a : b
  })

  return { category: primaryCategory, criticalCount: totalCriticalCount }
})

// Menu items for ActionsMenu
const menuItems = computed((): MenuItem[] => {
  if (!report.value) return []

  const items: MenuItem[] = []

  // Print action (always available)
  items.push({
    key: 'print',
    label: 'Print',
    description: 'Print this report',
    icon: 'printer',
    variant: 'default',
    action: printReport,
  })

  // Export actions (only for completed reports)
  if (report.value.status === 'completed') {
    items.push(
      {
        key: 'export-pdf',
        label: 'Export PDF',
        description: 'Download report as PDF',
        icon: 'file-pdf-box',
        variant: 'danger',
        action: () => exportReport('pdf'),
      },
      {
        key: 'export-docx',
        label: 'Export DOCX',
        description: 'Download report as Word document',
        icon: 'file-word-box',
        variant: 'info',
        action: () => exportReport('docx'),
      },
    )
  }

  // Divider before delete action
  items.push({
    key: 'divider-1',
    label: '',
    divider: true,
  })

  // Delete action
  items.push({
    key: 'delete',
    label: 'Delete Report',
    description: 'Remove this report permanently',
    icon: 'delete',
    variant: 'danger',
    action: deleteReport,
  })

  return items
})

// Methods - Learning from composable pattern
const loadReport = async () => {
  try {
    loading.value = true
    const reportId = route.params.id as string

    // 1. Fetch report by ID
    const reportData = await fetchReportById(reportId)
    if (!reportData) {
      console.error('Report not found:', reportId)
      report.value = null
      return
    }

    // 2. Fetch media relationships for this report
    const mediaRelationships = await getMediaRelationshipsByEntity(
      reportId,
      'attachment',
      'reports',
    )

    // 3. Fetch media data if relationships exist (learning from composable pattern)
    let mediaData = undefined
    if (mediaRelationships.length > 0) {
      const mediaId = mediaRelationships[0].mediaId
      const media = await getById('media', mediaId)
      if (media) {
        // Use direct mapping like in composable instead of manual field mapping
        mediaData = media as MediaItem
      }
    }

    // 4. Fetch rating system data if ratingSystemId exists (learning from composable pattern)
    let ratingSystemData = undefined
    if (reportData.ratingSystemId) {
      const ratingSystem = await fetchRatingSystemById(reportData.ratingSystemId)
      if (ratingSystem) {
        // Use direct mapping like in composable instead of manual field mapping
        ratingSystemData = ratingSystem as RatingSystemItem
      }
    }

    // 5. Combine all data (learning from composable pattern)
    const reportWithMedia: EnrichedReport = {
      ...reportData,
      mediaData,
      ratingSystemData,
    }

    report.value = reportWithMedia
  } catch (error) {
    console.error('Failed to load report:', error)
    push({
      id: `${Date.now()}-report-load-error`,
      type: 'error',
      title: 'Failed to load report',
      body: 'An error occurred while loading the report. Please try again.',
      position: 'tr',
      timeout: TOAST_TIMEOUT,
    })
    report.value = null
  } finally {
    loading.value = false
  }
}

// Action handlers
const printReport = () => {
  // Close the menu before printing to avoid it appearing in the print
  if (actionsMenuRef.value) {
    actionsMenuRef.value.closeMenu()
  }
  // Small delay to ensure menu is closed before printing
  setTimeout(() => {
    window.print()
  }, 100)
}

const exportReport = (format: string = 'pdf') => {
  // TODO: Implement export functionality
  // This would typically trigger a download or open a new window with the exported report
  console.log('Exporting report in format:', format)
}

const deleteReport = async () => {
  if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
    try {
      if (report.value?.id) {
        // Use the deleteReport function from useReports composable
        const { deleteReport: deleteReportApi } = useReports()
        await deleteReportApi(report.value.id)
        router.push('/reports')
      }
    } catch (error) {
      console.error('Failed to delete report:', error)
      push({
        id: `${Date.now()}-report-delete-error`,
        type: 'error',
        title: 'Failed to delete report',
        body: 'An error occurred while deleting the report. Please try again.',
        position: 'tr',
        timeout: TOAST_TIMEOUT,
      })
    }
  }
}

// Lifecycle
onMounted(() => {
  loadReport()
})
</script>
