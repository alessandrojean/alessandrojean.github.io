<script setup lang="ts">
import slugify from 'slugify'
import { LinkIcon } from '@heroicons/vue/20/solid'

import { NotionBlockProps } from '@/composables/useNotionParser'

const route = useRoute()

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { type, title, pass, getTextContent } = useNotionParser(props)

const id = computed(() => {
  return slugify(getTextContent(title.value), {
    lower: true,
    locale: 'pt'
  })
})

const link = computed(() => `#${id.value}`)

const tagMap = {
  header: 'h1',
  sub_header: 'h2',
  sub_sub_header: 'h3',
}
</script>

<template>
  <component
    :is="tagMap[type]"
    :id="id"
    class="notion-h1 relative group w-fit scroll-mt-28"
  >
    <NuxtLink
      :to="{ hash: link }"
      :external="false"
      aria-current-value="page"
      class="peer font-inherit !text-inherit group-hover:decoration-dashed group-hover:underline-offset-[3px]"
    >
      <BlockTextRenderer :text="title" v-bind="pass" />
    </NuxtLink>

    <LinkIcon aria-hidden="true" class="absolute -left-6 top-2 w-4 h-4 text-gray-500 dark:text-gray-400 opacity-0 peer-hover:opacity-100 motion-safe:transition duration-75" />
  </component>
</template>