<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/20/solid'
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { title, properties, pass } = useNotionParser(props)

const todos = computed(() => {
  const self = {
    id: props.contentId,
    label: title.value,
    checked: properties.value.checked?.[0]?.[0] === 'Yes'
  }

  const content = (properties.value.content || []).map((id) => {
    const block = props.blockMap[id].value

    return {
      id,
      label: block.properties.title,
      checked: block.properties.checked?.[0]?.[0] === 'Yes'
    }
  })

  return [self, ...content]
})
</script>

<template>
  <ul class="notion-todo-list list-none pl-0">
    <li
      v-for="todo of todos"
      :key="todo.id"
      class="flex items-center"
    >
      <input
        type="checkbox"
        :value="todo.title"
        :checked="todo.checked"
        :id="'to-do-' + todo.id"
        class="sr-only peer"
        disabled
      >
      <span
        aria-hidden="true"
        class="mr-3 w-[1.4rem] h-[1.4rem] bg-gray-200 dark:bg-gray-800 opacity-70 dark:opacity-100 inline-flex items-center justify-center rounded border-2 border-gray-500 dark:border-gray-600 peer-checked:border-primary-600 peer-checked:bg-primary-600 peer-checked:text-white peer-checked:opacity-100 motion-safe:transition"
      >
        <CheckIcon v-if="todo.checked" class="w-4 h-4" />
      </span>
      <label
        :for="'to-do-' + todo.id"
        :class="[
          'mb-0',
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