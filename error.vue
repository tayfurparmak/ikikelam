<script setup lang="ts">
import type { NuxtError } from '#app'
import { Home, ArrowLeft, RefreshCw, AlertTriangle, Compass } from 'lucide-vue-next'
import AppLogo from '~/components/common/AppLogo.vue'

interface Props {
  error: NuxtError
}

const props = defineProps<Props>()

const is404 = computed(() => props.error.statusCode === 404)
const statusCode = computed(() => props.error.statusCode || 500)

const title = computed(() => {
  if (is404.value) return 'Sayfa Bulunamadı'
  if (statusCode.value === 403) return 'Erişim Yetkisi Yok'
  return 'Beklenmeyen Bir Hata Oluştu'
})

const description = computed(() => {
  if (is404.value) {
    return 'Aradığınız sayfa taşınmış, silinmiş veya adresi yanlış girilmiş olabilir. Lütfen adresi kontrol ediniz veya ana sayfaya dönünüz.'
  }
  return (
    props.error.message ||
    'Sistemlerimizde geçici bir aksaklık meydana geldi. Mühendislerimiz konuyla ilgilenmektedir. Lütfen daha sonra tekrar deneyiniz.'
  )
})

function handleError() {
  clearError({ redirect: '/' })
}

function reloadPage() {
  if (import.meta.client) {
    window.location.reload()
  }
}
</script>

<template>
  <div class="min-h-screen bg-warm-white flex flex-col justify-between select-none">
    <!-- Top Header -->
    <header class="py-6 px-4 sm:px-6 lg:px-8 border-b border-soft-gray/30 bg-warm-white/80 backdrop-blur-md sticky top-0 z-10">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <NuxtLink to="/" class="inline-block" @click="handleError">
          <AppLogo size="md" variant="light" />
        </NuxtLink>
        <button
          type="button"
          class="text-sm font-medium text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 transition-colors"
          @click="handleError"
        >
          <Home class="w-4 h-4" />
          <span>Ana Sayfa</span>
        </button>
      </div>
    </header>

    <!-- Error Content Container -->
    <main class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24" role="alert">
      <div class="max-w-lg w-full text-center space-y-8">
        <!-- Error Badge & Icon -->
        <div class="relative inline-flex items-center justify-center">
          <div class="w-24 h-24 rounded-full bg-cream-200 border-2 border-emerald-800/20 flex items-center justify-center shadow-inner">
            <Compass v-if="is404" class="w-12 h-12 text-emerald-800 stroke-[1.5]" />
            <AlertTriangle v-else class="w-12 h-12 text-amber-600 stroke-[1.5]" />
          </div>
          <span
            class="absolute -bottom-2 px-3 py-0.5 text-xs font-mono font-bold tracking-wider rounded-full bg-emerald-900 text-amber-300 shadow-sm"
          >
            HATA {{ statusCode }}
          </span>
        </div>

        <!-- Typography -->
        <div class="space-y-3">
          <h1 class="font-serif text-3xl sm:text-4xl font-bold text-navy-950">
            {{ title }}
          </h1>
          <p class="text-sm sm:text-base text-slate-600 leading-relaxed font-light text-balance max-w-md mx-auto">
            {{ description }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 text-white font-medium hover:bg-emerald-900 shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            @click="handleError"
          >
            <ArrowLeft class="w-4 h-4" />
            <span>Ana Sayfaya Dön</span>
          </button>

          <button
            v-if="!is404"
            type="button"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cream-100 text-slate-700 border border-slate-200 font-medium hover:bg-cream-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            @click="reloadPage"
          >
            <RefreshCw class="w-4 h-4" />
            <span>Sayfayı Yenile</span>
          </button>
        </div>

        <!-- Helpful Link -->
        <div class="pt-6 border-t border-soft-gray/30 text-xs text-slate-500">
          Bir sorun olduğunu düşünüyorsanız lütfen
          <NuxtLink to="/contact" class="text-emerald-800 font-medium underline hover:text-emerald-950">
            İletişim
          </NuxtLink>
          bölümünden bize bildiriniz.
        </div>
      </div>
    </main>

    <!-- Simple Footer -->
    <footer class="py-6 border-t border-soft-gray/30 text-center text-xs text-slate-400">
      <p>&copy; {{ new Date().getFullYear() }} İki Kelam İlim ve Kültür Derneği. Tüm hakları saklıdır.</p>
    </footer>
  </div>
</template>
