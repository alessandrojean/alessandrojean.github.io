<script setup lang="ts">
import type { NotionBlockProps } from '@/composables/useNotionParser'
import type { ImageBlockObjectResponse } from '@/lib/notion'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block, caption, getTextContent } = useNotionParser<ImageBlockObjectResponse>(toRefs(props))

const src = computed(() => {
  return props.mapImageUrl({
    src: block.value.image.type === 'external'
      ? block.value.image.external.url
      : block.value.image.file.url,
    block: block.value,
    blockMap: props.blockMap
  })
})
</script>

<template>
  <img
    :alt="getTextContent(caption)"
    :src="src"
    loading="lazy"
    class="rounded-xl shadow-lg ring-1 ring-gray-900/5 mx-auto"
  >
</template>