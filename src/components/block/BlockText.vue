<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'
import { NotionApi } from '@/lib/notion'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block, pass, richText } = useNotionParser<NotionApi.ParagraphBlockObjectResponse>(toRefs(props))
</script>

<template>
  <p v-if="richText" :class="['notion-text', block.paragraph.color]">
    <BlockTextRenderer :text="richText" v-bind="pass" />
  </p>
  <div v-else class="notion-blank">&nbsp;</div>
</template>
