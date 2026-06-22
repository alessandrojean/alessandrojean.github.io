import type { AppConfig } from 'nuxt/schema';

interface SiteObject {
  name: string;
  icon: string;
  url: (user: string) => string;
}

type Site = keyof AppConfig['socialMedia'];

export const socialMedias: Record<Site, SiteObject> = {
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
