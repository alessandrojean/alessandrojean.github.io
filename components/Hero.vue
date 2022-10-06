<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>()
</script>

<template>
  <div class="py-16 max-w-xl">
    <h1 class="text-2xl md:text-3xl font-bold dark:text-gray-100 dark:contrast-more:text-white motion-safe:transition">
      {{ title }}
    </h1>

    <p class="text-gray-700 dark:text-gray-300 dark:contrast-more:text-gray-200 mt-3 md:text-lg motion-safe:transition">
      {{ description }}
    </p>
  </div>
</template>