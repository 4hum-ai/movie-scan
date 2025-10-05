<template>
  <div class="bg-background min-h-screen">
    <!-- Main Content -->
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Video Processing</h1>
        <p class="mt-2 text-sm text-gray-600">
          Upload, analyze, and review film content for compliance
        </p>
      </div>

      <!-- Progress Indicator -->
      <div class="mb-8">
        <Stepper
          :steps="videoProcessingSteps"
          :current-step="currentStep - 1"
          orientation="responsive"
          variant="default"
          size="md"
          :clickable="false"
          :show-connectors="true"
          aria-label="Video processing progress"
        />
      </div>

      <!-- State 1: Choose Video -->
      <div v-if="currentStep === 1" class="mx-auto max-w-4xl">
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
                  @change="handleFileUpload"
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
      </div>

      <!-- State 2: Define Guidelines -->
      <div v-if="currentStep === 2" class="mx-auto max-w-6xl">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <!-- Content Guidelines -->
          <div class="rounded-lg border bg-white shadow-sm">
            <div class="p-6">
              <div class="mb-4 flex items-center justify-between">
                <h2 class="text-lg font-medium text-gray-900">Content Guidelines</h2>
                <div class="flex items-center space-x-2">
                  <label class="text-sm font-medium text-gray-700">Country:</label>
                  <select
                    v-model="selectedCountry"
                    @change="onCountryChange"
                    class="rounded-md border border-gray-300 px-3 py-1 text-sm"
                  >
                    <option
                      v-for="country in availableCountries"
                      :key="country.id"
                      :value="country.id"
                    >
                      {{ country.name }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Reference Information -->
              <div v-if="currentDefaults.reference" class="mb-4 rounded-lg bg-blue-50 p-3">
                <h4 class="text-sm font-medium text-blue-900">Reference</h4>
                <p class="text-xs text-blue-800">{{ currentDefaults.reference.title }}</p>
                <p class="text-xs text-blue-700">
                  {{ currentDefaults.reference.source }} - {{ currentDefaults.reference.date }}
                </p>
              </div>

              <!-- Guidelines List -->
              <div class="mb-6">
                <h3 class="mb-3 text-sm font-medium text-gray-700">Content Guidelines</h3>

                <!-- Dynamic Guidelines List based on Country -->
                <div class="mb-4 space-y-6">
                  <!-- Content Safety Guidelines -->
                  <div v-if="getGuidelinesByCategory(selectedCountry).safety.length > 0">
                    <h4 class="mb-3 text-sm font-semibold text-gray-800">Content Safety</h4>
                    <div class="space-y-2">
                      <div
                        v-for="guideline in getGuidelinesByCategory(selectedCountry).safety"
                        :key="guideline.id"
                        class="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          v-model="selectedGuidelines[guideline.id]"
                          class="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <div class="flex-1 rounded-lg border bg-white p-3">
                          <div class="flex items-center justify-between">
                            <div>
                              <span class="text-sm font-medium text-gray-900">{{
                                guideline.name
                              }}</span>
                              <p class="text-xs text-gray-500">{{ guideline.description }}</p>
                            </div>
                            <span
                              class="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                              >Predefined</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Legal Compliance Guidelines -->
                  <div v-if="getGuidelinesByCategory(selectedCountry).legal.length > 0">
                    <h4 class="mb-3 text-sm font-semibold text-gray-800">Legal Compliance</h4>
                    <div class="space-y-2">
                      <div
                        v-for="guideline in getGuidelinesByCategory(selectedCountry).legal"
                        :key="guideline.id"
                        class="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          v-model="selectedGuidelines[guideline.id]"
                          class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <div class="flex-1 rounded-lg border bg-white p-3">
                          <div class="flex items-center justify-between">
                            <div>
                              <span class="text-sm font-medium text-gray-900">{{
                                guideline.name
                              }}</span>
                              <p class="text-xs text-gray-500">{{ guideline.description }}</p>
                            </div>
                            <span
                              class="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                              >Predefined</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Cultural Sensitivity Guidelines -->
                  <div v-if="getGuidelinesByCategory(selectedCountry).cultural.length > 0">
                    <h4 class="mb-3 text-sm font-semibold text-gray-800">Cultural Sensitivity</h4>
                    <div class="space-y-2">
                      <div
                        v-for="guideline in getGuidelinesByCategory(selectedCountry).cultural"
                        :key="guideline.id"
                        class="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          v-model="selectedGuidelines[guideline.id]"
                          class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <div class="flex-1 rounded-lg border bg-white p-3">
                          <div class="flex items-center justify-between">
                            <div>
                              <span class="text-sm font-medium text-gray-900">{{
                                guideline.name
                              }}</span>
                              <p class="text-xs text-gray-500">{{ guideline.description }}</p>
                            </div>
                            <span
                              class="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                              >Predefined</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Age Appropriateness Guidelines -->
                  <div v-if="getGuidelinesByCategory(selectedCountry).age.length > 0">
                    <h4 class="mb-3 text-sm font-semibold text-gray-800">Age Appropriateness</h4>
                    <div class="space-y-2">
                      <div
                        v-for="guideline in getGuidelinesByCategory(selectedCountry).age"
                        :key="guideline.id"
                        class="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          v-model="selectedGuidelines[guideline.id]"
                          class="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                        />
                        <div class="flex-1 rounded-lg border bg-white p-3">
                          <div class="flex items-center justify-between">
                            <div>
                              <span class="text-sm font-medium text-gray-900">{{
                                guideline.name
                              }}</span>
                              <p class="text-xs text-gray-500">{{ guideline.description }}</p>
                            </div>
                            <span
                              class="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                              >Predefined</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Custom Guidelines -->
                  <div
                    v-for="(guideline, index) in customGuidelines"
                    :key="`custom-${index}`"
                    class="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      :checked="true"
                      class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      disabled
                    />
                    <div class="flex-1 rounded-lg border bg-white p-3">
                      <div class="flex items-center justify-between">
                        <div>
                          <span class="text-sm font-medium text-gray-900">{{ guideline }}</span>
                          <p class="text-xs text-gray-500">Custom guideline</p>
                        </div>
                        <div class="flex items-center space-x-2">
                          <span
                            class="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
                            >Custom</span
                          >
                          <button
                            @click="removeCustomGuideline(index)"
                            class="rounded-md p-1 text-red-600 hover:bg-red-100"
                            title="Remove guideline"
                          >
                            <svg
                              class="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Add New Custom Guideline -->
                <div class="flex space-x-2">
                  <input
                    v-model="newGuideline"
                    type="text"
                    class="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Enter a custom guideline..."
                    @keyup.enter="addCustomGuideline"
                  />
                  <button
                    @click="addCustomGuideline"
                    :disabled="!newGuideline.trim()"
                    class="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    Add Custom
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Content Rating Systems -->
          <div class="rounded-lg border bg-white shadow-sm">
            <div class="p-6">
              <h2 class="mb-4 text-lg font-medium text-gray-900">Content Rating System</h2>

              <!-- Rating System Selection -->
              <div class="mb-6">
                <label class="mb-2 block text-sm font-medium text-gray-700"
                  >Select Rating System</label
                >
                <select
                  v-model="selectedRatingSystem"
                  class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="mpaa">MPAA (Motion Picture Association of America)</option>
                  <option value="bbfc">BBFC (British Board of Film Classification)</option>
                  <option value="fsk">FSK (Germany)</option>
                  <option value="vietnam">Vietnam Film Classification</option>
                  <option value="custom">Custom Rating System</option>
                </select>
              </div>

              <!-- Rating System Details -->
              <div class="mb-6">
                <h3 class="mb-3 text-sm font-medium text-gray-700">Rating Levels</h3>

                <!-- MPAA Rating System -->
                <div v-if="selectedRatingSystem === 'mpaa'" class="space-y-2">
                  <div class="flex items-center justify-between rounded-lg bg-green-50 p-3">
                    <span class="text-sm font-medium text-gray-900">G - General Audiences</span>
                    <span class="text-xs text-gray-500">All ages admitted</span>
                  </div>
                  <div class="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                    <span class="text-sm font-medium text-gray-900">PG - Parental Guidance</span>
                    <span class="text-xs text-gray-500"
                      >Some material may not be suitable for children</span
                    >
                  </div>
                  <div class="flex items-center justify-between rounded-lg bg-yellow-50 p-3">
                    <span class="text-sm font-medium text-gray-900"
                      >PG-13 - Parents Strongly Cautioned</span
                    >
                    <span class="text-xs text-gray-500"
                      >Some material may be inappropriate for children under 13</span
                    >
                  </div>
                  <div class="flex items-center justify-between rounded-lg bg-orange-50 p-3">
                    <span class="text-sm font-medium text-gray-900">R - Restricted</span>
                    <span class="text-xs text-gray-500"
                      >Under 17 requires accompanying parent or adult guardian</span
                    >
                  </div>
                  <div class="flex items-center justify-between rounded-lg bg-red-50 p-3">
                    <span class="text-sm font-medium text-gray-900"
                      >NC-17 - No One 17 and Under Admitted</span
                    >
                    <span class="text-xs text-gray-500">No one 17 and under admitted</span>
                  </div>
                </div>

                <!-- BBFC Rating System -->
                <div v-if="selectedRatingSystem === 'bbfc'" class="space-y-2">
                  <div class="flex items-center justify-between rounded-lg bg-green-50 p-3">
                    <span class="text-sm font-medium text-gray-900">U - Universal</span>
                    <span class="text-xs text-gray-500">Suitable for all ages</span>
                  </div>
                  <div class="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                    <span class="text-sm font-medium text-gray-900">PG - Parental Guidance</span>
                    <span class="text-xs text-gray-500"
                      >General viewing, but some scenes may be unsuitable for young children</span
                    >
                  </div>
                  <div class="flex items-center justify-between rounded-lg bg-yellow-50 p-3">
                    <span class="text-sm font-medium text-gray-900"
                      >12A - Suitable for 12 years and over</span
                    >
                    <span class="text-xs text-gray-500"
                      >Cinema release suitable for 12 years and over</span
                    >
                  </div>
                  <div class="flex items-center justify-between rounded-lg bg-orange-50 p-3">
                    <span class="text-sm font-medium text-gray-900"
                      >12 - Suitable for 12 years and over</span
                    >
                    <span class="text-xs text-gray-500"
                      >Video release suitable for 12 years and over</span
                    >
                  </div>
                  <div class="flex items-center justify-between rounded-lg bg-red-50 p-3">
                    <span class="text-sm font-medium text-gray-900"
                      >15 - Suitable only for 15 years and over</span
                    >
                    <span class="text-xs text-gray-500"
                      >No one younger than 15 may see a 15-rated film</span
                    >
                  </div>
                  <div class="flex items-center justify-between rounded-lg bg-red-100 p-3">
                    <span class="text-sm font-medium text-gray-900"
                      >18 - Suitable only for adults</span
                    >
                    <span class="text-xs text-gray-500"
                      >No one younger than 18 may see an 18-rated film</span
                    >
                  </div>
                </div>

                <!-- FSK Rating System -->
                <div v-if="selectedRatingSystem === 'fsk'" class="space-y-2">
                  <div class="flex items-center justify-between rounded-lg bg-green-50 p-3">
                    <span class="text-sm font-medium text-gray-900"
                      >FSK 0 - Freigegeben ohne Altersbeschränkung</span
                    >
                    <span class="text-xs text-gray-500">Released without age restriction</span>
                  </div>
                  <div class="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                    <span class="text-sm font-medium text-gray-900"
                      >FSK 6 - Freigegeben ab 6 Jahren</span
                    >
                    <span class="text-xs text-gray-500">Released for ages 6 and up</span>
                  </div>
                  <div class="flex items-center justify-between rounded-lg bg-yellow-50 p-3">
                    <span class="text-sm font-medium text-gray-900"
                      >FSK 12 - Freigegeben ab 12 Jahren</span
                    >
                    <span class="text-xs text-gray-500">Released for ages 12 and up</span>
                  </div>
                  <div class="flex items-center justify-between rounded-lg bg-orange-50 p-3">
                    <span class="text-sm font-medium text-gray-900"
                      >FSK 16 - Freigegeben ab 16 Jahren</span
                    >
                    <span class="text-xs text-gray-500">Released for ages 16 and up</span>
                  </div>
                  <div class="flex items-center justify-between rounded-lg bg-red-50 p-3">
                    <span class="text-sm font-medium text-gray-900"
                      >FSK 18 - Freigegeben ab 18 Jahren</span
                    >
                    <span class="text-xs text-gray-500">Released for ages 18 and up</span>
                  </div>
                </div>

                <!-- Vietnam Rating System -->
                <div v-if="selectedRatingSystem === 'vietnam'" class="space-y-2">
                  <div class="flex items-center justify-between rounded-lg bg-green-50 p-3">
                    <span class="text-sm font-medium text-gray-900">P - Phổ cập</span>
                    <span class="text-xs text-gray-500">Suitable for all ages</span>
                  </div>
                  <div class="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                    <span class="text-sm font-medium text-gray-900">K - Kèm theo</span>
                    <span class="text-xs text-gray-500"
                      >Viewers under 13 admitted when accompanied by parents or guardians</span
                    >
                  </div>
                  <div class="flex items-center justify-between rounded-lg bg-yellow-50 p-3">
                    <span class="text-sm font-medium text-gray-900">T13 - Tuổi 13</span>
                    <span class="text-xs text-gray-500"
                      >Not suitable for viewers under 13 years old</span
                    >
                  </div>
                  <div class="flex items-center justify-between rounded-lg bg-orange-50 p-3">
                    <span class="text-sm font-medium text-gray-900">T16 - Tuổi 16</span>
                    <span class="text-xs text-gray-500"
                      >Not suitable for viewers under 16 years old</span
                    >
                  </div>
                  <div class="flex items-center justify-between rounded-lg bg-red-50 p-3">
                    <span class="text-sm font-medium text-gray-900">T18 - Tuổi 18</span>
                    <span class="text-xs text-gray-500"
                      >Not suitable for viewers under 18 years old</span
                    >
                  </div>
                  <div class="flex items-center justify-between rounded-lg bg-red-100 p-3">
                    <span class="text-sm font-medium text-gray-900">C - Cấm</span>
                    <span class="text-xs text-gray-500">Prohibited from screening</span>
                  </div>
                </div>

                <!-- Custom Rating System -->
                <div v-if="selectedRatingSystem === 'custom'" class="space-y-2">
                  <div class="rounded-lg border border-dashed border-gray-300 p-4 text-center">
                    <svg
                      class="mx-auto h-8 w-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                    <p class="mt-2 text-sm text-gray-500">Define your own rating system</p>
                    <p class="text-xs text-gray-400">
                      You can create custom age ratings and content descriptors
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex justify-end space-x-3">
          <button
            @click="currentStep = 1"
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            @click="proceedToUploading"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Continue to Upload
          </button>
        </div>
      </div>

      <!-- State 3: Uploading -->
      <div v-if="currentStep === 3" class="mx-auto max-w-4xl">
        <div class="rounded-lg border bg-white shadow-sm">
          <div class="p-8">
            <div class="text-center">
              <div class="mx-auto mb-4 h-12 w-12 text-blue-600">
                <svg class="h-12 w-12 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <h3 class="mb-2 text-lg font-medium text-gray-900">Uploading Video</h3>
              <p class="mb-6 text-sm text-gray-600">
                Your video is being uploaded and queued for AI analysis. This may take a few
                minutes.
              </p>

              <!-- Upload Progress -->
              <div class="mb-4 h-2 w-full rounded-full bg-gray-200">
                <div
                  class="h-2 rounded-full bg-blue-600 transition-all duration-300"
                  :style="`width: ${uploadProgress}%`"
                ></div>
              </div>
              <p class="text-sm text-gray-500">{{ uploadProgress }}% uploaded</p>

              <!-- Upload Steps -->
              <div class="mt-8 space-y-3">
                <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span class="text-sm font-medium text-gray-900">File Validation</span>
                  <span class="text-sm text-green-600">✓ Complete</span>
                </div>
                <div class="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                  <span class="text-sm font-medium text-gray-900">Uploading to Server</span>
                  <span class="text-sm text-blue-600">In Progress...</span>
                </div>
                <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span class="text-sm font-medium text-gray-900">Queue for AI Analysis</span>
                  <span class="text-sm text-gray-500">Pending</span>
                </div>
                <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span class="text-sm font-medium text-gray-900">Generate Report ID</span>
                  <span class="text-sm text-gray-500">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- State 4: Complete Upload -->
      <div v-if="currentStep === 4" class="mx-auto max-w-4xl">
        <div class="rounded-lg border bg-white shadow-sm">
          <div class="p-8">
            <div class="text-center">
              <!-- Success Icon -->
              <div class="mx-auto mb-4 h-16 w-16 text-green-600">
                <svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>

              <h3 class="mb-2 text-2xl font-bold text-gray-900">Scan Requested!</h3>
              <p class="mb-6 text-sm text-gray-600">
                Your video has been successfully uploaded and queued for AI Scan.
              </p>

              <!-- Report ID -->
              <div class="mb-8 rounded-lg border border-green-200 bg-green-50 p-6">
                <h4 class="mb-2 text-lg font-medium text-green-900">Report ID</h4>
                <div class="flex items-center justify-center space-x-2">
                  <button
                    @click="goToReport"
                    class="cursor-pointer rounded bg-green-100 px-3 py-1 font-mono text-lg text-green-800 transition-colors hover:bg-green-200"
                    title="Click to view report"
                  >
                    {{ reportId }}
                  </button>
                  <button
                    @click="copyReportId"
                    class="rounded-md bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                  >
                    Copy
                  </button>
                </div>
                <p class="mt-2 text-xs text-green-700">
                  Click the ID to view your report, or copy it to track progress later.
                </p>
              </div>

              <!-- Status Information -->
              <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div class="rounded-lg border bg-gray-50 p-4">
                  <h5 class="text-sm font-medium text-gray-900">Analysis Status</h5>
                  <p class="mt-1 text-sm text-gray-600">Queued for Processing</p>
                </div>
                <div class="rounded-lg border bg-gray-50 p-4">
                  <h5 class="text-sm font-medium text-gray-900">Estimated Time</h5>
                  <p class="mt-1 text-sm text-gray-600">
                    {{
                      videoLength > 0 ? `${Math.ceil(videoLength * 5)} minutes` : 'Calculating...'
                    }}
                  </p>
                </div>
                <div class="rounded-lg border bg-gray-50 p-4">
                  <h5 class="text-sm font-medium text-gray-900">Notification</h5>
                  <p class="mt-1 text-sm text-gray-600">Email when ready</p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div
                class="flex flex-col space-y-3 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4"
              >
                <button
                  @click="viewReports"
                  class="rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
                >
                  View All Reports
                </button>
                <button
                  @click="uploadMoreVideos"
                  class="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Scan Another Video
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
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCountryDefaults } from '@/composables/useCountryDefaults'
import Stepper from '@/components/molecules/Stepper.vue'

const router = useRouter()
const {
  selectedCountry,
  currentDefaults,
  availableCountries,
  getGuidelinesForCountry,
  getRatingSystemForCountry,
  getGuidelinesByCategory,
} = useCountryDefaults()

// State management
const currentStep = ref(1) // 1: Choose Video, 2: Define Guidelines, 3: Uploading, 4: Complete Upload
const uploadProgress = ref(0)
const reportId = ref('')
const videoLength = ref(0) // Video length in minutes

// Stepper configuration
const videoProcessingSteps = ref([
  {
    id: 'choose-video',
    label: 'Choose Video',
    description: 'Select video files to upload',
  },
  {
    id: 'define-guidelines',
    label: 'Define Guidelines',
    description: 'Configure content guidelines and rating system',
  },
  {
    id: 'upload-video',
    label: 'Upload Video',
    description: 'Upload and validate video files',
  },
  {
    id: 'request-scan',
    label: 'Request Scan',
    description: 'Queue video for AI analysis',
  },
])

// Guideline configuration - Dynamic based on country
const selectedGuidelines = ref<Record<string, boolean>>({})

const customGuidelines = ref<string[]>([])
const newGuideline = ref('')

// Content rating system
const selectedRatingSystem = ref(getRatingSystemForCountry(selectedCountry.value))

// Country change handler
const onCountryChange = () => {
  // Update rating system to match country
  selectedRatingSystem.value = getRatingSystemForCountry(selectedCountry.value)

  // Update guidelines to match country defaults
  const countryGuidelines = getGuidelinesForCountry(selectedCountry.value)

  // Reset and populate with country-specific guidelines
  selectedGuidelines.value = {}

  // Apply country-specific guidelines
  countryGuidelines.forEach((guideline) => {
    selectedGuidelines.value[guideline.id] = guideline.enabled
  })
}

// File upload handler
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files && files.length > 0) {
    // Get video duration for time estimation
    const file = files[0]
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      videoLength.value = Math.ceil(video.duration / 60) // Convert to minutes
    }
    video.src = URL.createObjectURL(file)

    // Move to guideline configuration step
    currentStep.value = 2
  }
}

// Proceed to uploading after guidelines are configured
const proceedToUploading = () => {
  currentStep.value = 3
  simulateUpload()
}

// Custom guidelines management
const addCustomGuideline = () => {
  if (newGuideline.value.trim()) {
    customGuidelines.value.push(newGuideline.value.trim())
    newGuideline.value = ''
  }
}

const removeCustomGuideline = (index: number) => {
  customGuidelines.value.splice(index, 1)
}

// Simulate video upload
const simulateUpload = () => {
  const interval = setInterval(() => {
    uploadProgress.value += Math.random() * 15

    if (uploadProgress.value >= 100) {
      uploadProgress.value = 100
      clearInterval(interval)

      // Generate report ID and move to complete state
      reportId.value = generateReportId()
      setTimeout(() => {
        currentStep.value = 4
      }, 1000)
    }
  }, 300)
}

// Generate a unique report ID
const generateReportId = () => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `RPT-${timestamp}-${random}`
}

// Copy report ID to clipboard
const copyReportId = async () => {
  try {
    await navigator.clipboard.writeText(reportId.value)
    // You could add a toast notification here
    console.log('Report ID copied to clipboard')
  } catch (err) {
    console.error('Failed to copy report ID:', err)
  }
}

// Navigate to specific report
const goToReport = () => {
  router.push(`/reports/${reportId.value}`)
}

// Upload more videos (reset workflow)
const uploadMoreVideos = () => {
  currentStep.value = 1
  uploadProgress.value = 0
  reportId.value = ''
  videoLength.value = 0
  customGuidelines.value = []
  newGuideline.value = ''
}

// Navigate to reports
const viewReports = () => {
  router.push('/reports')
}

// Watch for country changes
watch(selectedCountry, () => {
  onCountryChange()
})

// Initialize component
onMounted(() => {
  // Initialize with country defaults
  onCountryChange()
})
</script>
