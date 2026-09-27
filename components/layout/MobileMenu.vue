<script setup lang="ts">
import type { Component } from 'vue'
import {
  X,
  Home,
  BookOpen,
  Calendar,
  Image,
  Phone,
  Heart,
  Info,
  ChevronRight,
  Mail,
  MapPin,
} from 'lucide-vue-next'
import AppLogo from '~/components/common/AppLogo.vue'
import IconYoutube from '~/components/common/IconYoutube.vue'
import IconInstagram from '~/components/common/IconInstagram.vue'
import { useSiteSettings } from '~/composables/useSiteSettings'

const { settings } = useSiteSettings()

interface MenuItem {
  name: string
  path: string
  icon?: Component
}

interface Props {
  isOpen: boolean
  menuItems: MenuItem[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const route = useRoute()

// Route değiştiğinde menüyü otomatik kapat
watch(
  () => route.fullPath,
  () => {
    if (props.isOpen) {
      emit('close')
    }
  },
)

// ESC tuşu basıldığında kapat
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

// Menü açıkken arkaplan kaydırmasını engelle
watch(
  () => props.isOpen,
  (val) => {
    if (import.meta.client) {
      if (val) {
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKeydown)
      } else {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', onKeydown)
      }
    }
  },
)

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onKeydown)
  }
})

// İkon eşleme
function getIconForPath(path: string) {
  if (path === '/') return Home
  if (path.includes('biz-kimiz') || path.includes('hakkimizda') || path.includes('about')) return Info
  if (path.includes('faaliyet') || path.includes('activities')) return BookOpen
  if (path.includes('program') || path.includes('schedule')) return Calendar
  if (path.includes('galeri') || path.includes('gallery')) return Image
  if (path.includes('iletisim') || path.includes('contact')) return Phone
  return ChevronRight
}
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop Overlay -->
    <Transition
      enter-active-class="transition-opacity ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm lg:hidden"
        aria-hidden="true"
        @click="emit('close')"
      />
    </Transition>

    <!-- Slide-in Drawer -->
    <Transition
      enter-active-class="transition-transform ease-out duration-300"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform ease-in duration-200"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="isOpen"
        class="fixed inset-y-0 right-0 z-50 w-full max-w-xs sm:max-w-sm bg-paper-100 text-obsidian-950 shadow-2xl flex flex-col justify-between overflow-y-auto lg:hidden border-l border-paper-300"
        role="dialog"
        aria-modal="true"
        aria-label="Mobil Gezinme Menüsü"
      >
        <!-- Drawer Header -->
        <div class="p-5 border-b border-paper-300/80 flex items-center justify-between bg-paper-200/50">
          <NuxtLink to="/" class="flex items-center gap-2" @click="emit('close')">
            <AppLogo size="sm" :show-subtitle="false" />
          </NuxtLink>

          <button
            type="button"
            class="p-2.5 rounded-xl text-slate-600 hover:text-obsidian-950 hover:bg-paper-300/60 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 touch-target flex items-center justify-center"
            aria-label="Menüyü Kapat"
            @click="emit('close')"
          >
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- Navigation Links -->
        <div class="flex-1 py-4 px-4 space-y-1.5">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-semibold transition-all group min-h-[52px]"
            :class="[
              route.path === item.path
                ? 'bg-obsidian-900 text-white shadow-soft'
                : 'text-obsidian-900 hover:bg-paper-200 hover:text-obsidian-950',
            ]"
            @click="emit('close')"
          >
            <div class="flex items-center gap-3.5">
              <div
                class="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                :class="route.path === item.path ? 'bg-white/10 text-gold-400' : 'bg-paper-200/90 text-slate-600 group-hover:text-emerald-800'"
              >
                <component
                  :is="getIconForPath(item.path)"
                  class="w-4.5 h-4.5"
                />
              </div>
              <span>{{ item.name }}</span>
            </div>
            <ChevronRight
              class="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
              :class="route.path === item.path ? 'text-gold-400' : 'text-slate-400'"
            />
          </NuxtLink>

          <!-- Highlighted CTA (Bağış Yap) -->
          <div class="pt-4 mt-3 border-t border-paper-300">
            <NuxtLink
              to="/donation"
              class="flex items-center justify-center gap-2.5 w-full py-4 px-4 rounded-2xl text-obsidian-950 font-bold shadow-soft hover:shadow-gold bg-gradient-to-r from-gold-300 via-amber-400 to-gold-400 active:scale-[0.98] transition-all min-h-[52px] border border-gold-400/40"
              @click="emit('close')"
            >
              <Heart class="w-5 h-5 fill-obsidian-950" />
              <span>İlme Destek Ol (Bağış Yap)</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Drawer Footer / Quick Info -->
        <div class="p-5 border-t border-paper-300 bg-paper-200/60 text-xs text-slate-600 space-y-3">
          <div class="flex items-start gap-2.5">
            <MapPin class="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <span>Fatih, İstanbul / Türkiye</span>
          </div>
          <div class="flex items-center gap-2.5">
            <Mail class="w-4 h-4 text-emerald-800 shrink-0" />
            <a href="mailto:bilgi@ikikelam.org.tr" class="hover:underline">bilgi@ikikelam.org.tr</a>
          </div>

          <!-- Social Media Follow -->
          <div class="flex items-center justify-between pt-2 border-t border-paper-300/80">
            <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Bizi Takip Edin:</span>
            <div class="flex items-center gap-2">
              <a
                :href="settings.youtubeUrl || 'https://www.youtube.com/@ikikelamresmi'"
                target="_blank"
                rel="noopener noreferrer"
                class="w-8 h-8 rounded-lg flex items-center justify-center bg-white text-slate-600 hover:text-red-600 border border-paper-300/80 transition-colors shadow-2xs"
                aria-label="İki Kelam YouTube Kanalı"
                title="İki Kelam YouTube Kanalı"
              >
                <IconYoutube class="w-4 h-4" />
              </a>
              <a
                :href="settings.instagramUrl || 'https://instagram.com/ikikelamresmi'"
                target="_blank"
                rel="noopener noreferrer"
                class="w-8 h-8 rounded-lg flex items-center justify-center bg-white text-slate-600 hover:text-pink-600 border border-paper-300/80 transition-colors shadow-2xs"
                aria-label="İki Kelam Instagram Hesabı"
                title="İki Kelam Instagram Hesabı"
              >
                <IconInstagram class="w-4 h-4" />
              </a>
            </div>
          </div>

          <div class="pt-1 text-[11px] text-slate-500 font-medium">
            İki Kelam İlim ve Kültür Derneği
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
