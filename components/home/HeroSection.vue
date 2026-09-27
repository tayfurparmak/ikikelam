<script setup lang="ts">
import { ArrowRight, MessageSquare, Sparkles } from 'lucide-vue-next'
import Container from '~/components/common/Container.vue'
import Button from '~/components/common/Button.vue'
</script>

<template>
  <section class="relative overflow-hidden bg-gradient-to-b from-cream-100 via-warm-white to-warm-white pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-cream-200/80 select-none">
    <!-- Subtle Ambient Glows -->
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-emerald-200/25 to-gold-200/20 rounded-full blur-3xl pointer-events-none -z-10"
      aria-hidden="true"
    />
    <div
      class="absolute -top-24 right-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-2xl pointer-events-none -z-10"
      aria-hidden="true"
    />

    <Container size="xl">
      <div class="max-w-4xl mx-auto text-center flex flex-col items-center">
        <!-- Eyebrow Badge -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-900 text-xs sm:text-sm font-semibold tracking-wide shadow-xs mb-6">
          <Sparkles class="w-3.5 h-3.5 text-gold-600" />
          <span>Kadim Medrese Usûlü & Modern İrfan Meclisi</span>
        </div>

        <!-- Main Heading -->
        <h1 class="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-navy-950 tracking-tight leading-[1.15] text-balance">
          İlim, irfan ve kardeşlik yolunda...
        </h1>

        <!-- Decorative Accent -->
        <div class="w-20 h-1 bg-gradient-to-r from-emerald-800 via-gold-500 to-emerald-800 rounded-full my-6 opacity-80" />

        <!-- Subtitle -->
        <p class="text-base sm:text-xl text-slate-700 font-light leading-relaxed max-w-2xl text-balance">
          İki Kelam İlim ve Kültür Derneği; sahih itikat, derinlikli fıkıh şuuru ve ihlaslı amel rehberliğinde
          talebe yetiştiren, ilmi neşriyat ve kültürel meclislerle topluma hizmet eden bir ilim yuvasıdır.
        </p>

        <!-- CTA Buttons -->
        <div class="mt-9 flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
          <Button
            to="/faaliyetlerimiz"
            variant="primary"
            size="lg"
            :icon-right="ArrowRight"
            class="w-full sm:w-auto shadow-md hover:shadow-lg"
          >
            Faaliyetlerimizi Keşfet
          </Button>

          <Button
            to="/iletisim"
            variant="outline"
            size="lg"
            :icon-left="MessageSquare"
            class="w-full sm:w-auto"
          >
            Bize Ulaşın
          </Button>
        </div>

        <!-- Feature Pillars Summary -->
        <div class="mt-14 pt-10 border-t border-cream-300/70 grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-3xl text-left sm:text-center">
          <div class="space-y-1">
            <div class="font-serif text-2xl font-bold text-navy-950">Ehl-i Sünnet</div>
            <div class="text-xs text-slate-500 font-light">Sahih Akide ve İtikat</div>
          </div>
          <div class="space-y-1">
            <div class="font-serif text-2xl font-bold text-navy-950">Medrese</div>
            <div class="text-xs text-slate-500 font-light">Klasik Metin Tedrisatı</div>
          </div>
          <div class="space-y-1">
            <div class="font-serif text-2xl font-bold text-navy-950">Halka Açık</div>
            <div class="text-xs text-slate-500 font-light">Haftalık İlmi Meclisler</div>
          </div>
          <div class="space-y-1">
            <div class="font-serif text-2xl font-bold text-navy-950">Vakıf Ahlakı</div>
            <div class="text-xs text-slate-500 font-light">Karşılıksız Hizmet ve Destek</div>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>
