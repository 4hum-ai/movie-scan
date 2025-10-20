import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { genericRoutes } from './generic'
import { customRoutes } from './custom'
const routes: RouteRecordRaw[] = [...genericRoutes, ...customRoutes]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, _from, next) => {
  let titleSuffix = String(to.meta.title || 'Admin')
  const authStore = useAuthStore()

  // Try to initialize auth if not already done, but don't block navigation on failure
  if (!authStore.user && !authStore.isLoading) {
    try {
      await authStore.initialize()
    } catch (error) {
      console.warn('🔐 Router: Auth initialization failed in route guard:', error)
      // Continue with navigation - auth errors are handled in the store
    }
  }

  if (to.name === 'Auth' && authStore.isAuthenticated) {
    const redirectPath = (to.query.redirect as string) || '/'
    next(redirectPath)
    return
  }
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Auth', query: { redirect: to.fullPath } })
    return
  }
  // Ensure auth page always has a redirect parameter
  if (to.name === 'Auth' && !to.query.redirect) {
    next({ name: 'Auth', query: { redirect: '/' } })
    return
  }

  const maybeResource = to.params?.module as string | undefined
  if (maybeResource) {
    // Avoid network calls in the guard; title will be refined in views.
    titleSuffix = to.meta.title ? `${maybeResource} - ${to.meta.title}` : maybeResource
  }

  document.title = `${titleSuffix} - Admin UI`
  next()
})

export default router
