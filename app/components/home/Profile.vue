<template>
  <div class="flex gap-4 items-center">
    <img
      src="/img/avatar-okabe-small.webp"
      alt="Avatar"
      class="shrink-0 size-20 rounded-3xl border border-black/10 shadow-xs"
    >
    <div>
      <p class="text-lg font-medium">Alessandro Jean</p>
      <p class="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm font-medium">
        <Icon name="lucide:map-pin-house" class="size-4 me-1" />
        São Paulo
        <span class="text-gray-400 dark:text-gray-500">/</span>
        Brazil
      </p>
      <p class="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm font-medium">
        <Icon name="lucide:graduation-cap" class="size-4 me-1" />
        B.Sc. in Computer Science
        <Icon name="lucide:at-sign" class="hidden sm:block text-gray-500 size-3.5" />
        <NuxtLink external to="https://ufabc.edu.br" target="_blank" class="hidden sm:block hover:underline">
          UFABC
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>
