<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { value, type, title, pass, properties, getListNumber } = useNotionParser(props)

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
  <ul
    v-else-if="isTopLevel && type === 'bulleted_list_group'"
    class="notion-list notion-list-disc"
  >
    <li><BlockTextRenderer :text="title" v-bind="pass" /></li>
    <BlockNestedList v-if="value.content" v-bind="pass">
      <slot />
    </BlockNestedList>
    <template v-for="childId in properties.content" :key="childId">
      <li>
        <BlockTextRenderer
          :text="blockMap[childId].value.properties.title"
          v-bind="pass"
        />
      </li>
      <ul v-if="blockMap[childId].value.content">
        <NotionRenderer
          v-for="(contentId, contentIndex) in blockMap[childId].value.content"
          v-bind="pass"
          :key="contentId"
          :level="level + 1"
          :content-id="contentId"
          :content-index="contentIndex"
        />
      </ul>
    </template>
  </ul>
  <template v-else>
    <li><BlockTextRenderer :text="title" v-bind="pass" /></li>
    <BlockNestedList v-if="value.content" v-bind="pass">
      <slot />
    </BlockNestedList>
  </template>
</template>