<template>
  <Menu ref="rootEl" as="div" class="relative inline-block text-left">
    <MenuButton as="template">
      <button ref="buttonEl" :class="triggerClass" :aria-label="buttonAriaLabel">
        <slot name="label">
          <Icon name="mdi:dots-vertical" class="h-6 w-6" aria-hidden="true" />
        </slot>
      </button>
    </MenuButton>

    <!-- Popover (desktop) -->
    <TransitionRoot
      appear
      as="template"
      enter="transition ease-out duration-200"
      enter-from="opacity-0 scale-95 translate-y-1"
      enter-to="opacity-100 scale-100 translate-y-0"
      leave="transition ease-in duration-150"
      leave-from="opacity-100 scale-100 translate-y-0"
      leave-to="opacity-0 scale-95 translate-y-1"
    >
      <MenuItems
        as="div"
        class="absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-xl border border-gray-200/60 bg-white/95 shadow-xl ring-1 ring-black/5 backdrop-blur-sm focus:outline-none dark:border-gray-700/60 dark:bg-gray-800/95 dark:ring-white/10"
      >
        <!-- Header (optional) -->
        <div
          v-if="title || subtitle"
          class="border-b border-gray-100 px-6 py-4 dark:border-gray-700/50"
        >
          <h3 v-if="title" class="text-base font-semibold text-gray-900 dark:text-gray-100">
            {{ title }}
          </h3>
          <p v-if="subtitle" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ subtitle }}
          </p>
        </div>

        <div class="py-2" role="none">
          <template v-for="(item, index) in allItems" :key="item.key">
            <!-- Divider -->
            <div
              v-if="item.divider && index > 0"
              class="my-1 border-t border-gray-100 dark:border-gray-700/50"
            />

            <!-- Menu Item -->
            <HMenuItem v-if="!item.divider" as="button">
              <div
                :class="[
                  'group relative flex w-full items-start gap-4 rounded-lg px-4 py-3 text-left transition-all duration-150 focus:outline-none',
                  item.key === activeItemKey
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50',
                  item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                  getVariantClasses(item.variant),
                ]"
                @click="onSelect(item)"
              >
                <!-- Icon with background -->
                <div
                  v-if="item.icon"
                  :class="[
                    'mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg p-1.5 transition-colors duration-150',
                    getIconBackgroundClasses(item.variant),
                  ]"
                >
                  <Icon :name="`mdi:${item.icon}`" :class="getIconClasses()" />
                </div>

                <!-- Content -->
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between">
                    <span :class="getLabelClasses(item.variant)">{{ item.label }}</span>
                    <div class="flex items-center gap-2">
                      <span
                        v-if="item.value"
                        class="shrink-0 text-xs text-gray-500 dark:text-gray-400"
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
                    class="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400"
                  >
                    {{ item.description }}
                  </p>
                </div>
              </div>
            </HMenuItem>
          </template>
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

// Styling functions for variants
const getVariantClasses = (variant?: string) => {
  const variants: Record<string, string> = {
    danger: 'text-red-700 dark:text-red-400',
    success: 'text-green-700 dark:text-green-400',
    warning: 'text-yellow-700 dark:text-yellow-400',
    info: 'text-blue-700 dark:text-blue-400',
    default: 'text-gray-700 dark:text-gray-300',
  }
  return variants[variant || 'default']
}

const getIconBackgroundClasses = (variant?: string) => {
  const variants: Record<string, string> = {
    danger:
      'bg-red-50 text-red-600 group-hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:group-hover:bg-red-900/30',
    success:
      'bg-green-50 text-green-600 group-hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:group-hover:bg-green-900/30',
    warning:
      'bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:group-hover:bg-yellow-900/30',
    info: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:group-hover:bg-blue-900/30',
    default:
      'bg-gray-50 text-gray-600 group-hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-400 dark:group-hover:bg-gray-700/70',
  }
  return variants[variant || 'default']
}

const getIconClasses = () => {
  return 'h-6 w-6'
}

const getLabelClasses = (variant?: string) => {
  const variants: Record<string, string> = {
    danger: 'text-sm font-medium text-red-700 dark:text-red-400',
    success: 'text-sm font-medium text-green-700 dark:text-green-400',
    warning: 'text-sm font-medium text-yellow-700 dark:text-yellow-400',
    info: 'text-sm font-medium text-blue-700 dark:text-blue-400',
    default: 'text-sm font-medium text-gray-900 dark:text-gray-100',
  }
  return variants[variant || 'default']
}

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

  return props.presets.map(preset => presetMap[preset]).filter(Boolean)
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
