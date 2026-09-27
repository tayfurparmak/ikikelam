<script setup lang="ts">
import { ExternalLink, Users } from 'lucide-vue-next'
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
  <section class="py-16 sm:py-24 bg-paper-100/60 border-b border-paper-300/80">
    <Container size="xl">
      <div
        class="relative rounded-3xl sm:rounded-4xl bg-obsidian-950 text-white p-8 sm:p-14 lg:p-16 overflow-hidden border border-obsidian-800 shadow-elevated"
      >
        <!-- Subtle Ambient Halos (Gold & Emerald) -->
        <div class="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-emerald-800/15 blur-3xl pointer-events-none" />
        <div class="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-gold-400/10 blur-3xl pointer-events-none" />

        <div class="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 text-gold-300 border border-white/15 select-none backdrop-blur-sm">
            <Users class="w-3.5 h-3.5 text-gold-400" />
            <span>Resmi Hesaplarımız</span>
          </div>

          <!-- Title -->
          <h2 class="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
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
              class="w-full sm:w-auto inline-flex items-center justify-center gap-3.5 px-7 py-4 rounded-2xl bg-white hover:bg-paper-100 text-obsidian-950 text-sm font-bold shadow-soft hover:shadow-gold transition-all duration-300 group min-h-[52px]"
            >
              <div class="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 group-hover:scale-105 transition-transform shrink-0">
                <IconYoutube class="w-4.5 h-4.5" />
              </div>
              <div class="text-left">
                <span class="block text-[11px] font-normal text-slate-500">YouTube Kanalımız</span>
                <span class="block text-xs sm:text-sm font-extrabold text-obsidian-950">@ikikelamresmi</span>
              </div>
              <ExternalLink class="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <!-- Instagram CTA Card -->
            <a
              :href="instagramUrl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="İki Kelam Instagram hesabını ziyaret et"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-3.5 px-7 py-4 rounded-2xl bg-obsidian-900 hover:bg-obsidian-850 text-white text-sm font-bold border border-white/15 shadow-soft hover:shadow-elevated transition-all duration-300 group min-h-[52px]"
            >
              <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <IconInstagram class="w-4.5 h-4.5" />
              </div>
              <div class="text-left">
                <span class="block text-[11px] font-normal text-slate-400">Instagram Hesabımız</span>
                <span class="block text-xs sm:text-sm font-extrabold text-white">@ikikelamresmi</span>
              </div>
              <ExternalLink class="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>
