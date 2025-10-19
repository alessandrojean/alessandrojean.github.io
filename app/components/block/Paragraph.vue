<template>
  <p data-slot="paragraph">
    <BlockTextRenderer
      :rich-text="block.paragraph.rich_text"
      :id-map
    />
  </p>
</template>

<script lang="ts" setup>
import type { ParagraphBlockObjectResponse } from '@notionhq/client';

const { block, idMap } = defineProps<{
  block: ParagraphBlockObjectResponse;
  idMap: Record<string, string>;
}>();
</script>
