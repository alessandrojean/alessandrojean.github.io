<script setup lang="ts">
import type { NotionBlockProps } from '@/composables/useNotionParser'
import type { NotionApi } from '@/lib/notion'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block, pass, richText, getTextContent } = useNotionParser<NotionApi.QuoteBlockObjectResponse>(toRefs(props))

const filteredContent = computed(() => {
  return block.value.content?.filter((id) => {
    const block = props.blockMap[id]

    return block.type !== 'paragraph' ||
      getTextContent(block.paragraph.rich_text)[0] !== '—'
  })
})

const cite = computed(() => {
  const lastIdx = block.value.content?.length ?? 0
  const last = block.value.content?.[lastIdx - 1]
  const lastBlock = props.blockMap[last]
  
  const isCite = lastBlock?.type === 'paragraph' &&
    getTextContent(lastBlock.paragraph.rich_text)[0] === '—'

  return isCite ? lastBlock : null
})
</script>

<template>
  <blockquote class="notion-quote">
    <p><BlockTextRenderer :text="richText" v-bind="pass" /></p>

    <NotionRenderer
      v-for="(contentId, contentIndex) in (filteredContent || [])"
      v-bind="pass"
      :key="contentId"
      :level="level + 1"
      :content-id="contentId"
      :content-index="contentIndex"
    />
    <cite v-if="cite">
      <BlockTextRenderer :text="cite.paragraph.rich_text" v-bind="pass" />
    </cite>
  </blockquote>
</template>
