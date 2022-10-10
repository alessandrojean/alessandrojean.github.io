<script setup lang="ts">
import { StyleValue } from 'vue'
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { alt, f, src } = useNotionParser(props)

const style = computed<StyleValue>(() => {
  const aspectRatio = f.value.block_aspect_ratio ?? f.value.block_height / f.value.block_width
  return {
    paddingBottom: `${aspectRatio * 100}%`,
    position: 'relative'
  }
})
</script>

<template>
  <div v-if="f.block_aspect_ratio" class="w-fit max-w-full mx-auto rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-900/5">
    <img
      class="notion-image-inset m-0"
      :alt="alt ?? 'Imagem do Notion'"
      :src="src"
      loading="lazy"
    >
  </div>
  <img v-else :alt="alt" :src="src" loading="lazy" class="rounded-xl shadow-lg ring-1 ring-gray-900/5">
</template>