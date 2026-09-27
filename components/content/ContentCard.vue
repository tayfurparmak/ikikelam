<script setup lang="ts">
interface Props {
  title: string
  description?: string
  category?: string
  date?: string
}

defineProps<Props>()
</script>

<template>
  <div class="group rounded-xl border border-soft-gray/50 bg-white p-6 shadow-xs hover:shadow-md hover:border-gold-500/50 transition-all duration-300 relative overflow-hidden">
    <!-- Subtle top gold accent bar on hover -->
    <div class="absolute top-0 left-0 right-0 h-0.5 bg-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

    <div v-if="category" class="text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
      <span class="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
      <span>{{ category }}</span>
    </div>
    <h3 class="font-serif text-lg font-bold text-navy-950 mb-2 leading-snug group-hover:text-emerald-950 transition-colors">
      {{ title }}
    </h3>
    <p v-if="description" class="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed font-light">
      {{ description }}
    </p>
    <div v-if="date" class="text-xs text-slate-400 font-medium">
      {{ date }}
    </div>
  </div>
</template>
