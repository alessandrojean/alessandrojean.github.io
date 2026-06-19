<template>
  <NuxtLink
    :to
    class="font-sans text-sm font-medium h-8 px-2.5 flex items-center justify-center gap-1.5 w-fit hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all"
  >
    <Icon
      name="lucide:house"
      class="size-4"
    />
    <slot>Home</slot>
  </NuxtLink>
</template>

<script setup lang="ts">
const { to = '/' } = defineProps<{ to?: string }>();
</script>
