export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$router.options.scrollBehavior = async (to, from) => {
    if (to.path !== from.path && process.client) {
      window.scrollTo({ behavior: 'smooth', left: 0, top: 0 })
    }
  }
})
