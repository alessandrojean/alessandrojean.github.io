<script setup lang="ts">
import { postMapImageUrl, postMapVideoUrl } from '@/server/api/posts/[slug].get'
import type { MapImageUrlArgs, MapVideoUrlArgs } from '@/composables/useNotionParser'

const { title: author, description } = useAppConfig()
const route = useRoute()

const { data: linkMap } = await useFetch('/api/posts', {
  transform: (posts) => {
    const entries = posts.map((p) => [p.id.replace(/-/g, ''), p.slug])

    return Object.fromEntries(entries)
  }
})
const { data: post } = await useFetch(`/api/posts/${route.params.slug}`, {
  key: `post-${route.params.slug}`
})

const postTags = computed(() => post.value.tags.join(', '))

function mapPageUrl(pageId: string) {
  return '/posts/' + (linkMap.value[pageId] ?? pageId)
}

function mapImageUrl({ block, src }: MapImageUrlArgs) {
  if (process.dev || block.image.type === 'external') {
    return src
  }

  return `/img/posts/${post.value.slug}/${postMapImageUrl(block)}`
}

function mapVideoUrl({ block, src }: MapVideoUrlArgs) {
  if (process.dev || block.video.type === 'external') {
    return src
  }

  return `/video/posts/${post.value.slug}/${postMapVideoUrl(block)}`
}
</script>

<template>
  <div class="sm:px-8 py-16 lg:py-32">
    <Head>
      <Title>{{ post.title }}</Title>
      <Meta name="description" :content="post.description ?? description"/>
      <Meta name="og:title" :content="post.title" />
      <Meta name="og:type" content="article" />
      <Meta name="og:description" :content="post.description ?? description" />
      <Meta name="article:published_time" :content="post.createdAt" />
      <Meta name="article:modified_time" :content="post.updatedAt" />
      <Meta name="article:author" :content="author" />
      <Meta name="article:section" :content="post.area" />
      <Meta name="article:tag" :content="postTags" />
      <Meta name="twitter:title" :content="post.title" />
      <Meta name="twitter:description" :content="post.description ?? description" />
    </Head>

    <NotionRenderer
      :block-map="post.blocks"
      :map-page-url="mapPageUrl"
      :map-image-url="mapImageUrl"
      :map-video-url="mapVideoUrl"
      header-anchor
      full-page
      shiki
    />
  </div>
</template>