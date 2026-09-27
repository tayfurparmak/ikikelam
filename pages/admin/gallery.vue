<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  UploadCloud,
  Trash2,
  Tag,
  Image as ImageIcon,
  X,
} from 'lucide-vue-next'
import AdminConfirmModal from '~/components/admin/AdminConfirmModal.vue'
import { useAdminToast } from '~/composables/useAdminToast'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useSeoMeta({
  title: 'Galeri Yönetimi — İki Kelam Yönetim',
})

interface GalleryItem {
  id: string
  title: string
  imageUrl: string
  storagePath?: string | null
  category: string
  altText?: string | null
  createdAt: string
}

const { showToast } = useAdminToast()

const categoryOptions = [
  { value: 'MEDRESE_LIFE', label: 'Haftalık Sohbetler' },
  { value: 'CLASSES', label: 'Çocuk Dersleri' },
  { value: 'EVENTS', label: 'Etkinlikler' },
  { value: 'LIBRARY', label: 'Kütüphane' },
  { value: 'HISTORICAL', label: 'Tarihi Eserler' },
  { value: 'GENERAL', label: 'Genel' },
]

const categoryLabels: Record<string, string> = {
  MEDRESE_LIFE: 'Haftalık Sohbetler',
  CLASSES: 'Çocuk Dersleri',
  EVENTS: 'Etkinlikler',
  LIBRARY: 'Kütüphane',
  HISTORICAL: 'Tarihi Eserler',
  GENERAL: 'Genel',
}

const selectedFilter = ref('')

const { data: galleryRes, status, refresh: refreshGallery } = await useFetch<{
  success: boolean
  data: GalleryItem[]
}>('/api/gallery', {
  params: computed(() => ({
    limit: 100,
    category: selectedFilter.value || undefined,
  })),
  watch: [selectedFilter],
})

const isLoading = computed(() => status.value === 'pending')
const images = computed(() => galleryRes.value?.data || [])

// Upload Modal State
const isUploadModalOpen = ref(false)
const selectedFiles = ref<File[]>([])
const filePreviews = ref<Array<{ file: File; preview: string; title: string; altText: string; isHeic?: boolean }>>([])
const uploadCategory = ref('MEDRESE_LIFE')
const uploadProgress = ref(0)
const isUploading = ref(false)

function openUploadModal() {
  selectedFiles.value = []
  filePreviews.value = []
  uploadProgress.value = 0
  isUploadModalOpen.value = true
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const files = Array.from(target.files)
  for (const f of files) {
    const ext = f.name.toLowerCase().split('.').pop() || ''
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif']
    const validMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/pjpeg',
      'image/jpg',
      'image/heic',
      'image/heif',
      'application/octet-stream',
    ]

    const isHeic = ext === 'heic' || ext === 'heif' || f.type.includes('heic') || f.type.includes('heif')

    if (!validExtensions.includes(ext) && !validMimes.includes(f.type)) {
      showToast(`'${f.name}' desteklenmeyen format. Yalnızca JPG, PNG, WEBP ve HEIC kabul edilir.`, 'error')
      continue
    }

    const preview = isHeic ? '' : URL.createObjectURL(f)
    const defaultTitle = f.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
    filePreviews.value.push({
      file: f,
      preview,
      title: defaultTitle,
      altText: defaultTitle,
      isHeic,
    })
  }
}

function removeFilePreview(index: number) {
  filePreviews.value.splice(index, 1)
}

async function handleUploadAll() {
  if (filePreviews.value.length === 0) {
    showToast('Lütfen en az bir görsel seçiniz.', 'error')
    return
  }

  isUploading.value = true
  uploadProgress.value = 10
  const total = filePreviews.value.length
  let successCount = 0

  for (let i = 0; i < total; i++) {
    const item = filePreviews.value[i]
    const fd = new FormData()
    fd.append('file', item.file)
    fd.append('folder', 'gallery')
    fd.append('altText', item.altText)

    try {
      // 1. Upload to Supabase Storage
      const uploadRes = await $fetch<{ success: boolean; url: string; path?: string }>('/api/upload', {
        method: 'POST',
        body: fd,
      })

      // 2. Insert into gallery database
      await $fetch('/api/gallery', {
        method: 'POST',
        body: {
          title: item.title,
          imageUrl: uploadRes.url,
          storagePath: uploadRes.path || null,
          category: uploadCategory.value,
          altText: item.altText,
        },
      })

      successCount++
      uploadProgress.value = Math.round(((i + 1) / total) * 100)
    } catch (err: unknown) {
      console.error('Yükleme hatası:', err)
      const e = err as { data?: { message?: string }; message?: string }
      showToast(`'${item.title}' yüklenemedi: ${e.data?.message || e.message}`, 'error')
    }
  }

  isUploading.value = false
  if (successCount > 0) {
    showToast(`${successCount} görsel başarıyla yüklendi ve galeriye eklendi.`, 'success')
    isUploadModalOpen.value = false
    await refreshGallery()
  }
}

// Delete Image
const isDeleteModalOpen = ref(false)
const imageToDelete = ref<GalleryItem | null>(null)
const isDeleting = ref(false)

function confirmDelete(img: GalleryItem) {
  imageToDelete.value = img
  isDeleteModalOpen.value = true
}

async function handleDelete() {
  if (!imageToDelete.value) return
  isDeleting.value = true
  try {
    await $fetch(`/api/gallery/${imageToDelete.value.id}`, {
      method: 'DELETE',
    })
    showToast('Görsel başarıyla silindi.', 'success')
    isDeleteModalOpen.value = false
    imageToDelete.value = null
    await refreshGallery()
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    showToast(e.data?.message || 'Silme işlemi başarısız.', 'error')
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="font-serif text-2xl sm:text-3xl font-bold text-navy-950">
          Galeri Yönetimi
        </h1>
        <p class="text-sm text-slate-500 mt-1 font-light">
          Medrese ve faaliyet fotoğraflarını yükleyin, kategorize edin ve yönetin.
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
        @click="openUploadModal"
      >
        <UploadCloud class="w-4 h-4" />
        <span>Çoklu Fotoğraf Yükle</span>
      </button>
    </div>

    <!-- Category Filters -->
    <div class="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs flex items-center gap-2 flex-wrap">
      <button
        type="button"
        :class="[
          'px-4 py-2 rounded-xl text-xs font-semibold transition-all',
          selectedFilter === '' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        ]"
        @click="selectedFilter = ''"
      >
        Tümü ({{ images.length }})
      </button>

      <button
        v-for="opt in categoryOptions"
        :key="opt.value"
        type="button"
        :class="[
          'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all',
          selectedFilter === opt.value ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        ]"
        @click="selectedFilter = opt.value"
      >
        {{ opt.label }}
      </button>
    </div>

    <!-- Images Grid -->
    <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="i in 8" :key="i" class="aspect-[4/3] rounded-2xl bg-slate-100 animate-pulse" />
    </div>

    <div v-else-if="images.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      <article
        v-for="img in images"
        :key="img.id"
        class="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div class="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            :src="img.imageUrl"
            :alt="img.altText || img.title"
            loading="lazy"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          >

          <!-- Category Badge -->
          <div class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-navy-950/80 text-white backdrop-blur-xs flex items-center gap-1">
            <Tag class="w-2.5 h-2.5 text-emerald-400" />
            <span>{{ categoryLabels[img.category] || img.category }}</span>
          </div>

          <!-- Delete Action Overlay -->
          <button
            type="button"
            class="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
            title="Görseli Sil"
            @click="confirmDelete(img)"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>

        <div class="p-3 bg-white">
          <p class="font-serif font-bold text-xs text-navy-950 truncate">
            {{ img.title }}
          </p>
          <p v-if="img.altText" class="text-[11px] text-slate-400 truncate mt-0.5">
            {{ img.altText }}
          </p>
        </div>
      </article>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-3xl p-16 text-center border border-slate-200/90 shadow-xs">
      <ImageIcon class="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <h3 class="font-serif text-lg font-bold text-navy-950 mb-1">Görsel Bulunamadı</h3>
      <p class="text-xs text-slate-500 font-light mb-4">Bu kategoriye henüz fotoğraf yüklenmemiş.</p>
      <button
        type="button"
        class="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold"
        @click="openUploadModal"
      >
        Fotoğraf Yükle
      </button>
    </div>

    <!-- Upload Modal -->
    <Teleport to="body">
      <div
        v-if="isUploadModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs overflow-y-auto"
        role="dialog"
      >
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 my-8 space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 class="font-serif text-xl sm:text-2xl font-bold text-navy-950">
              Çoklu Fotoğraf Yükle
            </h2>
            <button type="button" class="p-1 rounded-lg text-slate-400" @click="isUploadModalOpen = false">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-4">
            <!-- Category Selection -->
            <div>
              <label class="block text-xs font-semibold text-navy-950 mb-1">Galeri Kategorisi *</label>
              <select
                v-model="uploadCategory"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
              >
                <option v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <!-- Drag and Drop / File Input Box -->
            <label class="block border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-3xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/30">
              <UploadCloud class="w-10 h-10 text-emerald-700 mx-auto mb-2" />
              <p class="text-sm font-semibold text-navy-950">Fotoğrafları seçmek için tıklayın veya buraya sürükleyin</p>
              <p class="text-xs text-slate-400 mt-1">Desteklenen: JPG, PNG, WEBP, HEIC (Maksimum 10 MB)</p>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif,.HEIC,.HEIF"
                class="hidden"
                @change="handleFileSelect"
              >
            </label>

            <!-- Preview Selected Files List -->
            <div v-if="filePreviews.length > 0" class="space-y-3 max-h-60 overflow-y-auto pr-1">
              <div
                v-for="(item, idx) in filePreviews"
                :key="idx"
                class="p-3 rounded-2xl border border-slate-200 bg-white flex items-center gap-3"
              >
                <div
                  v-if="item.isHeic"
                  class="w-14 h-14 rounded-xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center shrink-0 text-amber-800 text-center p-1"
                >
                  <span class="text-[10px] font-bold tracking-wider">HEIC</span>
                  <span class="text-[8px] text-amber-600 leading-tight">JPEG Çıktı</span>
                </div>
                <img v-else :src="item.preview" class="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100">
                <div class="flex-1 space-y-1 min-w-0">
                  <input
                    v-model="item.title"
                    type="text"
                    placeholder="Başlık"
                    class="w-full px-2.5 py-1 text-xs border rounded-lg"
                  >
                  <input
                    v-model="item.altText"
                    type="text"
                    placeholder="Alt açıklama"
                    class="w-full px-2.5 py-1 text-[11px] border rounded-lg text-slate-500"
                  >
                </div>
                <button
                  type="button"
                  class="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                  @click="removeFilePreview(idx)"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Upload Progress Bar -->
            <div v-if="isUploading" class="space-y-1 pt-2">
              <div class="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Yükleniyor...</span>
                <span>{{ uploadProgress }}%</span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  class="h-full bg-emerald-700 transition-all duration-300"
                  :style="{ width: `${uploadProgress}%` }"
                />
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                :disabled="isUploading"
                @click="isUploadModalOpen = false"
              >
                Vazgeç
              </button>
              <button
                type="button"
                :disabled="isUploading || filePreviews.length === 0"
                class="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50"
                @click="handleUploadAll"
              >
                {{ isUploading ? 'Yükleniyor...' : `${filePreviews.length} Fotoğrafı Yükle` }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <AdminConfirmModal
      v-model="isDeleteModalOpen"
      title="Fotoğrafı Sil"
      :message="`'${imageToDelete?.title}' adlı fotoğrafı silmek istediğinize emin misiniz?`"
      confirm-text="Evet, Sil"
      danger
      :loading="isDeleting"
      @confirm="handleDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>
