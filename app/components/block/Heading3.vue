<template>
  <h3 data-slot="heading-3">
    <NuxtLink :id :to="{ hash: `#${id}` }">
      <span aria-hidden="true" data-slot="heading-section">&sect;</span>
      <BlockTextRenderer :rich-text="block.heading_3.rich_text" :id-map />
    </NuxtLink>
  </h3>
</template>

<script lang="ts" setup>
import type { Heading3BlockObjectResponse } from '@notionhq/client'
import slugify from 'slugify'

const { block, idMap } = defineProps<{ 
  block: Heading3BlockObjectResponse;
  idMap: Record<string, string>;
}>();

const id = computed(() => {
  return slugify(getTextContent(block.heading_3.rich_text), {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    locale: 'pt',
  });
});
</script>
