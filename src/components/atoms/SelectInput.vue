<template>
  <div class="w-full">
    <label v-if="label" :for="selectId" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="ml-1 text-red-500">*</span>
    </label>

    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        :class="selectClasses"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <option :value="undefined">
          {{ placeholder || `Select ${label?.toLowerCase() || 'option'}` }}
        </option>
        <option v-for="option in options" :key="String(option.value)" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <!-- Dropdown arrow icon -->
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <IconChevronDown class="h-4 w-4 text-gray-400" />
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
import { computed } from 'vue'
import IconChevronDown from '~icons/mdi/chevron-down'

interface SelectOption {
  value: string | number | boolean
  label: string
}

interface Props {
  modelValue: string | number | boolean | undefined
  /** Select options */
  options: SelectOption[]
  /** Placeholder text */
  placeholder?: string
  /** Input size */
  size?: 'sm' | 'md' | 'lg'
  /** Label text */
  label?: string
  /** Whether the field is required */
  required?: boolean
  /** Whether the field is disabled */
  disabled?: boolean
  /** Help text below the select */
  helpText?: string
  /** Error message */
  error?: string
  /** Validation state */
  validationState?: 'default' | 'success' | 'error' | 'warning'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  validationState: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean | undefined]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const selectId = `select-${Math.random().toString(36).substr(2, 9)}`

const selectClasses = computed(() => {
  const base =
    'w-full rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-100 appearance-none pr-10'

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

const labelClasses = computed(() => {
  const base = 'block font-medium text-gray-700 dark:text-gray-300'
  const sizes = {
    sm: 'text-xs mb-1',
    md: 'text-sm mb-2',
    lg: 'text-base mb-2',
  }
  return `${base} ${sizes[props.size]}`
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

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value
  // Convert to appropriate type based on the option value
  const selectedOption = props.options.find(opt => String(opt.value) === value)
  emit('update:modelValue', selectedOption?.value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>
