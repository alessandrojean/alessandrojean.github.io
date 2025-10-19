<template>
  <ol
    v-if="headers.length"
    data-slot="table-of-contents"
  >
    <li
      v-for="header in headers"
      :key="header.id"
    >
      <NuxtLink
        :to="{ hash: hash(header) }"
        :external="false"
        aria-current-value="page"
      >
        <BlockTextRenderer
          :rich-text="header.heading_2.rich_text"
          :id-map
        />
      </NuxtLink>
    </li>
  </ol>
</template>

<script lang="ts" setup>
import type { Heading2BlockObjectResponse, TableOfContentsBlockObjectResponse } from '@notionhq/client';
import slugify from 'slugify';

import type { BlockWithChildren } from '~~/shared/types/notion';

const { post, block, idMap } = defineProps<{
  post: BlockWithChildren[];
  block: TableOfContentsBlockObjectResponse;
  idMap: Record<string, string>;
}>();

const headers = computed(() => {
  const selfIndex = post.findIndex(b => b.id === block.id);

  return post
    .slice(selfIndex)
    .filter(b => b.type === 'heading_2');
});

function hash(block: Heading2BlockObjectResponse) {
  const text = getTextContent(block.heading_2.rich_text);

  return '#' + slugify(text, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    locale: 'pt',
  });
}
</script>
