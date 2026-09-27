<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Edit2, Trash2, FolderTree, X, CheckCircle, XCircle } from 'lucide-vue-next'
import AdminConfirmModal from '~/components/admin/AdminConfirmModal.vue'
import { useAdminToast } from '~/composables/useAdminToast'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useSeoMeta({
  title: 'Kategori Yönetimi — İki Kelam Yönetim',
})

interface CategoryItem {
  id: string
  name: string
  slug: string
  description?: string | null
  isActive: boolean
  _count?: {
    posts: number
  }
}

const { showToast } = useAdminToast()

const { data: catRes, status, refresh: refreshCategories } = await useFetch<{
  success: boolean
  data: CategoryItem[]
}>('/api/categories', {
  params: { all: 'true' },
})

const isLoading = computed(() => status.value === 'pending')
const categories = computed(() => catRes.value?.data || [])

// Modal state
const isModalOpen = ref(false)
const isEditing = ref(false)
const currentCatId = ref<string | null>(null)
const isSaving = ref(false)

const form = ref({
  name: '',
  slug: '',
  description: '',
  isActive: true,
})

function openCreateModal() {
  isEditing.value = false
  currentCatId.value = null
  form.value = {
    name: '',
    slug: '',
    description: '',
    isActive: true,
  }
  isModalOpen.value = true
}

function openEditModal(cat: CategoryItem) {
  isEditing.value = true
  currentCatId.value = cat.id
  form.value = {
    name: cat.name,
    slug: cat.slug,
    description: cat.description || '',
    isActive: cat.isActive,
  }
  isModalOpen.value = true
}

async function handleSave() {
  if (!form.value.name.trim()) {
    showToast('Kategori adı zorunludur.', 'error')
    return
  }

  isSaving.value = true
  try {
    if (isEditing.value && currentCatId.value) {
      await $fetch(`/api/categories/${currentCatId.value}`, {
        method: 'PUT',
        body: form.value,
      })
      showToast('Kategori güncellendi.', 'success')
    } else {
      await $fetch('/api/categories', {
        method: 'POST',
        body: form.value,
      })
      showToast('Yeni kategori oluşturuldu.', 'success')
    }
    isModalOpen.value = false
    await refreshCategories()
  } catch (err: unknown) {
    const e = err as { data?: { message?: string }; message?: string }
    showToast(e.data?.message || e.message || 'Kategori kaydedilemedi.', 'error')
  } finally {
    isSaving.value = false
  }
}

// Delete Confirmation
const isDeleteModalOpen = ref(false)
const catToDelete = ref<CategoryItem | null>(null)
const isDeleting = ref(false)

function confirmDelete(cat: CategoryItem) {
  catToDelete.value = cat
  isDeleteModalOpen.value = true
}

async function handleDelete() {
  if (!catToDelete.value) return
  isDeleting.value = true
  try {
    await $fetch(`/api/categories/${catToDelete.value.id}`, {
      method: 'DELETE',
    })
    showToast('Kategori silindi.', 'success')
    isDeleteModalOpen.value = false
    catToDelete.value = null
    await refreshCategories()
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    showToast(e.data?.message || 'Kategori silinemedi.', 'error')
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
          Kategori Yönetimi
        </h1>
        <p class="text-sm text-slate-500 mt-1 font-light">
          Faaliyet ve ilmi makale kategorilerini düzenleyin.
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
        @click="openCreateModal"
      >
        <Plus class="w-4 h-4" />
        <span>Yeni Kategori Ekle</span>
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div v-if="isLoading" class="p-8 space-y-4">
        <div v-for="i in 4" :key="i" class="h-12 bg-slate-100 rounded-xl animate-pulse" />
      </div>

      <div v-else-if="categories.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
              <th class="p-4 sm:px-6">Kategori Adı</th>
              <th class="p-4">Slug</th>
              <th class="p-4">Yazı Sayısı</th>
              <th class="p-4">Durum</th>
              <th class="p-4 sm:px-6 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="cat in categories" :key="cat.id" class="hover:bg-slate-50/80 transition-colors">
              <td class="p-4 sm:px-6">
                <div class="font-bold text-navy-950">{{ cat.name }}</div>
                <div v-if="cat.description" class="text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {{ cat.description }}
                </div>
              </td>
              <td class="p-4 font-mono text-xs text-slate-500">/{{ cat.slug }}</td>
              <td class="p-4 font-semibold text-navy-950">{{ cat._count?.posts || 0 }} yazı</td>
              <td class="p-4">
                <span
                  :class="[
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold',
                    cat.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  ]"
                >
                  <CheckCircle v-if="cat.isActive" class="w-3.5 h-3.5" />
                  <XCircle v-else class="w-3.5 h-3.5" />
                  <span>{{ cat.isActive ? 'Aktif' : 'Pasif' }}</span>
                </span>
              </td>
              <td class="p-4 sm:px-6 text-right space-x-2">
                <button
                  type="button"
                  class="p-2 inline-flex text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  @click="openEditModal(cat)"
                >
                  <Edit2 class="w-4 h-4" />
                </button>
                <button
                  type="button"
                  class="p-2 inline-flex text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  @click="confirmDelete(cat)"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="text-center py-16 px-4">
        <FolderTree class="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p class="text-slate-600 font-medium text-sm">Henüz kategori eklenmemiş.</p>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs"
        role="dialog"
      >
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 class="font-serif text-xl font-bold text-navy-950">
              {{ isEditing ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle' }}
            </h2>
            <button type="button" class="p-1 rounded-lg text-slate-400" @click="isModalOpen = false">
              <X class="w-5 h-5" />
            </button>
          </div>

          <form class="space-y-4" @submit.prevent="handleSave">
            <div>
              <label class="block text-xs font-semibold text-navy-950 mb-1">Kategori Adı *</label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="Örn: Çocuk Dersleri"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
              >
            </div>

            <div>
              <label class="block text-xs font-semibold text-navy-950 mb-1">Açıklama</label>
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Kategori hakkında kısa tanıtım..."
                class="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
              />
            </div>

            <div class="flex items-center gap-2 pt-2">
              <input
                id="cat-active"
                v-model="form.isActive"
                type="checkbox"
                class="w-4 h-4 rounded text-emerald-800 border-slate-300 focus:ring-emerald-700"
              >
              <label for="cat-active" class="text-xs font-semibold text-navy-950">Kategori Aktif ve Sitede Görünsün</label>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                @click="isModalOpen = false"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50"
              >
                {{ isSaving ? 'Kaydediliyor...' : 'Kaydet' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete Modal -->
    <AdminConfirmModal
      v-model="isDeleteModalOpen"
      title="Kategoriyi Sil"
      :message="`'${catToDelete?.name}' kategorisini silmek istediğinize emin misiniz? Bağlı yazılar kategoriye atanmamış duruma geçecektir.`"
      confirm-text="Evet, Sil"
      danger
      :loading="isDeleting"
      @confirm="handleDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>
