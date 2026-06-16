import { readFileSync } from 'node:fs';

import tailwindcss from '@tailwindcss/vite';
import { createResolver } from 'nuxt/kit';
import { definePerson } from 'nuxt-schema-org/schema';

const { resolve } = createResolver(import.meta.url);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/content',
    '@nuxtjs/robots',
    'nuxt-schema-org',
  ],

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  vue: {
    compilerOptions: {
      isCustomElement: tag => tag === 'callout' || tag == 'cot',
    },
  },

  site: {
    name: 'Alessandro Jean',
    url: 'https://alessandrojean.github.io',
  },

  content: {
    experimental: { sqliteConnector: 'native' },
    build: {
      markdown: {
        remarkPlugins: {
          'remark-math': {},
          'remark-smartypants': {},
          'remark-toc': {
            options: {
              heading: 'conteúdo',
              maxDepth: 2,
              ordered: true,
            },
          },
        },
        rehypePlugins: {
          'rehype-katex': {},
          'rehype-external-links': {
            options: {
              rel: ['noopener', 'noreferrer'],
              target: '_blank',
            },
          },
        },
        highlight: {
          theme: {
            default: 'github-light-default',
            dark: 'github-dark-default',
          },
          langs: [
            'c',
            'cpp',
            'haskell',
            'console',
            'java',
            'ini',
            'yaml',
            'json',
            'markdown',
            'tsx',
            JSON.parse(readFileSync('./shiki/languages/ass.tmLanguage.json', 'utf-8')),
            JSON.parse(readFileSync('./shiki/languages/cabal.tmLanguage.json', 'utf-8')),
          ],
        },
      },
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
    customCollections: [{
      prefix: 'custom',
      dir: resolve('./app/assets/icons'),
    }],
  },

  image: {
    quality: 95,
    format: ['avif', 'webp'],
    domains: [
      'github.com',
      'images.unsplash.com',
      'image.tmdb.org',
      'i.imgur.com',
      'upload.wikimedia.org',
    ],
    alias: {
      unsplash: 'https://images.unsplash.com',
      github: 'https://github.com',
    },
    ipx: {
      modifiers: {
        format: 'avif',
      },
    },
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
        'https://mas.to/@alessandrojean',
        'https://myanimelist.net/profile/alessandrojean',
        'https://trakt.tv/users/alessandrojean',
        'https://linktr.ee/alessandrojean',
        'https://bsky.app/profile/alessandrojean.bsky.social',
        'https://skoob.com.br/pt/profile/67bd13f570c4abc337a02408',
        'https://letterboxd.com/alessandrojean',
      ],
    }),
  },
});
