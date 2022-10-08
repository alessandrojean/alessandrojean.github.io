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
const lang = computed(() => props.overrideLang ?? properties.value?.language?.[0]?.[0]?.toLowerCase())
const langClass = computed(() => props.overrideLangClass ?? `language-${lang.value}`)

const highlighter = inject<Highlighter>('highlighter')
const supported = computed(() => {
  return highlighter.getLoadedLanguages().find((l) => l === lang.value)
})

const shikiResult = ref('')

onMounted(async () => {
  if (props.shiki && supported.value) {
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