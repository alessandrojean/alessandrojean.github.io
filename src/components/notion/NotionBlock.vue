<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser';

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { isType, pass } = useNotionParser(toRefs(props))
</script>

<template>
  <BlockPage v-if="isType('page')" v-bind="pass">
    <slot />
  </BlockPage>
  <BlockHeader
    v-else-if="isType(['heading_1', 'heading_2', 'heading_3'])"
    v-bind="pass"
  />
  <BlockCallout v-else-if="isType('callout')" v-bind="pass">
    <slot />
  </BlockCallout>
  <BlockTableOfContents v-else-if="isType('table_of_contents')" v-bind="pass" />
  <BlockEquation v-else-if="isType('equation')" v-bind="pass" />
  <BlockText v-else-if="isType('paragraph')" v-bind="pass" />
  <BlockQuote v-else-if="isType('quote')" v-bind="pass" />
  <BlockTodoList v-else-if="isType(['to_do', 'to_do_group'])" v-bind="pass" />
  <BlockColumnList v-else-if="isType('column_list')" v-bind="pass">
    <slot />
  </BlockColumnList>
  <BlockColumn v-else-if="isType('column')">
    <slot />
  </BlockColumn>
  <BlockList
    v-else-if="isType(['bulleted_list_item', 'numbered_list_item', 'bulleted_list_item_group'])"
    v-bind="pass"
  >
    <slot />
  </BlockList>
  <BlockFigure
    v-else-if="isType(['image', 'embed', 'video' , 'code'])"
    v-bind="pass"
  />
  <BlockTable v-else-if="isType('table')" v-bind="pass">
    <slot />
  </BlockTable>
  <BlockTableRow v-else-if="isType('table_row')" v-bind="pass" />
  <hr v-else-if="isType('divider')" class="notion-hr" />
</template>