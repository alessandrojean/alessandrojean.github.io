<script setup lang="ts">
import type { NotionBlockProps } from '@/composables/useNotionParser'
import type { ColumnListBlockObjectResponse } from '@/lib/notion'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block } = useNotionParser<ColumnListBlockObjectResponse>(props)

const columnClasses = computed(() => {
  const map = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3'
  }

  return map[block.value.content.length] ?? 'md:grid-cols-1'
})

const isOnlyImages = computed(() => {
  const columns = block.value.content.map((contentId) => {
    return props.blockMap[contentId].content.map((columnId) => {
      return props.blockMap[columnId]
    })
  })

  return columns.every((column) => {
    return column.length === 1 && 
      column.every((block) => block.type === 'image')
  })
})
</script>

<template>
  <div
    :class="[
      'notion-row md:grid md:gap-6',
      columnClasses,
      isOnlyImages ? 'lg:-mx-10' : ''
    ]">
    <slot />
  </div>
</template>