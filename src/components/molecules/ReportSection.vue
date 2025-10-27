<template>
  <div class="mb-8 rounded-lg border p-6" :class="sectionClasses">
    <h4 class="mb-2 text-lg font-medium" :class="titleClasses">Report ID</h4>
    <div class="flex items-center justify-center space-x-2">
      <span class="rounded px-3 py-1 font-mono text-lg" :class="reportIdClasses">
        {{ reportId }}
      </span>
      <button
        @click="$emit('copyReportId')"
        class="rounded-md px-3 py-1 text-sm text-white"
        :class="copyButtonClasses"
      >
        Copy
      </button>
    </div>
    <p class="mt-2 text-xs" :class="descriptionClasses">
      <span v-if="isCompleted"
        >Your analysis report is ready. Use the buttons below to view or copy the report ID.</span
      >
      <span v-else>Report is being processed. You can copy the ID to track progress later.</span>
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
