import type { RouterOptions } from '@nuxt/schema'

export default <RouterOptions> {
  scrollBehavior: (to, from) => {
    if (to.path !== from.path && process.client) {
      window.scrollTo({ behavior: 'smooth', left: 0, top: 0 })
    } else if (to.hash && process.client) {
      document.querySelector(to.hash)?.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
