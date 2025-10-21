<template>
  <ItemDetailTemplate
    :resource-name="resource"
    :item="item"
    :loading="loading"
    :error="error"
    :ui-config="uiConfig"
    :on-back="goBack"
    @update="onUpdate"
    @edit="onEdit"
    @delete="onDelete"
    @reference-click="onReferenceClick"
    @related-item-click="onRelatedItemClick"
  />
  <ConfirmModal
    :open="confirmOpen"
    title="Delete item"
    message="Delete this item? This cannot be undone."
    confirm-label="Delete"
    @confirm="confirmDelete"
    @cancel="confirmOpen = false"
  />
</template>

<script setup lang="ts">
defineOptions({ name: 'ItemDetailView' })
import { ref, computed, watch, onBeforeUnmount, onActivated, onDeactivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ItemDetailTemplate from '@/components/templates/ItemDetailTemplate.vue'
import { useResourceService, useUiConfig, useActivity } from '@/composables'
import ConfirmModal from '@/components/molecules/ConfirmModal.vue'
import { useStaleStore } from '@/stores/stale'
import { UiConfig } from '@/types/ui-config'

interface ItemData extends Record<string, unknown> {
  id?: string | number
  _id?: string | number
}

const api = useResourceService()
const activity = useActivity()
const route = useRoute()
const router = useRouter()
const stale = useStaleStore()

const resource = computed(() =>
  String(route.meta?.module || route.params.module || route.path.split('/')[1] || 'organizations'),
)
const id = computed(() => {
  const raw = route.params.id as string | undefined
  return raw ? String(raw) : ''
})

const item = ref<Record<string, unknown> | null>(null)
const { get: getUiConfig } = useUiConfig()
const uiConfig = ref<UiConfig | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
let currentAbort: AbortController | null = null
const confirmOpen = ref(false)
const isActive = ref(false)
const lastLoadedId = ref<string | null>(null)

async function load() {
  if (!id.value) return
  loading.value = true
  error.value = null
  try {
    // Ensure UI config present using composable priority
    if (!uiConfig.value) {
      currentAbort?.abort()
      currentAbort = new AbortController()
      uiConfig.value = await getUiConfig(resource.value, {
        signal: currentAbort.signal,
      })
    }
    currentAbort?.abort()
    currentAbort = new AbortController()
    const res = await api.getById(resource.value, id.value, currentAbort.signal)
    item.value = res as ItemData
    lastLoadedId.value = id.value
    try {
      activity.recordVisit({
        resource: resource.value,
        id: id.value,
        data: res,
      })
    } catch {
      /* ignore */
    }
  } catch (e: unknown) {
    error.value = (e as Error)?.message || 'Failed to load item'
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
}

function onEdit() {
  /* no-op: handled by parent template */
}

async function onDelete() {
  if (!id.value) return
  confirmOpen.value = true
}

async function confirmDelete() {
  if (!id.value) return
  loading.value = true
  error.value = null
  try {
    currentAbort?.abort()
    currentAbort = new AbortController()
    await api.remove(resource.value, id.value, currentAbort.signal)
    // mark the list route as stale so keep-alive list refreshes on activation
    stale.mark(`path:/${resource.value}`)
    router.push({ path: `/${resource.value}` })
  } catch (e: unknown) {
    error.value = (e as Error)?.message || 'Delete failed'
  } finally {
    loading.value = false
    confirmOpen.value = false
  }
}

async function onUpdate(data: Record<string, unknown>) {
  if (!id.value) return
  loading.value = true
  error.value = null
  try {
    currentAbort?.abort()
    currentAbort = new AbortController()
    await api.update(resource.value, id.value, data, currentAbort.signal)
    // mark the list route as stale so it refreshes on activation
    stale.mark(`path:/${resource.value}`)
    await load()
  } catch (e: unknown) {
    error.value = (e as Error)?.message || 'Update failed'
  } finally {
    loading.value = false
  }
}

function onReferenceClick(referenceType: string, referenceId: string) {
  router.push(`/${referenceType}/${referenceId}`)
}

function onRelatedItemClick(resourceType: string, itemId: string) {
  router.push(`/${resourceType}/${itemId}`)
}

onActivated(() => {
  isActive.value = true
  if (!id.value) return
  if (lastLoadedId.value !== id.value || !item.value) {
    load()
  }
})

onDeactivated(() => {
  isActive.value = false
})

watch([resource, id], () => {
  if (!isActive.value) return
  if (!id.value) return
  load()
})

onBeforeUnmount(() => {
  currentAbort?.abort()
})
</script>
