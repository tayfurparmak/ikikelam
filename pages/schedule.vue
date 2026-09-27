<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calendar, Clock, User, Users, BookOpen, Compass, ChevronRight } from 'lucide-vue-next'
import Container from '~/components/common/Container.vue'
import SectionTitle from '~/components/common/SectionTitle.vue'

interface ScheduleItem {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  lessonName: string
  teacher: string
  targetAudience?: string | null
  description?: string | null
  isActive: boolean
}

const dayNames = [
  '',
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
]

const selectedDay = ref<number>(0) // 0: Tüm Hafta, 1-7: Belirli Gün

const { data: response, status } = await useFetch<{ success: boolean; data: ScheduleItem[] }>('/api/schedule')

const isLoading = computed(() => status.value === 'pending')
const allSchedules = computed(() => response.value?.data || [])

// Group by day of week
const groupedSchedules = computed(() => {
  const groups: Array<{ day: number; dayName: string; items: ScheduleItem[] }> = []

  for (let day = 1; day <= 7; day++) {
    const items = allSchedules.value.filter((item) => item.dayOfWeek === day)
    if (items.length > 0) {
      // Sort by startTime
      items.sort((a, b) => a.startTime.localeCompare(b.startTime))
      groups.push({
        day,
        dayName: dayNames[day],
        items,
      })
    }
  }

  return groups
})

// Filtered groups based on selectedDay tab
const visibleGroups = computed(() => {
  if (selectedDay.value === 0) {
    return groupedSchedules.value
  }
  return groupedSchedules.value.filter((g) => g.day === selectedDay.value)
})

const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl || 'https://ikikelam.org.tr').replace(/\/+$/, '')

useSeoMeta({
  title: 'Haftalık Ders Programı & İlmi Meclisler — İki Kelam',
  description:
    'İki Kelam Medresesi haftalık ders programı; fıkıh, tefsir, hadis, akaid ve alet ilimleri okumaları gün ve saat detayları.',
  ogTitle: 'Haftalık Ders Programı & İlmi Meclisler — İki Kelam',
  ogDescription:
    'Fıkıh, tefsir, hadis ve mantık meclislerimiz için haftalık gün ve saat takvimi.',
  ogType: 'website',
  ogUrl: `${siteUrl}/schedule`,
  ogImage: `${siteUrl}/logo.svg`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Haftalık Ders Programı & İlmi Meclisler — İki Kelam',
  twitterDescription:
    'Fıkıh, tefsir, hadis ve mantık meclislerimiz için haftalık gün ve saat takvimi.',
  twitterImage: `${siteUrl}/logo.svg`,
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/schedule` }],
})
</script>

<template>
  <div class="min-h-screen bg-warm-white py-12 sm:py-20">
    <Container size="xl">
      <!-- Breadcrumbs -->
      <nav aria-label="Ekmek Kırıntısı" class="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-8">
        <NuxtLink to="/" class="hover:text-emerald-800 transition-colors">Ana Sayfa</NuxtLink>
        <ChevronRight class="w-3.5 h-3.5 text-slate-400" />
        <span class="text-stone-900 font-semibold" aria-current="page">Haftalık Program</span>
      </nav>

      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <SectionTitle
          badge="Ders Takvimi"
          title="Haftalık İlmi Meclisler ve Tedrisat"
          subtitle="Medresemizde icra edilen klasik metin mütalaaları, haftalık sohbetler ve umuma açık ilim halkalarının gün ve saat takvimi."
          align="center"
        />

        <!-- Day Filter Tabs -->
        <div class="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mt-8">
          <button
            type="button"
            :class="[
              'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/40',
              selectedDay === 0
                ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-cream-100 hover:text-emerald-900'
            ]"
            @click="selectedDay = 0"
          >
            Tüm Hafta
          </button>

          <button
            v-for="d in [1, 2, 3, 4, 5, 6, 7]"
            :key="d"
            type="button"
            :class="[
              'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/40',
              selectedDay === d
                ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-cream-100 hover:text-emerald-900'
            ]"
            @click="selectedDay = d"
          >
            {{ dayNames[d] }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-8 max-w-4xl mx-auto">
        <div v-for="i in 3" :key="i" class="p-6 rounded-2xl bg-white border border-stone-200 animate-pulse space-y-4">
          <div class="h-5 bg-slate-200 rounded w-1/4" />
          <div class="h-4 bg-slate-200 rounded w-3/4" />
          <div class="h-4 bg-slate-200 rounded w-1/2" />
        </div>
      </div>

      <!-- Schedule Groups (Day-by-Day Cards) -->
      <div v-else-if="visibleGroups.length > 0" class="max-w-4xl mx-auto space-y-10">
        <section
          v-for="group in visibleGroups"
          :key="group.day"
          class="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200/90 shadow-xs"
        >
          <!-- Day Header -->
          <div class="flex items-center justify-between pb-5 mb-6 border-b border-cream-200/80">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100/80">
                <Calendar class="w-5 h-5" />
              </div>
              <div>
                <h2 class="font-serif text-2xl font-bold text-navy-950">
                  {{ group.dayName }}
                </h2>
                <p class="text-xs text-slate-500 font-light">
                  {{ group.items.length }} ders planlandı
                </p>
              </div>
            </div>

            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800">
              <BookOpen class="w-3.5 h-3.5 text-emerald-700" />
              <span>Ders Meclisleri</span>
            </span>
          </div>

          <!-- Lessons List (Card / Responsive Row Layout) -->
          <div class="space-y-4">
            <article
              v-for="item in group.items"
              :key="item.id"
              class="group p-5 rounded-2xl bg-cream-50/70 hover:bg-cream-100/80 border border-stone-200/60 hover:border-emerald-700/40 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <!-- Left: Time & Lesson Info -->
              <div class="flex-1 space-y-2">
                <!-- Time & Audience Badges -->
                <div class="flex items-center gap-2.5 flex-wrap">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-800 text-white text-xs font-semibold shadow-xs">
                    <Clock class="w-3.5 h-3.5 text-gold-300" />
                    <span>{{ item.startTime }} - {{ item.endTime }}</span>
                  </span>

                  <span
                    v-if="item.targetAudience"
                    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-white border border-stone-200 text-stone-700"
                  >
                    <Users class="w-3 h-3 text-slate-400" />
                    <span>{{ item.targetAudience }}</span>
                  </span>
                </div>

                <!-- Lesson Name -->
                <h3 class="font-serif text-lg sm:text-xl font-bold text-navy-950 group-hover:text-emerald-900 transition-colors">
                  {{ item.lessonName }}
                </h3>

                <!-- Description -->
                <p v-if="item.description" class="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                  {{ item.description }}
                </p>
              </div>

              <!-- Right: Teacher Info -->
              <div class="shrink-0 flex md:flex-col items-center md:items-end justify-between md:justify-center pt-3 md:pt-0 border-t md:border-t-0 border-stone-200/60 text-right">
                <span class="text-[11px] uppercase tracking-wider text-slate-400 font-semibold md:block">
                  Müderris
                </span>
                <div class="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-950 mt-0.5">
                  <User class="w-4 h-4 text-emerald-700" />
                  <span>{{ item.teacher }}</span>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20 px-4 rounded-3xl bg-white border border-stone-200/80 shadow-xs max-w-lg mx-auto">
        <div class="w-16 h-16 rounded-2xl bg-cream-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 border border-cream-200">
          <Compass class="w-8 h-8 text-emerald-700" />
        </div>
        <h3 class="font-serif text-2xl font-bold text-navy-950 mb-2">
          Ders Programı Bulunamadı
        </h3>
        <p class="text-stone-500 text-sm max-w-sm mx-auto mb-6 font-light">
          {{ selectedDay !== 0 ? `${dayNames[selectedDay]} günü için planlanmış toplu ders bulunmamaktadır.` : 'Henüz aktif ders takvimi girilmemiştir.' }}
        </p>
        <button
          v-if="selectedDay !== 0"
          type="button"
          class="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-medium text-xs hover:bg-emerald-900 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700"
          @click="selectedDay = 0"
        >
          Tüm Haftayı Görüntüle
        </button>
      </div>
    </Container>
  </div>
</template>
