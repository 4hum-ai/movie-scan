<template>
  <div
    @click="!disabled && $emit('click')"
    class="group rounded-lg border-2 border-dashed px-8 py-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
    :class="uploadAreaClasses"
  >
    <div class="mb-4">
      <!-- Success Icon (when disabled/success) -->
      <div v-if="disabled" class="relative">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <!-- Success pulse animation -->
        <div
          class="absolute inset-0 mx-auto h-12 w-12 animate-ping rounded-full bg-green-100 opacity-20"
        ></div>
      </div>

      <!-- Upload Icon (when not disabled) -->
      <svg
        v-else
        class="mx-auto h-12 w-12 transition-colors"
        :class="iconClasses"
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
    <div class="flex items-center justify-center gap-2">
      <h3 class="text-lg font-medium" :class="titleClasses">
        {{ title }}
      </h3>
    </div>
    <p class="mt-2 text-sm" :class="descriptionClasses">
      {{ description }}
    </p>
    <p class="mt-4 text-xs text-gray-400">
      {{ fileInfo }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getSupportedFormatsString, getFileSizeLimitString } from '@/constants/videoUpload'

interface Props {
  disabled?: boolean
  title: string
  description: string
  fileInfo?: string
}

interface Emits {
  (e: 'click'): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  fileInfo: () => `Supported formats: ${getSupportedFormatsString()} • ${getFileSizeLimitString()}`,
})

defineEmits<Emits>()

// Computed classes for better readability
const uploadAreaClasses = computed(() => {
  return props.disabled
    ? 'cursor-not-allowed border-green-200 bg-green-50/50'
    : 'cursor-pointer border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-100/50'
})

const iconClasses = computed(() => {
  return props.disabled ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-500'
})

const titleClasses = computed(() => {
  return props.disabled ? 'text-green-700' : 'text-gray-900 group-hover:text-gray-700'
})

const descriptionClasses = computed(() => {
  return props.disabled ? 'text-green-600' : 'text-gray-500 group-hover:text-gray-600'
})
</script>
