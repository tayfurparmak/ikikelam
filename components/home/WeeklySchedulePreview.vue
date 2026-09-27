<script setup lang="ts">
import { Calendar, Clock, User, ArrowRight } from 'lucide-vue-next'
import Container from '~/components/common/Container.vue'
import SectionTitle from '~/components/common/SectionTitle.vue'
import Button from '~/components/common/Button.vue'

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

const dayNames = ['', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']

const { data: response, status } = await useFetch<{ success: boolean; data: ScheduleItem[] }>('/api/schedule', {
  lazy: true,
})

const isLoading = computed(() => status.value === 'pending')
const schedules = computed(() => {
  const list = response.value?.data || []
  // Preview for home page: show top 4 upcoming/scheduled lessons
  return list.slice(0, 4)
})
</script>

<template>
  <section class="py-16 sm:py-24 bg-cream-50/60 border-b border-cream-200 select-none">
    <Container size="xl">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <SectionTitle
          badge="Ders Takvimi"
          title="Haftalık İlmi Meclisler"
          subtitle="Medresemizde her hafta icra edilen fıkıh, akaid ve alet ilimleri okumaları."
          align="left"
        />

        <div class="shrink-0">
          <Button
            to="/program"
            variant="outline"
            size="md"
            :icon-right="ArrowRight"
          >
            Tüm Haftalık Programı Gör
          </Button>
        </div>
      </div>

      <!-- Loading State (Skeleton) -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="i in 4"
          :key="i"
          class="p-6 rounded-2xl bg-white border border-cream-200 animate-pulse space-y-4"
        >
          <div class="h-4 bg-slate-200 rounded w-1/3" />
          <div class="h-6 bg-slate-200 rounded w-3/4" />
          <div class="h-4 bg-slate-200 rounded w-1/2" />
        </div>
      </div>

      <!-- Content Grid -->
      <div v-else-if="schedules.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="item in schedules"
          :key="item.id"
          class="p-6 rounded-2xl bg-white border border-cream-200/90 shadow-xs hover:shadow-md hover:border-emerald-700/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <!-- Day & Time Header -->
            <div class="flex items-center justify-between gap-2 mb-3.5">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-800 text-white text-xs font-semibold">
                <Calendar class="w-3.5 h-3.5 text-gold-300" />
                <span>{{ dayNames[item.dayOfWeek] || 'Haftalık' }}</span>
              </span>

              <span class="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                <Clock class="w-3.5 h-3.5" />
                <span>{{ item.startTime }}</span>
              </span>
            </div>

            <!-- Lesson Name -->
            <h3 class="font-serif text-lg font-bold text-navy-950 mb-2 group-hover:text-emerald-900 transition-colors line-clamp-2">
              {{ item.lessonName }}
            </h3>

            <!-- Teacher Info -->
            <div class="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mb-3">
              <User class="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span class="truncate">{{ item.teacher }}</span>
            </div>

            <!-- Description -->
            <p v-if="item.description" class="text-xs text-slate-600 line-clamp-3 leading-relaxed font-light">
              {{ item.description }}
            </p>
          </div>

          <!-- Target Audience Footer -->
          <div class="mt-4 pt-3 border-t border-cream-200/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Hedef:</span>
            <span class="font-medium text-navy-900">{{ item.targetAudience || 'Umuma Açık' }}</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 px-4 rounded-2xl bg-white border border-cream-200 text-slate-500 text-sm">
        Aktif ders takvimi bulunamadı. Detaylar için lütfen iletişime geçiniz.
      </div>
    </Container>
  </section>
</template>
