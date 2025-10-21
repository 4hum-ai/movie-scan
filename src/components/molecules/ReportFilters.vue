<template>
  <div class="mb-6 rounded-lg border bg-white p-6 shadow-sm">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
      <!-- Search -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Search</label>
        <input
          :value="searchQuery"
          @input="emit('update:search-query', ($event.target as HTMLInputElement).value)"
          type="text"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          placeholder="Search by report ID or filename..."
        />
      </div>

      <!-- Status Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Status</label>
        <select
          :value="statusFilter"
          @change="emit('update:status-filter', ($event.target as HTMLSelectElement).value)"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All Status</option>
          <option v-for="status in availableStatuses" :key="status" :value="status">
            {{ getStatusText(status) }}
          </option>
        </select>
      </div>

      <!-- Rating System Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Rating System</label>
        <select
          :value="ratingSystemFilter"
          @change="emit('update:rating-system-filter', ($event.target as HTMLSelectElement).value)"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All Systems</option>
          <option
            v-for="ratingSystem in availableRatingSystems"
            :key="ratingSystem.id"
            :value="ratingSystem.id"
          >
            {{ ratingSystem.name }}
          </option>
        </select>
      </div>

      <!-- Date Range -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Date Range</label>
        <select
          :value="dateRangeFilter"
          @change="emit('update:date-range-filter', ($event.target as HTMLSelectElement).value)"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        >
          <option v-for="option in dateRangeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Clear Filters -->
    <div class="mt-4 flex justify-end">
      <button
        @click="$emit('clear-filters')"
        class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Clear Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DATE_RANGE_OPTIONS } from '@/constants/reportFilters'
import { getStatusText } from '@/constants/reportStatus'

interface Props {
  availableStatuses: string[]
  availableRatingSystems: Array<{ id: string; name: string }>
  searchQuery: string
  statusFilter: string
  ratingSystemFilter: string
  dateRangeFilter: string
}

interface Emits {
  (e: 'update:search-query', value: string): void
  (e: 'update:status-filter', value: string): void
  (e: 'update:rating-system-filter', value: string): void
  (e: 'update:date-range-filter', value: string): void
  (e: 'clear-filters'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const dateRangeOptions = DATE_RANGE_OPTIONS
</script>
