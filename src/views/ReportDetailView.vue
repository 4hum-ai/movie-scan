<template>
  <div class="bg-background min-h-screen">
    <!-- Main Content -->
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <div class="mb-6">
        <router-link
          to="/reports"
          class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          Back to Reports
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="flex flex-col items-center">
          <div
            class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
          ></div>
          <p class="mt-2 text-sm text-gray-600">Loading report...</p>
        </div>
      </div>

      <!-- Report Not Found -->
      <div v-else-if="!report" class="py-12 text-center">
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Report not found</h3>
        <p class="mt-1 text-sm text-gray-500">
          The report you're looking for doesn't exist or has been deleted.
        </p>
        <div class="mt-6">
          <router-link
            to="/reports"
            class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            View All Reports
          </router-link>
        </div>
      </div>

      <!-- Report Content -->
      <div v-else>
        <!-- Report Header -->
        <div class="mb-8 rounded-lg border bg-white p-6 shadow-sm">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <h1 class="text-2xl font-bold text-gray-900">{{ report.id }}</h1>
                <span
                  class="inline-flex rounded-full px-3 py-1 text-sm font-medium"
                  :class="getStatusClass(report.status)"
                >
                  {{ getStatusText(report.status) }}
                </span>
              </div>
              <p class="mt-2 text-sm text-gray-600">
                Created {{ formatDate(report.createdAt) }} at {{ formatTime(report.createdAt) }}
              </p>
              <div v-if="report.completedAt" class="mt-1 text-sm text-gray-600">
                Completed {{ formatDate(report.completedAt) }} at
                {{ formatTime(report.completedAt) }}
                <span class="ml-2 text-gray-500">
                  (Processing time: {{ formatDuration(report.processingDuration) }})
                </span>
              </div>
            </div>
            <div class="flex space-x-3">
              <button
                v-if="report.status === 'completed'"
                @click="() => exportReport()"
                class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Export Report
              </button>
              <button
                @click="deleteReport"
                class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete Report
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <!-- Main Content -->
          <div class="space-y-8 lg:col-span-2">
            <!-- Video Information -->
            <div class="rounded-lg border bg-white p-6 shadow-sm">
              <h2 class="mb-4 text-lg font-semibold text-gray-900">Video Information</h2>
              <div class="flex items-start space-x-4">
                <img
                  :src="report.videoFile.thumbnail"
                  :alt="report.videoFile.name"
                  class="h-24 w-32 rounded object-cover"
                />
                <div class="flex-1">
                  <h3 class="text-lg font-medium text-gray-900">{{ report.videoFile.name }}</h3>
                  <div class="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span class="font-medium">File Size:</span>
                      {{ formatFileSize(report.videoFile.size) }}
                    </div>
                    <div>
                      <span class="font-medium">Duration:</span>
                      {{ formatDuration(report.videoFile.duration) }}
                    </div>
                    <div>
                      <span class="font-medium">Rating System:</span>
                      {{ currentRatingSystem?.name || report.ratingSystem.toUpperCase() }}
                    </div>
                    <div v-if="report.suggestedRating">
                      <span class="font-medium">Suggested Rating:</span>
                      <span
                        class="ml-1 rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                      >
                        {{ report.suggestedRating }}
                      </span>
                    </div>
                    <div v-if="currentReference">
                      <span class="font-medium">Reference:</span>
                      <span class="ml-1 text-xs text-gray-500">{{ currentReference.title }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Analysis Results -->
            <div
              v-if="report.status === 'completed'"
              class="rounded-lg border bg-white p-6 shadow-sm"
            >
              <h2 class="mb-4 text-lg font-semibold text-gray-900">Analysis Results</h2>

              <!-- Executive Summary -->
              <div
                class="mb-8 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 shadow-lg"
              >
                <div class="mb-8 flex items-center">
                  <div class="flex-shrink-0">
                    <div
                      class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 shadow-sm"
                    >
                      <svg
                        class="h-7 w-7 text-blue-600"
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
                  </div>
                  <div class="ml-4">
                    <h3 class="text-2xl font-bold text-gray-900">Executive Summary</h3>
                    <p class="text-sm text-gray-600">
                      Content analysis overview and guideline violations
                    </p>
                  </div>
                </div>

                <!-- Text Summary -->
                <div
                  class="mb-8 rounded-xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm"
                >
                  <p class="text-base leading-relaxed text-gray-700">
                    This content analysis identified
                    <span
                      class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-semibold text-blue-800"
                      >{{ getMockAnalysisResults().length }}</span
                    >
                    guideline violations across
                    <span
                      class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-semibold text-blue-800"
                      >{{ getTotalViolationMinutes() }}</span
                    >
                    minutes of content. The most significant issues involve
                    <span
                      class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-semibold text-red-800"
                      >{{ getPrimaryViolationCategory() }}</span
                    >
                    with
                    <span
                      class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-semibold text-red-800"
                      >{{ getCriticalSeverityCount() }}</span
                    >
                    critical severity violations.
                  </p>
                </div>

                <!-- Guidelines Table -->
                <div class="overflow-x-auto">
                  <div
                    class="min-w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
                  >
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th
                            class="w-2/5 px-6 py-4 text-left text-sm font-bold tracking-wider text-gray-700 uppercase"
                          >
                            Guidelines
                          </th>
                          <th
                            class="w-1/6 px-6 py-4 text-center text-sm font-bold tracking-wider text-gray-700 uppercase"
                          >
                            Scenes
                          </th>
                          <th
                            class="w-1/6 px-6 py-4 text-center text-sm font-bold tracking-wider text-gray-700 uppercase"
                          >
                            Duration
                          </th>
                          <th
                            class="w-1/4 px-6 py-4 text-center text-sm font-bold tracking-wider text-gray-700 uppercase"
                          >
                            % of Total
                          </th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200 bg-white">
                        <tr
                          v-for="guideline in getGuidelinesTableData()"
                          :key="guideline.name"
                          class="transition-all duration-200 hover:bg-blue-50/50"
                        >
                          <td class="px-6 py-5 text-sm font-medium text-gray-900">
                            <div class="leading-relaxed break-words" :title="guideline.name">
                              {{ guideline.name }}
                            </div>
                          </td>
                          <td class="px-6 py-5 text-center text-sm text-gray-500">
                            <span
                              class="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold shadow-sm"
                              :class="
                                guideline.scenesDetected > 0
                                  ? 'bg-red-100 text-red-800 ring-2 ring-red-200'
                                  : 'bg-gray-100 text-gray-500 ring-2 ring-gray-200'
                              "
                            >
                              {{ guideline.scenesDetected }}
                            </span>
                          </td>
                          <td class="px-6 py-5 text-center text-sm text-gray-500">
                            <span class="font-semibold text-gray-700"
                              >{{ guideline.totalMinutes }}m</span
                            >
                          </td>
                          <td class="px-6 py-5 text-center text-sm text-gray-500">
                            <div class="flex flex-col items-center space-y-2">
                              <span class="text-sm font-bold text-gray-700"
                                >{{ guideline.percentageOfDuration }}%</span
                              >
                              <div class="h-3 w-24 rounded-full bg-gray-200 shadow-inner">
                                <div
                                  class="h-3 rounded-full shadow-sm transition-all duration-500"
                                  :class="
                                    parseFloat(guideline.percentageOfDuration) > 10
                                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                                      : parseFloat(guideline.percentageOfDuration) > 5
                                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                                        : 'bg-gradient-to-r from-green-500 to-green-600'
                                  "
                                  :style="{
                                    width:
                                      Math.min(parseFloat(guideline.percentageOfDuration), 100) +
                                      '%',
                                  }"
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Detected Scenes -->
              <div>
                <div class="mb-6 flex items-center">
                  <div class="flex-shrink-0">
                    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                      <svg
                        class="h-5 w-5 text-orange-600"
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
                  </div>
                  <div class="ml-3">
                    <h3 class="text-lg font-semibold text-gray-900">Detected Scenes</h3>
                    <p class="text-sm text-gray-500">Detailed analysis of content violations</p>
                  </div>
                </div>
                <div class="space-y-6">
                  <div
                    v-for="scene in getMockAnalysisResults()"
                    :key="scene.id"
                    class="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                  >
                    <!-- Scene Header with Timestamp as Title -->
                    <div
                      class="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4"
                    >
                      <!-- Title row with badges -->
                      <div class="mb-2 flex items-center justify-between">
                        <h4 class="text-2xl font-bold text-gray-900">
                          {{ scene.startTime }} - {{ scene.endTime }}
                        </h4>
                        <div class="flex space-x-2">
                          <span
                            class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm"
                            :class="getCategoryBadgeClass(scene.category)"
                          >
                            <svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                            {{ scene.confidence }}% confidence
                          </span>
                          <span
                            class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm"
                            :class="getSeverityBadgeClass(scene.severity)"
                          >
                            <svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fill-rule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                            {{ scene.severity }} severity
                          </span>
                        </div>
                      </div>
                      <!-- Subtitle row -->
                      <p class="text-sm text-gray-600">
                        {{ scene.violationMinutes }} min violation • {{ scene.category }}
                      </p>
                    </div>

                    <!-- Content Section -->
                    <div class="p-6">
                      <!-- Description -->
                      <div class="mb-6">
                        <p class="text-base leading-relaxed text-gray-700">
                          {{ scene.description }}
                        </p>
                      </div>

                      <!-- Video and Transcript Section -->
                      <div class="mb-8">
                        <h5 class="mb-4 text-lg font-semibold text-gray-900">Scene Content</h5>

                        <!-- Screenshots Grid -->
                        <div class="mb-6">
                          <h6 class="mb-3 text-sm font-medium text-gray-700">Scene Screenshots</h6>
                          <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
                            <div
                              v-for="(screenshot, index) in scene.screenshots"
                              :key="index"
                              class="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm transition-all duration-200 hover:shadow-md"
                            >
                              <img
                                :src="screenshot"
                                :alt="`Scene ${scene.id} screenshot ${index + 1}`"
                                class="h-20 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                              />
                              <div
                                class="bg-opacity-0 group-hover:bg-opacity-10 absolute inset-0 bg-black transition-all duration-200"
                              ></div>
                              <div
                                class="bg-opacity-75 absolute right-1 bottom-1 rounded bg-black px-1.5 py-0.5 text-xs text-white"
                              >
                                {{ index + 1 }}
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Transcript Section -->
                        <div v-if="scene.transcript">
                          <h6 class="mb-3 text-sm font-medium text-gray-700">Transcript</h6>
                          <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <p class="text-sm leading-relaxed text-gray-800">
                              <span
                                v-for="(word, index) in scene.transcript.split(' ')"
                                :key="index"
                                class="mr-1"
                                :class="
                                  scene.keywords.includes(word.toLowerCase().replace(/[^\w]/g, ''))
                                    ? 'rounded bg-yellow-200 px-1 font-semibold'
                                    : ''
                                "
                              >
                                {{ word }}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Analysis Section -->
                      <div class="border-t border-gray-200 pt-6">
                        <h5 class="mb-4 text-lg font-semibold text-gray-900">Analysis</h5>

                        <!-- Keywords -->
                        <div v-if="scene.keywords.length > 0" class="mb-4">
                          <h6 class="mb-2 text-sm font-medium text-gray-700">
                            Highlighted Keywords
                          </h6>
                          <div class="flex flex-wrap gap-2">
                            <span
                              v-for="keyword in scene.keywords"
                              :key="keyword"
                              class="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800"
                            >
                              {{ keyword }}
                            </span>
                          </div>
                        </div>

                        <!-- Analysis Grid -->
                        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                          <div>
                            <h6 class="mb-2 text-sm font-medium text-gray-700">Sentiment</h6>
                            <span
                              class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                              :class="getSentimentClass(scene.textAnalysis.sentiment)"
                            >
                              {{ scene.textAnalysis.sentiment }}
                            </span>
                          </div>
                          <div>
                            <h6 class="mb-2 text-sm font-medium text-gray-700">Key Phrases</h6>
                            <div class="flex flex-wrap gap-1">
                              <span
                                v-for="phrase in scene.textAnalysis.keyPhrases.slice(0, 3)"
                                :key="phrase"
                                class="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                              >
                                {{ phrase }}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h6 class="mb-2 text-sm font-medium text-gray-700">Language Issues</h6>
                            <div class="flex flex-wrap gap-1">
                              <span
                                v-for="issue in scene.textAnalysis.languageIssues.slice(0, 3)"
                                :key="issue"
                                class="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800"
                              >
                                {{ issue }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Overall Text Analysis -->
              <div class="mt-8">
                <h3 class="text-md mb-3 font-medium text-gray-900">Overall Text Analysis</h3>
                <div class="rounded-lg border bg-white p-6 shadow-sm">
                  <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                      <h4 class="text-sm font-medium text-gray-700">Transcript Summary</h4>
                      <div class="mt-2 space-y-1">
                        <p class="text-sm text-gray-600">
                          Total words: {{ getOverallAnalysis().transcriptSummary.totalWords }}
                        </p>
                        <p class="text-sm text-gray-600">
                          Flagged words: {{ getOverallAnalysis().transcriptSummary.flaggedWords }}
                        </p>
                        <p class="text-sm text-gray-600">Flag rate: {{ getFlagRate() }}%</p>
                      </div>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-700">Language Issues</h4>
                      <div class="mt-2">
                        <div
                          v-for="issue in getOverallAnalysis().transcriptSummary.languageIssues"
                          :key="issue"
                          class="mr-1 mb-1 inline-flex rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800"
                        >
                          {{ issue }}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-700">Category Statistics</h4>
                      <div class="mt-2 space-y-1">
                        <div
                          v-for="(stats, category) in getOverallAnalysis().categoryStats"
                          :key="category"
                          class="flex justify-between text-sm"
                        >
                          <span class="text-gray-600">{{ category }}:</span>
                          <span class="font-medium"
                            >{{ stats.count }} scenes, {{ stats.totalMinutes }}min</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Processing Status -->
            <div
              v-else-if="report.status === 'processing'"
              class="rounded-lg border bg-white p-6 shadow-sm"
            >
              <h2 class="mb-4 text-lg font-semibold text-gray-900">Processing Status</h2>
              <div class="flex items-center space-x-4">
                <div
                  class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
                ></div>
                <div>
                  <p class="text-sm font-medium text-gray-900">AI analysis in progress...</p>
                  <p class="text-sm text-gray-600">
                    This may take several minutes depending on video length
                  </p>
                </div>
              </div>
            </div>

            <!-- Failed Status -->
            <div
              v-else-if="report.status === 'failed'"
              class="rounded-lg border bg-white p-6 shadow-sm"
            >
              <h2 class="mb-4 text-lg font-semibold text-gray-900">Processing Failed</h2>
              <div class="flex items-center space-x-4">
                <svg
                  class="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-900">Analysis failed to complete</p>
                  <p class="text-sm text-gray-600">Please try processing the video again</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Guidelines Applied -->
            <div class="rounded-lg border bg-white p-6 shadow-sm">
              <h3 class="mb-4 text-lg font-semibold text-gray-900">Guidelines Applied</h3>

              <!-- Predefined Guidelines -->
              <div v-if="report.guidelines.length > 0" class="mb-4">
                <h4 class="mb-2 text-sm font-medium text-gray-700">Predefined Guidelines</h4>
                <div class="space-y-2">
                  <div
                    v-for="guideline in report.guidelines"
                    :key="guideline"
                    class="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked
                      disabled
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="text-sm text-gray-900">{{ guideline }}</span>
                    <span
                      class="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                      >Predefined</span
                    >
                  </div>
                </div>
              </div>

              <!-- Custom Guidelines -->
              <div v-if="report.customGuidelines.length > 0">
                <h4 class="mb-2 text-sm font-medium text-gray-700">Custom Guidelines</h4>
                <div class="space-y-2">
                  <div
                    v-for="guideline in report.customGuidelines"
                    :key="guideline"
                    class="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked
                      disabled
                      class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span class="text-sm text-gray-900">{{ guideline }}</span>
                    <span
                      class="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
                      >Custom</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Rating Information -->
            <div class="rounded-lg border bg-white p-6 shadow-sm">
              <h3 class="mb-4 text-lg font-semibold text-gray-900">Rating Information</h3>
              <div class="space-y-3">
                <div>
                  <span class="text-sm font-medium text-gray-700">Rating System:</span>
                  <span class="ml-2 text-sm text-gray-900">{{
                    currentRatingSystem?.name || report.ratingSystem.toUpperCase()
                  }}</span>
                </div>
                <div v-if="report.suggestedRating">
                  <span class="text-sm font-medium text-gray-700">Suggested Rating:</span>
                  <span
                    class="ml-2 rounded bg-blue-100 px-2 py-1 text-sm font-medium text-blue-800"
                  >
                    {{ report.suggestedRating }}
                  </span>
                </div>
                <div v-if="currentReference">
                  <span class="text-sm font-medium text-gray-700">Reference:</span>
                  <span class="ml-2 text-xs text-gray-500">{{ currentReference.title }}</span>
                </div>
                <div v-if="report.status === 'completed'">
                  <button
                    @click="showRatingOverride = !showRatingOverride"
                    class="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Override Rating
                  </button>
                  <div v-if="showRatingOverride" class="mt-2">
                    <select class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                      <option value="">Select new rating</option>
                      <!-- Vietnam Rating System -->
                      <template v-if="currentRatingSystem?.id === 'vietnam'">
                        <option value="P">P - Phổ cập (Suitable for all ages)</option>
                        <option value="K">K - Kèm theo (Under 13 with guardian)</option>
                        <option value="T13">T13 - Tuổi 13 (13+ only)</option>
                        <option value="T16">T16 - Tuổi 16 (16+ only)</option>
                        <option value="T18">T18 - Tuổi 18 (18+ only)</option>
                        <option value="C">C - Cấm (Prohibited)</option>
                      </template>
                      <!-- MPAA Rating System -->
                      <template v-else-if="report.ratingSystem === 'mpaa'">
                        <option value="G">G - General Audiences</option>
                        <option value="PG">PG - Parental Guidance</option>
                        <option value="PG-13">PG-13 - Parents Strongly Cautioned</option>
                        <option value="R">R - Restricted</option>
                        <option value="NC-17">NC-17 - No One 17 and Under Admitted</option>
                      </template>
                      <!-- BBFC Rating System -->
                      <template v-else-if="report.ratingSystem === 'bbfc'">
                        <option value="U">U - Universal</option>
                        <option value="PG">PG - Parental Guidance</option>
                        <option value="12A">12A - Suitable for 12 years and over</option>
                        <option value="12">12 - Suitable for 12 years and over</option>
                        <option value="15">15 - Suitable only for 15 years and over</option>
                        <option value="18">18 - Suitable only for adults</option>
                      </template>
                      <!-- FSK Rating System -->
                      <template v-else-if="report.ratingSystem === 'fsk'">
                        <option value="FSK 0">FSK 0 - Freigegeben ohne Altersbeschränkung</option>
                        <option value="FSK 6">FSK 6 - Freigegeben ab 6 Jahren</option>
                        <option value="FSK 12">FSK 12 - Freigegeben ab 12 Jahren</option>
                        <option value="FSK 16">FSK 16 - Freigegeben ab 16 Jahren</option>
                        <option value="FSK 18">FSK 18 - Freigegeben ab 18 Jahren</option>
                      </template>
                    </select>
                  </div>
                </div>

                <!-- Detailed Rating Criteria for Vietnam -->
                <div
                  v-if="currentRatingSystem?.id === 'vietnam' && report.suggestedRating"
                  class="mt-4"
                >
                  <h4 class="mb-2 text-sm font-medium text-gray-700">Rating Criteria Details</h4>
                  <div class="rounded-lg bg-gray-50 p-3">
                    <div v-if="getRatingCriteriaDetails(report.suggestedRating)" class="space-y-2">
                      <div
                        v-for="(criteria, key) in getRatingCriteriaDetails(report.suggestedRating)"
                        :key="key"
                      >
                        <div class="text-xs">
                          <span class="font-medium text-gray-600"
                            >{{ getCriteriaLabel(key) }}:</span
                          >
                          <span class="text-gray-500">{{ criteria }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Export Options -->
            <div
              v-if="report.status === 'completed'"
              class="rounded-lg border bg-white p-6 shadow-sm"
            >
              <h3 class="mb-4 text-lg font-semibold text-gray-900">Export Options</h3>
              <div class="space-y-3">
                <button
                  @click="exportReport('pdf')"
                  class="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Export as PDF
                </button>
                <button
                  @click="exportReport('docx')"
                  class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Export as DOCX
                </button>
                <button
                  @click="printReport"
                  class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Print Report
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCountryDefaults } from '@/composables/useCountryDefaults'

// Mock data interface
interface Report {
  id: string
  videoFile: {
    name: string
    size: number
    duration: number
    thumbnail: string
  }
  status: 'processing' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
  processingDuration?: number
  guidelines: string[]
  customGuidelines: string[]
  ratingSystem: string
  suggestedRating?: string
}

interface AnalysisScene {
  id: string
  startTime: string
  endTime: string
  category: string
  confidence: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  screenshots: string[]
  transcript?: string
  keywords: string[]
  textAnalysis: {
    sentiment: 'positive' | 'negative' | 'neutral'
    keyPhrases: string[]
    languageIssues: string[]
  }
  violationMinutes: number
}

interface OverallAnalysis {
  totalViolationMinutes: number
  categoryStats: {
    [key: string]: {
      count: number
      totalMinutes: number
      averageConfidence: number
    }
  }
  transcriptSummary: {
    totalWords: number
    flaggedWords: number
    languageIssues: string[]
  }
}

// Route and router
const route = useRoute()
const router = useRouter()

// Country defaults composable
const { getDetailedRatingSystem, getReferenceForCountry } = useCountryDefaults()

// Reactive data
const loading = ref(true)
const report = ref<Report | null>(null)
const showRatingOverride = ref(false)

// Computed properties for country-specific data
const currentRatingSystem = computed(() => {
  if (!report.value) return null
  return getDetailedRatingSystem(report.value.ratingSystem)
})

const currentReference = computed(() => {
  if (!report.value) return null
  return getReferenceForCountry(report.value.ratingSystem)
})

// Mock data
const mockReports: Report[] = [
  {
    id: 'RPT-2024-001',
    videoFile: {
      name: 'action_movie_trailer.mp4',
      size: 125000000,
      duration: 180,
      thumbnail: 'https://placehold.co/80x45/4F46E5/FFFFFF?text=Action',
    },
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    completedAt: '2024-01-15T12:45:00Z',
    processingDuration: 135,
    guidelines: [
      'Bạo lực (Violence)',
      'Khỏa thân, tình dục (Nudity & Sexual Content)',
      'Hành vi nguy hiểm, dễ bắt chước (Dangerous Behavior)',
    ],
    customGuidelines: ['Excessive gun violence'],
    ratingSystem: 'vietnam',
    suggestedRating: 'T18',
  },
  {
    id: 'RPT-2024-002',
    videoFile: {
      name: 'family_comedy.mp4',
      size: 89000000,
      duration: 95,
      thumbnail: 'https://placehold.co/80x45/10B981/FFFFFF?text=Comedy',
    },
    status: 'processing',
    createdAt: '2024-01-15T14:20:00Z',
    guidelines: ['Chủ đề, nội dung (Theme & Content)', 'Ngôn ngữ thô tục (Crude Language)'],
    customGuidelines: [],
    ratingSystem: 'vietnam',
  },
  {
    id: 'RPT-2024-003',
    videoFile: {
      name: 'documentary.mp4',
      size: 210000000,
      duration: 120,
      thumbnail: 'https://placehold.co/80x45/F59E0B/FFFFFF?text=Doc',
    },
    status: 'failed',
    createdAt: '2024-01-15T09:15:00Z',
    guidelines: ['Bạo lực (Violence)', 'Khỏa thân, tình dục (Nudity & Sexual Content)'],
    customGuidelines: ['Graphic content'],
    ratingSystem: 'vietnam',
  },
  {
    id: 'RPT-2024-004',
    videoFile: {
      name: 'horror_movie.mp4',
      size: 150000000,
      duration: 110,
      thumbnail: 'https://placehold.co/80x45/7C2D12/FFFFFF?text=Horror',
    },
    status: 'completed',
    createdAt: '2024-01-15T16:00:00Z',
    completedAt: '2024-01-15T18:30:00Z',
    processingDuration: 150,
    guidelines: ['Kinh dị (Horror)', 'Bạo lực (Violence)', 'Ngôn ngữ thô tục (Crude Language)'],
    customGuidelines: ['Psychological horror elements'],
    ratingSystem: 'vietnam',
    suggestedRating: 'T16',
  },
]

// Methods
const loadReport = () => {
  const reportId = route.params.id as string
  const foundReport = mockReports.find((r) => r.id === reportId)

  setTimeout(() => {
    report.value = foundReport || null
    loading.value = false
  }, 1000) // Simulate loading
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'processing':
      return 'bg-yellow-100 text-yellow-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'processing':
      return 'Processing'
    case 'completed':
      return 'Completed'
    case 'failed':
      return 'Failed'
    default:
      return 'Unknown'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString()
}

const formatDuration = (seconds?: number) => {
  if (!seconds) return 'N/A'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const formatFileSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
}

const getMockAnalysisResults = (): AnalysisScene[] => {
  if (!report.value || report.value.status !== 'completed') return []

  // Use Vietnam-specific categories if the report uses Vietnam rating system
  const isVietnam = report.value.ratingSystem === 'vietnam'

  return [
    {
      id: 'scene-1',
      startTime: '0:45',
      endTime: '1:12',
      category: isVietnam ? 'Bạo lực (Violence)' : 'Violence',
      confidence: 85,
      severity: 'critical',
      description: isVietnam
        ? 'Gun violence scene with multiple shots fired during a bank robbery sequence. Detailed crime techniques with weapons, causing pain and bleeding.'
        : 'Gun violence scene with multiple shots fired during a bank robbery sequence',
      screenshots: [
        'https://placehold.co/96x64/EF4444/FFFFFF?text=Gun1',
        'https://placehold.co/96x64/EF4444/FFFFFF?text=Gun2',
        'https://placehold.co/96x64/EF4444/FFFFFF?text=Gun3',
        'https://placehold.co/96x64/EF4444/FFFFFF?text=Gun4',
      ],
      transcript:
        'Get down on the ground! This is a robbery! Give me all your money or I will shoot!',
      keywords: ['shoot', 'robbery', 'gun', 'money'],
      textAnalysis: {
        sentiment: 'negative',
        keyPhrases: ['bank robbery', 'gun violence', 'threats'],
        languageIssues: ['threats of violence', 'criminal activity'],
      },
      violationMinutes: 0.5,
    },
    {
      id: 'scene-2',
      startTime: '1:23',
      endTime: '1:45',
      category: isVietnam ? 'Khỏa thân, tình dục (Nudity & Sexual Content)' : 'Adult Content',
      confidence: 92,
      severity: 'high',
      description: isVietnam
        ? 'Sexual content and nudity detected in intimate scene. Direct portrayal of sexual activity with detailed imagery.'
        : 'Sexual content and nudity detected in intimate scene',
      screenshots: [
        'https://placehold.co/96x64/F59E0B/FFFFFF?text=Adult1',
        'https://placehold.co/96x64/F59E0B/FFFFFF?text=Adult2',
        'https://placehold.co/96x64/F59E0B/FFFFFF?text=Adult3',
        'https://placehold.co/96x64/F59E0B/FFFFFF?text=Adult4',
      ],
      transcript: 'I love you so much. Let me show you how much I care about you.',
      keywords: ['love', 'intimate', 'care'],
      textAnalysis: {
        sentiment: 'positive',
        keyPhrases: ['intimate relationship', 'romantic dialogue'],
        languageIssues: ['sexual content'],
      },
      violationMinutes: 0.4,
    },
    {
      id: 'scene-3',
      startTime: '2:15',
      endTime: '2:28',
      category: isVietnam ? 'Hành vi nguy hiểm, dễ bắt chước (Dangerous Behavior)' : 'Violence',
      confidence: 78,
      severity: 'medium',
      description: isVietnam
        ? 'Physical altercation between characters with punches and kicks. Detailed fighting techniques that could be imitated by viewers.'
        : 'Physical altercation between characters with punches and kicks',
      screenshots: [
        'https://placehold.co/96x64/EF4444/FFFFFF?text=Fight1',
        'https://placehold.co/96x64/EF4444/FFFFFF?text=Fight2',
        'https://placehold.co/96x64/EF4444/FFFFFF?text=Fight3',
        'https://placehold.co/96x64/EF4444/FFFFFF?text=Fight4',
      ],
      transcript:
        'You think you can mess with me? I will teach you a lesson you will never forget!',
      keywords: ['fight', 'lesson', 'mess', 'forget'],
      textAnalysis: {
        sentiment: 'negative',
        keyPhrases: ['physical confrontation', 'threats', 'violence'],
        languageIssues: ['threats of violence', 'aggressive language'],
      },
      violationMinutes: 0.2,
    },
    {
      id: 'scene-4',
      startTime: '3:42',
      endTime: '3:55',
      category: isVietnam ? 'Ngôn ngữ thô tục (Crude Language)' : 'Language',
      confidence: 65,
      severity: 'low',
      description: isVietnam
        ? 'Strong language and profanity detected in dialogue. Crude language including slang and inappropriate expressions.'
        : 'Strong language and profanity detected in dialogue',
      screenshots: [
        'https://placehold.co/96x64/8B5CF6/FFFFFF?text=Lang1',
        'https://placehold.co/96x64/8B5CF6/FFFFFF?text=Lang2',
        'https://placehold.co/96x64/8B5CF6/FFFFFF?text=Lang3',
        'https://placehold.co/96x64/8B5CF6/FFFFFF?text=Lang4',
      ],
      transcript: 'This is absolutely ridiculous! What the hell were you thinking?',
      keywords: ['hell', 'ridiculous', 'thinking'],
      textAnalysis: {
        sentiment: 'negative',
        keyPhrases: ['strong language', 'profanity', 'frustration'],
        languageIssues: ['profanity', 'inappropriate language'],
      },
      violationMinutes: 0.2,
    },
  ]
}

const getTotalViolationMinutes = () => {
  return getMockAnalysisResults()
    .reduce((total, scene) => total + scene.violationMinutes, 0)
    .toFixed(1)
}

const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case 'Violence':
    case 'Bạo lực (Violence)':
      return 'bg-red-100 text-red-800'
    case 'Adult Content':
    case 'Khỏa thân, tình dục (Nudity & Sexual Content)':
      return 'bg-orange-100 text-orange-800'
    case 'Language':
    case 'Ngôn ngữ thô tục (Crude Language)':
      return 'bg-yellow-100 text-yellow-800'
    case 'Hành vi nguy hiểm, dễ bắt chước (Dangerous Behavior)':
      return 'bg-purple-100 text-purple-800'
    case 'Kinh dị (Horror)':
      return 'bg-indigo-100 text-indigo-800'
    case 'Chủ đề, nội dung (Theme & Content)':
      return 'bg-blue-100 text-blue-800'
    case 'Ma túy, chất kích thích (Drugs & Substances)':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getSentimentClass = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return 'bg-green-100 text-green-800'
    case 'negative':
      return 'bg-red-100 text-red-800'
    case 'neutral':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getSeverityBadgeClass = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800'
    case 'high':
      return 'bg-orange-100 text-orange-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getSeverityCount = (severity: string) => {
  return getMockAnalysisResults().filter((scene) => scene.severity === severity).length
}

const getCriticalSeverityCount = () => {
  return getSeverityCount('critical')
}

const getPrimaryViolationCategory = () => {
  const scenes = getMockAnalysisResults()
  const categoryCounts: { [key: string]: number } = {}

  scenes.forEach((scene) => {
    categoryCounts[scene.category] = (categoryCounts[scene.category] || 0) + 1
  })

  return Object.keys(categoryCounts).reduce((a, b) =>
    categoryCounts[a] > categoryCounts[b] ? a : b,
  )
}

const getOverallAnalysis = (): OverallAnalysis => {
  const scenes = getMockAnalysisResults()
  const categoryStats: {
    [key: string]: { count: number; totalMinutes: number; averageConfidence: number }
  } = {}

  // Calculate category statistics
  scenes.forEach((scene) => {
    if (!categoryStats[scene.category]) {
      categoryStats[scene.category] = { count: 0, totalMinutes: 0, averageConfidence: 0 }
    }
    categoryStats[scene.category].count++
    categoryStats[scene.category].totalMinutes += scene.violationMinutes
  })

  // Calculate average confidence for each category
  Object.keys(categoryStats).forEach((category) => {
    const categoryScenes = scenes.filter((scene) => scene.category === category)
    const totalConfidence = categoryScenes.reduce((sum, scene) => sum + scene.confidence, 0)
    categoryStats[category].averageConfidence = Math.round(totalConfidence / categoryScenes.length)
  })

  // Calculate transcript summary
  const allTranscripts = scenes
    .filter((scene) => scene.transcript)
    .map((scene) => scene.transcript!)
  const totalWords = allTranscripts.join(' ').split(' ').length
  const flaggedWords = scenes.reduce((total, scene) => total + scene.keywords.length, 0)
  const allLanguageIssues = scenes.flatMap((scene) => scene.textAnalysis.languageIssues)
  const uniqueLanguageIssues = [...new Set(allLanguageIssues)]

  return {
    totalViolationMinutes: parseFloat(getTotalViolationMinutes()),
    categoryStats,
    transcriptSummary: {
      totalWords,
      flaggedWords,
      languageIssues: uniqueLanguageIssues,
    },
  }
}

const getFlagRate = () => {
  const analysis = getOverallAnalysis()
  return analysis.transcriptSummary.totalWords > 0
    ? Math.round(
        (analysis.transcriptSummary.flaggedWords / analysis.transcriptSummary.totalWords) * 100,
      )
    : 0
}

const getGuidelinesTableData = () => {
  if (!report.value) return []

  const scenes = getMockAnalysisResults()
  const totalDuration = report.value.videoFile.duration / 60 // Convert seconds to minutes

  // Get all unique guidelines from the report
  const allGuidelines = [...report.value.guidelines, ...report.value.customGuidelines]

  return allGuidelines.map((guideline) => {
    // Find scenes that match this guideline
    const matchingScenes = scenes.filter((scene) => {
      // Map guideline names to scene categories
      const guidelineMapping: { [key: string]: string[] } = {
        'Bạo lực (Violence)': ['Violence', 'Bạo lực (Violence)'],
        'Khỏa thân, tình dục (Nudity & Sexual Content)': [
          'Adult Content',
          'Khỏa thân, tình dục (Nudity & Sexual Content)',
        ],
        'Ngôn ngữ thô tục (Crude Language)': ['Language', 'Ngôn ngữ thô tục (Crude Language)'],
        'Hành vi nguy hiểm, dễ bắt chước (Dangerous Behavior)': [
          'Hành vi nguy hiểm, dễ bắt chước (Dangerous Behavior)',
        ],
        'Kinh dị (Horror)': ['Kinh dị (Horror)'],
        'Chủ đề, nội dung (Theme & Content)': ['Chủ đề, nội dung (Theme & Content)'],
        'Ma túy, chất kích thích (Drugs & Substances)': [
          'Ma túy, chất kích thích (Drugs & Substances)',
        ],
        Violence: ['Violence', 'Bạo lực (Violence)'],
        'Adult Content': ['Adult Content', 'Khỏa thân, tình dục (Nudity & Sexual Content)'],
        Language: ['Language', 'Ngôn ngữ thô tục (Crude Language)'],
        'Dangerous Behavior': ['Hành vi nguy hiểm, dễ bắt chước (Dangerous Behavior)'],
        Horror: ['Kinh dị (Horror)'],
        'Theme & Content': ['Chủ đề, nội dung (Theme & Content)'],
        'Drugs & Substances': ['Ma túy, chất kích thích (Drugs & Substances)'],
      }

      const categories = guidelineMapping[guideline] || [guideline]
      return categories.some((category) => scene.category === category)
    })

    const totalMinutes = matchingScenes.reduce((sum, scene) => sum + scene.violationMinutes, 0)
    const percentageOfDuration =
      totalDuration > 0 ? ((totalMinutes / totalDuration) * 100).toFixed(1) : '0.0'

    return {
      name: guideline,
      scenesDetected: matchingScenes.length,
      totalMinutes: totalMinutes.toFixed(1),
      percentageOfDuration: percentageOfDuration,
    }
  })
}

const exportReport = (format: string = 'pdf') => {
  console.log(`Exporting report ${report.value?.id} as ${format}`)
  // TODO: Implement export functionality
}

const printReport = () => {
  window.print()
}

const deleteReport = () => {
  if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
    console.log(`Deleting report ${report.value?.id}`)
    // TODO: Implement delete functionality
    router.push('/reports')
  }
}

// Helper functions for Vietnam rating criteria
const getRatingCriteriaDetails = (rating: string) => {
  if (!currentRatingSystem.value || currentRatingSystem.value.id !== 'vietnam') return null

  const ratingLevel = currentRatingSystem.value.levels.find((level) => level.id === rating)
  return ratingLevel?.detailedCriteria || null
}

const getCriteriaLabel = (key: string) => {
  const labels: { [key: string]: string } = {
    themeContent: 'Theme & Content',
    violence: 'Violence',
    nuditySexual: 'Nudity & Sexual Content',
    drugs: 'Drugs & Substances',
    horror: 'Horror',
    language: 'Crude Language',
    dangerousBehavior: 'Dangerous Behavior',
  }
  return labels[key] || key
}

// Lifecycle
onMounted(() => {
  loadReport()
})
</script>
