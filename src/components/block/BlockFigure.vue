<script setup lang="ts">
import type { NotionBlockProps } from '@/composables/useNotionParser';
import type { NotionApi } from '@/lib/notion';

type FigureBlock = NotionApi.CodeBlockObjectResponse
  | NotionApi.EmbedBlockObjectResponse
  | NotionApi.ImageBlockObjectResponse
  | NotionApi.VideoBlockObjectResponse

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block, pass, parent, caption, isType } = useNotionParser<FigureBlock>(toRefs(props))

const isInColumn = computed(() => parent.value?.type === 'column')

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
      v-else-if="isType(['embed', 'video'])"
      v-bind="pass"
    />
    <BlockCode v-else-if="isType('code')" v-bind="pass" />
    <figcaption v-if="caption" class="notion-image-caption mt-6 md:text-center">
      <BlockTextRenderer :text="caption" v-bind="pass" />
    </figcaption>
  </figure>
</template>
