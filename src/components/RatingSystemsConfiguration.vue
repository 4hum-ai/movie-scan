<template>
  <div class="mx-auto max-w-6xl">
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Content Rating Systems -->
      <div class="rounded-lg border bg-white shadow-sm">
        <div class="p-6">
          <div class="mb-4">
            <h2 class="text-lg font-medium text-gray-900">Content Rating Systems</h2>
          </div>

          <!-- Rating System Selection -->
          <div class="mb-6">
            <label class="mb-2 block text-sm font-medium text-gray-700">Select Rating System</label>
            <select
              v-model="selectedRatingSystemId"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Choose a rating system...</option>
              <option v-for="system in ratingSystems" :key="system?.id" :value="system?.id">
                {{ system?.name || 'Unknown System' }}
              </option>
            </select>
          </div>

          <!-- Reference Information -->
          <div
            v-if="
              selectedRatingSystem &&
              selectedRatingSystem.references &&
              selectedRatingSystem.references.length > 0
            "
            class="mb-4 rounded-lg bg-blue-50 p-3"
          >
            <h4 class="text-sm font-medium text-blue-900">Reference</h4>
            <div
              v-for="(reference, index) in selectedRatingSystem.references"
              :key="index"
              class="mb-2"
            >
              <p class="text-xs text-blue-800">
                <a
                  v-if="reference?.url"
                  :href="reference.url"
                  target="_blank"
                  class="no-underline hover:underline"
                  >{{ reference?.title || 'No title' }}</a
                >
                <span v-else>{{ reference?.title || 'No title' }}</span>
              </p>
              <p class="text-xs text-blue-700">
                {{ reference?.source || 'No source' }}
              </p>
            </div>
          </div>

          <!-- Rating System Details -->
          <div v-if="selectedRatingSystem" class="mb-6">
            <h3 class="mb-3 text-sm font-medium text-gray-700">Rating Levels</h3>

            <!-- Dynamic Rating Levels from API -->
            <div
              v-if="selectedRatingSystem?.levels && selectedRatingSystem.levels.length > 0"
              class="space-y-2"
            >
              <div
                v-for="level in selectedRatingSystem.levels"
                :key="level?.key || level?.title"
                class="rounded-lg p-3"
                :class="getLevelColorClass(level?.key || '')"
              >
                <div class="flex-1">
                  <span class="text-sm font-medium text-gray-900">{{
                    level?.title || 'No title'
                  }}</span>
                  <p class="mt-1 text-xs text-gray-500">
                    {{ level?.description || 'No description' }}
                  </p>
                  <p
                    v-if="level?.guide"
                    class="bg-opacity-50 mt-2 rounded bg-white p-2 text-xs text-gray-600"
                  >
                    {{ level.guide }}
                  </p>
                </div>
              </div>
            </div>

            <!-- No levels available -->
            <div v-else class="rounded-lg border border-dashed border-gray-300 p-4 text-center">
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
              <p class="mt-2 text-sm text-gray-500">No rating levels defined</p>
            </div>
          </div>

          <!-- No rating system selected -->
          <div v-else class="mb-6">
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
              <p class="mt-2 text-sm text-gray-500">Please select a rating system to view levels</p>
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
            <!-- Dynamic Guidelines List from API -->
            <div
              v-if="
                selectedRatingSystem &&
                selectedRatingSystem.guidelines &&
                selectedRatingSystem.guidelines.length > 0
              "
              class="mb-4 space-y-6"
            >
              <!-- Group guidelines by group -->
              <div v-for="group in groupedGuidelines" :key="group?.name || 'unknown'">
                <h4 class="mb-3 text-sm font-semibold text-gray-800">
                  {{ group?.name || 'Unknown Group' }}
                </h4>
                <div class="space-y-2">
                  <div
                    v-for="guideline in group?.guidelines || []"
                    :key="guideline?.name || 'unknown'"
                    class="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      v-model="selectedGuidelines[guideline?.name || '']"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div class="flex-1 rounded-lg border bg-white p-3">
                      <div class="flex items-center justify-between">
                        <div>
                          <span class="text-sm font-medium text-gray-900">{{
                            guideline?.name || 'No name'
                          }}</span>
                          <p class="text-xs text-gray-500">
                            {{ guideline?.description || 'No description' }}
                          </p>
                          <!-- Keywords -->
                          <div
                            v-if="guideline?.keywords && guideline.keywords.length > 0"
                            class="mt-2"
                          >
                            <div class="flex flex-wrap gap-1">
                              <span
                                v-for="keyword in guideline.keywords"
                                :key="keyword?.key || keyword?.label"
                                class="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                              >
                                {{ keyword?.label || 'No label' }}
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

            <!-- No guidelines available -->
            <div
              v-else-if="selectedRatingSystem"
              class="rounded-lg border border-dashed border-gray-300 p-4 text-center"
            >
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
              <p class="mt-2 text-sm text-gray-500">No guidelines defined for this rating system</p>
            </div>

            <!-- No rating system selected -->
            <div v-else class="rounded-lg border border-dashed border-gray-300 p-4 text-center">
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
              <p class="mt-2 text-sm text-gray-500">
                Please select a rating system to view guidelines
              </p>
            </div>

            <!-- Custom Guidelines -->
            <div v-if="customGuidelines.length > 0" class="mt-6">
              <h4 class="mb-3 text-sm font-semibold text-gray-800">Custom Guidelines</h4>
              <div
                v-for="(guideline, index) in customGuidelines"
                :key="`custom-${index}`"
                class="mb-2 flex items-center space-x-2"
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
            <div class="mt-4 flex space-x-2">
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRatingSystems, type RatingSystemGuideline } from '@/composables/useRatingSystems'

interface Emits {
  (e: 'back'): void
  (e: 'continue'): void
  (e: 'rating-system-selected', ratingSystemId: string): void
}

const emit = defineEmits<Emits>()

// Initialize rating systems composable
const { ratingSystems, getAllRatingSystems } = useRatingSystems()

// Guideline configuration
const selectedGuidelines = ref<Record<string, boolean>>({})
const customGuidelines = ref<string[]>([])
const newGuideline = ref('')

// Selected rating system
const selectedRatingSystemId = ref('')

// Computed selected rating system object
const selectedRatingSystem = computed(() => {
  if (!selectedRatingSystemId.value) return null
  return ratingSystems.value.find((system) => system.id === selectedRatingSystemId.value) || null
})

// Auto-check all guidelines when rating system changes
watch(
  selectedRatingSystem,
  (newSystem) => {
    if (newSystem && newSystem.guidelines) {
      // Reset selected guidelines
      selectedGuidelines.value = {}

      // Auto-check all guidelines
      newSystem.guidelines.forEach((guideline) => {
        if (guideline?.name) {
          selectedGuidelines.value[guideline.name] = true
        }
      })
    }
  },
  { immediate: true },
)

// Emit rating system selection when it changes
watch(
  selectedRatingSystemId,
  (newId) => {
    if (newId) {
      emit('rating-system-selected', newId)
    }
  },
  { immediate: true },
)

// Group guidelines by group name
const groupedGuidelines = computed(() => {
  if (
    !selectedRatingSystem.value ||
    !selectedRatingSystem.value.guidelines ||
    !Array.isArray(selectedRatingSystem.value.guidelines)
  )
    return []

  const groups = new Map<string, { name: string; guidelines: RatingSystemGuideline[] }>()

  selectedRatingSystem.value.guidelines.forEach((guideline) => {
    if (!guideline) return // Skip null/undefined guidelines
    const groupName = guideline?.group || 'Other'
    if (!groups.has(groupName)) {
      groups.set(groupName, { name: groupName, guidelines: [] })
    }
    groups.get(groupName)!.guidelines.push(guideline)
  })

  return Array.from(groups.values())
})

// Get color class for rating level based on key
const getLevelColorClass = (key: string) => {
  const keyLower = key.toLowerCase()
  if (keyLower.includes('p') && !keyLower.includes('pg')) return 'bg-green-50'
  if (keyLower.includes('k')) return 'bg-blue-50'
  if (keyLower.includes('13')) return 'bg-yellow-50'
  if (keyLower.includes('16')) return 'bg-orange-50'
  if (keyLower.includes('18')) return 'bg-red-50'
  if (keyLower.includes('c')) return 'bg-red-100'
  if (keyLower.includes('g')) return 'bg-green-50'
  if (keyLower.includes('pg')) return 'bg-blue-50'
  if (keyLower.includes('r')) return 'bg-orange-50'
  if (keyLower.includes('nc')) return 'bg-red-50'
  if (keyLower.includes('u')) return 'bg-green-50'
  if (keyLower.includes('12')) return 'bg-yellow-50'
  if (keyLower.includes('15')) return 'bg-red-50'
  if (keyLower.includes('fsk')) {
    if (keyLower.includes('0')) return 'bg-green-50'
    if (keyLower.includes('6')) return 'bg-blue-50'
    if (keyLower.includes('12')) return 'bg-yellow-50'
    if (keyLower.includes('16')) return 'bg-orange-50'
    if (keyLower.includes('18')) return 'bg-red-50'
  }
  return 'bg-gray-50'
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

// Initialize component
onMounted(async () => {
  // Load rating systems from API
  try {
    await getAllRatingSystems()
    // Auto-select first rating system if available
    if (ratingSystems.value && ratingSystems.value.length > 0 && ratingSystems.value[0]?.id) {
      selectedRatingSystemId.value = ratingSystems.value[0].id
    }
  } catch (error) {
    console.error('Failed to load rating systems:', error)
  }
})
</script>
