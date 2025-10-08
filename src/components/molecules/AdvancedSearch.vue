<template>
  <div class="flex min-w-0 flex-1 items-center gap-2">
    <SearchInput
      ref="searchInputRef"
      v-model="searchQuery"
      :placeholder="placeholder"
      class="flex-1"
      @update:model-value="handleSearchInput"
    />

    <div v-if="showFieldSelection" class="hidden items-center gap-2 sm:flex">
      <div class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <label class="text-xs text-gray-500 dark:text-gray-400">Fields</label>
        <select
          v-model="selectedSearchField"
          class="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          @change="handleSearchInput"
        >
          <option value="all">All fields</option>
          <option v-for="field in searchableFields" :key="field.key" :value="field.key">
            {{ field.label }}
          </option>
        </select>
      </div>
    </div>

    <button
      v-if="showFiltersButton"
      class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-900"
      @click="$emit('open-filters')"
    >
      <svg class="mr-1.5 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
        />
      </svg>
      Filters
    </button>

    <button
      v-if="showCloseButton"
      class="focus:ring-primary-500 inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      aria-label="Close search"
      @click="$emit('close-search')"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M6.225 4.811a.75.75 0 011.06 0L12 9.525l4.715-4.714a.75.75 0 111.06 1.06L13.06 10.586l4.715 4.714a.75.75 0 11-1.06 1.06L12 11.646l-4.715 4.714a.75.75 0 11-1.06-1.06l4.714-4.714-4.714-4.715a.75.75 0 010-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import SearchInput from '@/components/atoms/SearchInput.vue'

interface SearchableField {
  key: string
  label: string
}

interface Props {
  /** Search query value */
  modelValue: string
  /** Placeholder text for search input */
  placeholder?: string
  /** Searchable fields for field selection */
  searchableFields?: SearchableField[]
  /** Whether to show field selection */
  showFieldSelection?: boolean
  /** Whether to show filters button */
  showFiltersButton?: boolean
  /** Whether to show close button */
  showCloseButton?: boolean
  /** Debounce delay in milliseconds */
  debounceMs?: number
}

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', query: string, field: string): void
  (e: 'open-filters'): void
  (e: 'close-search'): void
}>()

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  searchableFields: () => [],
  showFieldSelection: true,
  showFiltersButton: true,
  showCloseButton: false,
  debounceMs: 300,
})

const searchInputRef = ref<InstanceType<typeof SearchInput> | null>(null)
const searchQuery = ref(props.modelValue)
const selectedSearchField = ref('all')

// Sync with parent modelValue
watch(
  () => props.modelValue,
  newValue => {
    searchQuery.value = newValue
  }
)

// Emit search events
const handleSearchInput = () => {
  emit('update:modelValue', searchQuery.value)
  emit('search', searchQuery.value, selectedSearchField.value)
}

// Focus search input when component mounts
const focusSearch = () => {
  searchInputRef.value?.focus()
}

// Expose focus method
defineExpose({
  focus: focusSearch,
})
</script>
