<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  FileText,
  Calendar,
  Layers,
  X,
  CheckCircle,
  Clock,
} from 'lucide-vue-next'
import AdminConfirmModal from '~/components/admin/AdminConfirmModal.vue'
import { useAdminToast } from '~/composables/useAdminToast'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useSeoMeta({
  title: 'İçerik Yönetimi — İki Kelam Yönetim',
})

interface CategoryItem {
  id: string
  name: string
  slug: string
}

interface PostItem {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  coverImage?: string | null
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  publishedAt?: string | null
  createdAt: string
  categoryId?: string | null
  category?: CategoryItem | null
}

const { showToast } = useAdminToast()

// Data Fetching
const { data: postsRes, status: postsStatus, refresh: refreshPosts } = await useFetch<{
  success: boolean
  data: PostItem[]
}>('/api/posts', {
  params: { limit: 100 },
})

const { data: categoriesRes } = await useFetch<{
  success: boolean
  data: CategoryItem[]
}>('/api/categories')

const isLoading = computed(() => postsStatus.value === 'pending')
const posts = computed(() => postsRes.value?.data || [])
const categories = computed(() => categoriesRes.value?.data || [])

// Filtering & Search
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')

const filteredPosts = computed(() => {
  return posts.value.filter((post) => {
    const matchesSearch =
      !searchQuery.value ||
      post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesCategory =
      !selectedCategory.value || post.categoryId === selectedCategory.value

    const matchesStatus =
      !selectedStatus.value || post.status === selectedStatus.value

    return matchesSearch && matchesCategory && matchesStatus
  })
})

// Modal / Drawer state for Create & Edit
const isFormModalOpen = ref(false)
const isEditing = ref(false)
const currentPostId = ref<string | null>(null)
const isSaving = ref(false)

const form = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  categoryId: '',
  status: 'PUBLISHED' as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED',
  coverImage: '',
})

function openCreateModal() {
  isEditing.value = false
  currentPostId.value = null
  form.value = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    categoryId: categories.value[0]?.id || '',
    status: 'PUBLISHED',
    coverImage: '',
  }
  isFormModalOpen.value = true
}

function openEditModal(post: PostItem) {
  isEditing.value = true
  currentPostId.value = post.id
  form.value = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    content: post.content || '',
    categoryId: post.categoryId || '',
    status: post.status,
    coverImage: post.coverImage || '',
  }
  isFormModalOpen.value = true
}

async function handleSavePost() {
  if (!form.value.title.trim() || !form.value.content.trim()) {
    showToast('Lütfen başlık ve içerik alanlarını doldurunuz.', 'error')
    return
  }

  isSaving.value = true
  try {
    if (isEditing.value && currentPostId.value) {
      // Update
      await $fetch(`/api/posts/${currentPostId.value}`, {
        method: 'PUT',
        body: form.value,
      })
      showToast('İçerik başarıyla güncellendi.', 'success')
    } else {
      // Create
      await $fetch('/api/posts', {
        method: 'POST',
        body: form.value,
      })
      showToast('Yeni içerik başarıyla oluşturuldu.', 'success')
    }

    isFormModalOpen.value = false
    await refreshPosts()
  } catch (err: unknown) {
    const e = err as { data?: { message?: string }; message?: string }
    showToast(e.data?.message || e.message || 'Kayıt sırasında bir hata oluştu.', 'error')
  } finally {
    isSaving.value = false
  }
}

// Quick status toggle (Publish / Draft)
async function togglePostStatus(post: PostItem) {
  const newStatus = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
  try {
    await $fetch(`/api/posts/${post.id}`, {
      method: 'PUT',
      body: {
        status: newStatus,
        publishedAt: newStatus === 'PUBLISHED' ? new Date().toISOString() : null,
      },
    })
    showToast(
      newStatus === 'PUBLISHED' ? 'Yazı yayına alındı.' : 'Yazı taslağa çekildi.',
      'success'
    )
    await refreshPosts()
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    showToast(e.data?.message || 'Durum güncellenirken hata oluştu.', 'error')
  }
}

// Delete Confirmation
const isDeleteModalOpen = ref(false)
const postToDelete = ref<PostItem | null>(null)
const isDeleting = ref(false)

function confirmDelete(post: PostItem) {
  postToDelete.value = post
  isDeleteModalOpen.value = true
}

async function handleDelete() {
  if (!postToDelete.value) return
  isDeleting.value = true
  try {
    await $fetch(`/api/posts/${postToDelete.value.id}`, {
      method: 'DELETE',
    })
    showToast('İçerik başarıyla silindi.', 'success')
    isDeleteModalOpen.value = false
    postToDelete.value = null
    await refreshPosts()
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    showToast(e.data?.message || 'Silme işlemi başarısız.', 'error')
  } finally {
    isDeleting.value = false
  }
}

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
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="font-serif text-2xl sm:text-3xl font-bold text-navy-950">
          İçerik & Makale Yönetimi
        </h1>
        <p class="text-sm text-slate-500 mt-1 font-light">
          İlim meclisleri, ders notları ve faaliyet makalelerini yönetin.
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
        @click="openCreateModal"
      >
        <Plus class="w-4 h-4" />
        <span>Yeni İçerik Ekle</span>
      </button>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center gap-4">
      <!-- Search Input -->
      <div class="relative w-full sm:flex-1">
        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Başlık veya slug ile ara..."
          class="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
        >
      </div>

      <!-- Category Filter -->
      <select
        v-model="selectedCategory"
        class="w-full sm:w-48 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
      >
        <option value="">Tüm Kategoriler</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>

      <!-- Status Filter -->
      <select
        v-model="selectedStatus"
        class="w-full sm:w-40 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
      >
        <option value="">Tüm Durumlar</option>
        <option value="PUBLISHED">Yayında</option>
        <option value="DRAFT">Taslak</option>
      </select>
    </div>

    <!-- Table Container -->
    <div class="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="p-8 space-y-4">
        <div v-for="i in 5" :key="i" class="h-12 bg-slate-100 rounded-xl animate-pulse" />
      </div>

      <!-- Posts Table -->
      <div v-else-if="filteredPosts.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
              <th class="p-4 sm:px-6">Başlık</th>
              <th class="p-4">Kategori</th>
              <th class="p-4">Durum</th>
              <th class="p-4">Yayın Tarihi</th>
              <th class="p-4 sm:px-6 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="post in filteredPosts"
              :key="post.id"
              class="hover:bg-slate-50/80 transition-colors group"
            >
              <!-- Title & Excerpt -->
              <td class="p-4 sm:px-6 min-w-[240px]">
                <div class="font-serif font-bold text-navy-950 text-sm group-hover:text-emerald-900 transition-colors">
                  {{ post.title }}
                </div>
                <div class="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-xs">
                  /{{ post.slug }}
                </div>
              </td>

              <!-- Category -->
              <td class="p-4 whitespace-nowrap">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                  <Layers class="w-3 h-3 text-slate-400" />
                  <span>{{ post.category?.name || 'Genel' }}</span>
                </span>
              </td>

              <!-- Status -->
              <td class="p-4 whitespace-nowrap">
                <button
                  type="button"
                  :class="[
                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all',
                    post.status === 'PUBLISHED'
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  ]"
                  :title="post.status === 'PUBLISHED' ? 'Tıkla ve Taslağa Çek' : 'Tıkla ve Yayına Al'"
                  @click="togglePostStatus(post)"
                >
                  <CheckCircle v-if="post.status === 'PUBLISHED'" class="w-3.5 h-3.5" />
                  <Clock v-else class="w-3.5 h-3.5" />
                  <span>{{ post.status === 'PUBLISHED' ? 'Yayında' : 'Taslak' }}</span>
                </button>
              </td>

              <!-- Published Date -->
              <td class="p-4 whitespace-nowrap text-slate-500 font-light">
                <div class="flex items-center gap-1.5">
                  <Calendar class="w-3.5 h-3.5 text-slate-400" />
                  <span>{{ formatDate(post.publishedAt || post.createdAt) }}</span>
                </div>
              </td>

              <!-- Actions -->
              <td class="p-4 sm:px-6 whitespace-nowrap text-right space-x-2">
                <!-- Preview on Site -->
                <NuxtLink
                  :to="`/activities/${post.category?.slug || 'genel'}/${post.slug}`"
                  target="_blank"
                  class="p-2 inline-flex text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Sitede Görüntüle"
                >
                  <Eye class="w-4 h-4" />
                </NuxtLink>

                <!-- Edit -->
                <button
                  type="button"
                  class="p-2 inline-flex text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Düzenle"
                  @click="openEditModal(post)"
                >
                  <Edit2 class="w-4 h-4" />
                </button>

                <!-- Delete -->
                <button
                  type="button"
                  class="p-2 inline-flex text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sil"
                  @click="confirmDelete(post)"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 px-4">
        <FileText class="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p class="text-slate-600 font-medium text-sm">Arama kriterlerine uygun içerik bulunamadı.</p>
        <button
          type="button"
          class="mt-3 text-xs font-semibold text-emerald-800 hover:underline"
          @click="searchQuery = ''; selectedCategory = ''; selectedStatus = ''"
        >
          Filtreleri Temizle
        </button>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <Teleport to="body">
      <div
        v-if="isFormModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-slate-200 my-8 space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 class="font-serif text-xl sm:text-2xl font-bold text-navy-950">
              {{ isEditing ? 'İçeriği Düzenle' : 'Yeni İçerik Ekle' }}
            </h2>
            <button
              type="button"
              class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              @click="isFormModalOpen = false"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <form class="space-y-4" @submit.prevent="handleSavePost">
            <!-- Title -->
            <div>
              <label class="block text-xs font-semibold text-navy-950 mb-1">Başlık *</label>
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="Örn: Medrese Tedrisatında Hadis Usulü"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
              >
            </div>

            <!-- Slug & Category -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-navy-950 mb-1">Kategori *</label>
                <select
                  v-model="form.categoryId"
                  required
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
                >
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-navy-950 mb-1">Durum</label>
                <select
                  v-model="form.status"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
                >
                  <option value="PUBLISHED">Yayında</option>
                  <option value="DRAFT">Taslak</option>
                </select>
              </div>
            </div>

            <!-- Cover Image URL -->
            <div>
              <label class="block text-xs font-semibold text-navy-950 mb-1">Kapak Görseli URL</label>
              <input
                v-model="form.coverImage"
                type="url"
                placeholder="https://images.unsplash.com/..."
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
              >
            </div>

            <!-- Excerpt -->
            <div>
              <label class="block text-xs font-semibold text-navy-950 mb-1">Özet (Excerpt)</label>
              <textarea
                v-model="form.excerpt"
                rows="2"
                placeholder="Yazının kısa tanıtım özeti..."
                class="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
              />
            </div>

            <!-- Rich Content -->
            <div>
              <label class="block text-xs font-semibold text-navy-950 mb-1">İçerik (HTML / Metin) *</label>
              <textarea
                v-model="form.content"
                rows="8"
                required
                placeholder="<p>Yazı içeriğinizi HTML etiketleriyle birlikte buraya yazınız...</p>"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
              />
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                class="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                @click="isFormModalOpen = false"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors disabled:opacity-50"
              >
                {{ isSaving ? 'Kaydediliyor...' : 'Kaydet' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <AdminConfirmModal
      v-model="isDeleteModalOpen"
      title="İçeriği Sil"
      :message="`'${postToDelete?.title}' başlıklı yazıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`"
      confirm-text="Evet, Sil"
      danger
      :loading="isDeleting"
      @confirm="handleDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>
