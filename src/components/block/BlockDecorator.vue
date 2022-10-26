<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'
import { RichTextItemResponse, TextRichTextItemResponse } from '@/lib/notion'

type Decorator = keyof TextRichTextItemResponse['annotations'] | 'link' | 'equation'
type Color = Exclude<TextRichTextItemResponse['annotations']['color'], 'default'>

interface Props extends NotionBlockProps {
  content: TextRichTextItemResponse | RichTextItemResponse
  decorators?: Decorator[];
}

const props = withDefaults(defineProps<Props>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { pass } = useNotionParser(toRefs(props))

const decorators = computed(() => {
  if (props.decorators) {
    return props.decorators
  }

  const toApply = Object.entries(props.content.annotations)
    .filter(([_, value]) => value && value !== 'default')
    .map(([key]) => key as Decorator)

  if (props.content.type === 'equation') {
    toApply.unshift('equation')
  }

  if (props.content.href) {
    toApply.unshift('link')
  }

  return toApply
})

const decorator = computed(() => decorators.value[0])
const decoratorValue = computed(() => props.content.annotations[decorator.value])

const unappliedDecorators = computed(() => {
  const [_, ...unapplied] = decorators.value

  return unapplied ?? []
})

const text = computed(() => props.content?.plain_text)

const isInnerLink = computed(() => props.content.href?.[0] === '/')

const target = computed(() => {
  return isInnerLink.value ? props.pageLinkTarget : props.textLinkTarget
})

const highlight = computed(() => {
  const common = 'px-1.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-100'

  const classes: Partial<Record<Color, string>> = {
    yellow_background: 'bg-yellow-100 text-yellow-900'
  }

  return [common, classes[decoratorValue.value]]
})

const { replaceEmoji, hasEmoji } = useEmoji()

function replaceEmojis(text: string) {
  const escapedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return replaceEmoji(escapedText)
}

const hasEmojiInText = computed(() => hasEmoji(text.value))
</script>

<template>
  <NuxtLink
    v-if="decorator === 'link'"
    class="notion-link"
    :target="target"
    :external="!isInnerLink"
    :to="isInnerLink ? (mapPageUrl(content.href.slice(1)) ?? '#') : content.href"
  >
    <BlockDecorator
      :content="content"
      :decorators="unappliedDecorators"
      v-bind="pass"
    />
  </NuxtLink>
  <span
    v-else-if="decorator === 'color'"
    :class="['notion-' + decoratorValue, ...highlight]"
  >
    <BlockDecorator
      :content="content"
      :decorators="unappliedDecorators"
      v-bind="pass"
    />
  </span>
  <code v-else-if="decorator === 'code'" class="notion-inline-code">
    <BlockDecorator
      :content="content"
      :decorators="unappliedDecorators"
      v-bind="pass"
    />
  </code>
  <strong v-else-if="decorator === 'bold'">
    <BlockDecorator
      :content="content"
      :decorators="unappliedDecorators"
      v-bind="pass"
    />
  </strong>
  <em v-else-if="decorator === 'italic'">
    <BlockDecorator
      :content="content"
      :decorators="unappliedDecorators"
      v-bind="pass"
    />
  </em>
  <s v-else-if="decorator === 'strikethrough'">
    <BlockDecorator
      :content="content"
      :decorators="unappliedDecorators"
      v-bind="pass"
    />
  </s>
  <span v-else-if="decorator === 'underline'" class="underline">
    <BlockDecorator
      :content="content"
      :decorators="unappliedDecorators"
      v-bind="pass"
    />
  </span>
  <code v-else-if="decorator === 'equation'">
    <BlockDecorator
      :content="content"
      :decorators="unappliedDecorators"
      v-bind="pass"
    />
  </code>
  <span
    v-else-if="decorators.length === 0 && hasEmojiInText"
    v-html="replaceEmojis(text)"
  />
  <template v-else-if="decorators.length === 0">
    {{ text }}
  </template>
</template>