<template>
  <div
    :class="[
      'flex w-sm flex-row items-start gap-2 rounded border p-3',
      theme === 'dark' ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-zinc-100 shadow',
    ]"
    @hover="onHover"
  >
    <component
      :is="icons[props.message.type]"
      :class="[
        props.message.type === 'error'
          ? 'text-red-500'
          : props.message.type === 'info'
            ? 'text-blue-500'
            : props.message.type === 'success'
              ? 'text-green-500'
              : props.message.type === 'warning'
                ? 'text-yellow-500'
                : theme === 'dark'
                  ? 'text-zinc-50'
                  : 'text-zinc-900',
        'mt-0.5 flex-none text-base',
      ]"
    />

    <div
      :class="['flex-auto wrap-break-word', theme === 'dark' ? 'text-zinc-50' : 'text-zinc-900']"
    >
      <h4 class="font-medium">
        {{ props.message.title }}
      </h4>
      <span>{{ props.message.body }}</span>
    </div>

    <button
      :class="[
        'flex-none text-base transition',
        theme === 'dark'
          ? 'text-zinc-400 hover:text-zinc-200'
          : 'text-zinc-600 hover:text-zinc-800',
      ]"
      @click="emit('destroy', props.message.id)"
    >
      <CloseIcon />
    </button>
  </div>
</template>

<script setup lang="ts">
import { IToastMessage, MessageType } from '@/types/toast'
import { useTimeout } from '@vueuse/core'
import { FunctionalComponent, onMounted, SVGAttributes, watch } from 'vue'
import ErrorIcon from '~icons/mdi/error-outline'
import InfoIcon from '~icons/mdi/information-outline'
import SuccessIcon from '~icons/mdi/check-circle-outline'
import WarningIcon from '~icons/mdi/warning-outline'
import CloseIcon from '~icons/mdi/close'
import { theme } from '@/composables'

// Types
interface Props {
  message: IToastMessage
}

// Emits
const emit = defineEmits<{
  destroy: [id: string]
}>()

// Props
const props = defineProps<Props>()

// Composables
const { start, stop, ready } = useTimeout(props.message.timeout || 0, {
  controls: true,
  immediate: false,
})

// State
const icons: Record<MessageType, FunctionalComponent<SVGAttributes>> = {
  success: SuccessIcon,
  error: ErrorIcon,
  info: InfoIcon,
  warning: WarningIcon,
}

// Watchers
const onHover = () => stop()

onMounted(async () => {
  if (props.message.timeout === undefined || props.message.timeout <= 0) return
  start()
})

watch(
  ready,
  (newValue) => {
    if (newValue) {
      emit('destroy', props.message.id)
    }
  },
  { immediate: false },
)
</script>
