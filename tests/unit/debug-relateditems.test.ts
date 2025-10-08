import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useRelatedItems } from '@/composables/useRelatedItems'
import type { UiConfig } from '@/types/ui-config'

// Mock the useUiConfig composable
vi.mock('@/composables/useUiConfig', () => ({
  useUiConfig: vi.fn(),
}))

describe('Debug Related Items Issue', () => {
  beforeEach(async () => {
    // Mock the useUiConfig composable to return our test data
    const { useUiConfig } = await import('@/composables/useUiConfig')
    vi.mocked(useUiConfig).mockReturnValue({
      state: {
        configs: {
          'media-relationships': {
            detailView: {
              sections: [
                {
                  title: 'Relationship Information',
                  fields: [
                    { key: 'id', label: 'ID', type: 'text' },
                    {
                      key: 'mediaId',
                      label: 'Media ID',
                      type: 'ref',
                      refTo: 'media',
                    },
                    {
                      key: 'relationshipType',
                      label: 'Relationship Type',
                      type: 'text',
                      formatter: 'badge',
                    },
                    {
                      key: 'entityType',
                      label: 'Entity Type',
                      type: 'text',
                    },
                    {
                      key: 'entityId',
                      label: 'Entity ID',
                      type: 'ref',
                      refTo: 'titles',
                    },
                  ],
                },
              ],
            },
          } as UiConfig,
        },
      },
    } as ReturnType<typeof useUiConfig>)
  })

  it('should debug the actual media-relationships config', () => {
    // Test what happens when viewing a media item
    const mediaResult = useRelatedItems('media')
    console.log('Media result:', mediaResult.value)

    // Test what happens when viewing a titles item
    const titlesResult = useRelatedItems('titles')
    console.log('Titles result:', titlesResult.value)

    expect(mediaResult.value).not.toBeNull()
    expect(titlesResult.value).not.toBeNull()
  })

  it('should debug what happens when viewing a media item', () => {
    const result = useRelatedItems('media')
    console.log('When viewing media item:')
    console.log('- Looking for relationships where mediaId = current_media_id')
    console.log('- Config:', result.value)

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

  it('should debug what happens when viewing a titles item', () => {
    const result = useRelatedItems('titles')
    console.log('When viewing titles item:')
    console.log('- Looking for relationships where entityId = current_title_id')
    console.log('- Config:', result.value)

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

  it('should show the expected query structure', () => {
    const result = useRelatedItems('media')
    const config = result.value

    if (config) {
      const expectedQuery = {
        [config.referenceField]: 'current_item_id',
        page: 1,
        limit: 100,
      }

      console.log('Expected query structure:', expectedQuery)
      console.log(
        `This should find all ${config.relationshipResource} where ${config.referenceField} = current_item_id`
      )

      expect(config.referenceField).toBe('mediaId')
      expect(config.relationshipResource).toBe('media-relationships')
    }
  })
})
