<script setup lang="ts">
import HeroSection from '~/components/home/HeroSection.vue'
import AboutPreview from '~/components/home/AboutPreview.vue'
import HomeActivitiesPreview from '~/components/home/HomeActivitiesPreview.vue'
import WeeklySchedulePreview from '~/components/home/WeeklySchedulePreview.vue'
import QuoteOfTheDay from '~/components/home/QuoteOfTheDay.vue'
import HomeVideoSection from '~/components/home/HomeVideoSection.vue'
import LatestPosts from '~/components/home/LatestPosts.vue'
import HomeGalleryPreview from '~/components/home/HomeGalleryPreview.vue'
import DonationHighlight from '~/components/home/DonationHighlight.vue'
import SocialCTASection from '~/components/home/SocialCTASection.vue'
import CTASection from '~/components/home/CTASection.vue'
import { useSiteSettings } from '~/composables/useSiteSettings'

const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl || 'https://ikikelam.org.tr').replace(/\/+$/, '')
const { settings } = useSiteSettings()

useSeoMeta({
  title: 'İki Kelam — İlim, İrfan ve Kardeşlik Yolunda',
  description:
    'İki Kelam İlim ve Kültür Derneği: Sahih itikat, klasik medrese tedrisatı ve ihlaslı kardeşlik meclisleriyle ilim yolculuğuna davet ediyor.',
  ogTitle: 'İki Kelam — İlim, İrfan ve Kardeşlik Yolunda',
  ogDescription:
    'Sahih itikat, klasik medrese tedrisatı, haftalık ders halkaları ve talebe destek programlarıyla İki Kelam İlim ve Kültür Derneği resmi web platformu.',
  ogType: 'website',
  ogUrl: `${siteUrl}/`,
  ogImage: `${siteUrl}/logo.svg`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'İki Kelam — İlim, İrfan ve Kardeşlik Yolunda',
  twitterDescription:
    'Klasik medrese usûlüyle ilim talebesi yetiştiren ve ilmi neşriyat yapan İki Kelam Derneği resmi sitesi.',
  twitterImage: `${siteUrl}/logo.svg`,
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/` }],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => {
        const graph: Record<string, unknown>[] = [
          {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'İki Kelam İlim ve Kültür Derneği',
            url: `${siteUrl}/`,
            logo: `${siteUrl}/logo.svg`,
            description:
              'Kadim medrese usûlüyle fıkıh, kelam, hadis okumaları ve ilim talebeleri yetiştiren irfan yuvası.',
            sameAs: [
              settings.value.youtubeUrl || 'https://www.youtube.com/@ikikelamresmi',
              settings.value.instagramUrl || 'https://instagram.com/ikikelamresmi',
            ],
          },
          {
            '@type': 'WebSite',
            '@id': `${siteUrl}/#website`,
            url: `${siteUrl}/`,
            name: 'İki Kelam',
            publisher: { '@id': `${siteUrl}/#organization` },
          },
        ]

        if (settings.value.featuredYoutubeVideoId) {
          graph.push({
            '@type': 'VideoObject',
            name: settings.value.featuredYoutubeTitle || "Kur'an'da Heisenberg Belirsizlik İlkesi",
            description: settings.value.featuredYoutubeDescription || 'İki Kelam resmi YouTube kanalından ilmi sohbet kaydı.',
            thumbnailUrl: [
              `https://img.youtube.com/vi/${settings.value.featuredYoutubeVideoId}/maxresdefault.jpg`,
              `https://img.youtube.com/vi/${settings.value.featuredYoutubeVideoId}/hqdefault.jpg`,
            ],
            uploadDate: '2024-01-01T00:00:00+03:00',
            embedUrl: `https://www.youtube.com/embed/${settings.value.featuredYoutubeVideoId}`,
          })
        }

        return JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': graph,
        })
      }),
    },
  ],
})
</script>

<template>
  <main class="min-h-screen bg-paper-100">
    <!-- 1. Hero Bölümü -->
    <HeroSection />

    <!-- 2. Biz Kimiz? (Hakkımızda & Değerler Özeti) -->
    <AboutPreview />

    <!-- 3. Medrese Faaliyetlerimiz & Hizmetler -->
    <HomeActivitiesPreview />

    <!-- 4. Haftalık Program & Ders Meclisleri (Database Bağlantılı) -->
    <WeeklySchedulePreview />

    <!-- 5. Âyet / Hadîs / Kelâm-ı Kibâr Hikmet Köşesi -->
    <QuoteOfTheDay />

    <!-- 6. Seçilmiş YouTube Videosu (Database Bağlantılı & Facade Player) -->
    <HomeVideoSection />

    <!-- 7. Son Faaliyetler & Makaleler (Database Bağlantılı) -->
    <LatestPosts />

    <!-- 8. Medrese Hayatı & Galeri Önizleme -->
    <HomeGalleryPreview />

    <!-- 9. Hayır ve Bağış (IBAN ve Destek Alanı) -->
    <DonationHighlight />

    <!-- 10. Sosyal Medya Eylem Çağrısı (YouTube & Instagram) -->
    <SocialCTASection
      :youtube-url="settings.youtubeUrl || 'https://www.youtube.com/@ikikelamresmi'"
      :instagram-url="settings.instagramUrl || 'https://instagram.com/ikikelamresmi'"
    />

    <!-- 11. Nihai Eylem Çağrısı (CTA) -->
    <CTASection />
  </main>
</template>
