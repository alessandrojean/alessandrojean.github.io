<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { value } = useNotionParser(props)

const columnClasses = computed(() => {
  const map = {
    2: 'grid-cols-2',
    3: 'grid-cols-3'
  }

  return map[value.value.content.length] ?? 'grid-cols-1'
})

const isOnlyImages = computed(() => {
  const columns = value.value.content.map((contentId) => {
    return props.blockMap[contentId].value.content.map((columnId) => {
      return props.blockMap[columnId].value
    })
  })

  return columns.every((column) => {
    return column.length === 1 && column.every((block) => block.type === 'image')
  })
})
</script>

<template>
  <div
    :class="[
      'notion-row grid gap-6',
      columnClasses,
      isOnlyImages ? 'lg:-mx-10' : ''
    ]">
    <slot />
  </div>
</template>