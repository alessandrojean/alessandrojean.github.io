<script setup lang="ts">
import type { NotionBlockProps } from '@/composables/useNotionParser'
import type { NotionApi } from '@/lib/notion'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block, pass } = useNotionParser<NotionApi.EquationBlockObjectResponse>(toRefs(props))
</script>

<template>
  <BlockCode
    v-bind="pass"
    override-lang="latex"
    override-lang-class="language-latex"
  />
</template>