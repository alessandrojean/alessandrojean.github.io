<template>
  <div
    data-slot="column-list"
    :data-image="isOnlyImages"
    :style="{
      '--cols': block.children?.length ?? 1,
      '--template': template,
    }"
  >
    <div
      v-for="column in block.children"
      :key="column.id"
      class="typography"
      data-slot="column"
    >
      <BlockRenderer :blocks="children(column)" :id-map no-container />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ColumnBlockObjectResponse, ColumnListBlockObjectResponse } from '@notionhq/client';
import type { BlockWithChildren, WithChildren } from '~~/shared/types/notion'

type ColumnListBlock = ColumnListBlockObjectResponse & {
  children?: WithChildren<ColumnBlockObjectResponse>[];
};

const { block, idMap } = defineProps<{ 
  block: ColumnListBlock;
  idMap: Record<string, string>;
}>();

const isOnlyImages = computed(() => {
  return block.children!.every(c => c.children?.[0]?.type === 'image');
});

const template = computed(() => {
  const defaultRatio = 1.0 / block.children!.length;
  const count = block.children!.length;
  const gap = `var(--gap) * ${count - 1} / ${count}`;

  return (block.children as ColumnBlockObjectResponse[])
    .map(c => `calc(${(c.column.width_ratio ?? defaultRatio) * 100}% - ${gap})`)
    .join(' ');
});

function children(column: WithChildren<ColumnBlockObjectResponse>) {
  return column.children as BlockWithChildren[];
}
</script>
