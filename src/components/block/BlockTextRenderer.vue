<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'
import { NotionApi } from '@/lib/notion'

interface Props extends NotionBlockProps {
  text?: (NotionApi.TextRichTextItemResponse | NotionApi.RichTextItemResponse)[]
}

const props = withDefaults(defineProps<Props>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { pass } = useNotionParser(toRefs(props))
</script>

<template>
  <BlockDecorator
    v-for="(t, i) in (text ?? [])"
    :key="i"
    :content="t"
    v-bind="pass"
  />
</template>