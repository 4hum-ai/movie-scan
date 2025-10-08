<template>
  <div
    class="flex flex-wrap items-center gap-2 rounded-md border px-2 py-2 dark:border-gray-700 dark:bg-gray-800"
  >
    <button
      v-for="(t, i) in modelValue"
      :key="t + i"
      type="button"
      class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-200"
      :title="`Remove ${t}`"
      @click="remove(i)"
    >
      <span>{{ t }}</span>
      <span aria-hidden="true">✕</span>
    </button>
    <input
      v-model="local"
      type="text"
      :placeholder="placeholder"
      class="min-w-[160px] flex-1 bg-transparent text-sm text-gray-900 outline-none dark:text-gray-100"
      @keydown.enter.prevent="commit"
      @keydown="onKeydown"
      @blur="commit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{ modelValue: string[]; placeholder?: string }>(), {
  modelValue: () => [],
  placeholder: 'Add tag and press Enter',
})
const emit = defineEmits<{ (e: 'update:modelValue', v: string[]): void }>()

const local = ref('')

function commit() {
  const val = local.value.trim()
  if (!val) return
  if (!props.modelValue.includes(val)) emit('update:modelValue', [...props.modelValue, val])
  local.value = ''
}
function remove(index: number) {
  const next = props.modelValue.slice()
  next.splice(index, 1)
  emit('update:modelValue', next)
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === ',') {
    e.preventDefault()
    commit()
  }
}

// ensure local clears if parent resets tags
watch(
  () => props.modelValue.length,
  () => {
    if (!props.modelValue.length) local.value = ''
  }
)
</script>
