<script setup lang="ts">
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-vue-next'
import { useAdminToast } from '~/composables/useAdminToast'

const { toasts, removeToast } = useAdminToast()
</script>

<template>
  <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none">
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-3 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-center justify-between gap-3 text-sm font-medium backdrop-blur-md',
          toast.type === 'success'
            ? 'bg-emerald-950/95 text-emerald-100 border-emerald-700/80 shadow-emerald-950/30'
            : toast.type === 'error'
              ? 'bg-red-950/95 text-red-100 border-red-700/80 shadow-red-950/30'
              : 'bg-navy-950/95 text-slate-100 border-navy-800 shadow-black/30'
        ]"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <CheckCircle2 v-if="toast.type === 'success'" class="w-5 h-5 text-emerald-400 shrink-0" />
          <AlertCircle v-else-if="toast.type === 'error'" class="w-5 h-5 text-red-400 shrink-0" />
          <Info v-else class="w-5 h-5 text-sky-400 shrink-0" />

          <p class="truncate">{{ toast.message }}</p>
        </div>

        <button
          type="button"
          class="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors focus:outline-none"
          aria-label="Kapat"
          @click="removeToast(toast.id)"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
