<template>
  <!-- Top Right -->
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-4">
    <TransitionGroup name="toast-tr" tag="div" class="flex flex-col gap-4">
      <ToastMessage
        v-for="message in trMessages"
        :key="message.id"
        :message="message"
        class="toast-item"
        @destroy="remove"
      />
    </TransitionGroup>
  </div>

  <!-- Top Left -->
  <div class="fixed top-4 left-4 z-50 flex flex-col gap-4">
    <TransitionGroup name="toast-tl" tag="div" class="flex flex-col gap-4">
      <ToastMessage
        v-for="message in tlMessages"
        :key="message.id"
        :message="message"
        class="toast-item"
        @destroy="remove"
      />
    </TransitionGroup>
  </div>

  <!-- Bottom Right -->
  <div class="fixed right-4 bottom-4 z-50 flex flex-col-reverse gap-4">
    <TransitionGroup name="toast-br" tag="div" class="flex flex-col-reverse gap-4">
      <ToastMessage
        v-for="message in brMessages"
        :key="message.id"
        :message="message"
        class="toast-item"
        @destroy="remove"
      />
    </TransitionGroup>
  </div>

  <!-- Bottom Left -->
  <div class="fixed bottom-4 left-4 z-50 flex flex-col-reverse gap-4">
    <TransitionGroup name="toast-bl" tag="div" class="flex flex-col-reverse gap-4">
      <ToastMessage
        v-for="message in blMessages"
        :key="message.id"
        :message="message"
        class="toast-item"
        @destroy="remove"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'
import ToastMessage from '../molecules/ToastMessage.vue'
import { useToast } from '@/composables'
import { useEventBus } from '@vueuse/core'
import { EVENT_HTTP_ERROR, type HttpErrorPayload } from '@/types/events'

// Composables
const { messages, remove } = useToast()
const errorBus = useEventBus<HttpErrorPayload>(EVENT_HTTP_ERROR)
let offHttpError: (() => void) | null = null

// Computed properties for each position
const trMessages = computed(() => messages.value.filter((msg) => msg.position === 'tr'))

const tlMessages = computed(() => messages.value.filter((msg) => msg.position === 'tl'))

const brMessages = computed(() => messages.value.filter((msg) => msg.position === 'br'))

const blMessages = computed(() => messages.value.filter((msg) => msg.position === 'bl'))

onMounted(() => {
  offHttpError = errorBus.on(({ method, path, message }) => {
    const { push } = useToast()
    push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: 'error',
      position: 'tr',
      title: 'Network error',
      body: `${method} ${path}: ${message}`,
      timeout: 6000,
    })
  })
})

onBeforeUnmount(() => {
  if (offHttpError) offHttpError()
})
</script>

<style scoped>
@reference '@/style.css';

/* Toast item styling */
.toast-item {
  @apply transform-gpu;
}

/* TOP RIGHT TRANSITIONS */
.toast-tr-move,
.toast-tr-enter-active,
.toast-tr-leave-active {
  @apply transition-all duration-300 ease-in-out;
}

.toast-tr-enter-from {
  @apply translate-x-1/4 opacity-0;
}
.toast-tr-enter-to {
  @apply translate-x-0 opacity-100;
}

.toast-tr-leave-from {
  @apply translate-x-0 opacity-100;
}
.toast-tr-leave-to {
  @apply -translate-x-1/4 opacity-0;
}
.toast-tr-leave-active {
  @apply absolute right-0;
}

/* TOP LEFT TRANSITIONS */
.toast-tl-move,
.toast-tl-enter-active,
.toast-tl-leave-active {
  @apply transition-all duration-300 ease-in-out;
}

.toast-tl-enter-from {
  @apply -translate-x-1/4 opacity-0;
}
.toast-tl-enter-to {
  @apply translate-x-0 opacity-100;
}

.toast-tl-leave-from {
  @apply translate-x-0 opacity-100;
}
.toast-tl-leave-to {
  @apply translate-x-1/4 opacity-0;
}
.toast-tl-leave-active {
  @apply absolute left-0;
}

/* BOTTOM RIGHT TRANSITIONS */
.toast-br-move,
.toast-br-enter-active,
.toast-br-leave-active {
  @apply transition-all duration-300 ease-in-out;
}

.toast-br-enter-from {
  @apply translate-x-1/4 opacity-0;
}
.toast-br-enter-to {
  @apply translate-x-0 translate-y-0 opacity-100;
}

.toast-br-leave-from {
  @apply translate-x-0 translate-y-0 opacity-100;
}
.toast-br-leave-to {
  @apply -translate-x-1/4 opacity-0;
}
.toast-br-leave-active {
  @apply absolute right-0;
}

/* BOTTOM LEFT TRANSITIONS */
.toast-bl-move,
.toast-bl-enter-active,
.toast-bl-leave-active {
  @apply transition-all duration-300 ease-in-out;
}

.toast-bl-enter-from {
  @apply -translate-x-1/4 opacity-0;
}
.toast-bl-enter-to {
  @apply translate-x-0 translate-y-0 opacity-100;
}

.toast-bl-leave-from {
  @apply translate-x-0 translate-y-0 opacity-100;
}
.toast-bl-leave-to {
  @apply translate-x-1/4 opacity-0;
}
.toast-bl-leave-active {
  @apply absolute left-0;
}
</style>
