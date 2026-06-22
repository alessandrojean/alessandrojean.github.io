<template>
  <div class="flex flex-wrap w-full justify-center gap-0.5">
    <UiLinkButton
      v-for="site in sitesToShow"
      :key="site"
      :to="socialMedias[site].url(socialMedia[site])"
      :title="socialMedias[site].name"
      target="_blank"
      external
    >
      <Icon
        :name="socialMedias[site].icon"
        class="size-5"
      />
      <span class="sr-only">{{ socialMedias[site].name }}</span>
    </UiLinkButton>

    <UiLinkButton
      to="/blog"
      title="Blog"
    >
      <Icon
        name="lucide:notebook-text"
        class="size-5.5"
      />
      <span class="sr-only">Blog</span>
    </UiLinkButton>
  </div>
</template>

<script lang="ts" setup>
import type { AppConfig } from 'nuxt/schema';

const { socialMedia } = useAppConfig();

type Site = keyof AppConfig['socialMedia'];

const sitesToShow: Site[] = [
  'instagram',
  'bluesky',
  'mastodon',
  'letterboxd',
  'trakt',
  'skoob',
  'gitHub',
  'linkedin',
];
</script>
