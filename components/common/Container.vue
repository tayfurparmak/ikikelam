<script setup lang="ts">
interface Props {
  as?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

withDefaults(defineProps<Props>(), {
  as: 'div',
  size: 'xl',
  className: '',
})
</script>

<template>
  <component
    :is="as"
    class="mx-auto w-full px-4 sm:px-6 lg:px-8"
    :class="[
      size === 'sm' && 'max-w-3xl',
      size === 'md' && 'max-w-5xl',
      size === 'lg' && 'max-w-6xl',
      size === 'xl' && 'max-w-7xl',
      size === 'full' && 'max-w-full',
      className,
    ]"
  >
    <slot />
  </component>
</template>
