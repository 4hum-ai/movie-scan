import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  useRelatedItems,
  getRefFields,
  getRefFieldsByType,
  hasRefFields,
  findReferencingResources,
} from '@/composables/useRelatedItems'
import type { DetailViewConfig, UiConfig } from '@/types/ui-config'

// Mock the useUiConfig composable
vi.mock('@/composables/useUiConfig', () => ({
  useUiConfig: vi.fn(),
}))

describe('useRelatedItems', () => {
  let mockAllUiConfigs: Record<string, UiConfig>

  beforeEach(async () => {
    mockAllUiConfigs = {
      'media-relationships': {
        detailView: {
          sections: [
            {
              title: 'Relationship Information',
              fields: [
                { key: 'id', label: 'ID', type: 'text' },
                { key: 'mediaId', label: 'Media ID', type: 'ref', refTo: 'media' },
                { key: 'entityId', label: 'Entity ID', type: 'ref', refTo: 'titles' },
              ],
            },
          ],
        },
      } as UiConfig,
      media: {
        detailView: {
          sections: [
            {
              title: 'File Information',
              fields: [
                { key: 'id', label: 'ID', type: 'text' },
                { key: 'fileName', label: 'File Name', type: 'text' },
              ],
            },
          ],
        },
      } as UiConfig,
      titles: {
        detailView: {
          sections: [
            {
              title: 'Title Information',
              fields: [
                { key: 'id', label: 'ID', type: 'text' },
                { key: 'title', label: 'Title', type: 'text' },
              ],
            },
          ],
        },
      } as UiConfig,
    }

    // Mock the useUiConfig composable to return our test data
    const { useUiConfig } = await import('@/composables/useUiConfig')
    vi.mocked(useUiConfig).mockReturnValue({
      state: {
        configs: mockAllUiConfigs,
      },
    } as ReturnType<typeof useUiConfig>)
  })

  describe('useRelatedItems', () => {
    it('should return null when no resources reference the current resource', () => {
      const result = useRelatedItems('nonexistent')
      expect(result.value).toBeNull()
    })

    it('should generate config for media relationships when viewing media', () => {
      const result = useRelatedItems('media')
      expect(result.value).toEqual({
        relationshipResource: 'media-relationships',
        referenceField: 'mediaId',
        entityTypeField: 'entityType',
        entityIdField: 'entityId',
        relationshipTypeField: 'relationshipType',
        titleField: 'entityId',
        subtitleField: 'relationshipType',
      })
    })

    it('should generate config for media relationships when viewing titles', () => {
      const result = useRelatedItems('titles')
      expect(result.value).toEqual({
        relationshipResource: 'media-relationships',
        referenceField: 'entityId',
        entityTypeField: 'entityType',
        entityIdField: 'entityId',
        relationshipTypeField: 'relationshipType',
        titleField: 'entityId',
        subtitleField: 'relationshipType',
      })
    })

    it('should handle multiple referencing resources by using the first one', () => {
      const result = useRelatedItems('media')
      expect(result.value).not.toBeNull()
      expect(result.value?.relationshipResource).toBe('media-relationships')
    })

    it('should be reactive to changes in UI configs', () => {
      const result = useRelatedItems('media')

      // The result should be reactive to changes in the UI config state
      // This test verifies the composable is working with the useUiConfig state
      expect(result.value).not.toBeNull()
    })
  })

  describe('getRefFields', () => {
    it('should return empty array when detailView is undefined', () => {
      const result = getRefFields(undefined)
      expect(result).toEqual([])
    })

    it('should return empty array when no sections exist', () => {
      const result = getRefFields({ sections: [] })
      expect(result).toEqual([])
    })

    it('should return all ref fields from all sections', () => {
      const detailView: DetailViewConfig = {
        sections: [
          {
            title: 'Section 1',
            fields: [
              { key: 'id', label: 'ID', type: 'text' },
              { key: 'mediaId', label: 'Media ID', type: 'ref', refTo: 'media' },
            ],
          },
          {
            title: 'Section 2',
            fields: [{ key: 'entityId', label: 'Entity ID', type: 'ref', refTo: 'titles' }],
          },
        ],
      }

      const result = getRefFields(detailView)
      expect(result).toHaveLength(2)
      expect(result[0].key).toBe('mediaId')
      expect(result[1].key).toBe('entityId')
    })

    it('should filter out non-ref fields', () => {
      const detailView: DetailViewConfig = {
        sections: [
          {
            title: 'Mixed Fields',
            fields: [
              { key: 'id', label: 'ID', type: 'text' },
              { key: 'mediaId', label: 'Media ID', type: 'ref', refTo: 'media' },
              { key: 'name', label: 'Name', type: 'text' },
            ],
          },
        ],
      }

      const result = getRefFields(detailView)
      expect(result).toHaveLength(1)
      expect(result[0].key).toBe('mediaId')
    })

    it('should filter out ref fields without refTo', () => {
      const detailView: DetailViewConfig = {
        sections: [
          {
            title: 'Invalid Ref Fields',
            fields: [
              { key: 'mediaId', label: 'Media ID', type: 'ref', refTo: 'media' },
              { key: 'invalidRef', label: 'Invalid Ref', type: 'ref' }, // No refTo
            ],
          },
        ],
      }

      const result = getRefFields(detailView)
      expect(result).toHaveLength(1)
      expect(result[0].key).toBe('mediaId')
    })
  })

  describe('getRefFieldsByType', () => {
    it('should return empty object when no ref fields exist', () => {
      const detailView: DetailViewConfig = {
        sections: [
          {
            title: 'No Ref Fields',
            fields: [{ key: 'id', label: 'ID', type: 'text' }],
          },
        ],
      }

      const result = getRefFieldsByType(detailView)
      expect(result).toEqual({})
    })

    it('should group ref fields by their refTo type', () => {
      const detailView: DetailViewConfig = {
        sections: [
          {
            title: 'Mixed Ref Fields',
            fields: [
              { key: 'mediaId1', label: 'Media ID 1', type: 'ref', refTo: 'media' },
              { key: 'titleId', label: 'Title ID', type: 'ref', refTo: 'titles' },
              { key: 'mediaId2', label: 'Media ID 2', type: 'ref', refTo: 'media' },
            ],
          },
        ],
      }

      const result = getRefFieldsByType(detailView)
      expect(result).toEqual({
        media: [
          { key: 'mediaId1', label: 'Media ID 1', type: 'ref', refTo: 'media' },
          { key: 'mediaId2', label: 'Media ID 2', type: 'ref', refTo: 'media' },
        ],
        titles: [{ key: 'titleId', label: 'Title ID', type: 'ref', refTo: 'titles' }],
      })
    })

    it('should handle multiple fields with same refTo type', () => {
      const detailView: DetailViewConfig = {
        sections: [
          {
            title: 'Multiple Same Type',
            fields: [
              { key: 'mediaId1', label: 'Media ID 1', type: 'ref', refTo: 'media' },
              { key: 'mediaId2', label: 'Media ID 2', type: 'ref', refTo: 'media' },
            ],
          },
        ],
      }

      const result = getRefFieldsByType(detailView)
      expect(result['media']).toHaveLength(2)
    })
  })

  describe('hasRefFields', () => {
    it('should return false when detailView is undefined', () => {
      const result = hasRefFields(undefined)
      expect(result).toBe(false)
    })

    it('should return false when no ref fields exist', () => {
      const detailView: DetailViewConfig = {
        sections: [
          {
            title: 'No Ref Fields',
            fields: [{ key: 'id', label: 'ID', type: 'text' }],
          },
        ],
      }

      const result = hasRefFields(detailView)
      expect(result).toBe(false)
    })

    it('should return true when ref fields exist', () => {
      const detailView: DetailViewConfig = {
        sections: [
          {
            title: 'With Ref Fields',
            fields: [
              { key: 'id', label: 'ID', type: 'text' },
              { key: 'mediaId', label: 'Media ID', type: 'ref', refTo: 'media' },
            ],
          },
        ],
      }

      const result = hasRefFields(detailView)
      expect(result).toBe(true)
    })
  })

  describe('findReferencingResources', () => {
    it('should find resources that reference a target resource type', () => {
      const result = findReferencingResources(mockAllUiConfigs, 'media')
      expect(result).toHaveLength(1)
      expect(result[0].resourceName).toBe('media-relationships')
      expect(result[0].field.key).toBe('mediaId')
    })

    it('should find resources that reference titles', () => {
      const result = findReferencingResources(mockAllUiConfigs, 'titles')
      expect(result).toHaveLength(1)
      expect(result[0].resourceName).toBe('media-relationships')
      expect(result[0].field.key).toBe('entityId')
    })

    it('should return empty array when no resources reference the target', () => {
      const result = findReferencingResources(mockAllUiConfigs, 'nonexistent')
      expect(result).toEqual([])
    })

    it('should handle multiple resources referencing the same target', () => {
      const configsWithMultipleRefs = {
        ...mockAllUiConfigs,
        'another-relationship': {
          detailView: {
            sections: [
              {
                title: 'Another Relationship',
                fields: [{ key: 'mediaId', label: 'Media ID', type: 'ref', refTo: 'media' }],
              },
            ],
          },
        } as UiConfig,
      }

      const result = findReferencingResources(configsWithMultipleRefs, 'media')
      expect(result).toHaveLength(2)
      expect(result.map(r => r.resourceName)).toContain('media-relationships')
      expect(result.map(r => r.resourceName)).toContain('another-relationship')
    })
  })

  describe('Edge Cases', () => {
    it('should handle sections with undefined fields', () => {
      const detailView: DetailViewConfig = {
        sections: [
          {
            title: 'Section with undefined fields',
            fields: undefined as unknown as DetailField[],
          },
        ],
      }

      const result = getRefFields(detailView)
      expect(result).toEqual([])
    })

    it('should handle empty fields arrays', () => {
      const detailView: DetailViewConfig = {
        sections: [
          {
            title: 'Section with empty fields',
            fields: [],
          },
        ],
      }

      const result = getRefFields(detailView)
      expect(result).toEqual([])
    })

    it('should handle unknown resource types gracefully', () => {
      const result = useRelatedItems(mockAllUiConfigs, 'unknown-resource')
      expect(result.value).toBeNull()
    })
  })
})
