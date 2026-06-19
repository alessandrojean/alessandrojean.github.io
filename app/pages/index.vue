<template>
  <div class="flex flex-col items-start justify-center h-screen w-fit max-w-sm mx-auto gap-4">
    <HomeProfile />
    <HomeSocialMedia />
  </div>
</template>

<script lang="ts" setup>
const { url } = useSiteConfig();

useSeoMeta({
  title: 'Alessandro Jean',
  description: 'Developer and open-source enthusiast.',
  ogTitle: 'Alessandro Jean',
  ogDescription: 'Developer and open-source enthusiast.',
  twitterTitle: 'Alessandro Jean',
  twitterDescription: 'Developer and open-source enthusiast.',
});

defineOgImage('Home.takumi');
</script>
