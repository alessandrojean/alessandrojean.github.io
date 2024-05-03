<script setup lang="ts">
const { finalizePendingLocaleChange } = useI18n({ useScope: 'global' })

async function onBeforeEnter() {
  await finalizePendingLocaleChange()
}
</script>

<template>
  <NuxtLayout>
    <NuxtPage :transition="{ name: 'page', onBeforeEnter, mode: 'out-in' }" />
  </NuxtLayout>
</template>

<style lang="postcss">
.page-enter-active,
.page-leave-active {
  @apply motion-safe:transition-opacity motion-safe:duration-[400ms];
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
