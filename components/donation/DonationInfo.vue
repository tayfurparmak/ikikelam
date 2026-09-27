<script setup lang="ts">
import { Building2, HeartHandshake, Copy, Check } from 'lucide-vue-next'
import { ref } from 'vue'

const copied = ref(false)
const iban = 'TR00 0000 0000 0000 0000 0000 00'

const copyIban = async () => {
  try {
    await navigator.clipboard.writeText(iban.replace(/\s+/g, ''))
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2500)
  } catch {
    // Clipboard fallback
  }
}
</script>

<template>
  <div class="rounded-2xl border border-gold-500/30 bg-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
    <div class="absolute -top-12 -right-12 w-32 h-32 bg-gold-400/10 rounded-full blur-2xl pointer-events-none"></div>

    <div class="flex items-center space-x-3 mb-6">
      <div class="w-12 h-12 rounded-xl bg-gold-50 border border-gold-300/40 text-gold-700 flex items-center justify-center shrink-0">
        <HeartHandshake :size="24" class="text-gold-600" />
      </div>
      <div>
        <h3 class="font-serif text-xl font-bold text-navy-950">İlim Talebelerine Destek</h3>
        <p class="text-xs text-slate-500">Resmi Banka Hesap ve Havale / EFT Bilgileri</p>
      </div>
    </div>

    <div class="space-y-4 text-sm">
      <div class="p-4 sm:p-5 rounded-xl bg-warm-white border border-soft-gray/50 hover:border-gold-400/50 transition">
        <div class="flex items-center justify-between mb-2">
          <span class="font-semibold text-navy-950 flex items-center space-x-2">
            <Building2 :size="16" class="text-emerald-800" />
            <span>Kuveyt Türk Katılım Bankası</span>
          </span>
          <span class="text-xs bg-gold-100 text-gold-800 px-2.5 py-0.5 rounded-full font-semibold border border-gold-200">
            TL Hesabı
          </span>
        </div>
        <p class="text-xs text-slate-500 mb-2">Hesap Sahibi: <strong class="text-navy-900">İki Kelam İlim ve Kültür Derneği</strong></p>

        <div class="flex items-center justify-between bg-white p-2.5 rounded-lg border border-soft-gray/60">
          <span class="font-mono text-xs sm:text-sm font-bold text-navy-950 tracking-wider">
            {{ iban }}
          </span>
          <button
            type="button"
            class="text-xs font-medium text-emerald-800 hover:text-emerald-950 px-2.5 py-1 rounded bg-cream-100 hover:bg-gold-100 transition flex items-center space-x-1 cursor-pointer"
            @click="copyIban"
          >
            <Check v-if="copied" :size="14" class="text-emerald-700" />
            <Copy v-else :size="14" class="text-gold-700" />
            <span>{{ copied ? 'Kopyalandı' : 'Kopyala' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
