<template>
  <div class="rounded-lg border bg-white p-6 shadow-sm">
    <h2 class="mb-4 text-lg font-semibold text-gray-900">Rating Information</h2>
    <div class="space-y-6">
      <div class="space-y-2">
        <div>
          <span class="text-sm font-medium text-gray-700">Rating System:</span>
          <span class="ml-2 text-sm text-gray-900">{{ ratingSystem?.name || 'Unknown' }}</span>
        </div>
        <div v-if="ratingSystem?.references && ratingSystem.references.length > 0">
          <span class="text-sm font-medium text-gray-700">References:</span>
          <div class="mt-1 space-y-1">
            <div
              v-for="(ref, index) in ratingSystem.references"
              :key="index"
              class="flex items-center"
            >
              <a
                v-if="ref.url"
                :href="ref.url"
                target="_blank"
                class="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                {{ ref.title }}
                <span v-if="ref.source" class="text-gray-500"> ({{ ref.source }})</span>
              </a>
              <span v-else class="text-xs text-gray-500">
                {{ ref.title }}
                <span v-if="ref.source" class="text-gray-400"> ({{ ref.source }})</span>
              </span>
            </div>
          </div>
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
import { useReportDetail } from '@/composables'
import type { RatingSystemItem } from '@/composables'

interface Props {
  ratingSystem?: RatingSystemItem | null
  selectedKey?: string | null
}

const props = defineProps<Props>()
const { getRatingColorClass } = useReportDetail()

const selectedKey = computed(() => props.selectedKey || null)
</script>
