<script setup lang="ts">
// SEO-friendly canonical redirect from /galeri to /gallery
definePageMeta({
  middleware: [
    function () {
      return navigateTo('/gallery', { redirectCode: 301 })
    },
  ],
})

await navigateTo('/gallery', { redirectCode: 301 })
</script>

<template>
  <div class="py-20 text-center text-slate-500">
    <p>Galeri sayfasına yönlendiriliyorsunuz...</p>
  </div>
</template>
