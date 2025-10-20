<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <label v-if="label" class="block text-sm font-medium text-gray-900 dark:text-gray-100">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>

      <!-- Input mode toggle -->
      <div class="flex items-center space-x-1">
        <button
          type="button"
          class="flex h-7 w-7 items-center justify-center rounded-md text-sm transition-colors"
          :class="
            inputMode === 'structured'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300'
          "
          title="Form mode"
          @click="inputMode = 'structured'"
        >
          📋
        </button>
        <button
          type="button"
          class="flex h-7 w-7 items-center justify-center rounded-md text-sm transition-colors"
          :class="
            inputMode === 'json'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300'
          "
          title="JSON mode"
          @click="inputMode = 'json'"
        >
          { }
        </button>
      </div>
    </div>

    <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <!-- Structured form mode -->
      <div
        v-if="inputMode === 'structured' && fields && fields.length > 0"
        class="divide-y divide-gray-200 dark:divide-gray-700"
      >
        <div v-for="field in fields" :key="field.key" class="space-y-2 p-4">
          <!-- Field label -->
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300">
            {{ field.label || formatKey(field.key) }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>

          <!-- Text input -->
          <FormInput
            v-if="['text', 'email', 'url'].includes(field.type)"
            :model-value="String(getFieldValue(field.key) || '')"
            :type="field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'"
            :placeholder="field.placeholder"
            :required="field.required"
            :error="getFieldError(field.key)"
            @update:model-value="updateField(field.key, $event)"
          />

          <!-- Number input -->
          <FormInput
            v-else-if="field.type === 'number'"
            :model-value="String(getFieldValue(field.key) || '')"
            type="number"
            :placeholder="field.placeholder"
            :required="field.required"
            :error="getFieldError(field.key)"
            @update:model-value="updateField(field.key, $event)"
          />

          <!-- Textarea -->
          <Textarea
            v-else-if="field.type === 'textarea'"
            :model-value="String(getFieldValue(field.key) || '')"
            :placeholder="field.placeholder"
            :required="field.required"
            :error="getFieldError(field.key)"
            @update:model-value="updateField(field.key, $event)"
          />

          <!-- Select -->
          <SelectInput
            v-else-if="field.type === 'select'"
            :model-value="getSelectFieldValue(field.key)"
            :options="field.options || []"
            :placeholder="field.placeholder"
            :required="field.required"
            :error="getFieldError(field.key)"
            @update:model-value="updateField(field.key, $event)"
          />

          <!-- Boolean/Checkbox -->
          <Checkbox
            v-else-if="field.type === 'boolean'"
            :model-value="Boolean(getFieldValue(field.key))"
            :label="field.placeholder || 'Enable'"
            :required="field.required"
            :error="getFieldError(field.key)"
            @update:model-value="updateField(field.key, $event)"
          />

          <!-- Date input -->
          <FormInput
            v-else-if="field.type === 'date'"
            :model-value="String(getFieldValue(field.key) || '')"
            type="date"
            :placeholder="field.placeholder"
            :required="field.required"
            :error="getFieldError(field.key)"
            @update:model-value="updateField(field.key, $event)"
          />

          <!-- Array of strings (using TagInput) -->
          <div v-else-if="field.type === 'array' && field.itemType === 'string'">
            <TagInput
              :model-value="
                Array.isArray(getFieldValue(field.key))
                  ? (getFieldValue(field.key) as string[])
                  : []
              "
              :placeholder="field.placeholder || 'Add item and press Enter'"
              @update:model-value="updateField(field.key, $event)"
            />
          </div>

          <!-- Nested array of objects (fallback to JSON for now to avoid circular dependency) -->
          <JsonInput
            v-else-if="field.type === 'array'"
            :model-value="JSON.stringify(getFieldValue(field.key) || [], null, 2)"
            :placeholder="field.placeholder || 'Enter JSON array...'"
            :rows="4"
            :error="getFieldError(field.key)"
            @update:model-value="updateFieldFromJson(field.key, $event)"
          />

          <!-- Nested object -->
          <ObjectInput
            v-else-if="field.type === 'object'"
            :model-value="
              (getFieldValue(field.key) as Record<string, unknown>) ||
              ({} as Record<string, unknown>)
            "
            :fields="field.fields || []"
            :required="field.required"
            :error="getFieldError(field.key)"
            @update:model-value="updateField(field.key, $event)"
          />

          <!-- Fallback: JSON input for complex types -->
          <JsonInput
            v-else
            :model-value="JSON.stringify(getFieldValue(field.key) || '', null, 2)"
            :placeholder="field.placeholder || 'Enter JSON...'"
            :rows="3"
            :error="getFieldError(field.key)"
            @update:model-value="updateFieldFromJson(field.key, $event)"
          />
        </div>
      </div>

      <!-- JSON mode or fallback when no fields defined -->
      <div v-else class="p-4">
        <JsonInput
          :model-value="JSON.stringify(modelValue || {}, null, 2)"
          :placeholder="placeholder || 'Enter JSON object...'"
          :rows="inputMode === 'json' ? 8 : 6"
          :error="jsonError || error"
          @update:model-value="updateFromJson"
        />
      </div>
    </div>

    <!-- Help text -->
    <p v-if="helpText" class="text-xs text-gray-500 dark:text-gray-400">
      {{ helpText }}
    </p>

    <!-- Error message -->
    <p v-if="error" class="text-xs text-red-600 dark:text-red-400">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import FormInput from './FormInput.vue'
import Textarea from './Textarea.vue'
import SelectInput from './SelectInput.vue'
import Checkbox from './Checkbox.vue'
import TagInput from './TagInput.vue'
import JsonInput from './JsonInput.vue'
import type { FormField } from '@/types/ui-config'

// Note: ArrayInput removed to avoid circular dependency - arrays use JSON fallback

interface Props {
  modelValue: Record<string, unknown>
  label?: string
  placeholder?: string
  required?: boolean
  helpText?: string
  error?: string
  fields?: FormField[]
  validationState?: 'default' | 'success' | 'error' | 'warning'
}

interface Emits {
  (e: 'update:modelValue', value: Record<string, unknown>): void
  (e: 'blur'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
  validationState: 'default',
})

const emit = defineEmits<Emits>()

// Local state for object data
const localValue = ref<Record<string, unknown>>({ ...props.modelValue })
const fieldErrors = ref<Record<string, string>>({})
const inputMode = ref<'structured' | 'json'>('structured')
const jsonError = ref<string | undefined>()

// Watch for external changes
watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = { ...newValue }
  },
  { deep: true },
)

// Helper functions
const formatKey = (key: string): string => {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (s) => s.toUpperCase())
}

const getFieldValue = (key: string): unknown => {
  return localValue.value[key]
}

const getFieldError = (key: string): string | undefined => {
  return fieldErrors.value[key]
}

const getSelectFieldValue = (key: string): string | number | boolean | undefined => {
  return getFieldValue(key) as string | number | boolean | undefined
}

const updateField = (key: string, value: unknown) => {
  localValue.value[key] = value

  // Clear field error when user starts typing
  if (fieldErrors.value[key]) {
    delete fieldErrors.value[key]
  }

  emit('update:modelValue', { ...localValue.value })
}

const updateFieldFromJson = (key: string, jsonString: string) => {
  try {
    const parsed = JSON.parse(jsonString)
    updateField(key, parsed)
    // Clear JSON parse error
    if (fieldErrors.value[key]) {
      delete fieldErrors.value[key]
    }
  } catch {
    fieldErrors.value[key] = 'Invalid JSON format'
  }
}

const updateFromJson = (jsonString: string) => {
  try {
    const parsed = JSON.parse(jsonString)
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      localValue.value = parsed
      emit('update:modelValue', parsed)
      jsonError.value = undefined
    } else {
      jsonError.value = 'Must be a valid JSON object'
    }
  } catch (error) {
    jsonError.value = error instanceof Error ? error.message : 'Invalid JSON format'
  }
}
</script>
