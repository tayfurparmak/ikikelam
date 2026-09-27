<script setup lang="ts">
import Container from '~/components/common/Container.vue'
import SectionTitle from '~/components/common/SectionTitle.vue'
import FeaturedYoutubeVideo from '~/components/social/FeaturedYoutubeVideo.vue'
import { useSiteSettings } from '~/composables/useSiteSettings'

const { settings } = useSiteSettings()
</script>

<template>
  <section class="py-16 sm:py-24 bg-paper-100/70 border-b border-paper-300/80">
    <Container size="xl">
      <!-- Section Title -->
      <SectionTitle
        badge="İki Kelam'dan"
        badge-variant="gold"
        title="İlim ve Sohbet Meclisi"
        subtitle="İki Kelam'ın sohbet, ders ve faaliyetlerinden seçilmiş video kayıtları ve hikmet halkaları."
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
