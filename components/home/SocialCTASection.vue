<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next'
import Container from '~/components/common/Container.vue'
import IconYoutube from '~/components/common/IconYoutube.vue'
import IconInstagram from '~/components/common/IconInstagram.vue'

withDefaults(
  defineProps<{
    youtubeUrl?: string
    instagramUrl?: string
  }>(),
  {
    youtubeUrl: 'https://www.youtube.com/@ikikelamresmi',
    instagramUrl: 'https://instagram.com/ikikelamresmi',
  }
)
</script>

<template>
  <section class="py-14 sm:py-20 bg-warm-white border-t border-cream-200/80">
    <Container size="xl">
      <div
        class="relative rounded-3xl bg-navy-950 text-white p-8 sm:p-14 overflow-hidden border border-navy-800 shadow-xl"
      >
        <!-- Subtle Background Islamic / Geometry Pattern Accent -->
        <div class="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-900/20 blur-3xl pointer-events-none" />
        <div class="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div class="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 text-emerald-300 border border-white/10">
            <span>Resmi Hesaplarımız</span>
          </div>

          <!-- Title -->
          <h2 class="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white">
            İki Kelam'ı Sosyal Medyada Takip Edin
          </h2>

          <!-- Subtitle -->
          <p class="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-xl mx-auto">
            Haftalık sohbet kayıtlarımız, ilmi derslerimiz, medrese faaliyetlerimiz ve güncel duyurularımızdan anında haberdar olun.
          </p>

          <!-- Social Action Cards / Buttons -->
          <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <!-- YouTube CTA Card -->
            <a
              :href="youtubeUrl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="İki Kelam YouTube kanalını ziyaret et"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white hover:bg-cream-50 text-navy-950 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 group"
            >
              <div class="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 group-hover:scale-105 transition-transform">
                <IconYoutube class="w-4 h-4" />
              </div>
              <div class="text-left">
                <span class="block text-xs font-normal text-slate-500">YouTube Kanalımız</span>
                <span class="block text-xs sm:text-sm font-bold text-navy-950">@ikikelamresmi</span>
              </div>
              <ExternalLink class="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <!-- Instagram CTA Card -->
            <a
              :href="instagramUrl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="İki Kelam Instagram hesabını ziyaret et"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold border border-white/10 shadow-md hover:shadow-lg transition-all duration-300 group"
            >
              <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <IconInstagram class="w-4 h-4" />
              </div>
              <div class="text-left">
                <span class="block text-xs font-normal text-slate-400">Instagram Hesabımız</span>
                <span class="block text-xs sm:text-sm font-bold text-white">@ikikelamresmi</span>
              </div>
              <ExternalLink class="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>
