<template>
  <div class="space-y-4">
    <!-- Calendar Header with Navigation -->
    <div
      class="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-gray-700 dark:bg-gray-900"
    >
      <div class="flex items-center justify-between sm:justify-start sm:gap-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ monthYearDisplay }}
        </h2>
        <div class="flex items-center gap-1">
          <IconButton
            size="sm"
            variant="ghost"
            aria-label="Previous month"
            @click="navigateMonth(-1)"
          >
            <IconChevronLeft class="h-4 w-4" />
          </IconButton>
          <Button size="sm" variant="ghost" @click="goToToday"> Today </Button>
          <IconButton size="sm" variant="ghost" aria-label="Next month" @click="navigateMonth(1)">
            <IconChevronRight class="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      <div class="flex items-center justify-between gap-2 sm:justify-end">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ totalEventsDisplay }}
        </div>
        <div class="flex items-center gap-1">
          <Button
            size="sm"
            :variant="currentView === 'month' ? 'primary' : 'ghost'"
            @click="setView('month')"
          >
            Month
          </Button>
          <Button
            size="sm"
            :variant="currentView === 'week' ? 'primary' : 'ghost'"
            @click="setView('week')"
            class="hidden sm:inline-flex"
          >
            Week
          </Button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-900"
    >
      <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
        <div
          class="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300"
        ></div>
        Loading calendar...
      </div>
    </div>

    <!-- Calendar Grid -->
    <div
      v-else
      class="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
    >
      <!-- Month View -->
      <div v-if="currentView === 'month'" class="overflow-hidden">
        <!-- Calendar Header -->
        <div
          class="grid grid-cols-7 border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
        >
          <div
            v-for="day in weekDays"
            :key="day"
            class="px-3 py-2 text-center text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
          >
            {{ day }}
          </div>
        </div>

        <!-- Calendar Body -->
        <div class="grid grid-cols-7">
          <div
            v-for="(day, index) in calendarDays"
            :key="`${day.date}-${index}`"
            class="relative min-h-[80px] border-r border-b border-gray-200 p-1 sm:min-h-[120px] sm:p-2 dark:border-gray-700"
            :class="{
              'bg-gray-50 dark:bg-gray-800': !day.isCurrentMonth,
              'bg-blue-50 dark:bg-blue-900/20': day.isToday,
            }"
          >
            <!-- Day Number -->
            <div class="mb-1 text-right">
              <span
                class="inline-flex h-5 w-5 items-center justify-center rounded-full text-xs sm:h-6 sm:w-6 sm:text-sm"
                :class="{
                  'bg-blue-600 text-white': day.isToday,
                  'text-gray-400 dark:text-gray-500': !day.isCurrentMonth,
                  'text-gray-900 dark:text-gray-100': day.isCurrentMonth && !day.isToday,
                }"
              >
                {{ day.dayNumber }}
              </span>
            </div>

            <!-- Events for this day -->
            <div class="space-y-0.5 sm:space-y-1">
              <div
                v-for="event in day.events.slice(0, mobileEventLimit)"
                :key="event.id"
                class="cursor-pointer rounded px-1 py-0.5 text-xs font-medium transition-colors hover:opacity-80 sm:px-2 sm:py-1"
                :class="getEventClasses(event)"
                :title="event.title"
                @click="handleEventClick(event)"
              >
                <div class="truncate">{{ event.title }}</div>
              </div>
              <div
                v-if="day.events.length > mobileEventLimit"
                class="text-xs text-gray-500 dark:text-gray-400"
              >
                +{{ day.events.length - mobileEventLimit }} more
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Week View -->
      <div v-else-if="currentView === 'week'" class="overflow-hidden">
        <!-- Week Header -->
        <div
          class="grid grid-cols-8 border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="px-3 py-2"></div>
          <div v-for="day in weekViewDays" :key="day.date" class="px-3 py-2 text-center">
            <div
              class="text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
            >
              {{ day.dayName }}
            </div>
            <div
              class="mt-1 text-lg font-semibold"
              :class="{
                'text-blue-600 dark:text-blue-400': day.isToday,
                'text-gray-900 dark:text-gray-100': !day.isToday,
              }"
            >
              {{ day.dayNumber }}
            </div>
          </div>
        </div>

        <!-- Week Body -->
        <div class="grid grid-cols-8">
          <!-- Time column -->
          <div class="border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <div
              v-for="hour in hours"
              :key="hour"
              class="h-16 border-b border-gray-200 px-2 py-1 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400"
            >
              {{ hour }}:00
            </div>
          </div>

          <!-- Day columns -->
          <div
            v-for="day in weekViewDays"
            :key="day.date"
            class="relative border-r border-gray-200 dark:border-gray-700"
          >
            <div
              v-for="hour in hours"
              :key="hour"
              class="h-16 border-b border-gray-200 dark:border-gray-700"
            ></div>

            <!-- Events for this day -->
            <div class="absolute inset-0 p-1">
              <div
                v-for="(event, eventIndex) in day.events"
                :key="event.id"
                class="absolute right-1 left-1 cursor-pointer rounded px-2 py-1 text-xs font-medium transition-colors hover:opacity-80"
                :class="getEventClasses(event)"
                :style="{ top: `${eventIndex * 20 + 4}px`, height: '16px' }"
                :title="event.title"
                @click="handleEventClick(event)"
              >
                <div class="truncate">{{ event.title }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && mappedEvents.length === 0"
      class="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-900"
    >
      <IconCalendar class="h-12 w-12 text-gray-400 dark:text-gray-500" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No events</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        No events found for the selected time period.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref, onMounted } from 'vue'
import { toDate, toISODate } from '@/utils/date'
import type { DataArray, DataItem } from '@/types/common'
import Button from '@/components/atoms/Button.vue'
import IconButton from '@/components/atoms/IconButton.vue'
import IconChevronLeft from '~icons/mdi/chevron-left'
import IconChevronRight from '~icons/mdi/chevron-right'
import IconCalendar from '~icons/mdi/calendar'

type Props = {
  data: DataArray
  config: {
    titleField?: string
    dateField?: string
    endDateField?: string
    colorField?: string
    descriptionField?: string
    actions?: unknown[]
  }
  resourceName?: string
  uiConfig?: unknown
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'action', action: string, item?: unknown): void
  (e: 'item-click', item: unknown): void
  (e: 'filters-change', payload: { from?: string; to?: string; preset?: string }): void
}>()

// Calendar state
const selectedDate = ref<Date>(new Date())
const currentView = ref<'month' | 'week'>('month')

// Computed values
const currentMonth = computed<number>(() => selectedDate.value.getMonth())
const currentYear = computed<number>(() => selectedDate.value.getFullYear())

const monthYearDisplay = computed(() => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return `${monthNames[currentMonth.value]} ${currentYear.value}`
})

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const hours = Array.from({ length: 24 }, (_, i) => i)

type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  color?: string
  description?: string
  __raw: DataItem
}

// Map data to calendar events
const mappedEvents = computed<CalendarEvent[]>(() => {
  const dateField = props.config.dateField || 'createdAt'
  const endField = props.config.endDateField || dateField
  const titleField = props.config.titleField || 'title'
  const colorField = props.config.colorField
  const descriptionField = props.config.descriptionField

  return (props.data || [])
    .map((item: DataItem, idx: number) => {
      const startD = toDate(item?.[dateField] as unknown)
      if (!startD) return null
      const endD = toDate(item?.[endField] as unknown) || startD

      return {
        id: String(item?.id ?? item?._id ?? idx),
        title: String(item?.[titleField] ?? 'Untitled'),
        start: startD,
        end: endD,
        color: colorField ? String(item?.[colorField] ?? '') : undefined,
        description: descriptionField ? String(item?.[descriptionField] ?? '') : undefined,
        __raw: item,
      }
    })
    .filter(Boolean) as CalendarEvent[]
})

const totalEventsDisplay = computed(() => {
  const count = mappedEvents.value.length
  return count === 1 ? '1 event' : `${count} events`
})

// Mobile-responsive event display limit
const mobileEventLimit = computed(() => {
  // Show fewer events on mobile to prevent overcrowding
  return window.innerWidth < 640 ? 1 : 3
})

// Calendar grid generation
const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const days = []
  const today = new Date()

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    const dayEvents = mappedEvents.value.filter((event) => {
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === date.toDateString()
    }) // Don't slice here, let the template handle display limits

    days.push({
      date: date.toISOString(),
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: date.toDateString() === today.toDateString(),
      events: dayEvents,
    })
  }

  return days
})

const weekViewDays = computed(() => {
  const startOfWeek = new Date(selectedDate.value)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

  const days = []
  const today = new Date()
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)

    const dayEvents = mappedEvents.value.filter((event) => {
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === date.toDateString()
    })

    days.push({
      date: date.toISOString(),
      dayNumber: date.getDate(),
      dayName: dayNames[date.getDay()],
      isToday: date.toDateString() === today.toDateString(),
      events: dayEvents,
    })
  }

  return days
})

// Event styling based on type/color
function getEventClasses(event: CalendarEvent): string {
  const baseClasses = 'text-white'

  // Color mapping for media types
  const colorMap: Record<string, string> = {
    dubbed: 'bg-blue-500',
    trailer: 'bg-purple-500',
    voice_over: 'bg-green-500',
    subtitle: 'bg-yellow-500',
    original: 'bg-red-500',
    behind_scenes: 'bg-indigo-500',
    interview: 'bg-pink-500',
    promo: 'bg-orange-500',
    recording: 'bg-teal-500',
    mixing: 'bg-cyan-500',
    master: 'bg-emerald-500',
    poster: 'bg-violet-500',
  }

  const colorClass = event.color ? colorMap[event.color] || 'bg-gray-500' : 'bg-gray-500'
  return `${baseClasses} ${colorClass}`
}

// Navigation methods
function navigateMonth(direction: number) {
  const newDate = new Date(selectedDate.value)
  newDate.setMonth(newDate.getMonth() + direction)
  selectedDate.value = newDate
  emitVisibleRange()
}

function goToToday() {
  selectedDate.value = new Date()
  emitVisibleRange()
}

function setView(view: 'month' | 'week') {
  currentView.value = view
}

// Event handlers
function handleEventClick(event: CalendarEvent) {
  emit('item-click', event.__raw)
}

function emitVisibleRange() {
  if (currentView.value === 'month') {
    const start = new Date(currentYear.value, currentMonth.value, 1)
    const end = new Date(currentYear.value, currentMonth.value + 1, 0)
    emit('filters-change', {
      preset: 'custom',
      from: toISODate(start),
      to: toISODate(end),
    })
  } else {
    // Week view
    const startOfWeek = new Date(selectedDate.value)
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    emit('filters-change', {
      preset: 'custom',
      from: toISODate(startOfWeek),
      to: toISODate(endOfWeek),
    })
  }
}

// Watch for view changes to update filters
watch(currentView, () => {
  emitVisibleRange()
})

// Initial setup
onMounted(() => {
  emitVisibleRange()
})
</script>
