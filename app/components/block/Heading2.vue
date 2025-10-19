<template>
  <h2 data-slot="heading-2">
    <NuxtLink
      :id
      :to="{ hash: `#${id}` }"
    >
      <span
        aria-hidden="true"
        data-slot="heading-section"
      >&sect;</span>
      <BlockTextRenderer
        :rich-text="block.heading_2.rich_text"
        :id-map
      />
    </NuxtLink>
  </h2>
</template>

<script lang="ts" setup>
import type { Heading2BlockObjectResponse } from '@notionhq/client';
import slugify from 'slugify';

const { block, idMap } = defineProps<{
  block: Heading2BlockObjectResponse;
  idMap: Record<string, string>;
}>();

const id = computed(() => {
  return slugify(getTextContent(block.heading_2.rich_text), {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    locale: 'pt',
  });
});
</script>
