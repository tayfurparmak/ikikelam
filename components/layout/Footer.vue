<script setup lang="ts">
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Heart,
  ArrowUpRight,
} from 'lucide-vue-next'
import AppLogo from '~/components/common/AppLogo.vue'
import IconYoutube from '~/components/common/IconYoutube.vue'
import IconInstagram from '~/components/common/IconInstagram.vue'
import { useSiteSettings } from '~/composables/useSiteSettings'

const currentYear = new Date().getFullYear()
const { settings } = useSiteSettings()

const quickLinks = [
  { name: 'Ana Sayfa', path: '/' },
  { name: 'Biz Kimiz?', path: '/biz-kimiz' },
  { name: 'Faaliyetlerimiz', path: '/activities' },
  { name: 'Galeri', path: '/gallery' },
  { name: 'Haftalık Program', path: '/schedule' },
  { name: 'İletişim', path: '/contact' },
  { name: 'Bağış ve Destek', path: '/donation' },
]

const youtubeUrl = computed(() => settings.value.youtubeUrl || 'https://www.youtube.com/@ikikelamresmi')
const instagramUrl = computed(() => settings.value.instagramUrl || 'https://instagram.com/ikikelamresmi')
const phone = computed(() => settings.value.phone || '+90 500 000 00 00')
const email = computed(() => settings.value.email || 'bilgi@ikikelam.org.tr')
const address = computed(() => {
  const parts = [settings.value.address, settings.value.district, settings.value.city].filter(Boolean)
  return parts.join(', ') || 'Ali Kuşçu Mah. Medrese Sok. No: 12, Fatih / İstanbul'
})
</script>

<template>
  <footer class="bg-obsidian-950 text-white border-t border-obsidian-800 select-none">
    <!-- Main Footer Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
        <!-- Col 1: Logo & Manifesto (lg:col-span-5) -->
        <div class="lg:col-span-5 space-y-4">
          <NuxtLink to="/" class="inline-block">
            <AppLogo size="md" variant="dark" />
          </NuxtLink>

          <p class="text-sm text-slate-300 leading-relaxed max-w-md pt-2 font-light">
            İki Kelam; kadim medrese usûlünü modern ilmi anlayışla meczederek ilim, amel ve ihlâs
            ekseninde talebe yetiştiren, ilmi neşriyat ve kültürel faaliyetler yürüten bir ilim ve irfan meclisidir.
          </p>

          <div class="pt-3 flex flex-wrap items-center gap-3">
            <NuxtLink
              to="/bagis"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-obsidian-950 bg-gradient-to-r from-gold-300 via-amber-400 to-gold-400 hover:from-amber-400 hover:to-gold-500 transition-all shadow-soft min-h-[40px]"
            >
              <Heart class="w-3.5 h-3.5 fill-obsidian-950" />
              <span>İlme Destek Olun</span>
            </NuxtLink>
            <NuxtLink
              to="/biz-kimiz"
              class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors border border-white/15 min-h-[40px]"
            >
              <span>Vakfımız</span>
              <ArrowUpRight class="w-3.5 h-3.5" />
            </NuxtLink>
          </div>
        </div>

        <!-- Col 2: Hızlı Linkler (lg:col-span-3) -->
        <div class="lg:col-span-3 space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-gold-400">
            Hızlı Menü
          </h3>
          <ul class="space-y-2.5 text-sm">
            <li v-for="link in quickLinks" :key="link.path">
              <NuxtLink
                :to="link.path"
                class="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group py-1"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-gold-500/60 group-hover:bg-gold-400 group-hover:scale-125 transition-all" />
                <span>{{ link.name }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Col 3: İletişim Bilgileri (lg:col-span-4) -->
        <div class="lg:col-span-4 space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-gold-400">
            İletişim & Konum
          </h3>
          <ul class="space-y-3.5 text-sm text-slate-300 font-light">
            <li class="flex items-start gap-3">
              <MapPin class="w-4.5 h-4.5 text-gold-400 shrink-0 mt-0.5" />
              <span>{{ address }}</span>
            </li>
            <li class="flex items-center gap-3">
              <Phone class="w-4.5 h-4.5 text-gold-400 shrink-0" />
              <a :href="`tel:${phone}`" class="hover:text-white transition-colors font-normal">{{ phone }}</a>
            </li>
            <li class="flex items-center gap-3">
              <Mail class="w-4.5 h-4.5 text-gold-400 shrink-0" />
              <a :href="`mailto:${email}`" class="hover:text-white transition-colors font-normal">{{ email }}</a>
            </li>
            <li class="flex items-center gap-3">
              <Clock class="w-4.5 h-4.5 text-gold-400 shrink-0" />
              <span>{{ settings.visitDays || 'Hafta İçi & Cumartesi' }}: {{ settings.visitHours || '09:00 - 21:00' }}</span>
            </li>
          </ul>

          <!-- Sosyal Medya İkonları -->
          <div class="pt-3">
            <div class="text-[11px] uppercase tracking-wider text-gold-400 mb-2.5 font-bold">
              Bizi Takip Edin
            </div>
            <div class="flex items-center gap-2.5">
              <!-- YouTube -->
              <a
                :href="youtubeUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="w-10 h-10 rounded-xl bg-white/10 hover:bg-red-600 text-slate-200 hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs group border border-white/10"
                aria-label="İki Kelam YouTube Kanalı"
                title="İki Kelam YouTube Kanalı"
              >
                <IconYoutube class="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
              </a>

              <!-- Instagram -->
              <a
                :href="instagramUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 text-slate-200 hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs group border border-white/10"
                aria-label="İki Kelam Instagram Hesabı"
                title="İki Kelam Instagram Hesabı"
              >
                <IconInstagram class="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Copyright Bar -->
    <div class="border-t border-white/10 bg-obsidian-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          © {{ currentYear }} İki Kelam İlim ve Kültür Derneği. Tüm hakları saklıdır.
        </div>
        <div class="flex items-center gap-4 text-slate-400">
          <span class="text-gold-400 font-serif">İlim • İrfan • Hikmet</span>
          <span class="w-1 h-1 rounded-full bg-slate-700" />
          <NuxtLink to="/admin" class="hover:text-slate-200 transition-colors">
            Yönetim Girişi
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
