<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
    <div
      v-for="column in config.columns"
      :key="column.value"
      :ref="(el) => setColumnRef(column.value, el as HTMLElement)"
      class="min-h-[300px] rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
    >
      <div
        class="mb-4 flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700"
      >
        <div class="flex items-center space-x-2">
          <div
            class="h-3 w-3 rounded-full"
            :style="{ backgroundColor: column.color || '#6b7280' }"
          />
          <h3 class="font-medium text-gray-900 dark:text-gray-100">
            {{ column.label }}
          </h3>
        </div>
        <span
          class="rounded-full bg-white px-2 py-1 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400"
          >{{ getKanbanCount(column.value) }}</span
        >
      </div>
      <div class="space-y-3">
        <template v-for="item in getKanbanItems(column.value)" :key="item.id">
          <div
            :ref="(el) => setCardRef(item.id, el as HTMLElement)"
            class="cursor-grab touch-none rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 will-change-transform select-none hover:shadow-md active:cursor-grabbing dark:border-gray-700 dark:bg-gray-800"
            :class="{ 'z-50 shadow-lg': draggingItemId === item.id }"
            :style="getCardStyle(item.id)"
            @click="handleItemClick(item)"
          >
            <div class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ item[config.cardTitleField] }}
            </div>
            <div
              v-if="config.cardDescriptionField"
              class="text-xs text-gray-500 dark:text-gray-400"
            >
              {{ item[config.cardDescriptionField] }}
            </div>
          </div>
          <div v-if="draggingItemId === item.id" :style="getPlaceholderStyle(item.id)" />
        </template>
        <div
          v-if="getKanbanItems(column.value).length === 0"
          class="py-8 text-center text-sm text-gray-400 dark:text-gray-500"
        >
          No items
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, unref } from 'vue'
import type { CSSProperties, StyleValue, Ref } from 'vue'
import { useDraggable } from '@vueuse/core'
import type { DataArray, DataItem } from '@/types/common'
import type { KanbanViewConfig } from '@/types/ui-config'

interface Props {
  data: DataArray
  config: KanbanViewConfig
  resourceName?: string
  uiConfig?: unknown
  loading?: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'item-click', item: unknown): void
  (e: 'status-change', payload: { item: DataItem; from: string; to: string }): void
}>()

const items = ref<DataItem[]>([])
watch(
  () => props.data,
  (newData) => {
    items.value = Array.isArray(newData) ? newData.map((d) => ({ ...d })) : []
  },
  { immediate: true },
)

const getKanbanCount = (columnValue: string) =>
  items.value.filter((item) => item[props.config.groupByField] === columnValue).length
const getKanbanItems = (columnValue: string) =>
  items.value.filter((item) => item[props.config.groupByField] === columnValue)

const handleItemClick = (item: unknown) => {
  const itemId = (item as DataItem)?.id
  console.log('🖱️ Card clicked:', { itemId, draggingItemId: draggingItemId.value })

  // Don't handle click if we're currently dragging
  if (draggingItemId.value) {
    console.log('❌ Click blocked: currently dragging')
    return
  }

  // Check if this item has active drag detection (movement in progress)
  if (itemId && clickDetection[itemId]?.hasMoved) {
    console.log('❌ Click blocked: item has moved (drag detected)')
    // Clean up the detection state since drag is complete
    delete clickDetection[itemId]
    return
  }

  // Clean up any stale click detection for this item
  if (itemId && clickDetection[itemId]) {
    console.log('🧹 Cleaning up stale click detection for item:', itemId)
    delete clickDetection[itemId]
  }

  console.log('✅ Emitting item-click event for item:', itemId)
  emit('item-click', item)
}

// Drag and drop functionality
const columnRefs = reactive<Record<string, HTMLElement | null>>({})
const setColumnRef = (value: string, el: HTMLElement | null) => {
  columnRefs[value] = el
}

const cardElRefs = reactive<Record<string, { el: HTMLElement | null }>>({})
const draggableMap = new Map<string, ReturnType<typeof useDraggable>>()
const cardStyleRefs = reactive<Record<string, StyleValue | Ref<StyleValue> | undefined>>({})
const baseDragStyleRefs = reactive<Record<string, CSSProperties | undefined>>({})
const draggingItemId = ref<string | null>(null)
const lastPointer = ref<{ x: number; y: number } | null>(null)
const dragMeta = reactive<Record<string, { width: number; height: number }>>({})

// Click vs Drag detection
const clickDetection = reactive<
  Record<
    string,
    {
      startTime: number
      startX: number
      startY: number
      hasMoved: boolean
    }
  >
>({})
const CLICK_TIME_THRESHOLD = 200 // milliseconds
const CLICK_MOVEMENT_THRESHOLD = 5 // pixels

const setCardRef = (id: string | undefined, el: HTMLElement | null) => {
  if (!id) return
  if (!cardElRefs[id]) cardElRefs[id] = { el: null }
  cardElRefs[id].el = el
  if (el && !draggableMap.has(id)) {
    const targetRef = ref<HTMLElement | null>(el)
    const instance = useDraggable(targetRef, {
      preventDefault: false, // Allow click events initially
      pointerTypes: ['mouse', 'touch', 'pen'],
      onStart: (position) => {
        console.log('🎯 Drag onStart for item:', id)
        // Initialize click detection
        clickDetection[id] = {
          startTime: Date.now(),
          startX: position.x,
          startY: position.y,
          hasMoved: false,
        }

        const rect = el.getBoundingClientRect()
        dragMeta[id] = { width: rect.width, height: rect.height }
        baseDragStyleRefs[id] = {
          position: 'fixed',
          left: `${rect.left}px`,
          top: `${rect.top}px`,
          width: `${rect.width}px`,
          pointerEvents: 'none',
        } as CSSProperties
      },
      onMove: (position, ev: PointerEvent | MouseEvent | TouchEvent) => {
        const detection = clickDetection[id]
        if (detection && !detection.hasMoved) {
          const deltaX = position.x - detection.startX
          const deltaY = position.y - detection.startY
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

          if (distance > CLICK_MOVEMENT_THRESHOLD) {
            detection.hasMoved = true
            draggingItemId.value = id
            // Now prevent default behavior for actual drag
            if (ev.preventDefault) ev.preventDefault()
          }
        }

        if ('clientX' in ev && 'clientY' in ev) {
          lastPointer.value = {
            x: (ev as PointerEvent).clientX,
            y: (ev as PointerEvent).clientY,
          }
        }
      },
      onEnd: () => {
        const detection = clickDetection[id]
        const duration = Date.now() - (detection?.startTime || 0)
        console.log('🏁 Drag onEnd for item:', id, { duration, hasMoved: detection?.hasMoved })

        // Check if this was a click (short duration, minimal movement)
        if (detection && !detection.hasMoved && duration < CLICK_TIME_THRESHOLD) {
          console.log('👆 Detected as click, cleaning up and allowing click handler')
          // This was a click, let the click handler deal with it
          // Clean up immediately to prevent interference
          delete clickDetection[id]
          baseDragStyleRefs[id] = undefined
          draggingItemId.value = null
          return
        }

        // This was a drag operation
        if (detection?.hasMoved) {
          console.log('🚚 Detected as drag, handling drop')
          handleDropFromDraggable(id)
        }

        // Always clean up detection state
        console.log('🧹 Cleaning up drag state for item:', id)
        delete clickDetection[id]
        baseDragStyleRefs[id] = undefined
        draggingItemId.value = null
      },
    })
    draggableMap.set(id, instance)
    cardStyleRefs[id] = instance.style as unknown as Ref<StyleValue>
  }
}

const getPlaceholderStyle = (id: string) => {
  const meta = dragMeta[id]
  if (!meta) return {}
  return { height: `${meta.height}px` }
}

const handleDropFromDraggable = (id: string) => {
  const item = items.value.find((i) => i.id === id)
  const groupBy = props.config.groupByField
  if (!item) return
  let cx: number | null = lastPointer.value?.x ?? null
  let cy: number | null = lastPointer.value?.y ?? null
  if (cx == null || cy == null) {
    const cardEl = cardElRefs[id]?.el
    if (cardEl) {
      const rect = cardEl.getBoundingClientRect()
      cx = rect.left + rect.width / 2
      cy = rect.top + rect.height / 2
    }
  }
  const inst = draggableMap.get(id)
  if (inst) {
    inst.x.value = 0
    inst.y.value = 0
  }
  if (cx == null || cy == null) {
    draggingItemId.value = null
    return
  }
  let targetColumnValue: string | null = null
  for (const [value, el] of Object.entries(columnRefs)) {
    if (!el) continue
    const r = el.getBoundingClientRect()
    if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) {
      targetColumnValue = value
      break
    }
  }
  const from = String(item[groupBy])
  const to = targetColumnValue != null ? String(targetColumnValue) : from
  if (!targetColumnValue || from === to) {
    draggingItemId.value = null
    return
  }
  const idx = items.value.findIndex((i) => i.id === id)
  if (idx !== -1) items.value[idx] = { ...items.value[idx], [groupBy]: to }
  emit('status-change', { item: { ...item }, from, to })
  draggingItemId.value = null
}

function getCardStyle(id: string | undefined): StyleValue[] {
  if (!id) return []
  const base = baseDragStyleRefs[id] || {}
  const card = (unref(cardStyleRefs[id]) as StyleValue | undefined) || {}
  return [base, card]
}
</script>
