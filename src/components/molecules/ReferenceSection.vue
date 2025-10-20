<template>
  <div v-if="references && references.length > 0" class="mb-4 rounded-lg bg-blue-50 p-3">
    <h4 class="text-sm font-medium text-blue-900">Reference</h4>
    <div v-for="(reference, index) in references" :key="index" class="mb-2">
      <p class="text-xs text-blue-800">
        <a
          v-if="reference?.url"
          :href="reference.url"
          target="_blank"
          class="no-underline hover:underline"
          >{{ reference?.title || 'No title' }}</a
        >
        <span v-else>{{ reference?.title || 'No title' }}</span>
      </p>
      <p class="text-xs text-blue-700">
        {{ reference?.source || 'No source' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Reference {
  title?: string
  source?: string
  url?: string
}

interface Props {
  references?: Reference[]
}

defineProps<Props>()
</script>
