<script setup lang="ts">
// SEO-friendly canonical redirect from /program to /schedule
definePageMeta({
  middleware: [
    function () {
      return navigateTo('/schedule', { redirectCode: 301 })
    },
  ],
})

await navigateTo('/schedule', { redirectCode: 301 })
</script>

<template>
  <div class="py-20 text-center text-slate-500">
    <p>Ders takvimine yönlendiriliyorsunuz...</p>
  </div>
</template>
