<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronRight, ChevronLeft, BookOpen, Layers, ArrowLeft } from 'lucide-vue-next'
import Container from '~/components/common/Container.vue'
import PostCard from '~/components/home/PostCard.vue'
import type { PostItem } from '~/components/home/PostCard.vue'

interface CategoryDetail {
  id: string
  name: string
  slug: string
  description?: string | null
  shortDescription?: string | null
  image?: string | null
  icon?: string | null
  isActive: boolean
  _count?: {
    posts: number
  }
}

interface PostsResponse {
  success: boolean
  data: PostItem[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
  }
}

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const slug = computed(() => String(route.params.slug || ''))

// 1. Fetch Category Detail
const { data: catRes, error: catError } = await useFetch<{ success: boolean; data: CategoryDetail }>(
  () => `/api/activities/${slug.value}`
)

if (catError.value || !catRes.value?.data) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Kategori Bulunamadı',
    message: 'Aradığınız faaliyet kategorisi bulunamadı veya yayından kaldırılmış olabilir.',
    fatal: true,
  })
}

const category = computed(() => catRes.value!.data)

// 2. Fetch Posts for Category with Pagination
const currentPage = ref<number>(parseInt((route.query.page as string) || '1', 10) || 1)
const limit = 9

const { data: postsRes, status } = await useFetch<PostsResponse>('/api/posts', {
  params: computed(() => ({
    category: slug.value,
    page: currentPage.value,
    limit,
    status: 'PUBLISHED',
  })),
  watch: [currentPage, slug],
})

const isLoading = computed(() => status.value === 'pending')
const posts = computed(() => postsRes.value?.data || [])
const meta = computed(() => postsRes.value?.meta || { total: 0, page: 1, limit, totalPages: 1, hasMore: false })

function goToPage(p: number) {
  if (p < 1 || p > meta.value.totalPages || p === currentPage.value) return
  currentPage.value = p
  router.push({
    query: {
      ...(p > 1 ? { page: String(p) } : {}),
    },
  })
  if (import.meta.client) {
    window.scrollTo({ top: 250, behavior: 'smooth' })
  }
}

// SEO
const pageTitle = computed(() => `${category.value.name} — İki Kelam`)
const pageDescription = computed(
  () => category.value.description || `${category.value.name} alanındaki medrese dersleri, kurslar ve faaliyetlerimiz.`
)
const canonicalUrl = computed(() => `${config.public.siteUrl}/activities/${category.value.slug}`)

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
    ogType: 'website',
    ogUrl: canonicalUrl,
    ogImage: category.value.image || `${config.public.siteUrl}/logo.svg`,
    twitterCard: 'summary_large_image',
    twitterTitle: pageTitle,
    twitterDescription: pageDescription,
    twitterImage: category.value.image || `${config.public.siteUrl}/logo.svg`,
  })

  useHead({
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl,
      },
    ],
  })
  </script>

  <template>
    <div class="min-h-screen bg-warm-white py-10 sm:py-16">
      <Container size="xl">
        <!-- Breadcrumbs -->
        <nav aria-label="Ekmek Kırıntısı" class="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap">
          <NuxtLink to="/" class="hover:text-emerald-800 transition-colors">
            Ana Sayfa
          </NuxtLink>
          <ChevronRight class="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <NuxtLink to="/activities" class="hover:text-emerald-800 transition-colors">
            Faaliyetler
          </NuxtLink>
          <ChevronRight class="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span class="text-stone-900 font-semibold truncate" aria-current="page">
            {{ category.name }}
          </span>
        </nav>

        <!-- Category Hero Header -->
        <div class="relative bg-white rounded-3xl p-8 sm:p-12 border border-cream-200 shadow-xs mb-12 overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div :class="[category.image ? 'lg:col-span-7' : 'lg:col-span-12', 'space-y-4']">
              <!-- Eyebrow Badge -->
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-100">
                <BookOpen class="w-3.5 h-3.5 text-emerald-600" />
                <span>Faaliyet Kategorisi</span>
              </div>

              <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-950 tracking-tight">
                {{ category.name }}
              </h1>

              <p v-if="category.shortDescription" class="text-base sm:text-lg text-emerald-950 font-medium leading-relaxed">
                {{ category.shortDescription }}
              </p>

              <p v-if="category.description" class="text-sm sm:text-base text-slate-600 font-light leading-relaxed whitespace-pre-line">
                {{ category.description }}
              </p>

              <div class="pt-2 flex items-center gap-4 text-xs sm:text-sm text-slate-500">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cream-100 text-stone-700 font-medium">
                  <Layers class="w-4 h-4 text-emerald-700" />
                  <span>Toplam {{ meta.total }} İçerik</span>
                </span>

                <NuxtLink
                  to="/activities"
                  class="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
                >
                  <ArrowLeft class="w-3.5 h-3.5" />
                  <span>Tüm Faaliyetleri Gör</span>
                </NuxtLink>
              </div>
            </div>

            <!-- Dynamic Cover Image -->
            <div v-if="category.image" class="lg:col-span-5">
              <div class="rounded-2xl overflow-hidden aspect-[16/10] shadow-md border border-cream-200">
                <img
                  :src="category.image"
                  :alt="category.name"
                  class="w-full h-full object-cover"
                >
              </div>
            </div>
          </div>
        </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="i in 3"
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

      <!-- Posts List -->
      <div v-else-if="posts.length > 0" class="space-y-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PostCard
            v-for="post in posts"
            :key="post.id"
            :post="post"
            :show-category="false"
          />
        </div>

        <!-- Pagination -->
        <nav
          v-if="meta.totalPages > 1"
          aria-label="Kategori Sayfaları"
          class="flex items-center justify-center gap-2 pt-8 border-t border-cream-200/80"
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
      <div v-else class="text-center py-20 px-4 rounded-3xl bg-white border border-stone-200/80 shadow-xs max-w-xl mx-auto">
        <div class="w-16 h-16 rounded-2xl bg-cream-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 border border-cream-200">
          <BookOpen class="w-8 h-8 text-emerald-700" />
        </div>
        <h3 class="font-serif text-2xl font-bold text-navy-950 mb-2">
          Bu Kategoride Henüz İçerik Yok
        </h3>
        <p class="text-stone-500 text-sm max-w-md mx-auto mb-6 font-light">
          "{{ category.name }}" alanında planlanan ders ve faaliyetlerimiz yakında burada yayınlanacaktır.
        </p>
        <NuxtLink
          to="/activities"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-medium text-xs hover:bg-emerald-900 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Diğer Faaliyetleri İncele</span>
        </NuxtLink>
      </div>
    </Container>
  </div>
</template>
