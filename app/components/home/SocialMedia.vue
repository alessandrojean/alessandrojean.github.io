<template>
  <div class="flex flex-wrap w-full justify-center gap-0.5">
    <UiLinkButton
      v-for="site in sitesToShow"
      :key="site"
      :to="sites[site].url(socialMedia[site])"
      :title="sites[site].name"
      target="_blank"
      external
    >
      <Icon
        :name="sites[site].icon"
        class="size-5"
      />
      <span class="sr-only">{{ sites[site].name }}</span>
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
const { socialMedia } = useAppConfig();

type Site = keyof typeof socialMedia;
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

interface SiteObject {
  name: string;
  icon: string;
  url: (user: string) => string;
}

const sites: Record<Site, SiteObject> = {
  instagram: {
    name: 'Instagram',
    icon: 'simple-icons:instagram',
    url: user => `https://instagram.com/${user}`,
  },
  letterboxd: {
    name: 'Letterboxd',
    icon: 'simple-icons:letterboxd',
    url: user => `https://letterboxd.com/${user}`,
  },
  trakt: {
    name: 'Trakt',
    icon: 'simple-icons:trakt',
    url: user => `https://trakt.tv/users/${user}`,
  },
  gitHub: {
    name: 'GitHub',
    icon: 'simple-icons:github',
    url: user => `https://github.com/${user}`,
  },
  linkedin: {
    name: 'LinkedIn',
    icon: 'simple-icons:linkedin',
    url: user => `https://www.linkedin.com/in/${user}`,
  },
  mastodon: {
    name: 'Mastodon',
    icon: 'simple-icons:mastodon',
    url: (fullUser) => {
      const [user, instance] = fullUser.split('@');
      return `https://${instance}/@${user}`;
    },
  },
  threads: {
    name: 'Threads',
    icon: 'simple-icons:threads',
    url: user => `https://threads.net/@${user}`,
  },
  myAnimeList: {
    name: 'MyAnimeList',
    icon: 'simple-icons:myanimelist',
    url: user => `https://myanimelist.net/profile/${user}`,
  },
  linktree: {
    name: 'Linktree',
    icon: 'simple-icons:linktree',
    url: user => `https://linktr.ee/${user}`,
  },
  bluesky: {
    name: 'Bluesky',
    icon: 'simple-icons:bluesky',
    url: user => `https://bsky.app/profile/${user}`,
  },
  skoob: {
    name: 'Skoob',
    icon: 'custom:skoob',
    url: user => `https://skoob.com.br/pt/profile/${user}`,
  },
};
</script>
