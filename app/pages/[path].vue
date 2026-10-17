<template>
  <NuxtLayout
    name="page"
    :title="page?.title"
  >
    <ContentRenderer
      v-if="page"
      class="typography -mt-10"
      :value="page"
    />
  </NuxtLayout>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false });

const path = useRoute().params.path as string;

const { data: page } = await useAsyncData(`page-${path}`, () => {
  return queryCollection('pages')
    .path(`/pages/${path}`)
    .first();
});

if (!page.value) {
  throw createError({
    status: 404,
    statusText: 'Page Not Found',
    message: `Page not found: /${path}`,
  });
}

const { url } = useSiteConfig();

defineOgImage('Page.takumi', {
  title: () => page.value?.title,
  subtitle: () => page.value?.description,
  author: 'Alessandro Jean',
  avatar: url + '/img/avatar-okabe-small.webp',
  role: url,
});

useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description,
  ogTitle: () => page.value?.title,
  ogDescription: () => page.value?.description,
  ogType: 'profile',
  ogLocale: 'pt-BR',
  twitterCard: 'summary_large_image',
  twitterTitle: () => page.value?.title,
  twitterDescription: () => page.value?.description,
  profileFirstName: 'Alessandro',
  profileLastName: 'Jean',
  profileUsername: 'alessandrojean',
});
</script>
