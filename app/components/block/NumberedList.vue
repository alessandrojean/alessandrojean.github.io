<template>
  <ol data-slot="numbered-list">
    <template
      v-for="item in block.children"
      :key="item.id"
    >
      <li data-slot="numbered-list-item">
        <BlockTextRenderer
          :rich-text="item.numbered_list_item.rich_text"
          :id-map
        />
        <BlockRenderer
          v-if="item.children?.length && item.children[0]!.type !== 'numbered_list'"
          :blocks="item.children"
          :id-map
          no-container
        />
      </li>
      <BlockRenderer
        v-if="item.children?.length === 1 && item.children[0]!.type === 'numbered_list'"
        :blocks="item.children"
        :id-map
        no-container
      />
    </template>
  </ol>
</template>

<script lang="ts" setup>
import type { NumberedListBlock } from '~~/shared/types/notion';

const { block, idMap } = defineProps<{
  block: NumberedListBlock;
  idMap: Record<string, string>;
}>();
</script>
