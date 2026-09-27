<script setup lang="ts">
import { ref } from 'vue'
import { Menu, X, HeartHandshake } from 'lucide-vue-next'
import AppLogo from '~/components/common/AppLogo.vue'

const isMobileMenuOpen = ref(false)

const navLinks = [
  { label: 'Ana Sayfa', to: '/' },
  { label: 'Hakkımızda', to: '/about' },
  { label: 'Faaliyetler', to: '/activities' },
  { label: 'Ders Programı', to: '/schedule' },
  { label: 'Galeri', to: '/gallery' },
  { label: 'İletişim', to: '/contact' },
]
</script>

<template>
  <header class="border-b border-soft-gray/30 bg-warm-white/90 backdrop-blur-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <NuxtLink to="/" class="group transition-transform duration-200 hover:scale-[1.01]">
        <AppLogo size="md" variant="light" />
      </NuxtLink>

      <nav class="hidden md:flex items-center space-x-7 text-sm font-medium text-slate-700">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="hover:text-emerald-800 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold-500 hover:after:w-full after:transition-all"
          active-class="text-navy-950 font-semibold after:w-full !after:bg-gold-500"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="hidden md:flex items-center space-x-4">
        <NuxtLink
          to="/donation"
          class="inline-flex items-center space-x-2 bg-emerald-900 hover:bg-emerald-950 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition border border-emerald-800/50 hover:border-gold-500/60"
        >
          <HeartHandshake :size="16" class="text-gold-400" />
          <span>Bağış Yap</span>
        </NuxtLink>
      </div>

      <button
        type="button"
        class="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
        aria-label="Menüyü Aç"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <Menu v-if="!isMobileMenuOpen" :size="24" />
        <X v-else :size="24" />
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden border-t border-soft-gray/30 bg-warm-white px-4 pt-3 pb-6 space-y-2">
      <NuxtLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition"
        @click="isMobileMenuOpen = false"
      >
        {{ link.label }}
      </NuxtLink>
      <NuxtLink
        to="/donation"
        class="block mt-4 text-center bg-emerald-900 hover:bg-emerald-950 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition"
        @click="isMobileMenuOpen = false"
      >
        Bağış Yap
      </NuxtLink>
    </div>
  </header>
</template>
