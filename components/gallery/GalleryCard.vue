<script setup lang="ts">
import { ZoomIn, Tag } from 'lucide-vue-next'
import type { GalleryItem } from '~/components/gallery/GalleryModal.vue'

const props = defineProps<{
  item: GalleryItem
  categoryName?: string
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

// Generate responsive thumbnail URL if using Unsplash
const thumbnailUrl = computed(() => {
  if (props.item.imageUrl.includes('unsplash.com')) {
    // Return optimized thumbnail size
    return props.item.imageUrl.replace(/w=\d+/, 'w=700').replace(/q=\d+/, 'q=75')
  }
  return props.item.imageUrl
})
</script>

<template>
  <div
    class="group relative overflow-hidden rounded-2xl bg-cream-100 border border-cream-200/90 shadow-xs hover:shadow-xl hover:border-emerald-700/40 transition-all duration-300 cursor-pointer flex flex-col focus-within:ring-2 focus-within:ring-emerald-600"
    role="button"
    tabindex="0"
    :aria-label="`Görseli Büyüt: ${item.title}`"
    @click="emit('click')"
    @keydown.enter="emit('click')"
    @keydown.space.prevent="emit('click')"
  >
    <!-- Image with Smooth Zoom -->
    <div class="relative overflow-hidden aspect-[4/3] bg-stone-100">
      <img
        :src="thumbnailUrl"
        :alt="item.altText || item.title"
        loading="lazy"
        decoding="async"
        class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
      >

      <!-- Category Badge -->
      <div
        v-if="categoryName"
        class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-navy-950/80 text-emerald-200 backdrop-blur-sm border border-white/10 shadow-xs flex items-center gap-1 z-10"
      >
        <Tag class="w-3 h-3 text-emerald-400" />
        <span>{{ categoryName }}</span>
      </div>

      <!-- Hover Overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5"
        aria-hidden="true"
      >
        <div class="flex items-center justify-between text-white">
          <p class="font-serif font-bold text-base line-clamp-2 drop-shadow-sm leading-snug">
            {{ item.title }}
          </p>

          <span class="p-2 rounded-xl bg-white/20 text-white backdrop-blur-sm shrink-0 ml-3 shadow-xs">
            <ZoomIn class="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>

    <!-- Mobile Always-Visible Caption -->
    <div class="p-3.5 bg-white border-t border-cream-200/60 block sm:hidden">
      <p class="font-serif font-semibold text-xs text-navy-950 truncate">
        {{ item.title }}
      </p>
    </div>
  </div>
</template>
