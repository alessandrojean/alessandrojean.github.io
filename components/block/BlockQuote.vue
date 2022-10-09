<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { properties, title, pass, value } = useNotionParser(props)

const filteredContent = computed(() => {
  return value.value.content?.filter((id) => {
    return props.blockMap[id].value.properties.title[0]?.[0]?.[0] !== '—'
  })
})

const cite = computed(() => {
  const lastIdx = value.value.content?.length ?? 0
  const last = value.value.content?.[lastIdx - 1]
  const lastTitle = props.blockMap[last]?.value?.properties?.title

  return lastTitle?.[0]?.[0]?.[0] === '—' ? lastTitle : null
})
</script>

<template>
  <blockquote v-if="properties" class="notion-quote">
    <p><BlockTextRenderer :text="title" v-bind="pass" /></p>

    <NotionRenderer
      v-for="(contentId, contentIndex) in (filteredContent || [])"
      v-bind="pass"
      :key="contentId"
      :level="level + 1"
      :content-id="contentId"
      :content-index="contentIndex"
    />
    <cite v-if="cite">
      <BlockTextRenderer :text="cite" v-bind="pass" />
    </cite>
  </blockquote>
</template>
