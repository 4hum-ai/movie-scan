<template>
  <div class="mb-8 rounded-lg border p-6" :class="sectionClasses">
    <h4 class="mb-2 text-lg font-medium" :class="titleClasses">Report ID</h4>
    <div class="flex items-center justify-center space-x-2">
      <button
        @click="$emit('goToReport')"
        class="cursor-pointer rounded px-3 py-1 font-mono text-lg transition-colors"
        :class="reportIdClasses"
        title="Click to view report"
      >
        {{ reportId }}
      </button>
      <button
        @click="$emit('copyReportId')"
        class="rounded-md px-3 py-1 text-sm text-white"
        :class="copyButtonClasses"
      >
        Copy
      </button>
    </div>
    <p class="mt-2 text-xs" :class="descriptionClasses">
      <span v-if="isCompleted">Click the ID to view your complete analysis report.</span>
      <span v-else>Click the ID to view report progress, or copy it to track later.</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  reportId: string
  isCompleted: boolean
}

interface Emits {
  (e: 'goToReport'): void
  (e: 'copyReportId'): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const sectionClasses = computed(() => {
  return props.isCompleted ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'
})

const titleClasses = computed(() => {
  return props.isCompleted ? 'text-green-900' : 'text-blue-900'
})

const reportIdClasses = computed(() => {
  return props.isCompleted
    ? 'bg-green-100 text-green-800 hover:bg-green-200'
    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
})

const copyButtonClasses = computed(() => {
  return props.isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
})

const descriptionClasses = computed(() => {
  return props.isCompleted ? 'text-green-700' : 'text-blue-700'
})
</script>
