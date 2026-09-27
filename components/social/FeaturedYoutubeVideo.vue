<script setup lang="ts">
import { ref, computed } from 'vue'
import { Play, ArrowRight, Video } from 'lucide-vue-next'
import IconYoutube from '~/components/common/IconYoutube.vue'
import { getYoutubeThumbnailUrl, getYoutubeEmbedUrl } from '~/utils/youtube'

const props = withDefaults(
  defineProps<{
    videoId?: string | null
    title?: string | null
    description?: string | null
    channelUrl?: string
    badge?: string
  }>(),
  {
    videoId: 'CV797WTQ7b8',
    title: "Kur'an'da Heisenberg Belirsizlik İlkesi",
    description: "İki Kelam resmi YouTube kanalından ilim, irfan ve kainat tefekkürüne dair seçilmiş video sohbet.",
    channelUrl: 'https://www.youtube.com/@ikikelamresmi',
    badge: 'İki Kelam YouTube',
  }
)

const isPlaying = ref(false)
const thumbnailLoaded = ref(true)

// High-res with fallback to standard HQ
const thumbnailUrl = computed(() => {
  if (!props.videoId) return ''
  return getYoutubeThumbnailUrl(props.videoId, 'hqdefault')
})

const embedUrl = computed(() => {
  if (!props.videoId) return ''
  return getYoutubeEmbedUrl(props.videoId, true)
})

function startPlayback() {
  if (props.videoId) {
    isPlaying.value = true
  }
}
</script>

<template>
  <div class="relative w-full max-w-5xl mx-auto">
    <!-- Video Player Container (16:9 Aspect Ratio) -->
    <div
      v-if="videoId"
      class="relative w-full aspect-[16/9] rounded-3xl overflow-hidden bg-navy-950 border border-cream-200/90 shadow-xl transition-all"
    >
      <!-- Active YouTube Iframe (Loaded on Play click - Facade Pattern) -->
      <iframe
        v-if="isPlaying"
        :src="embedUrl"
        class="w-full h-full border-0 absolute inset-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="lazy"
        :title="title || 'İki Kelam YouTube Videosu'"
      />

      <!-- Facade Preview Screen (Optimized initial render) -->
      <div
        v-else
        class="relative w-full h-full group cursor-pointer select-none"
        role="button"
        tabindex="0"
        :aria-label="`${title || 'Videoyu'} oynat`"
        @click="startPlayback"
        @keydown.enter.prevent="startPlayback"
        @keydown.space.prevent="startPlayback"
      >
        <!-- Background Thumbnail Image -->
        <img
          v-if="thumbnailLoaded && thumbnailUrl"
          :src="thumbnailUrl"
          :alt="title || 'İki Kelam Video Görseli'"
          class="w-full h-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
          @error="thumbnailLoaded = false"
        >

        <!-- Fallback Gradient if thumbnail fails -->
        <div
          v-else
          class="w-full h-full bg-gradient-to-br from-emerald-950 via-navy-950 to-stone-900 flex items-center justify-center"
        >
          <Video class="w-16 h-16 text-emerald-400/40" />
        </div>

        <!-- Cinematic Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-navy-950/20 transition-opacity duration-300 group-hover:opacity-90" />

        <!-- Top Badge -->
        <div class="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-950/80 backdrop-blur-md border border-white/10 text-white text-xs font-semibold shadow-md">
          <IconYoutube class="w-4 h-4 text-red-600" />
          <span>{{ badge }}</span>
        </div>

        <!-- Center Play Button (Facade Trigger) -->
        <div class="absolute inset-0 flex items-center justify-center z-10">
          <div
            class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl transition-all duration-300 motion-safe:group-hover:scale-110 motion-safe:group-hover:bg-red-600 border border-white/20 group-focus-visible:ring-4 group-focus-visible:ring-white"
          >
            <Play class="w-7 h-7 sm:w-9 sm:h-9 fill-white translate-x-0.5" />
          </div>
        </div>

        <!-- Bottom Video Details Bar -->
        <div class="absolute bottom-0 inset-x-0 p-5 sm:p-8 z-10 text-white space-y-1">
          <h3 class="font-serif text-lg sm:text-2xl font-bold tracking-tight line-clamp-1 group-hover:text-emerald-300 transition-colors">
            {{ title }}
          </h3>
          <p v-if="description" class="text-xs sm:text-sm text-slate-300 line-clamp-2 font-light max-w-2xl leading-relaxed">
            {{ description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Fallback Card if Video ID is missing -->
    <div
      v-else
      class="bg-white rounded-3xl p-8 sm:p-12 border border-cream-200/90 shadow-md text-center max-w-2xl mx-auto space-y-4"
    >
      <div class="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
        <IconYoutube class="w-8 h-8" />
      </div>
      <h3 class="font-serif text-2xl font-bold text-navy-950">
        İki Kelam YouTube Kanalı
      </h3>
      <p class="text-slate-600 text-sm max-w-md mx-auto font-light leading-relaxed">
        İlim meclislerimiz, haftalık sohbetlerimiz ve ders halkalarımız resmi YouTube kanalımızda yayınlanmaktadır.
      </p>
      <div class="pt-2">
        <a
          :href="channelUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-md transition-all"
        >
          <IconYoutube class="w-5 h-5" />
          <span>YouTube Kanalımızı Ziyaret Edin</span>
        </a>
      </div>
    </div>

    <!-- Channel CTA Link Under Video -->
    <div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
      <div class="text-xs text-slate-500">
        <span>Resmi kanalımızdan yeni sohbet ve ders kayıtlarını takip edebilirsiniz.</span>
      </div>

      <a
        :href="channelUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors group"
      >
        <IconYoutube class="w-4 h-4 text-red-600" />
        <span>YouTube kanalımızda daha fazlasını keşfedin</span>
        <ArrowRight class="w-4 h-4 transition-transform motion-safe:group-hover:translate-x-1" />
      </a>
    </div>
  </div>
</template>
