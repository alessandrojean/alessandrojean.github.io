import tailwindcss from '@tailwindcss/vite';
import { definePerson } from 'nuxt-schema-org/schema';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/scripts',
    '@nuxt/image',
    '@nuxtjs/robots',
    'nuxt-schema-org',
  ],

  site: {
    name: 'Alessandro Jean',
    url: 'https://alessandrojean.github.io',
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    notion: {
      apiKey: '',
      postsDataSourceId: '',
      moviesDataSourceId: '',
    }
  },

  vite: {
    plugins: [
      tailwindcss(),
    ]
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

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/blog/feed.xml',
        '/blog/feed.json',
        '/movies/feed.xml',
        '/movies/feed.json',
      ],
    }
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
})
