<template>
  <NuxtLink
    :to
    target="_blank"
    class="font-sans text-sm font-medium h-8 px-2.5 flex items-center justify-center gap-1.5 w-fit hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all -ml-2.5"
  >
    <Icon
      name="lucide:rss"
      class="size-4"
    />
    <slot>RSS</slot>
  </NuxtLink>
</template>

<script setup lang="ts">
const { to = '/blog/feed.xml' } = defineProps<{ to?: string }>();
</script>
