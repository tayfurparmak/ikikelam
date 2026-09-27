<script setup lang="ts">
import { ref } from 'vue'
import { Lock, Mail, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-vue-next'
import AppLogo from '~/components/common/AppLogo.vue'

definePageMeta({
  layout: false,
})

useSeoMeta({
  title: 'Yönetici Girişi — İki Kelam',
})

const { login } = useAdminAuth()
const route = useRoute()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Lütfen e-posta ve şifrenizi giriniz.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await login(email.value, password.value)

    // Yönlendirme hedefi varsa oraya, yoksa /admin'e git
    const redirectTo = typeof route.query.redirect === 'string' ? route.query.redirect : '/admin'
    await navigateTo(redirectTo)
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && 'data' in err) {
      const data = (err as { data?: { message?: string } }).data
      errorMessage.value = data?.message || 'Giriş yapılamadı. Bilgilerinizi kontrol ediniz.'
    } else if (err instanceof Error) {
      errorMessage.value = err.message
    } else {
      errorMessage.value = 'Giriş işlemi sırasında beklenmeyen bir hata oluştu.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-b from-cream-100 via-warm-white to-cream-50 select-none">
    <div class="w-full max-w-md">
      <!-- Logo & Başlık -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block transition-transform hover:scale-105 duration-200">
          <AppLogo size="xl" :show-subtitle="false" variant="light" />
        </NuxtLink>
        <h1 class="font-serif text-2xl font-bold text-navy-950 mt-4">Yönetim Konsolu</h1>
        <p class="text-xs text-slate-500 mt-1 font-light">Lütfen yetkili bilgilerinizi girerek oturum açınız.</p>
      </div>

      <!-- Giriş Kartı -->
      <div class="bg-white rounded-2xl border border-soft-gray/60 p-8 shadow-sm relative overflow-hidden">
        <!-- Üst ince altın vurgu çizgisi -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-800 via-gold-500 to-navy-900"></div>

        <!-- Hata Bildirimi -->
        <div
          v-if="errorMessage"
          class="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start space-x-2.5"
        >
          <AlertCircle :size="18" class="text-red-600 shrink-0 mt-0.5" />
          <span class="leading-relaxed font-medium">{{ errorMessage }}</span>
        </div>

        <form class="space-y-5" @submit.prevent="handleLogin">
          <!-- E-posta -->
          <div>
            <label class="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
              E-Posta Adresi
            </label>
            <div class="relative rounded-lg shadow-xs">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail :size="16" />
              </div>
              <input
                v-model="email"
                type="email"
                required
                autocomplete="email"
                placeholder="admin@ikikelam.org.tr"
                class="block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-lg border border-soft-gray/80 bg-warm-white/50 text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <!-- Şifre -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-semibold text-navy-900 uppercase tracking-wider">
                Şifre
              </label>
            </div>
            <div class="relative rounded-lg shadow-xs">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock :size="16" />
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                placeholder="••••••••••••"
                class="block w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border border-soft-gray/80 bg-warm-white/50 text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" :size="16" />
                <Eye v-else :size="16" />
              </button>
            </div>
          </div>

          <!-- Giriş Butonu -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-900 hover:bg-emerald-950 focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span v-if="isLoading" class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <LogIn v-else :size="16" class="text-gold-400" />
            <span>{{ isLoading ? 'Doğrulanıyor...' : 'Oturum Aç' }}</span>
          </button>
        </form>

        <div class="mt-6 pt-6 border-t border-soft-gray/40 text-center">
          <NuxtLink to="/" class="text-xs font-medium text-slate-500 hover:text-emerald-900 transition">
            &larr; Web Sitesine Geri Dön
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
