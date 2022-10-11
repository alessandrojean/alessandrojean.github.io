<script setup lang="ts">
import { Highlighter } from 'shiki-es'
import { NotionBlockProps } from '@/composables/useNotionParser'

interface Props extends NotionBlockProps {
  overrideLang?: string;
  overrideLangClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { properties } = useNotionParser(props)

// Map the Notion language codes to Shiki ones.
const langMap: Record<string, string> = {
  'c++': 'cpp'
}

const lang = computed(() => {
  const value = props.overrideLang ?? 
    properties.value?.language?.[0]?.[0]?.toLowerCase()

  return langMap[value] ?? value
})

const langClass = computed(() => props.overrideLangClass ?? `language-${lang.value}`)

const highlighter = inject<Highlighter>('highlighter')
const supported = computed(() => {
  return highlighter.getLoadedLanguages().find((l) => l === lang.value)
})

const shikiHtml = computed(() => {
  const code = properties.value.title[0][0]

  return props.shiki && supported.value
    ? highlighter.codeToHtml(code, { lang: lang.value })
    : ''
})
</script>

<template>
  <div v-if="shiki && supported" v-html="shikiHtml"></div>
  <pre v-else :class="['notion-code', langClass]"><code :class="langClass">{{ properties.title[0][0] }}</code></pre>
</template>