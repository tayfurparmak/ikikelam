<script setup lang="ts">
// SEO-friendly canonical redirect from Turkish alias /faaliyetlerimiz to /activities
definePageMeta({
  middleware: [
    function () {
      return navigateTo('/activities', { redirectCode: 301 })
    },
  ],
})

await navigateTo('/activities', { redirectCode: 301 })
</script>

<template>
  <div class="py-20 text-center text-slate-500">
    <p>Faaliyetler sayfasına yönlendiriliyorsunuz...</p>
  </div>
</template>
