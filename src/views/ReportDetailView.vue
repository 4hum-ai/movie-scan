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
                    currentRatingSystem?.name || report.ratingSystem.toUpperCase()
                  }}</span>
                </div>
                <div v-if="currentReference">
                  <span class="text-sm font-medium text-gray-700">Reference:</span>
                  <span class="ml-2 text-xs text-gray-500">{{ currentReference.title }}</span>
                </div>
              </div>

              <!-- All Ratings Display -->
              <div v-if="currentRatingSystem">
                <div class="mb-3">
                  <span class="text-sm font-medium text-gray-700">Suggested Ratings:</span>
                </div>
                <div class="flex flex-wrap gap-3">
                  <div
                    v-for="rating in currentRatingSystem.levels"
                    :key="rating.id"
                    class="relative"
                  >
                    <div
                      class="flex items-center space-x-2 rounded-lg border-2 px-4 py-3 transition-all duration-200"
                      :class="
                        report.suggestedRating === rating.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                      "
                    >
                      <div
                        class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                        :class="
                          report.suggestedRating === rating.id
                            ? 'bg-blue-600 text-white'
                            : getRatingColorClass(rating.color)
                        "
                      >
                        {{ rating.id }}
                      </div>
                      <!-- Show full details only for suggested rating -->
                      <div v-if="report.suggestedRating === rating.id" class="flex flex-col">
                        <span class="text-sm font-medium text-blue-900">
                          {{ rating.name }}
                        </span>
                        <span class="text-xs text-blue-700">
                          {{ rating.description }}
                        </span>
                      </div>
                      <!-- Suggested Rating Badge -->
                      <div
                        v-if="report.suggestedRating === rating.id"
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
              <div v-if="report.status === 'completed' && report.suggestedRating" class="mt-6">
                <h4 class="mb-3 text-sm font-medium text-gray-700">Rating Analysis</h4>
                <div class="rounded-lg bg-blue-50 p-4">
                  <p class="text-sm leading-relaxed text-gray-700">
                    {{ getRatingAnalysis(report.suggestedRating) }}
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
                          {{ getTotalDuration() }}m
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
                          {{ getSceneConfidence(scene) }}% confidence
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

                      <!-- ML Detection Results -->
                      <div class="mb-6">
                        <h6 class="mb-3 flex items-center text-sm font-semibold text-gray-900">
                          <svg
                            class="mr-2 h-4 w-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            ></path>
                          </svg>
                          ML Detection Results
                        </h6>
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

                      <!-- LLM Analysis -->
                      <div class="mb-6">
                        <h6 class="mb-3 flex items-center text-sm font-semibold text-gray-900">
                          <svg
                            class="mr-2 h-4 w-4 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            ></path>
                          </svg>
                          LLM Analysis & Reasoning
                        </h6>
                        <div class="rounded-lg border border-purple-200 bg-purple-50 p-4">
                          <div class="mb-4">
                            <div class="mb-2 flex items-center justify-between">
                              <span class="text-sm font-medium text-gray-700"
                                >Severity Assessment</span
                              >
                              <span
                                class="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold"
                                :class="getSeverityBadgeClass(scene.severity)"
                              >
                                {{ getSeverityText(scene.severity) }} Severity
                              </span>
                            </div>
                            <div class="rounded-lg border border-purple-200 bg-white p-3">
                              <p class="text-sm leading-relaxed text-gray-700">
                                {{ getLLMReasoning(scene) }}
                              </p>
                            </div>
                          </div>
                          <div v-if="scene.textAnalysis.keyPhrases.length > 0" class="mt-3">
                            <p class="mb-2 text-sm font-medium text-gray-700">Content Analysis</p>
                            <div class="flex flex-wrap gap-2">
                              <span
                                v-for="phrase in scene.textAnalysis.keyPhrases.slice(0, 4)"
                                :key="phrase"
                                class="inline-flex rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800"
                              >
                                {{ phrase }}
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
import { useCountryDefaults } from '@/composables/useCountryDefaults'
import { useTransformReport } from '@/composables/useTransformReport'
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'
import type { MenuItem } from '@/components/atoms/ActionsMenu.vue'

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

// Route
const route = useRoute()
const router = useRouter()

// Country defaults composable
const { getDetailedRatingSystem, getReferenceForCountry } = useCountryDefaults()

// Reactive data
const loading = ref(true)
const report = ref<Report | null>(null)
const actionsMenuRef = ref<InstanceType<typeof ActionsMenu> | null>(null)

// Transform report composable
interface AnalysisData {
  analysis_result: Array<{
    frame_time: number
    contents: Record<string, number>
  }>
}
const analysisData = ref<AnalysisData | null>(null)
const transformReport = computed(() => {
  if (!analysisData.value) return null
  return useTransformReport(analysisData.value)
})

// Computed properties for country-specific data
const currentRatingSystem = computed(() => {
  if (!report.value) return null
  return getDetailedRatingSystem(report.value.ratingSystem)
})

const currentReference = computed(() => {
  if (!report.value) return null
  return getReferenceForCountry(report.value.ratingSystem)
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
const loadReport = async () => {
  const reportId = route.params.id as string
  const foundReport = mockReports.find((r) => r.id === reportId)

  if (foundReport) {
    // Load real analysis data for demo
    try {
      // In real app, this would be an API call
      const response = await fetch('/result_The_Piano_1993.json')
      if (response.ok) {
        const data = await response.json()
        analysisData.value = data
      }
    } catch {
      console.warn('Could not load analysis data, using mock data')
      // Fallback to mock data if file not found
      analysisData.value = {
        analysis_result: [
          {
            frame_time: 45,
            contents: { general_nsfw: 0.85, sexual_intent: 0.92 },
          },
          {
            frame_time: 83,
            contents: { general_nsfw: 0.94, sexual_intent: 0.88 },
          },
        ],
      }
    }
  }

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

const getAnalysisResults = (): AnalysisScene[] => {
  if (!report.value || report.value.status !== 'completed' || !transformReport.value) return []

  try {
    // Get detected scenes from composable
    const detectedScenes = transformReport.value.getDetectedScenes(0.7, 10)

    // Convert to AnalysisScene format for UI
    return detectedScenes.map((scene) => {
      const startTime = `${Math.floor(scene.startTime / 60)}:${Math.floor(scene.startTime % 60)
        .toString()
        .padStart(2, '0')}`
      const endTime = `${Math.floor(scene.endTime / 60)}:${Math.floor(scene.endTime % 60)
        .toString()
        .padStart(2, '0')}`

      // Map category to Vietnamese if needed
      const isVietnam = report.value?.ratingSystem === 'vietnam'
      const categoryMap: { [key: string]: string } = {
        general_nsfw: isVietnam ? 'Khỏa thân, tình dục (Nudity & Sexual Content)' : 'Adult Content',
        sexual_intent: isVietnam
          ? 'Khỏa thân, tình dục (Nudity & Sexual Content)'
          : 'Adult Content',
        general_suggestive: isVietnam
          ? 'Khỏa thân, tình dục (Nudity & Sexual Content)'
          : 'Adult Content',
        male_shirtless: isVietnam
          ? 'Khỏa thân, tình dục (Nudity & Sexual Content)'
          : 'Adult Content',
        female_nudity: isVietnam
          ? 'Khỏa thân, tình dục (Nudity & Sexual Content)'
          : 'Adult Content',
        male_nudity: isVietnam ? 'Khỏa thân, tình dục (Nudity & Sexual Content)' : 'Adult Content',
        breast: isVietnam ? 'Khỏa thân, tình dục (Nudity & Sexual Content)' : 'Adult Content',
        genitals: isVietnam ? 'Khỏa thân, tình dục (Nudity & Sexual Content)' : 'Adult Content',
        butt: isVietnam ? 'Khỏa thân, tình dục (Nudity & Sexual Content)' : 'Adult Content',
        sexual_activity: isVietnam
          ? 'Khỏa thân, tình dục (Nudity & Sexual Content)'
          : 'Adult Content',
        kissing: isVietnam ? 'Khỏa thân, tình dục (Nudity & Sexual Content)' : 'Adult Content',
        licking: isVietnam ? 'Khỏa thân, tình dục (Nudity & Sexual Content)' : 'Adult Content',
      }

      const category = categoryMap[scene.category] || scene.category

      return {
        id: scene.id,
        startTime,
        endTime,
        category,
        confidence: 85 + Math.floor(Math.random() * 15), // Mock confidence
        severity: 'high' as const, // Mock severity
        description: `Content analysis detected ${scene.category} in this scene. Duration: ${scene.durationFormatted}.`,
        screenshots: [
          'https://placehold.co/96x64/F59E0B/FFFFFF?text=Scene1',
          'https://placehold.co/96x64/F59E0B/FFFFFF?text=Scene2',
          'https://placehold.co/96x64/F59E0B/FFFFFF?text=Scene3',
          'https://placehold.co/96x64/F59E0B/FFFFFF?text=Scene4',
        ],
        transcript: 'Content analysis detected in this scene.',
        keywords: [scene.category],
        textAnalysis: {
          sentiment: 'negative' as const,
          keyPhrases: [scene.category],
          languageIssues: [scene.category],
        },
        violationMinutes: parseFloat(scene.durationFormatted),
      }
    })
  } catch (error) {
    console.warn('Error getting analysis results:', error)
    return []
  }
}

const getTotalViolationMinutes = () => {
  return getAnalysisResults()
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
  return getAnalysisResults().filter((scene) => scene.severity === severity).length
}

const getCriticalSeverityCount = () => {
  return getSeverityCount('critical')
}

const getPrimaryViolationCategory = () => {
  const scenes = getAnalysisResults()
  const categoryCounts: { [key: string]: number } = {}

  scenes.forEach((scene) => {
    categoryCounts[scene.category] = (categoryCounts[scene.category] || 0) + 1
  })

  return Object.keys(categoryCounts).reduce((a, b) =>
    categoryCounts[a] > categoryCounts[b] ? a : b,
  )
}

const getGuidelinesTableData = () => {
  if (!report.value) return []

  // Try to use composable data first
  if (transformReport.value) {
    try {
      const executiveSummary = transformReport.value.getFormattedExecutiveSummary.value

      return executiveSummary.items.map((item) => ({
        name: item.guideline,
        scenesDetected: item.scenes,
        totalMinutes: item.durationFormatted,
        percentageOfDuration: item.percentageFormatted,
      }))
    } catch (error) {
      console.warn('Error getting executive summary:', error)
    }
  }

  // Fallback to mock data
  const scenes = getAnalysisResults()
  const totalDuration = report.value.videoFile.duration / 60
  const allGuidelines = [...report.value.guidelines, ...report.value.customGuidelines]

  return allGuidelines.map((guideline) => {
    const matchingScenes = scenes.filter((scene) => {
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

// Helper functions for totals
const getTotalScenes = () => {
  // Try composable first
  if (transformReport.value) {
    try {
      const summary = transformReport.value.getExecutiveSummary.value
      return summary.totalScenes
    } catch (error) {
      console.warn('Error getting total scenes:', error)
    }
  }

  // Fallback to guidelines data
  const guidelines = getGuidelinesTableData()
  return guidelines.reduce((total, guideline) => total + guideline.scenesDetected, 0)
}

const getTotalDuration = () => {
  // Try composable first
  if (transformReport.value) {
    try {
      const summary = transformReport.value.getExecutiveSummary.value
      return (summary.totalDuration / 60).toFixed(1)
    } catch (error) {
      console.warn('Error getting total duration:', error)
    }
  }

  // Fallback to guidelines data
  const guidelines = getGuidelinesTableData()
  const totalMinutes = guidelines.reduce(
    (total, guideline) => total + parseFloat(guideline.totalMinutes),
    0,
  )
  return totalMinutes.toFixed(1)
}

const getTotalPercentage = () => {
  // Try composable first
  if (transformReport.value) {
    try {
      const summary = transformReport.value.getExecutiveSummary.value
      return summary.totalPercentage.toFixed(1)
    } catch (error) {
      console.warn('Error getting total percentage:', error)
    }
  }

  // Fallback to guidelines data
  const guidelines = getGuidelinesTableData()
  const totalPercentage = guidelines.reduce(
    (total, guideline) => total + parseFloat(guideline.percentageOfDuration),
    0,
  )
  return totalPercentage.toFixed(1)
}

const getRatingAnalysis = (rating: string) => {
  // Generate detailed analysis explaining the rationale behind the suggested rating
  const scenes = getAnalysisResults()
  const totalViolations = scenes.length
  const criticalViolations = scenes.filter((scene) => scene.severity === 'critical').length
  const highViolations = scenes.filter((scene) => scene.severity === 'high').length
  const totalViolationMinutes = scenes.reduce((sum, scene) => sum + scene.violationMinutes, 0)

  const analysisTemplates: { [key: string]: string } = {
    P: `Based on the content analysis, this material is suitable for all ages (P rating). The analysis found minimal content violations with ${totalViolations} scenes identified, totaling ${totalViolationMinutes.toFixed(1)} minutes of flagged content. The violations are primarily of low severity and do not contain material that would be inappropriate for general audiences.`,

    K: `The content analysis suggests a K rating (suitable for children under 13 with guardian supervision). The analysis identified ${totalViolations} scenes with content violations totaling ${totalViolationMinutes.toFixed(1)} minutes. While the content contains some elements that may require parental guidance, it does not reach levels that would restrict viewing to older audiences.`,

    T13: `Based on the comprehensive content analysis, this material is recommended for T13 rating (suitable for 13+ only). The analysis identified ${totalViolations} scenes with content violations, including ${highViolations} high-severity violations, totaling ${totalViolationMinutes.toFixed(1)} minutes of flagged content. The presence of moderate violence, language, or thematic elements requires age-appropriate viewing restrictions.`,

    T16: `The content analysis strongly suggests a T16 rating (suitable for 16+ only). The analysis found ${totalViolations} scenes with significant content violations, including ${highViolations} high-severity violations, totaling ${totalViolationMinutes.toFixed(1)} minutes of flagged content. The material contains substantial violence, adult themes, or strong language that requires mature audience consideration.`,

    T18: `Based on the detailed content analysis, this material requires a T18 rating (suitable for 18+ only). The analysis identified ${totalViolations} scenes with serious content violations, including ${criticalViolations} critical-severity violations, totaling ${totalViolationMinutes.toFixed(1)} minutes of flagged content. The presence of explicit violence, sexual content, or other adult material necessitates strict age restrictions.`,

    C: `The content analysis indicates this material should receive a C rating (prohibited). The analysis found ${totalViolations} scenes with severe content violations, including ${criticalViolations} critical-severity violations, totaling ${totalViolationMinutes.toFixed(1)} minutes of flagged content. The material contains content that violates regulatory standards and is not suitable for public distribution.`,
  }

  return (
    analysisTemplates[rating] ||
    `Based on the content analysis, this material has been assigned a ${rating} rating. The analysis identified ${totalViolations} scenes with content violations totaling ${totalViolationMinutes.toFixed(1)} minutes of flagged content, requiring appropriate age restrictions based on the severity and nature of the violations found.`
  )
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
    default:
      return 'Unknown'
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

const getSceneConfidence = (scene: AnalysisScene) => {
  // Calculate scene confidence as maximum of all detected elements (video + audio)
  // This approach prioritizes the most confident detection for content analysis
  const videoElements = getVideoDetectedElements(scene)
  const audioElements = getAudioDetectedElements(scene)

  const allConfidences = [
    ...videoElements.map((el) => el.confidence),
    ...audioElements.map((el) => el.confidence),
  ]

  if (allConfidences.length === 0) return scene.confidence // fallback to original

  // Use maximum confidence - most confident detection drives the scene assessment
  const maxConfidence = Math.max(...allConfidences)
  return maxConfidence
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
  // Mock video detection with confidence levels - in real implementation, this would come from ML model
  const videoDetections: { [key: string]: { label: string; confidence: number }[] } = {
    'scene-1': [
      { label: 'guns', confidence: 92 },
      { label: 'weapons', confidence: 88 },
      { label: 'robbery', confidence: 85 },
      { label: 'bank', confidence: 78 },
    ],
    'scene-2': [
      { label: 'intimate', confidence: 94 },
      { label: 'nudity', confidence: 91 },
      { label: 'suggestive', confidence: 87 },
    ],
    'scene-3': [
      { label: 'fighting', confidence: 89 },
      { label: 'punches', confidence: 85 },
      { label: 'kicks', confidence: 82 },
      { label: 'violence', confidence: 88 },
    ],
    'scene-4': [
      { label: 'gestures', confidence: 76 },
      { label: 'text', confidence: 68 },
      { label: 'symbols', confidence: 72 },
    ],
    'scene-5': [
      { label: 'fighting', confidence: 91 },
      { label: 'weapons', confidence: 87 },
      { label: 'blood', confidence: 83 },
      { label: 'violence', confidence: 89 },
    ],
    'scene-6': [
      { label: 'nudity', confidence: 95 },
      { label: 'intimate', confidence: 92 },
      { label: 'sexual', confidence: 88 },
      { label: 'suggestive', confidence: 85 },
    ],
  }

  // Return specific detections for known scenes
  if (videoDetections[scene.id]) {
    return videoDetections[scene.id]
  }

  // Fallback based on category
  if (scene.category === 'violence' || scene.category === 'Bạo lực (Violence)') {
    return [
      { label: 'fighting', confidence: 85 },
      { label: 'weapons', confidence: 82 },
      { label: 'blood', confidence: 78 },
    ]
  } else if (
    scene.category === 'adult_content' ||
    scene.category === 'Khỏa thân, tình dục (Nudity & Sexual Content)'
  ) {
    return [
      { label: 'intimate', confidence: 88 },
      { label: 'nudity', confidence: 85 },
      { label: 'suggestive', confidence: 82 },
    ]
  } else if (
    scene.category === 'language' ||
    scene.category === 'Ngôn ngữ thô tục (Crude Language)'
  ) {
    return [
      { label: 'gestures', confidence: 75 },
      { label: 'text', confidence: 68 },
      { label: 'symbols', confidence: 72 },
    ]
  }
  return []
}

const getAudioDetectionDescription = () => {
  return 'Audio content analysis detected potential issues'
}

const getAudioDetectedElements = (scene: AnalysisScene) => {
  // Mock audio detection with confidence levels - in real implementation, this would come from ML model
  const audioDetections: { [key: string]: { label: string; confidence: number }[] } = {
    'scene-1': [
      { label: 'gunshots', confidence: 95 },
      { label: 'screams', confidence: 88 },
      { label: 'threats', confidence: 92 },
      { label: 'robbery dialogue', confidence: 85 },
    ],
    'scene-2': [
      { label: 'intimate sounds', confidence: 91 },
      { label: 'romantic music', confidence: 78 },
      { label: 'whispers', confidence: 82 },
    ],
    'scene-3': [
      { label: 'fighting sounds', confidence: 87 },
      { label: 'grunts', confidence: 83 },
      { label: 'impact sounds', confidence: 89 },
    ],
    'scene-4': [
      { label: 'profanity', confidence: 94 },
      { label: 'strong language', confidence: 88 },
      { label: 'aggressive tone', confidence: 76 },
    ],
    'scene-5': [
      { label: 'screams', confidence: 93 },
      { label: 'gunshots', confidence: 89 },
      { label: 'explosions', confidence: 85 },
      { label: 'threats', confidence: 91 },
    ],
    'scene-6': [
      { label: 'moans', confidence: 96 },
      { label: 'intimate sounds', confidence: 92 },
      { label: 'suggestive audio', confidence: 88 },
    ],
  }

  // Return specific detections for known scenes
  if (audioDetections[scene.id]) {
    return audioDetections[scene.id]
  }

  // Fallback based on category
  if (scene.category === 'language' || scene.category === 'Ngôn ngữ thô tục (Crude Language)') {
    return scene.keywords
      .filter((keyword) =>
        ['hell', 'damn', 'shit', 'fuck', 'bitch', 'ass'].includes(keyword.toLowerCase()),
      )
      .map((keyword) => ({ label: keyword, confidence: 85 + Math.random() * 10 }))
  } else if (scene.category === 'violence' || scene.category === 'Bạo lực (Violence)') {
    return [
      { label: 'screams', confidence: 87 },
      { label: 'gunshots', confidence: 89 },
      { label: 'explosions', confidence: 83 },
    ]
  } else if (
    scene.category === 'adult_content' ||
    scene.category === 'Khỏa thân, tình dục (Nudity & Sexual Content)'
  ) {
    return [
      { label: 'moans', confidence: 91 },
      { label: 'intimate sounds', confidence: 88 },
      { label: 'suggestive audio', confidence: 85 },
    ]
  }
  return []
}

const getLLMReasoning = (scene: AnalysisScene) => {
  // This would come from the backend LLM analysis
  // For now, generating realistic reasoning based on the scene data
  const category = scene.category
  const severity = scene.severity
  const confidence = scene.confidence

  const reasoningTemplates: { [key: string]: { [key: string]: string } } = {
    critical: {
      Violence: `The ML model detected violent content with ${confidence}% confidence. The LLM analysis identified explicit violence including gun violence, detailed crime techniques, and graphic depictions that could cause distress to viewers. The combination of visual violence indicators and threatening language in the transcript ("shoot", "robbery") indicates this content requires immediate attention and likely content editing or higher age rating.`,
      'Bạo lực (Violence)': `The ML model detected violent content with ${confidence}% confidence. The LLM analysis identified explicit violence including gun violence, detailed crime techniques, and graphic depictions that could cause distress to viewers. The combination of visual violence indicators and threatening language in the transcript ("shoot", "robbery") indicates this content requires immediate attention and likely content editing or higher age rating.`,
      'Adult Content': `The ML model detected adult content with ${confidence}% confidence. The LLM analysis identified explicit sexual content and nudity that goes beyond suggestive material. The visual indicators combined with intimate dialogue suggest this content requires content removal or 18+ rating to comply with content guidelines.`,
      'Khỏa thân, tình dục (Nudity & Sexual Content)': `The ML model detected adult content with ${confidence}% confidence. The LLM analysis identified explicit sexual content and nudity that goes beyond suggestive material. The visual indicators combined with intimate dialogue suggest this content requires content removal or 18+ rating to comply with content guidelines.`,
      Language: `The ML model detected strong language with ${confidence}% confidence. The LLM analysis identified profanity and inappropriate language that exceeds acceptable limits for general audiences. The language patterns suggest this content may significantly impact the content rating.`,
      'Ngôn ngữ thô tục (Crude Language)': `The ML model detected strong language with ${confidence}% confidence. The LLM analysis identified profanity and inappropriate language that exceeds acceptable limits for general audiences. The language patterns suggest this content may significantly impact the content rating.`,
    },
    high: {
      Violence: `The ML model detected violent content with ${confidence}% confidence. The LLM analysis identified significant violence that may affect content rating. While not as explicit as critical cases, the violence indicators and context suggest this content requires review and may need age restrictions.`,
      'Bạo lực (Violence)': `The ML model detected violent content with ${confidence}% confidence. The LLM analysis identified significant violence that may affect content rating. While not as explicit as critical cases, the violence indicators and context suggest this content requires review and may need age restrictions.`,
      'Adult Content': `The ML model detected adult content with ${confidence}% confidence. The LLM analysis identified sexual content that may require age restrictions. The content goes beyond mild suggestions and may impact the overall content rating.`,
      'Khỏa thân, tình dục (Nudity & Sexual Content)': `The ML model detected adult content with ${confidence}% confidence. The LLM analysis identified sexual content that may require age restrictions. The content goes beyond mild suggestions and may impact the overall content rating.`,
      Language: `The ML model detected language issues with ${confidence}% confidence. The LLM analysis identified language that may impact content rating. The language patterns suggest this content may need review for age-appropriate classification.`,
      'Ngôn ngữ thô tục (Crude Language)': `The ML model detected language issues with ${confidence}% confidence. The LLM analysis identified language that may impact content rating. The language patterns suggest this content may need review for age-appropriate classification.`,
    },
    medium: {
      Violence: `The ML model detected violent content with ${confidence}% confidence. The LLM analysis identified moderate violence that may need review. The content contains violence indicators but may be acceptable with appropriate age restrictions.`,
      'Bạo lực (Violence)': `The ML model detected violent content with ${confidence}% confidence. The LLM analysis identified moderate violence that may need review. The content contains violence indicators but may be acceptable with appropriate age restrictions.`,
      'Adult Content': `The ML model detected adult content with ${confidence}% confidence. The LLM analysis identified content that may need consideration. The material is suggestive but may be acceptable with appropriate context and age restrictions.`,
      'Khỏa thân, tình dục (Nudity & Sexual Content)': `The ML model detected adult content with ${confidence}% confidence. The LLM analysis identified content that may need consideration. The material is suggestive but may be acceptable with appropriate context and age restrictions.`,
      Language: `The ML model detected language issues with ${confidence}% confidence. The LLM analysis identified language that may need review. The language patterns suggest this content may be acceptable but should be reviewed for appropriateness.`,
      'Ngôn ngữ thô tục (Crude Language)': `The ML model detected language issues with ${confidence}% confidence. The LLM analysis identified language that may need review. The language patterns suggest this content may be acceptable but should be reviewed for appropriateness.`,
    },
    low: {
      Violence: `The ML model detected violent content with ${confidence}% confidence. The LLM analysis identified minor violence that may be acceptable. The content contains minimal violence indicators that are unlikely to significantly impact content rating.`,
      'Bạo lực (Violence)': `The ML model detected violent content with ${confidence}% confidence. The LLM analysis identified minor violence that may be acceptable. The content contains minimal violence indicators that are unlikely to significantly impact content rating.`,
      'Adult Content': `The ML model detected adult content with ${confidence}% confidence. The LLM analysis identified minimal content impact. The material is very mild and unlikely to require significant content restrictions.`,
      'Khỏa thân, tình dục (Nudity & Sexual Content)': `The ML model detected adult content with ${confidence}% confidence. The LLM analysis identified minimal content impact. The material is very mild and unlikely to require significant content restrictions.`,
      Language: `The ML model detected language issues with ${confidence}% confidence. The LLM analysis identified minor language that may be acceptable. The language patterns suggest this content is unlikely to significantly impact content rating.`,
      'Ngôn ngữ thô tục (Crude Language)': `The ML model detected language issues with ${confidence}% confidence. The LLM analysis identified minor language that may be acceptable. The language patterns suggest this content is unlikely to significantly impact content rating.`,
    },
  }

  return (
    reasoningTemplates[severity]?.[category] ||
    `The ML model detected ${category.toLowerCase()} content with ${confidence}% confidence. The LLM analysis suggests this content requires review based on the detected patterns and context.`
  )
}

// Helper functions for rating display
const getRatingColorClass = (color: string) => {
  const colorMap: { [key: string]: string } = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    orange: 'bg-orange-100 text-orange-800',
    red: 'bg-red-100 text-red-800',
    'red-900': 'bg-red-900 text-white',
    gray: 'bg-gray-100 text-gray-800',
  }
  return colorMap[color] || 'bg-gray-100 text-gray-800'
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
