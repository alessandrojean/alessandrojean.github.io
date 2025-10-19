<template>
  <div
    v-if="!noContainer"
    class="typography"
  >
    <slot name="before" />
    <Block
      v-for="block in blocks"
      :key="block.id"
      :block
      :id-map
      :post="blocks"
    />
    <slot name="after" />
  </div>
  <template v-else>
    <Block
      v-for="block in blocks"
      :key="block.id"
      :block
      :id-map
      :post="blocks"
    />
  </template>
</template>

<script lang="ts" setup>
import type { BlockWithChildren } from '~~/shared/types/notion';

const { blocks, noContainer = false } = defineProps<{
  blocks: BlockWithChildren[];
  idMap: Record<string, string>;
  noContainer?: boolean;
}>();

const highlighter = await useShiki();
provide('highlighter', highlighter);
</script>
