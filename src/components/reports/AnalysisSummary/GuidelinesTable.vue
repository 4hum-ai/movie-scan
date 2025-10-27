<template>
  <div class="overflow-x-auto">
    <div class="min-w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th
              class="w-2/5 px-6 py-4 text-left text-sm font-bold tracking-wider text-gray-700 uppercase"
            >
              Guidelines
            </th>
            <th
              class="w-1/6 px-6 py-4 text-center text-sm font-bold tracking-wider text-gray-700 uppercase"
            >
              Scenes
            </th>
            <th
              class="w-1/6 px-6 py-4 text-center text-sm font-bold tracking-wider whitespace-nowrap text-gray-700"
            >
              Duration
            </th>
            <th
              class="w-1/4 px-6 py-4 text-center text-sm font-bold tracking-wider text-gray-700 uppercase"
            >
              % of Total
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr
            v-for="row in rows"
            :key="row.name"
            class="transition-all duration-200 hover:bg-blue-50/50"
          >
            <td class="px-6 py-5 text-sm font-medium text-gray-900">
              <div class="leading-relaxed break-words" :title="row.name">{{ row.name }}</div>
            </td>
            <td class="px-6 py-5 text-center text-sm text-gray-500">
              <span
                class="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold shadow-sm"
                :class="
                  row.scenesDetected > 0
                    ? 'bg-red-100 text-red-800 ring-2 ring-red-200'
                    : 'bg-gray-100 text-gray-500 ring-2 ring-gray-200'
                "
              >
                {{ row.scenesDetected }}
              </span>
            </td>
            <td class="px-6 py-5 text-center text-sm text-gray-500">
              <span class="font-semibold text-gray-700">{{ row.totalMinutes }} min</span>
            </td>
            <td class="px-6 py-5 text-center text-sm text-gray-500">
              <div class="flex flex-col items-center space-y-2">
                <span class="text-sm font-bold text-gray-700">{{ row.percentageOfDuration }}</span>
                <div class="h-3 w-24 rounded-full bg-gray-200 shadow-inner">
                  <div
                    class="h-3 rounded-full shadow-sm transition-all duration-500"
                    :class="getProgressBarClass(row.percentageOfDuration)"
                    :style="{ width: Math.min(parseFloat(row.percentageOfDuration), 100) + '%' }"
                  ></div>
                </div>
              </div>
            </td>
          </tr>
          <tr class="border-t-2 border-gray-300 bg-gray-50 font-semibold">
            <td class="px-6 py-4 text-sm font-bold text-gray-900">
              <div class="flex items-center">
                <svg
                  class="mr-2 h-4 w-4 text-gray-600"
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
                Total
              </div>
            </td>
            <td class="px-6 py-4 text-center text-sm font-bold text-gray-900">
              <span
                class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-800 ring-2 ring-blue-200"
                >{{ totalScenes }}</span
              >
            </td>
            <td class="px-6 py-4 text-center text-sm font-bold text-gray-900">
              {{ totalMinutes }} min
            </td>
            <td class="px-6 py-4 text-center text-sm font-bold text-gray-900">
              <div class="flex flex-col items-center space-y-2">
                <span>{{ totalPercentage }}%</span>
                <div class="h-3 w-24 rounded-full bg-gray-200 shadow-inner">
                  <div
                    class="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm"
                    :style="{ width: Math.min(parseFloat(totalPercentage), 100) + '%' }"
                  ></div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useReportDetail } from '@/composables'

interface Row {
  name: string
  scenesDetected: number
  totalMinutes: string
  percentageOfDuration: string
}

interface Props {
  rows: Row[]
}

const props = defineProps<Props>()
const { getProgressBarClass } = useReportDetail()

const totalScenes = computed(() => props.rows.reduce((s, r) => s + r.scenesDetected, 0))
const totalMinutes = computed(() =>
  props.rows.reduce((s, r) => s + parseFloat(r.totalMinutes), 0).toFixed(1),
)
const totalPercentage = computed(() =>
  props.rows.reduce((s, r) => s + parseFloat(r.percentageOfDuration), 0).toFixed(1),
)
</script>
