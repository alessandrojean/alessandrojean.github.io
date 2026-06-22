<template>
  <div class="flex flex-wrap w-full justify-center gap-0.5">
    <UiLinkButton
      v-for="site in sitesToShow"
      :key="site"
      :to="socialMedias[site].url(socialMedia[site])"
      :aria-label="socialMedias[site].name"
      target="_blank"
      rel="noopener noreferrer external"
      external
    >
      <Icon
        :name="socialMedias[site].icon"
        class="size-5"
      />
    </UiLinkButton>

    <UiLinkButton
      to="/blog"
      aria-label="Blog"
    >
      <Icon
        name="lucide:notebook-text"
        class="size-5.5"
      />
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
  // 'skoob',
  'gitHub',
  'linkedin',
];
</script>
