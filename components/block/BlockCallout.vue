<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { title, pass, format, blockColorClass } = useNotionParser(props)

const colorMap: Record<string, string[]> = {
  blue_background: ['bg-blue-100', 'text-blue-800', 'border-blue-200'],
  gray_background: ['bg-gray-100', 'text-gray-800', 'border-gray-200'],
  orange_background: ['bg-orange-100', 'text-orange-900', 'border-orange-200'],
  yellow_background: ['bg-yellow-100', 'text-yellow-900', 'border-yellow-300'],
  teal_background: ['bg-emerald-100', 'text-emerald-900', 'border-emerald-200'],
  purple_background: ['bg-purple-100', 'text-purple-900', 'border-purple-200']
}

const bgColor = computed(() => {
  return colorMap[format.value?.block_color]?.[0] 
    ?? colorMap.gray_background[0]
})

const textColor = computed(() => {
  return colorMap[format.value?.block_color]?.[1]
    ?? colorMap.gray_background[1]
})

const borderColor = computed(() => {
  return colorMap[format.value?.block_color]?.[2]
    ?? colorMap.gray_background[3]
})
</script>

<template>
  <div
    :class="[
      'notion-callout dark:bg-gray-800 dark:contrast-more:bg-gray-900 dark:text-gray-300 motion-safe:transition',
      'flex p-6 rounded-xl gap-6 text-sm leading-loose border dark:border-gray-800 dark:contrast-more:border-gray-900',
      bgColor,
      textColor,
      borderColor,
      blockColorClass(),
      blockColorClass('_co')
    ]"
  >
    <div class="shrink-0">
      <BlockIcon v-bind="pass" class="select-none" />
    </div>
    <div class="notion-callout-text">
      <BlockTextRenderer :text="title" v-bind="pass" class="block" />
    </div>
  </div>
</template>