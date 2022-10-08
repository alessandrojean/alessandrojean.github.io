// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  target: 'static',
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    // TODO: Remove when Vue add support to type imports.
    'vite-plugin-vue-type-imports/nuxt'
  ],
  colorMode: {
    classSuffix: ''
  },
  runtimeConfig: {
    public: {
      notionTableId: '25f6b352fc5c4863b9214c7442c7f1b8'
    }
  },
  watch: ['./tailwind.config.js']
})
