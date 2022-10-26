<script setup lang="ts">
import slugify from 'slugify'
import { LinkIcon } from '@heroicons/vue/20/solid'

import { NotionBlockProps } from '@/composables/useNotionParser'
import {
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse
} from '@/lib/notion'

type HeadingBlock = Heading1BlockObjectResponse | Heading2BlockObjectResponse | Heading3BlockObjectResponse

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
    class="notion-header relative group w-fit scroll-mt-28"
  >
    <NuxtLink
      v-if="headerAnchor"
      :to="{ hash: link }"
      :external="false"
      aria-current-value="page"
      class="peer font-inherit !text-inherit group-hover:decoration-dashed group-hover:underline-offset-[3px]"
    >
      <BlockTextRenderer :text="richText" v-bind="pass" />
    </NuxtLink>
    <BlockTextRenderer
      v-else
      :text="richText"
      v-bind="pass"
    />

    <LinkIcon
      v-if="headerAnchor"
      aria-hidden="true"
      class="hidden md:block absolute -left-6 top-2 w-4 h-4 text-gray-500 dark:text-gray-400 opacity-0 peer-hover:opacity-100 motion-safe:transition duration-75"
    />
  </component>
</template>