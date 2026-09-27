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
  { name: 'Hakkımızda', path: '/hakkimizda' },
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
  <footer class="bg-navy-950 text-white border-t border-navy-900 select-none">
    <!-- Main Footer Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
        <!-- Col 1: Logo & Manifesto (lg:col-span-5) -->
        <div class="lg:col-span-5 space-y-4">
          <NuxtLink to="/" class="inline-block">
            <AppLogo size="md" variant="dark" />
          </NuxtLink>

          <p class="text-sm text-slate-300 leading-relaxed max-w-md pt-2">
            İki Kelam; kadim medrese usûlünü modern ilmi anlayışla meczederek ilim, amel ve ihlâs
            ekseninde talebe yetiştiren, ilmi neşriyat ve kültürel faaliyetler yürüten bir ilim ve irfan meclisidir.
          </p>

          <div class="pt-2 flex items-center gap-3">
            <NuxtLink
              to="/bagis"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all shadow-sm"
            >
              <Heart class="w-3.5 h-3.5 fill-current" />
              <span>İlme Destek Olun</span>
            </NuxtLink>
            <NuxtLink
              to="/hakkimizda"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span>Vakfımız</span>
              <ArrowUpRight class="w-3.5 h-3.5" />
            </NuxtLink>
          </div>
        </div>

        <!-- Col 2: Hızlı Linkler (lg:col-span-3) -->
        <div class="lg:col-span-3 space-y-4">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-gold-400">
            Hızlı Menü
          </h3>
          <ul class="space-y-2.5 text-sm">
            <li v-for="link in quickLinks" :key="link.path">
              <NuxtLink
                :to="link.path"
                class="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 group"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500/80 group-hover:bg-gold-400 transition-colors" />
                <span>{{ link.name }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Col 3: İletişim Bilgileri (lg:col-span-4) -->
        <div class="lg:col-span-4 space-y-4">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-gold-400">
            İletişim & Konum
          </h3>
          <ul class="space-y-3 text-sm text-slate-300">
            <li class="flex items-start gap-3">
              <MapPin class="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
              <span>{{ address }}</span>
            </li>
            <li class="flex items-center gap-3">
              <Phone class="w-4 h-4 text-emerald-400 shrink-0" />
              <a :href="`tel:${phone}`" class="hover:text-white transition-colors">{{ phone }}</a>
            </li>
            <li class="flex items-center gap-3">
              <Mail class="w-4 h-4 text-emerald-400 shrink-0" />
              <a :href="`mailto:${email}`" class="hover:text-white transition-colors">{{ email }}</a>
            </li>
            <li class="flex items-center gap-3">
              <Clock class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{{ settings.visitDays || 'Hafta İçi & Cumartesi' }}: {{ settings.visitHours || '09:00 - 21:00' }}</span>
            </li>
          </ul>

          <!-- Sosyal Medya İkonları -->
          <div class="pt-3">
            <div class="text-xs uppercase tracking-wider text-gold-400 mb-2.5 font-semibold">
              Bizi Takip Edin
            </div>
            <div class="flex items-center gap-3">
              <!-- YouTube -->
              <a
                :href="youtubeUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="w-9 h-9 rounded-xl bg-white/10 hover:bg-red-600 text-slate-200 hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs group"
                aria-label="İki Kelam YouTube Kanalı"
                title="İki Kelam YouTube Kanalı"
              >
                <IconYoutube class="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>

              <!-- Instagram -->
              <a
                :href="instagramUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="w-9 h-9 rounded-xl bg-white/10 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 text-slate-200 hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs group"
                aria-label="İki Kelam Instagram Hesabı"
                title="İki Kelam Instagram Hesabı"
              >
                <IconInstagram class="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Copyright Bar -->
    <div class="border-t border-white/10 bg-navy-950/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          © {{ currentYear }} İki Kelam İlim ve Kültür Derneği. Tüm hakları saklıdır.
        </div>
        <div class="flex items-center gap-4 text-slate-400">
          <span>İlim • İrfan • Hikmet</span>
          <span class="w-1 h-1 rounded-full bg-slate-600" />
          <NuxtLink to="/admin" class="hover:text-slate-200 transition-colors">
            Yönetim Girişi
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
