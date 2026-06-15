<template>
  <div class="flex flex-col items-start justify-center h-screen w-fit max-w-sm mx-auto gap-4">
    <HomeProfile />
    <HomeSocialMedia />
  </div>
</template>

<script lang="ts" setup>
useSchemaOrg([
  defineWebPage({
    potentialAction: [
      { '@type': 'ReadAction', 'name': 'Blog', 'target': 'https://alessandrojean.github.io/blog' },
    ],
  }),
]);
</script>
