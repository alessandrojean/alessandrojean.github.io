<script setup lang="ts">
import type { NotionBlockProps } from '@/composables/useNotionParser';
import type { NotionApi, ToDoGroupBlock } from '@/lib/notion';
import { CheckIcon } from '@heroicons/vue/20/solid';

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block, pass, getTextContent } = useNotionParser<ToDoGroupBlock>(toRefs(props))

const todos = computed(() => {
  return (block.value.content || []).map((id) => {
    const block = props.blockMap[id] as NotionApi.ToDoBlockObjectResponse

    return {
      id,
      label: block.to_do.rich_text,
      checked: block.to_do.checked
    }
  })
})
</script>

<template>
  <ul class="notion-todo-list list-none pl-0">
    <li
      v-for="todo of todos"
      :key="todo.id"
      class="flex items-top"
    >
      <input
        type="checkbox"
        :value="getTextContent(todo.label)"
        :checked="todo.checked"
        :id="'to-do-' + todo.id"
        class="sr-only peer"
        disabled
      >
      <span
        aria-hidden="true"
        class="mt-1 mr-3 size-5 bg-gray-200 dark:bg-gray-800 opacity-70 dark:opacity-100 inline-flex items-center justify-center rounded border-2 border-gray-500 dark:border-gray-600 peer-checked:border-primary-600 peer-checked:bg-primary-600 peer-checked:text-white peer-checked:opacity-100 motion-safe:transition"
      >
        <CheckIcon v-if="todo.checked" class="size-4" />
      </span>
      <label
        :for="'to-do-' + todo.id"
        :class="[
          'mb-0 cursor-text',
          todo.checked ? 'line-through text-gray-400 decoration-gray-400' : ''
        ]"
      >
        <span v-if="todo.checked" class="sr-only">Concluído: </span>
        <BlockTextRenderer
          v-bind="pass"
          :text="todo.label"
          :content-id="todo.id"
        />
      </label>
    </li>
  </ul>
</template>
