<template>
  <figure
    data-slot="figure"
    :data-type="block.type"
  >
    <BlockImage v-if="block.type === 'image'" :block />
    <BlockCode v-else-if="block.type === 'code'" :block />
    <BlockTweet v-else-if="isTweet" :block="block as EmbedBlockObjectResponse" />
    <BlockEmbed v-else-if="block.type === 'embed'" :block />
    <BlockVideo v-else-if="block.type === 'video'" :block />
    <figcaption
      v-if="caption && caption.length > 0"
      data-slot="figure-caption"
    >
      <BlockTextRenderer :rich-text="caption" :id-map />
    </figcaption>
  </figure>
</template>

<script lang="ts" setup>
import type { CodeBlockObjectResponse, EmbedBlockObjectResponse, ImageBlockObjectResponse, VideoBlockObjectResponse } from '@notionhq/client'

type FigureBlock = CodeBlockObjectResponse
  | EmbedBlockObjectResponse
  | ImageBlockObjectResponse
  | VideoBlockObjectResponse;

const { block, idMap } = defineProps<{ 
  block: FigureBlock;
  idMap: Record<string, string>;
}>();

const caption = computed(() => {
  switch (block.type) {
    case 'code': return block.code.caption;
    case 'image': return block.image.caption;
    case 'video': return block.video.caption;
    case 'embed': return block.embed.caption;
    default: return undefined;
  }
});

const isTweet = computed(() => {
  return block.type === 'embed' && block.embed.url.includes('twitter.com');
});
</script>
