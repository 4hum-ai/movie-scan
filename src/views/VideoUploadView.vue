<template>
  <div class="bg-background min-h-screen">
    <!-- Main Content -->
    <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Video Upload</h1>
        <p class="mt-2 text-sm text-gray-600">Upload and prepare films for AI content analysis</p>
      </div>
      <!-- Upload Area -->
      <div class="rounded-lg border bg-white shadow-sm">
        <div class="p-8">
          <div class="text-center">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div class="mt-4">
              <label for="file-upload" class="cursor-pointer">
                <span class="mt-2 block text-sm font-medium text-gray-900">
                  Upload video files
                </span>
                <span class="mt-1 block text-sm text-gray-500">
                  Drag and drop files here, or click to select
                </span>
              </label>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                class="sr-only"
                accept="video/*"
                multiple
              />
            </div>
            <div class="mt-4">
              <p class="text-xs text-gray-500">
                Supported formats: MP4, AVI, MOV • Max file size: 10GB
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Upload Progress (Hidden initially) -->
      <div class="mt-6 hidden rounded-lg border bg-white shadow-sm">
        <div class="p-6">
          <h3 class="mb-4 text-lg font-medium text-gray-900">Upload Progress</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">sample-video.mp4</span>
              <span class="text-sm text-gray-500">2.3 GB</span>
            </div>
            <div class="h-2 w-full rounded-full bg-gray-200">
              <div class="h-2 rounded-full bg-blue-600" style="width: 45%"></div>
            </div>
            <p class="text-sm text-gray-500">Uploading... 45% complete</p>
          </div>
        </div>
      </div>

      <!-- Video Preview (Hidden initially) -->
      <div class="mt-6 hidden rounded-lg border bg-white shadow-sm">
        <div class="p-6">
          <h3 class="mb-4 text-lg font-medium text-gray-900">Video Preview</h3>
          <div class="flex aspect-video items-center justify-center rounded-lg bg-gray-100">
            <div class="text-center">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-5-8V6a2 2 0 012-2h2a2 2 0 012 2v2M7 7h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z"
                ></path>
              </svg>
              <p class="mt-2 text-sm text-gray-500">Video player will appear here</p>
            </div>
          </div>
          <div class="mt-4 flex justify-end space-x-3">
            <button
              class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Start Analysis
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Uploads -->
      <div class="mt-8">
        <h2 class="mb-4 text-lg font-medium text-gray-900">Recent Uploads</h2>
        <div class="rounded-lg border bg-white shadow-sm">
          <div class="p-6">
            <p class="text-center text-gray-500">No recent uploads to display</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Video Upload view - Step 1 implementation
// This will be enhanced in Step 2 with real upload functionality
</script>
