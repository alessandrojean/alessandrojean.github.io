<script setup lang="ts">
import type { NotionBlockProps } from '@/composables/useNotionParser';
import type { NotionApi } from '@/lib/notion';
import type { SourceHTMLAttributes } from 'vue';

type AssetBlock = NotionApi.EmbedBlockObjectResponse | NotionApi.VideoBlockObjectResponse

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block } = useNotionParser<AssetBlock>(toRefs(props))

const YOUTUBE_REGEX = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/

const youTubeSrc = computed(() => {
  const videoId = block.value.type === 'video' &&
    block.value.video.type === 'external' &&
    block.value.video.external.url.match(YOUTUBE_REGEX)[1]

  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null
})

const codePenSrc = computed(() => {
  return block.value.type === 'embed' &&
    block.value.embed.url.replace('/pen/', '/embed/preview/')
})

const isIframe = computed<boolean>(() => {
  return !!youTubeSrc.value || !!codePenSrc.value
})

const src = computed(() => {
  if (block.value.type === 'video') {
    return youTubeSrc.value
  }

  return codePenSrc.value
})

const aspectRatio = computed(() => {
  return youTubeSrc.value ? 'aspect-video' : 'aspect-[4/3]'
})

const isVideo = computed(() => {
  return block.value.type === 'video' && block.value.video.type === 'file'
})

const videoSource = computed<SourceHTMLAttributes>(() => {
  if (block.value.type !== 'video' || block.value.video.type !== 'file') {
    return {}
  }

  const videoUrl = block.value.video.file.url
  const { mimeType } = fileNameFromUrl(videoUrl)

  return {
    src: props.mapVideoUrl({
      src: videoUrl,
      block: block.value,
      blockMap: props.blockMap
    }),
    type: mimeType
  }
})
</script>

<template>
  <iframe
    v-if="isIframe"
    :class="[
      'rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-900/5 w-full',
      aspectRatio
    ]"
    :src="src"
    :allow="embedAllow"
    loading="lazy"
  />
  <video
    v-else-if="isVideo"
    class="w-full rounded-xl shadow-lg ring-1 ring-gray-900/5"
    controls
    controlsList="nodownload"
  >
    <source v-bind="videoSource">
  </video>
</template>
