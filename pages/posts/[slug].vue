<script setup lang="ts">
const { title: author, description } = useAppConfig()
const route = useRoute()

const { data: linkMap } = await useFetch('/api/posts', {
  transform: (posts) => Object.fromEntries(posts.map((p) => [p.id, p.slug]))
})
const { data: post } = await useFetch(`/api/posts/${route.params.slug}`)

const postTags = computed(() => post.value.tags.join(', '))

function mapPageUrl(pageId: string) {
  return '/posts/' + (linkMap.value[pageId] ?? pageId)
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
      full-page
      shiki
    />
  </div>
</template>