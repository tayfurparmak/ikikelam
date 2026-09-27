<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Check, Heart, ShieldCheck, ArrowRight, Building2 } from 'lucide-vue-next'
import { DONATION_ACCOUNTS, DONATION_NOTE, type BankAccount } from '~/data/donation'
import Container from '~/components/common/Container.vue'
import SectionTitle from '~/components/common/SectionTitle.vue'

const copiedIban = ref<string | null>(null)
const selectedCurrency = ref<BankAccount['currency']>('TRY')

const copyToClipboard = async (iban: string) => {
  try {
    const cleanIban = iban.replace(/\s+/g, '')
    await navigator.clipboard.writeText(cleanIban)
    copiedIban.value = iban
    setTimeout(() => {
      if (copiedIban.value === iban) {
        copiedIban.value = null
      }
    }, 2500)
  } catch (err) {
    console.error('Kopyalama hatası:', err)
  }
}
</script>

<template>
  <section class="py-16 md:py-24 bg-white relative">
    <Container>
      <!-- Section Header -->
      <SectionTitle
        tag="HAYIR VE İHSAN"
        title="İlim Talebelerine Destek Olun"
        subtitle="Medresemizin eğitim faaliyetleri, talebe bursları ve ilim halkalarının sürekliliği sizlerin samimi destekleriyle yaşamaktadır."
        align="center"
      />

      <div class="max-w-4xl mx-auto mt-12">
        <!-- Currency Selector Tabs -->
        <div class="flex justify-center mb-8">
          <div class="inline-flex p-1.5 bg-cream/70 rounded-2xl border border-stone-200/80">
            <button
              v-for="acc in DONATION_ACCOUNTS"
              :key="acc.id"
              type="button"
              :class="[
                'flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200',
                selectedCurrency === acc.currency
                  ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20'
                  : 'text-stone-600 hover:text-emerald-900 hover:bg-white/60'
              ]"
              @click="selectedCurrency = acc.currency"
            >
              <span class="font-bold">{{ acc.currencySymbol }}</span>
              <span>{{ acc.currency }}</span>
            </button>
          </div>
        </div>

        <!-- Bank Account Cards -->
        <div
          v-for="account in DONATION_ACCOUNTS"
          v-show="selectedCurrency === account.currency"
          :key="account.id"
          class="bg-gradient-to-br from-cream/40 via-white to-cream/20 rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm relative overflow-hidden transition-all duration-300"
        >
          <!-- Corner Badge -->
          <div class="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-100">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100/80">
                <Building2 class="w-6 h-6" />
              </div>
              <div>
                <h3 class="font-serif font-bold text-lg text-emerald-950">
                  {{ account.bankName }}
                </h3>
                <p class="text-xs text-stone-500 font-medium">
                  {{ account.currencyName }}
                </p>
              </div>
            </div>

            <span
              class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/60 text-emerald-800 border border-emerald-200/50"
            >
              <ShieldCheck class="w-3.5 h-3.5 text-emerald-700" />
              Resmî Dernek Hesabı
            </span>
          </div>

          <!-- Account Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 rounded-2xl bg-white/90 border border-stone-100">
              <span class="text-xs font-medium text-stone-400 uppercase tracking-wider block mb-1">
                Hesap Sahibi
              </span>
              <span class="text-sm font-semibold text-stone-800">
                {{ account.accountHolder }}
              </span>
            </div>

            <div v-if="account.branchCode || account.swiftCode" class="p-4 rounded-2xl bg-white/90 border border-stone-100">
              <span class="text-xs font-medium text-stone-400 uppercase tracking-wider block mb-1">
                {{ account.swiftCode ? 'SWIFT / BIC Kodu' : 'Şube Bilgisi' }}
              </span>
              <span class="text-sm font-semibold text-stone-800">
                {{ account.swiftCode || account.branchCode }}
              </span>
            </div>
          </div>

          <!-- IBAN Box & Copy Button -->
          <div class="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-900/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="min-w-0">
              <span class="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
                IBAN Numarası
              </span>
              <div class="font-mono text-base sm:text-lg font-bold text-stone-900 tracking-wide select-all break-all">
                {{ account.iban }}
              </div>
            </div>

            <button
              type="button"
              :class="[
                'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2',
                copiedIban === account.iban
                  ? 'bg-emerald-600 text-white focus:ring-emerald-500'
                  : 'bg-emerald-800 hover:bg-emerald-900 text-white focus:ring-emerald-700 shadow-sm shadow-emerald-950/15'
              ]"
              :aria-label="`${account.currency} IBAN kopyala`"
              @click="copyToClipboard(account.iban)"
            >
              <Check v-if="copiedIban === account.iban" class="w-4 h-4 text-emerald-100 animate-in fade-in" />
              <Copy v-else class="w-4 h-4" />
              <span>{{ copiedIban === account.iban ? 'Kopyalandı!' : 'IBAN Kopyala' }}</span>
            </button>
          </div>

          <!-- Note regarding donation explanation -->
          <p class="text-xs text-stone-500 mt-4 flex items-start gap-2">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
            <span>{{ DONATION_NOTE }}</span>
          </p>
        </div>

        <!-- Quick Info / Help Links -->
        <div class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-cream/30 border border-stone-200/60 text-center sm:text-left">
          <div class="flex items-center gap-3">
            <Heart class="w-5 h-5 text-emerald-600 shrink-0 hidden sm:block" />
            <p class="text-xs sm:text-sm text-stone-600">
              Aynî bağış, talebe iaşesi veya özel proje destekleri hakkında bilgi almak için bize ulaşabilirsiniz.
            </p>
          </div>
          <NuxtLink
            to="/bagis"
            class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-900 hover:underline shrink-0"
          >
            <span>Tüm Hesaplar ve Detaylar</span>
            <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </Container>
  </section>
</template>
