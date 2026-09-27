<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import Container from '~/components/common/Container.vue'
import SectionTitle from '~/components/common/SectionTitle.vue'
import Button from '~/components/common/Button.vue'
import PostCard, { type PostItem } from '~/components/home/PostCard.vue'

const { data: response, status } = await useFetch<{
  success: boolean
  data: PostItem[]
}>('/api/posts', {
  params: {
    limit: 3,
    status: 'PUBLISHED',
  },
  lazy: true,
})

const isLoading = computed(() => status.value === 'pending')
const posts = computed(() => response.value?.data || [])
</script>

<template>
  <section class="py-16 sm:py-24 bg-white border-b border-paper-300/80 select-none">
    <Container size="xl">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <SectionTitle
          badge="İlmi Neşriyat"
          badge-variant="gold"
          title="Son Makaleler & Yazılar"
          subtitle="Medresemiz hocaları ve ilim ehlinin fıkıh, akaid ve maneviyat üzerine kaleme aldığı metinler."
          align="left"
        />

        <div class="shrink-0">
          <Button
            to="/faaliyetlerimiz"
            variant="outline"
            size="md"
            :icon-right="ArrowRight"
            class="bg-paper-100 hover:bg-paper-200 border-paper-300 text-obsidian-900"
          >
            Tüm Yazıları İncele
          </Button>
        </div>
      </div>

      <!-- Loading State (Skeleton) -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="i in 3"
          :key="i"
          class="rounded-3xl bg-paper-100 border border-paper-300 overflow-hidden animate-pulse shadow-soft"
        >
          <div class="aspect-[16/10] bg-slate-200" />
          <div class="p-6 space-y-3">
            <div class="h-4 bg-slate-200 rounded w-1/4" />
            <div class="h-6 bg-slate-200 rounded w-3/4" />
            <div class="h-4 bg-slate-200 rounded w-full" />
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div v-else-if="posts.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 px-4 rounded-3xl bg-paper-100 border border-paper-300 text-slate-500 text-sm shadow-soft">
        Henüz yayınlanmış ilmi makale bulunamadı.
      </div>
    </Container>
  </section>
</template>
