<script setup lang="ts">
import type { NotionBlockProps } from '@/composables/useNotionParser'
import type { ImageBlockObjectResponse } from '@/lib/notion'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block, getTextContent } = useNotionParser<ImageBlockObjectResponse>(props)

const src = computed(() => {
  return block.value.image.type === 'external'
    ? block.value.image.external.url
    : block.value.image.file.url
})
</script>

<template>
  <img
    :alt="getTextContent(block.image.caption)"
    :src="src"
    loading="lazy"
    class="rounded-xl shadow-lg ring-1 ring-gray-900/5 mx-auto"
  >
</template>