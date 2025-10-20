<template>
  <div class="rounded-lg border bg-white p-6 shadow-sm">
    <h2 class="mb-4 text-lg font-semibold text-gray-900">Processing Status</h2>
    <div class="flex items-center space-x-4">
      <div
        class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
      ></div>
      <div>
        <p class="text-sm font-medium text-gray-900">AI analysis in progress...</p>
        <p class="text-sm text-gray-600">This may take several minutes depending on video length</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// presentational
</script>
