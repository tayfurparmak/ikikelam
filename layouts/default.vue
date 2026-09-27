<script setup lang="ts">
import Navbar from '~/components/layout/Navbar.vue'
import Footer from '~/components/layout/Footer.vue'
import WhatsAppButton from '~/components/common/WhatsAppButton.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-warm-white text-navy font-sans antialiased selection:bg-emerald-800 selection:text-white">
    <!-- Sticky Header -->
    <Navbar />

    <!-- Main Content Area -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Institutional Footer -->
    <Footer />

    <!-- Floating WhatsApp Action -->
    <WhatsAppButton />
  </div>
</template>
