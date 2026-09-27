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
  <section class="py-16 md:py-24 bg-paper-100/60 relative overflow-hidden border-b border-paper-300/80">
    <Container>
      <div class="max-w-4xl mx-auto">
        <!-- Card Container with subtle Islamic/Classic aesthetic -->
        <div
          class="relative bg-white rounded-3xl sm:rounded-4xl p-8 sm:p-12 md:p-16 border border-paper-300 shadow-elevated text-center transition-all duration-300"
        >
          <!-- Top Ornament & Tag -->
          <div class="flex items-center justify-center gap-3 mb-6 select-none">
            <span class="h-px w-8 bg-gold-400/50" />
            <span
              class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-gold-50 text-amber-950 border border-gold-200/80"
            >
              <BookOpen class="w-3.5 h-3.5 text-gold-600" />
              {{ activeQuote.typeLabel }}
            </span>
            <span class="h-px w-8 bg-gold-400/50" />
          </div>

          <!-- Decorative Large Quote Mark -->
          <div class="flex justify-center mb-4 text-gold-400/30" aria-hidden="true">
            <Quote class="w-12 h-12 rotate-180" />
          </div>

          <!-- Arabic Calligraphic / Serif Text -->
          <div
            v-if="activeQuote.arabicText"
            class="text-2xl sm:text-3xl md:text-4xl text-obsidian-950 font-serif leading-relaxed mb-6 dir-rtl px-4 font-normal"
            dir="rtl"
            lang="ar"
          >
            {{ activeQuote.arabicText }}
          </div>

          <!-- Turkish Translation / Meaning -->
          <blockquote class="text-lg sm:text-xl md:text-2xl text-obsidian-900 font-serif font-medium leading-relaxed max-w-3xl mx-auto mb-6">
            "{{ activeQuote.turkishText }}"
          </blockquote>

          <!-- Source & Commentary -->
          <div class="space-y-1 mb-8">
            <cite class="not-italic text-sm font-bold text-emerald-900 tracking-wide block">
              — {{ activeQuote.source }}
            </cite>
            <p v-if="activeQuote.commentary" class="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto italic font-light">
              {{ activeQuote.commentary }}
            </p>
          </div>

          <!-- Navigation Dots & Controls -->
          <div class="flex items-center justify-center gap-4 pt-5 border-t border-paper-200">
            <button
              type="button"
              class="p-2.5 rounded-full text-slate-400 hover:text-obsidian-950 hover:bg-paper-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 touch-target flex items-center justify-center"
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
                  'h-2 rounded-full transition-all duration-300 focus-visible:outline-none',
                  currentIndex === idx ? 'w-7 bg-gold-500' : 'w-2 bg-paper-300 hover:bg-slate-300'
                ]"
                :aria-label="`${q.typeLabel} göster`"
                @click="currentIndex = idx"
              />
            </div>

            <button
              type="button"
              class="p-2.5 rounded-full text-slate-400 hover:text-obsidian-950 hover:bg-paper-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 touch-target flex items-center justify-center"
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
