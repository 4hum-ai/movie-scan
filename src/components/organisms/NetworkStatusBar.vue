<template>
  <transition name="fade">
    <div
      v-if="!isOnline"
      class="fixed top-0 right-0 left-0 z-50 bg-red-600 text-sm text-white"
      role="status"
      aria-live="polite"
    >
      <div class="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2">
        <span class="inline-block h-2 w-2 animate-pulse rounded-full bg-white" />
        <span>You're offline. Some features are unavailable until connection is restored.</span>
      </div>
    </div>
  </transition>
  <div class="h-0" aria-hidden="true" />
  <!-- spacer for overlayed banner; content stays clickable -->
</template>

<script setup lang="ts">
import { useNetwork } from '@/composables'

const { isOnline } = useNetwork()
</script>

<style scoped>
@reference '@/style.css';

.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-200 ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}
</style>
