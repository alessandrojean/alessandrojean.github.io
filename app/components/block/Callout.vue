<template>
  <div
    class="py-4 px-5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl flex gap-4 data-[color=red-background]:bg-red-100 dark:data-[color=red-background]:bg-red-950/60 data-[color=red-background]:text-red-950 dark:data-[color=red-background]:text-red-100 data-[color=red-background]:border-red-200 dark:data-[color=red-background]:border-red-950 data-[color=yellow-background]:bg-amber-100 dark:data-[color=yellow-background]:bg-yellow-400/20 data-[color=yellow-background]:text-amber-950 dark:data-[color=yellow-background]:text-yellow-100 data-[color=yellow-background]:border-yellow-200 dark:data-[color=yellow-background]:border-yellow-500/10 data-[color=blue-background]:bg-sky-100 dark:data-[color=blue-background]:bg-sky-950/70 data-[color=blue-background]:text-sky-900 dark:data-[color=blue-background]:text-sky-100 data-[color=blue-background]:border-sky-200 dark:data-[color=blue-background]:border-sky-950 [&_[data-slot=inline-link]]:!text-current [&_[data-slot=inline-link]]:underline"
    data-slot="callout"
    :data-color="block.callout.color.replace('_', '-')"
  >
    <div
      v-if="block.callout.icon"
      class="shrink-0"
    >
      <div
        v-if="block.callout.icon.type === 'emoji'"
        aria-hidden="true"
        class="font-emoji text-base sm:text-lg"
      >
        {{ block.callout.icon.emoji }}
      </div>
      <img
        v-else-if="block.callout.icon.type === 'external'"
        class="size-5"
        :src="block.callout.icon.external.url"
      >
    </div>
    <div class="typography gap-4 text-base/relaxed sm:text-lg/relaxed font-sans">
      <p>
        <BlockTextRenderer
          :rich-text="block.callout.rich_text"
          :id-map
        />
      </p>
      <BlockRenderer
        v-if="block.children?.length"
        :blocks="block.children"
        :id-map
        no-container
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CalloutBlockObjectResponse } from '@notionhq/client';

type CalloutBlock = WithChildren<CalloutBlockObjectResponse>;

const { block, idMap } = defineProps<{
  block: CalloutBlock;
  idMap: Record<string, string>;
}>();
</script>
