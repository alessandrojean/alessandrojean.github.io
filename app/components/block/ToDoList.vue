<template>
  <ul
    data-slot="to-do-list"
    class="ps-2 list-none"
  >
    <li
      v-for="item in block.children"
      :key="item.id"
      data-slot="to-do"
      :data-checked="item.to_do.checked"
      class="flex items-center gap-3 my-[0.5em] data-[checked=true]:line-through data-[checked=true]:text-gray-600 dark:data-[checked=true]:text-gray-500"
    >
      <Icon
        v-if="item.to_do.checked"
        name="lucide:square-check-big"
        class="text-sky-700 dark:text-sky-500"
      />
      <Icon
        v-else
        name="lucide:square"
      />
      <span
        v-if="item.to_do.checked"
        class="sr-only"
      >Concluído: </span>
      <BlockTextRenderer
        :rich-text="item.to_do.rich_text"
        :id-map
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import type { ToDoListBlock } from '~~/shared/types/notion';

const { block, idMap } = defineProps<{
  block: ToDoListBlock;
  idMap: Record<string, string>;
}>();
</script>
