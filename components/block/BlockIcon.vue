<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { icon, format, title, block, getTextContent } = useNotionParser(props)

const { twemojiUrl } = useEmoji()
</script>

<template>
  <img
    v-if="icon.includes('http')"
    :class="[
      format.page_cover && 'notion-page-icon-offset',
      'notion-page-icon w-6 h-6 m-0 mt-0.5',
    ]"
    :src="mapImageUrl(icon, block)"
    :alt="title ? getTextContent(title) : 'Icon'"
  />
  <img
    v-if="icon[0] === '/'"
    :class="[
      format.page_cover && 'notion-page-icon-offset',
      'notion-page-icon w-6 h-6 m-0 mt-0.5',
    ]"
    :src="'https://notion.so' + icon"
    :alt="title ? getTextContent(title) : 'Icon'"
  />
  <img
    v-else
    :class="[
      format.page_cover && 'notion-page-icon-offset',
      'notion-page-icon w-5 h-5 m-0 mt-1',
    ]"
    :src="twemojiUrl(icon)"
    :alt="icon"
    :aria-label="icon"
  />
  <!-- <span
    v-else-if="icon"
    role="img"
    :aria-label="icon"
    :class="[
      'notion-emoji notion-page-icon text-xl',
      format.page_cover && 'notion-page-icon-offset',
    ]"
  >
    {{ icon }}
  </span> -->
</template>