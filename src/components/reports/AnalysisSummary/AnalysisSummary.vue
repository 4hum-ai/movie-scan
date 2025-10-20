<template>
  <div>
    <h2 class="mb-4 text-lg font-semibold text-gray-900">Analysis Results</h2>

    <div
      class="mb-8 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 shadow-lg"
    >
      <div class="mb-8 flex items-center">
        <div class="flex-shrink-0">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 shadow-sm">
            <svg
              class="h-7 w-7 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </div>
        <div class="ml-4">
          <h3 class="text-2xl font-bold text-gray-900">Executive Summary</h3>
          <p class="text-sm text-gray-600">Content analysis overview and guideline violations</p>
        </div>
      </div>

      <div
        class="mb-8 rounded-xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm"
      >
        <p class="text-base leading-relaxed text-gray-700">
          This content analysis identified
          <span
            class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-semibold text-blue-800"
            >{{ scenesCount }}</span
          >
          guideline violations across
          <span
            class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-semibold text-blue-800"
            >{{ totalViolationMinutes }}</span
          >
          minutes of content. The most significant issues involve
          <span
            class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-semibold text-red-800"
            >{{ primaryCategory.category }}</span
          >
          with
          <span
            class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-semibold text-red-800"
            >{{ primaryCategory.criticalCount }}</span
          >
          critical severity violations.
        </p>
      </div>

      <GuidelinesTable :rows="rows" />
    </div>
  </div>
</template>

<script setup lang="ts">
import GuidelinesTable from './GuidelinesTable.vue'

interface Row {
  name: string
  scenesDetected: number
  totalMinutes: string
  percentageOfDuration: string
}

interface Props {
  rows: Row[]
  scenesCount: number
  totalViolationMinutes: string
  primaryCategory: { category: string; criticalCount: number }
}

defineProps<Props>()
</script>
