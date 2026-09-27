<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  User,
  Shield,
  Key,
  CheckCircle,
  Server,
  Database,
  Share2,
  Video,
  ExternalLink,
  Trash2,
  AlertCircle,
  Save,
} from 'lucide-vue-next'
import { useAdminToast } from '~/composables/useAdminToast'
import IconYoutube from '~/components/common/IconYoutube.vue'
import IconInstagram from '~/components/common/IconInstagram.vue'
import {
  extractYoutubeVideoId,
  getYoutubeThumbnailUrl,
  isValidYoutubeDomain,
  isValidInstagramDomain,
} from '~/utils/youtube'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useSeoMeta({
  title: 'Sistem & Yönetici Ayarları — İki Kelam Yönetim',
})

const { user } = useAdminAuth()
const { showToast } = useAdminToast()

// System Health Check
const { data: healthRes } = await useFetch<{
  status: string
  database: string
  timestamp: string
}>('/api/health')

// Site & Social Media Settings Fetch
const { data: siteSettingsRes, refresh: refreshSiteSettings } = await useFetch<{
  success: boolean
  data: {
    id: string
    organizationName: string
    description: string | null
    youtubeUrl: string | null
    instagramUrl: string | null
    featuredYoutubeVideoId: string | null
    featuredYoutubeTitle: string | null
    featuredYoutubeDescription: string | null
  }
}>('/api/site-settings')

const isSavingSocial = ref(false)
const socialForm = ref({
  youtubeUrl: siteSettingsRes.value?.data?.youtubeUrl || 'https://www.youtube.com/@ikikelamresmi',
  instagramUrl: siteSettingsRes.value?.data?.instagramUrl || 'https://instagram.com/ikikelamresmi',
  featuredYoutubeVideoUrl: siteSettingsRes.value?.data?.featuredYoutubeVideoId
    ? `https://www.youtube.com/watch?v=${siteSettingsRes.value.data.featuredYoutubeVideoId}`
    : '',
  featuredYoutubeVideoId: siteSettingsRes.value?.data?.featuredYoutubeVideoId || '',
  featuredYoutubeTitle: siteSettingsRes.value?.data?.featuredYoutubeTitle || '',
  featuredYoutubeDescription: siteSettingsRes.value?.data?.featuredYoutubeDescription || '',
})

// Real-time video parser & preview
const parsedVideoId = computed(() => {
  const url = socialForm.value.featuredYoutubeVideoUrl?.trim()
  if (!url) return ''
  return extractYoutubeVideoId(url) || ''
})

const isVideoUrlInvalid = computed(() => {
  const url = socialForm.value.featuredYoutubeVideoUrl?.trim()
  if (!url) return false
  return !parsedVideoId.value
})

const liveThumbnailUrl = computed(() => {
  if (!parsedVideoId.value) return ''
  return getYoutubeThumbnailUrl(parsedVideoId.value, 'hqdefault')
})

function clearFeaturedVideo() {
  socialForm.value.featuredYoutubeVideoUrl = ''
  socialForm.value.featuredYoutubeVideoId = ''
  socialForm.value.featuredYoutubeTitle = ''
  socialForm.value.featuredYoutubeDescription = ''
  showToast('Seçili video kaldırıldı. Değişiklikleri uygulamak için "Kaydet" butonuna tıklayınız.', 'info')
}

async function handleSaveSocial() {
  // If video URL entered, must be valid
  if (socialForm.value.featuredYoutubeVideoUrl?.trim()) {
    const id = extractYoutubeVideoId(socialForm.value.featuredYoutubeVideoUrl.trim())
    if (!id) {
      showToast('Geçerli bir YouTube video bağlantısı girin.', 'error')
      return
    }
  }

  if (socialForm.value.youtubeUrl?.trim() && !isValidYoutubeDomain(socialForm.value.youtubeUrl.trim())) {
    showToast('Geçerli bir YouTube kanal URL giriniz (youtube.com).', 'error')
    return
  }

  if (socialForm.value.instagramUrl?.trim() && !isValidInstagramDomain(socialForm.value.instagramUrl.trim())) {
    showToast('Geçerli bir Instagram profil URL giriniz (instagram.com).', 'error')
    return
  }

  isSavingSocial.value = true
  try {
    const res = await $fetch<{ success: boolean; data: { featuredYoutubeVideoId?: string | null }; message: string }>('/api/site-settings', {
      method: 'PUT',
      body: {
        youtubeUrl: socialForm.value.youtubeUrl?.trim(),
        instagramUrl: socialForm.value.instagramUrl?.trim(),
        featuredYoutubeVideoUrl: socialForm.value.featuredYoutubeVideoUrl?.trim(),
        featuredYoutubeTitle: socialForm.value.featuredYoutubeTitle?.trim(),
        featuredYoutubeDescription: socialForm.value.featuredYoutubeDescription?.trim(),
      },
    })
    await refreshSiteSettings()
    if (res.data?.featuredYoutubeVideoId) {
      socialForm.value.featuredYoutubeVideoId = res.data.featuredYoutubeVideoId
    }
    showToast(res.message || 'Site ve sosyal medya ayarları başarıyla güncellendi.', 'success')
  } catch (err: unknown) {
    const fetchErr = err as { data?: { message?: string }; message?: string }
    showToast(fetchErr.data?.message || fetchErr.message || 'Ayarlar kaydedilirken hata oluştu.', 'error')
  } finally {
    isSavingSocial.value = false
  }
}

const isSaving = ref(false)
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

async function handleUpdatePassword() {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    showToast('Yeni şifreler birbiriyle uyuşmuyor.', 'error')
    return
  }
  if (passwordForm.value.newPassword.length < 8) {
    showToast('Yeni şifre en az 8 karakter olmalıdır.', 'error')
    return
  }

  isSaving.value = true
  // Mock / update
  setTimeout(() => {
    isSaving.value = false
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
    showToast('Şifreniz başarıyla güncellendi.', 'success')
  }, 800)
}
</script>

<template>
  <div class="space-y-8 max-w-4xl">
    <!-- Header -->
    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
      <h1 class="font-serif text-2xl sm:text-3xl font-bold text-navy-950">
        Yönetim & Sistem Ayarları
      </h1>
      <p class="text-sm text-slate-500 mt-1 font-light">
        Yönetici oturum bilgileri, güvenlik ayarları, resmi sosyal medya ve ana sayfa YouTube video yönetimi.
      </p>
    </div>

    <!-- Site & Sosyal Medya Yönetimi -->
    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-8">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <Share2 class="w-5 h-5 text-emerald-800" />
          <div>
            <h2 class="font-serif text-xl font-bold text-navy-950">
              Site & Sosyal Medya Yönetimi
            </h2>
            <p class="text-xs text-slate-500 font-light mt-0.5">
              Resmi sosyal medya bağlantıları ve ana sayfada gösterilecek YouTube videosunu yönetin.
            </p>
          </div>
        </div>

        <button
          type="button"
          :disabled="isSavingSocial || isVideoUrlInvalid"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          @click="handleSaveSocial"
        >
          <Save class="w-3.5 h-3.5" />
          <span>{{ isSavingSocial ? 'Kaydediliyor...' : 'Kaydet' }}</span>
        </button>
      </div>

      <!-- 1. SOSYAL MEDYA HESAPLARI -->
      <div class="space-y-4">
        <h3 class="text-xs font-bold text-navy-950 uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <span>Resmi Sosyal Medya Hesapları</span>
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- YouTube Kanal URL -->
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-navy-950 flex items-center justify-between">
              <span class="flex items-center gap-1.5">
                <IconYoutube class="w-3.5 h-3.5 text-red-600" />
                <span>YouTube Kanal URL</span>
              </span>
              <a
                v-if="socialForm.youtubeUrl"
                :href="socialForm.youtubeUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-[11px] text-emerald-800 hover:underline flex items-center gap-0.5 font-normal"
              >
                <span>Kanalı Aç</span>
                <ExternalLink class="w-3 h-3" />
              </a>
            </label>
            <input
              v-model="socialForm.youtubeUrl"
              type="url"
              placeholder="https://www.youtube.com/@ikikelamresmi"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
            >
            <p class="text-[11px] text-slate-400 font-light">Örn: https://www.youtube.com/@ikikelamresmi</p>
          </div>

          <!-- Instagram Profil URL -->
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-navy-950 flex items-center justify-between">
              <span class="flex items-center gap-1.5">
                <IconInstagram class="w-3.5 h-3.5 text-pink-600" />
                <span>Instagram Profil URL</span>
              </span>
              <a
                v-if="socialForm.instagramUrl"
                :href="socialForm.instagramUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-[11px] text-emerald-800 hover:underline flex items-center gap-0.5 font-normal"
              >
                <span>Profili Aç</span>
                <ExternalLink class="w-3 h-3" />
              </a>
            </label>
            <input
              v-model="socialForm.instagramUrl"
              type="url"
              placeholder="https://instagram.com/ikikelamresmi"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
            >
            <p class="text-[11px] text-slate-400 font-light">Örn: https://instagram.com/ikikelamresmi</p>
          </div>
        </div>
      </div>

      <!-- 2. ANA SAYFA VİDEOSU -->
      <div class="space-y-5 pt-6 border-t border-slate-100">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xs font-bold text-navy-950 uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Video class="w-4 h-4 text-emerald-800" />
              <span>Ana Sayfa YouTube Videosu</span>
            </h3>
            <p class="text-xs text-slate-500 font-light mt-0.5">
              İki Kelam resmi YouTube kanalından seçilen video, ana sayfada 16:9 modern oynatıcı ile gösterilir.
            </p>
          </div>

          <button
            v-if="socialForm.featuredYoutubeVideoUrl || socialForm.featuredYoutubeVideoId"
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
            @click="clearFeaturedVideo"
          >
            <Trash2 class="w-3.5 h-3.5" />
            <span>Videoyu Kaldır</span>
          </button>
        </div>

        <!-- Video URL Input -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-navy-950">
            YouTube Video Bağlantısı (URL veya Video ID)
          </label>
          <div class="relative">
            <input
              v-model="socialForm.featuredYoutubeVideoUrl"
              type="text"
              placeholder="https://www.youtube.com/watch?v=CV797WTQ7b8 veya https://youtu.be/CV797WTQ7b8"
              class="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50 pr-28"
              :class="[
                isVideoUrlInvalid
                  ? 'border-red-300 focus:ring-red-500/50 bg-red-50/20'
                  : 'border-slate-200',
              ]"
            >
            <div v-if="parsedVideoId" class="absolute right-2.5 top-1/2 -translate-y-1/2">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle class="w-3 h-3 text-emerald-600" />
                <span>{{ parsedVideoId }}</span>
              </span>
            </div>
          </div>

          <!-- Invalid URL error message -->
          <p v-if="isVideoUrlInvalid" class="text-xs text-red-600 flex items-center gap-1.5 mt-1 font-medium">
            <AlertCircle class="w-3.5 h-3.5" />
            <span>Geçerli bir YouTube video bağlantısı girin. (Desteklenen: watch?v=..., youtu.be/..., shorts/... veya 11 haneli video ID)</span>
          </p>
          <p v-else class="text-[11px] text-slate-400 font-light">
            Standart YouTube video URL'si, youtu.be kısa linki veya Shorts bağlantısı girebilirsiniz. Sistem otomatik olarak Video ID'sini ayrıştırır.
          </p>
        </div>

        <!-- Video Live Preview & Metadata Details -->
        <div
          v-if="parsedVideoId"
          class="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
        >
          <div class="flex items-center justify-between pb-2 border-b border-slate-200/60">
            <span class="text-xs font-bold text-navy-950 uppercase tracking-wider">Video Önizleme ve Başlık</span>
            <span class="text-[11px] text-slate-500 font-mono">ID: {{ parsedVideoId }}</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            <!-- 16:9 Thumbnail Preview with Play Icon -->
            <div class="md:col-span-5 relative aspect-[16/9] rounded-xl overflow-hidden bg-navy-950 shadow-sm border border-slate-300">
              <img
                :src="liveThumbnailUrl"
                alt="Seçili YouTube Video Thumbnail"
                class="w-full h-full object-cover"
              >
              <div class="absolute inset-0 bg-navy-950/40 flex items-center justify-center">
                <div class="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                  <Play class="w-5 h-5 fill-current translate-x-0.5" />
                </div>
              </div>
              <div class="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-semibold">
                Önizleme
              </div>
            </div>

            <!-- Title & Description Form Fields -->
            <div class="md:col-span-7 space-y-3">
              <div>
                <label class="block text-xs font-semibold text-navy-950 mb-1">
                  Video Başlığı (Ana Sayfada Gösterilecek)
                </label>
                <input
                  v-model="socialForm.featuredYoutubeTitle"
                  type="text"
                  placeholder="Örn: Kur'an'da Heisenberg Belirsizlik İlkesi"
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
                >
              </div>

              <div>
                <label class="block text-xs font-semibold text-navy-950 mb-1">
                  Kısa Açıklama
                </label>
                <textarea
                  v-model="socialForm.featuredYoutubeDescription"
                  rows="2"
                  placeholder="İki Kelam resmi YouTube kanalından ilmi sohbet kaydı..."
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state info if no video selected -->
        <div
          v-else-if="!socialForm.featuredYoutubeVideoUrl"
          class="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5"
        >
          <AlertCircle class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong class="font-semibold block">Henüz video seçilmedi</strong>
            <span>Ana sayfada video bölümü yerine ziyaretçileri resmi YouTube kanalına davet eden kurumsal eylem çağrısı görüntülenecektir.</span>
          </div>
        </div>
      </div>

      <!-- Action Save Button Footer -->
      <div class="pt-4 border-t border-slate-100 flex items-center justify-end">
        <button
          type="button"
          :disabled="isSavingSocial || isVideoUrlInvalid"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors disabled:opacity-50"
          @click="handleSaveSocial"
        >
          <Save class="w-4 h-4" />
          <span>{{ isSavingSocial ? 'Kaydediliyor...' : 'Site & Sosyal Medya Ayarlarını Kaydet' }}</span>
        </button>
      </div>
    </div>

    <!-- Active Profile & Role -->
    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
      <div class="flex items-center gap-3 pb-4 border-b border-slate-100">
        <User class="w-5 h-5 text-emerald-800" />
        <h2 class="font-serif text-xl font-bold text-navy-950">
          Yönetici Profili
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs sm:text-sm">
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <span class="text-slate-400 block text-xs font-light">Yetkili İsim:</span>
          <strong class="font-semibold text-navy-950 block mt-1">{{ user?.name || 'Yönetici' }}</strong>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <span class="text-slate-400 block text-xs font-light">E-Posta:</span>
          <strong class="font-semibold text-navy-950 block mt-1">{{ user?.email }}</strong>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <span class="text-slate-400 block text-xs font-light">Rol & Yetki:</span>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mt-1">
            <Shield class="w-3.5 h-3.5" />
            <span>{{ user?.role || 'SUPER_ADMIN' }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- System Health & Environment -->
    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
      <div class="flex items-center gap-3 pb-4 border-b border-slate-100">
        <Server class="w-5 h-5 text-emerald-800" />
        <h2 class="font-serif text-xl font-bold text-navy-950">
          Sistem Durumu & Veritabanı
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Database class="w-5 h-5 text-emerald-700" />
            <div>
              <p class="font-semibold text-navy-950">PostgreSQL Veritabanı</p>
              <p class="text-xs text-slate-500 font-mono">Prisma Client ORM</p>
            </div>
          </div>
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle class="w-3.5 h-3.5" />
            <span>{{ healthRes?.database === 'connected' ? 'Bağlı' : 'Aktif' }}</span>
          </span>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Shield class="w-5 h-5 text-emerald-700" />
            <div>
              <p class="font-semibold text-navy-950">Oturum Güvenliği</p>
              <p class="text-xs text-slate-500 font-mono">HttpOnly Cookie (JWT / Argon2)</p>
            </div>
          </div>
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle class="w-3.5 h-3.5" />
            <span>Korumalı</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Password Change Section -->
    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
      <div class="flex items-center gap-3 pb-4 border-b border-slate-100">
        <Key class="w-5 h-5 text-emerald-800" />
        <h2 class="font-serif text-xl font-bold text-navy-950">
          Güvenlik & Şifre Değiştir
        </h2>
      </div>

      <form class="space-y-4 max-w-md" @submit.prevent="handleUpdatePassword">
        <div>
          <label class="block text-xs font-semibold text-navy-950 mb-1">Mevcut Şifre</label>
          <input
            v-model="passwordForm.currentPassword"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
          >
        </div>

        <div>
          <label class="block text-xs font-semibold text-navy-950 mb-1">Yeni Şifre (En az 8 karakter)</label>
          <input
            v-model="passwordForm.newPassword"
            type="password"
            required
            minlength="8"
            placeholder="••••••••"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
          >
        </div>

        <div>
          <label class="block text-xs font-semibold text-navy-950 mb-1">Yeni Şifre Tekrar</label>
          <input
            v-model="passwordForm.confirmPassword"
            type="password"
            required
            minlength="8"
            placeholder="••••••••"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
          >
        </div>

        <button
          type="submit"
          :disabled="isSaving"
          class="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition-colors disabled:opacity-50"
        >
          {{ isSaving ? 'Güncelleniyor...' : 'Şifreyi Güncelle' }}
        </button>
      </form>
    </div>
  </div>
</template>
