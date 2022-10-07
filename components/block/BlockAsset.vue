<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'
import { StyleValue } from 'vue';

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { type, properties, f } = useNotionParser(props)

const src = computed(() => {
  return type.value === 'figma'
    ? properties.value.source[0][0]
    : f.value.display_source
})

const style = computed<StyleValue>(() => {
  const aspectRatio = f.value.block_aspect_ratio ?? f.value.block_height / f.value.block_width
  return {
    paddingBottom: `${aspectRatio * 100}%`,
    position: 'relative',
  }
})
</script>

<template>
  <div :style="style" class="rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-900/5">
    <iframe
      class="notion-image-inset absolute inset-0 w-full h-full"
      :src="src"
      :allow="embedAllow"
      loading="lazy"
    />
  </div>
</template>