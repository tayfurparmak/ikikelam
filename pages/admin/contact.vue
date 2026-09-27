<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Building2,
  Phone,
  MapPin,
  Map,
  Compass,
  Clock,
  Save,
  Loader2,
  ExternalLink,
  AlertCircle,
  Eye,
} from 'lucide-vue-next'
import { useAdminToast } from '~/composables/useAdminToast'
import { isGoogleMapsUrl } from '~/server/utils/validators'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useSeoMeta({
  title: 'İletişim Bilgileri Yönetimi — İki Kelam Yönetim',
})

interface ContactSettingsData {
  id: string
  organizationName: string
  description?: string | null
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  address?: string | null
  district?: string | null
  city?: string | null
  postalCode?: string | null
  googleMapsUrl?: string | null
  googleMapsEmbedUrl?: string | null
  transportationPublic?: string | null
  transportationPrivate?: string | null
  transportationNotes?: string | null
  visitDays?: string | null
  visitHours?: string | null
}

const { showToast } = useAdminToast()

const { data: settingsRes, status, refresh: refreshSettings } = await useFetch<{
  success: boolean
  data: ContactSettingsData
}>('/api/contact-settings')

const isLoading = computed(() => status.value === 'pending')
const isSaving = ref(false)

const form = ref<ContactSettingsData>({
  id: '',
  organizationName: '',
  description: '',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  district: '',
  city: '',
  postalCode: '',
  googleMapsUrl: '',
  googleMapsEmbedUrl: '',
  transportationPublic: '',
  transportationPrivate: '',
  transportationNotes: '',
  visitDays: '',
  visitHours: '',
})

// Initialize form from response
watch(
  () => settingsRes.value?.data,
  (newData) => {
    if (newData) {
      form.value = {
        id: newData.id,
        organizationName: newData.organizationName || '',
        description: newData.description || '',
        phone: newData.phone || '',
        whatsapp: newData.whatsapp || '',
        email: newData.email || '',
        address: newData.address || '',
        district: newData.district || '',
        city: newData.city || '',
        postalCode: newData.postalCode || '',
        googleMapsUrl: newData.googleMapsUrl || '',
        googleMapsEmbedUrl: newData.googleMapsEmbedUrl || '',
        transportationPublic: newData.transportationPublic || '',
        transportationPrivate: newData.transportationPrivate || '',
        transportationNotes: newData.transportationNotes || '',
        visitDays: newData.visitDays || '',
        visitHours: newData.visitHours || '',
      }
    }
  },
  { immediate: true }
)

// Safe Google Maps Embed URL validation
const isEmbedUrlValid = computed(() => {
  if (!form.value.googleMapsEmbedUrl) return true
  return isGoogleMapsUrl(form.value.googleMapsEmbedUrl)
})

async function handleSave() {
  if (!form.value.organizationName.trim()) {
    showToast('Dernek / Kurum adı zorunludur.', 'error')
    return
  }

  if (form.value.googleMapsEmbedUrl && !isGoogleMapsUrl(form.value.googleMapsEmbedUrl)) {
    showToast('Harita embed bağlantısı geçerli bir Google Maps URL olmalıdır.', 'error')
    return
  }

  if (form.value.googleMapsUrl && !isGoogleMapsUrl(form.value.googleMapsUrl)) {
    showToast('Google Maps bağlantısı geçerli bir Google Maps URL olmalıdır.', 'error')
    return
  }

  isSaving.value = true
  try {
    const res = await $fetch<{ success: boolean; message: string }>('/api/contact-settings', {
      method: 'PUT',
      body: form.value,
    })

    if (res.success) {
      showToast('İletişim bilgileri güncellendi.', 'success')
      await refreshSettings()
    }
  } catch (err: unknown) {
    const e = err as { data?: { message?: string }; message?: string }
    showToast(e.data?.message || e.message || 'Bilgiler kaydedilemedi.', 'error')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="space-y-6 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="font-serif text-2xl sm:text-3xl font-bold text-navy-950">
          İletişim Bilgileri Yönetimi
        </h1>
        <p class="text-sm text-slate-500 mt-1 font-light">
          Ziyaretçilerin /contact sayfasında ve site genelinde gördüğü dernek iletişim bilgilerini güncelleyin.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink
          to="/contact"
          target="_blank"
          class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
        >
          <ExternalLink class="w-4 h-4 text-slate-500" />
          <span>İletişim Sayfasını Gör</span>
        </NuxtLink>

        <button
          type="button"
          :disabled="isSaving || isLoading"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          @click="handleSave"
        >
          <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
          <Save v-else class="w-4 h-4" />
          <span>{{ isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet' }}</span>
        </button>
      </div>
    </div>

    <!-- Form Sections -->
    <form class="space-y-6" @submit.prevent="handleSave">
      <!-- 1. GENEL BİLGİLER -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
        <div class="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
            <Building2 class="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h2 class="font-serif text-lg font-bold text-navy-950">
              Genel Bilgiler
            </h2>
            <p class="text-xs text-slate-500 font-light">
              Kurum adı ve tanıtıcı kısa metin.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">
              Dernek / Kurum Adı *
            </label>
            <input
              v-model="form.organizationName"
              type="text"
              required
              placeholder="İki Kelam İlim ve Kültür Derneği"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
          </div>

          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">
              Kısa Açıklama (Tanıtım)
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="İlim, irfan ve hikmet yolunda talebe yetiştiren medrese müessesesi..."
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>
      </div>

      <!-- 2. İLETİŞİM BİLGİLERİ -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
        <div class="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
            <Phone class="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h2 class="font-serif text-lg font-bold text-navy-950">
              İletişim Bilgileri
            </h2>
            <p class="text-xs text-slate-500 font-light">
              Telefon, WhatsApp hattı ve e-posta adresi.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">
              Telefon Numarası
            </label>
            <input
              v-model="form.phone"
              type="text"
              placeholder="+90 532 000 00 00"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
          </div>

          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">
              WhatsApp Numarası
            </label>
            <input
              v-model="form.whatsapp"
              type="text"
              placeholder="+90 532 000 00 00"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
          </div>

          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">
              E-Posta Adresi
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="bilgi@ikikelam.org.tr"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
          </div>
        </div>
      </div>

      <!-- 3. ADRES BİLGİLERİ -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
        <div class="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
            <MapPin class="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h2 class="font-serif text-lg font-bold text-navy-950">
              Adres Bilgileri
            </h2>
            <p class="text-xs text-slate-500 font-light">
              Fiziki dernek merkezi ve konum detayları.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="sm:col-span-3">
            <label class="block text-xs font-semibold text-navy-950 mb-1">
              Açık Adres (Sokak, Bina, No)
            </label>
            <input
              v-model="form.address"
              type="text"
              placeholder="Ali Kuşçu Mah. Medrese Sok. No: 12"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
          </div>

          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">
              İlçe
            </label>
            <input
              v-model="form.district"
              type="text"
              placeholder="Fatih"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
          </div>

          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">
              İl (Şehir)
            </label>
            <input
              v-model="form.city"
              type="text"
              placeholder="İstanbul"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
          </div>

          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">
              Posta Kodu
            </label>
            <input
              v-model="form.postalCode"
              type="text"
              placeholder="34083"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
          </div>
        </div>
      </div>

      <!-- 4. HARİTA (GOOGLE MAPS) -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
        <div class="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
            <Map class="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h2 class="font-serif text-lg font-bold text-navy-950">
              Harita & Konum (Google Maps)
            </h2>
            <p class="text-xs text-slate-500 font-light">
              Güvenli Google Maps bağlantısı ve ziyaretçilere gösterilecek harita iframe URL'si.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">
              Google Maps Yönlendirme URL'si
            </label>
            <input
              v-model="form.googleMapsUrl"
              type="url"
              placeholder="https://maps.google.com/?q=Fatih+Istanbul"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
            <p class="text-[11px] text-slate-400 mt-1">
              "Haritada Aç" butonuna basıldığında açılacak bağlantı.
            </p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">
              Google Maps Embed (Iframe) URL'si
            </label>
            <input
              v-model="form.googleMapsEmbedUrl"
              type="url"
              placeholder="https://maps.google.com/maps?q=Fatih+Istanbul&output=embed"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
            <p v-if="!isEmbedUrlValid" class="text-[11px] text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle class="w-3 h-3" />
              <span>Güvenlik gereği yalnızca geçerli Google Maps domainlerine izin verilmektedir.</span>
            </p>
          </div>
        </div>

        <!-- Live Safe Map Preview Box -->
        <div v-if="form.googleMapsEmbedUrl && isEmbedUrlValid" class="pt-2">
          <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-2">
            <Eye class="w-4 h-4 text-emerald-700" />
            <span>Harita Önizleme:</span>
          </div>
          <div class="rounded-2xl overflow-hidden border border-slate-200 aspect-[16/8] max-h-56 bg-slate-100">
            <iframe
              :src="form.googleMapsEmbedUrl"
              class="w-full h-full border-0"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Harita Önizleme"
            />
          </div>
        </div>
      </div>

      <!-- 5. ULAŞIM REHBERİ -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
        <div class="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
            <Compass class="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h2 class="font-serif text-lg font-bold text-navy-950">
              Ulaşım Rehberi
            </h2>
            <p class="text-xs text-slate-500 font-light">
              Toplu taşıma, araçla ulaşım ve otopark açıklamaları.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">
              Toplu Taşıma Bilgisi (Metro, Tramvay, Otobüs)
            </label>
            <textarea
              v-model="form.transportationPublic"
              rows="2"
              placeholder="M1 Emniyet-Fatih durağına 8 dakika, T1 Fındıkzade durağına 10 dakika yürüme mesafesindedir..."
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">
              Özel Araç ve Otopark
            </label>
            <textarea
              v-model="form.transportationPrivate"
              rows="2"
              placeholder="Fatih Camii avlusu ve çevresindeki İSPARK açık/kapalı otopark alanlarını kullanabilirsiniz..."
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">
              Ek Ulaşım Açıklaması / Notlar
            </label>
            <input
              v-model="form.transportationNotes"
              type="text"
              placeholder="Cuma günleri ve kandil gecelerinde medrese çevresi araç trafiğine kısmen kapalı olabilir."
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
          </div>
        </div>
      </div>

      <!-- 6. ZİYARET SAATLERİ VE GÜNLERİ -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
        <div class="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
            <Clock class="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h2 class="font-serif text-lg font-bold text-navy-950">
              Çalışma ve Ziyaret Bilgileri
            </h2>
            <p class="text-xs text-slate-500 font-light">
              Haftalık ziyaret günleri ve saat aralıkları.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">
              Ziyaret Günleri
            </label>
            <input
              v-model="form.visitDays"
              type="text"
              placeholder="Pazartesi – Cumartesi"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
          </div>

          <div>
            <label class="block text-xs font-semibold text-navy-950 mb-1">
              Ziyaret Saatleri
            </label>
            <input
              v-model="form.visitHours"
              type="text"
              placeholder="10:00 – 20:00 (Namaz vakitleri hariç)"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
          </div>
        </div>
      </div>

      <!-- Bottom Save Action Bar -->
      <div class="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-lg flex items-center justify-between gap-4">
        <p class="text-xs text-slate-500 font-light hidden sm:block">
          Yaptığınız değişiklikler anında ziyaretçi iletişim sayfasına yansıtılacaktır.
        </p>

        <button
          type="submit"
          :disabled="isSaving || isLoading"
          class="ml-auto inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold shadow-md transition-colors disabled:opacity-50"
        >
          <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
          <Save v-else class="w-4 h-4" />
          <span>{{ isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>
