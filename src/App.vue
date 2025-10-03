<template>
  <NetworkStatusBar />
  <GlobalProgressBar />
  <ToastContainer />
  <GlobalUploadBar />

  <!-- Main Navigation -->
  <MainNavigation />

  <router-view v-slot="{ Component, route }">
    <KeepAlive :include="cachedViews">
      <component :is="Component" :key="route.path" />
    </KeepAlive>
    <div
      v-if="isBootLoading"
      class="fixed inset-0 z-50 grid place-items-center bg-white/80 dark:bg-gray-900/80"
    >
      <div class="flex flex-col items-center gap-3">
        <LoadingSpinner size="md" color="gray" />
        <div class="text-sm text-gray-600 dark:text-gray-300">Loading UI Configuration…</div>
      </div>
    </div>
  </router-view>
</template>

<script setup lang="ts">
import ToastContainer from '@/components/organisms/ToastContainer.vue'
import NetworkStatusBar from '@/components/organisms/NetworkStatusBar.vue'
import GlobalProgressBar from '@/components/organisms/GlobalProgressBar.vue'
import GlobalUploadBar from '@/components/organisms/GlobalUploadBar.vue'
import MainNavigation from '@/components/molecules/MainNavigation.vue'

import LoadingSpinner from '@/components/atoms/LoadingSpinner.vue'
import { computed } from 'vue'
import { useUiConfig } from '@/composables/useUiConfig'
const cachedViews = [
  'DashboardView',
  'VideoProcessingView',
  'ReportGenerationView',
  'ReportDetailView',
  'SettingsView',
]

const { state: uiState } = useUiConfig()
const isBootLoading = computed(() => !uiState.initialized || uiState.loading)
</script>
