<template>
  <div class="bg-background min-h-screen">
    <!-- Main Content -->
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Content Analysis</h1>
        <p class="mt-2 text-sm text-gray-600">
          AI-powered content detection and manual tagging interface
        </p>
      </div>
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- Video Player Section -->
        <div class="lg:col-span-2">
          <div class="rounded-lg border bg-white shadow-sm">
            <div class="p-6">
              <h2 class="mb-4 text-lg font-medium text-gray-900">Video Player</h2>
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
              <!-- Video Controls -->
              <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <button class="p-2 text-gray-400 hover:text-gray-600">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </button>
                  <span class="text-sm text-gray-500">00:00 / 00:00</span>
                </div>
                <div class="flex items-center space-x-2">
                  <button class="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800">
                    Violence
                  </button>
                  <button class="rounded-full bg-red-100 px-3 py-1 text-xs text-red-800">
                    Nudity
                  </button>
                  <button class="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-800">
                    Profanity
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- AI Analysis Results -->
          <div class="mt-6 rounded-lg border bg-white shadow-sm">
            <div class="p-6">
              <h2 class="mb-4 text-lg font-medium text-gray-900">AI Analysis Results</h2>
              <div class="space-y-4">
                <div class="rounded-lg border p-4">
                  <div class="mb-2 flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-900"
                      >Scene 1: Violence Detection</span
                    >
                    <span class="text-sm text-gray-500">00:02:15 - 00:02:45</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="h-2 w-full rounded-full bg-gray-200">
                      <div class="h-2 rounded-full bg-red-600" style="width: 85%"></div>
                    </div>
                    <span class="text-sm font-medium text-gray-900">85%</span>
                  </div>
                </div>
                <div class="rounded-lg border p-4">
                  <div class="mb-2 flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-900">Scene 2: Nudity Detection</span>
                    <span class="text-sm text-gray-500">00:15:30 - 00:16:00</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="h-2 w-full rounded-full bg-gray-200">
                      <div class="h-2 rounded-full bg-yellow-600" style="width: 60%"></div>
                    </div>
                    <span class="text-sm font-medium text-gray-900">60%</span>
                  </div>
                </div>
                <div class="rounded-lg border p-4">
                  <div class="mb-2 flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-900"
                      >Scene 3: Profanity Detection</span
                    >
                    <span class="text-sm text-gray-500">00:45:12 - 00:45:18</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="h-2 w-full rounded-full bg-gray-200">
                      <div class="h-2 rounded-full bg-orange-600" style="width: 92%"></div>
                    </div>
                    <span class="text-sm font-medium text-gray-900">92%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tagging Panel -->
        <div class="lg:col-span-1">
          <div class="rounded-lg border bg-white shadow-sm">
            <div class="p-6">
              <h2 class="mb-4 text-lg font-medium text-gray-900">Manual Tagging</h2>

              <!-- Content Categories -->
              <div class="mb-6">
                <label class="mb-2 block text-sm font-medium text-gray-700">Content Category</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      class="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Violence</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      class="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Nudity</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Profanity</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Drug Use</span>
                  </label>
                </div>
              </div>

              <!-- Severity Level -->
              <div class="mb-6">
                <label class="mb-2 block text-sm font-medium text-gray-700">Severity Level</label>
                <select class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Extreme</option>
                </select>
              </div>

              <!-- Age Rating Suggestion -->
              <div class="mb-6">
                <label class="mb-2 block text-sm font-medium text-gray-700"
                  >Suggested Age Rating</label
                >
                <div class="rounded-md border border-blue-200 bg-blue-50 p-3">
                  <p class="text-sm font-medium text-blue-900">R (Restricted)</p>
                  <p class="mt-1 text-xs text-blue-700">Based on detected violence and profanity</p>
                </div>
              </div>

              <!-- Notes -->
              <div class="mb-6">
                <label class="mb-2 block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  rows="3"
                  placeholder="Add any additional notes or context..."
                ></textarea>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-2">
                <button
                  class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save Tag
                </button>
                <button
                  class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Content Analysis view - Step 1 implementation
// This will be enhanced in Step 2 with real AI analysis and tagging functionality
</script>
