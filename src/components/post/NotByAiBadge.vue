<script lang="ts" setup>
const { locale, t } = useI18n({ useScope: 'global' })

const alt = computed(() => t('posts.notByAi'))
</script>

<template>
  <a :title="alt" class="not-prose w-fit mt-10 block" href="https://notbyai.fyi/" target="_blank" rel="noopener noreferer">
    <template v-if="locale === 'en'">
      <img :alt="alt" src="/img/not-by-ai-en-white.svg" class="h-[42px] dark:hidden">
      <img :alt="alt" src="/img/not-by-ai-en-black.svg" class="h-[42px] hidden dark:block">
    </template>
    <template v-else>
      <img :alt="alt" src="/img/not-by-ai-pt-white.svg" class="h-[42px] dark:hidden">
      <img :alt="alt" src="/img/not-by-ai-pt-black.svg" class="h-[42px] hidden dark:block">
    </template>
  </a>
</template>
