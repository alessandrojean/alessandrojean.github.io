<template>
  <div class="flex flex-col items-start justify-center h-screen w-full max-w-sm mx-auto gap-4">
    <HomeProfile />
    <HomeSocialMedia />
  </div>
</template>

<script lang="ts" setup>
useSchemaOrg([
  defineWebPage({
    potentialAction: [
      { '@type': 'ReadAction', name: 'Blog', target: 'https://alessandrojean.github.io/blog' },
      { '@type': 'ReadAction', name: 'Movies', target: 'https://alessandrojean.github.io/movies' },
    ],
  }),
]);
</script>
