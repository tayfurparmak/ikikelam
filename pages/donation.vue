<script setup lang="ts">
import { ref } from 'vue'
import {
  Heart,
  Copy,
  Check,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Utensils,
  Home,
  Users,
  ChevronRight,
  Info,
} from 'lucide-vue-next'
import Container from '~/components/common/Container.vue'
import SectionTitle from '~/components/common/SectionTitle.vue'
import { DONATION_ACCOUNTS, DONATION_NOTE } from '~/data/donation'

const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl || 'https://ikikelam.org.tr').replace(/\/+$/, '')

useSeoMeta({
  title: 'Bağış & Hayrî Destek — İki Kelam',
  description:
    'İki Kelam İlim ve Kültür Derneği resmi banka hesapları, TL, USD ve EUR IBAN bilgileri ile talebe burs destekleri.',
  ogTitle: 'Bağış & Hayrî Destek — İki Kelam',
  ogDescription:
    'İlim talebelerine burs, medrese iaşesi ve eğitim faaliyetlerine destek olmak için resmi banka hesaplarımız.',
  ogType: 'website',
  ogUrl: `${siteUrl}/donation`,
  ogImage: `${siteUrl}/logo.svg`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Bağış & Hayrî Destek — İki Kelam',
  twitterDescription:
    'İlim talebelerine burs, medrese iaşesi ve eğitim faaliyetlerine destek olmak için resmi banka hesaplarımız.',
  twitterImage: `${siteUrl}/logo.svg`,
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/donation` }],
})

const copiedIban = ref<string | null>(null)
const feedbackMessage = ref<string>('')

async function copyToClipboard(iban: string) {
  try {
    const cleanIban = iban.replace(/\s+/g, '')
    await navigator.clipboard.writeText(cleanIban)
    copiedIban.value = iban
    feedbackMessage.value = 'IBAN panoya kopyalandı.'

    setTimeout(() => {
      if (copiedIban.value === iban) {
        copiedIban.value = null
        feedbackMessage.value = ''
      }
    }, 2500)
  } catch (err) {
    console.error('Kopyalama hatası:', err)
  }
}

// 5 Usage Areas of Donations
const donationPillars = [
  {
    icon: GraduationCap,
    title: 'Eğitim & Tedrisat',
    description: 'Klasik medrese kitapları, şerh ve haşiye nüshaları, müfredat materyalleri ve talebe ders araç gereçleri.',
  },
  {
    icon: Sparkles,
    title: 'Öğrenci Faaliyetleri',
    description: 'Aylık talebe bursları, hafızlık teşvik hediyeleri, gençlik ilim kampları ve kültürel seminerler.',
  },
  {
    icon: Utensils,
    title: 'İkram & İaşe',
    description: 'Medresede barınan ilim talebelerimizin günlük sabah, öğle ve akşam sıcak yemekleri ile ikram meclisleri.',
  },
  {
    icon: Home,
    title: 'Mekan Giderleri',
    description: 'Medrese dersliklerinin ısınma, elektrik, su, kütüphane bakımı ve fiziki yaşam alanı idame masrafları.',
  },
  {
    icon: Users,
    title: 'Sosyal Faaliyetler',
    description: 'İhtiyaç sahibi ailelere erzak yardımları, Ramazan iftarları ve toplum yararına hayrî organizasyonlar.',
  },
]
</script>

<template>
  <div class="min-h-screen bg-warm-white py-12 sm:py-20">
    <Container size="xl">
      <!-- Breadcrumb Navigation -->
      <nav aria-label="Ekmek Kırıntısı" class="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-8">
        <NuxtLink to="/" class="hover:text-emerald-800 transition-colors">Ana Sayfa</NuxtLink>
        <ChevronRight class="w-3.5 h-3.5 text-slate-400" />
        <span class="text-stone-900 font-semibold" aria-current="page">Bağış ve Destek</span>
      </nav>

      <!-- Section Title -->
      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <SectionTitle
          badge="Sadaka-i Câriye"
          title="İlim Talebelerine Destek Olun"
          subtitle="İnsan ölünce üç şey hariç ameli kesilir: Sadaka-i câriye, faydalanılan ilim ve kendisine dua eden salih evlât. (Hadîs-i Şerîf)"
          align="center"
        />

        <div class="mt-6 p-4 rounded-2xl bg-cream-50/80 border border-stone-200/80 max-w-2xl mx-auto text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
          Derneğimiz kamu yararını gözeten resmî bir sivil toplum kuruluşudur. Bağışlarınız yalnızca banka havalesi / EFT yoluyla resmî dernek hesaplarımıza kabul edilmektedir.
        </div>
      </div>

      <!-- Feedback Toast Notification -->
      <div
        v-if="feedbackMessage"
        class="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-900 text-white shadow-xl flex items-center gap-3 border border-emerald-700 animate-in slide-in-from-bottom-3"
      >
        <Check class="w-5 h-5 text-emerald-300" />
        <span class="text-sm font-medium">{{ feedbackMessage }}</span>
      </div>

      <!-- Bank Accounts Section (TL, USD, EUR) -->
      <section class="max-w-5xl mx-auto mb-20">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="font-serif text-2xl sm:text-3xl font-bold text-navy-950">
              Resmî Banka Hesaplarımız
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 font-light mt-1">
              Havale veya EFT yoluyla dilediğiniz para biriminde doğrudan destek sağlayabilirsiniz.
            </p>
          </div>

          <span class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800">
            <ShieldCheck class="w-4 h-4 text-emerald-700" />
            <span>Onaylı Dernek Hesabı</span>
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article
            v-for="account in DONATION_ACCOUNTS"
            :key="account.id"
            class="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-xs hover:shadow-lg hover:border-emerald-700/40 transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              <!-- Currency & Bank Header -->
              <div class="flex items-center justify-between mb-5">
                <div class="flex items-center gap-2.5">
                  <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100 font-bold text-sm">
                    {{ account.currencySymbol }}
                  </div>
                  <div>
                    <h3 class="font-semibold text-xs text-slate-500 uppercase tracking-wider">
                      {{ account.currency }} Hesabı
                    </h3>
                    <p class="font-serif font-bold text-sm text-navy-950">
                      {{ account.bankName }}
                    </p>
                  </div>
                </div>

                <span class="text-xs font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                  {{ account.currency }}
                </span>
              </div>

              <!-- Account Details -->
              <div class="space-y-3 text-xs mb-5">
                <div>
                  <span class="text-slate-400 block font-light">Hesap Sahibi:</span>
                  <strong class="font-medium text-stone-900 block mt-0.5">{{ account.accountHolder }}</strong>
                </div>

                <div v-if="account.branchCode">
                  <span class="text-slate-400 block font-light">Şube Bilgisi:</span>
                  <span class="text-stone-700">{{ account.branchCode }}</span>
                </div>

                <div v-if="account.swiftCode">
                  <span class="text-slate-400 block font-light">SWIFT / BIC Kodu:</span>
                  <span class="font-mono text-stone-800 font-semibold">{{ account.swiftCode }}</span>
                </div>
              </div>

              <!-- IBAN Box with Copy Button -->
              <div class="p-3.5 rounded-2xl bg-cream-50/80 border border-stone-200/80 space-y-2">
                <span class="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 block">
                  IBAN Numarası
                </span>
                <p class="font-mono text-xs sm:text-[13px] font-bold text-navy-950 tracking-wider select-all break-all">
                  {{ account.iban }}
                </p>
              </div>
            </div>

            <!-- Copy Button -->
            <button
              type="button"
              :class="[
                'mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-700',
                copiedIban === account.iban
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs'
              ]"
              :aria-label="`${account.currency} IBAN kopyala`"
              @click="copyToClipboard(account.iban)"
            >
              <Check v-if="copiedIban === account.iban" class="w-4 h-4 text-emerald-200" />
              <Copy v-else class="w-4 h-4" />
              <span>{{ copiedIban === account.iban ? 'Kopyalandı!' : 'IBAN Kopyala' }}</span>
            </button>
          </article>
        </div>

        <!-- Donation Explanation Guidance -->
        <div class="mt-8 p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-start gap-3.5">
          <Info class="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div class="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            <strong class="font-semibold text-navy-950">Açıklama Alanı Notu: </strong>
            {{ DONATION_NOTE }}
          </div>
        </div>
      </section>

      <!-- Usage Areas Section (5 Pillars) -->
      <section class="max-w-5xl mx-auto">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-100 mb-3">
            <Heart class="w-3.5 h-3.5 text-emerald-600" />
            <span>Şeffaf ve Güvenilir</span>
          </div>
          <h2 class="font-serif text-2xl sm:text-3xl font-bold text-navy-950 mb-3">
            Bağışlarınız Nerelerde Kullanılıyor?
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
            Emanet ettiğiniz her bir kuruş, medresemizin kadim vakıf şuuruyla ve azami hassasiyetle yalnızca belirlenen hizmet alanlarında sarf edilmektedir.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="pillar in donationPillars"
            :key="pillar.title"
            class="bg-white p-6 sm:p-7 rounded-3xl border border-cream-200/90 shadow-xs hover:shadow-md hover:border-emerald-700/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100 mb-5">
                <component :is="pillar.icon" class="w-6 h-6 text-emerald-700" />
              </div>

              <h3 class="font-serif text-lg font-bold text-navy-950 mb-2">
                {{ pillar.title }}
              </h3>

              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                {{ pillar.description }}
              </p>
            </div>
          </div>

          <!-- 6th Card: Contact / Inquiry Support -->
          <div class="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-6 sm:p-7 rounded-3xl shadow-xs flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-white/10 text-emerald-200 flex items-center justify-center border border-white/10 mb-5">
                <Heart class="w-6 h-6 text-amber-300" />
              </div>

              <h3 class="font-serif text-lg font-bold text-white mb-2">
                Özel Proje & Aynî Destek
              </h3>

              <p class="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-light">
                Aynî erzak, kitap bağışı veya doğrudan bir talebenin yıllık hamiliğini üstlenmek isterseniz bize dilediğiniz zaman ulaşabilirsiniz.
              </p>
            </div>

            <div class="pt-6">
              <NuxtLink
                to="/contact"
                class="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-white text-emerald-950 text-xs font-semibold hover:bg-emerald-50 transition-colors"
              >
                Bize Ulaşın
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </Container>
  </div>
</template>
