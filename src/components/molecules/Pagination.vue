<template>
  <div
    class="flex items-center justify-between rounded-b-lg border border-t-0 border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900"
  >
    <div class="text-sm text-gray-700 dark:text-gray-300">
      Showing <span class="font-medium">{{ startItem }}</span> to
      <span class="font-medium">{{ endItem }}</span> of
      <span class="font-medium">{{ safeTotal }}</span> results
    </div>
    <div class="flex items-center gap-1">
      <div class="mr-2 hidden items-center gap-2 sm:flex">
        <label class="text-xs text-gray-500 dark:text-gray-400">Per page</label>
        <select
          :value="safePerPage"
          class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          @change="onPerPageChange"
        >
          <option v-for="opt in pageSizeOptionsComputed" :key="`size-${opt}`" :value="opt">
            {{ opt }}
          </option>
        </select>
      </div>
      <button
        class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        :disabled="safeCurrentPage <= 1"
        @click="goToPage(1)"
      >
        First
      </button>
      <button
        class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        :disabled="safeCurrentPage <= 1"
        @click="goToPage(safeCurrentPage - 1)"
      >
        Prev
      </button>

      <button
        v-for="p in pages"
        :key="`page-${p.key}`"
        class="rounded border px-3 py-1 text-sm transition-colors"
        :class="
          p.isEllipsis
            ? 'cursor-default border-transparent text-gray-400 dark:text-gray-500'
            : p.value === safeCurrentPage
              ? 'border-primary-600 bg-primary-50 text-primary-700'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        "
        :disabled="p.isEllipsis"
        @click="!p.isEllipsis && goToPage(p.value)"
      >
        {{ p.label }}
      </button>

      <button
        class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        :disabled="safeCurrentPage >= safeTotalPages"
        @click="goToPage(safeCurrentPage + 1)"
      >
        Next
      </button>
      <button
        class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        :disabled="safeCurrentPage >= safeTotalPages"
        @click="goToPage(safeTotalPages)"
      >
        Last
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  currentPage: number
  totalPages: number
  total: number
  perPage: number
  pageSizeOptions?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  pageSizeOptions: () => [5, 10, 20, 50, 100],
})
const emit = defineEmits<{
  (e: 'page-change', page: number): void
  (e: 'per-page-change', perPage: number): void
}>()

const safeTotal = computed(() => Number(props.total) || 0)
const safePerPage = computed(() => Math.max(1, Number(props.perPage) || 10))
const safeCurrentPage = computed(() => Math.max(1, Number(props.currentPage) || 1))
const safeTotalPages = computed(
  () => Number(props.totalPages) || Math.max(1, Math.ceil(safeTotal.value / safePerPage.value))
)

const startItem = computed(() => {
  if (safeTotal.value === 0) return 0
  return (safeCurrentPage.value - 1) * safePerPage.value + 1
})
const endItem = computed(() => Math.min(safeCurrentPage.value * safePerPage.value, safeTotal.value))

const pages = computed(() => {
  const total = safeTotalPages.value
  const current = safeCurrentPage.value
  const windowSize = 1
  const items: Array<{
    key: string
    label: string
    value: number
    isEllipsis?: boolean
  }> = []
  const pushPage = (p: number) => items.push({ key: String(p), label: String(p), value: p })
  const pushEllipsis = (key: string) => items.push({ key, label: '…', value: -1, isEllipsis: true })

  if (total <= 7) {
    for (let p = 1; p <= total; p++) pushPage(p)
    return items
  }

  pushPage(1)
  if (current > 2 + windowSize) pushEllipsis('start')

  const start = Math.max(2, current - windowSize)
  const end = Math.min(total - 1, current + windowSize)
  for (let p = start; p <= end; p++) pushPage(p)

  if (current < total - (1 + windowSize)) pushEllipsis('end')
  pushPage(total)
  return items
})

const pageSizeOptionsComputed = computed(() => {
  const base = (props.pageSizeOptions || [10, 20, 50, 100]).filter(n => Number(n) > 0)
  const withCurrent = base.includes(safePerPage.value) ? base : [...base, safePerPage.value]
  const unique = Array.from(new Set(withCurrent)) as number[]
  return unique.sort((a, b) => a - b)
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= safeTotalPages.value && page !== safeCurrentPage.value)
    emit('page-change', page)
}

const onPerPageChange = (e: Event) => {
  const next = Number((e.target as HTMLSelectElement).value) || safePerPage.value
  if (next > 0 && next !== safePerPage.value) emit('per-page-change', next)
}
</script>
