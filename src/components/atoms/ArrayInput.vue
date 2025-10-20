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
          [ ]
        </button>
      </div>
    </div>

    <!-- Structured array mode -->
    <div v-if="inputMode === 'structured'" class="space-y-3">
      <!-- Array items -->
      <div
        v-for="(item, index) in localValue"
        :key="index"
        class="relative rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
      >
        <!-- Item header with remove button -->
        <div class="mb-2 flex items-center justify-between">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
            Item {{ index + 1 }}
          </span>
          <button
            type="button"
            class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            @click="removeItem(index)"
          >
            ✕
          </button>
        </div>

        <!-- Object fields or simple value -->
        <div v-if="fields && fields.length > 0" class="space-y-2">
          <div v-for="field in fields" :key="field.key" class="space-y-1">
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300">
              {{ field.label || formatKey(field.key) }}
              <span v-if="field.required" class="text-red-500">*</span>
            </label>

            <!-- Text input -->
            <FormInput
              v-if="['text', 'email', 'url'].includes(field.type)"
              :model-value="String(getItemFieldValue(index, field.key) || '')"
              :type="field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'"
              :placeholder="field.placeholder"
              :required="field.required"
              size="sm"
              @update:model-value="updateItemField(index, field.key, $event)"
            />

            <!-- Number input -->
            <FormInput
              v-else-if="field.type === 'number'"
              :model-value="String(getItemFieldValue(index, field.key) || '')"
              type="number"
              :placeholder="field.placeholder"
              :required="field.required"
              size="sm"
              @update:model-value="updateItemField(index, field.key, $event)"
            />

            <!-- Textarea -->
            <Textarea
              v-else-if="field.type === 'textarea'"
              :model-value="String(getItemFieldValue(index, field.key) || '')"
              :placeholder="field.placeholder"
              :required="field.required"
              :rows="2"
              @update:model-value="updateItemField(index, field.key, $event)"
            />

            <!-- Select -->
            <SelectInput
              v-else-if="field.type === 'select'"
              :model-value="getItemSelectFieldValue(index, field.key)"
              :options="field.options || []"
              :placeholder="field.placeholder"
              :required="field.required"
              size="sm"
              @update:model-value="updateItemField(index, field.key, $event)"
            />

            <!-- Boolean/Checkbox -->
            <Checkbox
              v-else-if="field.type === 'boolean'"
              :model-value="Boolean(getItemFieldValue(index, field.key))"
              :label="field.placeholder || 'Enable'"
              :required="field.required"
              @update:model-value="updateItemField(index, field.key, $event)"
            />

            <!-- Array of strings (nested TagInput) -->
            <TagInput
              v-else-if="field.type === 'array' && field.itemType === 'string'"
              :model-value="
                Array.isArray(getItemFieldValue(index, field.key))
                  ? (getItemFieldValue(index, field.key) as string[])
                  : []
              "
              :placeholder="field.placeholder || 'Add item and press Enter'"
              @update:model-value="updateItemField(index, field.key, $event)"
            />

            <!-- Fallback: JSON input for complex nested types -->
            <JsonInput
              v-else
              :model-value="JSON.stringify(getItemFieldValue(index, field.key) || '', null, 2)"
              :placeholder="field.placeholder || 'Enter JSON...'"
              :rows="2"
              @update:model-value="updateItemFieldFromJson(index, field.key, $event)"
            />
          </div>
        </div>

        <!-- Simple value editor (for non-object arrays) -->
        <div v-else>
          <FormInput
            :model-value="String(item || '')"
            placeholder="Enter value..."
            size="sm"
            @update:model-value="updateSimpleItem(index, $event)"
          />
        </div>
      </div>

      <!-- Add new item button -->
      <button
        type="button"
        class="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-3 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-300"
        @click="addItem"
      >
        + Add Item
      </button>
    </div>

    <!-- JSON mode -->
    <div v-else class="space-y-2">
      <JsonInput
        :model-value="JSON.stringify(localValue, null, 2)"
        :placeholder="placeholder || 'Enter JSON array...'"
        :rows="8"
        :error="jsonError || error"
        @update:model-value="updateFromJson"
      />
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

interface Props {
  modelValue: unknown[]
  label?: string
  placeholder?: string
  required?: boolean
  helpText?: string
  error?: string
  fields?: FormField[]
  itemType?: 'string' | 'number' | 'object' | 'boolean'
}

interface Emits {
  (e: 'update:modelValue', value: unknown[]): void
  (e: 'blur'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  itemType: 'object',
})

const emit = defineEmits<Emits>()

// Local state for array data
const localValue = ref<unknown[]>([...props.modelValue])
const inputMode = ref<'structured' | 'json'>('structured')
const jsonError = ref<string | undefined>()

// Watch for external changes
watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = [...newValue]
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

const getItemFieldValue = (itemIndex: number, fieldKey: string): unknown => {
  const item = localValue.value[itemIndex]
  if (typeof item === 'object' && item !== null) {
    return (item as Record<string, unknown>)[fieldKey]
  }
  return undefined
}

const getItemSelectFieldValue = (
  itemIndex: number,
  fieldKey: string,
): string | number | boolean | undefined => {
  return getItemFieldValue(itemIndex, fieldKey) as string | number | boolean | undefined
}

const updateItemField = (itemIndex: number, fieldKey: string, value: unknown) => {
  const item = localValue.value[itemIndex]
  if (typeof item === 'object' && item !== null) {
    const updatedItem = { ...(item as Record<string, unknown>), [fieldKey]: value }
    localValue.value[itemIndex] = updatedItem
  } else {
    // Create new object if item is not an object
    localValue.value[itemIndex] = { [fieldKey]: value }
  }

  emit('update:modelValue', [...localValue.value])
}

const updateItemFieldFromJson = (itemIndex: number, fieldKey: string, jsonString: string) => {
  try {
    const parsed = JSON.parse(jsonString)
    updateItemField(itemIndex, fieldKey, parsed)
  } catch (error) {
    console.error('Invalid JSON:', error)
  }
}

const updateSimpleItem = (itemIndex: number, value: string) => {
  localValue.value[itemIndex] = value
  emit('update:modelValue', [...localValue.value])
}

const addItem = () => {
  if (props.fields && props.fields.length > 0) {
    // Create new object with default values based on field definitions
    const newItem: Record<string, unknown> = {}
    props.fields.forEach((field) => {
      if (field.type === 'boolean') {
        newItem[field.key] = false
      } else if (field.type === 'number') {
        newItem[field.key] = 0
      } else if (field.type === 'array') {
        newItem[field.key] = []
      } else if (field.type === 'object') {
        newItem[field.key] = {}
      } else {
        newItem[field.key] = ''
      }
    })
    localValue.value.push(newItem)
  } else {
    // Add simple value
    localValue.value.push('')
  }

  emit('update:modelValue', [...localValue.value])
}

const removeItem = (index: number) => {
  localValue.value.splice(index, 1)
  emit('update:modelValue', [...localValue.value])
}

const updateFromJson = (jsonString: string) => {
  try {
    const parsed = JSON.parse(jsonString)
    if (Array.isArray(parsed)) {
      localValue.value = parsed
      emit('update:modelValue', parsed)
      jsonError.value = undefined
    } else {
      jsonError.value = 'Must be a valid JSON array'
    }
  } catch (error) {
    jsonError.value = error instanceof Error ? error.message : 'Invalid JSON format'
  }
}
</script>
