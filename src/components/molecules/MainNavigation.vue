<template>
  <nav
    class="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-white/80 shadow-lg backdrop-blur-md dark:border-gray-700/20 dark:bg-gray-900/80"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <router-link
            to="/"
            class="group flex items-center space-x-3 transition-all duration-300 hover:scale-105"
          >
            <div class="flex-shrink-0">
              <div class="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-2 shadow-lg">
                <svg
                  class="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="flex-shrink-0">
              <h1
                class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent"
              >
                Movie Scan
              </h1>
            </div>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden items-center space-x-2 md:flex">
          <router-link
            to="/"
            class="group relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300"
            :class="
              $route.path === '/'
                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-600 shadow-lg backdrop-blur-sm'
                : 'text-gray-700 hover:bg-white/50 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
            "
          >
            <div class="flex items-center space-x-2">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                ></path>
              </svg>
              <span>Dashboard</span>
            </div>
          </router-link>

          <router-link
            to="/process"
            class="group relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300"
            :class="
              $route.path === '/process'
                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 shadow-lg backdrop-blur-sm'
                : 'text-gray-700 hover:bg-white/50 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
            "
          >
            <div class="flex items-center space-x-2">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                ></path>
              </svg>
              <span>Process Video</span>
            </div>
          </router-link>

          <router-link
            to="/reports"
            class="group relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300"
            :class="
              $route.path === '/reports'
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 shadow-lg backdrop-blur-sm'
                : 'text-gray-700 hover:bg-white/50 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
            "
          >
            <div class="flex items-center space-x-2">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
              <span>Reports</span>
            </div>
          </router-link>

          <router-link
            to="/settings"
            class="group relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300"
            :class="
              $route.path === '/settings'
                ? 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-600 shadow-lg backdrop-blur-sm'
                : 'text-gray-700 hover:bg-white/50 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
            "
          >
            <div class="flex items-center space-x-2">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              <span>Settings</span>
            </div>
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <div class="flex items-center md:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="inline-flex items-center justify-center rounded-xl p-2 text-gray-400 transition-all duration-300 hover:bg-white/50 hover:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-inset"
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
      <div
        class="space-y-1 border-t border-white/20 bg-white/90 px-2 pt-2 pb-3 backdrop-blur-md sm:px-3 dark:border-gray-700/20 dark:bg-gray-900/90"
      >
        <router-link
          to="/"
          class="group flex items-center space-x-3 rounded-xl px-3 py-2 text-base font-medium transition-all duration-300"
          :class="
            $route.path === '/'
              ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-600 shadow-lg'
              : 'text-gray-700 hover:bg-white/50 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
          "
          @click="mobileMenuOpen = false"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
            ></path>
          </svg>
          <span>Dashboard</span>
        </router-link>

        <router-link
          to="/process"
          class="group flex items-center space-x-3 rounded-xl px-3 py-2 text-base font-medium transition-all duration-300"
          :class="
            $route.path === '/process'
              ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 shadow-lg'
              : 'text-gray-700 hover:bg-white/50 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
          "
          @click="mobileMenuOpen = false"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
          <span>Process Video</span>
        </router-link>

        <router-link
          to="/reports"
          class="group flex items-center space-x-3 rounded-xl px-3 py-2 text-base font-medium transition-all duration-300"
          :class="
            $route.path === '/reports'
              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 shadow-lg'
              : 'text-gray-700 hover:bg-white/50 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
          "
          @click="mobileMenuOpen = false"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            ></path>
          </svg>
          <span>Reports</span>
        </router-link>

        <router-link
          to="/settings"
          class="group flex items-center space-x-3 rounded-xl px-3 py-2 text-base font-medium transition-all duration-300"
          :class="
            $route.path === '/settings'
              ? 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-600 shadow-lg'
              : 'text-gray-700 hover:bg-white/50 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
          "
          @click="mobileMenuOpen = false"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          <span>Settings</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mobileMenuOpen = ref(false)
</script>
