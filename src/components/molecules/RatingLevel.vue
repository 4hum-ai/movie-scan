<template>
  <div class="rounded-lg p-3" :class="colorClass">
    <div class="flex-1">
      <span class="text-sm font-medium text-gray-900">{{ level.title || 'No title' }}</span>
      <p class="mt-1 text-xs text-gray-500">
        {{ level.description || 'No description' }}
      </p>
      <p v-if="level.guide" class="bg-opacity-50 mt-2 rounded bg-white p-2 text-xs text-gray-600">
        {{ level.guide }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getRatingLevelColorClass } from '@/constants/ratingColors'

interface RatingLevel {
  key?: string
  title?: string
  description?: string
  guide?: string
}

interface Props {
  level: RatingLevel
}

const props = defineProps<Props>()

const colorClass = computed(() => {
  return getRatingLevelColorClass(props.level.key || '')
})
</script>
