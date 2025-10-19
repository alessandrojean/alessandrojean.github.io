<template>
  <blockquote data-slot="quote">
    <p>
      <BlockTextRenderer
        :rich-text="block.quote.rich_text"
        :id-map
      />
    </p>

    <BlockRenderer
      v-if="children?.length"
      :blocks="children"
      :id-map
    />

    <cite
      v-if="cite"
      data-slot="quote-cite"
    >
      <BlockTextRenderer
        :rich-text="cite.paragraph.rich_text"
        :id-map
      />
    </cite>
  </blockquote>
</template>

<script lang="ts" setup>
import type { QuoteBlockObjectResponse } from '@notionhq/client';

import type { WithChildren } from '~~/shared/types/notion';

type QuoteBlock = WithChildren<QuoteBlockObjectResponse>;

const { block, idMap } = defineProps<{
  block: QuoteBlock;
  idMap: Record<string, string>;
}>();

const children = computed(() => {
  return block.children?.filter((c) => {
    return c.type !== 'paragraph' || getTextContent(c.paragraph.rich_text)[0] !== '—';
  });
});

const cite = computed(() => {
  const lastIdx = block.children?.length ?? 0;
  const lastBlock = block.children?.[lastIdx - 1];

  const isCite = lastBlock?.type === 'paragraph'
    && getTextContent(lastBlock.paragraph.rich_text)[0] === '—';

  return isCite ? lastBlock : null;
});
</script>
