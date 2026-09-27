<script setup lang="ts">
import { AlertTriangle, X } from 'lucide-vue-next'

defineProps<{
  modelValue: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm' | 'cancel'): void
}>()

function close() {
  emit('update:modelValue', false)
  emit('cancel')
}

function handleConfirm() {
  emit('confirm')
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs select-none"
        role="dialog"
        aria-modal="true"
        @click.self="close"
      >
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200/90 space-y-5 animate-in fade-in zoom-in-95">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div
                :class="[
                  'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0',
                  danger ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                ]"
              >
                <AlertTriangle class="w-6 h-6" />
              </div>
              <div>
                <h3 class="font-serif text-lg font-bold text-navy-950">
                  {{ title || 'Onay Gerekli' }}
                </h3>
              </div>
            </div>

            <button
              type="button"
              class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              @click="close"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <p class="text-sm text-slate-600 leading-relaxed font-light">
            {{ message }}
          </p>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
              :disabled="loading"
              @click="close"
            >
              {{ cancelText || 'Vazgeç' }}
            </button>

            <button
              type="button"
              :class="[
                'px-5 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-sm focus:outline-none disabled:opacity-50',
                danger
                  ? 'bg-red-600 hover:bg-red-700 shadow-red-950/20'
                  : 'bg-emerald-800 hover:bg-emerald-900 shadow-emerald-950/20'
              ]"
              :disabled="loading"
              @click="handleConfirm"
            >
              <span v-if="loading">İşleniyor...</span>
              <span v-else>{{ confirmText || 'Onayla' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
