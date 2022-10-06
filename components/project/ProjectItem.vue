<script setup lang="ts">
import { LinkIcon } from '@heroicons/vue/20/solid'

const props = defineProps<{
  title: string;
  description: string;
  link: string;
}>()

const domain = computed(() => new URL(props.link).host)
</script>

<template>
  <a
    class="group font-normal p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-800 md:rounded-xl motion-safe:transition"
    :href="link"
    target="_blank"
  >
    <h3 class="font-semibold dark:text-gray-200 dark:group-hover:text-gray-100 dark:contrast-more:text-gray-100 motion-safe:transform">
      {{ title }}
    </h3>
    <p class="mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300 dark:contrast-more:text-gray-300 dark:contrast-more:font-medium motion-safe:transform">
      {{ description }}
    </p>

    <p class="mt-6 text-gray-400 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-500 flex items-center font-semibold text-sm motion-safe:transition">
      <LinkIcon class="w-4 h-4" aria-hidden="true" />
      <span class="ml-3">{{ domain }}</span>
    </p>
  </a>
</template>