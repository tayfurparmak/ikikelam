<script setup lang="ts">
import { ref } from 'vue'
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Bus,
  Train,
  Car,
  Clock,
  ExternalLink,
} from 'lucide-vue-next'
import Container from '~/components/common/Container.vue'
import SectionTitle from '~/components/common/SectionTitle.vue'
import Button from '~/components/common/Button.vue'
import IconYoutube from '~/components/common/IconYoutube.vue'
import IconInstagram from '~/components/common/IconInstagram.vue'

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
  youtubeUrl?: string | null
  instagramUrl?: string | null
}

const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl || 'https://ikikelam.org.tr').replace(/\/+$/, '')

// Fetch dynamic contact settings from Database
const { data: contactRes } = await useFetch<{
  success: boolean
  data: ContactSettingsData
}>('/api/contact-settings')

const settings = computed(() => contactRes.value?.data || {
  id: '',
  organizationName: 'İki Kelam İlim ve Kültür Derneği',
  description: 'İki Kelam İlim ve Kültür Derneği adres, telefon, e-posta, Google Maps konum ve toplu taşıma ulaşım bilgileri.',
  phone: '+90 500 000 00 00',
  whatsapp: '+90 500 000 00 00',
  email: 'bilgi@ikikelam.org.tr',
  address: 'Ali Kuşçu Mah. Medrese Sok. No: 12',
  district: 'Fatih',
  city: 'İstanbul',
  postalCode: '34083',
  googleMapsUrl: 'https://maps.google.com/?q=Fatih+Istanbul',
  googleMapsEmbedUrl: 'https://maps.google.com/maps?q=Fatih+Istanbul&output=embed',
  transportationPublic: 'M1 Emniyet-Fatih durağına 8 dakika, T1 Fındıkzade durağına 10 dakika yürüme mesafesindedir.',
  transportationPrivate: 'Fatih Camii avlusu ve çevresindeki İSPARK açık/kapalı otopark alanlarını kullanabilirsiniz.',
  transportationNotes: 'Cuma günleri ve kandil gecelerinde medrese çevresi araç trafiğine kısmen kapalı olabilir.',
  visitDays: 'Pazartesi – Cumartesi',
  visitHours: '10:00 – 20:00 (Namaz vakitleri hariç)',
  youtubeUrl: 'https://www.youtube.com/@ikikelamresmi',
  instagramUrl: 'https://instagram.com/ikikelamresmi',
})

const phone = computed(() => settings.value.phone || '+90 500 000 00 00')
const whatsapp = computed(() => settings.value.whatsapp || phone.value)
const email = computed(() => settings.value.email || 'bilgi@ikikelam.org.tr')
const formattedAddress = computed(() => {
  const parts = [settings.value.address, settings.value.district, settings.value.city].filter(Boolean)
  return parts.join(', ') || 'Ali Kuşçu Mah. Medrese Sok. No: 12, Fatih / İstanbul'
})
const mapsUrl = computed(() => settings.value.googleMapsUrl || 'https://maps.google.com/?q=Fatih+Istanbul')

// Sanitize embed URL to only allow legitimate Google Maps domains
const safeEmbedUrl = computed(() => {
  const url = settings.value.googleMapsEmbedUrl
  if (!url) {
    return 'https://maps.google.com/maps?q=Fatih+Mosque+Istanbul&t=&z=15&ie=UTF8&iwloc=&output=embed'
  }
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.toLowerCase()
    if (
      host === 'maps.google.com' ||
      host.endsWith('.google.com') ||
      host === 'goo.gl' ||
      host === 'maps.app.goo.gl'
    ) {
      return url
    }
  } catch {
    // invalid URL format
  }
  return 'https://maps.google.com/maps?q=Fatih+Mosque+Istanbul&t=&z=15&ie=UTF8&iwloc=&output=embed'
})

useSeoMeta({
  title: 'İletişim & Konum — İki Kelam',
  description:
    'İki Kelam İlim ve Kültür Derneği adres, telefon, e-posta, Google Maps konum ve toplu taşıma ulaşım bilgileri.',
  ogTitle: 'İletişim & Konum — İki Kelam',
  ogDescription:
    'Fatih medresemizi ziyaret edebilir veya iletişim formumuz üzerinden bize sorularınızı iletebilirsiniz.',
  ogType: 'website',
  ogUrl: `${siteUrl}/contact`,
  ogImage: `${siteUrl}/logo.svg`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'İletişim & Konum — İki Kelam',
  twitterDescription:
    'Fatih medresemizi ziyaret edebilir veya iletişim formumuz üzerinden bize sorularınızı iletebilirsiniz.',
  twitterImage: `${siteUrl}/logo.svg`,
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/contact` }],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Place',
          name: settings.value.organizationName || 'İki Kelam Medresesi',
          address: {
            '@type': 'PostalAddress',
            streetAddress: settings.value.address || 'Ali Kuşçu Mah. Medrese Sok. No: 12',
            addressLocality: settings.value.district || 'Fatih',
            addressRegion: settings.value.city || 'İstanbul',
            postalCode: settings.value.postalCode || '34083',
            addressCountry: 'TR',
          },
          telephone: phone.value,
        })
      ),
    },
  ],
})

// Contact form state
const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  type: 'GENERAL',
  message: '',
  website: '', // Honeypot spam trap
})

const contactTypes = [
  { value: 'GENERAL', label: 'Genel Danışma & Bilgi' },
  { value: 'COURSE_INQUIRY', label: 'Ders & Kurs Başvurusu' },
  { value: 'DONATION', label: 'Bağış & Hayrî Destek' },
  { value: 'VOLUNTEER', label: 'Gönüllülük & Hizmet' },
  { value: 'OTHER', label: 'Diğer Meseleler' },
]

const isSubmitting = ref(false)
const isSuccess = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

async function handleSubmit() {
  if (isSubmitting.value) return

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const res = await $fetch<{ success: boolean; message: string }>('/api/contact', {
      method: 'POST',
      body: {
        name: form.value.name.trim(),
        email: form.value.email.trim(),
        phone: form.value.phone.trim() || undefined,
        subject: form.value.subject.trim() || undefined,
        type: form.value.type,
        message: form.value.message.trim(),
        website: form.value.website, // honeypot
      },
    })

    if (res.success) {
      isSuccess.value = true
      successMessage.value = res.message || 'Mesajınız başarıyla iletildi. En kısa sürede dönüş sağlanacaktır.'
      form.value = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        type: 'GENERAL',
        message: '',
        website: '',
      }
    }
  } catch (err: unknown) {
    const fetchErr = err as { data?: { message?: string }; message?: string }
    errorMessage.value =
      fetchErr.data?.message || fetchErr.message || 'Mesaj gönderilirken bir hata oluştu. Lütfen bilgilerinizi kontrol ediniz.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-warm-white py-12 sm:py-20">
    <Container size="xl">
      <!-- Section Header -->
      <SectionTitle
        badge="Bize Ulaşın"
        title="İletişim ve Ziyaret"
        subtitle="Medresemizi ziyaret etmek, derslerimiz hakkında detaylı bilgi almak veya talebe destek programlarımıza katılmak için bizimle iletişime geçebilirsiniz."
        align="center"
      />

      <div class="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- Left: Contact Details & Transportation (lg:col-span-5) -->
        <div class="lg:col-span-5 space-y-6">
          <!-- Main Info Card -->
          <div class="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200/90 shadow-xs space-y-6">
            <h2 class="font-serif text-2xl font-bold text-navy-950">
              {{ settings.organizationName || 'Dernek Merkezimiz' }}
            </h2>

            <div class="space-y-5 text-sm">
              <!-- Address -->
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                  <MapPin class="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 class="font-semibold text-navy-950">Adres</h3>
                  <p class="text-slate-600 mt-0.5 leading-relaxed">{{ formattedAddress }}</p>
                  <a
                    :href="mapsUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 mt-1 text-xs text-emerald-800 font-semibold hover:underline"
                  >
                    <span>Google Haritalar'da Aç</span>
                    <ExternalLink class="w-3 h-3" />
                  </a>
                </div>
              </div>

              <!-- Phone / WhatsApp -->
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Phone class="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 class="font-semibold text-navy-950">Telefon & WhatsApp</h3>
                  <div class="space-y-0.5 mt-0.5">
                    <a :href="`tel:${phone}`" class="text-slate-600 hover:text-emerald-800 block">
                      {{ phone }}
                    </a>
                    <a
                      v-if="whatsapp && whatsapp !== phone"
                      :href="`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-xs text-emerald-700 hover:underline block"
                    >
                      WhatsApp: {{ whatsapp }}
                    </a>
                  </div>
                </div>
              </div>

              <!-- Email -->
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Mail class="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 class="font-semibold text-navy-950">E-Posta</h3>
                  <a :href="`mailto:${email}`" class="text-slate-600 hover:text-emerald-800 mt-0.5 block">
                    {{ email }}
                  </a>
                </div>
              </div>

              <!-- Working / Visit Hours -->
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Clock class="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 class="font-semibold text-navy-950">Ziyaret Saatleri</h3>
                  <p class="text-slate-600 mt-0.5">
                    <span v-if="settings.visitDays" class="font-medium text-slate-700">{{ settings.visitDays }}: </span>
                    <span>{{ settings.visitHours || '10:00 – 20:00 (Namaz vakitleri hariç)' }}</span>
                  </p>
                </div>
              </div>

              <!-- Sosyal Medya -->
              <div class="pt-4 border-t border-cream-200">
                <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Bizi Takip Edin</h4>
                <div class="flex flex-wrap items-center gap-2.5">
                  <a
                    :href="settings.youtubeUrl || 'https://www.youtube.com/@ikikelamresmi'"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="İki Kelam YouTube kanalını ziyaret et"
                    class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 transition-colors"
                  >
                    <IconYoutube class="w-4 h-4 text-red-600" />
                    <span>YouTube</span>
                  </a>
                  <a
                    :href="settings.instagramUrl || 'https://instagram.com/ikikelamresmi'"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="İki Kelam Instagram hesabını ziyaret et"
                    class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200/60 transition-colors"
                  >
                    <IconInstagram class="w-4 h-4 text-pink-600" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Transportation Guide Card -->
          <div class="bg-cream-50/80 p-6 sm:p-8 rounded-3xl border border-cream-200/90 shadow-xs space-y-4">
            <h3 class="font-serif text-xl font-bold text-navy-950">
              Nasıl Ulaşabilirsiniz?
            </h3>

            <div class="space-y-3.5 text-xs sm:text-sm text-slate-600 font-light">
              <div v-if="settings.transportationPublic" class="flex items-start gap-3">
                <Train class="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <strong class="font-semibold text-navy-900">Toplu Taşıma:</strong>
                  <span class="ml-1">{{ settings.transportationPublic }}</span>
                </div>
              </div>
              <div v-else class="flex items-start gap-3">
                <Train class="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <strong class="font-semibold text-navy-900">Metro / Tramvay:</strong>
                  M1 Emniyet-Fatih durağına 8 dakika, T1 Fındıkzade durağına 10 dakika yürüme mesafesindedir.
                </div>
              </div>

              <div v-if="settings.transportationPrivate" class="flex items-start gap-3">
                <Car class="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <strong class="font-semibold text-navy-900">Özel Araç & Otopark:</strong>
                  <span class="ml-1">{{ settings.transportationPrivate }}</span>
                </div>
              </div>
              <div v-else class="flex items-start gap-3">
                <Car class="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <strong class="font-semibold text-navy-900">Özel Araç & Otopark:</strong>
                  Fatih Camii avlusu ve çevresindeki İSPARK açık/kapalı otopark alanlarını kullanabilirsiniz.
                </div>
              </div>

              <div v-if="settings.transportationNotes" class="flex items-start gap-3">
                <Bus class="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <strong class="font-semibold text-navy-900">Ulaşım Notu:</strong>
                  <span class="ml-1">{{ settings.transportationNotes }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Google Maps Interactive Preview Box (Safe & Dynamic) -->
          <div class="rounded-3xl overflow-hidden border border-cream-200 shadow-xs bg-slate-100 aspect-[16/9] relative">
            <iframe
              :src="safeEmbedUrl"
              class="w-full h-full border-0"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="İki Kelam Derneği Harita Konumu"
            />
          </div>
        </div>

        <!-- Right: Contact Form (lg:col-span-7) -->
        <div class="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-cream-200 shadow-xs">
          <div class="mb-6">
            <h2 class="font-serif text-2xl sm:text-3xl font-bold text-navy-950 mb-2">
              Bize Mesaj Gönderin
            </h2>
            <p class="text-slate-600 text-sm font-light">
              Ders kayıtları, ilmi meclisler, gönüllülük veya derneğimizle ilgili her türlü soru için formu doldurabilirsiniz.
            </p>
          </div>

          <!-- Success Alert -->
          <div
            v-if="isSuccess"
            class="mb-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-sm flex items-start gap-3.5 animate-in fade-in"
          >
            <CheckCircle class="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p class="font-semibold">Mesajınız Alındı</p>
              <p class="text-xs text-emerald-800 mt-0.5">{{ successMessage }}</p>
              <button
                type="button"
                class="mt-2 text-xs font-semibold text-emerald-900 underline"
                @click="isSuccess = false"
              >
                Yeni bir mesaj gönder
              </button>
            </div>
          </div>

          <!-- Error Alert -->
          <div
            v-if="errorMessage"
            class="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-950 text-sm flex items-start gap-3 animate-in fade-in"
          >
            <AlertCircle class="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
            <div>
              <p class="font-semibold">Gönderim Başarısız</p>
              <p class="text-xs text-red-800 mt-0.5">{{ errorMessage }}</p>
            </div>
          </div>

          <form class="space-y-4" @submit.prevent="handleSubmit">
            <!-- Honeypot Field (Bot trap) -->
            <input
              v-model="form.website"
              type="text"
              name="website"
              tabindex="-1"
              autocomplete="off"
              style="display: none !important;"
              aria-hidden="true"
            >

            <!-- Name & Email -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="contact-name" class="block text-xs font-semibold text-navy-950 mb-1">
                  Adınız Soyadınız *
                </label>
                <input
                  id="contact-name"
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="Ahmet Yılmaz"
                  class="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/50 focus:border-emerald-700 transition-all"
                >
              </div>

              <div>
                <label for="contact-email" class="block text-xs font-semibold text-navy-950 mb-1">
                  E-Posta Adresiniz *
                </label>
                <input
                  id="contact-email"
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="ahmet@example.com"
                  class="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/50 focus:border-emerald-700 transition-all"
                >
              </div>
            </div>

            <!-- Phone & Type -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="contact-phone" class="block text-xs font-semibold text-navy-950 mb-1">
                  Telefon Numaranız
                </label>
                <input
                  id="contact-phone"
                  v-model="form.phone"
                  type="tel"
                  placeholder="+90 5xx xxx xx xx"
                  class="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/50 focus:border-emerald-700 transition-all"
                >
              </div>

              <div>
                <label for="contact-type" class="block text-xs font-semibold text-navy-950 mb-1">
                  İletişim Türü
                </label>
                <select
                  id="contact-type"
                  v-model="form.type"
                  class="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/50 focus:border-emerald-700 transition-all"
                >
                  <option v-for="t in contactTypes" :key="t.value" :value="t.value">
                    {{ t.label }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Subject -->
            <div>
              <label for="contact-subject" class="block text-xs font-semibold text-navy-950 mb-1">
                Konu Başlığı
              </label>
              <input
                id="contact-subject"
                v-model="form.subject"
                type="text"
                placeholder="Örn: Hafta Sonu Çocuk Siyer Dersi Kaydı"
                class="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/50 focus:border-emerald-700 transition-all"
              >
            </div>

            <!-- Message -->
            <div>
              <label for="contact-message" class="block text-xs font-semibold text-navy-950 mb-1">
                Mesajınız *
              </label>
              <textarea
                id="contact-message"
                v-model="form.message"
                rows="5"
                required
                minlength="5"
                placeholder="Mesajınızı, talebinizi veya sormak istediğiniz hususları buraya yazınız..."
                class="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/50 focus:border-emerald-700 transition-all"
              />
            </div>

            <!-- Submit Button -->
            <div class="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                :loading="isSubmitting"
                :icon-right="Send"
                class="w-full sm:w-auto"
              >
                Mesajı Gönder
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  </div>
</template>
