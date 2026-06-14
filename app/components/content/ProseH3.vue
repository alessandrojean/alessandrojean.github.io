<template>
  <h3 data-slot="heading-3">
    <NuxtLink
      v-if="props.id && generate"
      :id="props.id"
      :to="{ hash: `#${props.id}` }"
    >
      <span
        aria-hidden="true"
        data-slot="heading-section"
      >&sect;</span>
      <slot />
    </NuxtLink>
    <slot v-else />
  </h3>
</template>

<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports';

const props = defineProps<{ id?: string }>();

const { headings } = useRuntimeConfig().public.mdc;
const generate = computed(() => props.id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h3)));
</script>
