<template>
  <div class="rounded-lg border bg-gray-50 p-4">
    <h5 class="text-sm font-medium text-gray-900">{{ title }}</h5>
    <p class="mt-1 text-sm font-medium" :class="valueClasses">
      {{ value }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  value: string
  status?: 'processing' | 'completed' | 'failed' | 'pending'
}

const props = withDefaults(defineProps<Props>(), {
  status: 'pending',
})

const valueClasses = computed(() => {
  switch (props.status) {
    case 'processing':
      return 'text-blue-600'
    case 'completed':
      return 'text-green-600'
    case 'failed':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
})
</script>
