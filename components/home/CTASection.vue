<script setup lang="ts">
import { ArrowRight, Mail, Heart, Compass } from 'lucide-vue-next'
import Container from '~/components/common/Container.vue'
</script>

<template>
  <section class="relative py-20 md:py-28 bg-emerald-950 text-white overflow-hidden">
    <!-- Subtle ambient lighting -->
    <div
      class="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none"
      aria-hidden="true"
    />
    <div
      class="absolute bottom-0 left-1/4 translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
      aria-hidden="true"
    />

    <Container class="relative z-10">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/10 text-emerald-200 border border-white/15 mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Kardeşlik ve Birliktelik
        </div>

        <!-- Headline -->
        <h2 class="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
          İlim ve İrfan Halkalarımızda <br class="hidden sm:inline" />
          <span class="text-emerald-200">Siz de Yerinizi Alın</span>
        </h2>

        <!-- Paragraph -->
        <p class="text-base sm:text-lg text-emerald-100/80 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Medrese tedrisatımız, haftalık ders halkalarımız ve hayır faaliyetlerimiz hakkında bilgi almak veya destek olmak için bize her zaman ulaşabilirsiniz.
        </p>

        <!-- CTA Buttons (İletişim / Bağış / Faaliyetler) -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
          <!-- Faaliyetler Link -->
          <NuxtLink
            to="/faaliyetlerimiz"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-emerald-950 font-semibold text-sm hover:bg-emerald-50 transition-all duration-200 shadow-lg shadow-black/10 focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <Compass class="w-4 h-4 text-emerald-800" />
            <span>Faaliyetlerimiz</span>
            <ArrowRight class="w-4 h-4 text-emerald-800" />
          </NuxtLink>

          <!-- Bağış Yap Link -->
          <NuxtLink
            to="/bagis"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-800/80 text-emerald-100 hover:bg-emerald-800 hover:text-white border border-emerald-700/60 font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            <Heart class="w-4 h-4 text-amber-400" />
            <span>Bağış Yap</span>
          </NuxtLink>

          <!-- İletişim Link -->
          <NuxtLink
            to="/iletisim"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-transparent text-emerald-200 hover:text-white hover:bg-white/5 border border-white/20 font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <Mail class="w-4 h-4" />
            <span>Bize Ulaşın</span>
          </NuxtLink>
        </div>
      </div>
    </Container>
  </section>
</template>
