<script setup lang="ts">
import {
  ArrowRight,
  Calendar,
  Sparkles,
  BookOpen,
  Users,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-vue-next'
import Container from '~/components/common/Container.vue'
import Button from '~/components/common/Button.vue'

const heroImage =
  'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=1200&q=80'
</script>

<template>
  <section class="relative overflow-hidden bg-gradient-to-b from-paper-200/70 via-paper-100 to-paper-100 pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-paper-300/80">
    <!-- Ambient Subtle Brand Glows (Gold + Forest Emerald) -->
    <div
      class="absolute top-0 left-1/3 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-gold-300/20 via-gold-200/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
      aria-hidden="true"
    />
    <div
      class="absolute top-1/4 right-0 w-[500px] h-[400px] bg-emerald-300/15 rounded-full blur-3xl pointer-events-none -z-10"
      aria-hidden="true"
    />

    <Container size="xl">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <!-- Left Column: Editorial Heading & Core Action (lg:col-span-7) -->
        <div class="lg:col-span-7 flex flex-col items-start text-left">
          <!-- Eyebrow Pill Badge -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-gold-300/80 text-obsidian-900 text-xs sm:text-sm font-semibold tracking-wide shadow-xs mb-5 select-none">
            <span class="flex h-2 w-2 rounded-full bg-gold-500 animate-pulse" />
            <Sparkles class="w-3.5 h-3.5 text-gold-600 shrink-0" />
            <span>Kadim Medrese Usûlü & Modern İrfan Meclisi</span>
          </div>

          <!-- Main Impact Heading -->
          <h1 class="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-obsidian-950 tracking-tight leading-[1.14] text-balance">
            İlim, irfan ve muhabbet yolunda
            <span class="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-emerald-900 via-emerald-800 to-amber-700">
              birlikte öğreniyoruz.
            </span>
          </h1>

          <!-- Decorative Accent Ribbon -->
          <div class="w-20 h-1 bg-gradient-to-r from-emerald-800 via-gold-500 to-emerald-800 rounded-full my-5 opacity-85" />

          <!-- Editorial Subtitle -->
          <p class="text-base sm:text-lg text-slate-700 font-light leading-relaxed max-w-2xl text-balance">
            İki Kelam; Ehl-i Sünnet ve’l-Cemaat akidesi ve klasik medrese tedrisatıyla talebe yetiştiren,
            düzenli ders halkaları ve ilmi neşriyatla kalplere dokunan samimi bir irfan meclisidir.
          </p>

          <!-- Dual CTAs (Mobile First, 44px+ touch targets) -->
          <div class="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
            <Button
              to="/faaliyetlerimiz"
              variant="primary"
              size="lg"
              :icon-right="ArrowRight"
              class="w-full sm:w-auto shadow-soft hover:shadow-emerald"
            >
              Derslerimizi Keşfet
            </Button>

            <Button
              to="/program"
              variant="outline"
              size="lg"
              :icon-left="Calendar"
              class="w-full sm:w-auto bg-white/60 hover:bg-white"
            >
              Haftalık Takvim
            </Button>

            <Button
              to="/iletisim"
              variant="ghost"
              size="lg"
              class="w-full sm:w-auto text-slate-600 hover:text-obsidian-950"
            >
              Bize Ulaşın
            </Button>
          </div>

          <!-- Quick Live Badges -->
          <div class="mt-8 pt-6 border-t border-paper-300/80 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Halka Açık Ücretsiz Meclisler</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-gold-500" />
              <span>Bornova / İzmir Medrese Merkezi</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Visual Container with Floating Information Cards (lg:col-span-5) -->
        <div class="lg:col-span-5 relative mt-4 lg:mt-0">
          <!-- Background Ambient Glow -->
          <div class="absolute inset-0 bg-gradient-to-tr from-gold-400/20 to-emerald-700/20 rounded-3xl blur-2xl -z-10 transform scale-95" />

          <!-- Main Image Frame Container -->
          <div class="relative rounded-3xl overflow-hidden border-2 border-gold-300/60 shadow-elevated bg-paper-200 aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/5] group">
            <img
              :src="heroImage"
              alt="İki Kelam Medrese İlim ve Sohbet Meclisi"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            >

            <!-- Subtle Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-obsidian-950/70 via-obsidian-950/20 to-transparent" />

            <!-- Bottom Title Badge inside Image -->
            <div class="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white z-10">
              <span class="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-gold-500 text-obsidian-950 mb-1.5 shadow-2xs">
                Asırların Geleneği
              </span>
              <p class="font-serif text-lg sm:text-xl font-bold leading-snug drop-shadow-sm">
                Fıkıh, Hadis ve Akaid Okumaları
              </p>
            </div>
          </div>

          <!-- Floating Info Card 1: Bu Haftanın Dersi (Top Right on desktop / Top-1/2 on mobile) -->
          <div class="absolute -top-4 -right-2 sm:-top-5 sm:-right-4 glass-card p-3.5 sm:p-4 rounded-2xl shadow-elevated max-w-[210px] sm:max-w-[240px] z-20 transition-transform duration-300 hover:-translate-y-1">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center shrink-0 border border-gold-200">
                <Calendar class="w-5 h-5 text-gold-600" />
              </div>
              <div>
                <span class="block text-[10px] font-bold uppercase tracking-wider text-gold-700">Bu Haftanın Dersi</span>
                <span class="block text-xs sm:text-sm font-bold text-obsidian-950 leading-tight mt-0.5">Cumartesi • 20:30</span>
                <span class="block text-[11px] text-slate-500 mt-0.5 line-clamp-1">Hadis & İlim Meclisi</span>
              </div>
            </div>
          </div>

          <!-- Floating Info Card 2: 100+ Talebe & Tedrisat (Bottom Left) -->
          <div class="absolute -bottom-4 -left-2 sm:-bottom-5 sm:-left-4 glass-card p-3.5 sm:p-4 rounded-2xl shadow-elevated max-w-[200px] sm:max-w-[230px] z-20 transition-transform duration-300 hover:-translate-y-1">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                <BookOpen class="w-5 h-5" />
              </div>
              <div>
                <span class="block text-xs sm:text-sm font-bold text-obsidian-950">Medrese Tedrisatı</span>
                <span class="block text-[11px] text-slate-500">Klasik Metin Mütalaası</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Feature Pillars Bar Below Hero -->
      <div class="mt-14 sm:mt-20 pt-10 border-t border-paper-300/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div class="p-4 sm:p-5 rounded-2xl bg-white/80 border border-paper-300/80 shadow-2xs hover:shadow-soft transition-all">
          <div class="w-8 h-8 rounded-lg bg-gold-50 text-gold-600 flex items-center justify-center mb-3">
            <ShieldCheck class="w-4.5 h-4.5" />
          </div>
          <div class="font-serif text-lg font-bold text-obsidian-950">Ehl-i Sünnet</div>
          <div class="text-xs text-slate-500 font-light mt-1">Sahih Akide ve İtikat İstikameti</div>
        </div>

        <div class="p-4 sm:p-5 rounded-2xl bg-white/80 border border-paper-300/80 shadow-2xs hover:shadow-soft transition-all">
          <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
            <BookOpen class="w-4.5 h-4.5" />
          </div>
          <div class="font-serif text-lg font-bold text-obsidian-950">Medrese Usûlü</div>
          <div class="text-xs text-slate-500 font-light mt-1">Metin Merkezli Klasik Tedrisat</div>
        </div>

        <div class="p-4 sm:p-5 rounded-2xl bg-white/80 border border-paper-300/80 shadow-2xs hover:shadow-soft transition-all">
          <div class="w-8 h-8 rounded-lg bg-gold-50 text-gold-600 flex items-center justify-center mb-3">
            <Users class="w-4.5 h-4.5" />
          </div>
          <div class="font-serif text-lg font-bold text-obsidian-950">Halka Açık</div>
          <div class="text-xs text-slate-500 font-light mt-1">Haftalık İlmi ve Manevi Sohbetler</div>
        </div>

        <div class="p-4 sm:p-5 rounded-2xl bg-white/80 border border-paper-300/80 shadow-2xs hover:shadow-soft transition-all">
          <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
            <HeartHandshake class="w-4.5 h-4.5" />
          </div>
          <div class="font-serif text-lg font-bold text-obsidian-950">Vakıf Ahlakı</div>
          <div class="text-xs text-slate-500 font-light mt-1">Talebe İaşesi ve Karşılıksız Destek</div>
        </div>
      </div>
    </Container>
  </section>
</template>
