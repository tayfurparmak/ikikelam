<script setup lang="ts">
import {
  FileText,
  CheckCircle,
  Image,
  Mail,
  ArrowRight,
  PlusCircle,
  Compass,
} from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useSeoMeta({
  title: 'Dashboard — İki Kelam Yönetim',
})

interface StatsResponse {
  success: boolean
  data: {
    stats: {
      totalPosts: number
      publishedPosts: number
      totalGalleryImages: number
      unreadMessages: number
      totalActivities: number
      activeActivities: number
    }
    latestPosts: Array<{
      id: string
      title: string
      slug: string
      status: string
      publishedAt?: string | null
      createdAt: string
      category?: {
        id: string
        name: string
        slug: string
      } | null
    }>
    latestMessages: Array<{
      id: string
      name: string
      email: string
      subject?: string | null
      message: string
      status: string
      createdAt: string
    }>
  }
}

const { user } = useAdminAuth()

const { data: statsRes, status } = await useFetch<StatsResponse>('/api/admin/stats', {
  lazy: true,
})

const isLoading = computed(() => status.value === 'pending')
const stats = computed(() => statsRes.value?.data.stats || {
  totalPosts: 0,
  publishedPosts: 0,
  totalGalleryImages: 0,
  unreadMessages: 0,
  totalActivities: 0,
  activeActivities: 0,
})
const latestPosts = computed(() => statsRes.value?.data.latestPosts || [])
const latestMessages = computed(() => statsRes.value?.data.latestMessages || [])

function formatDate(val?: string | null) {
  if (!val) return '—'
  try {
    return new Date(val).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- Welcome Header -->
    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="font-serif text-2xl sm:text-3xl font-bold text-navy-950">
          Hoş Geldiniz{{ user?.name ? `, ${user.name}` : '' }}
        </h1>
        <p class="text-sm text-slate-500 mt-1 font-light">
          İki Kelam Derneği içerik, takvim, mesaj ve galeri yönetim paneli.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink
          to="/admin/posts"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <PlusCircle class="w-4 h-4" />
          <span>Yeni Yazı Ekle</span>
        </NuxtLink>
      </div>
    </div>

    <!-- 5 Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <!-- Active Activities -->
      <NuxtLink
        to="/admin/activities"
        class="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all flex items-center justify-between group"
      >
        <div>
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Aktif Faaliyet</span>
          <span v-if="isLoading" class="text-2xl font-bold text-slate-300 animate-pulse">...</span>
          <div v-else class="flex items-baseline gap-1.5">
            <span class="text-3xl font-serif font-bold text-emerald-800">{{ stats.activeActivities }}</span>
            <span class="text-xs text-slate-400 font-medium">/ {{ stats.totalActivities }} toplam</span>
          </div>
        </div>
        <div class="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
          <Compass class="w-5 h-5" />
        </div>
      </NuxtLink>

      <!-- Published Posts -->
      <div class="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Yayındaki İçerik</span>
          <span v-if="isLoading" class="text-2xl font-bold text-slate-300 animate-pulse">...</span>
          <span v-else class="text-3xl font-serif font-bold text-emerald-800">{{ stats.publishedPosts }}</span>
        </div>
        <div class="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
          <CheckCircle class="w-5 h-5" />
        </div>
      </div>

      <!-- Total Posts -->
      <div class="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Toplam İçerik</span>
          <span v-if="isLoading" class="text-2xl font-bold text-slate-300 animate-pulse">...</span>
          <span v-else class="text-3xl font-serif font-bold text-navy-950">{{ stats.totalPosts }}</span>
        </div>
        <div class="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
          <FileText class="w-5 h-5" />
        </div>
      </div>

      <!-- Gallery Images -->
      <div class="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Galeri</span>
          <span v-if="isLoading" class="text-2xl font-bold text-slate-300 animate-pulse">...</span>
          <span v-else class="text-3xl font-serif font-bold text-navy-950">{{ stats.totalGalleryImages }}</span>
        </div>
        <div class="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
          <Image class="w-5 h-5" />
        </div>
      </div>

      <!-- Unread Messages -->
      <NuxtLink
        to="/admin/messages"
        class="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-red-300 transition-all flex items-center justify-between group"
      >
        <div>
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Yeni Mesaj</span>
          <span v-if="isLoading" class="text-2xl font-bold text-slate-300 animate-pulse">...</span>
          <span v-else :class="['text-3xl font-serif font-bold', stats.unreadMessages > 0 ? 'text-red-600' : 'text-slate-800']">
            {{ stats.unreadMessages }}
          </span>
        </div>
        <div :class="['w-11 h-11 rounded-2xl flex items-center justify-center border group-hover:scale-105 transition-transform', stats.unreadMessages > 0 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-500 border-slate-100']">
          <Mail class="w-5 h-5" />
        </div>
      </NuxtLink>
    </div>

    <!-- Recent Content and Messages Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Son İçerikler -->
      <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 class="font-serif text-lg font-bold text-navy-950">
            Son İçerikler
          </h2>
          <NuxtLink
            to="/admin/posts"
            class="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <span>Tümünü Gör</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>

        <div v-if="isLoading" class="space-y-3">
          <div v-for="i in 4" :key="i" class="h-14 bg-slate-100 rounded-2xl animate-pulse" />
        </div>

        <div v-else-if="latestPosts.length > 0" class="space-y-3">
          <div
            v-for="post in latestPosts"
            :key="post.id"
            class="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-3"
          >
            <div class="min-w-0">
              <h3 class="font-medium text-sm text-navy-950 truncate">
                {{ post.title }}
              </h3>
              <div class="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{{ post.category?.name || 'Genel' }}</span>
                <span>•</span>
                <span>{{ formatDate(post.createdAt) }}</span>
              </div>
            </div>

            <span
              :class="[
                'px-2.5 py-1 rounded-md text-[11px] font-semibold shrink-0',
                post.status === 'PUBLISHED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              ]"
            >
              {{ post.status === 'PUBLISHED' ? 'Yayında' : 'Taslak' }}
            </span>
          </div>
        </div>

        <div v-else class="text-center py-8 text-slate-400 text-xs">
          Henüz içerik eklenmemiş.
        </div>
      </div>

      <!-- Son Mesajlar -->
      <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 class="font-serif text-lg font-bold text-navy-950">
            Son Gelen Mesajlar
          </h2>
          <NuxtLink
            to="/admin/messages"
            class="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <span>Tümünü Gör</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>

        <div v-if="isLoading" class="space-y-3">
          <div v-for="i in 4" :key="i" class="h-14 bg-slate-100 rounded-2xl animate-pulse" />
        </div>

        <div v-else-if="latestMessages.length > 0" class="space-y-3">
          <div
            v-for="msg in latestMessages"
            :key="msg.id"
            class="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-3"
          >
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="font-medium text-sm text-navy-950 truncate">{{ msg.name }}</h3>
                <span
                  v-if="msg.status === 'UNREAD'"
                  class="w-2 h-2 rounded-full bg-red-500 shrink-0"
                />
              </div>
              <p class="text-xs text-slate-500 truncate mt-0.5">{{ msg.subject || msg.message }}</p>
            </div>

            <span class="text-[11px] text-slate-400 shrink-0">
              {{ formatDate(msg.createdAt) }}
            </span>
          </div>
        </div>

        <div v-else class="text-center py-8 text-slate-400 text-xs">
          Henüz mesaj alınmamış.
        </div>
      </div>
    </div>
  </div>
</template>
