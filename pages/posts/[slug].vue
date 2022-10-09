<script setup lang="ts">
const { title, description } = useAppConfig()
const route = useRoute()
const page = await useNotionPage(route.params.slug as string)

const pageRoot = computed(() => Object.values(page.nodeMap)[0].value)
const pageTitle = computed(() => pageRoot.value.properties.title[0][0])
const pageDescription = computed(() => pageRoot.value.properties['z?a@']?.[0]?.[0])
const pageDate = computed(() => pageRoot.value.properties['c}?R']?.[0]?.[1]?.[0]?.[1]?.start_date)
const pageTags = computed(() => pageRoot.value.properties['{aX^']?.[0]?.[0])
const pageArea = computed(() => pageRoot.value.properties['OHP@']?.[0]?.[0])
const publishedDate = computed(() => pageDate.value ? new Date(pageDate.value).toISOString() : '')
const modifiedDate = computed(() => new Date(pageRoot.value.last_edited_time).toISOString())

function titleTemplate(titleChunk: string | unknown): string {
  return titleChunk ? `${titleChunk} - ${title}` : title
}

function mapPageUrl(pageId: string) {
  return '/posts/' + (page.linkMap[pageId] ?? pageId)
}
</script>

<template>
  <div class="sm:px-8 py-16 lg:py-32">
    <Head>
      <Title>{{ title }}</Title>
      <Meta name="description" :content="pageDescription ?? description"/>
      <Meta name="og:title" :content="titleTemplate(pageTitle)" />
      <Meta name="og:type" content="article" />
      <Meta name="og:description" :content="pageDescription ?? description" />
      <Meta name="article:published_time" :content="publishedDate" />
      <Meta name="article:modified_time" :content="modifiedDate" />
      <Meta name="article:author" :content="title" />
      <Meta name="article:section" :content="pageArea" />
      <Meta name="article:tag" :content="pageTags" />
      <Meta name="twitter:title" :content="titleTemplate(pageTitle)" />
      <Meta name="twitter:description" :content="pageDescription ?? description" />
    </Head>

    <NotionRenderer
      :block-map="page.nodeMap"
      :map-page-url="mapPageUrl"
      full-page
      shiki
    />
  </div>
</template>