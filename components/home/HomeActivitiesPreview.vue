<script setup lang="ts">
import { BookOpen, Users, Heart, Mic, ArrowRight } from 'lucide-vue-next'
import Container from '~/components/common/Container.vue'
import SectionTitle from '~/components/common/SectionTitle.vue'
import Button from '~/components/common/Button.vue'

const activities = [
  {
    title: 'Klasik Medrese Tedrisatı',
    slug: 'genclik-dersleri',
    description: 'Sarf, nahiv, mantık, fıkıh ve akaid metinleri üzerinden klasik usûlle tam teşekküllü ilim talebesi yetiştirme programı.',
    icon: BookOpen,
    badge: 'İlim Tedrisatı',
    image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Çocuk Kur\'an Kursları',
    slug: 'cocuk-kuran-kurslari',
    description: 'Geleceğimizin teminatı yavrularımız için tecvidli Kur\'an-ı Kerim eğitimi, temel dini bilgiler ve ahlak atölyeleri.',
    icon: Heart,
    badge: 'Temel Eğitim',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Gençlik Meclisleri & Tahlil',
    slug: 'genclik-dersleri',
    description: 'Üniversite ve lise gençliğine yönelik çağın şüphelerine karşı ilmi tahliller, kitap okumaları ve kardeşlik kampları.',
    icon: Users,
    badge: 'Gençlik',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Haftalık Umumi Sohbetler',
    slug: 'haftalik-sohbetler',
    description: 'Her hafta cumartesi ve pazar günleri icra edilen, kalpleri ihya ve zihinleri inşa eden umuma açık irfani sohbet halkaları.',
    icon: Mic,
    badge: 'Umuma Açık',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
  },
]
</script>

<template>
  <section class="py-16 sm:py-24 bg-white border-b border-paper-300/80">
    <Container size="xl">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <SectionTitle
          badge="Hizmetlerimiz"
          badge-variant="gold"
          title="Medrese Faaliyetlerimiz"
          subtitle="Toplumun her kesimine hitap eden ilmi, ahlaki ve manevi eğitim faaliyetlerimiz."
          align="left"
        />

        <div class="shrink-0">
          <Button
            to="/activities"
            variant="outline"
            size="md"
            :icon-right="ArrowRight"
            class="bg-paper-100 hover:bg-paper-200 border-paper-300 text-obsidian-900"
          >
            Tüm Faaliyetleri Gör
          </Button>
        </div>
      </div>

      <!-- Activities Grid (4 modern cards) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NuxtLink
          v-for="act in activities"
          :key="act.title"
          :to="`/activities/${act.slug}`"
          class="flex flex-col rounded-3xl bg-paper-100/70 border border-paper-300 shadow-soft hover:shadow-card-hover hover:border-gold-300/80 transition-all duration-300 overflow-hidden group hover:-translate-y-1.5"
        >
          <!-- Card Image Header -->
          <div class="relative aspect-[16/10] overflow-hidden bg-paper-200">
            <img
              :src="act.image"
              :alt="act.title"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-obsidian-950/70 via-transparent to-transparent" />

            <!-- Category Pill -->
            <span class="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-obsidian-950/80 text-gold-300 border border-white/10 backdrop-blur-sm shadow-xs select-none">
              {{ act.badge }}
            </span>

            <!-- Corner Icon -->
            <div class="absolute bottom-3.5 right-3.5 w-9 h-9 rounded-xl bg-white/90 text-obsidian-950 flex items-center justify-center shadow-soft group-hover:bg-gold-400 group-hover:text-obsidian-950 transition-colors">
              <component :is="act.icon" class="w-4.5 h-4.5" />
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-6 flex-1 flex flex-col justify-between space-y-3">
            <div class="space-y-2">
              <h3 class="font-serif text-lg sm:text-xl font-bold text-obsidian-950 group-hover:text-amber-800 transition-colors">
                {{ act.title }}
              </h3>
              <p class="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed font-light">
                {{ act.description }}
              </p>
            </div>

            <!-- Action footer -->
            <div class="pt-3 border-t border-paper-200 flex items-center justify-between text-xs font-bold text-obsidian-900 group-hover:text-gold-700 transition-colors">
              <span>Detayları İncele</span>
              <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </Container>
  </section>
</template>
