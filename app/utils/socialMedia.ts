import type { AppConfig } from 'nuxt/schema';

interface SiteObject {
  name: string;
  icon: string;
  domains: string[];
  url: (user: string) => string;
}

type Site = keyof AppConfig['socialMedia'];

export const socialMedias: Record<Site, SiteObject> = {
  instagram: {
    name: 'Instagram',
    icon: 'simple-icons:instagram',
    domains: ['instagram.com'],
    url: user => `https://instagram.com/${user}`,
  },
  letterboxd: {
    name: 'Letterboxd',
    icon: 'simple-icons:letterboxd',
    domains: ['letterboxd.com'],
    url: user => `https://letterboxd.com/${user}`,
  },
  trakt: {
    name: 'Trakt',
    icon: 'simple-icons:trakt',
    domains: ['trakt.tv', 'app.trakt.tv'],
    url: user => `https://trakt.tv/users/${user}`,
  },
  gitHub: {
    name: 'GitHub',
    icon: 'simple-icons:github',
    domains: ['github.com'],
    url: user => `https://github.com/${user}`,
  },
  linkedin: {
    name: 'LinkedIn',
    icon: 'simple-icons:linkedin',
    domains: ['linkedin.com'],
    url: user => `https://www.linkedin.com/in/${user}`,
  },
  mastodon: {
    name: 'Mastodon',
    icon: 'simple-icons:mastodon',
    domains: [],
    url: (fullUser) => {
      const [user, instance] = fullUser.split('@');
      return `https://${instance}/@${user}`;
    },
  },
  threads: {
    name: 'Threads',
    icon: 'simple-icons:threads',
    domains: ['threads.net', 'threads.com'],
    url: user => `https://threads.com/@${user}`,
  },
  myAnimeList: {
    name: 'MyAnimeList',
    icon: 'simple-icons:myanimelist',
    domains: ['myanimelist.net'],
    url: user => `https://myanimelist.net/profile/${user}`,
  },
  linktree: {
    name: 'Linktree',
    icon: 'simple-icons:linktree',
    domains: ['linktr.ee'],
    url: user => `https://linktr.ee/${user}`,
  },
  bluesky: {
    name: 'Bluesky',
    icon: 'simple-icons:bluesky',
    domains: ['bsky.app'],
    url: user => `https://bsky.app/profile/${user}`,
  },
  skoob: {
    name: 'Skoob',
    icon: 'custom:skoob',
    domains: ['skoob.com.br'],
    url: user => `https://skoob.com.br/pt/profile/${user}`,
  },
  twitter: {
    name: 'Twitter',
    icon: 'simple-icons:twitter',
    domains: ['twitter.com', 'x.com'],
    url: user => `https://x.com/${user}`,
  },
};
