<template>
  <div class="mx-auto max-w-6xl">
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Content Rating Systems -->
      <div class="rounded-lg border bg-white shadow-sm">
        <div class="p-6">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-medium text-gray-900">Content Rating Systems</h2>
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">Country:</label>
              <select
                v-model="selectedCountry"
                @change="onCountryChange"
                class="rounded-md border border-gray-300 px-3 py-1 text-sm"
              >
                <option v-for="country in availableCountries" :key="country.id" :value="country.id">
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

          <!-- Rating System Selection -->
          <div class="mb-6">
            <label class="mb-2 block text-sm font-medium text-gray-700">Select Rating System</label>
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
                <span class="text-sm font-medium text-gray-900">18 - Suitable only for adults</span>
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

      <!-- Content Guidelines -->
      <div class="rounded-lg border bg-white shadow-sm">
        <div class="p-6">
          <h2 class="mb-4 text-lg font-medium text-gray-900">Content Guidelines</h2>

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
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </div>

    <!-- Action Buttons -->
    <div class="mt-8 flex justify-end space-x-3">
      <button
        @click="$emit('back')"
        class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Back
      </button>
      <button
        @click="$emit('continue')"
        class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Continue to Video Selection
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useCountryDefaults } from '@/composables/useCountryDefaults'
import { useRatingSystems } from '@/composables/useRatingSystems'

interface Emits {
  (e: 'back'): void
  (e: 'continue'): void
}

defineEmits<Emits>()

const {
  selectedCountry,
  currentDefaults,
  availableCountries,
  getGuidelinesForCountry,
  getRatingSystemForCountry,
  getGuidelinesByCategory,
} = useCountryDefaults()

// Initialize rating systems composable
const { getAllRatingSystems } = useRatingSystems()

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

// Watch for country changes
watch(selectedCountry, () => {
  onCountryChange()
})

// Initialize component
onMounted(async () => {
  // Initialize with country defaults
  onCountryChange()

  // Load rating systems from API
  try {
    await getAllRatingSystems()
  } catch (error) {
    console.error('Failed to load rating systems:', error)
  }
})
</script>
