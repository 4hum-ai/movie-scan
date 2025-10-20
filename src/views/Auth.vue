<template>
  <div class="relative flex min-h-screen items-center justify-center px-4 py-8 sm:py-12">
    <!-- Enhanced background with multiple gradients -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Light mode background -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-black dark:via-gray-900 dark:to-black"
      />

      <!-- Primary gradient orb -->
      <div
        class="from-primary-500/30 via-primary-400/20 dark:from-primary-500/20 dark:via-primary-400/10 absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-gradient-to-br to-transparent blur-3xl"
      />
      <!-- Secondary gradient orb -->
      <div
        class="absolute right-1/4 bottom-1/4 h-64 w-64 animate-pulse rounded-full bg-gradient-to-tl from-blue-500/25 via-purple-400/15 to-transparent blur-2xl dark:from-blue-500/15 dark:via-purple-400/10"
        style="animation-delay: 1s"
      />
      <!-- Subtle grid pattern -->
      <div
        class="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)]"
      />
    </div>

    <!-- Main auth card -->
    <div class="animate-slide-up relative w-full max-w-md">
      <!-- Card container with enhanced styling -->
      <div
        class="hover:shadow-3xl relative rounded-3xl border border-gray-300/60 bg-white/95 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 sm:p-8 dark:border-gray-700/50 dark:bg-gray-900/80"
      >
        <!-- Theme toggle with better positioning -->
        <div class="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <!-- Brand section -->
        <div class="mb-8 text-center sm:mb-10">
          <!-- Enhanced typography -->
          <h1
            id="auth-title"
            class="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100"
          >
            Welcome back
          </h1>
          <p
            class="px-2 text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400"
            aria-describedby="auth-title"
          >
            Sign in to access your workspace and manage your content
          </p>
        </div>

        <!-- Auth form section -->
        <div class="space-y-4">
          <!-- Enhanced Google sign-in button -->
          <Button
            variant="primary"
            size="xl"
            icon="mdi:google"
            :loading="isLoading"
            full-width
            custom-class="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] focus:ring-4 focus:ring-primary-500/20"
            :aria-label="isLoading ? 'Signing in with Google, please wait' : 'Sign in with Google'"
            :aria-describedby="error ? 'auth-error' : undefined"
            @click="handleProvider('google')"
          >
            <span class="relative z-10">
              {{ isLoading ? 'Signing in...' : 'Continue with Google' }}
            </span>
            <!-- Subtle hover effect -->
            <div
              class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
          </Button>

          <!-- Enhanced error display -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 transform translate-y-2 scale-95"
            enter-to-class="opacity-100 transform translate-y-0 scale-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 transform translate-y-0 scale-100"
            leave-to-class="opacity-0 transform translate-y-2 scale-95"
          >
            <div
              v-if="error || authStore.error"
              id="auth-error"
              class="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/30 dark:bg-red-900/20"
              role="alert"
              aria-live="polite"
            >
              <svg
                class="h-5 w-5 flex-shrink-0 text-red-500"
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="text-sm text-red-700 dark:text-red-400">
                <p v-if="error">{{ error }}</p>
                <p v-else-if="authStore.error">{{ authStore.error }}</p>
                <p
                  v-if="authStore.error && authStore.error.includes('Google Identity Services')"
                  class="mt-2 text-xs"
                >
                  You can still try logging in - the system will attempt to reconnect.
                </p>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Footer section -->
        <div class="mt-6 border-t border-gray-200/50 pt-4 sm:mt-8 sm:pt-6 dark:border-gray-700/50">
          <p class="px-2 text-center text-xs text-gray-500 dark:text-gray-400">
            By signing in, you agree to our terms of service and privacy policy
          </p>
        </div>
      </div>

      <!-- Subtle bottom glow effect -->
      <div
        class="from-primary-500/20 dark:from-primary-500/10 absolute -bottom-8 left-1/2 h-24 w-3/4 -translate-x-1/2 rounded-full bg-gradient-to-t to-transparent blur-2xl"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import Button from '@/components/atoms/Button.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isLoading = ref(false)
const error = ref('')

const handleProvider = async (provider: 'google' | 'github' | 'microsoft' | 'apple') => {
  try {
    isLoading.value = true
    error.value = ''
    await authStore.loginWithProvider(provider)

    const redirectPath = (route.query.redirect as string) || '/'
    router.push(redirectPath)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Login failed'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  try {
    await authStore.initialize()

    if (authStore.isAuthenticated) {
      const redirectPath = (route.query.redirect as string) || '/'
      router.push(redirectPath)
    } else {
      // If not authenticated and no redirect parameter, add default redirect
      if (!route.query.redirect) {
        router.replace({ path: '/auth', query: { redirect: '/' } })
      }
    }
  } catch (err) {
    // Show the auth initialization error to the user
    error.value = err instanceof Error ? err.message : 'Authentication system initialization failed'
  }
})
</script>
