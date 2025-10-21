import { ref, computed, readonly } from 'vue'
import { useResourceService, useToast } from '@/composables'
import type { PaginatedResponse } from '@/types/common'

export interface MediaItem {
  /** Unique identifier */
  id: string
  /** Media type (e.g., 'video', 'audio', 'image') */
  type: string
  /** File format (e.g., 'mp4', 'png', 'mp3') */
  format: string
  /** URL to access the media file */
  fileUrl: string
  /** Original filename */
  fileName: string
  /** File size in bytes (optional) */
  fileSize?: number
  /** Duration in seconds for audio/video (optional) */
  duration?: number
  /** MIME content type */
  contentType: string
  /** Processing status (optional) */
  status?: string
  /** Language code (optional) */
  language?: string
  /** Upload URL for direct uploads (optional) */
  uploadUrl?: string
  /** Upload URL expiration timestamp (optional) */
  uploadExpiresAt?: string | Date
  /** Storage bucket name (optional) */
  bucket?: string
  /** Storage path (optional) */
  path?: string
  /** Thumbnail URL (optional) */
  thumbnailUrl?: string
}

/**
 * Transform raw API response to standardized paginated response format
 * @param response - Raw API response
 * @returns Standardized paginated response
 */
function transformPaginatedResponse<T>(response: unknown): PaginatedResponse<T> {
  const payload = (response as Record<string, unknown>) || {}
  const pg = (payload.pagination as Record<string, unknown>) || {}
  const page = Number(pg.page ?? payload.page ?? 1) || 1
  const limit = Number(pg.limit ?? payload.limit ?? 20) || 20
  const total = Number(pg.total ?? payload.total ?? 0) || 0
  const totalPages =
    Number(pg.totalPages ?? payload.totalPages ?? Math.ceil(total / (limit || 1))) ||
    Math.max(1, Math.ceil(total / (limit || 1)))

  return {
    data: ((payload.data as T[]) || []) as T[],
    pagination: { page, limit, total, totalPages },
  }
}

export function useMedia() {
  const { list, create, update, getById } = useResourceService()
  const { push } = useToast()

  const media = ref<MediaItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(0)

  /**
   * Computed boolean indicating if there are media items
   */
  const hasMedia = computed(() => media.value.length > 0)

  /**
   * Computed boolean indicating if on the first page
   */
  const isFirstPage = computed(() => currentPage.value <= 1)

  /**
   * Computed boolean indicating if on the last page
   */
  const isLastPage = computed(() => currentPage.value >= totalPages.value)

  /**
   * Fetch media items with optional search and filtering
   * @param options - Search and filter options
   *
   * @example
   * ```typescript
   * // Fetch all media
   * await media.fetchMedia();
   *
   * // Search for specific media
   * await media.fetchMedia({ search: 'video' });
   *
   * // Filter by type and status
   * await media.fetchMedia({
   *   filters: { type: 'video', status: 'processed' }
   * });
   * ```
   */
  const fetchMedia = async (options?: { search?: string; filters?: Record<string, unknown> }) => {
    try {
      loading.value = true
      error.value = null
      const params: Record<string, unknown> = {
        page: currentPage.value,
        limit: 20,
      }
      if (options?.search) params.search = options.search
      if (options?.filters) Object.assign(params, options.filters)

      const raw = await list('media', params)
      const result: PaginatedResponse<MediaItem> = transformPaginatedResponse<MediaItem>(raw)
      media.value = result.data
      totalPages.value = result.pagination.totalPages
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Failed to fetch media'
      error.value = message
      push({
        id: `${Date.now()}-media-fetch` as string,
        type: 'error',
        title: 'Failed to load media',
        body: message,
        position: 'tr',
        timeout: 6000,
      })
    } finally {
      loading.value = false
    }
  }

  const nextPage = async () => {
    if (isLastPage.value) return
    currentPage.value += 1
    await fetchMedia()
  }

  const previousPage = async () => {
    if (isFirstPage.value) return
    currentPage.value -= 1
    await fetchMedia()
  }

  async function createMediaRecord(params: {
    fileName: string
    contentType: string
    fileSize?: number
    duration?: number
    type: string // domain-specific (e.g., poster, trailer, dubbed)
    format: string // extension-like (e.g., mp4, png)
    language?: string
    description?: string
    tags?: string[]
    relationships?: string[] // ["entityType:entityId:relationshipType"]
    metadata?: Record<string, unknown>
  }): Promise<MediaItem> {
    const payload = {
      ...params,
      tags: params.tags || [],
      relationships: params.relationships || [],
      metadata: params.metadata || {},
    }
    return (await create('media', payload)) as MediaItem
  }

  async function uploadFileToSignedUrl(options: {
    uploadUrl: string
    file: File | Blob
    contentType: string
    onProgress?: (percent: number) => void
  }): Promise<Response> {
    const { uploadUrl, file, contentType } = options
    return await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: file,
    })
  }

  async function uploadViaMediaResource(
    file: File,
    opts: {
      type?: string
      format?: string
      language?: string
      description?: string
      tags?: string[]
      relationships?: string[]
      metadata?: Record<string, unknown>
      duration?: number
      markCompleted?: boolean
    } = {},
  ): Promise<{ media: MediaItem; fileUrl: string }> {
    const type = opts.type || 'poster'
    const extension = (file.name.split('.').pop() || '').toLowerCase()
    const format = (opts.format || extension || 'bin').toLowerCase()
    const contentType = file.type || 'application/octet-stream'

    const mediaRecord = await createMediaRecord({
      fileName: file.name,
      contentType,
      fileSize: file.size,
      duration: opts.duration,
      type,
      format,
      language: opts.language,
      description: opts.description,
      tags: opts.tags,
      relationships: opts.relationships,
      metadata: opts.metadata,
    })

    if (!mediaRecord.uploadUrl) {
      throw new Error('Upload URL missing from media record')
    }

    const res = await uploadFileToSignedUrl({
      uploadUrl: mediaRecord.uploadUrl,
      file,
      contentType,
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Upload failed (${res.status}): ${text.slice(0, 160)}`)
    }

    try {
      await update('media', mediaRecord.id, {
        status: 'completed',
        fileSize: file.size,
      })
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Failed to complete upload'
      push({
        id: `${Date.now()}-media-complete` as string,
        type: 'error',
        title: 'Upload completion failed',
        body: message,
        position: 'tr',
        timeout: 6000,
      })
    }

    return { media: mediaRecord, fileUrl: mediaRecord.fileUrl }
  }

  /**
   * Fetch media related to a specific entity via media-relationships
   * @param entityType - The type of entity (e.g., 'titles', 'organizations')
   * @param entityId - The ID of the entity
   * @param relationshipType - Optional relationship type filter
   * @returns Array of related media items
   */
  async function fetchRelatedMedia(
    entityType: string,
    entityId: string,
    relationshipType?: string,
  ): Promise<MediaItem[]> {
    try {
      loading.value = true
      error.value = null

      // Use proper filter structure following useQueryBuilder pattern
      const filters: Record<string, unknown> = {
        entityType,
        entityId,
      }

      if (relationshipType) {
        filters.relationshipType = relationshipType
      }

      const relationships = await list('media-relationships', { filters })
      // Extract data from paginated response structure
      const relationshipData = Array.isArray(relationships)
        ? relationships
        : ((relationships as unknown as Record<string, unknown>)?.data as unknown[]) || []

      if (relationshipData.length === 0) {
        return []
      }

      // Extract media IDs from relationships
      const mediaIds = relationshipData
        .map((rel: unknown) => (rel as Record<string, unknown>).mediaId as string)
        .filter((id: string) => id)

      if (mediaIds.length === 0) {
        return []
      }

      // Fetch media items by IDs using getById
      const mediaPromises = mediaIds.map(async (mediaId: string) => {
        try {
          const result = await getById('media', mediaId)
          return result ? [result] : []
        } catch (error) {
          console.error('Error fetching media for', mediaId, ':', error)
          return []
        }
      })

      const mediaResults = await Promise.all(mediaPromises)
      const relatedMedia = mediaResults.flat() as MediaItem[]
      return relatedMedia
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Failed to fetch related media'
      error.value = message
      push({
        id: `${Date.now()}-related-media-fetch` as string,
        type: 'error',
        title: 'Failed to load related media',
        body: message,
        position: 'tr',
        timeout: 6000,
      })
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    media: readonly(media),
    loading: readonly(loading),
    error: readonly(error),
    currentPage: readonly(currentPage),
    totalPages: readonly(totalPages),
    hasMedia,
    isFirstPage,
    isLastPage,
    fetchMedia,
    nextPage,
    previousPage,
    uploadViaMediaResource,
    fetchRelatedMedia,
  }
}
