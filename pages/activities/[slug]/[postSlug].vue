<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Calendar,
  Folder,
  Share2,
  Check,
  ChevronRight,
  ArrowLeft,
  Clock,
  MessageCircle,
  Twitter,
} from 'lucide-vue-next'
import Container from '~/components/common/Container.vue'
import PostCard from '~/components/home/PostCard.vue'
import type { PostItem } from '~/components/home/PostCard.vue'
import { sanitizeHtml } from '~/utils/sanitizeHtml'

interface PostDetail extends PostItem {
  content: string
  category: {
    id: string
    name: string
    slug: string
  }
}

interface ApiResponse<T> {
  success: boolean
  data: T
}

const route = useRoute()
const config = useRuntimeConfig()

const catSlug = computed(() => String(route.params.slug || ''))
const postSlug = computed(() => String(route.params.postSlug || ''))

// 1. Fetch Post Detail
const { data: postRes, error: postError } = await useFetch<ApiResponse<PostDetail>>(
  () => `/api/posts/${postSlug.value}`
)

if (postError.value || !postRes.value?.data) {
  throw createError({
    statusCode: 404,
    statusMessage: 'İçerik Bulunamadı',
    message: 'Aradığınız faaliyet veya yazı bulunamadı veya yayından kaldırılmış olabilir.',
    fatal: true,
  })
}

const post = computed(() => postRes.value!.data)

// If user accessed with mismatched category slug, redirect to canonical path
if (post.value.category?.slug && post.value.category.slug !== catSlug.value) {
  await navigateTo(`/activities/${post.value.category.slug}/${post.value.slug}`, {
    redirectCode: 301,
  })
}

// 2. Fetch Related Posts from same category
const { data: relatedRes } = await useFetch<{ success: boolean; data: PostItem[] }>('/api/posts', {
  params: computed(() => ({
    category: post.value.category?.slug || catSlug.value,
    limit: 4,
    status: 'PUBLISHED',
  })),
  lazy: true,
})

const relatedPosts = computed(() => {
  const all = relatedRes.value?.data || []
  return all.filter((p) => p.id !== post.value.id).slice(0, 3)
})

// 3. Securely sanitized rich content to neutralize XSS
const cleanContent = computed(() => sanitizeHtml(post.value.content))

// Estimated reading time
const readingTime = computed(() => {
  const text = (post.value.content || '').replace(/<[^>]*>/g, '')
  const words = text.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 180))
  return `${minutes} dk okuma`
})

// Format Date
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

// Share functionality
const isCopied = ref(false)
const fullUrl = computed(() => {
  if (import.meta.client) {
    return window.location.href
  }
  return `${config.public.siteUrl}/activities/${post.value.category.slug}/${post.value.slug}`
})

async function copyLink() {
  try {
    await navigator.clipboard.writeText(fullUrl.value)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2500)
  } catch (err) {
    console.error('Kopyalama hatası:', err)
  }
}

// Share links
const whatsappShareUrl = computed(
  () => `https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.value.title} - ${fullUrl.value}`)}`
)
const twitterShareUrl = computed(
  () =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.value.title)}&url=${encodeURIComponent(fullUrl.value)}`
)

// Fallback image
const defaultCover =
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80'

// SEO Metadata
const seoTitle = computed(() => `${post.value.title} — İki Kelam`)
const seoDescription = computed(
  () =>
    post.value.excerpt ||
    'İki Kelam İlim ve Kültür Derneği faaliyet ve ders halkaları içerik detayı.'
)
const seoImage = computed(() => post.value.coverImage || `${config.public.siteUrl}/logo.svg`)

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogUrl: fullUrl,
  ogImage: seoImage,
  ogType: 'article',
  articlePublishedTime: post.value.publishedAt ? new Date(post.value.publishedAt).toISOString() : undefined,
  articleSection: post.value.category?.name,
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: seoImage,
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: fullUrl,
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.value.title,
          description: post.value.excerpt || undefined,
          image: post.value.coverImage ? [post.value.coverImage] : undefined,
          datePublished: post.value.publishedAt ? new Date(post.value.publishedAt).toISOString() : undefined,
          dateModified: post.value.updatedAt ? new Date(post.value.updatedAt).toISOString() : undefined,
          author: {
            '@type': 'Organization',
            name: 'İki Kelam İlim ve Kültür Derneği',
          },
          publisher: {
            '@type': 'Organization',
            name: 'İki Kelam',
            logo: {
              '@type': 'ImageObject',
              url: `${config.public.siteUrl}/logo.svg`,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': fullUrl.value,
          },
        })
      ),
    },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-warm-white py-10 sm:py-16">
    <Container size="xl">
      <!-- Breadcrumb Navigation -->
      <nav aria-label="Ekmek Kırıntısı" class="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap">
        <NuxtLink to="/" class="hover:text-emerald-800 transition-colors">
          Ana Sayfa
        </NuxtLink>
        <ChevronRight class="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <NuxtLink to="/activities" class="hover:text-emerald-800 transition-colors">
          Faaliyetler
        </NuxtLink>
        <ChevronRight class="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <NuxtLink
          :to="`/activities/${post.category.slug}`"
          class="hover:text-emerald-800 transition-colors"
        >
          {{ post.category.name }}
        </NuxtLink>
        <ChevronRight class="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span class="text-stone-900 font-semibold truncate max-w-xs sm:max-w-sm" aria-current="page">
          {{ post.title }}
        </span>
      </nav>

      <!-- Main Article Column -->
      <article class="max-w-3xl mx-auto">
        <!-- Header: Category & Meta -->
        <header class="space-y-4 mb-8">
          <div class="flex items-center gap-3 flex-wrap">
            <NuxtLink
              :to="`/activities/${post.category.slug}`"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100/70 hover:bg-emerald-200 text-emerald-800 transition-colors"
            >
              <Folder class="w-3.5 h-3.5 text-emerald-700" />
              <span>{{ post.category.name }}</span>
            </NuxtLink>

            <span class="text-stone-300">•</span>

            <div class="inline-flex items-center gap-1.5 text-xs text-slate-500 font-light">
              <Calendar class="w-3.5 h-3.5 text-emerald-800" />
              <time :datetime="String(post.publishedAt || post.createdAt)">
                {{ formatDate(post.publishedAt || post.createdAt) }}
              </time>
            </div>

            <span class="text-stone-300">•</span>

            <div class="inline-flex items-center gap-1.5 text-xs text-slate-500 font-light">
              <Clock class="w-3.5 h-3.5 text-slate-400" />
              <span>{{ readingTime }}</span>
            </div>
          </div>

          <!-- Main Title -->
          <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-950 tracking-tight leading-[1.2]">
            {{ post.title }}
          </h1>

          <!-- Excerpt -->
          <p v-if="post.excerpt" class="text-lg sm:text-xl text-slate-600 font-light leading-relaxed pt-2 border-l-2 border-emerald-600/40 pl-4 italic">
            {{ post.excerpt }}
          </p>
        </header>

        <!-- Cover Image -->
        <div class="rounded-3xl overflow-hidden shadow-sm border border-stone-200/80 mb-10 bg-cream-100 aspect-[16/9]">
          <img
            :src="post.coverImage || defaultCover"
            :alt="post.title"
            loading="eager"
            decoding="async"
            class="w-full h-full object-cover"
          >
        </div>

        <!-- Rich Content (Sanitized against XSS using DOMPurify) -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div
          class="rich-content bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-cream-200/80 shadow-xs mb-10"
          v-html="cleanContent"
        />

        <!-- Share & Interaction Bar -->
        <div class="bg-cream-50/80 rounded-2xl p-6 border border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-4 mb-16">
          <div class="flex items-center gap-2">
            <Share2 class="w-4 h-4 text-emerald-800" />
            <span class="text-xs sm:text-sm font-semibold text-navy-950">Bu Faaliyeti Paylaşın:</span>
          </div>

          <div class="flex items-center gap-2">
            <!-- WhatsApp -->
            <a
              :href="whatsappShareUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors"
              aria-label="WhatsApp ile Paylaş"
            >
              <MessageCircle class="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            <!-- Twitter / X -->
            <a
              :href="twitterShareUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-medium transition-colors"
              aria-label="X (Twitter) ile Paylaş"
            >
              <Twitter class="w-4 h-4" />
              <span>Paylaş</span>
            </a>

            <!-- Copy Link Button -->
            <button
              type="button"
              :class="[
                'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700',
                isCopied
                  ? 'bg-emerald-800 text-white border-emerald-800'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-cream-100'
              ]"
              aria-label="Bağlantıyı Kopyala"
              @click="copyLink"
            >
              <Check v-if="isCopied" class="w-4 h-4" />
              <span>{{ isCopied ? 'Kopyalandı!' : 'Bağlantı' }}</span>
            </button>
          </div>
        </div>

        <!-- Back to Category Link -->
        <div class="mb-16 pb-8 border-b border-cream-200">
          <NuxtLink
            :to="`/activities/${post.category.slug}`"
            class="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <ArrowLeft class="w-4 h-4" />
            <span>"{{ post.category.name }}" Kategorisindeki Tüm Yazılar</span>
          </NuxtLink>
        </div>
      </article>

      <!-- Related Posts Section -->
      <section v-if="relatedPosts.length > 0" class="max-w-6xl mx-auto pt-4">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="font-serif text-2xl sm:text-3xl font-bold text-navy-950">
              Benzer Faaliyetler
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 font-light mt-1">
              "{{ post.category.name }}" kategorisindeki diğer güncel meclis ve dersler.
            </p>
          </div>

          <NuxtLink
            :to="`/activities/${post.category.slug}`"
            class="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
          >
            <span>Tümünü Gör</span>
            <ChevronRight class="w-4 h-4" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PostCard
            v-for="rel in relatedPosts"
            :key="rel.id"
            :post="rel"
            compact
          />
        </div>
      </section>
    </Container>
  </div>
</template>
