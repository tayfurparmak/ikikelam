<script setup lang="ts">
import Container from '~/components/common/Container.vue'
import SectionTitle from '~/components/common/SectionTitle.vue'

const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl || 'https://ikikelam.org.tr').replace(/\/+$/, '')

useSeoMeta({
  title: 'Hakkımızda & Gayemiz — İki Kelam',
  description: 'İki Kelam İlim ve Kültür Derneği vizyonu, gayesi ve asırlık medrese geleneğimiz.',
  ogTitle: 'Hakkımızda & Gayemiz — İki Kelam',
  ogDescription: 'İki Kelam İlim ve Kültür Derneği vizyonu, gayesi ve asırlık medrese geleneğimiz.',
  ogType: 'website',
  ogUrl: `${siteUrl}/hakkimizda`,
  ogImage: `${siteUrl}/logo.svg`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Hakkımızda & Gayemiz — İki Kelam',
  twitterDescription: 'İki Kelam İlim ve Kültür Derneği vizyonu, gayesi ve asırlık medrese geleneğimiz.',
  twitterImage: `${siteUrl}/logo.svg`,
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/hakkimizda` }],
})
</script>

<template>
  <div class="py-16 sm:py-20">
    <Container size="lg">
      <SectionTitle
        badge="Kurumsal"
        title="Hakkımızda & Gayemiz"
        subtitle="Kökleri asırlara uzanan medrese ve ilim geleneğini muhafaza etmek, ihya etmek ve günümüz insanının manevi ve fikri ihtiyaçlarına cevap vermek için buradayız."
        align="center"
      />

      <div class="mt-12 space-y-8 text-slate-700 leading-relaxed font-light text-base sm:text-lg">
        <p class="text-navy-950 font-normal text-xl leading-relaxed text-balance">
          <strong>İki Kelam İlim ve Kültür Derneği</strong>, sahih İslam mirasının temel taşları olan tefsir, hadis, fıkıh ve akaid ilimlerini medrese metodolojisiyle yeni nesillere aktarmayı şiar edinmiştir.
        </p>

        <p>
          Gayemiz; sağlam bir itikat, derinlikli bir fıkıh şuuru ve samimi bir ihlâs ile bezenmiş ilim talebeleri yetiştirmek, ilmin izzetini koruyarak toplumun her kesimine hayırlı hizmetler ulaştırmaktır.
        </p>

        <!-- Temel İlkeler Kartı -->
        <div class="p-8 bg-cream-100 rounded-2xl border border-cream-300/80 shadow-sm mt-8">
          <h3 class="font-serif text-2xl font-bold text-navy-950 mb-4">
            Temel İlkelerimiz
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
            <div class="flex items-start gap-3">
              <span class="w-2 h-2 rounded-full bg-emerald-700 shrink-0 mt-2" />
              <span><strong>Sahih İlim:</strong> Ehl-i Sünnet ve’l-Cemaat çizgisine sadakat</span>
            </div>
            <div class="flex items-start gap-3">
              <span class="w-2 h-2 rounded-full bg-emerald-700 shrink-0 mt-2" />
              <span><strong>Metin Merkezli Tedrisat:</strong> Klasik medrese usûlü ve şerh okumaları</span>
            </div>
            <div class="flex items-start gap-3">
              <span class="w-2 h-2 rounded-full bg-emerald-700 shrink-0 mt-2" />
              <span><strong>İrfani Ahlak:</strong> İlim ile ameli, edep ile fikri meczeden terbiye</span>
            </div>
            <div class="flex items-start gap-3">
              <span class="w-2 h-2 rounded-full bg-emerald-700 shrink-0 mt-2" />
              <span><strong>Şeffaf Hizmet:</strong> Güvenilir, samimi ve karşılıksız vakıf kültürü</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>
