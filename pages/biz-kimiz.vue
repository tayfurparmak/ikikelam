<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Compass,
  Eye,
  Heart,
  BookOpen,
  ArrowRight,
  ChevronDown,
  Clock,
  Sparkles,
  MapPin,
} from 'lucide-vue-next'
import DOMPurify from 'isomorphic-dompurify'
import Container from '~/components/common/Container.vue'
import SectionTitle from '~/components/common/SectionTitle.vue'
import Button from '~/components/common/Button.vue'
import FeaturedYoutubeVideo from '~/components/social/FeaturedYoutubeVideo.vue'
import { extractYoutubeVideoId } from '~/utils/youtube'

interface AboutPageDetail {
  title?: string
  subtitle?: string
  intro?: string
  content?: string
  image?: string
  videoUrl?: string
  buttonText?: string
  buttonUrl?: string
  isActive?: boolean
  missionTitle?: string
  missionSubtitle?: string
  missionContent?: string
  missionActive?: boolean
  visionTitle?: string
  visionSubtitle?: string
  visionContent?: string
  visionActive?: boolean
  valuesActive?: boolean
  whyUsActive?: boolean
  historyActive?: boolean
  servicesActive?: boolean
  faqActive?: boolean
  seoTitle?: string
  seoDescription?: string
  seoOgImage?: string
  seoCanonical?: string
}

interface CommonAboutItem {
  id: string
  title: string
  description: string
  icon?: string
  image?: string
  year?: string
  question?: string
  answer?: string
  category?: string
  isActive?: boolean
  sortOrder?: number
}

const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl || 'https://ikikelam.org.tr').replace(/\/+$/, '')

// Fetch dynamic about data from Database
const { data: aboutRes } = await useFetch<{
  success: boolean
  data: {
    page: AboutPageDetail
    values: CommonAboutItem[]
    whyUs: CommonAboutItem[]
    history: CommonAboutItem[]
    services: CommonAboutItem[]
    faqs: CommonAboutItem[]
  }
}>('/api/about')

const page = computed(() => aboutRes.value?.data?.page || {})
const values = computed(() => aboutRes.value?.data?.values || [])
const whyUs = computed(() => aboutRes.value?.data?.whyUs || [])
const history = computed(() => aboutRes.value?.data?.history || [])
const services = computed(() => aboutRes.value?.data?.services || [])
const faqs = computed(() => aboutRes.value?.data?.faqs || [])

function sanitize(html?: string | null) {
  if (!html) return ''
  return DOMPurify.sanitize(html)
}

// Extracted video ID for facade player
const youtubeVideoId = computed(() => {
  const url = page.value.videoUrl
  if (!url) return ''
  return extractYoutubeVideoId(url) || ''
})

// FAQ Accordion State
const activeFaqId = ref<string | null>(null)
function toggleFaq(id: string) {
  activeFaqId.value = activeFaqId.value === id ? null : id
}

// Dynamic SEO Metadata from Admin
useSeoMeta({
  title: computed(() => page.value.seoTitle || `${page.value.title || 'Biz Kimiz?'} — İki Kelam`),
  description: computed(() => page.value.seoDescription || page.value.subtitle || 'İki Kelam İlim ve Kültür Derneği vizyonu, misyonu, değerleri ve medrese tarihçesi.'),
  ogTitle: computed(() => page.value.seoTitle || `${page.value.title || 'Biz Kimiz?'} — İki Kelam`),
  ogDescription: computed(() => page.value.seoDescription || page.value.subtitle || 'İki Kelam İlim ve Kültür Derneği vizyonu, misyonu, değerleri ve medrese tarihçesi.'),
  ogType: 'website',
  ogUrl: `${siteUrl}/biz-kimiz`,
  ogImage: computed(() => page.value.seoOgImage || page.value.image || `${siteUrl}/logo.svg`),
  twitterCard: 'summary_large_image',
  twitterTitle: computed(() => page.value.seoTitle || `${page.value.title || 'Biz Kimiz?'} — İki Kelam`),
  twitterDescription: computed(() => page.value.seoDescription || page.value.subtitle || 'İki Kelam İlim ve Kültür Derneği vizyonu, misyonu, değerleri ve medrese tarihçesi.'),
  twitterImage: computed(() => page.value.seoOgImage || page.value.image || `${siteUrl}/logo.svg`),
})

useHead({
  link: [{ rel: 'canonical', href: computed(() => page.value.seoCanonical || `${siteUrl}/biz-kimiz`) }],
})
</script>

<template>
  <div class="min-h-screen bg-warm-white">
    <!-- 1. HERO & BİZ KİMİZ -->
    <section v-if="page.isActive" class="relative py-16 sm:py-24 border-b border-cream-200/90 overflow-hidden">
      <!-- Background Ambient Glow -->
      <div class="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute bottom-0 left-1/4 translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <Container size="xl" class="relative z-10">
        <SectionTitle
          badge="Kurumsal"
          :title="page.title || 'Biz Kimiz?'"
          :subtitle="page.subtitle || 'İlim, irfan ve muhabbet yolunda birlikte.'"
          align="center"
        />

        <div class="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <!-- Text & Intro (lg:col-span-7) -->
          <div class="lg:col-span-7 space-y-6">
            <p v-if="page.intro" class="text-navy-950 font-serif text-xl sm:text-2xl leading-relaxed text-balance">
              {{ page.intro }}
            </p>

            <!-- Detailed Content -->
            <div
              v-if="page.content"
              class="prose prose-slate max-w-none text-slate-700 leading-relaxed font-light text-base sm:text-lg"
              v-html="sanitize(page.content)"
            />

            <!-- CTA Button -->
            <div v-if="page.buttonText && page.buttonUrl" class="pt-2">
              <Button
                :to="page.buttonUrl"
                variant="primary"
                size="lg"
                :icon-right="ArrowRight"
              >
                {{ page.buttonText }}
              </Button>
            </div>
          </div>

          <!-- Media: Image or YouTube Video (lg:col-span-5) -->
          <div class="lg:col-span-5">
            <!-- If YouTube video URL is present, show video player -->
            <div v-if="youtubeVideoId" class="space-y-3">
              <FeaturedYoutubeVideo
                :video-id="youtubeVideoId"
                :title="page.title"
                badge="Tanıtım Filmi"
              />
            </div>

            <!-- Image preview fallback -->
            <div
              v-else-if="page.image"
              class="relative rounded-3xl overflow-hidden aspect-[4/3] bg-cream-100 shadow-xl border border-cream-300/80"
            >
              <img
                :src="page.image"
                :alt="page.title || 'İki Kelam Medresesi'"
                class="w-full h-full object-cover"
                loading="eager"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </Container>
    </section>

    <!-- 2. MİSYONUMUZ & VİZYONUMUZ -->
    <section
      v-if="page.missionActive || page.visionActive"
      class="py-16 sm:py-24 bg-cream-50/70 border-b border-cream-200/90"
    >
      <Container size="xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <!-- Misyon Kartı -->
          <div
            v-if="page.missionActive"
            class="bg-white p-8 sm:p-10 rounded-3xl border border-cream-200 shadow-xs space-y-4 hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100/80">
              <Compass class="w-6 h-6 text-emerald-700" />
            </div>

            <h3 class="font-serif text-2xl font-bold text-navy-950">
              {{ page.missionTitle || 'Misyonumuz' }}
            </h3>

            <p v-if="page.missionSubtitle" class="text-emerald-800 font-medium text-sm">
              {{ page.missionSubtitle }}
            </p>

            <div
              v-if="page.missionContent"
              class="text-slate-600 font-light text-sm sm:text-base leading-relaxed"
              v-html="sanitize(page.missionContent)"
            />
          </div>

          <!-- Vizyon Kartı -->
          <div
            v-if="page.visionActive"
            class="bg-white p-8 sm:p-10 rounded-3xl border border-cream-200 shadow-xs space-y-4 hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div class="w-12 h-12 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center border border-gold-200/80">
              <Eye class="w-6 h-6 text-gold-600" />
            </div>

            <h3 class="font-serif text-2xl font-bold text-navy-950">
              {{ page.visionTitle || 'Vizyonumuz' }}
            </h3>

            <p v-if="page.visionSubtitle" class="text-gold-700 font-medium text-sm">
              {{ page.visionSubtitle }}
            </p>

            <div
              v-if="page.visionContent"
              class="text-slate-600 font-light text-sm sm:text-base leading-relaxed"
              v-html="sanitize(page.visionContent)"
            />
          </div>
        </div>
      </Container>
    </section>

    <!-- 3. DEĞERLERİMİZ -->
    <section v-if="page.valuesActive && values.length > 0" class="py-16 sm:py-24 border-b border-cream-200/90">
      <Container size="xl">
        <SectionTitle
          badge="İlkelerimiz"
          title="Bizi Biz Yapan Değerlerimiz"
          subtitle="İlim meclislerimizde ve medrese hayatımızda tavizsiz bağlı kaldığımız ahlaki ve ilmi hasletler."
          align="center"
        />

        <div class="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(val, idx) in values"
            :key="val.id"
            class="p-6 rounded-3xl bg-white border border-cream-200/90 shadow-xs hover:shadow-md hover:border-emerald-700/40 transition-all flex flex-col justify-between group"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="w-10 h-10 rounded-2xl bg-cream-100 text-emerald-800 flex items-center justify-center font-bold text-sm border border-cream-200 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                  {{ idx + 1 }}
                </span>
                <Heart class="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
              </div>

              <h4 class="font-serif text-xl font-bold text-navy-950 group-hover:text-emerald-900 transition-colors">
                {{ val.title }}
              </h4>

              <p class="text-slate-600 text-xs sm:text-sm leading-relaxed font-light">
                {{ val.description }}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <!-- 4. NEDEN İKİ KELAM? -->
    <section v-if="page.whyUsActive && whyUs.length > 0" class="py-16 sm:py-24 bg-navy-950 text-white border-b border-navy-900 relative overflow-hidden">
      <!-- Ambient Lighting -->
      <div class="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-emerald-800/20 blur-3xl pointer-events-none" />
      <div class="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <Container size="xl" class="relative z-10">
        <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 text-gold-400 border border-white/10">
            <Sparkles class="w-3.5 h-3.5" />
            <span>Farkımız ve Yaklaşımımız</span>
          </div>
          <h2 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Neden İki Kelam?
          </h2>
          <p class="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Klasik medrese usûlünü asrın idrakiyle buluşturan, ilim ve kardeşlik eksenli yaklaşımımız.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(w, idx) in whyUs"
            :key="w.id"
            class="p-6 sm:p-8 rounded-3xl bg-navy-900/80 border border-white/10 shadow-sm hover:border-gold-400/40 hover:bg-navy-900 transition-all flex flex-col justify-between group"
          >
            <div class="space-y-3">
              <span class="text-xs font-mono font-bold text-gold-400">
                0{{ idx + 1 }}.
              </span>
              <h4 class="font-serif text-xl font-bold text-white group-hover:text-gold-300 transition-colors">
                {{ w.title }}
              </h4>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {{ w.description }}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <!-- 5. MEDRESEMİZİN HİKÂYESİ (TIMELINE) -->
    <section v-if="page.historyActive && history.length > 0" class="py-16 sm:py-24 border-b border-cream-200/90">
      <Container size="xl">
        <SectionTitle
          badge="Zaman Çizelgesi"
          title="Medresemizin Hikâyesi"
          subtitle="İki Kelam'ın tohumlarının atıldığı ilk günden bugüne uzanan bereketli yolculuk."
          align="center"
        />

        <!-- Vertical Timeline -->
        <div class="mt-14 max-w-4xl mx-auto relative">
          <!-- Central Line (Desktop) / Left Line (Mobile) -->
          <div class="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 bg-cream-300 -translate-x-1/2" />

          <div class="space-y-10 sm:space-y-12">
            <div
              v-for="(h, idx) in history"
              :key="h.id"
              class="relative flex flex-col sm:flex-row items-start"
              :class="idx % 2 === 0 ? 'sm:flex-row-reverse' : ''"
            >
              <!-- Content Card -->
              <div
                class="ml-10 sm:ml-0 sm:w-1/2 p-6 sm:p-8 rounded-3xl bg-white border border-cream-200 shadow-xs hover:shadow-md transition-shadow space-y-2.5"
                :class="idx % 2 === 0 ? 'sm:mr-10' : 'sm:ml-10'"
              >
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1 rounded-xl bg-emerald-800 text-gold-300 font-serif font-bold text-sm shrink-0">
                    {{ h.year }}
                  </span>
                  <h4 class="font-serif text-lg font-bold text-navy-950">
                    {{ h.title }}
                  </h4>
                </div>
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                  {{ h.description }}
                </p>
              </div>

              <!-- Timeline Center Node Badge -->
              <div class="absolute left-4 sm:left-1/2 top-6 -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-800 text-white border-4 border-white shadow-md flex items-center justify-center text-xs font-bold">
                <Clock class="w-3.5 h-3.5 text-gold-400" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <!-- 6. HİZMETLERİMİZ -->
    <section v-if="page.servicesActive && services.length > 0" class="py-16 sm:py-24 bg-cream-50/60 border-b border-cream-200/90">
      <Container size="xl">
        <SectionTitle
          badge="Faaliyet Alanlarımız"
          title="Hizmetlerimiz"
          subtitle="Toplumun her kesimine sahih ilim, irfan ve ahlak ulaştırmak adına yürüttüğümüz çalışmalar."
          align="center"
        />

        <div class="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div
            v-for="s in services"
            :key="s.id"
            class="p-8 rounded-3xl bg-white border border-cream-200 shadow-xs hover:shadow-lg hover:border-emerald-700/40 transition-all flex flex-col justify-between group"
          >
            <div class="space-y-4">
              <div class="w-12 h-12 rounded-2xl bg-cream-100 text-emerald-800 flex items-center justify-center border border-cream-200 group-hover:scale-105 transition-transform">
                <BookOpen class="w-6 h-6 text-emerald-700" />
              </div>

              <h4 class="font-serif text-xl font-bold text-navy-950 group-hover:text-emerald-900 transition-colors">
                {{ s.title }}
              </h4>

              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                {{ s.description }}
              </p>
            </div>

            <div class="pt-6 mt-4 border-t border-cream-100 flex items-center text-xs font-semibold text-emerald-800 group-hover:text-emerald-950 transition-colors">
              <span>Detaylı Bilgi</span>
              <ArrowRight class="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Container>
    </section>

    <!-- 7. SIKÇA SORULAN SORULAR (FAQ ACCORDION) -->
    <section v-if="page.faqActive && faqs.length > 0" id="sss" class="py-16 sm:py-24 border-b border-cream-200/90">
      <Container size="lg">
        <SectionTitle
          badge="Merak Edilenler"
          title="Sıkça Sorulan Sorular"
          subtitle="Derslerimiz, medrese ortamımız ve faaliyetlerimiz hakkında merak ettiğiniz tüm soruların cevapları."
          align="center"
        />

        <div class="mt-12 space-y-4">
          <div
            v-for="f in faqs"
            :key="f.id"
            class="rounded-2xl border border-cream-200 bg-white overflow-hidden shadow-xs transition-all"
          >
            <button
              type="button"
              class="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              :aria-expanded="activeFaqId === f.id"
              @click="toggleFaq(f.id)"
            >
              <span class="font-serif text-base sm:text-lg font-bold text-navy-950">
                {{ f.question }}
              </span>
              <div
                class="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center shrink-0 transition-transform duration-200"
                :class="activeFaqId === f.id ? 'rotate-180 bg-emerald-100 text-emerald-800' : 'text-slate-500'"
              >
                <ChevronDown class="w-4 h-4" />
              </div>
            </button>

            <!-- Accordion Collapse Body -->
            <div
              v-show="activeFaqId === f.id"
              class="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-light border-t border-cream-100 pt-4"
            >
              {{ f.answer }}
            </div>
          </div>
        </div>
      </Container>
    </section>

    <!-- 8. İLETİŞİME GEÇ & BİZE KATIL (CTA) -->
    <section class="py-16 sm:py-24 bg-emerald-950 text-white relative overflow-hidden">
      <div class="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute bottom-0 left-1/4 translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <Container size="md" class="relative z-10 text-center space-y-6">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/10 text-emerald-200 border border-white/15">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Medresemize Davetlisiniz
        </div>

        <h2 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
          İlim ve İrfan Meclisimizde <br class="hidden sm:inline" />
          <span class="text-gold-300">Siz de Yerinizi Alın</span>
        </h2>

        <p class="text-sm sm:text-base text-emerald-100/80 max-w-xl mx-auto font-light leading-relaxed">
          İzmir Bornova'daki medresemizi ziyaret edebilir, haftalık ders halkalarımıza katılabilir ve faaliyetlerimize destek olabilirsiniz.
        </p>

        <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink
            to="/contact"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-emerald-950 font-semibold text-sm hover:bg-emerald-50 transition-all shadow-md"
          >
            <MapPin class="w-4 h-4 text-emerald-800" />
            <span>Medreseyi Ziyaret Edin</span>
          </NuxtLink>

          <NuxtLink
            to="/donation"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-800 text-white font-semibold text-sm hover:bg-emerald-700 border border-emerald-600 transition-all"
          >
            <Heart class="w-4 h-4 text-gold-400" />
            <span>Talebelerimize Destek Olun</span>
          </NuxtLink>
        </div>
      </Container>
    </section>
  </div>
</template>
