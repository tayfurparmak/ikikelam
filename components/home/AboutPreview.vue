<script setup lang="ts">
import { ArrowRight, ShieldCheck, HeartHandshake, Compass } from 'lucide-vue-next'
import Container from '~/components/common/Container.vue'
import SectionTitle from '~/components/common/SectionTitle.vue'
import Button from '~/components/common/Button.vue'

const values = [
  {
    icon: Compass,
    title: 'Sahih İstikamet',
    description: 'Ehl-i Sünnet ve’l-Cemaat akidesi ve ulemanın tevarüs ettiği kadim usûl üzere sağlam bir ilmi temel.',
  },
  {
    icon: ShieldCheck,
    title: 'Metin Merkezli Tedrisat',
    description: 'Fıkıh, usûl, tefsir, hadis ve alet ilimlerinde klasik şerh ve haşiyelerin satır satır mütalaası.',
  },
  {
    icon: HeartHandshake,
    title: 'İrfan ve Kardeşlik',
    description: 'İlmi kuru bir malumattan ibaret görmeyip edep, tevazu, ihlas ve kardeşlik şuuruyla yoğuran terbiye.',
  },
]
</script>

<template>
  <section class="py-16 sm:py-24 bg-white border-b border-cream-200">
    <Container size="xl">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <!-- Left: Text & Pitch (lg:col-span-6) -->
        <div class="lg:col-span-6 space-y-6">
          <SectionTitle
            badge="Biz Kimiz?"
            title="Asırların Mirasını İhlasla Geleceğe Taşıyoruz"
            subtitle="İki Kelam, ilmin izzetini muhafaza ederek medrese geleneğini bugünün ihtiyaçlarıyla buluşturan bir ilim ve kültür hareketidir."
            align="left"
          />

          <p class="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
            İstanbul Fatih'in manevi atmosferinde kurulan derneğimiz; ilim talebelerine burs ve barınma desteği sağlamaktan
            düzenli ders halkalarına, neşriyat faaliyetlerinden hayri hizmetlere kadar geniş bir yelpazede hizmet vermektedir.
          </p>

          <div class="pt-2">
            <Button
              to="/hakkimizda"
              variant="outline"
              size="md"
              :icon-right="ArrowRight"
            >
              Vakfımız & Gayemiz Hakkında Detaylı Bilgi
            </Button>
          </div>
        </div>

        <!-- Right: 3 Value Pillars (lg:col-span-6) -->
        <div class="lg:col-span-6 space-y-4">
          <div
            v-for="val in values"
            :key="val.title"
            class="p-6 rounded-2xl bg-cream-50/80 border border-cream-200/90 shadow-xs hover:shadow-sm hover:border-emerald-700/40 transition-all flex items-start gap-4"
          >
            <div class="w-12 h-12 rounded-xl bg-emerald-800 text-gold-400 flex items-center justify-center shrink-0 shadow-xs">
              <component :is="val.icon" class="w-6 h-6" />
            </div>

            <div class="space-y-1">
              <h4 class="font-serif text-lg font-bold text-navy-950">
                {{ val.title }}
              </h4>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                {{ val.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>
