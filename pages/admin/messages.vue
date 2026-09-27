<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Mail,
  MailOpen,
  Archive,
  Trash2,
  Eye,
  Search,
  X,
  Tag,
} from 'lucide-vue-next'
import AdminConfirmModal from '~/components/admin/AdminConfirmModal.vue'
import { useAdminToast } from '~/composables/useAdminToast'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useSeoMeta({
  title: 'Gelen Mesajlar — İki Kelam Yönetim',
})

interface ContactMessageItem {
  id: string
  name: string
  email: string
  phone?: string | null
  subject?: string | null
  message: string
  type: string
  status: 'UNREAD' | 'READ' | 'ARCHIVED' | 'REPLIED'
  createdAt: string
}

const { showToast } = useAdminToast()

const selectedStatus = ref<string>('')
const searchQuery = ref<string>('')

const { data: messagesRes, status: fetchStatus, refresh: refreshMessages } = await useFetch<{
  success: boolean
  data: ContactMessageItem[]
  unreadCount?: number
}>('/api/messages', {
  params: computed(() => ({
    status: selectedStatus.value || undefined,
    search: searchQuery.value || undefined,
    limit: 100,
  })),
  watch: [selectedStatus],
})

const isLoading = computed(() => fetchStatus.value === 'pending')
const messages = computed(() => messagesRes.value?.data || [])
const unreadCount = computed(() => messagesRes.value?.unreadCount ?? 0)

// Message Detail Modal
const isDetailModalOpen = ref(false)
const activeMessage = ref<ContactMessageItem | null>(null)

async function openDetail(msg: ContactMessageItem) {
  activeMessage.value = msg
  isDetailModalOpen.value = true

  // If message is UNREAD, mark as READ automatically
  if (msg.status === 'UNREAD') {
    await updateStatus(msg.id, 'READ', false)
  }
}

async function updateStatus(id: string, newStatus: ContactMessageItem['status'], showFeedback = true) {
  try {
    await $fetch(`/api/messages/${id}`, {
      method: 'PATCH',
      body: { status: newStatus },
    })

    if (activeMessage.value && activeMessage.value.id === id) {
      activeMessage.value.status = newStatus
    }

    if (showFeedback) {
      const labels: Record<string, string> = {
        READ: 'Mesaj okundu olarak işaretlendi.',
        UNREAD: 'Mesaj okunmadı olarak işaretlendi.',
        ARCHIVED: 'Mesaj arşivlendi.',
        REPLIED: 'Mesaj yanıtlandı olarak işaretlendi.',
      }
      showToast(labels[newStatus] || 'Durum güncellendi.', 'success')
    }

    await refreshMessages()
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    showToast(e.data?.message || 'Durum güncellenemedi.', 'error')
  }
}

// Delete Confirmation
const isDeleteModalOpen = ref(false)
const messageToDelete = ref<ContactMessageItem | null>(null)
const isDeleting = ref(false)

function confirmDelete(msg: ContactMessageItem) {
  messageToDelete.value = msg
  isDeleteModalOpen.value = true
}

async function handleDelete() {
  if (!messageToDelete.value) return
  isDeleting.value = true
  try {
    await $fetch(`/api/messages/${messageToDelete.value.id}`, {
      method: 'DELETE',
    })
    showToast('Mesaj silindi.', 'success')
    isDeleteModalOpen.value = false
    if (activeMessage.value?.id === messageToDelete.value.id) {
      isDetailModalOpen.value = false
    }
    messageToDelete.value = null
    await refreshMessages()
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    showToast(e.data?.message || 'Mesaj silinemedi.', 'error')
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
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

const typeLabels: Record<string, string> = {
  GENERAL: 'Genel Bilgi',
  COURSE_INQUIRY: 'Ders Başvurusu',
  DONATION: 'Bağış',
  VOLUNTEER: 'Gönüllülük',
  OTHER: 'Diğer',
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="font-serif text-2xl sm:text-3xl font-bold text-navy-950">
            Gelen Mesajlar
          </h1>
          <span
            v-if="unreadCount > 0"
            class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 animate-pulse"
          >
            {{ unreadCount }} Okunmamış
          </span>
        </div>
        <p class="text-sm text-slate-500 mt-1 font-light">
          Ziyaretçiler ve talebe adayları tarafından iletilen iletişim formları.
        </p>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center gap-4">
      <!-- Search Input -->
      <div class="relative w-full sm:flex-1">
        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="İsim, e-posta veya konu ile ara..."
          class="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
        >
      </div>

      <!-- Status Tabs -->
      <div class="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
        <button
          type="button"
          :class="[
            'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all',
            selectedStatus === '' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          ]"
          @click="selectedStatus = ''"
        >
          Tümü ({{ messages.length }})
        </button>

        <button
          type="button"
          :class="[
            'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all',
            selectedStatus === 'UNREAD' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          ]"
          @click="selectedStatus = 'UNREAD'"
        >
          Okunmamış
        </button>

        <button
          type="button"
          :class="[
            'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all',
            selectedStatus === 'READ' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          ]"
          @click="selectedStatus = 'READ'"
        >
          Okundu
        </button>

        <button
          type="button"
          :class="[
            'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all',
            selectedStatus === 'ARCHIVED' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          ]"
          @click="selectedStatus = 'ARCHIVED'"
        >
          Arşiv
        </button>
      </div>
    </div>

    <!-- Messages List / Table -->
    <div class="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div v-if="isLoading" class="p-8 space-y-4">
        <div v-for="i in 5" :key="i" class="h-12 bg-slate-100 rounded-xl animate-pulse" />
      </div>

      <div v-else-if="messages.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
              <th class="p-4 sm:px-6">Gönderen</th>
              <th class="p-4">Konu & Özet</th>
              <th class="p-4">Tür</th>
              <th class="p-4">Tarih</th>
              <th class="p-4 sm:px-6 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="msg in messages"
              :key="msg.id"
              :class="[
                'hover:bg-slate-50/80 transition-colors cursor-pointer',
                msg.status === 'UNREAD' ? 'bg-emerald-50/30 font-medium' : ''
              ]"
              @click="openDetail(msg)"
            >
              <!-- Sender -->
              <td class="p-4 sm:px-6 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <span
                    v-if="msg.status === 'UNREAD'"
                    class="w-2 h-2 rounded-full bg-red-500 shrink-0"
                    title="Okunmamış"
                  />
                  <div>
                    <div class="font-bold text-navy-950">{{ msg.name }}</div>
                    <div class="text-[11px] text-slate-400 mt-0.5">{{ msg.email }}</div>
                  </div>
                </div>
              </td>

              <!-- Subject & Excerpt -->
              <td class="p-4 min-w-[220px]">
                <div class="font-semibold text-navy-950 line-clamp-1">
                  {{ msg.subject || 'Konu Belirtilmemiş' }}
                </div>
                <div class="text-xs text-slate-500 line-clamp-1 mt-0.5 font-light">
                  {{ msg.message }}
                </div>
              </td>

              <!-- Type -->
              <td class="p-4 whitespace-nowrap">
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                  <Tag class="w-3 h-3 text-emerald-700" />
                  <span>{{ typeLabels[msg.type] || msg.type }}</span>
                </span>
              </td>

              <!-- Date -->
              <td class="p-4 whitespace-nowrap text-xs text-slate-400 font-light">
                {{ formatDate(msg.createdAt) }}
              </td>

              <!-- Actions -->
              <td class="p-4 sm:px-6 text-right space-x-1.5 whitespace-nowrap" @click.stop>
                <!-- Mark Read / Unread -->
                <button
                  type="button"
                  class="p-2 inline-flex text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                  :title="msg.status === 'UNREAD' ? 'Okundu İşaretle' : 'Okunmadı İşaretle'"
                  @click="updateStatus(msg.id, msg.status === 'UNREAD' ? 'READ' : 'UNREAD')"
                >
                  <MailOpen v-if="msg.status === 'UNREAD'" class="w-4 h-4" />
                  <Mail v-else class="w-4 h-4" />
                </button>

                <!-- Archive -->
                <button
                  v-if="msg.status !== 'ARCHIVED'"
                  type="button"
                  class="p-2 inline-flex text-slate-400 hover:text-amber-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Arşivle"
                  @click="updateStatus(msg.id, 'ARCHIVED')"
                >
                  <Archive class="w-4 h-4" />
                </button>

                <!-- View Detail -->
                <button
                  type="button"
                  class="p-2 inline-flex text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Detayı Görüntüle"
                  @click="openDetail(msg)"
                >
                  <Eye class="w-4 h-4" />
                </button>

                <!-- Delete -->
                <button
                  type="button"
                  class="p-2 inline-flex text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sil"
                  @click="confirmDelete(msg)"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="text-center py-16 px-4">
        <Mail class="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p class="text-slate-600 font-medium text-sm">Gelen mesaj bulunamadı.</p>
      </div>
    </div>

    <!-- Message Detail Modal -->
    <Teleport to="body">
      <div
        v-if="isDetailModalOpen && activeMessage"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs"
        role="dialog"
      >
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-6">
          <div class="flex items-start justify-between pb-4 border-b border-slate-100 gap-4">
            <div>
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
                {{ typeLabels[activeMessage.type] || activeMessage.type }}
              </span>
              <h2 class="font-serif text-xl sm:text-2xl font-bold text-navy-950">
                {{ activeMessage.subject || 'Konu Belirtilmemiş' }}
              </h2>
            </div>

            <button type="button" class="p-1 rounded-lg text-slate-400 hover:text-slate-600" @click="isDetailModalOpen = false">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Sender Details -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 text-xs">
            <div>
              <span class="text-slate-400 block font-light">Gönderen:</span>
              <strong class="font-semibold text-navy-950 mt-0.5 block">{{ activeMessage.name }}</strong>
            </div>

            <div>
              <span class="text-slate-400 block font-light">E-Posta:</span>
              <a :href="`mailto:${activeMessage.email}`" class="text-emerald-800 hover:underline font-medium mt-0.5 block truncate">
                {{ activeMessage.email }}
              </a>
            </div>

            <div>
              <span class="text-slate-400 block font-light">Telefon:</span>
              <a v-if="activeMessage.phone" :href="`tel:${activeMessage.phone}`" class="text-slate-800 font-medium mt-0.5 block">
                {{ activeMessage.phone }}
              </a>
              <span v-else class="text-slate-400 italic">Belirtilmemiş</span>
            </div>
          </div>

          <!-- Message Body -->
          <div class="space-y-2">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Mesaj Metni</span>
            <div class="p-5 rounded-2xl bg-cream-50/70 border border-cream-200/80 text-sm sm:text-base text-slate-800 leading-relaxed font-light whitespace-pre-wrap">
              {{ activeMessage.message }}
            </div>
          </div>

          <!-- Modal Footer: Status controls -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div class="flex items-center gap-2">
              <button
                type="button"
                :class="[
                  'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                  activeMessage.status === 'ARCHIVED'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                ]"
                @click="updateStatus(activeMessage.id, 'ARCHIVED')"
              >
                Arşivle
              </button>

              <button
                type="button"
                :class="[
                  'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                  activeMessage.status === 'UNREAD'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                ]"
                @click="updateStatus(activeMessage.id, 'UNREAD')"
              >
                Okunmadı Yap
              </button>

              <button
                type="button"
                class="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                @click="confirmDelete(activeMessage)"
              >
                Mesajı Sil
              </button>
            </div>

            <button
              type="button"
              class="px-5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              @click="isDetailModalOpen = false"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <AdminConfirmModal
      v-model="isDeleteModalOpen"
      title="Mesajı Sil"
      :message="`'${messageToDelete?.name}' tarafından gönderilen mesajı silmek istediğinize emin misiniz?`"
      confirm-text="Evet, Sil"
      danger
      :loading="isDeleting"
      @confirm="handleDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>
