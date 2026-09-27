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
    class="inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100"
    :class="[
      // Width
      block ? 'w-full' : 'w-auto',

      // Sizing (mobile-first touch targets: md is 44px)
      size === 'sm' && 'text-xs px-3.5 py-2 gap-1.5 min-h-[36px]',
      size === 'md' && 'text-sm px-5 py-2.5 gap-2 min-h-[44px]',
      size === 'lg' && 'text-base px-6 py-3.5 gap-2.5 min-h-[52px]',

      // Variants
      variant === 'primary' &&
        'bg-emerald-800 hover:bg-emerald-900 text-white shadow-soft hover:shadow-emerald focus-visible:ring-emerald-700',
      variant === 'navy' &&
        'bg-obsidian-900 hover:bg-obsidian-950 text-white shadow-soft focus-visible:ring-obsidian-700',
      variant === 'gold' &&
        'bg-gradient-to-r from-gold-400 via-amber-500 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-obsidian-950 font-bold shadow-soft hover:shadow-gold focus-visible:ring-gold-400',
      variant === 'secondary' &&
        'bg-paper-200 hover:bg-paper-300/80 text-obsidian-900 border border-paper-300 focus-visible:ring-paper-300',
      variant === 'outline' &&
        'bg-transparent border border-emerald-800/80 hover:bg-emerald-50/80 text-emerald-900 focus-visible:ring-emerald-700',
      variant === 'ghost' &&
        'bg-transparent hover:bg-paper-200 text-slate-700 hover:text-obsidian-950 focus-visible:ring-paper-300',
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
