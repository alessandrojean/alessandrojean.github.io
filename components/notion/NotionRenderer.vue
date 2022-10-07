<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  embedAllow: 'fullscreen',
  fullPage: false,
  hideList: () => [],
  level: 0,
  mapImageUrl: defaultMapImageUrl,
  mapPageUrl: defaultMapPageUrl,
  pageLinkTarget: '_self',
  shiki: false
})

const { pass, value } = useNotionParser(props)
</script>

<template>
  <NotionBlock v-bind="pass" v-if="blockMap && value">
    <NotionRenderer
      v-for="(contentId, contentIndex) in value.content"
      v-bind="pass"
      :key="contentId"
      :level="level + 1"
      :content-id="contentId"
      :content-index="contentIndex"
    />
  </NotionBlock>
</template>