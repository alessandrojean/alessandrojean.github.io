<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { properties, pass } = useNotionParser(props)

const equation = computed(() => properties.value?.title?.[0]?.[0])
</script>

<template>
  <BlockCode
    v-bind="pass"
    override-lang="latex"
    override-lang-class="language-latex"
  />
</template>