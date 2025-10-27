<template>
  <div
    class="fixed inset-0 z-50 bg-black/60"
    role="dialog"
    aria-modal="true"
    aria-label="Upload Media"
  >
    <div class="h-full w-full bg-white dark:bg-gray-900">
      <!-- Header -->
      <div class="flex items-center justify-between border-b px-5 py-3 dark:border-gray-800">
        <div class="flex items-center gap-3">
          <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">Upload Media</h2>
          <p class="hidden text-xs text-gray-500 sm:block dark:text-gray-400">
            Select files on the left, set details on the right
          </p>
        </div>
        <button
          class="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Close"
          @click="$emit('close')"
        >
          <CloseIcon class="h-4 w-4" aria-hidden="true" />
          Close
        </button>
      </div>

      <div class="grid h-[calc(100%-3rem)] grid-cols-1 sm:grid-cols-5">
        <!-- File Selector Component -->
        <FileSelector
          :accept="accept"
          :multiple="multiple"
          :allow-drag-drop="allowDragDrop"
          :preview-mode="previewMode"
          :files="files"
          :previews="previews"
          :total-size="totalSize"
          @pick="pick"
          @on-pick="onPick"
          @on-drop="onDrop"
          @remove-at="removeAt"
          @clear-all="clearAll"
        />

        <!-- Metadata Form Component -->
        <MetadataForm
          :form-fields="formFields"
          v-model:form-data="formData"
          :previews="previews"
          :uploading="uploading"
          :progress="progress"
          :has-files="files.length > 0"
          @cancel="$emit('close')"
          @upload="upload"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import FileSelector from '@/components/process/upload/FileSelector.vue'
import MetadataForm from '@/components/process/upload/MetadataForm.vue'

// Icons
import CloseIcon from '~icons/mdi/close'

import { useMedia, useGlobalUpload } from '@/composables'

interface Props {
  /** Modal title */
  title?: string
  /** Accepted file types */
  accept?: string
  /** Supported file types with metadata */
  fileTypes?: FileType[]
  /** Maximum file size in bytes */
  maxFileSize?: number
  /** Maximum number of files */
  maxFiles?: number
  /** Show upload progress */
  showProgress?: boolean
  /** Enable drag & drop */
  allowDragDrop?: boolean
  /** Custom validation rules */
  customValidation?: ValidationRule[]
  /** Custom upload handler */
  uploadHandler?: (files: File[], formData: Record<string, string | string[]>) => Promise<void>
  /** Dynamic form fields */
  formFields?: (() => FormField[]) | FormField[]
  /** Show file preview */
  showPreview?: boolean
  /** Preview layout mode */
  previewMode?: 'grid' | 'list' | 'single'
  /** Enable multiple file selection */
  multiple?: boolean
  /** Relationships to include in media creation */
  relationships?: string[]
  /** Function to call before upload */
  onBeforeUpload?: () => Promise<string | null>
}

interface FileType {
  extension: string
  mimeType: string
  label: string
  icon: string
  maxSize?: number
  allowedTypes?: string[]
}

interface ValidationRule {
  validate: (file: File) => boolean | string // true = valid, string = error message
  message: string
}

interface FormField {
  key: string
  label: string
  type: 'text' | 'select' | 'textarea' | 'tags'
  required?: boolean
  options?: string[] // for select fields
  placeholder?: string
  value?: string | string[]
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'video/*,audio/*,.vtt,.srt',
  maxFiles: 10,
  showProgress: true,
  allowDragDrop: true,
  showPreview: true,
  previewMode: 'single',
  multiple: true,
  formFields: () => [
    {
      key: 'type',
      label: 'Type',
      type: 'select' as const,
      value: 'original',
      options: ['original', 'dubbed', 'trailer', 'voice_over', 'subtitle'],
    },
    {
      key: 'language',
      label: 'Language',
      type: 'select' as const,
      value: 'en',
      options: ['en', 'es', 'fr', 'de', 'ja', 'ko', 'zh', 'hi'],
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea' as const,
      placeholder: 'Enter description',
      value: '',
    },
    {
      key: 'format',
      label: 'Format',
      type: 'select' as const,
      value: 'mp4',
      options: [
        'mp4',
        'mov',
        'mkv',
        'avi',
        'webm',
        'm3u8',
        'mp3',
        'wav',
        'aac',
        'flac',
        'srt',
        'vtt',
        'ass',
        'ssa',
        'jpg',
        'png',
        'webp',
      ],
    },
    {
      key: 'tags',
      label: 'Tags',
      type: 'tags' as const,
      value: [],
    },
  ],
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'uploaded', p: { count: number }): void
}>()

const files = ref<File[]>([])
const formData = ref<Record<string, string | string[]>>({})

// Initialize form data from formFields
const fields = typeof props.formFields === 'function' ? props.formFields() : props.formFields
fields.forEach((field) => {
  if (field.value !== undefined) {
    formData.value[field.key] = field.value
  }
})

const uploading = ref(false)
const progress = ref(0)
const totalSize = ref(0)
const previews = ref<
  Array<{
    url: string
    kind: 'image' | 'video' | 'audio' | 'other'
    name: string
    type: string
    size: number
    format: string
    duration?: number
  }>
>([])

const { uploadViaMediaResource } = useMedia()
const uploader = useGlobalUpload()

function pick() {
  // This will be handled by FileSelector component
}

function onPick(filesList: File[]) {
  setFiles(filesList)
}

function onDrop(filesList: File[]) {
  setFiles(filesList)
}

function setFiles(list: File[]) {
  // Validate files
  const validationResults = validateFiles(list)
  const validFiles = validationResults.filter((r) => r.valid).map((r) => r.file)

  if (validFiles.length === 0) {
    // Show error for invalid files
    const invalidFiles = validationResults.filter((r) => !r.valid)
    console.error('File validation failed:', invalidFiles)
    return
  }

  files.value = validFiles
  totalSize.value = validFiles.reduce((acc, f) => acc + (f.size || 0), 0)

  // Build previews
  previews.value.forEach((p: { url: string }) => URL.revokeObjectURL(p.url))
  previews.value = validFiles.map((f) => {
    const url = URL.createObjectURL(f)
    const m = (f.type || '').split('/')[0]
    const kind =
      m === 'image' ? 'image' : m === 'video' ? 'video' : m === 'audio' ? 'audio' : 'other'
    const format = (f.name.split('.').pop() || '').toLowerCase()
    const item: {
      url: string
      kind: 'image' | 'video' | 'audio' | 'other'
      name: string
      type: string
      size: number
      format: string
      duration?: number
    } = {
      url,
      kind: kind as 'image' | 'video' | 'audio' | 'other',
      name: f.name,
      type: f.type,
      size: f.size,
      format,
    }
    if (kind === 'audio' || kind === 'video') {
      const probe = document.createElement(kind)
      probe.preload = 'metadata'
      probe.src = url
      probe.onloadedmetadata = () => {
        // duration in seconds
        if (!isNaN(probe.duration)) item.duration = probe.duration
      }
    }
    return item
  })
}

// Enhanced file validation
function validateFiles(files: File[]): ValidationResult[] {
  const results: ValidationResult[] = []

  for (const file of files) {
    // Check max files limit
    if (files.length > props.maxFiles) {
      results.push({
        file,
        valid: false,
        error: `Maximum ${props.maxFiles} files allowed`,
      })
      continue
    }

    // Check file size
    if (props.maxFileSize && file.size > props.maxFileSize) {
      results.push({
        file,
        valid: false,
        error: `File size exceeds ${formatFileSize(props.maxFileSize)}`,
      })
      continue
    }

    // Custom validation rules
    let customValidationFailed = false
    for (const rule of props.customValidation || []) {
      const result = rule.validate(file)
      if (result !== true) {
        results.push({
          file,
          valid: false,
          error: String(result),
        })
        customValidationFailed = true
        break
      }
    }

    if (customValidationFailed) continue

    // All validations passed
    results.push({ file, valid: true })
  }

  return results
}

interface ValidationResult {
  file: File
  valid: boolean
  error?: string
}

function formatFileSize(bytes: number): string {
  const sizes = ['B', 'KB', 'MB', 'GB']
  if (!bytes) return '0 B'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`
}

async function upload() {
  if (!files.value.length) return

  // Call onBeforeUpload if provided
  if (props.onBeforeUpload) {
    try {
      uploading.value = true
      const result = await props.onBeforeUpload()
      if (!result) {
        console.error('onBeforeUpload failed')
        uploading.value = false
        return
      }
      console.log('onBeforeUpload completed:', result)
    } catch (error) {
      console.error('onBeforeUpload failed:', error)
      uploading.value = false
      return
    }
  }

  // Use custom upload handler if provided
  if (props.uploadHandler) {
    try {
      uploading.value = true
      await props.uploadHandler(files.value, formData.value)
      emit('uploaded', { count: files.value.length })
      emit('close')
    } catch (error) {
      console.error('Custom upload failed:', error)
      // Don't close modal on error, let user handle it
    } finally {
      uploading.value = false
    }
    return
  }

  // Default upload behavior (existing logic)
  for (const f of files.value) {
    const id = `${Date.now()}-${f.name}-${Math.random().toString(36).slice(2)}`
    uploader.add({
      id,
      fileName: f.name,
      size: f.size,
      type: f.type,
      progress: 0,
      status: 'pending',
    })
    // Kick off upload without blocking modal
    doUpload(id, f).catch((e: unknown) => {
      uploader.update(id, {
        status: 'failed',
        error: (e as Error)?.message || 'Upload failed',
      })
    })
  }
  emit('uploaded', { count: files.value.length })
  emit('close')
}

async function doUpload(id: string, f: File) {
  uploader.update(id, { status: 'uploading', progress: 0 })

  // Build metadata from form data (only non-root fields)
  const metadata: Record<string, unknown> = {}
  const fields = typeof props.formFields === 'function' ? props.formFields() : props.formFields
  fields.forEach((field) => {
    const value = formData.value[field.key]
    // Only add to metadata if it's not a root-level field
    if (
      value !== undefined &&
      value !== '' &&
      !['type', 'format', 'language', 'description', 'tags', 'relationships'].includes(field.key)
    ) {
      metadata[field.key] = value
    }
  })

  // Add duration if available (duration is root level, not metadata)
  const p = previews.value.find((x) => x.name === f.name)
  const duration = p?.duration !== undefined ? Math.round(p.duration) : undefined

  await uploadViaMediaResource(f, {
    type: String(formData.value.type || 'original'),
    format: String(formData.value.format || 'mp4'),
    language: String(formData.value.language || 'en'),
    description: formData.value.description ? String(formData.value.description) : undefined,
    tags: Array.isArray(formData.value.tags) ? (formData.value.tags as string[]) : [],
    relationships: props.relationships || [],
    duration,
    metadata,
    onProgress: (percent: number) => {
      uploader.update(id, { progress: percent })
    },
  })

  uploader.update(id, { status: 'completed', progress: 100 })
}

function removeAt(index: number) {
  const p = previews.value[index]
  if (p) URL.revokeObjectURL(p.url)
  previews.value.splice(index, 1)
  files.value.splice(index, 1)
  totalSize.value = files.value.reduce((acc, f) => acc + (f.size || 0), 0)
}

function clearAll() {
  previews.value.forEach((p: { url: string }) => URL.revokeObjectURL(p.url))
  previews.value = []
  files.value = []
  totalSize.value = 0
}

// UX: close on Escape and prevent background scroll
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  const prev = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  // restore on unmount
  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = prev
  })
})
</script>
