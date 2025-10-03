<template>
  <div class="bg-background min-h-screen">
    <!-- Main Content -->
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-2 text-sm text-gray-600">
          AI-powered film content analysis and compliance platform
        </p>
      </div>
      <!-- Quick Actions -->
      <div class="mb-8">
        <h2 class="mb-4 text-xl font-semibold text-gray-900">Quick Actions</h2>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="rounded-lg border bg-white p-6 shadow-sm">
            <h3 class="mb-2 text-lg font-medium text-gray-900">Process Video</h3>
            <p class="mb-4 text-gray-600">
              Upload, analyze, and review film content for compliance
            </p>
            <router-link
              to="/process"
              class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Start Processing
            </router-link>
          </div>
          <div class="rounded-lg border bg-white p-6 shadow-sm">
            <h3 class="mb-2 text-lg font-medium text-gray-900">Generate Report</h3>
            <p class="mb-4 text-gray-600">Create compliance reports and export documentation</p>
            <router-link
              to="/reports"
              class="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              Generate Report
            </router-link>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="mb-8">
        <h2 class="mb-4 text-xl font-semibold text-gray-900">Recent Activity</h2>
        <div class="rounded-lg border bg-white shadow-sm">
          <div class="p-6">
            <p class="text-center text-gray-500">No recent activity to display</p>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div class="rounded-lg border bg-white p-6 shadow-sm">
          <div class="flex items-center">
            <div class="rounded-lg bg-blue-100 p-2">
              <svg
                class="h-6 w-6 text-blue-600"
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
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Films</p>
              <p class="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>
        <div class="rounded-lg border bg-white p-6 shadow-sm">
          <div class="flex items-center">
            <div class="rounded-lg bg-green-100 p-2">
              <svg
                class="h-6 w-6 text-green-600"
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
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Completed</p>
              <p class="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>
        <div class="rounded-lg border bg-white p-6 shadow-sm">
          <div class="flex items-center">
            <div class="rounded-lg bg-yellow-100 p-2">
              <svg
                class="h-6 w-6 text-yellow-600"
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
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">In Progress</p>
              <p class="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>
        <div class="rounded-lg border bg-white p-6 shadow-sm">
          <div class="flex items-center">
            <div class="rounded-lg bg-purple-100 p-2">
              <svg
                class="h-6 w-6 text-purple-600"
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
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Reports Generated</p>
              <p class="text-2xl font-semibold text-gray-900">0</p>
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
