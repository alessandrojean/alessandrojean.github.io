<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { properties, title, pass, blockColorClass } = useNotionParser(props)
</script>

<template>
  <p v-if="properties" :class="['notion-text', blockColorClass()]">
    <BlockTextRenderer :text="title" v-bind="pass" />
  </p>
  <div v-else class="notion-blank">&nbsp;</div>
</template>