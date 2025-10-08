import { computed, type ComputedRef } from 'vue'
import type { DetailViewConfig, DetailField, UiConfig } from '@/types/ui-config'
import { useUiConfig } from './useUiConfig'

/**
 * Configuration for displaying related items
 */
export interface RelatedItemsConfig {
  /** Resource type to search for relationships (e.g., 'media-relationships') */
  relationshipResource: string
  /** Field that contains the reference to the current item */
  referenceField: string
  /** Field that contains the related entity type */
  entityTypeField?: string
  /** Field that contains the related entity ID */
  entityIdField?: string
  /** Field that contains the relationship type */
  relationshipTypeField?: string
  /** Field to use as the display title */
  titleField?: string
  /** Field to use as the subtitle */
  subtitleField?: string
}

/**
 * Automatically derives RelatedItemsConfig by scanning ALL UI configs
 * to find which other resources have ref fields that reference the current resource
 *
 * @param currentResourceType - The current resource type (e.g., 'media', 'titles')
 * @returns Computed RelatedItemsConfig or null if no referencing resources found
 */
export function useRelatedItems(
  currentResourceType: string
): ComputedRef<RelatedItemsConfig | null> {
  const { state: uiConfigState } = useUiConfig()

  return computed(() => {
    const configs = uiConfigState.configs
    if (!configs || Object.keys(configs).length === 0) return null

    // Scan all UI configs to find resources that reference the current resource
    const referencingResources: Array<{
      resourceName: string
      field: DetailField
    }> = []

    for (const [resourceName, uiConfig] of Object.entries(configs)) {
      if (!uiConfig.detailView?.sections) continue

      // Find ref fields that reference the current resource type
      const refFields = uiConfig.detailView.sections
        .flatMap(section => section.fields || [])
        .filter(field => field.type === 'ref' && field.refTo === currentResourceType)

      // Add each referencing field
      refFields.forEach(field => {
        referencingResources.push({
          resourceName,
          field,
        })
      })
    }

    if (referencingResources.length === 0) return null

    // For now, use the first referencing resource
    // In the future, we could support multiple relationship types
    const firstRef = referencingResources[0]
    const relationshipResource = firstRef.resourceName
    const referenceField = firstRef.field.key

    // Create the auto-generated config
    const config: RelatedItemsConfig = {
      relationshipResource,
      referenceField,
      entityTypeField: 'entityType',
      entityIdField: 'entityId',
      relationshipTypeField: 'relationshipType',
      titleField: 'entityId',
      subtitleField: 'relationshipType',
    }

    return config
  })
}

/**
 * Gets all ref fields from a detail view configuration
 */
export function getRefFields(detailView: DetailViewConfig | undefined): DetailField[] {
  if (!detailView?.sections) return []

  return detailView.sections
    .flatMap(section => section.fields || [])
    .filter(field => field.type === 'ref' && field.refTo)
}

/**
 * Gets ref fields grouped by their refTo type
 */
export function getRefFieldsByType(
  detailView: DetailViewConfig | undefined
): Record<string, DetailField[]> {
  const refFields = getRefFields(detailView)

  return refFields.reduce(
    (acc, field) => {
      const refTo = field.refTo!
      if (!acc[refTo]) {
        acc[refTo] = []
      }
      acc[refTo].push(field)
      return acc
    },
    {} as Record<string, DetailField[]>
  )
}

/**
 * Checks if a detail view has any ref fields
 */
export function hasRefFields(detailView: DetailViewConfig | undefined): boolean {
  return getRefFields(detailView).length > 0
}

/**
 * Finds all resources that reference a given resource type
 */
export function findReferencingResources(
  allUiConfigs: Record<string, UiConfig>,
  targetResourceType: string
): Array<{ resourceName: string; field: DetailField }> {
  const referencingResources: Array<{ resourceName: string; field: DetailField }> = []

  for (const [resourceName, uiConfig] of Object.entries(allUiConfigs)) {
    if (!uiConfig.detailView?.sections) continue

    // Find ref fields that reference the target resource type
    const refFields = uiConfig.detailView.sections
      .flatMap(section => section.fields || [])
      .filter(field => field.type === 'ref' && field.refTo === targetResourceType)

    // Add each referencing field
    refFields.forEach(field => {
      referencingResources.push({
        resourceName,
        field,
      })
    })
  }

  return referencingResources
}
