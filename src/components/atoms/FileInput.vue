<template>
  <div class="w-full">
    <label v-if="label" :for="fileInputId" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="ml-1 text-red-500">*</span>
    </label>

    <div class="space-y-2">
      <!-- File input button -->
      <div class="relative">
        <input
          :id="fileInputId"
          ref="fileInputRef"
          type="file"
          :accept="accept"
          :multiple="multiple"
          :disabled="disabled"
          :class="inputClasses"
          @change="handleFileChange"
          @blur="handleBlur"
          @focus="handleFocus"
        />

        <!-- Custom file input button -->
        <button type="button" :disabled="disabled" :class="buttonClasses" @click="triggerFileInput">
          <IconCloudUpload class="mr-2 h-4 w-4" />
          {{ buttonText }}
        </button>
      </div>

      <!-- File preview/status -->
      <div v-if="uploading" class="text-xs text-gray-500 dark:text-gray-400">
        <div class="flex items-center">
          <div
            class="mr-2 h-3 w-3 animate-spin rounded-full border border-gray-300 border-t-transparent"
          ></div>
          Uploading...
        </div>
      </div>

      <div
        v-else-if="modelValue && typeof modelValue === 'string'"
        class="rounded bg-gray-50 p-2 text-xs break-all text-gray-500 dark:bg-gray-800 dark:text-gray-400"
      >
        <div class="flex items-center justify-between">
          <span class="truncate">{{ getFileName(modelValue) }}</span>
          <button type="button" class="ml-2 text-red-500 hover:text-red-700" @click="clearFile">
            ✕
          </button>
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

    <!-- FileUploadModal integration -->
    <FileUploadModal
      v-if="showUploadModal"
      :title="modalTitle"
      :accept="accept"
      :max-files="multiple ? maxFiles : 1"
      :form-fields="formFields"
      @close="closeUploadModal"
      @uploaded="handleUploaded"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import FileUploadModal from '@/components/molecules/FileUploadModal.vue'
import { useMedia, useToast } from '@/composables'
import IconCloudUpload from '~icons/mdi/cloud-upload'

interface Props {
  modelValue: string | undefined
  /** Accepted file types */
  accept?: string
  /** Whether to allow multiple files */
  multiple?: boolean
  /** Maximum number of files */
  maxFiles?: number
  /** Input size */
  size?: 'sm' | 'md' | 'lg'
  /** Label text */
  label?: string
  /** Whether the field is required */
  required?: boolean
  /** Whether the field is disabled */
  disabled?: boolean
  /** Help text below the input */
  helpText?: string
  /** Error message */
  error?: string
  /** Validation state */
  validationState?: 'default' | 'success' | 'error' | 'warning'
  /** Button text */
  buttonText?: string
  /** Modal title */
  modalTitle?: string
  /** Use modal for file selection */
  useModal?: boolean
  /** Form fields for modal */
  formFields?: Array<{
    key: string
    label: string
    type: 'text' | 'select' | 'textarea' | 'tags'
    required?: boolean
    options?: string[]
    placeholder?: string
    value?: string | string[]
  }>
}

const props = withDefaults(defineProps<Props>(), {
  accept: '*/*',
  multiple: false,
  maxFiles: 1,
  size: 'md',
  validationState: 'default',
  buttonText: 'Choose File',
  modalTitle: 'Upload File',
  useModal: false,
  formFields: () => [
    {
      key: 'type',
      label: 'Type',
      type: 'select',
      value: 'poster',
      options: ['poster', 'thumbnail', 'banner', 'logo', 'other'],
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter description',
      value: '',
    },
  ],
})

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const showUploadModal = ref(false)
const uploading = ref(false)

const { uploadViaMediaResource } = useMedia()
const { push } = useToast()

const fileInputId = `file-input-${Math.random().toString(36).substr(2, 9)}`

const inputClasses = computed(() => {
  const base = 'sr-only' // Hide the actual file input
  return base
})

const buttonClasses = computed(() => {
  const base =
    'inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  }

  let borderClasses =
    'border-gray-300 focus:border-red-500 focus:ring-red-500 dark:border-gray-600 dark:focus:border-red-400 dark:focus:ring-red-400'

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

const triggerFileInput = () => {
  if (props.useModal) {
    showUploadModal.value = true
  } else {
    fileInputRef.value?.click()
  }
}

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files && input.files[0]
  if (!file) return

  try {
    uploading.value = true
    const result = await uploadViaMediaResource(file, { type: 'poster' })
    emit('update:modelValue', result.fileUrl)
    push({
      id: `${Date.now()}-file-upload` as string,
      type: 'success',
      title: 'Upload complete',
      body: `${file.name} uploaded`,
      position: 'tr',
      timeout: 4000,
    })
  } catch (err: unknown) {
    push({
      id: `${Date.now()}-file-upload-err` as string,
      type: 'error',
      title: 'Upload failed',
      body: (err as Error)?.message || 'Unable to upload file',
      position: 'tr',
      timeout: 6000,
    })
  } finally {
    uploading.value = false
  }
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const closeUploadModal = () => {
  showUploadModal.value = false
}

const handleUploaded = () => {
  showUploadModal.value = false
  // The modal handles the upload, so we just close it
  // The parent component should handle updating the modelValue
}

const clearFile = () => {
  emit('update:modelValue', undefined)
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const getFileName = (url: string) => {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    return pathname.split('/').pop() || url
  } catch {
    return url
  }
}
</script>
