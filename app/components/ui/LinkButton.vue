<template>
  <NuxtLink
    v-bind="props"
    class="inline-flex items-center justify-center size-8 rounded-md text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all"
  >
    <slot />
  </NuxtLink>
</template>

<script lang="ts" setup>
import type { NuxtLinkProps } from '#app';

const props = defineProps<NuxtLinkProps>();
</script>
