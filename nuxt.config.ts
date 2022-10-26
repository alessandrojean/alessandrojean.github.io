// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  target: 'static',
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    // TODO: Remove when Vue add support to type imports.
    'vite-plugin-vue-type-imports/nuxt',
    './modules/media-extractor',
    './modules/og-image'
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
  watch: ['./tailwind.config.js'],
  runtimeConfig: {
    notionApiKey: '',
    notionPostsTable: '',
    notionProjectsTable: '',
    notionAboutPage: '',
    notionEnglishAboutPage: '',
  }
})
