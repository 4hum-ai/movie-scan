<template>
  <div
    class="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
  >
    <div class="border-b border-gray-200 bg-gray-50 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="mb-1 text-2xl font-bold text-gray-900">
            {{ formatShortTime(scene.startTime) }} - {{ formatShortTime(scene.endTime) }}
          </div>
          <div class="text-sm text-gray-600">
            {{ getDurationText(scene) }}. {{ scene.guideline }}
          </div>
        </div>
        <div class="flex space-x-2">
          <span
            class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
            :class="getConfidenceBadgeClass(getSceneConfidence(scene))"
          >
            <svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            {{ getSceneConfidence(scene) }}% confidence
          </span>
          <span
            class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
            :class="getSeverityBadgeClass(scene.severity)"
          >
            <svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            {{ scene.severity }} severity
          </span>
        </div>
      </div>
    </div>

    <div class="p-6">
      <div class="mb-6">
        <p class="text-base leading-relaxed text-gray-700">{{ scene.summary }}</p>
      </div>

      <div class="mb-8">
        <h5 class="mb-4 text-lg font-semibold text-gray-900">Scene Content</h5>
        <div class="mb-6">
          <h6 class="mb-3 text-sm font-medium text-gray-700">Scene Screenshots</h6>
          <div class="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            <div
              v-for="(screenshot, index) in screenshots"
              :key="index"
              class="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <img
                :src="typeof screenshot === 'string' ? screenshot : screenshot.dataUrl"
                :alt="`Scene screenshot ${index + 1}`"
                class="h-20 w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <div
                class="absolute right-1 bottom-1 rounded bg-blue-600 px-1.5 py-0.5 text-xs text-white shadow-sm"
              >
                {{ index + 1 }}
              </div>
              <div
                v-if="typeof screenshot === 'object' && screenshot.timestamp"
                class="absolute top-1 left-1 rounded bg-white/90 px-1.5 py-0.5 text-xs text-gray-700 shadow-sm"
              >
                {{ formatTime(screenshot.timestamp) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-200 pt-6">
        <h5 class="mb-4 text-lg font-semibold text-gray-900">Analysis</h5>
        <div class="mb-6">
          <div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div class="mb-4">
              <span class="mb-2 text-sm font-medium text-gray-700">Detection Confidence</span>
              <p class="text-xs text-gray-600">
                {{ getMLDetectionDescription(getSceneConfidence(scene)) }}
                <span class="ml-1 text-gray-500" v-if="getSceneConfidenceRange(scene)"
                  >(Max confidence from
                  {{ getSceneConfidenceRange(scene)?.count || 0 }} detections)</span
                >
              </p>
            </div>
            <div v-if="getVideoDetectedElements(scene).length > 0" class="mb-4">
              <div>
                <span class="text-sm font-medium text-gray-700"
                  >Video Labels ({{ getVideoDetectedElements(scene).length }} detected)</span
                >
              </div>
              <p class="mb-2 text-xs text-gray-600">{{ getVideoDetectionDescription() }}</p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="element in getVideoDetectedElements(scene)"
                  :key="element.label"
                  class="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                  :title="`Confidence: ${element.confidence}%`"
                >
                  {{ element.label
                  }}<span class="ml-1 font-semibold text-blue-600">{{ element.confidence }}%</span>
                </span>
              </div>
            </div>
            <div v-if="getAudioDetectedElements(scene).length > 0">
              <div>
                <span class="text-sm font-medium text-gray-700"
                  >Audio Labels ({{ getAudioDetectedElements(scene).length }} detected)</span
                >
              </div>
              <p class="mb-2 text-xs text-gray-600">{{ getAudioDetectionDescription() }}</p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="element in getAudioDetectedElements(scene)"
                  :key="element.label"
                  class="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
                  :title="`Confidence: ${element.confidence}%`"
                >
                  {{ element.label
                  }}<span class="ml-1 font-semibold text-green-600">{{ element.confidence }}%</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReportDetail } from '@/composables'
import type { ReportScene } from '@/composables'

interface Props {
  scene: ReportScene
  screenshots?: Array<{
    timestamp: number
    dataUrl: string
  }>
}
// props are used in template only
defineProps<Props>()

const {
  formatShortTime,
  getDurationText,
  getSceneConfidence,
  getConfidenceBadgeClass,
  getSeverityBadgeClass,
  /* getConfidenceClass */ getMLDetectionDescription,
  getSceneConfidenceRange,
  getVideoDetectedElements,
  getVideoDetectionDescription,
  getAudioDetectedElements,
  getAudioDetectionDescription,
} = useReportDetail()

// Format time for screenshots
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }
}
</script>
