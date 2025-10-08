<template>
  <transition name="fade">
    <div
      v-if="isActive"
      :class="[
        'fixed z-50 bg-transparent',
        position === 'top' && 'inset-x-0 top-0 h-0.5',
        position === 'bottom' && 'inset-x-0 bottom-0 h-0.5',
        position === 'left' && 'inset-y-0 left-0 w-0.5',
        position === 'right' && 'inset-y-0 right-0 w-0.5',
      ]"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        :class="[
          'origin-left transition-all duration-300 ease-out',
          position === 'top' || position === 'bottom' ? 'h-full' : 'w-full',
          position === 'left' || position === 'right' ? 'w-full' : 'h-full',
          style === 'solid' && 'bg-primary-600',
          style === 'gradient' && 'from-primary-500 to-primary-600 bg-gradient-to-r',
          style === 'striped' && 'bg-primary-600 bg-stripes',
          style === 'pulse' && 'bg-primary-600 animate-pulse',
          style === 'indeterminate' && 'bg-primary-600 animate-progressbar',
        ]"
        role="progressbar"
        aria-busy="true"
        :style="style === 'custom' ? customStyle : {}"
      />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useEventBus } from '@vueuse/core'
import { EVENT_HTTP_ACTIVE, type HttpActivePayload } from '@/types/events'

interface Props {
  /** Position of the progress bar */
  position?: 'top' | 'bottom' | 'left' | 'right'
  /** Visual style of the progress bar */
  style?: 'solid' | 'gradient' | 'striped' | 'pulse' | 'indeterminate' | 'custom'
  /** Custom CSS styles when style is 'custom' */
  customStyle?: Record<string, string>
  /** Whether to show the progress bar */
  show?: boolean
  /** Custom progress value (0-100) */
  progress?: number
  /** Whether to use automatic HTTP activity detection */
  autoDetect?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
  style: 'indeterminate',
  autoDetect: true,
  show: false,
  progress: 0,
})

const isActive = ref(props.show)
let active = 0
let showTimer: number | null = null

const { on } = useEventBus<HttpActivePayload>(EVENT_HTTP_ACTIVE)
let offActive: (() => void) | null = null

function handleActive(payload: { active: number }) {
  if (!props.autoDetect) return

  active = Math.max(0, Number(payload?.active || 0))
  // Small delay to prevent flicker on very fast requests
  if (active > 0) {
    if (showTimer) window.clearTimeout(showTimer)
    showTimer = window.setTimeout(() => (isActive.value = true), 120)
  } else {
    if (showTimer) window.clearTimeout(showTimer)
    showTimer = null
    isActive.value = false
  }
}

// Watch for manual show/progress changes
watch(
  () => props.show,
  newValue => {
    isActive.value = newValue
  }
)

watch(
  () => props.progress,
  newValue => {
    if (newValue > 0 && newValue < 100) {
      isActive.value = true
    } else if (newValue >= 100) {
      // Hide after completion
      setTimeout(() => {
        isActive.value = false
      }, 500)
    }
  }
)

onMounted(() => {
  if (props.autoDetect) {
    offActive = on(handleActive)
  }
})

onBeforeUnmount(() => {
  if (offActive) offActive()
  if (showTimer) window.clearTimeout(showTimer)
})
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

@keyframes progress-indeterminate {
  0% {
    transform: scaleX(0.1);
  }
  50% {
    transform: scaleX(0.6);
  }
  100% {
    transform: scaleX(0.9);
  }
}

.animate-progressbar {
  animation: progress-indeterminate 1.2s ease-in-out infinite;
}

.bg-stripes {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}
</style>
