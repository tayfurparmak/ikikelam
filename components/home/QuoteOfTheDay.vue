<script setup lang="ts">
import { ref } from 'vue'
import { BookOpen, Quote, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { WISDOM_QUOTES, type WisdomQuote } from '~/data/quotes'
import Container from '~/components/common/Container.vue'

const currentIndex = ref(0)
const quotes = WISDOM_QUOTES

const activeQuote = computed<WisdomQuote>(() => quotes[currentIndex.value] || quotes[0])

const nextQuote = () => {
  currentIndex.value = (currentIndex.value + 1) % quotes.length
}

const prevQuote = () => {
  currentIndex.value = (currentIndex.value - 1 + quotes.length) % quotes.length
}
</script>

<template>
  <section class="py-16 md:py-24 bg-cream/40 relative overflow-hidden border-y border-stone-200/60">
    <!-- Subtle ornamental background pattern -->
    <div
      class="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#14532d_1px,transparent_1px)] [background-size:24px_24px]"
      aria-hidden="true"
    />

    <Container>
      <div class="max-w-4xl mx-auto">
        <!-- Card Container with subtle Islamic/Classic aesthetic -->
        <div
          class="relative bg-white/95 rounded-3xl p-8 sm:p-12 md:p-16 border border-emerald-900/10 shadow-sm shadow-emerald-950/5 text-center transition-all duration-300 backdrop-blur-sm"
        >
          <!-- Top Ornament & Tag -->
          <div class="flex items-center justify-center gap-3 mb-6">
            <span class="h-px w-8 bg-emerald-600/30" />
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-emerald-50 text-emerald-800 border border-emerald-100"
            >
              <BookOpen class="w-3.5 h-3.5 text-emerald-600" />
              {{ activeQuote.typeLabel }}
            </span>
            <span class="h-px w-8 bg-emerald-600/30" />
          </div>

          <!-- Decorative Large Quote Mark -->
          <div class="flex justify-center mb-4 text-emerald-600/20" aria-hidden="true">
            <Quote class="w-12 h-12 rotate-180" />
          </div>

          <!-- Arabic Calligraphic / Serif Text -->
          <div
            v-if="activeQuote.arabicText"
            class="text-2xl sm:text-3xl md:text-4xl text-emerald-950 font-serif leading-relaxed mb-6 dir-rtl px-4 font-normal"
            dir="rtl"
            lang="ar"
          >
            {{ activeQuote.arabicText }}
          </div>

          <!-- Turkish Translation / Meaning -->
          <blockquote class="text-lg sm:text-xl md:text-2xl text-stone-800 font-serif font-medium leading-relaxed max-w-3xl mx-auto mb-6">
            "{{ activeQuote.turkishText }}"
          </blockquote>

          <!-- Source & Commentary -->
          <div class="space-y-1 mb-8">
            <cite class="not-italic text-sm font-semibold text-emerald-800 tracking-wide block">
              — {{ activeQuote.source }}
            </cite>
            <p v-if="activeQuote.commentary" class="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto italic">
              {{ activeQuote.commentary }}
            </p>
          </div>

          <!-- Navigation Dots & Controls -->
          <div class="flex items-center justify-center gap-4 pt-4 border-t border-stone-100">
            <button
              type="button"
              class="p-2 rounded-full text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              aria-label="Önceki Hikmet"
              @click="prevQuote"
            >
              <ChevronLeft class="w-5 h-5" />
            </button>

            <div class="flex items-center gap-2">
              <button
                v-for="(q, idx) in quotes"
                :key="q.id"
                type="button"
                :class="[
                  'h-2 rounded-full transition-all duration-300 focus:outline-none',
                  currentIndex === idx ? 'w-6 bg-emerald-700' : 'w-2 bg-stone-200 hover:bg-stone-300'
                ]"
                :aria-label="`${q.typeLabel} göster`"
                @click="currentIndex = idx"
              />
            </div>

            <button
              type="button"
              class="p-2 rounded-full text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              aria-label="Sonraki Hikmet"
              @click="nextQuote"
            >
              <ChevronRight class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>
