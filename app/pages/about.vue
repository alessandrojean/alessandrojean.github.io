<template>
  <div class="pb-16">
    <SiteHeader />

    <PageHeader>
      <PageHeaderTitle>About me</PageHeaderTitle>
    </PageHeader>

    <ContentRenderer
      v-if="about"
      class="typography -mt-10"
      :value="about"
    />

    <PostFooter class="mt-12">
      <PostFooterCdPreviousDirectory to="/" />
      <PostFooterCopyright />
    </PostFooter>
  </div>
</template>

<script lang="ts" setup>
const { data: about } = await useAsyncData('about-me', () => {
  return queryCollection('pages')
    .path('/pages/about')
    .first();
});

const { url } = useSiteConfig();

defineOgImage('Page.takumi', {
  title: () => about.value?.title,
  subtitle: () => about.value?.description,
  author: 'Alessandro Jean',
  avatar: url + '/img/avatar-okabe-small.webp',
  role: url,
});

useSeoMeta({
  title: () => about.value?.title,
  description: () => about.value?.description,
  ogTitle: () => about.value?.title,
  ogDescription: () => about.value?.description,
  ogType: 'profile',
  ogLocale: 'pt-BR',
  twitterCard: 'summary_large_image',
  twitterTitle: () => about.value?.title,
  twitterDescription: () => about.value?.description,
  profileFirstName: 'Alessandro',
  profileLastName: 'Jean',
  profileUsername: 'alessandrojean',
});
</script>
