<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'

interface Props extends NotionBlockProps {
  text: (string | any)[]
}

const props = withDefaults(defineProps<Props>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { pass } = useNotionParser(props)
</script>

<template>
  <BlockDecorator
    v-for="(t, i) in text"
    :key="i"
    :content="t"
    v-bind="pass"
  />
</template>