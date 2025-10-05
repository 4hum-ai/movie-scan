<template>
  <div
    :class="['stepper', orientationClasses, sizeClasses, variantClasses, customClass]"
    role="tablist"
    :aria-label="ariaLabel"
  >
    <!-- Horizontal Layout -->
    <div
      v-if="orientation === 'horizontal' || (orientation === 'responsive' && !isMobile)"
      class="flex items-center justify-center py-4"
    >
      <div class="flex items-center space-x-4">
        <div v-for="(step, index) in steps" :key="step.id" class="flex items-center">
          <!-- Step Circle/Icon -->
          <button
            :class="[
              'flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none',
              getStepClasses(index),
              clickable ? 'cursor-pointer' : 'cursor-default',
            ]"
            :disabled="!clickable || step.disabled"
            :aria-label="`Step ${index + 1}: ${step.label}`"
            :aria-selected="index === currentStep"
            :aria-current="index === currentStep ? 'step' : undefined"
            role="tab"
            @click="handleStepClick(index)"
          >
            <!-- Custom icon variant -->
            <svg
              v-if="variant === 'icon' && step.icon"
              :class="getIconClasses(index)"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path :d="getIconPath(step.icon)" />
            </svg>
            <!-- Configurable icon/number display -->
            <template v-else>
              <!-- Always show numbers mode -->
              <span v-if="iconMode === 'always-numbers'" :class="getTextClasses(index)">
                {{ index + 1 }}
              </span>
              <!-- Custom icons mode -->
              <svg
                v-else-if="iconMode === 'custom-icons' && step.icon"
                :class="getIconClasses(index)"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path :d="getIconPath(step.icon)" />
              </svg>
              <!-- Completed icons mode (default) -->
              <template v-else>
                <!-- Completed state with checkmark -->
                <svg
                  v-if="index < currentStep || step.completed"
                  :class="getIconClasses(index)"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <!-- Current or pending state with number -->
                <span v-else :class="getTextClasses(index)">
                  {{ index + 1 }}
                </span>
              </template>
            </template>
          </button>

          <!-- Step Label -->
          <span
            v-if="variant !== 'minimal'"
            :class="[
              'ml-3 text-sm font-medium transition-colors duration-200',
              getLabelClasses(index),
            ]"
          >
            {{ step.label }}
          </span>

          <!-- Connector Line (not for last step) -->
          <div
            v-if="index < steps.length - 1 && showConnectors"
            :class="[
              'h-1 w-8 rounded-full transition-colors duration-500',
              getConnectorClasses(index),
            ]"
          />
        </div>
      </div>
    </div>

    <!-- Vertical Layout -->
    <div v-else class="space-y-6 py-4">
      <div v-for="(step, index) in steps" :key="step.id" class="relative flex items-start">
        <!-- Step Circle/Icon -->
        <button
          :class="[
            'flex flex-shrink-0 items-center justify-center rounded-full text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none',
            getStepClasses(index),
            clickable ? 'cursor-pointer' : 'cursor-default',
          ]"
          :disabled="!clickable || step.disabled"
          :aria-label="`Step ${index + 1}: ${step.label}`"
          :aria-selected="index === currentStep"
          :aria-current="index === currentStep ? 'step' : undefined"
          role="tab"
          @click="handleStepClick(index)"
        >
          <!-- Custom icon variant -->
          <svg
            v-if="variant === 'icon' && step.icon"
            :class="getIconClasses(index)"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path :d="getIconPath(step.icon)" />
          </svg>
          <!-- Configurable icon/number display -->
          <template v-else>
            <!-- Always show numbers mode -->
            <span v-if="iconMode === 'always-numbers'" :class="getTextClasses(index)">
              {{ index + 1 }}
            </span>
            <!-- Custom icons mode -->
            <svg
              v-else-if="iconMode === 'custom-icons' && step.icon"
              :class="getIconClasses(index)"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path :d="getIconPath(step.icon)" />
            </svg>
            <!-- Completed icons mode (default) -->
            <template v-else>
              <!-- Completed state with checkmark -->
              <svg
                v-if="index < currentStep || step.completed"
                :class="getIconClasses(index)"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <!-- Current or pending state with number -->
              <span v-else :class="getTextClasses(index)">
                {{ index + 1 }}
              </span>
            </template>
          </template>
        </button>

        <!-- Step Content -->
        <div class="ml-4 flex-1 pt-1">
          <div
            :class="['text-sm font-medium transition-colors duration-200', getLabelClasses(index)]"
          >
            {{ step.label }}
          </div>
          <div
            v-if="step.description && variant !== 'compact'"
            :class="['mt-1 text-xs transition-colors duration-200', getDescriptionClasses(index)]"
          >
            {{ step.description }}
          </div>
        </div>

        <!-- Vertical Connector Line (not for last step) -->
        <div
          v-if="index < steps.length - 1 && showConnectors"
          :class="[
            'absolute top-10 left-4 h-6 w-1 rounded-full transition-colors duration-500',
            getConnectorClasses(index),
          ]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

interface StepperStep {
  id: string
  label: string
  description?: string
  icon?: string
  disabled?: boolean
  completed?: boolean
  error?: boolean
}

interface Props {
  /** Array of step definitions */
  steps: StepperStep[]
  /** Current active step index (0-based) */
  currentStep: number
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical' | 'responsive'
  /** Visual variant */
  variant?: 'default' | 'compact' | 'icon' | 'minimal'
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Show step numbers */
  showNumbers?: boolean
  /** Allow clicking on steps */
  clickable?: boolean
  /** Show connecting lines */
  showConnectors?: boolean
  /** Custom CSS classes */
  customClass?: string
  /** ARIA label for accessibility */
  ariaLabel?: string
  /** Icon display mode */
  iconMode?: 'always-numbers' | 'completed-icons' | 'custom-icons'
}

interface Emits {
  (e: 'step-click', stepIndex: number): void
  (e: 'step-change', stepIndex: number): void
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  variant: 'default',
  size: 'md',
  showNumbers: true,
  clickable: false,
  showConnectors: true,
  ariaLabel: 'Progress steps',
  iconMode: 'completed-icons',
})

const emit = defineEmits<Emits>()

// Responsive behavior
const isMobile = ref(false)

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

// Computed classes
const orientationClasses = computed(() => {
  if (props.orientation === 'responsive') {
    return isMobile.value ? 'flex flex-col' : 'flex items-center justify-center'
  }
  return props.orientation === 'vertical' ? 'flex flex-col' : 'flex items-center justify-center'
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }
  return sizes[props.size]
})

const variantClasses = computed(() => {
  const variants = {
    default: '',
    compact: 'space-x-1',
    icon: '',
    minimal: 'opacity-75 hover:opacity-100',
  }
  return variants[props.variant]
})

// Step state helpers
const isStepCompleted = (index: number) => {
  return index < props.currentStep || props.steps[index]?.completed
}

const isStepActive = (index: number) => {
  return index === props.currentStep
}

const isStepError = (index: number) => {
  return props.steps[index]?.error
}

const isStepDisabled = (index: number) => {
  return props.steps[index]?.disabled
}

// Dynamic classes for steps
const getStepClasses = (index: number) => {
  const baseClasses = 'focus:ring-blue-500 shadow-sm transition-all duration-300 ease-in-out'

  if (isStepError(index)) {
    return [
      baseClasses,
      'bg-red-500 text-white border-2 border-red-500 shadow-red-200 hover:shadow-red-300 hover:scale-105',
      getSizeClasses().step,
    ]
  }

  if (isStepCompleted(index)) {
    return [
      baseClasses,
      'bg-emerald-500 text-white border-2 border-emerald-500 shadow-emerald-200 hover:shadow-emerald-300 hover:scale-105',
      getSizeClasses().step,
    ]
  }

  if (isStepActive(index)) {
    return [
      baseClasses,
      'bg-blue-500 text-white border-2 border-blue-500 shadow-blue-200 hover:shadow-blue-300 hover:scale-105 ring-4 ring-blue-100',
      getSizeClasses().step,
    ]
  }

  if (isStepDisabled(index)) {
    return [
      baseClasses,
      'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed opacity-60',
      getSizeClasses().step,
    ]
  }

  // Pending state
  return [
    baseClasses,
    'bg-white text-gray-500 border-2 border-gray-300 shadow-gray-100 hover:shadow-gray-200 hover:border-gray-400 hover:scale-105',
    getSizeClasses().step,
  ]
}

const getIconClasses = (index: number) => {
  const baseClasses = 'text-current'

  if (isStepError(index)) {
    return [baseClasses, getSizeClasses().icon, 'text-white']
  }

  if (isStepCompleted(index)) {
    return [baseClasses, getSizeClasses().icon, 'text-white']
  }

  if (isStepActive(index)) {
    return [baseClasses, getSizeClasses().icon, 'text-white']
  }

  if (isStepDisabled(index)) {
    return [baseClasses, getSizeClasses().icon, 'text-gray-400']
  }

  return [baseClasses, getSizeClasses().icon, 'text-gray-600']
}

const getTextClasses = (index: number) => {
  const baseClasses = 'font-medium'

  if (isStepError(index)) {
    return [baseClasses, getSizeClasses().text, 'text-white']
  }

  if (isStepActive(index)) {
    return [baseClasses, getSizeClasses().text, 'text-white']
  }

  if (isStepDisabled(index)) {
    return [baseClasses, getSizeClasses().text, 'text-gray-400']
  }

  return [baseClasses, getSizeClasses().text, 'text-gray-600']
}

const getLabelClasses = (index: number) => {
  const baseClasses = 'font-semibold transition-colors duration-300'

  if (isStepError(index)) {
    return [baseClasses, 'text-red-600 dark:text-red-400'].join(' ')
  }

  if (isStepCompleted(index)) {
    return [baseClasses, 'text-emerald-600 dark:text-emerald-400'].join(' ')
  }

  if (isStepActive(index)) {
    return [baseClasses, 'text-blue-600 dark:text-blue-400'].join(' ')
  }

  if (isStepDisabled(index)) {
    return [baseClasses, 'text-gray-400 dark:text-gray-500'].join(' ')
  }

  return [baseClasses, 'text-gray-600 dark:text-gray-400'].join(' ')
}

const getDescriptionClasses = (index: number) => {
  if (isStepError(index)) {
    return 'text-red-500 dark:text-red-400'
  }

  if (isStepCompleted(index)) {
    return 'text-green-500 dark:text-green-400'
  }

  if (isStepActive(index)) {
    return 'text-blue-500 dark:text-blue-400'
  }

  if (isStepDisabled(index)) {
    return 'text-gray-400 dark:text-gray-500'
  }

  return 'text-gray-400 dark:text-gray-500'
}

const getConnectorClasses = (index: number) => {
  const baseClasses = 'transition-all duration-500 ease-in-out'

  if (isStepCompleted(index)) {
    return [baseClasses, 'bg-emerald-400 shadow-sm'].join(' ')
  }

  if (isStepActive(index)) {
    return [baseClasses, 'bg-blue-400 shadow-sm'].join(' ')
  }

  if (isStepError(index)) {
    return [baseClasses, 'bg-red-400 shadow-sm'].join(' ')
  }

  return [baseClasses, 'bg-gray-200 dark:bg-gray-600'].join(' ')
}

const getSizeClasses = () => {
  const sizes = {
    sm: {
      step: 'h-7 w-7',
      icon: 'h-3 w-3',
      text: 'text-xs',
    },
    md: {
      step: 'h-10 w-10',
      icon: 'h-4 w-4',
      text: 'text-sm',
    },
    lg: {
      step: 'h-12 w-12',
      icon: 'h-5 w-5',
      text: 'text-base',
    },
  }
  return sizes[props.size]
}

// Icon path helper
const getIconPath = (iconName: string) => {
  const iconPaths: Record<string, string> = {
    'mdi:check':
      'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z',
    'mdi:upload': 'M7 14l5-5 5 5H7z M7 2v2h6V2H7z',
    'mdi:download': 'M7 6l5 5 5-5H7z M7 18v-2h6v2H7z',
    'mdi:play': 'M8 5v10l8-5-8-5z',
    'mdi:pause': 'M6 4h4v12H6V4zm8 0h4v12h-4V4z',
    'mdi:stop': 'M6 6h8v8H6V6z',
    'mdi:edit':
      'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
    'mdi:delete': 'M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z',
    'mdi:settings':
      'M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z',
    'mdi:home': 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    'mdi:user':
      'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
    'mdi:mail':
      'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
    'mdi:phone':
      'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
    'mdi:search':
      'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    'mdi:menu': 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
    'mdi:close':
      'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    'mdi:arrow-right': 'M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z',
    'mdi:arrow-left': 'M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z',
    'mdi:arrow-up': 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z',
    'mdi:arrow-down': 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z',
  }

  return iconPaths[iconName] || iconPaths['mdi:check']
}

// Event handlers
const handleStepClick = (index: number) => {
  if (props.clickable && !isStepDisabled(index)) {
    emit('step-click', index)
    if (index !== props.currentStep) {
      emit('step-change', index)
    }
  }
}
</script>
