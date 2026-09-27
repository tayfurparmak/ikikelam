<script setup lang="ts">
// 301 Permanent Redirect for backward compatibility with existing links
await navigateTo('/biz-kimiz', { redirectCode: 301, replace: true })
</script>

<template>
  <div class="py-20 text-center text-slate-500">
    Yönlendiriliyor...
  </div>
</template>
