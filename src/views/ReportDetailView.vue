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
              :rows="getGuidelinesTableData()"
              :scenesCount="getAnalysisResults().length"
              :totalViolationMinutes="getTotalViolationMinutes()"
              :primaryCategory="getPrimaryViolationCategory()"
            />
            <ScenesList :scenes="getAnalysisResults()" />
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
import type { ReportScene } from '@/composables/useReports'
import { useRoute, useRouter } from 'vue-router'
import { type ReportItem } from '@/composables'
import { mockReport } from '../../mock/report'
import { mockRatingSystem } from '../../mock/rating-system'
import { mockMedia } from '../../mock/media'
import type { MenuItem } from '@/components/atoms/ActionsMenu.vue'
import ReportHeader from '@/components/reports/ReportHeader.vue'
import VideoInfoCard from '@/components/reports/VideoInfoCard.vue'
import RatingInfoCard from '@/components/reports/RatingInfoCard.vue'
import AnalysisSummary from '@/components/reports/AnalysisSummary/AnalysisSummary.vue'
import ScenesList from '@/components/reports/Scenes/ScenesList.vue'
import ProcessingStatusCard from '@/components/reports/Status/ProcessingStatusCard.vue'
import FailedStatusCard from '@/components/reports/Status/FailedStatusCard.vue'

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
    references?: Array<{
      title: string
      source?: string
      url?: string
    }>
    levels?: Array<{
      key: string
      title: string
      description: string
      guide: string
    }>
  }
}

type AnalysisScene = ReportScene

// Route
const route = useRoute()
const router = useRouter()

// Initialize composables (unused imports removed to fix TypeScript errors)

// Reactive data
const loading = ref(true)
const report = ref<ReportWithMedia | null>(null)
const actionsMenuRef = ref<InstanceType<typeof ReportHeader> | null>(null)

// Computed properties for rating system data
const currentRatingSystem = computed(() => {
  if (!report.value) return null
  return report.value.ratingSystemData
})

// Remove unused computed to satisfy strict lint rules

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

// Methods
const loadReport = async () => {
  try {
    loading.value = true
    const reportId = route.params.id as string

    console.log('Loading report:', reportId)

    // Use mock data from external files
    const reportData = mockReport
    const mediaData = {
      fileName: mockMedia.fileName,
      fileSize: mockMedia.fileSize,
      duration: mockMedia.duration,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      thumbnail: (mockMedia as any).thumbnail,
    }

    const ratingSystemData = {
      name: mockRatingSystem.name,
      description: (mockRatingSystem as { description?: string }).description,
      references: mockRatingSystem.references,
      levels: mockRatingSystem.levels,
      guidelines: mockRatingSystem.guidelines,
    }

    // Combine all data
    const reportWithMedia: ReportWithMedia = {
      ...reportData,
      mediaId: (reportData as { mediaId?: string }).mediaId || '',
      status: reportData.status as 'pending' | 'completed' | 'failed' | 'processing',
      createdAt: (reportData as { createdAt?: { _seconds: number } }).createdAt?._seconds
        ? new Date(
            (reportData as { createdAt: { _seconds: number } }).createdAt._seconds * 1000,
          ).toISOString()
        : new Date().toISOString(),
      updatedAt: (reportData as { updatedAt?: { _seconds: number } }).updatedAt?._seconds
        ? new Date(
            (reportData as { updatedAt: { _seconds: number } }).updatedAt._seconds * 1000,
          ).toISOString()
        : new Date().toISOString(),
      scenes: (reportData.scenes || []).map((scene) => ({
        ...scene,
        // Ensure required fields for ReportScene are present
        summary:
          (scene as { summary?: string }).summary ||
          `${scene.guideline} from ${scene.startTime} to ${scene.endTime}`,
        severity: scene.severity as 'low' | 'medium' | 'high' | 'critical',
        analysis: {
          video: {
            ...(scene.analysis?.video || {}),
          },
          audio: {
            ...(scene.analysis?.audio || {}),
          },
        },
      })),
      mediaData,
      ratingSystemData,
    }

    console.log('Report with media:', reportWithMedia)
    console.log('Rating system levels:', ratingSystemData.levels)
    console.log('Rating system guidelines:', ratingSystemData.guidelines)
    console.log('Suggested rating:', reportData.rating?.suggested)
    console.log('Scenes:', reportData.scenes)

    report.value = reportWithMedia
  } catch (error) {
    console.error('Failed to load report:', error)
    report.value = null
  } finally {
    loading.value = false
  }
}

// Helpers moved into child components via composable

const getAnalysisResults = (): AnalysisScene[] => {
  if (!report.value || report.value.status !== 'completed') return []

  // Return scenes from mock data with proper type casting
  return (report.value.scenes || []) as AnalysisScene[]
}

// Helpers to parse microsecond timestamps used in mock data
const parseMicros = (value: string | number): number => {
  const n = typeof value === 'string' ? Number(value) : value
  return Number.isFinite(n) ? n : 0
}

const getTotalViolationMinutes = () => {
  const scenes = getAnalysisResults()
  if (scenes.length === 0) return '0.0'

  const totalSeconds = scenes.reduce((total, scene) => {
    if (scene.startTime && scene.endTime) {
      const startMicros = parseMicros(scene.startTime)
      const endMicros = parseMicros(scene.endTime)
      const diffSeconds = Math.max(0, (endMicros - startMicros) / 1_000_000)
      return total + diffSeconds
    }
    return total
  }, 0)

  return (totalSeconds / 60).toFixed(1)
}

// used in template for analysis summary progress styling

const getPrimaryViolationCategory = () => {
  const scenes = getAnalysisResults()
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

    // Count critical violations
    if (scene.severity === 'critical') {
      categoryStats[category].criticalCount += 1
      totalCriticalCount += 1
    }

    // Calculate duration using microsecond timestamps
    let sceneDuration = 0
    if (scene.startTime && scene.endTime) {
      const startMicros = parseMicros(scene.startTime)
      const endMicros = parseMicros(scene.endTime)
      sceneDuration = Math.max(0, (endMicros - startMicros) / 1_000_000)
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

    // First compare by critical count (most important)
    if (statsA.criticalCount !== statsB.criticalCount) {
      return statsA.criticalCount > statsB.criticalCount ? a : b
    }

    // If critical counts are equal, compare by total count
    if (statsA.totalCount !== statsB.totalCount) {
      return statsA.totalCount > statsB.totalCount ? a : b
    }

    // If both counts are equal, compare by duration
    if (statsA.duration !== statsB.duration) {
      return statsA.duration > statsB.duration ? a : b
    }

    // If everything is equal, sort alphabetically for consistency
    return a < b ? a : b
  })

  return { category: primaryCategory, criticalCount: totalCriticalCount }
}

const getGuidelinesTableData = () => {
  if (!report.value) return []

  // Get guidelines from rating system (using mock data structure)
  const guidelines = (report.value.ratingSystemData as { guidelines?: unknown[] })?.guidelines || []
  const scenes = report.value.scenes || []

  console.log('getGuidelinesTableData - guidelines:', guidelines)
  console.log('getGuidelinesTableData - scenes:', scenes)

  // Calculate total duration from media
  const totalDurationMinutes = report.value.mediaData?.duration
    ? report.value.mediaData.duration / 60
    : 0

  return (guidelines as { name: string }[]).map((guideline: { name: string }) => {
    // Find scenes that match this guideline
    const matchingScenes = scenes.filter(
      (scene) =>
        scene.guideline === guideline.name ||
        scene.guideline.includes(guideline.name) ||
        guideline.name.includes(scene.guideline),
    )

    // Calculate total violation minutes for this guideline using microsecond timestamps
    const totalMinutes = matchingScenes.reduce(
      (sum: number, scene: { endTime: string; startTime: string }) => {
        if (!scene.startTime || !scene.endTime) return sum
        const startMicros = parseMicros(scene.startTime)
        const endMicros = parseMicros(scene.endTime)
        const minutes = Math.max(0, (endMicros - startMicros) / 1_000_000 / 60)
        return sum + minutes
      },
      0,
    )

    // Calculate percentage of total duration
    const percentageOfDuration =
      totalDurationMinutes > 0 ? ((totalMinutes / totalDurationMinutes) * 100).toFixed(1) : '0.0'

    return {
      name: guideline.name,
      scenesDetected: matchingScenes.length,
      totalMinutes: totalMinutes.toFixed(1),
      percentageOfDuration: percentageOfDuration,
    }
  })
}

// removed unused helper functions; logic now lives in composables or child components

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
  console.log(`Exporting report ${report.value?.id} as ${format}`)
  // TODO: Implement export functionality
  // This would typically trigger a download or open a new window with the exported report
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
