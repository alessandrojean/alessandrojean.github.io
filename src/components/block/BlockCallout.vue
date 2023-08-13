<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'
import type { NotionApi } from '@/lib/notion'

type ApiColor = NotionApi.CalloutBlockObjectResponse['callout']['color']

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block, pass, richText } = useNotionParser<NotionApi.CalloutBlockObjectResponse>(toRefs(props))

const colorMap: Partial<Record<ApiColor, string[]>> = {
  gray_background: ['bg-gray-100', 'text-gray-800', 'border-gray-200'],
  orange_background: ['bg-orange-100', 'text-orange-900', 'border-orange-200'],
  yellow_background: ['bg-yellow-50', 'text-yellow-900', 'border-yellow-300'],
  green_background: ['bg-emerald-100', 'text-emerald-900', 'border-emerald-200'],
  blue_background: ['bg-blue-100', 'text-blue-800', 'border-blue-200'],
  purple_background: ['bg-purple-100', 'text-purple-900', 'border-purple-200'],
  pink_background: ['bg-pink-100', 'text-pink-900', 'border-pink-200'],
  red_background: ['bg-red-100', 'text-red-900', 'border-red-200']
}

const color = computed(() => block.value.callout.color)

const bgColor = computed(() => {
  return colorMap[color.value]?.[0] 
    ?? colorMap.gray_background[0]
})

const textColor = computed(() => {
  return colorMap[color.value]?.[1]
    ?? colorMap.gray_background[1]
})

const borderColor = computed(() => {
  return colorMap[color.value]?.[2]
    ?? colorMap.gray_background[3]
})

const isAddress = computed(() => {
  return block.value.callout.icon?.type === 'emoji'
    && block.value.callout.icon.emoji === '🗺️'
})
</script>

<template>
  <div
    :class="[
      'notion-callout my-8 dark:bg-gray-800 dark:contrast-more:bg-gray-900 dark:text-gray-300 motion-safe:transition',
      'flex flex-col md:flex-row p-6 rounded-xl gap-6 text-sm leading-loose border dark:border-gray-800 dark:contrast-more:border-gray-900',
      bgColor,
      textColor,
      borderColor
    ]"
  >
    <div class="shrink-0" v-if="block.callout.icon">
      <BlockIcon :icon="block.callout.icon" class="select-none" />
    </div>
    <div class="prose-p:last-of-type:mb-0 prose-strong:!text-current prose-a:font-medium prose-a:!text-current prose-a:!underline prose-a:!decoration-1 prose-a:!decoration-current prose-a:underline-offset-2 hover:prose-a:decoration-dotted [&_address]:not-italic">
      <Component
        :is="isAddress ? 'address' : 'p'"
        class="notion-callout-text mt-0"
      >
        <BlockTextRenderer size="small" :text="richText" v-bind="pass" />
      </Component>
      <slot />
    </div>

  </div>
</template>