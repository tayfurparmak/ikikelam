<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight, Compass, Heart, BookOpen } from 'lucide-vue-next'
import Container from '~/components/common/Container.vue'
import SectionTitle from '~/components/common/SectionTitle.vue'
import Button from '~/components/common/Button.vue'

interface AboutPagePreview {
  title?: string
  subtitle?: string
  intro?: string
  buttonText?: string
  buttonUrl?: string
  isActive?: boolean
}

interface AboutValueItem {
  id?: string
  title: string
  description: string
  icon?: string
}

// Fetch dynamic about data
const { data: aboutRes } = await useFetch<{
  success: boolean
  data: {
    page: AboutPagePreview
    values: AboutValueItem[]
  }
}>('/api/about')

const page = computed(() => aboutRes.value?.data?.page || {})
const values = computed(() => {
  const list = aboutRes.value?.data?.values || []
  if (list.length > 0) {
    return list.slice(0, 3)
  }
  return [
    {
      title: 'Sahih İstikamet',
      description: 'Ehl-i Sünnet ve’l-Cemaat akidesi ve ulemanın tevarüs ettiği kadim usûl üzere sağlam bir ilmi temel.',
    },
    {
      title: 'Metin Merkezli Tedrisat',
      description: 'Fıkıh, usûl, tefsir, hadis ve alet ilimlerinde klasik şerh ve haşiyelerin satır satır mütalaası.',
    },
    {
      title: 'İrfan ve Kardeşlik',
      description: 'İlmi kuru bir malumattan ibaret görmeyip edep, tevazu, ihlas ve kardeşlik şuuruyla yoğuran terbiye.',
    },
  ]
})

function getIconForIndex(idx: number) {
  if (idx === 0) return Compass
  if (idx === 1) return BookOpen
  return Heart
}
</script>

<template>
  <section v-if="page.isActive !== false" class="py-16 sm:py-24 bg-white border-b border-cream-200">
    <Container size="xl">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <!-- Left: Text & Pitch (lg:col-span-6) -->
        <div class="lg:col-span-6 space-y-6">
          <SectionTitle
            badge="Biz Kimiz?"
            :title="page.title ? `${page.title}` : 'Asırların Mirasını İhlasla Geleceğe Taşıyoruz'"
            :subtitle="page.subtitle || 'İki Kelam, ilmin izzetini muhafaza ederek medrese geleneğini bugünün ihtiyaçlarıyla buluşturan bir ilim ve kültür hareketidir.'"
            align="left"
          />

          <p class="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
            {{ page.intro || "İstanbul Fatih'in manevi atmosferinde kurulan derneğimiz; ilim talebelerine burs ve barınma desteği sağlamaktan düzenli ders halkalarına, neşriyat faaliyetlerinden hayri hizmetlere kadar geniş bir yelpazede hizmet vermektedir." }}
          </p>

          <div class="pt-2">
            <Button
              to="/biz-kimiz"
              variant="outline"
              size="md"
              :icon-right="ArrowRight"
            >
              {{ page.buttonText || 'Daha Fazla Bilgi' }}
            </Button>
          </div>
        </div>

        <!-- Right: 3 Value Pillars (lg:col-span-6) -->
        <div class="lg:col-span-6 space-y-4">
          <div
            v-for="(val, idx) in values"
            :key="val.title"
            class="p-6 rounded-2xl bg-cream-50/80 border border-cream-200/90 shadow-xs hover:shadow-sm hover:border-emerald-700/40 transition-all flex items-start gap-4"
          >
            <div class="w-12 h-12 rounded-xl bg-emerald-800 text-gold-400 flex items-center justify-center shrink-0 shadow-xs">
              <component :is="getIconForIndex(idx)" class="w-6 h-6" />
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
