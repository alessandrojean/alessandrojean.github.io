<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser';

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { isType, pass } = useNotionParser(props)
</script>

<template>
  <div v-if="isType('page')">
    <BlockPage v-bind="pass">
      <slot />
    </BlockPage>
  </div>
  <BlockHeader
    v-else-if="isType(['header', 'sub_header', 'sub_sub_header'])"
    v-bind="pass"
  />
  <BlockCallout v-else-if="isType('callout')" v-bind="pass" />
  <BlockCode v-else-if="isType('code')" v-bind="pass" />
  <BlockCode v-else-if="isType('equation')" v-bind="pass" />
  <BlockText v-else-if="isType('text')" v-bind="pass" />
  <BlockQuote v-else-if="isType('quote')" v-bind="pass" />
  <BlockTodoList v-else-if="isType(['to_do', 'to_do_group'])" v-bind="pass" />
  <BlockList
    v-else-if="isType(['bulleted_list', 'numbered_list', 'bulleted_list_group'])"
    v-bind="pass"
  >
    <slot />
  </BlockList>
  <BlockFigure
    v-else-if="isType(['image', 'embed', 'codepen'])"
    v-bind="pass"
  />
  <hr v-else-if="isType('divider')" class="notion-hr" />
</template>