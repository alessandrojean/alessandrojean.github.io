<template>
  <p>
    <span class="font-mono text-gray-400 dark:text-gray-500">&gt;&nbsp;</span>
    <NuxtLink
      to="https://notbyai.fyi"
      external
      target="_blank"
      rel="noopener noreferrer external"
      class="underline underline-offset-4 decoration-gray-200 dark:decoration-gray-800 hover:decoration-gray-400 dark:hover:decoration-gray-700 text-gray-500 hover:text-gray-800 dark:hover:text-gray-400 transition-colors"
    >
      <span v-if="language === 'pt-BR'">Escrito por um humano, não por IA</span>
      <span v-else>Written by humans, not by AI</span>
    </NuxtLink>
  </p>
</template>

<script setup lang="ts">
const language = inject<Ref<string>>('language');
</script>
