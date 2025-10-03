import tailwindcss from '@tailwindcss/vite';

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
  ],

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

  // nitro: {
  //   prerender: {
  //     crawlLinks: true,
  //     routes: ['/blog/feed.xml', '/blog/feed.json'],
  //   }
  // }
})
