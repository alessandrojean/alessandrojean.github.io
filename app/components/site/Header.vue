<template>
  <nav class="flex items-center justify-between pt-10 text-lg">
    <NuxtLink
      class="flex items-center gap-2.5 font-medium shrink-0"
      to="/"
    >
      <NuxtImg
        class="size-5 rounded-full ring-1 ring-black/10"
        src="/img/avatar-okabe-small.webp"
        alt="Avatar pessoal"
        width="32"
        height="32"
        format="avif"
      />
      <span class="sr-only sm:not-sr-only">Alessandro Jean</span>
    </NuxtLink>

    <div class="flex items-center gap-6 text-gray-500 dark:text-gray-400 *:hover:text-black dark:*:hover:text-gray-200 *:data-[site=bluesky]:hidden sm:*:data-[site=bluesky]:block">
      <NuxtLink
        class="hidden sm:block"
        to="/about"
      >
        About
      </NuxtLink>

      <NuxtLink
        class="hidden sm:block"
        to="/blog"
      >
        Blog
      </NuxtLink>

      <NuxtLink
        class="sm:hidden"
        to="/about"
        title="About"
      >
        <Icon
          name="lucide:info"
          class="size-4.5"
        />
        <span class="sr-only">About</span>
      </NuxtLink>

      <NuxtLink
        class="sm:hidden"
        to="/blog"
        title="Blog"
      >
        <Icon
          name="lucide:notebook-text"
          class="size-4.5"
        />
        <span class="sr-only">Blog</span>
      </NuxtLink>

      <NuxtLink
        v-for="site in sitesToShow"
        :key="site"
        :href="socialMedias[site].url(socialMedia[site])"
        external
        target="_blank"
        :title="socialMedias[site].name"
        :data-site="site"
      >
        <Icon
          :name="socialMedias[site].icon"
          class="size-4"
        />
        <span class="sr-only">{{ socialMedias[site].name }}</span>
      </NuxtLink>

      <NuxtLink
        href="/blog/feed.xml"
        external
        target="_blank"
        title="RSS"
      >
        <Icon
          name="lucide:rss"
          class="size-4.5"
        />
        <span class="sr-only">RSS</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import type { AppConfig } from 'nuxt/schema';

const { socialMedia } = useAppConfig();

type Site = keyof AppConfig['socialMedia'];

const sitesToShow: Site[] = [
  'instagram',
  'bluesky',
  'gitHub',
];
</script>
