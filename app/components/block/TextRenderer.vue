<template>
  <BlockDecorator
    v-for="(t, i) in richText"
    :key="i"
    :text="t"
    :id-map
  />
</template>

<script lang="ts" setup>
import type { RichTextItemResponse } from '@notionhq/client';

const { richText } = defineProps<{
  richText: RichTextItemResponse[];
  idMap: Record<string, string>;
}>();
</script>
