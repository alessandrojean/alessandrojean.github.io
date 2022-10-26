<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  embedAllow: 'fullscreen',
  fullPage: false,
  headerAnchor: false,
  level: 0,
  mapImageUrl: defaultMapImageUrl,
  mapPageUrl: defaultMapPageUrl,
  pageLinkTarget: '_self',
  shiki: false
})

const { pass, block, content } = useNotionParser(toRefs(props))

provide('highlighter', await useShiki())
</script>

<template>
  <NotionBlock v-bind="pass" v-if="blockMap && block">
    <NotionRenderer
      v-for="(contentId, contentIndex) in content"
      v-bind="pass"
      :key="contentId"
      :level="level + 1"
      :content-id="contentId"
      :content-index="contentIndex"
    />
  </NotionBlock>
</template>