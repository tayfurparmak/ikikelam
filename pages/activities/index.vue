<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, Compass, BookOpen, Layers, X, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Container from '~/components/common/Container.vue'
import SectionTitle from '~/components/common/SectionTitle.vue'
import PostCard from '~/components/home/PostCard.vue'
import type { PostItem } from '~/components/home/PostCard.vue'

interface CategoryItem {
  id: string
  name: string
  slug: string
  description?: string | null
  shortDescription?: string | null
  image?: string | null
  icon?: string | null
  sortOrder?: number
  _count?: {
    posts: number
  }
}

interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
  }
}

const route = useRoute()
const router = useRouter()

// Filter states
const selectedCategory = ref<string>((route.query.category as string) || '')
const searchQuery = ref<string>((route.query.search as string) || '')
const activeSearch = ref<string>(searchQuery.value)
const currentPage = ref<number>(parseInt((route.query.page as string) || '1', 10) || 1)
const limit = 9

// Fetch categories from /api/activities
const { data: categoriesRes } = await useFetch<ApiResponse<CategoryItem[]>>('/api/activities', {
  lazy: true,
})

const categories = computed(() => categoriesRes.value?.data || [])

// Fetch posts
const { data: postsRes, status } = await useFetch<ApiResponse<PostItem[]>>('/api/posts', {
  params: computed(() => ({
    page: currentPage.value,
    limit,
    category: selectedCategory.value || undefined,
    search: activeSearch.value.trim() || undefined,
    status: 'PUBLISHED',
  })),
  lazy: true,
})

const isLoading = computed(() => status.value === 'pending')
const posts = computed(() => postsRes.value?.data || [])
const meta = computed(() => postsRes.value?.meta || { total: 0, page: 1, limit, totalPages: 1, hasMore: false })

// Sync state to URL query params
function updateQueryParams() {
  router.push({
    query: {
      ...(selectedCategory.value ? { category: selectedCategory.value } : {}),
      ...(activeSearch.value ? { search: activeSearch.value } : {}),
      ...(currentPage.value > 1 ? { page: String(currentPage.value) } : {}),
    },
  })
}

function selectCategory(slug: string) {
  selectedCategory.value = slug
  currentPage.value = 1
  updateQueryParams()
}

function handleSearch() {
  activeSearch.value = searchQuery.value.trim()
  currentPage.value = 1
  updateQueryParams()
}

function clearSearch() {
  searchQuery.value = ''
  activeSearch.value = ''
  currentPage.value = 1
  updateQueryParams()
}

function goToPage(page: number) {
  if (page < 1 || page > meta.value.totalPages || page === currentPage.value) return
  currentPage.value = page
  updateQueryParams()
  if (import.meta.client) {
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }
}

watch(
  () => route.query,
  (newQuery) => {
    selectedCategory.value = (newQuery.category as string) || ''
    searchQuery.value = (newQuery.search as string) || ''
    activeSearch.value = searchQuery.value
    currentPage.value = parseInt((newQuery.page as string) || '1', 10) || 1
  }
)

const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl || 'https://ikikelam.org.tr').replace(/\/+$/, '')

useSeoMeta({
  title: 'Faaliyetlerimiz & İlim Meclisleri — İki Kelam',
  description:
    'Çocuk Kur\'an kursları, çocuk dersleri, gençlik halkaları ve haftalık sohbetlerle İki Kelam Derneği\'nin tüm ilmi ve irfani faaliyetleri.',
  ogTitle: 'Faaliyetlerimiz & İlim Meclisleri — İki Kelam',
  ogDescription:
    'Medrese usûlü ilim meclisleri, çocuk ve gençlik eğitimleri ve haftalık sohbet programları.',
  ogType: 'website',
  ogUrl: `${siteUrl}/activities`,
  ogImage: `${siteUrl}/logo.svg`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Faaliyetlerimiz & İlim Meclisleri — İki Kelam',
  twitterDescription:
    'Medrese usûlü ilim meclisleri, çocuk ve gençlik eğitimleri ve haftalık sohbet programları.',
  twitterImage: `${siteUrl}/logo.svg`,
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/activities` }],
})
</script>

<template>
  <div class="min-h-screen bg-warm-white py-12 sm:py-16">
    <Container size="xl">
      <!-- Page Header -->
      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <SectionTitle
          badge="İlim ve İrfan Meclisleri"
          title="Faaliyetlerimiz ve Tedrisatımız"
          subtitle="Geleceğin teminatı nesillerimiz için Kur'an eğitimi, gençlik halkaları ve umuma açık haftalık ilim meclisleri."
          align="center"
        />

        <!-- Live Search Bar -->
        <div class="mt-8 max-w-xl mx-auto relative">
          <form class="relative flex items-center" @submit.prevent="handleSearch">
            <Search class="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Faaliyet veya ders ara..."
              class="w-full pl-12 pr-24 py-3.5 rounded-2xl bg-white border border-stone-200 shadow-sm text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/50 focus:border-emerald-700 transition-all"
            >
            <div class="absolute right-2.5 flex items-center gap-1.5">
              <button
                v-if="searchQuery"
                type="button"
                class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label="Aramayı temizle"
                @click="clearSearch"
              >
                <X class="w-4 h-4" />
              </button>
              <button
                type="submit"
                class="px-3.5 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                Ara
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Dynamic Activity Categories Cards (Shown in default overview mode) -->
      <div v-if="!selectedCategory && !activeSearch && categories.length > 0" class="mb-14">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="cat in categories"
            :key="cat.id"
            :to="`/activities/${cat.slug}`"
            class="group bg-white rounded-3xl border border-cream-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-300 flex flex-col"
          >
            <!-- Cover image or fallback gradient -->
            <div class="aspect-[16/10] bg-slate-100 relative overflow-hidden">
              <img
                v-if="cat.image"
                :src="cat.image"
                :alt="cat.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              >
              <div v-else class="w-full h-full bg-gradient-to-br from-emerald-800 to-navy-950 flex items-center justify-center text-white/40">
                <Compass class="w-10 h-10 text-white/30" />
              </div>
              <div class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-xs text-navy-950 shadow-xs">
                {{ cat._count?.posts || 0 }} İçerik
              </div>
            </div>

            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="font-serif text-base font-bold text-navy-950 group-hover:text-emerald-800 transition-colors line-clamp-1 mb-1.5">
                  {{ cat.name }}
                </h3>
                <p class="text-xs text-slate-500 font-light line-clamp-2 leading-relaxed">
                  {{ cat.shortDescription || cat.description || 'Medrese usûlü ilmi tedrisat ve faaliyet programlarımız.' }}
                </p>
              </div>

              <div class="mt-4 pt-3 border-t border-cream-100 flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:text-emerald-950">
                <span>Faaliyeti İncele</span>
                <ChevronRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Categories Filter Tabs -->
      <div class="flex items-center justify-center gap-2 flex-wrap mb-10 pb-4 border-b border-cream-200/80">
        <button
          type="button"
          :class="[
            'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/40',
            selectedCategory === ''
              ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-cream-100 hover:text-emerald-900'
          ]"
          @click="selectCategory('')"
        >
          <Layers class="w-4 h-4" />
          <span>Tüm Faaliyetler</span>
        </button>

        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          :class="[
            'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/40',
            selectedCategory === cat.slug
              ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-cream-100 hover:text-emerald-900'
          ]"
          @click="selectCategory(cat.slug)"
        >
          <BookOpen class="w-4 h-4" />
          <span>{{ cat.name }}</span>
          <span
            v-if="cat._count?.posts !== undefined"
            :class="[
              'px-1.5 py-0.5 rounded-md text-[11px]',
              selectedCategory === cat.slug ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
            ]"
          >
            {{ cat._count.posts }}
          </span>
        </button>
      </div>

      <!-- Loading Skeleton Grid -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="i in 6"
          :key="i"
          class="rounded-2xl bg-white border border-stone-200 overflow-hidden animate-pulse"
        >
          <div class="aspect-[16/10] bg-slate-200" />
          <div class="p-6 space-y-3">
            <div class="h-4 bg-slate-200 rounded w-1/4" />
            <div class="h-6 bg-slate-200 rounded w-3/4" />
            <div class="h-4 bg-slate-200 rounded w-full" />
          </div>
        </div>
      </div>

      <!-- Posts Grid -->
      <div v-else-if="posts.length > 0" class="space-y-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PostCard
            v-for="post in posts"
            :key="post.id"
            :post="post"
          />
        </div>

        <!-- Pagination Controls -->
        <nav
          v-if="meta.totalPages > 1"
          aria-label="Faaliyet Sayfaları"
          class="flex items-center justify-center gap-2 pt-6 border-t border-cream-200/80"
        >
          <button
            type="button"
            :disabled="currentPage <= 1"
            :class="[
              'inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-700',
              currentPage <= 1
                ? 'opacity-40 cursor-not-allowed bg-stone-100 text-stone-400 border-stone-200'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-cream-100 hover:text-emerald-900'
            ]"
            @click="goToPage(currentPage - 1)"
          >
            <ChevronLeft class="w-4 h-4" />
            <span>Önceki</span>
          </button>

          <div class="flex items-center gap-1.5 px-2">
            <button
              v-for="p in meta.totalPages"
              :key="p"
              type="button"
              :class="[
                'w-9 h-9 rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-700',
                currentPage === p
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-cream-100 hover:text-emerald-900'
              ]"
              :aria-label="`Sayfa ${p}`"
              :aria-current="currentPage === p ? 'page' : undefined"
              @click="goToPage(p)"
            >
              {{ p }}
            </button>
          </div>

          <button
            type="button"
            :disabled="currentPage >= meta.totalPages"
            :class="[
              'inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-700',
              currentPage >= meta.totalPages
                ? 'opacity-40 cursor-not-allowed bg-stone-100 text-stone-400 border-stone-200'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-cream-100 hover:text-emerald-900'
            ]"
            @click="goToPage(currentPage + 1)"
          >
            <span>Sonraki</span>
            <ChevronRight class="w-4 h-4" />
          </button>
        </nav>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20 px-4 rounded-3xl bg-white border border-stone-200/80 shadow-xs max-w-2xl mx-auto">
        <div class="w-16 h-16 rounded-2xl bg-cream-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 border border-cream-200">
          <Compass class="w-8 h-8 text-emerald-700" />
        </div>
        <h3 class="font-serif text-2xl font-bold text-navy-950 mb-2">
          Faaliyet Bulunamadı
        </h3>
        <p class="text-stone-500 text-sm max-w-md mx-auto mb-6 font-light">
          Arama kriterlerinize veya seçili kategoriye uygun yayınlanmış içerik bulunmamaktadır.
        </p>
        <button
          type="button"
          class="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-medium text-xs hover:bg-emerald-900 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700"
          @click="selectCategory('')"
        >
          Tüm Faaliyetleri Görüntüle
        </button>
      </div>
    </Container>
  </div>
</template>
