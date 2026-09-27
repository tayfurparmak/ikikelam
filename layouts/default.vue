<script setup lang="ts">
import Navbar from '~/components/layout/Navbar.vue'
import Footer from '~/components/layout/Footer.vue'
import WhatsAppButton from '~/components/common/WhatsAppButton.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-paper-100 text-obsidian-950 font-sans antialiased selection:bg-gold-400 selection:text-obsidian-950">
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
