<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Edit2, Trash2, Calendar, Clock, User, X, CheckCircle, XCircle } from 'lucide-vue-next'
import AdminConfirmModal from '~/components/admin/AdminConfirmModal.vue'
import { useAdminToast } from '~/composables/useAdminToast'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useSeoMeta({
  title: 'Haftalık Program Yönetimi — İki Kelam Yönetim',
})

interface ScheduleItem {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  lessonName: string
  teacher: string
  targetAudience?: string | null
  description?: string | null
  isActive: boolean
}

const { showToast } = useAdminToast()

const dayNames = ['', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']

const { data: scheduleRes, status, refresh: refreshSchedule } = await useFetch<{
  success: boolean
  data: ScheduleItem[]
}>('/api/schedule')

const isLoading = computed(() => status.value === 'pending')
const schedules = computed(() => scheduleRes.value?.data || [])

// Modal state
const isModalOpen = ref(false)
const isEditing = ref(false)
const currentId = ref<string | null>(null)
const isSaving = ref(false)

const form = ref({
  dayOfWeek: 1,
  startTime: '14:00',
  endTime: '16:00',
  lessonName: '',
  teacher: '',
  targetAudience: 'Umuma Açık',
  description: '',
  isActive: true,
})

function openCreateModal() {
  isEditing.value = false
  currentId.value = null
  form.value = {
    dayOfWeek: 1,
    startTime: '14:00',
    endTime: '16:00',
    lessonName: '',
    teacher: '',
    targetAudience: 'Umuma Açık',
    description: '',
    isActive: true,
  }
  isModalOpen.value = true
}

function openEditModal(item: ScheduleItem) {
  isEditing.value = true
  currentId.value = item.id
  form.value = {
    dayOfWeek: item.dayOfWeek,
    startTime: item.startTime,
    endTime: item.endTime,
    lessonName: item.lessonName,
    teacher: item.teacher,
    targetAudience: item.targetAudience || '',
    description: item.description || '',
    isActive: item.isActive,
  }
  isModalOpen.value = true
}

async function handleSave() {
  if (!form.value.lessonName.trim() || !form.value.teacher.trim()) {
    showToast('Ders adı ve müderris bilgisi zorunludur.', 'error')
    return
  }

  isSaving.value = true
  try {
    if (isEditing.value && currentId.value) {
      await $fetch(`/api/schedule/${currentId.value}`, {
        method: 'PUT',
        body: form.value,
      })
      showToast('Ders programı güncellendi.', 'success')
    } else {
      await $fetch('/api/schedule', {
        method: 'POST',
        body: form.value,
      })
      showToast('Yeni ders başarıyla eklendi.', 'success')
    }

    isModalOpen.value = false
    await refreshSchedule()
  } catch (err: unknown) {
    const e = err as { data?: { message?: string }; message?: string }
    showToast(e.data?.message || e.message || 'Kayıt başarısız.', 'error')
  } finally {
    isSaving.value = false
  }
}

// Delete Confirmation
const isDeleteModalOpen = ref(false)
const itemToDelete = ref<ScheduleItem | null>(null)
const isDeleting = ref(false)

function confirmDelete(item: ScheduleItem) {
  itemToDelete.value = item
  isDeleteModalOpen.value = true
}

async function handleDelete() {
  if (!itemToDelete.value) return
  isDeleting.value = true
  try {
    await $fetch(`/api/schedule/${itemToDelete.value.id}`, {
      method: 'DELETE',
    })
    showToast('Ders programdan silindi.', 'success')
    isDeleteModalOpen.value = false
    itemToDelete.value = null
    await refreshSchedule()
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
          Haftalık Program Yönetimi
        </h1>
        <p class="text-sm text-slate-500 mt-1 font-light">
          Medrese ders halkalarını, saatlerini ve müderris bilgilerini düzenleyin.
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
        @click="openCreateModal"
      >
        <Plus class="w-4 h-4" />
        <span>Yeni Ders Ekle</span>
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div v-if="isLoading" class="p-8 space-y-4">
        <div v-for="i in 4" :key="i" class="h-12 bg-slate-100 rounded-xl animate-pulse" />
      </div>

      <div v-else-if="schedules.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
              <th class="p-4 sm:px-6">Gün & Saat</th>
              <th class="p-4">Ders Adı</th>
              <th class="p-4">Müderris</th>
              <th class="p-4">Hedef Kitle</th>
              <th class="p-4">Durum</th>
              <th class="p-4 sm:px-6 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="item in schedules" :key="item.id" class="hover:bg-slate-50/80 transition-colors">
              <td class="p-4 sm:px-6 whitespace-nowrap">
                <div class="font-bold text-navy-950">{{ dayNames[item.dayOfWeek] }}</div>
                <div class="flex items-center gap-1 text-xs text-slate-400 mt-0.5 font-mono">
                  <Clock class="w-3 h-3 text-emerald-700" />
                  <span>{{ item.startTime }} - {{ item.endTime }}</span>
                </div>
              </td>
              <td class="p-4 min-w-[200px]">
                <div class="font-serif font-bold text-navy-950">{{ item.lessonName }}</div>
                <div v-if="item.description" class="text-xs text-slate-500 line-clamp-1 mt-0.5">
                  {{ item.description }}
                </div>
              </td>
              <td class="p-4 whitespace-nowrap font-medium text-slate-700">
                <div class="flex items-center gap-1.5">
                  <User class="w-3.5 h-3.5 text-slate-400" />
                  <span>{{ item.teacher }}</span>
                </div>
              </td>
              <td class="p-4 whitespace-nowrap text-xs text-slate-600">
                <span class="px-2 py-0.5 rounded-md bg-slate-100 font-medium">
                  {{ item.targetAudience || 'Umuma Açık' }}
                </span>
              </td>
              <td class="p-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold',
                    item.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  ]"
                >
                  <CheckCircle v-if="item.isActive" class="w-3.5 h-3.5" />
                  <XCircle v-else class="w-3.5 h-3.5" />
                  <span>{{ item.isActive ? 'Aktif' : 'Pasif' }}</span>
                </span>
              </td>
              <td class="p-4 sm:px-6 text-right space-x-2 whitespace-nowrap">
                <button
                  type="button"
                  class="p-2 inline-flex text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  @click="openEditModal(item)"
                >
                  <Edit2 class="w-4 h-4" />
                </button>
                <button
                  type="button"
                  class="p-2 inline-flex text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  @click="confirmDelete(item)"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="text-center py-16 px-4">
        <Calendar class="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p class="text-slate-600 font-medium text-sm">Henüz ders takvimi girilmemiş.</p>
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
              {{ isEditing ? 'Dersi Düzenle' : 'Yeni Ders Ekle' }}
            </h2>
            <button type="button" class="p-1 rounded-lg text-slate-400" @click="isModalOpen = false">
              <X class="w-5 h-5" />
            </button>
          </div>

          <form class="space-y-4" @submit.prevent="handleSave">
            <div>
              <label class="block text-xs font-semibold text-navy-950 mb-1">Ders Adı *</label>
              <input
                v-model="form.lessonName"
                type="text"
                required
                placeholder="Örn: Fıkıh ve Usûl-i Fıkıh"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
              >
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-navy-950 mb-1">Gün *</label>
                <select
                  v-model.number="form.dayOfWeek"
                  required
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
                >
                  <option v-for="d in [1, 2, 3, 4, 5, 6, 7]" :key="d" :value="d">
                    {{ dayNames[d] }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-navy-950 mb-1">Müderris *</label>
                <input
                  v-model="form.teacher"
                  type="text"
                  required
                  placeholder="Örn: Ahmet Hoca"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
                >
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-navy-950 mb-1">Başlangıç Saati *</label>
                <input
                  v-model="form.startTime"
                  type="text"
                  required
                  placeholder="14:00"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
                >
              </div>

              <div>
                <label class="block text-xs font-semibold text-navy-950 mb-1">Bitiş Saati *</label>
                <input
                  v-model="form.endTime"
                  type="text"
                  required
                  placeholder="16:00"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
                >
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-navy-950 mb-1">Hedef Kitle</label>
              <input
                v-model="form.targetAudience"
                type="text"
                placeholder="Örn: Umuma Açık, Medrese Talebeleri, Gençler"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
              >
            </div>

            <div>
              <label class="block text-xs font-semibold text-navy-950 mb-1">Açıklama</label>
              <textarea
                v-model="form.description"
                rows="2"
                placeholder="Dersin muhtevası hakkında kısa bilgi..."
                class="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
              />
            </div>

            <div class="flex items-center gap-2 pt-2">
              <input
                id="sched-active"
                v-model="form.isActive"
                type="checkbox"
                class="w-4 h-4 rounded text-emerald-800 border-slate-300 focus:ring-emerald-700"
              >
              <label for="sched-active" class="text-xs font-semibold text-navy-950">Ders Aktif ve Programda Görünsün</label>
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
      title="Dersi Sil"
      :message="`'${itemToDelete?.lessonName}' dersini programdan silmek istediğinize emin misiniz?`"
      confirm-text="Evet, Sil"
      danger
      :loading="isDeleting"
      @confirm="handleDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>
