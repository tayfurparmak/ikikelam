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
  <section class="py-16 md:py-24 bg-white relative border-b border-paper-300/80">
    <Container>
      <!-- Section Header -->
      <SectionTitle
        badge="Hayır ve İhsan"
        badge-variant="gold"
        title="İlim Talebelerine Destek Olun"
        subtitle="Medresemizin eğitim faaliyetleri, talebe bursları ve ilim halkalarının sürekliliği sizlerin samimi destekleriyle yaşamaktadır."
        align="center"
      />

      <div class="max-w-4xl mx-auto mt-12">
        <!-- Currency Selector Tabs -->
        <div class="flex justify-center mb-8">
          <div class="inline-flex p-1.5 bg-paper-200 rounded-2xl border border-paper-300">
            <button
              v-for="acc in DONATION_ACCOUNTS"
              :key="acc.id"
              type="button"
              :class="[
                'flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 select-none min-h-[44px]',
                selectedCurrency === acc.currency
                  ? 'bg-obsidian-950 text-white shadow-soft'
                  : 'text-slate-600 hover:text-obsidian-950 hover:bg-white/80'
              ]"
              @click="selectedCurrency = acc.currency"
            >
              <span class="font-extrabold text-gold-400">{{ acc.currencySymbol }}</span>
              <span>{{ acc.currency }}</span>
            </button>
          </div>
        </div>

        <!-- Bank Account Cards -->
        <div
          v-for="account in DONATION_ACCOUNTS"
          v-show="selectedCurrency === account.currency"
          :key="account.id"
          class="bg-gradient-to-br from-paper-100 via-white to-paper-200/50 rounded-3xl p-6 sm:p-10 border border-paper-300 shadow-soft relative overflow-hidden transition-all duration-300"
        >
          <!-- Corner Badge -->
          <div class="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-paper-200">
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-gold-50 text-gold-600 flex items-center justify-center border border-gold-200/80 shrink-0">
                <Building2 class="w-6 h-6" />
              </div>
              <div>
                <h3 class="font-serif font-bold text-xl text-obsidian-950">
                  {{ account.bankName }}
                </h3>
                <p class="text-xs text-slate-500 font-medium mt-0.5">
                  {{ account.currencyName }}
                </p>
              </div>
            </div>

            <span
              class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70 select-none"
            >
              <ShieldCheck class="w-3.5 h-3.5 text-emerald-700" />
              Resmî Dernek Hesabı
            </span>
          </div>

          <!-- Account Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 rounded-2xl bg-white border border-paper-300/80 shadow-2xs">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Hesap Sahibi
              </span>
              <span class="text-sm font-bold text-obsidian-900">
                {{ account.accountHolder }}
              </span>
            </div>

            <div v-if="account.branchCode || account.swiftCode" class="p-4 rounded-2xl bg-white border border-paper-300/80 shadow-2xs">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                {{ account.swiftCode ? 'SWIFT / BIC Kodu' : 'Şube Bilgisi' }}
              </span>
              <span class="text-sm font-bold text-obsidian-900">
                {{ account.swiftCode || account.branchCode }}
              </span>
            </div>
          </div>

          <!-- IBAN Box & Copy Button -->
          <div class="p-5 rounded-2xl bg-white border-2 border-gold-300/60 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="min-w-0">
              <span class="text-xs font-bold text-gold-700 uppercase tracking-wider block mb-1">
                IBAN Numarası
              </span>
              <div class="font-mono text-base sm:text-lg font-bold text-obsidian-950 tracking-wider select-all break-all">
                {{ account.iban }}
              </div>
            </div>

            <button
              type="button"
              :class="[
                'inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 min-h-[44px] select-none',
                copiedIban === account.iban
                  ? 'bg-emerald-700 text-white focus-visible:ring-emerald-500 shadow-soft'
                  : 'bg-gradient-to-r from-gold-300 via-amber-400 to-gold-400 hover:from-amber-400 hover:to-gold-500 text-obsidian-950 shadow-soft hover:shadow-gold focus-visible:ring-gold-400 border border-gold-400/50'
              ]"
              :aria-label="`${account.currency} IBAN kopyala`"
              @click="copyToClipboard(account.iban)"
            >
              <Check v-if="copiedIban === account.iban" class="w-4.5 h-4.5 animate-in fade-in" />
              <Copy v-else class="w-4.5 h-4.5" />
              <span>{{ copiedIban === account.iban ? 'Kopyalandı!' : 'IBAN Kopyala' }}</span>
            </button>
          </div>

          <!-- Note regarding donation explanation -->
          <p class="text-xs text-slate-500 mt-4 flex items-start gap-2">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-gold-500 mt-1.5 shrink-0" />
            <span>{{ DONATION_NOTE }}</span>
          </p>
        </div>

        <!-- Quick Info / Help Links -->
        <div class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-paper-100 border border-paper-300 text-center sm:text-left">
          <div class="flex items-center gap-3">
            <Heart class="w-5 h-5 text-gold-600 shrink-0 hidden sm:block" />
            <p class="text-xs sm:text-sm text-slate-600 font-light">
              Aynî bağış, talebe iaşesi veya medrese destekleri hakkında detaylı bilgi için bize her zaman ulaşabilirsiniz.
            </p>
          </div>
          <NuxtLink
            to="/bagis"
            class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-obsidian-950 hover:text-gold-700 transition-colors shrink-0"
          >
            <span>Tüm Hesaplar ve Detaylar</span>
            <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </Container>
  </section>
</template>
