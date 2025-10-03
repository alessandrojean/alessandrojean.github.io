<template>
  <iframe
    class="aspect-[4/3] overflow-hidden w-full"
    data-slot="embed"
    :src
    loading="lazy"
  />
</template>

<script lang="ts" setup>
import type { EmbedBlockObjectResponse } from '@notionhq/client';

const { block } = defineProps<{ block: EmbedBlockObjectResponse }>();

const src = computed(() => {
  return block.embed.url.replace('/pen/', '/embed/preview/');
});
</script>
