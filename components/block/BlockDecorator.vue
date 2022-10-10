<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'

interface Props extends NotionBlockProps {
  content: any[]
}

const props = withDefaults(defineProps<Props>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { pass, type } = useNotionParser(props)

const text = computed(() => props.content?.[0])
const isPageLink = computed(() => text.value === '‣')
const decorators = computed(() => props.content?.[1] || [])
const decoratorKey = computed(() => decorators.value?.[0]?.[0])
const decoratorValue = computed(() => decorators.value?.[0]?.[1])
const pageLinkTitle = computed(() => (
  props.blockMap?.[decoratorValue.value]?.value?.properties
    ?.title?.[0]?.[0] || 'link'
))
const isInlinePageLink = computed(() => decoratorValue.value?.[0] === '/')
const target = computed(() => {
  return (type.value === 'page' || isPageLink.value || isInlinePageLink.value)
     ? props.pageLinkTarget
     : props.textLinkTarget
})
const unappliedDecorators = computed(() => {
  const clonedDecorators = JSON.parse(
    JSON.stringify(decorators.value || [])
  )
  clonedDecorators.shift()

  return clonedDecorators
})
const nextContent = computed(() => [text.value, unappliedDecorators.value])

const highlight = computed(() => {
  const common = 'px-1.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-100'

  const classes: Record<string, string> = {
    yellow_background: 'bg-yellow-100 text-yellow-900'
  }

  return [common, classes[decoratorValue.value]]
})

const { replaceEmoji } = useEmoji()

function replaceEmojis(text: string) {
  const escapedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return replaceEmoji(escapedText)
}
</script>

<template>
  <NuxtLink
    v-if="isPageLink"
    class="notion-link"
    :target="pageLinkTarget"
    :to="mapPageUrl(decoratorValue)"
  >
    {{ pageLinkTitle }}
  </NuxtLink>
  <NuxtLink
    v-else-if="decoratorKey === 'a' && isInlinePageLink"
    class="notion-link"
    :target="target"
    :to="mapPageUrl(decoratorValue.slice(1))"
  >
    <BlockDecorator :content="nextContent" v-bind="pass" />
  </NuxtLink>
  <a
    v-else-if="decoratorKey === 'a'"
    class="notion-link"
    :target="target"
    :href="decoratorValue"
  >
    <BlockDecorator :content="nextContent" v-bind="pass" />
  </a>
  <span
    v-else-if="decorators.length === 0"
    v-html="replaceEmojis(text)"
  />
  <span
    v-else-if="decoratorKey === 'h'"
    :class="['notion-' + decoratorValue, ...highlight]"
  >
    <BlockDecorator :content="nextContent" v-bind="pass" />
  </span>
  <code v-else-if="decoratorKey === 'c'" class="notion-inline-code">
    <BlockDecorator :content="nextContent" v-bind="pass" />
  </code>
  <strong v-else-if="decoratorKey === 'b'">
    <BlockDecorator :content="nextContent" v-bind="pass" />
  </strong>
  <em v-else-if="decoratorKey === 'i'">
    <BlockDecorator :content="nextContent" v-bind="pass" />
  </em>
  <s v-else-if="decoratorKey === 's'">
    <BlockDecorator :content="nextContent" v-bind="pass" />
  </s>
  <code v-else-if="decoratorKey === 'e'">
    {{ decoratorValue }}
  </code>
</template>