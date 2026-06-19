<template>
  <div class="flex flex-col items-start justify-center h-screen w-fit max-w-sm mx-auto gap-4">
    <HomeProfile />
    <HomeSocialMedia />
  </div>
</template>

<script lang="ts" setup>
const { url } = useSiteConfig();

useSchemaOrg([
  defineWebPage({
    potentialAction: [
      {
        '@type': 'ReadAction',
        'name': 'Blog',
        'target': `${url}blog`,
      },
    ],
  }),
]);
</script>
