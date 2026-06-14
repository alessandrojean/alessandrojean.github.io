<template>
  <ol
    v-if="toc?.length"
    data-slot="table-of-contents"
  >
    <template
      v-for="header in toc"
      :key="header.id"
    >
      <li v-if="header.id !== 'conteúdo'">
        <NuxtLink
          :to="{ hash: `#${header.id}` }"
          :external="false"
          aria-current-value="page"
        >
          {{ header.text }}
        </NuxtLink>
      </li>
    </template>
  </ol>
</template>

<script setup lang="ts">
import type { TocLink } from '@nuxt/content';

const toc = inject<Ref<TocLink[]>>('toc');
</script>
