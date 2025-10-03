<template>
  <ul data-slot="bulleted-list">
    <template
      v-for="item in block.children"
      :key="item.id"
    >
      <li data-slot="bulleted-list-item">
        <BlockTextRenderer :rich-text="item.bulleted_list_item.rich_text" :id-map />
        <BlockRenderer
          v-if="item.children?.length && item.children[0]!.type !== 'bulleted_list'"
          :blocks="item.children"
          :id-map
          no-container
        />
      </li>
      <BlockRenderer
        v-if="item.children?.length === 1 && item.children[0]!.type === 'bulleted_list'"
        :blocks="item.children"
        :id-map
        no-container
      />
    </template>
  </ul>
</template>

<script lang="ts" setup>
import type { BulletedListBlock } from '~~/shared/types/notion'

const { block, idMap } = defineProps<{ 
  block: BulletedListBlock;
  idMap: Record<string, string>;
}>();
</script>
