<template>
  <div
    class="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
  >
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th v-if="selectable" class="px-6 py-3">
              <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
            </th>
            <th
              v-for="column in visibleColumns"
              :key="column.key"
              class="group px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase transition-colors duration-150 dark:text-gray-400"
              :class="[
                column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : '',
                column.align ? `text-${column.align}` : 'text-left',
              ]"
              :style="{ width: column.width || undefined }"
              :aria-sort="
                column.sortable
                  ? sortField === column.key
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                  : undefined
              "
              @click="column.sortable ? handleSort(column.key) : null"
            >
              <div class="inline-flex items-center gap-1 select-none">
                <span>{{ column.label }}</span>
                <svg
                  class="h-3.5 w-3.5 transition-transform duration-150"
                  :class="[
                    column.sortable ? '' : 'hidden',
                    sortField === column.key
                      ? 'text-gray-700 opacity-100 dark:text-gray-200'
                      : 'text-gray-400 opacity-0 group-hover:opacity-60 dark:text-gray-500',
                  ]"
                  :style="{
                    transform:
                      sortField === column.key && sortDirection === 'desc'
                        ? 'rotate(180deg)'
                        : 'rotate(0deg)',
                  }"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 7c.3 0 .58.13.77.36l4 5a1 1 0 01-.77 1.64H8a1 1 0 01-.77-1.64l4-5A1 1 0 0112 7z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
          <tr
            v-for="item in sortedData"
            :key="
              String(
                (item as Record<string, unknown>)?.id ??
                  (item as Record<string, unknown>)?._id ??
                  '',
              )
            "
            class="cursor-pointer transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800"
            :title="`Click to view ${String((item as Record<string, unknown>)?.name || (item as Record<string, unknown>)?.title || 'details')}`"
            @click="handleRowClick(item)"
          >
            <td v-if="selectable" class="px-6 py-4 whitespace-nowrap" @click.stop>
              <input type="checkbox" :checked="isSelected(item)" @change="toggleSelectRow(item)" />
            </td>
            <td
              v-for="column in visibleColumns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100"
              :class="column.align ? `text-${column.align}` : ''"
              :style="{ width: column.width || undefined }"
            >
              <div v-if="column.key === 'actions'" class="flex items-center justify-end">
                <ActionsMenu
                  :items="actionMenuItems"
                  size="sm"
                  @select="(key) => handleAction(key, item)"
                />
              </div>
              <div v-else>
                <div v-if="column.titleField" class="flex items-center gap-3">
                  <div class="min-w-0">
                    <div class="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ getTitle(item, column) }}
                    </div>
                    <div
                      v-if="getSubtitle(item, column)"
                      class="truncate text-xs text-gray-500 dark:text-gray-400"
                    >
                      {{ getSubtitle(item, column) }}
                    </div>
                  </div>
                </div>
                <div v-else-if="column.formatter === 'country'" class="flex items-center gap-2">
                  <div
                    v-if="countryCode((item as Record<string, unknown>)[column.key])"
                    class="shrink-0"
                  >
                    <picture>
                      <source
                        :srcset="`https://flagcdn.com/${countryCode(item[column.key])}.svg`"
                        type="image/svg+xml"
                      />
                      <Image
                        :src="`https://flagcdn.com/24x18/${countryCode(item[column.key])}.png`"
                        alt=""
                        :width="24"
                        :height="18"
                        class="rounded-sm"
                      />
                    </picture>
                  </div>
                  <span class="text-sm text-gray-900 dark:text-gray-100">
                    {{ countryName(item[column.key]) }}
                  </span>
                </div>
                <div v-else-if="column.type === 'image'" class="flex items-center">
                  <Image
                    :src="getItemString(item, column.key)"
                    alt=""
                    class="h-8 w-8 rounded bg-gray-100 object-cover dark:bg-gray-800"
                  />
                </div>
                <div v-else-if="column.type === 'url'">
                  <a
                    :href="getItemString(item, column.key)"
                    target="_blank"
                    rel="noopener"
                    class="text-primary-600 dark:text-primary-400 hover:underline"
                    >{{ item[column.key] }}</a
                  >
                </div>
                <div v-else-if="column.type === 'color'" class="flex items-center gap-2">
                  <span
                    class="inline-block h-4 w-4 rounded border border-gray-300 dark:border-gray-700"
                    :style="{
                      backgroundColor: getItemString(item, column.key) || '#ffffff',
                    }"
                  ></span>
                  <span class="text-sm text-gray-900 dark:text-gray-100">{{
                    item[column.key] || '-'
                  }}</span>
                </div>
                <div v-else-if="column.formatter === 'badge'">
                  <span
                    :class="[
                      'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
                      badgeClass(item[column.key]),
                    ]"
                    :title="getBadgeTooltip(item[column.key])"
                  >
                    {{ getBadgeDisplayValue(item[column.key]) }}
                  </span>
                </div>
                <div
                  v-else-if="column.formatter === 'status'"
                  class="inline-flex items-center gap-2"
                >
                  <span
                    :class="['h-2 w-2 rounded-full', statusDotClass(item[column.key])]"
                    aria-hidden="true"
                  ></span>
                  <span
                    :class="[
                      'rounded px-2 py-0.5 text-xs font-medium',
                      statusBadgeClass(item[column.key]),
                    ]"
                    >{{ item[column.key] || '-' }}</span
                  >
                </div>
                <div v-else class="text-gray-900 dark:text-gray-100">
                  {{ formatCellValue(item[column.key], column, item) }}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="hasPagination" class="border-t border-gray-200 dark:border-gray-700">
      <Pagination
        :current-page="Number(currentPage) || 1"
        :total-pages="Number(totalPages) || 1"
        :total="Number(total) || 0"
        :per-page="Number(perPage) || 10"
        :page-size-options="pageSizeOptions"
        @page-change="onPageChange"
        @per-page-change="onPerPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Pagination from '@/components/molecules/Pagination.vue'
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'
import { getCountryByCode } from '@/utils/countries'
import { toDate } from '@/utils/date'
import type { DataArray, ActionArray, DataItem } from '@/types/common'
import { ColumnConfig, UiConfig } from '@/types/ui-config'
import Image from '@/components/molecules/Image.vue'

type Props = {
  data: DataArray
  config: { columns: ColumnConfig[]; actions?: ActionArray }
  selectable?: boolean
  rowIdKey?: string
  currentPage?: number
  totalPages?: number
  total?: number
  perPage?: number
  pageSizeOptions?: number[]
  resourceName?: string
  uiConfig?: UiConfig
  loading?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  selectable: true,
  rowIdKey: 'id',
})
const emit = defineEmits<{
  (e: 'action', action: string, item?: unknown): void
  (e: 'sort', field: string, direction: 'asc' | 'desc'): void
  (e: 'item-click', item: unknown): void
  (e: 'selection-change', ids: (string | number)[]): void
  (e: 'page-change', page: number): void
  (e: 'per-page-change', perPage: number): void
}>()

const route = useRoute()

// Sorting state
const sortField = ref('')
const sortDirection = ref<'asc' | 'desc'>('asc')

function syncSortFromQuery() {
  try {
    const raw = String(route.query.sort || '')
    if (!raw) {
      sortField.value = ''
      sortDirection.value = 'asc'
      return
    }
    const [field, dir] = raw.split(':')
    sortField.value = field || ''
    sortDirection.value = dir === 'desc' ? 'desc' : 'asc'
  } catch {
    void 0
  }
}

// Selection state
const selectedIds = ref<Set<string | number>>(new Set())

const visibleColumns = computed(() =>
  (props.config?.columns || []).filter((c: unknown) => !(c as { hidden?: boolean }).hidden),
)

const sortedData = computed(() => {
  const d = [...props.data]
  if (sortField.value) {
    d.sort((a: DataItem, b: DataItem) => {
      const av = a[sortField.value]
      const bv = b[sortField.value]
      if (av == null && bv == null) return 0
      if (av == null) return 1
      if (bv == null) return -1
      const as = String(av)
      const bs = String(bv)
      return sortDirection.value === 'asc' ? as.localeCompare(bs) : bs.localeCompare(as)
    })
  }
  return d
})

const actionMenuItems = computed<{ key: string; label: string }[]>(() => {
  const actions = props.config?.actions as ActionArray | undefined
  if (!Array.isArray(actions)) return []
  return actions
    .map((a: unknown) => {
      const name = (a as { name?: string }).name
      const label = (a as { label?: string; name?: string }).label || name || ''
      return { key: String(name || ''), label: String(label) }
    })
    .filter((it) => it.key && it.label)
})

// Handlers
function handleRowClick(item: unknown) {
  emit('item-click', item)
}

function handleAction(actionKey: string, item: DataItem) {
  emit('action', actionKey, item)
}

function handleSort(field: string) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
  // Defer emitting to allow local UI to reflect immediately before route updates
  window.setTimeout(() => emit('sort', field, sortDirection.value), 0)
}

const hasPagination = computed(() => {
  const total = Number(props.total)
  const totalPages = Number(props.totalPages)
  return !isNaN(total) && total > 0 && !isNaN(totalPages) && totalPages >= 1
})

const onPageChange = (page: number) => emit('page-change', page)
const onPerPageChange = (perPage: number) => emit('per-page-change', perPage)

const getRowId = (item: DataItem): string | number =>
  item?.[props.rowIdKey as string] as string | number
const isSelected = (item: DataItem): boolean => selectedIds.value.has(getRowId(item))
const allSelected = computed(
  () =>
    sortedData.value.length > 0 &&
    sortedData.value.every((it) => selectedIds.value.has(getRowId(it))),
)
const toggleSelectRow = (item: DataItem) => {
  const id = getRowId(item)
  if (selectedIds.value.has(id)) selectedIds.value.delete(id)
  else selectedIds.value.add(id)
  emit('selection-change', Array.from(selectedIds.value))
}
const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value.clear()
  } else {
    sortedData.value.forEach((it) => selectedIds.value.add(getRowId(it)))
  }
  emit('selection-change', Array.from(selectedIds.value))
}

// Cell formatting helpers
const formatCellValue = (value: unknown, column: ColumnConfig, item?: unknown) => {
  if (value === null || value === undefined) return '-'
  switch (column.formatter) {
    case 'date': {
      const d = toDate(value)
      if (!d) return '-'
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }
    case 'currency': {
      const num = typeof value === 'string' ? parseFloat(value) : (value as number)
      if (!Number.isFinite(num)) return '-'
      const currency = String((item as Record<string, unknown>)?.currency || 'USD')
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num as number)
    }
    case 'number': {
      const num = typeof value === 'string' ? parseFloat(value) : (value as number)
      if (!Number.isFinite(num)) return '-'
      return new Intl.NumberFormat('en-US').format(num as number)
    }
    case 'rating': {
      const num = typeof value === 'string' ? parseFloat(value) : (value as number)
      if (!Number.isFinite(num)) return '-'
      return `${(num as number).toFixed(1)} / 5`
    }
    case 'badge':
    case 'status':
    case 'country':
      return String(value ?? '-')
  }
  switch (column.type) {
    case 'date': {
      const d = toDate(value)
      if (!d) return '-'
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }
    case 'number': {
      const num = typeof value === 'string' ? parseFloat(value) : (value as number)
      if (!Number.isFinite(num)) return '-'
      return new Intl.NumberFormat('en-US').format(num as number)
    }
    case 'boolean':
      return value ? 'Yes' : 'No'
    case 'array':
      return Array.isArray(value) ? value.join(', ') : String(value)
    case 'object':
      return JSON.stringify(value)
    default:
      return String(value)
  }
}

const getItemString = (item: DataItem, key: string): string => {
  const val = item[key]
  if (val === null || val === undefined) return ''
  return String(val)
}

const getTitle = (item: DataItem, column: ColumnConfig): string => {
  const key = column.titleField || column.key
  const val = item?.[key]
  if (val === null || val === undefined) return '-'
  return String(val)
}

const getSubtitle = (item: unknown, column: unknown): string => {
  const key = (column as { subtitleField?: string }).subtitleField
  if (!key) return ''
  const val = (item as Record<string, unknown>)?.[key]
  if (val === null || val === undefined) return ''
  return String(val)
}

const badgeClass = (value: unknown): string => {
  const v = String(value || '').toLowerCase()
  if (['active', 'success', 'paid', 'publisher', 'large', 'enterprise'].includes(v))
    return 'bg-green-100 text-green-800'
  if (['pending', 'warning', 'medium'].includes(v)) return 'bg-yellow-100 text-yellow-800'
  if (['inactive', 'secondary', 'small', 'startup'].includes(v)) return 'bg-gray-100 text-gray-800'
  if (['suspended', 'error', 'failed'].includes(v)) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

const statusDotClass = (value: unknown): string => {
  const v = String(value || '').toLowerCase()
  if (['active', 'success', 'paid', 'online'].includes(v)) return 'bg-green-500'
  if (['pending', 'warning'].includes(v)) return 'bg-yellow-500'
  if (['inactive', 'offline'].includes(v)) return 'bg-gray-400'
  if (['suspended', 'error', 'failed'].includes(v)) return 'bg-red-500'
  return 'bg-gray-400'
}

const statusBadgeClass = (value: unknown): string => {
  const v = String(value || '').toLowerCase()
  if (['active', 'success', 'paid', 'online'].includes(v))
    return 'bg-green-50 text-green-700 border border-green-200'
  if (['pending', 'warning'].includes(v))
    return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
  if (['inactive', 'offline'].includes(v)) return 'bg-gray-50 text-gray-700 border border-gray-200'
  if (['suspended', 'error', 'failed'].includes(v))
    return 'bg-red-50 text-red-700 border border-red-200'
  return 'bg-gray-50 text-gray-700 border border-gray-200'
}

const countryCode = (raw: unknown): string | '' => {
  if (!raw) return ''
  const val = String(raw).trim()
  if (val.length === 2) return val.toLowerCase()
  const c = getCountryByCode(val)
  if (c) return c.code.toLowerCase()
  return ''
}

const countryName = (raw: unknown): string => {
  if (!raw) return '-'
  const val = String(raw).trim()
  const c = getCountryByCode(val)
  return c?.name || val
}

const getBadgeDisplayValue = (value: unknown): string => {
  if (value === null || value === undefined) return '-'

  // Default behavior: show the value as string
  let str: string
  if (Array.isArray(value)) {
    str = value
      .map((item) =>
        typeof item === 'object' && item !== null ? JSON.stringify(item) : String(item),
      )
      .join(', ')
  } else if (typeof value === 'object' && value !== null) {
    try {
      str = JSON.stringify(value)
    } catch {
      str = String(value)
    }
  } else {
    str = String(value)
  }
  return str.length > 50 ? `${str.substring(0, 47)}...` : str
}

const getBadgeTooltip = (value: unknown): string => {
  if (value === null || value === undefined) return ''

  // Use same formatting logic as getBadgeDisplayValue for consistency
  let str: string
  if (Array.isArray(value)) {
    str = value
      .map((item) =>
        typeof item === 'object' && item !== null ? JSON.stringify(item) : String(item),
      )
      .join(', ')
  } else if (typeof value === 'object' && value !== null) {
    try {
      str = JSON.stringify(value)
    } catch {
      str = String(value)
    }
  } else {
    str = String(value)
  }

  // For regular badges, show full content if truncated
  return str.length > 50 ? str : ''
}

// Initialize sort from route
syncSortFromQuery()
watch(
  () => route.query.sort,
  () => {
    syncSortFromQuery()
  },
)
</script>
