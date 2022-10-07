<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { type, title, pass } = useNotionParser(props)
</script>

<template>
  <h1 class="notion-h1" v-if="type === 'header'">
    <BlockTextRenderer :text="title" v-bind="pass" />
  </h1>
  <h2 class="notion-h2" v-else-if="type === 'sub_header'">
    <BlockTextRenderer :text="title" v-bind="pass" />
  </h2>
  <h3 class="notion-h3" v-else-if="type === 'sub_sub_header'">
    <BlockTextRenderer :text="title" v-bind="pass" />
  </h3>
</template>