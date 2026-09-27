<script setup lang="ts">
import { Calendar, ArrowRight, Folder } from 'lucide-vue-next'

export interface PostItem {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  coverImage?: string | null
  publishedAt?: string | Date | null
  createdAt: string | Date
  category?: {
    id: string
    name: string
    slug: string
  } | null
}

const props = withDefaults(
  defineProps<{
    post: PostItem
    showCategory?: boolean
    compact?: boolean
  }>(),
  {
    showCategory: true,
    compact: false,
  }
)

const postUrl = computed(() => {
  const catSlug = props.post.category?.slug || 'genel'
  return `/activities/${catSlug}/${props.post.slug}`
})

function formatDate(val?: string | Date | null) {
  if (!val) return ''
  try {
    return new Date(val).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

const fallbackImage =
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
</script>

<template>
  <article
    class="flex flex-col rounded-2xl bg-white border border-cream-200/90 shadow-xs hover:shadow-lg hover:border-emerald-700/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden group h-full"
  >
    <!-- Cover Image with Link -->
    <NuxtLink :to="postUrl" class="relative block overflow-hidden bg-cream-100" :class="compact ? 'aspect-[16/9]' : 'aspect-[16/10]'">
      <img
        :src="post.coverImage || fallbackImage"
        :alt="post.title"
        loading="lazy"
        decoding="async"
        class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      >
      <!-- Category Badge -->
      <NuxtLink
        v-if="showCategory && post.category?.name"
        :to="`/activities/${post.category.slug}`"
        class="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-xs font-semibold bg-navy-950/85 hover:bg-emerald-800 text-white backdrop-blur-sm shadow-xs transition-colors z-10"
        @click.stop
      >
        {{ post.category.name }}
      </NuxtLink>
    </NuxtLink>

    <!-- Content Body -->
    <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
      <div class="space-y-2.5">
        <!-- Date & Meta -->
        <div class="flex items-center gap-3 text-xs text-slate-500 font-light">
          <div class="flex items-center gap-1.5">
            <Calendar class="w-3.5 h-3.5 text-emerald-800" />
            <time :datetime="String(post.publishedAt || post.createdAt)">
              {{ formatDate(post.publishedAt || post.createdAt) }}
            </time>
          </div>

          <span v-if="post.category?.name && !showCategory" class="text-slate-300">•</span>

          <span v-if="post.category?.name && !showCategory" class="inline-flex items-center gap-1 text-emerald-800 font-medium">
            <Folder class="w-3 h-3" />
            {{ post.category.name }}
          </span>
        </div>

        <!-- Title -->
        <h3 class="font-serif text-lg sm:text-xl font-bold text-navy-950 group-hover:text-emerald-900 transition-colors line-clamp-2 leading-snug">
          <NuxtLink :to="postUrl" class="focus:outline-none">
            {{ post.title }}
          </NuxtLink>
        </h3>

        <!-- Excerpt -->
        <p v-if="post.excerpt" class="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed font-light">
          {{ post.excerpt }}
        </p>
      </div>

      <!-- Action Link -->
      <div class="pt-3 border-t border-cream-200/70 flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:text-emerald-950 transition-colors">
        <NuxtLink :to="postUrl" class="inline-flex items-center gap-1.5 focus:outline-none focus:underline">
          <span>İncele ve Oku</span>
          <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
