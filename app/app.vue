<template>
  <main class="container mx-auto max-w-3xl px-4 md:px-0">
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator
      color="#0ea4e9"
      :duration="3000"
    />
    <NuxtPage />
  </main>
</template>

<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'dark:bg-gray-950 dark:text-white scheme-light-dark',
  },
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | Alessandro Jean` : 'Alessandro Jean';
  },
  link: [
    { rel: 'icon', href: '/img/favicon.ico', sizes: 'any' },
    { rel: 'apple-touch-icon', href: '/img/apple-touch-icon.png' },
  ],
  meta: [
    // Site already follows the system theme.
    { name: 'darkreader-lock', content: '' },
  ],
});

useSeoMeta({
  robots: 'noai, noimageai',
});
</script>
