<template>
  <a
    v-if="mentionLink"
    :href="mentionLink.href"
    target="_blank"
    data-slot="inline-mention"
  >
    <component :is="mentionLink.icon" />
    <span class="leading-none">{{ mentionLink.text }}</span>
  </a>
  <NuxtLink
    v-else-if="decorator === 'link'"
    data-slot="inline-link"
    :target="target"
    :external="!isInnerLink"
    :to="isInnerLink ? `/post/${props.idMap[props.text.href!.substring(1)]}` : props.text.href!"
  >
    <BlockDecorator
      :text="props.text"
      :decorators="unnapliedDecorators"
      :id-map
    />
  </NuxtLink>
  <mark
    v-if="decorator === 'color'"
    data-slot="inline-color"
    :data-color="(decoratorValue as string).replace('_', '-')"
  >
    <BlockDecorator
      :text="props.text"
      :decorators="unnapliedDecorators"
      :id-map
    />
  </mark>
  <code
    v-else-if="decorator === 'code'"
    data-slot="inline-code"
  >
    <BlockDecorator
      :text="props.text"
      :decorators="unnapliedDecorators"
      :id-map
    />
  </code>
  <strong
    v-else-if="decorator === 'bold'"
    data-slot="inline-bold"
  >
    <BlockDecorator
      :text="props.text"
      :decorators="unnapliedDecorators"
      :id-map
    />
  </strong>
  <em
    v-else-if="decorator === 'italic'"
    data-slot="inline-italic"
  >
    <BlockDecorator
      :text="props.text"
      :decorators="unnapliedDecorators"
      :id-map
    />
  </em>
  <span
    v-else-if="decorator === 'equation'"
    data-slot="inline-equation"
    v-html="equation"
  />
  <RenderedText v-else-if="decorators.length === 0" />
</template>

<script lang="ts" setup>
import type { RichTextItemResponse } from '@notionhq/client';
import katex from 'katex';

import { Icon } from '#components';

type Annotation = keyof RichTextItemResponse['annotations'];
type Decorator = Annotation | 'link' | 'equation';

const props = defineProps<{
  text: RichTextItemResponse;
  decorators?: Decorator[];
  idMap: Record<string, string>;
}>();

const decorators = computed(() => {
  if (props.decorators) {
    return props.decorators;
  }

  const toApply = Object.entries(props.text.annotations)
    .filter(([_, value]) => value && value !== 'default')
    .map(([key]) => key as Decorator);

  if (props.text.type === 'equation') {
    toApply.unshift('equation');
  }

  if (props.text.href) {
    toApply.unshift('link');
  }

  return toApply;
});

const decorator = computed(() => decorators.value[0]);
const decoratorValue = computed(() => props.text.annotations[decorator.value as Annotation]);

const unnapliedDecorators = computed(() => {
  const [_, ...unnaplied] = decorators.value;
  return unnaplied ?? [];
});

const text = computed(() => props.text.plain_text);

const interleave = <T, O>(arr: T[], x: O) => arr.flatMap(e => [e, x]).slice(0, -1);
const RenderedText = () => interleave(text.value.split('\n'), h('br'));

const isInnerLink = computed(() => props.text.href?.[0] === '/');
const target = computed(() => isInnerLink.value ? '' : '_blank');

const { socialMedia: { gitHub } } = useAppConfig();
const IconGitHub = h(Icon, { name: 'simple-icons:github' });

const mentionLink = computed(() => {
  if (props.text.type !== 'mention' || props.text.mention.type !== 'link_preview') {
    return null;
  }

  const linkUrl = props.text.mention.link_preview.url;
  const linkUrlParsed = new URL(linkUrl);

  if (linkUrlParsed.host === 'github.com') {
    const [user, repo] = linkUrlParsed.pathname.substring(1).split('/');

    return {
      icon: IconGitHub,
      text: user === gitHub ? repo : `${user}/${repo}`,
      href: linkUrl,
    };
  }

  return null;
});

const equation = computed(() => {
  return decorator.value === 'equation'
    ? katex.renderToString(text.value)
    : undefined;
});
</script>
