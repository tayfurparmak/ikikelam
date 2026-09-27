<script setup lang="ts">
// Canonical 301 redirect to Turkish /hakkimizda
definePageMeta({
  middleware: [
    function () {
      return navigateTo('/hakkimizda', { redirectCode: 301 })
    },
  ],
})

await navigateTo('/hakkimizda', { redirectCode: 301 })
</script>

<template>
  <div class="py-20 text-center text-slate-500">
    <p>Hakkımızda sayfasına yönlendiriliyorsunuz...</p>
  </div>
</template>
