<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Menu, Heart } from 'lucide-vue-next'
import AppLogo from '~/components/common/AppLogo.vue'
import MobileMenu from '~/components/layout/MobileMenu.vue'
import IconYoutube from '~/components/common/IconYoutube.vue'
import IconInstagram from '~/components/common/IconInstagram.vue'
import { useSiteSettings } from '~/composables/useSiteSettings'

const { settings } = useSiteSettings()
const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const route = useRoute()

const navItems = [
  { name: 'Ana Sayfa', path: '/' },
  { name: 'Biz Kimiz?', path: '/biz-kimiz' },
  { name: 'Faaliyetlerimiz', path: '/activities' },
  { name: 'Galeri', path: '/gallery' },
  { name: 'Haftalık Program', path: '/schedule' },
  { name: 'İletişim', path: '/contact' },
]

function handleScroll() {
  if (typeof window !== 'undefined') {
    isScrolled.value = window.scrollY > 16
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function isRouteActive(path: string) {
  if (path === '/') return route.path === '/'
  return (
    route.path.startsWith(path) ||
    (path === '/biz-kimiz' && (route.path.startsWith('/hakkimizda') || route.path.startsWith('/about'))) ||
    (path === '/activities' && route.path.startsWith('/faaliyetlerimiz')) ||
    (path === '/gallery' && route.path.startsWith('/galeri')) ||
    (path === '/schedule' && route.path.startsWith('/program')) ||
    (path === '/contact' && route.path.startsWith('/iletisim'))
  )
}
</script>

<template>
  <header
    class="sticky top-0 z-40 w-full transition-all duration-300"
    :class="[
      isScrolled
        ? 'glass-nav shadow-soft border-b border-paper-300/80 py-2.5'
        : 'bg-paper-100/80 backdrop-blur-md border-b border-paper-300/50 py-3.5',
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <!-- Logo with subtle hover micro-interaction -->
        <NuxtLink
          to="/"
          class="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-xl p-1 transition-transform duration-200 group-hover:scale-[1.02]"
          aria-label="İki Kelam Ana Sayfa"
        >
          <AppLogo size="md" :show-subtitle="true" />
        </NuxtLink>

        <!-- Desktop Navigation Links -->
        <nav class="hidden lg:flex items-center gap-1.5 xl:gap-2" aria-label="Ana Gezinme Menüsü">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
            :class="[
              isRouteActive(item.path)
                ? 'text-obsidian-950 font-bold bg-white shadow-soft border border-paper-300/70'
                : 'text-slate-600 hover:text-obsidian-950 hover:bg-paper-200/80',
            ]"
          >
            {{ item.name }}
            <span
              v-if="isRouteActive(item.path)"
              class="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-gold-400 via-amber-500 to-gold-400 rounded-full"
              aria-hidden="true"
            />
          </NuxtLink>
        </nav>

        <!-- Right Side: Social Icons, Vurgulu "Bağış Yap" & Mobile Menu Toggle -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Minimal Social Icons (Desktop) -->
          <div class="hidden md:flex items-center gap-1.5 mr-1">
            <a
              :href="settings.youtubeUrl || 'https://www.youtube.com/@ikikelamresmi'"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-red-600 bg-white/70 border border-paper-300/60 transition-all duration-200 shadow-2xs group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label="İki Kelam YouTube Kanalı"
              title="İki Kelam YouTube Kanalı"
            >
              <IconYoutube class="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>
            <a
              :href="settings.instagramUrl || 'https://instagram.com/ikikelamresmi'"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 bg-white/70 border border-paper-300/60 transition-all duration-200 shadow-2xs group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
              aria-label="İki Kelam Instagram Hesabı"
              title="İki Kelam Instagram Hesabı"
            >
              <IconInstagram class="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>
          </div>

          <!-- Bağış Yap Button (Desktop) -->
          <NuxtLink
            to="/donation"
            class="hidden sm:inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs md:text-sm font-bold text-obsidian-950 shadow-soft hover:shadow-gold bg-gradient-to-r from-gold-300 via-amber-400 to-gold-400 hover:from-amber-400 hover:to-gold-500 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 select-none border border-gold-400/40"
          >
            <Heart class="w-4 h-4 fill-obsidian-900 text-obsidian-900 transition-transform hover:scale-110" />
            <span>Bağış Yap</span>
          </NuxtLink>

          <!-- Mobile Hamburger Toggle (44px touch target) -->
          <button
            type="button"
            class="lg:hidden p-2.5 rounded-xl text-obsidian-900 bg-white/80 border border-paper-300/80 hover:bg-paper-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 transition-all shadow-xs touch-target flex items-center justify-center"
            aria-label="Menüyü Aç"
            :aria-expanded="isMobileMenuOpen"
            @click="isMobileMenuOpen = true"
          >
            <Menu class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer Menu -->
    <MobileMenu
      :is-open="isMobileMenuOpen"
      :menu-items="navItems"
      @close="isMobileMenuOpen = false"
    />
  </header>
</template>
