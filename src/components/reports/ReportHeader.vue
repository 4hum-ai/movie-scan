<template>
  <div class="mb-8 rounded-lg border bg-white p-6 shadow-sm">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center space-x-3">
          <h1 class="text-2xl font-bold text-gray-900">{{ id }}</h1>
          <span
            class="inline-flex rounded-full px-3 py-1 text-sm font-medium"
            :class="getStatusClass(status)"
          >
            {{ getStatusText(status) }}
          </span>
        </div>
        <p class="mt-2 text-sm text-gray-600">
          Created {{ formatDate(createdAt) }} at {{ formatTime(createdAt) }}
        </p>
      </div>
      <div class="flex items-center">
        <ActionsMenu
          ref="actionsMenuRef"
          :items="menuItems"
          size="md"
          title="Report Actions"
          :subtitle="`Actions for ${id}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'
import type { MenuItem } from '@/components/atoms/ActionsMenu.vue'
import { useReportDetail } from '@/composables/useReportDetail'

interface Props {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string | { _seconds: number } | Date
  menuItems: MenuItem[]
}

// props are used only in template; avoid unused var error by not assigning
defineProps<Props>()
const actionsMenuRef = ref<InstanceType<typeof ActionsMenu> | null>(null)

const { getStatusClass, getStatusText, formatDate, formatTime } = useReportDetail()

defineExpose({ closeMenu: () => actionsMenuRef.value?.closeMenu() })
</script>
