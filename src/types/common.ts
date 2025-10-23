// Common types to replace duplicated 'any' usage throughout the codebase

export type DataItem = {
  id?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}
export type DataArray = DataItem[]

export type ActionItem = {
  name?: string
  [key: string]: unknown
}

export type ActionArray = ActionItem[]

export type FormData = Record<string, unknown>

export type QueryParams = Record<string, unknown>

export type GenericObject = Record<string, unknown>

export type FilterValue = unknown

export type FilterPreset = 'all' | '7d' | '30d' | '90d' | 'custom'

export type FilterConfig = {
  key: string
  label: string
  [key: string]: unknown
}

export type FilterArray = FilterConfig[]

export type ErrorType = unknown

export type EventHandler = (event: unknown) => void

export type TemporalDate = {
  year: number
  month: number
  day: number
}

export type TemporalGlobal = {
  Temporal: {
    PlainDate: {
      from: (date: TemporalDate) => unknown
    }
  }
}

export interface PaginatedResponse<T> {
  /** Array of items */
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
