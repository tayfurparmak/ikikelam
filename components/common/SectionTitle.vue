<script setup lang="ts">
interface Props {
  badge?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  badgeVariant?: 'emerald' | 'gold' | 'navy'
  titleTag?: 'h1' | 'h2' | 'h3'
  inverted?: boolean
}

withDefaults(defineProps<Props>(), {
  badge: undefined,
  subtitle: undefined,
  align: 'center',
  badgeVariant: 'emerald',
  titleTag: 'h2',
  inverted: false,
})
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
      v-if="badge"
      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 transition-colors select-none"
      :class="[
        !inverted && badgeVariant === 'emerald' && 'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
        !inverted && badgeVariant === 'gold' && 'bg-gold-50 text-gold-900 border border-gold-200/70',
        !inverted && badgeVariant === 'navy' && 'bg-navy-50 text-navy-800 border border-navy-200/70',
        inverted && 'bg-white/10 text-white/90 border border-white/15 backdrop-blur-sm',
      ]"
    >
      <span
        class="w-1.5 h-1.5 rounded-full"
        :class="[
          badgeVariant === 'emerald' && 'bg-emerald-600',
          badgeVariant === 'gold' && 'bg-gold-600',
          badgeVariant === 'navy' && 'bg-navy-600',
          inverted && 'bg-gold-400',
        ]"
      />
      <span>{{ badge }}</span>
    </div>

    <!-- Main Heading -->
    <component
      :is="titleTag"
      class="font-serif font-bold tracking-tight text-balance leading-tight"
      :class="[
        titleTag === 'h1' && 'text-3xl sm:text-4xl lg:text-5xl',
        titleTag === 'h2' && 'text-2xl sm:text-3xl lg:text-4xl',
        titleTag === 'h3' && 'text-xl sm:text-2xl lg:text-3xl',
        inverted ? 'text-white' : 'text-navy-950',
      ]"
    >
      {{ title }}
    </component>

    <!-- Decorative Accent Line -->
    <div
      class="h-0.5 mt-3.5 mb-3 rounded-full"
      :class="[
        align === 'center' && 'w-12 mx-auto',
        align === 'left' && 'w-12',
        align === 'right' && 'w-12 ml-auto',
        inverted ? 'bg-gold-400/70' : 'bg-emerald-700/60',
      ]"
    />

    <!-- Subtitle / Description -->
    <p
      v-if="subtitle"
      class="text-base sm:text-lg leading-relaxed font-normal text-balance mt-2"
      :class="[inverted ? 'text-cream-200/85' : 'text-slate-600']"
    >
      {{ subtitle }}
    </p>

    <!-- Optional Slot for CTA or Action buttons -->
    <div v-if="$slots.default" class="mt-5">
      <slot />
    </div>
  </div>
</template>
