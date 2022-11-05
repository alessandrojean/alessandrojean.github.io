<script setup lang="ts">
import type { NotionBlockProps } from '@/composables/useNotionParser'
import type { NotionApi } from '@/lib/notion'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block, caption, getTextContent } = useNotionParser<NotionApi.ImageBlockObjectResponse>(toRefs(props))

const imageUrl = computed(() => {
  return block.value.image.type === 'external'
    ? block.value.image.external.url
    : block.value.image.file.url
})

const src = computed(() => {
  return props.mapImageUrl({
    src: imageUrl.value,
    block: block.value,
    blockMap: props.blockMap
  })
})
</script>

<template>
  <Image
    :alt="getTextContent(caption)"
    :src="src"
    :original-src="imageUrl"
    class="rounded-xl shadow-lg ring-1 ring-gray-900/5 mx-auto overflow-hidden"
  />
</template>