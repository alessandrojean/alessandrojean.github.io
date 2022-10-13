<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'
import { RichTextItemResponse, TextRichTextItemResponse } from '@/lib/notion'

interface Props extends NotionBlockProps {
  text?: (TextRichTextItemResponse | RichTextItemResponse)[]
}

const props = withDefaults(defineProps<Props>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { pass } = useNotionParser(props)
</script>

<template>
  <BlockDecorator
    v-for="(t, i) in (text ?? [])"
    :key="i"
    :content="t"
    v-bind="pass"
  />
</template>