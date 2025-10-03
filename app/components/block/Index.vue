<template>
  <BlockParagraph v-if="type === 'paragraph'" :block :id-map />
  <BlockCallout v-else-if="type === 'callout'" :block :id-map />
  <BlockHeading2 v-else-if="type === 'heading_2'" :block :id-map />
  <BlockHeading3 v-else-if="type === 'heading_3'" :block :id-map />
  <BlockTableOfContents
    v-else-if="type === 'table_of_contents'"
    :block :id-map
    :post
  />
  <BlockQuote v-else-if="type === 'quote'" :block :id-map />
  <BlockTable v-else-if="type === 'table'" :block :id-map />
  <BlockFigure
    v-else-if="type === 'image' || type === 'video' || type === 'code' || type === 'embed'"
    :block :id-map
  />
  <BlockNumberedList v-else-if="type === 'numbered_list'" :block :id-map />
  <BlockBulletedList v-else-if="type === 'bulleted_list'" :block :id-map />
  <BlockColumnList v-else-if="type === 'column_list'" :block :id-map />
  <BlockToDoList v-else-if="type === 'to_do_list'" :block :id-map />
  <BlockEquation v-else-if="type === 'equation'" :block :id-map />
  <BlockDivider v-else-if="type === 'divider'" :block :id-map />
  <pre v-else class="bg-red-200">{{ block }}</pre>
</template>

<script lang="ts" setup>
import type { BlockWithChildren } from '~~/shared/types/notion';

const { block, post } = defineProps<{ 
  block: BlockWithChildren;
  idMap: Record<string, string>;
  post: BlockWithChildren[];
}>();

const type = computed(() => block.type);
</script>
