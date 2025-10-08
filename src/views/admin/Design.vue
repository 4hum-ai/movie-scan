<template>
  <div class="bg-background min-h-screen">
    <!-- AppBar with back button - full width above sidebar -->
    <AppBar show-back fixed @back="$router.push('/')">
      <template #title>Design System</template>
      <template #subtitle
        >Interactive component library for reviewing atomic and molecular components</template
      >
      <template #actions>
        <div class="flex items-center space-x-3">
          <SearchInput v-model="searchQuery" placeholder="Search components..." class="w-64" />
          <ActionsMenu
            title="Quick Actions"
            subtitle="Additional navigation options"
            :items="quickActionItems"
            :active-item-key="activeComponentId"
          />
          <ThemeToggle />
        </div>
      </template>
    </AppBar>

    <!-- Main Layout with Sidebar -->
    <div class="flex pt-16">
      <!-- Sidebar -->
      <Sidebar
        title="Components"
        subtitle="Design System"
        :sections="sidebarSections"
        :active-item-id="activeComponentId"
        :fixed="true"
        :default-collapsed="false"
      />

      <!-- Main Content -->
      <main class="ml-72 flex-1 transition-all duration-300">
        <div class="container mx-auto px-4 py-8">
          <!-- Header -->
          <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <h2 class="text-foreground text-lg font-semibold">Component Library</h2>
              <span class="text-muted-foreground text-sm">
                {{ filteredComponentDefinitions.length }} components
              </span>
            </div>
          </div>

          <!-- Component Testing Interface -->
          <div class="space-y-12">
            <div
              v-for="componentConfig in componentConfigs.filter(config =>
                filteredComponentDefinitions.some(def => def.id === config.id)
              )"
              :key="componentConfig.id"
              :id="componentConfig.id"
              class="bg-card scroll-mt-24 rounded-lg border shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <!-- Header -->
              <div class="bg-muted/20 border-b p-6">
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="text-foreground text-xl font-semibold">
                      {{ componentConfig.title }}
                    </h3>
                    <p class="text-muted-foreground mt-1">{{ componentConfig.description }}</p>
                    <p class="text-muted-foreground mt-2 text-sm">
                      Component:
                      <code class="bg-muted rounded px-2 py-1 text-xs">{{
                        componentConfig.componentName
                      }}</code>
                      <span class="bg-primary/10 text-primary ml-2 rounded px-2 py-1 text-xs">
                        {{ componentConfig.section }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="p-6">
                <!-- Live Preview Section -->
                <div class="space-y-6">
                  <!-- Split Layout: Controls on left, Live Preview on right -->
                  <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <!-- Left: Controls -->
                    <div class="space-y-6">
                      <div class="space-y-4">
                        <!-- JSON Editor -->
                        <JsonInput
                          v-model="componentConfig.jsonProps"
                          label="Props (JSON)"
                          placeholder="Enter JSON props..."
                          :rows="6"
                          @blur="updatePropsFromJson(componentConfig)"
                        />

                        <!-- Individual Prop Controls -->
                        <Accordion
                          title="Individual Controls"
                          :count="Object.keys(componentConfig.props).length"
                          :default-open="false"
                        >
                          <div class="space-y-4">
                            <div
                              v-for="(prop, key) in componentConfig.props"
                              :key="key"
                              class="bg-muted/20 space-y-2 rounded-lg border p-3"
                            >
                              <label class="text-foreground block text-sm font-medium">{{
                                key
                              }}</label>

                              <!-- String input -->
                              <input
                                v-if="getPropInputType(key, prop) === 'string'"
                                v-model="componentConfig.props[key]"
                                type="text"
                                class="bg-background w-full rounded-md border px-3 py-2 text-sm"
                                @input="updateJsonFromProps(componentConfig)"
                              />

                              <!-- Number input -->
                              <input
                                v-else-if="getPropInputType(key, prop) === 'number'"
                                v-model.number="componentConfig.props[key]"
                                type="number"
                                class="bg-background w-full rounded-md border px-3 py-2 text-sm"
                                @input="updateJsonFromProps(componentConfig)"
                              />

                              <!-- Boolean input -->
                              <select
                                v-else-if="getPropInputType(key, prop) === 'boolean'"
                                v-model="componentConfig.props[key]"
                                class="bg-background w-full rounded-md border px-3 py-2 text-sm"
                                @change="updateJsonFromProps(componentConfig)"
                              >
                                <option :value="true">true</option>
                                <option :value="false">false</option>
                              </select>

                              <!-- Select inputs for configured options -->
                              <select
                                v-else-if="getPropInputType(key, prop) === 'select'"
                                v-model="componentConfig.props[key]"
                                class="bg-background w-full rounded-md border px-3 py-2 text-sm"
                                @change="updateJsonFromProps(componentConfig)"
                              >
                                <option
                                  v-for="option in getSelectOptions(key)"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </option>
                              </select>

                              <!-- Special input for confirmationText with preset options -->
                              <div
                                v-else-if="getPropInputType(key, prop) === 'special'"
                                class="space-y-2"
                              >
                                <input
                                  v-model="componentConfig.props[key]"
                                  type="text"
                                  class="bg-background w-full rounded-md border px-3 py-2 text-sm"
                                  placeholder="Enter text to require for confirmation (leave empty for no text matching)"
                                  @input="updateJsonFromProps(componentConfig)"
                                />
                                <div class="flex flex-wrap gap-1">
                                  <button
                                    v-for="preset in CONFIRMATION_TEXT_PRESETS"
                                    :key="preset.value"
                                    @click="updateProp(componentConfig, key, preset.value)"
                                    :class="[
                                      'rounded px-2 py-1 text-xs transition-colors',
                                      preset.class,
                                    ]"
                                  >
                                    {{ preset.label }}
                                  </button>
                                  <button
                                    @click="updateProp(componentConfig, key, '')"
                                    class="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                  >
                                    Clear
                                  </button>
                                </div>
                                <p class="text-muted-foreground text-xs">
                                  When set, user must type this exact text to enable the confirm
                                  button
                                </p>
                              </div>

                              <!-- Range for quality -->
                              <div
                                v-else-if="getPropInputType(key, prop) === 'range'"
                                class="space-y-2"
                              >
                                <input
                                  v-model.number="componentConfig.props[key]"
                                  type="range"
                                  min="1"
                                  max="100"
                                  class="w-full"
                                  @input="updateJsonFromProps(componentConfig)"
                                />
                                <span class="text-muted-foreground text-sm"
                                  >{{ componentConfig.props[key] }}%</span
                                >
                              </div>

                              <!-- Array input for pageSizeOptions -->
                              <div
                                v-else-if="getPropInputType(key, prop) === 'array'"
                                class="space-y-2"
                              >
                                <input
                                  :value="(prop as any[]).join(', ')"
                                  type="text"
                                  class="bg-background w-full rounded-md border px-3 py-2 text-sm"
                                  :placeholder="'[' + (prop as any[]).join(', ') + ']'"
                                  @input="
                                    e =>
                                      updateArrayProp(
                                        componentConfig,
                                        key,
                                        (e.target as HTMLInputElement).value
                                      )
                                  "
                                />
                                <p class="text-muted-foreground text-xs">
                                  Enter as comma-separated values
                                </p>
                              </div>

                              <!-- Object input for complex props -->
                              <div
                                v-else-if="getPropInputType(key, prop) === 'object'"
                                class="space-y-2"
                              >
                                <JsonInput
                                  v-model="componentConfig.jsonProps"
                                  :rows="4"
                                  readonly
                                  hint="Edit in JSON tab above"
                                />
                              </div>

                              <!-- Default text input for other types -->
                              <input
                                v-else
                                v-model="componentConfig.props[key]"
                                type="text"
                                class="bg-background w-full rounded-md border px-3 py-2 text-sm"
                                @input="updateJsonFromProps(componentConfig)"
                              />
                            </div>
                          </div>
                        </Accordion>
                      </div>
                    </div>

                    <!-- Right: Live Preview -->
                    <div class="space-y-4">
                      <div class="flex items-center justify-between">
                        <h5 class="text-foreground text-sm font-medium">Live Preview</h5>
                      </div>
                      <div
                        class="bg-muted/20 hover:bg-muted/30 flex min-h-[300px] items-center justify-center rounded-lg border p-6 transition-all duration-200"
                      >
                        <!-- Render all components except special cases in the preview area -->
                        <component
                          v-if="
                            componentConfig.id !== 'confirm-modal' &&
                            componentConfig.id !== 'dynamic-form-sidebar' &&
                            componentConfig.id !== 'file-upload-modal' &&
                            componentConfig.id !== 'filter-sidebar'
                          "
                          :is="componentConfig.component"
                          v-bind="componentConfig.props"
                          class="rounded-lg"
                          @page-change="handlePageChange"
                          @per-page-change="handlePerPageChange"
                          @confirm="handleConfirm"
                          @cancel="handleCancel"
                          @submit="handleFormSubmit"
                          @close="handleFormClose"
                          @update:model-value="handleModelValueUpdate"
                          @search="handleSearch"
                          @open-filters="handleOpenFilters"
                          @close-search="handleCloseSearch"
                          @change="handleTabChange"
                        />

                        <!-- Special handling for DynamicFormSidebar - show placeholder when not open -->
                        <div
                          v-else-if="
                            componentConfig.id === 'dynamic-form-sidebar' && !showFormSidebar
                          "
                          class="text-muted-foreground text-center"
                        >
                          <p class="text-sm">
                            Click "Show Form Sidebar" to test the DynamicFormSidebar
                          </p>
                        </div>

                        <!-- For ConfirmModal, show a placeholder when closed -->
                        <div
                          v-else-if="
                            componentConfig.id === 'confirm-modal' && !componentConfig.props.open
                          "
                          class="text-muted-foreground text-center"
                        >
                          <p class="text-sm">Click "Show Modal" to test the ConfirmModal</p>
                        </div>

                        <!-- For FileUploadModal, show a placeholder when closed -->
                        <div
                          v-else-if="
                            componentConfig.id === 'file-upload-modal' && !showFileUploadModal
                          "
                          class="text-muted-foreground text-center"
                        >
                          <p class="text-sm">
                            Click "Show Upload Modal" to test the FileUploadModal
                          </p>
                        </div>

                        <!-- For FilterSidebar, show a placeholder when closed -->
                        <div
                          v-else-if="componentConfig.id === 'filter-sidebar' && !showFilterSidebar"
                          class="text-muted-foreground text-center"
                        >
                          <p class="text-sm">
                            Click "Show Filter Sidebar" to test the FilterSidebar
                          </p>
                        </div>
                      </div>

                      <!-- Show Modal Button for ConfirmModal -->
                      <div v-if="componentConfig.id === 'confirm-modal'" class="text-center">
                        <button
                          @click="showConfirmModal"
                          class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 shadow-sm transition-colors"
                        >
                          Show Modal
                        </button>
                      </div>

                      <!-- Show Video Player Button -->
                      <div
                        v-if="componentConfig.id === 'video-player'"
                        class="space-y-2 text-center"
                      >
                        <button
                          @click="showVideoPlayer()"
                          class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 shadow-sm transition-colors"
                        >
                          Show Video Player
                        </button>
                      </div>

                      <!-- Show DynamicFormSidebar Button -->
                      <div
                        v-if="componentConfig.id === 'dynamic-form-sidebar'"
                        class="space-y-2 text-center"
                      >
                        <button
                          @click="showDynamicFormSidebar()"
                          class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 shadow-sm transition-colors"
                        >
                          Show Form Sidebar
                        </button>
                      </div>

                      <!-- Show FileUploadModal Button -->
                      <div
                        v-if="componentConfig.id === 'file-upload-modal'"
                        class="space-y-2 text-center"
                      >
                        <button
                          @click="showFileUploadModalHandler()"
                          class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 shadow-sm transition-colors"
                        >
                          Show Upload Modal
                        </button>
                      </div>

                      <!-- Show FilterSidebar Button -->
                      <div
                        v-if="componentConfig.id === 'filter-sidebar'"
                        class="space-y-2 text-center"
                      >
                        <button
                          @click="showFilterSidebarHandler()"
                          class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 shadow-sm transition-colors"
                        >
                          Show Filter Sidebar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- DynamicFormSidebar for testing -->
    <DynamicFormSidebar
      v-if="showFormSidebar"
      title="Test Form"
      :form-config="{
        fields: [
          {
            key: 'name',
            type: 'text',
            label: 'Name',
            placeholder: 'Enter name',
            required: true,
          },
          {
            key: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'Enter email',
            required: true,
          },
        ],
      }"
      :initial-data="{}"
      submit-text="Submit"
      loading-text="Submitting..."
      @close="handleFormClose"
      @submit="handleFormSubmit"
    />

    <!-- ConfirmModal for testing -->
    <ConfirmModal
      v-if="confirmModalConfig"
      :open="Boolean(confirmModalConfig.props.open)"
      :title="String(confirmModalConfig.props.title)"
      :message="String(confirmModalConfig.props.message)"
      :confirm-label="
        confirmModalConfig.props.confirmLabel
          ? String(confirmModalConfig.props.confirmLabel)
          : undefined
      "
      :cancel-label="
        confirmModalConfig.props.cancelLabel
          ? String(confirmModalConfig.props.cancelLabel)
          : undefined
      "
      :confirmation-text="
        confirmModalConfig.props.confirmationText
          ? String(confirmModalConfig.props.confirmationText)
          : undefined
      "
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />

    <!-- FileUploadModal for testing -->
    <FileUploadModal
      v-if="showFileUploadModal"
      :open="showFileUploadModal"
      :title="
        fileUploadModalConfig?.props.title
          ? String(fileUploadModalConfig.props.title)
          : 'Upload Files'
      "
      :accept="
        fileUploadModalConfig?.props.accept ? String(fileUploadModalConfig.props.accept) : '*/*'
      "
      :multiple="
        fileUploadModalConfig?.props.multiple ? Boolean(fileUploadModalConfig.props.multiple) : true
      "
      :max-size="
        fileUploadModalConfig?.props.maxSize
          ? Number(fileUploadModalConfig.props.maxSize)
          : 10485760
      "
      :max-files="
        fileUploadModalConfig?.props.maxFiles ? Number(fileUploadModalConfig.props.maxFiles) : 5
      "
      @close="handleFileUploadClose"
      @upload="handleFileUpload"
    />

    <!-- FilterSidebar for testing -->
    <FilterSidebar
      v-if="showFilterSidebar"
      :title="
        filterSidebarConfig?.props.title ? String(filterSidebarConfig.props.title) : 'Filters'
      "
      :show="showFilterSidebar"
      @close="handleFilterSidebarClose"
      @clear="handleFilterClear"
      @apply="handleFilterApply"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <select
            class="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select
            class="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">All</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
          </select>
        </div>
      </div>
    </FilterSidebar>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, type Component } from 'vue'
// Molecules
import AppBar from '@/components/molecules/AppBar.vue'
import Image from '@/components/molecules/Image.vue'
import ToastMessage from '@/components/molecules/ToastMessage.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import Pagination from '@/components/molecules/Pagination.vue'
import ConfirmModal from '@/components/molecules/ConfirmModal.vue'
import MetricCard from '@/components/molecules/MetricCard.vue'
import DynamicFormSidebar from '@/components/molecules/DynamicFormSidebar.vue'
import AdvancedSearch from '@/components/molecules/AdvancedSearch.vue'
import Breadcrumbs from '@/components/molecules/Breadcrumbs.vue'
import FileUploadModal from '@/components/molecules/FileUploadModal.vue'
import FilterSidebar from '@/components/molecules/FilterSidebar.vue'
import ProgressIndicator from '@/components/molecules/ProgressIndicator.vue'
import SortDropdown from '@/components/molecules/SortDropdown.vue'
import TabNavigation from '@/components/molecules/TabNavigation.vue'
import TimeWindowPicker from '@/components/molecules/TimeWindowPicker.vue'
// Atoms
import JsonInput from '@/components/atoms/JsonInput.vue'
import Accordion from '@/components/atoms/Accordion.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import Sidebar from '@/components/atoms/Sidebar.vue'
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'
import Icon from '@/components/atoms/Icon.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import SearchInput from '@/components/atoms/SearchInput.vue'
import Avatar from '@/components/atoms/Avatar.vue'
import Card from '@/components/atoms/Card.vue'
import Checkbox from '@/components/atoms/Checkbox.vue'
import Chip from '@/components/atoms/Chip.vue'
import CountryFlag from '@/components/atoms/CountryFlag.vue'
import DateRangeInput from '@/components/atoms/DateRangeInput.vue'
import FieldValue from '@/components/atoms/FieldValue.vue'
import FileInput from '@/components/atoms/FileInput.vue'
import FormInput from '@/components/atoms/FormInput.vue'
import IconButton from '@/components/atoms/IconButton.vue'
import LanguageDisplay from '@/components/atoms/LanguageDisplay.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner.vue'
import ResourceSelector from '@/components/atoms/ResourceSelector.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import SkeletonLoader from '@/components/atoms/SkeletonLoader.vue'
import StatusDot from '@/components/atoms/StatusDot.vue'
import TagInput from '@/components/atoms/TagInput.vue'
import Textarea from '@/components/atoms/Textarea.vue'
import TimeAgo from '@/components/atoms/TimeAgo.vue'
// Organisms
import VideoPlayer from '@/components/organisms/VideoPlayer.vue'
import AudioPlayer from '@/components/organisms/AudioPlayer.vue'

// Single source of truth for component definitions
interface ComponentDefinition {
  id: string
  title: string
  description: string
  componentName: string
  component: Component
  section: 'atoms' | 'molecules' | 'organisms' | 'templates'
  defaultProps: Record<string, unknown>
}

// Configuration objects for prop inputs
const PROP_OPTIONS = {
  preset: [
    { value: 'custom', label: 'Custom' },
    { value: 'thumbnail', label: 'Thumbnail' },
    { value: 'card', label: 'Card' },
    { value: 'hero', label: 'Hero' },
  ],
  format: [
    { value: 'auto', label: 'Auto' },
    { value: 'webp', label: 'WebP' },
    { value: 'avif', label: 'AVIF' },
    { value: 'jpeg', label: 'JPEG' },
    { value: 'png', label: 'PNG' },
  ],
  name: [
    { value: 'mdi:heart', label: 'Heart' },
    { value: 'mdi:star', label: 'Star' },
    { value: 'mdi:home', label: 'Home' },
    { value: 'mdi:magnify', label: 'Search' },
    { value: 'mdi:plus', label: 'Plus' },
    { value: 'mdi:close', label: 'Close' },
    { value: 'mdi:play', label: 'Play' },
    { value: 'mdi:pause', label: 'Pause' },
    { value: 'mdi:cog', label: 'Settings' },
    { value: 'mdi:account', label: 'User' },
    { value: 'mdi:email', label: 'Email' },
    { value: 'mdi:phone', label: 'Phone' },
    { value: 'mdi:calendar', label: 'Calendar' },
    { value: 'mdi:clock', label: 'Clock' },
    { value: 'mdi:check', label: 'Check' },
    { value: 'mdi:alert', label: 'Alert' },
    { value: 'mdi:information', label: 'Information' },
    { value: 'mdi:warning', label: 'Warning' },
    { value: 'mdi:error', label: 'Error' },
    { value: 'mdi:check-circle', label: 'Success' },
    { value: 'mdi:download', label: 'Download' },
    { value: 'mdi:upload', label: 'Upload' },
    { value: 'mdi:edit', label: 'Edit' },
    { value: 'mdi:delete', label: 'Delete' },
    { value: 'mdi:save', label: 'Save' },
    { value: 'mdi:refresh', label: 'Refresh' },
    { value: 'mdi:menu', label: 'Menu' },
    { value: 'mdi:dots-vertical', label: 'More' },
    { value: 'mdi:share', label: 'Share' },
    { value: 'mdi:bookmark', label: 'Bookmark' },
  ],
  size: [
    { value: '1rem', label: 'Small (16px)' },
    { value: '1.25rem', label: 'Medium (20px)' },
    { value: '1.5rem', label: 'Large (24px)' },
    { value: '2rem', label: 'Extra Large (32px)' },
    { value: '2.5rem', label: '2XL (40px)' },
    { value: '3rem', label: '3XL (48px)' },
    { value: '4rem', label: '4XL (64px)' },
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xs', label: 'Extra Small' },
    { value: 'xl', label: 'Extra Large' },
  ],
  iconVariant: [
    { value: 'primary', label: 'Primary' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' },
    { value: 'info', label: 'Info' },
  ],
  variant: [
    { value: 'solid', label: 'Solid' },
    { value: 'outline', label: 'Outline' },
    { value: 'soft', label: 'Soft' },
    { value: 'default', label: 'Default' },
    { value: 'elevated', label: 'Elevated' },
    { value: 'ghost', label: 'Ghost' },
    { value: 'bordered', label: 'Bordered' },
    { value: 'flat', label: 'Flat' },
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'danger', label: 'Danger' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'pills', label: 'Pills' },
    { value: 'underline', label: 'Underline' },
  ],
  status: [
    { value: 'active', label: 'Active' },
    { value: 'success', label: 'Success' },
    { value: 'pending', label: 'Pending' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'needs_review', label: 'Needs Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ],
  shape: [
    { value: 'square', label: 'Square' },
    { value: 'circle', label: 'Circle' },
  ],
  type: [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'password', label: 'Password' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'datetime-local', label: 'Date Time' },
    { value: 'time', label: 'Time' },
    { value: 'tel', label: 'Phone' },
    { value: 'url', label: 'URL' },
    { value: 'search', label: 'Search' },
  ],
  validationState: [
    { value: 'default', label: 'Default' },
    { value: 'success', label: 'Success' },
    { value: 'error', label: 'Error' },
    { value: 'warning', label: 'Warning' },
  ],
  color: [
    { value: 'gray', label: 'Gray' },
    { value: 'primary', label: 'Primary' },
    { value: 'white', label: 'White' },
  ],
  padding: [
    { value: 'none', label: 'None' },
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'Extra Large' },
  ],
}

const CONFIRMATION_TEXT_PRESETS = [
  {
    value: 'DELETE',
    label: 'DELETE',
    class:
      'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30',
  },
  {
    value: 'CONFIRM',
    label: 'CONFIRM',
    class:
      'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30',
  },
  {
    value: 'REMOVE',
    label: 'REMOVE',
    class:
      'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30',
  },
]

// Helper methods for prop rendering
const getPropInputType = (key: string, value: unknown) => {
  if (key in PROP_OPTIONS) return 'select'
  if (key === 'confirmationText') return 'special'
  if (key === 'quality') return 'range'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object' && value !== null) return 'object'
  return typeof value
}

const getSelectOptions = (key: string) => {
  return (PROP_OPTIONS as Record<string, Array<{ value: string; label: string }>>)[key] || []
}

const updateProp = (config: ComponentConfig, key: string, value: unknown) => {
  config.props[key] = value
  updateJsonFromProps(config)
}

// Component definitions organized by atomic design sections
const componentDefinitions: ComponentDefinition[] = [
  // ATOMS
  {
    id: 'avatar',
    title: 'Avatar',
    description: 'User avatar component with image fallback and gradient backgrounds',
    componentName: 'Avatar',
    component: Avatar,
    section: 'atoms',
    defaultProps: {
      label: 'John Doe',
      seed: 'john-doe',
      src: '',
      alt: 'User avatar',
      size: 'md',
      shape: 'circle',
      backgroundColor: '',
    },
  },
  {
    id: 'card',
    title: 'Card',
    description: 'Flexible card component with multiple variants and presets',
    componentName: 'Card',
    component: Card,
    section: 'atoms',
    defaultProps: {
      variant: 'default',
      preset: 'default',
      padding: 'md',
      interactive: false,
      selected: false,
      disabled: false,
      customClass: '',
    },
  },
  {
    id: 'checkbox',
    title: 'Checkbox',
    description: 'Form checkbox component with validation states',
    componentName: 'Checkbox',
    component: Checkbox,
    section: 'atoms',
    defaultProps: {
      modelValue: false,
      label: 'Accept terms and conditions',
      required: false,
      disabled: false,
      helpText: '',
      error: '',
      validationState: 'default',
      size: 'md',
    },
  },
  {
    id: 'chip',
    title: 'Chip',
    description: 'Small tag-like component with close functionality',
    componentName: 'Chip',
    component: Chip,
    section: 'atoms',
    defaultProps: {
      label: 'Sample Chip',
      closable: true,
      closeAriaLabel: 'Remove',
    },
  },
  {
    id: 'country-flag',
    title: 'Country Flag',
    description: 'Country flag display component',
    componentName: 'CountryFlag',
    component: CountryFlag,
    section: 'atoms',
    defaultProps: {
      countryCode: 'US',
      size: 'md',
    },
  },
  {
    id: 'date-range-input',
    title: 'Date Range Input',
    description: 'Date range picker input component',
    componentName: 'DateRangeInput',
    component: DateRangeInput,
    section: 'atoms',
    defaultProps: {
      modelValue: { start: '', end: '' },
      label: 'Date Range',
      placeholder: 'Select date range',
      required: false,
      disabled: false,
      size: 'md',
    },
  },
  {
    id: 'field-value',
    title: 'Field Value',
    description: 'Display field value component',
    componentName: 'FieldValue',
    component: FieldValue,
    section: 'atoms',
    defaultProps: {
      label: 'Field Label',
      value: 'Sample Value',
      type: 'text',
      size: 'md',
    },
  },
  {
    id: 'file-input',
    title: 'File Input',
    description: 'File upload input component',
    componentName: 'FileInput',
    component: FileInput,
    section: 'atoms',
    defaultProps: {
      modelValue: null,
      label: 'Upload File',
      accept: '*/*',
      multiple: false,
      required: false,
      disabled: false,
      size: 'md',
    },
  },
  {
    id: 'form-input',
    title: 'Form Input',
    description: 'Enhanced form input with icons and validation',
    componentName: 'FormInput',
    component: FormInput,
    section: 'atoms',
    defaultProps: {
      modelValue: '',
      type: 'text',
      placeholder: 'Enter text...',
      size: 'md',
      label: 'Input Label',
      required: false,
      disabled: false,
      readonly: false,
      helpText: '',
      error: '',
      showPasswordToggle: true,
      validationState: 'default',
    },
  },
  {
    id: 'icon-button',
    title: 'Icon Button',
    description: 'Button component with icon support and multiple variants',
    componentName: 'IconButton',
    component: IconButton,
    section: 'atoms',
    defaultProps: {
      text: 'Button',
      variant: 'default',
      size: 'md',
      type: 'button',
      disabled: false,
      loading: false,
      rounded: false,
      fullWidth: false,
      customClass: '',
    },
  },
  {
    id: 'json-input',
    title: 'JSON Input',
    description: 'Textarea component for editing JSON with validation',
    componentName: 'JsonInput',
    component: JsonInput,
    section: 'atoms',
    defaultProps: {
      label: 'JSON Input',
      placeholder: 'Enter JSON...',
      rows: 4,
      readonly: false,
    },
  },
  {
    id: 'language-display',
    title: 'Language Display',
    description: 'Language display component',
    componentName: 'LanguageDisplay',
    component: LanguageDisplay,
    section: 'atoms',
    defaultProps: {
      languageCode: 'en',
      showFlag: true,
      showName: true,
      size: 'md',
    },
  },
  {
    id: 'loading-spinner',
    title: 'Loading Spinner',
    description: 'Loading spinner component with different sizes and colors',
    componentName: 'LoadingSpinner',
    component: LoadingSpinner,
    section: 'atoms',
    defaultProps: {
      size: 'md',
      color: 'gray',
    },
  },
  {
    id: 'resource-selector',
    title: 'Resource Selector',
    description: 'Resource selection component',
    componentName: 'ResourceSelector',
    component: ResourceSelector,
    section: 'atoms',
    defaultProps: {
      modelValue: null,
      resourceType: 'user',
      label: 'Select Resource',
      placeholder: 'Choose a resource...',
      required: false,
      disabled: false,
      size: 'md',
    },
  },
  {
    id: 'select-input',
    title: 'Select Input',
    description: 'Dropdown select input component',
    componentName: 'SelectInput',
    component: SelectInput,
    section: 'atoms',
    defaultProps: {
      modelValue: undefined,
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],
      placeholder: 'Select an option',
      size: 'md',
      label: 'Select Label',
      required: false,
      disabled: false,
      helpText: '',
      error: '',
      validationState: 'default',
    },
  },
  {
    id: 'skeleton-loader',
    title: 'Skeleton Loader',
    description: 'Loading skeleton component',
    componentName: 'SkeletonLoader',
    component: SkeletonLoader,
    section: 'atoms',
    defaultProps: {
      type: 'text',
      width: '100%',
      height: '1rem',
      lines: 3,
      animated: true,
    },
  },
  {
    id: 'status-badge',
    title: 'Status Badge',
    description: 'Status badge component with custom display slots and actions',
    componentName: 'StatusBadge',
    component: StatusBadge,
    section: 'atoms',
    defaultProps: {
      status: 'active',
      label: 'Active',
      size: 'md',
      variant: 'soft',
      showDot: false,
    },
  },
  {
    id: 'status-dot',
    title: 'Status Dot',
    description: 'Status indicator dot component',
    componentName: 'StatusDot',
    component: StatusDot,
    section: 'atoms',
    defaultProps: {
      status: 'active',
      size: 'md',
      animated: false,
    },
  },
  {
    id: 'tag-input',
    title: 'Tag Input',
    description: 'Tag input component for managing multiple tags',
    componentName: 'TagInput',
    component: TagInput,
    section: 'atoms',
    defaultProps: {
      modelValue: ['tag1', 'tag2'],
      placeholder: 'Add tags...',
      label: 'Tags',
      required: false,
      disabled: false,
      size: 'md',
    },
  },
  {
    id: 'textarea',
    title: 'Textarea',
    description: 'Multi-line text input component',
    componentName: 'Textarea',
    component: Textarea,
    section: 'atoms',
    defaultProps: {
      modelValue: '',
      placeholder: 'Enter text...',
      rows: 3,
      size: 'md',
      label: 'Textarea Label',
      required: false,
      disabled: false,
      readonly: false,
      helpText: '',
      error: '',
      validationState: 'default',
      autoResize: false,
    },
  },
  {
    id: 'time-ago',
    title: 'Time Ago',
    description: 'Relative time display component',
    componentName: 'TimeAgo',
    component: TimeAgo,
    section: 'atoms',
    defaultProps: {
      date: new Date().toISOString(),
      format: 'relative',
      updateInterval: 60000,
    },
  },
  {
    id: 'icon',
    title: 'Icon',
    description: 'Dynamic icon component using Material Design Icons (MDI) loaded from server',
    componentName: 'Icon',
    component: Icon,
    section: 'atoms',
    defaultProps: {
      name: 'mdi:heart',
      size: '2rem',
    },
  },
  {
    id: 'accordion',
    title: 'Accordion',
    description: 'Collapsible content section with header',
    componentName: 'Accordion',
    component: Accordion,
    section: 'atoms',
    defaultProps: {
      title: 'Accordion Section',
      count: 3,
      defaultOpen: false,
    },
  },
  {
    id: 'search-input',
    title: 'Search Input',
    description: 'Search input component with debouncing',
    componentName: 'SearchInput',
    component: SearchInput,
    section: 'atoms',
    defaultProps: {
      modelValue: '',
      placeholder: 'Search...',
      debounceMs: 300,
      size: 'md',
    },
  },
  {
    id: 'theme-toggle',
    title: 'Theme Toggle',
    description: 'Theme toggle component for switching between light and dark modes',
    componentName: 'ThemeToggle',
    component: ThemeToggle,
    section: 'atoms',
    defaultProps: {
      size: 'md',
    },
  },
  {
    id: 'actions-menu',
    title: 'Actions Menu',
    description: 'Actions menu component with dropdown functionality',
    componentName: 'ActionsMenu',
    component: ActionsMenu,
    section: 'atoms',
    defaultProps: {
      title: 'Actions',
      subtitle: 'Available actions',
      items: [
        { key: 'edit', label: 'Edit', description: 'Edit this item', value: 'edit' },
        { key: 'delete', label: 'Delete', description: 'Delete this item', value: 'delete' },
      ],
      activeItemKey: '',
    },
  },
  {
    id: 'sidebar',
    title: 'Sidebar',
    description: 'Sidebar navigation component',
    componentName: 'Sidebar',
    component: Sidebar,
    section: 'atoms',
    defaultProps: {
      title: 'Navigation',
      subtitle: 'Main menu',
      sections: [
        {
          id: 'section1',
          title: 'Section 1',
          items: [
            { id: 'item1', title: 'Item 1', description: 'First item', action: () => {} },
            { id: 'item2', title: 'Item 2', description: 'Second item', action: () => {} },
          ],
        },
      ],
      activeItemId: '',
      fixed: false,
      defaultCollapsed: false,
    },
  },

  // MOLECULES
  {
    id: 'advanced-search',
    title: 'Advanced Search',
    description: 'Advanced search component with field selection and filters',
    componentName: 'AdvancedSearch',
    component: AdvancedSearch,
    section: 'molecules',
    defaultProps: {
      modelValue: '',
      placeholder: 'Search...',
      searchableFields: [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'description', label: 'Description' },
      ],
      showFieldSelection: true,
      showFiltersButton: true,
      showCloseButton: false,
      debounceMs: 300,
    },
  },
  {
    id: 'app-bar',
    title: 'App Bar',
    description: 'Application bar component with navigation and actions',
    componentName: 'AppBar',
    component: AppBar,
    section: 'molecules',
    defaultProps: {
      loading: false,
      showBack: false,
      fixed: true,
    },
  },
  {
    id: 'breadcrumbs',
    title: 'Breadcrumbs',
    description: 'Navigation breadcrumbs component',
    componentName: 'Breadcrumbs',
    component: Breadcrumbs,
    section: 'molecules',
    defaultProps: {
      items: [
        { label: 'Home', to: '/' },
        { label: 'Products', to: '/products' },
        { label: 'Current Page' },
      ],
    },
  },
  {
    id: 'confirm-modal',
    title: 'Confirm Modal',
    description:
      'Modal dialog for confirming destructive actions with optional text matching requirement',
    componentName: 'ConfirmModal',
    component: ConfirmModal,
    section: 'molecules',
    defaultProps: {
      open: false,
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      confirmationText: '',
    },
  },
  {
    id: 'dynamic-form-sidebar',
    title: 'Dynamic Form Sidebar',
    description: 'Enhanced form sidebar with advanced slot support for custom layouts and actions',
    componentName: 'DynamicFormSidebar',
    component: DynamicFormSidebar,
    section: 'molecules',
    defaultProps: {
      title: 'Create New Item',
      formConfig: {
        fields: [
          {
            key: 'name',
            type: 'text',
            label: 'Name',
            placeholder: 'Enter name',
            required: true,
          },
          {
            key: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'Enter email',
            required: true,
          },
        ],
      },
      initialData: {},
      loading: false,
      submitText: 'Submit',
      loadingText: 'Submitting...',
    },
  },
  {
    id: 'empty-state',
    title: 'Empty State',
    description: 'Component for displaying empty states with customizable icon, title, and actions',
    componentName: 'EmptyState',
    component: EmptyState,
    section: 'molecules',
    defaultProps: {
      title: 'No items found',
      subtitle: 'Try adjusting your search or filter criteria',
      icon: true,
    },
  },
  {
    id: 'file-upload-modal',
    title: 'File Upload Modal',
    description: 'Modal component for file uploads with drag and drop support',
    componentName: 'FileUploadModal',
    component: FileUploadModal,
    section: 'molecules',
    defaultProps: {
      open: false,
      title: 'Upload Files',
      accept: '*/*',
      multiple: true,
      maxSize: 10485760, // 10MB
      maxFiles: 5,
    },
  },
  {
    id: 'filter-sidebar',
    title: 'Filter Sidebar',
    description: 'Filter sidebar component for advanced filtering',
    componentName: 'FilterSidebar',
    component: FilterSidebar,
    section: 'molecules',
    defaultProps: {
      title: 'Filters',
      show: false,
    },
  },
  {
    id: 'image',
    title: 'Image Component',
    description: 'Cloudflare-optimized image component with responsive support',
    componentName: 'Image',
    component: Image,
    section: 'molecules',
    defaultProps: {
      src: 'https://storage.googleapis.com/movie-dubie-studio-dev/media_1756790449590_z25zpstcg/hidden-truth.jpg',
      alt: 'Sample Image',
      width: 400,
      height: 300,
      preset: 'card',
      format: 'auto',
      quality: 85,
    },
  },
  {
    id: 'metric-card',
    title: 'Metric Card',
    description: 'Enhanced metric card component with comprehensive slot system for custom layouts',
    componentName: 'MetricCard',
    component: MetricCard,
    section: 'molecules',
    defaultProps: {
      title: 'Total Revenue',
      value: 125000,
      subtitle: 'Last 30 days',
      icon: 'mdi:currency-usd',
      iconVariant: 'primary',
      size: 'md',
      trend: {
        value: 12.5,
        direction: 'up',
        period: 'vs last month',
      },
    },
  },
  {
    id: 'pagination',
    title: 'Pagination',
    description: 'Navigation component for paginated content with page size controls',
    componentName: 'Pagination',
    component: Pagination,
    section: 'molecules',
    defaultProps: {
      currentPage: 1,
      totalPages: 10,
      total: 100,
      perPage: 10,
      pageSizeOptions: [5, 10, 20, 50, 100],
    },
  },
  {
    id: 'progress-indicator',
    title: 'Progress Indicator',
    description: 'Progress indicator component for showing completion status',
    componentName: 'ProgressIndicator',
    component: ProgressIndicator,
    section: 'molecules',
    defaultProps: {
      value: 65,
      max: 100,
      size: 'md',
      variant: 'default',
      showLabel: true,
      label: 'Progress',
    },
  },
  {
    id: 'sort-dropdown',
    title: 'Sort Dropdown',
    description: 'Sort dropdown component for data sorting options',
    componentName: 'SortDropdown',
    component: SortDropdown,
    section: 'molecules',
    defaultProps: {
      modelValue: 'name-asc',
      options: [
        { value: 'name-asc', label: 'Name (A-Z)' },
        { value: 'name-desc', label: 'Name (Z-A)' },
        { value: 'date-asc', label: 'Date (Oldest)' },
        { value: 'date-desc', label: 'Date (Newest)' },
      ],
      label: 'Sort by',
      size: 'md',
    },
  },
  {
    id: 'tab-navigation',
    title: 'Tab Navigation',
    description: 'Tab navigation component with multiple variants',
    componentName: 'TabNavigation',
    component: TabNavigation,
    section: 'molecules',
    defaultProps: {
      tabs: [
        { id: 'tab1', label: 'Overview', badge: undefined },
        { id: 'tab2', label: 'Details', badge: 5 },
        { id: 'tab3', label: 'Settings', badge: undefined, disabled: false },
      ],
      modelValue: 'tab1',
      variant: 'default',
      size: 'md',
    },
  },
  {
    id: 'time-window-picker',
    title: 'Time Window Picker',
    description: 'Time window picker component for selecting time ranges',
    componentName: 'TimeWindowPicker',
    component: TimeWindowPicker,
    section: 'molecules',
    defaultProps: {
      modelValue: { start: '', end: '' },
      label: 'Time Window',
      placeholder: 'Select time window',
      presets: [
        { label: 'Last 24 hours', value: '24h' },
        { label: 'Last 7 days', value: '7d' },
        { label: 'Last 30 days', value: '30d' },
      ],
      size: 'md',
    },
  },
  {
    id: 'toast-message',
    title: 'Toast Message',
    description: 'Notification component for displaying success, error, warning, and info messages',
    componentName: 'ToastMessage',
    component: ToastMessage,
    section: 'molecules',
    defaultProps: {
      message: {
        id: '1',
        type: 'success',
        title: 'Success!',
        body: 'Your action was completed successfully.',
        timeout: 5000,
      },
    },
  },

  // ORGANISMS
  {
    id: 'video-player',
    title: 'Video Player',
    description:
      'Advanced video player with HLS support, subtitles, custom controls, and PiP support',
    componentName: 'VideoPlayer',
    component: VideoPlayer,
    section: 'organisms',
    defaultProps: {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      title: 'Sample Video',
      subtitleUrl: '',
    },
  },
  {
    id: 'audio-player',
    title: 'Audio Player',
    description: 'Professional audio player with progress controls, volume, and keyboard shortcuts',
    componentName: 'AudioPlayer',
    component: AudioPlayer,
    section: 'organisms',
    defaultProps: {
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      title: 'Sample Audio',
      mode: 'inline',
      autoplay: false,
      loop: false,
      preload: 'metadata',
    },
  },
]

// Extended component config interface
interface ComponentConfig {
  id: string
  title: string
  description: string
  componentName: string
  component: Component
  section: 'atoms' | 'molecules' | 'organisms' | 'templates'
  defaultProps: Record<string, unknown>
  props: Record<string, unknown>
  jsonProps: string
}

// Generate component configs from definitions
const componentConfigs = reactive<ComponentConfig[]>(
  componentDefinitions.map(def => ({
    ...def,
    props: { ...def.defaultProps },
    jsonProps: JSON.stringify(def.defaultProps, null, 2),
  }))
)

// Navigation functionality
const activeComponentId = ref('avatar')

// Search functionality
const searchQuery = ref('')

// DynamicFormSidebar state
const showFormSidebar = ref(false)

// Modal states
const showFileUploadModal = ref(false)
const showFilterSidebar = ref(false)

// ConfirmModal config for testing
const confirmModalConfig = computed(() => {
  return componentConfigs.find(c => c.id === 'confirm-modal')
})

// FileUploadModal config for testing
const fileUploadModalConfig = computed(() => {
  return componentConfigs.find(c => c.id === 'file-upload-modal')
})

// FilterSidebar config for testing
const filterSidebarConfig = computed(() => {
  return componentConfigs.find(c => c.id === 'filter-sidebar')
})

// Filter components based on search query
const filteredComponentDefinitions = computed(() => {
  if (!searchQuery.value.trim()) {
    return componentDefinitions
  }

  const query = searchQuery.value.toLowerCase()
  return componentDefinitions.filter(
    def =>
      def.title.toLowerCase().includes(query) ||
      def.description.toLowerCase().includes(query) ||
      def.componentName.toLowerCase().includes(query) ||
      def.section.toLowerCase().includes(query)
  )
})

// Generate sidebar sections from filtered component definitions
const sidebarSections = computed(() => {
  const sections = new Map<
    string,
    {
      id: string
      title: string
      items: { id: string; title: string; description: string; action: () => void }[]
    }
  >()

  // Initialize sections
  sections.set('atoms', { id: 'atoms', title: 'Atoms', items: [] })
  sections.set('molecules', { id: 'molecules', title: 'Molecules', items: [] })
  sections.set('organisms', { id: 'organisms', title: 'Organisms', items: [] })
  sections.set('templates', { id: 'templates', title: 'Templates', items: [] })

  // Populate sections with filtered components
  filteredComponentDefinitions.value.forEach(def => {
    const section = sections.get(def.section)
    if (section) {
      section.items.push({
        id: def.id,
        title: def.title,
        description: def.description,
        action: () => navigateToComponent(def.id),
      })
    }
  })

  // Return only sections that have components
  return Array.from(sections.values()).filter(section => section.items.length > 0)
})

// Create quick action menu items
const quickActionItems = computed(() => [
  {
    key: 'search',
    label: 'Search Components',
    description: 'Quick search through all components',
    value: 'Ctrl+K',
  },
  {
    key: 'favorites',
    label: 'Favorites',
    description: 'View your favorite components',
    value: '★',
  },
  {
    key: 'recent',
    label: 'Recently Viewed',
    description: "Components you've recently accessed",
    value: '🕒',
  },
])

// Navigate to a specific component section
const navigateToComponent = (componentId: string) => {
  activeComponentId.value = componentId
  const element = document.getElementById(componentId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}

// Update props from JSON input
const updatePropsFromJson = (config: ComponentConfig) => {
  try {
    const parsed = JSON.parse(config.jsonProps)
    Object.assign(config.props, parsed)
  } catch {
    // Invalid JSON, ignore
  }
}

// Update JSON from props changes
const updateJsonFromProps = (config: ComponentConfig) => {
  config.jsonProps = JSON.stringify(config.props, null, 2)
}

// Update array props from comma-separated string
const updateArrayProp = (config: ComponentConfig, key: string, value: string) => {
  try {
    const arrayValue = value.split(',').map(item => {
      const trimmed = item.trim()
      // Try to convert to number if possible
      const num = Number(trimmed)
      return isNaN(num) ? trimmed : num
    })
    config.props[key] = arrayValue
    updateJsonFromProps(config)
  } catch {
    // Invalid input, ignore
  }
}

// Handle pagination events
const handlePageChange = (page: number) => {
  const paginationConfig = componentConfigs.find(c => c.id === 'pagination')
  if (paginationConfig) {
    paginationConfig.props.currentPage = page
    updateJsonFromProps(paginationConfig)
  }
}

const handlePerPageChange = (perPage: number) => {
  const paginationConfig = componentConfigs.find(c => c.id === 'pagination')
  if (paginationConfig) {
    paginationConfig.props.perPage = perPage
    paginationConfig.props.currentPage = 1
    updateJsonFromProps(paginationConfig)
  }
}

// Handle confirm modal events
const handleConfirm = () => {
  console.log('Confirm action triggered')
  // Close the modal by setting open to false
  const confirmModalConfig = componentConfigs.find(c => c.id === 'confirm-modal')
  if (confirmModalConfig) {
    confirmModalConfig.props.open = false
    updateJsonFromProps(confirmModalConfig)
  }
}

const handleCancel = () => {
  console.log('Cancel action triggered')
  // Close the modal by setting open to false
  const confirmModalConfig = componentConfigs.find(c => c.id === 'confirm-modal')
  if (confirmModalConfig) {
    confirmModalConfig.props.open = false
    updateJsonFromProps(confirmModalConfig)
  }
}

// Show confirm modal for testing
const showConfirmModal = () => {
  const confirmModalConfig = componentConfigs.find(c => c.id === 'confirm-modal')
  if (confirmModalConfig) {
    console.log('Opening confirm modal, current open state:', confirmModalConfig.props.open)
    confirmModalConfig.props.open = true
    updateJsonFromProps(confirmModalConfig)
    console.log('Modal should now be open:', confirmModalConfig.props.open)
  } else {
    console.error('ConfirmModal config not found')
  }
}

// Show video player for testing
const showVideoPlayer = () => {
  const videoPlayerConfig = componentConfigs.find(c => c.id === 'video-player')
  if (videoPlayerConfig) {
    // VideoPlayer is always visible when rendered, no need to toggle
    console.log('Video player is now visible')
  }
}

// Show DynamicFormSidebar for testing
const showDynamicFormSidebar = () => {
  showFormSidebar.value = true
}

// Handle form sidebar events
const handleFormSubmit = (data: Record<string, unknown>) => {
  console.log('Form submitted:', data)
  showFormSidebar.value = false
}

const handleFormClose = () => {
  showFormSidebar.value = false
}

// Handle model value updates for form components
const handleModelValueUpdate = (value: unknown) => {
  console.log('Model value updated:', value)
}

// Handle search events
const handleSearch = (query: string, field: string) => {
  console.log('Search:', query, 'in field:', field)
}

// Handle open filters
const handleOpenFilters = () => {
  console.log('Open filters clicked')
}

// Handle close search
const handleCloseSearch = () => {
  console.log('Close search clicked')
}

// Handle tab change
const handleTabChange = (tabId: string) => {
  console.log('Tab changed to:', tabId)
}

// Show FileUploadModal for testing
const showFileUploadModalHandler = () => {
  showFileUploadModal.value = true
}

// Handle file upload events
const handleFileUploadClose = () => {
  showFileUploadModal.value = false
}

const handleFileUpload = (files: File[]) => {
  console.log('Files uploaded:', files)
  handleFileUploadClose()
}

// Show FilterSidebar for testing
const showFilterSidebarHandler = () => {
  showFilterSidebar.value = true
}

// Handle filter sidebar events
const handleFilterSidebarClose = () => {
  showFilterSidebar.value = false
}

const handleFilterClear = () => {
  console.log('Filters cleared')
  handleFilterSidebarClose()
}

const handleFilterApply = () => {
  console.log('Filters applied')
  handleFilterSidebarClose()
}
</script>
