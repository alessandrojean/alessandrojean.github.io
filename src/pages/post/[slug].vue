<script setup lang="ts">
import type { MapImageUrlArgs, MapVideoUrlArgs } from '@/composables/useNotionParser';
import { postMapImageUrl, postMapVideoUrl } from '~/lib/notion';

const { title: author, description, url } = useAppConfig()
const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n({ useScope: 'global' })

const { data: linkMap } = await useFetch('/api/posts', {
  transform: (posts) => {
    const entries = posts.map((p) => [p.id.replace(/-/g, ''), p.slug])

    return Object.fromEntries(entries)
  }
})

const { data: post } = await useFetch(`/api/posts/${route.params.slug}`, {
  key: `post-${route.params.slug}`,
})

const postTags = computed(() => post.value?.tags.join(', '))

function mapPageUrl(pageId: string) {
  const slug = linkMap.value[pageId]
  
  return slug ? localePath({ name: 'post-slug', params: { slug } }, 'pt') : undefined
}

function mapImageUrl({ block, src }: MapImageUrlArgs) {
  if (process.dev || block?.image.type === 'external' || !block) {
    return src
  }

  return `/notion-img/posts/${post.value?.slug}/${postMapImageUrl(block)}`
}

function mapVideoUrl({ block, src }: MapVideoUrlArgs) {
  if (process.dev || block?.video.type === 'external' || !block) {
    return src
  }

  return `/video/posts/${post.value?.slug}/${postMapVideoUrl(block)}`
}

const ogImageOptions = computed(() => ({
  component: 'Default',
  alt: t('site.ogImageAlt'),
  width: 800,
  height: 400,
  origin: url,
  title: post.value?.title ?? author,
  description: post.value?.description ?? description,
  section: post.value?.area,
  publishedTime: post.value?.createdAt
}))

defineOgImageComponent('Default', ogImageOptions)
</script>

<template>
  <div class="sm:px-8 py-16 lg:py-32">
    <OgImage v-bind="ogImageOptions" />

    <Head>
      <Html :lang="post?.language" />
      <Title>{{ post?.title }}</Title>
      <Meta name="description" :content="post?.description ?? description"/>
      <Meta name="og:title" :content="post?.title" />
      <Meta name="og:type" content="article" />
      <Meta name="og:description" :content="post?.description ?? description" />
      <Meta name="og:slug" :content="post?.slug" />
      <Meta name="og:locale" :content="post?.language" />
      <Meta name="article:published_time" :content="post?.createdAt" />
      <Meta name="article:modified_time" :content="post?.updatedAt" />
      <Meta name="article:author" :content="author" />
      <Meta name="article:section" :content="post?.area" />
      <Meta name="article:tag" :content="postTags" />
      <Meta name="twitter:title" :content="post?.title" />
      <Meta name="twitter:description" :content="post?.description ?? description" />
    </Head>

    <NotionRenderer
      v-if="post"
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
