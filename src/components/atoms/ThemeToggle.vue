<template>
  <button
    @click="handleToggle"
    class="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
    :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
  >
    <!-- Sun icon for light mode -->
    <IconWeatherSunny v-if="isDark" class="h-5 w-5" aria-hidden="true" />

    <!-- Moon icon for dark mode -->
    <IconWeatherNight v-else class="h-5 w-5" aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import IconWeatherSunny from '~icons/mdi/weather-sunny'
import IconWeatherNight from '~icons/mdi/weather-night'

const { isDark, toggleTheme, mode } = useTheme()

// Debug function for the toggle
const handleToggle = () => {
  console.log('🔘 ThemeToggle clicked! Current state:', {
    isDark: isDark.value,
    mode: mode.value,
    htmlClasses: document.documentElement.className,
  })

  toggleTheme()

  // Check state after toggle
  setTimeout(() => {
    console.log('🔘 After toggle:', {
      isDark: isDark.value,
      mode: mode.value,
      htmlClasses: document.documentElement.className,
    })
  }, 50)
}
</script>
