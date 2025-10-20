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
              <option v-for="system in ratingSystems" :key="system.id" :value="system.id">
                {{ system.name || 'Unknown System' }}
              </option>
            </select>
          </div>

          <!-- Reference Information -->
          <ReferenceSection :references="selectedRatingSystem?.references as any" />

          <!-- Rating System Details -->
          <div v-if="selectedRatingSystem" class="mb-6">
            <h3 class="mb-3 text-sm font-medium text-gray-700">Rating Levels</h3>

            <!-- Dynamic Rating Levels from API -->
            <div v-if="hasRatingLevels" class="space-y-2">
              <RatingLevel
                v-for="level in selectedRatingSystem.levels"
                :key="level.key || level.title"
                :level="level"
              />
            </div>

            <!-- No levels available -->
            <EmptyState v-else message="No rating levels defined" />
          </div>

          <!-- No rating system selected -->
          <EmptyState v-else message="Please select a rating system to view levels" />
        </div>
      </div>

      <!-- Content Guidelines -->
      <div class="rounded-lg border bg-white shadow-sm">
        <div class="p-6">
          <h2 class="mb-4 text-lg font-medium text-gray-900">Content Guidelines</h2>

          <!-- Guidelines List -->
          <div class="mb-6">
            <!-- Dynamic Guidelines List from API -->
            <div v-if="hasGuidelines" class="mb-4 space-y-6">
              <!-- Group guidelines by group -->
              <div v-for="group in groupedGuidelines" :key="group.name || 'unknown'">
                <h4 class="mb-3 text-sm font-semibold text-gray-800">
                  {{ group.name || 'Unknown Group' }}
                </h4>
                <div class="space-y-2">
                  <GuidelineCard
                    v-for="guideline in group.guidelines"
                    :key="guideline.name || 'unknown'"
                    :guideline="guideline"
                    v-model="selectedGuidelines[guideline.name || '']"
                  />
                </div>
              </div>
            </div>

            <!-- No guidelines available -->
            <EmptyState
              v-else-if="selectedRatingSystem"
              message="No guidelines defined for this rating system"
            />

            <!-- No rating system selected -->
            <EmptyState v-else message="Please select a rating system to view guidelines" />
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
import EmptyState from '@/components/atoms/EmptyState.vue'
import RatingLevel from '@/components/molecules/RatingLevel.vue'
import GuidelineCard from '@/components/molecules/GuidelineCard.vue'
import ReferenceSection from '@/components/molecules/ReferenceSection.vue'

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

// Selected rating system
const selectedRatingSystemId = ref('')

// Computed selected rating system object
const selectedRatingSystem = computed(() => {
  if (!selectedRatingSystemId.value) return null
  return ratingSystems.value.find((system) => system.id === selectedRatingSystemId.value) || null
})

// Computed properties for better template readability
const hasRatingLevels = computed(() => {
  return selectedRatingSystem.value?.levels && selectedRatingSystem.value.levels.length > 0
})

const hasGuidelines = computed(() => {
  return selectedRatingSystem.value?.guidelines && selectedRatingSystem.value.guidelines.length > 0
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
