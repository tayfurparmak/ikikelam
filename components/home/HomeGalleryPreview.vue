<script setup lang="ts">
import { ArrowRight, Image as ImageIcon } from 'lucide-vue-next'
import Container from '~/components/common/Container.vue'
import SectionTitle from '~/components/common/SectionTitle.vue'
import Button from '~/components/common/Button.vue'

interface GalleryItem {
  id: string
  url: string
  title?: string | null
  altText?: string | null
  category: string
}

const { data: response, status } = await useFetch<{
  success: boolean
  data: GalleryItem[]
}>('/api/gallery', {
  params: {
    limit: 6,
  },
  lazy: true,
})

const isLoading = computed(() => status.value === 'pending')

const fallbackImages: GalleryItem[] = [
  {
    id: 'f1',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    title: 'Medrese Kütüphanesi & Tedrisat',
    category: 'MEDRESE_LIFE',
  },
  {
    id: 'f2',
    url: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=800&q=80',
    title: 'Haftalık Hadis Okumaları',
    category: 'CLASSES',
  },
  {
    id: 'f3',
    url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80',
    title: 'Arapça & Fıkıh Metin Mütalaası',
    category: 'CLASSES',
  },
  {
    id: 'f4',
    url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
    title: 'Gençlik İrfan Meclisi',
    category: 'EVENTS',
  },
  {
    id: 'f5',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    title: 'Çocuk Kur\'an Kursu & Atölye',
    category: 'CLASSES',
  },
  {
    id: 'f6',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    title: 'Kardeşlik ve Sohbet Halkası',
    category: 'EVENTS',
  },
]

const galleryItems = computed(() => {
  const list = response.value?.data || []
  return list.length > 0 ? list.slice(0, 6) : fallbackImages
})
</script>

<template>
  <section class="py-16 sm:py-24 bg-paper-100/60 border-b border-paper-300/80 select-none">
    <Container size="xl">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <SectionTitle
          badge="Medrese Hayatı"
          badge-variant="gold"
          title="Fotoğraflarla İki Kelam"
          subtitle="Medresemizden ders kareleri, etkinlikler ve manevi atmosferden enstantaneler."
          align="left"
        />

        <div class="shrink-0">
          <Button
            to="/gallery"
            variant="outline"
            size="md"
            :icon-right="ArrowRight"
            class="bg-white/80 hover:bg-white border-paper-300 text-obsidian-900"
          >
            Tüm Fotoğrafları Gör
          </Button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          v-for="i in 6"
          :key="i"
          class="aspect-square rounded-3xl bg-paper-200 animate-pulse border border-paper-300"
        />
      </div>

      <!-- Gallery Grid (6 rounded cards) -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
        <NuxtLink
          v-for="item in galleryItems"
          :key="item.id"
          to="/gallery"
          class="group relative aspect-square rounded-3xl overflow-hidden bg-paper-200 border border-paper-300 shadow-soft hover:shadow-card-hover transition-all duration-300 block"
        >
          <img
            :src="item.url"
            :alt="item.title || item.altText || 'İki Kelam Medrese Fotoğrafı'"
            loading="lazy"
            decoding="async"
            class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
            <span class="text-xs font-serif font-bold line-clamp-2 leading-tight">
              {{ item.title || 'Medrese Sohbeti' }}
            </span>
          </div>
          <div class="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-obsidian-950/60 backdrop-blur-sm text-gold-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ImageIcon class="w-3.5 h-3.5" />
          </div>
        </NuxtLink>
      </div>
    </Container>
  </section>
</template>
