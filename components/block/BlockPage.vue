<script setup lang="ts">
import formatISO from 'date-fns/formatISO'
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc'

import { BlockPageObject } from '@/lib/notion'
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { pass, properties, block } = useNotionParser<BlockPageObject>(props)

const title = computed(() => {
  return properties.value['Name'].type === 'title'
    ? properties.value['Name'].title : []
})

const formatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'long',
  timeZone: 'America/Sao_Paulo'
})

const date = computed(() => {
  const iso = properties.value['Created at'].type === 'date'
    ? properties.value['Created at']?.date?.start : null
  const updated = new Date(block.value.last_edited_time)

  return {
    iso,
    formatted: iso 
      ? formatter.format(zonedTimeToUtc(iso, 'America/Sao_Paulo'))
      : null,
    updatedIso: formatISO(updated),
    updatedFormatted: formatter.format(updated)
  }
})
</script>

<template>
  <article v-if="level === 0 && fullPage" class="notion max-w-2xl mx-auto">
    <div class="flex flex-col">
      <h1 class="notion-title mt-6 text-4xl sm:!leading-[3.5rem] font-bold tracking-tight text-gray-800 dark:text-gray-100 sm:text-5xl motion-safe:transition">
        <BlockTextRenderer :text="title" v-bind="pass" />
      </h1>

      <time
        v-if="date.iso"
        :datetime="date.iso"
        class="order-first text-gray-500 dark:text-gray-300 motion-safe:transform border-l-2 border-gray-300 dark:border-gray-600 pl-3"
      >
        {{ date.formatted }}
      </time>
    </div>
    <div class="mt-12 prose dark:prose-invert motion-safe:transition max-w-none prose-a:text-primary-600 dark:prose-a:text-primary-400 hover:prose-a:text-primary-700 focus-visible:prose-a:text-primary-700 dark:hover:prose-a:text-primary-400 dark:focus-visible:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline hover:prose-a:underline-offset-2 hover:prose-a:decoration-2 hover:prose-a:decoration-primary-500/80 dark:hover:prose-a:decoration-primary-400/80 dark:[&_pre>code]:bg-inherit focus:prose-a:outline-none focus-visible:prose-a:ring-2 focus-visible:prose-a:ring-offset-2 focus-visible:prose-a:ring-primary-600 dark:focus-visible:prose-a:ring-offset-gray-900 dark:contrast-more:focus-visible:prose-a:ring-offset-black prose-a:rounded prose-a:motion-safe:transition">
      <slot />
    </div>
  </article>
  <article v-else-if="level === 0" class="notion prose dark:prose-invert motion-safe:transition max-w-none prose-a:text-primary-600 dark:prose-a:text-primary-400 hover:prose-a:text-primary-700 focus-visible:prose-a:text-primary-700 dark:hover:prose-a:text-primary-400 dark:focus-visible:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline hover:prose-a:underline-offset-2 hover:prose-a:decoration-2 hover:prose-a:decoration-primary-500/80 dark:hover:prose-a:decoration-primary-400/80 dark:[&_pre>code]:bg-inherit focus:prose-a:outline-none focus-visible:prose-a:ring-2 focus-visible:prose-a:ring-offset-2 focus-visible:prose-a:ring-primary-600 dark:focus-visible:prose-a:ring-offset-gray-900 dark:contrast-more:focus-visible:prose-a:ring-offset-black prose-a:rounded prose-a:motion-safe:transition prose-h1:font-bold">
    <slot />
  </article>
</template>