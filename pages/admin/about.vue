<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  FileText,
  Compass,
  Eye,
  Heart,
  CheckCircle,
  Clock,
  BookOpen,
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  X,
  ExternalLink,
} from 'lucide-vue-next'
import { useAdminToast } from '~/composables/useAdminToast'
import RichTextEditor from '~/components/common/RichTextEditor.vue'

interface AdminItemRecord {
  id: string
  title?: string
  description?: string
  icon?: string
  image?: string | null
  year?: string
  question?: string
  answer?: string
  category?: string
  isActive?: boolean
  sortOrder?: number
}

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useSeoMeta({
  title: 'Biz Kimiz & Kurumsal İçerik Yönetimi — İki Kelam',
})

const { showToast } = useAdminToast()

// Data Fetch
const { data: aboutRes, refresh: refreshAbout } = await useFetch('/api/admin/about')

const pageData = computed(() => aboutRes.value?.data?.page || {})
const valuesList = computed(() => aboutRes.value?.data?.values || [])
const whyUsList = computed(() => aboutRes.value?.data?.whyUs || [])
const historyList = computed(() => aboutRes.value?.data?.history || [])
const servicesList = computed(() => aboutRes.value?.data?.services || [])
const faqsList = computed(() => aboutRes.value?.data?.faqs || [])

// Active Tab
type TabKey = 'general' | 'missionVision' | 'values' | 'whyUs' | 'history' | 'services' | 'faq'
const activeTab = ref<TabKey>('general')

const tabs = [
  { key: 'general' as TabKey, label: 'Genel Bilgiler', icon: FileText },
  { key: 'missionVision' as TabKey, label: 'Misyon & Vizyon', icon: Compass },
  { key: 'values' as TabKey, label: 'Değerlerimiz', icon: Heart, count: computed(() => valuesList.value.length) },
  { key: 'whyUs' as TabKey, label: 'Neden İki Kelam?', icon: CheckCircle, count: computed(() => whyUsList.value.length) },
  { key: 'history' as TabKey, label: 'Tarihçe', icon: Clock, count: computed(() => historyList.value.length) },
  { key: 'services' as TabKey, label: 'Hizmetlerimiz', icon: BookOpen, count: computed(() => servicesList.value.length) },
  { key: 'faq' as TabKey, label: 'Sıkça Sorulan Sorular', icon: HelpCircle, count: computed(() => faqsList.value.length) },
]

// 1. General & SEO Form State
const isSavingGeneral = ref(false)
const generalForm = ref({
  title: '',
  subtitle: '',
  intro: '',
  content: '',
  image: '',
  videoUrl: '',
  buttonText: '',
  buttonUrl: '',
  isActive: true,
  valuesActive: true,
  whyUsActive: true,
  historyActive: true,
  servicesActive: true,
  faqActive: true,
  seoTitle: '',
  seoDescription: '',
  seoOgImage: '',
  seoCanonical: '',
})

// 2. Mission & Vision Form State
const isSavingMissionVision = ref(false)
const missionVisionForm = ref({
  missionTitle: '',
  missionSubtitle: '',
  missionContent: '',
  missionIcon: 'Compass',
  missionActive: true,
  visionTitle: '',
  visionSubtitle: '',
  visionContent: '',
  visionIcon: 'Eye',
  visionActive: true,
})

// Initialize forms when data arrives
watch(
  pageData,
  (val) => {
    if (val) {
      generalForm.value = {
        title: val.title || 'Biz Kimiz?',
        subtitle: val.subtitle || '',
        intro: val.intro || '',
        content: val.content || '',
        image: val.image || '',
        videoUrl: val.videoUrl || '',
        buttonText: val.buttonText || 'Daha Fazla Bilgi',
        buttonUrl: val.buttonUrl || '/biz-kimiz',
        isActive: val.isActive !== undefined ? val.isActive : true,
        valuesActive: val.valuesActive !== undefined ? val.valuesActive : true,
        whyUsActive: val.whyUsActive !== undefined ? val.whyUsActive : true,
        historyActive: val.historyActive !== undefined ? val.historyActive : true,
        servicesActive: val.servicesActive !== undefined ? val.servicesActive : true,
        faqActive: val.faqActive !== undefined ? val.faqActive : true,
        seoTitle: val.seoTitle || '',
        seoDescription: val.seoDescription || '',
        seoOgImage: val.seoOgImage || '',
        seoCanonical: val.seoCanonical || '',
      }

      missionVisionForm.value = {
        missionTitle: val.missionTitle || 'Misyonumuz',
        missionSubtitle: val.missionSubtitle || '',
        missionContent: val.missionContent || '',
        missionIcon: val.missionIcon || 'Compass',
        missionActive: val.missionActive !== undefined ? val.missionActive : true,
        visionTitle: val.visionTitle || 'Vizyonumuz',
        visionSubtitle: val.visionSubtitle || '',
        visionContent: val.visionContent || '',
        visionIcon: val.visionIcon || 'Eye',
        visionActive: val.visionActive !== undefined ? val.visionActive : true,
      }
    }
  },
  { immediate: true }
)

// Save General & SEO
async function handleSaveGeneral() {
  isSavingGeneral.value = true
  try {
    const res = await $fetch<{ success: boolean; message: string }>('/api/admin/about', {
      method: 'PUT',
      body: generalForm.value,
    })
    showToast(res.message || 'Genel bilgiler başarıyla kaydedildi.', 'success')
    await refreshAbout()
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    showToast(e.data?.message || 'Kaydedilirken hata oluştu.', 'error')
  } finally {
    isSavingGeneral.value = false
  }
}

// Save Mission & Vision
async function handleSaveMissionVision() {
  isSavingMissionVision.value = true
  try {
    const res = await $fetch<{ success: boolean; message: string }>('/api/admin/about', {
      method: 'PUT',
      body: missionVisionForm.value,
    })
    showToast(res.message || 'Misyon ve Vizyon başarıyla kaydedildi.', 'success')
    await refreshAbout()
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    showToast(e.data?.message || 'Kaydedilirken hata oluştu.', 'error')
  } finally {
    isSavingMissionVision.value = false
  }
}

// ----------------------------------------------------
// Generic Item Modal (Create & Edit) State
// ----------------------------------------------------
const isItemModalOpen = ref(false)
const isSavingItem = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const currentItemType = ref<'value' | 'whyUs' | 'history' | 'service' | 'faq'>('value')

interface GenericItemForm {
  id?: string
  title?: string
  description?: string
  icon?: string
  image?: string
  year?: string
  question?: string
  answer?: string
  category?: string
  isActive?: boolean
  sortOrder?: number
}

const itemForm = ref<GenericItemForm>({
  title: '',
  description: '',
  icon: 'Heart',
  image: '',
  year: '',
  question: '',
  answer: '',
  category: 'Genel',
  isActive: true,
})

function openCreateModal(type: 'value' | 'whyUs' | 'history' | 'service' | 'faq') {
  currentItemType.value = type
  modalMode.value = 'create'
  itemForm.value = {
    title: '',
    description: '',
    icon: type === 'value' ? 'Heart' : type === 'whyUs' ? 'CheckCircle' : type === 'service' ? 'BookOpen' : 'Compass',
    image: '',
    year: new Date().getFullYear().toString(),
    question: '',
    answer: '',
    category: 'Genel',
    isActive: true,
  }
  isItemModalOpen.value = true
}

function openEditModal(type: 'value' | 'whyUs' | 'history' | 'service' | 'faq', item: AdminItemRecord) {
  currentItemType.value = type
  modalMode.value = 'edit'
  itemForm.value = {
    id: item.id,
    title: item.title || '',
    description: item.description || '',
    icon: item.icon || 'Heart',
    image: item.image || '',
    year: item.year || '',
    question: item.question || '',
    answer: item.answer || '',
    category: item.category || 'Genel',
    isActive: item.isActive !== undefined ? item.isActive : true,
    sortOrder: item.sortOrder,
  }
  isItemModalOpen.value = true
}

async function handleSaveItem() {
  isSavingItem.value = true
  try {
    if (modalMode.value === 'create') {
      const res = await $fetch<{ success: boolean; message: string }>('/api/admin/about/item', {
        method: 'POST',
        body: {
          type: currentItemType.value,
          ...itemForm.value,
        },
      })
      showToast(res.message || 'İçerik başarıyla eklendi.', 'success')
    } else {
      const res = await $fetch<{ success: boolean; message: string }>('/api/admin/about/item', {
        method: 'PUT',
        body: {
          type: currentItemType.value,
          ...itemForm.value,
        },
      })
      showToast(res.message || 'İçerik başarıyla güncellendi.', 'success')
    }
    isItemModalOpen.value = false
    await refreshAbout()
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    showToast(e.data?.message || 'İşlem başarısız.', 'error')
  } finally {
    isSavingItem.value = false
  }
}

// ----------------------------------------------------
// Delete Confirmation Modal
// ----------------------------------------------------
const isDeleteModalOpen = ref(false)
const itemToDelete = ref<{ type: string; id: string; name: string } | null>(null)
const isDeleting = ref(false)

function confirmDeleteItem(type: string, id: string, name: string) {
  itemToDelete.value = { type, id, name }
  isDeleteModalOpen.value = true
}

async function handleDeleteItem() {
  if (!itemToDelete.value) return
  isDeleting.value = true
  try {
    await $fetch('/api/admin/about/item', {
      method: 'DELETE',
      query: {
        type: itemToDelete.value.type,
        id: itemToDelete.value.id,
      },
    })
    showToast('İçerik başarıyla silindi.', 'success')
    isDeleteModalOpen.value = false
    itemToDelete.value = null
    await refreshAbout()
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    showToast(e.data?.message || 'Silme işlemi başarısız.', 'error')
  } finally {
    isDeleting.value = false
  }
}

// ----------------------------------------------------
// Active / Passive Toggle
// ----------------------------------------------------
async function toggleItemActive(type: string, id: string, currentStatus: boolean) {
  try {
    const res = await $fetch<{ success: boolean; message: string }>('/api/admin/about/toggle', {
      method: 'PATCH',
      body: {
        type,
        id,
        isActive: !currentStatus,
      },
    })
    showToast(res.message, 'success')
    await refreshAbout()
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    showToast(e.data?.message || 'Durum değiştirilemedi.', 'error')
  }
}

// ----------------------------------------------------
// Reorder (↑ / ↓)
// ----------------------------------------------------
async function moveItem(type: string, list: AdminItemRecord[], index: number, direction: 'up' | 'down') {
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= list.length) return

  const reordered = [...list]
  const temp = reordered[index]
  reordered[index] = reordered[targetIndex]
  reordered[targetIndex] = temp

  const payload = reordered.map((item, idx) => ({
    id: item.id,
    sortOrder: idx + 1,
  }))

  try {
    await $fetch('/api/admin/about/reorder', {
      method: 'PATCH',
      body: {
        type,
        items: payload,
      },
    })
    await refreshAbout()
    showToast('Sıralama güncellendi.', 'success')
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } }
    showToast(e.data?.message || 'Sıralama güncellenemedi.', 'error')
  }
}
</script>

<template>
  <div class="space-y-8 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="font-serif text-2xl sm:text-3xl font-bold text-navy-950">
          Biz Kimiz? — Kurumsal İçerik Yönetimi
        </h1>
        <p class="text-sm text-slate-500 mt-1 font-light">
          Tanıtım, misyon, vizyon, değerler, tarihçe, hizmetler ve sıkça sorulan soruları düzenleyin.
        </p>
      </div>

      <NuxtLink
        to="/biz-kimiz"
        target="_blank"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors shrink-0"
      >
        <span>Sayfayı Canlı Gör</span>
        <ExternalLink class="w-3.5 h-3.5" />
      </NuxtLink>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl overflow-x-auto border border-slate-200/70 select-none">
      <button
        v-for="t in tabs"
        :key="t.key"
        type="button"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap"
        :class="[
          activeTab === t.key
            ? 'bg-white text-navy-950 shadow-sm border border-slate-200'
            : 'text-slate-600 hover:text-navy-950 hover:bg-white/60',
        ]"
        @click="activeTab = t.key"
      >
        <component :is="t.icon" class="w-4 h-4" />
        <span>{{ t.label }}</span>
        <span
          v-if="t.count !== undefined"
          class="px-2 py-0.5 rounded-full text-[11px] font-bold"
          :class="activeTab === t.key ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'"
        >
          {{ t.count.value }}
        </span>
      </button>
    </div>

    <!-- TAB 1: GENEL BİLGİLER -->
    <div v-if="activeTab === 'general'" class="space-y-6">
      <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 class="font-serif text-xl font-bold text-navy-950">Ana Tanıtım & Giriş Bölümü</h2>
            <p class="text-xs text-slate-500 font-light mt-0.5">
              Sayfanın en üstünde yer alan ana başlık, giriş metni, video ve eylem butonu.
            </p>
          </div>
          <button
            type="button"
            :disabled="isSavingGeneral"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
            @click="handleSaveGeneral"
          >
            <Save class="w-4 h-4" />
            <span>{{ isSavingGeneral ? 'Kaydediliyor...' : 'Kaydet' }}</span>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">Sayfa Başlığı *</label>
            <input
              v-model="generalForm.title"
              type="text"
              required
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
            >
          </div>

          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">Alt Başlık (Slogan)</label>
            <input
              v-model="generalForm.subtitle"
              type="text"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
            >
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-navy-950 mb-1">Kısa Giriş Metni (Spot)</label>
          <textarea
            v-model="generalForm.intro"
            rows="3"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50 resize-y"
          />
        </div>

        <!-- Rich Text Detaylı İçerik -->
        <div>
          <label class="block text-xs font-semibold text-navy-950 mb-1">Detaylı Kurumsal İçerik</label>
          <RichTextEditor v-model="generalForm.content" placeholder="Biz Kimiz detaylı metnini buraya yazın..." />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">Görsel URL</label>
            <input
              v-model="generalForm.image"
              type="url"
              placeholder="https://images.unsplash.com/..."
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
            >
          </div>

          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">Tanıtım Video URL (YouTube)</label>
            <input
              v-model="generalForm.videoUrl"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
            >
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">Buton Metni</label>
            <input
              v-model="generalForm.buttonText"
              type="text"
              placeholder="Faaliyetlerimizi Keşfet"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
            >
          </div>

          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">Buton Hedef URL</label>
            <input
              v-model="generalForm.buttonUrl"
              type="text"
              placeholder="/activities"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
            >
          </div>
        </div>

        <!-- Section Toggles -->
        <div class="pt-6 border-t border-slate-100">
          <h3 class="text-xs font-bold text-navy-950 uppercase tracking-wider text-slate-500 mb-4">
            Bölüm Görünürlük Anahtarları (Aktif / Pasif)
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-medium">
            <label class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input v-model="generalForm.isActive" type="checkbox" class="w-4 h-4 text-emerald-800 rounded">
              <span>Biz Kimiz Bölümü</span>
            </label>
            <label class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input v-model="generalForm.valuesActive" type="checkbox" class="w-4 h-4 text-emerald-800 rounded">
              <span>Değerlerimiz Bölümü</span>
            </label>
            <label class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input v-model="generalForm.whyUsActive" type="checkbox" class="w-4 h-4 text-emerald-800 rounded">
              <span>Neden İki Kelam Bölümü</span>
            </label>
            <label class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input v-model="generalForm.historyActive" type="checkbox" class="w-4 h-4 text-emerald-800 rounded">
              <span>Medrese Tarihçesi</span>
            </label>
            <label class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input v-model="generalForm.servicesActive" type="checkbox" class="w-4 h-4 text-emerald-800 rounded">
              <span>Hizmetlerimiz Bölümü</span>
            </label>
            <label class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input v-model="generalForm.faqActive" type="checkbox" class="w-4 h-4 text-emerald-800 rounded">
              <span>Sıkça Sorulan Sorular</span>
            </label>
          </div>
        </div>

        <!-- SEO Ayarları -->
        <div class="pt-6 border-t border-slate-100 space-y-4">
          <h3 class="text-xs font-bold text-navy-950 uppercase tracking-wider text-slate-500">
            Arama Motoru Optimizasyonu (SEO)
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-xs font-semibold text-navy-950 mb-1">SEO Başlığı (Title)</label>
              <input
                v-model="generalForm.seoTitle"
                type="text"
                placeholder="Biz Kimiz? | İki Kelam"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
              >
            </div>
            <div>
              <label class="block text-xs font-semibold text-navy-950 mb-1">Canonical URL</label>
              <input
                v-model="generalForm.seoCanonical"
                type="text"
                placeholder="https://ikikelam.org.tr/biz-kimiz"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
              >
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">SEO Açıklaması (Meta Description)</label>
            <textarea
              v-model="generalForm.seoDescription"
              rows="2"
              class="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50 resize-none"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: MİSYON & VİZYON -->
    <div v-else-if="activeTab === 'missionVision'" class="space-y-6">
      <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-8">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 class="font-serif text-xl font-bold text-navy-950">Misyonumuz ve Vizyonumuz</h2>
            <p class="text-xs text-slate-500 font-light mt-0.5">
              İki Kelam'ın temel gayesi, hizmet anlayışı ve geleceğe yönelik hedefleri.
            </p>
          </div>
          <button
            type="button"
            :disabled="isSavingMissionVision"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
            @click="handleSaveMissionVision"
          >
            <Save class="w-4 h-4" />
            <span>{{ isSavingMissionVision ? 'Kaydediliyor...' : 'Kaydet' }}</span>
          </button>
        </div>

        <!-- MİSYON -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-serif text-lg font-bold text-navy-950 flex items-center gap-2">
              <Compass class="w-5 h-5 text-emerald-800" />
              <span>Misyonumuz</span>
            </h3>
            <label class="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input v-model="missionVisionForm.missionActive" type="checkbox" class="w-4 h-4 text-emerald-800 rounded">
              <span>Aktif</span>
            </label>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-xs font-semibold text-navy-950 mb-1">Misyon Başlığı</label>
              <input
                v-model="missionVisionForm.missionTitle"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
              >
            </div>
            <div>
              <label class="block text-xs font-semibold text-navy-950 mb-1">Misyon Kısa Açıklama</label>
              <input
                v-model="missionVisionForm.missionSubtitle"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
              >
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">Misyon Detaylı İçerik</label>
            <RichTextEditor v-model="missionVisionForm.missionContent" placeholder="Misyon detaylarını yazınız..." />
          </div>
        </div>

        <!-- VİZYON -->
        <div class="space-y-4 pt-6 border-t border-slate-100">
          <div class="flex items-center justify-between">
            <h3 class="font-serif text-lg font-bold text-navy-950 flex items-center gap-2">
              <Eye class="w-5 h-5 text-emerald-800" />
              <span>Vizyonumuz</span>
            </h3>
            <label class="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input v-model="missionVisionForm.visionActive" type="checkbox" class="w-4 h-4 text-emerald-800 rounded">
              <span>Aktif</span>
            </label>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-xs font-semibold text-navy-950 mb-1">Vizyon Başlığı</label>
              <input
                v-model="missionVisionForm.visionTitle"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
              >
            </div>
            <div>
              <label class="block text-xs font-semibold text-navy-950 mb-1">Vizyon Kısa Açıklama</label>
              <input
                v-model="missionVisionForm.visionSubtitle"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
              >
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">Vizyon Detaylı İçerik</label>
            <RichTextEditor v-model="missionVisionForm.visionContent" placeholder="Vizyon detaylarını yazınız..." />
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: DEĞERLERİMİZ -->
    <div v-else-if="activeTab === 'values'" class="space-y-6">
      <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 class="font-serif text-xl font-bold text-navy-950">Değerlerimiz</h2>
            <p class="text-xs text-slate-500 font-light mt-0.5">
              İki Kelam'ın rehber edindiği ahlaki ve ilmi prensipleri yönetin.
            </p>
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors"
            @click="openCreateModal('value')"
          >
            <Plus class="w-4 h-4" />
            <span>Yeni Değer Ekle</span>
          </button>
        </div>

        <div v-if="valuesList.length === 0" class="py-12 text-center text-slate-400">
          Henüz değer kaydı eklenmedi.
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="(val, idx) in valuesList"
            :key="val.id"
            class="p-5 rounded-2xl border transition-all flex flex-col justify-between"
            :class="val.isActive ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-50 border-slate-200/60 opacity-60'"
          >
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  {{ idx + 1 }}
                </span>
                <button
                  type="button"
                  class="px-2 py-0.5 rounded text-[11px] font-bold"
                  :class="val.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'"
                  @click="toggleItemActive('value', val.id, val.isActive)"
                >
                  {{ val.isActive ? 'Aktif' : 'Pasif' }}
                </button>
              </div>
              <h4 class="font-serif font-bold text-navy-950">{{ val.title }}</h4>
              <p class="text-xs text-slate-600 leading-relaxed font-light">{{ val.description }}</p>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  :disabled="idx === 0"
                  class="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30"
                  title="Yukarı Taşı"
                  @click="moveItem('value', valuesList, idx, 'up')"
                >
                  <ArrowUp class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  :disabled="idx === valuesList.length - 1"
                  class="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30"
                  title="Aşağı Taşı"
                  @click="moveItem('value', valuesList, idx, 'down')"
                >
                  <ArrowDown class="w-3.5 h-3.5" />
                </button>
              </div>

              <div class="flex items-center gap-1">
                <button
                  type="button"
                  class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                  title="Düzenle"
                  @click="openEditModal('value', val)"
                >
                  <Edit2 class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  class="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                  title="Sil"
                  @click="confirmDeleteItem('value', val.id, val.title)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: NEDEN İKİ KELAM? -->
    <div v-else-if="activeTab === 'whyUs'" class="space-y-6">
      <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 class="font-serif text-xl font-bold text-navy-950">Neden İki Kelam?</h2>
            <p class="text-xs text-slate-500 font-light mt-0.5">
              Ziyaretçiye yaklaşımımızı ve medrese metodolojimizin farklılıklarını anlatan kartlar.
            </p>
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors"
            @click="openCreateModal('whyUs')"
          >
            <Plus class="w-4 h-4" />
            <span>Yeni Madde Ekle</span>
          </button>
        </div>

        <div v-if="whyUsList.length === 0" class="py-12 text-center text-slate-400">
          Henüz kayıt eklenmedi.
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="(w, idx) in whyUsList"
            :key="w.id"
            class="p-6 rounded-2xl border transition-all flex flex-col justify-between"
            :class="w.isActive ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-50 border-slate-200/60 opacity-60'"
          >
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Özellik #{{ idx + 1 }}
                </span>
                <button
                  type="button"
                  class="px-2 py-0.5 rounded text-[11px] font-bold"
                  :class="w.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'"
                  @click="toggleItemActive('whyUs', w.id, w.isActive)"
                >
                  {{ w.isActive ? 'Aktif' : 'Pasif' }}
                </button>
              </div>
              <h4 class="font-serif text-lg font-bold text-navy-950">{{ w.title }}</h4>
              <p class="text-sm text-slate-600 leading-relaxed font-light">{{ w.description }}</p>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  :disabled="idx === 0"
                  class="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30"
                  @click="moveItem('whyUs', whyUsList, idx, 'up')"
                >
                  <ArrowUp class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  :disabled="idx === whyUsList.length - 1"
                  class="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30"
                  @click="moveItem('whyUs', whyUsList, idx, 'down')"
                >
                  <ArrowDown class="w-3.5 h-3.5" />
                </button>
              </div>

              <div class="flex items-center gap-1">
                <button
                  type="button"
                  class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                  @click="openEditModal('whyUs', w)"
                >
                  <Edit2 class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  class="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                  @click="confirmDeleteItem('whyUs', w.id, w.title)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 5: TARİHÇE -->
    <div v-else-if="activeTab === 'history'" class="space-y-6">
      <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 class="font-serif text-xl font-bold text-navy-950">Medresemizin Hikâyesi (Tarihçe)</h2>
            <p class="text-xs text-slate-500 font-light mt-0.5">
              İki Kelam'ın kuruluşundan günümüze zaman çizelgesi kilometre taşları.
            </p>
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors"
            @click="openCreateModal('history')"
          >
            <Plus class="w-4 h-4" />
            <span>Yeni Dönem Ekle</span>
          </button>
        </div>

        <div v-if="historyList.length === 0" class="py-12 text-center text-slate-400">
          Henüz tarihçe kaydı eklenmedi.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="(h, idx) in historyList"
            :key="h.id"
            class="p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            :class="h.isActive ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200/60 opacity-60'"
          >
            <div class="flex items-start gap-4">
              <span class="px-3 py-1 rounded-xl bg-emerald-800 text-gold-300 font-serif font-bold text-sm shrink-0">
                {{ h.year }}
              </span>
              <div>
                <h4 class="font-serif font-bold text-navy-950">{{ h.title }}</h4>
                <p class="text-xs text-slate-600 mt-0.5 leading-relaxed font-light">{{ h.description }}</p>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                class="px-2.5 py-1 rounded-lg text-xs font-bold"
                :class="h.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'"
                @click="toggleItemActive('history', h.id, h.isActive)"
              >
                {{ h.isActive ? 'Aktif' : 'Pasif' }}
              </button>

              <div class="flex items-center gap-0.5 border-l border-slate-200 pl-2">
                <button
                  type="button"
                  :disabled="idx === 0"
                  class="p-1.5 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30"
                  @click="moveItem('history', historyList, idx, 'up')"
                >
                  <ArrowUp class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  :disabled="idx === historyList.length - 1"
                  class="p-1.5 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30"
                  @click="moveItem('history', historyList, idx, 'down')"
                >
                  <ArrowDown class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 ml-1"
                  @click="openEditModal('history', h)"
                >
                  <Edit2 class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  class="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                  @click="confirmDeleteItem('history', h.id, h.title)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 6: HİZMETLERİMİZ -->
    <div v-else-if="activeTab === 'services'" class="space-y-6">
      <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 class="font-serif text-xl font-bold text-navy-950">Hizmetlerimiz</h2>
            <p class="text-xs text-slate-500 font-light mt-0.5">
              İki Kelam'ın yürüttüğü ders, eğitim, seminer ve kültürel faaliyet kartları.
            </p>
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors"
            @click="openCreateModal('service')"
          >
            <Plus class="w-4 h-4" />
            <span>Yeni Hizmet Ekle</span>
          </button>
        </div>

        <div v-if="servicesList.length === 0" class="py-12 text-center text-slate-400">
          Henüz hizmet kaydı eklenmedi.
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(s, idx) in servicesList"
            :key="s.id"
            class="p-5 rounded-2xl border transition-all flex flex-col justify-between"
            :class="s.isActive ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-50 border-slate-200/60 opacity-60'"
          >
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="w-8 h-8 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center font-bold text-xs border border-gold-200/60">
                  #{{ idx + 1 }}
                </span>
                <button
                  type="button"
                  class="px-2 py-0.5 rounded text-[11px] font-bold"
                  :class="s.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'"
                  @click="toggleItemActive('service', s.id, s.isActive)"
                >
                  {{ s.isActive ? 'Aktif' : 'Pasif' }}
                </button>
              </div>
              <h4 class="font-serif font-bold text-navy-950">{{ s.title }}</h4>
              <p class="text-xs text-slate-600 leading-relaxed font-light">{{ s.description }}</p>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  :disabled="idx === 0"
                  class="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30"
                  @click="moveItem('service', servicesList, idx, 'up')"
                >
                  <ArrowUp class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  :disabled="idx === servicesList.length - 1"
                  class="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30"
                  @click="moveItem('service', servicesList, idx, 'down')"
                >
                  <ArrowDown class="w-3.5 h-3.5" />
                </button>
              </div>

              <div class="flex items-center gap-1">
                <button
                  type="button"
                  class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                  @click="openEditModal('service', s)"
                >
                  <Edit2 class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  class="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                  @click="confirmDeleteItem('service', s.id, s.title)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 7: SIKÇA SORULAN SORULAR -->
    <div v-else-if="activeTab === 'faq'" class="space-y-6">
      <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 class="font-serif text-xl font-bold text-navy-950">Sıkça Sorulan Sorular (SSS)</h2>
            <p class="text-xs text-slate-500 font-light mt-0.5">
              Ziyaretçilerin en çok merak ettiği sorular ve cevaplarını yönetin.
            </p>
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors"
            @click="openCreateModal('faq')"
          >
            <Plus class="w-4 h-4" />
            <span>Yeni Soru Ekle</span>
          </button>
        </div>

        <div v-if="faqsList.length === 0" class="py-12 text-center text-slate-400">
          Henüz soru kaydı eklenmedi.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="(f, idx) in faqsList"
            :key="f.id"
            class="p-5 rounded-2xl border transition-all"
            :class="f.isActive ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200/60 opacity-60'"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="space-y-1">
                <span class="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {{ f.category || 'Genel' }}
                </span>
                <h4 class="font-serif font-bold text-navy-950 text-base">{{ f.question }}</h4>
                <p class="text-xs text-slate-600 leading-relaxed font-light">{{ f.answer }}</p>
              </div>

              <div class="flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  class="px-2.5 py-1 rounded-lg text-xs font-bold"
                  :class="f.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'"
                  @click="toggleItemActive('faq', f.id, f.isActive)"
                >
                  {{ f.isActive ? 'Aktif' : 'Pasif' }}
                </button>

                <div class="flex items-center gap-0.5 border-l border-slate-200 pl-2">
                  <button
                    type="button"
                    :disabled="idx === 0"
                    class="p-1.5 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30"
                    @click="moveItem('faq', faqsList, idx, 'up')"
                  >
                    <ArrowUp class="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    :disabled="idx === faqsList.length - 1"
                    class="p-1.5 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30"
                    @click="moveItem('faq', faqsList, idx, 'down')"
                  >
                    <ArrowDown class="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 ml-1"
                    @click="openEditModal('faq', f)"
                  >
                    <Edit2 class="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    class="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                    @click="confirmDeleteItem('faq', f.id, f.question)"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CREATE / EDIT MODAL -->
    <Teleport to="body">
      <div
        v-if="isItemModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs"
        @click.self="isItemModalOpen = false"
      >
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 class="font-serif text-xl font-bold text-navy-950">
              {{ modalMode === 'create' ? 'Yeni Ekle' : 'Düzenle' }}
            </h3>
            <button
              type="button"
              class="p-1.5 rounded-lg text-slate-400 hover:text-navy-950 hover:bg-slate-100"
              @click="isItemModalOpen = false"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <form class="space-y-4" @submit.prevent="handleSaveItem">
            <!-- If History, show Year input -->
            <div v-if="currentItemType === 'history'">
              <label class="block text-xs font-semibold text-navy-950 mb-1">Dönem / Yıl *</label>
              <input
                v-model="itemForm.year"
                type="text"
                required
                placeholder="Örn: 2024"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
              >
            </div>

            <!-- If FAQ, show Question & Category -->
            <div v-if="currentItemType === 'faq'" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-navy-950 mb-1">Soru *</label>
                <input
                  v-model="itemForm.question"
                  type="text"
                  required
                  placeholder="Sıkça sorulan soruyu yazınız..."
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
                >
              </div>

              <div>
                <label class="block text-xs font-semibold text-navy-950 mb-1">Kategori</label>
                <input
                  v-model="itemForm.category"
                  type="text"
                  placeholder="Genel, Dersler, Kayıt..."
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
                >
              </div>

              <div>
                <label class="block text-xs font-semibold text-navy-950 mb-1">Cevap *</label>
                <textarea
                  v-model="itemForm.answer"
                  rows="4"
                  required
                  placeholder="Ayrıntılı cevabı yazınız..."
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50 resize-y"
                />
              </div>
            </div>

            <!-- Standard Title & Description for other types -->
            <div v-if="currentItemType !== 'faq'" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-navy-950 mb-1">Başlık *</label>
                <input
                  v-model="itemForm.title"
                  type="text"
                  required
                  placeholder="Başlık girin..."
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
                >
              </div>

              <div>
                <label class="block text-xs font-semibold text-navy-950 mb-1">Açıklama *</label>
                <textarea
                  v-model="itemForm.description"
                  rows="3"
                  required
                  placeholder="Kısa açıklama yazın..."
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50 resize-y"
                />
              </div>

              <div v-if="currentItemType === 'history' || currentItemType === 'service'">
                <label class="block text-xs font-semibold text-navy-950 mb-1">Görsel URL (İsteğe Bağlı)</label>
                <input
                  v-model="itemForm.image"
                  type="url"
                  placeholder="https://..."
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
                >
              </div>
            </div>

            <!-- Active / Passive checkbox -->
            <div class="pt-2">
              <label class="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input v-model="itemForm.isActive" type="checkbox" class="w-4 h-4 text-emerald-800 rounded">
                <span>Bu içerik sitede yayında (aktif) olsun</span>
              </label>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                class="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                @click="isItemModalOpen = false"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                :disabled="isSavingItem"
                class="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
              >
                {{ isSavingItem ? 'Kaydediliyor...' : 'Kaydet' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- DELETE CONFIRMATION MODAL -->
    <Teleport to="body">
      <div
        v-if="isDeleteModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs"
        @click.self="isDeleteModalOpen = false"
      >
        <div class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
          <div class="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <Trash2 class="w-6 h-6" />
          </div>
          <h3 class="font-serif text-lg font-bold text-navy-950">
            İçeriği Silmek İstiyor musunuz?
          </h3>
          <p class="text-xs text-slate-500 leading-relaxed font-light">
            <strong>"{{ itemToDelete?.name }}"</strong> kaydı kalıcı olarak silinecektir. Bu işlem geri alınamaz.
          </p>
          <div class="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              @click="isDeleteModalOpen = false"
            >
              Vazgeç
            </button>
            <button
              type="button"
              :disabled="isDeleting"
              class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
              @click="handleDeleteItem"
            >
              {{ isDeleting ? 'Siliniyor...' : 'Evet, Sil' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
