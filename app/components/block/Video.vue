<template>
  <iframe
    v-if="src"
    class="aspect-video overflow-hidden w-full"
    data-slot="youtube"
    :src
    loading="lazy"
  />
  <video
    v-else
    data-slot="video"
    controls
    controlslist="nodownload"
  >
    <source v-bind="sourceProps" >
  </video>
</template>

<script lang="ts" setup>
import type { VideoBlockObjectResponse } from '@notionhq/client';
import type { SourceHTMLAttributes } from 'vue';

const { block } = defineProps<{ block: VideoBlockObjectResponse }>();

const YOUTUBE_REGEX = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/;

const src = computed(() => {
  const videoId = block.video.type === 'external' &&
    block.video.external.url?.match(YOUTUBE_REGEX)?.[1];

  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : undefined;
});

const sourceProps = computed<SourceHTMLAttributes>(() => {
  if (block.video.type !== 'file') {
    return {};
  }

  const videoUrl = block.video.file.url;
  const { mimeType } = fileNameFromUrl(videoUrl);

  return {
    src: videoUrl,
    type: mimeType,
  };
})
</script>
