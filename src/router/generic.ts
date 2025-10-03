import type { RouteRecordRaw } from 'vue-router'

export const genericRoutes: RouteRecordRaw[] = [
  {
    path: '/:module',
    component: () => import('../views/ItemListView.vue'),
    meta: { title: 'Resource', requiresAuth: true, keepAlive: true },
  },
  {
    path: '/:module/:id',
    component: () => import('../views/ItemDetailView.vue'),
    meta: { title: 'Detail', requiresAuth: true, keepAlive: true },
  },
  // Auth
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/Auth.vue'),
    meta: { title: 'Sign In' },
  },
  {
    path: '/not-found',
    component: () => import('../views/NotFound.vue'),
    meta: { title: 'Not Found' },
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/NotFound.vue'),
    meta: { title: 'Not Found' },
  },
]
