<template>
  <nav class="border-b bg-white shadow-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-xl font-bold text-gray-900">🎬 Movie Scan</h1>
            </div>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden items-center space-x-8 md:flex">
          <router-link
            to="/"
            class="rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
            :class="
              $route.path === '/'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            "
          >
            Dashboard
          </router-link>
          <router-link
            to="/upload"
            class="rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
            :class="
              $route.path === '/upload'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            "
          >
            Upload
          </router-link>
          <router-link
            to="/analysis"
            class="rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
            :class="
              $route.path === '/analysis'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            "
          >
            Analysis
          </router-link>
          <router-link
            to="/reports"
            class="rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
            :class="
              $route.path === '/reports'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            "
          >
            Reports
          </router-link>
          <router-link
            to="/settings"
            class="rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
            :class="
              $route.path === '/settings'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            "
          >
            Settings
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <div class="flex items-center md:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-inset"
          >
            <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="md:hidden">
      <div class="space-y-1 border-t bg-white px-2 pt-2 pb-3 sm:px-3">
        <router-link
          to="/"
          class="block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200"
          :class="
            $route.path === '/'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          "
          @click="mobileMenuOpen = false"
        >
          Dashboard
        </router-link>
        <router-link
          to="/upload"
          class="block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200"
          :class="
            $route.path === '/upload'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          "
          @click="mobileMenuOpen = false"
        >
          Upload
        </router-link>
        <router-link
          to="/analysis"
          class="block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200"
          :class="
            $route.path === '/analysis'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          "
          @click="mobileMenuOpen = false"
        >
          Analysis
        </router-link>
        <router-link
          to="/reports"
          class="block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200"
          :class="
            $route.path === '/reports'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          "
          @click="mobileMenuOpen = false"
        >
          Reports
        </router-link>
        <router-link
          to="/settings"
          class="block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200"
          :class="
            $route.path === '/settings'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          "
          @click="mobileMenuOpen = false"
        >
          Settings
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mobileMenuOpen = ref(false)
</script>
