// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  target: 'static',
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    // TODO: Remove when Vue add support to type imports.
    'vite-plugin-vue-type-imports/nuxt',
    './modules/media-extractor'
  ],
  colorMode: { classSuffix: '' },
  tailwindcss: { viewer: false },
  watch: ['./tailwind.config.js'],
  runtimeConfig: {
    notionApiKey: '',
    notionPostsTable: '',
    notionProjectsTable: '',
    notionAboutPage: ''
  }
})
