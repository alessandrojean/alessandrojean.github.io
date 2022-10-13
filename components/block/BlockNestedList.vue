<script setup lang="ts">
import type { NotionBlockProps } from '@/composables/useNotionParser'
import type { BulletedListItemBlockObjectResponse, NumberedListItemBlockObjectResponse } from '@/lib/notion'

type NestedListBlock = BulletedListItemBlockObjectResponse | NumberedListItemBlockObjectResponse

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { type } = useNotionParser<NestedListBlock>(props)
</script>

<template>
  <ul v-if="type.includes('bulleted_list_item')" class="notion-list notion-list-disc">
    <slot />
  </ul>
  <ol v-else class="notion-list notion-list-numbered">
    <slot />
  </ol>
</template>