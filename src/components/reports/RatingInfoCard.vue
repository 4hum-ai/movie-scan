<template>
  <div class="rounded-lg border bg-white p-6 shadow-sm">
    <h2 class="mb-4 text-lg font-semibold text-gray-900">Rating Information</h2>
    <div class="space-y-6">
      <div class="space-y-2">
        <div>
          <span class="text-sm font-medium text-gray-700">Rating System:</span>
          <span class="ml-2 text-sm text-gray-900">{{ ratingSystem?.name || 'Unknown' }}</span>
        </div>
        <div v-if="reference">
          <span class="text-sm font-medium text-gray-700">Reference:</span>
          <a
            v-if="reference.url"
            :href="reference.url"
            target="_blank"
            class="ml-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
          >
            {{ reference.title }}
          </a>
          <span v-else class="ml-2 text-xs text-gray-500">{{ reference.title }}</span>
        </div>
      </div>

      <div>
        <div class="mb-3">
          <span class="text-sm font-medium text-gray-700">Suggested Ratings:</span>
        </div>
        <div v-if="ratingSystem?.levels" class="flex flex-wrap gap-3">
          <div v-for="level in ratingSystem.levels" :key="level.key" class="relative">
            <div
              class="flex items-center space-x-2 rounded-lg border-2 px-4 py-3 transition-all duration-200"
              :class="
                selectedKey === level.key
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
              "
            >
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                :class="
                  selectedKey === level.key
                    ? 'bg-blue-600 text-white'
                    : getRatingColorClass(level.key)
                "
              >
                {{ level.key }}
              </div>
              <div v-if="selectedKey === level.key" class="flex flex-col">
                <span class="text-sm font-medium text-blue-900">{{ level.title }}</span>
                <span class="text-xs text-blue-700">{{ level.description }}</span>
              </div>
              <div
                v-if="selectedKey === level.key"
                class="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white shadow-lg"
                title="Suggested Rating"
              >
                ✓
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useReportDetail, type RatingSystemData } from '@/composables/useReportDetail'

interface Props {
  ratingSystem?: RatingSystemData | null
  selectedKey?: string | null
}

const props = defineProps<Props>()
const { getRatingColorClass } = useReportDetail()

const reference = computed(() => props.ratingSystem?.references?.[0] || null)
const selectedKey = computed(() => props.selectedKey || null)
</script>
