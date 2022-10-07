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
      notionTableId: process.env.NUXT_PUBLIC_NOTION_TABLE_ID
    }
  },
  watch: ['./tailwind.config.js']
})
