<template>
  <div class="rounded-lg border bg-white p-6 shadow-sm">
    <h2 class="mb-4 text-lg font-semibold text-gray-900">Processing Failed</h2>
    <div class="flex items-center space-x-4">
      <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div>
        <p class="text-sm font-medium text-gray-900">Analysis failed to complete</p>
        <p class="text-sm text-gray-600">Please try processing the video again</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// presentational
</script>
