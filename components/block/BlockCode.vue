<script setup lang="ts">
import { getHighlighter, BUNDLED_LANGUAGES } from 'shiki-es'
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
const lang = computed(() => props.overrideLang ?? properties.value?.language?.[0]?.[0]?.toLowerCase())
const langClass = computed(() => props.overrideLangClass ?? `language-${lang.value}`)
const supported = computed(() => {
  return BUNDLED_LANGUAGES.find((l) => (
    l.id === lang.value ||
      l.aliases?.includes(lang.value)
  ))
})

const shikiResult = ref('')

onMounted(async () => {
  if (props.shiki && supported.value) {
    const highlighter = await getHighlighter({ theme: 'nord' })
    shikiResult.value = highlighter.codeToHtml(properties.value.title[0][0], { 
      lang: lang.value
    })
  }
})
</script>

<template>
  <div v-if="shiki && supported" v-html="shikiResult"></div>
  <pre v-else :class="['notion-code', langClass]"><code :class="langClass">{{ properties.title[0][0] }}</code></pre>
</template>