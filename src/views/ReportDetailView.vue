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
            <div class="flex items-center">
              <!-- Actions Menu -->
              <ActionsMenu
                ref="actionsMenuRef"
                :items="menuItems"
                size="md"
                title="Report Actions"
                :subtitle="`Actions for ${report.id}`"
              />
            </div>
          </div>
        </div>

        <div class="space-y-8">
          <!-- Video Information -->
          <div class="rounded-lg border bg-white p-6 shadow-sm">
            <h2 class="mb-4 text-lg font-semibold text-gray-900">Video Information</h2>
            <div class="flex items-start space-x-4">
              <img
                v-if="report.mediaData?.thumbnail"
                :src="report.mediaData.thumbnail"
                :alt="report.mediaData.fileName"
                class="h-24 w-32 rounded object-cover"
              />
              <div v-else class="h-24 w-32 rounded bg-gray-200 flex items-center justify-center">
                <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-medium text-gray-900">
                  {{ report.mediaData?.fileName || 'No media file' }}
                </h3>
                <div class="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span class="font-medium">File Size:</span>
                    {{ report.mediaData ? formatFileSize(report.mediaData.fileSize) : 'N/A' }}
                  </div>
                  <div>
                    <span class="font-medium">Duration:</span>
                    {{ report.mediaData ? formatDuration(report.mediaData.duration) : 'N/A' }}
                  </div>
                  <div>
                    <span class="font-medium">Rating System:</span>
                    {{ currentRatingSystem?.name || report.ratingSystemId || 'Unknown' }}
                  </div>
                  <div>
                    <span class="font-medium">Suggested Rating:</span>
                    <span
                      v-if="report.rating?.suggested"
                      class="ml-1 rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                    >
                      {{ report.rating.suggested }}
                    </span>
                    <span v-else class="ml-1 text-sm text-gray-500">
                      Not available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Rating Information -->
          <div class="rounded-lg border bg-white p-6 shadow-sm">
            <h2 class="mb-4 text-lg font-semibold text-gray-900">Rating Information</h2>
            <div class="space-y-6">
              <!-- Rating System and Reference Information -->
              <div class="space-y-2">
                <div>
                  <span class="text-sm font-medium text-gray-700">Rating System:</span>
                  <span class="ml-2 text-sm text-gray-900">{{
                    currentRatingSystem?.name || report.ratingSystemId || 'Unknown'
                  }}</span>
                </div>
                <div v-if="currentReference">
                  <span class="text-sm font-medium text-gray-700">Reference:</span>
                  <a 
                    v-if="currentReference.url"
                    :href="currentReference.url"
                    target="_blank"
                    class="ml-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {{ currentReference.title }}
                  </a>
                  <span v-else class="ml-2 text-xs text-gray-500">
                    {{ currentReference.title }}
                  </span>
                </div>
              </div>

              <!-- All Ratings Display -->
              <div>
                <div class="mb-3">
                  <span class="text-sm font-medium text-gray-700">Suggested Ratings:</span>
                </div>
                
                
                <!-- Dynamic levels from API -->
                <div v-if="currentRatingSystem?.levels" class="flex flex-wrap gap-3">
                  <div
                    v-for="level in currentRatingSystem.levels"
                    :key="level.key"
                    class="relative"
                  >
                    <div
                      class="flex items-center space-x-2 rounded-lg border-2 px-4 py-3 transition-all duration-200"
                      :class="
                        report.rating?.suggested === level.key
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                      "
                    >
                      <div
                        class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                        :class="
                          report.rating?.suggested === level.key
                            ? 'bg-blue-600 text-white'
                            : getRatingColorClass(level.key)
                        "
                      >
                        {{ level.key }}
                      </div>
                      <!-- Show full details only for suggested rating -->
                      <div v-if="report.rating?.suggested === level.key" class="flex flex-col">
                        <span class="text-sm font-medium text-blue-900">
                          {{ level.title }}
                        </span>
                        <span class="text-xs text-blue-700">
                          {{ level.description }}
                        </span>
                      </div>
                      <!-- Suggested Rating Badge -->
                      <div
                        v-if="report.rating?.suggested === level.key"
                        class="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white shadow-lg"
                        title="Suggested Rating"
                      >
                        ✓
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>

              <!-- Rating Analysis -->
              <div v-if="report.status === 'completed' && report.rating?.suggested" class="mt-6">
                <h4 class="mb-3 text-sm font-medium text-gray-700">Rating Analysis</h4>
                <div class="rounded-lg bg-blue-50 p-4">
                  <p class="text-sm leading-relaxed text-gray-700">
                    {{ getRatingAnalysis(report.rating?.suggested) }}
                  </p>
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
                    >{{ getAnalysisResults().length }}</span
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
                          <span class="font-semibold text-gray-700">{{
                            guideline.totalMinutes
                          }}</span>
                        </td>
                        <td class="px-6 py-5 text-center text-sm text-gray-500">
                          <div class="flex flex-col items-center space-y-2">
                            <span class="text-sm font-bold text-gray-700">{{
                              guideline.percentageOfDuration
                            }}</span>
                            <div class="h-3 w-24 rounded-full bg-gray-200 shadow-inner">
                              <div
                                class="h-3 rounded-full shadow-sm transition-all duration-500"
                                :class="getProgressBarClass(guideline.percentageOfDuration)"
                                :style="{
                                  width:
                                    Math.min(parseFloat(guideline.percentageOfDuration), 100) + '%',
                                }"
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <!-- Total Row -->
                      <tr class="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                        <td class="px-6 py-4 text-sm font-bold text-gray-900">
                          <div class="flex items-center">
                            <svg
                              class="mr-2 h-4 w-4 text-gray-600"
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
                            Total
                          </div>
                        </td>
                        <td class="px-6 py-4 text-center text-sm font-bold text-gray-900">
                          <span
                            class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-800 ring-2 ring-blue-200"
                          >
                            {{ getTotalScenes() }}
                          </span>
                        </td>
                        <td class="px-6 py-4 text-center text-sm font-bold text-gray-900">
                          {{ getTotalDuration() }} min
                        </td>
                        <td class="px-6 py-4 text-center text-sm font-bold text-gray-900">
                          <div class="flex flex-col items-center space-y-2">
                            <span>{{ getTotalPercentage() }}%</span>
                            <div class="h-3 w-24 rounded-full bg-gray-200 shadow-inner">
                              <div
                                class="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm"
                                :style="{
                                  width: Math.min(parseFloat(getTotalPercentage()), 100) + '%',
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
                  v-for="scene in getAnalysisResults()"
                  :key="scene.startTime"
                  class="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  <!-- Scene Header with New Format -->
                  <div class="border-b border-gray-200 bg-gray-50 px-6 py-4">
                    <!-- Main content row -->
                    <div class="flex items-center justify-between">
                      <!-- Left side: Time range and violation info -->
                      <div class="flex-1">
                        <div class="text-2xl font-bold text-gray-900 mb-1">
                          {{ formatShortTime(scene.startTime) }} - {{ formatShortTime(scene.endTime) }}
                        </div>
                        <div class="text-sm text-gray-600">
                          {{ getDurationText(scene) }}. {{ scene.guideline }}
                        </div>
                      </div>
                      
                      <!-- Right side: Confidence and Severity badges -->
                      <div class="flex space-x-2">
                        <span
                          class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                          :class="getConfidenceBadgeClass(getSceneConfidence(scene))"
                        >
                          <svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fill-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          {{ getSceneConfidence(scene) }}% confidence
                        </span>
                        <span
                          class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
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
                  </div>

                  <!-- Content Section -->
                  <div class="p-6">
                    <!-- Description -->
                    <div class="mb-6">
                      <p class="text-base leading-relaxed text-gray-700">
                        {{ scene.guideline }}
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
                              :alt="`Scene screenshot ${index + 1}`"
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
                    </div>

                    <!-- Analysis Section -->
                    <div class="border-t border-gray-200 pt-6">
                      <h5 class="mb-4 text-lg font-semibold text-gray-900">Analysis</h5>

                      <!-- ML Detection Results -->
                      <div class="mb-6">
                        <div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
                          <!-- Detection Confidence -->
                          <div class="mb-4">
                            <div class="mb-2 flex items-center justify-between">
                              <span class="text-sm font-medium text-gray-700"
                                >Detection Confidence</span
                              >
                              <span
                                class="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold"
                                :class="getConfidenceClass(getSceneConfidence(scene))"
                              >
                                {{ getSceneConfidence(scene) }}%
                              </span>
                            </div>
                            <p class="text-xs text-gray-600">
                              {{ getMLDetectionDescription(getSceneConfidence(scene)) }}
                              <span class="ml-1 text-gray-500"
                                >(Max confidence from
                                {{ getSceneConfidenceRange(scene)?.count || 0 }} detections)</span
                              >
                            </p>
                          </div>

                          <!-- Video Detection -->
                          <div v-if="getVideoDetectedElements(scene).length > 0" class="mb-4">
                            <div class="mb-2">
                              <span class="text-sm font-medium text-gray-700">
                                Video Labels ({{ getVideoDetectedElements(scene).length }}
                                detected)
                              </span>
                            </div>
                            <p class="mb-2 text-xs text-gray-600">
                              {{ getVideoDetectionDescription() }}
                            </p>
                            <div class="flex flex-wrap gap-1">
                              <span
                                v-for="element in getVideoDetectedElements(scene)"
                                :key="element.label"
                                class="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                                :title="`Confidence: ${element.confidence}%`"
                              >
                                {{ element.label }}
                                <span class="ml-1 font-semibold text-blue-600"
                                  >{{ element.confidence }}%</span
                                >
                              </span>
                            </div>
                          </div>

                          <!-- Audio Detection -->
                          <div v-if="getAudioDetectedElements(scene).length > 0">
                            <div class="mb-2">
                              <span class="text-sm font-medium text-gray-700">
                                Audio Labels ({{ getAudioDetectedElements(scene).length }}
                                detected)
                              </span>
                            </div>
                            <p class="mb-2 text-xs text-gray-600">
                              {{ getAudioDetectionDescription() }}
                            </p>
                            <div class="flex flex-wrap gap-1">
                              <span
                                v-for="element in getAudioDetectedElements(scene)"
                                :key="element.label"
                                class="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
                                :title="`Confidence: ${element.confidence}%`"
                              >
                                {{ element.label }}
                                <span class="ml-1 font-semibold text-green-600"
                                  >{{ element.confidence }}%</span
                                >
                              </span>
                            </div>
                          </div>
                        </div>
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReports, useMediaRelationships, useResourceService, useRatingSystems, type ReportItem } from '@/composables'
import { mockReport } from '../../mock/report'
import { mockRatingSystem } from '../../mock/rating-system'
import { mockMedia } from '../../mock/media'
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'
import type { MenuItem } from '@/components/atoms/ActionsMenu.vue'

// Combined data interface for UI
interface ReportWithMedia extends ReportItem {
  mediaData?: {
    fileName: string
    fileSize: number
    duration: number
    thumbnail?: string
  }
  ratingSystemData?: {
    name: string
    description?: string
    references?: Array<{
      title: string
      source?: string
      url?: string
    }>
    levels?: Array<{
      key: string
      title: string
      description: string
      guide: string
    }>
  }
}

interface AnalysisScene {
  confidence: number
  startTime: string
  endTime: string
  guideline: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  screenshots: string[]
  analysis: {
    video?: Record<string, number>
    audio?: Record<string, number>
  }
}

// Route
const route = useRoute()
const router = useRouter()

// Initialize composables
const { 
  fetchReportById 
} = useReports()

const { 
  getMediaIdsByEntity
} = useMediaRelationships()

const { 
  getById 
} = useResourceService()

const {
  fetchRatingSystemById
} = useRatingSystems()

// Reactive data
const loading = ref(true)
const report = ref<ReportWithMedia | null>(null)
const actionsMenuRef = ref<InstanceType<typeof ActionsMenu> | null>(null)

// Computed properties for rating system data
const currentRatingSystem = computed(() => {
  if (!report.value) return null
  return report.value.ratingSystemData
})

const currentReference = computed(() => {
  if (!report.value?.ratingSystemData?.references) return null
  return report.value.ratingSystemData.references[0] // Get first reference
})

// Menu items for ActionsMenu
const menuItems = computed((): MenuItem[] => {
  if (!report.value) return []

  const items: MenuItem[] = []

  // Print action (always available)
  items.push({
    key: 'print',
    label: 'Print',
    description: 'Print this report',
    icon: 'mdi:printer',
    variant: 'default',
    action: printReport,
  })

  // Export actions (only for completed reports)
  if (report.value.status === 'completed') {
    items.push(
      {
        key: 'export-pdf',
        label: 'Export PDF',
        description: 'Download report as PDF',
        icon: 'mdi:file-pdf-box',
        variant: 'danger',
        action: () => exportReport('pdf'),
      },
      {
        key: 'export-docx',
        label: 'Export DOCX',
        description: 'Download report as Word document',
        icon: 'mdi:file-word-box',
        variant: 'info',
        action: () => exportReport('docx'),
      },
    )
  }

  // Divider before delete action
  items.push({
    key: 'divider-1',
    label: '',
    divider: true,
  })

  // Delete action
  items.push({
    key: 'delete',
    label: 'Delete Report',
    description: 'Remove this report permanently',
    icon: 'mdi:delete',
    variant: 'danger',
    action: deleteReport,
  })

  return items
})


// Methods
const loadReport = async () => {
  try {
    loading.value = true
  const reportId = route.params.id as string
    
    console.log('Loading report:', reportId)
    
    // Use mock data from external files
    const reportData = mockReport
    const mediaData = {
      fileName: mockMedia.fileName,
      fileSize: mockMedia.fileSize,
      duration: mockMedia.duration,
      thumbnail: mockMedia.thumbnail,
    }
    
    const ratingSystemData = {
      name: mockRatingSystem.name,
      description: mockRatingSystem.description,
      references: mockRatingSystem.references,
      levels: mockRatingSystem.levels,
      guidelines: mockRatingSystem.guidelines,
    }
    
    // Combine all data
    const reportWithMedia: ReportWithMedia = {
      ...reportData,
      mediaData,
      ratingSystemData,
    }
    
    console.log('Report with media:', reportWithMedia)
    console.log('Rating system levels:', ratingSystemData.levels)
    console.log('Rating system guidelines:', ratingSystemData.guidelines)
    console.log('Suggested rating:', reportData.rating?.suggested)
    console.log('Scenes:', reportData.scenes)
    
    report.value = reportWithMedia
    
  } catch (error) {
    console.error('Failed to load report:', error)
    report.value = null
  } finally {
    loading.value = false
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'processing':
      return 'bg-blue-100 text-blue-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pending'
    case 'processing':
      return 'Processing'
    case 'completed':
      return 'Completed'
    case 'failed':
      return 'Failed'
  }
}

const formatDate = (dateInput: any) => {
  if (!dateInput) return 'N/A'
  
  let date: Date
  if (typeof dateInput === 'string') {
    date = new Date(dateInput)
  } else if (dateInput._seconds) {
    // Firebase Timestamp
    date = new Date(dateInput._seconds * 1000)
  } else {
    date = new Date(dateInput)
  }
  
  return date.toLocaleDateString()
}

const formatTime = (dateInput: any) => {
  if (!dateInput) return 'N/A'
  
  let date: Date
  if (typeof dateInput === 'string') {
    date = new Date(dateInput)
  } else if (dateInput._seconds) {
    // Firebase Timestamp
    date = new Date(dateInput._seconds * 1000)
  } else {
    date = new Date(dateInput)
  }
  
  return date.toLocaleTimeString()
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

const getAnalysisResults = (): AnalysisScene[] => {
  if (!report.value || report.value.status !== 'completed') return []

  // Return scenes from mock data
  return report.value.scenes || []
}

const getTotalViolationMinutes = () => {
  const scenes = getAnalysisResults()
  if (scenes.length === 0) {
    return '0.0'
  }
  
  // Calculate total duration from startTime and endTime
  const totalSeconds = scenes.reduce((total, scene) => {
    if (scene.startTime && scene.endTime) {
      const start = new Date(scene.startTime).getTime()
      const end = new Date(scene.endTime).getTime()
      return total + (end - start) / 1000
    }
    return total
  }, 0)
  
  return (totalSeconds / 60).toFixed(1)
}

const getCategoryBadgeClass = (guideline: string) => {
  // Get guideline data from rating system to determine color
  const ratingSystemData = report.value?.ratingSystemData
  if (!ratingSystemData?.guidelines) {
    return 'bg-gray-100 text-gray-800'
  }
  
  // Find the guideline in rating system data
  const guidelineData = ratingSystemData.guidelines.find(g => g.name === guideline)
  if (!guidelineData) {
    return 'bg-gray-100 text-gray-800'
  }
  
  // Use guideline group or name to determine color
  const group = guidelineData.group || 'general'
  const name = guidelineData.name.toLowerCase()
  
  // Color mapping based on group and name keywords
  const colorMap: { [key: string]: string } = {
    'violence': 'bg-red-100 text-red-800',
    'sexual': 'bg-orange-100 text-orange-800',
    'language': 'bg-yellow-100 text-yellow-800',
    'nudity': 'bg-pink-100 text-pink-800',
    'dangerous': 'bg-purple-100 text-purple-800',
    'horror': 'bg-indigo-100 text-indigo-800',
    'drugs': 'bg-green-100 text-green-800',
    'theme': 'bg-blue-100 text-blue-800',
    'general': 'bg-gray-100 text-gray-800'
  }
  
  // Check name for keywords to determine color
  if (name.includes('bạo lực') || name.includes('violence')) {
    return colorMap['violence']
  } else if (name.includes('khỏa thân') || name.includes('tình dục') || name.includes('nudity') || name.includes('sexual')) {
    return colorMap['sexual']
  } else if (name.includes('ngôn từ') || name.includes('language')) {
    return colorMap['language']
  } else if (name.includes('hình ảnh gợi cảm') || name.includes('sexuality')) {
    return colorMap['nudity']
  } else if (name.includes('hành vi nguy hiểm') || name.includes('dangerous')) {
    return colorMap['dangerous']
  } else if (name.includes('kinh dị') || name.includes('horror')) {
    return colorMap['horror']
  } else if (name.includes('ma túy') || name.includes('drugs')) {
    return colorMap['drugs']
  } else if (name.includes('chủ đề') || name.includes('theme')) {
    return colorMap['theme']
  }
  
  // Fallback to general
  return colorMap['general']
}

const getProgressBarClass = (percentage: string) => {
  const value = parseFloat(percentage)
  if (value > 10) {
    return 'bg-gradient-to-r from-red-500 to-red-600'
  } else if (value > 5) {
    return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
  } else if (value > 0) {
    return 'bg-gradient-to-r from-green-500 to-green-600'
  } else {
    return 'bg-gray-300'
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
  }
}

const getConfidenceBadgeClass = (confidence: number) => {
  if (confidence >= 90) return 'bg-red-100 text-red-800'
  if (confidence >= 75) return 'bg-orange-100 text-orange-800'
  if (confidence >= 60) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

const getSeverityCount = (severity: string) => {
  return getAnalysisResults().filter((scene) => scene.severity === severity).length
}

const getCriticalSeverityCount = () => {
  return getSeverityCount('critical')
}

const getPrimaryViolationCategory = () => {
  const scenes = getAnalysisResults()
  const categoryCounts: { [key: string]: number } = {}

  scenes.forEach((scene) => {
    const category = scene.guideline || scene.category || 'Unknown'
    categoryCounts[category] = (categoryCounts[category] || 0) + 1
  })

  const categories = Object.keys(categoryCounts)
  if (categories.length === 0) {
    return 'No violations detected'
  }

  return categories.reduce((a, b) =>
    categoryCounts[a] > categoryCounts[b] ? a : b,
  )
}

const getGuidelinesTableData = () => {
  if (!report.value) return []

  // Get guidelines from rating system
  const guidelines = report.value.ratingSystemData?.guidelines || []
  const scenes = report.value.scenes || []
  
  console.log('getGuidelinesTableData - guidelines:', guidelines)
  console.log('getGuidelinesTableData - scenes:', scenes)
  
  // Calculate total duration from media
  const totalDurationMinutes = report.value.mediaData?.duration ? report.value.mediaData.duration / 60 : 0
  
  return guidelines.map(guideline => {
    // Find scenes that match this guideline
    const matchingScenes = scenes.filter(scene => 
      scene.guideline === guideline.name || 
      scene.guideline.includes(guideline.name) ||
      guideline.name.includes(scene.guideline)
    )
    
    // Calculate total violation minutes for this guideline
    const totalMinutes = matchingScenes.reduce((sum, scene) => {
      // Convert scene duration to minutes (assuming scenes have duration in seconds)
      const sceneDuration = scene.endTime && scene.startTime 
        ? (new Date(scene.endTime).getTime() - new Date(scene.startTime).getTime()) / 1000 / 60
        : 0
      return sum + sceneDuration
    }, 0)
    
    // Calculate percentage of total duration
    const percentageOfDuration = totalDurationMinutes > 0 
      ? ((totalMinutes / totalDurationMinutes) * 100).toFixed(1)
      : '0.0'

    return {
      name: guideline.name,
      scenesDetected: matchingScenes.length,
      totalMinutes: totalMinutes.toFixed(1),
      percentageOfDuration: percentageOfDuration,
    }
  })
}

// Helper functions for totals
const getTotalScenes = () => {
  const guidelines = getGuidelinesTableData()
  return guidelines.reduce((total, guideline) => total + guideline.scenesDetected, 0)
}

const getTotalDuration = () => {
  const guidelines = getGuidelinesTableData()
  const totalMinutes = guidelines.reduce(
    (total, guideline) => total + parseFloat(guideline.totalMinutes),
    0,
  )
  return totalMinutes.toFixed(1)
}

const getTotalPercentage = () => {
  const guidelines = getGuidelinesTableData()
  const totalPercentage = guidelines.reduce(
    (total, guideline) => total + parseFloat(guideline.percentageOfDuration),
    0,
  )
  return totalPercentage.toFixed(1)
}

const getRatingAnalysis = (rating: string) => {
  if (report.value?.rating?.analysis) {
    return report.value.rating.analysis
  }
}

// Helper methods for new analysis section
const getSeverityText = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'Critical'
    case 'high':
      return 'High'
    case 'medium':
      return 'Medium'
    case 'low':
      return 'Low'
  }
}

const getConfidenceClass = (confidence: number) => {
  if (confidence >= 90) return 'bg-green-100 text-green-800'
  if (confidence >= 75) return 'bg-yellow-100 text-yellow-800'
  if (confidence >= 60) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}

const getMLDetectionDescription = (confidence: number) => {
  if (confidence >= 90) return 'ML model is very confident in this detection'
  if (confidence >= 75) return 'ML model has high confidence in this detection'
  if (confidence >= 60) return 'ML model has moderate confidence in this detection'
  return 'ML model has low confidence - manual review recommended'
}

// Helper function to format timestamp to short format (e.g., "0:45" or "1:23:45")
const formatShortTime = (isoString: string): string => {
  const date = new Date(isoString)
  
  // For demo purposes, convert timestamp to video time
  // In real implementation, you'd have actual video timestamps
  const totalSeconds = date.getSeconds() + (date.getMinutes() * 60) + (date.getHours() * 3600)
  
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  // Always show HH:MM:SS format for consistency
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// Helper function to calculate scene duration in minutes
const getSceneDuration = (scene: AnalysisScene): number => {
  if (!scene.startTime || !scene.endTime) return 0
  const start = new Date(scene.startTime).getTime()
  const end = new Date(scene.endTime).getTime()
  return (end - start) / (1000 * 60) // Convert to minutes
}

// Helper function to format duration text
const getDurationText = (scene: AnalysisScene): string => {
  const duration = getSceneDuration(scene)
  return `${duration.toFixed(1)} min violation`
}

const getSceneConfidence = (scene: AnalysisScene) => {
  // Use the confidence directly from scene data (already in percentage format)
  return Math.round(scene.confidence * 100)
}

const getSceneConfidenceRange = (scene: AnalysisScene) => {
  // Get confidence range for detailed analysis
  const videoElements = getVideoDetectedElements(scene)
  const audioElements = getAudioDetectedElements(scene)

  const allConfidences = [
    ...videoElements.map((el) => el.confidence),
    ...audioElements.map((el) => el.confidence),
  ]

  if (allConfidences.length === 0) return null

  const minConfidence = Math.min(...allConfidences)
  const maxConfidence = Math.max(...allConfidences)
  const avgConfidence = Math.round(
    allConfidences.reduce((sum, conf) => sum + conf, 0) / allConfidences.length,
  )

  return {
    min: minConfidence,
    max: maxConfidence,
    avg: avgConfidence,
    count: allConfidences.length,
  }
}

const getVideoDetectionDescription = () => {
  return 'Visual content analysis detected potential issues'
}

const getVideoDetectedElements = (scene: AnalysisScene) => {
  if (!scene.analysis.video) return []
  return Object.entries(scene.analysis.video).map(([label, confidence]) => ({
    label,
    confidence: Math.round((confidence || 0) * 100)
  }))
}

const getAudioDetectionDescription = () => {
  return 'Audio content analysis detected potential issues'
}

const getAudioDetectedElements = (scene: AnalysisScene) => {
  if (!scene.analysis.audio) return []
  return Object.entries(scene.analysis.audio).map(([label, confidence]) => ({
    label,
    confidence: Math.round((confidence || 0) * 100)
  }))
}


// Helper functions for rating display
const getRatingColorClass = (levelKey: string) => {
  const colorMap: { [key: string]: string } = {
    // Vietnam Film Classification colors
    'P': 'bg-green-100 text-green-800',
    'K': 'bg-blue-100 text-blue-800', 
    'T13': 'bg-yellow-100 text-yellow-800',
    'T16': 'bg-orange-100 text-orange-800',
    'T18': 'bg-red-100 text-red-800',
    'C': 'bg-red-900 text-white',
    // MPAA colors
    'G': 'bg-green-100 text-green-800',
    'PG': 'bg-yellow-100 text-yellow-800',
    'PG-13': 'bg-orange-100 text-orange-800',
    'R': 'bg-red-100 text-red-800',
    'NC-17': 'bg-red-900 text-white',
  }
  return colorMap[levelKey] || 'bg-gray-100 text-gray-800'
}

// Action handlers
const printReport = () => {
  // Close the menu before printing to avoid it appearing in the print
  if (actionsMenuRef.value) {
    actionsMenuRef.value.closeMenu()
  }
  // Small delay to ensure menu is closed before printing
  setTimeout(() => {
    window.print()
  }, 100)
}

const exportReport = (format: string = 'pdf') => {
  console.log(`Exporting report ${report.value?.id} as ${format}`)
  // TODO: Implement export functionality
  // This would typically trigger a download or open a new window with the exported report
}

const deleteReport = () => {
  if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
    console.log(`Deleting report ${report.value?.id}`)
    // TODO: Implement delete functionality
    router.push('/reports')
  }
}

// Lifecycle
onMounted(() => {
  loadReport()
})
</script>
