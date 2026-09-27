<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Images, Compass, Layers } from 'lucide-vue-next'
import Container from '~/components/common/Container.vue'
import SectionTitle from '~/components/common/SectionTitle.vue'
import GalleryGrid from '~/components/gallery/GalleryGrid.vue'
import type { GalleryItem } from '~/components/gallery/GalleryModal.vue'

interface GalleryApiResponse {
  success: boolean
  data: GalleryItem[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

const route = useRoute()
const router = useRouter()

// Filter categories
const galleryCategories = [
  { key: '', label: 'Tümü' },
  { key: 'MEDRESE_LIFE', label: 'Haftalık Sohbetler' },
  { key: 'CLASSES', label: 'Çocuk Dersleri' },
  { key: 'EVENTS', label: 'Etkinlikler' },
]

const categoryLabels: Record<string, string> = {
  MEDRESE_LIFE: 'Haftalık Sohbetler',
  CLASSES: 'Çocuk Dersleri',
  EVENTS: 'Etkinlikler',
  LIBRARY: 'Kütüphane',
  HISTORICAL: 'Tarihi Eserler',
  GENERAL: 'Genel',
}

const selectedCategory = ref<string>((route.query.category as string) || '')

// Fetch from API
const { data: response, status } = await useFetch<GalleryApiResponse>('/api/gallery', {
  params: computed(() => ({
    limit: 60,
    category: selectedCategory.value || undefined,
  })),
  watch: [selectedCategory],
})

const isLoading = computed(() => status.value === 'pending')
const images = computed(() => response.value?.data || [])

function selectCategory(key: string) {
  selectedCategory.value = key
  router.push({
    query: {
      ...(key ? { category: key } : {}),
    },
  })
}

watch(
  () => route.query.category,
  (newCat) => {
    selectedCategory.value = (newCat as string) || ''
  }
)

const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl || 'https://ikikelam.org.tr').replace(/\/+$/, '')

useSeoMeta({
  title: 'Fotoğraf Galerisi — İki Kelam',
  description:
    'İki Kelam Derneği medrese meclisleri, çocuk dersleri, gençlik faaliyetleri ve hayri hizmetlerinden seçkin fotoğraf kareleri.',
  ogTitle: 'Fotoğraf Galerisi — İki Kelam',
  ogDescription:
    'Medresemizden, ders meclislerimizden ve talebelerimizin ilim yolculuğundan fotoğraf kareleri.',
  ogType: 'website',
  ogUrl: `${siteUrl}/gallery`,
  ogImage: `${siteUrl}/logo.svg`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Fotoğraf Galerisi — İki Kelam',
  twitterDescription:
    'Medresemizden, ders meclislerimizden ve talebelerimizin ilim yolculuğundan fotoğraf kareleri.',
  twitterImage: `${siteUrl}/logo.svg`,
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/gallery` }],
})
</script>

<template>
  <div class="min-h-screen bg-warm-white py-12 sm:py-20">
    <Container size="xl">
      <!-- Header -->
      <div class="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <SectionTitle
          badge="Görsel Hafıza"
          title="Fotoğraf Galerisi"
          subtitle="Medresemizden, haftalık sohbet meclislerimizden, çocuk derslerimizden ve ilmi faaliyetlerimizden kareler."
          align="center"
        />

        <!-- Category Filter Pills -->
        <div class="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mt-8">
          <button
            v-for="cat in galleryCategories"
            :key="cat.key"
            type="button"
            :class="[
              'inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/40',
              selectedCategory === cat.key
                ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-cream-100 hover:text-emerald-900'
            ]"
            @click="selectCategory(cat.key)"
          >
            <Layers v-if="cat.key === ''" class="w-4 h-4" />
            <Images v-else class="w-4 h-4" />
            <span>{{ cat.label }}</span>
          </button>
        </div>
      </div>

      <!-- Gallery Grid & Lightbox -->
      <GalleryGrid
        v-if="isLoading || images.length > 0"
        :items="images"
        :category-labels="categoryLabels"
        :loading="isLoading"
      />

      <!-- Empty State -->
      <div v-else class="text-center py-20 px-4 rounded-3xl bg-white border border-stone-200/80 shadow-xs max-w-lg mx-auto">
        <div class="w-16 h-16 rounded-2xl bg-cream-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 border border-cream-200">
          <Compass class="w-8 h-8 text-emerald-700" />
        </div>
        <h3 class="font-serif text-2xl font-bold text-navy-950 mb-2">
          Görsel Bulunamadı
        </h3>
        <p class="text-stone-500 text-sm max-w-sm mx-auto mb-6 font-light">
          Seçtiğiniz kategoride henüz fotoğraf bulunmamaktadır.
        </p>
        <button
          type="button"
          class="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-medium text-xs hover:bg-emerald-900 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700"
          @click="selectCategory('')"
        >
          Tüm Fotoğrafları Görüntüle
        </button>
      </div>
    </Container>
  </div>
</template>
