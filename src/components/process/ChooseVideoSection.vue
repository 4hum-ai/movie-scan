<template>
  <div class="mx-auto max-w-4xl">
    <!-- Upload Area -->
    <div class="text-center">
      <UploadArea
        :disabled="hasUploadedVideo"
        :title="uploadTitle"
        :description="uploadDescription"
        @click="$emit('openUploadModal')"
      />
    </div>

    <!-- Action Buttons -->
    <div class="mt-8 flex justify-end space-x-3">
      <button
        @click="$emit('back')"
        class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Back
      </button>
      <button
        @click="$emit('proceed')"
        :disabled="!hasUploadedVideo"
        class="rounded-md px-4 py-2 text-sm font-medium transition-colors"
        :class="proceedButtonClasses"
        :title="proceedButtonTitle"
      >
        Request Scan
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UploadArea from '@/components/molecules/UploadArea.vue'

interface Props {
  hasUploadedVideo: boolean
}

const props = defineProps<Props>()

defineEmits<{
  (e: 'back'): void
  (e: 'proceed'): void
  (e: 'openUploadModal'): void
}>()

// Computed properties for better template readability
const uploadTitle = computed(() => {
  return props.hasUploadedVideo ? 'Video uploaded successfully' : 'Upload video files'
})

const uploadDescription = computed(() => {
  return props.hasUploadedVideo
    ? 'Ready to proceed with scan'
    : 'Click here to select and upload your video files'
})

const proceedButtonClasses = computed(() => {
  return props.hasUploadedVideo
    ? 'bg-blue-600 text-white hover:bg-blue-700'
    : 'cursor-not-allowed bg-gray-300 text-gray-500'
})

const proceedButtonTitle = computed(() => {
  return props.hasUploadedVideo ? 'Start AI scan process' : 'Please upload a video first'
})
</script>
