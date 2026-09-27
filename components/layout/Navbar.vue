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
  { name: 'Hakkımızda', path: '/hakkimizda' },
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
    (path === '/hakkimizda' && route.path.startsWith('/about')) ||
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
        ? 'bg-warm-white/95 backdrop-blur-md shadow-sm border-b border-cream-300/80 py-2.5'
        : 'bg-warm-white/80 backdrop-blur-sm border-b border-cream-200/50 py-3.5',
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-lg p-0.5"
          aria-label="İki Kelam Ana Sayfa"
        >
          <AppLogo size="md" :show-subtitle="true" />
        </NuxtLink>

        <!-- Desktop Navigation Links -->
        <nav class="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Ana Gezinme Menüsü">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            :class="[
              isRouteActive(item.path)
                ? 'text-emerald-900 font-semibold bg-emerald-50/80'
                : 'text-navy-900/80 hover:text-emerald-900 hover:bg-cream-100/70',
            ]"
          >
            {{ item.name }}
            <span
              v-if="isRouteActive(item.path)"
              class="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-emerald-800 rounded-full"
              aria-hidden="true"
            />
          </NuxtLink>
        </nav>

        <!-- Right Side: Social Icons, Vurgulu "Bağış Yap" & Mobile Menu Toggle -->
        <div class="flex items-center gap-2 sm:gap-2.5">
          <!-- Minimal Social Icons (Desktop) -->
          <div class="hidden md:flex items-center gap-1 mr-1">
            <a
              :href="settings.youtubeUrl || 'https://www.youtube.com/@ikikelamresmi'"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-cream-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              aria-label="İki Kelam YouTube Kanalı"
              title="İki Kelam YouTube Kanalı"
            >
              <IconYoutube class="w-4 h-4" />
            </a>
            <a
              :href="settings.instagramUrl || 'https://instagram.com/ikikelamresmi'"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-lg text-slate-500 hover:text-pink-600 hover:bg-cream-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              aria-label="İki Kelam Instagram Hesabı"
              title="İki Kelam Instagram Hesabı"
            >
              <IconInstagram class="w-4 h-4" />
            </a>
          </div>

          <!-- Bağış Yap Button (Desktop) -->
          <NuxtLink
            to="/donation"
            class="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold text-white shadow-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 select-none"
          >
            <Heart class="w-4 h-4 fill-current text-white/90" />
            <span>Bağış Yap</span>
          </NuxtLink>

          <!-- Mobile Hamburger Toggle -->
          <button
            type="button"
            class="lg:hidden p-2 rounded-lg text-navy-900 hover:bg-cream-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 transition-colors"
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
