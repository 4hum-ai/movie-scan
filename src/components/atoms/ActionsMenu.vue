<template>
  <Menu ref="rootEl" as="div" class="relative inline-block text-left">
    <MenuButton as="template">
      <button ref="buttonEl" :class="triggerClass" :aria-label="buttonAriaLabel">
        <slot name="label">
          <Icon name="mdi:dots-vertical" class="h-5 w-5" aria-hidden="true" />
        </slot>
      </button>
    </MenuButton>

    <!-- Popover (desktop) -->
    <TransitionRoot
      appear
      as="template"
      enter="transition ease-out duration-100"
      enter-from="opacity-0 scale-95"
      enter-to="opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leave-from="opacity-100 scale-100"
      leave-to="opacity-0 scale-95"
    >
      <MenuItems
        as="div"
        class="ring-opacity-5 absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-md border border-gray-200 bg-white shadow-lg ring-1 ring-black focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:ring-white/10"
      >
        <!-- Header (optional) -->
        <div
          v-if="title || subtitle"
          class="border-b border-gray-200 px-4 py-2 dark:border-gray-700"
        >
          <h3 v-if="title" class="text-sm font-medium text-gray-900 dark:text-gray-100">
            {{ title }}
          </h3>
          <p v-if="subtitle" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ subtitle }}
          </p>
        </div>

        <div class="py-1" role="none">
          <HMenuItem v-for="(item, index) in allItems" :key="item.key" as="button">
            <!-- Divider -->
            <div
              v-if="item.divider && index > 0"
              class="my-1 border-t border-gray-200 dark:border-gray-700"
            />

            <div
              :class="[
                'group flex w-full items-start gap-3 text-left focus:outline-none',
                itemPadding,
                item.key === activeItemKey ? 'bg-blue-50 dark:bg-blue-900/20' : '',
                item.disabled ? 'cursor-not-allowed opacity-50' : '',
                item.variant === 'danger' ? 'text-red-700 dark:text-red-400' : '',
                item.variant === 'success' ? 'text-green-700 dark:text-green-400' : '',
                item.variant === 'warning' ? 'text-yellow-700 dark:text-yellow-400' : '',
                item.variant === 'info' ? 'text-blue-700 dark:text-blue-400' : '',
              ]"
              @click="onSelect(item)"
            >
              <!-- Icon -->
              <div v-if="item.icon" class="flex-shrink-0">
                <Icon :name="`mdi:${item.icon}`" class="h-4 w-4" />
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between">
                  <span class="truncate text-sm text-gray-800 dark:text-gray-100">{{
                    item.label
                  }}</span>
                  <div class="flex items-center gap-2">
                    <span
                      v-if="item.value"
                      class="ml-4 shrink-0 text-xs text-gray-500 dark:text-gray-400"
                      >{{ item.value }}</span
                    >
                    <!-- Active indicator -->
                    <Icon
                      v-if="item.key === activeItemKey"
                      name="mdi:check"
                      class="h-4 w-4 text-blue-600 dark:text-blue-400"
                    />
                  </div>
                </div>
                <p
                  v-if="item.description"
                  class="mt-0.5 line-clamp-2 text-xs leading-snug text-gray-500 dark:text-gray-400"
                >
                  {{ item.description }}
                </p>
              </div>
            </div>
          </HMenuItem>
        </div>
      </MenuItems>
    </TransitionRoot>
  </Menu>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem as HMenuItem, TransitionRoot } from '@headlessui/vue'
import Icon from '@/components/atoms/Icon.vue'

export interface MenuItem {
  key: string
  label: string
  description?: string
  value?: string
  disabled?: boolean
  action?: () => void // Custom action function
  icon?: string // Icon name for preset actions
  variant?: 'default' | 'danger' | 'success' | 'warning' | 'info' // Visual variant
  divider?: boolean // Whether to add a divider after this item
}

const props = defineProps<{
  items: MenuItem[]
  size?: 'sm' | 'md' | 'lg' | 'xl'
  title?: string
  subtitle?: string
  activeItemKey?: string
  /** Whether to show common action presets */
  showPresets?: boolean
  /** Common action types to include */
  presets?: ('create' | 'edit' | 'delete' | 'view' | 'duplicate' | 'export' | 'import')[]
}>()

const emit = defineEmits<{
  (e: 'select', key: string): void
  (e: 'preset-action', action: string): void
}>()

const rootEl = ref<HTMLElement | null>(null)
const isDestroyed = ref(false)
const buttonAriaLabel = computed(() => 'Open actions menu')
const size = computed(() => props.size || 'md')
const triggerClass = computed(() => {
  const base =
    'inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500'
  const sizes: Record<string, string> = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
  }
  return `${base} ${sizes[size.value]}`
})
const itemPadding = computed(() => {
  const map: Record<string, string> = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-4 py-2.5',
    xl: 'px-5 py-3',
  }
  return map[size.value]
})

const onSelect = (item: MenuItem) => {
  if (isDestroyed.value) return

  // Execute custom action if provided
  if (item.action) {
    item.action()
  }
  // Emit the select event for backward compatibility
  emit('select', item.key)
}

// Method to close the menu programmatically
const closeMenu = () => {
  // HeadlessUI Menu automatically closes when clicking outside or pressing escape
  // We can trigger this by dispatching a click event outside the menu
  if (rootEl.value) {
    const clickEvent = new MouseEvent('click', { bubbles: true })
    document.body.dispatchEvent(clickEvent)
  }
}

// Expose the close method
defineExpose({
  closeMenu,
})

const onWindowKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    // Close menu on escape key
    // This will be handled by Headless UI automatically
  }
}

const onDocumentClick = () => {
  // Close menu when clicking outside - Headless UI handles this automatically
  // This function is kept for potential future use but currently not needed
}

// Common action presets
const commonActions = computed(() => {
  if (!props.showPresets || !props.presets) return []

  const presetMap: Record<string, MenuItem> = {
    create: {
      key: 'create',
      label: 'Create',
      description: 'Add new item',
      icon: 'plus',
      variant: 'success',
      action: () => emit('preset-action', 'create'),
    },
    edit: {
      key: 'edit',
      label: 'Edit',
      description: 'Modify this item',
      icon: 'pencil',
      variant: 'info',
      action: () => emit('preset-action', 'edit'),
    },
    delete: {
      key: 'delete',
      label: 'Delete',
      description: 'Remove this item',
      icon: 'trash',
      variant: 'danger',
      action: () => emit('preset-action', 'delete'),
    },
    view: {
      key: 'view',
      label: 'View',
      description: 'View details',
      icon: 'eye',
      variant: 'default',
      action: () => emit('preset-action', 'view'),
    },
    duplicate: {
      key: 'duplicate',
      label: 'Duplicate',
      description: 'Copy this item',
      icon: 'copy',
      variant: 'default',
      action: () => emit('preset-action', 'duplicate'),
    },
    export: {
      key: 'export',
      label: 'Export',
      description: 'Download data',
      icon: 'download',
      variant: 'default',
      action: () => emit('preset-action', 'export'),
    },
    import: {
      key: 'import',
      label: 'Import',
      description: 'Upload data',
      icon: 'upload',
      variant: 'default',
      action: () => emit('preset-action', 'import'),
    },
  }

  return props.presets.map((preset) => presetMap[preset]).filter(Boolean)
})

// Combine preset actions with custom items
const allItems = computed(() => {
  const items = [...commonActions.value, ...props.items]
  return items.filter(Boolean)
})

onMounted(() => {
  window.addEventListener('keydown', onWindowKeydown)
  document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  isDestroyed.value = true
  try {
    window.removeEventListener('keydown', onWindowKeydown)
    document.removeEventListener('click', onDocumentClick)
  } catch (error) {
    console.warn('Error during ActionsMenu cleanup:', error)
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.12s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
