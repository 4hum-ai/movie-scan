/**
 * Event channels and payload types for the global event bus.
 *
 * Purpose:
 * - Central place to declare event names and payload contracts
 * - Document who publishes and who consumes each channel
 * - Keep string literals stable to prevent accidental API changes
 *
 * Usage:
 * - Import a channel and payload type, then use VueUse: `useEventBus<Payload>(CHANNEL)`
 * - See `docs/event-bus.md` for patterns and guidance. The canonical event list lives here.
 */

/**
 * http:active — emitted when the number of in-flight HTTP requests changes.
 * Publishers: `src/utils/useApiGateway.ts`
 * Consumers: `src/components/organisms/GlobalProgressBar.vue`
 */
export type HttpActivePayload = { active: number }

/**
 * http:error — emitted when a network error occurs (excluding AbortError).
 * Publishers: `src/utils/useApiGateway.ts`
 * Consumers: `src/components/organisms/ToastContainer.vue`
 */
export type HttpErrorPayload = {
  method: string
  path: string
  message: string
}

/**
 * CRUD activity payload for create/update/delete notifications.
 * Publishers: `src/composables/useResourceService.ts`
 * Consumers: `src/composables/useActivity.ts`
 */
export type CrudAction = 'create' | 'update' | 'delete' | 'workflow'

export interface CrudEventPayload<T = unknown> {
  resource: string
  id: string
  action: CrudAction
  beforeData?: T
  afterData?: T
  at: number
}

/** Stable channel names (prefer named imports for tree-shaking). */
export const EVENT_HTTP_ACTIVE = 'http:active' as const
export const EVENT_HTTP_ERROR = 'http:error' as const
export const EVENT_VISITS_UPDATED = 'visits:updated' as const
export const EVENT_ACTIVITIES_UPDATED = 'activities:updated' as const
export const EVENT_CRUD = 'crud' as const
