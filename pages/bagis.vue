<script setup lang="ts">
// SEO-friendly canonical redirect from /bagis to /donation
definePageMeta({
  middleware: [
    function () {
      return navigateTo('/donation', { redirectCode: 301 })
    },
  ],
})

await navigateTo('/donation', { redirectCode: 301 })
</script>

<template>
  <div class="py-20 text-center text-slate-500">
    <p>Bağış sayfasına yönlendiriliyorsunuz...</p>
  </div>
</template>
