<script setup lang="ts">
import { ref } from 'vue'
import GalleryCard from '~/components/gallery/GalleryCard.vue'
import GalleryModal from '~/components/gallery/GalleryModal.vue'
import type { GalleryItem } from '~/components/gallery/GalleryModal.vue'

const props = withDefaults(
  defineProps<{
    items: GalleryItem[]
    categoryLabels?: Record<string, string>
    loading?: boolean
  }>(),
  {
    categoryLabels: () => ({}),
    loading: false,
  }
)

const isModalOpen = ref(false)
const selectedIndex = ref(0)

function openModal(index: number) {
  selectedIndex.value = index
  isModalOpen.value = true
}

function getCategoryName(categoryKey: string) {
  return props.categoryLabels[categoryKey] || categoryKey
}
</script>

<template>
  <div>
    <!-- Loading Skeletons -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="i in 6"
        :key="i"
        class="aspect-[4/3] rounded-2xl bg-cream-100 border border-cream-200 animate-pulse"
      />
    </div>

    <!-- Gallery Grid -->
    <div v-else-if="items.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      <GalleryCard
        v-for="(item, idx) in items"
        :key="item.id"
        :item="item"
        :category-name="getCategoryName(item.category)"
        @click="openModal(idx)"
      />
    </div>

    <!-- Lightbox Modal -->
    <GalleryModal
      v-model="isModalOpen"
      :images="items"
      :initial-index="selectedIndex"
      :category-labels="categoryLabels"
      @close="isModalOpen = false"
    />
  </div>
</template>
