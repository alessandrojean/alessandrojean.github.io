<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { type } = useNotionParser(props)
</script>

<template>
  <ul v-if="type === 'bulleted_list'" class="notion-list notion-list-disc">
    <slot />
  </ul>
  <ol v-else class="notion-list notion-list-numbered">
    <slot />
  </ol>
</template>