<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  badge?: string
  tag?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  badgeVariant?: 'emerald' | 'gold' | 'navy'
  titleTag?: 'h1' | 'h2' | 'h3'
  inverted?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  badge: undefined,
  tag: undefined,
  subtitle: undefined,
  align: 'center',
  badgeVariant: 'gold',
  titleTag: 'h2',
  inverted: false,
})

const activeBadge = computed(() => props.badge || props.tag)
</script>

<template>
  <div
    class="w-full flex flex-col"
    :class="[
      align === 'center' && 'items-center text-center mx-auto max-w-3xl',
      align === 'left' && 'items-start text-left max-w-2xl',
      align === 'right' && 'items-end text-right ml-auto max-w-2xl',
    ]"
  >
    <!-- Badge / Eyebrow -->
    <div
      v-if="activeBadge"
      class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-3.5 transition-all select-none shadow-xs"
      :class="[
        !inverted && badgeVariant === 'emerald' && 'bg-emerald-50/90 text-emerald-900 border border-emerald-200/80',
        !inverted && badgeVariant === 'gold' && 'bg-gold-50/90 text-amber-950 border border-gold-200/80',
        !inverted && badgeVariant === 'navy' && 'bg-obsidian-100 text-obsidian-900 border border-obsidian-200',
        inverted && 'bg-white/10 text-white/95 border border-white/20 backdrop-blur-md',
      ]"
    >
      <span
        class="w-1.5 h-1.5 rounded-full animate-pulse"
        :class="[
          badgeVariant === 'emerald' && 'bg-emerald-600',
          badgeVariant === 'gold' && 'bg-gold-500',
          badgeVariant === 'navy' && 'bg-obsidian-700',
          inverted && 'bg-gold-400',
        ]"
      />
      <span>{{ activeBadge }}</span>
    </div>

    <!-- Main Heading -->
    <component
      :is="titleTag"
      class="font-serif font-bold tracking-tight text-balance leading-tight"
      :class="[
        titleTag === 'h1' && 'text-3xl sm:text-4xl lg:text-5xl',
        titleTag === 'h2' && 'text-2xl sm:text-3xl lg:text-4xl',
        titleTag === 'h3' && 'text-xl sm:text-2xl lg:text-3xl',
        inverted ? 'text-white' : 'text-obsidian-900',
      ]"
    >
      {{ title }}
    </component>

    <!-- Decorative Accent Line -->
    <div
      class="h-1 mt-4 mb-3.5 rounded-full"
      :class="[
        align === 'center' && 'w-16 mx-auto',
        align === 'left' && 'w-16',
        align === 'right' && 'w-16 ml-auto',
        inverted ? 'bg-gradient-to-r from-gold-400 to-amber-300 opacity-90' : 'bg-gradient-to-r from-emerald-800 via-gold-500 to-emerald-800 opacity-80',
      ]"
    />

    <!-- Subtitle / Description -->
    <p
      v-if="subtitle"
      class="text-base sm:text-lg leading-relaxed font-light text-balance mt-2"
      :class="[inverted ? 'text-paper-200/85' : 'text-slate-600']"
    >
      {{ subtitle }}
    </p>

    <!-- Optional Slot for CTA or Action buttons -->
    <div v-if="$slots.default" class="mt-5">
      <slot />
    </div>
  </div>
</template>
