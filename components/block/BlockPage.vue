<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { title, pass, properties, value } = useNotionParser(props)

const formatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'long'
})

const date = computed(() => {
  const iso = Object.values(properties.value)
    .find((p) => p?.[0]?.[0] === '‣' && p?.[0]?.[1]?.[0]?.[0] === 'd')
    ?.[0]?.[1]?.[0]?.[1]?.start_date

  const updated = new Date(value.value.last_edited_time)

  return {
    iso,
    formatted: iso ? formatter.format(new Date(iso)) : null,
    updatedIso: updated.toISOString(),
    updatedFormatted: formatter.format(updated)
  }
})
</script>

<template>
  <article v-if="level === 0 && fullPage" class="notion max-w-2xl mx-auto">
    <div class="flex flex-col">
      <h1 class="notion-title mt-6 text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-100 sm:text-5xl motion-safe:transition">
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
    <div class="mt-12 prose dark:prose-invert motion-safe:transition max-w-none prose-a:text-primary-600 dark:prose-a:text-primary-500 hover:prose-a:text-primary-700 dark:hover:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline hover:prose-a:underline-offset-2 hover:prose-a:decoration-2 hover:prose-a:decoration-primary-500/80 dark:hover:prose-a:decoration-primary-400/80 dark:[&_pre>code]:bg-inherit">
      <slot />
    </div>
  </article>
  <article v-else-if="level === 0" class="notion prose dark:prose-invert motion-safe:transition mx-auto max-w-2xl prose-a:text-primary-600 dark:prose-a:text-primary-500 hover:prose-a:text-primary-700 dark:hover:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline hover:prose-a:underline-offset-2 hover:prose-a:decoration-2 hover:prose-a:decoration-primary-500/80 dark:hover:prose-a:decoration-primary-400/80 dark:[&_pre>code]:bg-inherit">
    <slot />
  </article>
</template>