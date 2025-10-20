<template>
  <div>
    <div class="flex items-center justify-between">
      <div class="inline-flex items-center gap-1.5 align-middle">
        <span class="text-xs leading-5 text-gray-500 dark:text-gray-400"
          >Total {{ totalCount }} records</span
        >
      </div>
      <SortDropdown
        v-model="sortValue"
        :label="'Sorted by'"
        :options="sortMenuItems"
        @update:model-value="handleSortChange"
      />
    </div>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
      <div
        v-for="item in data"
        :key="item.id"
        class="cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-sm dark:border-gray-700 dark:bg-gray-900"
        @click="handleItemClick(item)"
      >
        <div
          class="relative flex aspect-square items-center justify-center bg-gray-100 dark:bg-gray-800"
        >
          <template v-if="mediaKind(mediaSrc(item)) === 'image' && mediaSrc(item)">
            <Image :src="mediaSrc(item) || ''" alt="" class="h-full w-full object-cover" />
          </template>

          <template v-else-if="mediaKind(primaryMediaValue(item)) === 'video'">
            <!-- Show video player if this item is active, otherwise show poster/thumbnail -->
            <template v-if="activeVideo && activeVideo.item.id === item.id">
              <div class="h-full w-full bg-black">
                <VideoPlayer
                  :url="activeVideo.url"
                  :title="activeVideo.title"
                  subtitle-url=""
                  mode="inline"
                  @close="closeVideo"
                />
              </div>
            </template>
            <template v-else>
              <template v-if="posterUrl(item)">
                <Image :src="posterUrl(item) || ''" alt="" class="h-full w-full object-cover" />
              </template>
              <template v-else>
                <div class="h-full w-full bg-gray-200 dark:bg-gray-700" />
              </template>
              <button
                type="button"
                class="absolute inset-0 grid place-items-center"
                aria-label="Play video"
                @click="handleVideoClick(item, $event)"
              >
                <PlayIcon class="h-12 w-12 text-white/90 drop-shadow" aria-hidden="true" />
              </button>
              <span
                class="absolute top-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase"
              >
                {{ mediaFormat(item) }}
              </span>
            </template>
          </template>

          <template v-else-if="mediaKind(primaryMediaValue(item)) === 'audio'">
            <!-- Show audio player if this item is active, otherwise show audio icon -->
            <template v-if="activeAudio && activeAudio.item.id === item.id">
              <div class="h-full w-full bg-black">
                <AudioPlayer
                  :url="activeAudio.url"
                  :title="activeAudio.title"
                  mode="inline"
                  @close="closeAudio"
                />
              </div>
            </template>
            <template v-else>
              <div
                class="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700"
              >
                <MusicIcon class="h-10 w-10 text-gray-600 dark:text-gray-300" aria-hidden="true" />
              </div>
              <button
                type="button"
                class="absolute inset-0 grid place-items-center"
                aria-label="Play audio"
                @click="handleAudioClick(item, $event)"
              >
                <PlayIcon class="h-12 w-12 text-white/90 drop-shadow" aria-hidden="true" />
              </button>
              <span
                class="absolute top-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase"
              >
                {{ mediaFormat(item) }}
              </span>
            </template>
          </template>

          <template v-else>
            <span class="text-4xl font-medium text-gray-400 dark:text-gray-500">
              {{ getInitials(item[titleField]) }}
            </span>
            <span
              v-if="mediaFormat(item)"
              class="absolute top-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase"
            >
              {{ mediaFormat(item) }}
            </span>
          </template>
        </div>
        <div class="p-4">
          <h3 class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
            {{ item[titleField] }}
          </h3>
          <p v-if="config.descriptionField" class="text-xs text-gray-500 dark:text-gray-400">
            {{ item[config.descriptionField] }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="hasMore" class="flex flex-col items-center gap-2">
      <button
        class="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        @click="emit('load-more')"
      >
        Load more
      </button>
      <div
        ref="sentinelRef"
        class="flex h-8 w-full items-center justify-center text-xs text-gray-500 dark:text-gray-400"
        aria-hidden="true"
      >
        Loading more…
      </div>
    </div>
    <div v-else class="flex items-center justify-center py-6">
      <span
        class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/60 px-3 py-1 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-400"
      >
        <IconCloseCircle class="h-3.5 w-3.5" aria-hidden="true" />
        End of results
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SortDropdown from '@/components/molecules/SortDropdown.vue'
import PlayIcon from '~icons/mdi/play-circle-outline'
import MusicIcon from '~icons/mdi/music-note-outline'
import IconCloseCircle from '~icons/mdi/close-circle'
import type { DataArray, DataItem } from '@/types/common'
import Image from '@/components/molecules/Image.vue'
import VideoPlayer from '@/components/organisms/VideoPlayer.vue'
import AudioPlayer from '@/components/organisms/AudioPlayer.vue'

type Props = {
  data: DataArray
  config: {
    imageField?: string
    titleField?: string
    descriptionField?: string
  }
  hasMore?: boolean
  resourceName?: string
  uiConfig?: unknown
  loading?: boolean
}
const props = defineProps<Props>()
const route = useRoute()
const emit = defineEmits<{
  (e: 'item-click', item: unknown): void
  (e: 'load-more'): void
  (e: 'sort', field: string, direction: 'asc' | 'desc'): void
}>()

// Media preview helpers
const previewUrl = (item: DataItem): string | null => {
  const key = props.config?.imageField || 'thumbnailUrl'
  const value = item?.[key]
  if (!value) return null
  return String(value)
}
const isImage = (url: string): boolean => {
  const u = url.toLowerCase()
  return (
    u.endsWith('.png') ||
    u.endsWith('.jpg') ||
    u.endsWith('.jpeg') ||
    u.endsWith('.webp') ||
    u.endsWith('.gif') ||
    u.includes('image=')
  )
}

// Media helpers for kind/format/source selection
type MediaKind = 'image' | 'video' | 'audio' | 'other'
const imageExts = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif'])
const videoExts = new Set(['mp4', 'avi', 'mov', 'mkv', 'webm', 'm3u8', 'm3u'])
const audioExts = new Set(['mp3', 'wav', 'aac', 'flac'])

const getFileExtension = (url: string | undefined): string => {
  if (!url) return ''
  const u = url.split('?')[0]

  // Handle HLS streams specifically
  if (u.includes('.m3u8')) return 'm3u8'
  if (u.includes('.m3u')) return 'm3u'

  const last = u.split('.').pop() || ''
  return last.toLowerCase()
}

const mediaFormat = (item: DataItem): string => {
  const fmt = String(item?.format || '').toLowerCase()
  if (fmt) return fmt.toUpperCase()
  const url = String(item?.fileUrl || item?.url || previewUrl(item as DataItem) || '')
  const ext = getFileExtension(url)
  return ext ? ext.toUpperCase() : ''
}

const mediaKind = (value: string | null | undefined): MediaKind => {
  const raw = (value ?? '').trim()
  if (!raw) return 'other'
  const lower = raw.toLowerCase()

  // Handle MIME-like content type strings
  console.log('lower', lower)
  if (lower.startsWith('application/vnd.apple.mpegurl')) return 'video'
  if (lower.startsWith('image/')) return 'image'
  if (lower.startsWith('video/')) return 'video'
  if (lower.startsWith('audio/')) return 'audio'

  console.log('videoExts', videoExts)
  console.log('audioExts', audioExts)
  console.log('imageExts', imageExts)
  if (videoExts.has(lower)) return 'video'
  if (audioExts.has(lower)) return 'audio'
  if (imageExts.has(lower)) return 'image'

  // Handle explicit format or URLs by extension
  const ext = getFileExtension(lower)
  console.log('ext', ext)
  if (imageExts.has(ext)) return 'image'
  if (videoExts.has(ext)) return 'video'
  if (audioExts.has(ext)) return 'audio'
  return 'other'
}

const primaryMediaValue = (item: DataItem): string | null => {
  const ct = String(item?.contentType || '')
  if (ct) return ct
  const fmt = String(item?.format || '')
  if (fmt) return fmt
  const url = String(item?.fileUrl || item?.url || previewUrl(item as DataItem) || '')
  return url || null
}

const mediaSrc = (item: DataItem): string | null => {
  // Prefer explicit preview/thumbnail for images, else fileUrl
  const p = previewUrl(item)
  if (p && isImage(p)) return p
  const thumb = String(item?.thumbnailUrl || '')
  if (thumb) return thumb
  const file = String(item?.fileUrl || '')
  if (file && (isImage(file) || mediaKind(file) === 'image')) return file
  return null
}

const posterUrl = (item: DataItem): string | null => {
  const thumb = String(item?.thumbnailUrl || '')
  if (thumb) return thumb
  const p = previewUrl(item)
  if (p && isImage(p)) return p
  return null
}

const getInitials = (name: unknown) =>
  !name
    ? '?'
    : String(name)
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

// Video player state
const activeVideo = ref<{ item: DataItem; url: string; title: string; posterUrl?: string } | null>(
  null,
)

// Handle video item click
const handleVideoClick = (item: DataItem, event: Event) => {
  event.stopPropagation() // Prevent item-click emit

  const videoUrl = String(item?.fileUrl || item?.url || '')
  const title = String(item?.[titleField.value] || 'Video')
  const poster = posterUrl(item)

  if (videoUrl) {
    activeVideo.value = {
      item,
      url: videoUrl,
      title,
      posterUrl: poster || undefined,
    }
  }
}

// Close video player
const closeVideo = () => {
  activeVideo.value = null
}

// Audio player state
const activeAudio = ref<{ item: DataItem; url: string; title: string; posterUrl?: string } | null>(
  null,
)

// Handle audio item click
const handleAudioClick = (item: DataItem, event: Event) => {
  event.stopPropagation() // Prevent item-click emit

  const audioUrl = String(item?.fileUrl || item?.url || '')
  const title = String(item?.[titleField.value] || 'Audio')
  const poster = posterUrl(item)

  if (audioUrl) {
    activeAudio.value = {
      item,
      url: audioUrl,
      title,
      posterUrl: poster || undefined,
    }
  }
}

// Close audio player
const closeAudio = () => {
  activeAudio.value = null
}

const handleItemClick = (item: unknown) => {
  // Always emit item-click for detail view navigation
  // The play buttons use @click.stop to prevent this event when playing media
  emit('item-click', item)
}

// Sort functionality
type Dir = 'asc' | 'desc'
const titleField = computed<string>(() => props.config.titleField || 'title')
const sortValue = ref<string>(`${titleField.value}:asc`)
const totalCount = computed(() => (Array.isArray(props.data) ? props.data.length : 0))
const sortOptions = computed<{ key: string; label: string }[]>(() => {
  const options: { key: string; label: string }[] = []
  if (titleField.value) options.push({ key: titleField.value, label: 'Title' })
  if (props.config.descriptionField)
    options.push({ key: props.config.descriptionField, label: 'Description' })
  return options
})
const sortMenuItems = computed(() => {
  const items: { key: string; label: string }[] = []
  for (const opt of sortOptions.value) {
    items.push({ key: `${opt.key}:asc`, label: `${opt.label} (A→Z)` })
    items.push({ key: `${opt.key}:desc`, label: `${opt.label} (Z→A)` })
  }
  return items
})
function handleSortChange(newValue: string) {
  const [field, dir] = newValue.split(':')
  const d = (dir === 'desc' ? 'desc' : 'asc') as Dir
  emit('sort', field, d)
}

// Intersection observer for load more
const sentinelRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

function ensureObserver() {
  if (observer) return
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry && entry.isIntersecting && props.hasMore) {
        emit('load-more')
      }
    },
    { root: null, rootMargin: '0px', threshold: 0.1 },
  )
}

onMounted(() => {
  ensureObserver()
  if (observer && sentinelRef.value) observer.observe(sentinelRef.value)
  try {
    const initialSort = String(route.query.sort || '')
    if (initialSort && sortMenuItems.value.some((i) => i.key === initialSort)) {
      sortValue.value = initialSort
    }
  } catch {
    void 0
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})

watch(
  () => props.hasMore,
  (v) => {
    if (!observer) ensureObserver()
    if (observer) {
      observer.disconnect()
      if (v && sentinelRef.value) observer.observe(sentinelRef.value)
    }
  },
)

watch(
  () => route.query.sort,
  (nv) => {
    const val = String(nv || '')
    if (val && sortMenuItems.value.some((i) => i.key === val)) {
      sortValue.value = val
    }
  },
)
</script>
