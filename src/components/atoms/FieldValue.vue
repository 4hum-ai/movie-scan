<template>
  <span
    v-if="displayKind === 'text'"
    :class="['text-sm text-gray-900 dark:text-gray-100', referenceClasses]"
    @click="handleReferenceClick"
    >{{ textValue }}</span
  >
  <span v-else-if="displayKind === 'boolean'" class="text-sm text-gray-900 dark:text-gray-100">{{
    value ? 'Yes' : 'No'
  }}</span>
  <span v-else-if="displayKind === 'date'" class="text-sm text-gray-900 dark:text-gray-100">{{
    dateValue
  }}</span>
  <span v-else-if="displayKind === 'number'" class="text-sm text-gray-900 dark:text-gray-100">{{
    numberValue
  }}</span>
  <span v-else-if="displayKind === 'currency'" class="text-sm text-gray-900 dark:text-gray-100">{{
    currencyValue
  }}</span>
  <span v-else-if="displayKind === 'rating'" class="text-sm text-gray-900 dark:text-gray-100">{{
    ratingValue
  }}</span>
  <span
    v-else-if="displayKind === 'badge'"
    :class="['inline-flex items-center rounded px-2 py-0.5 text-xs font-medium', badgeClass]"
    >{{ textValue }}</span
  >
  <span v-else-if="displayKind === 'status'" class="inline-flex items-center gap-2">
    <span :class="['h-2 w-2 rounded-full', statusDotClass]" />
    <span :class="['rounded px-2 py-0.5 text-xs font-medium', statusBadgeClass]">{{
      textValue
    }}</span>
  </span>
  <span v-else-if="displayKind === 'color'" class="inline-flex items-center gap-2">
    <span
      class="inline-block h-4 w-4 rounded border border-gray-300 dark:border-gray-700"
      :style="{ backgroundColor: String(value || '#ffffff') }"
    />
    <span class="text-sm text-gray-900 dark:text-gray-100">{{ textValue }}</span>
  </span>
  <span v-else-if="displayKind === 'url'" class="inline-flex items-center gap-2 text-sm">
    <a
      :href="normalizedHref"
      target="_blank"
      rel="noopener noreferrer"
      class="text-primary-600 dark:text-primary-400 break-all hover:underline"
      >{{ String(value) }}</a
    >
    <button
      type="button"
      class="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
      aria-label="Copy URL"
      @click="copy(String(value))"
    >
      ⧉
    </button>
  </span>
  <span v-else-if="displayKind === 'email'" class="inline-flex items-center gap-2 text-sm">
    <a
      :href="`mailto:${String(value)}`"
      class="text-primary-600 dark:text-primary-400 break-words hover:underline"
      >{{ String(value) }}</a
    >
    <button
      type="button"
      class="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
      aria-label="Copy email"
      @click="copy(String(value))"
    >
      ⧉
    </button>
  </span>
  <span v-else-if="displayKind === 'phone'" class="inline-flex items-center gap-2 text-sm">
    <a
      :href="`tel:${String(value)}`"
      class="text-primary-600 dark:text-primary-400 break-words hover:underline"
      >{{ String(value) }}</a
    >
    <button
      type="button"
      class="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
      aria-label="Copy phone"
      @click="copy(String(value))"
    >
      ⧉
    </button>
  </span>
  <div v-else-if="displayKind === 'array'" class="w-full text-sm text-gray-900 dark:text-gray-100">
    <div v-if="Array.isArray(value) && value.length > 0" class="w-full">
      <!-- Check if all items are objects with similar structure -->
      <div v-if="isArrayOfObjects(value)" class="w-full overflow-x-auto">
        <table class="w-full min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                v-for="key in getObjectKeys(value)"
                :key="key"
                class="px-3 py-2 text-left text-xs font-medium tracking-wider break-words whitespace-normal text-gray-500 uppercase dark:text-gray-400"
              >
                {{ formatKey(key) }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            <tr
              v-for="(item, index) in value"
              :key="index"
              class="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td
                v-for="key in getObjectKeys(value)"
                :key="key"
                class="px-3 py-2 text-sm break-words"
              >
                <span
                  v-if="item[key] !== null && item[key] !== undefined"
                  class="whitespace-normal"
                >
                  {{ formatTableValue(item[key]) }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Fallback for mixed arrays or simple arrays -->
      <div v-else class="space-y-2">
        <div v-for="(item, index) in value" :key="index" class="border-l-2 border-gray-200 pl-3">
          <div v-if="typeof item === 'object' && item !== null" class="space-y-1">
            <div v-for="(val, key) in item" :key="key" class="flex flex-col">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400"
                >{{ formatKey(String(key)) }}:</span
              >
              <span class="text-sm">{{ formatObjectValue(val) }}</span>
            </div>
          </div>
          <span v-else>{{ item }}</span>
        </div>
      </div>
    </div>
    <span v-else>{{ textValue }}</span>
  </div>
  <div
    v-else-if="displayKind === 'object'"
    class="col-span-full text-sm text-gray-900 dark:text-gray-100"
  >
    <div v-if="typeof value === 'object' && value !== null" class="relative">
      <!-- Toggle button -->
      <button
        type="button"
        class="absolute -top-1 right-0 z-10 rounded p-1 text-xs text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        :title="isRawView ? 'Switch to formatted view' : 'Switch to raw JSON view'"
        @click="toggleObjectView"
      >
        <IconFormatListBulleted v-if="isRawView" class="h-3 w-3" />
        <IconCodeBraces v-else class="h-3 w-3" />
      </button>

      <!-- Formatted view (key-value pairs) -->
      <Transition name="object-view" mode="out-in">
        <div v-if="!isRawView" key="formatted" class="space-y-1 pr-8">
          <div v-for="(val, key) in value" :key="key" class="flex flex-col">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400"
              >{{ formatKey(String(key)) }}:</span
            >
            <span class="text-sm">{{ formatObjectValue(val) }}</span>
          </div>
        </div>

        <!-- Raw JSON view -->
        <div v-else key="raw" class="pr-8">
          <pre
            class="rounded bg-gray-50 p-2 font-mono text-xs break-words whitespace-pre-wrap text-gray-800 dark:bg-gray-800 dark:text-gray-200"
            >{{ formattedJson }}</pre
          >
        </div>
      </Transition>
    </div>
    <span v-else>{{ objectValue }}</span>
  </div>
  <span v-else-if="displayKind === 'image'" class="inline-flex items-center">
    <Image
      :src="String(value)"
      alt="Image"
      :width="40"
      :height="40"
      preset="thumbnail"
      :class="imageClasses"
    />
  </span>
  <span v-else-if="displayKind === 'video'" class="inline-flex w-full items-center">
    <VideoPlayer :url="String(value)" :title="String(value)" mode="inline" />
  </span>
  <span v-else-if="displayKind === 'audio'" class="inline-flex w-full items-center">
    <AudioPlayer
      :url="String(value)"
      :title="String(value)"
      mode="inline"
      :autoplay="false"
      :loop="false"
    />
  </span>
  <span v-else-if="displayKind === 'country'" class="inline-flex items-center gap-2">
    <span v-if="country.code" class="shrink-0">
      <picture>
        <source :srcset="`https://flagcdn.com/${country.code}.svg`" type="image/svg+xml" />
        <Image
          :src="`https://flagcdn.com/24x18/${country.code}.png`"
          alt=""
          :width="24"
          :height="18"
          class="rounded-sm"
        />
      </picture>
    </span>
    <span class="text-sm text-gray-900 dark:text-gray-100">{{ country.name || textValue }}</span>
  </span>

  <!-- NEW: Language display -->
  <span v-else-if="displayKind === 'language'" class="inline-flex items-center">
    <LanguageDisplay :value="String(value)" :show-code="true" size="sm" />
  </span>

  <!-- NEW: Percentage display -->
  <span v-else-if="displayKind === 'percentage'" class="text-sm text-gray-900 dark:text-gray-100">
    {{ percentageValue }}
  </span>

  <!-- NEW: Progress display -->
  <span v-else-if="displayKind === 'progress'" class="inline-flex items-center gap-2">
    <ProgressIndicator :value="Number(value)" size="sm" :show-label="true" />
  </span>

  <!-- NEW: Duration display -->
  <span v-else-if="displayKind === 'duration'" class="text-sm text-gray-900 dark:text-gray-100">
    {{ durationValue }}
  </span>

  <!-- NEW: File size display -->
  <span v-else-if="displayKind === 'fileSize'" class="text-sm text-gray-900 dark:text-gray-100">
    {{ fileSizeValue }}
  </span>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Image from '@/components/molecules/Image.vue'
import LanguageDisplay from './LanguageDisplay.vue'
import ProgressIndicator from '@/components/molecules/ProgressIndicator.vue'
import VideoPlayer from '@/components/organisms/VideoPlayer.vue'
import AudioPlayer from '@/components/organisms/AudioPlayer.vue'
import { getCountryByAny } from '@/utils/countries'
import IconFormatListBulleted from '~icons/mdi/format-list-bulleted'
import IconCodeBraces from '~icons/mdi/code-braces'

interface Props {
  value: unknown
  type?:
    | 'text'
    | 'number'
    | 'date'
    | 'boolean'
    | 'image'
    | 'video'
    | 'audio'
    | 'url'
    | 'array'
    | 'object'
    | 'color'
    | 'ref'
  formatter?:
    | 'rating'
    | 'status'
    | 'date'
    | 'currency'
    | 'badge'
    | 'country'
    | 'number'
    | 'language'
    | 'percentage'
    | 'progress'
    | 'duration'
    | 'fileSize'
    | 'audio'
    | 'video'
  currencyCode?: string
  fieldKey?: string
  /** The resource type this field references (only used when type is 'ref') */
  refTo?: string
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  'reference-click': [referenceType: string, referenceId: string]
}>()

// Object view toggle state
const isRawView = ref(false)

const toggleObjectView = () => {
  isRawView.value = !isRawView.value
}

// Formatted JSON for raw view
const formattedJson = computed(() => {
  try {
    return JSON.stringify(props.value, null, 2)
  } catch {
    return String(props.value)
  }
})

const displayKind = computed(() => {
  // Handle ref type - it displays as text but with reference behavior
  if (props.type === 'ref') {
    return 'text'
  }

  // If type is explicitly set, use it (except for 'url' which needs detection)
  // Type takes precedence over formatter for structural data types
  if (props.type && props.type !== 'url') {
    return props.type
  }

  // Formatter only applies when no explicit type is set
  if (props.formatter) {
    if (props.formatter === 'number') return 'number'
    return props.formatter
  }

  // Heuristics for email/phone based on key/name and value shape
  const key = (props.fieldKey || '').toLowerCase()
  const val = String(props.value || '')
  const looksEmail = /@/.test(val) || key.includes('email')
  const looksPhone = key.includes('phone') || /^\+?[0-9()\-\s]{7,}$/.test(val)
  if (looksEmail) return 'email'
  if (looksPhone) return 'phone'

  // Media type detection based on file extensions and URLs
  const v = String(props.value || '').toLowerCase()

  // Video detection
  if (
    v.endsWith('.mp4') ||
    v.endsWith('.webm') ||
    v.endsWith('.mov') ||
    v.endsWith('.avi') ||
    v.endsWith('.mkv') ||
    v.endsWith('.m4v') ||
    v.endsWith('.3gp') ||
    v.endsWith('.flv') ||
    v.includes('video=') ||
    v.includes('.m3u8') ||
    v.includes('youtube.com') ||
    v.includes('youtu.be') ||
    v.includes('vimeo.com')
  )
    return 'video'

  // Audio detection
  if (
    v.endsWith('.mp3') ||
    v.endsWith('.wav') ||
    v.endsWith('.aac') ||
    v.endsWith('.flac') ||
    v.endsWith('.ogg') ||
    v.endsWith('.m4a') ||
    v.endsWith('.wma') ||
    v.includes('audio=') ||
    v.includes('soundcloud.com') ||
    v.includes('spotify.com')
  )
    return 'audio'

  // Image detection
  if (
    v.endsWith('.jpg') ||
    v.endsWith('.jpeg') ||
    v.endsWith('.png') ||
    v.endsWith('.webp') ||
    v.endsWith('.gif') ||
    v.endsWith('.svg') ||
    v.endsWith('.bmp') ||
    v.endsWith('.tiff') ||
    v.endsWith('.ico') ||
    v.includes('image=') ||
    v.includes('imgur.com') ||
    v.includes('unsplash.com') ||
    v.includes('pixabay.com')
  )
    return 'image'

  // If type is 'url' but no media detected, show as URL
  if (props.type === 'url') {
    return 'url'
  }

  return 'text'
})

// Computed property for image classes
const imageClasses = computed(() => {
  const baseClasses = 'h-10 w-10 rounded bg-gray-100 object-cover dark:bg-gray-800'
  return baseClasses
})

const textValue = computed(() => {
  const v = props.value
  if (v === null || v === undefined || v === '') return '-'

  // Handle arrays specially to avoid [object Object]
  if (Array.isArray(v)) {
    return v
      .map((item) =>
        typeof item === 'object' && item !== null ? JSON.stringify(item) : String(item),
      )
      .join(', ')
  }

  // Handle objects specially
  if (typeof v === 'object' && v !== null) {
    try {
      return JSON.stringify(v)
    } catch {
      return String(v)
    }
  }

  return String(v)
})

type FirestoreTimestampLike = {
  _seconds?: number
  _nanoseconds?: number
  seconds?: number
  nanoseconds?: number
}

const toDate = (v: unknown): Date | null => {
  if (v instanceof Date) return v
  if (typeof v === 'string' || typeof v === 'number') {
    const d = new Date(v)
    return isNaN(d.getTime()) ? null : d
  }
  if (v && typeof v === 'object') {
    const ts = v as FirestoreTimestampLike
    const seconds = ts._seconds ?? ts.seconds
    const nanos = ts._nanoseconds ?? ts.nanoseconds ?? 0
    if (typeof seconds === 'number') {
      const ms = seconds * 1000 + Math.floor(nanos / 1e6)
      const d = new Date(ms)
      return isNaN(d.getTime()) ? null : d
    }
  }
  return null
}

const dateValue = computed(() => {
  const d = toDate(props.value)
  if (!d) return '-'
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
})

const numberValue = computed(() => {
  const raw = props.value
  const n = typeof raw === 'string' ? parseFloat(raw) : typeof raw === 'number' ? raw : Number.NaN
  if (!Number.isFinite(n)) return '-'
  return new Intl.NumberFormat('en-US').format(n)
})

const currencyValue = computed(() => {
  const raw = props.value
  const n = typeof raw === 'string' ? parseFloat(raw) : typeof raw === 'number' ? raw : Number.NaN
  if (!Number.isFinite(n)) return '-'
  const code = props.currencyCode || 'USD'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
})

const ratingValue = computed(() => {
  const raw = props.value
  const n = typeof raw === 'string' ? parseFloat(raw) : typeof raw === 'number' ? raw : Number.NaN
  if (!Number.isFinite(n)) return '-'
  return `${n.toFixed(1)} / 5`
})

const badgeClass = computed(() => {
  const v = String(props.value || '').toLowerCase()
  if (['active', 'success', 'paid', 'publisher', 'large', 'enterprise'].includes(v))
    return 'bg-green-100 text-green-800'
  if (['pending', 'warning', 'medium'].includes(v)) return 'bg-yellow-100 text-yellow-800'
  if (['inactive', 'secondary', 'small', 'startup'].includes(v)) return 'bg-gray-100 text-gray-800'
  if (['suspended', 'error', 'failed'].includes(v)) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
})

const statusDotClass = computed(() => {
  const v = String(props.value || '').toLowerCase()
  if (['active', 'success', 'paid', 'online'].includes(v)) return 'bg-green-500'
  if (['pending', 'warning'].includes(v)) return 'bg-yellow-500'
  if (['inactive', 'offline'].includes(v)) return 'bg-gray-400'
  if (['suspended', 'error', 'failed'].includes(v)) return 'bg-red-500'
  return 'bg-gray-400'
})

const statusBadgeClass = computed(() => {
  const v = String(props.value || '').toLowerCase()
  if (['active', 'success', 'paid', 'online'].includes(v))
    return 'bg-green-50 text-green-700 border border-green-200'
  if (['pending', 'warning'].includes(v))
    return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
  if (['inactive', 'offline'].includes(v)) return 'bg-gray-50 text-gray-700 border border-gray-200'
  if (['suspended', 'error', 'failed'].includes(v))
    return 'bg-red-50 text-red-700 border border-red-200'
  return 'bg-gray-50 text-gray-700 border border-gray-200'
})

const country = computed(() => {
  const raw = props.value
  if (!raw) return { code: '', name: '' }
  const val = String(raw).trim()
  const match = getCountryByAny(val)
  if (match) return { code: match.code.toLowerCase(), name: match.name }
  // Fallback: if val looks like 2-letter code
  if (val.length === 2) return { code: val.toLowerCase(), name: val }
  return { code: '', name: val }
})

const objectValue = computed(() => {
  try {
    return JSON.stringify(props.value)
  } catch {
    return String(props.value)
  }
})

// Helper function to format object keys
const formatKey = (key: string): string => {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (s) => s.toUpperCase())
}

// Helper function to format object values
const formatObjectValue = (value: unknown): string => {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'string') return value
  if (typeof value === 'number') return value.toString()
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'object' ? JSON.stringify(item) : String(item)))
      .join(', ')
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

// Helper function to check if array contains objects with similar structure
const isArrayOfObjects = (arr: unknown[]): boolean => {
  if (arr.length === 0) return false

  // Check if all items are objects
  const allObjects = arr.every((item) => typeof item === 'object' && item !== null)
  if (!allObjects) return false

  // Check if objects have similar keys (at least 50% overlap)
  const firstKeys = Object.keys(arr[0] as Record<string, unknown>)
  if (firstKeys.length === 0) return false

  const similarStructure = arr.every((item) => {
    const itemKeys = Object.keys(item as Record<string, unknown>)
    const overlap = firstKeys.filter((key) => itemKeys.includes(key)).length
    return overlap >= Math.ceil(firstKeys.length * 0.5)
  })

  return similarStructure
}

// Helper function to get all unique keys from array of objects
const getObjectKeys = (arr: unknown[]): string[] => {
  const allKeys = new Set<string>()
  arr.forEach((item) => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item as Record<string, unknown>).forEach((key) => allKeys.add(key))
    }
  })
  return Array.from(allKeys)
}

// Helper function to format values for table display
const formatTableValue = (value: unknown): string => {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'string') {
    // Don't truncate strings in table - let CSS handle overflow
    return value
  }
  if (typeof value === 'number') return value.toString()
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (Array.isArray(value)) {
    if (value.length === 0) return 'Empty'

    // Show raw JSON for all arrays
    try {
      return JSON.stringify(value)
    } catch {
      return `${value.length} items`
    }
  }
  if (typeof value === 'object') {
    return 'Object'
  }
  return String(value)
}

// NEW: Percentage value computation
const percentageValue = computed(() => {
  const raw = props.value
  const n = typeof raw === 'string' ? parseFloat(raw) : typeof raw === 'number' ? raw : Number.NaN
  if (!Number.isFinite(n)) return '-'
  return `${n.toFixed(1)}%`
})

// NEW: Duration value computation
const durationValue = computed(() => {
  const raw = props.value
  const n = typeof raw === 'string' ? parseFloat(raw) : typeof raw === 'number' ? raw : Number.NaN
  if (!Number.isFinite(n)) return '-'

  const hours = Math.floor(n / 3600)
  const minutes = Math.floor((n % 3600) / 60)
  const seconds = Math.floor(n % 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
})

// NEW: File size value computation
const fileSizeValue = computed(() => {
  const raw = props.value
  const n = typeof raw === 'string' ? parseFloat(raw) : typeof raw === 'number' ? raw : Number.NaN
  if (!Number.isFinite(n)) return '-'

  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  if (n === 0) return '0 B'

  const i = Math.floor(Math.log(n) / Math.log(1024))
  const size = n / Math.pow(1024, i)

  return `${size.toFixed(1)} ${sizes[i]}`
})

const normalizedHref = computed(() => {
  const raw = String(props.value || '')
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw
  return `https://${raw}`
})

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    void 0
  }
}

// Handle reference clicks
const handleReferenceClick = () => {
  if (props.type === 'ref' && props.refTo) {
    const referenceId = String(props.value || '')
    if (referenceId) {
      emit('reference-click', props.refTo, referenceId)
    }
  }
}

// Computed class for clickable references
const referenceClasses = computed(() => {
  if (props.type === 'ref' && props.refTo) {
    return 'cursor-pointer text-primary-600 hover:text-primary-800 hover:underline dark:text-primary-400 dark:hover:text-primary-200'
  }
  return ''
})
</script>

<style scoped>
/* Object view transition */
.object-view-enter-active,
.object-view-leave-active {
  transition: opacity 0.15s ease-in-out;
}

.object-view-enter-from,
.object-view-leave-to {
  opacity: 0;
}
</style>
