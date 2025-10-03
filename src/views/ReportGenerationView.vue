<template>
  <div class="bg-background min-h-screen">
    <!-- Main Content -->
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Report Generation</h1>
        <p class="mt-2 text-sm text-gray-600">
          Create comprehensive compliance reports and export documentation
        </p>
      </div>
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- Report Builder -->
        <div class="lg:col-span-2">
          <div class="rounded-lg border bg-white shadow-sm">
            <div class="p-6">
              <h2 class="mb-4 text-lg font-medium text-gray-900">Report Builder</h2>

              <!-- Report Template Selection -->
              <div class="mb-6">
                <label class="mb-2 block text-sm font-medium text-gray-700">Report Template</label>
                <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div class="cursor-pointer rounded-lg border p-4 hover:bg-gray-50">
                    <h3 class="font-medium text-gray-900">Government Certification</h3>
                    <p class="mt-1 text-sm text-gray-500">
                      Official compliance report for regulatory bodies
                    </p>
                  </div>
                  <div class="cursor-pointer rounded-lg border p-4 hover:bg-gray-50">
                    <h3 class="font-medium text-gray-900">Internal Analysis</h3>
                    <p class="mt-1 text-sm text-gray-500">Detailed analysis for internal review</p>
                  </div>
                  <div class="cursor-pointer rounded-lg border p-4 hover:bg-gray-50">
                    <h3 class="font-medium text-gray-900">Distributor Summary</h3>
                    <p class="mt-1 text-sm text-gray-500">
                      Summary report for content distributors
                    </p>
                  </div>
                </div>
              </div>

              <!-- Report Sections -->
              <div class="mb-6">
                <label class="mb-2 block text-sm font-medium text-gray-700">Report Sections</label>
                <div class="space-y-3">
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      checked
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Executive Summary</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      checked
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Content Analysis Results</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      checked
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Detected Scenes with Timestamps</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      checked
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Age Rating Recommendation</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Visual Evidence (Screenshots)</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Compliance Checklist</span>
                  </label>
                </div>
              </div>

              <!-- Report Preview -->
              <div class="mb-6">
                <h3 class="mb-2 text-sm font-medium text-gray-700">Report Preview</h3>
                <div class="min-h-64 rounded-lg border bg-gray-50 p-4">
                  <div class="text-center text-gray-500">
                    <svg
                      class="mx-auto mb-4 h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                    <p>Report preview will appear here</p>
                  </div>
                </div>
              </div>

              <!-- Export Options -->
              <div class="flex justify-end space-x-3">
                <button
                  class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Save Draft
                </button>
                <button
                  class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Export Panel -->
        <div class="lg:col-span-1">
          <div class="rounded-lg border bg-white shadow-sm">
            <div class="p-6">
              <h2 class="mb-4 text-lg font-medium text-gray-900">Export Options</h2>

              <!-- Export Format -->
              <div class="mb-6">
                <label class="mb-2 block text-sm font-medium text-gray-700">Export Format</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      type="radio"
                      name="format"
                      value="pdf"
                      checked
                      class="text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">PDF Document</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      name="format"
                      value="docx"
                      class="text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Word Document (DOCX)</span>
                  </label>
                </div>
              </div>

              <!-- Report Details -->
              <div class="mb-6">
                <h3 class="mb-2 text-sm font-medium text-gray-700">Report Details</h3>
                <div class="space-y-2 text-sm text-gray-600">
                  <div class="flex justify-between">
                    <span>Film Title:</span>
                    <span class="font-medium">Sample Movie</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Duration:</span>
                    <span class="font-medium">2h 15m</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Analysis Date:</span>
                    <span class="font-medium">2024-01-15</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Detected Scenes:</span>
                    <span class="font-medium">12</span>
                  </div>
                </div>
              </div>

              <!-- Export Actions -->
              <div class="space-y-2">
                <button
                  class="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Export PDF
                </button>
                <button
                  class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Export DOCX
                </button>
                <button
                  class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Preview Report
                </button>
              </div>
            </div>
          </div>

          <!-- Recent Reports -->
          <div class="mt-6 rounded-lg border bg-white shadow-sm">
            <div class="p-6">
              <h2 class="mb-4 text-lg font-medium text-gray-900">Recent Reports</h2>
              <div class="space-y-3">
                <div class="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p class="text-sm font-medium text-gray-900">Action Movie Report</p>
                    <p class="text-xs text-gray-500">2024-01-14</p>
                  </div>
                  <button class="text-sm text-blue-600 hover:text-blue-800">Download</button>
                </div>
                <div class="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p class="text-sm font-medium text-gray-900">Drama Film Report</p>
                    <p class="text-xs text-gray-500">2024-01-13</p>
                  </div>
                  <button class="text-sm text-blue-600 hover:text-blue-800">Download</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Report Generation view - Step 1 implementation
// This will be enhanced in Step 2 with real report generation and export functionality
</script>
