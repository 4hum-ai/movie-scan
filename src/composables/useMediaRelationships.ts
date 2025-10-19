import { ref, computed, readonly } from 'vue'
import { useResourceService } from '@/composables/useResourceService'
import { useToast } from '@/composables/useToast'

export interface PaginatedResponse<T> {
  /** Array of media relationship items */
  data: T[]
  /** Pagination metadata */
  pagination: {
    /** Current page number */
    page: number
    /** Number of items per page */
    limit: number
    /** Total number of items */
    total: number
    /** Total number of pages */
    totalPages: number
  }
}

export interface MediaRelationshipItem {
  /** Unique identifier */
  id: string
  /** Associated media ID */
  mediaId: string
  /** Entity type (e.g., 'reports', 'titles') */
  entityType: string
  /** Entity ID */
  entityId: string
  /** Relationship type (e.g., 'attachment', 'trailer') */
  relationshipType: string
  /** Additional metadata */
  metadata: Record<string, any>
  /** Creation timestamp */
  createdAt: string
  /** Last update timestamp */
  updatedAt: string
}

/**
 * Transform raw API response to standardized paginated response format
 * @param response - Raw API response
 * @returns Standardized paginated response
 */
function transformPaginatedResponse<T>(response: any): PaginatedResponse<T> {
  return {
    data: response.data || [],
    pagination: {
      page: response.pagination?.page || 1,
      limit: response.pagination?.limit || 10,
      total: response.pagination?.total || 0,
      totalPages: response.pagination?.totalPages || 0,
    },
  }
}

export function useMediaRelationships() {
  const { list, create, update, getById, remove } = useResourceService()
  const { push } = useToast()

  // State
  const mediaRelationships = ref<MediaRelationshipItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(0)

  // Computed properties
  const hasMediaRelationships = computed(() => mediaRelationships.value.length > 0)
  const isFirstPage = computed(() => currentPage.value === 1)
  const isLastPage = computed(() => currentPage.value >= totalPages.value)

  /**
   * Fetch media relationships with optional filters
   * @param filters - Filter parameters
   * @param page - Page number
   * @param limit - Items per page
   */
  const fetchMediaRelationships = async (
    filters: {
      mediaId?: string
      entityType?: string
      entityId?: string
      relationshipType?: string
    } = {},
    page: number = 1,
    limit: number = 10,
  ) => {
    try {
      loading.value = true
      error.value = null

      const queryParams = new URLSearchParams()
      
      // Add filters
      if (filters.mediaId) queryParams.append('mediaId', filters.mediaId)
      if (filters.entityType) queryParams.append('entityType', filters.entityType)
      if (filters.entityId) queryParams.append('entityId', filters.entityId)
      if (filters.relationshipType) queryParams.append('relationshipType', filters.relationshipType)
      
      // Add pagination
      queryParams.append('page', page.toString())
      queryParams.append('limit', limit.toString())

      console.log('Fetching media relationships with filters:', filters)
      console.log('Query params:', Object.fromEntries(queryParams))

      const response = await list('media-relationships', Object.fromEntries(queryParams))
      console.log('Raw API response:', response)
      
      const transformedResponse = transformPaginatedResponse<MediaRelationshipItem>(response)
      console.log('Transformed response:', transformedResponse)

      mediaRelationships.value = transformedResponse.data
      currentPage.value = transformedResponse.pagination.page
      totalPages.value = transformedResponse.pagination.totalPages

      return transformedResponse
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch media relationships'
      console.error('Failed to fetch media relationships:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Get media relationships by entity ID and relationship type
   * @param entityId - Entity ID (e.g., report ID)
   * @param relationshipType - Relationship type (e.g., 'attachment')
   * @param entityType - Entity type (e.g., 'reports')
   */
  const getMediaRelationshipsByEntity = async (
    entityId: string,
    relationshipType: string = 'attachment',
    entityType: string = 'reports'
  ): Promise<MediaRelationshipItem[]> => {
    try {
      console.log(`Getting media relationships for entityId: ${entityId}, entityType: ${entityType}, relationshipType: ${relationshipType}`)
      
      const response = await fetchMediaRelationships({
        entityId,
        entityType,
        relationshipType,
      }, 1, 100) // Get all relationships for this entity
      
      console.log(`Media relationships response:`, response)
      console.log(`Media relationships data:`, response.data)
      
      return response.data
    } catch (err) {
      console.error('Failed to get media relationships by entity:', err)
      return []
    }
  }

  /**
   * Get media IDs for a specific entity
   * @param entityId - Entity ID (e.g., report ID)
   * @param relationshipType - Relationship type (e.g., 'attachment')
   * @param entityType - Entity type (e.g., 'reports')
   */
  const getMediaIdsByEntity = async (
    entityId: string,
    relationshipType: string = 'attachment',
    entityType: string = 'reports'
  ): Promise<string[]> => {
    const relationships = await getMediaRelationshipsByEntity(entityId, relationshipType, entityType)
    return relationships.map(rel => rel.mediaId)
  }

  /**
   * Fetch a single media relationship by ID
   * @param id - Media relationship ID
   */
  const fetchMediaRelationshipById = async (id: string): Promise<MediaRelationshipItem | null> => {
    try {
      loading.value = true
      error.value = null

      const response = await getById('media-relationships', id)
      return response as MediaRelationshipItem
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch media relationship'
      console.error('Failed to fetch media relationship:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new media relationship
   * @param data - Media relationship data
   */
  const createMediaRelationship = async (data: Omit<MediaRelationshipItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MediaRelationshipItem | null> => {
    try {
      loading.value = true
      error.value = null

      const response = await create('media-relationships', data)
      
      if (response) {
        mediaRelationships.value.unshift(response as MediaRelationshipItem)
        
        push({
          id: `${Date.now()}-media-relationship-create`,
          type: 'success',
          title: 'Media relationship created',
          position: 'tr',
          body: 'Media relationship has been created successfully',
        })
      }

      return response as MediaRelationshipItem
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create media relationship'
      console.error('Failed to create media relationship:', err)
      
      push({
        id: `${Date.now()}-media-relationship-create-error`,
        type: 'error',
        title: 'Failed to create media relationship',
        position: 'tr',
        body: error.value || 'Unknown error occurred',
      })
      
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Update a media relationship
   * @param id - Media relationship ID
   * @param data - Update data
   */
  const updateMediaRelationship = async (
    id: string,
    data: Partial<Omit<MediaRelationshipItem, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<MediaRelationshipItem | null> => {
    try {
      loading.value = true
      error.value = null

      const response = await update('media-relationships', id, data)
      
      if (response) {
        const index = mediaRelationships.value.findIndex(rel => rel.id === id)
        if (index !== -1) {
          mediaRelationships.value[index] = response as MediaRelationshipItem
        }
        
        push({
          id: `${Date.now()}-media-relationship-update`,
          type: 'success',
          title: 'Media relationship updated',
          position: 'tr',
          body: 'Media relationship has been updated successfully',
        })
      }

      return response as MediaRelationshipItem
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update media relationship'
      console.error('Failed to update media relationship:', err)
      
      push({
        id: `${Date.now()}-media-relationship-update-error`,
        type: 'error',
        title: 'Failed to update media relationship',
        position: 'tr',
        body: error.value || 'Unknown error occurred',
      })
      
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete a media relationship
   * @param id - Media relationship ID
   */
  const deleteMediaRelationship = async (id: string): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null

      await remove('media-relationships', id)
      
      // Remove from local state
      const index = mediaRelationships.value.findIndex(rel => rel.id === id)
      if (index !== -1) {
        mediaRelationships.value.splice(index, 1)
      }
      
      push({
        id: `${Date.now()}-media-relationship-delete`,
        type: 'success',
        title: 'Media relationship deleted',
        position: 'tr',
        body: 'Media relationship has been deleted successfully',
      })

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete media relationship'
      console.error('Failed to delete media relationship:', err)
      
      push({
        id: `${Date.now()}-media-relationship-delete-error`,
        type: 'error',
        title: 'Failed to delete media relationship',
        position: 'tr',
        body: error.value || 'Unknown error occurred',
      })
      
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Get all media relationships (no pagination)
   */
  const getAllMediaRelationships = async (filters: {
    mediaId?: string
    entityType?: string
    entityId?: string
    relationshipType?: string
  } = {}): Promise<MediaRelationshipItem[]> => {
    try {
      const response = await fetchMediaRelationships(filters, 1, 1000) // Large limit to get all
      return response.data
    } catch (err) {
      console.error('Failed to get all media relationships:', err)
      return []
    }
  }

  /**
   * Search media relationships
   * @param query - Search query
   */
  const searchMediaRelationships = async (query: string): Promise<MediaRelationshipItem[]> => {
    try {
      // This would depend on your API's search implementation
      // For now, we'll filter locally
      const allRelationships = await getAllMediaRelationships()
      return allRelationships.filter(rel => 
        rel.id.toLowerCase().includes(query.toLowerCase()) ||
        rel.mediaId.toLowerCase().includes(query.toLowerCase()) ||
        rel.entityId.toLowerCase().includes(query.toLowerCase())
      )
    } catch (err) {
      console.error('Failed to search media relationships:', err)
      return []
    }
  }

  /**
   * Navigate to next page
   */
  const nextPage = async () => {
    if (isLastPage.value) return
    currentPage.value += 1
    await fetchMediaRelationships()
  }

  /**
   * Navigate to previous page
   */
  const previousPage = async () => {
    if (isFirstPage.value) return
    currentPage.value -= 1
    await fetchMediaRelationships()
  }

  return {
    mediaRelationships: readonly(mediaRelationships),
    loading: readonly(loading),
    error: readonly(error),
    currentPage: readonly(currentPage),
    totalPages: readonly(totalPages),
    hasMediaRelationships,
    isFirstPage,
    isLastPage,
    fetchMediaRelationships,
    fetchMediaRelationshipById,
    createMediaRelationship,
    updateMediaRelationship,
    deleteMediaRelationship,
    getAllMediaRelationships,
    searchMediaRelationships,
    getMediaRelationshipsByEntity,
    getMediaIdsByEntity,
    nextPage,
    previousPage,
  }
}
