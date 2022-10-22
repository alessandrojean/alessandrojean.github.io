<script setup lang="ts">
import type { NotionBlockProps } from '@/composables/useNotionParser'
import type {
  BulletedListItemGroupBlock,
  BulletedListItemBlockObjectResponse,
  NumberedListItemBlockObjectResponse
} from '@/lib/notion'

type ListBlock = BulletedListItemGroupBlock | BulletedListItemBlockObjectResponse | NumberedListItemBlockObjectResponse

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block, content, type, pass } = useNotionParser<ListBlock>(toRefs(props))

const isTopLevel = computed(() => {
  return block.value.parent.type === 'page_id'
})
</script>

<template>
  <ul
    v-if="isTopLevel && block.type === 'bulleted_list_item'"
    class="notion-list notion-list-disc"
  >
    <li>
      <BlockTextRenderer
        :text="block.bulleted_list_item?.rich_text"
        v-bind="pass"
      />
    </li>
    <li v-if="content && content.length > 0" class="list-none">
      <BlockNestedList v-bind="pass">
        <slot />
      </BlockNestedList>
    </li>
  </ul>
  <ol
    v-else-if="isTopLevel && block.type === 'numbered_list_item'"
    class="notion-list notion-list-numbered"
  >
    <li>
      <BlockTextRenderer
        :text="block.numbered_list_item?.rich_text"
        v-bind="pass"
      />
    </li>
    <li v-if="content && content.length > 0" class="list-none">
      <BlockNestedList v-bind="pass">
        <slot />
      </BlockNestedList>
    </li>
  </ol>
  <ul
    v-else-if="isTopLevel && block.type === 'bulleted_list_item_group'"
    class="notion-list notion-list-disc"
  >
    <slot />
  </ul>
  <template v-else>
    <li><BlockTextRenderer :text="block[type]?.['rich_text']" v-bind="pass" /></li>
    <li v-if="content && content.length > 0" class="list-none">
      <BlockNestedList v-bind="pass">
        <slot />
      </BlockNestedList>
    </li>
  </template>
</template>