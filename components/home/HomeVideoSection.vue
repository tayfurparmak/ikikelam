<script setup lang="ts">
import Container from '~/components/common/Container.vue'
import SectionTitle from '~/components/common/SectionTitle.vue'
import FeaturedYoutubeVideo from '~/components/social/FeaturedYoutubeVideo.vue'
import { useSiteSettings } from '~/composables/useSiteSettings'

const { settings } = useSiteSettings()
</script>

<template>
  <section class="py-16 sm:py-24 bg-cream-50/60 border-t border-cream-200/80">
    <Container size="xl">
      <!-- Section Title (h2 inside SectionTitle) -->
      <SectionTitle
        badge="İki Kelam'dan"
        title="İlim ve Sohbetten"
        subtitle="İki Kelam'ın sohbet, ders ve faaliyetlerinden seçilmiş video kayıtları ve sohbet meclisleri."
        align="center"
      />

      <!-- Featured YouTube Video Component -->
      <div class="mt-12 sm:mt-16">
        <FeaturedYoutubeVideo
          :video-id="settings.featuredYoutubeVideoId"
          :title="settings.featuredYoutubeTitle"
          :description="settings.featuredYoutubeDescription"
          :channel-url="settings.youtubeUrl || 'https://www.youtube.com/@ikikelamresmi'"
        />
      </div>
    </Container>
  </section>
</template>
