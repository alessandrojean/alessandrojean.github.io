<template>
  <NuxtLink v-bind="props" class="inline-flex items-center justify-center gap-1.5 px-3 h-8 has-[>svg]:px-2.5 rounded-md dark:text-gray-300 dark:hover:text-white border border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-xs text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
    <slot />
  </NuxtLink>
</template>

<script lang="ts" setup>
import type { NuxtLinkProps } from '#app'

const props = defineProps<NuxtLinkProps>();
</script>
