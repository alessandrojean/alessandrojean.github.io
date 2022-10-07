<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { properties, title, pass, value } = useNotionParser(props)
</script>

<template>
  <blockquote v-if="properties" class="notion-quote">
    <BlockTextRenderer :text="title" v-bind="pass" />

    <NotionRenderer
      v-for="(contentId, contentIndex) in value.content"
      v-bind="pass"
      :key="contentId"
      :level="level + 1"
      :content-id="contentId"
      :content-index="contentIndex"
    />
  </blockquote>
</template>
