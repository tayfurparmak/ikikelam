<script setup lang="ts">
import {
  LayoutDashboard,
  FileText,
  Compass,
  FolderTree,
  Image,
  Calendar,
  MessageSquare,
  MapPin,
  Settings,
  LogOut,
  User,
  X,
} from 'lucide-vue-next'
import AppLogo from '~/components/common/AppLogo.vue'

const props = defineProps<{
  mobileOpen?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const route = useRoute()
const { user, logout, isLoading } = useAdminAuth()

const links = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'İçerikler', to: '/admin/posts', icon: FileText },
  { label: 'Faaliyetler', to: '/admin/activities', icon: Compass },
  { label: 'Kategoriler', to: '/admin/categories', icon: FolderTree },
  { label: 'Galeri', to: '/admin/gallery', icon: Image },
  { label: 'Haftalık Program', to: '/admin/schedule', icon: Calendar },
  { label: 'Mesajlar', to: '/admin/messages', icon: MessageSquare },
  { label: 'İletişim Bilgileri', to: '/admin/contact', icon: MapPin },
  { label: 'Ayarlar', to: '/admin/settings', icon: Settings },
]

// Auto close on route change
watch(
  () => route.path,
  () => {
    if (props.mobileOpen) {
      emit('close')
    }
  }
)
</script>

<template>
  <aside
    class="w-64 bg-navy-950 text-slate-300 min-h-screen p-5 flex flex-col border-r border-navy-800 select-none"
  >
    <!-- Brand & Mobile Close -->
    <div class="px-2 py-3 mb-4 border-b border-navy-800 flex items-center justify-between">
      <NuxtLink to="/" class="focus:outline-none">
        <AppLogo size="sm" variant="dark" />
      </NuxtLink>

      <button
        v-if="mobileOpen"
        type="button"
        class="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-900 focus:outline-none"
        aria-label="Menüyü Kapat"
        @click="emit('close')"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="space-y-1.5 flex-1" aria-label="Yönetim Menüsü">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium hover:bg-navy-900 hover:text-white transition-all duration-200"
        active-class="bg-emerald-800 text-white font-semibold shadow-xs"
        @click="emit('close')"
      >
        <component :is="link.icon" class="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{{ link.label }}</span>
      </NuxtLink>
    </nav>

    <!-- User Info & Logout Section -->
    <div class="pt-4 border-t border-navy-800/80 space-y-3">
      <div v-if="user" class="px-3.5 py-2.5 rounded-xl bg-navy-900/60 border border-navy-800 flex items-center space-x-3">
        <div class="w-8 h-8 rounded-full bg-emerald-900/80 text-emerald-300 flex items-center justify-center shrink-0">
          <User class="w-4 h-4" />
        </div>
        <div class="overflow-hidden min-w-0">
          <p class="text-xs font-semibold text-white truncate">{{ user.name }}</p>
          <p class="text-[10px] text-slate-400 truncate">{{ user.email }}</p>
        </div>
      </div>

      <button
        type="button"
        :disabled="isLoading"
        class="w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-all cursor-pointer disabled:opacity-50"
        @click="logout"
      >
        <LogOut class="w-4 h-4" />
        <span>Çıkış Yap</span>
      </button>
    </div>
  </aside>
</template>
