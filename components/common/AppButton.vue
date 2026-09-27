<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    :class="[
      variant === 'primary' && 'bg-emerald-800 hover:bg-emerald-900 text-white focus:ring-emerald-700 shadow-sm',
      variant === 'secondary' && 'bg-navy-800 hover:bg-navy-900 text-white focus:ring-navy-700 shadow-sm',
      variant === 'outline' && 'border border-emerald-800 text-emerald-800 hover:bg-emerald-50 focus:ring-emerald-700',
      variant === 'ghost' && 'text-slate-700 hover:bg-slate-100 hover:text-navy-900 focus:ring-slate-400',
      size === 'sm' && 'px-3 py-1.5 text-xs',
      size === 'md' && 'px-4 py-2 text-sm',
      size === 'lg' && 'px-6 py-3 text-base',
    ]"
  >
    <slot />
  </button>
</template>
