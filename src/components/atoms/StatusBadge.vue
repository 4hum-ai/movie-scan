<template>
  <span
    class="inline-flex rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap"
    :class="statusConfig.class"
  >
    {{ statusConfig.text }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getStatusConfig } from '@/composables/report/useReportDetail'
import type { ReportStatus } from '@/composables'

interface Props {
  status: string
}

const props = defineProps<Props>()

const statusConfig = computed(() => getStatusConfig(props.status as ReportStatus))
</script>
