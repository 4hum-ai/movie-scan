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
        <div class="col-span-1 p-4 sm:col-span-3 sm:border-r sm:p-6 dark:border-gray-800">
          <div
            v-if="!files.length"
            class="grid min-h-[200px] place-items-center rounded-lg border-2 border-dashed sm:h-full"
            @dragover.prevent
            @drop.prevent="onDrop"
            v-show="allowDragDrop"
          >
            <div class="text-center">
              <CloudUploadIcon
                class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                aria-hidden="true"
              />
              <div class="mt-3 text-sm text-gray-600 dark:text-gray-300">Drag & drop files</div>
              <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">or</div>
              <button
                class="bg-primary-600 hover:bg-primary-700 mt-3 flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white"
                @click="pick"
              >
                <FolderOpenIcon class="h-4 w-4" aria-hidden="true" />
                Choose files
              </button>
              <input
                ref="fileInput"
                type="file"
                class="hidden"
                :accept="accept"
                :multiple="true"
                @change="onPick"
              />
            </div>
          </div>

          <div v-else class="overflow-y-auto sm:h-full">
            <!-- File previews based on mode -->
            <div v-if="previewMode === 'single' && previews.length === 1" class="space-y-3">
              <div class="overflow-hidden rounded-lg border bg-black/5 dark:bg-white/5">
                <Image
                  v-if="previews[0].kind === 'image'"
                  :src="previews[0].url"
                  alt="preview"
                  class="h-auto w-full"
                />
                <video
                  v-else-if="previews[0].kind === 'video'"
                  :src="previews[0].url"
                  controls
                  class="h-auto w-full bg-black"
                />
                <audio
                  v-else-if="previews[0].kind === 'audio'"
                  :src="previews[0].url"
                  controls
                  class="w-full"
                />
                <div v-else class="p-8 text-sm text-gray-500 dark:text-gray-400">
                  No preview available
                </div>
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-300">
                <div class="flex items-center justify-between gap-3">
                  <div class="flex min-w-0 items-center gap-2">
                    <component
                      :is="getFileTypeIcon(previews[0].kind)"
                      class="h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                    />
                    <div class="min-w-0">
                      <div class="truncate font-medium">
                        {{ previews[0].name }}
                      </div>
                      <div>
                        Mimetype: {{ previews[0].type || '-' }} • Format:
                        {{ previews[0].format.toUpperCase() }}
                      </div>
                      <div>
                        Size: {{ prettySize(previews[0].size) }}
                        <span v-if="previews[0].duration !== undefined"
                          >• Duration: {{ prettyDuration(previews[0].duration) }}</span
                        >
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="xs" @click="removeAt(0)">
                    <DeleteIcon class="h-3 w-3" aria-hidden="true" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <!-- Multi file list (default mode) -->
            <div v-else-if="previewMode === 'single'" class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Selected files ({{ files.length }})
                </div>
                <Button variant="outline" size="xs" @click="clearAll">
                  <DeleteIcon class="h-3 w-3" aria-hidden="true" />
                  Remove all
                </Button>
              </div>
              <ul class="divide-y dark:divide-gray-800">
                <li
                  v-for="(p, idx) in previews"
                  :key="p.name"
                  class="flex items-center justify-between py-2"
                >
                  <div class="flex min-w-0 items-center gap-2">
                    <component
                      :is="getFileTypeIcon(p.kind)"
                      class="h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                    />
                    <div class="min-w-0">
                      <div class="truncate text-xs font-medium text-gray-900 dark:text-gray-100">
                        {{ p.name }}
                      </div>
                      <div class="text-[11px] text-gray-500 dark:text-gray-400">
                        {{ p.format.toUpperCase() }} • {{ prettySize(p.size) }}
                        <span v-if="p.duration !== undefined"
                          >• {{ prettyDuration(p.duration) }}</span
                        >
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="xs" custom-class="ml-3" @click="removeAt(idx)">
                    <DeleteIcon class="h-3 w-3" aria-hidden="true" />
                    Remove
                  </Button>
                </li>
              </ul>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Total size: {{ prettySize(totalSize) }}
              </div>
            </div>
          </div>
        </div>
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
          <div
            class="sticky bottom-0 mt-4 flex justify-end gap-2 border-t bg-white/80 px-4 py-3 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80"
          >
            <Button variant="outline" size="sm" :disabled="uploading" @click="$emit('close')">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              :disabled="!files.length || uploading"
              @click="upload"
            >
              Upload
            </Button>
          </div>
          <div v-if="uploading" class="sticky right-0 bottom-0 left-0 h-1 bg-gray-200">
            <div class="bg-primary-600 h-1 transition-all" :style="{ width: `${progress}%` }" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Image from '@/components/molecules/Image.vue'
import TagInput from '@/components/atoms/TagInput.vue'
import Button from '@/components/atoms/Button.vue'

// Icons
import CloseIcon from '~icons/mdi/close'
import CloudUploadIcon from '~icons/mdi/cloud-upload-outline'
import FolderOpenIcon from '~icons/mdi/folder-open-outline'
import VideoIcon from '~icons/mdi/video-outline'
import AudioIcon from '~icons/mdi/music-note-outline'
import ImageIcon from '~icons/mdi/image-outline'
import FileIcon from '~icons/mdi/file-outline'
import DeleteIcon from '~icons/mdi/delete-outline'

import { useMedia } from '@/composables/useMedia'
import { useGlobalUpload } from '@/composables/useGlobalUpload'

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
const fileInput = ref<HTMLInputElement | null>(null)
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
  fileInput.value?.click()
}
function onPick(e: Event) {
  setFiles(Array.from((e.target as HTMLInputElement).files || []))
}
function onDrop(e: DragEvent) {
  setFiles(Array.from(e.dataTransfer?.files || []))
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
  uploader.update(id, { status: 'uploading', progress: 5 })

  // Build metadata from form data
  const metadata: Record<string, unknown> = {}
  const fields = typeof props.formFields === 'function' ? props.formFields() : props.formFields
  fields.forEach((field) => {
    const value = formData.value[field.key]
    if (value !== undefined && value !== '') {
      metadata[field.key] = value
    }
  })

  // Add file-specific metadata
  metadata.fileName = f.name
  metadata.fileSize = f.size
  metadata.fileType = f.type

  // Add duration if available
  const p = previews.value.find((x) => x.name === f.name)
  if (p?.duration !== undefined) {
    metadata.duration = Math.round(p.duration)
  }

  await uploadViaMediaResource(f, {
    type: String(formData.value.type || 'original'),
    format: String(formData.value.format || 'mp4'),
    language: String(formData.value.language || 'en'),
    description: formData.value.description ? String(formData.value.description) : undefined,
    tags: Array.isArray(formData.value.tags) ? (formData.value.tags as string[]) : [],
    metadata,
  })

  uploader.update(id, { status: 'completed', progress: 100 })
}

function prettySize(bytes: number): string {
  const sizes = ['B', 'KB', 'MB', 'GB']
  if (!bytes) return '0 B'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`
}

function prettyDuration(sec: number): string {
  const s = Math.floor(sec % 60)
  const m = Math.floor((sec / 60) % 60)
  const h = Math.floor(sec / 3600)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function getFileTypeIcon(kind: 'image' | 'video' | 'audio' | 'other') {
  switch (kind) {
    case 'video':
      return VideoIcon
    case 'audio':
      return AudioIcon
    case 'image':
      return ImageIcon
    default:
      return FileIcon
  }
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

// tags handled by TagInput atom via v-model

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
