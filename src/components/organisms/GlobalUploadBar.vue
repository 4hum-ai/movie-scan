<template>
  <transition name="fade">
    <div
      v-if="items.length"
      class="fixed right-4 bottom-4 z-50 w-[320px] rounded-lg border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
    >
      <div
        class="flex items-center justify-between border-b px-3 py-2 text-xs font-medium text-gray-700 dark:border-gray-700 dark:text-gray-200"
      >
        <span>Uploads ({{ items.length }})</span>
        <button
          @click="clearAll"
          class="flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          title="Close upload status"
        >
          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <ul class="max-h-[240px] divide-y overflow-y-auto dark:divide-gray-800">
        <li v-for="it in items" :key="it.id" class="px-3 py-2 text-xs">
          <div class="truncate text-gray-900 dark:text-gray-100">
            {{ it.fileName }}
          </div>
          <div class="mt-1 flex items-center gap-2">
            <div class="h-1 w-full rounded bg-gray-200">
              <div class="bg-primary-600 h-1 rounded" :style="{ width: `${it.progress}%` }" />
            </div>
            <span class="w-10 text-right text-gray-600 tabular-nums dark:text-gray-300"
              >{{ it.progress }}%</span
            >
          </div>
          <div class="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
            {{ it.status }} • {{ prettySize(it.size) }}
            <span v-if="it.error" class="text-red-600"> • {{ it.error }}</span>
          </div>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGlobalUpload } from '@/composables'
import type { UploadItem } from '@/composables'

const up = useGlobalUpload()
const items = computed<UploadItem[]>(() => [...(up.queue as UploadItem[])])

function prettySize(bytes: number): string {
  const sizes = ['B', 'KB', 'MB', 'GB']
  if (!bytes) return '0 B'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`
}

function clearAll() {
  up.clearQueue()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
