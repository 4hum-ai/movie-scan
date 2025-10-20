<template>
  <div>
    <div class="mb-6 flex items-center">
      <div class="flex-shrink-0">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
          <svg
            class="h-5 w-5 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
      <div class="ml-3">
        <h3 class="text-lg font-semibold text-gray-900">Detected Scenes</h3>
        <p class="text-sm text-gray-500">Detailed analysis of content violations</p>
      </div>
    </div>
    <div class="space-y-6">
      <SceneCard v-for="s in scenes" :key="s.startTime" :scene="s" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SceneCard from './SceneCard.vue'
import type { AnalysisScene } from '@/composables/useReportDetail'

interface Props {
  scenes: AnalysisScene[]
}
defineProps<Props>()
</script>
