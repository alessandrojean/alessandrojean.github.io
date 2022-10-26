import type { RouterOptions } from '@nuxt/schema'

export default <RouterOptions> {
  scrollBehavior: async (to, from, savedPosition) => {
    const nuxtApp = useNuxtApp()

    if (to.path !== from.path && process.client) {
      if (nuxtApp.$i18n) {
        await nuxtApp.$i18n.waitForPendingLocaleChange()
      }
      
      window.scrollTo({
        behavior: 'smooth',
        left: savedPosition?.left ?? 0,
        top: savedPosition?.top ?? 0
      })
    } else if (to.hash && process.client) {
      document.querySelector(to.hash)?.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
