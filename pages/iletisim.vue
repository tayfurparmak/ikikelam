<script setup lang="ts">
// SEO-friendly canonical redirect from /iletisim to /contact
definePageMeta({
  middleware: [
    function () {
      return navigateTo('/contact', { redirectCode: 301 })
    },
  ],
})

await navigateTo('/contact', { redirectCode: 301 })
</script>

<template>
  <div class="py-20 text-center text-slate-500">
    <p>İletişim sayfasına yönlendiriliyorsunuz...</p>
  </div>
</template>
