import type { RouteRecordRaw } from 'vue-router'

// Movie Scan specific routes
export const customRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../views/DashboardView.vue'),
    meta: { title: 'Dashboard', requiresAuth: true, keepAlive: true },
  },
  {
    path: '/upload',
    component: () => import('../views/VideoUploadView.vue'),
    meta: { title: 'Video Upload', requiresAuth: true },
  },
  {
    path: '/analysis',
    component: () => import('../views/ContentAnalysisView.vue'),
    meta: { title: 'Content Analysis', requiresAuth: true },
  },
  {
    path: '/reports',
    component: () => import('../views/ReportGenerationView.vue'),
    meta: { title: 'Report Generation', requiresAuth: true },
  },
  {
    path: '/settings',
    component: () => import('../views/SettingsView.vue'),
    meta: { title: 'Settings', requiresAuth: true },
  },
  {
    path: '/admin/design',
    component: () => import('../views/admin/Design.vue'),
    meta: { title: 'Design System', requiresAuth: true },
  },
]
