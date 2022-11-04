<script setup lang="ts">
import type { NotionBlockProps } from '@/composables/useNotionParser'
import type { NotionApi } from '@/lib/notion'

type NestedListBlock = NotionApi.BulletedListItemBlockObjectResponse
  | NotionApi.NumberedListItemBlockObjectResponse

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { type } = useNotionParser<NestedListBlock>(toRefs(props))
</script>

<template>
  <ul v-if="type.includes('bulleted_list_item')" class="notion-list notion-list-disc">
    <slot />
  </ul>
  <ol v-else class="notion-list notion-list-numbered">
    <slot />
  </ol>
</template>