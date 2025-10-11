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
    <div class="relative mx-auto max-w-7xl px-4 pt-24 pb-8 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="animate-fade-in mb-12 text-center">
        <div
          class="animate-scale-in mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-1"
        >
          <div class="rounded-full bg-white px-4 py-2 dark:bg-gray-900">
            <h1
              class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent"
            >
              Dashboard
            </h1>
          </div>
        </div>
        <p class="animate-slide-up text-lg text-gray-600 dark:text-gray-300">
          AI-powered film content analysis and compliance platform
        </p>
      </div>

      <!-- Quick Actions -->
      <div class="mb-12">
        <h2 class="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- Process Video Card -->
          <div
            class="group animate-slide-up relative overflow-hidden rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl dark:bg-gray-800/80"
            style="animation-delay: 0.1s"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            ></div>
            <div class="relative">
              <div class="mb-4 flex items-center justify-between">
                <div class="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 p-3">
                  <svg
                    class="h-8 w-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <div class="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
              </div>
              <h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-white">Process Video</h3>
              <p class="mb-6 text-gray-600 dark:text-gray-300">
                Upload, analyze, and review film content for compliance using advanced AI detection
              </p>
              <router-link
                to="/process"
                class="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl"
              >
                <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
                Start Processing
              </router-link>
            </div>
          </div>

          <!-- Generate Report Card -->
          <div
            class="group animate-slide-up relative overflow-hidden rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl dark:bg-gray-800/80"
            style="animation-delay: 0.2s"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            ></div>
            <div class="relative">
              <div class="mb-4 flex items-center justify-between">
                <div class="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-3">
                  <svg
                    class="h-8 w-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                </div>
                <div class="h-2 w-2 animate-pulse rounded-full bg-purple-400"></div>
              </div>
              <h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-white">Generate Report</h3>
              <p class="mb-6 text-gray-600 dark:text-gray-300">
                Create comprehensive compliance reports and export detailed documentation
              </p>
              <router-link
                to="/reports"
                class="inline-flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl"
              >
                <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                Generate Report
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="mb-12">
        <h2 class="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Recent Activity
        </h2>
        <div
          class="animate-slide-up rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm dark:bg-gray-800/80"
          style="animation-delay: 0.3s"
        >
          <div class="flex flex-col items-center justify-center py-12">
            <div
              class="mb-4 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 p-6 dark:from-gray-700 dark:to-gray-600"
            >
              <svg
                class="h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                ></path>
              </svg>
            </div>
            <h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              No Recent Activity
            </h3>
            <p class="text-center text-gray-500 dark:text-gray-400">
              Start processing videos to see your activity feed here
            </p>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total Films -->
        <div
          class="group animate-slide-up relative overflow-hidden rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl dark:bg-gray-800/80"
          style="animation-delay: 0.4s"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          ></div>
          <div class="relative">
            <div class="mb-4 flex items-center justify-between">
              <div class="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 p-3">
                <svg
                  class="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12h6m-6 4h6"
                  ></path>
                </svg>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Films</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">0</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Completed -->
        <div
          class="group animate-slide-up relative overflow-hidden rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl dark:bg-gray-800/80"
          style="animation-delay: 0.5s"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          ></div>
          <div class="relative">
            <div class="mb-4 flex items-center justify-between">
              <div class="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 p-3">
                <svg
                  class="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">0</p>
              </div>
            </div>
          </div>
        </div>

        <!-- In Progress -->
        <div
          class="group animate-slide-up relative overflow-hidden rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl dark:bg-gray-800/80"
          style="animation-delay: 0.6s"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          ></div>
          <div class="relative">
            <div class="mb-4 flex items-center justify-between">
              <div class="rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 p-3">
                <svg
                  class="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">0</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Reports Generated -->
        <div
          class="group animate-slide-up relative overflow-hidden rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl dark:bg-gray-800/80"
          style="animation-delay: 0.7s"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          ></div>
          <div class="relative">
            <div class="mb-4 flex items-center justify-between">
              <div class="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-3">
                <svg
                  class="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Reports Generated
                </p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Dashboard view - Step 1 implementation
// This will be enhanced in Step 2 with real data and functionality
</script>
