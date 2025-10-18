<template>
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
          :multiple="multiple"
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
                  <span v-if="p.duration !== undefined">• {{ prettyDuration(p.duration) }}</span>
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Image from '@/components/molecules/Image.vue'
import Button from '@/components/atoms/Button.vue'

// Icons
import CloudUploadIcon from '~icons/mdi/cloud-upload-outline'
import FolderOpenIcon from '~icons/mdi/folder-open-outline'
import VideoIcon from '~icons/mdi/video-outline'
import AudioIcon from '~icons/mdi/music-note-outline'
import ImageIcon from '~icons/mdi/image-outline'
import FileIcon from '~icons/mdi/file-outline'
import DeleteIcon from '~icons/mdi/delete-outline'

interface Props {
  /** Accepted file types */
  accept?: string
  /** Enable multiple file selection */
  multiple?: boolean
  /** Enable drag & drop */
  allowDragDrop?: boolean
  /** Preview layout mode */
  previewMode?: 'grid' | 'list' | 'single'
  /** Files array */
  files: File[]
  /** Previews array */
  previews: Array<{
    url: string
    kind: 'image' | 'video' | 'audio' | 'other'
    name: string
    type: string
    size: number
    format: string
    duration?: number
  }>
  /** Total size of all files */
  totalSize: number
}

withDefaults(defineProps<Props>(), {
  accept: 'video/*,audio/*,.vtt,.srt',
  multiple: true,
  allowDragDrop: true,
  previewMode: 'single',
})

const emit = defineEmits<{
  (e: 'pick'): void
  (e: 'onPick', files: File[]): void
  (e: 'onDrop', files: File[]): void
  (e: 'removeAt', index: number): void
  (e: 'clearAll'): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)

function pick() {
  fileInput.value?.click()
}

function onPick(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files || [])
  emit('onPick', files)
}

function onDrop(e: DragEvent) {
  const files = Array.from(e.dataTransfer?.files || [])
  emit('onDrop', files)
}

function removeAt(index: number) {
  emit('removeAt', index)
}

function clearAll() {
  emit('clearAll')
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
</script>
