<template>
  <NuxtLink
    to="https://notbyai.fyi"
    external
    target="_blank"
    class="w-fit"
  >
    <img
      v-if="language === 'pt-BR'"
      src="/badge-not-by-ai-pt-br.svg"
      alt="Escrito por um humano, não por IA"
    >
    <img
      v-else
      src="/badge-not-by-ai-en-us.svg"
      alt="Written by humans, not by AI"
    >
  </NuxtLink>
</template>

<script setup lang="ts">
const language = inject<Ref<string>>('language');
</script>
