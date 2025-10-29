import tailwindcss from '@tailwindcss/vite';
import { definePerson } from 'nuxt-schema-org/schema';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/scripts',
    '@nuxt/image',
    '@nuxt/content',
    '@nuxtjs/robots',
    'nuxt-schema-org',
  ],

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  site: {
    name: 'Alessandro Jean',
    url: 'https://alessandrojean.github.io',
  },

  content: {
    preview: {
      api: 'https://api.nuxt.studio',
      gitInfo: {
        name: 'alessandrojean.github.io',
        owner: 'alessandrojean',
        url: 'https://github.com/alessandrojean/alessandrojean.github.io',
      },
    },
  },

  runtimeConfig: {
    notion: {
      apiKey: '',
      postsDataSourceId: '',
      moviesDataSourceId: '',
    },
  },

  experimental: {
    extractAsyncDataHandlers: true,
  },

  compatibilityDate: '2025-07-15',

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/blog/feed.xml',
        '/blog/feed.json',
        '/movies/feed.xml',
        '/movies/feed.json',
      ],
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  eslint: {
    config: {
      stylistic: {
        semi: true,
        braceStyle: '1tbs',
      },
    },
  },

  fonts: {
    provider: 'fontsource',
    families: [
      { name: 'Crimson Pro', weights: ['200 900'], subsets: ['latin'] },
      { name: 'Source Code Pro', weights: ['200 900'], subsets: ['latin'] },
      { name: 'Source Sans 3', weights: ['200 900'], subsets: ['latin'] },
    ],
  },

  icon: {
    mode: 'svg',
  },

  robots: {
    blockAiBots: true,
  },

  schemaOrg: {
    identity: definePerson({
      name: 'Alessandro Jean',
      image: '/avatar-okabe-small.webp',
      url: 'alessandrojean.github.io',
      gender: 'Male',
      jobTitle: 'Developer',
      sameAs: [
        'https://github.com/alessandrojean',
        'https://instagram.com/alessandrojean',
        'https://threads.net/@alessandrojean',
        'https://www.linkedin.com/in/alessandrojean',
        'https://x.com/alessandrojean_',
        'https://mas.to/@alessandrojean',
        'https://myanimelist.net/profile/alessandrojean',
        'https://trakt.tv/users/alessandrojean',
        'https://linktr.ee/alessandrojean',
        'https://bsky.app/profile/alessandrojean.bsky.social',
        'https://skoob.com.br/share/user/4231289',
      ],
    }),
  },
});
