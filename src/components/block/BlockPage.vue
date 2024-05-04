<script setup lang="ts">
import { fromZonedTime } from 'date-fns-tz';
import { formatISO } from 'date-fns/formatISO';

import type { NotionBlockProps } from '@/composables/useNotionParser';
import type { BlockPageObject, PostProperties } from '@/lib/notion';

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { locale } = useI18n({ useScope: 'global' })
const { pass, properties, block } = useNotionParser<BlockPageObject>(toRefs(props))

const postProperties = computed(() => properties.value as any as PostProperties)

const title = computed(() => {
  return postProperties.value['Name'].title
})

const description = computed(() => {
  return postProperties.value['Description'].rich_text
})

const formatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'medium',
  timeZone: 'America/Sao_Paulo'
})

const date = computed(() => {
  const iso = postProperties.value['Created at']?.date?.start
  const updated = new Date(block.value.last_edited_time)
  const updatedIso = formatISO(updated)

  return {
    iso,
    formatted: iso 
      ? formatter.format(fromZonedTime(iso, 'America/Sao_Paulo'))
      : null,
    updatedIso,
    updatedFormatted: formatter.format(updated),
    wasUpdated: iso !== updatedIso.substring(0, 10),
  }
})

const language = computed(() => {
  const postLanguage = postProperties.value['Language']?.select?.name ?? 'pt-BR'
  const postLocale = postLanguage.substring(0, 2)

  return postLocale === locale.value ? undefined : postLanguage
})
</script>

<template>
  <article
    :lang="language"
    class="notion prose dark:prose-invert motion-safe:transition max-w-2xl mx-auto prose-h1:font-bold prose-a:text-primary-600 dark:prose-a:text-primary-400 hover:prose-a:text-primary-700 focus-visible:prose-a:text-primary-700 dark:hover:prose-a:text-primary-400 dark:focus-visible:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline hover:prose-a:underline-offset-2 hover:prose-a:decoration-2 hover:prose-a:decoration-primary-500/80 dark:hover:prose-a:decoration-primary-400/80 dark:[&_pre>code]:bg-inherit focus:prose-a:outline-none focus-visible:prose-a:ring-2 focus-visible:prose-a:ring-offset-2 focus-visible:prose-a:ring-primary-600 dark:focus-visible:prose-a:ring-offset-gray-900 dark:contrast-more:focus-visible:prose-a:ring-offset-black prose-a:rounded prose-a:motion-safe:transition"
  >
    <template v-if="level === 0 && fullPage">
      <div class="flex flex-col">
        <h1 class="notion-title mt-5 mb-0 font-display-safe tracking-tight text-4xl sm:!text-5xl sm:!leading-[3.5rem]">
          <BlockTextRenderer :text="title" v-bind="pass" />
        </h1>
        <p
          v-if="description"
          class="lead text-gray-600 dark:text-gray-400 mt-5"
        >
          <BlockTextRenderer :text="description" v-bind="pass" />
        </p>


        <span
          v-if="date.iso"
          class="not-prose order-first text-gray-500 dark:text-gray-500 motion-safe:transform border-l-2 border-gray-300 dark:border-gray-600 pl-3"
        >
          <time :datetime="date.iso">{{ date.formatted }}</time>
          <template v-if="date.updatedIso && date.wasUpdated">
            —
            <i18n-t
              tag="span"
              keypath="posts.updatedAt"
            >
              <time :datetime="date.updatedIso">
                {{ date.updatedFormatted }}
              </time>
            </i18n-t>
          </template>
        </span>
      </div>
    </template>

    <slot />

    <PostNotByAiBadge v-if="level === 0 && fullPage" />
  </article>
</template>
