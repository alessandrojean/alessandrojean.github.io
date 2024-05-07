<script setup lang="ts">
import slugify from 'slugify';

import type { NotionBlockProps } from '@/composables/useNotionParser';
import type { NotionApi } from '@/lib/notion';

type HeadingBlock = NotionApi.Heading1BlockObjectResponse
  | NotionApi.Heading2BlockObjectResponse
  | NotionApi.Heading3BlockObjectResponse

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block, type, pass, richText, getTextContent } = useNotionParser<HeadingBlock>(toRefs(props))

const id = computed(() => {
  return slugify(getTextContent(richText.value), {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    locale: 'pt'
  })
})

const link = computed(() => `#${id.value}`)

const tagMap: Record<typeof type.value, string> = {
  heading_1: 'h1',
  heading_2: 'h2',
  heading_3: 'h3',
}
</script>

<template>
  <component
    :is="tagMap[type]"
    :id="id"
    class="notion-header font-display-safe group w-fit scroll-mt-28"
  >
    <NuxtLink
      v-if="headerAnchor"
      :to="{ hash: link }"
      :external="false"
      aria-hidden="true"
      :class="[
        'not-prose relative opacity-0 md:group-hover:opacity-100 text',
        `motion-safe:transition duration-75 before:content-['#'] before:font-medium`,
        'before:px-3 before:absolute before:right-0 before:inset-y-0 before:text-center',
        'before:text-gray-400 dark:before:text-gray-500 before:leading-tight',
        'hover:before:text-gray-600 dark:hover:before:text-gray-400'
      ]"
    />
    <BlockTextRenderer
      :text="richText"
      v-bind="pass"
    />
  </component>
</template>
