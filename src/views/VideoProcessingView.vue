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
          class="animate-scale-in mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-600 p-1"
        >
          <div class="rounded-full bg-white px-4 py-2 dark:bg-gray-900">
            <h1
              class="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-4xl font-bold text-transparent"
            >
              Video Processing
            </h1>
          </div>
        </div>
        <p class="animate-slide-up text-lg text-gray-600 dark:text-gray-300">
          Upload, analyze, and review film content for compliance using advanced AI detection
        </p>
      </div>

      <!-- Progress Indicator -->
      <div class="animate-slide-up mb-12" style="animation-delay: 0.1s">
        <div class="rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
          <Stepper
            :steps="videoProcessingSteps"
            :current-step="currentStep - 1"
            orientation="responsive"
            variant="default"
            size="md"
            :clickable="false"
            :show-connectors="true"
            icon-mode="always-numbers"
            aria-label="Video processing progress"
          />
        </div>
      </div>

      <!-- State 0: Choose Video -->
      <div
        v-if="currentStep === 0"
        class="animate-slide-up mx-auto max-w-4xl"
        style="animation-delay: 0.2s"
      >
        <!-- Upload Area -->
        <div
          class="group relative cursor-pointer overflow-hidden rounded-2xl bg-white/80 p-12 shadow-xl backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl dark:bg-gray-800/80"
          @click="triggerFileUpload"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          ></div>
          <div class="relative text-center">
            <div class="mb-6 flex justify-center">
              <div class="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-4 shadow-lg">
                <svg
                  class="h-12 w-12 text-white"
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
            <div class="mb-6">
              <h3 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                Upload Video Files
              </h3>
              <p class="text-lg text-gray-600 dark:text-gray-300">
                Drag and drop files here, or click to select
              </p>
            </div>
            <div
              class="rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-4 dark:from-gray-700 dark:to-gray-600"
            >
              <p class="text-sm text-gray-600 dark:text-gray-300">
                <span class="font-semibold">Supported formats:</span> MP4, AVI, MOV •
                <span class="font-semibold">Max file size:</span> 10GB
              </p>
            </div>
          </div>
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
      </div>

      <!-- State 1: Define Guidelines -->
      <div
        v-if="currentStep === 1"
        class="animate-slide-up mx-auto max-w-6xl"
        style="animation-delay: 0.2s"
      >
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <!-- Content Guidelines -->
          <div
            class="group relative overflow-hidden rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm transition-all duration-200 hover:shadow-2xl dark:bg-gray-800/80"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            ></div>
            <div class="relative">
              <div class="mb-6 flex items-center justify-between">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Content Guidelines</h2>
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
          <div
            class="group relative overflow-hidden rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm transition-all duration-200 hover:shadow-2xl dark:bg-gray-800/80"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            ></div>
            <div class="relative">
              <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                Content Rating System
              </h2>

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
        <div class="mt-12 flex justify-end space-x-4">
          <button
            @click="currentStep = 1"
            class="rounded-xl border border-gray-300 bg-white/80 px-6 py-3 text-sm font-semibold text-gray-700 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:bg-gray-50 hover:shadow-xl dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Back
          </button>
          <button
            @click="proceedToUploading"
            class="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-green-700 hover:to-emerald-700 hover:shadow-xl"
          >
            Continue to Upload
          </button>
        </div>
      </div>

      <!-- State 2: Uploading -->
      <div
        v-if="currentStep === 2"
        class="animate-slide-up mx-auto max-w-4xl"
        style="animation-delay: 0.2s"
      >
        <div
          class="group relative overflow-hidden rounded-2xl bg-white/80 p-12 shadow-xl backdrop-blur-sm dark:bg-gray-800/80"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-50"
          ></div>
          <div class="relative text-center">
            <div class="mb-6 flex justify-center">
              <div class="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-4 shadow-lg">
                <svg class="h-12 w-12 animate-spin text-white" fill="none" viewBox="0 0 24 24">
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
            </div>
            <h3 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Analyzing Video</h3>
            <p class="mb-8 text-lg text-gray-600 dark:text-gray-300">
              Your video is being analyzed by AI for content detection. This may take a few minutes.
            </p>

            <!-- Upload Progress -->
            <div class="mb-6">
              <div class="mb-2 h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  class="h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg transition-all duration-200"
                  :style="`width: ${videoAnalysis.progress.value}%`"
                ></div>
              </div>
              <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {{ videoAnalysis.progress.value }}% analyzing
              </p>
            </div>

            <!-- Upload Steps -->
            <div class="mt-8 space-y-4">
              <div
                class="flex items-center justify-between rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 shadow-lg dark:from-green-900/20 dark:to-emerald-900/20"
              >
                <span class="text-sm font-semibold text-gray-900 dark:text-white"
                  >File Validation</span
                >
                <span class="rounded-full bg-green-500 px-3 py-1 text-sm font-semibold text-white"
                  >✓ Complete</span
                >
              </div>
              <div
                class="flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 p-4 shadow-lg dark:from-blue-900/20 dark:to-cyan-900/20"
              >
                <span class="text-sm font-semibold text-gray-900 dark:text-white"
                  >AI Analysis in Progress</span
                >
                <span
                  class="animate-pulse rounded-full bg-blue-500 px-3 py-1 text-sm font-semibold text-white"
                  >In Progress...</span
                >
              </div>
              <div
                class="flex items-center justify-between rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 p-4 shadow-lg dark:from-gray-800/50 dark:to-slate-800/50"
              >
                <span class="text-sm font-semibold text-gray-900 dark:text-white"
                  >Generate Report</span
                >
                <span class="rounded-full bg-gray-400 px-3 py-1 text-sm font-semibold text-white"
                  >Pending</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- State 3: Complete Upload -->
    <div
      v-if="currentStep === 3"
      class="animate-slide-up mx-auto max-w-4xl"
      style="animation-delay: 0.2s"
    >
      <div
        class="group relative overflow-hidden rounded-2xl bg-white/80 p-12 shadow-xl backdrop-blur-sm dark:bg-gray-800/80"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-50"
        ></div>
        <div class="relative text-center">
          <!-- Success Icon -->
          <div class="mb-6 flex justify-center">
            <div class="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-4 shadow-lg">
              <svg
                class="h-16 w-16 text-white"
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
          </div>

          <h3 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Scan Requested!</h3>
          <p class="mb-8 text-lg text-gray-600 dark:text-gray-300">
            Your video has been successfully uploaded and queued for AI Scan.
          </p>

          <!-- Report ID -->
          <div
            class="mb-8 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 p-8 shadow-xl dark:from-green-900/20 dark:to-emerald-900/20"
          >
            <h4 class="mb-4 text-xl font-bold text-green-900 dark:text-green-100">Report ID</h4>
            <div class="flex items-center justify-center space-x-3">
              <button
                @click="goToReport"
                class="cursor-pointer rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-mono text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
                title="Click to view report"
              >
                {{ reportId }}
              </button>
              <button
                @click="copyReportId"
                class="rounded-xl bg-white/80 px-4 py-3 text-sm font-semibold text-green-600 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:bg-white hover:shadow-xl dark:bg-gray-800/80 dark:text-green-400"
              >
                Copy
              </button>
            </div>
            <p class="mt-4 text-sm text-green-700 dark:text-green-300">
              Click the ID to view your report, or copy it to track progress later.
            </p>
          </div>

          <!-- Status Information -->
          <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div
              class="rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 p-6 shadow-lg dark:from-blue-900/20 dark:to-cyan-900/20"
            >
              <h5 class="text-sm font-semibold text-gray-900 dark:text-white">Analysis Status</h5>
              <p class="mt-2 text-lg font-bold text-blue-600 dark:text-blue-400">
                Queued for Processing
              </p>
            </div>
            <div
              class="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-6 shadow-lg dark:from-purple-900/20 dark:to-pink-900/20"
            >
              <h5 class="text-sm font-semibold text-gray-900 dark:text-white">Estimated Time</h5>
              <p class="mt-2 text-lg font-bold text-purple-600 dark:text-purple-400">
                {{ videoLength > 0 ? `${Math.ceil(videoLength * 5)} minutes` : 'Calculating...' }}
              </p>
            </div>
            <div
              class="rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 p-6 shadow-lg dark:from-gray-800/50 dark:to-slate-800/50"
            >
              <h5 class="text-sm font-semibold text-gray-900 dark:text-white">Notification</h5>
              <p class="mt-2 text-lg font-bold text-gray-600 dark:text-gray-400">
                Email when ready
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div
            class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-6"
          >
            <button
              @click="viewReports"
              class="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl"
            >
              View All Reports
            </button>
            <button
              @click="uploadMoreVideos"
              class="rounded-xl border border-gray-300 bg-white/80 px-8 py-4 text-lg font-semibold text-gray-700 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:bg-gray-50 hover:shadow-xl dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Scan Another Video
            </button>
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
import { useVideoAnalysisAuth, useVideoAnalysis } from '@/composables/video-analysis'
import { useVideoAnalysisTransform } from '@/composables/video-analysis/useTransform'
import { useReportsStore } from '@/stores/reports'
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

// Video Analysis Auth
const videoAnalysisAuth = useVideoAnalysisAuth({
  baseUrl: import.meta.env.VITE_DOPIKAI_BASE_URL,
  clientId: import.meta.env.VITE_DOPIKAI_CLIENT_ID,
  accessKey: import.meta.env.VITE_DOPIKAI_ACCESS_KEY,
})

// Video Analysis
const videoAnalysis = useVideoAnalysis(
  {
    baseUrl: import.meta.env.VITE_DOPIKAI_BASE_URL,
    clientId: import.meta.env.VITE_DOPIKAI_CLIENT_ID,
    accessKey: import.meta.env.VITE_DOPIKAI_ACCESS_KEY,
  },
  () => videoAnalysisAuth.getValidToken()
)

// Video Analysis Transform
const { transformToReportData } = useVideoAnalysisTransform()

// Reports Store
const { storeReport } = useReportsStore()

// State management
const currentStep = ref(0) // 0: Choose Video, 1: Define Guidelines, 2: Uploading, 3: Complete Upload
const uploadProgress = ref(0)
const reportId = ref('')
const videoLength = ref(0) // Video length in minutes
const selectedVideoFile = ref<File | null>(null)

// Authentication steps state (removed - no longer needed)

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
  countryGuidelines.forEach(guideline => {
    selectedGuidelines.value[guideline.id] = guideline.enabled
  })
}

// Trigger file upload dialog
const triggerFileUpload = () => {
  const fileInput = document.getElementById('file-upload') as HTMLInputElement
  if (fileInput) {
    fileInput.click()
  }
}

// File upload handler
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files && files.length > 0) {
    // Store the selected file
    const file = files[0]
    selectedVideoFile.value = file

    // Get video duration for time estimation
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      videoLength.value = Math.ceil(video.duration / 60) // Convert to minutes
    }
    video.src = URL.createObjectURL(file)

    // Move to guideline configuration step
    currentStep.value = 1
  }
}

// Proceed to uploading after guidelines are configured
const proceedToUploading = async () => {
  currentStep.value = 2
  await performVideoAnalysis()
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

// Perform actual video analysis
const performVideoAnalysis = async () => {
  if (!selectedVideoFile.value) {
    return
  }

  try {
    // Start analysis with real API call
    const result = await videoAnalysis.analyzeVideo(selectedVideoFile.value)

    // Generate report ID
    reportId.value = generateReportId()

    // Get selected guidelines
    const selectedGuidelinesList = Object.entries(selectedGuidelines.value)
      .filter(([, enabled]) => enabled)
      .map(([guideline]) => guideline)

    // Transform analysis result to report data
    const reportData = transformToReportData(
      result,
      selectedVideoFile.value,
      reportId.value,
      selectedRatingSystem.value,
      selectedGuidelinesList,
      customGuidelines.value
    )

    // Store the report data with additional required properties
    storeReport({
      ...reportData,
      ratingSystem: selectedRatingSystem.value,
      guidelines: selectedGuidelinesList,
      customGuidelines: customGuidelines.value,
    })

    setTimeout(() => {
      currentStep.value = 3
    }, 1000)
  } catch {
    // Reset to previous step
    currentStep.value = 1
  }
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
  currentStep.value = 0 // Start from choose video
  uploadProgress.value = 0
  reportId.value = ''
  videoLength.value = 0
  selectedVideoFile.value = null
  customGuidelines.value = []
  newGuideline.value = ''

  // Clear video analysis results
  videoAnalysis.clearResults()
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
onMounted(async () => {
  // Initialize with country defaults
  onCountryChange()
})
</script>
