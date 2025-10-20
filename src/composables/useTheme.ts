import { computed, onMounted, watch, getCurrentInstance } from 'vue'
import { usePreference } from './usePreference'

/**
 * Available theme modes
 */
export type ThemeMode = 'light' | 'dark'

/** Local storage key for theme preference */
const THEME_KEY = 'admin-theme'

export function useTheme() {
  const themePref = usePreference(THEME_KEY, 'light')
  const themeRef = themePref.value

  /**
   * Computed theme mode (light or dark)
   */
  const mode = computed<ThemeMode>(() => (themeRef.value === 'dark' ? 'dark' : 'light'))

  /**
   * Computed boolean indicating if dark mode is active
   */
  const isDark = computed(() => mode.value === 'dark')

  function applyTheme(next?: ThemeMode) {
    const current = next ?? mode.value
    const isDarkMode = current === 'dark'

    // For Tailwind v4, we only need to toggle the 'dark' class
    // Light mode is the default (no class needed)
    document.documentElement.classList.toggle('dark', isDarkMode)
    document.body.classList.toggle('dark', isDarkMode)

    // Force a style recalculation
    document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light'

    // Debug logging
    console.log('🎨 Theme applied (v4):', {
      current,
      isDarkMode,
      htmlClasses: document.documentElement.className,
      bodyClasses: document.body.className,
      colorScheme: document.documentElement.style.colorScheme,
    })
  }

  function setTheme(next: ThemeMode) {
    themePref.set(next)
    applyTheme(next)
  }

  function toggleTheme() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  function initialize() {
    // Apply immediately using the stored preference
    applyTheme(mode.value)
  }

  // Keep DOM in sync when pref changes elsewhere
  watch(mode, (m) => applyTheme(m))

  // Convenience for components using onMounted (only if within a component setup)
  if (getCurrentInstance()) {
    onMounted(() => applyTheme())
  }

  return {
    mode,
    isDark,
    setTheme,
    toggleTheme,
    initialize,
    applyTheme,
  }
}
