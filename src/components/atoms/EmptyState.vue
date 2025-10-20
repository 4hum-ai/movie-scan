<template>
  <div class="rounded-lg border border-dashed border-gray-300 p-4 text-center">
    <svg
      class="mx-auto h-8 w-8 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      ></path>
    </svg>
    <p class="mt-2 text-sm text-gray-500">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
}

defineProps<Props>()
</script>
