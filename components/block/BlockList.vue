<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { value, type, title, pass, getListNumber } = useNotionParser(props)

const start = computed(() => getListNumber(value.value?.id))
const isTopLevel = computed(() => {
  return type.value !== props.blockMap[value.value?.parent_id]?.value?.type
})
</script>

<template>
  <ul
    v-if="isTopLevel && type === 'bulleted_list'"
    class="notion-list notion-list-disc"
  >
    <li><BlockTextRenderer :text="title" v-bind="pass" /></li>
    <BlockNestedList v-if="value.content" v-bind="pass">
      <slot />
    </BlockNestedList>
  </ul>
  <ol
    v-else-if="isTopLevel && type === 'numbered_list'"
    class="notion-list notion-list-numbered"
    :start="start"
  >
    <li><BlockTextRenderer :text="title" v-bind="pass" /></li>
    <BlockNestedList v-if="value.content" v-bind="pass">
      <slot />
    </BlockNestedList>
  </ol>
  <span v-else>
    <li><BlockTextRenderer :text="title" v-bind="pass" /></li>
    <BlockNestedList v-if="value.content" v-bind="pass">
      <slot />
    </BlockNestedList>
  </span>
</template>