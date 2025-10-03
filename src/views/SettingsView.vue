<template>
  <div class="bg-background min-h-screen">
    <!-- Main Content -->
    <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Settings</h1>
        <p class="mt-2 text-sm text-gray-600">
          Configure content guidelines, system preferences, and user settings
        </p>
      </div>
      <div class="space-y-8">
        <!-- Content Guidelines -->
        <div class="rounded-lg border bg-white shadow-sm">
          <div class="p-6">
            <h2 class="mb-4 text-lg font-medium text-gray-900">Content Guidelines</h2>

            <!-- Content Categories -->
            <div class="mb-6">
              <label class="mb-2 block text-sm font-medium text-gray-700">Content Categories</label>
              <div class="space-y-3">
                <div class="flex items-center justify-between rounded-lg border p-3">
                  <div class="flex items-center">
                    <div class="mr-3 h-3 w-3 rounded-full bg-red-500"></div>
                    <span class="text-sm font-medium text-gray-900">Violence</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-xs text-gray-500">Severity levels: 4</span>
                    <button class="text-sm text-blue-600 hover:text-blue-800">Edit</button>
                  </div>
                </div>
                <div class="flex items-center justify-between rounded-lg border p-3">
                  <div class="flex items-center">
                    <div class="mr-3 h-3 w-3 rounded-full bg-yellow-500"></div>
                    <span class="text-sm font-medium text-gray-900">Nudity</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-xs text-gray-500">Severity levels: 3</span>
                    <button class="text-sm text-blue-600 hover:text-blue-800">Edit</button>
                  </div>
                </div>
                <div class="flex items-center justify-between rounded-lg border p-3">
                  <div class="flex items-center">
                    <div class="mr-3 h-3 w-3 rounded-full bg-orange-500"></div>
                    <span class="text-sm font-medium text-gray-900">Profanity</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-xs text-gray-500">Severity levels: 3</span>
                    <button class="text-sm text-blue-600 hover:text-blue-800">Edit</button>
                  </div>
                </div>
                <div class="flex items-center justify-between rounded-lg border p-3">
                  <div class="flex items-center">
                    <div class="mr-3 h-3 w-3 rounded-full bg-purple-500"></div>
                    <span class="text-sm font-medium text-gray-900">Drug Use</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-xs text-gray-500">Severity levels: 3</span>
                    <button class="text-sm text-blue-600 hover:text-blue-800">Edit</button>
                  </div>
                </div>
              </div>
              <button class="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800">
                + Add New Category
              </button>
            </div>

            <!-- Age Rating Criteria -->
            <div class="mb-6">
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >Age Rating Criteria</label
              >
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div class="rounded-lg border p-4">
                  <h3 class="mb-2 font-medium text-gray-900">G - General Audiences</h3>
                  <p class="text-sm text-gray-600">No objectionable content</p>
                </div>
                <div class="rounded-lg border p-4">
                  <h3 class="mb-2 font-medium text-gray-900">PG - Parental Guidance</h3>
                  <p class="text-sm text-gray-600">Mild content, parental guidance suggested</p>
                </div>
                <div class="rounded-lg border p-4">
                  <h3 class="mb-2 font-medium text-gray-900">PG-13 - Parents Strongly Cautioned</h3>
                  <p class="text-sm text-gray-600">Moderate content, not suitable for under 13</p>
                </div>
                <div class="rounded-lg border p-4">
                  <h3 class="mb-2 font-medium text-gray-900">R - Restricted</h3>
                  <p class="text-sm text-gray-600">Strong content, restricted to 17+</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Configuration -->
        <div class="rounded-lg border bg-white shadow-sm">
          <div class="p-6">
            <h2 class="mb-4 text-lg font-medium text-gray-900">System Configuration</h2>

            <!-- AI Model Settings -->
            <div class="mb-6">
              <label class="mb-2 block text-sm font-medium text-gray-700">AI Model Settings</label>
              <div class="space-y-4">
                <div>
                  <label class="mb-1 block text-sm text-gray-600">Confidence Threshold</label>
                  <div class="flex items-center space-x-4">
                    <input type="range" min="0" max="100" value="75" class="flex-1" />
                    <span class="text-sm font-medium text-gray-900">75%</span>
                  </div>
                </div>
                <div>
                  <label class="mb-1 block text-sm text-gray-600">Processing Priority</label>
                  <select class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                    <option>High</option>
                    <option selected>Normal</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Export Settings -->
            <div class="mb-6">
              <label class="mb-2 block text-sm font-medium text-gray-700">Export Settings</label>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    checked
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">Include screenshots in reports</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    checked
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">Include timestamps for all scenes</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">Auto-generate executive summary</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- User Preferences -->
        <div class="rounded-lg border bg-white shadow-sm">
          <div class="p-6">
            <h2 class="mb-4 text-lg font-medium text-gray-900">User Preferences</h2>

            <!-- Interface Settings -->
            <div class="mb-6">
              <label class="mb-2 block text-sm font-medium text-gray-700">Interface Settings</label>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    checked
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">Dark mode</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">Auto-save drafts</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    checked
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">Show notifications</span>
                </label>
              </div>
            </div>

            <!-- Language Settings -->
            <div class="mb-6">
              <label class="mb-2 block text-sm font-medium text-gray-700">Language</label>
              <select class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                <option selected>English</option>
                <option>Vietnamese</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Save Settings -->
        <div class="flex justify-end">
          <button
            class="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Settings view - Step 1 implementation
// This will be enhanced in Step 2 with real configuration functionality
</script>
