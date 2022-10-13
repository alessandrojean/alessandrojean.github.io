<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'
import { ParagraphBlockObjectResponse } from '@/lib/notion'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block, pass } = useNotionParser<ParagraphBlockObjectResponse>(props)
</script>

<template>
  <p v-if="block.paragraph.rich_text" :class="['notion-text', block.paragraph.color]">
    <BlockTextRenderer :text="block.paragraph.rich_text" v-bind="pass" />
  </p>
  <div v-else class="notion-blank">&nbsp;</div>
</template>
