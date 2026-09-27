<script setup lang="ts">
const config = useRuntimeConfig()

// Çevre değişkeninden WhatsApp numarasını al (varsayılan: +905000000000)
const rawNumber = computed(() => {
  return (config.public.whatsappNumber as string) || '+905000000000'
})

// wa.me formatı için sadece rakamları temizle
const cleanPhone = computed(() => {
  return rawNumber.value.replace(/[^0-9]/g, '')
})

const defaultMessage = 'Selamün aleyküm, İki Kelam hakkında bilgi almak istiyorum.'
const whatsappUrl = computed(() => {
  return `https://wa.me/${cleanPhone.value}?text=${encodeURIComponent(defaultMessage)}`
})
</script>

<template>
  <aside
    class="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center group select-none"
    aria-label="WhatsApp İletişim Butonu"
  >
    <!-- Tooltip / Label (Masaüstünde hover ile açılır) -->
    <a
      :href="whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="hidden sm:flex items-center bg-white/95 text-navy-950 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md border border-slate-200/80 mr-2.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto backdrop-blur-sm whitespace-nowrap"
    >
      <span>Bize WhatsApp'tan Ulaşın</span>
    </a>

    <!-- Floating Circular Button -->
    <a
      :href="whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
      title="WhatsApp ile İletişime Geçin"
      aria-label="WhatsApp ile mesaj gönderin"
    >
      <!-- Subtle Pulse Ping Ring -->
      <span
        class="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none"
        aria-hidden="true"
      />

      <!-- WhatsApp SVG Icon -->
      <svg
        viewBox="0 0 24 24"
        class="w-6 h-6 sm:w-7 sm:h-7 fill-current relative z-10 drop-shadow-sm"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.677.15-.2.301-.777.979-.953 1.18-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.3-.501.101-.2.051-.376-.025-.527-.075-.15-.677-1.631-.928-2.233-.244-.586-.492-.507-.677-.516l-.577-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.079 2.909 1.229 3.109.15.2 2.122 3.24 5.141 4.544.718.31 1.279.495 1.716.634.721.229 1.378.197 1.897.119.579-.087 1.78-.727 2.03-1.43.251-.702.251-1.304.176-1.43-.075-.126-.276-.201-.577-.351zM12.04 2C6.51 2 2.02 6.49 2.02 12.02c0 1.97.57 3.81 1.56 5.37L2 22l4.77-1.53c1.51.89 3.26 1.41 5.13 1.41 5.53 0 10.02-4.49 10.02-10.02C21.92 6.49 17.57 2 12.04 2zm0 18.25c-1.67 0-3.23-.49-4.55-1.34l-.33-.21-3.37 1.08 1.1-3.27-.23-.36c-.95-1.41-1.45-3.08-1.45-4.83 0-4.66 3.79-8.45 8.45-8.45 4.66 0 8.45 3.79 8.45 8.45 0 4.66-3.79 8.45-8.45 8.45z"
        />
      </svg>
    </a>
  </aside>
</template>
