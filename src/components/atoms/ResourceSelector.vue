<template>
  <div class="w-full">
    <label v-if="label" :for="selectorId" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="ml-1 text-red-500">*</span>
    </label>

    <div class="relative">
      <!-- Search input -->
      <div v-if="searchable" class="relative mb-2">
        <input
          :id="`${selectorId}-search`"
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          :class="searchInputClasses"
          @input="onSearchInput"
          @focus="onSearchFocus"
          @blur="onSearchBlur"
        />
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <IconMagnify class="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <!-- Dropdown trigger -->
      <button
        type="button"
        :id="selectorId"
        :disabled="disabled"
        :class="buttonClasses"
        @click="toggleDropdown"
      >
        <span v-if="selectedResource" class="truncate">
          {{ getDisplayValue(selectedResource) }}
        </span>
        <span v-else class="text-gray-500">
          {{ placeholder || `Select ${label?.toLowerCase() || 'resource'}` }}
        </span>
        <IconChevronDown
          class="ml-2 h-4 w-4 text-gray-400"
          :class="{ 'rotate-180': isDropdownOpen }"
        />
      </button>

      <!-- Dropdown menu -->
      <div
        v-if="isDropdownOpen"
        class="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
      >
        <!-- Loading state -->
        <div v-if="isLoading" class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
          <div class="flex items-center">
            <div
              class="mr-2 h-4 w-4 animate-spin rounded-full border border-gray-300 border-t-transparent"
            ></div>
            Loading resources...
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="hasError" class="px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {{ resourceError || 'Failed to load resources' }}
        </div>

        <!-- Empty state -->
        <div v-else-if="isEmpty" class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
          {{ searchQuery ? 'No resources found matching your search' : 'No resources available' }}
        </div>

        <!-- Resource list -->
        <div v-else class="max-h-60 overflow-y-auto">
          <button
            v-for="resource in items"
            :key="getValue(resource)"
            type="button"
            :class="resourceOptionClasses(resource)"
            @click="selectResource(resource)"
          >
            <div class="flex flex-col">
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ getDisplayValue(resource) }}
              </span>
              <span
                v-if="getSubtitleValue(resource)"
                class="text-xs text-gray-500 dark:text-gray-400"
              >
                {{ getSubtitleValue(resource) }}
              </span>
            </div>
          </button>
        </div>

        <!-- Pagination -->
        <div
          v-if="hasItems && pagination.totalPages > 1"
          class="border-t border-gray-200 px-3 py-2 dark:border-gray-600"
        >
          <div class="flex items-center justify-between">
            <button
              type="button"
              :disabled="pagination.page <= 1"
              class="text-xs text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-200"
              @click="loadPreviousPage"
            >
              ← Previous
            </button>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              Page {{ pagination.page }} of {{ pagination.totalPages }}
            </span>
            <button
              type="button"
              :disabled="pagination.page >= pagination.totalPages"
              class="text-xs text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-200"
              @click="loadNextPage"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Help text -->
    <p v-if="helpText" :class="helpTextClasses">
      {{ helpText }}
    </p>

    <!-- Error message -->
    <p v-if="error" :class="errorClasses">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useResourceService } from '@/composables'
import { useDebounceFn } from '@vueuse/core'
import IconMagnify from '~icons/mdi/magnify'
import IconChevronDown from '~icons/mdi/chevron-down'

interface Props {
  modelValue: string | number | undefined
  /** Resource type to fetch (e.g., 'media', 'titles', 'organizations') */
  resourceType: string
  /** Field to display as the main label */
  displayField?: string
  /** Field to use as the value */
  valueField?: string
  /** Field to display as subtitle */
  subtitleField?: string
  /** Input size */
  size?: 'sm' | 'md' | 'lg'
  /** Label text */
  label?: string
  /** Whether the field is required */
  required?: boolean
  /** Whether the field is disabled */
  disabled?: boolean
  /** Whether to enable search functionality */
  searchable?: boolean
  /** Search placeholder text */
  searchPlaceholder?: string
  /** Help text below the input */
  helpText?: string
  /** Error message */
  error?: string
  /** Validation state */
  validationState?: 'default' | 'success' | 'error' | 'warning'
  /** Placeholder text */
  placeholder?: string
  /** Initial query parameters */
  query?: Record<string, unknown>
}

const props = withDefaults(defineProps<Props>(), {
  displayField: 'name',
  valueField: 'id',
  subtitleField: undefined,
  size: 'md',
  validationState: 'default',
  searchable: true,
  searchPlaceholder: 'Search resources...',
  query: () => ({}),
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | undefined]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const selectorId = `resource-selector-${Math.random().toString(36).substr(2, 9)}`
const isDropdownOpen = ref(false)
const searchQuery = ref('')
const selectedResource = ref<Record<string, unknown> | null>(null)

// Use resource service
const resourceService = useResourceService()
const {
  list,
  items,
  pagination,
  isLoading,
  hasError,
  error: resourceError,
  isEmpty,
  hasItems,
} = resourceService

// Debounced search
const debouncedSearch = useDebounceFn(async () => {
  await loadResources()
}, 300)

// Computed classes
const labelClasses = computed(() => {
  const base = 'block font-medium text-gray-700 dark:text-gray-300'
  const sizes = {
    sm: 'text-xs mb-1',
    md: 'text-sm mb-2',
    lg: 'text-base mb-2',
  }
  return `${base} ${sizes[props.size]}`
})

const buttonClasses = computed(() => {
  const base =
    'w-full rounded-md border bg-white text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-100 flex items-center justify-between'

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  }

  let borderClasses =
    'border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:focus:border-primary-400 dark:focus:ring-primary-400'

  if (props.validationState === 'success') {
    borderClasses =
      'border-green-300 focus:border-green-500 focus:ring-green-500 dark:border-green-600 dark:focus:border-green-400 dark:focus:ring-green-400'
  } else if (props.validationState === 'error') {
    borderClasses =
      'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-400 dark:focus:ring-red-400'
  } else if (props.validationState === 'warning') {
    borderClasses =
      'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500 dark:border-yellow-600 dark:focus:border-yellow-400 dark:focus:ring-yellow-400'
  }

  return `${base} ${sizes[props.size]} ${borderClasses}`
})

const searchInputClasses = computed(() => {
  const base =
    'w-full rounded-md border bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 pr-10'

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  }

  return `${base} ${sizes[props.size]} border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:focus:border-primary-400 dark:focus:ring-primary-400`
})

const helpTextClasses = computed(() => {
  const base = 'mt-1 text-gray-500 dark:text-gray-400'
  const sizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
  }
  return `${base} ${sizes[props.size]}`
})

const errorClasses = computed(() => {
  const base = 'mt-1 text-red-600 dark:text-red-400'
  const sizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
  }
  return `${base} ${sizes[props.size]}`
})

const resourceOptionClasses = (resource: Record<string, unknown> | unknown) => {
  const base =
    'w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700'
  const isSelected = getValue(resource) === props.modelValue
  return isSelected ? `${base} bg-primary-50 dark:bg-primary-900/20` : base
}

// Helper methods
const getValue = (resource: Record<string, unknown> | unknown) => {
  return (resource as Record<string, unknown>)[props.valueField] as string | number
}

const getDisplayValue = (resource: Record<string, unknown> | unknown) => {
  return String(
    (resource as Record<string, unknown>)[props.displayField] ||
      (resource as Record<string, unknown>)[props.valueField] ||
      '',
  )
}

const getSubtitleValue = (resource: Record<string, unknown> | unknown) => {
  return props.subtitleField
    ? String((resource as Record<string, unknown>)[props.subtitleField] || '')
    : undefined
}

// Load resources
const loadResources = async () => {
  try {
    const query = {
      ...props.query,
      page: pagination.value.page,
      limit: 20,
      ...(searchQuery.value && { search: searchQuery.value }),
    }
    await list(props.resourceType, query)
  } catch (err) {
    console.error('Failed to load resources:', err)
  }
}

// Event handlers
const toggleDropdown = () => {
  if (props.disabled) return
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value && items.value.length === 0) {
    loadResources()
  }
}

const selectResource = (resource: Record<string, unknown> | unknown) => {
  selectedResource.value = (resource as Record<string, unknown>) || null
  emit('update:modelValue', getValue(resource as Record<string, unknown>))
  isDropdownOpen.value = false
}

const onSearchInput = () => {
  pagination.value.page = 1 // Reset to first page when searching
  debouncedSearch()
}

const onSearchFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const onSearchBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const loadPreviousPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page -= 1
    loadResources()
  }
}

const loadNextPage = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    pagination.value.page += 1
    loadResources()
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest(`#${selectorId}`) && !target.closest(`#${selectorId}-search`)) {
    isDropdownOpen.value = false
  }
}

// Watch for modelValue changes to find selected resource
watch(
  () => props.modelValue,
  async (newValue) => {
    if (newValue && items.value.length > 0) {
      const resource = items.value.find(
        (item) => getValue(item as Record<string, unknown>) === newValue,
      )
      selectedResource.value = (resource as Record<string, unknown>) || null
    } else if (!newValue) {
      selectedResource.value = null
    }
  },
  { immediate: true },
)

// Load initial resources
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (props.modelValue) {
    loadResources()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
