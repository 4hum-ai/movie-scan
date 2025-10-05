<template>
  <div
    :class="['stepper', orientationClasses, sizeClasses, variantClasses, customClass]"
    role="tablist"
    :aria-label="ariaLabel"
  >
    <!-- Horizontal Layout -->
    <div
      v-if="orientation === 'horizontal' || (orientation === 'responsive' && !isMobile)"
      class="flex items-center justify-center"
    >
      <div class="flex items-center space-x-2">
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
            <Icon
              v-if="variant === 'icon' && step.icon"
              :name="step.icon"
              :class="getIconClasses(index)"
            />
            <!-- Configurable icon/number display -->
            <template v-else>
              <!-- Always show numbers mode -->
              <span v-if="iconMode === 'always-numbers'" :class="getTextClasses(index)">
                {{ index + 1 }}
              </span>
              <!-- Custom icons mode -->
              <Icon
                v-else-if="iconMode === 'custom-icons' && step.icon"
                :name="step.icon"
                :class="getIconClasses(index)"
              />
              <!-- Completed icons mode (default) -->
              <template v-else>
                <!-- Completed state with checkmark -->
                <Icon
                  v-if="index < currentStep || step.completed"
                  name="mdi:check"
                  :class="getIconClasses(index)"
                />
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
              'ml-2 text-sm font-medium transition-colors duration-200',
              getLabelClasses(index),
            ]"
          >
            {{ step.label }}
          </span>

          <!-- Connector Line (not for last step) -->
          <div
            v-if="index < steps.length - 1 && showConnectors"
            :class="['h-0.5 w-6 transition-colors duration-200', getConnectorClasses(index)]"
          />
        </div>
      </div>
    </div>

    <!-- Vertical Layout -->
    <div v-else class="space-y-4">
      <div v-for="(step, index) in steps" :key="step.id" class="flex items-start">
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
          <Icon
            v-if="variant === 'icon' && step.icon"
            :name="step.icon"
            :class="getIconClasses(index)"
          />
          <!-- Configurable icon/number display -->
          <template v-else>
            <!-- Always show numbers mode -->
            <span v-if="iconMode === 'always-numbers'" :class="getTextClasses(index)">
              {{ index + 1 }}
            </span>
            <!-- Custom icons mode -->
            <Icon
              v-else-if="iconMode === 'custom-icons' && step.icon"
              :name="step.icon"
              :class="getIconClasses(index)"
            />
            <!-- Completed icons mode (default) -->
            <template v-else>
              <!-- Completed state with checkmark -->
              <Icon
                v-if="index < currentStep || step.completed"
                name="mdi:check"
                :class="getIconClasses(index)"
              />
              <!-- Current or pending state with number -->
              <span v-else :class="getTextClasses(index)">
                {{ index + 1 }}
              </span>
            </template>
          </template>
        </button>

        <!-- Step Content -->
        <div class="ml-4 flex-1">
          <div
            :class="['text-sm font-medium transition-colors duration-200', getLabelClasses(index)]"
          >
            {{ step.label }}
          </div>
          <div
            v-if="step.description && variant !== 'compact'"
            :class="['text-xs transition-colors duration-200', getDescriptionClasses(index)]"
          >
            {{ step.description }}
          </div>
        </div>

        <!-- Vertical Connector Line (not for last step) -->
        <div
          v-if="index < steps.length - 1 && showConnectors"
          :class="[
            'absolute top-8 left-4 h-8 w-0.5 transition-colors duration-200',
            getConnectorClasses(index),
          ]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import Icon from '@/components/atoms/Icon.vue'

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
  const baseClasses = 'focus:ring-blue-500'

  if (isStepError(index)) {
    return [baseClasses, 'bg-red-600 text-white border-2 border-red-600', getSizeClasses().step]
  }

  if (isStepCompleted(index)) {
    return [baseClasses, 'bg-green-600 text-white border-2 border-green-600', getSizeClasses().step]
  }

  if (isStepActive(index)) {
    return [baseClasses, 'bg-blue-600 text-white border-2 border-blue-600', getSizeClasses().step]
  }

  if (isStepDisabled(index)) {
    return [
      baseClasses,
      'bg-gray-200 text-gray-400 border-2 border-gray-200 cursor-not-allowed',
      getSizeClasses().step,
    ]
  }

  // Pending state
  return [baseClasses, 'bg-gray-200 text-gray-600 border-2 border-gray-200', getSizeClasses().step]
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
  if (isStepError(index)) {
    return 'text-red-600 dark:text-red-400'
  }

  if (isStepCompleted(index)) {
    return 'text-green-600 dark:text-green-400'
  }

  if (isStepActive(index)) {
    return 'text-blue-600 dark:text-blue-400'
  }

  if (isStepDisabled(index)) {
    return 'text-gray-400 dark:text-gray-500'
  }

  return 'text-gray-500 dark:text-gray-400'
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
  if (isStepCompleted(index)) {
    return 'bg-green-600 dark:bg-green-400'
  }

  if (isStepActive(index)) {
    return 'bg-blue-600 dark:bg-blue-400'
  }

  if (isStepError(index)) {
    return 'bg-red-600 dark:bg-red-400'
  }

  return 'bg-gray-300 dark:bg-gray-600'
}

const getSizeClasses = () => {
  const sizes = {
    sm: {
      step: 'h-6 w-6',
      icon: 'h-3 w-3',
      text: 'text-xs',
    },
    md: {
      step: 'h-8 w-8',
      icon: 'h-4 w-4',
      text: 'text-sm',
    },
    lg: {
      step: 'h-10 w-10',
      icon: 'h-5 w-5',
      text: 'text-base',
    },
  }
  return sizes[props.size]
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
