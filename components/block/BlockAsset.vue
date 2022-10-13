<script setup lang="ts">
import type { SourceHTMLAttributes } from 'vue'
import type { NotionBlockProps } from '@/composables/useNotionParser'
import type { EmbedBlockObjectResponse, VideoBlockObjectResponse } from '@/lib/notion'

type AssetBlock = EmbedBlockObjectResponse | VideoBlockObjectResponse

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block } = useNotionParser<AssetBlock>(props)

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
  return youTubeSrc.value ? 'aspect-w-16 aspect-h-9' : 'aspect-w-4 aspect-h-3'
})

const isVideo = computed(() => {
  return block.value.type === 'video' && block.value.video.type === 'file'
})

const videoSource = computed<SourceHTMLAttributes>(() => {
  if (!(block.value.type === 'video' && block.value.video.type === 'file')) {
    return {}
  }

  const videoUrl = new URL(block.value.video.file.url)
  const fileName = videoUrl.pathname.split('/').filter(Boolean).pop()
  const extension = fileName.split('.').pop()

  return {
    src: videoUrl.href,
    type: `video/${extension}`
  }
})
</script>

<template>
  <div
    v-if="isIframe"
    :class="[
      'rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-900/5',
      aspectRatio
    ]"
  >
    <iframe
      class="notion-image-inset absolute inset-0 w-full h-full"
      :src="src"
      :allow="embedAllow"
      loading="lazy"
    />
  </div>
  <video
    v-else-if="isVideo"
    class="w-full rounded-xl shadow-lg ring-1 ring-gray-900/5"
    controls
  >
    <source v-bind="videoSource">
  </video>
</template>