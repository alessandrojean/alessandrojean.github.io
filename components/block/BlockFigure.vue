<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { width, pass, caption, properties, parent, isType } = useNotionParser(props)

const isSelfHosted = computed(() => {
  return properties.value?.size !== undefined
})

const isInColumn = computed(() => parent.value.value.type === 'column')
</script>

<template>
  <figure
    v-if="!isType('video') || !isSelfHosted"
    :class="[
      'notion-asset-wrapper',
      isType(['video', 'image']) && !isInColumn ? 'lg:-mx-10 lg:my-14' : ''
    ]"
    :style="width"
  >
    <BlockImage v-if="isType('image')" v-bind="pass" />
    <BlockAsset
      v-else-if="isType(['embed', 'video', 'figma', 'codepen'])"
      v-bind="pass"
    />
    <BlockTweet v-else-if="isType('tweet')" v-bind="pass" />
    <figcaption v-if="caption" class="notion-image-caption mt-6 text-center">
      <BlockTextRenderer :text="caption" v-bind="pass" />
    </figcaption>
  </figure>
</template>