import { ref } from 'vue'
import {
  useReports,
  useMediaRelationships,
  useResourceService,
  type ReportItem,
} from '@/composables'

// Combined data interface for UI
export interface ReportWithMedia extends ReportItem {
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

export function useReportData() {
  // Initialize composables
  const { reports: rawReports, fetchReports } = useReports()
  const { fetchMediaRelationships } = useMediaRelationships()
  const { list } = useResourceService()

  // Reactive data
  const reports = ref<ReportWithMedia[]>([])
  const loading = ref(false)
  const availableStatuses = ref<string[]>([])
  const availableRatingSystems = ref<Array<{ id: string; name: string }>>([])

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
      const { data: allMediaRelationships } = await fetchMediaRelationships(
        {
          relationshipType: 'attachment',
          entityType: 'reports',
        },
        1,
        1000,
      ) // Get all relationships

      // 3. Get all unique media IDs and rating system IDs
      const mediaIds = [...new Set(allMediaRelationships.map((rel) => rel.mediaId))]
      const ratingSystemIds = [
        ...new Set(rawReports.value.map((report) => report.ratingSystemId).filter(Boolean)),
      ]

      console.log('Unique media IDs:', mediaIds)
      console.log('Unique rating system IDs:', ratingSystemIds)

      // 4. Fetch all media data in one call
      console.log('Fetching all media data...')
      const mediaResponse = await list('media', { page: 1, limit: 1000 })
      const allMedia = mediaResponse.data || []
      const mediaMap = new Map(
        allMedia.map((media: Record<string, unknown>) => [media.id as string, media]),
      )

      // 5. Fetch all rating systems data in one call
      console.log('Fetching all rating systems data...')
      const ratingSystemsResponse = await list('rating-systems', { page: 1, limit: 1000 })
      const allRatingSystems = ratingSystemsResponse.data || []
      const ratingSystemMap = new Map(
        allRatingSystems.map((ratingSystem: Record<string, unknown>) => [
          ratingSystem.id as string,
          ratingSystem,
        ]),
      )

      // 6. Extract unique statuses and rating systems for filters
      const uniqueStatuses = [
        ...new Set(rawReports.value.map((report) => report.status).filter(Boolean)),
      ]
      availableStatuses.value = uniqueStatuses.sort()

      const uniqueRatingSystems = allRatingSystems.map((ratingSystem: Record<string, unknown>) => ({
        id: ratingSystem.id as string,
        name: ratingSystem.name as string,
      }))
      availableRatingSystems.value = uniqueRatingSystems.sort((a, b) =>
        a.name.localeCompare(b.name),
      )

      // 7. Create media relationships map (reportId -> mediaId)
      const reportMediaMap = new Map<string, string>()
      allMediaRelationships.forEach((rel) => {
        if (rel.entityType === 'reports' && rel.relationshipType === 'attachment') {
          reportMediaMap.set(rel.entityId, rel.mediaId)
        }
      })

      // 8. Map all data together
      console.log('Mapping all data...')
      const reportsWithMedia: ReportWithMedia[] = rawReports.value.map((report) => {
        // Get media data
        const mediaId = reportMediaMap.get(report.id)
        const media = mediaId ? mediaMap.get(mediaId) : null
        const mediaData = media
          ? {
              fileName: ((media as Record<string, unknown>).fileName as string) || 'Unknown file',
              fileSize: ((media as Record<string, unknown>).fileSize as number) || 0,
              duration: ((media as Record<string, unknown>).duration as number) || 0,
              thumbnail: ((media as Record<string, unknown>).thumbnail as string) || undefined,
            }
          : undefined

        // Get rating system data
        const ratingSystem = report.ratingSystemId
          ? ratingSystemMap.get(report.ratingSystemId)
          : null
        const ratingSystemData = ratingSystem
          ? {
              name:
                ((ratingSystem as Record<string, unknown>).name as string) ||
                'Unknown rating system',
              description:
                ((ratingSystem as Record<string, unknown>).description as string) || undefined,
            }
          : undefined

        return {
          ...report,
          scenes: (report.scenes || []).map((scene) => ({
            ...scene,
            screenshots: [...scene.screenshots], // Convert readonly array to mutable
          })),
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

  return {
    reports,
    loading,
    availableStatuses,
    availableRatingSystems,
    loadReportsWithMedia,
  }
}
