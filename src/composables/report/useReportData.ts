import { ref } from 'vue'
import {
  useReports,
  useMediaRelationships,
  useResourceService,
  ReportItem,
  MediaItem,
  RatingSystemItem,
  ReportStatus,
} from '@/composables'

export interface EnrichedReport extends ReportItem {
  mediaData?: MediaItem
  ratingSystemData?: RatingSystemItem
}

export function useReportData() {
  // Initialize composables
  const { reports: rawReports, fetchReports } = useReports()
  const { fetchMediaRelationships } = useMediaRelationships()
  const { list } = useResourceService()

  // Reactive data
  const reports = ref<EnrichedReport[]>([])
  const loading = ref(false)
  const availableStatuses = ref<ReportStatus[]>([])
  const availableRatingSystems = ref<RatingSystemItem[]>([])

  // Load reports with media data (optimized - fetch all data once)
  const loadReportsWithMedia = async () => {
    try {
      loading.value = true
      // 1. Fetch all reports
      await fetchReports()

      if (rawReports.value.length === 0) {
        reports.value = []
        return
      }

      // 2. Fetch all media-relationships with attachment type
      const { data: allMediaRelationships } = await fetchMediaRelationships(
        {
          entityType: 'reports',
          relationshipType: 'attachment',
        },
        1,
        1000,
      ) // Get all relationships

      // 3. Get all unique media IDs and rating system IDs (for future use)
      // const mediaIds = [...new Set(allMediaRelationships.map((rel) => rel.mediaId))]
      // const ratingSystemIds = [
      //   ...new Set(rawReports.value.map((report) => report.ratingSystemId).filter(Boolean)),
      // ]

      // 4. Fetch all media data in one call
      const mediaResponse = await list('media', { page: 1, limit: 1000 })
      const allMedia = mediaResponse.data as Partial<MediaItem>[]
      const mediaMap = new Map(allMedia.map((media: Partial<MediaItem>) => [media.id!, media]))

      // 5. Fetch all rating systems data in one call
      const ratingSystemsResponse = await list('rating-systems', { page: 1, limit: 1000 })
      const allRatingSystems = ratingSystemsResponse.data as Partial<RatingSystemItem>[]
      const ratingSystemMap = new Map(
        allRatingSystems.map((ratingSystem: Partial<RatingSystemItem>) => [
          ratingSystem.id!,
          ratingSystem,
        ]),
      )

      // 6. Extract unique statuses and rating systems for filters
      const uniqueStatuses = [
        ...new Set(rawReports.value.map((report) => report.status).filter(Boolean)),
      ]
      availableStatuses.value = uniqueStatuses.sort()

      const uniqueRatingSystems = allRatingSystems.map(
        (ratingSystem: Partial<RatingSystemItem>) => ({
          id: ratingSystem.id!,
          name: ratingSystem.name!,
        }),
      )
      availableRatingSystems.value = uniqueRatingSystems as RatingSystemItem[]
      availableRatingSystems.value.sort((a, b) => a.name.localeCompare(b.name))

      // 7. Create media relationships map (reportId -> mediaId)
      const reportMediaMap = new Map<string, string>()
      allMediaRelationships.forEach((rel) => {
        if (rel.entityType === 'reports' && rel.relationshipType === 'attachment') {
          reportMediaMap.set(rel.entityId, rel.mediaId)
        }
      })

      // 8. Map all data together
      const reportsWithMedia: EnrichedReport[] = rawReports.value.map((report) => {
        // Get media data
        const mediaId = reportMediaMap.get(report.id)
        const media = mediaId ? (mediaMap.get(mediaId) as MediaItem) : undefined
        const mediaData = media ? media : undefined

        // Get rating system data
        const ratingSystem = report.ratingSystemId
          ? ratingSystemMap.get(report.ratingSystemId)
          : undefined
        const ratingSystemData = ratingSystem ? (ratingSystem as RatingSystemItem) : undefined

        return {
          ...(report as ReportItem),
          mediaData: mediaData as MediaItem,
          ratingSystemData: ratingSystemData as RatingSystemItem,
        } as EnrichedReport
      })

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
