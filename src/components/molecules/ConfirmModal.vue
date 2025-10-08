<template>
  <div v-if="open" class="fixed inset-0 z-50 grid place-items-center bg-black/40">
    <div
      class="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900"
    >
      <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">
        {{ title }}
      </h3>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {{ message }}
      </p>

      <!-- Text confirmation input when required -->
      <div v-if="confirmationText" class="mt-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Type
          <span class="font-mono font-semibold text-red-600 dark:text-red-400">{{
            confirmationText
          }}</span>
          to confirm:
        </label>
        <input
          v-model="inputText"
          type="text"
          class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:border-red-400 dark:focus:ring-red-400"
          :placeholder="`Type ${confirmationText} to confirm`"
          @keyup.enter="handleConfirm"
        />
      </div>

      <div class="mt-4 flex justify-end gap-2">
        <Button variant="outline" size="sm" @click="$emit('cancel')">
          {{ cancelLabel || 'Cancel' }}
        </Button>
        <Button
          :disabled="!isConfirmEnabled"
          :variant="isConfirmEnabled ? 'danger' : 'default'"
          size="sm"
          @click="handleConfirm"
        >
          {{ confirmLabel || 'Confirm' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '@/components/atoms/Button.vue'

interface Props {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmationText?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const inputText = ref('')

// Computed property to check if confirm button should be enabled
const isConfirmEnabled = computed(() => {
  if (!props.confirmationText) {
    return true // No text confirmation required
  }
  return inputText.value === props.confirmationText
})

// Handle confirm action
const handleConfirm = () => {
  if (isConfirmEnabled.value) {
    emit('confirm')
  }
}

// Reset input when modal opens/closes
const resetInput = () => {
  inputText.value = ''
}

// Watch for modal open/close to reset input
import { watch } from 'vue'
watch(
  () => props.open,
  isOpen => {
    if (!isOpen) {
      resetInput()
    }
  }
)
</script>
