<script setup lang="ts">
import type { Highlighter } from 'shiki-es'
import type { NotionBlockProps } from '@/composables/useNotionParser'
import type { Language, NotionApi } from '@/lib/notion'

type CodeBlock = NotionApi.CodeBlockObjectResponse | NotionApi.EquationBlockObjectResponse

interface Props extends NotionBlockProps {
  overrideLang?: Language | string;
  overrideLangClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block, getTextContent } = useNotionParser<CodeBlock>(toRefs(props))

// Map the Notion language codes to Shiki ones.
const langMap: Partial<Record<Language, string>> = {
  'c++': 'cpp'
}

const lang = computed(() => {
  const value = props.overrideLang ?? 
    block.value.type === 'equation' ? 'latex' : block.value.code.language

  return langMap[value] ?? value
})

const langClass = computed(() => props.overrideLangClass ?? `language-${lang.value}`)

const highlighter = inject<Highlighter>('highlighter')
const supported = computed(() => {
  return highlighter.getLoadedLanguages().find((l) => l === lang.value)
})

const code = computed(() => {
  return block.value.type === 'equation'
    ? block.value.equation.expression
    : getTextContent(block.value.code.rich_text).replace(/\t/g, '  ')
})

const shikiHtml = computed(() => {
  return props.shiki && supported.value
    ? highlighter.codeToHtml(code.value, { lang: lang.value })
    : ''
})
</script>

<template>
  <div v-if="shiki && supported" v-html="shikiHtml"></div>
  <pre v-else :class="['notion-code', langClass]"><code :class="langClass">{{ code }}</code></pre>
</template>