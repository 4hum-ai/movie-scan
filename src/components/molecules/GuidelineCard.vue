<template>
  <div class="flex items-center space-x-2">
    <input
      type="checkbox"
      v-model="isSelected"
      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
    <div class="flex-1 rounded-lg border bg-white p-3">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-sm font-medium text-gray-900">{{ guideline.name || 'No name' }}</span>
          <p class="text-xs text-gray-500">
            {{ guideline.description || 'No description' }}
          </p>
          <!-- Keywords -->
          <div v-if="guideline.keywords && guideline.keywords.length > 0" class="mt-2">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="keyword in guideline.keywords"
                :key="keyword?.key || keyword?.label"
                class="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
              >
                {{ keyword?.label || 'No label' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface GuidelineKeyword {
  key?: string
  label?: string
}

interface RatingSystemGuideline {
  name?: string
  description?: string
  keywords?: GuidelineKeyword[]
  group?: string
}

interface Props {
  guideline: RatingSystemGuideline
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isSelected = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})
</script>
