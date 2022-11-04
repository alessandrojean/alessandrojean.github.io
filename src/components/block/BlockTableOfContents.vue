<script setup lang="ts">
import slugify from 'slugify'

import type { NotionBlockProps } from '@/composables/useNotionParser'
import type { BlockNode, NotionApi } from '@/lib/notion'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block, root, pass, getTextContent } = useNotionParser<NotionApi.TableOfContentsBlockObjectResponse>(toRefs(props))

const headers = computed(() => {
  const selfIndex = root.value.content.indexOf(block.value.id)

  return root.value.content.slice(selfIndex)
    .map((blockId) => props.blockMap[blockId])
    .filter((block) => block.type === 'heading_2')
})

function hash(block: BlockNode) {
  const text = getTextContent(block['heading_2'].rich_text)

  return '#' + slugify(text, { lower: true })
}
</script>

<template>
  <ol v-if="headers.length > 0">
    <li
      v-for="header in headers"
      :key="header.id"
    >
      <NuxtLink
        :to="{ hash: hash(header) }"
        :external="false"
        aria-current-value="page"
      >
        <BlockTextRenderer
          :text="header['heading_2'].rich_text"
          v-bind="pass"
        />
      </NuxtLink>
    </li>
  </ol>
</template>