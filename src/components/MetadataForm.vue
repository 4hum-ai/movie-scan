<template>
  <div class="col-span-1 overflow-y-auto p-4 sm:col-span-2 sm:p-6">
    <div class="space-y-3">
      <!-- Dynamic form fields -->
      <div
        v-for="field in typeof formFields === 'function' ? formFields() : formFields"
        :key="field.key"
      >
        <label class="mb-1 block text-xs text-gray-500 dark:text-gray-400">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>

        <!-- Text input -->
        <input
          v-if="field.type === 'text'"
          v-model="formData[field.key]"
          :placeholder="field.placeholder"
          class="w-full rounded-md border px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />

        <!-- Select input -->
        <select
          v-else-if="field.type === 'select'"
          v-model="formData[field.key]"
          class="w-full rounded-md border px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          <option v-for="option in field.options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>

        <!-- Textarea input -->
        <textarea
          v-else-if="field.type === 'textarea'"
          v-model="formData[field.key]"
          :placeholder="field.placeholder"
          class="w-full rounded-md border px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          rows="3"
        />

        <!-- Tags input -->
        <TagInput
          v-else-if="field.type === 'tags'"
          v-model="formData[field.key] as string[]"
          :placeholder="field.placeholder || 'Add tag and press Enter'"
        />
      </div>

      <!-- Duration display (if available) -->
      <div v-if="previews.length === 1 && previews[0].duration !== undefined">
        <label class="mb-1 block text-xs text-gray-500 dark:text-gray-400">Duration</label>
        <input
          :value="prettyDuration(previews[0].duration as number)"
          type="text"
          readonly
          disabled
          class="w-full cursor-not-allowed rounded-md border bg-gray-50 px-2 py-1.5 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        />
      </div>
    </div>

    <!-- Action buttons -->
    <div
      class="sticky bottom-0 mt-4 flex justify-end gap-2 border-t bg-white/80 px-4 py-3 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80"
    >
      <Button variant="outline" size="sm" :disabled="uploading" @click="$emit('cancel')">
        Cancel
      </Button>
      <Button
        variant="primary"
        size="sm"
        :disabled="!hasFiles || uploading"
        @click="$emit('upload')"
      >
        Upload
      </Button>
    </div>

    <!-- Progress bar -->
    <div v-if="uploading" class="sticky right-0 bottom-0 left-0 h-1 bg-gray-200">
      <div class="bg-primary-600 h-1 transition-all" :style="{ width: `${progress}%` }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TagInput from '@/components/atoms/TagInput.vue'
import Button from '@/components/atoms/Button.vue'

interface FormField {
  key: string
  label: string
  type: 'text' | 'select' | 'textarea' | 'tags'
  required?: boolean
  options?: string[] // for select fields
  placeholder?: string
  value?: string | string[]
}

interface Props {
  /** Dynamic form fields */
  formFields?: (() => FormField[]) | FormField[]
  /** Form data object */
  formData: Record<string, string | string[]>
  /** Previews array for duration display */
  previews: Array<{
    duration?: number
  }>
  /** Whether upload is in progress */
  uploading?: boolean
  /** Upload progress percentage */
  progress?: number
  /** Whether files are selected */
  hasFiles?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  uploading: false,
  progress: 0,
  hasFiles: false,
})

const emit = defineEmits<{
  (e: 'update:formData', data: Record<string, string | string[]>): void
  (e: 'cancel'): void
  (e: 'upload'): void
}>()

// Create a computed property for two-way binding
const formData = computed({
  get: () => props.formData,
  set: (value) => emit('update:formData', value),
})

function prettyDuration(sec: number): string {
  const s = Math.floor(sec % 60)
  const m = Math.floor((sec / 60) % 60)
  const h = Math.floor(sec / 3600)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}
</script>
