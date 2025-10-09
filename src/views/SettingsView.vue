<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
  >
    <!-- Background Pattern -->
    <div
      class="absolute inset-0 opacity-40"
      style="
        background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;);
      "
    ></div>

    <!-- Main Content -->
    <div class="relative mx-auto max-w-6xl px-4 pt-24 pb-8 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="animate-fade-in mb-12 text-center">
        <div
          class="animate-scale-in mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-1"
        >
          <div class="rounded-full bg-white px-4 py-2 dark:bg-gray-900">
            <h1
              class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent"
            >
              Settings
            </h1>
          </div>
        </div>
        <p class="animate-slide-up text-lg text-gray-600 dark:text-gray-300">
          Configure content guidelines, system preferences, and user settings
        </p>
      </div>
      <div class="space-y-8">
        <!-- Content Guidelines -->
        <div
          class="animate-slide-up rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm dark:bg-gray-800/80"
          style="animation-delay: 0.1s"
        >
          <div class="mb-6 flex items-center space-x-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-orange-500 shadow-lg"
            >
              <IconShield class="h-5 w-5 text-white" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Content Guidelines</h2>
          </div>

          <!-- Content Categories -->
          <div class="mb-8">
            <label class="mb-4 block text-lg font-semibold text-gray-700 dark:text-gray-300"
              >Content Categories</label
            >
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div
                class="group rounded-xl bg-gradient-to-r from-red-50 to-red-100 p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg dark:from-red-900/20 dark:to-red-800/20"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div
                      class="h-4 w-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-sm"
                    ></div>
                    <span class="text-sm font-bold text-gray-900 dark:text-white">Violence</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <span
                      class="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-red-600 shadow-sm dark:bg-gray-700/80"
                      >4 levels</span
                    >
                    <button
                      class="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>

              <div
                class="group rounded-xl bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg dark:from-yellow-900/20 dark:to-yellow-800/20"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div
                      class="h-4 w-4 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-sm"
                    ></div>
                    <span class="text-sm font-bold text-gray-900 dark:text-white">Nudity</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <span
                      class="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-yellow-600 shadow-sm dark:bg-gray-700/80"
                      >3 levels</span
                    >
                    <button
                      class="rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>

              <div
                class="group rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg dark:from-orange-900/20 dark:to-orange-800/20"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div
                      class="h-4 w-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-sm"
                    ></div>
                    <span class="text-sm font-bold text-gray-900 dark:text-white">Profanity</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <span
                      class="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-orange-600 shadow-sm dark:bg-gray-700/80"
                      >3 levels</span
                    >
                    <button
                      class="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>

              <div
                class="group rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg dark:from-purple-900/20 dark:to-purple-800/20"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div
                      class="h-4 w-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 shadow-sm"
                    ></div>
                    <span class="text-sm font-bold text-gray-900 dark:text-white">Drug Use</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <span
                      class="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-purple-600 shadow-sm dark:bg-gray-700/80"
                      >3 levels</span
                    >
                    <button
                      class="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button
              class="mt-4 inline-flex items-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <IconPlus class="mr-2 h-4 w-4" />
              Add New Category
            </button>
          </div>

          <!-- Age Rating Criteria -->
          <div class="mb-8">
            <label class="mb-4 block text-lg font-semibold text-gray-700 dark:text-gray-300"
              >Age Rating Criteria</label
            >
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div
                class="group rounded-xl bg-gradient-to-r from-green-50 to-green-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg dark:from-green-900/20 dark:to-green-800/20"
              >
                <div class="mb-3 flex items-start space-x-3">
                  <div
                    class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 text-sm font-bold text-white shadow-lg"
                  >
                    G
                  </div>
                  <div class="min-w-0 flex-1">
                    <h3 class="text-base leading-tight font-bold text-gray-900 dark:text-white">
                      General Audiences
                    </h3>
                  </div>
                </div>
                <p class="text-sm leading-relaxed text-green-700 dark:text-green-300">
                  No objectionable content
                </p>
              </div>

              <div
                class="group rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg dark:from-blue-900/20 dark:to-blue-800/20"
              >
                <div class="mb-3 flex items-start space-x-3">
                  <div
                    class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-sm font-bold text-white shadow-lg"
                  >
                    PG
                  </div>
                  <div class="min-w-0 flex-1">
                    <h3 class="text-base leading-tight font-bold text-gray-900 dark:text-white">
                      Parental Guidance
                    </h3>
                  </div>
                </div>
                <p class="text-sm leading-relaxed text-blue-700 dark:text-blue-300">
                  Mild content, parental guidance suggested
                </p>
              </div>

              <div
                class="group rounded-xl bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg dark:from-yellow-900/20 dark:to-yellow-800/20"
              >
                <div class="mb-3 flex items-start space-x-3">
                  <div
                    class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-xs font-bold text-white shadow-lg"
                  >
                    PG-13
                  </div>
                  <div class="min-w-0 flex-1">
                    <h3 class="text-base leading-tight font-bold text-gray-900 dark:text-white">
                      Parents Strongly Cautioned
                    </h3>
                  </div>
                </div>
                <p class="text-sm leading-relaxed text-yellow-700 dark:text-yellow-300">
                  Moderate content, not suitable for under 13
                </p>
              </div>

              <div
                class="group rounded-xl bg-gradient-to-r from-red-50 to-red-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg dark:from-red-900/20 dark:to-red-800/20"
              >
                <div class="mb-3 flex items-start space-x-3">
                  <div
                    class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 text-sm font-bold text-white shadow-lg"
                  >
                    R
                  </div>
                  <div class="min-w-0 flex-1">
                    <h3 class="text-base leading-tight font-bold text-gray-900 dark:text-white">
                      Restricted
                    </h3>
                  </div>
                </div>
                <p class="text-sm leading-relaxed text-red-700 dark:text-red-300">
                  Strong content, restricted to 17+
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- System Configuration -->
        <div
          class="animate-slide-up rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm dark:bg-gray-800/80"
          style="animation-delay: 0.2s"
        >
          <div class="mb-6 flex items-center space-x-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg"
            >
              <IconCog class="h-5 w-5 text-white" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">System Configuration</h2>
          </div>

          <!-- AI Model Settings -->
          <div class="mb-8">
            <label class="mb-4 block text-lg font-semibold text-gray-700 dark:text-gray-300"
              >AI Model Settings</label
            >
            <div class="space-y-6">
              <div
                class="rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 p-6 dark:from-blue-900/20 dark:to-cyan-900/20"
              >
                <label class="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >Confidence Threshold</label
                >
                <div class="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value="75"
                    class="h-2 flex-1 appearance-none rounded-lg bg-gradient-to-r from-blue-200 to-cyan-200 dark:from-blue-700 dark:to-cyan-700"
                  />
                  <span
                    class="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 text-sm font-bold text-white shadow-lg"
                    >75%</span
                  >
                </div>
              </div>

              <div
                class="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-6 dark:from-green-900/20 dark:to-emerald-900/20"
              >
                <label class="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >Processing Priority</label
                >
                <select
                  class="w-full rounded-xl border-0 bg-white/80 px-4 py-3 text-sm font-semibold shadow-lg backdrop-blur-sm focus:ring-2 focus:ring-green-500 dark:bg-gray-700/80"
                >
                  <option>High</option>
                  <option selected>Normal</option>
                  <option>Low</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Export Settings -->
          <div class="mb-8">
            <label class="mb-4 block text-lg font-semibold text-gray-700 dark:text-gray-300"
              >Export Settings</label
            >
            <div class="space-y-4">
              <div
                class="group rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md dark:from-purple-900/20 dark:to-pink-900/20"
              >
                <label class="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked
                    class="h-5 w-5 rounded-lg border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white focus:ring-2 focus:ring-purple-500"
                  />
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >Include screenshots in reports</span
                  >
                </label>
              </div>

              <div
                class="group rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md dark:from-indigo-900/20 dark:to-blue-900/20"
              >
                <label class="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked
                    class="h-5 w-5 rounded-lg border-0 bg-gradient-to-r from-indigo-500 to-blue-500 text-white focus:ring-2 focus:ring-indigo-500"
                  />
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >Include timestamps for all scenes</span
                  >
                </label>
              </div>

              <div
                class="group rounded-xl bg-gradient-to-r from-orange-50 to-red-50 p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md dark:from-orange-900/20 dark:to-red-900/20"
              >
                <label class="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    class="h-5 w-5 rounded-lg border-0 bg-gradient-to-r from-orange-500 to-red-500 text-white focus:ring-2 focus:ring-orange-500"
                  />
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >Auto-generate executive summary</span
                  >
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- User Preferences -->
        <div
          class="animate-slide-up rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm dark:bg-gray-800/80"
          style="animation-delay: 0.3s"
        >
          <div class="mb-6 flex items-center space-x-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
            >
              <IconUser class="h-5 w-5 text-white" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">User Preferences</h2>
          </div>

          <!-- Interface Settings -->
          <div class="mb-8">
            <label class="mb-4 block text-lg font-semibold text-gray-700 dark:text-gray-300"
              >Interface Settings</label
            >
            <div class="space-y-4">
              <div
                class="group rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md dark:from-slate-900/20 dark:to-gray-900/20"
              >
                <label class="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked
                    class="h-5 w-5 rounded-lg border-0 bg-gradient-to-r from-slate-500 to-gray-500 text-white focus:ring-2 focus:ring-slate-500"
                  />
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >Dark mode</span
                  >
                </label>
              </div>

              <div
                class="group rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md dark:from-emerald-900/20 dark:to-teal-900/20"
              >
                <label class="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    class="h-5 w-5 rounded-lg border-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white focus:ring-2 focus:ring-emerald-500"
                  />
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >Auto-save drafts</span
                  >
                </label>
              </div>

              <div
                class="group rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md dark:from-amber-900/20 dark:to-yellow-900/20"
              >
                <label class="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked
                    class="h-5 w-5 rounded-lg border-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-white focus:ring-2 focus:ring-amber-500"
                  />
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >Show notifications</span
                  >
                </label>
              </div>
            </div>
          </div>

          <!-- Language Settings -->
          <div class="mb-8">
            <label class="mb-4 block text-lg font-semibold text-gray-700 dark:text-gray-300"
              >Language</label
            >
            <div
              class="rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 p-6 dark:from-violet-900/20 dark:to-purple-900/20"
            >
              <select
                class="w-full rounded-xl border-0 bg-white/80 px-4 py-3 text-sm font-semibold shadow-lg backdrop-blur-sm focus:ring-2 focus:ring-violet-500 dark:bg-gray-700/80"
              >
                <option selected>English</option>
                <option>Vietnamese</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Save Settings -->
        <div class="animate-slide-up flex justify-center" style="animation-delay: 0.4s">
          <button
            class="group hover:shadow-3xl relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-12 py-4 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div
              class="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            ></div>
            <div class="relative flex items-center space-x-3">
              <IconCheck class="h-5 w-5" />
              <span>Save Settings</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconShield from '~icons/mdi/shield'
import IconPlus from '~icons/mdi/plus'
import IconCog from '~icons/mdi/cog'
import IconUser from '~icons/mdi/account'
import IconCheck from '~icons/mdi/check'

// Settings view - Modern Glassmorphism Design
// This will be enhanced with real configuration functionality
</script>
