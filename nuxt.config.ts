// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  site: { url: 'https://alessandrojean.github.io' },
  ssr: true,
  srcDir: 'src/',
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    'nuxt-og-image',
    './src/modules/media-extractor',
  ],
  colorMode: { classSuffix: '' },
  tailwindcss: { viewer: false },
  i18n: {
    baseUrl: 'https://alessandrojean.github.io',
    locales: [
      { code: 'en', iso: 'en-US', file: 'en-US.yaml' },
      { code: 'pt', iso: 'pt-BR', file: 'pt-BR.yaml' }
    ],
    detectBrowserLanguage: {
      alwaysRedirect: true,
      useCookie: false
    },
    lazy: true,
    langDir: 'lang/',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    skipSettingLocaleOnNavigate: true
  },
  ogImage: {
    fonts: [
      'Inter:400',
      'Inter:500',
      'Inter:700',
    ]
  },
  watch: ['./tailwind.config.js'],
  runtimeConfig: {
    notionApiKey: '',
    notionPostsTable: '',
    notionProjectsTable: '',
    notionAboutPage: '',
    notionEnglishAboutPage: '',
  },
  nitro: {
    prerender: {
      crawlLinks: true,
    }
  },
})
