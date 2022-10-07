<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { width, pass, caption, isType } = useNotionParser(props)
</script>

<template>
  <figure class="notion-asset-wrapper" :style="width">
    <BlockImage v-if="isType('image')" v-bind="pass" />
    <BlockAsset
      v-else-if="isType(['embed', 'video', 'figma', 'codepen'])"
      v-bind="pass"
    />
    <figcaption v-if="caption" class="notion-image-caption mt-6">
      <BlockTextRenderer :text="caption" v-bind="pass" />
    </figcaption>
  </figure>
</template>