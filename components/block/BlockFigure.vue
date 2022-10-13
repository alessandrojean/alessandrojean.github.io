<script setup lang="ts">
import type { NotionBlockProps } from '@/composables/useNotionParser'
import type {
  EmbedBlockObjectResponse,
  ImageBlockObjectResponse,
  VideoBlockObjectResponse
} from '@/lib/notion'

type FigureBlock = EmbedBlockObjectResponse | ImageBlockObjectResponse | VideoBlockObjectResponse

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block, pass, type, parent, isType } = useNotionParser<FigureBlock>(props)

const isInColumn = computed(() => parent.value.type === 'column')

const caption = computed(() => block.value[type.value].caption)
const isTweet = computed(() => {
  return block.value.type === 'embed' && 
    block.value.embed.url.includes('twitter.com')
})
</script>

<template>
  <figure
    :class="[
      'notion-asset-wrapper',
      isType(['video', 'image']) && !isInColumn ? 'lg:-mx-10 lg:my-14' : ''
    ]"
  >
    <BlockImage v-if="isType('image')" v-bind="pass" />
    <BlockTweet v-else-if="isTweet" v-bind="pass" />
    <BlockAsset
      v-else-if="isType(['embed', 'video', 'codepen'])"
      v-bind="pass"
    />
    <BlockCode v-else-if="isType('code')" v-bind="pass" />
    <figcaption v-if="caption" class="notion-image-caption mt-6 text-center">
      <BlockTextRenderer :text="caption" v-bind="pass" />
    </figcaption>
  </figure>
</template>