<template>
  <div class="mx-auto max-w-4xl">
    <!-- Upload Area -->
    <div class="text-center">
      <div
        @click="!hasUploadedVideo && emitOpenUploadModal()"
        class="group rounded-lg border-2 border-dashed px-8 py-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        :class="
          hasUploadedVideo
            ? 'cursor-not-allowed border-gray-200 bg-gray-100/30 opacity-60'
            : 'cursor-pointer border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-100/50'
        "
      >
        <div class="mb-4">
          <svg
            class="mx-auto h-12 w-12 transition-colors"
            :class="hasUploadedVideo ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-500'"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <h3
          class="text-lg font-medium"
          :class="hasUploadedVideo ? 'text-gray-500' : 'text-gray-900 group-hover:text-gray-700'"
        >
          {{ hasUploadedVideo ? 'Video uploaded successfully' : 'Upload video files' }}
        </h3>
        <p
          class="mt-2 text-sm"
          :class="hasUploadedVideo ? 'text-gray-400' : 'text-gray-500 group-hover:text-gray-600'"
        >
          {{
            hasUploadedVideo
              ? 'Ready to proceed with scan'
              : 'Click here to select and upload your video files'
          }}
        </p>
        <p class="mt-4 text-xs text-gray-400">
          Supported formats: MP4, AVI, MOV • Max file size: 10GB
        </p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-8 flex justify-end space-x-3">
      <button
        @click="emitBack()"
        class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Back
      </button>
      <button
        @click="emitProceed()"
        :disabled="!hasUploadedVideo"
        class="rounded-md px-4 py-2 text-sm font-medium transition-colors"
        :class="
          hasUploadedVideo
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'cursor-not-allowed bg-gray-300 text-gray-500'
        "
        :title="!hasUploadedVideo ? 'Please upload a video first' : 'Start AI scan process'"
      >
        Request Scan
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  hasUploadedVideo: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'proceed'): void
  (e: 'openUploadModal'): void
}>()

const emitBack = () => emit('back')
const emitProceed = () => emit('proceed')
const emitOpenUploadModal = () => emit('openUploadModal')
</script>
