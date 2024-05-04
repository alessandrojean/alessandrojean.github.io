<script setup lang="ts">
import { IconGitHub } from '#components';
import type { NotionBlockProps } from '@/composables/useNotionParser';
import type { NotionApi } from '@/lib/notion';

type Annotation = keyof NotionApi.TextRichTextItemResponse['annotations']
type Decorator = Annotation | 'link' | 'equation'
type Color = Exclude<NotionApi.TextRichTextItemResponse['annotations']['color'], 'default'>

interface Props extends NotionBlockProps {
  content: NotionApi.TextRichTextItemResponse | NotionApi.RichTextItemResponse
  decorators?: Decorator[];
  size?: 'small' | 'normal';
}

const props = withDefaults(defineProps<Props>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank',
  size: 'normal',
})

const { size, content } = toRefs(props)
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
const decoratorValue = computed(() => props.content.annotations[decorator.value as Annotation])

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

  const classes: { [key in Color]?: string } = {
    yellow_background: 'bg-yellow-100 text-yellow-900',
    blue_background: 'bg-primary-100 text-primary-900'
  }

  return [common, classes[decoratorValue.value as Color]]
})

function escapeCharacters(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const { socialMedia: { gitHub } } = useAppConfig()

const mentionLink = computed(() => {
  if (content.value.type !== 'mention' || content.value.mention.type !== 'link_preview') {
    return null
  }

  const linkUrl = content.value.mention.link_preview.url
  const linkUrlParsed = new URL(linkUrl)

  if (linkUrlParsed.host === 'github.com') {
    const [user, repo] = linkUrlParsed.pathname.substring(1).split('/')

    return {
      icon: IconGitHub,
      text: user === gitHub ? repo : `${user}/${repo}`,
      href: linkUrl,
    }
  }
})

const interleave = <T, O>(arr: T[], x: O) => arr.flatMap(e => [e, x]).slice(0, -1)
const renderedText = () => interleave(escapeCharacters(text.value).split('\n'), h('br'))
</script>

<template>
  <a
    v-if="mentionLink"
    :href="mentionLink.href"
    target="_blank"
    class="inline-flex items-baseline gap-2"
  >
    <component :is="mentionLink.icon" class="size-3.5 self-center text-[--tw-prose-body] fill-current" />
    <span class="leading-none">{{ mentionLink.text }}</span>
  </a>
  <NuxtLink
    v-else-if="decorator === 'link'"
    class="notion-link"
    :target="target"
    :external="!isInnerLink"
    :to="isInnerLink ? (mapPageUrl!!(content.href!!.slice(1)) ?? '#') : content.href!!"
  >
    <BlockDecorator
      :content="content"
      :decorators="unappliedDecorators"
      :size="size"
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
      :size="size"
      v-bind="pass"
    />
  </span>
  <code v-else-if="decorator === 'code'" class="notion-inline-code">
    <BlockDecorator
      :content="content"
      :decorators="unappliedDecorators"
      :size="size"
      v-bind="pass"
    />
  </code>
  <strong v-else-if="decorator === 'bold'">
    <BlockDecorator
      :content="content"
      :decorators="unappliedDecorators"
      :size="size"
      v-bind="pass"
    />
  </strong>
  <em v-else-if="decorator === 'italic'">
    <BlockDecorator
      :content="content"
      :decorators="unappliedDecorators"
      :size="size"
      v-bind="pass"
    />
  </em>
  <s v-else-if="decorator === 'strikethrough'">
    <BlockDecorator
      :content="content"
      :decorators="unappliedDecorators"
      :size="size"
      v-bind="pass"
    />
  </s>
  <span v-else-if="decorator === 'underline'" class="underline">
    <BlockDecorator
      :content="content"
      :decorators="unappliedDecorators"
      :size="size"
      v-bind="pass"
    />
  </span>
  <code v-else-if="decorator === 'equation'">
    <BlockDecorator
      :content="content"
      :decorators="unappliedDecorators"s
      :size="size"
      v-bind="pass"
    />
  </code>
  <rendered-text v-else-if="decorators.length === 0" />
  <!-- <span
    v-else-if="decorators.length === 0 && hasEmojiInText"
    v-html="replaceEmojis(text)"
  />
  <span
    v-else-if="decorators.length === 0 && hasLineBreaks"
    v-html="replaceLineBreaks(text)"
  />
  <template v-else-if="decorators.length === 0">
    {{ text }}
  </template> -->
</template>
