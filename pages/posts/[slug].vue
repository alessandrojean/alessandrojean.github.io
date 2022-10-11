<script setup lang="ts">
import formatISO from 'date-fns/formatISO'
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc'

const { title, description } = useAppConfig()
const route = useRoute()

const { notion: { postsTableId } } = useAppConfig()
const page = await useNotionPage({
  tableId: postsTableId,
  pageSlug: route.params.slug as string
})

const pageRoot = computed(() => Object.values(page.value.nodeMap)[0].value)
const pageTitle = computed(() => pageRoot.value.properties.title[0][0])
const pageDescription = computed(() => pageRoot.value.properties['tlPg']?.[0]?.[0])
const pageDate = computed(() => pageRoot.value.properties['kjd\\']?.[0]?.[1]?.[0]?.[1]?.start_date)
const pageTags = computed(() => pageRoot.value.properties['@xdX']?.[0]?.[0])
const pageArea = computed(() => pageRoot.value.properties['Ns}A']?.[0]?.[0])
const publishedDate = computed(() => {
  return pageDate.value ?
    formatISO(zonedTimeToUtc(pageDate.value, 'America/Sao_Paulo'))
    : ''
})
const modifiedDate = computed(() => {
  return formatISO(new Date(pageRoot.value.last_edited_time))
})

function mapPageUrl(pageId: string) {
  return '/posts/' + (page.value.linkMap[pageId] ?? pageId)
}
</script>

<template>
  <div class="sm:px-8 py-16 lg:py-32">
    <Head>
      <Title>{{ pageTitle }}</Title>
      <Meta name="description" :content="pageDescription ?? description"/>
      <Meta name="og:title" :content="pageTitle" />
      <Meta name="og:type" content="article" />
      <Meta name="og:description" :content="pageDescription ?? description" />
      <Meta name="article:published_time" :content="publishedDate" />
      <Meta name="article:modified_time" :content="modifiedDate" />
      <Meta name="article:author" :content="title" />
      <Meta name="article:section" :content="pageArea" />
      <Meta name="article:tag" :content="pageTags" />
      <Meta name="twitter:title" :content="pageTitle" />
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