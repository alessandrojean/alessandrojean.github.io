<template>
  <NuxtImg
    data-slot="image"
    :alt="caption"
    :src="imageUrl"
    densities="x1"
    placeholder
    format="webp"
    loading="lazy"
  />
</template>

<script lang="ts" setup>
import type { ImageBlockObjectResponse } from '@notionhq/client';

const { block } = defineProps<{ block: ImageBlockObjectResponse }>();

const imageUrl = computed(() => {
  return block.image.type === 'external'
    ? block.image.external.url
    : block.image.file.url;
});

const caption = computed(() => getTextContent(block.image.caption));
</script>
