<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Plus,
  Edit2,
  Trash2,
  Compass,
  X,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Upload,
  Image as ImageIcon,
  FileText,
  ExternalLink,
  Loader2,
} from 'lucide-vue-next'
import AdminConfirmModal from '~/components/admin/AdminConfirmModal.vue'
import { useAdminToast } from '~/composables/useAdminToast'
import { slugify } from '~/utils'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useSeoMeta({
  title: 'Faaliyetler Yönetimi — İki Kelam Yönetim',
})

interface ActivityItem {
  id: string
  name: string
  slug: string
  description?: string | null
  shortDescription?: string | null
  image?: string | null
  icon?: string | null
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  _count?: {
    posts: number
  }
}

const { showToast } = useAdminToast()

const { data: actRes, status, refresh: refreshActivities } = await useFetch<{
  success: boolean
  data: ActivityItem[]
}>('/api/activities', {
  params: { all: 'true' },
})

const isLoading = computed(() => status.value === 'pending')
const activities = computed(() => actRes.value?.data || [])

// Modal state
const isModalOpen = ref(false)
const isEditing = ref(false)
const currentActId = ref<string | null>(null)
const isSaving = ref(false)
const isUploadingImage = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const form = ref({
  name: '',
  slug: '',
  shortDescription: '',
  description: '',
  image: '',
  icon: '',
  sortOrder: 0,
  isActive: true,
})

function openCreateModal() {
  isEditing.value = false
  currentActId.value = null
  const maxOrder = activities.value.length > 0
    ? Math.max(...activities.value.map(a => a.sortOrder || 0)) + 1
    : 1

  form.value = {
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    image: '',
    icon: '',
    sortOrder: maxOrder,
    isActive: true,
  }
  isModalOpen.value = true
}

function openEditModal(act: ActivityItem) {
  isEditing.value = true
  currentActId.value = act.id
  form.value = {
    name: act.name,
    slug: act.slug,
    shortDescription: act.shortDescription || '',
    description: act.description || '',
    image: act.image || '',
    icon: act.icon || '',
    sortOrder: act.sortOrder ?? 0,
    isActive: act.isActive,
  }
  isModalOpen.value = true
}

function handleNameInput() {
  if (!isEditing.value || !form.value.slug) {
    form.value.slug = slugify(form.value.name)
  }
}

// Image upload handler
async function handleImageSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]
  if (file.size > 10 * 1024 * 1024) {
    showToast('Görsel boyutu en fazla 10MB olabilir.', 'error')
    return
  }

  isUploadingImage.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'activities')

    const res = await $fetch<{ success: boolean; url: string }>('/api/upload', {
      method: 'POST',
      body: fd,
    })

    if (res.success && res.url) {
      form.value.image = res.url
      showToast('Kapak görseli yüklendi.', 'success')
    }
  } catch (err: unknown) {
    const e = err as { data?: { message?: string }; message?: string }
    showToast(e.data?.message || e.message || 'Görsel yüklenirken bir hata oluştu.', 'error')
  } finally {
    isUploadingImage.value = false
    if (fileInputRef.value) fileInputRef.value.value = ''
  }
}

function removeImage() {
  form.value.image = ''
}

async function handleSave() {
  if (!form.value.name.trim()) {
    showToast('Faaliyet başlığı zorunludur.', 'error')
    return
  }

  isSaving.value = true
  try {
    const payload = {
      name: form.value.name.trim(),
      slug: form.value.slug.trim() || undefined,
      shortDescription: form.value.shortDescription.trim() || null,
      description: form.value.description.trim() || null,
      image: form.value.image || null,
      icon: form.value.icon.trim() || null,
      sortOrder: Number(form.value.sortOrder) || 0,
      isActive: Boolean(form.value.isActive),
    }

    if (isEditing.value && currentActId.value) {
      await $fetch(`/api/activities/${currentActId.value}`, {
        method: 'PUT',
        body: payload,
      })
      showToast('Faaliyet güncellendi.', 'success')
    } else {
      await $fetch('/api/activities', {
        method: 'POST',
        body: payload,
      })
      showToast('Yeni faaliyet oluşturuldu.', 'success')
    }
    isModalOpen.value = false
    await refreshActivities()
  } catch (err: unknown) {
    const e = err as { data?: { message?: string }; message?: string }
    showToast(e.data?.message || e.message || 'Faaliyet kaydedilemedi.', 'error')
  } finally {
    isSaving.value = false
  }
}

// Quick toggle active state
async function toggleActive(act: ActivityItem) {
  try {
    await $fetch(`/api/activities/${act.id}`, {
      method: 'PUT',
      body: {
        isActive: !act.isActive,
      },
    })
    showToast(`Faaliyet ${!act.isActive ? 'aktif' : 'pasif'} yapıldı.`, 'success')
    await refreshActivities()
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    showToast(e.data?.message || 'Durum güncellenemedi.', 'error')
  }
}

// Quick reorder Up / Down
async function moveActivity(index: number, direction: 'up' | 'down') {
  const list = [...activities.value]
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= list.length) return

  const itemA = list[index]
  const itemB = list[targetIndex]

  // Swap sortOrder
  const orderA = itemA.sortOrder ?? index
  const orderB = itemB.sortOrder ?? targetIndex

  const newOrderA = orderA === orderB ? (direction === 'up' ? orderB - 1 : orderB + 1) : orderB
  const newOrderB = orderA

  try {
    await $fetch('/api/activities/reorder', {
      method: 'PATCH',
      body: {
        items: [
          { id: itemA.id, sortOrder: newOrderA },
          { id: itemB.id, sortOrder: newOrderB },
        ],
      },
    })
    await refreshActivities()
    showToast('Sıralama güncellendi.', 'success')
  } catch {
    showToast('Sıralama değiştirilemedi.', 'error')
  }
}

// Delete Confirmation
const isDeleteModalOpen = ref(false)
const actToDelete = ref<ActivityItem | null>(null)
const isDeleting = ref(false)

function confirmDelete(act: ActivityItem) {
  actToDelete.value = act
  isDeleteModalOpen.value = true
}

async function handleDelete() {
  if (!actToDelete.value) return
  isDeleting.value = true
  try {
    await $fetch(`/api/activities/${actToDelete.value.id}`, {
      method: 'DELETE',
    })
    showToast('Faaliyet silindi.', 'success')
    isDeleteModalOpen.value = false
    actToDelete.value = null
    await refreshActivities()
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    showToast(e.data?.message || 'Faaliyet silinemedi.', 'error')
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
          Faaliyetler Yönetimi
        </h1>
        <p class="text-sm text-slate-500 mt-1 font-light">
          Ziyaretçilerin gördüğü faaliyet kategorilerini, kapak görsellerini, sıralamayı ve içerikleri yönetin.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink
          to="/activities"
          target="_blank"
          class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
        >
          <ExternalLink class="w-4 h-4 text-slate-500" />
          <span>Siteyi Gör</span>
        </NuxtLink>

        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors"
          @click="openCreateModal"
        >
          <Plus class="w-4 h-4" />
          <span>Yeni Faaliyet Ekle</span>
        </button>
      </div>
    </div>

    <!-- Activities List / Table -->
    <div class="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="p-6 space-y-4">
        <div v-for="i in 4" :key="i" class="h-16 bg-slate-100 rounded-2xl animate-pulse" />
      </div>

      <!-- Empty State -->
      <div v-else-if="activities.length === 0" class="text-center py-16 px-4">
        <div class="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <Compass class="w-8 h-8 text-emerald-700" />
        </div>
        <h3 class="font-serif text-xl font-bold text-navy-950 mb-1">
          Kayıtlı Faaliyet Bulunamadı
        </h3>
        <p class="text-slate-500 text-xs max-w-sm mx-auto mb-5 font-light">
          Henüz bir faaliyet kategorisi tanımlanmamış. Yeni bir faaliyet ekleyerek başlayabilirsiniz.
        </p>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors"
          @click="openCreateModal"
        >
          <Plus class="w-4 h-4" />
          <span>İlk Faaliyeti Ekle</span>
        </button>
      </div>

      <!-- Activities Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold uppercase tracking-wider">
              <th class="py-3.5 px-4 w-14 text-center">Sıra</th>
              <th class="py-3.5 px-4">Görsel</th>
              <th class="py-3.5 px-4">Faaliyet Adı / Slug</th>
              <th class="py-3.5 px-4 hidden md:table-cell">Kısa Açıklama</th>
              <th class="py-3.5 px-4 text-center">İçerik Sayısı</th>
              <th class="py-3.5 px-4 text-center">Durum</th>
              <th class="py-3.5 px-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr
              v-for="(act, index) in activities"
              :key="act.id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <!-- Sort Order with Up/Down buttons -->
              <td class="py-4 px-4 text-center whitespace-nowrap">
                <div class="inline-flex items-center gap-1">
                  <span class="font-mono font-semibold text-slate-500 text-xs w-5 text-center">
                    {{ index + 1 }}
                  </span>
                  <div class="flex flex-col gap-0.5">
                    <button
                      type="button"
                      :disabled="index === 0"
                      class="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-20 disabled:hover:bg-transparent"
                      title="Yukarı taşı"
                      @click="moveActivity(index, 'up')"
                    >
                      <ArrowUp class="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      :disabled="index === activities.length - 1"
                      class="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-20 disabled:hover:bg-transparent"
                      title="Aşağı taşı"
                      @click="moveActivity(index, 'down')"
                    >
                      <ArrowDown class="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </td>

              <!-- Cover Image Thumbnail -->
              <td class="py-4 px-4 whitespace-nowrap">
                <div class="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                  <img
                    v-if="act.image"
                    :src="act.image"
                    :alt="act.name"
                    class="w-full h-full object-cover"
                  >
                  <ImageIcon v-else class="w-5 h-5 text-slate-400" />
                </div>
              </td>

              <!-- Name & Slug -->
              <td class="py-4 px-4">
                <div class="font-semibold text-navy-950 text-sm">
                  {{ act.name }}
                </div>
                <div class="text-[11px] text-slate-400 font-mono mt-0.5">
                  /activities/{{ act.slug }}
                </div>
              </td>

              <!-- Short Description -->
              <td class="py-4 px-4 hidden md:table-cell max-w-xs truncate text-slate-500 font-light">
                {{ act.shortDescription || act.description || '—' }}
              </td>

              <!-- Posts Count with Link to Manage Posts -->
              <td class="py-4 px-4 text-center whitespace-nowrap">
                <NuxtLink
                  :to="`/admin/posts?category=${act.id}`"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cream-100 hover:bg-cream-200 text-stone-700 font-medium transition-colors"
                  title="Bu faaliyete ait yazıları yönet"
                >
                  <FileText class="w-3.5 h-3.5 text-emerald-700" />
                  <span>{{ act._count?.posts || 0 }} Yazı</span>
                </NuxtLink>
              </td>

              <!-- Status Toggle -->
              <td class="py-4 px-4 text-center whitespace-nowrap">
                <button
                  type="button"
                  :class="[
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors',
                    act.isActive
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  ]"
                  @click="toggleActive(act)"
                >
                  <component :is="act.isActive ? CheckCircle : XCircle" class="w-3 h-3" />
                  <span>{{ act.isActive ? 'Aktif' : 'Pasif' }}</span>
                </button>
              </td>

              <!-- Actions -->
              <td class="py-4 px-4 text-right whitespace-nowrap">
                <div class="inline-flex items-center gap-1.5">
                  <NuxtLink
                    :to="`/activities/${act.slug}`"
                    target="_blank"
                    class="p-1.5 text-slate-400 hover:text-navy-950 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Public sayfayı gör"
                  >
                    <ExternalLink class="w-4 h-4" />
                  </NuxtLink>
                  <button
                    type="button"
                    class="p-1.5 text-slate-500 hover:text-emerald-800 rounded-lg hover:bg-emerald-50 transition-colors"
                    title="Düzenle"
                    @click="openEditModal(act)"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    class="p-1.5 text-slate-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                    title="Sil"
                    @click="confirmDelete(act)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs overflow-y-auto"
    >
      <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          class="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          @click="isModalOpen = false"
        >
          <X class="w-5 h-5" />
        </button>

        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
            <Compass class="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h2 class="font-serif text-xl font-bold text-navy-950">
              {{ isEditing ? 'Faaliyeti Düzenle' : 'Yeni Faaliyet Ekle' }}
            </h2>
            <p class="text-xs text-slate-500">
              Faaliyet kategorisi bilgilerini eksiksiz doldurunuz.
            </p>
          </div>
        </div>

        <form class="space-y-4" @submit.prevent="handleSave">
          <!-- Name -->
          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">
              Faaliyet Adı / Başlık *
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Örn: Çocuk Kur'an Kursları"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700"
              @input="handleNameInput"
            >
          </div>

          <!-- Slug -->
          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">
              URL Slug (Otomatik Üretilir)
            </label>
            <div class="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-600">
              <span class="text-slate-400 mr-1">/activities/</span>
              <input
                v-model="form.slug"
                type="text"
                placeholder="cocuk-kuran-kurslari"
                class="bg-transparent w-full focus:outline-none text-navy-950 font-semibold"
              >
            </div>
          </div>

          <!-- Short Description -->
          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">
              Kısa Açıklama (Kartlarda Gösterilir)
            </label>
            <textarea
              v-model="form.shortDescription"
              rows="2"
              placeholder="Çocuklarımızın yaşlarına uygun eğitimlerle Kur'an-ı Kerim ve temel dini bilgiler öğrenmelerine katkı sağlıyoruz."
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <!-- Detailed Description -->
          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">
              Detaylı Açıklama / Tanıtım
            </label>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="Faaliyet programımızın kapsamı, hedefleri ve tedrisat halkalarımızın detayları..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <!-- Cover Image Upload -->
          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1.5">
              Kapak Görseli
            </label>

            <!-- Image Preview Box -->
            <div v-if="form.image" class="mb-3 relative rounded-2xl overflow-hidden border border-slate-200 aspect-[16/9] bg-slate-100 max-h-48 group">
              <img
                :src="form.image"
                alt="Kapak Görseli"
                class="w-full h-full object-cover"
              >
              <div class="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-xl bg-white text-navy-950 text-xs font-semibold shadow-md hover:bg-slate-50"
                  @click="fileInputRef?.click()"
                >
                  Değiştir
                </button>
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-semibold shadow-md hover:bg-red-700"
                  @click="removeImage"
                >
                  Kaldır
                </button>
              </div>
            </div>

            <!-- Upload Button -->
            <div class="flex items-center gap-3">
              <input
                ref="fileInputRef"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                class="hidden"
                @change="handleImageSelect"
              >
              <button
                type="button"
                :disabled="isUploadingImage"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors disabled:opacity-50"
                @click="fileInputRef?.click()"
              >
                <Loader2 v-if="isUploadingImage" class="w-4 h-4 animate-spin text-emerald-800" />
                <Upload v-else class="w-4 h-4 text-slate-500" />
                <span>{{ form.image ? 'Kapak Görseli Değiştir' : 'Kapak Görseli Yükle' }}</span>
              </button>
              <span v-if="isUploadingImage" class="text-xs text-slate-500 animate-pulse">
                Görsel yükleniyor...
              </span>
            </div>
          </div>

          <!-- Sort Order & Active Switch -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label class="block text-xs font-semibold text-navy-950 mb-1">
                Sıralama Değeri
              </label>
              <input
                v-model.number="form.sortOrder"
                type="number"
                min="0"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
            </div>

            <div class="flex items-center pt-6">
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input
                  v-model="form.isActive"
                  type="checkbox"
                  class="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700 border-slate-300"
                >
                <span class="text-xs font-semibold text-navy-950">
                  Ziyaretçilere Açık (Aktif)
                </span>
              </label>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              @click="isModalOpen = false"
            >
              İptal
            </button>
            <button
              type="submit"
              :disabled="isSaving || isUploadingImage"
              class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors disabled:opacity-50"
            >
              <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
              <span>{{ isSaving ? 'Kaydediliyor...' : (isEditing ? 'Güncelle' : 'Kaydet') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <AdminConfirmModal
      :open="isDeleteModalOpen"
      title="Faaliyeti Sil"
      :message="`'${actToDelete?.name}' faaliyet kategorisini silmek istediğinize emin misiniz? Varsa bu faaliyete bağlı içerikler silinmez, sadece kategorisiz kalır.`"
      confirm-text="Evet, Sil"
      cancel-text="Vazgeç"
      danger
      :loading="isDeleting"
      @confirm="handleDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>
