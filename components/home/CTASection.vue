<script setup lang="ts">
import { ArrowRight, Mail, Heart, Compass } from 'lucide-vue-next'
import Container from '~/components/common/Container.vue'
</script>

<template>
  <section class="relative py-20 md:py-28 bg-emerald-950 text-white overflow-hidden border-b border-emerald-900">
    <!-- Subtle ambient lighting -->
    <div
      class="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-700/25 rounded-full blur-3xl pointer-events-none"
      aria-hidden="true"
    />
    <div
      class="absolute bottom-0 left-1/4 translate-y-1/2 w-96 h-96 bg-gold-400/15 rounded-full blur-3xl pointer-events-none"
      aria-hidden="true"
    />

    <Container class="relative z-10">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/10 text-gold-300 border border-white/15 mb-6 select-none backdrop-blur-sm">
          <span class="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          Kardeşlik ve Birliktelik
        </div>

        <!-- Headline -->
        <h2 class="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
          İlim ve İrfan Halkalarımızda <br class="hidden sm:inline" />
          <span class="text-gold-300">Siz de Yerinizi Alın</span>
        </h2>

        <!-- Paragraph -->
        <p class="text-base sm:text-lg text-emerald-100/85 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Medrese tedrisatımız, haftalık ders halkalarımız ve hayır faaliyetlerimiz hakkında bilgi almak veya talebelere destek olmak için bize her zaman ulaşabilirsiniz.
        </p>

        <!-- CTA Buttons (İletişim / Bağış / Faaliyetler) -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
          <!-- Faaliyetler Link -->
          <NuxtLink
            to="/faaliyetlerimiz"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-white text-obsidian-950 font-bold text-sm hover:bg-paper-100 transition-all duration-200 shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 min-h-[50px]"
          >
            <Compass class="w-4.5 h-4.5 text-emerald-800" />
            <span>Faaliyetlerimiz</span>
            <ArrowRight class="w-4 h-4 text-emerald-800" />
          </NuxtLink>

          <!-- Bağış Yap Link -->
          <NuxtLink
            to="/bagis"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-gold-300 via-amber-400 to-gold-400 hover:from-amber-400 hover:to-gold-500 text-obsidian-950 font-bold text-sm transition-all duration-200 shadow-soft hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 min-h-[50px]"
          >
            <Heart class="w-4.5 h-4.5 fill-obsidian-950" />
            <span>Bağış Yap</span>
          </NuxtLink>

          <!-- İletişim Link -->
          <NuxtLink
            to="/iletisim"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 min-h-[50px]"
          >
            <Mail class="w-4.5 h-4.5 text-emerald-200" />
            <span>Bize Ulaşın</span>
          </NuxtLink>
        </div>
      </div>
    </Container>
  </section>
</template>
