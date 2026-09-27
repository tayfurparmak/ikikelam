<script setup lang="ts">
import { Clock } from 'lucide-vue-next'

interface ScheduleItem {
  id: string
  day: string
  time: string
  lesson: string
  instructor: string
}

defineProps<{
  items?: ScheduleItem[]
}>()
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-soft-gray/50 bg-white shadow-xs">
    <div class="p-4 bg-cream-100 border-b border-soft-gray/40 flex items-center justify-between">
      <h3 class="font-serif font-bold text-navy-950 flex items-center space-x-2">
        <Clock :size="18" class="text-gold-600" />
        <span>Haftalık Ders Takvimi</span>
      </h3>
      <span class="text-xs text-navy-900 bg-gold-100 px-2 py-0.5 rounded font-medium border border-gold-200">
        Güncel Müfredat
      </span>
    </div>

    <div class="divide-y divide-soft-gray/30">
      <div
        v-for="item in items || []"
        :key="item.id"
        class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-cream-50/80 transition"
      >
        <div>
          <span class="text-xs font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50 uppercase tracking-wide mr-2">
            {{ item.day }}
          </span>
          <span class="font-medium text-navy-950">{{ item.lesson }}</span>
          <span class="text-xs text-slate-500 block sm:inline sm:ml-2">({{ item.instructor }})</span>
        </div>
        <span class="text-xs font-mono font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded w-fit border border-slate-200">
          {{ item.time }}
        </span>
      </div>
    </div>
  </div>
</template>
