<script setup lang="ts">
import { ref } from 'vue'
import { Menu, ExternalLink } from 'lucide-vue-next'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import AdminToastContainer from '~/components/admin/AdminToastContainer.vue'

const isMobileDrawerOpen = ref(false)
</script>

<template>
  <div class="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
    <!-- Desktop Persistent Sidebar -->
    <div class="hidden lg:block shrink-0">
      <AdminSidebar />
    </div>

    <!-- Mobile Drawer Overlay -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileDrawerOpen"
        class="fixed inset-0 z-40 bg-navy-950/70 backdrop-blur-xs lg:hidden"
        @click="isMobileDrawerOpen = false"
      />
    </Transition>

    <!-- Mobile Drawer Content -->
    <Transition
      enter-active-class="transition duration-300 ease-out transform"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-200 ease-in transform"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div
        v-if="isMobileDrawerOpen"
        class="fixed inset-y-0 left-0 z-50 lg:hidden"
      >
        <AdminSidebar :mobile-open="true" @close="isMobileDrawerOpen = false" />
      </div>
    </Transition>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Admin Topbar Header -->
      <header class="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div class="flex items-center gap-3">
          <!-- Mobile Hamburger Toggle -->
          <button
            type="button"
            class="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            aria-label="Menüyü Aç"
            @click="isMobileDrawerOpen = true"
          >
            <Menu class="w-5 h-5" />
          </button>

          <span class="font-serif font-bold text-base sm:text-lg text-navy-950">
            İki Kelam — Yönetim Konsolu
          </span>
        </div>

        <div class="flex items-center gap-4">
          <NuxtLink
            to="/"
            target="_blank"
            class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <span>Siteye Git</span>
            <ExternalLink class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>
      </header>

      <!-- Main Router View -->
      <main class="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
        <slot />
      </main>
    </div>

    <!-- Global Toast Notifications -->
    <AdminToastContainer />
  </div>
</template>
