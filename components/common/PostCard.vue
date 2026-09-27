<script setup lang="ts">
import PostCardComponent, { type PostItem } from '~/components/home/PostCard.vue'

defineProps<{
  post: PostItem
  showCategory?: boolean
  compact?: boolean
}>()
</script>

<template>
  <PostCardComponent
    :post="post"
    :show-category="showCategory"
    :compact="compact"
  />
</template>
