<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'navy' | 'gold' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  href?: string
  target?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  iconLeft?: Component
  iconRight?: Component
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  to: undefined,
  href: undefined,
  target: undefined,
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
  iconLeft: undefined,
  iconRight: undefined,
})

const isNuxtLink = computed(() => !!props.to && !props.disabled)
const isExternal = computed(() => !!props.href && !props.disabled)
</script>

<template>
  <component
    :is="isNuxtLink ? 'NuxtLink' : isExternal ? 'a' : 'button'"
    :to="isNuxtLink ? to : undefined"
    :href="isExternal ? href : undefined"
    :target="isExternal ? (target || '_blank') : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    :type="!isNuxtLink && !isExternal ? type : undefined"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100"
    :class="[
      // Width
      block ? 'w-full' : 'w-auto',

      // Sizing
      size === 'sm' && 'text-xs px-3.5 py-1.5 gap-1.5 min-h-[34px]',
      size === 'md' && 'text-sm px-5 py-2.5 gap-2 min-h-[42px]',
      size === 'lg' && 'text-base px-6 py-3.5 gap-2.5 min-h-[50px]',

      // Variants
      variant === 'primary' &&
        'bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm hover:shadow focus-visible:ring-emerald-700',
      variant === 'navy' &&
        'bg-navy-900 hover:bg-navy-950 text-white shadow-sm hover:shadow focus-visible:ring-navy-800',
      variant === 'gold' &&
        'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold shadow-sm hover:shadow-md focus-visible:ring-amber-500',
      variant === 'secondary' &&
        'bg-cream-200 hover:bg-cream-300/80 text-navy-900 border border-cream-300 focus-visible:ring-cream-300',
      variant === 'outline' &&
        'bg-transparent border border-emerald-800/80 hover:bg-emerald-50 text-emerald-900 focus-visible:ring-emerald-700',
      variant === 'ghost' &&
        'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-navy-900 focus-visible:ring-slate-300',
    ]"
  >
    <!-- Loading Spinner -->
    <svg
      v-if="loading"
      class="animate-spin -ml-0.5 h-4 w-4 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>

    <!-- Icon Left -->
    <component
      :is="iconLeft"
      v-else-if="iconLeft"
      class="shrink-0"
      :class="[
        size === 'sm' && 'w-3.5 h-3.5',
        size === 'md' && 'w-4 h-4',
        size === 'lg' && 'w-5 h-5',
      ]"
    />

    <!-- Slot Text -->
    <span class="truncate">
      <slot />
    </span>

    <!-- Icon Right -->
    <component
      :is="iconRight"
      v-if="iconRight && !loading"
      class="shrink-0"
      :class="[
        size === 'sm' && 'w-3.5 h-3.5',
        size === 'md' && 'w-4 h-4',
        size === 'lg' && 'w-5 h-5',
      ]"
    />
  </component>
</template>
