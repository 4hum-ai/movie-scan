// Aligned with backend @admin-ui interfaces (services/movie-service/src/plugins/admin-ui/index.ts)

export interface ActionConfig {
  name: string
  label: string
  type: 'button' | 'link' | 'dropdown'
  icon?: string
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  permission?: string
  url?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
}

export interface ColumnConfig {
  key: string
  label: string
  type:
    | 'text'
    | 'number'
    | 'date'
    | 'boolean'
    | 'image'
    | 'video'
    | 'audio'
    | 'url'
    | 'array'
    | 'object'
    | 'color'
  sortable?: boolean
  filterable?: boolean
  searchable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  formatter?: 'rating' | 'status' | 'date' | 'currency' | 'badge' | 'country' | 'number'
  hidden?: boolean
  titleField?: string
  subtitleField?: string
}

export interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}

export type FilterDefaultValue = string | number | boolean | Date | null

export interface FilterConfig {
  field: string
  type: 'text' | 'select' | 'date' | 'boolean' | 'number'
  label: string
  options?: Array<{ value: string; label: string }>
  defaultValue?: unknown
}

export interface ListViewConfig {
  columns: ColumnConfig[]
  defaultSort?: SortConfig
  defaultFilters?: FilterConfig[]
  searchableFields?: string[]
  pageSize?: number
  actions?: ActionConfig[]
}

export interface CalendarViewConfig {
  dateField: string
  titleField?: string
  colorField?: string
  descriptionField?: string
}

export interface KanbanViewConfig {
  groupByField: string
  columns: Array<{ value: string; label: string; color?: string }>
  cardTitleField: string
  cardDescriptionField?: string
}

export interface GalleryViewConfig {
  imageField: string
  titleField?: string
  descriptionField?: string
}

export interface DetailField {
  key: string
  label: string
  type:
    | 'text'
    | 'number'
    | 'date'
    | 'boolean'
    | 'image'
    | 'video'
    | 'audio'
    | 'url'
    | 'array'
    | 'object'
    | 'ref'
  formatter?: 'rating' | 'status' | 'date' | 'currency' | 'badge' | 'country' | 'number'
  /** The resource type this field references (only used when type is 'ref') */
  refTo?: string
}
export interface DetailSection {
  title: string
  fields: DetailField[]
}
export interface DetailViewConfig {
  sections: DetailSection[]
}

export type ValidationRule =
  | { type: 'required'; message?: string }
  | { type: 'minLength'; value: number; message?: string }
  | { type: 'maxLength'; value: number; message?: string }
  | { type: 'pattern'; value: RegExp; message?: string }
  | { type: 'custom'; validate: (val: unknown) => boolean | string }

export interface FormField {
  key: string
  label: string
  type:
    | 'text'
    | 'textarea'
    | 'number'
    | 'select'
    | 'multiselect'
    | 'date'
    | 'boolean'
    | 'file'
    | 'url'
    | 'color'
    | 'resource'
    // extention from frontend, need adding back to backend
    | 'email'
    | 'array'
    | 'object'
  required?: boolean
  validation?: unknown
  options?: Array<{ value: string; label: string }>
  placeholder?: string
  helpText?: string
  // Resource selector specific fields
  resourceType?: string
  displayField?: string
  valueField?: string
  subtitleField?: string
  searchable?: boolean
  searchPlaceholder?: string
  query?: Record<string, unknown>
  // Array and object specific fields
  itemType?: 'string' | 'number' | 'object' | 'boolean'
  fields?: FormField[]
}
export interface FormViewConfig {
  fields: FormField[]
  layout?: 'single' | 'tabs' | 'sections'
  // Frontend extension: when set to 'upload', DynamicFormSidebar shows FileUploadModal instead of form
  mode?: 'form' | 'upload'
}

export interface ViewsConfig {
  list?: ListViewConfig
  calendar?: CalendarViewConfig
  kanban?: KanbanViewConfig
  gallery?: GalleryViewConfig
}

export interface ResourceUIConfig {
  displayName: string
  description?: string
  icon?: string
  views: ViewsConfig
  detailView?: DetailViewConfig
  formView?: FormViewConfig
}

// Frontend-only optional extensions
export interface UiFeaturesConfig {
  stats?: unknown
}

export type UiConfig = ResourceUIConfig & { features?: UiFeaturesConfig }
